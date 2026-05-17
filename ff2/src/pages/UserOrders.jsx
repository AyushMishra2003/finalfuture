import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ShoppingBag, Calendar, Package } from 'react-feather';

import { baseUrl } from "../utils/config";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('userToken') || localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch(`${baseUrl}/api/v1/orders/myorders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setOrders(data.data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (loading) {
        return (
            <div className="container py-5 text-center" style={{ marginTop: '100px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ marginTop: '100px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <h2 className="mb-4">My Orders</h2>

                    {orders.length === 0 ? (
                        <div className="text-center py-5 bg-light rounded-3">
                            <div className="mb-3">
                                <ShoppingBag size={60} className="text-muted opacity-50" />
                            </div>
                            <h4 className="text-muted">No orders found</h4>
                            <p className="text-muted mb-4">You haven't placed any orders yet.</p>
                            <Link to="/" className="btn btn-primary">Browse Checkups</Link>
                        </div>
                    ) : (
                        <div className="list-group">
                            {orders.map(order => (
                                <div key={order._id} className="list-group-item border-0 shadow-sm mb-3 rounded-3 p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <h5 className="mb-1">Order #{order._id.substring(0, 10)}...</h5>
                                            <div className="text-muted small">
                                                <Calendar size={14} className="me-1" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <span className={`badge rounded-pill ${order.isPaid ? 'bg-success' : 'bg-warning text-dark'
                                                } mb-2`}>
                                                {order.isPaid ? 'Paid' : 'Pending Payment'}
                                            </span>
                                            <h5 className="mb-0 text-primary">₹{order.totalPrice}</h5>
                                        </div>
                                    </div>

                                    <div className="border-top pt-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <Package size={16} className="text-muted me-2" />
                                            <span className="fw-bold">Items:</span>
                                        </div>
                                        {/* Mocking order items display or assuming orderItems exists */}
                                        <ul className="list-unstyled mb-0 ms-4">
                                            {order.orderItems && order.orderItems.map((item, idx) => (
                                                <li key={idx} className="text-muted mb-1">
                                                    {item.name} x {item.quantity || 1}
                                                </li>
                                            ))}
                                            {!order.orderItems && <li className="text-muted">Order details unavailable</li>}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserOrders;
