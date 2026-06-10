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
            const [testsData, categoriesData] = await Promise.all([
                apiService.getTests(),
                apiService.getCategories(),
            ]);

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

        if (!userId) {
            alert("Please login to add items to cart");
            const sidebar = document.getElementById("sidebar");
            if (sidebar) {
                sidebar.classList.add("show");
            }
            return;
        }

        try {
            for (const test of selectedTests) {
                await apiService.addToCart(userId, test._id);
            }
            alert("Tests added to cart successfully!");
            navigate("/cart");
        } catch (error) {
            console.error("Error adding to cart:", error);
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

    const TEAL = "#00A2AD";

    return (
        <div
            style={{
                background: "#f1f5f9",
                minHeight: "100vh",
                paddingBottom: selectedTests.length > 0 ? "150px" : "90px",
            }}
        >
            {/* Header */}
            <div
                style={{
                    background: "#fff",
                    padding: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    aria-label="Go back"
                    style={{
                        flexShrink: 0,
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        border: "none",
                        background: "#1e3a44",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                    }}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Select Investigations
                </h1>
            </div>

            <div style={{ padding: "16px" }}>
                {/* Search */}
                <div style={{ position: "relative", marginBottom: "16px" }}>
                    <input
                        type="text"
                        placeholder="Search here"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "16px 52px 16px 18px",
                            fontSize: "1.05rem",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            background: "#fff",
                            outline: "none",
                            color: "#0f172a",
                        }}
                    />
                    <span style={{ position: "absolute", right: "18px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="M21 21l-4.35-4.35" />
                        </svg>
                    </span>
                </div>

                {/* Category chips */}
                <div className="cp-chips">
                    <button
                        className={`cp-chip ${activeCategory === "All" ? "cp-chip-active" : ""}`}
                        onClick={() => setActiveCategory("All")}
                    >
                        All Tests
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category._id}
                            className={`cp-chip ${activeCategory === category.name ? "cp-chip-active" : ""}`}
                            onClick={() => setActiveCategory(category.name)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>

                {/* Test list */}
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    {filteredTests.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px 20px", color: "#64748b" }}>
                            <p style={{ fontSize: "1.1rem", margin: 0 }}>No tests found</p>
                        </div>
                    ) : (
                        filteredTests.map((test) => {
                            const selected = isTestSelected(test._id);
                            return (
                                <div
                                    key={test._id}
                                    onClick={() => handleTestToggle(test)}
                                    style={{
                                        background: "#fff",
                                        borderRadius: "16px",
                                        padding: "20px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "16px",
                                        cursor: "pointer",
                                        border: selected ? `2px solid ${TEAL}` : "2px solid transparent",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                        transition: "border-color 0.2s ease",
                                    }}
                                >
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0f172a", marginBottom: "6px" }}>
                                            {test.name}
                                        </div>
                                        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: TEAL, marginBottom: "8px" }}>
                                            {test.validFor || "Valid for Both"}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                                            <span style={{ fontSize: "1.15rem", fontWeight: 800, color: TEAL }}>
                                                ₹ {test.price}
                                            </span>
                                            {test.originalPrice && test.originalPrice > test.price && (
                                                <span style={{ fontSize: "1rem", color: "#94a3b8", textDecoration: "line-through" }}>
                                                    ₹ {test.originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/product?id=${test._id}&category=${encodeURIComponent(test.category || "")}`);
                                            }}
                                            style={{
                                                marginTop: "14px",
                                                background: "transparent",
                                                border: `1.5px solid ${TEAL}`,
                                                color: TEAL,
                                                fontWeight: 700,
                                                fontSize: "0.9rem",
                                                padding: "8px 20px",
                                                borderRadius: "30px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>

                                    {/* Checkbox / tick */}
                                    <div
                                        style={{
                                            flexShrink: 0,
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "8px",
                                            border: selected ? `2px solid ${TEAL}` : "2px solid #cbd5e1",
                                            background: selected ? TEAL : "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        {selected && (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 6L9 17l-5-5" />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Sticky proceed bar */}
            {selectedTests.length > 0 && (
                <div className="cp-proceed-bar">
                    <div>
                        <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                            {selectedTests.length} {selectedTests.length === 1 ? "test" : "tests"} selected
                            {getDiscount() > 0 && ` · ${getDiscount()}% off`}
                        </div>
                        <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a" }}>
                            ₹ {getTotalPrice()}
                            {getTotalOriginalPrice() > getTotalPrice() && (
                                <span style={{ fontSize: "0.95rem", color: "#94a3b8", textDecoration: "line-through", marginLeft: "8px", fontWeight: 500 }}>
                                    ₹ {getTotalOriginalPrice()}
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleProceedToCart}
                        style={{
                            background: TEAL,
                            color: "#fff",
                            border: "none",
                            borderRadius: "12px",
                            padding: "14px 28px",
                            fontSize: "1.05rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
            )}

            <style>{`
                .cp-chips {
                    display: flex;
                    gap: 12px;
                    overflow-x: auto;
                    padding-bottom: 4px;
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .cp-chips::-webkit-scrollbar { display: none; }
                .cp-chip {
                    flex-shrink: 0;
                    padding: 12px 24px;
                    border-radius: 30px;
                    border: 1.5px solid #cbd5e1;
                    background: #fff;
                    color: #334155;
                    font-size: 1.05rem;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s ease;
                }
                .cp-chip-active {
                    background: ${TEAL};
                    border-color: ${TEAL};
                    color: #fff;
                }
                .cp-proceed-bar {
                    position: fixed;
                    left: 0;
                    right: 0;
                    bottom: 70px;
                    z-index: 1000;
                    background: #fff;
                    box-shadow: 0 -4px 16px rgba(0,0,0,0.1);
                    padding: 14px 18px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                }
                @media (min-width: 768px) {
                    .cp-proceed-bar { bottom: 0; }
                }
            `}</style>
        </div>
    );
};

export default CreatePackage;
