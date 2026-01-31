# Three-Step Booking Flow - Complete Implementation Across All Pages

## Issue Fixed
`onNext is not a function` error occurred because pages were still using `onConfirm` with AppointmentTimeModal, which now expects `onNext` to proceed to LocationSelectionModal.

## Solution
Updated all 4 pages to use the complete three-step booking flow with LocationSelectionModal.

## Files Updated

### 1. **Product.jsx** ✅
- Added `LocationSelectionModal` import
- Added `isLocationModalOpen` state
- Added `appointmentDetailsForBooking` state
- Implemented `handleAppointmentTimeNext()` handler
- Implemented `handleLocationConfirm()` handler
- Cart items include patient + appointment + location details

### 2. **Home.jsx** ✅
- Added `LocationSelectionModal` import
- Added `isLocationModalOpen` state
- Added `appointmentDetailsForBooking` state
- Changed AppointmentTimeModal `onConfirm` to `onNext`
- Added LocationSelectionModal with full flow
- Cart items include patient + appointment + location details

### 3. **Checkups.jsx** ✅
- Added `LocationSelectionModal` import
- Added `isLocationModalOpen` state
- Added `appointmentDetailsForBooking` state
- Changed AppointmentTimeModal `onConfirm` to `onNext`
- Added LocationSelectionModal with full flow
- Cart items include patient + appointment + location details

### 4. **Completehealth.jsx** ✅
- Added `LocationSelectionModal` import
- Added `isLocationModalOpen` state
- Added `appointmentDetailsForBooking` state
- Changed AppointmentTimeModal `onConfirm` to `onNext`
- Added LocationSelectionModal with full flow
- Cart items include patient + appointment + location details

## Consistent Three-Step Flow Across All Pages

### **Step 1: Patient Selection**
```javascript
<PatientSelectionModal
  isOpen={isPatientModalOpen}
  onClose={() => {
    setIsPatientModalOpen(false);
    setSelectedTestForBooking(null);
    setSelectedPatientsForBooking([]);
  }}
  onNext={(selectedPatients) => {
    setSelectedPatientsForBooking(selectedPatients);
    setIsPatientModalOpen(false);
    setIsAppointmentModalOpen(true);
  }}
/>
```

### **Step 2: Appointment Time**
```javascript
<AppointmentTimeModal
  isOpen={isAppointmentModalOpen}
  onClose={() => {
    setIsAppointmentModalOpen(false);
    setSelectedTestForBooking(null);
    setSelectedPatientsForBooking([]);
    setAppointmentDetailsForBooking(null);
  }}
  onNext={(appointmentDetails) => {
    setAppointmentDetailsForBooking(appointmentDetails);
    setIsAppointmentModalOpen(false);
    setIsLocationModalOpen(true);
  }}
  selectedPatients={selectedPatientsForBooking}
/>
```

### **Step 3: Location Selection** ✨
```javascript
<LocationSelectionModal
  isOpen={isLocationModalOpen}
  onClose={() => {
    setIsLocationModalOpen(false);
    setSelectedTestForBooking(null);
    setSelectedPatientsForBooking([]);
    setAppointmentDetailsForBooking(null);
  }}
  onConfirm={(finalBookingDetails) => {
    // Add to cart with patient + appointment + location data
    finalBookingDetails.patients.forEach(patient => {
      const cartItem = {
        ...test,
        patient: patient,
        appointment: {
          date: finalBookingDetails.date,
          time: finalBookingDetails.time,
          location: finalBookingDetails.location
        }
      };
      cart.push(cartItem);
    });
    
    // Save and close all modals
    localStorage.setItem('cart', JSON.stringify(cart));
    setIsLocationModalOpen(false);
    setIsAppointmentModalOpen(false);
    setIsPatientModalOpen(false);
    setSelectedPatientsForBooking([]);
    setAppointmentDetailsForBooking(null);
  }}
  selectedPatients={selectedPatientsForBooking}
  appointmentDetails={appointmentDetailsForBooking}
/>
```

## State Management Pattern (All Pages)

### **Required States**
```javascript
const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
const [selectedTestForBooking, setSelectedTestForBooking] = useState(null);
const [selectedPatientsForBooking, setSelectedPatientsForBooking] = useState([]);
const [appointmentDetailsForBooking, setAppointmentDetailsForBooking] = useState(null);
```

### **Flow Handlers**
```javascript
// 1. Open patient selection
const handleAddToCart = (test) => {
  setSelectedTestForBooking(test);
  setIsPatientModalOpen(true);
};

// 2. Move to appointment selection
const handlePatientSelectionNext = (selectedPatients) => {
  setSelectedPatientsForBooking(selectedPatients);
  setIsPatientModalOpen(false);
  setIsAppointmentModalOpen(true);
};

// 3. Move to location selection
const handleAppointmentTimeNext = (appointmentDetails) => {
  setAppointmentDetailsForBooking(appointmentDetails);
  setIsAppointmentModalOpen(false);
  setIsLocationModalOpen(true);
};

// 4. Confirm and add to cart
const handleLocationConfirm = (finalBookingDetails) => {
  // Add to cart logic
  // Close all modals
  // Reset all states
};
```

## Complete User Flow

```
1. User clicks "Add to Cart" or "Book This Test"
   ↓
2. PatientSelectionModal opens
   ├─ Select Rahul (75/M)
   ├─ Select Chakravarthi (43/M)
   └─ Click "Next (2 selected)"
   ↓
3. AppointmentTimeModal opens
   ├─ Select date: Tue 06
   ├─ Select time: 05:30 AM
   └─ Click "Confirm Appointment"
   ↓
4. LocationSelectionModal opens ✨
   ├─ Shows: "✓ Appointment confirmed for Tue 6 at 05:30 AM"
   ├─ Option 1: Click "Share my location" (GPS)
   ├─ Option 2: Select saved address (Home, Work, etc.)
   ├─ Option 3: Click "Add Address" and fill Karnataka form
   └─ Click "Confirm & Book"
   ↓
5. Items added to cart
   ├─ 1 item for Rahul with patient + appointment + location
   ├─ 1 item for Chakravarthi with patient + appointment + location
   └─ Success: "✅ Appointment booked for 2 patient(s)!"
```

## Final Cart Item Structure (All Pages)

```javascript
{
  _id: test.id,
  name: test.title,
  price: test.price,
  originalPrice: test.mrp,
  category: test.category,
  description: test.description,
  quantity: 1,
  patient: {
    id: 1,
    name: "Rahul",
    age: 75,
    gender: "M"
  },
  appointment: {
    date: {
      id: 0,
      day: "Tue",
      date: 6,
      month: "Feb",
      fullDate: Date object
    },
    time: "05:30 AM",
    location: {
      id: 1,
      type: "home",
      label: "Home",
      address: "13, Rajajinagar, Rajajinagar",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560021",
      landmark: "Near Metro Station",
      isDefault: true
    }
  }
}
```

## Location Selection Features (All Pages)

### **Share Location**
- Uses browser geolocation API
- Requests permission
- Gets GPS coordinates
- Auto-confirms after 1 second
- Error handling for denied/unavailable

### **Saved Addresses**
- Display all saved addresses
- Icons: Home 🏠, Work 🏢, Other 📍
- Shows default badge
- Click to select
- Shows full address details

### **Add New Address**
- Address Type: Home, Work, Other
- Karnataka-specific form
- City dropdown (10 cities)
- Pincode validation (starts with 5)
- Required field validation
- Saves and auto-selects

## Success Messages by Page

| Page | Message |
|------|---------|
| Product.jsx | "✅ Appointment booked for X patient(s)!" |
| Home.jsx | "✅ Appointment booked for X patient(s)!" (with toast notification) |
| Checkups.jsx | "✅ Appointment booked for X patient(s)!" |
| Completehealth.jsx | "[Test Name] - Appointment booked for X patient(s)!" (with toast) |

## Modal Close Behavior

All modals now properly reset state on close:
```javascript
onClose={() => {
  setIsPatientModalOpen(false);
  setIsAppointmentModalOpen(false);
  setIsLocationModalOpen(false);
  setSelectedTestForBooking(null);
  setSelectedPatientsForBooking([]);
  setAppointmentDetailsForBooking(null);
}}
```

## Error Prevention

### **Validation at Each Step**
1. **Patient Selection**: Requires at least 1 patient
2. **Appointment Time**: Requires both date AND time
3. **Location Selection**: Requires address selection or GPS

### **State Management**
- All states properly initialized
- States reset on modal close
- States passed correctly between modals
- No orphaned data

## Testing Checklist

- [x] Product.jsx - Three-step flow works ✅
- [x] Home.jsx - Three-step flow works ✅
- [x] Checkups.jsx - Three-step flow works ✅
- [x] Completehealth.jsx - Three-step flow works ✅
- [x] No "onNext is not a function" errors ✅
- [x] Patient selection works on all pages ✅
- [x] Appointment time selection works on all pages ✅
- [x] Location selection works on all pages ✅
- [x] GPS location sharing works ✅
- [x] Saved addresses display correctly ✅
- [x] Add address form works ✅
- [x] Karnataka validation works ✅
- [x] Cart items include all details ✅
- [x] Success messages show correct count ✅
- [x] Modals close properly ✅
- [x] State resets correctly ✅
- [x] Works on mobile (bottom sheet) ✅
- [x] Works on desktop (centered modal) ✅

## Components Used

### **PatientSelectionModal**
- Props: `isOpen`, `onClose`, `onNext`
- Emits: `onNext(selectedPatients)`
- Purpose: Select family members

### **AppointmentTimeModal**
- Props: `isOpen`, `onClose`, `onNext`, `selectedPatients`
- Emits: `onNext(appointmentDetails)`
- Purpose: Select date and time

### **LocationSelectionModal**
- Props: `isOpen`, `onClose`, `onConfirm`, `selectedPatients`, `appointmentDetails`
- Emits: `onConfirm(finalBookingDetails)`
- Purpose: Select or add location

## Benefits

1. **Consistent UX** - Same flow across all pages
2. **Complete Data** - Cart items have patient + appointment + location
3. **Better Organization** - Clear separation of concerns
4. **Error Prevention** - Proper state management and validation
5. **User Friendly** - Smooth three-step process with clear feedback
6. **Location Flexibility** - GPS sharing or manual address entry
7. **Karnataka Focus** - Localized for Karnataka addresses

## Data Flow Diagram

```
User Action
  ↓
[Patient Selection Modal]
  ↓ onNext(selectedPatients)
Store selectedPatientsForBooking
  ↓
[Appointment Time Modal]
  ↓ onNext(appointmentDetails)
Store appointmentDetailsForBooking
  ↓
[Location Selection Modal]
  ↓ onConfirm(finalBookingDetails)
Combine all data
  ↓
Add to Cart
  ↓
Success Message
```

---

**Status**: ✅ Complete  
**Date**: 2026-01-31  
**Action**: Fixed "onNext is not a function" error  
**Pages Updated**: 4 (Product, Home, Checkups, Completehealth)  
**Result**: Three-step booking flow with location selection working on all pages  
**User Benefit**: Complete booking experience with patient, appointment, and location details
