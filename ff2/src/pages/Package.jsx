import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Home as HomeIcon,
  CheckCircle,
  AlertCircle,
  ShoppingCart,
  Minus,
  Plus,
  Share2,
  Heart
} from "lucide-react";
import apiService from "../utils/api";
import { getImagePath } from "../utils/config";

const PackageDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Get package ID from URL params
  const searchParams = new URLSearchParams(location.search);
  const packageId = searchParams.get("id");
  const category = searchParams.get("category");

  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTestById(packageId);

        if (response.success) {
          setPackageData(response.data);
        } else {
          // Fallback to mock data
          setPackageData({
            _id: packageId,
            name: "Complete Full Body Health Checkup Premium Package",
            description: "Comprehensive health screening with advanced diagnostics including blood work, imaging, and consultation. Perfect for annual health checkups and preventive care.",
            price: 999,
            originalPrice: 2299,
            discountPercentage: 56,
            category: category || "Full Body Checkup",
            reportTime: "24-48 Hours",
            sampleType: "Blood & Urine",
            homeCollection: true,
            certification: "NABL Accredited",
            preparation: [
              "10-12 hours fasting required before sample collection",
              "Avoid alcohol 24 hours before the test",
              "Stay hydrated - drink plenty of water",
              "Take your regular medications unless advised otherwise",
              "Wear comfortable clothing for easy sample collection"
            ],
            includedTests: [
              {
                category: "Complete Blood Count (CBC)",
                tests: [
                  "Hemoglobin",
                  "Total WBC Count",
                  "RBC Count",
                  "Platelet Count",
                  "Differential Count",
                  "ESR"
                ]
              },
              {
                category: "Liver Function Test (LFT)",
                tests: [
                  "Bilirubin Total",
                  "Bilirubin Direct",
                  "SGOT",
                  "SGPT",
                  "Alkaline Phosphatase",
                  "Total Protein",
                  "Albumin",
                  "Globulin"
                ]
              },
              {
                category: "Kidney Function Test (KFT)",
                tests: [
                  "Blood Urea",
                  "Serum Creatinine",
                  "Uric Acid",
                  "BUN/Creatinine Ratio"
                ]
              },
              {
                category: "Lipid Profile",
                tests: [
                  "Total Cholesterol",
                  "HDL Cholesterol",
                  "LDL Cholesterol",
                  "Triglycerides",
                  "VLDL Cholesterol",
                  "TC/HDL Ratio"
                ]
              },
              {
                category: "Diabetes Screening",
                tests: [
                  "Fasting Blood Sugar",
                  "HbA1c",
                  "Average Blood Glucose"
                ]
              },
              {
                category: "Thyroid Profile",
                tests: [
                  "T3",
                  "T4",
                  "TSH"
                ]
              }
            ],
            features: [
              "Free Home Sample Collection",
              "Digital Report via Email & App",
              "Expert Doctor Consultation Available",
              "NABL Certified Laboratory",
              "24/7 Customer Support"
            ]
          });
        }
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (packageId) {
      fetchPackageDetails();
    }
  }, [packageId, category]);

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const newItem = {
      _id: packageData._id,
      name: packageData.name,
      category: packageData.category,
      price: packageData.price,
      originalPrice: packageData.originalPrice,
      description: packageData.description,
      quantity: quantity,
      discountPercentage: packageData.discountPercentage,
      homeSampleCollection: packageData.homeCollection,
      reportsIn: packageData.reportTime
    };

    const existingIndex = cart.findIndex(item => item._id === newItem._id);
    if (existingIndex === -1) {
      cart.push(newItem);
    } else {
      cart[existingIndex].quantity += quantity;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));

    setToastMessage(`${quantity} package(s) added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row">
          {[1, 2, 3].map(i => (
            <div key={i} className="col-12 mb-4">
              <div className="skeleton-loader" style={{ height: "200px", borderRadius: "12px" }}></div>
            </div>
          ))}
        </div>
        <style>{`
          .skeleton-loader {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="container py-5 text-center">
        <AlertCircle size={64} className="text-danger mb-3" />
        <h3>Package Not Found</h3>
        <p className="text-muted">The package you're looking for doesn't exist.</p>
        <button className="btn btn-primary mt-3" onClick={() => navigate("/completehealth")}>
          Browse All Packages
        </button>
      </div>
    );
  }

  const totalPrice = packageData.price * quantity;
  const totalSavings = (packageData.originalPrice - packageData.price) * quantity;

  return (
    <div className="package-details-page">
      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <CheckCircle size={20} className="me-2" />
          {toastMessage}
        </div>
      )}

      <div className="container py-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none">
                <HomeIcon size={16} className="me-1" />
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/completehealth" className="text-decoration-none">Packages</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {packageData.name}
            </li>
          </ol>
        </nav>

        <div className="row">
          {/* Left Column - Package Details */}
          <div className="col-lg-8 mb-4">
            {/* Hero Section */}
            <div className="card border-0 shadow-sm mb-4 package-hero">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="flex-grow-1">
                    <span className="badge bg-primary mb-2">{packageData.category}</span>
                    <h1 className="h3 fw-bold mb-2">{packageData.name}</h1>
                    <p className="text-muted mb-0">{packageData.description}</p>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm rounded-circle" style={{ width: "40px", height: "40px" }}>
                      <Heart size={18} />
                    </button>
                    <button className="btn btn-outline-secondary btn-sm rounded-circle" style={{ width: "40px", height: "40px" }}>
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Key Features */}
                <div className="row g-3 mt-3">
                  <div className="col-6 col-md-3">
                    <div className="feature-box text-center p-3 rounded-3 bg-light">
                      <Clock size={24} className="text-primary mb-2" />
                      <div className="small fw-semibold">Report Time</div>
                      <div className="x-small text-muted">{packageData.reportTime}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="feature-box text-center p-3 rounded-3 bg-light">
                      <i className="bi bi-droplet-fill text-danger fs-4 mb-2"></i>
                      <div className="small fw-semibold">Sample Type</div>
                      <div className="x-small text-muted">{packageData.sampleType}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="feature-box text-center p-3 rounded-3 bg-light">
                      <HomeIcon size={24} className="text-success mb-2" />
                      <div className="small fw-semibold">Collection</div>
                      <div className="x-small text-muted">{packageData.homeCollection ? "Free Home" : "Lab Visit"}</div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="feature-box text-center p-3 rounded-3 bg-light">
                      <CheckCircle size={24} className="text-info mb-2" />
                      <div className="small fw-semibold">Certification</div>
                      <div className="x-small text-muted">{packageData.certification}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tests Included */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 p-4">
                <h5 className="fw-bold mb-0">Tests Included ({packageData.includedTests?.reduce((sum, cat) => sum + cat.tests.length, 0)} Tests)</h5>
              </div>
              <div className="card-body p-4">
                {packageData.includedTests?.map((category, index) => (
                  <div key={index} className="test-category mb-3">
                    <button
                      className="test-category-header w-100 d-flex justify-content-between align-items-center p-3 border rounded-3 bg-light"
                      onClick={() => toggleCategory(category.category)}
                    >
                      <div className="d-flex align-items-center">
                        <i className="bi bi-clipboard-pulse text-primary me-3 fs-5"></i>
                        <span className="fw-semibold">{category.category}</span>
                        <span className="badge bg-primary bg-opacity-10 text-primary ms-2">{category.tests.length} tests</span>
                      </div>
                      {expandedCategories[category.category] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <div className={`test-category-content ${expandedCategories[category.category] ? 'expanded' : ''}`}>
                      <ul className="list-unstyled ps-4 pt-3 mb-0">
                        {category.tests.map((test, testIndex) => (
                          <li key={testIndex} className="mb-2 d-flex align-items-center">
                            <CheckCircle size={16} className="text-success me-2" />
                            <span className="small">{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation Instructions */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-white border-0 p-4">
                <h5 className="fw-bold mb-0">Preparation Instructions</h5>
              </div>
              <div className="card-body p-4">
                <ul className="preparation-list">
                  {packageData.preparation?.map((instruction, index) => (
                    <li key={index} className="mb-3 d-flex align-items-start">
                      <div className="preparation-number me-3">{index + 1}</div>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Features */}
            {packageData.features && (
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-0 p-4">
                  <h5 className="fw-bold mb-0">Why Choose This Package?</h5>
                </div>
                <div className="card-body p-4">
                  <div className="row g-3">
                    {packageData.features.map((feature, index) => (
                      <div key={index} className="col-md-6">
                        <div className="d-flex align-items-center p-3 rounded-3 bg-light">
                          <CheckCircle size={20} className="text-success me-3 flex-shrink-0" />
                          <span className="small">{feature}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Price Card */}
          <div className="col-lg-4">
            <div className="sticky-price-card">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Package Summary</h5>

                  {/* Price Breakdown */}
                  <div className="price-breakdown mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">MRP</span>
                      <span className="text-muted text-decoration-line-through">₹{packageData.originalPrice}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-success fw-semibold">Discount ({packageData.discountPercentage}%)</span>
                      <span className="text-success fw-semibold">-₹{packageData.originalPrice - packageData.price}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-3">
                      <span className="fw-bold">Price per package</span>
                      <span className="fw-bold text-primary fs-5 price-reveal">₹{packageData.price}</span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Quantity</label>
                    <div className="quantity-selector d-flex align-items-center justify-content-between p-2 border rounded-3">
                      <button
                        className="btn btn-sm btn-outline-primary rounded-circle"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity === 1}
                        style={{ width: "36px", height: "36px" }}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="fw-bold fs-5">{quantity}</span>
                      <button
                        className="btn btn-sm btn-outline-primary rounded-circle"
                        onClick={() => handleQuantityChange(1)}
                        style={{ width: "36px", height: "36px" }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="total-price-section p-3 rounded-3 bg-light mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">Total Amount</span>
                      <span className="fw-bold text-primary fs-4">₹{totalPrice}</span>
                    </div>
                    <div className="text-success small">
                      You save ₹{totalSavings} on this order!
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    className="btn btn-primary w-100 py-3 fw-bold mb-3 add-to-cart-btn"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={20} className="me-2" />
                    Add to Cart
                  </button>

                  {/* Trust Badges */}
                  <div className="trust-badges mt-4 pt-4 border-top">
                    <div className="row g-2 text-center">
                      <div className="col-4">
                        <div className="trust-badge">
                          <CheckCircle size={24} className="text-success mb-1" />
                          <div className="x-small">NABL Certified</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="trust-badge">
                          <HomeIcon size={24} className="text-primary mb-1" />
                          <div className="x-small">Free Home Collection</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="trust-badge">
                          <Clock size={24} className="text-info mb-1" />
                          <div className="x-small">Fast Reports</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style>{`
        .package-details-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
        }

        .package-hero {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .package-hero:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
        }

        .feature-box {
          transition: all 0.3s ease;
        }

        .feature-box:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .test-category-header {
          background: transparent;
          border: 1px solid #e5e7eb !important;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .test-category-header:hover {
          background: #f9fafb !important;
          border-color: #00a2ad !important;
        }

        .test-category-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .test-category-content.expanded {
          max-height: 1000px;
        }

        .preparation-list {
          list-style: none;
          padding: 0;
        }

        .preparation-number {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #00a2ad, #007a85);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .sticky-price-card {
          position: sticky;
          top: 100px;
        }

        .price-reveal {
          animation: priceReveal 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes priceReveal {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .quantity-selector button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #00a2ad, #007a85);
          border: none;
          transition: all 0.3s ease;
        }

        .add-to-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 162, 173, 0.3);
        }

        .toast-notification {
          position: fixed;
          top: 100px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 16px 24px;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          z-index: 1000;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .x-small {
          font-size: 0.75rem;
        }

        .trust-badge {
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .trust-badge:hover {
          background: #f3f4f6;
        }

        @media (max-width: 991px) {
          .sticky-price-card {
            position: relative;
            top: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PackageDetails;
