# 📱 Mobile Booking Flow - Quick Reference Card

## 🚀 Quick Start

### Access Demo Page
```
http://localhost:3000/booking-demo
```

### Basic Integration
```javascript
import MobileBookingFlow from '../components/MobileBookingFlow';

<MobileBookingFlow
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  testDetails={{ id, name, price, category }}
  onComplete={(cartItem) => {
    // Add to cart logic
  }}
/>
```

## 📋 The 4 Steps

| Step | Title | Features |
|------|-------|----------|
| 1️⃣ | **Select Patient** | Multi-select, Quick add (Mom/Dad/Spouse), Add new patient form |
| 2️⃣ | **Choose Time** | 7-day date picker, Time slots, Fasting info, Service location |
| 3️⃣ | **Share Location** | GPS location, Manual address, Map preview, Validation |
| 4️⃣ | **Review & Pay** | Summary, Price breakdown, Patient list, Add to cart |

## 🎨 Design Tokens

```css
/* Colors */
Primary: emerald-500, emerald-600
Secondary: teal-500, teal-600
Success: emerald-green
Warning: amber
Error: red

/* Spacing */
Button Height: 48px (mobile), 56px (desktop)
Border Radius: 12px (cards), 16px (buttons)
Padding: 16px (mobile), 24px (desktop)

/* Animations */
Duration: 300ms
Easing: cubic-bezier(0.4, 0, 0.2, 1)
```

## 📊 Data Structure

### Input (testDetails)
```javascript
{
  id: 'test_123',
  name: 'Test Name',
  price: 500,
  category: 'Category'
}
```

### Output (cartItem)
```javascript
{
  ...testDetails,
  bookingDetails: {
    patients: [{ id, name, age, gender, phone, relation }],
    appointmentDate: Date,
    appointmentTime: '09:00 AM',
    location: { lat, lng },
    address: { street, area, city, pincode, landmark }
  }
}
```

## ✅ Validation Rules

| Step | Required Fields | Validation |
|------|----------------|------------|
| 1 | At least 1 patient | Name, age, gender for new patients |
| 2 | Date & Time | Must select both |
| 3 | Location OR Address | Pincode must be 6 digits |
| 4 | Review all | Auto-validated |

## 🔧 Common Customizations

### Change Date Range
```javascript
// In generateDates()
for (let i = 0; i < 14; i++) { // 14 days instead of 7
```

### Modify Time Slots
```javascript
const timeSlots = [
  { time: '08:00 AM', available: true },
  // Add more slots...
];
```

### Update Pricing
```javascript
// In calculateTotal()
const discount = Math.floor(subtotal * 0.15); // 15%
const tax = Math.floor((subtotal - discount) * 0.18); // 18%
```

### Change City
```javascript
const [manualAddress, setManualAddress] = useState({
  city: 'Mumbai', // Change default city
  // ...
});
```

## 🐛 Quick Fixes

| Issue | Solution |
|-------|----------|
| Modal not opening | Check `isOpen={true}` |
| GPS not working | Use HTTPS, check permissions |
| Styling broken | Verify Tailwind CSS config |
| Animation laggy | Check Framer Motion version |
| Form not validating | Check required field values |

## 📱 Responsive Breakpoints

```css
Mobile: < 768px (Full screen modal)
Tablet: 768px - 1024px (Centered modal)
Desktop: > 1024px (Max-width 512px modal)
```

## 🎯 Key Props

| Prop | Type | Required | Default |
|------|------|----------|---------|
| isOpen | boolean | ✅ | - |
| onClose | function | ✅ | - |
| testDetails | object | ✅ | - |
| onComplete | function | ✅ | - |

## 📦 Files Created

```
src/
├── components/
│   └── MobileBookingFlow.jsx ⭐ Main component
├── pages/
│   └── BookingFlowDemo.jsx 🎨 Demo page
├── examples/
│   └── MobileBookingFlowExamples.jsx 📚 7 examples
└── docs/
    ├── MOBILE_BOOKING_FLOW.md 📖 Full docs
    └── IMPLEMENTATION_SUMMARY.md 📝 Summary
```

## 🧪 Testing Checklist

- [ ] Open `/booking-demo`
- [ ] Book a test
- [ ] Select patient
- [ ] Add new patient
- [ ] Choose date & time
- [ ] Share GPS location
- [ ] Enter manual address
- [ ] Review summary
- [ ] Add to cart
- [ ] Check localStorage
- [ ] Verify cart count

## 💡 Pro Tips

1. **Multi-Patient**: Select multiple patients for family checkups
2. **Quick Add**: Use quick buttons for common relations
3. **GPS First**: Try GPS before manual address
4. **Validation**: All steps validate before proceeding
5. **Back Navigation**: Use back button to edit previous steps
6. **Persistent Data**: Data persists across steps

## 🔗 Quick Links

- Demo: `/booking-demo`
- Docs: `MOBILE_BOOKING_FLOW.md`
- Examples: `src/examples/MobileBookingFlowExamples.jsx`
- Component: `src/components/MobileBookingFlow.jsx`

## 📞 Need Help?

1. Check documentation
2. Review examples
3. Test on demo page
4. Check browser console for errors

---

**Version**: 1.0.0  
**Last Updated**: January 30, 2026  
**Status**: ✅ Production Ready
