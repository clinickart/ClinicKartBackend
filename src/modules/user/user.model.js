const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  // Login & Security
  lastLogin: { type: Date },
  userName: { type: String },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    minLength: 10,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false
  },
  
  // Personal Information
  fullName: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  gender: { type: String },
  dob: { type: String },
  phone: {
    type: String,
    minLength: 8,
    maxLength: 12,
  },
  image: {
    type: String,
    default: null
  },
  
  // Preferences
  language: { type: String },
  
  // Location
  country: { type: String },
  address: { type: String },
  pincode: { type: Number },
  area: { type: String },
  city: { type: String },
  state: { type: String },
  
  // Location References
  cities: [{ type: Schema.Types.ObjectId, ref: 'City' }],
  areas: [{ type: Schema.Types.ObjectId, ref: 'Area' }],
  allIndiaCity: Boolean,
  
  // Current Location (GeoJSON)
  currentLocation: {
    type: {
      type: String,
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
  },
  
  // Account Verification
  otp: { type: String },
  token: { type: String },
  otpExpiration: { type: Date },
  accountVerification: {
    type: Boolean,
    default: false,
  },
  
  // User Preferences
  popup: {
    type: Boolean,
    default: false
  },
  orderHistory: {
    type: Boolean,
    default: false
  },
  notification: {
    type: Boolean,
    default: false
  },
  
  // KYC Information
  kycDocumentId: {
    type: Schema.Types.ObjectId,
    ref: "vendorKyc"
  },
  kybDocumentId: {
    type: Schema.Types.ObjectId,
    ref: "vendorKyb"
  },
  kycStatus: { type: String },
  kybStatus: { type: String },
  
  // User Type & Status
  userType: {
    type: String,
    enum: ["USER", "ADMIN", "VENDOR", "SUB_ADMIN"],
    default: "USER"
  },
  status: {
    type: String,
    enum: ["Active", "Block"],
    default: "Active"
  },
  
  // Financial
  wallet: {
    type: Number,
    default: 0,
  },
  
  // Plan & Subscription
  planBuyId: {
    type: Schema.Types.ObjectId,
    ref: "createPayment"
  },
  planExpiration: { type: Date },
  planStatus: {
    type: String,
    enum: ['Active', 'inActive']
  },
  notificationSent: {
    type: Boolean,
    default: false,
  },
  
  // Categories (for vendors)
  categoryId: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Category",
  }],
  
  // Vendor Specific Fields
  venderCity: {
    type: String,
    default: ""
  },
  averageRating: {
    type: Number,
    default: 3
  },
  totalRating: {
    type: String,
    default: "4"
  },
  
  // Location Flags
  isCity: {
    type: String,
    default: false
  },
  isSector: {
    type: String,
    default: false
  },
  
  // Access Control
  accessLevel: [{
    type: String,
  }],
  
  // Settings
  bankDetailsDisableEnable: Boolean,
  addressDetailsDisableEnable: Boolean,
  
  // Referral
  refferalCode: { type: String },
  
  // Wishlist
  wishlistproduct: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ currentLocation: '2dsphere' });
userSchema.index({ userType: 1 });

// Virtual for full name
userSchema.virtual('displayName').get(function() {
  return this.fullName || `${this.firstName} ${this.lastName}` || this.userName || this.email;
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);