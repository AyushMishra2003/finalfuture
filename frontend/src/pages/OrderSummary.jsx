import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, User, Calendar, MapPin, Package, Download, Share2, Shield, Clock, FileText, Phone, Mail, ChevronRight } from 'lucide-react';

const OrderSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state;

    useEffect(() => {
        if (!orderData) navigate('/');
    }, [orderData, navigate]);

    if (!orderData) return null;

    const { orderId, items = [], totalMRP, discount, amount, paymentMethod } = orderData;

    const groupedByPatient = items.reduce((acc, item) => {
        const patientName = item.patient?.name || 'Unknown';
        if (!acc[patientName]) {
            acc[patientName] = { patient: item.patient, items: [], subtotal: 0, originalTotal: 0 };
        }
        acc[patientName].items.push(item);
        acc[patientName].subtotal += item.price || 0;
        acc[patientName].originalTotal += item.originalPrice || item.price || 0;
        return acc;
    }, {});

    const formatDate = (dateObj) => {
        if (!dateObj) return '';
        return `${dateObj.day} ${dateObj.date} ${dateObj.month}`;
    };

    const handleDownloadInvoice = () => alert('Invoice download feature coming soon!');
    const handleShareOrder = () => {
        if (navigator.share) {
            navigator.share({ title: 'Order Confirmed', text: `My health checkup order #${orderId} has been confirmed!`, url: window.location.href });
        } else {
            alert('Share feature not supported on this browser');
        }
    };

    const orderIdDisplay = orderId || 'GUEST-' + Date.now();

    return (
        <>
            <style>{styles}</style>
            <div className="os-page">

                {/* Top Nav Bar */}
                <div className="os-navbar">
                    <div className="os-navbar-inner">
                        <button className="os-back-btn" onClick={() => navigate('/')}>
                            <ArrowLeft size={16} /> Back to Home
                        </button>
                        <div className="os-steps">
                            <span className="os-step done">Cart</span>
                            <ChevronRight size={14} className="os-step-arrow" />
                            <span className="os-step done">Payment</span>
                            <ChevronRight size={14} className="os-step-arrow" />
                            <span className="os-step active">Confirmed</span>
                        </div>
                    </div>
                </div>

                {/* Hero Success Banner */}
                <div className="os-hero">
                    <div className="os-hero-glow" />
                    <div className="os-hero-inner">
                        <div className="os-success-ring">
                            <div className="os-success-icon">
                                <CheckCircle size={36} />
                            </div>
                        </div>
                        <div className="os-hero-text">
                            <h1>Booking Confirmed!</h1>
                            <p>Your health checkup has been successfully scheduled</p>
                        </div>
                        <div className="os-order-pill">
                            <span className="os-order-label">Order ID</span>
                            <span className="os-order-val">#{orderIdDisplay}</span>
                        </div>
                    </div>
                </div>

                {/* Main Body */}
                <div className="os-body">
                    <div className="os-grid">

                        {/* LEFT */}
                        <div className="os-left">

                            {/* Price Breakdown */}
                            <div className="os-card">
                                <div className="os-card-head">
                                    <Package size={18} />
                                    <h2>Price Breakdown</h2>
                                </div>
                                <div className="os-card-body">
                                    {Object.entries(groupedByPatient).map(([patientName, data], index) => (
                                        <div key={index} className="os-patient-group">
                                            <div className="os-patient-header">
                                                <div className="os-patient-avatar">
                                                    <User size={14} />
                                                </div>
                                                <span className="os-patient-name">{patientName}</span>
                                                {data.patient && (
                                                    <span className="os-patient-meta">{data.patient.age} yrs · {data.patient.gender}</span>
                                                )}
                                            </div>

                                            {data.items.map((item, idx) => (
                                                <div key={idx} className="os-item-row">
                                                    <div className="os-item-left">
                                                        <div className="os-item-dot" />
                                                        <div>
                                                            <p className="os-item-name">{item.name}</p>
                                                            {item.appointment && (
                                                                <div className="os-item-meta">
                                                                    {item.appointment.date && item.appointment.time && (
                                                                        <span className="os-meta-pill">
                                                                            <Calendar size={11} />
                                                                            {formatDate(item.appointment.date)} · {item.appointment.time}
                                                                        </span>
                                                                    )}
                                                                    {item.appointment.location && (
                                                                        <span className="os-meta-pill">
                                                                            <MapPin size={11} />
                                                                            {typeof item.appointment.location === 'string'
                                                                                ? item.appointment.location
                                                                                : `${item.appointment.location.city} - ${item.appointment.location.pincode}`}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="os-item-price">
                                                        {item.originalPrice && item.originalPrice > item.price && (
                                                            <span className="os-price-orig">₹{item.originalPrice}</span>
                                                        )}
                                                        <span className="os-price-curr">₹{item.price}</span>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Diagnostic Kit */}
                                            <div className="os-item-row os-kit-row">
                                                <div className="os-item-left">
                                                    <div className="os-item-dot os-dot-muted" />
                                                    <p className="os-item-name os-kit-name">Diagnostic Kit Fee</p>
                                                </div>
                                                <span className="os-price-curr">₹99</span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Totals */}
                                    <div className="os-totals">
                                        <div className="os-total-row">
                                            <span>Subtotal</span>
                                            <span>₹{totalMRP || amount}</span>
                                        </div>
                                        <div className="os-total-row">
                                            <span>Phlebotomist Home Service</span>
                                            <span className="os-free-tag">
                                                <s style={{color:'#9ca3af', marginRight: 4}}>₹99</s> FREE
                                            </span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="os-total-row os-discount-row">
                                                <span>Discounts Applied</span>
                                                <span className="os-discount-val">−₹{discount}</span>
                                            </div>
                                        )}
                                        <div className="os-total-divider" />
                                        <div className="os-total-row os-grand-total">
                                            <span>Total Paid</span>
                                            <span>₹{amount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="os-card">
                                <div className="os-card-head">
                                    <Shield size={18} />
                                    <h2>Payment Information</h2>
                                </div>
                                <div className="os-card-body">
                                    <div className="os-info-grid">
                                        <div className="os-info-item">
                                            <span className="os-info-label">Payment Method</span>
                                            <span className="os-info-val">{paymentMethod || 'Online Payment'}</span>
                                        </div>
                                        <div className="os-info-item">
                                            <span className="os-info-label">Payment Status</span>
                                            <span className="os-status-paid"><CheckCircle size={13} /> Paid</span>
                                        </div>
                                        <div className="os-info-item">
                                            <span className="os-info-label">Amount Paid</span>
                                            <span className="os-info-val os-amount">₹{amount}</span>
                                        </div>
                                        <div className="os-info-item">
                                            <span className="os-info-label">Order ID</span>
                                            <span className="os-info-val">#{orderIdDisplay}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="os-right">

                            {/* Action Buttons */}
                            <div className="os-actions-card">
                                <button className="os-btn-primary" onClick={handleDownloadInvoice}>
                                    <Download size={17} /> Download Invoice
                                </button>
                                <button className="os-btn-secondary" onClick={handleShareOrder}>
                                    <Share2 size={17} /> Share Order
                                </button>
                            </div>

                            {/* What's Next */}
                            <div className="os-card">
                                <div className="os-card-head">
                                    <Clock size={18} />
                                    <h2>What's Next?</h2>
                                </div>
                                <div className="os-card-body">
                                    <div className="os-timeline">
                                        {[
                                            { text: 'Confirmation email sent to your inbox', done: true },
                                            { text: 'Phlebotomist assigned to your slot', done: true },
                                            { text: 'Home visit at your scheduled time', done: false },
                                            { text: 'Digital reports ready in 24–48 hours', done: false },
                                        ].map((step, i) => (
                                            <div key={i} className={`os-timeline-step ${step.done ? 'done' : ''}`}>
                                                <div className="os-tl-dot">
                                                    {step.done ? <CheckCircle size={14} /> : <span>{i + 1}</span>}
                                                </div>
                                                {i < 3 && <div className="os-tl-line" />}
                                                <p className="os-tl-text">{step.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Support */}
                            <div className="os-support-card">
                                <div className="os-support-head">
                                    <FileText size={16} />
                                    <h3>Need Help?</h3>
                                </div>
                                <p className="os-support-sub">Our support team is available 24/7</p>
                                <div className="os-support-links">
                                    <a href="tel:+918888888888" className="os-support-link">
                                        <div className="os-support-icon"><Phone size={14} /></div>
                                        +91 88888 88888
                                    </a>
                                    <a href="mailto:support@futurelabs.com" className="os-support-link">
                                        <div className="os-support-icon"><Mail size={14} /></div>
                                        support@futurelabs.com
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; }

  .os-page {
    font-family: 'Sora', sans-serif;
    min-height: 100vh;
    background: #f4f7f6;
    color: #1a1d2e;
  }

  /* ── Navbar ── */
  .os-navbar {
    background: #fff;
    border-bottom: 1px solid #e2ecea;
    padding: 0 24px;
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  }
  .os-navbar-inner {
    max-width: 1160px; margin: 0 auto;
    height: 64px; display: flex; align-items: center; justify-content: space-between;
  }
  .os-back-btn {
    display: flex; align-items: center; gap: 7px;
    background: none; border: 1.5px solid #e2ecea;
    color: #374151; border-radius: 10px; padding: 8px 14px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; font-family: 'Sora', sans-serif;
  }
  .os-back-btn:hover { border-color: #2e9d91; color: #2e9d91; }
  .os-steps { display: flex; align-items: center; gap: 6px; }
  .os-step {
    font-size: 12px; font-weight: 600; color: #9ca3af; padding: 4px 10px;
    border-radius: 6px;
  }
  .os-step.done { color: #2e9d91; }
  .os-step.active {
    background: #e8f5f4; color: #2e9d91;
  }
  .os-step-arrow { color: #d1d5db; }

  /* ── Hero ── */
  .os-hero {
    background: linear-gradient(135deg, #1f7068 0%, #2e9d91 60%, #3ab5a8 100%);
    padding: 52px 24px;
    position: relative;
    overflow: hidden;
  }
  .os-hero-glow {
    position: absolute; top: -60px; right: -60px;
    width: 280px; height: 280px; border-radius: 50%;
    background: rgba(255,255,255,0.08);
    pointer-events: none;
  }
  .os-hero-inner {
    max-width: 1160px; margin: 0 auto;
    display: flex; align-items: center; gap: 28px;
    flex-wrap: wrap;
  }
  .os-success-ring {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 0 0 12px rgba(255,255,255,0.08);
    animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  @keyframes popIn {
    from { transform: scale(0.5); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .os-success-icon { color: #fff; }
  .os-hero-text { flex: 1; }
  .os-hero-text h1 {
    font-size: 28px; font-weight: 800; color: #fff; margin: 0 0 6px;
  }
  .os-hero-text p {
    font-size: 14px; color: rgba(255,255,255,0.8); margin: 0;
  }
  .os-order-pill {
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 12px; padding: 10px 18px;
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    backdrop-filter: blur(8px);
  }
  .os-order-label {
    font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.7);
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .os-order-val {
    font-size: 14px; font-weight: 700; color: #fff;
  }

  /* ── Body ── */
  .os-body {
    max-width: 1160px; margin: 0 auto;
    padding: 32px 24px 80px;
  }
  .os-grid {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .os-grid { grid-template-columns: 1fr; }
    .os-steps { display: none; }
  }

  /* ── Cards ── */
  .os-card {
    background: #fff;
    border-radius: 18px;
    border: 1.5px solid #e2ecea;
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow: 0 2px 16px rgba(46,157,145,0.05);
  }
  .os-card-head {
    display: flex; align-items: center; gap: 10px;
    padding: 16px 22px;
    border-bottom: 1px solid #f0f5f4;
    background: #fafefe;
  }
  .os-card-head svg { color: #2e9d91; }
  .os-card-head h2 {
    font-size: 14px; font-weight: 700; margin: 0; color: #1a1d2e;
  }
  .os-card-body { padding: 20px 22px; }

  /* ── Patient Group ── */
  .os-patient-group { margin-bottom: 20px; }
  .os-patient-group:last-child { margin-bottom: 0; }
  .os-patient-header {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 12px;
  }
  .os-patient-avatar {
    width: 28px; height: 28px; border-radius: 8px;
    background: linear-gradient(135deg, #e8f5f4, #b2deda);
    color: #2e9d91; display: flex; align-items: center; justify-content: center;
  }
  .os-patient-name { font-size: 13px; font-weight: 700; color: #1a1d2e; }
  .os-patient-meta {
    font-size: 11px; color: #9ca3af; font-weight: 500;
    background: #f3f4f6; padding: 2px 8px; border-radius: 6px;
  }

  /* ── Item Row ── */
  .os-item-row {
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f3f6f5;
  }
  .os-item-row:last-child { border-bottom: none; }
  .os-item-left { display: flex; align-items: flex-start; gap: 10px; }
  .os-item-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #2e9d91; margin-top: 6px; flex-shrink: 0;
  }
  .os-dot-muted { background: #d1d5db; }
  .os-item-name { font-size: 13px; font-weight: 600; color: #1a1d2e; margin: 0 0 4px; }
  .os-kit-name { color: #6b7280; font-weight: 500; }
  .os-kit-row { opacity: 0.7; }
  .os-item-meta { display: flex; flex-wrap: wrap; gap: 6px; }
  .os-meta-pill {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: #6b7280;
    background: #f3f6f5; border-radius: 6px; padding: 3px 8px;
  }
  .os-item-price { text-align: right; }
  .os-price-orig {
    display: block; font-size: 11px; color: #9ca3af; text-decoration: line-through;
  }
  .os-price-curr { font-size: 14px; font-weight: 700; color: #1a1d2e; }

  /* ── Totals ── */
  .os-totals {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 2px dashed #e2ecea;
  }
  .os-total-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 7px 0; font-size: 13px; color: #4b5563;
  }
  .os-free-tag {
    font-size: 12px; font-weight: 700;
    background: #e8f5f4; color: #2e9d91;
    padding: 3px 9px; border-radius: 6px;
  }
  .os-discount-val { color: #2e9d91; font-weight: 700; }
  .os-total-divider {
    height: 1px; background: #e2ecea; margin: 6px 0;
  }
  .os-grand-total {
    font-size: 16px; font-weight: 800; color: #1a1d2e;
    padding-top: 10px;
  }

  /* ── Payment Info Grid ── */
  .os-info-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  }
  .os-info-item {
    display: flex; flex-direction: column; gap: 4px;
    background: #f8fbfa; border-radius: 10px; padding: 12px 14px;
    border: 1px solid #e2ecea;
  }
  .os-info-label { font-size: 11px; color: #9ca3af; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
  .os-info-val { font-size: 13px; font-weight: 700; color: #1a1d2e; }
  .os-amount { font-size: 16px; color: #2e9d91; }
  .os-status-paid {
    display: flex; align-items: center; gap: 5px;
    font-size: 13px; font-weight: 700; color: #2e9d91;
  }

  /* ── Right Column ── */
  .os-actions-card {
    display: flex; flex-direction: column; gap: 10px;
    margin-bottom: 20px;
  }
  .os-btn-primary {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: linear-gradient(135deg, #2e9d91, #1f7068);
    color: #fff; border: none; border-radius: 14px;
    padding: 15px; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; font-family: 'Sora', sans-serif;
    box-shadow: 0 4px 16px rgba(46,157,145,0.3);
  }
  .os-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(46,157,145,0.4); }
  .os-btn-secondary {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    background: #fff; color: #2e9d91;
    border: 2px solid #2e9d91; border-radius: 14px;
    padding: 13px; font-size: 14px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; font-family: 'Sora', sans-serif;
  }
  .os-btn-secondary:hover { background: #e8f5f4; }

  /* ── Timeline ── */
  .os-timeline { display: flex; flex-direction: column; gap: 0; }
  .os-timeline-step {
    display: grid;
    grid-template-columns: 28px 1fr;
    grid-template-rows: auto auto;
    gap: 0 12px;
    position: relative;
  }
  .os-tl-dot {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid #e2ecea;
    background: #fff; color: #9ca3af;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
    grid-column: 1; grid-row: 1;
    flex-shrink: 0; z-index: 1;
  }
  .os-timeline-step.done .os-tl-dot {
    background: linear-gradient(135deg, #2e9d91, #1f7068);
    border-color: #2e9d91; color: #fff;
  }
  .os-tl-line {
    width: 2px; height: 24px;
    background: #e2ecea;
    margin: 0 auto;
    grid-column: 1; grid-row: 2;
  }
  .os-timeline-step.done .os-tl-line { background: #2e9d91; }
  .os-tl-text {
    font-size: 13px; color: #4b5563; margin: 0;
    padding: 5px 0 20px;
    grid-column: 2; grid-row: 1 / 3;
    display: flex; align-items: flex-start;
    line-height: 1.5;
  }
  .os-timeline-step.done .os-tl-text { color: #1a1d2e; font-weight: 500; }

  /* ── Support ── */
  .os-support-card {
    background: linear-gradient(135deg, #1f7068, #2e9d91);
    border-radius: 18px; padding: 22px;
    color: #fff;
  }
  .os-support-head {
    display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
  }
  .os-support-head h3 { font-size: 15px; font-weight: 700; margin: 0; }
  .os-support-sub { font-size: 12px; color: rgba(255,255,255,0.75); margin: 0 0 16px; }
  .os-support-links { display: flex; flex-direction: column; gap: 10px; }
  .os-support-link {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 10px; padding: 11px 14px;
    color: #fff; text-decoration: none;
    font-size: 13px; font-weight: 600;
    transition: all 0.2s;
  }
  .os-support-link:hover { background: rgba(255,255,255,0.2); }
  .os-support-icon {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
`;

export default OrderSummary;