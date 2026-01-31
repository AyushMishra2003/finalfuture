
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import '../scrollbar-hide.css';

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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);
    const [activeMobileIndex, setActiveMobileIndex] = useState(0);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1280);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle Mobile Scroll for Pagination Dots
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollLeft = container.scrollLeft;
        // Approximation: card width (300/340) + gap (16)
        // Better: Use center point calc
        const containerCenter = scrollLeft + container.clientWidth / 2;

        let minDiff = Infinity;
        let closestIndex = 0;

        // Iterate through child nodes (the spacer divs)
        // The first child of container is the flex wrapper
        const flexWrapper = container.firstElementChild;
        if (!flexWrapper) return;

        const children = flexWrapper.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            // Get position relative to container
            const childLeft = child.offsetLeft;
            const childWidth = child.offsetWidth;
            const childCenter = childLeft + childWidth / 2;

            const diff = Math.abs(childCenter - containerCenter);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
            }
        }

        if (activeMobileIndex !== closestIndex) {
            setActiveMobileIndex(closestIndex);
        }
    };

    // Handle auto-play
    useEffect(() => {
        if (isPaused || isMobile) return;
        const interval = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);
        return () => clearInterval(interval);
    }, [activeIndex, isPaused, autoPlayInterval, isMobile]);

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
            filter: "blur(0px)",
            rotateY: 0,
        },
        left: {
            x: "-55%",
            scale: 0.85,
            zIndex: 20,
            opacity: 0.6,
            filter: "blur(2px)",
            rotateY: 15,
        },
        right: {
            x: "55%",
            scale: 0.85,
            zIndex: 20,
            opacity: 0.6,
            filter: "blur(2px)",
            rotateY: -15,
        },
        hidden: {
            opacity: 0,
            scale: 0.8,
            zIndex: 0,
        }
    };


    return (
        <div className="w-full">
            {isMobile ? (
                <>
                    {/* Mobile Scroll View */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="w-full overflow-x-auto pb-8 pt-4 px-4 scrollbar-hide -mx-4"
                    >
                        <div className="flex gap-4 snap-x snap-mandatory px-4">
                            {items.map((item) => (
                                <div key={item.id} className="min-w-[300px] max-w-[340px] snap-center flex-shrink-0">
                                    <PremiumCard
                                        item={item}
                                        cartCount={cartItems[item.id]}
                                        onAddToCart={handleAddToCart}
                                        onViewDetails={(item) => onViewDetails && onViewDetails(item)}
                                        isMobile={true}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile Pagination Dots */}
                    <div className="flex justify-center items-center gap-2 mt-2 mb-6">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (scrollContainerRef.current) {
                                        const container = scrollContainerRef.current;
                                        const flexWrapper = container.firstElementChild;
                                        if (flexWrapper && flexWrapper.children[index]) {
                                            const child = flexWrapper.children[index];
                                            // Center the child
                                            const scrollAmount = child.offsetLeft - (container.clientWidth / 2) + (child.offsetWidth / 2);
                                            container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                                        }
                                    }
                                }}
                                className={`rounded-full transition-all duration-300 ${index === activeMobileIndex
                                    ? 'w-6 h-2 bg-teal-700'
                                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                style={{
                                    boxShadow: index === activeMobileIndex ? ' 0 2px 8px rgba(45, 122, 110, 0.3)' : 'none',
                                    backgroundColor: index === activeMobileIndex ? "#007A5E" : "#D1D5DB"
                                }}
                            />
                        ))}
                    </div>
                </>
            ) : (
                /* Desktop Cinematic Carousel */
                <div
                    className="premium-carousel-container w-100 position-relative d-flex justify-content-center align-items-center bg-lightdark bg-opacity-10 rounded-5 my-4"
                    style={{
                        height: "600px",
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
                                    <PremiumCard
                                        item={item}
                                        cartCount={cartItems[item.id]}
                                        onAddToCart={handleAddToCart}
                                        onViewDetails={(item) => onViewDetails && onViewDetails(item)}
                                    />
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Pagination Wrapper */}
                    <div className="pagination-wrapper">
                        <div className="pagination-dots d-flex gap-2">
                            {items.map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    className="rounded-pill cursor-pointer border border-lightdark border-opacity-50"
                                    animate={{
                                        backgroundColor: idx === activeIndex ? "#007A5E" : "#4e4e4e",
                                        width: idx === activeIndex ? 30 : 8,
                                        opacity: idx === activeIndex ? 1 : 0.5,
                                    }}
                                    style={{
                                        height: 6,
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.43)",
                                    }}
                                    onClick={() => setActiveIndex(idx)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Responsive Styles Injection */}
                    <style>{`
                        .text-shadow {
                            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                        }

                        .ls-tight {
                            letter-spacing: -0.5px;
                        }

                        /* Desktop Pagination Positioning */
                        .pagination-wrapper {
                            position: absolute;
                            bottom: 30px;
                            left: 50%;
                            transform: translateX(-50%);
                            z-index: 40;
                            width: auto;
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
};

const PremiumCard = ({ item, cartCount, onAddToCart, onViewDetails, isMobile }) => {
    return (
        <div className={`bg-white rounded-4 overflow-hidden ${isMobile ? 'shadow-md border border-gray-200' : ''}`}
            style={{
                height: isMobile ? '440px' : '100%',
                width: isMobile ? '100%' : 'auto'
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
                        onClick={() => onAddToCart(item)}
                        className="btn btn-dark flex-grow-1 rounded-pill fw-semibold btn-sm d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        style={{
                            background: cartCount ? "#FF8C00" : "#007A5E",
                            borderColor: cartCount ? "#FF8C00" : "#007A5E",
                            fontSize: "0.85rem",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <ShoppingCart size={14} />
                        {cartCount ? `${cartCount} Patient${cartCount > 1 ? 's' : ''}` : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PremiumCarousel;
