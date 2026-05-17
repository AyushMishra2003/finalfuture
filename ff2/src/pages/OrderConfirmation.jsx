import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Package, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { baseUrl } from '../utils/config';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = localStorage.getItem('userToken') || localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/api/v1/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" />
        <p className="mt-3">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Success Header */}
          <div className="text-center mb-4">
            <div className="mb-3">
              <CheckCircle size={80} className="text-success" />
            </div>
            <h1 className="text-success mb-2">Payment Successful!</h1>
            <p className="text-muted">Thank you for your order. Your booking has been confirmed.</p>
          </div>

          {/* Order Details Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <Package size={20} className="me-2" />
                Order Confirmation
              </h5>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1 text-muted">Order ID</p>
                  <p className="fw-bold">{orderId}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1 text-muted">Order Date</p>
                  <p className="fw-bold">
                    {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <p className="mb-1 text-muted">Total Amount</p>
                  <p className="fw-bold text-success fs-4">₹{order?.totalPrice || 0}</p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1 text-muted">Payment Status</p>
                  <span className="badge bg-success">Paid</span>
                </div>
              </div>

              {/* Tests/Items */}
              {order?.orderItems && order.orderItems.length > 0 && (
                <div className="mt-4">
                  <h6 className="mb-3">Ordered Tests</h6>
                  <div className="list-group">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">{item.name}</h6>
                            {item.category && (
                              <small className="text-muted">{item.category}</small>
                            )}
                          </div>
                          <span className="fw-bold">₹{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Details */}
              {order?.bookingDetails && (
                <div className="mt-4 p-3 bg-light rounded">
                  <h6 className="mb-3">
                    <Calendar size={18} className="me-2" />
                    Sample Collection Details
                  </h6>
                  <p className="mb-2">
                    <strong>Date:</strong> {new Date(order.bookingDetails.scheduledDate).toLocaleDateString()}
                  </p>
                  <p className="mb-2">
                    <strong>Time:</strong> {order.bookingDetails.timeRange}
                  </p>
                  {order.bookingDetails.verificationOTP && (
                    <div className="alert alert-info mt-3">
                      <strong>Verification OTP:</strong> {order.bookingDetails.verificationOTP}
                      <br />
                      <small>Please share this OTP with the sample collector</small>
                    </div>
                  )}
                </div>
              )}

              {/* Address */}
              {order?.shippingAddress && (
                <div className="mt-4">
                  <h6 className="mb-3">
                    <MapPin size={18} className="me-2" />
                    Collection Address
                  </h6>
                  <p className="mb-1">{order.shippingAddress.address}</p>
                  <p className="mb-1">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p className="mb-0">PIN: {order.shippingAddress.pincode}</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h6 className="mb-3">Need Help?</h6>
              <p className="mb-2">
                <Phone size={16} className="me-2" />
                Call us: 1800-XXX-XXXX
              </p>
              <p className="mb-0">
                <Mail size={16} className="me-2" />
                Email: support@futurelabs.com
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 justify-content-center">
            <button 
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/orders')}
            >
              View All Orders
            </button>
            <button 
              className="btn btn-outline-primary btn-lg"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
