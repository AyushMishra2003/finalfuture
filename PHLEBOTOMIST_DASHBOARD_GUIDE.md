# 👨‍⚕️ Phlebotomist Dashboard System - Complete Guide

## 📋 Overview

The Phlebotomist Dashboard is a mobile-optimized interface designed for delivery agents/phlebotomists to manage their daily sample collection tasks. It provides real-time booking information, status tracking, sample collection management, payment handling, and handover functionality.

---

## ✨ Features

### 🔐 **Authentication**
- Secure phone + password login
- JWT token-based authentication
- Role-based access control (collector role)
- Auto-redirect on session expiry

### 📅 **Booking Management**
- View daily assigned bookings
- Patient details with contact information
- GPS navigation to patient location
- One-click call functionality
- Navigate between multiple bookings

### 📊 **Status Tracking**
- **Reached** - Mark when arrived at patient location
- **Collected Sample** - Mark when samples are collected
- **Moving to Next Patient** - Update when leaving for next booking

### 🧪 **Sample Collection**
- Blood sample tracking with photo upload
- Urine sample tracking with photo upload
- Random sample checkbox
- "Not Given" option for urine samples
- Timestamp for each collection

### 💰 **Payment Management**
- View prepaid status
- Collect pending payments
- Track cash on hand
- Payment confirmation

### 📦 **Final Handover**
- Sample handover to lab
- Amount handover to lab
- Completion tracking with timestamps

---

## 🚀 Getting Started

### Prerequisites

1. **Backend Setup**
   - User model updated with 'collector' role
   - Collector routes and controllers implemented
   - TimeSlot model enhanced with tracking fields

2. **Frontend Setup**
   - Phlebotomist components created
   - Routes configured in App.js
   - Mobile-responsive CSS implemented

### Creating a Collector Account

#### Option 1: Via Admin Dashboard

1. Login to Admin Dashboard (`/admin/login`)
2. Go to **User Management**
3. Create new user with role = `collector`
4. Assign to a Collector Folder

#### Option 2: Via Database

```javascript
// MongoDB Shell or Compass
db.users.insertOne({
    name: "John Doe",
    email: "john.collector@futurelab.com",
    phone: "9876543210",
    password: "$2a$10$hashedPasswordHere", // Use bcrypt to hash
    role: "collector",
    isVerified: true,
    createdAt: new Date()
});
```

#### Option 3: Via API

```bash
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john.collector@futurelab.com",
    "phone": "9876543210",
    "password": "SecurePassword123",
    "role": "collector"
}
```

---

## 📱 User Interface

### Login Page (`/phlebotomist/login`)

**Features:**
- Phone number input (10 digits)
- Password input
- Error handling
- Loading states
- Back to home link

**Access:**
```
URL: http://localhost:3000/phlebotomist/login
```

### Dashboard (`/phlebotomist/dashboard`)

**Layout Sections:**

1. **Header**
   - FutureLabs logo
   - Dashboard title
   - Logout button

2. **Patient Details**
   - Booking name
   - Full address
   - GPS Location button
   - Call button

3. **Phlebotomy Status**
   - Reached (Green)
   - Collected Sample (Green)
   - Moving to Next Patient (Orange)

4. **Sample Collection**
   - Blood Sample card
     - Camera icon for photo
     - Collection timestamp
     - Random sample checkbox
   - Urine Sample card
     - Camera icon for photo
     - Collection timestamp
     - Not Given checkbox

5. **Payment Status**
   - Prepaid checkbox
   - Payment Pending checkbox
   - Payment Collected display
   - Total Cash on Hand

6. **Final Handover**
   - Sample Handover button
   - Amount Handover to Lab button

7. **Navigation** (if multiple bookings)
   - Booking counter
   - Previous/Next buttons

---

## 🔌 API Endpoints

### Authentication

#### Login
```http
POST /api/v1/collector/login
Content-Type: application/json

{
    "phone": "9876543210",
    "password": "SecurePassword123"
}

Response:
{
    "success": true,
    "token": "jwt_token_here",
    "user": {
        "id": "user_id",
        "name": "John Doe",
        "phone": "9876543210",
        "email": "john@example.com",
        "role": "collector"
    }
}
```

### Bookings

#### Get My Bookings
```http
GET /api/v1/collector/bookings?date=2026-02-04
Authorization: Bearer {token}

Response:
{
    "success": true,
    "count": 5,
    "data": [
        {
            "_id": "booking_id",
            "orderId": "order_id",
            "patient": {
                "name": "Priya Sharma",
                "phone": "+919876543210",
                "address": {
                    "street": "7A, Green View Apartments",
                    "city": "Pune",
                    "state": "Maharashtra",
                    "zip": "411001"
                }
            },
            "scheduledTime": {
                "date": "2026-02-04",
                "hour": 9
            },
            "tests": [...],
            "totalAmount": 1500,
            "status": "pending",
            "sampleStatus": {},
            "paymentCollected": 0
        }
    ],
    "collectorInfo": {
        "name": "South Pune Team",
        "pincodes": ["411001", "411002"]
    }
}
```

#### Update Booking Status
```http
PUT /api/v1/collector/bookings/{bookingId}/status
Authorization: Bearer {token}
Content-Type: application/json

{
    "status": "reached" // or "collected", "moving_to_next"
}
```

#### Update Sample Status
```http
PUT /api/v1/collector/bookings/{bookingId}/sample
Authorization: Bearer {token}
Content-Type: application/json

{
    "sampleType": "blood", // or "urine", "other"
    "collected": true,
    "image": "base64_image_string",
    "collectedAt": "2026-02-04T09:30:00Z",
    "isRandom": false // for blood
    // or
    "notGiven": false // for urine
}
```

#### Update Payment Status
```http
PUT /api/v1/collector/bookings/{bookingId}/payment
Authorization: Bearer {token}
Content-Type: application/json

{
    "paymentCollected": 1500,
    "paymentMethod": "Cash on Collection"
}
```

#### Complete Handover
```http
PUT /api/v1/collector/bookings/{bookingId}/handover
Authorization: Bearer {token}
Content-Type: application/json

{
    "sampleHandedOver": true,
    "amountHandedOver": true
}
```

---

## 💾 Database Schema

### User Model (Enhanced)
```javascript
{
    name: String,
    email: String,
    phone: String,
    password: String (hashed),
    role: String, // 'user', 'admin', 'collector' ✅ NEW
    isVerified: Boolean,
    createdAt: Date
}
```

### TimeSlot Model (Enhanced Booking)
```javascript
{
    collectorFolderId: ObjectId,
    date: Date,
    hour: Number,
    bookings: [{
        orderId: ObjectId,
        patientName: String,
        patientPhone: String,
        
        // ✅ NEW FIELDS
        status: String, // 'pending', 'reached', 'collected', 'moving_to_next'
        reachedAt: Date,
        collectedAt: Date,
        
        sampleStatus: {
            blood: {
                collected: Boolean,
                image: String,
                collectedAt: Date,
                isRandom: Boolean
            },
            urine: {
                collected: Boolean,
                image: String,
                collectedAt: Date,
                notGiven: Boolean
            }
        },
        
        paymentCollected: Number,
        paymentCollectedAt: Date,
        
        sampleHandedOver: Boolean,
        sampleHandoverAt: Date,
        
        amountHandedOver: Boolean,
        amountHandoverAt: Date,
        
        bookedAt: Date
    }]
}
```

---

## 🔄 Workflow

### Daily Workflow for Phlebotomist

1. **Morning Login**
   ```
   → Open /phlebotomist/login
   → Enter phone + password
   → Redirected to dashboard
   ```

2. **View Bookings**
   ```
   → Dashboard shows today's bookings
   → See patient details, address, time
   → Plan route for the day
   ```

3. **First Patient**
   ```
   → Click "GPS Location" to navigate
   → Click "Call" if needed
   → Click "Reached" when arrived
   ```

4. **Collect Samples**
   ```
   → Take blood sample
   → Click camera icon to upload photo
   → Check "Random Sample" if applicable
   → Take urine sample (if required)
   → Click camera icon to upload photo
   → Check "Not Given" if patient can't provide
   ```

5. **Handle Payment**
   ```
   → Check if prepaid
   → If not, collect payment
   → Check "Payment Pending" checkbox
   → Amount added to "Cash on Hand"
   ```

6. **Move to Next**
   ```
   → Click "Collected Sample"
   → Click "Moving to Next Patient"
   → Click "Next" button to see next booking
   ```

7. **End of Day - Handover**
   ```
   → Return to lab
   → Click "Sample Handover" ✓
   → Click "Amount Handover to Lab" ✓
   → All bookings completed
   ```

---

## 🎨 UI Components

### Mobile-First Design

**Breakpoints:**
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

**Colors:**
- Primary: `#667eea` (Purple Blue)
- Secondary: `#764ba2` (Purple)
- Success: `#4CAF50` (Green)
- Warning: `#FF9800` (Orange)
- Error: `#f44336` (Red)

**Typography:**
- Font Family: System fonts
- Headers: 16-20px, bold
- Body: 13-14px, regular
- Small: 11-12px

---

## 🔒 Security

### Authentication
- JWT tokens stored in localStorage
- Token expiry: 30 days
- Auto-logout on token expiry
- Protected routes with middleware

### Authorization
- Role-based access control
- Only 'collector' role can access
- Collectors can only see their assigned bookings
- Cannot access admin or user routes

### Data Protection
- Passwords hashed with bcrypt
- HTTPS recommended for production
- Sensitive data not exposed in logs

---

## 📊 Admin Integration

### Assigning Collectors

1. **Create Collector Folder**
   ```
   Admin Dashboard → Collector Folders → Create New
   - Name: "South Pune Team"
   - Phlebotomist ID: {collector_user_id}
   - Pincodes: ["411001", "411002"]
   - Max Orders/Hour: 5
   - Working Hours: 8 AM - 6 PM
   ```

2. **Bookings Auto-Assigned**
   ```
   When patient books → System finds collector folder by pincode
   → Assigns to phlebotomist → Shows in their dashboard
   ```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (error handling)
- [ ] View today's bookings
- [ ] View bookings for specific date
- [ ] Click GPS Location button
- [ ] Click Call button
- [ ] Update status to "Reached"
- [ ] Update status to "Collected Sample"
- [ ] Update status to "Moving to Next Patient"
- [ ] Upload blood sample photo
- [ ] Check "Random Sample"
- [ ] Upload urine sample photo
- [ ] Check "Not Given"
- [ ] Collect payment
- [ ] View total cash on hand
- [ ] Complete sample handover
- [ ] Complete amount handover
- [ ] Navigate between bookings
- [ ] Logout

### API Testing

```bash
# Test Login
curl -X POST http://localhost:5000/api/v1/collector/login \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","password":"password123"}'

# Test Get Bookings
curl -X GET "http://localhost:5000/api/v1/collector/bookings?date=2026-02-04" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test Update Status
curl -X PUT http://localhost:5000/api/v1/collector/bookings/BOOKING_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"reached"}'
```

---

## 🚀 Deployment

### Environment Variables

```env
# Backend .env
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
MONGODB_URI=your_mongodb_connection_string
```

### Production Checklist

- [ ] Change default passwords
- [ ] Use HTTPS
- [ ] Set secure JWT secret
- [ ] Enable rate limiting
- [ ] Set up error logging
- [ ] Configure CORS properly
- [ ] Test on mobile devices
- [ ] Optimize images
- [ ] Enable compression

---

## 📱 Mobile App Features

### PWA Support (Future)
- Install as app on mobile
- Offline functionality
- Push notifications for new bookings
- Background sync

### Native App (Future)
- React Native version
- Camera integration
- GPS tracking
- Offline mode

---

## 🐛 Troubleshooting

### Login Issues
```
Problem: "Invalid credentials"
Solution: Verify phone number and password
         Check user role is 'collector'
         Ensure user exists in database
```

### No Bookings Showing
```
Problem: Dashboard shows "No bookings"
Solution: Check if collector is assigned to folder
         Verify pincodes match booking area
         Check selected date
```

### Token Expired
```
Problem: Auto-logout or 401 errors
Solution: Login again
         Token expires after 30 days
         Check JWT_EXPIRE setting
```

---

## 📞 Support

For issues or questions:
- Check documentation
- Review API responses
- Check browser console for errors
- Verify backend is running
- Check network connectivity

---

## 🎯 Future Enhancements

1. **Camera Integration**
   - Direct camera access
   - Image compression
   - Cloud upload

2. **Route Optimization**
   - Google Maps integration
   - Optimal route calculation
   - Traffic updates

3. **Analytics**
   - Daily collection stats
   - Performance metrics
   - Earnings tracking

4. **Notifications**
   - New booking alerts
   - Cancellation updates
   - Emergency contacts

5. **Offline Mode**
   - Work without internet
   - Sync when online
   - Local data storage

---

**Version:** 1.0.0  
**Last Updated:** February 4, 2026  
**Status:** ✅ Production Ready
