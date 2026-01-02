
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Shield, CreditCard, Smartphone, Globe, Lock, CheckCircle,
    AlertCircle, ChevronDown, ChevronUp, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './PaymentPage.css';

const PaymentPage = () => {
    const [activeMethod, setActiveMethod] = useState('card');
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success, failed
    const location = useLocation();
    const navigate = useNavigate();

    // Get data from navigation state or default to mock (for testing)
    const { orderId, amount, items, totalMRP, discount: passedDiscount } = location.state || {};

    // State for order summary
    const [cartTotal, setCartTotal] = useState(totalMRP || amount || 0);
    const [discount, setDiscount] = useState(passedDiscount || 0);
    const [finalAmount, setFinalAmount] = useState(amount || 0);
    const [itemCount, setItemCount] = useState(items ? items.length : 0);

    useEffect(() => {
        if (amount) {
            setFinalAmount(amount);
        }
        if (totalMRP) {
            setCartTotal(totalMRP);
        }
        if (passedDiscount) {
            setDiscount(passedDiscount);
        }
        if (items) {
            setItemCount(items.length);
        }
    }, [amount, items, totalMRP, passedDiscount]);

    // Form States
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });

    const [upiId, setUpiId] = useState('');

    // Handlers
    const handleCardInput = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'number') {
            formattedValue = value.replace(/\D/g, '').substring(0, 16);
            formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim();
        } else if (name === 'expiry') {
            formattedValue = value.replace(/\D/g, '').substring(0, 4);
            if (formattedValue.length >= 2) {
                formattedValue = formattedValue.substring(0, 2) + '/' + formattedValue.substring(2);
            }
        } else if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').substring(0, 3);
        }

        setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handlePayment = () => {
        setLoading(true);
        setPaymentStatus('processing');

        // Simulate API Call
        setTimeout(() => {
            setLoading(false);
            setPaymentStatus('success');

            // Redirect after success animation
            setTimeout(() => {
                // navigate('/order-confirmation'); 
            }, 2000);
        }, 2500);
    };

    const PaymentMethod = ({ id, icon: Icon, title, subtitle, children }) => (
        <div
            className={`payment-method-item ${activeMethod === id ? 'active' : ''}`}
            onClick={() => setActiveMethod(id)}
        >
            <div className="payment-method-header">
                <div className={`payment-icon-container ${activeMethod === id ? 'bg-blue-100 text-blue-600' : ''}`}>
                    <Icon size={20} />
                </div>
                <div className="flex-grow-1">
                    <div className="fw-bold text-dark">{title}</div>
                    {subtitle && <div className="text-muted small">{subtitle}</div>}
                </div>
                <div className="radio-indicator">
                    <div className={`rounded-circle border ${activeMethod === id ? 'bg-primary border-primary' : 'border-secondary'}`}
                        style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {activeMethod === id && <div className="bg-white rounded-circle" style={{ width: '8px', height: '8px' }}></div>}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {activeMethod === id && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="payment-method-body"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    if (paymentStatus === 'success') {
        return (
            <div className="payment-page-container d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mb-4 d-inline-block bg-success text-white rounded-circle p-4 shadow-lg"
                    >
                        <CheckCircle size={64} />
                    </motion.div>
                    <h2 className="payment-title mb-2">Payment Successful!</h2>
                    <p className="text-muted">Redirecting to order summary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page-container">
            {/* Navbar Placeholder (You likely have a global Layout) */}
            <div className="bg-white border-bottom py-3 px-4 mb-4 sticky-top shadow-sm">
                <div className="container d-flex align-items-center">
                    <button onClick={() => navigate(-1)} className="btn btn-ghost p-0 me-3">
                        <ArrowLeft size={24} className="text-dark" />
                    </button>
                    <h1 className="h5 mb-0 fw-bold">Secure Checkout</h1>
                    <div className="ms-auto d-flex align-items-center gap-2 text-success small fw-bold bg-success bg-opacity-10 px-3 py-1 rounded-pill">
                        <Lock size={14} />
                        100% Secure
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row g-4">

                    {/* LEFT COLUMN: Payment Methods */}
                    <div className="col-lg-8">
                        <h2 className="section-title">Select Payment Mode</h2>

                        {/* 1. UPI */}
                        <PaymentMethod
                            id="upi"
                            icon={Smartphone}
                            title="UPI (Google Pay, PhonePe, Paytm)"
                            subtitle="Instant payment using UPI App"
                        >
                            <div className="input-group-premium mt-2">
                                <input
                                    type="text"
                                    className="input-premium"
                                    placeholder="e.g. mobile@upi"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                />
                                <span className="floating-label">Enter UPI ID</span>
                            </div>
                            <button
                                className="btn btn-outline-primary w-100 py-2 rounded-3 text-uppercase fw-bold text-xs"
                                style={{ fontSize: '0.85rem' }}
                            >
                                Verify & Pay
                            </button>
                        </PaymentMethod>

                        {/* 2. Card */}
                        <PaymentMethod
                            id="card"
                            icon={CreditCard}
                            title="Credit / Debit Card"
                            subtitle="Visa, Mastercard, Rupay & more"
                        >
                            <div className="row g-3">
                                <div className="col-12">
                                    <div className="input-group-premium">
                                        <input
                                            type="text"
                                            name="number"
                                            className="input-premium"
                                            placeholder="0000 0000 0000 0000"
                                            value={cardDetails.number}
                                            onChange={handleCardInput}
                                            maxLength="19"
                                        />
                                        <span className="floating-label">Card Number</span>
                                        <div className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted">
                                            <CreditCard size={18} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group-premium">
                                        <input
                                            type="text"
                                            name="expiry"
                                            className="input-premium"
                                            placeholder="MM/YY"
                                            value={cardDetails.expiry}
                                            onChange={handleCardInput}
                                            maxLength="5"
                                        />
                                        <span className="floating-label">Valid Thru</span>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="input-group-premium">
                                        <input
                                            type="password"
                                            name="cvv"
                                            className="input-premium"
                                            placeholder="123"
                                            value={cardDetails.cvv}
                                            onChange={handleCardInput}
                                            maxLength="3"
                                        />
                                        <span className="floating-label">CVV</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="input-group-premium mb-0">
                                        <input
                                            type="text"
                                            name="name"
                                            className="input-premium"
                                            placeholder="Name on Card"
                                            value={cardDetails.name}
                                            onChange={handleCardInput}
                                        />
                                        <span className="floating-label">Cardholder Name</span>
                                    </div>
                                </div>
                            </div>
                        </PaymentMethod>

                        {/* 3. Net Banking */}
                        <PaymentMethod
                            id="netbanking"
                            icon={Globe}
                            title="Net Banking"
                            subtitle="All Indian banks supported"
                        >
                            <div className="row g-2">
                                {['HDFC', 'SBI', 'ICICI', 'Axis'].map(bank => (
                                    <div className="col-3" key={bank}>
                                        <div className="border rounded-3 p-2 text-center text-muted small hover-bg-light cursor-pointer">
                                            {bank}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PaymentMethod>

                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="col-lg-4">
                        <div className="payment-glass-card p-4 order-summary-sticky">
                            <h3 className="h6 fw-bold mb-4 d-flex justify-content-between align-items-center">
                                Order Summary
                                <span className="badge bg-primary bg-opacity-10 text-primary">{itemCount} Items</span>
                            </h3>

                            <div className="summary-item">
                                <span>Total MRP</span>
                                <span className="text-decoration-line-through">₹{cartTotal}</span>
                            </div>

                            <div className="summary-item text-success">
                                <span>Total Discount</span>
                                <span>- ₹{discount}</span>
                            </div>

                            <div className="summary-item">
                                <span>Convenience Fee</span>
                                <span>₹0</span>
                            </div>

                            <div className="total-row d-flex justify-content-between">
                                <span>To Pay</span>
                                <span>₹{finalAmount}</span>
                            </div>

                            {/* Desktop Pay Button */}
                            <div className="d-none d-md-block">
                                <button
                                    className="btn-pay-secure"
                                    onClick={handlePayment}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div className="spinner-border text-white spinner-border-sm" role="status"></div>
                                    ) : (
                                        <>
                                            Pay ₹{finalAmount} <Shield size={18} />
                                        </>
                                    )}
                                </button>
                                <div className="secure-badge">
                                    <Lock size={12} /> SSL Encrypted • PCI DSS Certified
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Fixed Footer */}
            <div className="mobile-fixed-footer d-md-none">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="small text-muted">Total Payable</div>
                    <div className="fw-bold h5 mb-0">₹{finalAmount}</div>
                </div>
                <button
                    className="btn-pay-secure m-0 py-3"
                    onClick={handlePayment}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : `Pay ₹${finalAmount}`}
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
