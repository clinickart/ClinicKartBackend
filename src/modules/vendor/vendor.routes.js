const express = require('express');
const {
  register,
  login,
  logout,
  verifyEmailOTP,
  resendOTP,
  setupProfile,
  getProfile,
  updateProfile,
  getRegistrationStatus
} = require('./vendor.controller');

const { authenticate, authorize, requireCompleteRegistration } = require('../../middlewares/auth.middleware');
const {
  validateVendorRegistration,
  validateVendorProfileSetup,
  validateVendorLogin,
  validateOTP,
  validateResendOTP,
  validateProfileUpdate
} = require('./vendor.validation');

const router = express.Router();

// Public routes
router.post('/register', validateVendorRegistration, register);
router.post('/verify-email', validateOTP, verifyEmailOTP);
router.post('/resend-otp', validateResendOTP, resendOTP);
router.post('/login', validateVendorLogin, login);

// Protected routes (allow incomplete registration)
router.get('/status', authenticate, authorize('vendor'), getRegistrationStatus);
router.get('/test-auth', authenticate, (req, res) => {
  res.json({ success: true, message: 'Authentication working!', user: req.user });
});

// Protected routes (require complete registration)
router.post('/logout', authenticate, authorize('vendor'), logout);
router.post('/setup-profile', authenticate, authorize('vendor'), requireCompleteRegistration, validateVendorProfileSetup, setupProfile);
router.get('/profile', authenticate, authorize('vendor'), requireCompleteRegistration, getProfile);
router.put('/profile', authenticate, authorize('vendor'), requireCompleteRegistration, updateProfile);

module.exports = router;