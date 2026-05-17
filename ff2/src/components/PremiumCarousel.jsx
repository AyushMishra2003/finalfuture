
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * PremiumCarousel Component
 *
 * @param {Array} items - Array of items to display.
 * @param {Function} onAddToCart - Callback when "Add to Cart" is clicked.
 * @param {Function} onViewDetails - Callback when "Know More" is clicked.
 * @param {Number} autoPlayInterval - Interval in ms for auto-scroll. Default 4000ms.
 */
const PremiumCarousel = ({ items = [], onAddToCart, onViewDetails, autoPlayInterval = 4000 }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    // Auto-play — do NOT include activeIndex in deps; functional updater handles latest value
    useEffect(() => {
        if (isPaused || items.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, autoPlayInterval);
        return () => clearInterval(interval);
    }, [isPaused, autoPlayInterval, items.length]);

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    const getIndex = (offset) => (activeIndex + offset + items.length) % items.length;

    // Touch swipe handlers
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
        setIsPaused(true);
    };
    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = () => {
        if (touchStartX.current === null || touchEndX.current === null) return;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 40) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        touchStartX.current = null;
        touchEndX.current = null;
        setIsPaused(false);
    };

    const handleAddToCart = (item) => {
        setCartItems(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
        if (onAddToCart) onAddToCart(item);
    };

    const variants = {
        center: { x: "0%", scale: 1, zIndex: 30, opacity: 1, filter: "blur(0px)", rotateY: 0 },
        left:   { x: "-55%", scale: 0.85, zIndex: 20, opacity: 0.6, filter: "blur(2px)", rotateY: 15 },
        right:  { x: "55%", scale: 0.85, zIndex: 20, opacity: 0.6, filter: "blur(2px)", rotateY: -15 },
        hidden: { opacity: 0, scale: 0.8, zIndex: 0 },
    };

    if (!items || items.length === 0) return null;

    return (
        <div
            className="premium-carousel-container w-100 position-relative d-flex justify-content-center align-items-center rounded-5 my-4"
            style={{ height: "600px", overflow: "hidden", perspective: "1200px" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Background glow */}
            <div className="position-absolute w-100 h-100"
                style={{ background: "radial-gradient(circle at center, rgba(0,122,94,0.05) 0%, transparent 70%)" }}
            />

            {/* LEFT Arrow */}
            <button onClick={prevSlide} className="carousel-nav-btn carousel-nav-prev" aria-label="Previous">
                <ChevronLeft size={22} />
            </button>

            {/* Cards */}
            <div className="position-relative w-100 h-100 d-flex justify-content-center align-items-center">
                {items.map((item, index) => {
                    let position = "hidden";
                    if (index === activeIndex) position = "center";
                    else if (index === getIndex(-1)) position = "left";
                    else if (index === getIndex(1)) position = "right";

                    return (
                        <motion.div
                            key={item.id}
                            layoutId={`card-${item.id}`}
                            initial={false}
                            animate={position}
                            variants={variants}
                            transition={{ type: "spring", stiffness: 150, damping: 20, mass: 1.2 }}
                            className="position-absolute bg-white rounded-4 overflow-hidden"
                            style={{ width: "340px", height: "440px", transformOrigin: "center center" }}
                        >
                            {/* Discount Badge */}
                            <div className="position-absolute top-0 end-0 m-0 z-3">
                                <div className="text-white fw-bold px-3 py-2 small shadow-sm"
                                    style={{ background: "rgba(220,53,69,0.95)", borderBottomLeftRadius: "16px", backdropFilter: "blur(4px)" }}
                                >
                                    {item.discount || "Offer"}
                                </div>
                            </div>

                            {/* Image */}
                            <div className="position-relative w-100 overflow-hidden" style={{ height: "55%" }}>
                                <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover"
                                    style={{ transition: "transform 0.5s ease" }} />
                                <div className="position-absolute bottom-0 w-100 p-3"
                                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)" }}>
                                    <h5 className="fw-bold text-white mb-0 text-truncate" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                                        {item.title}
                                    </h5>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 d-flex flex-column justify-content-between bg-white" style={{ height: "45%" }}>
                                <div>
                                    <p className="text-secondary small mb-2 fw-medium d-flex align-items-center">
                                        <span className="badge bg-light text-dark me-2 border">Tests</span>
                                        {item.tests || "Comprehensive"}
                                    </p>
                                    <div className="d-flex align-items-baseline gap-2 mb-3">
                                        <h3 className="fw-bold text-dark mb-0" style={{ letterSpacing: "-0.5px" }}>{item.price}</h3>
                                        <span className="text-muted text-decoration-line-through small">{item.oldPrice}</span>
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button onClick={() => onViewDetails(item)}
                                        className="btn btn-light flex-grow-1 rounded-pill fw-semibold btn-sm border"
                                        style={{ fontSize: "0.85rem" }}>
                                        Details
                                    </button>
                                    <button onClick={() => handleAddToCart(item)}
                                        className="btn flex-grow-1 rounded-pill fw-semibold btn-sm d-flex align-items-center justify-content-center gap-2 shadow-sm text-white"
                                        style={{
                                            background: cartItems[item.id] ? "#FF8C00" : "#007A5E",
                                            borderColor: cartItems[item.id] ? "#FF8C00" : "#007A5E",
                                            fontSize: "0.85rem",
                                            transition: "all 0.3s ease"
                                        }}>
                                        <ShoppingCart size={14} />
                                        {cartItems[item.id] ? `${cartItems[item.id]} Patient${cartItems[item.id] > 1 ? "s" : ""}` : "Add"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* RIGHT Arrow */}
            <button onClick={nextSlide} className="carousel-nav-btn carousel-nav-next" aria-label="Next">
                <ChevronRight size={22} />
            </button>

            {/* Pagination dots */}
            <div className="pagination-wrapper">
                <div className="pagination-dots d-flex gap-2">
                    {items.map((_, idx) => (
                        <motion.div
                            key={idx}
                            className="rounded-pill"
                            animate={{
                                backgroundColor: idx === activeIndex ? "#007A5E" : "#4e4e4e",
                                width: idx === activeIndex ? 30 : 8,
                                opacity: idx === activeIndex ? 1 : 0.5,
                            }}
                            style={{ height: 6, cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                            onClick={() => setActiveIndex(idx)}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                /* Arrow buttons */
                .carousel-nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 50;
                    background: rgba(255,255,255,0.92);
                    border: none;
                    border-radius: 50%;
                    width: 46px;
                    height: 46px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.18);
                    transition: all 0.2s ease;
                    color: #007A5E;
                }
                .carousel-nav-btn:hover {
                    background: #007A5E;
                    color: white;
                    transform: translateY(-50%) scale(1.12);
                    box-shadow: 0 6px 20px rgba(0,122,94,0.4);
                }
                .carousel-nav-prev { left: 16px; }
                .carousel-nav-next { right: 16px; }

                /* Desktop pagination */
                @media (min-width: 769px) {
                    .pagination-wrapper {
                        position: absolute;
                        bottom: 28px;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 40;
                    }
                }

                /* Mobile */
                @media (max-width: 768px) {
                    .premium-carousel-container {
                        height: auto !important;
                        perspective: none !important;
                        padding-bottom: 70px !important;
                        flex-direction: column;
                    }
                    .premium-carousel-container .position-absolute {
                        display: none;
                    }
                    .premium-carousel-container .position-absolute[style*="z-index: 30"] {
                        display: block !important;
                        position: relative !important;
                        left: auto !important;
                        transform: none !important;
                        margin: 16px auto 0;
                        opacity: 1 !important;
                        filter: none !important;
                        width: 92% !important;
                        max-width: 360px;
                        height: 440px;
                    }
                    .carousel-nav-btn {
                        top: auto;
                        bottom: 14px;
                        transform: none !important;
                        width: 40px;
                        height: 40px;
                    }
                    .carousel-nav-btn:hover {
                        transform: scale(1.1) !important;
                    }
                    .carousel-nav-prev { left: 24px; }
                    .carousel-nav-next { right: 24px; }
                    .pagination-wrapper {
                        position: absolute;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 40;
                    }
                }
            `}</style>
        </div>
    );
};

export default PremiumCarousel;
