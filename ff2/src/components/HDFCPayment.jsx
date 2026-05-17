import React, { useEffect, useState } from 'react';
import { baseUrl } from '../utils/config';

const HDFCPayment = ({ orderId, amount, onSuccess, onFailure }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load HDFC SDK script
    const script = document.createElement('script');
    script.src = 'https://smartgateway.hdfcuat.bank.in/checkout/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initiatePayment = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      // Create HDFC order
      const response = await fetch(`${baseUrl}/api/v1/payment/hdfc/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          amount,
          customerName: user.name,
          customerEmail: user.email,
          customerPhone: user.phone
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment order');
      }

      // Initialize HDFC Checkout
      const options = {
        merchantId: data.data.paymentData.merchantId,
        orderId: data.data.paymentData.orderId,
        amount: data.data.paymentData.amount,
        currency: data.data.paymentData.currency,
        customerName: data.data.paymentData.customerName,
        customerEmail: data.data.paymentData.customerEmail,
        customerPhone: data.data.paymentData.customerPhone,
        hash: data.data.paymentData.hash,
        returnUrl: data.data.paymentData.returnUrl,
        cancelUrl: data.data.paymentData.cancelUrl,
        notifyUrl: data.data.paymentData.notifyUrl,
        handler: function (response) {
          handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            if (onFailure) onFailure('Payment cancelled by user');
          }
        }
      };

      // Open HDFC payment modal
      if (window.HDFCCheckout) {
        const checkout = new window.HDFCCheckout(options);
        checkout.open();
      } else {
        throw new Error('HDFC SDK not loaded');
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
      setLoading(false);
      if (onFailure) onFailure(err.message);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');

      // Verify payment with backend
      const verifyResponse = await fetch(`${baseUrl}/api/v1/payment/hdfc/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(response)
      });

      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        if (onSuccess) onSuccess(verifyData.data);
      } else {
        throw new Error(verifyData.message || 'Payment verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      if (onFailure) onFailure(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hdfc-payment">
      <button
        onClick={initiatePayment}
        disabled={loading}
        className="btn btn-success btn-lg w-100"
        style={{
          background: '#4CAF50',
          border: 'none',
          padding: '12px',
          fontSize: '16px',
          fontWeight: '600',
          borderRadius: '8px'
        }}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" />
            Processing...
          </>
        ) : (
          <>Pay ₹{amount}</>
        )}
      </button>
      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default HDFCPayment;
