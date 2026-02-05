const User = require('../models/User');
const Order = require('../models/Order');
const CollectorFolder = require('../models/CollectorFolder');
const TimeSlot = require('../models/TimeSlot');

// @desc    Collector login
// @route   POST /api/v1/collector/login
// @access  Public
exports.collectorLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;

        console.log('🔐 Collector Login Attempt:', { phone, passwordLength: password?.length });

        // Validate input
        if (!phone || !password) {
            console.log('❌ Missing credentials');
            return res.status(400).json({
                success: false,
                error: 'Please provide phone and password'
            });
        }

        // Check for user
        console.log('🔍 Searching for user with phone:', phone);
        const user = await User.findOne({ phone }).select('+password');

        console.log('👤 User found:', user ? 'Yes' : 'No');
        if (user) {
            console.log('   - Name:', user.name);
            console.log('   - Role:', user.role);
            console.log('   - Has password:', !!user.password);
            console.log('   - Has matchPassword method:', typeof user.matchPassword);
        }

        if (!user) {
            console.log('❌ User not found');
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if user is a collector
        if (user.role !== 'collector') {
            console.log('❌ User is not a collector, role:', user.role);
            return res.status(403).json({
                success: false,
                error: 'Access denied. Collector account required.'
            });
        }

        // Check if password matches
        console.log('🔑 Checking password match...');
        const isMatch = await user.matchPassword(password);
        console.log('   - Password match result:', isMatch);

        if (!isMatch) {
            console.log('❌ Password does not match');
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Create token
        console.log('✅ Login successful, creating token...');
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role
            }
        });
        console.log('✅ Response sent successfully');
    } catch (error) {
        console.error('❌ Collector login error:', error);
        console.error('   - Error name:', error.name);
        console.error('   - Error message:', error.message);
        console.error('   - Stack:', error.stack);
        res.status(500).json({
            success: false,
            error: 'Server error during login',
            details: error.message,
            stack: error.stack // Temporary for debugging
        });
    }
};

// @desc    Get collector profile
// @route   GET /api/v1/collector/profile
// @access  Private (Collector)
exports.getCollectorProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get collector profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update collector profile
// @route   PUT /api/v1/collector/profile
// @access  Private (Collector)
exports.updateCollectorProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Update collector profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get collector's assigned bookings
// @route   GET /api/v1/collector/bookings
// @access  Private (Collector)
exports.getMyBookings = async (req, res) => {
    try {
        const { date, status } = req.query;

        // Find collector folder for this user
        const collectorFolder = await CollectorFolder.findOne({
            phlebotomistId: req.user.id
        });

        if (!collectorFolder) {
            return res.status(404).json({
                success: false,
                error: 'No collector folder assigned to this user'
            });
        }

        // Build query
        let query = { collectorFolderId: collectorFolder._id };

        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        } else {
            // Default to today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            query.date = { $gte: today, $lt: tomorrow };
        }

        // Find time slots with bookings
        const timeSlots = await TimeSlot.find(query)
            .populate({
                path: 'bookings.orderId',
                populate: {
                    path: 'user',
                    select: 'name phone email'
                }
            })
            .sort({ date: 1, hour: 1 });

        // Extract and format bookings
        const bookings = [];
        timeSlots.forEach(slot => {
            slot.bookings.forEach(booking => {
                if (booking.orderId) {
                    bookings.push({
                        _id: booking._id,
                        orderId: booking.orderId._id,
                        orderNumber: booking.orderId.orderNumber,
                        patient: {
                            name: booking.patientName || booking.orderId.user?.name,
                            phone: booking.patientPhone || booking.orderId.user?.phone,
                            address: booking.orderId.shippingAddress
                        },
                        scheduledTime: {
                            date: slot.date,
                            hour: slot.hour
                        },
                        tests: booking.orderId.orderItems,
                        totalAmount: booking.orderId.totalPrice,
                        paymentMethod: booking.orderId.paymentMethod,
                        isPaid: booking.orderId.isPaid,
                        status: booking.status || 'pending',
                        sampleStatus: booking.sampleStatus || {},
                        paymentCollected: booking.paymentCollected || 0,
                        sampleHandedOver: booking.sampleHandedOver || false,
                        amountHandedOver: booking.amountHandedOver || false,
                        createdAt: booking.createdAt
                    });
                }
            });
        });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
            collectorInfo: {
                name: collectorFolder.name,
                pincodes: collectorFolder.pincodes
            }
        });
    } catch (error) {
        console.error('Get collector bookings error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update booking status
// @route   PUT /api/v1/collector/bookings/:bookingId/status
// @access  Private (Collector)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body; // 'reached', 'collected', 'moving_to_next'

        // Find the time slot containing this booking
        const timeSlot = await TimeSlot.findOne({ 'bookings._id': bookingId });

        if (!timeSlot) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        // Update booking status
        const booking = timeSlot.bookings.id(bookingId);
        if (booking) {
            booking.status = status;
            if (status === 'reached') {
                booking.reachedAt = new Date();
            } else if (status === 'collected') {
                booking.collectedAt = new Date();
            }
            await timeSlot.save();
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Update booking status error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update sample collection status
// @route   PUT /api/v1/collector/bookings/:bookingId/sample
// @access  Private (Collector)
exports.updateSampleStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { sampleType, collected, image, collectedAt } = req.body;

        const timeSlot = await TimeSlot.findOne({ 'bookings._id': bookingId });

        if (!timeSlot) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        const booking = timeSlot.bookings.id(bookingId);
        if (booking) {
            if (!booking.sampleStatus) {
                booking.sampleStatus = {};
            }

            booking.sampleStatus[sampleType] = {
                collected,
                image,
                collectedAt: collectedAt || new Date()
            };

            await timeSlot.save();
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Update sample status error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update payment status
// @route   PUT /api/v1/collector/bookings/:bookingId/payment
// @access  Private (Collector)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { paymentCollected, paymentMethod } = req.body;

        const timeSlot = await TimeSlot.findOne({ 'bookings._id': bookingId });

        if (!timeSlot) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        const booking = timeSlot.bookings.id(bookingId);
        if (booking) {
            booking.paymentCollected = paymentCollected;
            booking.paymentCollectedAt = new Date();

            // Update order payment status
            if (booking.orderId) {
                await Order.findByIdAndUpdate(booking.orderId, {
                    isPaid: true,
                    paidAt: new Date(),
                    paymentMethod: paymentMethod || 'Cash on Collection'
                });
            }

            await timeSlot.save();
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Update payment status error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Complete sample and amount handover
// @route   PUT /api/v1/collector/bookings/:bookingId/handover
// @access  Private (Collector)
exports.completeHandover = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { sampleHandedOver, amountHandedOver } = req.body;

        const timeSlot = await TimeSlot.findOne({ 'bookings._id': bookingId });

        if (!timeSlot) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        const booking = timeSlot.bookings.id(bookingId);
        if (booking) {
            if (sampleHandedOver !== undefined) {
                booking.sampleHandedOver = sampleHandedOver;
                booking.sampleHandoverAt = new Date();
            }
            if (amountHandedOver !== undefined) {
                booking.amountHandedOver = amountHandedOver;
                booking.amountHandoverAt = new Date();
            }

            // Update order status if both are handed over
            if (booking.sampleHandedOver && booking.amountHandedOver) {
                await Order.findByIdAndUpdate(booking.orderId, {
                    status: 'processing',
                    collectionCompleted: true,
                    collectionCompletedAt: new Date()
                });
            }

            await timeSlot.save();
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Complete handover error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};
