import React, { useState } from "react";
import { Link } from "react-router-dom";
import SpecialOffersCarousel from "../components/SpecialOffersCarousel";

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

  // Add to cart function (placeholder)
  const addToCart = (offerId) => {
    console.log(`Added offer ${offerId} to cart`);
    // In a real implementation, this would add the item to the cart
    alert(
      `Added ${specialOffers.find((o) => o.id === offerId)?.title} to cart!`
    );
  };

  return (
    <div className="special-offers-page py-5 overflow-hidden">
      <div className="container">
        {/* Page Header */}
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h1 className="display-4 fw-bold mb-3">
              <span className="gradient-text"> Special Offers</span>
            </h1>
            <p className="lead text-muted mb-4">
              Limited time deals on health checkups & lab tests
            </p>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="position-relative mb-5 special-offers-container">
          <SpecialOffersCarousel offers={specialOffers} onAddToCart={addToCart} />
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
