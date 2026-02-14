# Location Tracking Implementation Guide

## Overview
This system captures user location when placing orders and allows admin to see order locations with distance calculations.

## Backend Changes

### 1. Order Model (`backend/models/Order.js`)
- Added `location` field to `shippingAddress`
- Stores coordinates, latitude, longitude, accuracy, and timestamp
- Uses GeoJSON format for MongoDB geospatial queries

### 2. Location Utils (`backend/utils/locationUtils.js`)
- `calculateDistance()` - Calculates distance between two coordinates using Haversine formula
- `formatDistance()` - Formats distance for display (meters/km)

### 3. Order Controller (`backend/controllers/orders.js`)
- `createOrder()` - Accepts location data and stores it with order
- `getDashboardStats()` - Calculates distance from admin location to orders

## Frontend Changes

### 1. Location Hook (`frontend/src/hooks/useGeolocation.js`)
- Custom React hook to get user's current location
- Handles permission requests and errors
- Returns location, error, loading states

### 2. Location Permission Component (`frontend/src/components/LocationPermission.jsx`)
- UI component to request location permission
- Shows success/error states
- Displays captured coordinates

### 3. Order Location Map (`frontend/src/components/OrderLocationMap.jsx`)
- Displays order location on map for admin
- Shows distance from admin location
- Provides Google Maps links and directions

## How to Use

### In Checkout/Order Page:

```jsx
import LocationPermission from '../components/LocationPermission';
import { useState } from 'react';

function CheckoutPage() {
    const [userLocation, setUserLocation] = useState(null);

    const handleLocationCaptured = (location) => {
        setUserLocation(location);
        console.log('Location captured:', location);
    };

    const handlePlaceOrder = async () => {
        const orderData = {
            orderItems: [...],
            shippingAddress: {
                address: '...',
                city: '...',
                postalCode: '...',
                country: 'India'
            },
            location: userLocation, // Add location here
            // ... other order data
        };

        // Send to API
        const response = await fetch('/api/v1/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
    };

    return (
        <div>
            <h2>Checkout</h2>
            
            {/* Location Permission Component */}
            <LocationPermission 
                onLocationCaptured={handleLocationCaptured}
                required={true}
            />

            {/* Rest of checkout form */}
            <button 
                onClick={handlePlaceOrder}
                disabled={!userLocation}
            >
                Place Order
            </button>
        </div>
    );
}
```

### In Admin Order Details Page:

```jsx
import OrderLocationMap from '../components/OrderLocationMap';
import { useState, useEffect } from 'react';

function AdminOrderDetails({ orderId }) {
    const [order, setOrder] = useState(null);
    const [adminLocation, setAdminLocation] = useState(null);

    useEffect(() => {
        // Get admin's location
        navigator.geolocation.getCurrentPosition((position) => {
            setAdminLocation({
                lat: position.coords.latitude,
                lon: position.coords.longitude
            });
        });

        // Fetch order with distance
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        const response = await fetch(`/api/v1/orders/${orderId}`);
        const data = await response.json();
        setOrder(data.data);
    };

    return (
        <div>
            <h2>Order Details</h2>
            
            {order && (
                <OrderLocationMap 
                    order={order}
                    adminLocation={adminLocation}
                />
            )}
        </div>
    );
}
```

## Features

### User Side:
- ✅ Request location permission on checkout
- ✅ Capture GPS coordinates automatically
- ✅ Show captured location confirmation
- ✅ Handle permission denied gracefully

### Admin Side:
- ✅ View order location on map
- ✅ See distance from admin location
- ✅ Get directions to order location
- ✅ View coordinates and accuracy
- ✅ Embedded Google Maps view

## Google Maps API (Optional)

To enable embedded maps, get a Google Maps API key:

1. Go to: https://console.cloud.google.com/
2. Create a project
3. Enable "Maps Embed API"
4. Create API key
5. Replace `YOUR_GOOGLE_MAPS_API_KEY` in `OrderLocationMap.jsx`

## Privacy & Permissions

- Location is only requested when user places order
- User must explicitly grant permission
- Location is stored securely in database
- Only admin can view order locations
- Complies with browser geolocation API standards

## Testing

1. **Test Location Capture:**
   - Go to checkout page
   - Click "Allow Location Access"
   - Check browser console for coordinates
   - Verify location is saved with order

2. **Test Admin View:**
   - Login as admin
   - View order details
   - Check if location is displayed
   - Verify distance calculation
   - Test Google Maps links

## Troubleshooting

### Location not captured:
- Check if HTTPS is enabled (required for geolocation)
- Verify browser permissions
- Check console for errors

### Distance not showing:
- Ensure admin location is captured
- Check if order has location data
- Verify coordinates are valid

### Map not loading:
- Add Google Maps API key
- Check API key restrictions
- Verify Maps Embed API is enabled
