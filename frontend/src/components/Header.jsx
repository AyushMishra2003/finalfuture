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
      <header className={`d-none d-md-block header-fade-in ${isScrolled ? 'header-scrolled' : ''}`}>
        <div className="container-fluid bg-light">
          <div className="row align-items-center">
            {/* Logo Section */}
            <div className="col-lg-2 col-md-3 col-sm-12 col-12 d-flex align-items-center py-lg-3 py-md-2">
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
                      maxHeight: "70px",
                      width: "auto",
                      transition: "transform 0.3s ease"
                    }}
                  />
                </div>
              </Link>
            </div>


            {/* Home + Search + Contact Us */}
            <div className="col-lg-6 col-md-5 col-sm-12 col-12 py-lg-3 py-md-2 d-flex align-items-center justify-content-center gap-3 mx-5">
              {/* Home Button */}
              <Link
                to="/"
                className="btn btn-outline-primary btn-sm interactive-button"
                style={buttonHoverStyle}
                onClick={addRippleEffect}
              >
                Home
              </Link>

              {/* Search Component */}
              <div className="flex-grow-1">
                <SearchComponent />
              </div>

              {/* Contact Us Button */}
              <Link
                to="/contact"
                className="btn btn-outline-primary btn-sm interactive-button"
                style={buttonHoverStyle}
                onClick={addRippleEffect}
              >
                Contact Us
              </Link>
            </div>

            {/* Cart + Login */}
            <div className="col-lg-3 col-md-3 col-sm-12 col-12 py-lg-3 py-md-2 d-flex align-items-center justify-content-end gap-2">
              {/* Cart button */}
              <Link
                to="/cart"
                className={`cart cart-button ${cartPulse ? 'cart-pulse' : ''}`}
                id="cart-button-desktop"
                style={{
                  display: "inline-flex",
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
                    className="login-button text-center d-none d-md-inline-block position-relative overflow-hidden dropdown-toggle"
                    id="profile-button-desktop"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      cursor: 'pointer',
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      paddingLeft: '35px', /* Make room for the absolute positioned icon */
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
                        transition: 'transform 0.3s ease',
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
                  className="login-button text-center d-none d-md-inline-block position-relative  overflow-hidden"
                  id="login-button-desktop"
                  data-bs-toggle="collapse"
                  data-bs-target="#sidebar"
                  aria-expanded="false"
                  aria-controls="sidebar"
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                  }}
                  onClick={addRippleEffect}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    const icon = e.currentTarget.querySelector('.login-icon');
                    if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    const icon = e.currentTarget.querySelector('.login-icon');
                    if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(0.95)';
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
                  }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/icon-svg/login.svg`}
                    className="login-icon"
                    alt="Login"
                    style={{
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="logo-container d-block d-md-none header-fade-in">
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
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </div>
              </Link>
            </div>
            <div className="col-6 text-end p-2">
              <div className="cart-button-wrapper">
                <Link
                  to="/cart"
                  className={`cart cart-button ${cartPulse ? 'cart-pulse' : ''}`}
                  id="cart-button-mobile"
                  style={{
                    display: "inline-flex",
                    transition: 'transform 0.3s ease'
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
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
                      id="cart-badge-mobile"
                      style={{ transition: 'transform 0.3s ease' }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              {isLoggedIn ? (
                <div className="dropdown d-inline-block ms-2">
                  <button
                    className="login-button text-center d-md-none position-relative overflow-hidden dropdown-toggle"
                    id="profile-button-mobile"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{
                      transition: 'all 0.3s ease',
                      background: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px'
                    }}
                  >
                    <img
                      src={`${process.env.PUBLIC_URL}/images/icon-svg/login.svg`}
                      className="login-icon"
                      alt="Profile"
                      style={{
                        transition: 'transform 0.3s ease',
                        filter: 'brightness(0) invert(1)',
                        height: '20px'
                      }}
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
                  className="login-button text-center d-md-none position-relative  overflow-hidden"
                  id="login-button-mobile"
                  data-bs-toggle="collapse"
                  data-bs-target="#sidebar"
                  aria-expanded="false"
                  aria-controls="sidebar"
                  style={{
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    top: '-8px'
                  }}
                  onClick={addRippleEffect}
                  onTouchStart={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/images/icon-svg/login.svg`}
                    className="login-icon"
                    alt="Login"
                    style={{
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Container - Second Navbar */}
      <div className="search-container container-fluid d-block d-md-none">
        <SearchComponent isMobile={true} />
      </div>

      {/* Login Sidebar */}
      {!isLoggedIn && <LoginSidebar />}
    </>
  );
};

export default Header;







// <div className="logo-container d-block d-md-none bg-light">
//      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"></link>
//   <div className="container-fluid">
//     <div className="row p-1 align-items-center">
//       {/* Logo */}
//       <div className="col-6 p-0">
//         <Link to="/">
//           <img
//             src={`${process.env.PUBLIC_URL}/images/logo/ft-logo.svg`}
//             alt="FutureLabs"
//             className="logo"
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = `${process.env.PUBLIC_URL}/images/logo/favicon.jpg`;
//             }}
//             style={{ maxHeight: "60px", width: "auto" }}
//           />
//         </Link>
//       </div>

//       {/* Cart + Hamburger */}
//       <div className="col-6 text-end p-2">
//         {/* Cart */}
//         <Link
//           to="/cart"
//           className="cart cart-button me-2"
//           id="cart-button-mobile"
//           style={{ display: cartCount > 0 ? "inline-block" : "none" }}
//         >
//           <img
//             src={`${process.env.PUBLIC_URL}/images/icon-svg/cart.svg`}
//             className="offers"
//             alt="Cart"
//           />
//           <span className="cart-badge" id="cart-badge-mobile">
//             {cartCount}
//           </span>
//         </Link>

//         {/* Hamburger Menu Button */}
//         <button
//           className="btn btn-outline-secondary"
//           type="button"
//           data-bs-toggle="offcanvas"
//           data-bs-target="#mobileMenu"
//           aria-controls="mobileMenu"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//       </div>
//     </div>
//   </div>
// </div>

// {/* Mobile Search Bar Below Header */}
// <div className="search-container container-fluid d-block d-md-none">
//   <SearchComponent isMobile={true} />
// </div>

// {/* Offcanvas Mobile Menu */}
// <div
//   className="offcanvas offcanvas-end"
//   tabIndex="-1"
//   id="mobileMenu"
//   aria-labelledby="mobileMenuLabel"
// >
//   <div className="offcanvas-header">
//     <h5 className="offcanvas-title" id="mobileMenuLabel">Menu</h5>
//     <button
//       type="button"
//       className="btn-close text-reset"
//       data-bs-dismiss="offcanvas"
//       aria-label="Close"
//     ></button>
//   </div>
//   <div className="offcanvas-body">
//     <ul className="list-unstyled">
//       <li className="mb-3">
//         <Link to="/" className="btn btn-link w-100 text-start">
//           🏠 Home
//         </Link>
//       </li>
//       <li className="mb-3">
//         <Link to="/contact" className="btn btn-link w-100 text-start">
//           📞 Contact Us
//         </Link>
//       </li>
//       <li className="mb-3">
//         <button
//           className="btn btn-outline-primary w-100"
//           id="login-button-mobile"
//           data-bs-toggle="collapse"
//           data-bs-target="#sidebar"
//           aria-expanded="false"
//           aria-controls="sidebar"
//         >
//           <img
//             src={`${process.env.PUBLIC_URL}/images/icon-svg/login.svg`}
//             className="login-icon me-2"
//             alt="Login"
//             style={{ height: "20px" }}
//           />
//           Login
//         </button>
//       </li>
//     </ul>
//   </div>
// </div>

// <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>