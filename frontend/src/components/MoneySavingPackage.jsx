import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import '../scrollbar-hide.css';

const MoneySavingPackages = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [cardsPerView, setCardsPerView] = useState(4);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);
    const [activeMobileIndex, setActiveMobileIndex] = useState(0);
    const scrollContainerRef = useRef(null);
    const navigate = useNavigate();

    // Handle Mobile Scroll for Pagination Dots
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const scrollLeft = container.scrollLeft;
        // Approximation: card width (min 260/300) + gap (16)
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

    // Category Mapping for URL params
    const categoryMap = {
        "Complete Health Checkup": "Full Body",
        "Diabetes Care": "Diabetes",
        "Heart Health": "Cardiac",
        "Thyroid Profile": "Thyroid",
        "Liver Function": "Liver",
        "Kidney Profile": "Kidney",
        "Vitamin Package": "Vitamin",
        "Women's Health": "Women's Health",
        "Men's Health": "Men's Health",
        "Senior Citizen": "Senior Citizen"
    };

    // Sample categories data
    const categories = [
        { id: 1, name: "Complete Health Checkup", imagePath: "health-checkup.jpg" },
        { id: 2, name: "Diabetes Care", imagePath: "diabetes.jpg" },
        { id: 3, name: "Heart Health", imagePath: "heart.jpg" },
        { id: 4, name: "Thyroid Profile", imagePath: "thyroid.jpg" },
        { id: 5, name: "Liver Function", imagePath: "liver.jpg" },
        { id: 6, name: "Kidney Profile", imagePath: "kidney.jpg" },
        { id: 7, name: "Vitamin Package", imagePath: "vitamin.jpg" },
        { id: 8, name: "Women's Health", imagePath: "women.jpg" },
        { id: 9, name: "Men's Health", imagePath: "men.jpg" },
        { id: 10, name: "Senior Citizen", imagePath: "senior.jpg" },
    ];

    // Update cards per view based on screen size
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1280;
            setIsMobile(mobile);

            if (window.innerWidth >= 1280) {
                setCardsPerView(4);
            } else if (window.innerWidth >= 1024) {
                setCardsPerView(3);
            } else if (window.innerWidth >= 768) {
                setCardsPerView(3);
            } else if (window.innerWidth >= 640) {
                setCardsPerView(2);
            } else {
                setCardsPerView(2);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate total slides
    const totalSlides = Math.ceil(categories.length / cardsPerView);

    // Get current visible cards
    const getCurrentCards = () => {
        const start = currentSlide * cardsPerView;
        return categories.slice(start, start + cardsPerView);
    };

    const handlePrevious = () => {
        setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    };

    // Placeholder image generator
    const getImageUrl = (imagePath) => {
        const hash = imagePath.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const colors = ['4A90E2', '50C878', 'FF6B6B', 'FFD93D', '9B59B6', 'E67E22'];
        const color = colors[hash % colors.length];
        return `https://via.placeholder.com/400x300/${color}/FFFFFF?text=${encodeURIComponent(imagePath.split('.')[0])}`;
    };

    return (
        <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4">
                {/* Section Header */}
                {/* Section Header */}
                {/* Section Header */}
                <div className="text-center mt-12 mb-8 section-header-row">
                    <div className="section-header-text mb-4">
                        <h2 className="section-title font-bold mb-2" style={{ fontSize: '2.25rem', letterSpacing: '-0.02em', color: '#115e59' }}>
                            Money-Saving Packages
                        </h2>
                        <p className="section-subtitle text-gray-500 font-medium mx-auto" style={{ fontSize: '1rem', lineHeight: '1.5', maxWidth: '600px' }}>
                            Up to 75% Discount. <br className="block md:hidden" /> Comprehensive care at best prices.
                        </p>
                    </div>

                    <div className="section-header-actions flex justify-center">
                        <button
                            className="btn-premium"
                            onClick={() => navigate('/completehealth')}
                        >
                            VIEW ALL
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                <div className="relative">
                    {/* Navigation Buttons */}
                    {!isMobile && (
                        <>
                            <button
                                onClick={handlePrevious}
                                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center text-gray-700 hover:bg-teal-50 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <button
                                onClick={handleNext}
                                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg items-center justify-center text-gray-700 hover:bg-teal-50 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}

                    {/* Cards Grid */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className={`${isMobile ? 'overflow-x-auto pt-4 pb-8 -mx-4 px-4 scrollbar-hide' : 'overflow-hidden px-8'}`}
                    >
                        <div
                            className={isMobile ? 'flex gap-4 snap-x snap-mandatory' : 'grid gap-4 transition-all duration-500 ease-in-out'}
                            style={isMobile ? {} : {
                                gridTemplateColumns: `repeat(${cardsPerView}, 1fr)`,
                            }}
                        >
                            {(isMobile ? categories : getCurrentCards()).map((item, index) => (
                                <div key={item.id} className={isMobile ? 'min-w-[260px] sm:min-w-[300px] snap-center' : ''}>
                                    <CategoryCard
                                        item={item}
                                        getImageUrl={getImageUrl}
                                        index={index}
                                        onNavigate={(name) => {
                                            const mappedCategory = categoryMap[name] || "All";
                                            navigate(`/completehealth?tab=${encodeURIComponent(mappedCategory)}`);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    {isMobile ? (
                        <div className="flex justify-center items-center gap-2 mt-4">
                            {categories.map((_, index) => (
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
                                        boxShadow: index === activeMobileIndex ? '0 2px 8px rgba(45, 122, 110, 0.3)' : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'w-8 h-3 bg-teal-700'
                                        : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    style={{
                                        boxShadow: index === currentSlide ? '0 2px 8px rgba(45, 122, 110, 0.3)' : 'none',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

// Category Card Component
const CategoryCard = ({ item, getImageUrl, index, onNavigate }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onNavigate(item.name)}
            style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
            }}
        >
            <div
                className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 h-full flex flex-col"
                style={{
                    transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                    boxShadow: isHovered
                        ? '0 12px 24px rgba(0,0,0,0.15)'
                        : '0 4px 10px rgba(0,0,0,0.08)',
                }}
            >
                {/* Image Container - Fixed Height */}
                <div className="relative overflow-hidden" style={{ height: '200px' }}>
                    <div
                        className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center transition-transform duration-300"
                        style={{
                            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                        }}
                    >
                        {/* Placeholder Icon/Text */}
                        <div className="text-center">
                            <div
                                className="w-20 h-20 mx-auto mb-2 rounded-lg flex items-center justify-center text-white text-3xl font-bold"
                                style={{ background: 'linear-gradient(135deg, #2D7A6E 0%, #1F5F54 100%)' }}
                            >
                                {item.name.charAt(0)}
                            </div>
                            <p className="text-teal-700 font-semibold text-sm px-2">
                                {item.name.split(' ')[0]}
                            </p>
                        </div>
                    </div>

                    {/* Overlay on Hover */}
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent opacity-0 transition-opacity duration-300"
                        style={{ opacity: isHovered ? 1 : 0 }}
                    />
                </div>

                {/* Title Bar - Fixed Height */}
                <div
                    className="text-center py-4 px-3 flex items-center justify-center"
                    style={{
                        backgroundColor: "rgb(119, 217, 207)",
                        minHeight: '70px',
                    }}
                >
                    <h3
                        className="font-semibold text-sm md:text-base line-clamp-2"
                        style={{ color: "#004d4d" }}
                    >
                        {item.name}
                    </h3>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
};

export default MoneySavingPackages;