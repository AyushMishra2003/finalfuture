# 🔐 Security Enhancement Guide

**Priority:** HIGH  
**Timeline:** 1-2 Days  
**Status:** ⚠️ Action Required

---

## 🚨 Critical Security Issues to Fix

### 1. Environment Variables Exposure (CRITICAL)

#### Current Issue
```env
# backend/.env - EXPOSED CREDENTIALS
MONGODB_URI=mongodb+srv://futurelabsdesign:futurelab2025@futurelab-cluster.elb6u.mongodb.net/futurelabs?retryWrites=true&w=majority
JWT_SECRET=futurelabs_secret_key_2026_very_secure_random_string
```

#### Fix Steps

**Step 1: Create .env.example**
```bash
cd backend
```

Create `backend/.env.example`:
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=your_mongodb_connection_string_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=30d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# HDFC Payment Gateway
HDFC_MERCHANT_ID=your_merchant_id
HDFC_ACCESS_CODE=your_access_code
HDFC_WORKING_KEY=your_working_key

# SMS Configuration
SMS_API_KEY=your_sms_api_key
SMS_SENDER_ID=FUTLAB
```

**Step 2: Update .gitignore**
```bash
# Add to .gitignore
echo ".env" >> .gitignore
echo "backend/.env" >> ../.gitignore
```

**Step 3: Remove from Git History**
```bash
# If already committed
git rm --cached backend/.env
git commit -m "Remove .env file from repository"
git push
```

**Step 4: Regenerate Secrets**
```bash
# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Update your .env with the new secret
```

---

### 2. Add Rate Limiting (HIGH PRIORITY)

#### Install Dependencies
```bash
cd backend
npm install express-rate-limit
```

#### Implementation

Create `backend/middleware/rateLimiter.js`:
```javascript
const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many login attempts, please try again after 15 minutes.'
  },
  skipSuccessfulRequests: true,
});

// OTP generation limiter
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 OTP requests per hour
  message: {
    success: false,
    message: 'Too many OTP requests, please try again after 1 hour.'
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  otpLimiter
};
```

#### Update server.js
```javascript
// Add at the top
const { apiLimiter, authLimiter, otpLimiter } = require('./middleware/rateLimiter');

// Apply to all API routes
app.use('/api/', apiLimiter);

// Apply strict limits to auth routes
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/admin/login', authLimiter);
app.use('/api/v1/auth/otp/generate', otpLimiter);
```

---

### 3. Add Input Validation (HIGH PRIORITY)

#### Install Dependencies
```bash
npm install express-validator
```

#### Create Validation Middleware

Create `backend/middleware/validators.js`:
```javascript
const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validators
const loginValidator = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

const registerValidator = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  handleValidationErrors
];

const otpValidator = [
  body('phone')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  handleValidationErrors
];

// Order validators
const createOrderValidator = [
  body('orderItems')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.pincode')
    .trim()
    .matches(/^[0-9]{6}$/)
    .withMessage('Please provide a valid 6-digit pincode'),
  body('shippingAddress.phone')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
  handleValidationErrors
];

// Test validators
const createTestValidator = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Test name must be between 3 and 200 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  handleValidationErrors
];

// ID validators
const mongoIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

module.exports = {
  loginValidator,
  registerValidator,
  otpValidator,
  createOrderValidator,
  createTestValidator,
  mongoIdValidator,
  handleValidationErrors
};
```

#### Update Routes

**backend/routes/auth.js**
```javascript
const {
  loginValidator,
  registerValidator,
  otpValidator
} = require('../middleware/validators');

// Apply validators
router.post('/login', loginValidator, login);
router.post('/register', registerValidator, register);
router.post('/otp/generate', otpValidator, generateOTP);
router.post('/otp/verify', otpValidator, verifyOTP);
```

**backend/routes/orders.js**
```javascript
const {
  createOrderValidator,
  mongoIdValidator
} = require('../middleware/validators');

router.post('/', protect, createOrderValidator, createOrder);
router.get('/:id', protect, mongoIdValidator, getOrderById);
```

**backend/routes/tests.js**
```javascript
const {
  createTestValidator,
  mongoIdValidator
} = require('../middleware/validators');

router.post('/', protect, authorize('admin'), createTestValidator, createTest);
router.get('/:id', mongoIdValidator, getTestById);
```

---

### 4. Add CSRF Protection (MEDIUM PRIORITY)

#### Install Dependencies
```bash
npm install csurf cookie-parser
```

#### Implementation

**backend/server.js**
```javascript
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

// Add cookie parser
app.use(cookieParser());

// CSRF protection (only for state-changing operations)
const csrfProtection = csrf({ cookie: true });

// Apply to specific routes
app.use('/api/v1/orders', csrfProtection);
app.use('/api/v1/payment', csrfProtection);

// Endpoint to get CSRF token
app.get('/api/v1/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
```

**Frontend: Include CSRF token in requests**
```javascript
// utils/api.js
const getCsrfToken = async () => {
  const response = await axios.get('/api/v1/csrf-token');
  return response.data.csrfToken;
};

// Include in POST requests
const createOrder = async (orderData) => {
  const csrfToken = await getCsrfToken();
  return axios.post('/api/v1/orders', orderData, {
    headers: {
      'X-CSRF-Token': csrfToken
    }
  });
};
```

---

### 5. Enhanced Error Handling (MEDIUM PRIORITY)

#### Create Custom Error Classes

Create `backend/utils/errors.js`:
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Not authorized to access this resource') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError
};
```

#### Update Error Handler Middleware

**backend/middleware/errorHandler.js**
```javascript
const { AppError } = require('../utils/errors');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = new AppError(message, 409);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new AppError(message, 401);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
```

#### Use in Controllers

```javascript
const { NotFoundError, ValidationError } = require('../utils/errors');

exports.getTestById = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    
    if (!test) {
      throw new NotFoundError('Test not found');
    }

    res.status(200).json({
      success: true,
      data: test
    });
  } catch (error) {
    next(error);
  }
};
```

---

### 6. Add Security Headers (QUICK WIN)

#### Update Helmet Configuration

**backend/server.js**
```javascript
const helmet = require('helmet');

// Enhanced helmet configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true
}));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

---

### 7. Secure MongoDB Connection (QUICK WIN)

#### Update Connection Options

**backend/server.js**
```javascript
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
      maxPoolSize: 10, // Connection pooling
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};
```

---

## 🔒 Additional Security Best Practices

### 1. Password Policy

**backend/models/User.js**
```javascript
// Add password strength validation
UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (!passwordRegex.test(this.password)) {
      return next(new Error('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character'));
    }
  }
  next();
});
```

### 2. Session Management

```javascript
// Add session timeout
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const sessionMiddleware = (req, res, next) => {
  if (req.user && req.user.lastActivity) {
    const now = Date.now();
    if (now - req.user.lastActivity > SESSION_TIMEOUT) {
      return res.status(401).json({
        success: false,
        message: 'Session expired, please login again'
      });
    }
  }
  next();
};
```

### 3. Sensitive Data Logging

```javascript
// Sanitize logs
const sanitizeLog = (data) => {
  const sensitive = ['password', 'token', 'secret', 'apiKey'];
  const sanitized = { ...data };
  
  sensitive.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });
  
  return sanitized;
};

// Use in logging
console.log('User data:', sanitizeLog(userData));
```

---

## ✅ Security Checklist

### Immediate Actions (Today)
- [ ] Move credentials to .env.example
- [ ] Add .env to .gitignore
- [ ] Regenerate JWT secret
- [ ] Remove .env from Git history
- [ ] Add rate limiting
- [ ] Add input validation

### This Week
- [ ] Implement CSRF protection
- [ ] Enhanced error handling
- [ ] Update security headers
- [ ] Secure MongoDB connection
- [ ] Add password policy
- [ ] Implement session management

### Ongoing
- [ ] Regular security audits
- [ ] Dependency updates
- [ ] Penetration testing
- [ ] Security training

---

## 🚀 Deployment Security

### Production Environment Variables
```env
NODE_ENV=production
PORT=5000

# Use strong, unique secrets
JWT_SECRET=<64-character-random-string>

# Use production database
MONGODB_URI=<production-mongodb-uri>

# Enable security features
ENABLE_RATE_LIMITING=true
ENABLE_CSRF=true
ENABLE_HELMET=true
```

### SSL/TLS Configuration
```javascript
// Use HTTPS in production
if (process.env.NODE_ENV === 'production') {
  const https = require('https');
  const fs = require('fs');
  
  const options = {
    key: fs.readFileSync('path/to/private-key.pem'),
    cert: fs.readFileSync('path/to/certificate.pem')
  };
  
  https.createServer(options, app).listen(443);
}
```

---

## 📊 Testing Security

### Test Rate Limiting
```bash
# Send multiple requests
for i in {1..10}; do
  curl http://localhost:5000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test123"}'
done
```

### Test Input Validation
```bash
# Test with invalid data
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"123"}'
```

---

## 🎯 Priority Implementation Order

1. **Day 1 (Critical)**
   - Secure environment variables
   - Add rate limiting
   - Add input validation

2. **Day 2 (High)**
   - Enhanced error handling
   - Security headers
   - MongoDB security

3. **Week 1 (Medium)**
   - CSRF protection
   - Password policy
   - Session management

4. **Ongoing**
   - Security monitoring
   - Regular updates
   - Penetration testing

---

**Status:** ⚠️ Action Required  
**Priority:** HIGH  
**Timeline:** 1-2 Days  
**Impact:** Critical for Production

---

**Last Updated:** February 10, 2026  
**Version:** 1.0
