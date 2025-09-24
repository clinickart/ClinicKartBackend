const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
    default: 'pending'
  },
  estimatedDeliveryDate: {
    type: Date,
    required: true
  },
  actualDeliveryDate: {
    type: Date
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
    landmark: String
  },
  deliveryPartner: {
    name: String,
    phone: String,
    vehicleNumber: String
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    location: String,
    remarks: String
  }],
  deliveryInstructions: String,
  deliveryFee: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
deliverySchema.index({ orderId: 1 });
deliverySchema.index({ trackingNumber: 1 });
deliverySchema.index({ status: 1 });

module.exports = mongoose.model('Delivery', deliverySchema);