const express = require('express');
const {
    getOrders,
    getMyOrders,
    getOrder,
    createOrder,
    updateOrderToPaid,
    updateOrderToDelivered,
    deleteOrder,
    getDashboardStats,
    updateOrderStatus,
    updateOrder
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Order = require('../models/Order');

const router = express.Router();

router.route('/')
    .get(advancedResults(Order, 'user'), getOrders)
    .post(createOrder);

router.route('/stats')
    .get(getDashboardStats);

router.route('/myorders')
    .get(getMyOrders);

router.route('/:id')
    .get(getOrder)
    .put(updateOrder)
    .delete(deleteOrder);

router.route('/:id/pay')
    .put(updateOrderToPaid);

router.route('/:id/deliver')
    .put(updateOrderToDelivered);

router.route('/:id/status')
    .put(updateOrderStatus);

module.exports = router;