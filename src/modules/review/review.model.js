const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxLength: 100
  },
  comment: {
    type: String,
    trim: true,
    maxLength: 1000
  },
  images: [{
    url: String,
    alt: String,
    publicId: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'pending'
  },
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  vendorResponse: {
    message: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor'
    }
  },
  moderationNotes: {
    reason: String,
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    moderatedAt: Date
  }
}, {
  timestamps: true
});

// Compound indexes
reviewSchema.index({ product: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ order: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ verified: 1, status: 1 });

// Unique constraint - one review per user per product per order
reviewSchema.index({ product: 1, user: 1, order: 1 }, { unique: true });

// Virtual for checking if review is public
reviewSchema.virtual('isPublic').get(function() {
  return this.status === 'approved';
});

// Method to mark review as helpful
reviewSchema.methods.markHelpful = function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count += 1;
  }
  return this.save();
};

// Method to remove helpful mark
reviewSchema.methods.removeHelpful = function(userId) {
  const index = this.helpful.users.indexOf(userId);
  if (index > -1) {
    this.helpful.users.splice(index, 1);
    this.helpful.count -= 1;
  }
  return this.save();
};

// Static method to get average rating for a product
reviewSchema.statics.getProductAverageRating = function(productId) {
  return this.aggregate([
    { 
      $match: { 
        product: productId, 
        status: 'approved' 
      } 
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);
};

// Static method to get rating distribution
reviewSchema.statics.getRatingDistribution = function(productId) {
  return this.aggregate([
    { 
      $match: { 
        product: productId, 
        status: 'approved' 
      } 
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);
};

module.exports = mongoose.model('Review', reviewSchema);