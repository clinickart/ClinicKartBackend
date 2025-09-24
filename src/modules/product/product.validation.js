const { body } = require('express-validator');

const productValidation = {
  createProduct: [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Product description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').isMongoId().withMessage('Valid category ID is required'),
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ],
  
  updateProduct: [
    body('name').optional().trim().notEmpty().withMessage('Product name cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Product description cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
  ]
};

module.exports = productValidation;