const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // console.log('Auth Middleware - Token:', token); // Debug log

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }

    try {
        // Check for mock token (dev mode without DB)
        if (token.startsWith('mock-jwt-token-for-')) {
            const phone = token.replace('mock-jwt-token-for-', '');
            console.log('Auth Middleware - Mock Token Detected for phone:', phone); // Debug log
            req.user = {
                id: 'mock-user-id-' + phone,
                name: 'Guest User',
                email: 'guest@example.com',
                phone: phone,
                role: 'user'
            };
            console.log('Auth Middleware - Mock User created:', req.user); // Debug log
            return next();
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Handle admin user from manual token generation
        if (decoded.id === 'admin-user-id') {
            req.user = {
                id: 'admin-user-id',
                _id: 'admin-user-id',
                name: 'Admin User',
                email: 'admin@futurelabs.com',
                phone: 'admin',
                role: 'admin'
            };
            return next();
        }

        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not found'
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to access this route'
        });
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};