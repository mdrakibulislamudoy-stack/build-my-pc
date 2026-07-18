const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getRelatedProducts,
  getProductsByCategory
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/category/:slug', getProductsByCategory);
router.get('/related/:id', getRelatedProducts);
router.get('/:id', getProductById);
router.get('/slug/:slug', getProductBySlug);
router.post('/', protect, admin, validateProduct, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
