const { body } = require('express-validator');

// Auth validation rules
const authValidation = {
  login: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  
  register: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('userType').isIn(['user', 'vendor', 'admin']).withMessage('Invalid user type')
  ]
};

module.exports = authValidation;