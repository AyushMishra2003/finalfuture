import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TestTube, Package, Heart, Activity, Droplet, Brain } from 'lucide-react';

const BookingFlowDemo = () => {
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    // Sample test data
    const sampleTests = [
        {
            id: 'test_001',
            name: 'Complete Blood Count (CBC)',
            price: 500,
            originalPrice: 800,
            category: 'Blood Test',
            description: 'Comprehensive blood analysis including RBC, WBC, platelets',
            icon: Droplet,
            color: 'from-red-500 to-pink-500'
        },
        {
            id: 'test_002',
            name: 'Thyroid Profile',
            price: 800,
            originalPrice: 1200,
            category: 'Hormone Test',
            description: 'T3, T4, TSH levels for thyroid function',
            icon: Activity,
            color: 'from-purple-500 to-indigo-500'
        },
        {
            id: 'test_003',
            name: 'Lipid Profile',
            price: 600,
            originalPrice: 900,
            category: 'Cholesterol Test',
            description: 'Complete cholesterol and triglycerides analysis',
            icon: Heart,
            color: 'from-emerald-500 to-teal-500'
        },
        {
            id: 'test_004',
            name: 'Diabetes Screening',
            price: 450,
            originalPrice: 700,
            category: 'Diabetes Test',
            description: 'Fasting & PP blood sugar, HbA1c',
            icon: TestTube,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'test_005',
            name: 'Vitamin D Test',
            price: 700,
            originalPrice: 1000,
            category: 'Vitamin Test',
            description: '25-OH Vitamin D levels',
            icon: Brain,
            color: 'from-amber-500 to-orange-500'
        },
        {
            id: 'test_006',
            name: 'Full Body Checkup',
            price: 2500,
            originalPrice: 4000,
            category: 'Health Package',
            description: 'Comprehensive health screening with 60+ parameters',
            icon: Package,
            color: 'from-rose-500 to-red-500'
        }
    ];

    const handleBookTest = (test) => {
        // Booking flow has been removed
        alert(`Booking flow is currently unavailable. Test: ${test.name}`);
    };

    const handleBookingComplete = (cartItem) => {
        // Add to cart
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Check for duplicates
        const exists = cart.some(item => item.id === cartItem.id);
        if (exists) {
            alert('This test is already in your cart!');
            return;
        }

        cart.push(cartItem);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart count
        setCartCount(cart.length);
        window.dispatchEvent(new Event('storage'));

        // Show success message
        const patientCount = cartItem.bookingDetails.patients.length;
        alert(`✅ ${cartItem.name} added to cart for ${patientCount} patient(s)!`);
    };

    React.useEffect(() => {
        // Initialize cart count
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
            {/* Header */}
            <div className="bg-white shadow-md sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Mobile Booking Flow Demo
                            </h1>
                            <p className="text-sm text-gray-500">
                                Test the 4-step booking wizard
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/cart')}
                            className="relative px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg"
                        >
                            View Cart
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Book Your Health Tests
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Experience our seamless 4-step booking process: Select Patient → Choose Time → Share Location → Review & Confirm
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-emerald-600">1</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Select Patient</h3>
                        <p className="text-sm text-gray-600">Choose family members or add new</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-blue-600">2</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Choose Time</h3>
                        <p className="text-sm text-gray-600">Pick convenient date & time slot</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-purple-600">3</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Share Location</h3>
                        <p className="text-sm text-gray-600">GPS or manual address entry</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl font-bold text-amber-600">4</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">Review & Pay</h3>
                        <p className="text-sm text-gray-600">Check details and add to cart</p>
                    </div>
                </div>

                {/* Test Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleTests.map((test) => {
                        const Icon = test.icon;
                        return (
                            <div
                                key={test.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                {/* Card Header */}
                                <div className={`bg-gradient-to-r ${test.color} p-6 text-white`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <Icon size={32} />
                                        <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
                                            {test.category}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold">{test.name}</h3>
                                </div>

                                {/* Card Body */}
                                <div className="p-6">
                                    <p className="text-gray-600 text-sm mb-4 h-12">
                                        {test.description}
                                    </p>

                                    {/* Pricing */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-3xl font-bold text-emerald-600">
                                            ₹{test.price}
                                        </span>
                                        <span className="text-gray-400 line-through text-lg">
                                            ₹{test.originalPrice}
                                        </span>
                                        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                                            {Math.round(((test.originalPrice - test.price) / test.originalPrice) * 100)}% OFF
                                        </span>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            <span>Home Sample Collection</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            <span>Reports in 24 hours</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                                            <span>NABL Certified Lab</span>
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => handleBookTest(test)}
                                        className={`w-full py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${test.color} hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                                    >
                                        Book This Test
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        How It Works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-emerald-600 mb-2">✨ Features</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Multi-patient selection support</li>
                                <li>• Quick add family members (Mom, Dad, Spouse)</li>
                                <li>• Flexible appointment scheduling</li>
                                <li>• GPS or manual address entry</li>
                                <li>• Real-time price calculation</li>
                                <li>• Smooth step-by-step navigation</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-emerald-600 mb-2">📱 Mobile Optimized</h4>
                            <ul className="space-y-2 text-gray-600">
                                <li>• Full-screen mobile experience</li>
                                <li>• Touch-friendly interface</li>
                                <li>• Smooth animations</li>
                                <li>• Progress indicator</li>
                                <li>• Sticky header & footer</li>
                                <li>• Form validation</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Flow Modal - Removed */}
        </div>
    );
};

export default BookingFlowDemo;
