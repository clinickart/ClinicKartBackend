const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { hashOTP } = require('../../utils/otp');

const vendorSchema = new mongoose.Schema({
  // Basic Information (Required for initial registration)
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },

  // Profile Setup Status
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  profileCompletedAt: {
    type: Date
  },

  // Account Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isRegistrationComplete: {
    type: Boolean,
    default: false
  },
  registrationCompletedAt: {
    type: Date
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Registration Step Tracking
  registrationStep: {
    type: String,
    enum: ['email_verification', 'profile_setup', 'completed'],
    default: 'email_verification'
  },

  // OTP Related
  emailOTP: {
    type: String,
    select: false
  },
  phoneOTP: {
    type: String,
    select: false
  },
  otpExpires: {
    type: Date,
    select: false
  },
  otpAttempts: {
    type: Number,
    default: 0,
    select: false
  },

  // Security
  refreshTokens: [{
    token: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Profile
  avatar: {
    type: String,
    default: null
  },
  
  // Business Details
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  
  // Ratings & Reviews
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Financial
  wallet: {
    type: Number,
    default: 0
  },
  
  // Categories
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  
  // Service Areas
  serviceAreas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Area'
  }],
  
  // Timestamps
  lastLogin: {
    type: Date
  },
  passwordChangedAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
vendorSchema.index({ email: 1 });
vendorSchema.index({ businessRegistrationNumber: 1 });
vendorSchema.index({ location: '2dsphere' });

// Virtual for full name
vendorSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Encrypt password using bcrypt
vendorSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Set passwordChangedAt when password is modified
vendorSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance method to check password
vendorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to set OTP
vendorSchema.methods.setOTP = function(otp, type = 'email') {
  const hashedOTP = hashOTP(otp);
  
  if (type === 'email') {
    this.emailOTP = hashedOTP;
  } else if (type === 'phone') {
    this.phoneOTP = hashedOTP;
  }
  
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  this.otpAttempts = 0;
};

// Instance method to clear OTP
vendorSchema.methods.clearOTP = function(type = 'email') {
  if (type === 'email') {
    this.emailOTP = undefined;
  } else if (type === 'phone') {
    this.phoneOTP = undefined;
  }
  
  this.otpExpires = undefined;
  this.otpAttempts = 0;
};

// Instance method to add refresh token
vendorSchema.methods.addRefreshToken = function(token) {
  this.refreshTokens.push({ token });
  
  // Keep only last 5 refresh tokens
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }
};

// Instance method to remove refresh token
vendorSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(tokenObj => tokenObj.token !== token);
};

module.exports = mongoose.model('Vendor', vendorSchema);