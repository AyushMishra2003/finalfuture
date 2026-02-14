# 🩸 Phlebotomist/Collector Order Flow - Complete Guide

## 📋 Overview

The phlebotomist dashboard shows orders assigned to a specific collector based on their service area (pincodes). Here's the complete flow:

---

## 🔄 Complete Order Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    1. CUSTOMER PLACES ORDER                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. ORDER CREATED IN DATABASE                                    │
│     - Order details saved                                        │
│     - Customer address with pincode                              │
│     - Location coordinates (lat/lng)                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  3. BOOKING SYSTEM ASSIGNS TO COLLECTOR                          │
│     - System finds CollectorFolder by pincode                    │
│     - Checks available time slots                                │
│     - Creates booking in TimeSlot                                │
│     - Links order to collector                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. PHLEBOTOMIST SEES ORDER IN DASHBOARD                         │
│     - Login to dashboard                                         │
│     - View assigned bookings for today                           │
│     - See patient details & location                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. PHLEBOTOMIST PROCESSES ORDER                                 │
│     - Navigate to patient location (GPS)                         │
│     - Update status: Reached → Collected → Moving               │
│     - Collect samples (blood, urine)                             │
│     - Collect payment if pending                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  6. COMPLETE HANDOVER                                            │
│     - Hand over samples to lab                                   │
│     - Hand over collected cash                                   │
│     - Order marked as complete                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Structure

### 1. CollectorFolder (Collector Assignment)
```javascript
{
  _id: "folder_123",
  name: "South Bangalore Team",
  phlebotomistId: "user_collector_id",  // Links to User with role='collector'
  phlebotomistName: "Dr. Rajesh Kumar",
  pincodes: ["560001", "560002", "560003"],  // Service area
  maxOrdersPerHour: 5,
  workingHours: { start: 8, end: 18 }
}
```

### 2. TimeSlot (Booking Schedule)
```javascript
{
  _id: "slot_123",
  collectorFolderId: "folder_123",  // Links to CollectorFolder
  date: "2025-02-05",
  hour: 10,  // 10 AM
  maxCapacity: 5,
  bookings: [
    {
      _id: "booking_456",
      orderId: "order_789",  // Links to Order
      patientName: "John Doe",
      patientPhone: "+919876543210",
      status: "pending",  // pending → reached → collected → moving_to_next
      sampleStatus: {
        blood: { collected: false, collectedAt: null },
        urine: { collected: false, collectedAt: null }
      },
      paymentCollected: 0,
      sampleHandedOver: false,
      amountHandedOver: false
    }
  ]
}
```

### 3. Order (Customer Order)
```javascript
{
  _id: "order_789",
  user: "user_customer_id",
  orderItems: [...],
  shippingAddress: {
    address: "123 MG Road",
    city: "Bangalore",
    postalCode: "560001",  // Used to find collector
    location: {
      latitude: 12.9716,
      longitude: 77.5946
    }
  },
  totalPrice: 1500,
  isPaid: false,
  orderStatus: "pending"
}
```

---

## 🔍 How Collector Receives Orders

### Step 1: Admin Creates Collector Folder
```javascript
POST /api/v1/admin/collector-folders

{
  "name": "South Bangalore Team",
  "phlebotomistId": "collector_user_id",
  "pincodes": ["560001", "560002"],
  "maxOrdersPerHour": 5
}
```

### Step 2: Customer Places Order
```javascript
POST /api/v1/orders

{
  "orderItems": [...],
  "shippingAddress": {
    "postalCode": "560001"  // This pincode determines collector
  }
}
```

### Step 3: Booking System Assigns Order
```javascript
POST /api/v1/bookings/book-slot

{
  "orderId": "order_789",
  "pincode": "560001",  // System finds collector with this pincode
  "date": "2025-02-05",
  "hour": 10
}

// System automatically:
// 1. Finds CollectorFolder with pincode "560001"
// 2. Finds/creates TimeSlot for that date & hour
// 3. Adds booking to TimeSlot
// 4. Links order to collector
```

### Step 4: Collector Views Dashboard
```javascript
GET /api/v1/collector/bookings?date=2025-02-05

// System:
// 1. Gets collector's user ID from JWT token
// 2. Finds CollectorFolder for this user
// 3. Finds all TimeSlots for this folder
// 4. Returns all bookings with order details
```

---

## 📱 Phlebotomist Dashboard Flow

### Login
```
URL: http://localhost:3000/#/phlebotomist/login
Phone: 9876543210
Password: collector123
```

### Dashboard View
```
URL: http://localhost:3000/#/phlebotomist/dashboard

Shows:
- Patient name & address
- GPS location (clickable)
- Phone number (clickable to call)
- Tests ordered
- Payment status
- Sample collection checkboxes
- Status update buttons
```

### API Calls Made by Dashboard

#### 1. Fetch Bookings
```javascript
GET /api/v1/collector/bookings?date=2025-02-05
Authorization: Bearer <collector_token>

Response:
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "booking_456",
      "orderId": "order_789",
      "patient": {
        "name": "John Doe",
        "phone": "+919876543210",
        "address": {
          "address": "123 MG Road",
          "city": "Bangalore",
          "postalCode": "560001",
          "location": {
            "latitude": 12.9716,
            "longitude": 77.5946
          }
        }
      },
      "scheduledTime": {
        "date": "2025-02-05",
        "hour": 10
      },
      "tests": [...],
      "totalAmount": 1500,
      "isPaid": false,
      "status": "pending"
    }
  ],
  "collectorInfo": {
    "name": "South Bangalore Team",
    "pincodes": ["560001", "560002"]
  }
}
```

#### 2. Update Status
```javascript
PUT /api/v1/collector/bookings/:bookingId/status
Authorization: Bearer <collector_token>

Body:
{
  "status": "reached"  // or "collected" or "moving_to_next"
}
```

#### 3. Update Sample Status
```javascript
PUT /api/v1/collector/bookings/:bookingId/sample
Authorization: Bearer <collector_token>

Body:
{
  "sampleType": "blood",
  "collected": true,
  "collectedAt": "2025-02-05T10:30:00Z"
}
```

#### 4. Update Payment
```javascript
PUT /api/v1/collector/bookings/:bookingId/payment
Authorization: Bearer <collector_token>

Body:
{
  "paymentCollected": 1500,
  "paymentMethod": "Cash on Collection"
}
```

#### 5. Complete Handover
```javascript
PUT /api/v1/collector/bookings/:bookingId/handover
Authorization: Bearer <collector_token>

Body:
{
  "sampleHandedOver": true
}
// or
{
  "amountHandedOver": true
}
```

---

## 🎯 Key Points

### How Orders Are Assigned
1. **By Pincode**: Order's shipping address pincode matches collector's service area
2. **By Time Slot**: Order is scheduled for specific date & hour
3. **By Capacity**: Collector can handle max orders per hour (e.g., 5)

### Collector Identification
```javascript
// Collector logs in with phone & password
// JWT token contains user ID
// System finds CollectorFolder where phlebotomistId = user ID
// All bookings for that folder are shown
```

### Location Tracking
```javascript
// Order has location coordinates
// Dashboard shows exact lat/lng
// GPS button opens Google Maps
// Collector navigates to patient
```

---

## 🧪 Testing the Flow

### 1. Create Collector User
```javascript
// In MongoDB or via API
{
  "name": "Test Collector",
  "phone": "9876543210",
  "password": "collector123",
  "role": "collector"
}
```

### 2. Create Collector Folder
```javascript
POST /api/v1/admin/collector-folders

{
  "name": "Test Area",
  "phlebotomistId": "<collector_user_id>",
  "pincodes": ["560001"],
  "maxOrdersPerHour": 5
}
```

### 3. Create Order with Matching Pincode
```javascript
POST /api/v1/orders

{
  "orderItems": [{
    "name": "Blood Test",
    "price": 500,
    "quantity": 1
  }],
  "shippingAddress": {
    "address": "123 Test St",
    "city": "Bangalore",
    "postalCode": "560001",  // Matches collector's pincode
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946
    }
  },
  "paymentMethod": "Cash",
  "totalPrice": 500
}
```

### 4. Book Time Slot
```javascript
POST /api/v1/bookings/book-slot

{
  "orderId": "<order_id>",
  "pincode": "560001",
  "date": "2025-02-05",
  "hour": 10,
  "patientName": "Test Patient",
  "patientPhone": "+919999999999"
}
```

### 5. Login as Collector
```
URL: http://localhost:3000/#/phlebotomist/login
Phone: 9876543210
Password: collector123
```

### 6. View Dashboard
```
URL: http://localhost:3000/#/phlebotomist/dashboard

You should see:
- The order you created
- Patient details
- Location with GPS button
- Status update buttons
```

---

## 🔧 Troubleshooting

### No Orders Showing in Dashboard

**Check 1: Collector Folder Exists**
```javascript
GET /api/v1/admin/collector-folders
// Verify folder exists with correct phlebotomistId
```

**Check 2: Pincode Matches**
```javascript
// Order pincode: "560001"
// Collector pincodes: ["560001", "560002"]
// Must match!
```

**Check 3: Booking Created**
```javascript
// Check TimeSlot collection in MongoDB
// Should have booking with orderId
```

**Check 4: Date Filter**
```javascript
// Dashboard filters by date
// Make sure booking date matches selected date
```

### Location Not Showing

**Check Order Location Data**
```javascript
// Order must have:
shippingAddress: {
  location: {
    latitude: 12.9716,
    longitude: 77.5946
  }
}
```

---

## 📊 Summary

### Order Assignment Logic
```
1. Customer order has pincode "560001"
2. System finds CollectorFolder with pincode "560001"
3. System creates/finds TimeSlot for that folder
4. Booking added to TimeSlot with orderId
5. Collector sees booking in dashboard
```

### Data Flow
```
Order → Booking → TimeSlot → CollectorFolder → Phlebotomist
```

### Key Collections
```
- User (role: 'collector')
- CollectorFolder (service area)
- TimeSlot (schedule)
- Order (customer order)
```

---

## 🎉 Complete!

The phlebotomist receives orders through the CollectorFolder → TimeSlot → Booking system, which automatically assigns orders based on pincode matching and time slot availability.

**Test it now:**
1. Create collector user & folder
2. Create order with matching pincode
3. Book time slot
4. Login as collector
5. See order in dashboard!
