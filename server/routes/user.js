const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} = require('../controllers/userController');

router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.get('/wishlist', protect, getWishlist);
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationAsRead);
router.put('/notifications/read-all', protect, markAllNotificationsAsRead);

module.exports = router;
