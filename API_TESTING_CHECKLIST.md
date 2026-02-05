# API Testing Checklist

## Overview
This document provides a comprehensive testing checklist for all API endpoints in the FutureLab Healthcare Platform.

---

## 🔐 Authentication & User Management

### OTP Generation
- [ ] **POST /api/v1/auth/otp/generate**
  - [ ] Valid phone number generates OTP
  - [ ] Invalid phone number returns error
  - [ ] Rate limiting prevents spam (3 requests/hour)
  - [ ] OTP expires after 10 minutes
  - [ ] SMS is sent successfully

### OTP Verification
- [ ] **POST /api/v1/auth/otp/verify**
  - [ ] Valid OTP returns JWT token
  - [ ] Invalid OTP returns error
  - [ ] Expired OTP returns error
  - [ ] Token is valid for 30 days
  - [ ] User is created if new phone number

### User Profile
- [ ] **GET /api/v1/auth/me**
  - [ ] Returns current user with valid token
  - [ ] Returns 401 without token
  - [ ] Returns 401 with invalid token

- [ ] **PUT /api/v1/auth/updatedetails**
  - [ ] Updates user name successfully
  - [ ] Updates user email successfully
  - [ ] Validates email format
  - [ ] Requires authentication

### Admin Login
- [ ] **POST /api/v1/auth/admin/login**
  - [ ] Valid credentials return admin token
  - [ ] Invalid credentials return error
  - [ ] Rate limiting applied
  - [ ] Admin role is set correctly

---

## 🧪 Tests & Products

### Get Tests
- [ ] **GET /api/v1/tests**
  - [ ] Returns all active tests
  - [ ] Pagination works correctly
  - [ ] Filtering by category works
  - [ ] Search functionality works
  - [ ] Returns correct data structure

- [ ] **GET /api/v1/tests/:id**
  - [ ] Returns single test with valid ID
  - [ ] Returns 404 with invalid ID
  - [ ] Includes all test details

- [ ] **GET /api/v1/tests/category/:category**
  - [ ] Returns tests for valid category
  - [ ] Returns empty array for invalid category
  - [ ] Only returns active tests

### Admin Test Management
- [ ] **POST /api/v1/tests**
  - [ ] Creates test with valid data
  - [ ] Validates required fields
  - [ ] Requires admin authentication
  - [ ] Returns created test

- [ ] **PUT /api/v1/tests/:id**
  - [ ] Updates test successfully
  - [ ] Validates data
  - [ ] Requires admin authentication

- [ ] **DELETE /api/v1/tests/:id**
  - [ ] Deletes test successfully
  - [ ] Requires admin authentication
  - [ ] Returns success message

---

## 📦 Packages

### Get Packages
- [ ] **GET /api/v1/packages**
  - [ ] Returns all active packages
  - [ ] Includes test details
  - [ ] Pagination works

- [ ] **GET /api/v1/packages/:id**
  - [ ] Returns package with tests
  - [ ] Calculates total price correctly

- [ ] **GET /api/v1/packages/category/:category**
  - [ ] Filters by category correctly

### Admin Package Management
- [ ] **POST /api/v1/packages**
  - [ ] Creates package with tests
  - [ ] Validates test IDs
  - [ ] Calculates prices correctly

- [ ] **PUT /api/v1/packages/:id**
  - [ ] Updates package successfully
  - [ ] Updates test associations

- [ ] **PATCH /api/v1/packages/:id/toggle-active**
  - [ ] Toggles active status
  - [ ] Requires admin auth

---

## 🛒 Shopping Cart

### Cart Operations
- [ ] **GET /api/v1/cart/:userId**
  - [ ] Returns user's cart
  - [ ] Includes test details
  - [ ] Calculates totals correctly

- [ ] **POST /api/v1/cart/add**
  - [ ] Adds item to cart
  - [ ] Prevents duplicates
  - [ ] Updates quantity if exists

- [ ] **DELETE /api/v1/cart/remove**
  - [ ] Removes item from cart
  - [ ] Returns updated cart

- [ ] **PUT /api/v1/cart/update**
  - [ ] Updates item quantity
  - [ ] Validates quantity > 0

- [ ] **DELETE /api/v1/cart/clear/:userId**
  - [ ] Clears entire cart
  - [ ] Returns empty cart

---

## 📋 Orders

### User Orders
- [ ] **POST /api/v1/orders**
  - [ ] Creates order with valid data
  - [ ] Validates order items
  - [ ] Requires authentication
  - [ ] Calculates totals correctly
  - [ ] Clears cart after order

- [ ] **GET /api/v1/orders/myorders**
  - [ ] Returns user's orders only
  - [ ] Sorted by date (newest first)
  - [ ] Includes order details

- [ ] **GET /api/v1/orders/:id**
  - [ ] Returns order if user owns it
  - [ ] Returns 401 if not owner
  - [ ] Admin can view any order

### Admin Order Management
- [ ] **GET /api/v1/orders**
  - [ ] Returns all orders
  - [ ] Pagination works
  - [ ] Filtering works
  - [ ] Requires admin auth

- [ ] **GET /api/v1/orders/stats**
  - [ ] Returns correct statistics
  - [ ] Calculates revenue correctly
  - [ ] Shows recent orders

- [ ] **PUT /api/v1/orders/:id/status**
  - [ ] Updates order status
  - [ ] Validates status values
  - [ ] Requires admin auth

---

## 💳 Payment Gateway

### HDFC Payment
- [ ] **GET /api/v1/payment/hdfc/config**
  - [ ] Returns merchant configuration
  - [ ] Doesn't expose secrets

- [ ] **POST /api/v1/payment/hdfc/create-order**
  - [ ] Creates payment order
  - [ ] Returns order ID
  - [ ] Requires authentication
  - [ ] Validates amount

- [ ] **POST /api/v1/payment/hdfc/callback**
  - [ ] Processes payment callback
  - [ ] Verifies signature
  - [ ] Updates order status
  - [ ] Handles success/failure

- [ ] **GET /api/v1/payment/hdfc/verify/:orderId**
  - [ ] Verifies payment status
  - [ ] Returns correct status

- [ ] **POST /api/v1/payment/hdfc/refund**
  - [ ] Initiates refund
  - [ ] Requires admin auth
  - [ ] Validates refund amount

---

## 📍 Locations

### Location Services
- [ ] **GET /api/v1/locations**
  - [ ] Returns all active locations
  - [ ] Includes pincode ranges

- [ ] **GET /api/v1/locations/check/:pincode**
  - [ ] Returns true if serviceable
  - [ ] Returns false if not serviceable
  - [ ] Fast response time

### Admin Location Management
- [ ] **POST /api/v1/locations**
  - [ ] Creates location
  - [ ] Validates pincode format
  - [ ] Requires admin auth

- [ ] **PUT /api/v1/locations/:id**
  - [ ] Updates location
  - [ ] Validates data

- [ ] **PATCH /api/v1/locations/:id/toggle-active**
  - [ ] Toggles active status

---

## 📅 Bookings & Appointments

### Slot Management
- [ ] **GET /api/v1/bookings/available-slots**
  - [ ] Returns available slots for pincode
  - [ ] Filters by date
  - [ ] Shows collector capacity
  - [ ] Fast response time

- [ ] **GET /api/v1/bookings/next-available-slot**
  - [ ] Finds next available slot
  - [ ] Considers current time
  - [ ] Smart distribution logic

- [ ] **POST /api/v1/bookings/book-slot**
  - [ ] Creates booking
  - [ ] Assigns to collector
  - [ ] Updates slot availability
  - [ ] Requires authentication
  - [ ] Prevents double booking

- [ ] **GET /api/v1/bookings/collector/:folderId**
  - [ ] Returns collector's bookings
  - [ ] Filters by date
  - [ ] Requires authentication

- [ ] **DELETE /api/v1/bookings/cancel/:orderId**
  - [ ] Cancels booking
  - [ ] Frees up slot
  - [ ] Requires authentication

---

## 👥 Collector Folders

### Folder Management
- [ ] **GET /api/v1/admin/collector-folders**
  - [ ] Returns all folders
  - [ ] Includes statistics
  - [ ] Requires admin auth

- [ ] **POST /api/v1/admin/collector-folders**
  - [ ] Creates folder
  - [ ] Validates data
  - [ ] Sets up time slots

- [ ] **PUT /api/v1/admin/collector-folders/:id**
  - [ ] Updates folder
  - [ ] Validates changes

- [ ] **GET /api/v1/admin/collector-folders/pincode/:pincode**
  - [ ] Returns folder for pincode
  - [ ] Fast lookup

- [ ] **GET /api/v1/admin/collector-folders/:id/stats**
  - [ ] Returns folder statistics
  - [ ] Shows booking count
  - [ ] Shows capacity

---

## 🎨 Banners

### Banner Operations
- [ ] **GET /api/v1/banners**
  - [ ] Returns all active banners
  - [ ] Includes image URLs

- [ ] **GET /api/v1/banners/main**
  - [ ] Returns main banners only
  - [ ] Sorted by order

- [ ] **GET /api/v1/banners/bottom**
  - [ ] Returns bottom banners

- [ ] **GET /api/v1/banners/bottom/random**
  - [ ] Returns random banner
  - [ ] Different on each call

### Admin Banner Management
- [ ] **POST /api/v1/banners**
  - [ ] Creates banner
  - [ ] Handles image upload
  - [ ] Requires admin auth

- [ ] **PUT /api/v1/banners/:id**
  - [ ] Updates banner
  - [ ] Can update image

- [ ] **DELETE /api/v1/banners/:id**
  - [ ] Deletes banner

---

## 👤 User Management (Admin)

### User Operations
- [ ] **GET /api/v1/users**
  - [ ] Returns all users
  - [ ] Pagination works
  - [ ] Requires admin auth

- [ ] **GET /api/v1/users/stats**
  - [ ] Returns user statistics
  - [ ] Shows growth metrics

- [ ] **GET /api/v1/users/:id**
  - [ ] Returns user details
  - [ ] Includes order history

- [ ] **PATCH /api/v1/users/:id/role**
  - [ ] Updates user role
  - [ ] Validates role values

- [ ] **PATCH /api/v1/users/:id/toggle-active**
  - [ ] Toggles user status
  - [ ] Prevents self-deactivation

- [ ] **DELETE /api/v1/users/:id**
  - [ ] Deletes user
  - [ ] Cascades to orders

---

## 🔍 Categories

### Category Operations
- [ ] **GET /api/v1/category**
  - [ ] Returns all categories
  - [ ] Includes test count

- [ ] **GET /api/v1/category/:id**
  - [ ] Returns single category

- [ ] **GET /api/v1/category/*/selected**
  - [ ] Returns category-specific data
  - [ ] Filters correctly

### Admin Category Management
- [ ] **POST /api/v1/category**
  - [ ] Creates category
  - [ ] Validates unique name

- [ ] **PUT /api/v1/category/:id**
  - [ ] Updates category

- [ ] **DELETE /api/v1/category/:id**
  - [ ] Deletes category
  - [ ] Checks for dependencies

---

## 🏥 Health Check

- [ ] **GET /api/v1/health**
  - [ ] Returns 200 status
  - [ ] Shows database status
  - [ ] Shows timestamp
  - [ ] Fast response time

---

## 🔒 Security Testing

### Authentication
- [ ] JWT tokens expire correctly
- [ ] Invalid tokens are rejected
- [ ] Token refresh works
- [ ] Logout invalidates token

### Authorization
- [ ] Admin routes require admin role
- [ ] Users can only access own data
- [ ] Protected routes require auth

### Rate Limiting
- [ ] Login attempts limited
- [ ] OTP generation limited
- [ ] API calls limited

### Input Validation
- [ ] SQL injection prevented
- [ ] XSS attacks prevented
- [ ] Invalid data rejected
- [ ] Required fields enforced

### Data Security
- [ ] Passwords are hashed
- [ ] Sensitive data not exposed
- [ ] HTTPS enforced
- [ ] CORS configured correctly

---

## ⚡ Performance Testing

### Response Times
- [ ] GET requests < 200ms
- [ ] POST requests < 500ms
- [ ] Database queries optimized
- [ ] Indexes in place

### Load Testing
- [ ] Handles 100 concurrent users
- [ ] No memory leaks
- [ ] Connection pooling works
- [ ] Graceful degradation

### Caching
- [ ] Static data cached
- [ ] Cache invalidation works
- [ ] CDN configured

---

## 🧪 Integration Testing

### Complete User Flow
- [ ] User registration → OTP → Login
- [ ] Browse tests → Add to cart → Checkout
- [ ] Select slot → Create order → Payment
- [ ] Payment success → Order confirmation
- [ ] View order history

### Admin Flow
- [ ] Admin login
- [ ] Create test/package
- [ ] Manage orders
- [ ] View analytics
- [ ] Manage users

### Error Scenarios
- [ ] Network failures handled
- [ ] Database errors handled
- [ ] Payment failures handled
- [ ] Timeout handling

---

## 📊 Testing Tools

### Recommended Tools
1. **Postman** - API testing
2. **Jest** - Unit testing
3. **Supertest** - Integration testing
4. **Artillery** - Load testing
5. **OWASP ZAP** - Security testing

### Test Coverage Goals
- [ ] Unit tests: 80%+
- [ ] Integration tests: 70%+
- [ ] E2E tests: 50%+

---

## 🐛 Bug Tracking

### Critical Issues
- [ ] Payment gateway failures
- [ ] Authentication bypass
- [ ] Data loss
- [ ] Security vulnerabilities

### High Priority
- [ ] Booking conflicts
- [ ] Cart inconsistencies
- [ ] Order calculation errors
- [ ] Email/SMS failures

### Medium Priority
- [ ] UI/UX issues
- [ ] Performance issues
- [ ] Minor bugs

### Low Priority
- [ ] Cosmetic issues
- [ ] Enhancement requests

---

## ✅ Pre-Deployment Checklist

### Environment
- [ ] Production environment variables set
- [ ] Database backups configured
- [ ] SSL certificate installed
- [ ] Domain configured

### Security
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Security headers set
- [ ] CORS configured

### Performance
- [ ] Database indexes created
- [ ] Caching enabled
- [ ] CDN configured
- [ ] Compression enabled

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Log aggregation

### Documentation
- [ ] API documentation complete
- [ ] Deployment guide written
- [ ] Runbook created
- [ ] Support contacts listed

---

## 📝 Test Execution Log

| Date | Tester | Module | Pass/Fail | Notes |
|------|--------|--------|-----------|-------|
| | | | | |
| | | | | |
| | | | | |

---

## 🎯 Success Criteria

### Functional
- [ ] All endpoints return correct data
- [ ] All user flows work end-to-end
- [ ] Error handling is consistent
- [ ] Data validation works

### Non-Functional
- [ ] Response times meet SLA
- [ ] System handles expected load
- [ ] Security requirements met
- [ ] Accessibility standards met

### Business
- [ ] Payment processing works
- [ ] Booking system reliable
- [ ] Admin tools functional
- [ ] Reports accurate

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-04  
**Status**: Ready for Testing
