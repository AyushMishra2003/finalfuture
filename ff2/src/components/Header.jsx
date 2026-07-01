import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchComponent from "./SearchComponent";
import LoginSidebar from "./LoginSidebar";
import { baseUrl } from "../utils/config";
import { getCartCount } from "../utils/cart";
import "./Header.css";

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Pages that have their own search bar — hide the header search bar there
  const location = useLocation();
  const hideHeaderSearch =
    location.pathname === "/create-package" ||
    location.pathname === "/completehealth";

  // Navigation links for the hamburger drawer
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Health Checkups", to: "/checkups" },
    { label: "Create Package", to: "/create-package" },
    { label: "Special Offers", to: "/offers" },
    { label: "Contact Us", to: "/contact" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms & Conditions", to: "/terms-and-conditions" },
  ];

  // Close the drawer whenever the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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
    // Allow other pages (e.g. cart checkout) to open the login panel
    const openLogin = () => setIsSidebarOpen(true);
    window.addEventListener("open-login", openLogin);
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("open-login", openLogin);
    };
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
      const newCount = getCartCount();

      // Trigger pulse animation when cart count increases
      if (newCount > cartCount) {
        setCartPulse(true);
        setTimeout(() => setCartPulse(false), 600);
      }

      setCartCount(newCount);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
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

        /* New brand wordmark logo — own class so legacy ".logo" rules don't distort it */
        .brand-logo {
          height: 38px;
          width: auto;
          max-width: 230px;
          object-fit: contain;
          display: block;
          transition: transform 0.3s ease;
        }
        @media (max-width: 768px) {
          .brand-logo {
            height: 30px;
            max-width: 150px;
          }
        }
        @media (max-width: 380px) {
          .brand-logo {
            height: 26px;
            max-width: 130px;
          }
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
              <button
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                className="d-md-inline-flex d-lg-none align-items-center justify-content-center border-0 me-2"
                style={{ background: 'transparent', cursor: 'pointer', padding: '6px' }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
              </button>
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
                    src="/images/logo/futurelabs24-logo.png"
                    alt="Future Labs 24.com"
                    className="brand-logo"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/logo/favicon.jpg";
                    }}
                  />
                </div>
              </Link>
            </div>


            {/* Home + Search + Contact Us */}
            <div className="d-flex align-items-center justify-content-center gap-3 flex-grow-1 px-xl-5" style={{ maxWidth: "800px", margin: "0 auto" }}>
              {/* Search Component */}
              {!hideHeaderSearch && (
                <div className="flex-grow-1 w-100">
                  <SearchComponent />
                </div>
              )}

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
          {/* Hamburger + Logo — left side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
              style={{ border: 'none', background: 'transparent', padding: '4px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2.2" strokeLinecap="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
            </button>
            <Link to="/" className="logo-bounce d-inline-flex align-items-center" style={{ textDecoration: 'none' }}>
              <img
                src={`${process.env.PUBLIC_URL}/images/logo/futurelabs24-logo.png`}
                alt="Future Labs 24.com"
                className="brand-logo"
                onError={(e) => { e.target.onerror = null; e.target.src = `${process.env.PUBLIC_URL}/images/logo/favicon.jpg`; }}
              />
            </Link>
          </div>

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
      {!hideHeaderSearch && (
        <div className="search-container container-fluid d-block d-md-none">
          <SearchComponent isMobile={true} />
        </div>
      )}

      {/* Navigation Drawer (hamburger) */}
      <div
        onClick={() => setIsMenuOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 2000,
          opacity: isMenuOpen ? 1 : 0,
          visibility: isMenuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
        }}
      />
      <nav
        aria-label="Main menu"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '82%',
          maxWidth: '320px',
          background: '#fff',
          zIndex: 2001,
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drawer header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', background: 'linear-gradient(135deg, #00A2AD 0%, #077a6e 100%)' }}>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
            Future<span style={{ color: '#ffd24a' }}>Labs</span><small style={{ fontSize: '0.7rem', verticalAlign: 'super' }}>24</small>
          </span>
          <button
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
            style={{ border: 'none', background: 'rgba(255,255,255,0.2)', color: '#fff', width: '34px', height: '34px', borderRadius: '50%', fontSize: '1.3rem', lineHeight: 1, cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        {/* Drawer links */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              style={{ display: 'block', padding: '14px 22px', color: '#0f172a', textDecoration: 'none', fontSize: '1.02rem', fontWeight: 600, borderBottom: '1px solid #f1f5f9' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Drawer footer action */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9' }}>
          {isLoggedIn ? (
            <button
              onClick={() => { setIsMenuOpen(false); handleLogout(); }}
              style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: '#fee2e2', color: '#dc2626', fontWeight: 700, cursor: 'pointer' }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => { setIsMenuOpen(false); setIsSidebarOpen(true); }}
              style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* Login Sidebar */}
      {!isLoggedIn && <LoginSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />}
    </>
  );
};

export default Header;
