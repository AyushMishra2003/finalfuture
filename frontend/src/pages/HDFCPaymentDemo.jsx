import React, { useState } from 'react';
import HDFCPaymentModal from '../components/HDFCPaymentModal';

const HDFCPaymentDemo = () => {
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState(2500);

    const handleSuccess = (data) => {
        console.log('Payment Success:', data);
        alert(`Payment Successful!\nTransaction ID: ${data.transactionId}\nAmount: ₹${data.amount}`);
    };

    const handleFailure = (error) => {
        console.error('Payment Failed:', error);
        alert(`Payment Failed: ${error}`);
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                maxWidth: '400px',
                width: '100%'
            }}>
                <h1 style={{ marginBottom: '10px', color: '#1f2937' }}>HDFC Payment Gateway</h1>
                <p style={{ color: '#6b7280', marginBottom: '30px' }}>Test the payment modal</p>
                
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                        Amount (₹)
                    </label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        style={{
                            width: '100%',
                            padding: '12px',
                            border: '1.5px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '16px'
                        }}
                    />
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    style={{
                        width: '100%',
                        padding: '14px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                    Open Payment Gateway
                </button>

                <div style={{ marginTop: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#374151' }}>Test Cards:</h3>
                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#6b7280' }}>
                        <strong>Card:</strong> 4111 1111 1111 1111
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#6b7280' }}>
                        <strong>Expiry:</strong> Any future date
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '13px', color: '#6b7280' }}>
                        <strong>CVV:</strong> Any 3 digits
                    </p>
                </div>
            </div>

            <HDFCPaymentModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                orderId="demo_order_123"
                amount={amount}
                onSuccess={handleSuccess}
                onFailure={handleFailure}
            />
        </div>
    );
};

export default HDFCPaymentDemo;
