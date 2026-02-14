# 🏦 HDFC SmartGateway Payment Integration - Complete Setup

## ✅ Configuration Status: READY

Your HDFC payment gateway credentials have been successfully configured!

---

## 📋 Credentials Configured

```env
HDFC_API_KEY=A9949FA93754229AB0640140B902BC
HDFC_MERCHANT_ID=SG2238
HDFC_CLIENT_ID=hdfcmaster
HDFC_BASE_URL=https://smartgatewayuat.hdfcbank.com
HDFC_RESPONSE_KEY=776522EDCCB4734AAA9C0975FB2724
HDFC_ENABLE_LOGGING=true
```

**Environment:** UAT (User Acceptance Testing)

---

## 🚀 Quick Start

### 1. Test Configuration

```bash
cd backend
node test-hdfc-config.js
```

### 2. Start Backend Server

```bash
cd backend
npm run dev
```

### 3. Start Frontend

```bash
cd frontend
npm start
```

---

## 🔧 Implementation Details

### Backend Files Updated

1. **`.env`** - Environment variables configured
2. **`controllers/payment.js`** - HDFC payment handlers implemented
3. **`routes/payment.js`** - Payment routes configured

### Frontend Files

1. **`components/HDFCPayment.jsx`** - Payment component ready
2. **`components/HDFCPayment.css`** - Styled payment UI

---

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/payment/hdfc/config` | Get HDFC configuration |
| `POST` | `/api/v1/payment/hdfc/callback` | Handle payment callback |
| `POST` | `/api/v1/payment/hdfc/webhook` | Handle payment webhook |

### Protected Endpoints (Requires Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/payment/hdfc/create-order` | Create payment order |
| `GET` | `/api/v1/payment/hdfc/verify/:orderId` | Verify payment status |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/payment/hdfc/refund` | Initiate refund |

---

## 🔄 Payment Flow

```
1. User adds items to cart
   ↓
2. User proceeds to checkout
   ↓
3. Order is created in database
   ↓
4. Frontend calls: POST /api/v1/payment/hdfc/create-order
   ↓
5. Backend generates payment hash and returns payment URL
   ↓
6. User is redirected to HDFC SmartGateway
   ↓
7. User completes payment on HDFC page
   ↓
8. HDFC redirects back to: /payment/callback
   ↓
9. Backend verifies payment hash
   ↓
10. Order status updated to "paid"
    ↓
11. Confirmation email sent to user
```

---

## 💻 Usage Example

### Frontend Integration

```jsx
import HDFCPayment from './components/HDFCPayment';

function CheckoutPage() {
  const handleSuccess = (data) => {
    console.log('Payment successful:', data);
    // Redirect to success page
  };

  const handleFailure = (error) => {
    console.error('Payment failed:', error);
    // Show error message
  };

  return (
    <HDFCPayment
      orderId="order_123"
      amount={1500}
      onSuccess={handleSuccess}
      onFailure={handleFailure}
    />
  );
}
```

### Backend API Call

```javascript
// Create payment order
const response = await axios.post(
  '/api/v1/payment/hdfc/create-order',
  {
    orderId: 'order_123',
    amount: 1500,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+919876543210'
  },
  {
    headers: { Authorization: `Bearer ${token}` }
  }
);

// Response
{
  "success": true,
  "data": {
    "paymentUrl": "https://smartgatewayuat.hdfcbank.com/payment",
    "paymentData": {
      "merchantId": "SG2238",
      "orderId": "order_123",
      "amount": "1500",
      "currency": "INR",
      "hash": "generated_hash_here",
      ...
    },
    "clientId": "hdfcmaster"
  }
}
```

---

## 🔐 Security Features

### Hash Generation

Payment requests are secured with SHA-256 hash:

```javascript
hash = SHA256(merchantId|orderId|amount|currency|API_KEY)
```

### Response Verification

Payment responses are verified with:

```javascript
hash = SHA256(orderId|amount|status|RESPONSE_KEY)
```

### SSL/TLS

All communications use HTTPS encryption.

---

## 🧪 Testing

### Test Payment Flow

1. **Create Test Order:**
   ```bash
   POST http://localhost:5000/api/v1/orders
   ```

2. **Initiate Payment:**
   ```bash
   POST http://localhost:5000/api/v1/payment/hdfc/create-order
   ```

3. **Test Cards (UAT Environment):**
   - **Success:** 4111 1111 1111 1111
   - **Failure:** 4000 0000 0000 0002
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date

### Verify Configuration

```bash
cd backend
node test-hdfc-config.js
```

---

## 📊 Payment Status Tracking

### Order Status Flow

```
pending → confirmed (after payment) → processing → completed
```

### Database Fields

```javascript
{
  isPaid: true,
  paidAt: Date,
  paymentMethod: "HDFC SmartGateway",
  paymentResult: {
    id: "transaction_id",
    status: "SUCCESS",
    payment_mode: "Credit Card",
    bank_ref_no: "ref_123",
    response_message: "Payment successful"
  },
  orderStatus: "confirmed"
}
```

---

## 🔍 Debugging

### Enable Detailed Logging

Already enabled in `.env`:
```env
HDFC_ENABLE_LOGGING=true
```

### Check Logs

Backend console will show:
- Payment order creation
- Callback received
- Webhook notifications
- Hash verification results

### Common Issues

1. **Invalid Hash Error**
   - Verify API_KEY and RESPONSE_KEY
   - Check hash generation logic

2. **Callback Not Received**
   - Verify returnUrl and notifyUrl
   - Check firewall settings

3. **Payment Stuck**
   - Check HDFC dashboard
   - Verify webhook endpoint is accessible

---

## 🌐 URLs Configuration

### Current Setup (Development)

```env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

### Production Setup

Update `.env` with your production URLs:

```env
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

**Important:** Update these URLs in HDFC merchant dashboard!

---

## 📧 Notifications

### Email Confirmation

Automatically sent after successful payment:
- Order confirmation
- Payment receipt
- Test details

### SMS Notification

Configure SMS service for:
- Payment confirmation
- Booking details
- Sample collection reminder

---

## 🔄 Refund Process

### Initiate Refund (Admin Only)

```javascript
POST /api/v1/payment/hdfc/refund

{
  "orderId": "order_123",
  "amount": 1500,
  "reason": "Customer request"
}
```

### Refund Status

Check order status:
```javascript
orderStatus: "refunded"
```

---

## 📱 Mobile Integration

The same API endpoints work for mobile apps:

```javascript
// React Native / Flutter
const response = await fetch(
  'https://api.yourdomain.com/api/v1/payment/hdfc/create-order',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      orderId: orderId,
      amount: amount,
      customerName: name,
      customerEmail: email,
      customerPhone: phone
    })
  }
);
```

---

## 🚀 Going Live

### Pre-Production Checklist

- [ ] Test all payment scenarios
- [ ] Verify callback URLs
- [ ] Test refund process
- [ ] Check email notifications
- [ ] Verify SSL certificates
- [ ] Update production URLs
- [ ] Test with real cards (small amounts)

### Switch to Production

1. **Get Production Credentials from HDFC**
2. **Update `.env`:**
   ```env
   HDFC_BASE_URL=https://smartgateway.hdfcbank.com
   HDFC_API_KEY=production_api_key
   HDFC_RESPONSE_KEY=production_response_key
   ```
3. **Update URLs in HDFC Dashboard**
4. **Test thoroughly before launch**

---

## 📞 Support

### HDFC Support

- **Email:** smartgateway@hdfcbank.com
- **Phone:** 1800-XXX-XXXX
- **Portal:** https://smartgateway.hdfcbank.com

### Technical Issues

Check logs in:
- Backend console
- Browser console
- HDFC merchant dashboard

---

## ✅ Verification Checklist

- [x] HDFC credentials configured in `.env`
- [x] Payment controller implemented
- [x] Payment routes configured
- [x] Frontend component ready
- [x] Hash generation implemented
- [x] Response verification implemented
- [x] Callback handler ready
- [x] Webhook handler ready
- [x] Email notifications configured
- [x] Refund functionality implemented

---

## 🎉 You're All Set!

Your HDFC SmartGateway payment integration is complete and ready to use!

### Next Steps:

1. Run the test script: `node backend/test-hdfc-config.js`
2. Start your servers
3. Test the payment flow
4. Monitor the logs

**Happy Testing! 🚀**
