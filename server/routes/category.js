const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.get('/slug/:slug', getCategoryBySlug);
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
