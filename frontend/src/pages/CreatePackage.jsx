import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../utils/api";
import "./CreatePackage.css";

const CreatePackage = () => {
    const navigate = useNavigate();
    const [tests, setTests] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedTests, setSelectedTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [testsResponse, categoriesResponse] = await Promise.all([
                fetch("http://147.93.27.120:3000/api/v1/tests"),
                fetch("http://147.93.27.120:3000/api/v1/category"),
            ]);

            const testsData = await testsResponse.json();
            const categoriesData = await categoriesResponse.json();

            if (testsData.success) {
                setTests(testsData.data || []);
            }

            if (categoriesData.success) {
                setCategories(categoriesData.data || []);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTestToggle = (test) => {
        setSelectedTests((prev) => {
            const exists = prev.find((t) => t._id === test._id);
            if (exists) {
                return prev.filter((t) => t._id !== test._id);
            } else {
                return [...prev, test];
            }
        });
    };

    const isTestSelected = (testId) => {
        return selectedTests.some((t) => t._id === testId);
    };

    const getTotalPrice = () => {
        return selectedTests.reduce((sum, test) => sum + (test.price || 0), 0);
    };

    const getTotalOriginalPrice = () => {
        return selectedTests.reduce(
            (sum, test) => sum + (test.originalPrice || test.price || 0),
            0
        );
    };

    const getDiscount = () => {
        const total = getTotalPrice();
        const original = getTotalOriginalPrice();
        if (original > total) {
            return Math.round(((original - total) / original) * 100);
        }
        return 0;
    };

    const handleProceedToCart = async () => {
        if (selectedTests.length === 0) {
            alert("Please select at least one test");
            return;
        }

        const userId = localStorage.getItem("userId");

        console.log("=== FRONTEND DEBUG ===");
        console.log("userId from localStorage:", userId);
        console.log("userId type:", typeof userId);
        console.log("Number of tests to add:", selectedTests.length);

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
            // Add all selected tests to cart
            for (const test of selectedTests) {
                console.log("Adding test to cart:", {
                    testId: test._id,
                    testName: test.name,
                    userId: userId
                });

                const response = await apiService.addToCart(userId, test._id);
                console.log("Response from addToCart:", response);
            }
            alert("Tests added to cart successfully!");
            navigate("/cart");
        } catch (error) {
            console.error("=== ERROR DETAILS ===");
            console.error("Error adding to cart:", error);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            if (error.response) {
                console.error("Error response:", error.response);
            }
            alert("Error adding tests to cart. Please try again.");
        }
    };

    const filteredTests = tests.filter((test) => {
        const matchesCategory =
            activeCategory === "All" || test.category === activeCategory;
        const matchesSearch =
            searchQuery === "" ||
            test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            test.description?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="create-package-loading">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading tests...</p>
            </div>
        );
    }

    return (
        <div className="create-package-page">
            {/* Hero Section */}
            <div className="create-package-hero">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            <span className="gradient-text">Create Your Custom</span>
                            <br />
                            Health Package
                        </h1>
                        <p className="hero-subtitle">
                            Select the tests you need and save with our custom packages.
                            <br />
                            Build your perfect health checkup plan today!
                        </p>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">{tests.length}+</div>
                                <div className="stat-label">Available Tests</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">{categories.length}+</div>
                                <div className="stat-label">Categories</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">24hrs</div>
                                <div className="stat-label">Quick Results</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container create-package-container">
                <div className="package-builder-layout">
                    {/* Left Side - Test Selection */}
                    <div className="tests-section">
                        {/* Search and Filter */}
                        <div className="filter-section">
                            <div className="search-box">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Search tests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="category-filters">
                                <button
                                    className={`category-chip ${activeCategory === "All" ? "active" : ""
                                        }`}
                                    onClick={() => setActiveCategory("All")}
                                >
                                    <i className="fas fa-th"></i> All Tests
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category._id}
                                        className={`category-chip ${activeCategory === category.name ? "active" : ""
                                            }`}
                                        onClick={() => setActiveCategory(category.name)}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tests Grid */}
                        <div className="tests-grid">
                            {filteredTests.length === 0 ? (
                                <div className="no-tests">
                                    <i className="fas fa-flask"></i>
                                    <p>No tests found</p>
                                </div>
                            ) : (
                                filteredTests.map((test) => (
                                    <div
                                        key={test._id}
                                        className={`test-card ${isTestSelected(test._id) ? "selected" : ""
                                            }`}
                                        onClick={() => handleTestToggle(test)}
                                    >
                                        <div className="test-card-header">
                                            <div className="test-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={isTestSelected(test._id)}
                                                    onChange={() => { }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <span className="checkmark">
                                                    <i className="fas fa-check"></i>
                                                </span>
                                            </div>
                                            <div className="test-category-badge">{test.category}</div>
                                        </div>

                                        <div className="test-card-body">
                                            <h3 className="test-name">{test.name}</h3>
                                            <p className="test-description">
                                                {test.description?.substring(0, 80)}
                                                {test.description?.length > 80 ? "..." : ""}
                                            </p>

                                            <div className="test-meta">
                                                {test.totalTests && (
                                                    <span className="meta-item">
                                                        <i className="fas fa-vial"></i> {test.totalTests}{" "}
                                                        parameters
                                                    </span>
                                                )}
                                                {test.reportsIn && (
                                                    <span className="meta-item">
                                                        <i className="far fa-clock"></i> {test.reportsIn}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="test-features">
                                                {test.homeSampleCollection && (
                                                    <span className="feature-badge">
                                                        <i className="fas fa-home"></i> Home Collection
                                                    </span>
                                                )}
                                                {test.fastingRequired && (
                                                    <span className="feature-badge fasting">
                                                        <i className="fas fa-utensils"></i> Fasting Required
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="test-card-footer">
                                            <div className="test-pricing">
                                                <div className="current-price">₹{test.price}</div>
                                                {test.originalPrice && test.originalPrice > test.price && (
                                                    <div className="original-price">
                                                        ₹{test.originalPrice}
                                                    </div>
                                                )}
                                            </div>
                                            {test.discountPercentage > 0 && (
                                                <div className="discount-badge">
                                                    {test.discountPercentage}% OFF
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Side - Selected Package Summary */}
                    <div className="package-summary-section">
                        <div className="package-summary-sticky">
                            <div className="package-summary-card">
                                <div className="summary-header">
                                    <h2>Your Custom Package</h2>
                                    <p>
                                        {selectedTests.length}{" "}
                                        {selectedTests.length === 1 ? "test" : "tests"} selected
                                    </p>
                                </div>

                                <div className="selected-tests-list">
                                    {selectedTests.length === 0 ? (
                                        <div className="empty-selection">
                                            <i className="fas fa-clipboard-list"></i>
                                            <p>No tests selected yet</p>
                                            <span>Click on tests to add them to your package</span>
                                        </div>
                                    ) : (
                                        selectedTests.map((test) => (
                                            <div key={test._id} className="selected-test-item">
                                                <div className="selected-test-info">
                                                    <h4>{test.name}</h4>
                                                    <span className="selected-test-category">
                                                        {test.category}
                                                    </span>
                                                </div>
                                                <div className="selected-test-actions">
                                                    <span className="selected-test-price">
                                                        ₹{test.price}
                                                    </span>
                                                    <button
                                                        className="remove-test-btn"
                                                        onClick={() => handleTestToggle(test)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {selectedTests.length > 0 && (
                                    <>
                                        <div className="summary-divider"></div>

                                        <div className="price-breakdown">
                                            <div className="price-row">
                                                <span>Subtotal</span>
                                                <span>₹{getTotalOriginalPrice()}</span>
                                            </div>
                                            {getDiscount() > 0 && (
                                                <div className="price-row discount">
                                                    <span>Package Discount ({getDiscount()}%)</span>
                                                    <span>
                                                        -₹{getTotalOriginalPrice() - getTotalPrice()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="price-row total">
                                                <span>Total Amount</span>
                                                <span>₹{getTotalPrice()}</span>
                                            </div>
                                        </div>

                                        <div className="package-benefits">
                                            <h4>Package Benefits</h4>
                                            <ul>
                                                <li>
                                                    <i className="fas fa-check-circle"></i> Home Sample
                                                    Collection
                                                </li>
                                                <li>
                                                    <i className="fas fa-check-circle"></i> Quick Report
                                                    Delivery
                                                </li>
                                                <li>
                                                    <i className="fas fa-check-circle"></i> Expert
                                                    Consultation
                                                </li>
                                                {getDiscount() > 0 && (
                                                    <li>
                                                        <i className="fas fa-check-circle"></i> Save{" "}
                                                        {getDiscount()}% on Package
                                                    </li>
                                                )}
                                            </ul>
                                        </div>

                                        <button
                                            className="proceed-btn"
                                            onClick={handleProceedToCart}
                                        >
                                            <i className="fas fa-shopping-cart"></i>
                                            Add to Cart & Proceed
                                        </button>

                                        <button
                                            className="clear-btn"
                                            onClick={() => setSelectedTests([])}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                            Clear Selection
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Trust Indicators */}
                            <div className="trust-indicators">
                                <div className="trust-item">
                                    <i className="fas fa-shield-alt"></i>
                                    <span>100% Safe & Secure</span>
                                </div>
                                <div className="trust-item">
                                    <i className="fas fa-certificate"></i>
                                    <span>NABL Certified Labs</span>
                                </div>
                                <div className="trust-item">
                                    <i className="fas fa-user-md"></i>
                                    <span>Expert Doctors</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePackage;
