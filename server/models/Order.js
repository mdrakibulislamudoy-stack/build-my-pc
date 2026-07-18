const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    image: String,
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  // PC Build in order
  pcBuild: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SavedPCBuild',
    default: null
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'stripe', 'sslcommerz'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: String,
    paidAt: Date,
    paymentGateway: String
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  coupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coupon',
    default: null
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  notes: {
    type: String,
    default: ''
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  isCancelled: {
    type: Boolean,
    default: false
  },
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Generate order number before saving
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
