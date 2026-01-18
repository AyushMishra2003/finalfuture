import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Activity, Clock } from 'lucide-react';

/**
 * Enhanced Premium Special Offers Carousel - Medical-Tech UI
 * 
 * Features:
 * - Center active card with strong blur on sides
 * - Swiper-like functionality with smooth transitions
 * - Green gradient header bars
 * - Orange gradient CTA buttons
 * - Professional medical-tech aesthetic
 */
const SpecialOffersCarousel = ({ offers, onAddToCart }) => {
    const [cartItems, setCartItems] = useState({});
    const [activeIndex, setActiveIndex] = useState(0);

    const handleAddToCart = (offerId) => {
        setCartItems(prev => ({ ...prev, [offerId]: (prev[offerId] || 0) + 1 }));
        if (onAddToCart) onAddToCart(offerId);
    };

    if (!offers || offers.length === 0) return null;

    return (
        <div className="medical-carousel-container w-full py-8 md:py-12 relative">
            {/* Carousel Wrapper */}
            <div className="relative h-[520px] flex items-center justify-center overflow-hidden px-4">
                {/* Cards Container */}
                <div className="relative w-full max-w-[1400px] h-full flex items-center justify-center">
                    {offers.map((offer, index) => {
                        const diff = index - activeIndex;
                        const totalCards = offers.length;

                        // Calculate position
                        let position = diff;
                        if (diff > totalCards / 2) position = diff - totalCards;
                        if (diff < -totalCards / 2) position = diff + totalCards;

                        const isCenter = position === 0;
                        const isVisible = Math.abs(position) <= 1;

                        return (
                            <div
                                key={offer.id}
                                className="absolute transition-all duration-700 ease-out"
                                style={{
                                    transform: `translateX(${position * 380}px) scale(${isCenter ? 1.05 : 0.85})`,
                                    opacity: isVisible ? (isCenter ? 1 : 0.35) : 0,
                                    filter: isCenter ? 'blur(0px)' : 'blur(6px)',
                                    zIndex: isCenter ? 20 : 10 - Math.abs(position),
                                    pointerEvents: isCenter ? 'auto' : 'none',
                                }}
                            >
                                <MedicalCard
                                    offer={offer}
                                    isActive={isCenter}
                                    cartCount={cartItems[offer.id]}
                                    onAddToCart={handleAddToCart}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={() => setActiveIndex((prev) => (prev === 0 ? offers.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-teal-700 hover:bg-teal-50 transition-all duration-300 hover:scale-110"
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>

                <button
                    onClick={() => setActiveIndex((prev) => (prev === offers.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-teal-700 hover:bg-teal-50 transition-all duration-300 hover:scale-110"
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
                {offers.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className="transition-all duration-400"
                        style={{
                            width: index === activeIndex ? '24px' : '8px',
                            height: '8px',
                            borderRadius: index === activeIndex ? '12px' : '50%',
                            background: index === activeIndex ? '#2D7A6E' : '#D1D5DB',
                            boxShadow: index === activeIndex ? '0 2px 8px rgba(45, 122, 110, 0.3)' : 'none',
                            cursor: 'pointer',
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// Medical Card Component
const MedicalCard = ({ offer, isActive, cartCount, onAddToCart }) => {
    const [priceCount, setPriceCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (isActive) {
            let start = 0;
            const end = offer.discountedPrice;
            const duration = 600;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setPriceCount(end);
                    clearInterval(timer);
                } else {
                    setPriceCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isActive, offer.discountedPrice]);

    return (
        <motion.div
            className="medical-card relative w-full bg-white rounded-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            whileHover={isActive ? {
                y: -6,
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
            } : {}}
            style={{
                width: '340px',
                boxShadow: isActive ? '0 8px 24px rgba(0, 0, 0, 0.12)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
        >
            {/* Green Gradient Header Bar */}
            <div
                className="header-bar relative px-4 py-4"
                style={{
                    background: 'linear-gradient(135deg, #2D7A6E 0%, #1F5F54 100%)',
                    borderRadius: '16px 16px 0 0',
                }}
            >
                {/* Title */}
                <div className="flex justify-center items-center mb-3 text-center w-full">
                    <motion.h3
                        initial={isActive ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
                        animate={isActive ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.4 }}
                        className="text-white font-bold text-base leading-tight px-2"
                        style={{ maxWidth: '100%' }}
                    >
                        {offer.title}
                    </motion.h3>
                </div>

                {/* Pricing Row */}
                <div className="flex items-center justify-center gap-2 flex-nowrap mt-2">
                    <span className="text-white text-xs md:text-sm line-through opacity-60">
                        ₹{offer.originalPrice}
                    </span>

                    <motion.span
                        className="text-white text-2xl md:text-3xl font-black leading-none"
                        key={priceCount}
                        style={{ letterSpacing: '-0.02em' }}
                    >
                        ₹{isActive ? priceCount : offer.discountedPrice}
                    </motion.span>

                    <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap"
                        style={{
                            background: '#28A745',
                            color: '#FFFFFF',
                        }}
                    >
                        {offer.discount}% OFF
                    </span>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-5 relative z-10">
                {/* Info Rows */}
                <div className="space-y-3 mb-5">
                    {/* Parameters Row */}
                    <motion.div
                        initial={isActive ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                        animate={isActive ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.1 }}
                        className="flex items-center justify-center gap-3"
                    >
                        <Activity
                            size={18}
                            className="shrink-0"
                            style={{ color: '#6C757D' }}
                        />
                        <span
                            className="text-sm"
                            style={{ color: '#495057' }}
                        >
                            {offer.tests || '91 parameters'} included
                        </span>
                    </motion.div>

                    {/* Report Time Row */}
                    <motion.div
                        initial={isActive ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                        animate={isActive ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center gap-3"
                    >
                        <Clock
                            size={18}
                            className="shrink-0"
                            style={{ color: '#6C757D' }}
                        />
                        <span
                            className="text-sm"
                            style={{ color: '#495057' }}
                        >
                            Reports within 6 hours
                        </span>
                    </motion.div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 mt-auto">
                    {/* View Details Button */}
                    <button
                        className="flex-1 min-w-0"
                        onClick={() => navigate(`/product?id=${offer.id}`)}
                    >
                        <motion.div
                            whileHover={{
                                y: -2,
                                boxShadow: "0 6px 16px rgba(45,122,110,0.15)",
                            }}
                            whileTap={{ scale: 0.96 }}
                            className="relative w-full h-[40px] px-2 rounded-full text-xs font-semibold overflow-hidden transition-all duration-300 ease-out flex items-center justify-center whitespace-nowrap"
                            style={{
                                background: "#FFFFFF",
                                border: "1.5px solid #2D7A6E",
                                color: "#2D7A6E",
                            }}
                        >
                            <span className="relative z-10">View Details</span>
                        </motion.div>
                    </button>

                    {/* Add to Cart Button */}
                    <div className="flex-1 min-w-0">
                        <motion.button
                            whileHover={{
                                y: -2,
                                boxShadow: "0 8px 20px rgba(255,153,51,0.3)",
                            }}
                            whileTap={{ scale: 0.96 }}
                            animate={isActive && !cartCount ? {
                                boxShadow: [
                                    "0 4px 12px rgba(255,153,51,0.2)",
                                    "0 6px 16px rgba(255,153,51,0.35)",
                                    "0 4px 12px rgba(255,153,51,0.2)",
                                ],
                            } : {}}
                            transition={{ duration: 2, repeat: isActive && !cartCount ? Infinity : 0 }}
                            onClick={() => onAddToCart(offer.id)}
                            className="relative w-full h-[40px] px-2 rounded-full text-white text-xs font-bold overflow-hidden transition-all duration-300 ease-out flex items-center justify-center gap-1.5 whitespace-nowrap"
                            style={{
                                background: cartCount
                                    ? "linear-gradient(135deg, #6c757d 0%, #495057 100%)"
                                    : "linear-gradient(135deg, #FF9933 0%, #F59E0B 100%)",
                                boxShadow: cartCount
                                    ? "0 4px 12px rgba(108,117,125,0.2), inset 0 -2px 4px rgba(0,0,0,0.1)"
                                    : "0 4px 12px rgba(255,153,51,0.25), inset 0 -2px 4px rgba(0,0,0,0.15)",
                            }}
                        >
                            <span className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 blur-[2px] pointer-events-none" />
                            <span className="relative z-10 flex items-center gap-1.5">
                                <ShoppingCart size={14} />
                                {cartCount ? `Added` : "Add to Cart"}
                            </span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SpecialOffersCarousel;