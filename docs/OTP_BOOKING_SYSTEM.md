# 🔐 OTP-Based Booking Verification System

## Overview
Enhanced booking system with OTP verification for secure sample collection and real-time status updates.

## Features Added

### 1. **Automatic OTP Generation**
- 6-digit OTP generated when booking is confirmed
- OTP sent to customer via SMS and Email
- Stored securely in order's bookingDetails

### 2. **Customer Notifications**
When booking is confirmed, customer receives:
- ✅ SMS with Order ID, Date, Time, and OTP
- ✅ Email with detailed booking information and OTP
- ✅ Instructions to share OTP with phlebotomist

### 3. **Collector OTP Verification**
- Phlebotomist verifies OTP before sample collection
- Ensures correct patient and prevents fraud
- Updates booking status to "reached" after verification

### 4. **Real-Time Status Updates**
Collector/Pathology staff can update status:
- `pending` - Booking confirmed, waiting
- `on_way` - Phlebotomist traveling to location
- `reached` - Arrived at patient location
- `collected` - Sample collected successfully
- `completed` - Results ready

### 5. **Automatic Customer Notifications**
Customer receives SMS/Email for each status update

## API Endpoints

### 1. Book Time Slot (Enhanced)
```
POST /api/v1/bookings/book-slot
```

### 2. Verify OTP (New)
```
POST /api/v1/bookings/verify-otp
```

### 3. Update Booking Status (New)
```
PUT /api/v1/bookings/update-status/:orderId
```

## Database Schema Updates

### Order Model - bookingDetails
```javascript
bookingDetails: {
  verificationOTP: String,
  otpVerified: Boolean,
  otpVerifiedAt: Date,
  collectorStatus: String,
  statusUpdates: [{ status, updatedAt, updatedBy }]
}
```

## Workflow

1. Customer books → OTP generated → SMS/Email sent
2. Collector verifies OTP → Sample collection
3. Status updates → Customer notified automatically

## Benefits

✅ Security - OTP prevents fraud
✅ Transparency - Customer always informed
✅ Efficiency - Automated notifications
✅ Tracking - Complete status history
