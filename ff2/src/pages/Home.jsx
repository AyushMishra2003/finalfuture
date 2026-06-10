import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, CheckCircle, AlertTriangle } from "lucide-react";
import apiService from "../utils/api";
import { USE_MOCK_DATA, getImagePath } from "../utils/config";
import { mockData } from "../utils/mockData";
import MakeYourOwnPackage from "../components/MakeYourOwnPackage";
import PromotionalCard from "../components/PromotionalCard";
import TestimonialsSlider from "../components/TestimonialsSlider";
import PincodeChecker from "./Pincode";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import PremiumCarousel from "../components/PremiumCarousel";

import MoneySavingPackages from "../components/MoneySavingPackage";
import PatientSelectionModal from "../components/PatientSelectionModal";
import AppointmentTimeModal from "../components/AppointmentTimeModal";
import LocationSelectionModal from "../components/LocationSelectionModal";

// Reusable SectionHeader Component
const SectionHeader = ({ title, subtitle, action }) => (
  <div className="text-center mb-4 section-header-row">
    <div className="section-header-text mb-3">
      <h2 className="section-title fw-bold mb-2" style={{ fontSize: '2.25rem', letterSpacing: '-0.02em', color: '#115e59' }}>
        {title}
      </h2>
      {subtitle && (
        <p className="section-subtitle text-muted mb-0 fw-medium mx-auto" style={{ fontSize: '1rem', lineHeight: '1.5', maxWidth: '600px' }}>
          {subtitle}
        </p>
      )}
    </div>
    {action && (
      <div className="section-action d-flex justify-content-center">
        {action}
      </div>
    )}
  </div>
);

const Home = () => {
  // Helper function to get correct image URL
  const getImageUrl = (imagePath) => {
    // Handle cases where imagePath might be undefined or null
    if (!imagePath) return `${process.env.PUBLIC_URL}/images/placeholder.png`;

    // Use the getImagePath function from config
    return getImagePath(imagePath);
  };

  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [womenAge, setWomenAge] = useState([]);
  const [womenCare, setWomenCare] = useState([]);
  const [menAge, setMenAge] = useState([]);
  const [menCare, setMenCare] = useState([]);
  const [lifestyle, setLifestyle] = useState([]);
  const [specialCare, setSpecialCare] = useState([]);
  const [singleTest, setSingleTest] = useState([]);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pin code and service availability states
  const [pinCode, setPinCode] = useState("");
  const [serviceAvailable, setServiceAvailable] = useState(null);
  const [checkingService, setCheckingService] = useState(false);

  // Cart state (in real app, this would be in a global state management)
  const [cartItems, setCartItems] = useState([]);
  const [showCartNotification, setShowCartNotification] = useState(false);

  // Animation state
  const [animationClass, setAnimationClass] = useState("");
  const [direction, setDirection] = useState("right"); // 'left' or 'right'


  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [savingCurrent, setSavingCurrent] = useState(0);


  // special offers carousel
  const packages = mockData.specialOffers || [];

  // Patient selection modal state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState(null);
  const [selectedPatientsForBooking, setSelectedPatientsForBooking] = useState([]);
  const [appointmentDetailsForBooking, setAppointmentDetailsForBooking] = useState(null);

  // DetailCard Component
  const DetailCard = ({ pkg, onClose }) => {
    if (!pkg) return null;
    const infoItems = [
      { label: "Reports", value: pkg.details.reportTime, color: "#0ea5e9", icon: <path d="M12 8v4l3 3M12 2a10 10 0 100 20 10 10 0 000-20z" /> },
      { label: "Sample", value: pkg.details.sampleType, color: "#ef4444", icon: <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" /> },
      { label: "Preparation", value: pkg.details.preparation, color: "#f59e0b", icon: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></> },
      { label: "Certification", value: pkg.details.certification, color: "#10b981", icon: <path d="M9 12l2 2 4-4M12 2a10 10 0 100 20 10 10 0 000-20z" /> },
    ];
    return (
      <div style={{ background: "#fff", borderRadius: "22px", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.25)", maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "22px 24px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#00A2AD", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>
              Package Details
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0f172a", margin: 0, lineHeight: 1.3 }}>
              {pkg.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ flexShrink: 0, width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "#f1f5f9", color: "#64748b", fontSize: "1.4rem", lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto" }}>
          {/* Inclusions */}
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "12px" }}>
            Test Inclusions
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "22px" }}>
            {pkg.details.inclusions.map((item, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem", color: "#334155", fontWeight: 500 }}>
                <span style={{ flexShrink: 0, width: "20px", height: "20px", borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                </span>
                {item}
              </div>
            ))}
          </div>

          {/* Info grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            {infoItems.map((info, idx) => (
              <div key={idx} style={{ background: "#f8fafc", border: "1px solid #eef2f6", borderRadius: "14px", padding: "14px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={info.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "8px" }}>
                  {info.icon}
                </svg>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0f172a", marginBottom: "2px" }}>{info.label}</div>
                <div style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.4 }}>{info.value}</div>
              </div>
            ))}
          </div>

          {/* Home Collection Banner */}
            <div style={{
              background: "linear-gradient(135deg, #007A5E 0%, #00b386 100%)",
              borderRadius: "14px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              boxShadow: "0 4px 16px rgba(0,122,94,0.25)",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Decorative circle blur */}
              <div style={{
                position: "absolute", right: "-20px", top: "-20px",
                width: "80px", height: "80px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                pointerEvents: "none",
              }} />
              {/* Icon box */}
              <div style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "10px",
                width: "40px", height: "40px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <i className="bi bi-house-door-fill" style={{ color: "#fff", fontSize: "1.2rem" }} />
              </div>
              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "2px" }}>
                  Home Collection
                </div>
                <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700 }}>
                  {pkg.details.homeCollection}
                </div>
              </div>
              {/* Live pulse badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: "#90ffda",
                  display: "inline-block",
                  boxShadow: "0 0 0 3px rgba(144,255,218,0.3)",
                  animation: "homePulse 1.5s ease-in-out infinite",
                }} />
                <span style={{ color: "#90ffda", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.5px" }}>Available</span>
              </div>
              <style>{`
                @keyframes homePulse {
                  0%, 100% { box-shadow: 0 0 0 3px rgba(144,255,218,0.3); }
                  50% { box-shadow: 0 0 0 6px rgba(144,255,218,0.1); }
                }
              `}</style>
            </div>
          </div>
          {/* Footer */}
          <div style={{ padding: "16px 24px 20px", borderTop: "1px solid #f1f5f9" }}>
            <button
              onClick={() => handleAddToCart(pkg.id)}
              style={{ width: "100%", background: "linear-gradient(135deg, #007A5E 0%, #00b386 100%)", color: "#fff", border: "none", borderRadius: "50px", padding: "15px", fontSize: "1.05rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 18px rgba(0,122,94,0.3)" }}
            >
              Book This Package
            </button>
          </div>
        </div>
    );
  };

  const handleViewDetails = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetails(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (USE_MOCK_DATA) {
          console.log("Using mock data (development mode)");
          setCategories(mockData.categories || []);
          setAds(mockData.ads || []);
          setWomenAge(mockData.womenCare || []);
          setWomenCare(mockData.womenCare || []);
          setMenAge(mockData.menCare || []);
          setMenCare(mockData.menCare || []);
          setLifestyle(mockData.lifestyle || []);
          setSpecialCare(mockData.specialCare || []);
          setSingleTest(mockData.singleTest || []);
          setLoading(false);
          return;
        }

        console.log("Starting to fetch data from backend API");

        // Fetch all data from backend API using the apiService
        const [
          lessPriceData,
          adsData,
          womenAgeData,
          womenCareData,
          menAgeData,
          menCareData,
          lifeStyleData,
          specialPackageData,
          singleTestData,
        ] = await Promise.all([
          apiService.getSelectedLessPrice(),
          apiService.getBottomBanners(),
          apiService.getSelectedWomenAge(),
          apiService.getSelectedWomenCare(),
          apiService.getSelectedMenAge(),
          apiService.getSelectedMenCare(),
          apiService.getSelectedLifestyle(),
          apiService.getSelectedSpecialCare(),
          apiService.getSelectedSingleTest(),
        ]);

        console.log("API responses received:", {
          lessPrice: lessPriceData?.data?.length || 0,
          adsData: adsData?.data?.length || 0,
        });

        setCategories(lessPriceData?.data?.length > 0 ? lessPriceData.data : mockData.categories || []);
        setAds(adsData?.data?.length > 0 ? adsData.data : mockData.ads || []);
        setWomenAge(womenAgeData?.data?.length > 0 ? womenAgeData.data : mockData.womenCare || []);
        setWomenCare(womenCareData?.data?.length > 0 ? womenCareData.data : mockData.womenCare || []);
        setMenAge(menAgeData?.data?.length > 0 ? menAgeData.data : mockData.menCare || []);
        setMenCare(menCareData?.data?.length > 0 ? menCareData.data : mockData.menCare || []);
        setLifestyle(lifeStyleData?.data?.length > 0 ? lifeStyleData.data : mockData.lifestyle || []);
        setSpecialCare(specialPackageData?.data?.length > 0 ? specialPackageData.data : mockData.specialCare || []);
        setSingleTest(singleTestData?.data?.length > 0 ? singleTestData.data : mockData.singleTest || []);

        console.log("Data set successfully");
      } catch (error) {
        console.error("Error fetching data:", error);
        // We don't set the global error state here because we are falling back to mock data
        // setError("Failed to load data. Please try again later.");

        // Fallback to mock data on error
        console.log("Falling back to mock data");
        setCategories(mockData.categories || []);
        setAds(mockData.ads || []);
        setWomenAge(mockData.womenCare || []);
        setWomenCare(mockData.womenCare || []);
        setMenAge(mockData.menCare || []);
        setMenCare(mockData.menCare || []);
        setLifestyle(mockData.lifestyle || []);
        setSpecialCare(mockData.specialCare || []);
        setSingleTest(mockData.singleTest || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePinCodeCheck = async (e) => {
    e.preventDefault();
    if (!pinCode || pinCode.length !== 6) {
      alert("Please enter a valid 6-digit pin code");
      return;
    }

    setCheckingService(true);
    setServiceAvailable(null);

    try {
      // Use the API service to check pincode
      const response = await apiService.checkPincode(pinCode);
      setServiceAvailable(response.available);
    } catch (error) {
      console.error("Error checking service availability:", error);
      setError("Failed to check service availability. Please try again.");
    } finally {
      setCheckingService(false);
    }
  };

  const handleAddToCart = async (testId) => {
    let userId = localStorage.getItem("userId");

    // Clear legacy mock data if present
    if (userId && userId.toString().startsWith('mock-')) {
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
      userId = null;
    }

    if (!userId) {
      alert("Please login to add items to cart");
      // Trigger the login sidebar
      const sidebar = document.getElementById("sidebar");
      if (sidebar) {
        sidebar.classList.add("show");
      }
      return;
    }

    try {
      // Add item to cart using API
      const response = await apiService.addToCart(userId, testId);

      if (response.success) {
        alert("Item added to cart successfully!");
      } else {
        setError(response.error || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Error adding item to cart. Please try again.");
    }
  };
  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += 4) {
    chunkedCategories.push(categories.slice(i, i + 4));
  }

  const nextSavingSlide = () => {
    if (savingCurrent < chunkedCategories.length - 1) {
      setSavingCurrent((prev) => prev + 1);
    }
  };

  const prevSavingSlide = () => {
    if (savingCurrent > 0) {
      setSavingCurrent((prev) => prev - 1);
    }
  };

  const chunkedAds = [];
  for (let i = 0; i < ads.length; i += 4) {
    chunkedAds.push(ads.slice(i, i + 4));
  }


  const handleKnowMore = () => {
    navigate("/checkups");
  };

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <div
          className="spinner-border text-primary mb-3"
          role="status"
          style={{ width: "3rem", height: "3rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="text-center mb-2">Loading Health Services...</h4>
        <p className="text-muted text-center">
          Please wait while we fetch the latest information
        </p>
        <div className="mt-3">
          <small className="text-muted">
            If this takes too long, the backend server might not be running.
          </small>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light">
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <AlertTriangle className="me-2" />
          <div>
            <h4 className="alert-heading">Unable to Load Data</h4>
            <p className="mb-0">{error}</p>
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-muted">This usually happens when:</p>
          <ul className="text-muted text-start">
            <li>The backend server is not running</li>
            <li>There's a network connectivity issue</li>
            <li>MongoDB is not accessible</li>
          </ul>
        </div>
        <div className="mt-3">
          <button
            className="btn btn-primary me-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              // Enable mock data and reload
              alert(
                "Switching to mock data mode. Please check the documentation for how to start the backend server."
              );
            }}
          >
            Use Mock Data
          </button>
        </div>
        <div className="mt-3">
          <small className="text-muted">
            Check the browser console for detailed error information.
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page" style={{ minHeight: "100vh" }}>
      {/* Cart Notification */}
      {showCartNotification && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1050, marginTop: "80px" }}
        >
          <div className="toast show" role="alert">
            <div className="toast-header bg-success text-white">
              <CheckCircle size={20} className="me-2" />
              <strong className="me-auto">Success!</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowCartNotification(false)}
              ></button>
            </div>
            <div className="toast-body">Item added to cart</div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section mb-4 position-relative">
        <div className="container-fluid p-0">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{ clickable: true }}
            className="hero-swiper"
          >
            {["banner1.png", "banner2.png", "banner3.png"].map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  className="d-block w-100 img-fluid hero-image"
                  src={`${process.env.PUBLIC_URL}/images/banners/${image}`}
                  alt={`Banner ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${process.env.PUBLIC_URL}/images/banners/banner1.png`;
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Custom styles */}
        <style>{`
        .hero-image {
          height: clamp(250px, 40vw, 500px);
          object-fit: cover;
          object-position: center;
          border-radius: 0;
          transition: all 0.4s ease-in-out;
        }

        .hero-swiper {
          padding-bottom: 0 !important;
        }
        .hero-swiper .swiper-pagination {
          bottom: 16px !important;
        }
        .hero-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background-color: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.9);
          opacity: 1;
          margin: 0 5px !important;
          transition: all 0.4s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
        .hero-swiper .swiper-pagination-bullet-active {
          background-color: #007A5E;
          width: 30px;
          border-radius: 10px;
          box-shadow: 0 1px 6px rgba(0,0,0,0.3);
        }

        /* Smaller size & rounded for mobile */
        @media (max-width: 768px) {
          .hero-image {
            height: 220px;
            border-radius: 15px;
            margin: 10px;
          }
        }
      `}</style>
      </section>




      {/* Pin Code Service Availability Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">

              <div className="card shadow-sm border-0">
                <div className="card-body p-3">
                  <form onSubmit={handlePinCodeCheck}>
                    <div className="row g-2 align-items-end">
                      <div className="col-md-8">
                        <label
                          htmlFor="pincode"
                          className="form-label fw-semibold"
                        >
                          Enter Your Pin Code
                        </label>
                        <input
                          type="text"
                          id="pincode"
                          name="pincode"
                          className="form-control"
                          placeholder="Enter 6-digit pin code"
                          value={pinCode}
                          onChange={(e) =>
                            setPinCode(
                              e.target.value.replace(/\D/g, "").slice(0, 6)
                            )
                          }
                          pattern="[0-9]{6}"
                          maxLength="6"
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <button
                          className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                          type="submit"
                          disabled={checkingService || pinCode.length !== 6}
                        >
                          {checkingService ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              ></span>
                              <span>Checking...</span>
                            </>
                          ) : (
                            <>
                              <Search size={20} />
                              <span>Check</span>
                            </>
                          )}
                        </button>

                      </div>
                    </div>
                  </form>

                  {/* Service Availability Result */}
                  {serviceAvailable !== null && (
                    <div className="mt-4">
                      <div
                        className={`alert ${serviceAvailable ? "alert-success" : "alert-warning"
                          } border-0 shadow-sm`}
                        role="alert"
                      >
                        <div className="d-flex align-items-start">
                          {serviceAvailable ? (
                            <CheckCircle
                              className="me-3 mt-1 text-success"
                              size={24}
                            />
                          ) : (
                            <AlertTriangle
                              className="me-3 mt-1 text-warning"
                              size={24}
                            />
                          )}
                          <div>
                            {serviceAvailable ? (
                              <>
                                <h5 className="alert-heading mb-2">
                                  Service Available! 🎉
                                </h5>
                                <p className="mb-0">
                                  Great news! We provide home sample collection
                                  and lab services in your area (PIN: {pinCode}
                                  ). Book your test now!
                                </p>
                              </>
                            ) : (
                              <>
                                <h5 className="alert-heading mb-2">
                                  Service Not Available
                                </h5>
                                <p className="mb-0">
                                  We don't provide services in PIN: {pinCode}{" "}
                                  yet. Please contact us at{" "}
                                  <strong>+91-9876543210</strong> for
                                  assistance.
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>










      {/* Scrolling Marquee Section */}
      <section className="py-2 bg-primary">
        <div className="overflow-hidden">
          <div className="marquee">
            <span className="text-white fw-semibold">
              🩺 Welcome to Future Lab Diagnostics | Your Health, Our Priority |
              Caring for You with Precision | Reliable Results You Can Trust |
              Compassionate Healthcare Services | Advanced Diagnostics for a
              Healthier Future | Experience Quality Care with Us | Committed to
              Your Well-being 🩺
            </span>
          </div>
        </div>
      </section>

      {/* Cards Section */}

      <MoneySavingPackages />

      {/* Healthcare Banner Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <div
            className="d-flex flex-column flex-md-row align-items-center justify-content-center bg-white shadow-lg p-3 p-md-4 mx-auto float-hover"
            style={{
              borderRadius: "24px",
              maxWidth: "700px",
              background: "linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)",
              border: "1px solid rgba(204, 251, 241, 0.5)"
            }}
          >
            {/* Left Side - Illustration */}
            <div className="me-md-4 mb-3 mb-md-0 text-center">
              <img
                src={`${process.env.PUBLIC_URL}/images/delivery-doctor.png`}
                alt="Home Visit Icon"
                style={{
                  width: "120px",
                  height: "auto",
                  filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))"
                }}
              />
            </div>

            {/* Right Side - Text Content */}
            <div className="text-center text-md-start">
              <span className="section-label">Limited Time Offer</span>
              <h4 className="fw-bold mb-2 text-gradient-premium" style={{ fontSize: "1.75rem" }}>
                Free Home Visit in Bengaluru
              </h4>
              <p className="mb-0 fw-medium" style={{ color: "#0f766e" }}>
                For all orders above ₹1000. Expert care at your doorstep.
              </p>
            </div>
          </div>
        </div>

        <style>{`
    /* Mobile Responsive Adjustments */
    @media (max-width: 768px) {
      section div.container > div {
        flex-direction: column !important;
        text-align: center !important;
      }

      section img {
        width: 90px !important;
      }

      section h4 {
        font-size: 1.25rem !important;
      }

      section h5 {
        font-size: 1.1rem !important;
      }
    }
  `}</style>
      </section>







      {/* Special Offers Section */}
      <section className="py-5 bg-light">
        <div className="container">

          <SectionHeader
            title="Special Offers Packages"
            subtitle="Premium health packages at unbeatable prices. Up to 75% OFF."
            action={
              <button
                className="btn-premium"
                onClick={() => navigate('/offers')}
              >
                VIEW ALL
              </button>
            }
          />


          {/* Premium Carousel */}
          <PremiumCarousel
            items={packages}
            onAddToCart={(item) => {
              const pkg = packages.find(p => p.id === item.id);
              if (pkg) {
                // Check if item already exists in cart
                const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
                const existingItemIndex = existingCart.findIndex(cartItem => cartItem._id === pkg.id);

                if (existingItemIndex !== -1) {
                  alert("This package is already in your cart!");
                  return;
                }

                // Open patient selection modal
                setSelectedPackageForBooking(pkg);
                setIsPatientModalOpen(true);
              }
            }}
            onViewDetails={(item) => {
              const pkg = packages.find(p => p.id === item.id);
              if (pkg) {
                setSelectedPackage(pkg);
                setShowDetails(true);
              }
            }}
          />

          {/* Details Modal */}
          {showDetails && selectedPackage && (
            <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center p-3" style={{ zIndex: 1050, background: "rgba(255, 255, 255, 0.7)", backdropFilter: "blur(1px)" }}>
              <div className="position-relative w-100" style={{ maxWidth: "450px" }}>
                <DetailCard pkg={selectedPackage} onClose={() => setShowDetails(false)} />
              </div>
            </div>
          )}

          {/* Patient Selection Modal */}
          <PatientSelectionModal
            isOpen={isPatientModalOpen}
            onClose={() => {
              setIsPatientModalOpen(false);
              setSelectedPackageForBooking(null);
            }}
            onNext={(selectedPatients) => {
              // Store selected patients and move to appointment time selection
              setSelectedPatientsForBooking(selectedPatients);
              setIsPatientModalOpen(false);
              setIsAppointmentModalOpen(true);
            }}
          />

          <AppointmentTimeModal
            isOpen={isAppointmentModalOpen}
            onClose={() => {
              setIsAppointmentModalOpen(false);
              setSelectedPackageForBooking(null);
              setSelectedPatientsForBooking([]);
              setAppointmentDetailsForBooking(null);
            }}
            onNext={(appointmentDetails) => {
              setAppointmentDetailsForBooking(appointmentDetails);
              setIsAppointmentModalOpen(false);
              setIsLocationModalOpen(true);
            }}
            selectedPatients={selectedPatientsForBooking}
          />

          <LocationSelectionModal
            isOpen={isLocationModalOpen}
            onClose={() => {
              setIsLocationModalOpen(false);
              setSelectedPackageForBooking(null);
              setSelectedPatientsForBooking([]);
              setAppointmentDetailsForBooking(null);
            }}
            onConfirm={(finalBookingDetails) => {
              if (!selectedPackageForBooking) return;

              const pkg = selectedPackageForBooking;
              const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

              // Add item for each selected patient with full booking details
              finalBookingDetails.patients.forEach(patient => {
                const cartItem = {
                  _id: pkg.id,
                  name: pkg.title,
                  price: parseInt(pkg.price.replace(/[₹,]/g, '')),
                  originalPrice: parseInt(pkg.oldPrice.replace(/[₹,]/g, '')),
                  discountPercentage: parseInt(pkg.discount.replace(/[%OFF ]/g, '')),
                  category: "Health Package",
                  description: `${pkg.tests} included with ${pkg.details.homeCollection}`,
                  homeSampleCollection: true,
                  reportsIn: pkg.details.reportTime,
                  patient: patient,
                  appointment: {
                    date: finalBookingDetails.date,
                    time: finalBookingDetails.time,
                    location: finalBookingDetails.location
                  }
                };
                existingCart.push(cartItem);
              });

              localStorage.setItem("cart", JSON.stringify(existingCart));
              window.dispatchEvent(new Event("storage"));

              // Show notification
              setShowCartNotification(true);
              setTimeout(() => setShowCartNotification(false), 3000);

              // Close all modals and reset
              setIsLocationModalOpen(false);
              setIsAppointmentModalOpen(false);
              setIsPatientModalOpen(false);
              setSelectedPackageForBooking(null);
              setSelectedPatientsForBooking([]);
              setAppointmentDetailsForBooking(null);
            }}
            selectedPatients={selectedPatientsForBooking}
            appointmentDetails={appointmentDetailsForBooking}
          />
        </div>
      </section>




      {/* Make Your Own Package Component */}
      < MakeYourOwnPackage />

      {/* Statistics Section */}
      {/* <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
              <h3 className="fw-bold text-primary">
                Book Lab Tests
                <br />
                <span className="text-dark">With Us</span>
              </h3>
            </div>
            <div className="col-lg-9">
              <div className="row g-4">
                <div className="col-md-3 col-sm-6">
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/icon-svg/ontime-report.svg"
                      alt="On-time report"
                      className="me-3"
                      style={{ width: "48px", height: "48px" }}
                    />
                    <div>
                      <h4 className="fw-bold text-primary mb-1">98%</h4>
                      <p className="small mb-0 text-muted">
                        On-time report
                        <br />
                        delivery
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/icon-svg/timely collection.svg"
                      alt="Timely collection"
                      className="me-3"
                      style={{ width: "48px", height: "48px" }}
                    />
                    <div>
                      <h4 className="fw-bold text-primary mb-1">97%</h4>
                      <p className="small mb-0 text-muted">
                        Timely sample
                        <br />
                        collections
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/icon-svg/review.svg"
                      alt="Customer reviews"
                      className="me-3"
                      style={{ width: "48px", height: "48px" }}
                    />
                    <div>
                      <h4 className="fw-bold text-primary mb-1">99%</h4>
                      <p className="small mb-0 text-muted">
                        Positive customer
                        <br />
                        reviews
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-sm-6">
                  <div className="d-flex align-items-center">
                    <img
                      src="/images/icon-svg/certify.svg"
                      alt="Certifications"
                      className="me-3"
                      style={{ width: "48px", height: "48px" }}
                    />
                    <div>
                      <h4 className="fw-bold text-primary mb-1 small">
                        Future Lab
                      </h4>
                      <p className="small mb-0 text-muted">
                        Prestigious
                        <br />
                        Certifications
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}


      {/* Testimonials Slider */}
      <TestimonialsSlider />

      <style>{`
        .hover-lift {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
        }

        .marquee {
          animation: scroll 30s linear infinite;
          white-space: nowrap;
        }

        @keyframes scroll {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .scrolling-carousel .carousel-track {
          animation: scroll-left 20s linear infinite;
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .display-4 {
            font-size: 2rem;
          }

          .lead {
            font-size: 1rem;
          }

          .card-body {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div >
  );
};

export default Home;

const getImageUrl = (imagePath) => {
  // Handle cases where imagePath might be undefined or null
  if (!imagePath) return "/images/placeholder.png";

  // Use the getImagePath function from config
  return getImagePath(imagePath);
};
