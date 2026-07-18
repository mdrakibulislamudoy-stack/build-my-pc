const User = require('../models/User');
const Product = require('../models/Product');

const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    await user.populate('wishlist');

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    await user.populate('wishlist');

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const Notification = require('../models/Notification');
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    const Notification = require('../models/Notification');
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const Notification = require('../models/Notification');
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
};
