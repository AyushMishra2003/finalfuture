import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PhlebotomistDashboard.css';

const PhlebotomistDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [collectorInfo, setCollectorInfo] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('collectorToken');
        if (!token) {
            navigate('/phlebotomist/login');
            return;
        }

        fetchBookings();
    }, [selectedDate]);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem('collectorToken');
            const response = await axios.get(
                `http://localhost:5000/api/v1/collector/bookings?date=${selectedDate}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setBookings(response.data.data);
                setCollectorInfo(response.data.collectorInfo);
                if (response.data.data.length > 0 && !currentBooking) {
                    setCurrentBooking(response.data.data[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('collectorToken');
                navigate('/phlebotomist/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const updateBookingStatus = async (status) => {
        try {
            const token = localStorage.getItem('collectorToken');
            await axios.put(
                `http://localhost:5000/api/v1/collector/bookings/${currentBooking._id}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchBookings();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const updateSampleStatus = async (sampleType, data) => {
        try {
            const token = localStorage.getItem('collectorToken');
            await axios.put(
                `http://localhost:5000/api/v1/collector/bookings/${currentBooking._id}/sample`,
                { sampleType, ...data },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchBookings();
        } catch (error) {
            console.error('Error updating sample:', error);
        }
    };

    const updatePayment = async (amount) => {
        try {
            const token = localStorage.getItem('collectorToken');
            await axios.put(
                `http://localhost:5000/api/v1/collector/bookings/${currentBooking._id}/payment`,
                { paymentCollected: amount, paymentMethod: 'Cash on Collection' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchBookings();
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    };

    const completeHandover = async (type) => {
        try {
            const token = localStorage.getItem('collectorToken');
            const data = type === 'sample'
                ? { sampleHandedOver: true }
                : { amountHandedOver: true };

            await axios.put(
                `http://localhost:5000/api/v1/collector/bookings/${currentBooking._id}/handover`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchBookings();
        } catch (error) {
            console.error('Error completing handover:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('collectorToken');
        localStorage.removeItem('collectorUser');
        navigate('/phlebotomist/login');
    };

    const openGPS = () => {
        if (currentBooking?.patient?.address) {
            const address = currentBooking.patient.address;
            const query = encodeURIComponent(`${address.street}, ${address.city}, ${address.state} ${address.zip}`);
            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
        }
    };

    const makeCall = () => {
        if (currentBooking?.patient?.phone) {
            window.location.href = `tel:${currentBooking.patient.phone}`;
        }
    };

    if (loading) {
        return (
            <div className="phlebotomist-dashboard loading">
                <div className="spinner"></div>
                <p>Loading bookings...</p>
            </div>
        );
    }

    if (!currentBooking) {
        return (
            <div className="phlebotomist-dashboard">
                <div className="dashboard-header">
                    <div className="header-logo">
                        <div className="logo-circle-small">FL</div>
                        <div>
                            <h1>FutureLabs24.com</h1>
                            <p>Phlebotomist Dashboard</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
                <div className="no-bookings">
                    <i className="fas fa-calendar-check"></i>
                    <h2>No Bookings for Today</h2>
                    <p>You have no scheduled sample collections</p>
                </div>
            </div>
        );
    }

    return (
        <div className="phlebotomist-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-logo">
                    <div className="logo-circle-small">FL</div>
                    <div>
                        <h1>FutureLabs24.com</h1>
                        <p>Phlebotomist Dashboard</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    <i className="fas fa-sign-out-alt"></i>
                </button>
            </div>

            {/* Patient Details */}
            <div className="section patient-details">
                <h2>Patient Details</h2>
                <p className="patient-name">
                    <strong>Booking Name:</strong> {currentBooking.patient.name}
                </p>
                <p className="patient-address">
                    <strong>Address:</strong> {currentBooking.patient.address?.street || 'Address not available'}
                </p>
                <div className="action-buttons">
                    <button onClick={openGPS} className="btn-gps">
                        <i className="fas fa-map-marker-alt"></i> GPS Location
                    </button>
                    <button onClick={makeCall} className="btn-call">
                        <i className="fas fa-phone"></i> Call
                    </button>
                </div>
            </div>

            {/* Phlebotomy Status */}
            <div className="section phlebotomy-status">
                <h2>Phlebotomy Status</h2>
                <div className="status-buttons">
                    <button
                        className={`status-btn ${currentBooking.status === 'reached' ? 'active' : ''}`}
                        onClick={() => updateBookingStatus('reached')}
                    >
                        <i className="fas fa-check-circle"></i> Reached
                    </button>
                    <button
                        className={`status-btn ${currentBooking.status === 'collected' ? 'active' : ''}`}
                        onClick={() => updateBookingStatus('collected')}
                    >
                        <i className="fas fa-check-circle"></i> Collected Sample
                    </button>
                    <button
                        className={`status-btn status-btn-orange ${currentBooking.status === 'moving_to_next' ? 'active' : ''}`}
                        onClick={() => updateBookingStatus('moving_to_next')}
                    >
                        <i className="fas fa-arrow-right"></i> Moving to Next Patient
                    </button>
                </div>
            </div>

            {/* Sample Collection */}
            <div className="section sample-collection">
                <h2>Sample Collection</h2>
                <div className="sample-grid">
                    {/* Blood Sample */}
                    <div className="sample-card">
                        <h3>Blood Sample Pic</h3>
                        <div className="camera-icon">
                            <i className="fas fa-camera"></i>
                        </div>
                        <p className="collection-time">
                            {currentBooking.sampleStatus?.blood?.collectedAt
                                ? `Collected at: ${new Date(currentBooking.sampleStatus.blood.collectedAt).toLocaleTimeString()}`
                                : 'Not collected yet'}
                        </p>
                        <div className="sample-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={currentBooking.sampleStatus?.blood?.isRandom || false}
                                    onChange={(e) => updateSampleStatus('blood', {
                                        collected: true,
                                        isRandom: e.target.checked,
                                        collectedAt: new Date()
                                    })}
                                />
                                <span className="checkmark"></span>
                                Random Sample
                            </label>
                        </div>
                    </div>

                    {/* Urine Sample */}
                    <div className="sample-card">
                        <h3>Urine Sample Pic</h3>
                        <div className="camera-icon">
                            <i className="fas fa-camera"></i>
                        </div>
                        <p className="collection-time">
                            {currentBooking.sampleStatus?.urine?.collectedAt
                                ? `Collected at: ${new Date(currentBooking.sampleStatus.urine.collectedAt).toLocaleTimeString()}`
                                : 'Not collected yet'}
                        </p>
                        <div className="sample-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={currentBooking.sampleStatus?.urine?.notGiven || false}
                                    onChange={(e) => updateSampleStatus('urine', {
                                        collected: !e.target.checked,
                                        notGiven: e.target.checked,
                                        collectedAt: new Date()
                                    })}
                                />
                                <span className="checkmark"></span>
                                Not Given
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Status */}
            <div className="section payment-status">
                <h2>Payment Status</h2>
                <div className="payment-options">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={currentBooking.isPaid}
                            disabled
                        />
                        <span className="checkmark"></span>
                        Prepaid
                    </label>
                    <label className="checkbox-label payment-pending">
                        <input
                            type="checkbox"
                            checked={currentBooking.paymentCollected > 0}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    updatePayment(currentBooking.totalAmount);
                                }
                            }}
                        />
                        <span className="checkmark"></span>
                        Payment Pending Rs. {currentBooking.totalAmount || 500}
                    </label>
                    <label className="checkbox-label payment-collected">
                        <input
                            type="checkbox"
                            checked={currentBooking.paymentCollected > 0}
                            disabled
                        />
                        <span className="checkmark"></span>
                        Payment Collected By Phlebo Rs. {currentBooking.paymentCollected || 0}
                    </label>
                </div>
                <div className="total-cash">
                    <strong>TOTAL CASH ON HAND: Rs. {currentBooking.paymentCollected || 0}</strong>
                </div>
            </div>

            {/* Final Handover */}
            <div className="section final-handover">
                <h2>Final Handover</h2>
                <button
                    className={`handover-btn ${currentBooking.sampleHandedOver ? 'completed' : ''}`}
                    onClick={() => completeHandover('sample')}
                    disabled={currentBooking.sampleHandedOver}
                >
                    <i className="fas fa-check-circle"></i>
                    Sample Handover
                    {currentBooking.sampleHandedOver && <i className="fas fa-check-double"></i>}
                </button>
                <button
                    className={`handover-btn ${currentBooking.amountHandedOver ? 'completed' : ''}`}
                    onClick={() => completeHandover('amount')}
                    disabled={currentBooking.amountHandedOver}
                >
                    <i className="fas fa-check-circle"></i>
                    Amount Handover to Lab
                    {currentBooking.amountHandedOver && <i className="fas fa-check-double"></i>}
                </button>
            </div>

            {/* Navigation */}
            {bookings.length > 1 && (
                <div className="booking-navigation">
                    <p>Booking {bookings.indexOf(currentBooking) + 1} of {bookings.length}</p>
                    <div className="nav-buttons">
                        <button
                            onClick={() => {
                                const currentIndex = bookings.indexOf(currentBooking);
                                if (currentIndex > 0) {
                                    setCurrentBooking(bookings[currentIndex - 1]);
                                }
                            }}
                            disabled={bookings.indexOf(currentBooking) === 0}
                        >
                            <i className="fas fa-chevron-left"></i> Previous
                        </button>
                        <button
                            onClick={() => {
                                const currentIndex = bookings.indexOf(currentBooking);
                                if (currentIndex < bookings.length - 1) {
                                    setCurrentBooking(bookings[currentIndex + 1]);
                                }
                            }}
                            disabled={bookings.indexOf(currentBooking) === bookings.length - 1}
                        >
                            Next <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhlebotomistDashboard;
