import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Activity, Clock, Filter, ArrowLeft } from 'lucide-react';
import { mockData } from '../utils/mockData';
import '../scrollbar-hide.css';

// Reusing the premium MedicalCard logic suited for Grid View
const MedicalCard = ({ offer, cartCount, onAddToCart }) => {
  const [priceCount, setPriceCount] = useState(0);
  const navigate = useNavigate();
  const isActive = true; // Always active in grid view

  useEffect(() => {
    let start = 0;
    const end = parseInt(offer.price.replace(/\D/g, '')) || 0; // Parse price from string like "₹999"
    const duration = 600;
    const increment = Math.max(1, end / (duration / 16));

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
  }, [offer.price]);

  return (
    <motion.div
      className="medical-card relative w-full bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full flex flex-col mx-auto"
      style={{ maxWidth: '340px' }}
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Green Gradient Header Bar */}
      <div
        className="header-bar relative px-4 py-4 shrink-0"
        style={{
          background: 'linear-gradient(135deg, #2D7A6E 0%, #1F5F54 100%)',
        }}
      >
        {/* Title */}
        <div className="flex justify-center items-center mb-3 text-center w-full min-h-[48px]">
          <h3 className="text-white font-bold text-lg leading-tight px-2">
            {offer.title}
          </h3>
        </div>

        {/* Pricing Row */}
        <div className="flex items-center justify-center gap-2 flex-nowrap mt-2">
          <span className="text-white text-sm line-through opacity-70">
            {offer.oldPrice}
          </span>

          <span className="text-white text-3xl font-black leading-none tracking-tight">
            ₹{priceCount}
          </span>

          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold whitespace-nowrap bg-emerald-500 text-white"
          >
            {offer.discount}
          </span>
        </div>
      </div>

      {/* Card Body - Flex Grow to push buttons down */}
      <div className="p-5 relative z-10 bg-white flex flex-col flex-grow">
        {/* Info Rows */}
        <div className="space-y-4 mb-6">
          {/* Parameters Row */}
          <div className="flex items-center gap-3 text-gray-600">
            <Activity size={18} className="text-teal-600 shrink-0" />
            <span className="text-sm font-medium">
              {offer.tests || 'Multiple parameters'} included
            </span>
          </div>

          {/* Report Time Row */}
          <div className="flex items-center gap-3 text-gray-600">
            <Clock size={18} className="text-teal-600 shrink-0" />
            <span className="text-sm font-medium">
              Reports within {offer.details?.reportTime || '24 hours'}
            </span>
          </div>
        </div>

        {/* Buttons - Same as Carousel */}
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

const SpecialOffers = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState({});
  const [sortBy, setSortBy] = useState('default');

  const getSortedOffers = () => {
    let sorted = [...(mockData.specialOffers || [])];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/\D/g, '')) || 0;
        const priceB = parseInt(b.price.replace(/\D/g, '')) || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => {
        const priceA = parseInt(a.price.replace(/\D/g, '')) || 0;
        const priceB = parseInt(b.price.replace(/\D/g, '')) || 0;
        return priceB - priceA;
      });
    } else if (sortBy === 'discount') {
      sorted.sort((a, b) => {
        const discA = parseInt(a.discount.replace(/\D/g, '')) || 0;
        const discB = parseInt(b.discount.replace(/\D/g, '')) || 0;
        return discB - discA;
      });
    }
    return sorted;
  };

  const offers = getSortedOffers();

  const handleAddToCart = (offerId) => {
    setCartItems(prev => ({ ...prev, [offerId]: (prev[offerId] || 0) + 1 }));

    // Also update local storage cart
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const offer = (mockData.specialOffers || []).find(o => o.id === offerId);
    if (offer) {
      const exists = currentCart.find(item => item.id === offerId);
      if (!exists) {
        currentCart.push({ ...offer, category: 'Special Offer' });
        localStorage.setItem('cart', JSON.stringify(currentCart));
        window.dispatchEvent(new Event('storage'));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-24 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header with Sort */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-500 hover:text-teal-700 mb-2 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Home
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900">
              Special Offers <span className="text-teal-600">Packages</span>
            </h1>
            <p className="text-gray-600 mt-2">Exclusive health checkup packages at unbeatable prices.</p>
          </div>

          <div className="flex items-center gap-3">
            <Filter size={20} className="text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-teal-500 focus:border-teal-500 block p-2.5 shadow-sm outline-none cursor-pointer hover:border-teal-300 transition-colors"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Discount: High to Low</option>
            </select>
          </div>
        </div>

        {/* Grid with auto-rows for equal height */}
        {offers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 auto-rows-fr">
            {offers.map((offer) => (
              <div key={offer.id} className="h-full">
                <MedicalCard
                  offer={offer}
                  cartCount={cartItems[offer.id]}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No special offers available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialOffers;
