import React, { useState, useEffect } from 'react';
import { X, Shield, CreditCard, Smartphone, Building2, Wallet, Lock, CheckCircle } from 'lucide-react';
import './HDFCPaymentModal.css';

const HDFCPaymentModal = ({ isOpen, onClose, orderId, amount, onSuccess, onFailure }) => {
    const [activeTab, setActiveTab] = useState('card');
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [upiId, setUpiId] = useState('');
    const [selectedBank, setSelectedBank] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const handleCardInput = (e) => {
        const { name, value } = e.target;
        let formatted = value;
        
        if (name === 'number') {
            formatted = value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})/g, '$1 ').trim();
        } else if (name === 'expiry') {
            formatted = value.replace(/\D/g, '').substring(0, 4);
            if (formatted.length >= 2) formatted = formatted.substring(0, 2) + '/' + formatted.substring(2);
        } else if (name === 'cvv') {
            formatted = value.replace(/\D/g, '').substring(0, 3);
        }
        
        setCardDetails(prev => ({ ...prev, [name]: formatted }));
    };

    const handlePayment = async () => {
        setLoading(true);
        
        try {
            const token = localStorage.getItem('userToken') || localStorage.getItem('token');
            const userResponse = await fetch('http://147.93.27.120:3000/api/v1/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const userData = await userResponse.json();
            const user = userData.data;

            const response = await fetch('http://147.93.27.120:3000/api/v1/payment/hdfc/create-order', {
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
            
            if (data.success) {
                // Simulate payment processing
                setTimeout(() => {
                    setLoading(false);
                    onSuccess({ orderId, transactionId: 'TXN' + Date.now(), amount });
                    onClose();
                }, 2000);
            } else {
                throw new Error(data.message || 'Payment failed');
            }
        } catch (error) {
            setLoading(false);
            onFailure(error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="hdfc-modal-overlay">
            <div className="hdfc-modal-container">
                {/* Header */}
                <div className="hdfc-modal-header">
                    <div className="hdfc-header-left">
                        <Shield className="hdfc-logo" size={24} />
                        <div>
                            <h3>HDFC SmartGateway</h3>
                            <p className="hdfc-secure-text"><Lock size={12} /> Secure Payment</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="hdfc-close-btn" disabled={loading}>
                        <X size={24} />
                    </button>
                </div>

                {/* Amount Display */}
                <div className="hdfc-amount-section">
                    <p className="hdfc-amount-label">Amount to Pay</p>
                    <h2 className="hdfc-amount">₹{amount?.toLocaleString()}</h2>
                </div>

                {/* Payment Tabs */}
                <div className="hdfc-tabs">
                    <button 
                        className={`hdfc-tab ${activeTab === 'card' ? 'active' : ''}`}
                        onClick={() => setActiveTab('card')}
                    >
                        <CreditCard size={18} />
                        <span>Card</span>
                    </button>
                    <button 
                        className={`hdfc-tab ${activeTab === 'upi' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upi')}
                    >
                        <Smartphone size={18} />
                        <span>UPI</span>
                    </button>
                    <button 
                        className={`hdfc-tab ${activeTab === 'netbanking' ? 'active' : ''}`}
                        onClick={() => setActiveTab('netbanking')}
                    >
                        <Building2 size={18} />
                        <span>Net Banking</span>
                    </button>
                    <button 
                        className={`hdfc-tab ${activeTab === 'wallet' ? 'active' : ''}`}
                        onClick={() => setActiveTab('wallet')}
                    >
                        <Wallet size={18} />
                        <span>Wallet</span>
                    </button>
                </div>

                {/* Payment Content */}
                <div className="hdfc-content">
                    {activeTab === 'card' && (
                        <div className="hdfc-card-form">
                            <div className="hdfc-form-group">
                                <label>Card Number</label>
                                <input
                                    type="text"
                                    name="number"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardDetails.number}
                                    onChange={handleCardInput}
                                    maxLength="19"
                                    className="hdfc-input"
                                />
                            </div>
                            <div className="hdfc-form-row">
                                <div className="hdfc-form-group">
                                    <label>Expiry Date</label>
                                    <input
                                        type="text"
                                        name="expiry"
                                        placeholder="MM/YY"
                                        value={cardDetails.expiry}
                                        onChange={handleCardInput}
                                        maxLength="5"
                                        className="hdfc-input"
                                    />
                                </div>
                                <div className="hdfc-form-group">
                                    <label>CVV</label>
                                    <input
                                        type="password"
                                        name="cvv"
                                        placeholder="123"
                                        value={cardDetails.cvv}
                                        onChange={handleCardInput}
                                        maxLength="3"
                                        className="hdfc-input"
                                    />
                                </div>
                            </div>
                            <div className="hdfc-form-group">
                                <label>Cardholder Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name on Card"
                                    value={cardDetails.name}
                                    onChange={handleCardInput}
                                    className="hdfc-input"
                                />
                            </div>
                            <div className="hdfc-card-brands">
                                <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" />
                                <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" />
                                <img src="https://img.icons8.com/color/48/rupay.png" alt="RuPay" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'upi' && (
                        <div className="hdfc-upi-form">
                            <div className="hdfc-upi-apps">
                                <button className="hdfc-upi-app">
                                    <img src="https://img.icons8.com/color/48/google-pay-india.png" alt="GPay" />
                                    <span>Google Pay</span>
                                </button>
                                <button className="hdfc-upi-app">
                                    <img src="https://img.icons8.com/color/48/phonepe.png" alt="PhonePe" />
                                    <span>PhonePe</span>
                                </button>
                                <button className="hdfc-upi-app">
                                    <img src="https://img.icons8.com/color/48/paytm.png" alt="Paytm" />
                                    <span>Paytm</span>
                                </button>
                            </div>
                            <div className="hdfc-divider">
                                <span>OR</span>
                            </div>
                            <div className="hdfc-form-group">
                                <label>Enter UPI ID</label>
                                <input
                                    type="text"
                                    placeholder="yourname@upi"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    className="hdfc-input"
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'netbanking' && (
                        <div className="hdfc-netbanking-form">
                            <div className="hdfc-bank-list">
                                {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bank => (
                                    <button
                                        key={bank}
                                        className={`hdfc-bank-item ${selectedBank === bank ? 'selected' : ''}`}
                                        onClick={() => setSelectedBank(bank)}
                                    >
                                        <div className="hdfc-bank-radio">
                                            {selectedBank === bank && <CheckCircle size={16} />}
                                        </div>
                                        <span>{bank}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'wallet' && (
                        <div className="hdfc-wallet-form">
                            <div className="hdfc-wallet-list">
                                {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet', 'Mobikwik'].map(wallet => (
                                    <button key={wallet} className="hdfc-wallet-item">
                                        <Wallet size={20} />
                                        <span>{wallet}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="hdfc-modal-footer">
                    <button 
                        className="hdfc-pay-button"
                        onClick={handlePayment}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="hdfc-spinner"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Lock size={18} />
                                Pay ₹{amount?.toLocaleString()}
                            </>
                        )}
                    </button>
                    <div className="hdfc-security-badges">
                        <span><Shield size={14} /> 256-bit SSL Encrypted</span>
                        <span><Lock size={14} /> PCI DSS Certified</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HDFCPaymentModal;
