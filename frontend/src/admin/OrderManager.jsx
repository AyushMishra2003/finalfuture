import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/orders');
      
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
        `http://localhost:5000/api/v1/orders/${orderId}/status`,
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
    </div>
  );
};

export default OrderManager;
