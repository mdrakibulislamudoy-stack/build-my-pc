const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  blockUser,
  changeUserRole,
  getAllOrders,
  getAllProducts,
  getAllCategories,
  getAllCoupons
} = require('../controllers/adminController');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/block', protect, admin, blockUser);
router.put('/users/:id/role', protect, admin, changeUserRole);
router.get('/orders', protect, admin, getAllOrders);
router.get('/products', protect, admin, getAllProducts);
router.get('/categories', protect, admin, getAllCategories);
router.get('/coupons', protect, admin, getAllCoupons);

module.exports = router;
