const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    collectorLogin,
    getCollectorProfile,
    updateCollectorProfile,
    getMyBookings,
    updateBookingStatus,
    updateSampleStatus,
    updatePaymentStatus,
    completeHandover
} = require('../controllers/collector');

// @route   POST /api/v1/collector/login
// @desc    Collector login
// @access  Public
router.post('/login', collectorLogin);

// @route   GET /api/v1/collector/profile
// @desc    Get collector profile
// @access  Private (Collector only)
router.get('/profile', protect, authorize('collector'), getCollectorProfile);

// @route   PUT /api/v1/collector/profile
// @desc    Update collector profile
// @access  Private (Collector only)
router.put('/profile', protect, authorize('collector'), updateCollectorProfile);

// @route   GET /api/v1/collector/bookings
// @desc    Get collector's assigned bookings
// @access  Private (Collector only)
router.get('/bookings', protect, authorize('collector'), getMyBookings);

// @route   PUT /api/v1/collector/bookings/:bookingId/status
// @desc    Update booking status (Reached, Collected Sample, Moving to Next Patient)
// @access  Private (Collector only)
router.put('/bookings/:bookingId/status', protect, authorize('collector'), updateBookingStatus);

// @route   PUT /api/v1/collector/bookings/:bookingId/sample
// @desc    Update sample collection status
// @access  Private (Collector only)
router.put('/bookings/:bookingId/sample', protect, authorize('collector'), updateSampleStatus);

// @route   PUT /api/v1/collector/bookings/:bookingId/payment
// @desc    Update payment status and amount
// @access  Private (Collector only)
router.put('/bookings/:bookingId/payment', protect, authorize('collector'), updatePaymentStatus);

// @route   PUT /api/v1/collector/bookings/:bookingId/handover
// @desc    Complete sample and amount handover
// @access  Private (Collector only)
router.put('/bookings/:bookingId/handover', protect, authorize('collector'), completeHandover);

module.exports = router;
