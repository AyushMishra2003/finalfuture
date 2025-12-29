import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Tag, TrendingUp, Heart, ChevronLeft, ChevronRight, Check } from "react-feather";
import { motion, AnimatePresence } from "framer-motion";

const SpecialOffers = () => {
  // Special offers data (same as in Home.jsx)
  const [specialOffers] = useState([
    {
      id: 1,
      title: "Premium Health Package",
      originalPrice: 2999,
      discountedPrice: 1999,
      discount: 33,
      badge: "PREMIUM",
      badgeColor: "premium",
      features: [
        "Complete Blood Count",
        "Lipid Profile",
        "Liver Function",
        "Kidney Function",
      ],
      description: "Comprehensive health screening for overall wellness",
      popular: true,
    },
    {
      id: 2,
      title: "Women's Wellness Special",
      originalPrice: 3499,
      discountedPrice: 2299,
      discount: 34,
      badge: "TRENDING",
      badgeColor: "trending",
      features: [
        "Hormonal Analysis",
        "Thyroid Profile",
        "Vitamin D",
        "Iron Studies",
      ],
      description: "Specialized health checkup designed for women's needs",
      popular: false,
    },
    {
      id: 3,
      title: "Cardiac Care Package",
      originalPrice: 2799,
      discountedPrice: 1899,
      discount: 32,
      badge: "NEW",
      badgeColor: "new",
      features: ["ECG", "2D Echo", "Lipid Profile", "Cardiac Risk Markers"],
      description: "Complete cardiovascular health assessment",
      popular: false,
    },
    {
      id: 4,
      title: "Diabetes Complete",
      originalPrice: 1899,
      discountedPrice: 1299,
      discount: 32,
      badge: "RECOMMENDED",
      badgeColor: "recommended",
      features: ["HbA1c", "Fasting Glucose", "Post Meal Glucose", "Insulin"],
      description: "Comprehensive diabetes monitoring package",
      popular: false,
    },
    {
      id: 5,
      title: "Senior Citizen Special",
      originalPrice: 4999,
      discountedPrice: 3499,
      discount: 30,
      badge: "POPULAR",
      badgeColor: "popular",
      features: [
        "Full Body Checkup",
        "Bone Health",
        "Cognitive Assessment",
        "Eye Screening",
      ],
      description: "Complete health package for seniors above 60",
      popular: false,
    },
    {
      id: 6,
      title: "Executive Health Checkup",
      originalPrice: 5999,
      discountedPrice: 3999,
      discount: 33,
      badge: "EXCLUSIVE",
      badgeColor: "exclusive",
      features: [
        "Advanced Imaging",
        "Stress Test",
        "Nutritional Analysis",
        "Health Consultation",
      ],
      description: "Premium executive health screening with consultation",
      popular: false,
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);

  // Get badge class based on badge color
  const getBadgeClass = (badgeColor) => {
    switch (badgeColor) {
      case "premium":
        return "bg-warning text-dark";
      case "trending":
        return "bg-info text-white";
      case "new":
        return "bg-success text-white";
      case "recommended":
        return "bg-primary text-white";
      case "popular":
        return "bg-danger text-white";
      case "exclusive":
        return "bg-dark text-white";
      default:
        return "bg-secondary text-white";
    }
  };

  // Add to cart function (placeholder)
  const addToCart = (offerId) => {
    console.log(`Added offer ${offerId} to cart`);
    // In a real implementation, this would add the item to the cart
    alert(
      `Added ${specialOffers.find((o) => o.id === offerId)?.title} to cart!`
    );
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % specialOffers.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + specialOffers.length) % specialOffers.length);
  };

  // Get visible cards (3 at a time)
  const getVisibleCards = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (activeIndex + i) % specialOffers.length;
      visible.push(specialOffers[index]);
    }
    return visible;
  };

  return (
    <div className="special-offers-page py-5 overflow-hidden">
      <div className="container">
        {/* Page Header */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="display-4 fw-bold mb-3">
              <span className="gradient-text">🎉 Special Offers</span>
            </h1>
            <p className="lead text-muted mb-4">
              Limited time deals on health checkups & lab tests
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="position-relative mb-5">
          {/* Cards Row */}
          <motion.div
            className="row g-3 g-md-4"
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {getVisibleCards().map((offer, idx) => (
              <div key={offer.id} className="col-12 col-md-6 col-lg-4">
                <div className="card border-0 shadow-sm h-100 special-offer-card bg-white">
                  <div className="card-body p-4 d-flex flex-column">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className={`badge ${getBadgeClass(offer.badgeColor)}`}>
                        {offer.badge}
                      </span>
                      {offer.popular && (
                        <Star size={16} className="text-warning" fill="#ffc107" />
                      )}
                    </div>

                    <h4 className="card-title fw-bold mb-2">{offer.title}</h4>
                    <p className="text-muted small mb-3">{offer.description}</p>

                    {/* Features */}
                    <div className="mb-4 bg-light p-3 rounded flex-grow-1">
                      <ul className="list-unstyled mb-0">
                        {offer.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="mb-2 d-flex align-items-center small">
                            <Check size={14} className="text-success me-2" />
                            {f}
                          </li>
                        ))}
                        {offer.features.length > 3 && (
                          <li className="text-muted small fst-italic ms-3">
                            + {offer.features.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Pricing */}
                    <div className="mb-4">
                      <div className="d-flex align-items-end mb-1">
                        <h2 className="text-primary fw-bold mb-0 me-2">₹{offer.discountedPrice}</h2>
                        <span className="text-muted text-decoration-line-through mb-1">₹{offer.originalPrice}</span>
                      </div>
                      <small className="text-success fw-bold">Save {offer.discount}%</small>
                    </div>

                    {/* Buttons */}
                    <div className="d-grid gap-2">
                      <button
                        className="btn btn-primary fw-bold d-flex align-items-center justify-content-center"
                        onClick={() => addToCart(offer.id)}
                      >
                        <ShoppingCart size={18} className="me-2" />
                        Select Package
                      </button>
                      <Link
                        to={`/product?id=${offer.id}`}
                        className="btn btn-outline-primary fw-bold"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Navigation Arrows */}
          <button
            className="btn btn-white shadow-sm position-absolute top-50 start-0 translate-middle-y ms-n3 ms-md-n4 rounded-circle p-2"
            onClick={prevSlide}
            style={{ width: '48px', height: '48px', zIndex: 10 }}
          >
            <ChevronLeft className="text-dark" />
          </button>

          <button
            className="btn btn-white shadow-sm position-absolute top-50 end-0 translate-middle-y me-n3 me-md-n4 rounded-circle p-2"
            onClick={nextSlide}
            style={{ width: '48px', height: '48px', zIndex: 10 }}
          >
            <ChevronRight className="text-dark" />
          </button>
        </div>

        {/* Pagination Dots - Below Cards with Gap */}
        <div className="d-flex justify-content-center gap-2 mb-5">
          {specialOffers.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className="btn p-0 rounded-circle border-0"
              animate={{
                width: idx === activeIndex ? 24 : 8,
                height: 8,
                backgroundColor: idx === activeIndex ? "#0d6efd" : "#dee2e6"
              }}
              transition={{ duration: 0.3 }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>


        {/* CTA */}
        <div className="row mt-5">
          <div className="col-12 text-center">
            <Link to="/checkups" className="btn btn-outline-primary rounded-pill px-5">
              Explore All Health Packages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffers;
