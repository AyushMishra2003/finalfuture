import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ShoppingCart,
  Clock,
  TestTube,
  Home,
  FileText,
  CheckCircle,
  ShieldCheck,
  Activity,
  ChevronRight,
  Star,
  Award,
  Zap,
  Heart,
  Share2
} from "lucide-react";
import { mockData } from "../utils/mockData";
import apiService from "../utils/api";

const Product = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [liked, setLiked] = useState(false);
  const headerRef = useRef(null);

  // Initial Data Fetch
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // First try to find in special offers (shared mock data)
        const specialOffer = mockData.specialOffers?.find(
          (p) => p.id === parseInt(productId) || p.id === productId
        );

        if (specialOffer) {
          // Add default values for missing fields to match new design
          setProduct({
            ...specialOffer,
            image: specialOffer.image || specialOffer.imageUrl || specialOffer.imagePath,
            rating: 4.8,
            reviews: 1247,
            details: {
              ...specialOffer.details,
              certification: specialOffer.details.certification || "NABL Certified",
              // Ensure inclusions is an array
              inclusions: Array.isArray(specialOffer.details.inclusions)
                ? specialOffer.details.inclusions
                : (specialOffer.details.inclusions || "").split(',').filter(Boolean)
            }
          });
          setLoading(false);
          return;
        }

        // If not found in special offers, try API (fallback for other products)
        if (productId) {
          const response = await apiService.getTestById(productId);
          if (response.success) {
            setProduct({
              ...response.data,
              image: response.data.image || response.data.imageUrl || response.data.imagePath,
              rating: 4.5,
              reviews: 850,
              oldPrice: response.data.originalPrice || `₹${parseInt(response.data.price) + 500}`,
              details: {
                ...response.data.details,
                inclusions: response.data.details?.inclusions || ["Complete Blood Count", "Consultation"],
                homeCollection: "Available"
              }
            });
          } else {
            // Fallback to mock single tests if API fails
            const mockTest = mockData.singleTest?.find(
              (t) => t._id === productId
            );
            if (mockTest) {
              setProduct({
                ...mockTest,
                id: mockTest._id,
                image: mockTest.image || mockTest.imageUrl || mockTest.imagePath,
                rating: 4.7,
                reviews: 500,
                oldPrice: `₹${mockTest.originalPrice}`,
                price: `₹${mockTest.price}`,
                discount: `${Math.round(((mockTest.originalPrice - mockTest.price) / mockTest.originalPrice) * 100)}% OFF`,
                details: {
                  inclusions: [mockTest.description],
                  homeCollection: "Available",
                  reportTime: "24 Hours",
                  sampleType: "Blood",
                  preparation: "Fasting required",
                  certification: "ISO Certified"
                }
              });
            } else {
              setError("Product not found");
            }
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [productId]);

  // Check Cart Status
  useEffect(() => {
    if (!product) return;

    const checkCart = () => {
      const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const isInCart = currentCart.find(item =>
        item.id === product.id || item._id === product.id
      );
      setCartCount(isInCart ? 1 : 0);
    };

    checkCart();
    window.addEventListener('storage', checkCart);
    return () => window.removeEventListener('storage', checkCart);
  }, [product]);

  // Smooth scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect value
  const parallaxOffset = scrollY * 0.5;

  // Calculate blur based on scroll
  const blurAmount = Math.min(scrollY / 50, 10);

  const handleAddToCart = () => {
    if (!product) return;

    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === product.id || item._id === product.id
    );

    if (existingItemIndex > -1) {
      alert("Item is already in your cart!");
      return;
    }

    const cartItem = {
      ...product,
      id: product.id || product._id, // Ensure consistent ID
      category: "Special Package"
    };

    const updatedCart = [...currentCart, cartItem];
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Dispatch event to update other components
    window.dispatchEvent(new Event('storage'));
    setCartCount(1);

    // Optional: Show success feedback
    const button = document.getElementById('add-to-cart-btn');
    button?.classList.add('animate-bounce');
    setTimeout(() => button?.classList.remove('animate-bounce'), 600);
    // alert("Added to cart successfully!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: `Check out this amazing health package!`,
        url: window.location.href
      });
    }
  };

  const colorMap = {
    emerald: {
      bg: "bg-emerald-100",
      text: "text-emerald-600",
      border: "border-emerald-200"
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-200"
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-200"
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
        <p className="text-gray-500 font-medium tracking-wide">Loading details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md w-full">
          <AlertTriangle size={56} className="text-amber-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-8">{error || "The requested package could not be found."}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3.5 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">

      {/* Floating Header - appears on scroll */}
      <div
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 300
          ? 'translate-y-0 bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5'
          : '-translate-y-full'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="font-bold text-gray-900 text-sm">{product.title}</h2>
              <p className="text-xs text-gray-500">{product.price}</p>
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-full font-bold text-sm hover:bg-emerald-700 transition-all hover:shadow-lg hover:shadow-emerald-600/20"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Hero Section with Parallax and Blur Effect */}
      <div
        className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden transition-all duration-300"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
          filter: `blur(${blurAmount}px)`,
          opacity: Math.max(0.3, 1 - scrollY / 800)
        }}
      >
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <button className="hover:text-emerald-600 transition-colors">Home</button>
            <ChevronRight size={14} />
            <button className="hover:text-emerald-600 transition-colors">Health Packages</button>
            <ChevronRight size={14} />
            <span className="font-medium text-gray-900">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full mb-6 shadow-sm">
                <Award className="text-emerald-600" size={16} />
                <span className="text-sm font-semibold text-gray-700">Trusted by 50,000+ customers</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 font-bold text-gray-900">{product.rating}</span>
                  <span className="text-gray-500 text-sm">({product.reviews.toLocaleString()} reviews)</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                  <TestTube size={16} className="mr-2" />
                  {product.tests}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-white text-sky-600 shadow-lg">
                  <ShieldCheck size={16} className="mr-2" />
                  {product.details.certification}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-white text-orange-600 shadow-lg">
                  <Zap size={16} className="mr-2" />
                  {product.discount}
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-6xl font-black text-emerald-600">{product.price}</span>
                <span className="text-2xl text-gray-400 line-through">{product.oldPrice}</span>
              </div>

              <div className="flex gap-3">
                <button
                  id="add-to-cart-btn"
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <ShoppingCart size={22} />
                  {cartCount > 0 ? `Added (${cartCount})` : 'Add to Cart'}
                </button>

                <button
                  onClick={() => setLiked(!liked)}
                  className={`p-4 rounded-2xl font-bold shadow-xl transition-all duration-300 ${liked
                    ? 'bg-rose-100 text-rose-600 scale-105'
                    : 'bg-white text-gray-400 hover:bg-gray-50'
                    }`}
                >
                  <Heart size={24} className={liked ? 'fill-rose-600' : ''} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-4 bg-white rounded-2xl font-bold shadow-xl text-gray-600 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                >
                  <Share2 size={24} />
                </button>
              </div>
            </div>

            {/* Hero Image - Hidden on mobile when scrolling */}
            <div className={`relative transition-all duration-500 ${scrollY > 100 ? 'lg:block hidden' : 'block'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-[3rem] blur-2xl"></div>
              <div className="relative bg-white rounded-[3rem] shadow-2xl p-8 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-auto object-cover rounded-2xl transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                />
                {product.discount && (
                  <div className="absolute top-12 right-12">
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-50"></div>
                      <span className="relative block bg-gradient-to-br from-orange-500 to-red-500 text-white text-lg font-black px-6 py-3 rounded-full shadow-2xl">
                        {product.discount}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            {['overview', 'tests', 'benefits', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  document.getElementById(tab)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`py-4 px-2 font-bold text-sm uppercase tracking-wider whitespace-nowrap border-b-2 transition-all ${activeTab === tab
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

        {/* Overview Section */}
        <section id="overview" className="mb-24 scroll-mt-20">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Package Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Home, title: 'Home Collection', desc: product.details.homeCollection, color: 'emerald' },
              { icon: Clock, title: 'Quick Reports', desc: product.details.reportTime, color: 'blue' },
              { icon: TestTube, title: 'Sample Type', desc: product.details.sampleType, color: 'purple' }
            ].map((item, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 ${colorMap[item.color].bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`${colorMap[item.color].text}`} size={28} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tests Section */}
        <section id="tests" className="mb-24 scroll-mt-20">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Included Tests</h2>
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.details.inclusions.map((test, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-100"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <CheckCircle className="text-emerald-600" size={20} />
                  </div>
                  <span className="font-semibold text-gray-800">{test}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="mb-24 scroll-mt-20">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Why Choose This Package?</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-10 border-2 border-emerald-200">
              <Activity className="text-emerald-600 mb-4" size={32} />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Health Screening</h3>
              <p className="text-gray-700 leading-relaxed">Get a complete picture of your health with 98 essential tests covering all major health parameters.</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-10 border-2 border-blue-200">
              <ShieldCheck className="text-blue-600 mb-4" size={32} />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">NABL Certified Lab</h3>
              <p className="text-gray-700 leading-relaxed">All tests performed in NABL accredited labs ensuring highest quality and accuracy standards.</p>
            </div>
          </div>
        </section>

        {/* Preparation Notice */}
        <section id="reviews" className="scroll-mt-20">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 border-2 border-amber-200 flex gap-6 items-start">
            <div className="bg-amber-100 rounded-2xl p-4 shrink-0">
              <AlertTriangle className="text-amber-600" size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Important Preparation Instructions</h3>
              <p className="text-amber-800 leading-relaxed">{product.details.preparation}</p>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={handleAddToCart}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-5 rounded-full shadow-2xl shadow-emerald-600/40 hover:shadow-emerald-600/60 hover:scale-110 transition-all duration-300"
        >
          <ShoppingCart size={28} />
        </button>
      </div>

    </div>
  );
};

export default Product;