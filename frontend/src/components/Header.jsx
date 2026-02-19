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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);


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
        /* Custom breakpoint for switching to Mobile Header below 1744px */
        @media (max-width: 1744px) {
          .desktop-view-custom { display: none !important; }
          .mobile-view-custom { display: block !important; }
        }
        @media (min-width: 1745px) {
          .desktop-view-custom { display: block !important; }
          .mobile-view-custom { display: none !important; }
        }

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

        /* Base Header Layout */
        .header-main-row {
          flex-wrap: nowrap !important;
        }

        .header-center-area {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          white-space: nowrap;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
        }

        /* Large Screens (>1600px) */
        @media (min-width: 1600px) {
          .header-side-col { width: 280px; }
          .header-main-row { padding: 0 40px; }
          .header-center-area { gap: 14px; }
        }

        /* Standard Desktop (1300px - 1599px) */
        @media (min-width: 1300px) and (max-width: 1599px) {
          .header-side-col { width: 240px; }
          .header-main-row { padding: 0 30px; }
          .header-center-area { gap: 12px; }
        }

        /* Medium Desktop (1200px - 1299px) */
        @media (min-width: 1200px) and (max-width: 1299px) {
          .header-side-col { width: 220px !important; }
          .header-main-row { padding: 0 25px; }
          .btn.interactive-button {
              font-size: 0.9rem;
              padding: 0.4rem 0.7rem;
          }
          .header-center-area { gap: 10px !important; }
          .header-center-area > div { max-width: 480px !important; }
          .login-button { padding: 8px 16px; font-size: 0.9rem; }
          .logo img.logo { max-height: 65px !important; }
        }

        /* Small Desktop (1024px - 1199px) */
        @media (min-width: 1024px) and (max-width: 1199px) {
          .header-side-col { width: 200px !important; }
          .header-main-row { padding: 0 20px; }
          .btn.interactive-button {
              font-size: 0.85rem;
              padding: 0.35rem 0.6rem;
          }
          .header-center-area { gap: 8px !important; }
          .header-center-area > div { max-width: 420px !important; }
          .login-button { padding: 7px 14px; font-size: 0.85rem; }
          .cart-button { padding: 10px; }
          .cart-button img { width: 22px; height: 22px; }
          .logo img.logo { max-height: 60px !important; }
          .logo img.favicon { max-height: 28px !important; }
        }

        /* Large Tablet / Small Laptop (900px - 1023px) */
        @media (min-width: 900px) and (max-width: 1023px) {
          .header-side-col { width: 180px !important; }
          .header-main-row { padding: 0 15px; }
          .header-center-area { padding: 0 8px !important; gap: 6px !important; }
          .header-center-area > div { max-width: 360px !important; min-width: 150px !important; }
          .btn.interactive-button {
              font-size: 0.8rem;
              padding: 0.3rem 0.5rem;
          }
          .login-button { 
            padding: 6px 12px; 
            font-size: 0.8rem; 
          }
          .login-icon { margin: 0 8px !important; }
          .cart-button { padding: 9px; }
          .cart-button img { width: 20px; height: 20px; }
          .logo img.logo { max-height: 55px !important; }
          .logo img.favicon { max-height: 27px !important; }
        }

        /* Tablet (768px - 899px) */
        @media (min-width: 768px) and (max-width: 899px) {
          .header-side-col { width: 160px !important; }
          .header-main-row { padding: 0 12px; }
          .header-center-area { padding: 0 6px !important; gap: 5px !important; }
          .header-center-area > div { max-width: 320px !important; min-width: 140px !important; }
          .btn.interactive-button {
              font-size: 0.75rem;
              padding: 0.28rem 0.45rem;
              white-space: nowrap;
          }
          .login-button { 
            padding: 6px 10px; 
            font-size: 0.75rem;
            white-space: nowrap;
          }
          .login-icon { 
            margin: 0 6px !important; 
            width: 16px !important;
            height: 16px !important;
          }
          .cart-button { padding: 8px; }
          .cart-button img { width: 18px; height: 18px; }
          .cart-badge { 
            font-size: 0.65rem; 
            min-width: 18px; 
            height: 18px; 
          }
          .logo img.logo { max-height: 50px !important; }
          .logo img.favicon { max-height: 25px !important; }
          .dropdown-toggle::after { font-size: 0.7rem; }
          .dropdown-menu { font-size: 0.85rem; }
        }
      `}</style>

      {/* Desktop Header */}
      <header className={`desktop-view-custom header-fade-in ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container-fluid bg-light px-2 px-xl-4">
          <div className="d-flex align-items-center justify-content-between py-2 header-main-row" style={{ minHeight: '80px' }}>

            {/* Logo Section - Left (Fixed Width) */}
            <div className="d-flex align-items-center header-side-col" style={{ flexShrink: 0 }}>
              <Link to="/" className="logo-bounce d-inline-block">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="/images/logo/favicon.jpg"
                    alt="Favicon"
                    className="favicon"
                    style={{ maxHeight: "30px", width: "auto", marginRight: "10px" }}
                  />
                  <img
                    src="/images/logo/WhatsApp Image 2025-08-19 at 17.38.25_ee7be669.jpg"
                    alt="FutureLabs"
                    className="logo"
                    style={{ maxHeight: "70px", width: "auto" }}
                  />
                </div>
              </Link>
            </div>


            {/* Center Section - Nav & Search (Flexible & Centered) */}
            <div className="header-center-area">
              <Link
                to="/"
                className="btn btn-outline-primary btn-sm interactive-button text-nowrap btn-sm-responsive"
                style={buttonHoverStyle}
                onClick={addRippleEffect}
              >
                Home
              </Link>

              <div className="flex-grow-1 d-flex justify-content-center">
                <div className="w-100">
                  <SearchComponent />
                </div>
              </div>

              <Link
                to="/contact"
                className="btn btn-outline-primary btn-sm interactive-button text-nowrap btn-sm-responsive"
                style={buttonHoverStyle}
                onClick={addRippleEffect}
              >
                Contact Us
              </Link>
            </div>

            {/* Right Section - Cart & Login (Fixed Width - Right Aligned) */}
            <div className="header-side-col header-actions">
              {/* Cart button */}
              <Link
                to="/cart"
                className={`cart cart-button ${cartPulse ? 'cart-pulse' : ''}`}
                id="cart-button-desktop"
                style={{ display: "inline-flex", transition: 'transform 0.3s ease' }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/icon-svg/cart.svg`}
                  className="offers"
                  alt="Cart"
                />
                {cartCount > 0 && (
                  <span className="cart-badge" id="cart-badge-desktop">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Login/Profile button */}
              {isLoggedIn ? (
                <div className="dropdown ms-3">
                  <button
                    className="login-button text-center d-none d-md-inline-block position-relative overflow-hidden dropdown-toggle"
                    id="profile-button-desktop"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      cursor: 'pointer',
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      paddingLeft: '35px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icon-svg/login.svg`}
                      className="login-icon"
                      alt="Profile"
                      style={{
                        filter: 'brightness(0) invert(1)',
                        position: 'absolute',
                        left: '10px'
                      }}
                    />
                    {userName}
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
                  className="login-button text-center d-none d-md-inline-block position-relative overflow-hidden ms-3"
                  onClick={(e) => { addRippleEffect(e); setShowLogin(true); }}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/icon-svg/login.svg`}
                    className="login-icon mx-4"
                    alt="Login"
                  />
                  Login
                </button>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="logo-container mobile-view-custom header-fade-in">
        <div className="container-fluid">
          <div className="row p-1">
            <div className="col-6 p-0">
              <Link to="/" className="logo-bounce d-inline-block">
                {/* Using flex display for favicon and logo alignment in mobile view */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src={`${process.env.PUBLIC_URL}/images/logo/favicon.jpg`}
                    alt="Favicon"
                    className="favicon"
                    style={{
                      maxHeight: "25px",
                      width: "auto",
                      marginRight: "8px",
                      marginTop: "12px",
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <img
                    src={`${process.env.PUBLIC_URL}/images/logo/WhatsApp Image 2025-08-19 at 17.38.25_ee7be669.jpg`}
                    alt="FutureLabs"
                    className="logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${process.env.PUBLIC_URL}/images/logo/favicon.jpg`;
                    }}
                    style={{
                      maxHeight: "60px",
                      width: "auto",
                      marginTop: "6px",
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>
              </Link>
            </div>
            <div className="col-6 text-end p-2 d-flex justify-content-end align-items-center gap-2">

              {/* Cart */}
              <Link
                to="/cart"
                className={`cart cart-button ${cartPulse ? 'cart-pulse' : ''}`}
                style={{ display: "inline-flex" }}
              >
                <img src="/images/icon-svg/cart.svg" className="offers" alt="Cart" />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>

              {/* Hamburger Button */}
              <button
                className={`hamburger ${mobileMenuOpen ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(true)}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

            </div>

          </div>
        </div>
      </div>
      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-overlay ${mobileMenuOpen ? "show" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      ></div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}>

        {/* User Greeting */}
        <div className="mobile-user-card">
          <img src="/images/icon-svg/login.svg" alt="User" />
          <div>
            <strong>{isLoggedIn ? userName : "Guest User"}</strong>
            <small>{isLoggedIn ? "Welcome back 👋" : "Login to continue"}</small>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mobile-menu">

          <Link to="/" onClick={() => setMobileMenuOpen(false)}>🏠 Home</Link>
          <Link to="/money-saving-packages" onClick={() => setMobileMenuOpen(false)}>🧪 Health Packages</Link>
          <Link to="/create-package" onClick={() => setMobileMenuOpen(false)}>🧬 Make Your Own Package</Link>
          <Link to="/offers" onClick={() => setMobileMenuOpen(false)}>🔥 Special Offers</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>📞 Contact</Link>

          <hr />

          {isLoggedIn ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>👤 My Profile</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>📦 My Orders</Link>
              <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
            </>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowLogin(true);
              }}
            >
              🔐 Login / Signup
            </button>
          )}

        </nav>
      </div>


      {/* Mobile Search Container - Second Navbar */}
      <div className="search-container container-fluid mobile-view-custom">
        <SearchComponent isMobile={true} />
      </div>

      {/* Login Sidebar */}
      <LoginSidebar
        isOpen={showLogin || !isLoggedIn && false} // Show only if explicitly triggered, relying on isOpen prop
        onClose={() => setShowLogin(false)}
      />
    </>
  );
};

export default Header;
