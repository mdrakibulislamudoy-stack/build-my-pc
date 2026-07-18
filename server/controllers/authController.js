const crypto = require('crypto');
const User = require('../models/User');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const sendEmail = require('../utils/email');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const user = await User.findOne({ refreshToken });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const token = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      token,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.refreshToken = null;
    await user.save();

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
        phone: user.phone,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with that email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your Build My PC account.</p>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>This link will expire in 30 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        html: message
      });

      res.json({ success: true, message: 'Email sent' });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      message: 'Password reset successful'
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, address, phone, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        address: user.address,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword
};
