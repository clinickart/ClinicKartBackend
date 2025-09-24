const { body } = require('express-validator');

const userValidation = {
  updateProfile: [
    body('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('phone').optional().matches(/^[\d\s-()]+$/).withMessage('Please provide a valid phone number')
  ]
};

module.exports = userValidation;