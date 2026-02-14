# Razorpay Payment Integration Guide

## Setup Complete! ✅

Razorpay payment gateway has been integrated for testing.

## Test Credentials (Already Added)

```env
RAZORPAY_KEY_ID=rzp_test_1DP5mmOlF5G5ag
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET
```

## Get Your Own Test Credentials

1. **Sign up for Razorpay**
   - Go to: https://dashboard.razorpay.com/signup
   - Sign up with your email
   - Complete verification

2. **Get API Keys**
   - Login to dashboard: https://dashboard.razorpay.com
   - Go to Settings → API Keys
   - Click "Generate Test Key"
   - Copy `Key ID` and `Key Secret`

3. **Update .env File**
   ```env
   RAZORPAY_KEY_ID=your_key_id_here
   RAZORPAY_KEY_SECRET=your_key_secret_here
   ```

4. **Restart Backend Server**
   ```bash
   cd backend
   node server.js
   ```

## Test Payment Cards

Use these test cards in Razorpay test mode:

### Success Cards:
- **Card Number**: `4111 1111 1111 1111`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVV**: Any 3 digits (e.g., `123`)
- **Name**: Any name

### Other Test Cards:
- **Mastercard**: `5555 5555 5555 4444`
- **Rupay**: `6522 2222 2222 2222`
- **Amex**: `3782 822463 10005`

### Test UPI IDs:
- **Success**: `success@razorpay`
- **Failure**: `failure@razorpay`

### Test Netbanking:
- Select any bank
- Use credentials: `test` / `test`

## How It Works

### 1. User Flow:
1. User adds items to cart
2. Goes to payment page
3. Selects payment method (UPI/Card/Netbanking/Wallet)
4. Clicks "Pay" button
5. Razorpay popup opens
6. User completes payment
7. Payment is verified
8. Order is confirmed

### 2. Backend Flow:
```
POST /api/v1/payment/razorpay/create-order
  ↓
Creates Razorpay order
  ↓
Returns order ID to frontend
  ↓
Frontend opens Razorpay checkout
  ↓
User completes payment
  ↓
POST /api/v1/payment/razorpay/verify
  ↓
Verifies payment signature
  ↓
Updates order status
  ↓
Returns success
```

## Testing Steps

1. **Start Backend**:
   ```bash
   cd backend
   node server.js
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```

3. **Test Payment**:
   - Add items to cart
   - Go to checkout
   - Select payment method
   - Click "Pay"
   - Use test card: `4111 1111 1111 1111`
   - Complete payment
   - See success page!

## Payment Methods Supported

✅ **Credit/Debit Cards**
- Visa, Mastercard, Rupay, Amex

✅ **UPI**
- Google Pay, PhonePe, Paytm, BHIM

✅ **Net Banking**
- All major Indian banks

✅ **Wallets**
- Paytm, PhonePe, Amazon Pay, Mobikwik

✅ **Cash on Delivery**
- For orders above ₹1000

## Features Implemented

1. ✅ Create Razorpay order
2. ✅ Open Razorpay checkout popup
3. ✅ Handle payment success
4. ✅ Verify payment signature
5. ✅ Update order status
6. ✅ Clear cart after payment
7. ✅ Show success page
8. ✅ COD support

## Security

- Payment signature verification
- Secure API key storage
- HTTPS required in production
- PCI DSS compliant

## Production Checklist

Before going live:

1. ☐ Get production API keys from Razorpay
2. ☐ Update .env with production keys
3. ☐ Enable HTTPS on your domain
4. ☐ Test with real small amount
5. ☐ Set up webhooks for payment notifications
6. ☐ Configure payment success/failure URLs
7. ☐ Add GST/tax calculations
8. ☐ Set up refund process

## Troubleshooting

### Payment popup not opening?
- Check if Razorpay script is loaded in HTML
- Check browser console for errors
- Verify API keys are correct

### Payment verification failing?
- Check if signature verification is correct
- Verify order ID matches
- Check backend logs

### Order not updating?
- Check if order exists in database
- Verify user authentication
- Check backend API response

## Support

- Razorpay Docs: https://razorpay.com/docs/
- Test Mode: https://razorpay.com/docs/payments/payments/test-card-details/
- Dashboard: https://dashboard.razorpay.com/

## Next Steps

1. Test all payment methods
2. Test payment failure scenarios
3. Add order confirmation email
4. Add payment receipt generation
5. Set up refund process
6. Add payment analytics

---

**Your Razorpay integration is ready for testing!** 🎉
