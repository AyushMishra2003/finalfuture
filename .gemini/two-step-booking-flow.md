# Two-Step Booking Flow: Patient Selection → Appointment Time

## Overview
Implemented a two-step booking flow where users first select family members, then choose appointment date and time before adding items to cart.

## New Component Created

### **AppointmentTimeModal.jsx**
**Location**: `frontend/src/components/AppointmentTimeModal.jsx`

**Features**:
✅ **Date Selection** - Horizontal scrollable carousel showing next 7 days  
✅ **Time Slots** - Grid of available time slots (05:30 AM - 10:30 AM)  
✅ **Fasting Warning** - Amber alert box for 8-hour fasting requirement  
✅ **Location Display** - Shows current location with "Change" option  
✅ **Responsive Design** - Bottom sheet on mobile, centered modal on desktop  
✅ **High Z-Index** - 9999 to appear above all content  

**UI Components**:
1. **Header** - White background with back button and title
2. **Fasting Warning** - Amber box with AlertCircle icon
3. **Date Carousel** - Horizontal scroll with day/date cards
4. **Time Slot Grid** - 3-column grid of time buttons
5. **Location Card** - Gray background with MapPin icon
6. **Confirm Button** - Emerald gradient button (disabled until both selected)

## Booking Flow

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
Modal closes, selectedPatients stored
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
Items added to cart with appointment details
  ↓
Success message shown
```

## Data Flow

### **PatientSelectionModal**
```javascript
Props:
- isOpen: boolean
- onClose: () => void
- onNext: (selectedPatients) => void  // Changed from onConfirm

Emits:
- onNext(selectedPatients) // Array of patient objects
```

### **AppointmentTimeModal**
```javascript
Props:
- isOpen: boolean
- onClose: () => void
- onConfirm: (appointmentDetails) => void
- selectedPatients: Array

Emits:
- onConfirm({
    date: { id, day, date, month, fullDate },
    time: "05:30 AM",
    location: "13, Rajajinagar...",
    patients: [...]
  })
```

## Cart Item Structure

### **Before (Patient Only)**
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
  }
}
```

### **After (Patient + Appointment)**
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
    location: "13, Rajajinagar, Rajajinagar - 560021"
  }
}
```

## State Management (Product.jsx)

```javascript
// State
const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
const [selectedPatientsForBooking, setSelectedPatientsForBooking] = useState([]);

// Flow
handleAddToCartClick()
  → Opens PatientSelectionModal

handlePatientSelectionNext(selectedPatients)
  → Stores selectedPatients
  → Closes PatientSelectionModal
  → Opens AppointmentTimeModal

handleAppointmentConfirm(appointmentDetails)
  → Adds to cart with patient + appointment data
  → Closes AppointmentTimeModal
  → Resets selectedPatientsForBooking
  → Shows success message
```

## UI Design

### **AppointmentTimeModal Layout**

```
┌─────────────────────────────┐
│ ← Select Appointment Time   │ ← White header
├─────────────────────────────┤
│ Select date and time        │
│                             │
│ ⚠ This test requires 8      │ ← Amber warning
│   hours of fasting...       │
│                             │
│ [Tue] [Wed] [Thu] [Fri]     │ ← Date carousel
│  06    07    08    09       │   (horizontal scroll)
│                             │
│ [05:30] [06:00] [06:30]     │ ← Time slots
│ [08:30] [09:00] [09:30]     │   (3-column grid)
│ [10:00] [10:30]             │
│                             │
│ 📍 13, Rajajinagar...       │ ← Location
│    Change                   │
├─────────────────────────────┤
│ [Confirm Appointment]       │ ← Emerald button
└─────────────────────────────┘
```

## Features Breakdown

### **Date Selection**
- Shows next 7 days
- Auto-generates dates from today
- Displays: Day name (3 letters) + Date number
- Selected: Cyan background
- Unselected: White with gray border
- Horizontal scroll (mobile-friendly)

### **Time Slots**
- Pre-defined slots: 05:30 AM - 10:30 AM
- 3-column grid layout
- Selected: Cyan background
- Unselected: White with gray border
- Disabled until date is selected (optional)

### **Fasting Warning**
- Amber background (#FEF3C7)
- AlertCircle icon
- Bold text for "8 hours of fasting"
- Helps users choose appropriate time

### **Location**
- Shows current/default location
- MapPin icon
- "Change" button (future functionality)
- Gray background for subtle emphasis

### **Validation**
- "Confirm Appointment" button disabled until:
  - Date is selected AND
  - Time is selected
- Alert shown if trying to confirm without selection

## Responsive Design

### **Mobile (0-1023px)**
- Bottom sheet layout
- Max height: 80vh
- Slides up from bottom
- Horizontal date scroll
- 3-column time grid

### **Desktop (1024px+)**
- Centered modal
- Max height: 90vh
- Flexbox centering
- Same date/time layout
- Max width: 28rem (448px)

## Success Messages

| Action | Message |
|--------|---------|
| Patient Selection | (No message, goes to next step) |
| Appointment Confirmed | "✅ Appointment booked for X patient(s)!" |

## Files Modified

### 1. **AppointmentTimeModal.jsx** (Created)
- New component for appointment time selection
- Date carousel + time slot grid
- Fasting warning + location display

### 2. **PatientSelectionModal.jsx** (Modified)
- Changed `onConfirm` prop to `onNext`
- Removed `setSelectedPatients([])` from handleConfirm
- Parent component now handles state reset

### 3. **Product.jsx** (Modified)
- Added `AppointmentTimeModal` import
- Added `isAppointmentModalOpen` state
- Added `selectedPatientsForBooking` state
- Created `handlePatientSelectionNext()` handler
- Created `handleAppointmentConfirm()` handler
- Updated cart item structure to include appointment details

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
   ├─ Location shown: 13, Rajajinagar...
   └─ Click "Confirm Appointment"
   ↓
4. Items added to cart
   ├─ 1 item for Rahul with appointment
   ├─ 1 item for Chakravarthi with appointment
   └─ Success: "✅ Appointment booked for 2 patient(s)!"
```

## Future Enhancements

### **Potential Improvements**:
1. **Dynamic Time Slots** - Fetch available slots from backend
2. **Blocked Dates** - Disable unavailable dates
3. **Location Change** - Implement location picker
4. **Calendar View** - Option to view full month calendar
5. **Time Zone** - Display and handle time zones
6. **Appointment Summary** - Show summary before confirming
7. **Edit Appointment** - Allow editing after confirmation
8. **Recurring Appointments** - Book multiple dates at once

## Testing Checklist

- [x] Patient modal opens on "Add to Cart"
- [x] Can select multiple patients
- [x] "Next" button opens appointment modal
- [x] Patient modal closes when appointment modal opens
- [x] Can select date from carousel
- [x] Can select time slot
- [x] Confirm button disabled until both selected
- [x] Confirm button enabled when both selected
- [x] Items added to cart with appointment data
- [x] Success message shows correct count
- [x] Both modals close after confirmation
- [x] State resets properly
- [x] Works on mobile (bottom sheet)
- [x] Works on desktop (centered modal)

---

**Status**: ✅ Complete  
**Date**: 2026-01-31  
**Action**: Two-step booking flow implemented  
**Components**: PatientSelectionModal + AppointmentTimeModal  
**User Benefit**: Complete booking experience with date/time selection
