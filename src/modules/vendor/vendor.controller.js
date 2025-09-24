const { validationResult } = require('express-validator');
const vendorService = require('./vendor.service');
const logger = require('../../utils/logger');
const { ApiResponse } = require('../../utils/response');

/**
 * @desc    Register vendor
 * @route   POST /api/v1/vendors/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse.validationError(errors.array()));
    }

    const result = await vendorService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    logger.error('Register controller error:', error);
    res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

/**
 * @desc    Login vendor
 * @route   POST /api/v1/vendors/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse.validationError(errors.array()));
    }

    const { email, password } = req.body;
    const result = await vendorService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Login controller error:', error);
    res.status(401).json(ApiResponse.error(error.message, 401));
  }
};

/**
 * @desc    Logout vendor
 * @route   POST /api/v1/vendors/logout
 * @access  Private
 */
const logout = async (req, res, next) => {
  try {
    const refreshToken = req.body.refreshToken;
    
    if (!refreshToken) {
      return res.status(400).json(ApiResponse.error('Refresh token is required', 400));
    }

    const result = await vendorService.logout(req.user.id, refreshToken);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Logout controller error:', error);
    res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

/**
 * @desc    Verify email OTP
 * @route   POST /api/v1/vendors/verify-email
 * @access  Private
 */
const verifyEmailOTP = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse.validationError(errors.array()));
    }

    const { email, otp } = req.body;
    const result = await vendorService.verifyEmailOTP(email, otp);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Verify email OTP controller error:', error);
    res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

/**
 * @desc    Resend OTP for pending registration
 * @route   POST /api/v1/vendors/resend-otp
 * @access  Public
 */
const resendOTP = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse.validationError(errors.array()));
    }

    const { email } = req.body;
    const result = await vendorService.resendOTP(email);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Resend OTP controller error:', error);
    res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

/**
 * @desc    Get vendor profile
 * @route   GET /api/v1/vendors/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const result = await vendorService.getProfile(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Get profile controller error:', error);
    res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

/**
 * @desc    Setup vendor profile (Step 2 after email verification)
 * @route   POST /api/v1/vendors/setup-profile
 * @access  Private
 */
const setupProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse.validationError(errors.array()));
    }

    const result = await vendorService.setupProfile(req.user.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Setup profile controller error:', error);
    res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

/**
 * @desc    Update vendor profile
 * @route   PUT /api/v1/vendors/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(ApiResponse.validationError(errors.array()));
    }

    const result = await vendorService.updateProfile(req.user.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Update profile controller error:', error);
    res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

/**
 * @desc    Get vendor registration status
 * @route   GET /api/v1/vendors/status
 * @access  Private
 */
const getRegistrationStatus = async (req, res, next) => {
  try {
    const result = await vendorService.getRegistrationStatus(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    logger.error('Get registration status controller error:', error);
    res.status(400).json(ApiResponse.error(error.message, 400));
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmailOTP,
  resendOTP,
  setupProfile,
  getProfile,
  updateProfile,
  getRegistrationStatus
};