import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, CheckCircle, Home, User, Calendar, MapPin, Clock, Shield, Zap, Star, Package } from "lucide-react";
import axios from 'axios';
import { baseUrl } from "../utils/config";
import HDFCPayment from '../components/HDFCPayment';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId && storedUserId.toString().startsWith('mock-')) {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
      navigate('/login');
      return;
    }
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      if (token) {
        const response = await axios.get(`${baseUrl}/api/v1/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      const mockCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(mockCart);
    } catch (error) {
      const mockCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(mockCart);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const calculateSubtotal = () => cartItems.reduce((total, item) => total + (item.price || 0), 0);
  const calculateOriginalTotal = () => cartItems.reduce((total, item) => total + (item.originalPrice || item.price || 0), 0);
  const calculateSavings = () => calculateOriginalTotal() - calculateSubtotal();

  const handleCheckout = async () => {
    if (cartItems.length === 0) { alert("Your cart is empty!"); return; }
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    if (!token) {
      navigate('/payment', { state: { orderId: null, amount: calculateSubtotal(), items: cartItems, totalMRP: calculateOriginalTotal(), discount: calculateSavings(), isGuest: true } });
      return;
    }
    try {
      let userLocation = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
          userLocation = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy };
        } catch (error) {}
      }
      const orderData = {
        orderItems: cartItems.map(item => ({ name: item.name, quantity: 1, price: item.price, itemId: item._id })),
        shippingAddress: { address: cartItems[0]?.appointment?.location?.address || 'Test Address', city: cartItems[0]?.appointment?.location?.city || 'Bangalore', postalCode: cartItems[0]?.appointment?.location?.pincode || '560001', country: 'India' },
        location: userLocation, itemsPrice: calculateSubtotal(), taxPrice: 0, shippingPrice: 0, totalPrice: calculateSubtotal(), paymentMethod: 'HDFC'
      };
      const response = await axios.post(`${baseUrl}/api/v1/orders`, orderData, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        setCurrentOrder(response.data.data);
        navigate('/payment', { state: { orderId: response.data.data._id, amount: response.data.data.totalPrice, items: cartItems, totalMRP: calculateOriginalTotal(), discount: calculateSavings(), isGuest: false } });
      }
    } catch (error) {
      navigate('/payment', { state: { orderId: null, amount: calculateSubtotal(), items: cartItems, totalMRP: calculateOriginalTotal(), discount: calculateSavings(), isGuest: true } });
    }
  };

  const handleContinueShopping = () => navigate("/create-package");

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="cart-loading-screen">
          <div className="loading-pulse">
            <ShoppingBag size={40} />
          </div>
          <p>Loading your cart...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="cart-page">

        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-inner">
            <div className="cart-header-left">
              <div className="cart-header-icon">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h1 className="cart-header-title">Your Cart</h1>
                <p className="cart-header-sub">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} selected</p>
              </div>
            </div>
            {/* Step indicator */}
            <div className="checkout-steps">
              <div className="step active">
                <div className="step-num">1</div>
                <span>Cart</span>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-num">2</div>
                <span>Payment</span>
              </div>
              <div className="step-line"></div>
              <div className="step">
                <div className="step-num">3</div>
                <span>Confirm</span>
              </div>
            </div>
          </div>
        </div>

        {showPayment && currentOrder ? (
          <div className="payment-wrap">
            <div className="payment-card">
              <button className="back-link" onClick={() => setShowPayment(false)}>← Back to Cart</button>
              <h3 className="payment-title">Complete Payment</h3>
              <HDFCPayment
                orderId={currentOrder._id}
                amount={currentOrder.totalPrice}
                onSuccess={() => { setCartItems([]); localStorage.removeItem("cart"); window.dispatchEvent(new Event("storage")); }}
                onFailure={(err) => alert(`Payment Failed: ${err}`)}
              />
            </div>
          </div>
        ) : (
          <div className="cart-body">
            {cartItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon-wrap">
                  <ShoppingBag size={56} />
                </div>
                <h2>Your cart is empty</h2>
                <p>You haven't added any tests yet. Start building your health package.</p>
                <div className="empty-actions">
                  <button className="btn-primary" onClick={handleContinueShopping}>
                    <Package size={18} /> Create Custom Package
                  </button>
                  <button className="btn-outline" onClick={() => navigate("/")}>
                    <Home size={18} /> Browse Tests
                  </button>
                </div>
              </div>
            ) : (
              <div className="cart-grid">

                {/* LEFT: Items */}
                <div className="items-col">
                  <div className="items-header">
                    <span className="items-count">{cartItems.length} Tests Selected</span>
                    <button className="clear-btn" onClick={() => { setCartItems([]); localStorage.setItem("cart", JSON.stringify([])); window.dispatchEvent(new Event("storage")); }}>
                      <Trash2 size={14} /> Clear All
                    </button>
                  </div>

                  <div className="items-list">
                    {cartItems.map((item, index) => (
                      <div key={`${item._id || 'item'}-${index}`} className="item-card">
                        <div className="item-top">
                          <div className="item-badge">{index + 1}</div>
                          <div className="item-main">
                            <h3 className="item-name">{item.name}</h3>
                            {item.category && <span className="item-cat">{item.category}</span>}
                            {item.description && (
                              <p className="item-desc">{item.description.substring(0, 100)}{item.description.length > 100 ? '...' : ''}</p>
                            )}
                            <div className="item-tags">
                              {item.homeSampleCollection && (
                                <span className="tag tag-green"><CheckCircle size={12} /> Home Collection</span>
                              )}
                              {item.reportsIn && (
                                <span className="tag tag-blue"><Clock size={12} /> Reports in {item.reportsIn}</span>
                              )}
                            </div>
                          </div>
                          <div className="item-right">
                            <div className="price-block">
                              <span className="price-current">₹{item.price}</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="price-original">₹{item.originalPrice}</span>
                              )}
                              {item.discountPercentage > 0 && (
                                <span className="price-discount">{item.discountPercentage}% OFF</span>
                              )}
                            </div>
                            <button className="remove-btn" onClick={() => handleRemoveItem(item._id)} title="Remove">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {(item.patient || item.appointment) && (
                          <div className="item-details">
                            {item.patient && (
                              <div className="detail-pill">
                                <User size={13} />
                                <span>{item.patient.name} · {item.patient.age}/{item.patient.gender}</span>
                              </div>
                            )}
                            {item.appointment?.date && item.appointment?.time && (
                              <div className="detail-pill">
                                <Calendar size={13} />
                                <span>{item.appointment.date.day} {item.appointment.date.date} {item.appointment.date.month} at {item.appointment.time}</span>
                              </div>
                            )}
                            {item.appointment?.location && (
                              <div className="detail-pill">
                                <MapPin size={13} />
                                <span>{typeof item.appointment.location === 'string' ? item.appointment.location : `${item.appointment.location.address}, ${item.appointment.location.city} - ${item.appointment.location.pincode}`}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <button className="add-more-btn" onClick={handleContinueShopping}>
                    <ArrowRight size={18} /> Add More Tests
                  </button>
                </div>

                {/* RIGHT: Summary */}
                <div className="summary-col">
                  <div className="summary-card">
                    <div className="summary-head">
                      <h2>Order Summary</h2>
                    </div>

                    <div className="summary-body">
                      <div className="summary-line">
                        <span>MRP Total ({cartItems.length} tests)</span>
                        <span>₹{calculateOriginalTotal()}</span>
                      </div>
                      {calculateSavings() > 0 && (
                        <div className="summary-line green">
                          <span>Package Discount</span>
                          <span>−₹{calculateSavings()}</span>
                        </div>
                      )}
                      <div className="summary-line">
                        <span>Home Collection</span>
                        <span className="free-label">FREE</span>
                      </div>
                      <div className="summary-line">
                        <span>Tax</span>
                        <span className="free-label">₹0</span>
                      </div>
                      <div className="summary-divider" />
                      <div className="summary-line total">
                        <span>Total Payable</span>
                        <span>₹{calculateSubtotal()}</span>
                      </div>
                    </div>

                    {calculateSavings() > 0 && (
                      <div className="savings-strip">
                        <Star size={14} /> You're saving <strong>₹{calculateSavings()}</strong> on this order!
                      </div>
                    )}

                    <button className="checkout-btn" onClick={handleCheckout}>
                      Proceed to Payment
                      <ArrowRight size={18} />
                    </button>

                    <div className="secure-note">
                      <Shield size={14} /> 100% Secure & Encrypted Payment
                    </div>
                  </div>

                  {/* Perks */}
                  <div className="perks-card">
                    <p className="perks-title">What's included</p>
                    <div className="perks-list">
                      {[
                        { icon: <Home size={15} />, text: 'Free home sample collection' },
                        { icon: <Zap size={15} />, text: 'Fast digital report delivery' },
                        { icon: <User size={15} />, text: 'Expert doctor consultation' },
                        { icon: <Shield size={15} />, text: 'NABL certified labs' },
                      ].map((p, i) => (
                        <div key={i} className="perk-item">
                          <div className="perk-icon">{p.icon}</div>
                          <span>{p.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

  .cart-page {
    font-family: 'Sora', sans-serif;
    min-height: 100vh;
    background: #f4f6fb;
    color: #1a1d2e;
  }

  /* ── Header ── */
  .cart-header {
    background: #fff;
    border-bottom: 1px solid #e8ecf4;
    padding: 0 24px;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .cart-header-inner {
    max-width: 1180px;
    margin: 0 auto;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .cart-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .cart-header-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, #2e9d91, #1f7068);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }
  .cart-header-title {
    font-size: 18px; font-weight: 700; margin: 0; color: #1a1d2e;
  }
  .cart-header-sub {
    font-size: 12px; color: #6b7280; margin: 0; font-weight: 400;
  }

  /* Steps */
  .checkout-steps {
    display: flex; align-items: center; gap: 0;
  }
  .step {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 500; color: #9ca3af;
  }
  .step.active { color: #2e9d91; }
  .step-num {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 600; color: #9ca3af;
    background: #fff;
  }
  .step.active .step-num {
    background: #2e9d91; border-color: #2e9d91; color: #fff;
  }
  .step-line {
    width: 48px; height: 2px; background: #e5e7eb; margin: 0 8px;
  }

  /* ── Loading ── */
  .cart-loading-screen {
    min-height: 100vh; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 16px;
    background: #f4f6fb; color: #6b7280; font-family: 'Sora', sans-serif;
  }
  .loading-pulse {
    width: 72px; height: 72px; border-radius: 20px;
    background: linear-gradient(135deg, #2e9d91, #1f7068);
    display: flex; align-items: center; justify-content: center;
    color: #fff; animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.95); opacity: 0.8; }
  }

  /* ── Body ── */
  .cart-body {
    max-width: 1180px;
    margin: 0 auto;
    padding: 32px 24px 80px;
  }

  /* ── Empty ── */
  .empty-state {
    text-align: center;
    padding: 100px 24px;
  }
  .empty-icon-wrap {
    width: 100px; height: 100px; border-radius: 28px;
    background: linear-gradient(135deg, #e8f7f6, #b2e0db);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px; color: #2e9d91;
  }
  .empty-state h2 { font-size: 26px; font-weight: 700; margin-bottom: 8px; }
  .empty-state p { color: #6b7280; font-size: 15px; margin-bottom: 32px; }
  .empty-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    display: flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, #2e9d91, #1f7068);
    color: #fff; border: none; border-radius: 12px;
    padding: 14px 24px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(46,157,145,0.35); }
  .btn-outline {
    display: flex; align-items: center; gap: 8px;
    background: #fff; color: #374151; border: 1.5px solid #e5e7eb;
    border-radius: 12px; padding: 14px 24px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-outline:hover { border-color: #2e9d91; color: #2e9d91; }

  /* ── Grid ── */
  .cart-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .cart-grid { grid-template-columns: 1fr; }
    .checkout-steps { display: none; }
  }

  /* ── Items Column ── */
  .items-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .items-count { font-size: 14px; font-weight: 600; color: #374151; }
  .clear-btn {
    display: flex; align-items: center; gap: 6px;
    background: none; border: 1.5px solid #fee2e2;
    color: #ef4444; border-radius: 8px; padding: 6px 12px;
    font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    font-family: 'Sora', sans-serif;
  }
  .clear-btn:hover { background: #fee2e2; }

  .items-list { display: flex; flex-direction: column; gap: 12px; }

  .item-card {
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    border: 1.5px solid #e8ecf4;
    transition: all 0.2s;
    animation: slideIn 0.3s ease;
  }
  .item-card:hover { border-color: #a8d5d1; box-shadow: 0 4px 20px rgba(46,157,145,0.08); }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .item-top { display: flex; gap: 14px; align-items: flex-start; }
  .item-badge {
    min-width: 28px; height: 28px; border-radius: 8px;
    background: linear-gradient(135deg, #e8f7f6, #b2e0db);
    color: #2e9d91; font-size: 12px; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    margin-top: 2px;
  }
  .item-main { flex: 1; min-width: 0; }
  .item-name { font-size: 15px; font-weight: 700; margin: 0 0 4px; color: #1a1d2e; }
  .item-cat {
    display: inline-block; font-size: 11px; font-weight: 500;
    background: #f3f4f6; color: #6b7280; padding: 3px 8px;
    border-radius: 6px; margin-bottom: 6px;
  }
  .item-desc { font-size: 12px; color: #9ca3af; margin: 0 0 8px; line-height: 1.5; }
  .item-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .tag {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 500; padding: 4px 8px; border-radius: 6px;
  }
  .tag-green { background: #f0fdf4; color: #16a34a; }
  .tag-blue { background: #e8f7f6; color: #2e9d91; }

  .item-right {
    display: flex; flex-direction: column; align-items: flex-end; gap: 12px;
    min-width: 100px;
  }
  .price-block { text-align: right; }
  .price-current { display: block; font-size: 18px; font-weight: 800; color: #1a1d2e; }
  .price-original { display: block; font-size: 12px; color: #9ca3af; text-decoration: line-through; }
  .price-discount {
    display: inline-block; font-size: 11px; font-weight: 600;
    background: #fef3c7; color: #d97706; padding: 2px 7px; border-radius: 5px; margin-top: 3px;
  }
  .remove-btn {
    width: 34px; height: 34px; border-radius: 10px;
    background: #fff; border: 1.5px solid #fee2e2;
    color: #ef4444; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.2s;
  }
  .remove-btn:hover { background: #fee2e2; border-color: #ef4444; transform: scale(1.05); }

  .item-details {
    margin-top: 14px; padding-top: 14px;
    border-top: 1px dashed #e8ecf4;
    display: flex; flex-wrap: wrap; gap: 8px;
  }
  .detail-pill {
    display: flex; align-items: center; gap: 6px;
    background: #f8fafc; border: 1px solid #e8ecf4;
    border-radius: 8px; padding: 6px 10px;
    font-size: 12px; color: #4b5563;
  }
  .detail-pill svg { color: #2e9d91; flex-shrink: 0; }

  .add-more-btn {
    display: flex; align-items: center; gap: 8px;
    background: none; border: 2px dashed #a8d5d1;
    color: #2e9d91; border-radius: 14px; padding: 14px 20px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.2s; width: 100%; justify-content: center;
    margin-top: 16px; font-family: 'Sora', sans-serif;
  }
  .add-more-btn:hover { background: #e8f7f6; border-color: #2e9d91; }

  /* ── Summary Column ── */
  .summary-card {
    background: #fff;
    border-radius: 20px;
    border: 1.5px solid #e8ecf4;
    overflow: hidden;
    position: sticky;
    top: 90px;
    box-shadow: 0 8px 32px rgba(46,157,145,0.06);
  }
  .summary-head {
    background: linear-gradient(135deg, #175950, #2e9d91);
    padding: 20px 24px;
  }
  .summary-head h2 { color: #fff; font-size: 16px; font-weight: 700; margin: 0; }
  .summary-body { padding: 20px 24px; }
  .summary-line {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; font-size: 13px; color: #4b5563; border-bottom: 1px solid #f3f4f6;
  }
  .summary-line:last-child { border-bottom: none; }
  .summary-line.green { color: #16a34a; }
  .summary-line.total {
    font-size: 16px; font-weight: 800; color: #1a1d2e;
    padding-top: 12px;
  }
  .free-label {
    font-size: 12px; font-weight: 700;
    background: #f0fdf4; color: #16a34a;
    padding: 3px 8px; border-radius: 6px;
  }
  .summary-divider { height: 1px; background: #e8ecf4; margin: 4px 0; }

  .savings-strip {
    display: flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #fef9c3, #fef3c7);
    color: #92400e; font-size: 12px; font-weight: 600;
    padding: 10px 24px;
    border-top: 1px solid #fde68a;
  }

  .checkout-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; background: linear-gradient(135deg, #2e9d91, #1f7068);
    color: #fff; border: none; border-radius: 0;
    padding: 18px 24px; font-size: 15px; font-weight: 700;
    cursor: pointer; transition: all 0.2s; font-family: 'Sora', sans-serif;
  }
  .checkout-btn:hover { background: linear-gradient(135deg, #1f7068, #175950); box-shadow: 0 8px 24px rgba(46,157,145,0.4); }
  .checkout-btn:active { transform: scale(0.99); }

  .secure-note {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-size: 11px; color: #9ca3af; padding: 12px 24px 20px;
    background: #fafbff;
  }

  /* Perks */
  .perks-card {
    background: #fff;
    border-radius: 16px;
    border: 1.5px solid #e8ecf4;
    padding: 18px 20px;
    margin-top: 16px;
  }
  .perks-title { font-size: 12px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 14px; }
  .perks-list { display: flex; flex-direction: column; gap: 10px; }
  .perk-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #374151; }
  .perk-icon {
    width: 30px; height: 30px; border-radius: 8px;
    background: linear-gradient(135deg, #e8f7f6, #b2e0db);
    color: #2e9d91; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* Payment Wrap */
  .payment-wrap {
    max-width: 520px; margin: 40px auto; padding: 0 24px;
  }
  .payment-card {
    background: #fff; border-radius: 20px;
    border: 1.5px solid #e8ecf4; padding: 32px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.06);
  }
  .back-link {
    background: none; border: none; color: #2e9d91; font-size: 13px;
    cursor: pointer; padding: 0; margin-bottom: 20px; display: block;
    font-family: 'Sora', sans-serif; font-weight: 600;
  }
  .payment-title { font-size: 20px; font-weight: 700; text-align: center; margin-bottom: 24px; }
`;

export default Cart;