# HDFC SmartGateway SDK Integration Guide

## Overview
HDFC Bank SmartGateway payment integration with SDK for web application.

## Integration Type
**SDK Integration** (Recommended for web applications)

## Configuration

### Backend (.env)
```env
# HDFC SmartGateway Configuration
HDFC_API_KEY=A9949FA93754229AB0640140B902BC
HDFC_MERCHANT_ID=SG2238
HDFC_CLIENT_ID=hdfcmaster
HDFC_BASE_URL=https://smartgatewayuat.hdfcbank.com
HDFC_RESPONSE_KEY=776522EDCCB4734AAA9C0975FB2724
HDFC_ENABLE_LOGGING=true

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

## Implementation

### 1. SDK Script Loading
SDK automatically loads in `HDFCPayment.jsx` component:
```javascript
https://smartgateway.hdfcuat.bank.in/checkout/v1/checkout.js
```

### 2. Payment Flow

#### Step 1: Create Order
```javascript
POST /api/v1/payment/hdfc/create-order
{
  "orderId": "order_id",
  "amount": 1000,
  "customerName": "Customer Name",
  "customerEmail": "email@example.com",
  "customerPhone": "9876543210"
}
```

#### Step 2: Initialize Checkout
```javascript
const options = {
  merchantId: "SG2263",
  orderId: "unique_order_id",
  amount: "1000.00",
  currency: "INR",
  customerName: "Customer Name",
  customerEmail: "email@example.com",
  customerPhone: "9876543210",
  hash: "generated_hash",
  returnUrl: "http://localhost:3000/payment/callback",
  handler: function(response) {
    // Handle success
  }
};

const checkout = new HDFCCheckout(options);
checkout.open();
```

#### Step 3: Handle Callback
```javascript
POST /api/v1/payment/hdfc/callback
{
  "orderId": "order_id",
  "transactionId": "txn_id",
  "status": "SUCCESS",
  "amount": "1000.00",
  "hash": "response_hash"
}
```

## Usage in Components

### Example: Checkout Page
```javascript
import HDFCPayment from '../components/HDFCPayment';

function CheckoutPage() {
  const handleSuccess = (data) => {
    console.log('Payment successful:', data);
    navigate(`/order-confirmation/${data.orderId}`);
  };

  const handleFailure = (error) => {
    console.error('Payment failed:', error);
    alert('Payment failed: ' + error);
  };

  return (
    <HDFCPayment
      orderId={orderId}
      amount={totalAmount}
      onSuccess={handleSuccess}
      onFailure={handleFailure}
    />
  );
}
```

## Mandatory Requirements

### 1. Customer ID
- Pass unique `customer_id` for each customer
- Use user's database ID or phone number

### 2. Order ID Format
- Length: Less than 21 characters
- Format: Alphanumeric only (no special characters)
- Type: Non-sequential
- Example: `ORD${Date.now()}${randomString}`

### 3. UDF2 Parameter
- DO NOT use UDF2 for additional information
- It's blocked for tokenization

### 4. Response Page Display
Must show in real-time:
- Order number
- Amount
- Success message
- Transaction ID

## Security

### Hash Generation (Request)
```javascript
const hashString = `${merchantId}|${orderId}|${amount}|${currency}|${API_KEY}`;
const hash = crypto.createHash('sha256').update(hashString).digest('hex');
```

### Hash Verification (Response)
```javascript
const hashString = `${orderId}|${amount}|${status}|${RESPONSE_KEY}`;
const calculatedHash = crypto.createHash('sha256').update(hashString).digest('hex');
return calculatedHash === receivedHash;
```

## Testing

### Test Credentials
- Merchant ID: `SG2263`
- API Key: `95D1BCDC7A948EDB1869AB695E860C`
- Response Key: `8B6FA0D300A448480B6FAD7BB59B3D`
- Base URL: `https://smartgateway.hdfcuat.bank.in`

### Test Cards
Refer to HDFC documentation for test card numbers.

## API Endpoints

### Backend Routes
```
POST   /api/v1/payment/hdfc/create-order    - Create payment order
POST   /api/v1/payment/hdfc/callback        - Handle payment callback
POST   /api/v1/payment/hdfc/webhook         - Handle webhook notifications
GET    /api/v1/payment/hdfc/verify/:orderId - Verify payment status
GET    /api/v1/payment/hdfc/config          - Get public config
POST   /api/v1/payment/hdfc/refund          - Initiate refund (Admin)
```

## Frontend Routes
```
/payment/callback - Payment callback page
/payment/cancel   - Payment cancellation page
```

## Features

### Supported Payment Methods
- Credit Cards
- Debit Cards
- Net Banking
- UPI
- Wallets

### SDK Features
- Modal popup for payment
- Automatic form validation
- Secure payment processing
- Real-time status updates
- Mobile responsive

## Error Handling

### Common Errors
1. **Invalid Hash**: Check API_KEY and RESPONSE_KEY
2. **Order Not Found**: Verify orderId format
3. **SDK Not Loaded**: Check script URL and network
4. **Payment Failed**: Check customer details and amount

## Production Checklist

- [ ] Update to production credentials
- [ ] Change BASE_URL to production
- [ ] Update return/cancel URLs
- [ ] Enable webhook notifications
- [ ] Test all payment methods
- [ ] Verify hash generation
- [ ] Test refund flow
- [ ] Enable logging for monitoring

## Support

### Documentation
- SDK Integration: https://smartgateway.hdfcbank.com/docs/hypercheckout-mobile-sdk/web/overview/integration-architecture
- API Reference: https://smartgateway.hdfcbank.com/docs/smartgateway-api-ref-basicauth/docs/overview/integration-architecture

### Contact
- HDFC Support: support@hdfcbank.com
- Technical Issues: Check HDFC developer portal

## Notes

1. SDK integration is mandatory for mobile applications
2. UPI Intent calls won't work on WebView
3. Always verify payment on backend
4. Store transaction details securely
5. Implement proper error handling
6. Use HTTPS in production
7. Keep credentials secure
8. Monitor payment logs regularly
