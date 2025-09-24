const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'payment', 'promotional', 'system', 'delivery', 'review', 'reminder'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  recipients: {
    type: {
      type: String,
      enum: ['all', 'specific', 'role_based', 'location_based'],
      required: true
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'recipients.userModel'
    }],
    userModel: {
      type: String,
      enum: ['User', 'Vendor', 'Admin']
    },
    roles: [String],
    locations: [String]
  },
  channels: [{
    type: String,
    enum: ['email', 'sms', 'push', 'in_app'],
    required: true
  }],
  data: {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    },
    customData: mongoose.Schema.Types.Mixed
  },
  scheduling: {
    sendAt: Date,
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    },
    recurring: {
      enabled: {
        type: Boolean,
        default: false
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly']
      },
      interval: Number,
      endDate: Date
    }
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent', 'delivered', 'failed', 'cancelled'],
    default: 'draft'
  },
  deliveryStatus: [{
    channel: String,
    status: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'read']
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'recipients.userModel'
    },
    sentAt: Date,
    deliveredAt: Date,
    readAt: Date,
    errorMessage: String
  }],
  analytics: {
    totalSent: {
      type: Number,
      default: 0
    },
    totalDelivered: {
      type: Number,
      default: 0
    },
    totalRead: {
      type: Number,
      default: 0
    },
    totalClicked: {
      type: Number,
      default: 0
    },
    deliveryRate: {
      type: Number,
      default: 0
    },
    readRate: {
      type: Number,
      default: 0
    },
    clickRate: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
notificationSchema.index({ status: 1, 'scheduling.sendAt': 1 });
notificationSchema.index({ type: 1, priority: 1 });
notificationSchema.index({ 'recipients.users': 1 });
notificationSchema.index({ createdAt: -1 });

// Method to calculate analytics
notificationSchema.methods.calculateAnalytics = function() {
  const delivered = this.deliveryStatus.filter(d => d.status === 'delivered').length;
  const read = this.deliveryStatus.filter(d => d.status === 'read').length;
  
  this.analytics.totalSent = this.deliveryStatus.length;
  this.analytics.totalDelivered = delivered;
  this.analytics.totalRead = read;
  
  this.analytics.deliveryRate = this.analytics.totalSent > 0 ? 
    (delivered / this.analytics.totalSent) * 100 : 0;
  this.analytics.readRate = this.analytics.totalDelivered > 0 ? 
    (read / this.analytics.totalDelivered) * 100 : 0;
    
  return this.save();
};

module.exports = mongoose.model('Notification', notificationSchema);