const crypto = require('crypto');

/**
 * Generate OTP
 * @param {number} length - OTP length (default: 6)
 * @returns {string} Generated OTP
 */
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  
  return otp;
};

/**
 * Hash OTP for secure storage
 * @param {string} otp - OTP to hash
 * @returns {string} Hashed OTP
 */
const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

/**
 * Verify OTP
 * @param {string} otp - Plain OTP
 * @param {string} hashedOTP - Hashed OTP
 * @returns {boolean} Is valid OTP
 */
const verifyOTP = (otp, hashedOTP) => {
  const hashedInput = hashOTP(otp);
  return hashedInput === hashedOTP;
};

/**
 * Generate secure random token
 * @param {number} length - Token length (default: 32)
 * @returns {string} Random token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Check if OTP is expired
 * @param {Date} expirationTime - OTP expiration time
 * @returns {boolean} Is expired
 */
const isOTPExpired = (expirationTime) => {
  return new Date() > expirationTime;
};

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
  generateToken,
  isOTPExpired
};