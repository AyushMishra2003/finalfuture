import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import LoginSidebar from "./LoginSidebar";
import { baseUrl } from "../utils/config";
import "./Header.css";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check login status and fetch user details
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("userToken") || localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
        // Try to get name from local storage first
        const storedName = localStorage.getItem("userName");
        if (storedName) {
          setUserName(storedName);
        }

        // Always try to fetch fresh data to ensure valid token and get updates
        try {
          const response = await fetch(`${baseUrl}/api/v1/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if (data.success && data.data) {
            setUserName(data.data.name || "User");
            localStorage.setItem("userName", data.data.name || "User");
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error);
        }

      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  // Cart count effect
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const newCount = cart.length;

      // Trigger pulse animation when cart count increases
      if (newCount > cartCount) {
        setCartPulse(true);
        setTimeout(() => setCartPulse(false), 600);
      }

      setCartCount(newCount);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, [cartCount]);

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buttonHoverStyle = {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  };

  const addRippleEffect = (e) => {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <>
      <style>{`
        @keyframes cartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cart-pulse {
          animation: cartPulse 0.6s ease-in-out;
        }

        .header-scrolled {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.3s ease;
        }

        .ripple-effect {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          pointer-events: none;
          animation: ripple 0.6s ease-out;
        }

        @keyframes ripple {
          from {
            transform: scale(0);
            opacity: 1;
          }
          to {
            transform: scale(2);
            opacity: 0;
          }
        }

        .logo-bounce:hover {
          animation: logoBounce 0.5s ease;
        }

        @keyframes logoBounce {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-10px); }
          50% { transform: translateY(-5px); }
          75% { transform: translateY(-7px); }
        }

        .interactive-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .interactive-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .interactive-button:active {
          transform: translateY(0) scale(0.98);
        }

        .cart-button-wrapper {
          position: relative;
          display: inline-block;
        }

        .cart-button-wrapper:hover .cart-badge {
          transform: scale(1.1) rotate(5deg);
        }

        .header-fade-in {
          animation: fadeInDown 0.5s ease-out;
        }
      `}</style>

      {/* Desktop Header */}
      <header className={`d-none d-md-block header-fade-in ${isScrolled ? 'header-scrolled' : ''}`} style={{ padding: '10px 20px', backgroundColor: '#77d8ce' }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between flex-nowrap w-100">
            {/* Logo Section */}
            <div className="d-flex align-items-center flex-shrink-0">
              <Link to="/" className="logo-bounce d-inline-block">
                {/* Using flex display for favicon and logo alignment */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="/images/logo/favicon.jpg"
                    alt="Favicon"
                    className="favicon"
                    style={{
                      maxHeight: "30px",
                      width: "auto",
                      marginRight: "10px",
                      transition: "transform 0.3s ease"
                    }}
                  />
                  <img
                    src="/images/logo/WhatsApp Image 2025-08-19 at 17.38.25_ee7be669.jpg"
                    alt="FutureLabs"
                    className="logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/logo/favicon.jpg";
                    }}
                    style={{
                      height: "40px",
                      width: "auto",
                      transition: "transform 0.3s ease"
                    }}
                  />
                </div>
              </Link>
            </div>


            {/* Home + Search + Contact Us */}
            <div className="d-flex align-items-center justify-content-center gap-3 flex-grow-1 px-xl-5" style={{ maxWidth: "800px", margin: "0 auto" }}>
              {/* Search Component */}
              <div className="flex-grow-1 w-100">
                <SearchComponent />
              </div>

              {/* Home Button */}
              <Link
                to="/"
                className="btn btn-dark interactive-button d-none d-lg-inline-flex align-items-center justify-content-center text-nowrap rounded-pill flex-shrink-0"
                style={{...buttonHoverStyle, fontWeight: 600, height: '38px', padding: '0 24px'}}
                onClick={addRippleEffect}
              >
                Home
              </Link>

              {/* Contact Us Button */}
              <Link
                to="/contact"
                className="btn btn-dark interactive-button d-none d-lg-inline-flex align-items-center justify-content-center text-nowrap rounded-pill flex-shrink-0"
                style={{...buttonHoverStyle, fontWeight: 600, height: '38px', padding: '0 24px'}}
                onClick={addRippleEffect}
              >
                Contact Us
              </Link>
            </div>

            {/* Cart + Login */}
            <div className="d-flex align-items-center gap-3 flex-shrink-0">
              {/* Cart button */}
              <Link
                to="/cart"
                className={`cart cart-button ${cartPulse ? 'cart-pulse' : ''}`}
                id="cart-button-desktop"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "38px",
                  width: "38px",
                  padding: 0,
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(-5deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/icon-svg/cart.svg`}
                  className="offers"
                  alt="Cart"
                />
                {cartCount > 0 && (
                  <span
                    className="cart-badge"
                    id="cart-badge-desktop"
                    style={{ transition: 'transform 0.3s ease' }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Login/Profile button */}
              {isLoggedIn ? (
                <div className="dropdown">
                  <button
                    className="login-button text-center d-none d-md-inline-flex align-items-center justify-content-center dropdown-toggle border-0"
                    id="profile-button-desktop"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                      color: 'white',
                      padding: 0,
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icon-svg/login.svg`}
                      className="login-icon"
                      alt="Profile"
                      style={{
                        width: '24px',
                        height: '24px',
                        filter: 'brightness(0) invert(1)'
                      }}
                    />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profile-button-desktop">
                    <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                    <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                  </ul>
                </div>
              ) : (
                <button
                  className="d-none d-md-inline-flex align-items-center justify-content-center border-0"
                  id="login-button-desktop"
                  style={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    padding: 0,
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(76, 175, 80, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                  }}
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label="Login"
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/icon-svg/login.svg`}
                    style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}
                    alt="Login"
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header — single top bar: logo left, cart+login right */}
      <div
        className="d-block d-md-none header-fade-in"
        style={{
          background: '#fff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 12px',
            minHeight: '58px',
          }}
        >
          {/* Logo — left side */}
          <Link to="/" className="logo-bounce d-inline-flex align-items-center" style={{ textDecoration: 'none' }}>
            <img
              src={`${process.env.PUBLIC_URL}/images/logo/favicon.jpg`}
              alt="Favicon"
              style={{ height: '26px', width: 'auto', marginRight: '7px' }}
            />
            <img
              src={`${process.env.PUBLIC_URL}/images/logo/WhatsApp Image 2025-08-19 at 17.38.25_ee7be669.jpg`}
              alt="FutureLabs"
              onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/images/logo/favicon.jpg`; }}
              style={{ height: '46px', width: 'auto' }}
            />
          </Link>

          {/* Right side — cart + login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Cart */}
            <div className="cart-button-wrapper">
              <Link
                to="/cart"
                className={`cart cart-button ${cartPulse ? 'cart-pulse' : ''}`}
                id="cart-button-mobile"
                style={{ display: 'inline-flex', transition: 'transform 0.3s ease' }}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/icon-svg/cart.svg`}
                  className="offers"
                  alt="Cart"
                />
                {cartCount > 0 && (
                  <span className="cart-badge" id="cart-badge-mobile" style={{ transition: 'transform 0.3s ease' }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            {/* Login / Profile */}
            {isLoggedIn ? (
              <div className="dropdown d-inline-block">
                <button
                  className="login-button text-center position-relative overflow-hidden dropdown-toggle"
                  id="profile-button-mobile"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/icon-svg/login.svg`}
                    alt="Profile"
                    style={{ height: '18px', filter: 'brightness(0) invert(1)' }}
                  />
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profile-button-mobile">
                  <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                  <li><Link className="dropdown-item" to="/orders">My Orders</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <button
                id="login-button-mobile"
                className="border-0 d-flex align-items-center justify-content-center"
                style={{ 
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
                  borderRadius: '50%',
                  padding: '12px',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                  transition: 'transform 0.2s'
                }}
                onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
                onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Login"
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/icon-svg/login.svg`}
                  style={{ width: '24px', height: '24px', filter: 'brightness(0) invert(1)' }}
                  alt="Login"
                />
              </button>
            )}
          </div>
        </div>
      </div>


      {/* Mobile Search Container - Second Navbar */}
      <div className="search-container container-fluid d-block d-md-none">
        <SearchComponent isMobile={true} />
      </div>

      {/* Login Sidebar */}
      {!isLoggedIn && <LoginSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
    </>
  );
};

export default Header;
