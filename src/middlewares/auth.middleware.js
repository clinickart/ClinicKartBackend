const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
 
      const decoded = jwt.verify(token, jwtConfig.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

/**
 * Authorization middleware - check user roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

/**
 * Check if user is vendor
 */
const isVendor = (req, res, next) => {
  if (req.user && req.user.role === 'vendor') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Vendor role required.'
    });
  }
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
};

/**
 * Check if user is customer
 */
const isUser = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. User role required.'
    });
  }
};

/**
 * Check if vendor registration is complete
 */
const requireCompleteRegistration = async (req, res, next) => {
  try {
    if (req.user.role !== 'vendor') {
      return next();
    }

    // Import here to avoid circular dependency
    const Vendor = require('../modules/vendor/vendor.model');
    const vendor = await Vendor.findById(req.user.id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found'
      });
    }

    if (!vendor.isRegistrationComplete) {
      return res.status(403).json({
        success: false,
        message: 'Registration not complete. Please verify your email first.',
        registrationStep: vendor.registrationStep,
        nextStep: vendor.isEmailVerified ? 'profile_setup' : 'email_verification'
      });
    }

    next();
  } catch (error) {
    logger.error('Registration check middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in registration check'
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  isVendor,
  isAdmin,
  isUser,
  requireCompleteRegistration
};