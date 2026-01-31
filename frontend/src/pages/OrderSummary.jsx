import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, User, Calendar, MapPin, Package, Download, Share2 } from 'lucide-react';
import './OrderSummary.css';

const OrderSummary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state;

    useEffect(() => {
        // If no order data, redirect to home
        if (!orderData) {
            navigate('/');
        }
    }, [orderData, navigate]);

    if (!orderData) {
        return null;
    }

    const { orderId, items = [], totalMRP, discount, amount, paymentMethod } = orderData;

    // Group items by patient
    const groupedByPatient = items.reduce((acc, item) => {
        const patientName = item.patient?.name || 'Unknown';
        if (!acc[patientName]) {
            acc[patientName] = {
                patient: item.patient,
                items: [],
                subtotal: 0,
                originalTotal: 0
            };
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

    const handleDownloadInvoice = () => {
        alert('Invoice download feature coming soon!');
    };

    const handleShareOrder = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Order Confirmed',
                text: `My health checkup order #${orderId} has been confirmed!`,
                url: window.location.href
            });
        } else {
            alert('Share feature not supported on this browser');
        }
    };

    return (
        <div className="order-summary-page">
            {/* Header */}
            <div className="order-summary-header">
                <div className="container">
                    <button className="back-button" onClick={() => navigate('/')}>
                        <ArrowLeft size={20} />
                        Back to Home
                    </button>
                    <div className="success-badge">
                        <CheckCircle size={60} className="success-icon" />
                        <h1>Order Confirmed</h1>
                        <p>Your booking has been successfully placed!</p>
                        <div className="order-id">Order ID: #{orderId || 'GUEST-' + Date.now()}</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container order-summary-container">
                <div className="order-summary-layout">
                    {/* Left Column - Order Details */}
                    <div className="order-details-section">
                        <h2 className="section-title">
                            <Package size={24} />
                            Price Breakdown
                        </h2>

                        {/* Grouped by Patient */}
                        {Object.entries(groupedByPatient).map(([patientName, data], index) => (
                            <div key={index} className="patient-group">
                                <div className="patient-header">
                                    <User size={18} />
                                    <h3>{patientName}</h3>
                                    {data.patient && (
                                        <span className="patient-info">
                                            ({data.patient.age}/{data.patient.gender})
                                        </span>
                                    )}
                                </div>

                                {/* Items for this patient */}
                                <div className="patient-items">
                                    {data.items.map((item, idx) => (
                                        <div key={idx} className="order-item">
                                            <div className="item-details">
                                                <h4>{item.name}</h4>
                                                {item.description && (
                                                    <p className="item-description">{item.description}</p>
                                                )}

                                                {/* Appointment Details */}
                                                {item.appointment && (
                                                    <div className="item-appointment-info">
                                                        {item.appointment.date && item.appointment.time && (
                                                            <div className="appointment-detail">
                                                                <Calendar size={14} />
                                                                <span>
                                                                    {formatDate(item.appointment.date)} at {item.appointment.time}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {item.appointment.location && (
                                                            <div className="appointment-detail">
                                                                <MapPin size={14} />
                                                                <span>
                                                                    {typeof item.appointment.location === 'string'
                                                                        ? item.appointment.location
                                                                        : `${item.appointment.location.city} - ${item.appointment.location.pincode}`
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="item-pricing">
                                                {item.originalPrice && item.originalPrice > item.price && (
                                                    <span className="original-price">₹{item.originalPrice}</span>
                                                )}
                                                <span className="current-price">₹{item.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Diagnostic Kit Fee */}
                                <div className="order-item diagnostic-fee">
                                    <div className="item-details">
                                        <h4>Diagnostic Kit Fee</h4>
                                    </div>
                                    <div className="item-pricing">
                                        <span className="current-price">₹99</span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Price Summary */}
                        <div className="price-summary">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{totalMRP || amount}</span>
                            </div>
                            <div className="summary-row">
                                <span>Phlebotomist Home Service Fee</span>
                                <span className="free-tag">₹99 ₹0</span>
                            </div>
                            {discount > 0 && (
                                <div className="summary-row discount-row">
                                    <span>Discounts Applied</span>
                                    <span className="discount-amount">-₹{discount}</span>
                                </div>
                            )}
                            <div className="summary-divider"></div>
                            <div className="summary-row total-row">
                                <span>Total</span>
                                <span>₹{amount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions & Info */}
                    <div className="order-actions-section">
                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button className="action-btn primary" onClick={handleDownloadInvoice}>
                                <Download size={20} />
                                Download Invoice
                            </button>
                            <button className="action-btn secondary" onClick={handleShareOrder}>
                                <Share2 size={20} />
                                Share Order
                            </button>
                        </div>

                        {/* Payment Info */}
                        <div className="info-card">
                            <h3>Payment Information</h3>
                            <div className="info-row">
                                <span>Payment Method:</span>
                                <strong>{paymentMethod || 'Online Payment'}</strong>
                            </div>
                            <div className="info-row">
                                <span>Payment Status:</span>
                                <strong className="status-paid">Paid</strong>
                            </div>
                            <div className="info-row">
                                <span>Amount Paid:</span>
                                <strong>₹{amount}</strong>
                            </div>
                        </div>

                        {/* Next Steps */}
                        <div className="info-card next-steps">
                            <h3>What's Next?</h3>
                            <ul>
                                <li>
                                    <CheckCircle size={16} />
                                    <span>You'll receive a confirmation email shortly</span>
                                </li>
                                <li>
                                    <CheckCircle size={16} />
                                    <span>Our phlebotomist will visit at the scheduled time</span>
                                </li>
                                <li>
                                    <CheckCircle size={16} />
                                    <span>Reports will be available within 24-48 hours</span>
                                </li>
                                <li>
                                    <CheckCircle size={16} />
                                    <span>You can track your order in "My Orders"</span>
                                </li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div className="info-card support-card">
                            <h3>Need Help?</h3>
                            <p>Contact our support team</p>
                            <div className="support-contacts">
                                <a href="tel:+918888888888" className="support-link">
                                    📞 +91 88888 88888
                                </a>
                                <a href="mailto:support@futurelabs.com" className="support-link">
                                    ✉️ support@futurelabs.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
