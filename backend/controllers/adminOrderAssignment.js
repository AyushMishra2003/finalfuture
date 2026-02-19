const Order = require('../models/Order');
const CollectorFolder = require('../models/CollectorFolder');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const { calculateDistance, calculateFare, formatDistance, getAddressFromCoordinates } = require('../utils/locationUtils');

// @desc    Get unassigned orders with distance calculation
// @route   GET /api/v1/admin/orders/unassigned
// @access  Private/Admin
exports.getUnassignedOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    'bookingDetails.collectorFolderId': { $exists: false }
  }).populate('user', 'name phone email').sort('-createdAt');

  // Add readable address from GPS coordinates
  const ordersWithAddress = await Promise.all(
    orders.map(async (order) => {
      const orderObj = order.toObject();
      const lat = order.shippingAddress?.location?.latitude;
      const lon = order.shippingAddress?.location?.longitude;
      
      if (lat && lon) {
        const addressData = await getAddressFromCoordinates(lat, lon);
        if (addressData) {
          orderObj.readableAddress = `${addressData.address}, ${addressData.city}, ${addressData.state} ${addressData.postcode}`.trim();
        }
      }
      
      return orderObj;
    })
  );

  res.status(200).json({
    success: true,
    count: ordersWithAddress.length,
    data: ordersWithAddress
  });
});

// @desc    Get available collectors with distance from order
// @route   GET /api/v1/admin/orders/:orderId/available-collectors
// @access  Private/Admin
exports.getAvailableCollectors = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }

  const orderLat = order.shippingAddress?.location?.latitude;
  const orderLon = order.shippingAddress?.location?.longitude;

  if (!orderLat || !orderLon) {
    return res.status(400).json({
      success: false,
      error: 'Order location not available'
    });
  }

  // Get ALL active collectors (not filtered by pincode)
  const collectors = await CollectorFolder.find({
    isActive: true
  }).populate('phlebotomistId', 'name phone email');

  // Calculate distance for each collector
  const collectorsWithDistance = await Promise.all(
    collectors.map(async (collector) => {
      const phlebotomist = await User.findById(collector.phlebotomistId);
      
      let distance = null;
      let fare = null;
      let collectorLocation = 'Service area: ' + collector.pincodes.join(', ');
      
      // Try to get distance from phlebotomist location if available
      if (phlebotomist?.location?.latitude && phlebotomist?.location?.longitude) {
        distance = calculateDistance(
          orderLat,
          orderLon,
          phlebotomist.location.latitude,
          phlebotomist.location.longitude
        );
        fare = calculateFare(distance);
      } else {
        // If no phlebotomist location, estimate based on pincode match
        const orderPincode = order.shippingAddress?.postalCode;
        if (orderPincode && collector.pincodes.includes(orderPincode)) {
          distance = 2; // Assume 2km for same pincode area
          fare = calculateFare(distance);
          collectorLocation = `Same area (${orderPincode})`;
        } else {
          distance = 5; // Assume 5km for nearby areas
          fare = calculateFare(distance);
        }
      }

      return {
        _id: collector._id,
        name: collector.name,
        phlebotomist: {
          _id: phlebotomist?._id,
          name: phlebotomist?.name,
          phone: phlebotomist?.phone
        },
        pincodes: collector.pincodes,
        maxOrdersPerHour: collector.maxOrdersPerHour,
        workingHours: collector.workingHours,
        distance: distance ? formatDistance(distance) : 'N/A',
        distanceKm: distance || 0,
        estimatedFare: fare ? `₹${fare}` : '₹50',
        location: collectorLocation
      };
    })
  );

  // Sort by distance
  collectorsWithDistance.sort((a, b) => {
    if (a.distanceKm === null) return 1;
    if (b.distanceKm === null) return -1;
    return a.distanceKm - b.distanceKm;
  });

  res.status(200).json({
    success: true,
    count: collectorsWithDistance.length,
    orderLocation: {
      latitude: orderLat,
      longitude: orderLon,
      address: order.shippingAddress.address
    },
    data: collectorsWithDistance
  });
});

// @desc    Assign order to collector
// @route   POST /api/v1/admin/orders/:orderId/assign
// @access  Private/Admin
exports.assignOrderToCollector = asyncHandler(async (req, res) => {
  const { collectorFolderId, scheduledDate, scheduledHour } = req.body;

  const order = await Order.findById(req.params.orderId);
  
  if (!order) {
    return res.status(404).json({
      success: false,
      error: 'Order not found'
    });
  }

  const collector = await CollectorFolder.findById(collectorFolderId)
    .populate('phlebotomistId', 'name phone');

  if (!collector) {
    return res.status(404).json({
      success: false,
      error: 'Collector not found'
    });
  }

  // Update order with booking details
  order.bookingDetails = {
    collectorFolderId: collector._id,
    collectorName: collector.name,
    scheduledDate: scheduledDate || new Date(),
    scheduledHour: scheduledHour || 9,
    timeRange: `${scheduledHour || 9}:00 - ${(scheduledHour || 9) + 1}:00`,
    bookedAt: new Date()
  };
  order.orderStatus = 'scheduled';

  await order.save();

  res.status(200).json({
    success: true,
    message: 'Order assigned successfully',
    data: order
  });
});

// @desc    Get all assigned orders with collector details
// @route   GET /api/v1/admin/orders/assigned
// @access  Private/Admin
exports.getAssignedOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    'bookingDetails.collectorFolderId': { $exists: true }
  })
    .populate('user', 'name phone email')
    .populate('bookingDetails.collectorFolderId')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

module.exports = exports;
