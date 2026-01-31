# Mobile Booking Flow - Complete Guide

## Overview
A comprehensive 4-step mobile-first booking wizard for medical test appointments with patient selection, scheduling, location sharing, and order summary.

## Features

### ✨ Step 1: Select Family Member
- Display existing family members with selection
- Quick add buttons (Mom, Dad, Spouse, Other)
- Inline form for adding new family members
- Multi-patient selection support
- Real-time validation

### 📅 Step 2: Select Appointment Time
- Horizontal scrollable date picker (7 days)
- Time slot grid with availability status
- Important info banners (fasting requirements)
- Service location display with change option
- Today indicator on current date

### 📍 Step 3: Share Your Location
- GPS-based location sharing
- Manual address entry form
- Map preview placeholder
- Success confirmation banner
- Address validation

### 🛒 Step 4: Order Summary
- Complete booking details review
- Selected patients list
- Appointment date & time
- Location/address display
- Detailed price breakdown:
  - Base price × patient count
  - Consultation fee (if any)
  - Discount calculation
  - Tax calculation
  - Total payable amount
- Add to Cart / Continue Shopping CTAs

## Usage

### Basic Implementation

```javascript
import MobileBookingFlow from '../components/MobileBookingFlow';

function YourComponent() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const testDetails = {
    id: 'test_123',
    name: 'Complete Blood Count (CBC)',
    price: 500,
    category: 'Blood Test'
  };

  const handleBookingComplete = (cartItem) => {
    // Add to cart with all booking details
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    existingCart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Trigger cart update
    window.dispatchEvent(new Event('storage'));
    
    alert('Test added to cart successfully!');
  };

  return (
    <>
      <button onClick={() => setIsBookingOpen(true)}>
        Book This Test
      </button>

      <MobileBookingFlow
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        testDetails={testDetails}
        onComplete={handleBookingComplete}
      />
    </>
  );
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | boolean | Yes | Controls modal visibility |
| `onClose` | function | Yes | Called when modal is closed |
| `testDetails` | object | Yes | Test/package information |
| `onComplete` | function | Yes | Called when booking is complete |

### Test Details Object Structure

```javascript
{
  id: 'unique_test_id',
  name: 'Test Name',
  price: 500,
  category: 'Test Category',
  description: 'Test description',
  // ... other test details
}
```

### Booking Data Structure (Returned in onComplete)

```javascript
{
  ...testDetails,
  bookingDetails: {
    patients: [
      {
        id: 1,
        name: 'Patient Name',
        age: 28,
        gender: 'Male',
        phone: '9876543210',
        relation: 'Self'
      }
    ],
    appointmentDate: Date object,
    appointmentTime: '09:00 AM',
    location: {
      lat: 12.9716,
      lng: 77.5946
    },
    address: {
      street: 'Street Address',
      area: 'Area/Locality',
      city: 'Bengaluru',
      pincode: '560001',
      landmark: 'Landmark'
    }
  }
}
```

## Customization

### Modifying Time Slots

Edit the `timeSlots` array in the component:

```javascript
const timeSlots = [
  { time: '06:00 AM', available: true },
  { time: '07:00 AM', available: true },
  // Add more slots...
];
```

### Changing Date Range

Modify the `generateDates()` function:

```javascript
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) { // Change to 14 days
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};
```

### Custom Price Calculation

Update the `calculateTotal()` function:

```javascript
const calculateTotal = () => {
  const basePrice = testDetails?.price || 0;
  const patientCount = bookingData.selectedPatients.length;
  const subtotal = basePrice * patientCount;
  const consultationFee = 100; // Add consultation fee
  const discount = Math.floor(subtotal * 0.15); // 15% discount
  const tax = Math.floor((subtotal - discount) * 0.18); // 18% GST
  const total = subtotal + consultationFee - discount + tax;

  return { subtotal, consultationFee, discount, tax, total, patientCount };
};
```

## Styling

The component uses Tailwind CSS classes. Key color scheme:
- Primary: Emerald (emerald-500, emerald-600)
- Secondary: Teal (teal-500, teal-600)
- Success: Emerald green
- Warning: Amber
- Error: Red

### Custom Animations

Uses Framer Motion for smooth transitions:
- Slide animations between steps
- Fade in/out for modal
- Progress bar animation

## Validation Rules

### Step 1 (Patient Selection)
- At least one patient must be selected
- New patient requires: name, age, gender

### Step 2 (Appointment)
- Date must be selected
- Time slot must be selected
- Only available slots can be selected

### Step 3 (Location)
- Either GPS location or manual address required
- Manual address requires: street, area, pincode (6 digits)

### Step 4 (Summary)
- All previous steps must be completed
- Review before final confirmation

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Touch-friendly button sizes (minimum 44px)
- High contrast colors
- Clear focus states

## Mobile Optimization

- Full-screen on mobile devices
- Sticky header and footer
- Smooth scrolling
- Touch gestures support
- Responsive grid layouts
- Optimized for portrait and landscape

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

```json
{
  "react": "^18.0.0",
  "framer-motion": "^10.0.0",
  "lucide-react": "^0.263.0"
}
```

## Integration Examples

### With Existing Cart System

```javascript
const handleBookingComplete = (cartItem) => {
  // Your existing cart logic
  addToCart(cartItem);
  
  // Navigate to cart
  navigate('/cart');
};
```

### With API Integration

```javascript
const handleBookingComplete = async (cartItem) => {
  try {
    const response = await apiService.createBooking(cartItem);
    
    if (response.success) {
      // Add to local cart
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push({
        ...cartItem,
        bookingId: response.bookingId
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      
      alert('Booking created successfully!');
    }
  } catch (error) {
    console.error('Booking failed:', error);
    alert('Failed to create booking. Please try again.');
  }
};
```

## Troubleshooting

### Modal not opening
- Ensure `isOpen` prop is set to `true`
- Check for z-index conflicts
- Verify Framer Motion is installed

### GPS location not working
- Check browser permissions
- Ensure HTTPS (required for geolocation)
- Provide fallback to manual address

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check for CSS conflicts
- Verify all dependencies are installed

## Performance Tips

1. **Lazy load the component:**
```javascript
const MobileBookingFlow = lazy(() => import('./components/MobileBookingFlow'));
```

2. **Memoize expensive calculations:**
```javascript
const totalPrice = useMemo(() => calculateTotal(), [bookingData]);
```

3. **Debounce form inputs:**
```javascript
const debouncedSearch = useDebounce(searchTerm, 300);
```

## Future Enhancements

- [ ] Multiple test selection in single booking
- [ ] Recurring appointment scheduling
- [ ] Payment integration
- [ ] SMS/Email confirmation
- [ ] Calendar integration
- [ ] Prescription upload
- [ ] Insurance integration
- [ ] Multi-language support

## License

MIT License - Feel free to use and modify for your projects.

## Support

For issues or questions, please contact the development team or create an issue in the repository.
