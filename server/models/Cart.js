const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  guestId: {
    type: String,
    default: null
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: [1, 'Quantity must be at least 1']
    },
    price: {
      type: Number,
      required: true
    }
  }],
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    default: null
  },
  subtotal: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  this.total = this.subtotal - this.discount;
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
