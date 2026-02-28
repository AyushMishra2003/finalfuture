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
  }, []);

  const handleCallback = async () => {
    try {
      const orderId = searchParams.get('orderId');
      const transactionId = searchParams.get('transactionId');
      const paymentStatus = searchParams.get('status');
      const amount = searchParams.get('amount');
      const hash = searchParams.get('hash');

      if (!orderId) {
        setStatus('error');
        setMessage('Invalid payment response');
        return;
      }

      const token = localStorage.getItem('userToken') || localStorage.getItem('token');

      // Verify payment with backend
      const response = await fetch(`${baseUrl}/api/v1/payment/hdfc/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId,
          transactionId,
          status: paymentStatus,
          amount,
          hash
        })
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Payment successful! Redirecting...');
        setTimeout(() => {
          navigate(`/order-confirmation/${orderId}`);
        }, 2000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Callback error:', error);
      setStatus('error');
      setMessage('An error occurred while processing your payment');
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
