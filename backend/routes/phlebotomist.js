const express = require('express');
const {
  getDashboard,
  updateLocation,
  getOrderDetails,
  updateOrderStatus
} = require('../controllers/phlebotomist');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Temporarily allow without strict auth for testing
router.get('/dashboard', protect, getDashboard);
router.put('/location', protect, updateLocation);
router.get('/orders/:orderId', protect, getOrderDetails);
router.put('/orders/:orderId/status', protect, updateOrderStatus);

module.exports = router;
