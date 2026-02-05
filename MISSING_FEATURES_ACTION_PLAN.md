# Missing Features - Implementation Action Plan

## Overview
This document outlines the implementation plan for missing or incomplete features identified in the frontend-backend analysis.

---

## 🔴 HIGH PRIORITY - Implement Immediately

### 1. Password Reset Flow

**Status**: ❌ Not Implemented  
**Impact**: High - Essential security feature  
**Effort**: Medium (4-6 hours)

#### Backend Implementation

**Step 1: Update User Model** (`backend/models/User.js`)
```javascript
// Add these fields to User schema
resetPasswordToken: String,
resetPasswordExpire: Date,

// Add method to generate reset token
UserSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    return resetToken;
};
```

**Step 2: Add Controller Methods** (`backend/controllers/auth.js`)
```javascript
// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
        return res.status(404).json({
            success: false,
            error: 'No user found with that email'
        });
    }
    
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    
    const message = `You requested a password reset. Please visit: ${resetUrl}`;
    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message
        });
        
        res.status(200).json({
            success: true,
            data: 'Email sent'
        });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        
        return res.status(500).json({
            success: false,
            error: 'Email could not be sent'
        });
    }
};

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');
    
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
        return res.status(400).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
    
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    
    sendTokenResponse(user, 200, res);
};
```

**Step 3: Add Routes** (`backend/routes/auth.js`)
```javascript
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
```

#### Frontend Implementation

**Step 1: Create ForgotPassword Component** (`frontend/src/pages/ForgotPassword.jsx`)
```jsx
import React, { useState } from 'react';
import { baseUrl } from '../utils/config';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        
        try {
            const response = await fetch(`${baseUrl}/api/v1/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setMessage('Password reset email sent! Check your inbox.');
            } else {
                setError(data.error || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to send reset email');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default ForgotPassword;
```

**Step 2: Create ResetPassword Component** (`frontend/src/pages/ResetPassword.jsx`)
```jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/config';

const ResetPassword = () => {
    const { resetToken } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch(`${baseUrl}/api/v1/auth/reset-password/${resetToken}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Password reset successful! Please login.');
                navigate('/');
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            setError('Failed to reset password');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default ResetPassword;
```

**Step 3: Add Routes** (`frontend/src/App.js`)
```jsx
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Add these routes
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:resetToken" element={<ResetPassword />} />
```

---

### 2. Rate Limiting for Security

**Status**: ❌ Not Implemented  
**Impact**: High - Security vulnerability  
**Effort**: Low (1-2 hours)

#### Implementation

**Step 1: Install Dependencies**
```bash
npm install express-rate-limit
```

**Step 2: Create Rate Limiter Middleware** (`backend/middleware/rateLimiter.js`)
```javascript
const rateLimit = require('express-rate-limit');

// General API limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

// Strict limiter for authentication
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // limit each IP to 5 login attempts per 15 minutes
    message: 'Too many login attempts, please try again later.'
});

// OTP generation limiter
const otpLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 OTP requests per hour
    message: 'Too many OTP requests, please try again later.'
});

module.exports = { apiLimiter, authLimiter, otpLimiter };
```

**Step 3: Apply Rate Limiters** (`backend/server.js`)
```javascript
const { apiLimiter, authLimiter, otpLimiter } = require('./middleware/rateLimiter');

// Apply to all API routes
app.use('/api/', apiLimiter);

// Apply to auth routes
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/admin/login', authLimiter);
app.use('/api/v1/auth/otp/generate', otpLimiter);
```

---

### 3. Comprehensive Error Logging

**Status**: Partial  
**Impact**: High - Critical for debugging  
**Effort**: Medium (2-3 hours)

#### Implementation

**Step 1: Install Winston**
```bash
npm install winston winston-daily-rotate-file
```

**Step 2: Create Logger** (`backend/utils/logger.js`)
```javascript
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        // Write all logs to rotating files
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '14d'
        }),
        // Write errors to separate file
        new DailyRotateFile({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxFiles: '30d'
        })
    ]
});

module.exports = logger;
```

**Step 3: Update Error Handler** (`backend/middleware/errorHandler.js`)
```javascript
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    // Log error
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        user: req.user?.id
    });
    
    res.status(err.statusCode || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
};

module.exports = errorHandler;
```

**Step 4: Add Request Logging** (`backend/server.js`)
```javascript
const logger = require('./utils/logger');

// Log all requests
app.use((req, res, next) => {
    logger.info({
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
});
```

---

## 🟡 MEDIUM PRIORITY - Next Sprint

### 4. User Reviews & Ratings System

**Status**: ❌ Not Implemented  
**Impact**: Medium - Improves trust and engagement  
**Effort**: High (8-10 hours)

#### Backend Implementation

**Step 1: Create Review Model** (`backend/models/Review.js`)
```javascript
const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    test: {
        type: mongoose.Schema.ObjectId,
        ref: 'Test',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating'],
        min: 1,
        max: 5
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        maxlength: 100
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment'],
        maxlength: 500
    },
    helpful: {
        type: Number,
        default: 0
    },
    verified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent duplicate reviews
ReviewSchema.index({ test: 1, user: 1 }, { unique: true });

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function(testId) {
    const obj = await this.aggregate([
        {
            $match: { test: testId }
        },
        {
            $group: {
                _id: '$test',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);
    
    try {
        await this.model('Test').findByIdAndUpdate(testId, {
            averageRating: obj[0]?.averageRating || 0,
            totalReviews: obj[0]?.totalReviews || 0
        });
    } catch (err) {
        console.error(err);
    }
};

// Update average rating after save
ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.test);
});

// Update average rating after remove
ReviewSchema.post('remove', function() {
    this.constructor.getAverageRating(this.test);
});

module.exports = mongoose.model('Review', ReviewSchema);
```

**Step 2: Update Test Model** (`backend/models/Test.js`)
```javascript
// Add these fields to Test schema
averageRating: {
    type: Number,
    default: 0
},
totalReviews: {
    type: Number,
    default: 0
}
```

**Step 3: Create Review Controller** (`backend/controllers/reviews.js`)
```javascript
const Review = require('../models/Review');
const Test = require('../models/Test');
const asyncHandler = require('../middleware/async');

// @desc    Get reviews for a test
// @route   GET /api/v1/tests/:testId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ test: req.params.testId })
        .populate('user', 'name')
        .sort('-createdAt');
    
    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

// @desc    Create review
// @route   POST /api/v1/tests/:testId/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
    req.body.test = req.params.testId;
    req.body.user = req.user.id;
    
    const test = await Test.findById(req.params.testId);
    
    if (!test) {
        return res.status(404).json({
            success: false,
            error: 'Test not found'
        });
    }
    
    const review = await Review.create(req.body);
    
    res.status(201).json({
        success: true,
        data: review
    });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
    
    if (!review) {
        return res.status(404).json({
            success: false,
            error: 'Review not found'
        });
    }
    
    // Make sure user is review owner
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to update this review'
        });
    }
    
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
        return res.status(404).json({
            success: false,
            error: 'Review not found'
        });
    }
    
    // Make sure user is review owner
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({
            success: false,
            error: 'Not authorized to delete this review'
        });
    }
    
    await review.remove();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});
```

**Step 4: Create Review Routes** (`backend/routes/reviews.js`)
```javascript
const express = require('express');
const {
    getReviews,
    createReview,
    updateReview,
    deleteReview
} = require('../controllers/reviews');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getReviews)
    .post(protect, createReview);

router.route('/:id')
    .put(protect, updateReview)
    .delete(protect, deleteReview);

module.exports = router;
```

**Step 5: Mount Review Routes** (`backend/server.js`)
```javascript
const reviewRoutes = require('./routes/reviews');

// Re-route into other resource routers
app.use('/api/v1/tests/:testId/reviews', reviewRoutes);
app.use('/api/v1/reviews', reviewRoutes);
```

---

### 5. Advanced Search & Filters

**Status**: Basic implementation  
**Impact**: Medium - Improves user experience  
**Effort**: Medium (4-6 hours)

#### Backend Implementation

**Update Test Controller** (`backend/controllers/tests.js`)
```javascript
// @desc    Advanced search tests
// @route   GET /api/v1/tests/search
// @access  Public
exports.advancedSearch = asyncHandler(async (req, res, next) => {
    const {
        keyword,
        category,
        minPrice,
        maxPrice,
        sortBy,
        rating
    } = req.query;
    
    let query = {};
    
    // Keyword search
    if (keyword) {
        query.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { category: { $regex: keyword, $options: 'i' } }
        ];
    }
    
    // Category filter
    if (category) {
        query.category = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    // Rating filter
    if (rating) {
        query.averageRating = { $gte: Number(rating) };
    }
    
    // Build sort option
    let sortOption = {};
    if (sortBy === 'price-asc') sortOption.price = 1;
    else if (sortBy === 'price-desc') sortOption.price = -1;
    else if (sortBy === 'rating') sortOption.averageRating = -1;
    else if (sortBy === 'popular') sortOption.totalReviews = -1;
    else sortOption.createdAt = -1;
    
    const tests = await Test.find(query).sort(sortOption);
    
    res.status(200).json({
        success: true,
        count: tests.length,
        data: tests
    });
});
```

#### Frontend Implementation

**Create Advanced Search Component** (`frontend/src/components/AdvancedSearch.jsx`)
```jsx
import React, { useState } from 'react';
import { baseUrl } from '../utils/config';

const AdvancedSearch = ({ onResults }) => {
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'newest',
        rating: ''
    });
    
    const handleSearch = async () => {
        const queryParams = new URLSearchParams();
        
        Object.keys(filters).forEach(key => {
            if (filters[key]) {
                queryParams.append(key, filters[key]);
            }
        });
        
        try {
            const response = await fetch(
                `${baseUrl}/api/v1/tests/search?${queryParams.toString()}`
            );
            const data = await response.json();
            
            if (data.success) {
                onResults(data.data);
            }
        } catch (error) {
            console.error('Search error:', error);
        }
    };
    
    return (
        <div className="advanced-search">
            <input
                type="text"
                placeholder="Search tests..."
                value={filters.keyword}
                onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            />
            
            <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
                <option value="">All Categories</option>
                <option value="Full Body Checkup">Full Body Checkup</option>
                <option value="Women Care">Women Care</option>
                <option value="Men Care">Men Care</option>
            </select>
            
            <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
            />
            
            <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
            />
            
            <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
            </select>
            
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default AdvancedSearch;
```

---

## 🟢 LOW PRIORITY - Future Enhancement

### 6. File Upload System

**Recommendation**: Use Cloudinary or AWS S3
**Effort**: Medium (4-6 hours)

### 7. Email Notifications

**Recommendation**: Complete integration with existing email service
**Effort**: Low (2-3 hours)

### 8. Push Notifications

**Recommendation**: Use Firebase Cloud Messaging
**Effort**: High (10-12 hours)

### 9. Advanced Analytics

**Recommendation**: Integrate Google Analytics or Mixpanel
**Effort**: High (12-15 hours)

---

## Implementation Timeline

### Week 1
- ✅ Password Reset Flow (Day 1-2)
- ✅ Rate Limiting (Day 2)
- ✅ Error Logging (Day 3)

### Week 2
- ⚠️ User Reviews System (Day 1-3)
- ⚠️ Advanced Search (Day 4-5)

### Week 3
- 📊 File Upload System (Day 1-2)
- 📊 Email Notifications (Day 3)
- 📊 Testing & Bug Fixes (Day 4-5)

---

## Testing Checklist

After implementing each feature:

- [ ] Unit tests written
- [ ] Integration tests passed
- [ ] Manual testing completed
- [ ] Security review done
- [ ] Performance tested
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Deployed to staging
- [ ] User acceptance testing

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-04  
**Priority**: High
