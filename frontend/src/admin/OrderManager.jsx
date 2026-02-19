import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCollectorModal, setShowCollectorModal] = useState(false);
  const [collectors, setCollectors] = useState([]);
  const [loadingCollectors, setLoadingCollectors] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://147.93.27.120:3000/api/v1/orders');
      
      if (response.data.success) {
        // Add readable address for each order
        const ordersWithAddress = await Promise.all(
          response.data.data.map(async (order) => {
            const lat = order.shippingAddress?.location?.latitude;
            const lon = order.shippingAddress?.location?.longitude;
            
            if (lat && lon) {
              try {
                const addrResponse = await axios.get(
                  `https://us1.locationiq.com/v1/reverse.php?key=pk.2bc21e092c881e1b4035ef20f9da09f6&lat=${lat}&lon=${lon}&format=json`
                );
                const addr = addrResponse.data.address;
                order.readableAddress = `${addr.road || addr.suburb || ''}, ${addr.city || addr.town || ''}, ${addr.state || ''}`;
              } catch (error) {
                console.error('Reverse geocoding error:', error);
              }
            }
            return order;
          })
        );
        setOrders(ordersWithAddress);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return "delivered";
      case "processing":
        return "processing";
      case "shipped":
        return "shipped";
      case "pending":
        return "pending";
      case "cancelled":
        return "pending";
      default:
        return "pending";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "processing":
        return "Processing";
      case "shipped":
        return "Shipped";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://147.93.27.120:3000/api/v1/orders/${orderId}/status`,
        { status: newStatus }
      );
      fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const findCollector = async (order) => {
    setSelectedOrder(order);
    setShowCollectorModal(true);
    setLoadingCollectors(true);
    
    try {
      const response = await fetch('http://147.93.27.120:3000/api/v1/admin/collector-folders');
      const data = await response.json();
      
      console.log('Collectors API response:', data);
      
      if (data.success && data.data) {
        setCollectors(data.data);
        console.log('Collectors loaded:', data.data.length);
      } else {
        setCollectors([]);
        console.log('No collectors found in response');
      }
    } catch (error) {
      console.error('Error fetching collectors:', error);
      setCollectors([]);
      alert('Error fetching collectors: ' + error.message);
    } finally {
      setLoadingCollectors(false);
    }
  };

  const assignCollector = async (collectorId) => {
    try {
      await axios.put(
        `http://147.93.27.120:3000/api/v1/orders/${selectedOrder._id}`,
        { assignedCollector: collectorId }
      );
      
      alert('Collector assigned successfully!');
      setShowCollectorModal(false);
      fetchOrders();
    } catch (error) {
      console.error('Error assigning collector:', error);
      alert('Error assigning collector. Please try again.');
    }
  };

  const openLocation = (order) => {
    if (order.shippingAddress?.location?.latitude) {
      const { latitude, longitude } = order.shippingAddress.location;
      window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank');
    } else if (order.shippingAddress?.address) {
      const query = encodeURIComponent(`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.orderStatus === filter);

  if (loading) {
    return <div className="admin-content">Loading...</div>;
  }

  return (
    <div className="admin-content">
      <div className="admin-header">
        <h1>Manage Orders</h1>
        <div className="filter-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="form-control"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="table-card">
        <h2>Orders</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id?.slice(-8)}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>
                    {order.shippingAddress?.location?.latitude ? (
                      <button 
                        onClick={() => openLocation(order)}
                        className="btn-location"
                        title="View on Map"
                      >
                        📍 {order.readableAddress || `${order.shippingAddress.location.latitude.toFixed(4)}, ${order.shippingAddress.location.longitude.toFixed(4)}`}
                      </button>
                    ) : (
                      <span>{order.shippingAddress?.city || 'N/A'}</span>
                    )}
                  </td>
                  <td>
                    <span className={`status ${getStatusClass(order.orderStatus)}`}>
                      {getStatusText(order.orderStatus)}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => viewOrderDetails(order)} className="btn-view">View</button>
                    <button onClick={() => findCollector(order)} className="btn-collector" title="Find Collector">
                      🔍 Collector
                    </button>
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="form-control status-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="stats-summary">
        <div className="summary-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>
        <div className="summary-card">
          <h3>Pending Orders</h3>
          <p>{orders.filter((o) => o.orderStatus === "pending").length}</p>
        </div>
        <div className="summary-card">
          <h3>Processing Orders</h3>
          <p>{orders.filter((o) => o.orderStatus === "processing").length}</p>
        </div>
        <div className="summary-card">
          <h3>Completed Orders</h3>
          <p>{orders.filter((o) => o.orderStatus === "delivered").length}</p>
        </div>
      </div>

      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button onClick={() => setShowDetails(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              <div className="order-info">
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                <p><strong>Phone:</strong> {selectedOrder.user?.phone}</p>
                <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
                <p><strong>Payment:</strong> {selectedOrder.isPaid ? 'Paid' : 'Pending'}</p>
                <p><strong>Total:</strong> ₹{selectedOrder.totalPrice}</p>
              </div>
              <div className="order-address">
                <h3>Shipping Address</h3>
                <p>{selectedOrder.shippingAddress?.address}</p>
                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                {selectedOrder.shippingAddress?.location?.latitude && (
                  <div>
                    <p><strong>Location:</strong></p>
                    <p>📍 Lat: {selectedOrder.shippingAddress.location.latitude}</p>
                    <p>📍 Lng: {selectedOrder.shippingAddress.location.longitude}</p>
                    <button onClick={() => openLocation(selectedOrder)} className="btn-map">
                      View on Google Maps
                    </button>
                  </div>
                )}
              </div>
              <div className="order-items">
                <h3>Order Items</h3>
                {selectedOrder.orderItems?.map((item, index) => (
                  <div key={index} className="item-row">
                    <span>{item.name}</span>
                    <span>Qty: {item.quantity}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collector Assignment Modal */}
      {showCollectorModal && (
        <div className="modal-overlay" onClick={() => setShowCollectorModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Collector</h2>
              <button onClick={() => setShowCollectorModal(false)} className="close-btn">&times;</button>
            </div>
            <div className="modal-body">
              {selectedOrder && (
                <div className="order-info" style={{ marginBottom: '20px', padding: '15px', background: '#f8fdff', borderRadius: '8px' }}>
                  <p><strong>Order ID:</strong> {selectedOrder._id?.slice(-8)}</p>
                  <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                  <p><strong>Location:</strong> {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                </div>
              )}
              
              <h3 style={{ marginBottom: '15px', color: '#007c6f' }}>Available Collectors</h3>
              
              {loadingCollectors ? (
                <p style={{ textAlign: 'center', padding: '20px' }}>Loading collectors...</p>
              ) : collectors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', background: '#fff3cd', borderRadius: '8px', border: '1px solid #ffc107' }}>
                  <p style={{ margin: '0 0 15px 0', fontSize: '1.1rem', color: '#856404' }}>
                    ⚠️ No collectors available
                  </p>
                  <p style={{ margin: '0 0 15px 0', color: '#856404' }}>
                    Please create collector folders first in the Collector Management section.
                  </p>
                  <button 
                    onClick={() => {
                      setShowCollectorModal(false);
                      // You can add navigation to collector management here
                    }}
                    className="btn-primary btn-sm"
                  >
                    Go to Collector Management
                  </button>
                </div>
              ) : (
                <div className="collector-list">
                  {collectors.map((collector) => (
                    <div key={collector._id} className="collector-item">
                      <div className="collector-info">
                        <h4>{collector.name}</h4>
                        <p><strong>Phlebotomist:</strong> {collector.phlebotomistId?.name || 'N/A'}</p>
                        <p><strong>Phone:</strong> {collector.phlebotomistId?.phone || 'N/A'}</p>
                        <p><strong>Pincodes:</strong> {collector.pincodes?.join(', ') || 'N/A'}</p>
                        <p><strong>Max Orders/Hour:</strong> {collector.maxOrdersPerHour || 5}</p>
                      </div>
                      <button 
                        onClick={() => assignCollector(collector._id)}
                        className="btn-primary btn-sm"
                      >
                        Assign
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
