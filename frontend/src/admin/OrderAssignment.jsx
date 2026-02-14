import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderAssignment.css';

const OrderAssignment = () => {
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [availableCollectors, setAvailableCollectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('unassigned');

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = activeTab === 'unassigned' ? '/admin/order-assignment/unassigned' : '/admin/order-assignment/assigned';
      
      const response = await axios.get(`${baseUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (activeTab === 'unassigned') {
        setUnassignedOrders(response.data.data);
      } else {
        setAssignedOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCollectors = async (orderId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${baseUrl}/admin/order-assignment/${orderId}/available-collectors`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAvailableCollectors(response.data.data);
      setSelectedOrder(orderId);
    } catch (error) {
      console.error('Error fetching collectors:', error);
      alert(error.response?.data?.error || 'Failed to fetch collectors');
    } finally {
      setLoading(false);
    }
  };

  const assignOrder = async (collectorFolderId) => {
    if (!window.confirm('Assign this order to the selected collector?')) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${baseUrl}/admin/order-assignment/${selectedOrder}/assign`,
        {
          collectorFolderId,
          scheduledDate: new Date(),
          scheduledHour: 9
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Order assigned successfully!');
      setSelectedOrder(null);
      setAvailableCollectors([]);
      fetchOrders();
    } catch (error) {
      console.error('Error assigning order:', error);
      alert('Failed to assign order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="order-assignment-container">
      <h2>📋 Order Assignment System</h2>

      <div className="tabs">
        <button
          className={activeTab === 'unassigned' ? 'active' : ''}
          onClick={() => setActiveTab('unassigned')}
        >
          Unassigned Orders ({unassignedOrders.length})
        </button>
        <button
          className={activeTab === 'assigned' ? 'active' : ''}
          onClick={() => setActiveTab('assigned')}
        >
          Assigned Orders ({assignedOrders.length})
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {activeTab === 'unassigned' && (
        <div className="orders-grid">
          {unassignedOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order #{order._id.slice(-6)}</h3>
                <span className="order-status">{order.orderStatus}</span>
              </div>
              
              <div className="order-details">
                <p><strong>Customer:</strong> {order.user?.name || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.user?.phone || 'N/A'}</p>
                <p><strong>Amount:</strong> ₹{order.totalPrice}</p>
                <p><strong>Address:</strong> {order.readableAddress || order.shippingAddress?.address}</p>
                <p><strong>Pincode:</strong> {order.shippingAddress?.postalCode}</p>
                {order.shippingAddress?.location?.latitude && (
                  <p><strong>GPS:</strong> {order.shippingAddress.location.latitude.toFixed(4)}, {order.shippingAddress.location.longitude.toFixed(4)}</p>
                )}
              </div>

              <button
                className="btn-assign"
                onClick={() => fetchAvailableCollectors(order._id)}
                disabled={!order.shippingAddress?.location?.latitude}
              >
                {order.shippingAddress?.location?.latitude ? 'Find Collectors' : 'No Location Data'}
              </button>
            </div>
          ))}

          {unassignedOrders.length === 0 && !loading && (
            <div className="empty-state">No unassigned orders</div>
          )}
        </div>
      )}

      {activeTab === 'assigned' && (
        <div className="orders-grid">
          {assignedOrders.map((order) => (
            <div key={order._id} className="order-card assigned">
              <div className="order-header">
                <h3>Order #{order._id.slice(-6)}</h3>
                <span className="order-status">{order.orderStatus}</span>
              </div>
              
              <div className="order-details">
                <p><strong>Customer:</strong> {order.user?.name || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.user?.phone || 'N/A'}</p>
                <p><strong>Amount:</strong> ₹{order.totalPrice}</p>
                <p><strong>Collector:</strong> {order.bookingDetails?.collectorName}</p>
                <p><strong>Scheduled:</strong> {new Date(order.bookingDetails?.scheduledDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}

          {assignedOrders.length === 0 && !loading && (
            <div className="empty-state">No assigned orders</div>
          )}
        </div>
      )}

      {selectedOrder && availableCollectors.length > 0 && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🩸 Available Collectors</h3>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>×</button>

            <div className="collectors-list">
              {availableCollectors.map((collector) => (
                <div key={collector._id} className="collector-card">
                  <div className="collector-info">
                    <h4>{collector.name}</h4>
                    <p><strong>Phlebotomist:</strong> {collector.phlebotomist?.name}</p>
                    <p><strong>Phone:</strong> {collector.phlebotomist?.phone}</p>
                    <p><strong>Pincodes:</strong> {collector.pincodes.join(', ')}</p>
                    <p><strong>Capacity:</strong> {collector.maxOrdersPerHour} orders/hour</p>
                    <p><strong>Working Hours:</strong> {collector.workingHours.start}:00 - {collector.workingHours.end}:00</p>
                  </div>

                  <div className="distance-info">
                    <div className="distance-badge">
                      <span className="distance-icon">📍</span>
                      <span className="distance-value">{collector.distance}</span>
                    </div>
                    <div className="fare-badge">
                      <span className="fare-icon">💰</span>
                      <span className="fare-value">{collector.estimatedFare}</span>
                    </div>
                  </div>

                  <button
                    className="btn-assign-collector"
                    onClick={() => assignOrder(collector._id)}
                  >
                    Assign to {collector.phlebotomist?.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderAssignment;
