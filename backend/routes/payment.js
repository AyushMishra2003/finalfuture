const express = require('express');
const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    createHDFCOrder,
    handleHDFCCallback,
    handleHDFCWebhook,
    verifyHDFCPayment,
    getHDFCConfig,
    initiateRefund
} = require('../controllers/payment');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Razorpay routes
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

// Public routes
router.get('/hdfc/config', getHDFCConfig);
router.post('/hdfc/callback', handleHDFCCallback);
router.post('/hdfc/webhook', handleHDFCWebhook);

// Protected routes
router.post('/hdfc/create-order', protect, createHDFCOrder);
router.get('/hdfc/verify/:orderId', protect, verifyHDFCPayment);

// Admin only routes
router.post('/hdfc/refund', protect, authorize('admin'), initiateRefund);

module.exports = router;
