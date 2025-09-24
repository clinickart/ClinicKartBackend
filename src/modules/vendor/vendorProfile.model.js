const mongoose = require('mongoose');

const vendorProfileSchema = new mongoose.Schema({
  // Reference to Vendor
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    unique: true
  },

  // Contact Information
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s-()]+$/, 'Please add a valid phone number']
  },
  alternatePhone: {
    type: String,
    match: [/^\+?[\d\s-()]+$/, 'Please add a valid phone number']
  },

  // Business Information
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot be more than 100 characters']
  },
  businessType: {
    type: String,
    enum: ['pharmacy', 'clinic', 'hospital', 'laboratory', 'medical_equipment', 'other'],
    required: [true, 'Business type is required']
  },
  businessRegistrationNumber: {
    type: String,
    required: [true, 'Business registration number is required'],
    unique: true
  },
  gstNumber: {
    type: String,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please provide a valid GST number']
  },
  licenseNumber: {
    type: String,
    trim: true
  },

  // Address Information
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    area: {
      type: String,
      required: [true, 'Area is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^[1-9][0-9]{5}$/, 'Please provide a valid pincode']
    },
    country: {
      type: String,
      default: 'India'
    },
    landmark: {
      type: String
    }
  },

  // Business Details  
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  establishedYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear()
  },
  
  // Operating Hours
  operatingHours: {
    monday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    thursday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    friday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    saturday: { open: String, close: String, isClosed: { type: Boolean, default: false } },
    sunday: { open: String, close: String, isClosed: { type: Boolean, default: true } }
  },

  // Bank Details
  bankDetails: {
    bankName: {
      type: String,
      required: [true, 'Bank name is required']
    },
    accountHolderName: {
      type: String,
      required: [true, 'Account holder name is required']
    },
    accountNumber: {
      type: String,
      required: [true, 'Account number is required']
    },
    ifscCode: {
      type: String,
      required: [true, 'IFSC code is required'],
      match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Please provide a valid IFSC code']
    },
    branchName: {
      type: String,
      required: [true, 'Branch name is required']
    }
  },

  // Documents
  documents: {
    businessRegistrationCertificate: {
      url: String,
      publicId: String,
      uploadedAt: Date
    },
    gstCertificate: {
      url: String,
      publicId: String,
      uploadedAt: Date
    },
    licenseDocument: {
      url: String,
      publicId: String,
      uploadedAt: Date
    },
    panCard: {
      url: String,
      publicId: String,
      uploadedAt: Date
    },
    aadharCard: {
      url: String,
      publicId: String,
      uploadedAt: Date
    },
    bankPassbook: {
      url: String,
      publicId: String,
      uploadedAt: Date
    }
  },

  // Business Logo
  businessLogo: {
    url: String,
    publicId: String,
    uploadedAt: Date
  },

  // Verification Status
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isDocumentVerified: {
    type: Boolean,
    default: false
  },
  
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
  
  // Categories
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  
  // Service Areas
  serviceAreas: [{
    pincode: String,
    area: String,
    deliveryCharge: { type: Number, default: 0 },
    minimumOrder: { type: Number, default: 0 }
  }],

  // Business Metrics
  totalProducts: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
vendorProfileSchema.index({ vendorId: 1 });
vendorProfileSchema.index({ businessRegistrationNumber: 1 });
vendorProfileSchema.index({ location: '2dsphere' });
vendorProfileSchema.index({ 'address.pincode': 1 });
vendorProfileSchema.index({ businessType: 1 });

// Virtual for complete address
vendorProfileSchema.virtual('fullAddress').get(function() {
  return `${this.address.street}, ${this.address.area}, ${this.address.city}, ${this.address.state} - ${this.address.pincode}`;
});

// Method to check if profile is complete
vendorProfileSchema.methods.isComplete = function() {
  return !!(
    this.phone &&
    this.businessName &&
    this.businessType &&
    this.businessRegistrationNumber &&
    this.address.street &&
    this.address.city &&
    this.address.state &&
    this.address.pincode &&
    this.bankDetails.bankName &&
    this.bankDetails.accountNumber &&
    this.bankDetails.ifscCode
  );
};

module.exports = mongoose.model('VendorProfile', vendorProfileSchema);