# 🚀 Quick Test Guide - Order Assignment System

## ✅ Authentication Removed for Testing

All routes now work WITHOUT authentication. You can test directly!

---

## 📋 Step-by-Step Testing

### 1️⃣ Create Collector Folder

**API Call:**
```bash
POST http://localhost:5000/api/v1/admin/collector-folders
Content-Type: application/json

{
  "name": "South Bangalore Team",
  "phlebotomistId": "YOUR_USER_ID_HERE",
  "pincodes": ["560001", "560002", "560003"],
  "maxOrdersPerHour": 5,
  "workingHours": {
    "start": 8,
    "end": 18
  }
}
```

**Or use Admin UI:**
- Go to: `http://localhost:3000/#/admin`
- Click: "Booking Management" tab
- Click: "Create New Folder"
- Fill form and save

---

### 2️⃣ Create Test Order with Location

**API Call:**
```bash
POST http://localhost:5000/api/v1/orders
Content-Type: application/json

{
  "orderItems": [
    {
      "name": "Blood Test",
      "price": 500,
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "address": "123 MG Road, Bangalore",
    "city": "Bangalore",
    "postalCode": "560001",
    "country": "India",
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946
    }
  },
  "paymentMethod": "COD",
  "itemsPrice": 500,
  "taxPrice": 0,
  "shippingPrice": 0,
  "totalPrice": 500,
  "userId": "000000000000000000000000"
}
```

---

### 3️⃣ View Unassigned Orders

**API Call:**
```bash
GET http://localhost:5000/api/v1/admin/order-assignment/unassigned
```

**Or use Admin UI:**
- Go to: `http://localhost:3000/#/admin`
- Click: "Order Assignment" tab
- View unassigned orders

---

### 4️⃣ Find Available Collectors

**API Call:**
```bash
GET http://localhost:5000/api/v1/admin/order-assignment/{ORDER_ID}/available-collectors
```

**Response includes:**
- Collector name
- Distance from patient (e.g., "5.2 km")
- Estimated fare (e.g., "₹112.40")
- Phlebotomist details

**Or use Admin UI:**
- Click "Find Collectors" button on order card
- Modal shows collectors with distance

---

### 5️⃣ Assign Order to Collector

**API Call:**
```bash
POST http://localhost:5000/api/v1/admin/order-assignment/{ORDER_ID}/assign
Content-Type: application/json

{
  "collectorFolderId": "COLLECTOR_FOLDER_ID",
  "scheduledDate": "2025-02-05",
  "scheduledHour": 9
}
```

**Or use Admin UI:**
- Click "Assign to [Name]" button in modal

---

### 6️⃣ Update Phlebotomist Location

**API Call:**
```bash
PUT http://localhost:5000/api/v1/phlebotomist/location
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "latitude": 12.9800,
  "longitude": 77.6000,
  "address": "Collector Office, Bangalore"
}
```

---

### 7️⃣ View Phlebotomist Dashboard

**API Call:**
```bash
GET http://localhost:5000/api/v1/phlebotomist/dashboard
Authorization: Bearer YOUR_TOKEN
```

**Response includes:**
- Assigned orders sorted by distance
- Distance and fare for each order
- Navigation URL for Google Maps

**Or use Phlebotomist UI:**
- Go to: `http://localhost:3000/#/phlebotomist/dashboard`
- Login with collector credentials
- View orders sorted by distance

---

## 🧪 Test Scenarios

### Scenario 1: Basic Assignment
1. Create collector folder
2. Create order with location
3. View unassigned orders
4. Find collectors (see distance)
5. Assign order
6. View assigned orders

### Scenario 2: Distance Calculation
1. Update phlebotomist location
2. Create order at different location
3. Find collectors
4. Verify distance is calculated correctly
5. Verify fare is calculated (₹50 + distance × ₹12)

### Scenario 3: Phlebotomist Workflow
1. Login as phlebotomist
2. Allow browser location access
3. View dashboard (orders sorted by distance)
4. Click "View Details" on nearest order
5. Click "Open in Google Maps"
6. Update status: Start → Complete

---

## 📍 Sample Test Data

### Sample Locations (Bangalore)

**Location 1 - MG Road:**
- Latitude: `12.9716`
- Longitude: `77.5946`
- Pincode: `560001`

**Location 2 - Koramangala:**
- Latitude: `12.9352`
- Longitude: `77.6245`
- Pincode: `560034`

**Location 3 - Whitefield:**
- Latitude: `12.9698`
- Longitude: `77.7499`
- Pincode: `560066`

**Distance between MG Road and Koramangala:** ~5.2 km
**Estimated Fare:** ₹50 + (5.2 × ₹12) = ₹112.40

---

## 🔧 Troubleshooting

### "No collector folder assigned"
**Solution:** Create collector folder first using admin panel or API

### "No Location Data"
**Solution:** Ensure order has `shippingAddress.location.latitude` and `longitude`

### Distance shows "N/A"
**Solution:** 
1. Update phlebotomist location
2. Ensure order has location coordinates
3. Check both are valid numbers

### Can't access routes
**Solution:** Authentication is now removed for testing. Just call the API directly!

---

## 🎯 Quick Commands

```bash
# Start backend
cd backend
npm run dev

# Start frontend
cd frontend
npm start

# Create collector folder (using curl)
curl -X POST http://localhost:5000/api/v1/admin/collector-folders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Team",
    "phlebotomistId": "USER_ID",
    "pincodes": ["560001"],
    "maxOrdersPerHour": 5,
    "workingHours": {"start": 8, "end": 18}
  }'

# View unassigned orders
curl http://localhost:5000/api/v1/admin/order-assignment/unassigned

# View collector folders
curl http://localhost:5000/api/v1/admin/collector-folders
```

---

## ✅ Success Checklist

- [ ] Collector folder created
- [ ] Order created with GPS location
- [ ] Unassigned orders visible
- [ ] Distance calculated correctly
- [ ] Fare calculated correctly
- [ ] Order assigned successfully
- [ ] Phlebotomist can view assigned orders
- [ ] Orders sorted by distance
- [ ] Google Maps navigation works
- [ ] Status updates work

---

## 🎉 You're Ready!

All authentication is removed for testing. You can now:
- ✅ Create collector folders without admin login
- ✅ View orders without authentication
- ✅ Assign orders directly via API
- ✅ Test distance calculation
- ✅ Test phlebotomist dashboard (needs token from login)

**Note:** For production, re-enable authentication by uncommenting the middleware in route files!
