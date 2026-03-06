import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhlebotomistDashboard.css';

const baseUrl = 'http://147.93.27.120:3000/api/v1';



export const PhlebotomistDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [statusStates, setStatusStates] = useState({});
  const [samplePhotos, setSamplePhotos] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('collectorToken');
      const r = await axios.get(`${baseUrl}/phlebotomist/dashboard`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      setOrders(r.data.orders || []);
    } catch (e) {
      if (e.response?.status === 401) window.location.href = '/phlebotomist/login';
      else alert('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('collectorToken');
      await axios.put(`${baseUrl}/phlebotomist/orders/${orderId}/status`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusStates(prev => ({ ...prev, [orderId]: status }));
    } catch (e) {
      alert('Failed to update status');
    }
  };

  const uploadPhoto = async (orderId, type, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const token = localStorage.getItem('collectorToken');
      await axios.post(`${baseUrl}/phlebotomist/orders/${orderId}/sample-photo`, 
        formData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSamplePhotos(prev => ({ ...prev, [`${orderId}-${type}`]: URL.createObjectURL(file) }));
      alert('Photo uploaded!');
    } catch (e) {
      alert('Upload failed');
    }
  };

  const collectPayment = async (orderId, amount) => {
    try {
      const token = localStorage.getItem('collectorToken');
      await axios.post(`${baseUrl}/phlebotomist/orders/${orderId}/collect-payment`, 
        { amount, method: 'Cash' }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentStatus(prev => ({ ...prev, [orderId]: true }));
      alert('Payment collected!');
    } catch (e) {
      alert('Failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('collectorToken');
    window.location.href = '/phlebotomist/login';
  };

  const openGPS = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  const makeCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  if (loading) {
    return (
      <div className="phlebotomist-dashboard loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="phlebotomist-dashboard">
        <div className="dashboard-header">
          <div className="header-logo">
            <div className="logo-circle-small">FL</div>
            <div>
              <h1>FutureLabs</h1>
              <p>Phlebotomist Dashboard</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
        <div className="no-bookings">
          <i className="fas fa-calendar-times"></i>
          <h2>No Bookings Today</h2>
          <p>You have no scheduled appointments at the moment.</p>
        </div>
      </div>
    );
  }

  const currentOrder = orders[currentIndex];
  const orderId = currentOrder._id;
  const status = statusStates[orderId] || currentOrder.orderStatus;

  return (
    <div className="phlebotomist-dashboard">
      <div className="dashboard-header">
        <div className="header-logo">
          <div className="logo-circle-small">FL</div>
          <div>
            <h1>FutureLabs</h1>
            <p>Phlebotomist Dashboard</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="section">
        <h2>👤 Patient Details</h2>
        <div className="patient-details">
          <div className="patient-name">
            <strong>Name:</strong> {currentOrder.user?.name}
          </div>
          <div className="patient-address">
            <strong>Address:</strong> {currentOrder.shippingAddress?.address}
          </div>
          <div className="patient-address">
            <strong>Phone:</strong> {currentOrder.user?.phone}
          </div>
        </div>
        <div className="action-buttons">
          <button className="btn-gps" onClick={() => openGPS(currentOrder.shippingAddress?.address)}>
            <i className="fas fa-map-marker-alt"></i> GPS
          </button>
          <button className="btn-call" onClick={() => makeCall(currentOrder.user?.phone)}>
            <i className="fas fa-phone"></i> Call
          </button>
        </div>
      </div>

      <div className="section">
        <h2>🩺 Phlebotomy Status</h2>
        <div className="status-buttons">
          <button 
            className={`status-btn ${status === 'processing' ? 'active' : ''}`}
            onClick={() => updateStatus(orderId, 'processing')}
          >
            <i className="fas fa-check-circle"></i> Reached
          </button>
          <button 
            className={`status-btn status-btn-orange ${status === 'collected' ? 'active' : ''}`}
            onClick={() => updateStatus(orderId, 'collected')}
          >
            <i className="fas fa-vial"></i> Sample Collected
          </button>
          <button 
            className={`status-btn ${status === 'moving' ? 'active' : ''}`}
            onClick={() => updateStatus(orderId, 'moving')}
          >
            <i className="fas fa-truck"></i> Moving to Lab
          </button>
        </div>
      </div>

      <div className="section">
        <h2>📸 Sample Collection</h2>
        <div className="sample-grid">
          <div className="sample-card">
            <h3>Blood Sample</h3>
            <div className="camera-icon" onClick={() => document.getElementById('blood-input').click()}>
              {samplePhotos[`${orderId}-blood`] ? (
                <img src={samplePhotos[`${orderId}-blood`]} alt="Blood" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'10px'}} />
              ) : (
                <i className="fas fa-camera"></i>
              )}
            </div>
            <input 
              id="blood-input" 
              type="file" 
              accept="image/*" 
              style={{display:'none'}} 
              onChange={(e) => uploadPhoto(orderId, 'blood', e.target.files[0])}
            />
            <div className="collection-time">
              {new Date().toLocaleTimeString()}
            </div>
            <div className="sample-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Sample Collected
              </label>
            </div>
          </div>

          <div className="sample-card">
            <h3>Urine Sample</h3>
            <div className="camera-icon" onClick={() => document.getElementById('urine-input').click()}>
              {samplePhotos[`${orderId}-urine`] ? (
                <img src={samplePhotos[`${orderId}-urine`]} alt="Urine" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'10px'}} />
              ) : (
                <i className="fas fa-camera"></i>
              )}
            </div>
            <input 
              id="urine-input" 
              type="file" 
              accept="image/*" 
              style={{display:'none'}} 
              onChange={(e) => uploadPhoto(orderId, 'urine', e.target.files[0])}
            />
            <div className="collection-time">
              {new Date().toLocaleTimeString()}
            </div>
            <div className="sample-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Sample Collected
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>💰 Payment Status</h2>
        <div className="payment-options">
          <label className={`checkbox-label ${paymentStatus[orderId] ? 'payment-collected' : 'payment-pending'}`}>
            <input 
              type="checkbox" 
              checked={paymentStatus[orderId] || false}
              onChange={() => collectPayment(orderId, currentOrder.totalPrice)}
            />
            <span className="checkmark"></span>
            {paymentStatus[orderId] ? 'Payment Collected' : 'Payment Pending'}
          </label>
        </div>
        <div className="total-cash">
          <strong>Total Cash to Collect:</strong> ₹{currentOrder.totalPrice}
        </div>
      </div>

      <div className="section">
        <h2>✅ Final Handover</h2>
        <button 
          className={`handover-btn ${status === 'delivered' ? 'completed' : ''}`}
          onClick={() => updateStatus(orderId, 'delivered')}
          disabled={status === 'delivered'}
        >
          <i className="fas fa-check-double"></i>
          {status === 'delivered' ? 'Handover Completed' : 'Complete Handover'}
        </button>
      </div>

      <div className="booking-navigation">
        <p>Booking {currentIndex + 1} of {orders.length}</p>
        <div className="nav-buttons">
          <button 
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
          >
            ← Previous
          </button>
          <button 
            onClick={() => setCurrentIndex(prev => Math.min(orders.length - 1, prev + 1))}
            disabled={currentIndex === orders.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};
