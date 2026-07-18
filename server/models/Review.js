const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5']
  },
  title: {
    type: String,
    required: [true, 'Please provide a review title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  images: [{
    type: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  notHelpful: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure one review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product ratings after review is saved
reviewSchema.post('save', async function() {
  const Product = require('./Product');
  const product = await Product.findById(this.product);
  if (product) {
    const reviews = await this.constructor.find({ product: this.product, isApproved: true });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    product.ratings = totalRating / reviews.length;
    product.numReviews = reviews.length;
    await product.save();
  }
});

// Update product ratings after review is removed
reviewSchema.post('deleteOne', { document: true }, async function(doc) {
  const Product = require('./Product');
  const product = await Product.findById(doc.product);
  if (product) {
    const reviews = await doc.constructor.find({ product: doc.product, isApproved: true });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    product.ratings = reviews.length > 0 ? totalRating / reviews.length : 0;
    product.numReviews = reviews.length;
    await product.save();
  }
});

module.exports = mongoose.model('Review', reviewSchema);
