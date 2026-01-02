import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ShoppingCart, FileText, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

/**
 * SpecialOffersCarousel Component (Mobile-First Premium Design)
 * 
 * Design: Premium, app-like, mobile-optimized
 * - Shorter cards with premium styling
 * - Enhanced border radius (3xl)
 * - Premium gradient buttons
 * - Optimized mobile image/content ratio
 */
const SpecialOffersCarousel = ({ offers, onAddToCart }) => {
    const [cartItems, setCartItems] = useState({});

    const handleAddToCart = (offerId) => {
        setCartItems(prev => ({ ...prev, [offerId]: (prev[offerId] || 0) + 1 }));
        if (onAddToCart) onAddToCart(offerId);
    };

    if (!offers || offers.length === 0) return null;

    return (
        <div className="w-full py-6 relative">
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                centeredSlides={true}
                pagination={{
                    clickable: true,
                    el: '.mobile-pagination',
                }}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1,
                        spaceBetween: 16,
                        centeredSlides: true,
                    },
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                        centeredSlides: false,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                        centeredSlides: false,
                    },
                }}
                className="w-full !pb-12"
            >
                {offers.map((offer) => (
                    <SwiperSlide key={offer.id} className="!flex !justify-center">
                        <motion.div
                            className="w-full max-w-[340px] mx-auto bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100"
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Top Image Section - Optimized for mobile */}
                            <div className="relative h-36 sm:h-44 bg-gradient-to-br from-rose-50 to-pink-50 overflow-hidden">
                                {offer.imageUrl ? (
                                    <img
                                        src={offer.imageUrl}
                                        alt={offer.title}
                                        className="w-full h-full object-cover object-center"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-rose-200">
                                        <Activity size={48} strokeWidth={1.5} />
                                    </div>
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>

                                {/* Discount Badge - Premium styling */}
                                <div className="absolute top-3 right-3">
                                    <motion.div
                                        className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    >
                                        {offer.badge || `${offer.discount}% OFF`}
                                    </motion.div>
                                </div>
                            </div>

                            {/* Content Section - Compact for mobile */}
                            <div className="p-4 sm:p-5">
                                {/* Title */}
                                <h3 className="text-base sm:text-lg font-bold text-slate-800 leading-snug mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                                    {offer.title}
                                </h3>

                                {/* Test Info Tag */}
                                <div className="mb-3">
                                    <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-100">
                                        <Activity size={12} className="text-rose-400" />
                                        {offer.tests || `${offer.features?.length || 'Multiple'} Tests`}
                                    </span>
                                </div>

                                {/* Features List - Reduced for mobile */}
                                <ul className="space-y-1.5 mb-4 text-xs sm:text-sm text-slate-500">
                                    {(offer.features || []).slice(0, 2).map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                                            <span className="line-clamp-1">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Pricing */}
                                <div className="flex items-end gap-2 mb-4 pb-4 border-b border-slate-50">
                                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">
                                        ₹{offer.discountedPrice}
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-slate-400 line-through mb-1">
                                        ₹{offer.originalPrice}
                                    </span>
                                </div>

                                {/* CTA Buttons - Premium styling */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <Link to={`/product?id=${offer.id}`} className="w-full">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="w-full py-2.5 sm:py-3 rounded-2xl border-2 border-rose-300 text-rose-500 text-xs sm:text-sm font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                        >
                                            <FileText size={14} />
                                            Details
                                        </motion.button>
                                    </Link>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleAddToCart(offer.id)}
                                        className={`
                                            w-full py-2.5 sm:py-3 rounded-2xl text-white text-xs sm:text-sm font-bold shadow-lg flex items-center justify-center gap-1.5 transition-all
                                            ${cartItems[offer.id]
                                                ? 'bg-gradient-to-r from-slate-700 to-slate-600 shadow-slate-300'
                                                : 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-emerald-300 hover:from-teal-600 hover:to-emerald-600'
                                            }
                                        `}
                                    >
                                        <ShoppingCart size={14} />
                                        {cartItems[offer.id] ? 'Added' : 'Add'}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Pagination Dots */}
            <div className="mobile-pagination flex justify-center gap-2 mt-4" />

            {/* Custom Pagination Styles */}
            <style>{`
                .mobile-pagination .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background-color: #cbd5e1;
                    opacity: 1;
                    transition: all 0.3s ease;
                    border-radius: 9999px;
                }
                .mobile-pagination .swiper-pagination-bullet-active {
                    background-color: #f43f5e;
                    width: 24px;
                    box-shadow: 0 2px 8px rgba(244, 63, 94, 0.3);
                }
            `}</style>
        </div>
    );
};

export default SpecialOffersCarousel;
