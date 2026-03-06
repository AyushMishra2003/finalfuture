import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Shield, CreditCard, Smartphone, Globe, Lock, CheckCircle,
    ArrowLeft, Wallet, Banknote, Calendar, FileText,
    MapPin, User, Tag, Plus, ChevronRight, Trash2
} from 'lucide-react';
import PaymentSuccess from '../components/PaymentSuccess';
import PaymentMethodCard from '../components/PaymentMethodCard';
import HDFCPaymentModal from '../components/HDFCPaymentModal';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { orderId, amount, items = [], totalMRP, discount: passedDiscount } = location.state || {};

    const [activeMethod, setActiveMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle');
    const [finalAmount, setFinalAmount] = useState(amount || 0);
    const [cardErrors, setCardErrors] = useState({});
    const [showHDFCModal, setShowHDFCModal] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [upiId, setUpiId] = useState('');

    useEffect(() => { if (amount) setFinalAmount(amount); }, [amount]);

    const isCodAvailable = finalAmount > 1000;
    const patientNames = items ? [...new Set(items.map(i => i.patient?.name).filter(Boolean))] : [];
    const appointmentInfo = items?.[0]?.appointment || null;
    const savings = passedDiscount || 0;
    const mrpTotal = totalMRP || finalAmount;

    const handleCardInput = (e) => {
        const { name, value } = e.target;
        let v = value;
        if (name === 'number') { v = value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})/g, '$1 ').trim(); }
        else if (name === 'expiry') { v = value.replace(/\D/g, '').substring(0, 4); if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2); }
        else if (name === 'cvv') { v = value.replace(/\D/g, '').substring(0, 3); }
        setCardDetails(prev => ({ ...prev, [name]: v }));
        if (cardErrors[name]) setCardErrors(prev => ({ ...prev, [name]: null }));
    };

    const handlePayment = async () => {
        if (activeMethod === 'cod') { await processCODPayment(); return; }
        if (activeMethod) { await createOrderAndOpenModal(); }
    };

    const createOrderAndOpenModal = async () => {
        setLoading(true);
        let userLocation = null;
        if (navigator.geolocation) {
            try {
                const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
                userLocation = { latitude: pos.coords.latitude, longitude: pos.coords.longitude, accuracy: pos.coords.accuracy };
            } catch {}
        }
        try {
            const token = localStorage.getItem('userToken') || localStorage.getItem('token');
            const res = await fetch('http://147.93.27.120:3000/api/v1/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
                body: JSON.stringify({
                    orderItems: items.map(item => ({ name: item.name, price: item.price, quantity: 1, itemId: item._id || item.id })),
                    shippingAddress: { address: items?.[0]?.appointment?.location?.address || 'Test Address', city: items?.[0]?.appointment?.location?.city || 'Bangalore', postalCode: items?.[0]?.appointment?.location?.pincode || '560001', country: 'India' },
                    location: userLocation, paymentMethod: activeMethod, itemsPrice: finalAmount, taxPrice: 0, shippingPrice: 0, totalPrice: finalAmount, isPaid: false, orderStatus: 'pending', userId: localStorage.getItem('userId') || '000000000000000000000000'
                })
            });
            const data = await res.json();
            if (!data.success) { alert('Failed to create order'); setLoading(false); return; }
            setLoading(false);
            setShowHDFCModal(true);
        } catch { alert('Failed to create order. Please try again.'); setLoading(false); }
    };

    const processCODPayment = async () => {
        setLoading(true); setPaymentStatus('processing');
        let userLocation = null;
        if (navigator.geolocation) {
            try {
                const pos = await new Promise((res, rej) => navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 }));
                userLocation = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
            } catch {}
        }
        try {
            const token = localStorage.getItem('userToken') || localStorage.getItem('token');
            const res = await fetch('http://147.93.27.120:3000/api/v1/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
                body: JSON.stringify({ orderItems: items.map(i => ({ name: i.name, price: i.price, quantity: 1, itemId: i._id || i.id })), shippingAddress: { address: 'Test', city: 'Bangalore', postalCode: '560001', country: 'India' }, location: userLocation, paymentMethod: 'Cash on Delivery', itemsPrice: finalAmount, taxPrice: 0, shippingPrice: 0, totalPrice: finalAmount, isPaid: false, orderStatus: 'processing', userId: localStorage.getItem('userId') || '000000000000000000000000' })
            });
            const data = await res.json();
            if (!data.success) { alert('Failed to create order'); setLoading(false); setPaymentStatus('idle'); return; }
            setTimeout(() => { setLoading(false); setPaymentStatus('success'); localStorage.removeItem('cart'); window.dispatchEvent(new Event('storage')); }, 1000);
        } catch { alert('Failed. Try again.'); setLoading(false); setPaymentStatus('idle'); }
    };

    const handlePaymentComplete = () => navigate('/order-summary', { state: { orderId, items, totalMRP, discount: passedDiscount, amount: finalAmount, paymentMethod: activeMethod === 'upi' ? 'UPI' : activeMethod === 'card' ? 'Card' : activeMethod === 'netbanking' ? 'Net Banking' : activeMethod === 'wallet' ? 'Wallet' : 'Cash on Delivery' } });
    const handlePaymentSuccess = () => { setPaymentStatus('success'); localStorage.removeItem('cart'); window.dispatchEvent(new Event('storage')); };
    const handlePaymentFailure = (err) => { alert('Payment failed: ' + err); setShowHDFCModal(false); };

    if (paymentStatus === 'success') return <PaymentSuccess onComplete={handlePaymentComplete} />;

    return (
        <>
            <style>{styles}</style>
            <div className="pp-page">

                {/* Navbar */}
                <div className="pp-navbar">
                    <div className="pp-navbar-inner">
                        <button className="pp-back-btn" onClick={() => navigate(-1)}>
                            <ArrowLeft size={16} /> Back
                        </button>
                        <div className="pp-steps">
                            <span className="pp-step done">Cart</span>
                            <ChevronRight size={13} className="pp-step-arrow" />
                            <span className="pp-step active">Payment</span>
                            <ChevronRight size={13} className="pp-step-arrow" />
                            <span className="pp-step">Confirm</span>
                        </div>
                        <div className="pp-secure-tag">
                            <Lock size={12} /> 100% Secure
                        </div>
                    </div>
                </div>

                <div className="pp-body">
                    <div className="pp-grid">

                        {/* ── LEFT: Payment Methods ── */}
                        <div className="pp-left">
                            <p className="pp-section-label">Select Payment Method</p>

                            {/* UPI */}
                            <div className={`pp-method-card ${activeMethod === 'upi' ? 'active' : ''}`} onClick={() => setActiveMethod(activeMethod === 'upi' ? null : 'upi')}>
                                <div className="pp-method-header">
                                    <div className="pp-method-icon"><Smartphone size={18} /></div>
                                    <div className="pp-method-info">
                                        <span className="pp-method-title">UPI</span>
                                        <span className="pp-method-sub">Google Pay, PhonePe, Paytm & more</span>
                                    </div>
                                    <div className={`pp-method-radio ${activeMethod === 'upi' ? 'checked' : ''}`} />
                                </div>
                                {activeMethod === 'upi' && (
                                    <div className="pp-method-body">
                                        <div className="pp-upi-brands">
                                            {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(b => (
                                                <span key={b} className="pp-upi-brand">{b}</span>
                                            ))}
                                        </div>
                                        <div className="pp-input-row">
                                            <input type="text" placeholder="Enter UPI ID (e.g. name@upi)" className="pp-input" value={upiId} onChange={e => setUpiId(e.target.value)} />
                                            <button className="pp-verify-btn">Verify</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Card */}
                            <div className={`pp-method-card ${activeMethod === 'card' ? 'active' : ''}`} onClick={() => setActiveMethod(activeMethod === 'card' ? null : 'card')}>
                                <div className="pp-method-header">
                                    <div className="pp-method-icon"><CreditCard size={18} /></div>
                                    <div className="pp-method-info">
                                        <span className="pp-method-title">Credit / Debit Card</span>
                                        <span className="pp-method-sub">Visa, Mastercard, RuPay & more</span>
                                    </div>
                                    <div className={`pp-method-radio ${activeMethod === 'card' ? 'checked' : ''}`} />
                                </div>
                                {activeMethod === 'card' && (
                                    <div className="pp-method-body" onClick={e => e.stopPropagation()}>
                                        <div className="pp-form-group">
                                            <label className="pp-label">Card Number</label>
                                            <input type="text" name="number" placeholder="0000 0000 0000 0000" className={`pp-input ${cardErrors.number ? 'err' : ''}`} value={cardDetails.number} onChange={handleCardInput} maxLength="19" />
                                            {cardErrors.number && <span className="pp-err">{cardErrors.number}</span>}
                                        </div>
                                        <div className="pp-form-row">
                                            <div className="pp-form-group">
                                                <label className="pp-label">Expiry</label>
                                                <input type="text" name="expiry" placeholder="MM/YY" className={`pp-input ${cardErrors.expiry ? 'err' : ''}`} value={cardDetails.expiry} onChange={handleCardInput} maxLength="5" />
                                                {cardErrors.expiry && <span className="pp-err">{cardErrors.expiry}</span>}
                                            </div>
                                            <div className="pp-form-group">
                                                <label className="pp-label">CVV</label>
                                                <input type="password" name="cvv" placeholder="•••" className={`pp-input ${cardErrors.cvv ? 'err' : ''}`} value={cardDetails.cvv} onChange={handleCardInput} maxLength="3" />
                                                {cardErrors.cvv && <span className="pp-err">{cardErrors.cvv}</span>}
                                            </div>
                                        </div>
                                        <div className="pp-form-group">
                                            <label className="pp-label">Name on Card</label>
                                            <input type="text" name="name" placeholder="Full name" className={`pp-input ${cardErrors.name ? 'err' : ''}`} value={cardDetails.name} onChange={handleCardInput} />
                                            {cardErrors.name && <span className="pp-err">{cardErrors.name}</span>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Net Banking */}
                            <div className={`pp-method-card ${activeMethod === 'netbanking' ? 'active' : ''}`} onClick={() => setActiveMethod(activeMethod === 'netbanking' ? null : 'netbanking')}>
                                <div className="pp-method-header">
                                    <div className="pp-method-icon"><Globe size={18} /></div>
                                    <div className="pp-method-info">
                                        <span className="pp-method-title">Net Banking</span>
                                        <span className="pp-method-sub">All Indian banks supported</span>
                                    </div>
                                    <div className={`pp-method-radio ${activeMethod === 'netbanking' ? 'checked' : ''}`} />
                                </div>
                                {activeMethod === 'netbanking' && (
                                    <div className="pp-method-body" onClick={e => e.stopPropagation()}>
                                        <div className="pp-bank-grid">
                                            {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'More →'].map(b => (
                                                <button key={b} className="pp-bank-btn">{b}</button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Wallet */}
                            <div className={`pp-method-card ${activeMethod === 'wallet' ? 'active' : ''}`} onClick={() => setActiveMethod(activeMethod === 'wallet' ? null : 'wallet')}>
                                <div className="pp-method-header">
                                    <div className="pp-method-icon"><Wallet size={18} /></div>
                                    <div className="pp-method-info">
                                        <span className="pp-method-title">Wallets</span>
                                        <span className="pp-method-sub">Paytm, Amazon Pay, PhonePe Wallet</span>
                                    </div>
                                    <div className={`pp-method-radio ${activeMethod === 'wallet' ? 'checked' : ''}`} />
                                </div>
                                {activeMethod === 'wallet' && (
                                    <div className="pp-method-body" onClick={e => e.stopPropagation()}>
                                        {['Paytm Wallet', 'Amazon Pay', 'PhonePe Wallet'].map(w => (
                                            <div key={w} className="pp-wallet-row">
                                                <div className="pp-wallet-dot" />
                                                <span className="pp-wallet-name">{w}</span>
                                                <button className="pp-link-btn">Link</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* COD */}
                            <div className={`pp-method-card ${activeMethod === 'cod' ? 'active' : ''} ${!isCodAvailable ? 'disabled' : ''}`} onClick={() => isCodAvailable && setActiveMethod(activeMethod === 'cod' ? null : 'cod')}>
                                <div className="pp-method-header">
                                    <div className="pp-method-icon"><Banknote size={18} /></div>
                                    <div className="pp-method-info">
                                        <span className="pp-method-title">Cash on Delivery</span>
                                        <span className="pp-method-sub">{isCodAvailable ? 'Pay cash to our phlebotomist' : 'Available for orders above ₹1000'}</span>
                                    </div>
                                    <div className={`pp-method-radio ${activeMethod === 'cod' ? 'checked' : ''}`} />
                                </div>
                                {activeMethod === 'cod' && (
                                    <div className="pp-method-body">
                                        <div className="pp-info-box">
                                            <CheckCircle size={15} /> Pay ₹{finalAmount} in cash when our phlebotomist arrives.
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── RIGHT: Order Summary ── */}
                        <div className="pp-right">
                            <div className="pp-summary-card">

                                {/* Summary Header */}
                                <div className="pp-summary-head">
                                    <FileText size={16} />
                                    <h2>Order Summary</h2>
                                </div>

                                {/* Tests List */}
                                <div className="pp-summary-body">
                                    {items.length > 0 ? (
                                        <>
                                            <p className="pp-tests-label">{items.length} Test{items.length > 1 ? 's' : ''} Selected</p>
                                            <div className="pp-tests-list">
                                                {items.map((item, i) => (
                                                    <div key={i} className="pp-test-row">
                                                        <div className="pp-test-left">
                                                            <div className="pp-test-dot" />
                                                            <div className="pp-test-info">
                                                                <span className="pp-test-name">{item.name}</span>
                                                                {item.category && <span className="pp-test-cat">{item.category}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="pp-test-price">
                                                            {item.originalPrice && item.originalPrice > item.price && (
                                                                <span className="pp-price-orig">₹{item.originalPrice}</span>
                                                            )}
                                                            <span className="pp-price-curr">₹{item.price}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Add More Tests */}
                                            <button className="pp-add-more-btn" onClick={() => navigate('/create-package')}>
                                                <Plus size={15} /> Add More Tests
                                            </button>
                                        </>
                                    ) : (
                                        <div className="pp-empty-tests">
                                            <p>No tests selected</p>
                                            <button className="pp-add-more-btn" onClick={() => navigate('/create-package')}>
                                                <Plus size={15} /> Browse Tests
                                            </button>
                                        </div>
                                    )}

                                    {/* Patient & Appointment Info */}
                                    {(patientNames.length > 0 || appointmentInfo) && (
                                        <div className="pp-appt-section">
                                            {patientNames.length > 0 && (
                                                <div className="pp-appt-row">
                                                    <User size={13} className="pp-appt-icon" />
                                                    <span>{patientNames.join(', ')}</span>
                                                </div>
                                            )}
                                            {appointmentInfo?.date && (
                                                <div className="pp-appt-row">
                                                    <Calendar size={13} className="pp-appt-icon" />
                                                    <span>{appointmentInfo.date.day} {appointmentInfo.date.date} {appointmentInfo.date.month}{appointmentInfo.time ? ` · ${appointmentInfo.time}` : ''}</span>
                                                </div>
                                            )}
                                            {appointmentInfo?.location && (
                                                <div className="pp-appt-row">
                                                    <MapPin size={13} className="pp-appt-icon" />
                                                    <span>{typeof appointmentInfo.location === 'string' ? appointmentInfo.location : `${appointmentInfo.location.city} - ${appointmentInfo.location.pincode}`}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Price Breakdown */}
                                    <div className="pp-price-section">
                                        <div className="pp-price-row">
                                            <span>MRP Total</span>
                                            <span>₹{mrpTotal}</span>
                                        </div>
                                        <div className="pp-price-row">
                                            <span>Home Collection</span>
                                            <span className="pp-free-tag">FREE</span>
                                        </div>
                                        {savings > 0 && (
                                            <div className="pp-price-row pp-savings-row">
                                                <span className="pp-savings-label">
                                                    <Tag size={12} /> Discount Applied
                                                </span>
                                                <span className="pp-savings-val">−₹{savings}</span>
                                            </div>
                                        )}
                                        <div className="pp-price-divider" />
                                        <div className="pp-price-row pp-total-row">
                                            <span>Total Payable</span>
                                            <span>₹{finalAmount}</span>
                                        </div>
                                    </div>

                                    {savings > 0 && (
                                        <div className="pp-savings-strip">
                                            🎉 You're saving <strong>₹{savings}</strong> on this order
                                        </div>
                                    )}
                                </div>

                                {/* Pay Button */}
                                <div className="pp-pay-section">
                                    <button className="pp-pay-btn" onClick={handlePayment} disabled={!activeMethod || loading}>
                                        {loading ? (
                                            <span className="pp-spinner" />
                                        ) : (
                                            <> <Shield size={16} /> Pay ₹{finalAmount} </>
                                        )}
                                    </button>
                                    <div className="pp-secure-note">
                                        <Lock size={12} /> SSL Encrypted · PCI DSS Certified
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* HDFC Modal */}
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

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; }

  .pp-page {
    font-family: 'Sora', sans-serif;
    min-height: 100vh;
    background: #f4f7f6;
    color: #1a1d2e;
  }

  /* ── Navbar ── */
  .pp-navbar {
    background: #fff;
    border-bottom: 1px solid #e2ecea;
    padding: 0 24px;
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  .pp-navbar-inner {
    max-width: 1160px; margin: 0 auto;
    height: 64px; display: flex; align-items: center; justify-content: space-between;
  }
  .pp-back-btn {
    display: flex; align-items: center; gap: 7px;
    background: none; border: 1.5px solid #e2ecea;
    color: #374151; border-radius: 10px; padding: 8px 14px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-family: 'Sora', sans-serif;
  }
  .pp-back-btn:hover { border-color: #2e9d91; color: #2e9d91; }
  .pp-steps { display: flex; align-items: center; gap: 6px; }
  .pp-step { font-size: 12px; font-weight: 600; color: #9ca3af; padding: 4px 10px; border-radius: 6px; }
  .pp-step.done { color: #2e9d91; }
  .pp-step.active { background: #e8f5f4; color: #2e9d91; }
  .pp-step-arrow { color: #d1d5db; }
  .pp-secure-tag {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; font-weight: 600; color: #2e9d91;
    background: #e8f5f4; padding: 5px 10px; border-radius: 8px;
  }

  /* ── Body ── */
  .pp-body {
    max-width: 1160px; margin: 0 auto;
    padding: 32px 24px 80px;
  }
  .pp-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .pp-grid { grid-template-columns: 1fr; }
    .pp-steps { display: none; }
    .pp-right { order: -1; }
  }

  /* ── Section Label ── */
  .pp-section-label {
    font-size: 13px; font-weight: 700; color: #374151;
    margin: 0 0 14px;
    text-transform: uppercase; letter-spacing: 0.06em;
  }

  /* ── Method Cards ── */
  .pp-method-card {
    background: #fff;
    border: 1.5px solid #e2ecea;
    border-radius: 16px;
    margin-bottom: 12px;
    cursor: pointer;
    transition: all 0.2s;
    overflow: hidden;
  }
  .pp-method-card:hover { border-color: #a7d9d5; box-shadow: 0 2px 12px rgba(46,157,145,0.08); }
  .pp-method-card.active { border-color: #2e9d91; box-shadow: 0 4px 20px rgba(46,157,145,0.12); }
  .pp-method-card.disabled { opacity: 0.5; cursor: not-allowed; }

  .pp-method-header {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 18px;
  }
  .pp-method-icon {
    width: 40px; height: 40px; border-radius: 12px;
    background: linear-gradient(135deg, #e8f5f4, #b2deda);
    color: #2e9d91;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pp-method-card.active .pp-method-icon {
    background: linear-gradient(135deg, #2e9d91, #1f7068);
    color: #fff;
  }
  .pp-method-info { flex: 1; }
  .pp-method-title { display: block; font-size: 14px; font-weight: 700; color: #1a1d2e; }
  .pp-method-sub { display: block; font-size: 12px; color: #9ca3af; margin-top: 2px; }
  .pp-method-radio {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid #d1d5db; flex-shrink: 0; transition: all 0.2s;
    position: relative;
  }
  .pp-method-radio.checked {
    border-color: #2e9d91;
    background: #2e9d91;
    box-shadow: inset 0 0 0 4px #fff;
  }

  .pp-method-body {
    padding: 0 18px 18px;
    border-top: 1px solid #f0f5f4;
    padding-top: 14px;
  }

  /* UPI */
  .pp-upi-brands { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px; }
  .pp-upi-brand {
    background: #f3f6f5; border: 1px solid #e2ecea;
    border-radius: 8px; padding: 5px 12px;
    font-size: 12px; font-weight: 600; color: #374151;
  }
  .pp-input-row { display: flex; gap: 8px; }
  .pp-input {
    flex: 1; border: 1.5px solid #e2ecea; border-radius: 10px;
    padding: 10px 14px; font-size: 13px; font-family: 'Sora', sans-serif;
    outline: none; transition: border-color 0.2s; color: #1a1d2e;
  }
  .pp-input:focus { border-color: #2e9d91; }
  .pp-input.err { border-color: #ef4444; }
  .pp-verify-btn {
    background: #2e9d91; color: #fff; border: none;
    border-radius: 10px; padding: 10px 16px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'Sora', sans-serif; white-space: nowrap;
  }

  /* Card Form */
  .pp-form-group { margin-bottom: 10px; }
  .pp-label { display: block; font-size: 11px; font-weight: 600; color: #9ca3af; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.05em; }
  .pp-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .pp-err { display: block; font-size: 11px; color: #ef4444; margin-top: 4px; }

  /* Banks */
  .pp-bank-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .pp-bank-btn {
    background: #f3f6f5; border: 1.5px solid #e2ecea;
    border-radius: 10px; padding: 10px; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-family: 'Sora', sans-serif; color: #374151;
  }
  .pp-bank-btn:hover { border-color: #2e9d91; color: #2e9d91; background: #e8f5f4; }

  /* Wallet */
  .pp-wallet-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 0; border-bottom: 1px solid #f3f6f5;
  }
  .pp-wallet-row:last-child { border-bottom: none; }
  .pp-wallet-dot { width: 8px; height: 8px; border-radius: 50%; background: #2e9d91; }
  .pp-wallet-name { flex: 1; font-size: 13px; font-weight: 600; color: #1a1d2e; }
  .pp-link-btn { background: none; border: 1.5px solid #2e9d91; color: #2e9d91; border-radius: 7px; padding: 4px 12px; font-size: 12px; font-weight: 600; cursor: pointer; font-family: 'Sora', sans-serif; }

  /* COD */
  .pp-info-box {
    display: flex; align-items: center; gap: 8px;
    background: #e8f5f4; border-radius: 10px; padding: 12px 14px;
    font-size: 13px; color: #1f7068; font-weight: 500;
  }
  .pp-info-box svg { color: #2e9d91; flex-shrink: 0; }

  /* ── Summary Card ── */
  .pp-summary-card {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #e2ecea;
    overflow: hidden;
    position: sticky; top: 80px;
    box-shadow: 0 4px 24px rgba(46,157,145,0.07);
  }

  .pp-summary-head {
    display: flex; align-items: center; gap: 10px;
    padding: 16px 20px;
    background: linear-gradient(135deg, #1f7068, #2e9d91);
    color: #fff;
  }
  .pp-summary-head h2 { font-size: 15px; font-weight: 700; margin: 0; }

  .pp-summary-body { padding: 18px 20px 0; }

  /* Tests */
  .pp-tests-label {
    font-size: 11px; font-weight: 700; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.07em; margin: 0 0 12px;
  }
  .pp-tests-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 4px; }
  .pp-test-row {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px dashed #f0f5f4;
  }
  .pp-test-row:last-child { border-bottom: none; }
  .pp-test-left { display: flex; align-items: flex-start; gap: 10px; flex: 1; min-width: 0; }
  .pp-test-dot { width: 7px; height: 7px; border-radius: 50%; background: #2e9d91; margin-top: 5px; flex-shrink: 0; }
  .pp-test-info { min-width: 0; }
  .pp-test-name { display: block; font-size: 13px; font-weight: 600; color: #1a1d2e; }
  .pp-test-cat { display: block; font-size: 11px; color: #9ca3af; margin-top: 2px; }
  .pp-test-price { text-align: right; flex-shrink: 0; margin-left: 8px; }
  .pp-price-orig { display: block; font-size: 11px; color: #9ca3af; text-decoration: line-through; }
  .pp-price-curr { font-size: 14px; font-weight: 700; color: #1a1d2e; }

  /* Add More */
  .pp-add-more-btn {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    width: 100%; background: none;
    border: 2px dashed #a7d9d5; color: #2e9d91;
    border-radius: 12px; padding: 11px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-family: 'Sora', sans-serif;
    margin: 12px 0;
  }
  .pp-add-more-btn:hover { background: #e8f5f4; border-color: #2e9d91; }

  /* Empty */
  .pp-empty-tests { text-align: center; padding: 12px 0; }
  .pp-empty-tests p { font-size: 13px; color: #9ca3af; margin-bottom: 10px; }

  /* Appointment Info */
  .pp-appt-section {
    background: #f8fbfa; border-radius: 12px;
    padding: 12px 14px; margin-bottom: 16px;
    display: flex; flex-direction: column; gap: 8px;
    border: 1px solid #e2ecea;
  }
  .pp-appt-row { display: flex; align-items: flex-start; gap: 8px; font-size: 12px; color: #4b5563; }
  .pp-appt-icon { color: #2e9d91; flex-shrink: 0; margin-top: 1px; }

  /* Price Breakdown */
  .pp-price-section { border-top: 1px solid #f0f5f4; padding-top: 14px; }
  .pp-price-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 6px 0; font-size: 13px; color: #4b5563;
  }
  .pp-free-tag {
    font-size: 11px; font-weight: 700;
    background: #e8f5f4; color: #2e9d91;
    padding: 3px 8px; border-radius: 6px;
  }
  .pp-savings-row { color: #2e9d91; }
  .pp-savings-label { display: flex; align-items: center; gap: 5px; }
  .pp-savings-val { font-weight: 700; }
  .pp-price-divider { height: 1px; background: #e2ecea; margin: 8px 0; }
  .pp-total-row { font-size: 16px; font-weight: 800; color: #1a1d2e; padding-top: 4px; }

  /* Savings Strip */
  .pp-savings-strip {
    background: linear-gradient(135deg, #fef9c3, #fef3c7);
    color: #92400e; font-size: 12px; font-weight: 600;
    padding: 10px 14px; border-radius: 10px;
    margin: 12px 0 0; text-align: center;
  }

  /* Pay Section */
  .pp-pay-section {
    padding: 16px 20px 20px;
    border-top: 1px solid #f0f5f4;
    margin-top: 12px;
  }
  .pp-pay-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 9px;
    background: linear-gradient(135deg, #2e9d91, #1f7068);
    color: #fff; border: none; border-radius: 14px;
    padding: 16px; font-size: 15px; font-weight: 800;
    cursor: pointer; transition: all 0.2s;
    font-family: 'Sora', sans-serif;
    box-shadow: 0 4px 16px rgba(46,157,145,0.3);
  }
  .pp-pay-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(46,157,145,0.4); }
  .pp-pay-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .pp-secure-note {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    font-size: 11px; color: #9ca3af; margin-top: 10px;
  }
  .pp-spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default PaymentPage;