const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
  removeCoupon,
  mergeGuestCart
} = require('../controllers/cartController');

router.get('/', protect, getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.post('/remove', removeFromCart);
router.post('/clear', protect, clearCart);
router.post('/apply-coupon', applyCoupon);
router.post('/remove-coupon', removeCoupon);
router.post('/merge', protect, mergeGuestCart);

module.exports = router;
