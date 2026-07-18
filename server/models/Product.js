const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    default: function () {
      return this.name
        ? this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
        : undefined
    }
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand'],
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  images: [{
    type: String
  }],
  specifications: {
    type: Object,
    default: {}
  },
  // PC Builder specific fields
  pcComponentType: {
    type: String,
    enum: ['cpu', 'motherboard', 'gpu', 'ram', 'ssd', 'hdd', 'psu', 'cpu-cooler', 'case', 'other'],
    default: 'other'
  },
  socket: String, // For CPU and Motherboard compatibility
  ramType: String, // For Motherboard and RAM compatibility
  ramSlots: Number, // For Motherboard
  maxRam: Number, // For Motherboard
  wattage: Number, // For PSU
  tdp: Number, // For CPU
  formFactor: String, // For Case and Motherboard
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  salePrice: {
    type: Number,
    default: null,
    min: [0, 'Sale price cannot be negative']
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating must be at most 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  featured: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  soldCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }
  next();
});

// Index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
