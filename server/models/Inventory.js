const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Quantity cannot be negative']
  },
  reserved: {
    type: Number,
    default: 0,
    min: [0, 'Reserved quantity cannot be negative']
  },
  available: {
    type: Number,
    default: 0
  },
  reorderLevel: {
    type: Number,
    default: 10
  },
  lastRestock: Date,
  location: String,
  supplier: String
}, {
  timestamps: true
});

// Calculate available quantity
inventorySchema.pre('save', function(next) {
  this.available = this.quantity - this.reserved;
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
