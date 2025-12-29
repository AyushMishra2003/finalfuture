
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";

/**
 * PremiumCarousel Component
 *
 * @param {Array} items - Array of items to display. Each item should have id, image, title, tests, price, oldPrice, discount.
 * @param {Function} onAddToCart - Callback when "Add to Cart" is clicked.
 * @param {Function} onViewDetails - Callback when "Know More" is clicked.
 * @param {Number} autoPlayInterval - Interval in ms for auto-scroll. Default 3000ms.
 */
const PremiumCarousel = ({ items = [], onAddToCart, onViewDetails, autoPlayInterval = 4000 }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [cartItems, setCartItems] = useState({}); // Track items in cart: { itemId: patientCount }

    // Handle auto-play
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);
        return () => clearInterval(interval);
    }, [activeIndex, isPaused, autoPlayInterval]);

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    // Calculate indices
    const getIndex = (offset) => {
        return (activeIndex + offset + items.length) % items.length;
    };

    // Handle add to cart with state tracking
    const handleAddToCart = (item) => {
        // Update local cart state
        setCartItems(prev => ({
            ...prev,
            [item.id]: (prev[item.id] || 0) + 1
        }));

        // Call parent callback
        if (onAddToCart) {
            onAddToCart(item);
        }
    };

    // Cinematic Animation Variants
    const variants = {
        center: {
            x: "0%",
            scale: 1,
            zIndex: 30,
            opacity: 1,
            filter: "blur(0px) brightness(1)",
            boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.5)",
            rotateY: 0,
        },
        left: {
            x: "-55%", // Partially visible
            scale: 0.85,
            zIndex: 20,
            opacity: 0.6,
            filter: "blur(2px) brightness(0.7)",
            boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
            rotateY: 15, // Subtle 3D effect
        },
        right: {
            x: "55%", // Partially visible
            scale: 0.85,
            zIndex: 20,
            opacity: 0.6,
            filter: "blur(2px) brightness(0.7)",
            boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
            rotateY: -15, // Subtle 3D effect
        },
        hidden: {
            opacity: 0,
            scale: 0,
            zIndex: 0,
            filter: "blur(2px)",
        }
    };

    return (
        <div
            className="premium-carousel-container w-100 position-relative d-flex justify-content-center align-items-center bg-lightdark bg-opacity-10 rounded-5 my-4"
            style={{
                height: "500px",
                overflow: "hidden",
                perspective: "1200px", // Increased perspective for cinematic feel
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Background enhancement */}
            <div className="position-absolute w-100 h-100" style={{ background: "radial-gradient(circle at center, rgba(0,122,94,0.05) 0%, transparent 70%)" }}></div>

            {/* Cards */}
            <div className="position-relative w-100 h-100 d-flex justify-content-center align-items-center">
                {items.map((item, index) => {
                    let position = 'hidden';
                    if (index === activeIndex) position = 'center';
                    else if (index === getIndex(-1)) position = 'left';
                    else if (index === getIndex(1)) position = 'right';

                    return (
                        <motion.div
                            key={item.id}
                            layoutId={`card-${item.id}`}
                            initial={false}
                            animate={position}
                            variants={variants}
                            transition={{
                                type: "spring",
                                stiffness: 150,
                                damping: 20,
                                mass: 1.2
                            }}
                            className="position-absolute bg-white rounded-4 overflow-hidden border border-white border-opacity-25"
                            style={{
                                width: "340px",
                                height: "440px",
                                transformOrigin: "center center",
                            }}
                        >
                            {/* Discount Badge - Premium Look */}
                            <div className="position-absolute top-0 end-0 m-0 z-3">
                                <div
                                    className="text-white fw-bold px-3 py-2 small shadow-sm"
                                    style={{
                                        background: "rgba(220, 53, 69, 0.95)",
                                        borderBottomLeftRadius: "16px",
                                        backdropFilter: "blur(4px)"
                                    }}
                                >
                                    {item.discount || "Offer"}
                                </div>
                            </div>

                            {/* Image Area - Larger */}
                            <div className="position-relative w-100 overflow-hidden" style={{ height: "55%" }}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-100 h-100 object-fit-cover"
                                    style={{ transition: "transform 0.5s ease" }}
                                />
                                {/* Cinematic Gradient Overlay */}
                                <div className="position-absolute inset-0 w-100 h-100 bg-gradient-to-t from-black via-transparent to-transparent opacity-75"></div>
                                <div className="position-absolute bottom-0 w-100 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                    <h5 className="fw-bold text-white mb-0 text-truncate text-shadow">{item.title}</h5>
                                </div>
                            </div>

                            {/* Content Area - Clean & Minimal */}
                            <div className="p-4 d-flex flex-column h-45 justify-content-between bg-white">
                                <div>
                                    <p className="text-secondary small mb-2 fw-medium d-flex align-items-center">
                                        <span className="badge bg-light text-dark me-2 border">Tests</span>
                                        {item.tests || "Comprehensive"}
                                    </p>

                                    <div className="d-flex align-items-baseline gap-2 mb-3">
                                        <h3 className="fw-bold text-dark mb-0 ls-tight">{item.price}</h3>
                                        <span className="text-muted text-decoration-line-through small">{item.oldPrice}</span>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        onClick={() => onViewDetails(item)}
                                        className="btn btn-light flex-grow-1 rounded-pill fw-semibold btn-sm border-0 bg-gray-100"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        Details
                                    </button>
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="btn btn-dark flex-grow-1 rounded-pill fw-semibold btn-sm d-flex align-items-center justify-content-center gap-2 shadow-sm"
                                        style={{
                                            background: cartItems[item.id] ? "#FF8C00" : "#007A5E",
                                            borderColor: cartItems[item.id] ? "#FF8C00" : "#007A5E",
                                            fontSize: "0.85rem",
                                            transition: "all 0.3s ease"
                                        }}
                                    >
                                        <ShoppingCart size={14} />
                                        {cartItems[item.id] ? `${cartItems[item.id]} Patient${cartItems[item.id] > 1 ? 's' : ''}` : 'Add'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Mobile Indicators - Minimal & Centered */}
            <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-2 z-30">
                {items.map((_, idx) => (
                    <motion.div
                        key={idx}
                        className="rounded-pill cursor-pointer border border-white border-opacity-50"
                        animate={{
                            backgroundColor: idx === activeIndex ? "#FFFFFF" : "rgba(255,255,255,0.3)",
                            width: idx === activeIndex ? 30 : 8,
                            opacity: idx === activeIndex ? 1 : 0.6,
                        }}
                        style={{ height: 6, boxShadow: "0 2px 4px rgba(0, 0, 0, 0.43)" }}
                        onClick={() => setActiveIndex(idx)}
                    />
                ))}
            </div>

            {/* Responsive Styles Injection */}
            <style>{`
                .text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
                .ls-tight { letter-spacing: -0.5px; }

                @media (max-width: 768px) {
                    .premium-carousel-container {
                        height: 480px !important;
                        perspective: none !important;
                    }
                    /* Simplified Mobile View */
                }
            `}</style>
        </div>
    );
};

export default PremiumCarousel;
