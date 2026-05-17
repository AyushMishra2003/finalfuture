import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import apiService from "../utils/api";

const LifestyleCheckup = () => {
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const [tabContent, setTabContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response = await apiService.getSelectedLifestyle();
        if (response.success && response.data) {
          setTabs(response.data);

          const tabFromUrl = searchParams.get("tab");
          const initialTab = tabFromUrl || response.data[0]?.name || "";
          setActiveTab(initialTab);

          if (initialTab) {
            fetchTabContent(initialTab);
          }
        }
      } catch (error) {
        console.error("Error fetching tabs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTabs();
  }, [searchParams]);

  const fetchTabContent = async (tabName) => {
    try {
      setLoading(true);
      const response = await apiService.getTestsByCategory(tabName);

      if (response.success && response.data) {
        setTabContent(response.data);
      } else {
        setTabContent([]);
      }
    } catch (error) {
      console.error("Error fetching tab content:", error);
      setTabContent([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    fetchTabContent(tabName);

    const newUrl = new URL(window.location);
    newUrl.searchParams.set("tab", tabName);
    window.history.pushState({}, "", newUrl);
  };

  const addToCart = async (testId) => {
    const userId = localStorage.getItem("userId") || "temp-user-id";
    if (!userId) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const response = await apiService.addToCart(userId, testId);

      if (response.success) {
        alert("Item added to cart successfully!");
      } else {
        alert(response.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding item to cart");
    }
  };

  if (loading && tabs.length === 0) {
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
    <div className="lifestyle-checkup-page">
      <div className="container py-5">
        <h2 className="mb-4">Lifestyle Health Checkups</h2>

        <ul className="nav nav-tabs mb-4" id="tabList">
          {tabs.map((tab, index) => (
            <li key={index} className="nav-item">
              <button
                className={`nav-link tab-item ${
                  activeTab === tab.name ? "active" : ""
                }`}
                onClick={() => handleTabClick(tab.name)}
              >
                {tab.name}
              </button>
            </li>
          ))}
        </ul>

        <div id="tabContent">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : tabContent.length === 0 ? (
            <div className="text-center py-5">
              <h4>No tests available in this category</h4>
            </div>
          ) : (
            <div className="row">
              {tabContent.map((test, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                  <div className="card test-card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{test.name}</h5>
                      <p className="card-text">{test.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h5 text-primary">₹{test.price}</span>
                        <span className="text-muted">
                          <del>₹{test.originalPrice}</del>
                        </span>
                      </div>
                      <div className="mt-3">
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
                          onClick={() => addToCart(test._id)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LifestyleCheckup;
