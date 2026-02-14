const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;

        // Validate phone & password
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide phone and password'
            });
        }

        // Check for user
        const user = await User.findOne({ phone }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Admin Login
// @route   POST /api/v1/auth/admin/login
// @access  Public
exports.adminLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        console.log('Admin login attempt:', { username });

        // Validate username & password
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide username and password'
            });
        }

        // Check for admin user (username: admin, password: admin123)
        if (username === 'admin' && password === 'admin123') {
            try {
                // Try to find or create admin user in database
                let adminUser = await User.findOne({ phone: 'admin' });

                if (!adminUser) {
                    console.log('Creating new admin user in database');
                    adminUser = await User.create({
                        name: 'Admin User',
                        phone: 'admin',
                        email: 'admin@futurelabs.com',
                        password: 'admin123',
                        role: 'admin',
                        isVerified: true
                    });
                }

                console.log('Admin user found/created:', adminUser._id);
                return sendTokenResponse(adminUser, 200, res);
            } catch (dbError) {
                // If database fails, generate token manually
                console.error('Database error in admin login, using manual token generation:', dbError.message);

                const jwt = require('jsonwebtoken');
                const token = jwt.sign(
                    { id: 'admin-user-id', role: 'admin' },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '30d' }
                );

                return res.status(200).json({
                    success: true,
                    token,
                    data: {
                        id: 'admin-user-id',
                        name: 'Admin User',
                        email: 'admin@futurelabs.com',
                        phone: 'admin',
                        role: 'admin'
                    }
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                error: 'Invalid admin credentials'
            });
        }
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({
            success: false,
            error: 'Server error: ' + err.message
        });
    }
};

// @desc    Logout user
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
};

// In-memory OTP store for development/mock mode
const mockOtpStore = {};

// @desc    Generate OTP for phone verification
// @route   POST /api/v1/auth/otp/generate
// @access  Public
exports.generateOTP = async (req, res, next) => {
    try {
        const { phone } = req.body;

        console.log('📱 OTP Generation Request for:', phone);

        // Validate phone
        if (!phone) {
            return res.status(400).json({
                success: false,
                error: 'Please provide phone number'
            });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        console.log('🔑 Generated OTP:', otp);

        let user;
        let isMockMode = false;
        try {
            user = await User.findOne({ phone });

            if (!user) {
                console.log('👤 Creating new user with phone:', phone);
                user = new User({
                    phone,
                    name: 'User',
                    email: `user${phone}@temp.com`,
                    password: 'temp123456',
                    otp,
                    otpExpires
                });
                await user.save();
            } else {
                console.log('👤 Updating existing user OTP');
                user.otp = otp;
                user.otpExpires = otpExpires;
                await user.save({ validateBeforeSave: false });
            }
        } catch (dbError) {
            console.log('❌ Database error:', dbError.message);
            isMockMode = true;
            mockOtpStore[phone] = { otp, otpExpires };
        }

        // Send OTP via SMS
        let smsSent = false;
        try {
            const smsResult = await sendSMS({
                phone: phone,
                message: `Your OTP for FutureLabs is: ${otp}. Valid for 10 minutes.`
            });

            console.log('📨 SMS Result:', smsResult);
            smsSent = smsResult.success;
        } catch (smsError) {
            console.error('📨 SMS Error:', smsError.message);
        }

        console.log('✅ OTP generated successfully');

        res.status(200).json({
            success: true,
            message: smsSent ? 'OTP sent successfully' : 'OTP generated (SMS failed)',
            phone,
            otp: otp, // Include for testing
            smsSent: smsSent
        });
    } catch (err) {
        console.error('❌ Generate OTP error:', err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Verify OTP
// @route   POST /api/v1/auth/otp/verify
// @access  Public
exports.verifyOTP = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;

        console.log('🔐 OTP Verification Request:', { phone, otp });

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                error: 'Please provide phone and OTP'
            });
        }

        let user;
        let isMockMode = false;
        try {
            user = await User.findOne({ phone }).select('+otp +otpExpires');
            console.log('👤 User found:', user ? 'Yes' : 'No');
            if (user) {
                console.log('   - Stored OTP:', user.otp);
                console.log('   - OTP Expires:', user.otpExpires);
            }
        } catch (error) {
            console.log('❌ Database error, checking mock store');
            isMockMode = true;
        }

        if (!user) {
            const mockData = mockOtpStore[phone];
            if (mockData) {
                console.log('📦 Using mock data:', mockData);
                if (mockData.otp === otp && mockData.otpExpires > Date.now()) {
                    const jwt = require('jsonwebtoken');
                    const token = jwt.sign(
                        { id: 'mock-user-id-' + phone },
                        process.env.JWT_SECRET,
                        { expiresIn: process.env.JWT_EXPIRE }
                    );
                    return res.status(200).json({
                        success: true,
                        token,
                        data: {
                            id: 'mock-user-id-' + phone,
                            name: 'User',
                            email: `user${phone}@temp.com`,
                            phone: phone,
                            role: 'user'
                        }
                    });
                }
            }

            return res.status(400).json({
                success: false,
                error: 'User not found or invalid OTP'
            });
        }

        if (user.otp !== otp) {
            console.log('❌ OTP mismatch');
            return res.status(400).json({
                success: false,
                error: 'Invalid OTP'
            });
        }

        if (user.otpExpires < Date.now()) {
            console.log('❌ OTP expired');
            return res.status(400).json({
                success: false,
                error: 'OTP has expired'
            });
        }

        console.log('✅ OTP verified successfully');

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return sendTokenResponse(user, 200, res);

    } catch (err) {
        console.error('❌ Verify OTP error:', err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        // Handle mock user from middleware
        if (req.user && req.user.id && req.user.id.startsWith('mock-user-id-')) {
            return res.status(200).json({
                success: true,
                data: req.user
            });
        }

        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email
        };

        if (req.body.addresses) {
            fieldsToUpdate.addresses = req.body.addresses;
        }

        // Handle mock user
        if (req.user.id.startsWith('mock-user-id-')) {
            const updatedUser = {
                ...req.user,
                name: req.body.name || req.user.name,
                email: req.body.email || req.user.email,
                addresses: req.body.addresses || req.user.addresses || []
            };
            return res.status(200).json({
                success: true,
                data: updatedUser
            });
        }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
};