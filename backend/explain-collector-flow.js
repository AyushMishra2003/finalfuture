const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

console.log('\n🩸 PHLEBOTOMIST ORDER FLOW DEMONSTRATION\n');
console.log('='.repeat(60));

console.log(`
┌────────────────────────────────────────────────────────────┐
│                  HOW COLLECTORS RECEIVE ORDERS              │
└────────────────────────────────────────────────────────────┘

📋 STEP-BY-STEP FLOW:

1️⃣  ADMIN CREATES COLLECTOR FOLDER
    ↓
    - Assigns phlebotomist to service area
    - Defines pincodes (e.g., 560001, 560002)
    - Sets capacity (e.g., 5 orders/hour)

2️⃣  CUSTOMER PLACES ORDER
    ↓
    - Enters address with pincode
    - System captures location (lat/lng)
    - Order saved in database

3️⃣  BOOKING SYSTEM AUTO-ASSIGNS
    ↓
    - Finds collector by pincode match
    - Checks available time slots
    - Creates booking in TimeSlot
    - Links order to collector

4️⃣  PHLEBOTOMIST LOGS IN
    ↓
    - URL: http://localhost:3000/#/phlebotomist/login
    - Phone: 9876543210
    - System identifies collector by JWT token

5️⃣  DASHBOARD SHOWS ASSIGNED ORDERS
    ↓
    - Fetches bookings for collector's folder
    - Shows patient details & location
    - Displays GPS coordinates
    - Lists tests & payment status

6️⃣  PHLEBOTOMIST PROCESSES ORDER
    ↓
    - Clicks GPS → Opens Google Maps
    - Navigates to patient
    - Updates status: Reached → Collected
    - Collects samples & payment

7️⃣  COMPLETES HANDOVER
    ↓
    - Hands over samples to lab
    - Hands over cash collected
    - Order marked complete

┌────────────────────────────────────────────────────────────┐
│                    KEY DATABASE STRUCTURE                   │
└────────────────────────────────────────────────────────────┘

📁 CollectorFolder
   ├─ phlebotomistId: "user_123"
   ├─ pincodes: ["560001", "560002"]
   └─ name: "South Bangalore Team"

📅 TimeSlot
   ├─ collectorFolderId: "folder_123"
   ├─ date: "2025-02-05"
   ├─ hour: 10
   └─ bookings: [
        {
          orderId: "order_789",
          patientName: "John Doe",
          status: "pending"
        }
      ]

📦 Order
   ├─ user: "customer_456"
   ├─ shippingAddress: {
   │    postalCode: "560001",  ← Matches collector pincode
   │    location: { lat: 12.97, lng: 77.59 }
   │  }
   └─ totalPrice: 1500

┌────────────────────────────────────────────────────────────┐
│                    API ENDPOINTS USED                       │
└────────────────────────────────────────────────────────────┘

🔐 Collector Login:
   POST /api/v1/collector/login
   Body: { phone, password }
   Returns: JWT token

📋 Get Bookings:
   GET /api/v1/collector/bookings?date=2025-02-05
   Headers: Authorization: Bearer <token>
   Returns: List of assigned orders

✅ Update Status:
   PUT /api/v1/collector/bookings/:id/status
   Body: { status: "reached" }

💉 Update Sample:
   PUT /api/v1/collector/bookings/:id/sample
   Body: { sampleType: "blood", collected: true }

💰 Update Payment:
   PUT /api/v1/collector/bookings/:id/payment
   Body: { paymentCollected: 1500 }

🤝 Complete Handover:
   PUT /api/v1/collector/bookings/:id/handover
   Body: { sampleHandedOver: true }

┌────────────────────────────────────────────────────────────┐
│                  PINCODE MATCHING LOGIC                     │
└────────────────────────────────────────────────────────────┘

Example:

Collector Folder:
  pincodes: ["560001", "560002", "560003"]

Customer Order:
  postalCode: "560001"  ✅ MATCH!

System Action:
  → Finds CollectorFolder with "560001"
  → Assigns order to that collector
  → Collector sees order in dashboard

┌────────────────────────────────────────────────────────────┐
│                    TESTING CHECKLIST                        │
└────────────────────────────────────────────────────────────┘

✅ 1. Create collector user (role: 'collector')
✅ 2. Create collector folder with pincodes
✅ 3. Create order with matching pincode
✅ 4. Book time slot for the order
✅ 5. Login as collector
✅ 6. View dashboard - order should appear
✅ 7. Click GPS - Google Maps opens
✅ 8. Update status - changes saved
✅ 9. Complete handover - order done

┌────────────────────────────────────────────────────────────┐
│                    QUICK START COMMANDS                     │
└────────────────────────────────────────────────────────────┘

# Start Backend
cd backend && npm run dev

# Start Frontend
cd frontend && npm start

# Access Phlebotomist Dashboard
http://localhost:3000/#/phlebotomist/dashboard

# Default Credentials
Phone: 9876543210
Password: collector123

┌────────────────────────────────────────────────────────────┐
│                         SUMMARY                             │
└────────────────────────────────────────────────────────────┘

🎯 How It Works:
   Orders are automatically assigned to collectors based on
   pincode matching. The collector logs in and sees all orders
   for their service area in the dashboard.

🗺️  Location Tracking:
   Each order has GPS coordinates. Collector can click GPS
   button to navigate directly to patient location.

📱 Mobile Friendly:
   Dashboard works on mobile. GPS button opens Google Maps
   app for easy navigation.

🔄 Real-time Updates:
   Status changes are saved immediately. Admin can track
   progress in real-time.

`);

console.log('='.repeat(60));
console.log('\n✅ Flow explanation complete!\n');
console.log('📚 For detailed documentation, see: COLLECTOR_FLOW_COMPLETE.md\n');
