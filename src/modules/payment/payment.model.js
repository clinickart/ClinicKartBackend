const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal', 'wallet', 'cod'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['razorpay', 'stripe', 'paypal']
  },
  gatewayPaymentId: String,
  gatewayOrderId: String,
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  failureReason: String,
  refundAmount: {
    type: Number,
    default: 0
  },
  refundReason: String,
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);