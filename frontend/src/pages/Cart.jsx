import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, CheckCircle, Home } from "lucide-react";
import axios from 'axios';
import { baseUrl } from "../utils/config";
import HDFCPayment from '../components/HDFCPayment';
import "./Cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Clear legacy mock data if present
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId && storedUserId.toString().startsWith('mock-')) {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
      // Redirect to login or refresh
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
        // Note: Logic to extract cart items from orders or separate cart endpoint needed
        // For now, falling back to local storage if API fails or for guests
      }

      const mockCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(mockCart);
    } catch (error) {
      console.error("Error fetching cart items:", error);
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

    // Trigger storage event for cart count update
    window.dispatchEvent(new Event("storage"));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  const calculateOriginalTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.originalPrice || item.price || 0),
      0
    );
  };

  const calculateSavings = () => {
    return calculateOriginalTotal() - calculateSubtotal();
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    if (!token) {
      alert("Please login to proceed with checkout");
      navigate('/login'); // Assuming /login route exists or use appropriate redirect
      return;
    }

    try {
      // Create Order First
      const orderConfig = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const orderData = {
        orderItems: cartItems.map(item => ({
          name: item.name,
          quantity: 1, // Default to 1
          price: item.price,
          test: item._id
        })),
        itemsPrice: calculateSubtotal(),
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: calculateSubtotal(),
        paymentMethod: 'HDFC'
      };

      const response = await axios.post(`${baseUrl}/api/v1/orders`, orderData, orderConfig);

      if (response.data.success) {
        setCurrentOrder(response.data.data);
        const totalMRP = calculateOriginalTotal();
        const savings = calculateSavings();

        // Instead of inline payment, navigate to Payment Page with state
        navigate('/payment', {
          state: {
            orderId: response.data.data._id,
            amount: response.data.data.totalPrice,
            items: cartItems,
            totalMRP: totalMRP,
            discount: savings
          }
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const handleContinueShopping = () => {
    navigate("/create-package");
  };


  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="modern-cart-page">
      {/* Hero Section */}
      <div className="cart-hero">
        <div className="container">
          <div className="cart-hero-content">
            <ShoppingBag size={48} className="cart-hero-icon" />
            <h1 className="cart-hero-title">Your Shopping Cart</h1>
            <p className="cart-hero-subtitle">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>
        </div>
      </div>

      {showPayment && currentOrder ? (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-header bg-white border-bottom-0 pb-0">
                  <button
                    className="btn btn-sm btn-link text-decoration-none text-muted"
                    onClick={() => setShowPayment(false)}
                  >
                    ← Back to Cart
                  </button>
                </div>
                <div className="card-body">
                  <h3 className="text-center mb-4">Complete Payment</h3>
                  <HDFCPayment
                    orderId={currentOrder._id}
                    amount={currentOrder.totalPrice}
                    onSuccess={() => {
                      console.log("Payment successful");
                      // Clear cart
                      setCartItems([]);
                      localStorage.removeItem("cart");
                      window.dispatchEvent(new Event("storage"));
                    }}
                    onFailure={(err) => alert(`Payment Failed: ${err}`)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container cart-container">
          {cartItems.length === 0 ? (
            /* Empty Cart State */
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <ShoppingBag size={80} />
              </div>
              <h2>Your cart is empty</h2>
              <p>Looks like you haven't added any tests yet.</p>
              <div className="empty-cart-actions">
                <button
                  className="btn-primary-gradient"
                  onClick={handleContinueShopping}
                >
                  <ShoppingBag size={20} />
                  Create Custom Package
                </button>
                <button className="btn-secondary-outline" onClick={() => navigate("/")}>
                  <Home size={20} />
                  Browse Tests
                </button>
              </div>
            </div>
          ) : (
            /* Cart with Items */
            <div className="cart-layout">
              {/* Cart Items Section */}
              <div className="cart-items-section">
                <div className="cart-items-header">
                  <h2>Cart Items ({cartItems.length})</h2>
                  <button
                    className="clear-cart-btn"
                    onClick={() => {
                      setCartItems([]);
                      localStorage.setItem("cart", JSON.stringify([]));
                      window.dispatchEvent(new Event("storage"));
                    }}
                  >
                    <Trash2 size={16} />
                    Clear All
                  </button>
                </div>

                <div className="cart-items-list">
                  {cartItems.map((item, index) => (
                    <div key={`${item._id || 'item'}-${index}`} className="cart-item-card">
                      <div className="cart-item-content">
                        <div className="cart-item-info">
                          <h3 className="cart-item-name">{item.name}</h3>
                          <p className="cart-item-category">{item.category}</p>
                          {item.description && (
                            <p className="cart-item-description">
                              {item.description.substring(0, 100)}
                              {item.description.length > 100 ? "..." : ""}
                            </p>
                          )}

                          <div className="cart-item-features">
                            {item.homeSampleCollection && (
                              <span className="feature-tag">
                                <CheckCircle size={14} />
                                Home Collection
                              </span>
                            )}
                            {item.reportsIn && (
                              <span className="feature-tag">
                                <CheckCircle size={14} />
                                Reports in {item.reportsIn}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="cart-item-pricing">
                          <div className="cart-item-price">
                            <span className="current-price">₹{item.price}</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="original-price">
                                ₹{item.originalPrice}
                              </span>
                            )}
                          </div>
                          {item.discountPercentage > 0 && (
                            <span className="discount-tag">
                              {item.discountPercentage}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(item._id)}
                        title="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping Button */}
                <button
                  className="continue-shopping-btn"
                  onClick={handleContinueShopping}
                >
                  <ArrowRight size={20} />
                  Add More Tests
                </button>
              </div>

              {/* Order Summary Section */}
              <div className="order-summary-section">
                <div className="order-summary-card">
                  <h2 className="summary-title">Order Summary</h2>

                  <div className="summary-details">
                    <div className="summary-row">
                      <span>Subtotal ({cartItems.length} items)</span>
                      <span>₹{calculateOriginalTotal()}</span>
                    </div>

                    {calculateSavings() > 0 && (
                      <div className="summary-row savings">
                        <span>Package Savings</span>
                        <span>-₹{calculateSavings()}</span>
                      </div>
                    )}

                    <div className="summary-row">
                      <span>Home Collection</span>
                      <span className="free-tag">FREE</span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>₹{calculateSubtotal()}</span>
                    </div>

                    {calculateSavings() > 0 && (
                      <div className="savings-badge">
                        You're saving ₹{calculateSavings()}!
                      </div>
                    )}
                  </div>

                  <button className="checkout-btn" onClick={handleCheckout}>
                    <ShoppingBag size={20} />
                    Proceed to Checkout
                    <ArrowRight size={20} />
                  </button>

                  {/* Benefits List */}
                  <div className="checkout-benefits">
                    <h4>What you get:</h4>
                    <ul>
                      <li>
                        <CheckCircle size={16} />
                        Free home sample collection
                      </li>
                      <li>
                        <CheckCircle size={16} />
                        Quick report delivery
                      </li>
                      <li>
                        <CheckCircle size={16} />
                        Expert consultation included
                      </li>
                      <li>
                        <CheckCircle size={16} />
                        100% safe & secure payment
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="trust-badges">
                  <div className="trust-badge">
                    <CheckCircle size={20} />
                    <span>NABL Certified</span>
                  </div>
                  <div className="trust-badge">
                    <CheckCircle size={20} />
                    <span>Secure Payment</span>
                  </div>
                  <div className="trust-badge">
                    <CheckCircle size={20} />
                    <span>Expert Support</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
