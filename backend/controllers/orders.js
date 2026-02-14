
const Order = require('../models/Order');
const User = require('../models/User');
const Test = require('../models/Test');
const asyncHandler = require('../middleware/async');
const { calculateDistance, formatDistance } = require('../utils/locationUtils');

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc    Get orders for logged in user
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
    // Check for mock user
    if (req.user.id.startsWith('mock-user-id-')) {
        return res.status(200).json({
            success: true,
            count: 2,
            data: [
                {
                    _id: "mock-order-id-001",
                    createdAt: new Date().toISOString(),
                    totalPrice: 2499,
                    isPaid: true,
                    status: "Processing",
                    orderItems: [
                        { name: "Full Body Checkup", price: 1999, quantity: 1 },
                        { name: "Vitamin D Test", price: 500, quantity: 1 }
                    ]
                },
                {
                    _id: "mock-order-id-002",
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    totalPrice: 999,
                    isPaid: false,
                    status: "Pending",
                    orderItems: [
                        { name: "Thyroid Profile", price: 999, quantity: 1 }
                    ]
                }
            ]
        });
    }

    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Public
exports.getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (!order) {
        return res.status(404).json({
            success: false,
            error: `Order not found with id of ${req.params.id} `
        });
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Public
exports.createOrder = asyncHandler(async (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        location,
        userId
    } = req.body;

    // Validate order items
    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({
            success: false,
            error: 'No order items'
        });
    }

    // Add location to shipping address if provided
    if (location && location.latitude && location.longitude) {
        shippingAddress.location = {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
            latitude: location.latitude,
            longitude: location.longitude,
            accuracy: location.accuracy,
            timestamp: new Date()
        };
        console.log('📍 Order location captured:', location);
    }

    // Create order
    const order = await Order.create({
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        user: userId || req.user?.id || '000000000000000000000000'
    });

    res.status(201).json({
        success: true,
        data: order
    });
});

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private/Admin
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            error: `Order not found with id of ${req.params.id} `
        });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address
    };

    const updatedOrder = await order.save();

    res.status(200).json({
        success: true,
        data: updatedOrder
    });
});

// @desc    Update order to delivered
// @route   PUT /api/v1/orders/:id/deliver
// @access  Private/Admin
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            error: `Order not found with id of ${req.params.id} `
        });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
        success: true,
        data: updatedOrder
    });
});

// @desc    Delete order
// @route   DELETE /api/v1/orders/:id
// @access  Private/Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            error: `Order not found with id of ${req.params.id} `
        });
    }

    await order.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get dashboard stats
// @route   GET /api/v1/orders/stats
// @access  Private/Admin
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalTests = await Test.countDocuments();

    // Calculate total sales
    const orders = await Order.find({ isPaid: true });
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Get recent orders with location
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name');

    // Add distance calculation if admin location provided
    const { adminLat, adminLon } = req.query;
    if (adminLat && adminLon) {
        recentOrders.forEach(order => {
            if (order.shippingAddress?.location?.latitude) {
                const distance = calculateDistance(
                    parseFloat(adminLat),
                    parseFloat(adminLon),
                    order.shippingAddress.location.latitude,
                    order.shippingAddress.location.longitude
                );
                order._doc.distance = formatDistance(distance);
                order._doc.distanceKm = distance;
            }
        });
    }

    // Calculate orderData (orders per month)
    const orderStats = await Order.aggregate([
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 }
            }
        }
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const orderData = months.map((month, index) => {
        const stat = orderStats.find(s => s._id === index + 1);
        return {
            name: month,
            orders: stat ? stat.count : 0
        };
    });

    // Calculate categoryData (tests per category)
    const categoryStats = await Test.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 }
            }
        }
    ]);

    const categoryData = categoryStats.map(stat => ({
        name: stat._id,
        value: stat.count
    }));

    res.status(200).json({
        success: true,
        data: {
            stats: {
                totalTests,
                totalOrders,
                totalUsers,
                totalRevenue: totalSales
            },
            orderData,
            categoryData,
            recentOrders
        }
    });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return res.status(404).json({
            success: false,
            error: `Order not found with id of ${req.params.id} `
        });
    }

    order.orderStatus = req.body.status;

    if (req.body.status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    await order.save();

    res.status(200).json({
        success: true,
        data: order
    });
});
