const express = require('express');
const router = express.Router();

// Import module routes
const authRoutes = require('../modules/auth/auth.routes');
const userRoutes = require('../modules/user/user.routes');
const vendorRoutes = require('../modules/vendor/vendor.routes');
const adminRoutes = require('../modules/admin/admin.routes');
const productRoutes = require('../modules/product/product.routes');
const orderRoutes = require('../modules/order/order.routes');
const paymentRoutes = require('../modules/payment/payment.routes');
const deliveryRoutes = require('../modules/delivery/delivery.routes');
const blogRoutes = require('../modules/blog/blog.routes');
const bannerRoutes = require('../modules/banner/banner.routes');
const notificationRoutes = require('../modules/notification/notification.routes');
const reviewRoutes = require('../modules/review/review.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/vendors', vendorRoutes);
router.use('/admin', adminRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/blogs', blogRoutes);
router.use('/banners', bannerRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reviews', reviewRoutes);

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;