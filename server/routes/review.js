const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  getUserReviews
} = require('../controllers/reviewController');

router.get('/product/:productId', getReviews);
router.get('/user', protect, getUserReviews);
router.get('/:id', getReviewById);
router.post('/product/:productId', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/helpful', markHelpful);

module.exports = router;
