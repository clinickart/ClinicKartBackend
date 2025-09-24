const Vendor = require('./vendor.model');
const VendorProfile = require('./vendorProfile.model');
const { generateOTP, verifyOTP } = require('../../utils/otp');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');
const emailSender = require('../../utils/emailSender');
const logger = require('../../utils/logger');
const { ApiResponse } = require('../../utils/response');
const pendingRegistrations = require('../../utils/pendingRegistrations');

/**
 * Generate JWT token
 */
const generateToken = (id, role = 'vendor') => {
  return jwt.sign(
    { id, role },
    jwtConfig.JWT_SECRET,
    { expiresIn: jwtConfig.JWT_EXPIRE }
  );
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    jwtConfig.JWT_REFRESH_SECRET,
    { expiresIn: jwtConfig.JWT_REFRESH_EXPIRE }
  );
};

class VendorService {
  /**
   * Register a new vendor (Step 1: Send OTP - NO DB SAVE YET)
   */
  async register(vendorData) {
    try {
      // Check if vendor already exists in database
      const existingVendor = await Vendor.findOne({ email: vendorData.email });

      if (existingVendor) {
        throw new Error('Vendor already exists with this email');
      }

      // Check if there's already a pending registration
      const existingPending = pendingRegistrations.getPendingRegistration(vendorData.email);
      if (existingPending) {
        // Remove old pending registration to start fresh
        console.log(`🔄 Replacing existing pending registration for: ${vendorData.email}`);
      }

      // Store registration data temporarily (NOT in database yet)
      pendingRegistrations.storePendingRegistration(vendorData.email, {
        firstName: vendorData.firstName,
        lastName: vendorData.lastName,
        email: vendorData.email,
        password: vendorData.password
      });
      
      // Generate and store OTP temporarily
      const emailOTP = generateOTP();
      pendingRegistrations.storeOTP(vendorData.email, emailOTP);

      // TODO: Remove OTP from response once email setup is done
      // For now, returning OTP in response for testing
      try {
        await emailSender.sendOTPEmail(vendorData.email, emailOTP, 'registration');
        console.log(`📧 OTP would be sent to: ${vendorData.email}`);
      } catch (emailError) {
        logger.warn('Email service not available - OTP returned in response');
      }

      return ApiResponse.success({
        message: 'Registration initiated successfully! Please verify OTP to complete.',
        email: vendorData.email,
        // TODO: Remove this otp field once email is setup
        otp: emailOTP, // TEMPORARY - for testing only
        nextStep: 'email_verification',
        instructions: 'Use the provided OTP to verify your email and complete registration',
        otpExpiresIn: '10 minutes'
      }, 'Registration Step 1: Complete - Use OTP to verify');
    } catch (error) {
      logger.error('Vendor registration error:', error);
      throw error;
    }
  }

  /**
   * Setup vendor profile (Step 2: Complete business profile)
   */
  async setupProfile(vendorId, profileData) {
    try {
      const vendor = await Vendor.findById(vendorId);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      if (!vendor.isEmailVerified) {
        throw new Error('Please verify your email first');
      }

      if (vendor.isProfileComplete) {
        throw new Error('Profile is already complete');
      }

      // Check if business registration number already exists
      const existingProfile = await VendorProfile.findOne({ 
        businessRegistrationNumber: profileData.businessRegistrationNumber 
      });

      if (existingProfile) {
        throw new Error('Business registration number already exists');
      }

      // Create vendor profile
      const vendorProfile = new VendorProfile({
        vendorId: vendorId,
        ...profileData
      });

      await vendorProfile.save();

      // Update vendor status
      vendor.isProfileComplete = true;
      vendor.profileCompletedAt = new Date();
      vendor.registrationStep = 'completed';
      await vendor.save();

      return ApiResponse.success({
        vendor,
        profile: vendorProfile
      }, 'Profile setup completed successfully! You can now start adding products.');
    } catch (error) {
      logger.error('Vendor profile setup error:', error);
      throw error;
    }
  }

  /**
   * Login vendor
   */
  async login(email, password) {
    try {
      // Check for vendor
      const vendor = await Vendor.findOne({ email }).select('+password');

      if (!vendor) {
        throw new Error('Invalid credentials');
      }

      // Check if password matches
      const isMatch = await vendor.matchPassword(password);

      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Check if vendor is active
      if (!vendor.isActive) {
        throw new Error('Your account has been deactivated');
      }

      // Generate tokens
      const accessToken = generateToken(vendor._id, 'vendor');
      const refreshToken = generateRefreshToken(vendor._id);
      
      // Add refresh token to vendor
      vendor.addRefreshToken(refreshToken);
      vendor.lastLogin = new Date();
      await vendor.save();

      // Remove password from output
      vendor.password = undefined;

      return ApiResponse.success({
        vendor,
        accessToken,
        refreshToken
      }, 'Login successful');
    } catch (error) {
      logger.error('Vendor login error:', error);
      throw error;
    }
  }

  /**
   * Logout vendor
   */
  async logout(vendorId, refreshToken) {
    try {
      const vendor = await Vendor.findById(vendorId);
      
      if (!vendor) {
        throw new Error('Vendor not found');
      }

      // Remove refresh token
      vendor.removeRefreshToken(refreshToken);
      await vendor.save();

      return ApiResponse.success(null, 'Logged out successfully');
    } catch (error) {
      logger.error('Vendor logout error:', error);
      throw error;
    }
  }

  /**
   * Verify email OTP and CREATE USER IN DATABASE
   */
  async verifyEmailOTP(email, otp) {
    try {
      // Verify OTP from temporary storage
      const verificationResult = pendingRegistrations.verifyOTP(email, otp);
      
      if (!verificationResult.success) {
        throw new Error(verificationResult.error);
      }

      const registrationData = verificationResult.registrationData;

      // Check if vendor already exists (safety check)
      const existingVendor = await Vendor.findOne({ email: registrationData.email });
      if (existingVendor) {
        throw new Error('Vendor already exists with this email');
      }

      // NOW CREATE USER IN DATABASE
      const vendor = new Vendor({
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        email: registrationData.email,
        password: registrationData.password,
        isEmailVerified: true,
        isRegistrationComplete: true,
        registrationCompletedAt: new Date(),
        registrationStep: 'profile_setup'
      });

      await vendor.save();
      console.log(`✅ User created in database: ${vendor.email}`);

      // Generate tokens for the newly created user
      const accessToken = generateToken(vendor._id, 'vendor');
      const refreshToken = generateRefreshToken(vendor._id);
      
      // Add refresh token to vendor
      vendor.addRefreshToken(refreshToken);
      await vendor.save();

      // Send welcome email
      try {
        await emailSender.sendWelcomeEmail(vendor.email, `${vendor.firstName} ${vendor.lastName}`, 'vendor');
      } catch (emailError) {
        logger.warn('Welcome email not sent:', emailError.message);
      }

      // Remove sensitive data
      vendor.password = undefined;
      
      return ApiResponse.success({
        message: 'Registration completed successfully! User created and email verified.',
        vendor: {
          id: vendor._id,
          firstName: vendor.firstName,
          lastName: vendor.lastName,
          email: vendor.email,
          isEmailVerified: vendor.isEmailVerified,
          isRegistrationComplete: vendor.isRegistrationComplete,
          registrationStep: vendor.registrationStep,
          isProfileComplete: vendor.isProfileComplete,
          createdAt: vendor.createdAt
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: '24h'
        }
      }, 'Email verified and user created successfully!');
    } catch (error) {
      logger.error('Email OTP verification error:', error);
      throw error;
    }
  }

  /**
   * Resend OTP for pending registration
   */
  async resendOTP(email) {
    try {
      // Check if there's a pending registration
      const pendingData = pendingRegistrations.getPendingRegistration(email);
      
      if (!pendingData) {
        throw new Error('No pending registration found for this email. Please register first.');
      }

      // Check if OTP can be resent (cooldown period)
      const canResend = pendingRegistrations.canResendOTP(email, 2); // 2 minutes cooldown
      
      if (!canResend) {
        const remainingSeconds = pendingRegistrations.getResendCooldownTime(email, 2);
        const remainingMinutes = Math.ceil(remainingSeconds / 60);
        
        return ApiResponse.error(
          `OTP already sent recently. Please wait ${remainingMinutes} minute(s) before requesting again.`,
          429,
          {
            email: email,
            canResendAfter: remainingSeconds,
            message: 'Too many requests. Please wait before resending OTP.'
          }
        );
      }

      // Generate new OTP
      const emailOTP = generateOTP();
      pendingRegistrations.storeOTP(email, emailOTP);

      // TODO: Send email once email service is setup
      try {
        await emailSender.sendOTPEmail(email, emailOTP, 'registration');
        console.log(`📧 OTP resent to: ${email}`);
      } catch (emailError) {
        logger.warn('Email service not available - OTP returned in response');
      }

      return ApiResponse.success({
        message: 'OTP resent successfully!',
        email: email,
        // TODO: Remove this otp field once email is setup
        otp: emailOTP, // TEMPORARY - for testing only
        otpExpiresIn: '10 minutes'
      }, 'New OTP generated successfully');
    } catch (error) {
      logger.error('Resend email OTP error:', error);
      throw error;
    }
  }

  /**
   * Get vendor profile with complete information
   */
  async getProfile(vendorId) {
    try {
      const vendor = await Vendor.findById(vendorId);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      let profile = null;
      if (vendor.isProfileComplete) {
        profile = await VendorProfile.findOne({ vendorId: vendorId });
      }

      return ApiResponse.success({
        vendor,
        profile,
        isProfileComplete: vendor.isProfileComplete,
        registrationStep: vendor.registrationStep
      }, 'Profile fetched successfully');
    } catch (error) {
      logger.error('Get vendor profile error:', error);
      throw error;
    }
  }

  /**
   * Get vendor registration status
   */
  async getRegistrationStatus(vendorId) {
    try {
      const vendor = await Vendor.findById(vendorId);

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      const status = {
        vendorId: vendor._id,
        email: vendor.email,
        fullName: vendor.fullName,
        isEmailVerified: vendor.isEmailVerified,
        isProfileComplete: vendor.isProfileComplete,
        registrationStep: vendor.registrationStep,
        canAddProducts: vendor.isEmailVerified && vendor.isProfileComplete,
        nextAction: this.getNextAction(vendor)
      };

      return ApiResponse.success(status, 'Registration status fetched successfully');
    } catch (error) {
      logger.error('Get registration status error:', error);
      throw error;
    }
  }

  /**
   * Helper method to determine next action for vendor
   */
  getNextAction(vendor) {
    if (!vendor.isEmailVerified) {
      return 'verify_email';
    }
    if (!vendor.isProfileComplete) {
      return 'complete_profile';
    }
    return 'start_selling';
  }

  /**
   * Update vendor profile
   */
  async updateProfile(vendorId, updateData) {
    try {
      // Remove sensitive fields that shouldn't be updated via this method
      const restrictedFields = ['password', 'emailOTP', 'phoneOTP', 'refreshTokens', 'isEmailVerified', 'isPhoneVerified', 'isApproved'];
      restrictedFields.forEach(field => delete updateData[field]);

      const vendor = await Vendor.findByIdAndUpdate(
        vendorId,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

      if (!vendor) {
        throw new Error('Vendor not found');
      }

      return ApiResponse.success(vendor, 'Profile updated successfully');
    } catch (error) {
      logger.error('Update vendor profile error:', error);
      throw error;
    }
  }
}

module.exports = new VendorService();