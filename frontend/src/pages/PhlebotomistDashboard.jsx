import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PhlebotomistDashboard.css';

const PhlebotomistDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [locationAddress, setLocationAddress] = useState('');

  const baseUrl = process.env.REACT_APP_API_URL || 'http://147.93.27.120:3000/api/v1';

  useEffect(() => {
    fetchDashboard();
    requestLocation();
  }, []);

  useEffect(() => {
    if (dashboardData?.phlebotomistLocation?.latitude) {
      fetchLocationAddress(
        dashboardData.phlebotomistLocation.latitude,
        dashboardData.phlebotomistLocation.longitude
      );
    }
  }, [dashboardData]);

  const fetchLocationAddress = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        { headers: { 'User-Agent': 'FutureLabs Phlebotomist App' } }
      );
      if (response.data?.display_name) {
        setLocationAddress(response.data.display_name);
      }
    } catch (error) {
      console.error('Error fetching location address:', error);
      setLocationAddress(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    }
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updatePhlebotomistLocation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  };

  const updatePhlebotomistLocation = async (latitude, longitude) => {
    try {
      const token = localStorage.getItem('collectorToken');
      await axios.put(
        `${baseUrl}/phlebotomist/location`,
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Location updated');
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('collectorToken');
      const response = await axios.get(`${baseUrl}/phlebotomist/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('collectorToken');
        window.location.href = '/phlebotomist/login';
      } else if (error.response?.status === 404) {
        alert('No collector folder assigned. Please contact admin.');
      } else {
        alert('Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('collectorToken');
      const response = await axios.get(`${baseUrl}/phlebotomist/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('collectorToken');
      await axios.put(
        `${baseUrl}/phlebotomist/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Status updated successfully!');
      fetchDashboard();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const openNavigation = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="error">Failed to load dashboard</div>;
  }

  const { collectorFolder, stats, orders, phlebotomistLocation } = dashboardData;

  return (
    <div className="phlebotomist-dashboard">
      <div className="dashboard-header">
        <h1>🩸 Phlebotomist Dashboard</h1>
        <div className="collector-info">
          <h3>{collectorFolder.name}</h3>
          <p>Service Areas: {collectorFolder.pincodes.join(', ')}</p>
          <p>Working Hours: {collectorFolder.workingHours.start}:00 - {collectorFolder.workingHours.end}:00</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>₹{stats.totalRevenue}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {phlebotomistLocation && (
        <div className="location-info">
          <span className="location-icon">📍</span>
          <span>Your Location: {locationAddress || 'Loading address...'}</span>
          <button className="btn-refresh-location" onClick={requestLocation}>🔄 Update Location</button>
        </div>
      )}

      <div className="orders-section">
        <h2>📦 Assigned Orders (Sorted by Distance)</h2>
        
        {orders.length === 0 ? (
          <div className="empty-state">No orders assigned yet</div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-item">
                <div className="order-main">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <p><strong>Patient:</strong> {order.user?.name}</p>
                    <p><strong>Phone:</strong> {order.user?.phone}</p>
                    <p><strong>Address:</strong> {order.shippingAddress?.address}</p>
                    <p><strong>Amount:</strong> ₹{order.totalPrice}</p>
                    <p><strong>Status:</strong> <span className={`status-badge ${order.orderStatus}`}>{order.orderStatus}</span></p>
                  </div>

                  <div className="order-distance">
                    <div className="distance-display">
                      <span className="distance-icon">📍</span>
                      <span className="distance-text">{order.distance}</span>
                    </div>
                    <div className="fare-display">
                      <span className="fare-icon">💰</span>
                      <span className="fare-text">{order.estimatedFare}</span>
                    </div>
                  </div>
                </div>

                <div className="order-actions">
                  <button
                    className="btn-view"
                    onClick={() => viewOrderDetails(order._id)}
                  >
                    View Details
                  </button>
                  {order.orderStatus === 'scheduled' && (
                    <button
                      className="btn-start"
                      onClick={() => updateOrderStatus(order._id, 'processing')}
                    >
                      Start Collection
                    </button>
                  )}
                  {order.orderStatus === 'processing' && (
                    <button
                      className="btn-complete"
                      onClick={() => updateOrderStatus(order._id, 'delivered')}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>
            
            <h2>📋 Order Details</h2>
            
            <div className="order-detail-section">
              <h3>Patient Information</h3>
              <p><strong>Name:</strong> {selectedOrder.user?.name}</p>
              <p><strong>Phone:</strong> {selectedOrder.user?.phone}</p>
              <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
            </div>

            <div className="order-detail-section">
              <h3>Address</h3>
              <p>{selectedOrder.shippingAddress?.address}</p>
              <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
            </div>

            <div className="order-detail-section">
              <h3>Distance & Fare</h3>
              <p><strong>Distance:</strong> {selectedOrder.distance}</p>
              <p><strong>Estimated Fare:</strong> {selectedOrder.estimatedFare}</p>
            </div>

            <div className="order-detail-section">
              <h3>Tests Ordered</h3>
              {selectedOrder.orderItems?.map((item, index) => (
                <div key={index} className="test-item">
                  <span>{item.name}</span>
                  <span>₹{item.price}</span>
                </div>
              ))}
              <div className="test-total">
                <strong>Total:</strong>
                <strong>₹{selectedOrder.totalPrice}</strong>
              </div>
            </div>

            {selectedOrder.navigationUrl && (
              <button
                className="btn-navigate"
                onClick={() => openNavigation(selectedOrder.navigationUrl)}
              >
                🗺️ Open in Google Maps
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhlebotomistDashboard;
