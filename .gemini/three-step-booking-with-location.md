# Three-Step Booking Flow with Location Selection

## Overview
Implemented a complete three-step booking flow: **Patient Selection** → **Appointment Time** → **Location Selection**

## New Component Created

### **LocationSelectionModal.jsx**
**Location**: `frontend/src/components/LocationSelectionModal.jsx`

**Features**:
✅ **Share Location** - Uses browser geolocation API to get current location  
✅ **Saved Addresses** - Display and select from saved addresses  
✅ **Add New Address** - Karnataka-specific address form  
✅ **Address Types** - Home, Work, Other with custom labels  
✅ **City Dropdown** - 10 major Karnataka cities  
✅ **Pincode Validation** - Must start with 5 and be 6 digits  
✅ **Success Message** - Shows appointment confirmation  
✅ **Responsive Design** - Bottom sheet on mobile, centered modal on desktop  

## Three-Step Booking Flow

### **Step 1: Patient Selection**
```
Click "Add to Cart" or "Book This Test"
  ↓
PatientSelectionModal opens
  ↓
User selects family members
  ↓
Click "Next (X selected)"
  ↓
selectedPatients stored
```

### **Step 2: Appointment Time**
```
AppointmentTimeModal opens
  ↓
User selects date from carousel
  ↓
User selects time slot
  ↓
Click "Confirm Appointment"
  ↓
appointmentDetails stored
```

### **Step 3: Location Selection** ✨ NEW!
```
LocationSelectionModal opens
  ↓
Shows success message with appointment details
  ↓
User chooses:
  ├─ Share my location (uses GPS)
  ├─ Select saved address
  └─ Add new address
  ↓
Click "Confirm & Book"
  ↓
Items added to cart with full details
  ↓
Success message shown
```

## Location Selection Features

### **Share Location Button**
- **Action**: Requests browser geolocation permission
- **Success**: Gets latitude/longitude coordinates
- **Display**: Shows coordinates (in real app, reverse geocode to address)
- **Auto-confirm**: Automatically confirms after 1 second
- **Error Handling**: Shows alert if permission denied or unavailable

### **Saved Addresses**
- **Display**: Shows all saved addresses with icons
- **Types**: Home (🏠), Work (🏢), Other (📍)
- **Default Badge**: Shows which address is default
- **Selection**: Click to select, shows checkmark when selected
- **Details**: Shows full address, city, state, pincode, landmark

### **Add Address Form**

#### **Fields**:
1. **Address Type** (Required)
   - Home, Work, Other
   - If "Other", custom label required

2. **Flat/House No** (Required)
   - Text input
   - Example: "13"

3. **Building Name** (Optional)
   - Text input
   - Example: "Sunshine Apartments"

4. **Area/Street** (Required)
   - Text input
   - Example: "Rajajinagar"

5. **Landmark** (Optional)
   - Text input
   - Example: "Near Metro Station"

6. **City** (Required)
   - Dropdown with 10 Karnataka cities:
     - Bangalore
     - Mysore
     - Mangalore
     - Hubli
     - Belgaum
     - Gulbarga
     - Davangere
     - Bellary
     - Tumkur
     - Shimoga

7. **State** (Fixed)
   - Always "Karnataka"
   - Disabled field

8. **Pincode** (Required)
   - 6 digits
   - Must start with 5 (Karnataka pincodes)
   - Validation on input
   - Helper text: "Karnataka pincodes start with 5"

#### **Validation**:
- All required fields must be filled
- Pincode must be 6 digits starting with 5
- Shows alert if validation fails

#### **Save Behavior**:
- Adds to saved addresses list
- Auto-selects the new address
- Closes form and shows address list
- Resets form fields

## Data Flow

### **Component Props**

**PatientSelectionModal**:
```javascript
{
  isOpen: boolean,
  onClose: () => void,
  onNext: (selectedPatients) => void
}
```

**AppointmentTimeModal**:
```javascript
{
  isOpen: boolean,
  onClose: () => void,
  onNext: (appointmentDetails) => void,
  selectedPatients: Array
}
```

**LocationSelectionModal**:
```javascript
{
  isOpen: boolean,
  onClose: () => void,
  onConfirm: (finalBookingDetails) => void,
  selectedPatients: Array,
  appointmentDetails: Object
}
```

### **Final Cart Item Structure**

```javascript
{
  _id: product.id,
  name: product.title,
  price: product.price,
  category: "Special Package",
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

## State Management (Product.jsx)

### **States**:
```javascript
const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
const [selectedPatientsForBooking, setSelectedPatientsForBooking] = useState([]);
const [appointmentDetailsForBooking, setAppointmentDetailsForBooking] = useState(null);
```

### **Handlers**:

```javascript
// Step 1 → Step 2
handlePatientSelectionNext(selectedPatients) {
  setSelectedPatientsForBooking(selectedPatients);
  setIsPatientModalOpen(false);
  setIsAppointmentModalOpen(true);
}

// Step 2 → Step 3
handleAppointmentTimeNext(appointmentDetails) {
  setAppointmentDetailsForBooking(appointmentDetails);
  setIsAppointmentModalOpen(false);
  setIsLocationModalOpen(true);
}

// Step 3 → Cart
handleLocationConfirm(finalBookingDetails) {
  // Add to cart with full details
  // Close all modals
  // Reset all states
  // Show success message
}
```

## UI Design

### **LocationSelectionModal Layout**

```
┌─────────────────────────────┐
│ ← Share Your Location       │ ← White header
├─────────────────────────────┤
│ ✓ Appointment confirmed     │ ← Success message
│   for Tue 6 at 05:30 AM     │   (emerald background)
│                             │
│ Share your Location, Get    │ ← Info text
│ On-Time Service             │
│                             │
│ [📍 Share my location]      │ ← Emerald button
│                             │
│ ─────── OR ───────          │ ← Divider
│                             │
│ Saved Addresses             │
│ ┌─────────────────────────┐ │
│ │ 🏠 Home         DEFAULT  │ │ ← Saved address
│ │ 13, Rajajinagar...       │ │   (selectable)
│ │ Bangalore, Karnataka     │ │
│ └─────────────────────────┘ │
│                             │
│ [+ Add Address]             │ ← Border button
├─────────────────────────────┤
│ [Confirm & Book]            │ ← Emerald button
└─────────────────────────────┘
```

### **Add Address Form Layout**

```
┌─────────────────────────────┐
│ Add New Address          ×  │
├─────────────────────────────┤
│ Address Type                │
│ [Home] [Work] [Other]       │ ← 3-column grid
│                             │
│ Flat / House No *           │
│ [____________]              │
│                             │
│ Building Name (Optional)    │
│ [____________]              │
│                             │
│ Area / Street *             │
│ [____________]              │
│                             │
│ Landmark (Optional)         │
│ [____________]              │
│                             │
│ City *                      │
│ [▼ Select City]             │
│                             │
│ State                       │
│ [Karnataka] (disabled)      │
│                             │
│ Pincode *                   │
│ [______]                    │
│ Karnataka pincodes start    │
│ with 5                      │
│                             │
│ [Save Address]              │ ← Emerald button
└─────────────────────────────┘
```

## Geolocation API Usage

```javascript
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      // Use coordinates
      // In real app: reverse geocode to get address
    },
    (error) => {
      // Handle error
      alert('Unable to get location');
    }
  );
} else {
  alert('Geolocation not supported');
}
```

## Karnataka Cities Supported

1. Bangalore
2. Mysore
3. Mangalore
4. Hubli
5. Belgaum
6. Gulbarga
7. Davangere
8. Bellary
9. Tumkur
10. Shimoga

## Pincode Validation

```javascript
// Only allow digits, max 6 characters
const value = e.target.value.replace(/\D/g, '').slice(0, 6);

// Validate Karnataka pincode (starts with 5)
if (!pincode.startsWith('5') || pincode.length !== 6) {
  alert('Please enter a valid Karnataka pincode');
  return;
}
```

## Success Messages

| Step | Message |
|------|---------|
| Patient Selection | (No message, goes to next step) |
| Appointment Time | (No message, goes to next step) |
| Location Selection | "✅ Appointment booked for X patient(s)!" |

## Files Modified/Created

### 1. **LocationSelectionModal.jsx** (Created)
- New component for location selection
- Geolocation sharing
- Saved addresses display
- Karnataka-specific address form

### 2. **AppointmentTimeModal.jsx** (Modified)
- Changed `onConfirm` prop to `onNext`
- Removed `location` from appointment details
- Now passes control to LocationSelectionModal

### 3. **Product.jsx** (Modified)
- Added `LocationSelectionModal` import
- Added `isLocationModalOpen` state
- Added `appointmentDetailsForBooking` state
- Created `handleAppointmentTimeNext()` handler
- Created `handleLocationConfirm()` handler
- Updated cart item structure to include location object

## User Experience Flow

```
1. User clicks "Add to Cart"
   ↓
2. Patient Selection Modal opens
   ├─ Select Rahul (75/M)
   ├─ Select Chakravarthi (43/M)
   └─ Click "Next (2 selected)"
   ↓
3. Appointment Time Modal opens
   ├─ Select date: Tue 06
   ├─ Select time: 05:30 AM
   └─ Click "Confirm Appointment"
   ↓
4. Location Selection Modal opens ✨ NEW!
   ├─ Shows: "✓ Appointment confirmed for Tue 6 at 05:30 AM"
   ├─ Option 1: Click "Share my location" (uses GPS)
   ├─ Option 2: Select "Home" from saved addresses
   ├─ Option 3: Click "Add Address" and fill form
   └─ Click "Confirm & Book"
   ↓
5. Items added to cart
   ├─ 1 item for Rahul with patient + appointment + location
   ├─ 1 item for Chakravarthi with patient + appointment + location
   └─ Success: "✅ Appointment booked for 2 patient(s)!"
```

## Future Enhancements

### **Potential Improvements**:
1. **Reverse Geocoding** - Convert GPS coordinates to readable address
2. **Map Integration** - Show location on map
3. **Address Autocomplete** - Google Places API integration
4. **Edit/Delete Addresses** - Manage saved addresses
5. **Set Default Address** - Allow users to change default
6. **Address Validation** - Verify address with postal service
7. **Multiple Locations** - Different location for each patient
8. **Delivery Instructions** - Add special instructions field

## Testing Checklist

- [ ] Patient modal opens on "Add to Cart"
- [ ] Can select multiple patients
- [ ] "Next" button opens appointment modal
- [ ] Can select date and time
- [ ] "Confirm Appointment" opens location modal
- [ ] Success message shows appointment details
- [ ] "Share my location" requests permission
- [ ] Geolocation works and shows coordinates
- [ ] Can select saved address
- [ ] "Add Address" opens form
- [ ] Form validates required fields
- [ ] Pincode validation works (must start with 5)
- [ ] City dropdown shows all 10 cities
- [ ] Can save new address
- [ ] New address appears in saved list
- [ ] Can select newly added address
- [ ] "Confirm & Book" adds to cart
- [ ] Cart items include location object
- [ ] Success message shows correct count
- [ ] All modals close after confirmation
- [ ] State resets properly
- [ ] Works on mobile (bottom sheet)
- [ ] Works on desktop (centered modal)

---

**Status**: ✅ Complete  
**Date**: 2026-01-31  
**Action**: Three-step booking flow with location selection  
**Components**: PatientSelectionModal + AppointmentTimeModal + LocationSelectionModal  
**User Benefit**: Complete booking experience with patient, appointment, and location details
