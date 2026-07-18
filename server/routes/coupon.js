const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getCoupons,
  getCouponById,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');

router.get('/', protect, admin, getCoupons);
router.get('/validate/:code', protect, validateCoupon);
router.get('/:id', protect, admin, getCouponById);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
