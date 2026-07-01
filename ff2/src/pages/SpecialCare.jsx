import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiService from "../utils/api";
import { baseUrl } from "../utils/config";
import { addToCart as addToCartService } from "../utils/cart";
import { showToast } from "../utils/toast";

const SpecialCare = () => {
  const [testData, setTestData] = useState([]);
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testResponse, bannerResponse] = await Promise.all([
          apiService.getSelectedSpecialCare(),
          apiService.getRandomBanner(),
        ]);

        if (testResponse.success) {
          setTestData(testResponse.data || []);
        }

        if (bannerResponse.success) {
          setBanner(bannerResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = (test) => {
    addToCartService(test);
    showToast(`${test.name} added to cart`);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100vh",
          marginTop: "100px",
        }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="special-care-page">
      <div className="container py-5">
        <h2 className="mb-4">Special Care Packages</h2>

        {banner && (
          <div className="mb-4">
            <img
              className="adfor-product w-100"
              src={`${baseUrl}/${banner.imageUrl}`}
              alt="Special Care Banner"
            />
          </div>
        )}

        <div className="row">
          {testData.length === 0 ? (
            <div className="col-12 text-center py-5">
              <h4>No special care packages available</h4>
            </div>
          ) : (
            testData.map((test, index) => (
              <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <div className="card test-card h-100">
                  {test.imagePath && (
                    <img
                      src={`${baseUrl}/${test.imagePath}`}
                      className="card-img-top"
                      alt={test.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{test.name}</h5>
                    <p className="card-text">{test.description}</p>

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="h5 text-primary">₹{test.price}</span>
                      {test.originalPrice && (
                        <span className="text-muted">
                          <del>₹{test.originalPrice}</del>
                        </span>
                      )}
                    </div>

                    <div className="mt-auto">
                      <button
                        className="btn btn-know-more me-2"
                        style={{
                          backgroundColor: "#000000",
                          color: "#ffffff",
                          border: "1px solid #000000",
                          padding: "8px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          borderRadius: "6px",
                          textDecoration: "none",
                          cursor: "pointer",
                        }}
                      >
                        Know More
                      </button>
                      <Link
                        to={`/product?id=${test._id}&category=${test.category}`}
                        className="btn btn-outline-primary me-2"
                      >
                        View Details
                      </Link>
                      <button
                        className="btn btn-primary"
                        onClick={() => addToCart(test)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialCare;
