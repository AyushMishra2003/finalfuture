const express = require('express');
const {
  getUnassignedOrders,
  getAvailableCollectors,
  assignOrderToCollector,
  getAssignedOrders
} = require('../controllers/adminOrderAssignment');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Temporarily allow without auth for testing
router.get('/unassigned', getUnassignedOrders);
router.get('/assigned', getAssignedOrders);
router.get('/:orderId/available-collectors', getAvailableCollectors);
router.post('/:orderId/assign', assignOrderToCollector);

module.exports = router;
