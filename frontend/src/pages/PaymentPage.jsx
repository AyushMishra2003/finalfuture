import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Shield, CreditCard, Smartphone, Globe, Lock, CheckCircle,
    AlertCircle, ChevronDown, ChevronUp, ArrowLeft,
    Wallet, Banknote, User, Calendar, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentSuccess from '../components/PaymentSuccess';
import PaymentMethodCard from '../components/PaymentMethodCard';
import HDFCPaymentModal from '../components/HDFCPaymentModal';
import './PaymentPage.css';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get data from navigation state
    const { orderId, amount, items, totalMRP, discount: passedDiscount } = location.state || {};

    // State
    const [activeMethod, setActiveMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle');
    const [finalAmount, setFinalAmount] = useState(amount || 0);
    const [cardErrors, setCardErrors] = useState({});
    const [showHDFCModal, setShowHDFCModal] = useState(false);

    // Form States
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });
    const [upiId, setUpiId] = useState('');

    useEffect(() => {
        if (amount) setFinalAmount(amount);
    }, [amount]);

    // COD Availability Logic
    const isCodAvailable = finalAmount > 1000;

    // Derived Data for Summary
    const patientNames = items ? [...new Set(items.map(item => item.patient?.name).filter(Boolean))] : [];
    const appointmentInfo = items && items[0]?.appointment ? items[0].appointment : null;
    const testNames = items ? items.map(item => item.name) : [];

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

        // Clear error on change
        if (cardErrors[name]) {
            setCardErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateCard = () => {
        const errors = {};
        if (cardDetails.number.replace(/\s/g, '').length !== 16) errors.number = "Invalid card number";
        if (cardDetails.expiry.length !== 5) errors.expiry = "Invalid expiry";
        if (cardDetails.cvv.length !== 3) errors.cvv = "Invalid CVV";
        if (!cardDetails.name.trim()) errors.name = "Name required";

        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePayment = async () => {
        // For COD, process directly
        if (activeMethod === 'cod') {
            await processCODPayment();
            return;
        }

        // For online payments, open HDFC modal
        if (activeMethod === 'card' || activeMethod === 'upi' || activeMethod === 'netbanking' || activeMethod === 'wallet') {
            await createOrderAndOpenModal();
            return;
        }
    };

    const createOrderAndOpenModal = async () => {
        setLoading(true);

        // Get user's current location
        let userLocation = null;
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                });
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
            } catch (error) {
                console.log('Location access denied or unavailable');
            }
        }

        // Create order in database
        try {
            const token = localStorage.getItem('userToken') || localStorage.getItem('token');
            const createOrderResponse = await fetch('http://147.93.27.120:3000/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    orderItems: (items || []).map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        itemId: item._id || item.id
                    })),
                    shippingAddress: {
                        address: items?.[0]?.appointment?.location?.address || 'Test Address',
                        city: items?.[0]?.appointment?.location?.city || 'Bangalore',
                        postalCode: items?.[0]?.appointment?.location?.pincode || '560001',
                        country: 'India'
                    },
                    location: userLocation,
                    paymentMethod: activeMethod,
                    itemsPrice: finalAmount,
                    taxPrice: 0,
                    shippingPrice: 0,
                    totalPrice: finalAmount,
                    isPaid: false,
                    orderStatus: 'pending',
                    userId: localStorage.getItem('userId') || '000000000000000000000000'
                })
            });

            const orderData = await createOrderResponse.json();
            
            if (!orderData.success) {
                alert('Failed to create order: ' + (orderData.error || 'Unknown error'));
                setLoading(false);
                return;
            }

            console.log('✅ Order created:', orderData.data._id);
            setLoading(false);
            
            // Open HDFC payment modal
            setShowHDFCModal(true);

        } catch (error) {
            console.error('Order creation error:', error);
            alert('Failed to create order. Please try again.');
            setLoading(false);
        }
    };

    const processCODPayment = async () => {
        setLoading(true);
        setPaymentStatus('processing');

        // Get user's current location
        let userLocation = null;
        if (navigator.geolocation) {
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                });
                userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
            } catch (error) {
                console.log('Location access denied or unavailable');
            }
        }

        // Create order in database
        try {
            const token = localStorage.getItem('userToken') || localStorage.getItem('token');
            const createOrderResponse = await fetch('http://147.93.27.120:3000/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify({
                    orderItems: (items || []).map(item => ({
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        itemId: item._id || item.id
                    })),
                    shippingAddress: {
                        address: items?.[0]?.appointment?.location?.address || 'Test Address',
                        city: items?.[0]?.appointment?.location?.city || 'Bangalore',
                        postalCode: items?.[0]?.appointment?.location?.pincode || '560001',
                        country: 'India'
                    },
                    location: userLocation,
                    paymentMethod: activeMethod === 'cod' ? 'Cash on Delivery' : activeMethod,
                    itemsPrice: finalAmount,
                    taxPrice: 0,
                    shippingPrice: 0,
                    totalPrice: finalAmount,
                    isPaid: activeMethod === 'cod' ? false : true,
                    orderStatus: 'processing',
                    userId: localStorage.getItem('userId') || '000000000000000000000000'
                })
            });

            const orderData = await createOrderResponse.json();
            
            if (!orderData.success) {
                alert('Failed to create order: ' + (orderData.error || 'Unknown error'));
                setLoading(false);
                setPaymentStatus('idle');
                return;
            }

            console.log('✅ Order created:', orderData.data._id);

            // Mark as success for COD
            setTimeout(() => {
                setLoading(false);
                setPaymentStatus('success');
                localStorage.removeItem('cart');
                window.dispatchEvent(new Event('storage'));
            }, 1000);

        } catch (error) {
            console.error('Order creation error:', error);
            alert('Failed to create order. Please try again.');
            setLoading(false);
            setPaymentStatus('idle');
        }
    };

    const handlePaymentComplete = () => {
        navigate('/order-summary', {
            state: {
                orderId: orderId,
                items: items,
                totalMRP: totalMRP,
                discount: passedDiscount,
                amount: finalAmount,
                paymentMethod: activeMethod === 'upi' ? 'UPI' :
                    activeMethod === 'card' ? 'Card' :
                        activeMethod === 'netbanking' ? 'Net Banking' :
                            activeMethod === 'wallet' ? 'Wallet' : 'Cash on Delivery'
            }
        });
    };

    const handlePaymentSuccess = (paymentData) => {
        console.log('Payment successful:', paymentData);
        setPaymentStatus('success');
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage'));
    };

    const handlePaymentFailure = (error) => {
        console.error('Payment failed:', error);
        alert('Payment failed: ' + error);
        setShowHDFCModal(false);
    };



    if (paymentStatus === 'success') {
        return <PaymentSuccess onComplete={handlePaymentComplete} />;
    }

    return (
        <>
        <div className="payment-page-container">
            {/* Header */}
            <header className="payment-header">
                <div className="container">
                    <div className="header-content">
                        <button onClick={() => navigate(-1)} className="back-btn">
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="page-title">Select Payment Method</h1>
                        <div className="secure-tag">
                            <Lock size={14} /> 100% Secure
                        </div>
                    </div>
                </div>
            </header>

            <div className="container main-content">
                {/* Order Summary (Top Section) */}
                <section className="order-summary-card top-summary">
                    <h2 className="section-heading">
                        <FileText size={18} /> Order Summary
                    </h2>

                    <div className="summary-details-grid">
                        <div className="summary-detail-item">
                            <span className="label">Tests</span>
                            <span className="value">{testNames.length > 0 ? `${testNames[0]} ${testNames.length > 1 ? `+ ${testNames.length - 1} more` : ''}` : 'No tests selected'}</span>
                        </div>

                        {patientNames.length > 0 && (
                            <div className="summary-detail-item">
                                <span className="label">Patient</span>
                                <span className="value">{patientNames.join(', ')}</span>
                            </div>
                        )}

                        {appointmentInfo && (
                            <div className="summary-detail-item">
                                <span className="label">Appointment</span>
                                <span className="value">
                                    {appointmentInfo.date?.day} {appointmentInfo.date?.date} {appointmentInfo.date?.month}, {appointmentInfo.time}
                                </span>
                            </div>
                        )}

                        <div className="summary-total-row">
                            <span>Total Payable</span>
                            <span className="amount">₹{finalAmount}</span>
                        </div>
                    </div>

                    {/* Desktop Pay Button Container */}
                    <div className="desktop-pay-container pay-action-container">
                        <button
                            className="pay-btn"
                            onClick={handlePayment}
                            disabled={!activeMethod || loading}
                        >
                            {loading ? (
                                <div className="spinner-border spinner-border-sm" role="status"></div>
                            ) : (
                                <>
                                    Pay ₹{finalAmount} <Shield size={18} />
                                </>
                            )}
                        </button>
                        <div className="secure-badge justify-content-center mt-3">
                            <Lock size={12} /> SSL Encrypted • PCI DSS Certified
                        </div>
                    </div>
                </section>

                <h2 className="section-label">Payment Options</h2>

                {/* Payment Methods List */}
                <div className="payment-methods-list">

                    {/* 1. UPI */}
                    <PaymentMethodCard
                        activeMethod={activeMethod}
                        onSelect={setActiveMethod}
                        id="upi"
                        icon={Smartphone}
                        title="UPI"
                        subtitle="Google Pay, PhonePe, Paytm"
                    >
                        <div className="upi-options">
                            <div className="upi-brand-row">
                                <span className="upi-brand">GPay</span>
                                <span className="upi-brand">PhonePe</span>
                                <span className="upi-brand">Paytm</span>
                            </div>
                            <div className="input-with-action">
                                <input
                                    type="text"
                                    placeholder="Enter UPI ID (e.g. mobile@upi)"
                                    className="modern-input"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                />
                                <button className="verify-btn">Verify</button>
                            </div>
                        </div>
                    </PaymentMethodCard>

                    {/* 2. Card */}
                    <PaymentMethodCard
                        activeMethod={activeMethod}
                        onSelect={setActiveMethod}
                        id="card"
                        icon={CreditCard}
                        title="Credit / Debit Card"
                        subtitle="Visa, Mastercard, Rupay & more"
                    >
                        <div className="card-form">
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="number"
                                    placeholder="Card Number"
                                    className={`modern-input ${cardErrors.number ? 'error' : ''}`}
                                    value={cardDetails.number}
                                    onChange={handleCardInput}
                                    maxLength="19"
                                />
                                {cardErrors.number && <span className="error-text">{cardErrors.number}</span>}
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="expiry"
                                        placeholder="MM/YY"
                                        className={`modern-input ${cardErrors.expiry ? 'error' : ''}`}
                                        value={cardDetails.expiry}
                                        onChange={handleCardInput}
                                        maxLength="5"
                                    />
                                    {cardErrors.expiry && <span className="error-text">{cardErrors.expiry}</span>}
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        name="cvv"
                                        placeholder="CVV"
                                        className={`modern-input ${cardErrors.cvv ? 'error' : ''}`}
                                        value={cardDetails.cvv}
                                        onChange={handleCardInput}
                                        maxLength="3"
                                    />
                                    {cardErrors.cvv && <span className="error-text">{cardErrors.cvv}</span>}
                                </div>
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name on Card"
                                    className={`modern-input ${cardErrors.name ? 'error' : ''}`}
                                    value={cardDetails.name}
                                    onChange={handleCardInput}
                                />
                                {cardErrors.name && <span className="error-text">{cardErrors.name}</span>}
                            </div>
                        </div>
                    </PaymentMethodCard>

                    {/* 3. Net Banking */}
                    <PaymentMethodCard
                        activeMethod={activeMethod}
                        onSelect={setActiveMethod}
                        id="netbanking"
                        icon={Globe}
                        title="Net Banking"
                        subtitle="All Indian banks supported"
                    >
                        <div className="bank-grid">
                            {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'More'].map(bank => (
                                <button key={bank} className="bank-item">
                                    {bank}
                                </button>
                            ))}
                        </div>
                    </PaymentMethodCard>

                    {/* 4. Wallets */}
                    <PaymentMethodCard
                        activeMethod={activeMethod}
                        onSelect={setActiveMethod}
                        id="wallet"
                        icon={Wallet}
                        title="Wallets"
                        subtitle="Paytm, Amazon Pay, PhonePe Wallet"
                    >
                        <div className="wallet-list">
                            {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet'].map(wallet => (
                                <div key={wallet} className="wallet-item">
                                    <div className="wallet-icon-placeholder" />
                                    <span>{wallet}</span>
                                    <button className="link-btn">Link</button>
                                </div>
                            ))}
                        </div>
                    </PaymentMethodCard>

                    {/* 5. COD */}
                    <PaymentMethodCard
                        activeMethod={activeMethod}
                        onSelect={setActiveMethod}
                        id="cod"
                        icon={Banknote}
                        title="Cash on Delivery"
                        subtitle={isCodAvailable ? "Pay cash at time of collection" : "Available only for orders above ₹1000"}
                        disabled={!isCodAvailable}
                        disabledText="Available only for orders above ₹1000"
                    >
                        <div className="info-box">
                            <CheckCircle size={16} className="text-success" />
                            <span>Pay ₹{finalAmount} in cash to our phlebotomist.</span>
                        </div>
                    </PaymentMethodCard>

                </div>
            </div>

            {/* Mobile Bottom Bar (Non-Sticky) */}
            <div className="container mobile-pay-wrapper">
                <div className="mobile-pay-container mt-4">
                    <div className="total-row-highlight">
                        <span>Total to Pay</span>
                        <span>₹{finalAmount}</span>
                    </div>
                    <button
                        className="pay-btn"
                        onClick={handlePayment}
                        disabled={!activeMethod || loading}
                    >
                        {loading ? 'Processing...' : `Pay ₹${finalAmount}`}
                    </button>
                    <div className="secure-tag justify-content-center mt-3 bg-white border">
                        <Lock size={12} /> 100% Secure Payment
                    </div>
                </div>
            </div>
        </div>

        {/* HDFC Payment Modal */}
        <HDFCPaymentModal
            isOpen={showHDFCModal}
            onClose={() => setShowHDFCModal(false)}
            orderId={orderId}
            amount={finalAmount}
            onSuccess={handlePaymentSuccess}
            onFailure={handlePaymentFailure}
        />
        </>
    );
};

export default PaymentPage;
