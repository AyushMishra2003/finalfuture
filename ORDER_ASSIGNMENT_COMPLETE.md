# 🩸 Complete Order Assignment System with Distance Calculation

## 📋 Overview

This system enables:
1. **Admin** to assign orders to phlebotomists based on distance
2. **Phlebotomists** to view assigned orders sorted by distance
3. **Automatic distance calculation** using LocationIQ API
4. **Fare estimation** based on distance
5. **Google Maps navigation** integration

---

## 🔧 Backend Implementation

### 1. Location Utilities (`backend/utils/locationUtils.js`)

```javascript
const LOCATION_IQ_API_KEY = 'pk.2bc21e092c881e1b4035ef20f9da09f6';

// Haversine formula for distance calculation
calculateDistance(lat1, lon1, lat2, lon2) // Returns distance in km

// Fare calculation: ₹50 base + ₹12/km
calculateFare(distance) // Returns fare in INR

// Get coordinates from address
getCoordinates(address) // Returns {latitude, longitude, displayName}

// Format distance for display
formatDistance(distance) // Returns "5.2 km" or "850 m"
```

### 2. Admin Order Assignment Controller

**Endpoints:**

```
GET  /api/v1/admin/order-assignment/unassigned
GET  /api/v1/admin/order-assignment/assigned
GET  /api/v1/admin/order-assignment/:orderId/available-collectors
POST /api/v1/admin/order-assignment/:orderId/assign
```

**Key Features:**
- Finds collectors by pincode match
- Calculates distance from phlebotomist to patient
- Sorts collectors by distance (nearest first)
- Estimates travel fare

### 3. Phlebotomist Dashboard Controller

**Endpoints:**

```
GET /api/v1/phlebotomist/dashboard
PUT /api/v1/phlebotomist/location
GET /api/v1/phlebotomist/orders/:orderId
PUT /api/v1/phlebotomist/orders/:orderId/status
```

**Key Features:**
- Auto-updates phlebotomist location
- Shows orders sorted by distance
- Generates Google Maps navigation URL
- Tracks order status (scheduled → processing → delivered)

### 4. Database Schema Updates

**User Model** - Added location field:
```javascript
location: {
  latitude: Number,
  longitude: Number,
  address: String,
  updatedAt: Date
}
```

**Order Model** - Already has location in shippingAddress:
```javascript
shippingAddress: {
  location: {
    type: 'Point',
    coordinates: [longitude, latitude],
    latitude: Number,
    longitude: Number
  }
}
```

---

## 🎨 Frontend Implementation

### 1. Admin Order Assignment (`frontend/src/admin/OrderAssignment.jsx`)

**Features:**
- View unassigned orders
- View assigned orders
- Click "Find Collectors" to see available phlebotomists
- Shows distance and estimated fare for each collector
- One-click assignment

**UI Components:**
- Tabs: Unassigned / Assigned
- Order cards with customer details
- Modal with collector list
- Distance badges (📍 5.2 km)
- Fare badges (💰 ₹112.40)

### 2. Phlebotomist Dashboard (`frontend/src/pages/PhlebotomistDashboard.jsx`)

**Features:**
- Stats overview (total, pending, completed orders)
- Current location display
- Orders sorted by distance (nearest first)
- View order details
- Update order status
- Google Maps navigation

**UI Components:**
- Stats cards with icons
- Location info bar with refresh button
- Order list with distance/fare display
- Order detail modal
- Navigation button (opens Google Maps)

---

## 🚀 Setup Instructions

### Backend Setup

1. **Install dependencies** (already done):
```bash
cd backend
npm install axios
```

2. **Environment variables** (`.env`):
```env
LOCATION_IQ_API_KEY=pk.2bc21e092c881e1b4035ef20f9da09f6
```

3. **Routes are auto-registered** in `server.js`:
```javascript
app.use('/api/v1/admin/order-assignment', adminOrderAssignmentRoutes);
app.use('/api/v1/phlebotomist', phlebotomistRoutes);
```

### Frontend Setup

1. **Components created**:
- `frontend/src/admin/OrderAssignment.jsx`
- `frontend/src/admin/OrderAssignment.css`
- `frontend/src/pages/PhlebotomistDashboard.jsx`
- `frontend/src/pages/PhlebotomistDashboard.css`

2. **Routes added** to `App.js`:
- Admin: `/admin` → OrderAssignment tab
- Phlebotomist: `/phlebotomist/dashboard`

---

## 📱 Usage Flow

### Admin Workflow

1. **Login** to admin panel: `http://localhost:3000/#/admin`
2. **Navigate** to "Order Assignment" tab
3. **View** unassigned orders
4. **Click** "Find Collectors" on any order
5. **See** available collectors with:
   - Distance from patient
   - Estimated fare
   - Phlebotomist details
6. **Click** "Assign to [Name]" to assign
7. **Confirmation** - Order moves to "Assigned" tab

### Phlebotomist Workflow

1. **Login**: `http://localhost:3000/#/phlebotomist/dashboard`
2. **Allow** location access (browser prompt)
3. **View** dashboard with:
   - Stats (total, pending, completed)
   - Current location
   - Assigned orders (sorted by distance)
4. **Click** "View Details" to see:
   - Patient info
   - Address
   - Tests ordered
   - Distance & fare
5. **Click** "Open in Google Maps" to navigate
6. **Update** status:
   - "Start Collection" (scheduled → processing)
   - "Mark Complete" (processing → delivered)

---

## 🗺️ Distance Calculation Logic

### How It Works

1. **Order Creation**:
   - Customer enters address
   - Frontend captures GPS coordinates
   - Saved in `order.shippingAddress.location`

2. **Phlebotomist Location**:
   - Browser requests location permission
   - Coordinates sent to backend
   - Saved in `user.location`

3. **Distance Calculation**:
   - Uses Haversine formula
   - Calculates great-circle distance
   - Accurate for distances up to 500km

4. **Fare Calculation**:
   ```
   Fare = ₹50 (base) + (distance × ₹12/km)
   
   Example:
   Distance: 5.2 km
   Fare = ₹50 + (5.2 × ₹12) = ₹112.40
   ```

### LocationIQ API

**Used for**: Address → Coordinates conversion (if needed)

**API Key**: `pk.2bc21e092c881e1b4035ef20f9da09f6`

**Endpoint**: `https://us1.locationiq.com/v1/search.php`

**Rate Limit**: 5,000 requests/day (free tier)

---

## 🎯 Key Features

### ✅ Implemented

- [x] Distance calculation (Haversine formula)
- [x] Fare estimation
- [x] Admin order assignment interface
- [x] Phlebotomist dashboard
- [x] Location tracking
- [x] Google Maps navigation
- [x] Order status updates
- [x] Sorting by distance
- [x] Real-time location updates

### 🔄 Automatic Features

- Auto-sorts orders by distance
- Auto-updates phlebotomist location
- Auto-generates navigation URLs
- Auto-calculates fare

---

## 📊 Dashboard Metrics

### Admin View
- Total unassigned orders
- Total assigned orders
- Collectors with distance
- Estimated fares

### Phlebotomist View
- Total orders assigned
- Pending orders
- In-progress orders
- Completed orders
- Total revenue collected

---

## 🔐 Security & Authorization

### Admin Routes
- Protected by `protect` + `authorize('admin')` middleware
- JWT token required
- Admin role verification

### Phlebotomist Routes
- Protected by `protect` + `authorize('collector')` middleware
- JWT token required
- Collector role verification
- Can only view/update own assigned orders

---

## 🧪 Testing

### Test Admin Assignment

1. Create test order with location:
```javascript
POST /api/v1/orders
{
  "shippingAddress": {
    "address": "123 Main St",
    "postalCode": "560001",
    "location": {
      "latitude": 12.9716,
      "longitude": 77.5946
    }
  }
}
```

2. Create collector with location:
```javascript
// Update phlebotomist location
PUT /api/v1/phlebotomist/location
{
  "latitude": 12.9800,
  "longitude": 77.6000
}
```

3. Find available collectors:
```javascript
GET /api/v1/admin/order-assignment/{orderId}/available-collectors
```

4. Assign order:
```javascript
POST /api/v1/admin/order-assignment/{orderId}/assign
{
  "collectorFolderId": "...",
  "scheduledDate": "2025-02-05",
  "scheduledHour": 9
}
```

### Test Phlebotomist Dashboard

1. Login as collector
2. Allow location access
3. View dashboard
4. Check distance calculations
5. Test navigation link
6. Update order status

---

## 🐛 Troubleshooting

### Location Not Showing

**Issue**: Distance shows "N/A"

**Solutions**:
1. Ensure order has GPS coordinates
2. Ensure phlebotomist location is updated
3. Check browser location permissions
4. Verify coordinates are valid numbers

### Distance Calculation Wrong

**Issue**: Distance seems incorrect

**Solutions**:
1. Verify coordinates are in correct format (latitude, longitude)
2. Check coordinates are not swapped
3. Ensure using decimal degrees (not DMS)

### Navigation Not Working

**Issue**: Google Maps doesn't open

**Solutions**:
1. Check navigationUrl is generated
2. Verify both locations exist
3. Test URL format manually

---

## 📈 Future Enhancements

- [ ] Real-time location tracking
- [ ] Route optimization for multiple orders
- [ ] Traffic-aware ETA calculation
- [ ] Push notifications for new assignments
- [ ] Offline mode support
- [ ] Historical route tracking
- [ ] Performance analytics
- [ ] Batch assignment

---

## 🎉 Summary

You now have a complete order assignment system with:

✅ **Admin Panel** - Assign orders with distance calculation
✅ **Phlebotomist Dashboard** - View orders sorted by distance
✅ **Distance Calculation** - Accurate Haversine formula
✅ **Fare Estimation** - Automatic fare calculation
✅ **Navigation** - Google Maps integration
✅ **Location Tracking** - Real-time updates
✅ **Status Management** - Track order progress

**Access URLs:**
- Admin: `http://localhost:3000/#/admin` → Order Assignment tab
- Phlebotomist: `http://localhost:3000/#/phlebotomist/dashboard`

**API Key**: `pk.2bc21e092c881e1b4035ef20f9da09f6` (LocationIQ)

🚀 **Ready to use!**
