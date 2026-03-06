const Order = require('../models/Order');
const CollectorFolder = require('../models/CollectorFolder');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const { calculateDistance, calculateFare, formatDistance } = require('../utils/locationUtils');

// @desc    Get phlebotomist dashboard with assigned orders
// @route   GET /api/v1/phlebotomist/dashboard
// @access  Private/Collector
exports.getDashboard = asyncHandler(async (req, res) => {
  // Find collector folder for this phlebotomist
  const collectorFolder = await CollectorFolder.findOne({
    phlebotomistId: req.user.id,
    isActive: true
  });

  if (!collectorFolder) {
    return res.status(404).json({
      success: false,
      error: 'No collector folder assigned'
    });
  }

  // Get all orders assigned to this collector
  const orders = await Order.find({
    'bookingDetails.collectorFolderId': collectorFolder._id
  })
    .populate('user', 'name phone email')
    .sort('-bookingDetails.scheduledDate');

  // Get phlebotomist location
  const phlebotomist = await User.findById(req.user.id);
  const phlebLat = phlebotomist?.location?.latitude;
  const phlebLon = phlebotomist?.location?.longitude;

  // Calculate distance and fare for each order
  const ordersWithDistance = orders.map(order => {
    const orderObj = order.toObject();
    const orderLat = order.shippingAddress?.location?.latitude;
    const orderLon = order.shippingAddress?.location?.longitude;

    if (phlebLat && phlebLon && orderLat && orderLon) {
      const distance = calculateDistance(phlebLat, phlebLon, orderLat, orderLon);
      orderObj.distance = formatDistance(distance);
      orderObj.distanceKm = distance;
      orderObj.estimatedFare = `₹${calculateFare(distance)}`;
    } else {
      orderObj.distance = 'N/A';
      orderObj.distanceKm = null;
      orderObj.estimatedFare = 'N/A';
    }

    return orderObj;
  });

  // Sort by distance (nearest first)
  ordersWithDistance.sort((a, b) => {
    if (a.distanceKm === null) return 1;
    if (b.distanceKm === null) return -1;
    return a.distanceKm - b.distanceKm;
  });

  // Calculate stats
  const stats = {
    totalOrders: orders.length,
    pending: orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'scheduled').length,
    completed: orders.filter(o => o.orderStatus === 'delivered').length,
    inProgress: orders.filter(o => o.orderStatus === 'processing').length,
    totalRevenue: orders.filter(o => o.isPaid).reduce((sum, o) => sum + o.totalPrice, 0)
  };

  res.status(200).json({
    success: true,
    collectorFolder: {
      name: collectorFolder.name,
      pincodes: collectorFolder.pincodes,
      workingHours: collectorFolder.workingHours
    },
    phlebotomistLocation: phlebotomist?.location || null,
    stats,
    orders: ordersWithDistance
  });
});

// @desc    Update phlebotomist location
// @route   PUT /api/v1/phlebotomist/location
// @access  Private/Collector
exports.updateLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude, address } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      error: 'Please provide latitude and longitude'
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      location: {
        latitude,
        longitude,
        address: address || '',
        updatedAt: new Date()
      }
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: 'Location updated successfully',
    data: user.location
  });
});

// @desc    Get single order details with navigation
// @route   GET /api/v1/phlebotomist/orders/:orderId
// @access  Private/Collector
exports.getOrderDetails = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId)
    .populate('user', 'name phone email');

  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }

  // Verify this order is assigned to this phlebotomist
  const collectorFolder = await CollectorFolder.findOne({
    phlebotomistId: req.user.id,
    _id: order.bookingDetails?.collectorFolderId
  });

  if (!collectorFolder) {
    return res.status(403).json({
      success: false,
      error: 'Not authorized to view this order'
    });
  }

  // Calculate distance
  const phlebotomist = await User.findById(req.user.id);
  const orderObj = order.toObject();
  
  if (phlebotomist?.location?.latitude && order.shippingAddress?.location?.latitude) {
    const distance = calculateDistance(
      phlebotomist.location.latitude,
      phlebotomist.location.longitude,
      order.shippingAddress.location.latitude,
      order.shippingAddress.location.longitude
    );
    orderObj.distance = formatDistance(distance);
    orderObj.distanceKm = distance;
    orderObj.estimatedFare = `₹${calculateFare(distance)}`;
    
    // Generate Google Maps URL
    orderObj.navigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${phlebotomist.location.latitude},${phlebotomist.location.longitude}&destination=${order.shippingAddress.location.latitude},${order.shippingAddress.location.longitude}`;
  }

  res.status(200).json({
    success: true,
    data: orderObj
  });
});

// @desc    Update order status
// @route   PUT /api/v1/phlebotomist/orders/:orderId/status
// @access  Private/Collector
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, sampleCollected, paymentCollected } = req.body;

  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }

  const collectorFolder = await CollectorFolder.findOne({
    phlebotomistId: req.user.id,
    _id: order.bookingDetails?.collectorFolderId
  });

  if (!collectorFolder) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }

  if (status) order.orderStatus = status;
  if (sampleCollected !== undefined) order.sampleCollected = sampleCollected;
  if (paymentCollected !== undefined) order.paymentCollected = paymentCollected;

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({ success: true, message: 'Order updated', data: order });
});

// @desc    Upload sample photo
// @route   POST /api/v1/phlebotomist/orders/:orderId/sample-photo
// @access  Private/Collector
exports.uploadSamplePhoto = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

  if (!req.file) return res.status(400).json({ success: false, error: 'No photo uploaded' });

  const photoUrl = `/uploads/samples/${req.file.filename}`;
  
  if (!order.samplePhotos) order.samplePhotos = [];
  order.samplePhotos.push({
    url: photoUrl,
    uploadedAt: new Date(),
    uploadedBy: req.user.id
  });

  await order.save();

  res.status(200).json({ success: true, message: 'Photo uploaded', data: { photoUrl } });
});

// @desc    Collect payment
// @route   POST /api/v1/phlebotomist/orders/:orderId/collect-payment
// @access  Private/Collector
exports.collectPayment = asyncHandler(async (req, res) => {
  const { amount, method } = req.body;
  const order = await Order.findById(req.params.orderId);
  
  if (!order) return res.status(404).json({ success: false, error: 'Order not found' });

  order.paymentCollected = true;
  order.paymentMethod = method || 'Cash';
  order.isPaid = true;
  order.paidAt = new Date();

  await order.save();

  res.status(200).json({ success: true, message: 'Payment collected', data: order });
});

