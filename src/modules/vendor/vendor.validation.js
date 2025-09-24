const { body } = require('express-validator');

/**
 * Validation rules for simplified vendor registration (Step 1)
 */
const validateVendorRegistration = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2-50 characters'),
    
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2-50 characters'),
    
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

/**
 * Validation rules for vendor profile setup (Step 2)
 */
const validateVendorProfileSetup = [
  body('phone')
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
    
  body('businessName')
    .trim()
    .notEmpty()
    .withMessage('Business name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2-100 characters'),
    
  body('businessType')
    .isIn(['pharmacy', 'clinic', 'hospital', 'laboratory', 'medical_equipment', 'other'])
    .withMessage('Please select a valid business type'),
    
  body('businessRegistrationNumber')
    .trim()
    .notEmpty()
    .withMessage('Business registration number is required'),
    
  body('gstNumber')
    .optional()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Please provide a valid GST number'),
    
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
    
  body('address.area')
    .trim()
    .notEmpty()
    .withMessage('Area is required'),
    
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
    
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
    
  body('address.pincode')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid pincode'),
    
  body('bankDetails.bankName')
    .trim()
    .notEmpty()
    .withMessage('Bank name is required'),
    
  body('bankDetails.accountHolderName')
    .trim()
    .notEmpty()
    .withMessage('Account holder name is required'),
    
  body('bankDetails.accountNumber')
    .trim()
    .notEmpty()
    .withMessage('Account number is required'),
    
  body('bankDetails.ifscCode')
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage('Please provide a valid IFSC code'),
    
  body('bankDetails.branchName')
    .trim()
    .notEmpty()
    .withMessage('Branch name is required')
];

/**
 * Validation rules for vendor login
 */
const validateVendorLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for OTP verification
 */
const validateOTP = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];

/**
 * Validation rules for resend OTP
 */
const validateResendOTP = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail()
];

/**
 * Validation rules for profile update
 */
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2-50 characters'),
    
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2-50 characters'),
    
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please provide a valid phone number'),
    
  body('businessName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Business name must be between 2-100 characters'),
    
  body('businessType')
    .optional()
    .isIn(['pharmacy', 'clinic', 'hospital', 'laboratory', 'medical_equipment', 'other'])
    .withMessage('Please select a valid business type'),
    
  body('gstNumber')
    .optional()
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Please provide a valid GST number'),
    
  body('address.street')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Street address cannot be empty'),
    
  body('address.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty'),
    
  body('address.state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty'),
    
  body('address.pincode')
    .optional()
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid pincode')
];

module.exports = {
  validateVendorRegistration,
  validateVendorProfileSetup,
  validateVendorLogin,
  validateOTP,
  validateResendOTP,
  validateProfileUpdate
};