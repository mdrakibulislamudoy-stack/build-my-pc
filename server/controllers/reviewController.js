const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: productId, isApproved: true })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ product: productId, isApproved: true });

    res.json({
      success: true,
      count: reviews.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      reviews
    });
  } catch (error) {
    next(error);
  }
};

const getReviewById = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate('user', 'name avatar');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, images } = req.body;

    // Check if user has purchased the product
    const order = await Order.findOne({
      user: req.user.id,
      'items.product': productId,
      status: 'delivered'
    });

    const isVerifiedPurchase = !!order;

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating,
      title,
      comment,
      images: images || [],
      isVerifiedPurchase
    });

    await review.populate('user', 'name avatar');

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const { rating, title, comment, images } = req.body;

    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (images) review.images = images;

    await review.save();
    await review.populate('user', 'name avatar');

    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await review.deleteOne();

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.helpful += 1;
    await review.save();

    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

const getUserReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: req.user.id })
      .populate('product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ user: req.user.id });

    res.json({
      success: true,
      count: reviews.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
  getUserReviews
};
