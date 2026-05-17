import React, { useState, useEffect, useRef } from 'react';
import { baseUrl } from '../utils/config';

const HDFCPaymentModal = ({ isOpen, onClose, orderId, amount, onSuccess, onFailure }) => {
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            initiatePayment();
        }
    }, [isOpen]);

    useEffect(() => {
        if (paymentData && formRef.current) {
            // Auto-submit form to HDFC
            formRef.current.submit();
        }
    }, [paymentData]);

    const initiatePayment = async () => {
        setLoading(true);
        
        try {
            const token = localStorage.getItem('userToken') || localStorage.getItem('token');
            const userResponse = await fetch(`${baseUrl}/api/v1/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = await userResponse.json();
            const user = userData.data;

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
                    customerEmail: user.email || '',
                    customerPhone: user.phone
                })
            });

            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to create payment order');
            }

            console.log('HDFC Payment Response:', data.data);
            
            // Redirect to HDFC payment page
            if (data.data.paymentUrl) {
                window.location.href = data.data.paymentUrl;
            } else {
                throw new Error('Payment URL not received');
            }

        } catch (err) {
            console.error('Payment error:', err);
            setLoading(false);
            onClose();
            if (onFailure) onFailure(err.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                textAlign: 'center',
                maxWidth: '400px'
            }}>
                {loading ? (
                    <>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid #f3f3f3',
                            borderTop: '4px solid #4CAF50',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px'
                        }} />
                        <h3>Initializing Payment...</h3>
                        <p style={{ color: '#666' }}>Redirecting to HDFC SmartGateway</p>
                    </>
                ) : (
                    <>
                        <h3>Redirecting...</h3>
                        <p style={{ color: '#666' }}>Please wait</p>
                    </>
                )}
            </div>

            {/* No form needed - direct redirect to payment URL */}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default HDFCPaymentModal;
