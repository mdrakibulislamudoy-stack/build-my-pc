const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');
const {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword
} = require('../controllers/authController');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/refresh-token', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
