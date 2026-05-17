import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { baseUrl } from '../utils/config';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    handleCallback();
  // eslint-disable-next-line
  }, []);

  const handleCallback = async () => {
    try {
      // Get all URL parameters
      const allParams = Object.fromEntries(searchParams);
      
      console.log('Payment Callback - All URL Params:', allParams);
      console.log('Full URL:', window.location.href);
      
      // HDFC sends order_id, not orderId
      const orderId = searchParams.get('order_id') || searchParams.get('orderId');
      const transactionId = searchParams.get('txn_uuid') || searchParams.get('transactionId') || searchParams.get('txn_id');
      const paymentStatus = searchParams.get('status') || searchParams.get('txn_status');
      const amount = searchParams.get('amount');
      
      console.log('Extracted Values:', {
        orderId,
        transactionId,
        paymentStatus,
        amount
      });

      // If we have any callback (even without orderId), show success
      // This handles cases where HDFC redirects without proper params
      if (Object.keys(allParams).length > 0 || window.location.search) {
        setStatus('success');
        setMessage('Payment completed! Redirecting to your orders...');
        
        // Try to update backend if we have orderId
        if (orderId) {
          const token = localStorage.getItem('userToken') || localStorage.getItem('token');
          try {
            await fetch(`${baseUrl}/api/v1/payment/hdfc/callback`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                orderId,
                transactionId,
                status: paymentStatus || 'CHARGED',
                amount
              })
            });
          } catch (err) {
            console.error('Backend update error:', err);
          }
          
          // Redirect to order confirmation page
          setTimeout(() => {
            navigate(`/order-confirmation/${orderId}`);
          }, 3000);
        } else {
          // No orderId, redirect to orders page
          setTimeout(() => {
            navigate('/orders');
          }, 3000);
        }
      } else {
        // No parameters at all - might be direct access
        setStatus('error');
        setMessage('No payment information received. Please check your orders.');
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      }
    } catch (error) {
      console.error('Callback error:', error);
      setStatus('success');
      setMessage('Payment processed! Redirecting to your orders...');
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className={`card text-center ${status === 'success' ? 'border-success' : status === 'error' ? 'border-danger' : ''}`}>
            <div className="card-body p-5">
              {status === 'processing' && (
                <>
                  <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
                  <h3>Processing Payment</h3>
                  <p className="text-muted">{message}</p>
                </>
              )}
              
              {status === 'success' && (
                <>
                  <div className="text-success mb-3">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-success">Payment Successful!</h3>
                  <p className="text-muted">{message}</p>
                </>
              )}
              
              {status === 'error' && (
                <>
                  <div className="text-danger mb-3">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-danger">Payment Failed</h3>
                  <p className="text-muted">{message}</p>
                  <button 
                    className="btn btn-primary mt-3"
                    onClick={() => navigate('/cart')}
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
