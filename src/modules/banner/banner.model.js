const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    url: {
      type: String,
      required: true
    },
    alt: String,
    publicId: String
  },
  type: {
    type: String,
    enum: ['hero', 'promotional', 'category', 'product', 'offer'],
    required: true
  },
  position: {
    type: String,
    enum: ['homepage_hero', 'homepage_secondary', 'category_page', 'product_page', 'sidebar'],
    required: true
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'scheduled'],
    default: 'active'
  },
  link: {
    url: String,
    type: {
      type: String,
      enum: ['internal', 'external', 'product', 'category']
    },
    target: {
      type: String,
      enum: ['_self', '_blank'],
      default: '_self'
    }
  },
  targetAudience: {
    userType: {
      type: String,
      enum: ['all', 'new_users', 'returning_users', 'premium_users']
    },
    location: String,
    ageGroup: String
  },
  scheduling: {
    startDate: Date,
    endDate: Date,
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
    }
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    clickThroughRate: {
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
bannerSchema.index({ status: 1, priority: -1 });
bannerSchema.index({ position: 1, status: 1 });
bannerSchema.index({ 'scheduling.startDate': 1, 'scheduling.endDate': 1 });

// Virtual for checking if banner is currently active
bannerSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.status === 'active' && 
         (!this.scheduling.startDate || this.scheduling.startDate <= now) &&
         (!this.scheduling.endDate || this.scheduling.endDate >= now);
});

// Method to increment view count
bannerSchema.methods.incrementViews = function() {
  this.analytics.views += 1;
  return this.save();
};

// Method to increment click count and update CTR
bannerSchema.methods.incrementClicks = function() {
  this.analytics.clicks += 1;
  this.analytics.clickThroughRate = this.analytics.views > 0 ? 
    (this.analytics.clicks / this.analytics.views) * 100 : 0;
  return this.save();
};

module.exports = mongoose.model('Banner', bannerSchema);