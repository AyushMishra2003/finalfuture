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
import Carousel from "react-bootstrap/Carousel";
import PremiumCarousel from "../components/PremiumCarousel";
import SpecialOffersCarousel from "../components/SpecialOffersCarousel";
import MoneySavingPackages from "../components/MoneySavingPackage";

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

  // DetailCard Component
  const DetailCard = ({ pkg, onClose }) => {
    if (!pkg) return null;
    return (
      <div className="detail-card-overlay p-3">
        <div className="card border-0 shadow-lg detail-card h-100">
          <div className="card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-3 px-3">
            <h5 className="fw-bold text-primary mb-0">Package Details</h5>
            <button
              onClick={onClose}
              className="btn-close-custom"
              aria-label="Close"
            >
              ×
            </button>

          </div>
          <div className="card-body px-3 py-2 scrollable-details">
            <h6 className="fw-bold mb-3">{pkg.title}</h6>

            <div className="detail-item mb-2">
              <span className="fw-bold text-secondary small d-block">Test Inclusions:</span>
              <ul className="list-unstyled small ps-1">
                {pkg.details.inclusions.map((item, idx) => (
                  <li key={idx} className="mb-1"><i className="bi bi-check2-circle text-success me-2"></i>{item}</li>
                ))}
              </ul>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <div className="p-2 rounded-3 bg-light-teal detail-info-box">
                  <i className="bi bi-clock-history text-primary d-block mb-1"></i>
                  <span className="d-block small fw-bold">Reports</span>
                  <span className="x-small">{pkg.details.reportTime}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded-3 bg-light-teal detail-info-box">
                  <i className="bi bi-droplet-fill text-danger d-block mb-1"></i>
                  <span className="d-block small fw-bold">Sample</span>
                  <span className="x-small">{pkg.details.sampleType}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded-3 bg-light-teal detail-info-box">
                  <i className="bi bi-info-circle text-info d-block mb-1"></i>
                  <span className="d-block small fw-bold">Prep</span>
                  <span className="x-small text-truncate d-inline-block w-100">{pkg.details.preparation}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded-3 bg-light-teal detail-info-box">
                  <i className="bi bi-patch-check-fill text-success d-block mb-1"></i>
                  <span className="d-block small fw-bold">Cert.</span>
                  <span className="x-small">{pkg.details.certification}</span>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary small d-flex align-items-center">
              <i className="bi bi-house-door-fill me-2"></i>
              <span>{pkg.details.homeCollection}</span>
            </div>
          </div>
          <div className="card-footer bg-white border-0 p-3">
            <button className="btn btn-primary w-100 rounded-pill shadow-sm" onClick={() => handleAddToCart(pkg.id)}>
              Book This Package
            </button>
          </div>
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
      <section className="hero-section mb-4">
        <div className="container-fluid p-0">
          <Carousel fade interval={3000} controls={false} indicators={false}>
            {["banner1.png", "banner2.png", "banner3.png"].map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100 img-fluid hero-image"
                  src={`${process.env.PUBLIC_URL}/images/banners/${image}`}
                  alt={`Banner ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${process.env.PUBLIC_URL}/images/banners/banner1.png`;
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
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
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <div className="section-header-container">
                <h2 className="section-title">Check Service Availability</h2>
                <p className="section-subtitle">Enter your pincode to see if we serve your area with home collection.</p>
              </div>
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <form onSubmit={handlePinCodeCheck}>
                    <div className="row g-3 align-items-end">
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
                          className="form-control form-control-lg"
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
                          className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
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
       
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 relative text-center ">

  <div className="w-full md:w-auto mx-auto mb-4 md:mb-0 flex flex-col items-center ">
    <h2 className="section-title mb-2 text-center  align-center">
      Special-Offers <br className="block md:hidden" /> Packages
    </h2>

    <p className="section-subtitle text-center md:text-left">
      Premium health packages at unbeatable prices.
      <br className="block md:hidden" /> Up to 75% OFF.
    </p>
  </div>

  <button
    className="btn-premium"
    onClick={() => navigate('/product?id=1')}
  >
    VIEW ALL
  </button>

</div>


          {/* Premium Carousel */}
          <SpecialOffersCarousel
            offers={packages.map(pkg => ({
              id: pkg.id,
              _id: pkg.id, // For cart compatibility
              title: pkg.title,
              name: pkg.title, // For cart display
              originalPrice: parseInt(pkg.oldPrice.replace(/[₹,]/g, '')),
              discountedPrice: parseInt(pkg.price.replace(/[₹,]/g, '')),
              price: parseInt(pkg.price.replace(/[₹,]/g, '')), // For cart
              discount: parseInt(pkg.discount.replace(/[%OFF ]/g, '')),
              discountPercentage: parseInt(pkg.discount.replace(/[%OFF ]/g, '')),
              badge: pkg.discount,
              features: pkg.details.inclusions,
              description: `${pkg.tests} included with ${pkg.details.homeCollection}`,
              category: "Health Package",
              imageUrl: pkg.image,
              tests: pkg.tests,
              homeSampleCollection: true,
              reportsIn: pkg.details.reportTime
            }))}
            onAddToCart={(offerId) => {
              const pkg = packages.find(p => p.id === offerId);
              if (pkg) {
                // Get existing cart from localStorage
                const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

                // Create cart item with all required fields
                const cartItem = {
                  _id: pkg.id,
                  name: pkg.title,
                  price: parseInt(pkg.price.replace(/[₹,]/g, '')),
                  originalPrice: parseInt(pkg.oldPrice.replace(/[₹,]/g, '')),
                  discountPercentage: parseInt(pkg.discount.replace(/[%OFF ]/g, '')),
                  category: "Health Package",
                  description: `${pkg.tests} included with ${pkg.details.homeCollection}`,
                  homeSampleCollection: true,
                  reportsIn: pkg.details.reportTime
                };

                // Check if item already exists in cart
                const existingItemIndex = existingCart.findIndex(item => item._id === pkg.id);

                if (existingItemIndex === -1) {
                  // Add new item to cart
                  existingCart.push(cartItem);
                  localStorage.setItem("cart", JSON.stringify(existingCart));

                  // Trigger storage event for cart count update
                  window.dispatchEvent(new Event("storage"));

                  // Show notification
                  setShowCartNotification(true);
                  setTimeout(() => setShowCartNotification(false), 3000);
                } else {
                  // Item already in cart
                  alert("This package is already in your cart!");
                }
              }
            }}
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
