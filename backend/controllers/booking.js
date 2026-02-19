const CollectorFolder = require('../models/CollectorFolder');
const TimeSlot = require('../models/TimeSlot');
const Order = require('../models/Order');
const asyncHandler = require('../middleware/async');
const { sendBookingConfirmation, sendStatusUpdate } = require('../utils/sendBookingNotification');

// @desc    Get available time slots for a pincode
// @route   GET /api/v1/bookings/available-slots
// @access  Public
exports.getAvailableSlots = asyncHandler(async (req, res) => {
    const { pincode, date } = req.query;

    if (!pincode || !date) {
        return res.status(400).json({
            success: false,
            error: 'Please provide pincode and date'
        });
    }

    // Find collector folder for this pincode
    const folder = await CollectorFolder.findOne({
        pincodes: pincode,
        isActive: true
    });

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'No service available for this pincode'
        });
    }

    // Parse and validate date
    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);

    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (requestedDate < today) {
        return res.status(400).json({
            success: false,
            error: 'Cannot book slots for past dates'
        });
    }

    // Get or create time slots for the date
    const slots = [];
    for (let hour = folder.workingHours.start; hour < folder.workingHours.end; hour++) {
        let slot = await TimeSlot.findOne({
            collectorFolderId: folder._id,
            date: requestedDate,
            hour: hour
        });

        if (!slot) {
            // Create slot if doesn't exist
            slot = await TimeSlot.create({
                collectorFolderId: folder._id,
                date: requestedDate,
                hour: hour,
                maxBookings: folder.maxOrdersPerHour,
                currentBookings: 0,
                isAvailable: true
            });
        }

        slots.push({
            id: slot._id,
            hour: hour,
            timeRange: slot.timeRange,
            available: slot.isAvailable,
            currentBookings: slot.currentBookings,
            maxBookings: slot.maxBookings,
            remainingSlots: slot.remainingSlots
        });
    }

    res.status(200).json({
        success: true,
        data: {
            collectorFolder: folder.name,
            collectorFolderId: folder._id,
            date: requestedDate,
            slots: slots
        }
    });
});

// @desc    Find next available slot
// @route   GET /api/v1/bookings/next-available-slot
// @access  Public
exports.findNextAvailableSlot = asyncHandler(async (req, res) => {
    const { pincode, currentHour, date } = req.query;

    if (!pincode || !currentHour || !date) {
        return res.status(400).json({
            success: false,
            error: 'Please provide pincode, current hour, and date'
        });
    }

    const folder = await CollectorFolder.findOne({
        pincodes: pincode,
        isActive: true
    });

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'No service available for this pincode'
        });
    }

    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);

    // Search for next available slot on the same day
    for (let hour = parseInt(currentHour) + 1; hour < folder.workingHours.end; hour++) {
        let slot = await TimeSlot.findOne({
            collectorFolderId: folder._id,
            date: requestedDate,
            hour: hour
        });

        if (!slot) {
            // Slot doesn't exist, so it's available
            return res.status(200).json({
                success: true,
                data: {
                    available: true,
                    hour: hour,
                    timeRange: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`,
                    remainingSlots: folder.maxOrdersPerHour,
                    date: requestedDate
                }
            });
        }

        if (slot.currentBookings < slot.maxBookings) {
            return res.status(200).json({
                success: true,
                data: {
                    available: true,
                    hour: hour,
                    timeRange: slot.timeRange,
                    remainingSlots: slot.remainingSlots,
                    date: requestedDate
                }
            });
        }
    }

    // No slots available today, suggest next day
    const nextDay = new Date(requestedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    res.status(200).json({
        success: true,
        data: {
            available: false,
            message: 'No slots available today. Please try tomorrow.',
            nextAvailableDate: nextDay,
            suggestedTimeRange: `${folder.workingHours.start}:00 - ${folder.workingHours.start + 1}:00`
        }
    });
});

// @desc    Book a time slot
// @route   POST /api/v1/bookings/book-slot
// @access  Private
exports.bookTimeSlot = asyncHandler(async (req, res) => {
    const { orderId, pincode, date, hour } = req.body;

    if (!orderId || !pincode || !date || hour === undefined) {
        return res.status(400).json({
            success: false,
            error: 'Please provide order ID, pincode, date, and hour'
        });
    }

    // Find collector folder
    const folder = await CollectorFolder.findOne({
        pincodes: pincode,
        isActive: true
    });

    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'No service available for this pincode'
        });
    }

    const requestedDate = new Date(date);
    requestedDate.setHours(0, 0, 0, 0);

    // Find or create time slot
    let slot = await TimeSlot.findOne({
        collectorFolderId: folder._id,
        date: requestedDate,
        hour: parseInt(hour)
    });

    if (!slot) {
        slot = await TimeSlot.create({
            collectorFolderId: folder._id,
            date: requestedDate,
            hour: parseInt(hour),
            maxBookings: folder.maxOrdersPerHour,
            currentBookings: 0,
            isAvailable: true
        });
    }

    // Check if slot is available
    if (slot.currentBookings >= slot.maxBookings) {
        // Find next available slot
        const nextSlot = await findNextSlotHelper(folder._id, requestedDate, parseInt(hour), folder.workingHours.end, folder.maxOrdersPerHour);

        return res.status(400).json({
            success: false,
            error: 'This time slot is full',
            nextAvailable: nextSlot
        });
    }

    // Get order details
    const order = await Order.findById(orderId).populate('user');

    if (!order) {
        return res.status(404).json({
            success: false,
            error: 'Order not found'
        });
    }

    // Verify order belongs to user (if not admin)
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            error: 'Not authorized to book this order'
        });
    }

    // Generate 6-digit OTP
    const verificationOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Add booking to slot
    slot.bookings.push({
        orderId: order._id,
        patientName: order.user.name,
        patientPhone: order.user.phone,
        bookedAt: new Date()
    });
    slot.currentBookings += 1;
    await slot.save();

    // Update order with booking details
    order.bookingDetails = {
        collectorFolderId: folder._id,
        collectorName: folder.name,
        scheduledDate: requestedDate,
        scheduledHour: parseInt(hour),
        timeRange: slot.timeRange,
        bookedAt: new Date(),
        verificationOTP: verificationOTP,
        otpVerified: false,
        collectorStatus: 'pending',
        statusUpdates: [{
            status: 'booking_confirmed',
            updatedAt: new Date(),
            updatedBy: 'system'
        }]
    };
    order.orderStatus = 'scheduled';
    await order.save();

    // Send confirmation notifications with OTP
    await sendBookingConfirmation(order, verificationOTP);

    res.status(200).json({
        success: true,
        message: 'Booking confirmed successfully. OTP sent to customer.',
        data: {
            orderId: order._id,
            collectorName: folder.name,
            scheduledDate: requestedDate,
            timeRange: slot.timeRange,
            remainingSlots: slot.remainingSlots,
            verificationOTPSent: true
        }
    });
});

// @desc    Get bookings for a collector folder
// @route   GET /api/v1/bookings/collector/:folderId
// @access  Private/Admin
exports.getCollectorBookings = asyncHandler(async (req, res) => {
    const { folderId } = req.params;
    const { date } = req.query;

    const folder = await CollectorFolder.findById(folderId);
    if (!folder) {
        return res.status(404).json({
            success: false,
            error: 'Collector folder not found'
        });
    }

    let query = { collectorFolderId: folderId };

    if (date) {
        const requestedDate = new Date(date);
        requestedDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(requestedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        query.date = { $gte: requestedDate, $lt: nextDay };
    }

    const slots = await TimeSlot.find(query)
        .populate('bookings.orderId')
        .sort('date hour');

    res.status(200).json({
        success: true,
        count: slots.length,
        data: slots
    });
});

// @desc    Cancel a booking
// @route   DELETE /api/v1/bookings/cancel/:orderId
// @access  Private
exports.cancelBooking = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
        return res.status(404).json({
            success: false,
            error: 'Order not found'
        });
    }

    // Verify order belongs to user (if not admin)
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            error: 'Not authorized to cancel this booking'
        });
    }

    if (!order.bookingDetails) {
        return res.status(400).json({
            success: false,
            error: 'No booking found for this order'
        });
    }

    // Find and update the time slot
    const slot = await TimeSlot.findOne({
        collectorFolderId: order.bookingDetails.collectorFolderId,
        date: order.bookingDetails.scheduledDate,
        hour: order.bookingDetails.scheduledHour
    });

    if (slot) {
        slot.bookings = slot.bookings.filter(
            booking => booking.orderId.toString() !== order._id.toString()
        );
        slot.currentBookings = Math.max(0, slot.currentBookings - 1);
        await slot.save();
    }

    // Update order
    order.bookingDetails = undefined;
    order.orderStatus = 'pending';
    await order.save();

    res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: {}
    });
});

// Helper function to find next available slot
async function findNextSlotHelper(folderId, date, currentHour, endHour, maxBookings) {
    for (let hour = currentHour + 1; hour < endHour; hour++) {
        const slot = await TimeSlot.findOne({
            collectorFolderId: folderId,
            date: date,
            hour: hour
        });

        if (!slot || slot.currentBookings < slot.maxBookings) {
            return {
                hour: hour,
                timeRange: `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`,
                available: true
            };
        }
    }

    return {
        available: false,
        message: 'No more slots available today'
    };
}

// @desc    Verify OTP by collector
// @route   POST /api/v1/bookings/verify-otp
// @access  Private (Collector)
exports.verifyBookingOTP = asyncHandler(async (req, res) => {
    const { orderId, otp } = req.body;

    if (!orderId || !otp) {
        return res.status(400).json({
            success: false,
            error: 'Please provide order ID and OTP'
        });
    }

    const order = await Order.findById(orderId).populate('user');

    if (!order) {
        return res.status(404).json({
            success: false,
            error: 'Order not found'
        });
    }

    if (!order.bookingDetails || !order.bookingDetails.verificationOTP) {
        return res.status(400).json({
            success: false,
            error: 'No OTP found for this booking'
        });
    }

    if (order.bookingDetails.verificationOTP !== otp) {
        return res.status(400).json({
            success: false,
            error: 'Invalid OTP'
        });
    }

    // Mark OTP as verified
    order.bookingDetails.otpVerified = true;
    order.bookingDetails.otpVerifiedAt = new Date();
    order.bookingDetails.collectorStatus = 'reached';
    order.bookingDetails.statusUpdates.push({
        status: 'otp_verified',
        updatedAt: new Date(),
        updatedBy: req.user.name || 'collector'
    });
    await order.save();

    res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        data: {
            orderId: order._id,
            patientName: order.user.name,
            verified: true
        }
    });
});

// @desc    Update booking status by collector/pathology
// @route   PUT /api/v1/bookings/update-status/:orderId
// @access  Private (Collector/Admin)
exports.updateBookingStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'on_way', 'reached', 'collected', 'completed'];
    
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
    }

    const order = await Order.findById(orderId).populate('user');

    if (!order) {
        return res.status(404).json({
            success: false,
            error: 'Order not found'
        });
    }

    if (!order.bookingDetails) {
        return res.status(400).json({
            success: false,
            error: 'No booking found for this order'
        });
    }

    // Generate new OTP for status update
    const statusOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Update status
    const oldStatus = order.bookingDetails.collectorStatus;
    order.bookingDetails.collectorStatus = status;
    order.bookingDetails.verificationOTP = statusOTP;
    order.bookingDetails.statusUpdates.push({
        status: status,
        updatedAt: new Date(),
        updatedBy: req.user.name || req.user.role
    });

    // Update order status based on collector status
    if (status === 'collected') {
        order.orderStatus = 'processing';
    } else if (status === 'completed') {
        order.orderStatus = 'delivered';
        order.isDelivered = true;
        order.deliveredAt = new Date();
    }

    await order.save();

    // Send notification to customer with new OTP
    await sendStatusUpdate(order, status, notes, statusOTP);

    res.status(200).json({
        success: true,
        message: 'Status updated successfully. OTP sent to customer.',
        data: {
            orderId: order._id,
            oldStatus,
            newStatus: status,
            orderStatus: order.orderStatus,
            otpSent: true
        }
    });
});
