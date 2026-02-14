import React, { useState } from 'react';
import { X, MapPin, Plus, Navigation, Home, Building2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LocationSelectionModal = ({ isOpen, onClose, onConfirm, selectedPatients = [], appointmentDetails = null }) => {
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isSharing, setIsSharing] = useState(false);

    // Sample saved addresses (in real app, fetch from backend)
    const [savedAddresses, setSavedAddresses] = useState([
        {
            id: 1,
            type: 'home',
            label: 'Home',
            address: '13, Rajajinagar, Rajajinagar',
            city: 'Bangalore',
            state: 'Karnataka',
            pincode: '560021',
            landmark: 'Near Metro Station',
            isDefault: true
        }
    ]);

    // Form state for new address
    const [newAddress, setNewAddress] = useState({
        type: 'home',
        label: '',
        flatNo: '',
        building: '',
        area: '',
        landmark: '',
        city: '',
        state: 'Karnataka',
        pincode: ''
    });

    const handleShareLocation = () => {
        setIsSharing(true);

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser. Please add address manually.');
            setIsSharing(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                const locationData = {
                    id: Date.now(),
                    type: 'current',
                    label: 'Current Location',
                    address: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`,
                    city: 'Bangalore',
                    state: 'Karnataka',
                    pincode: 'Detecting...',
                    latitude,
                    longitude,
                    accuracy: position.coords.accuracy,
                    isDefault: false
                };

                console.log('📍 Location captured:', locationData);
                setSelectedAddress(locationData);
                setIsSharing(false);

                setTimeout(() => {
                    handleConfirm(locationData);
                }, 1000);
            },
            (error) => {
                console.error('Location error:', error);
                setIsSharing(false);
                
                let errorMessage = 'Unable to get your location. ';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage += 'Please allow location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage += 'Location request timed out. Please try again.';
                        break;
                    default:
                        errorMessage += 'Please add address manually or enable location services.';
                }
                
                alert(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleSaveAddress = () => {
        // Validate required fields
        if (!newAddress.flatNo || !newAddress.area || !newAddress.city || !newAddress.pincode) {
            alert('Please fill all required fields');
            return;
        }

        // Validate Karnataka pincode (starts with 5)
        if (!newAddress.pincode.startsWith('5') || newAddress.pincode.length !== 6) {
            alert('Please enter a valid Karnataka pincode (6 digits starting with 5)');
            return;
        }

        const addressToSave = {
            id: Date.now(),
            type: newAddress.type,
            label: newAddress.label || (newAddress.type === 'home' ? 'Home' : newAddress.type === 'work' ? 'Work' : 'Other'),
            address: `${newAddress.flatNo}, ${newAddress.building ? newAddress.building + ', ' : ''}${newAddress.area}`,
            city: newAddress.city,
            state: newAddress.state,
            pincode: newAddress.pincode,
            landmark: newAddress.landmark,
            isDefault: savedAddresses.length === 0
        };

        setSavedAddresses([...savedAddresses, addressToSave]);
        setSelectedAddress(addressToSave);
        setShowAddAddressForm(false);

        // Reset form
        setNewAddress({
            type: 'home',
            label: '',
            flatNo: '',
            building: '',
            area: '',
            landmark: '',
            city: '',
            state: 'Karnataka',
            pincode: ''
        });
    };

    const handleConfirm = (address = selectedAddress) => {
        if (!address) {
            alert('Please select or add an address');
            return;
        }

        onConfirm({
            ...appointmentDetails,
            location: address,
            patients: selectedPatients
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(4px)',
                            zIndex: 9998
                        }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'fixed',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            zIndex: 9999,
                            maxHeight: '85vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        className="lg:fixed lg:inset-0 lg:flex lg:items-center lg:justify-center lg:max-h-[90vh] lg:bottom-auto lg:left-auto lg:right-auto"
                    >
                        <div className="bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl w-full lg:max-w-md overflow-hidden flex flex-col" style={{ maxHeight: 'inherit' }}>

                            {/* Header */}
                            <div className="bg-white px-4 py-3 lg:px-6 lg:py-4 flex items-center gap-3 border-b flex-shrink-0">
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X size={20} className="text-gray-700 lg:w-6 lg:h-6" />
                                </button>
                                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Share Your Location</h2>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ WebkitOverflowScrolling: 'touch' }}>

                                {!showAddAddressForm ? (
                                    <>
                                        {/* Success Message */}
                                        {appointmentDetails && (
                                            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4">
                                                <Check size={18} className="text-emerald-600 flex-shrink-0" />
                                                <p className="text-sm text-emerald-900 font-medium">
                                                    Appointment confirmed for {appointmentDetails.date?.day} {appointmentDetails.date?.date} at {appointmentDetails.time}
                                                </p>
                                            </div>
                                        )}

                                        {/* Info Text */}
                                        <div className="mb-4">
                                            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-1">
                                                Share your Location, Get On-Time Service
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Avoid delays, get on time service by sharing your location
                                            </p>
                                        </div>

                                        {/* Location Permission Alert */}
                                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                            <div className="flex items-start gap-3">
                                                <MapPin size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-blue-900 mb-2">
                                                        📍 Location Permission Required
                                                    </p>
                                                    <p className="text-xs text-blue-700 mb-3">
                                                        Click the button below and allow location access when your browser asks.
                                                    </p>
                                                    <div className="text-xs text-blue-600 space-y-1">
                                                        <p><strong>Chrome:</strong> Click 🔒 icon → Site settings → Location → Allow</p>
                                                        <p><strong>Firefox:</strong> Click 🔒 icon → Permissions → Location → Allow</p>
                                                        <p><strong>Safari:</strong> Safari → Settings → Websites → Location → Allow</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Share Location Button */}
                                        <button
                                            onClick={handleShareLocation}
                                            disabled={isSharing}
                                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all mb-2 flex items-center justify-center gap-2"
                                        >
                                            <Navigation size={20} />
                                            {isSharing ? 'Getting Location...' : '📍 Share my location'}
                                        </button>
                                        
                                        {/* Help Text */}
                                        <p className="text-xs text-center text-gray-500 mb-4">
                                            Click above and allow when browser asks for permission
                                        </p>

                                        {/* Divider */}
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="flex-1 h-px bg-gray-200"></div>
                                            <span className="text-sm text-gray-500">OR</span>
                                            <div className="flex-1 h-px bg-gray-200"></div>
                                        </div>

                                        {/* Saved Addresses */}
                                        {savedAddresses.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Saved Addresses</h4>
                                                <div className="space-y-2">
                                                    {savedAddresses.map((addr) => (
                                                        <button
                                                            key={addr.id}
                                                            onClick={() => setSelectedAddress(addr)}
                                                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${selectedAddress?.id === addr.id
                                                                    ? 'border-emerald-500 bg-emerald-50'
                                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                                                }`}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selectedAddress?.id === addr.id ? 'bg-emerald-100' : 'bg-gray-100'
                                                                    }`}>
                                                                    {addr.type === 'home' ? (
                                                                        <Home size={18} className={selectedAddress?.id === addr.id ? 'text-emerald-600' : 'text-gray-600'} />
                                                                    ) : addr.type === 'work' ? (
                                                                        <Building2 size={18} className={selectedAddress?.id === addr.id ? 'text-emerald-600' : 'text-gray-600'} />
                                                                    ) : (
                                                                        <MapPin size={18} className={selectedAddress?.id === addr.id ? 'text-emerald-600' : 'text-gray-600'} />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <p className="font-semibold text-gray-900 text-sm">{addr.label}</p>
                                                                        {addr.isDefault && (
                                                                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Default</span>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-sm text-gray-600">{addr.address}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        {addr.city}, {addr.state} - {addr.pincode}
                                                                    </p>
                                                                    {addr.landmark && (
                                                                        <p className="text-xs text-gray-500 mt-1">Near: {addr.landmark}</p>
                                                                    )}
                                                                </div>
                                                                {selectedAddress?.id === addr.id && (
                                                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                                                        <Check size={16} className="text-white" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Add Address Button */}
                                        <button
                                            onClick={() => setShowAddAddressForm(true)}
                                            className="w-full py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={20} />
                                            Add Address
                                        </button>
                                    </>
                                ) : (
                                    /* Add Address Form */
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-gray-900">Add New Address</h3>
                                            <button
                                                onClick={() => setShowAddAddressForm(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        {/* Address Type */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Address Type</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    onClick={() => setNewAddress({ ...newAddress, type: 'home' })}
                                                    className={`py-2 px-3 rounded-lg border-2 font-semibold text-sm transition-all ${newAddress.type === 'home'
                                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <Home size={16} className="mx-auto mb-1" />
                                                    Home
                                                </button>
                                                <button
                                                    onClick={() => setNewAddress({ ...newAddress, type: 'work' })}
                                                    className={`py-2 px-3 rounded-lg border-2 font-semibold text-sm transition-all ${newAddress.type === 'work'
                                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <Building2 size={16} className="mx-auto mb-1" />
                                                    Work
                                                </button>
                                                <button
                                                    onClick={() => setNewAddress({ ...newAddress, type: 'other' })}
                                                    className={`py-2 px-3 rounded-lg border-2 font-semibold text-sm transition-all ${newAddress.type === 'other'
                                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <MapPin size={16} className="mx-auto mb-1" />
                                                    Other
                                                </button>
                                            </div>
                                        </div>

                                        {/* Custom Label (if Other) */}
                                        {newAddress.type === 'other' && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Label <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newAddress.label}
                                                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                                    placeholder="e.g., Friend's House"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                                                />
                                            </div>
                                        )}

                                        {/* Flat/House No */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Flat / House No <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={newAddress.flatNo}
                                                onChange={(e) => setNewAddress({ ...newAddress, flatNo: e.target.value })}
                                                placeholder="e.g., 13"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                                            />
                                        </div>

                                        {/* Building Name (Optional) */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Building Name (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={newAddress.building}
                                                onChange={(e) => setNewAddress({ ...newAddress, building: e.target.value })}
                                                placeholder="e.g., Sunshine Apartments"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                                            />
                                        </div>

                                        {/* Area/Street */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Area / Street <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={newAddress.area}
                                                onChange={(e) => setNewAddress({ ...newAddress, area: e.target.value })}
                                                placeholder="e.g., Rajajinagar"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                                            />
                                        </div>

                                        {/* Landmark */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Landmark (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={newAddress.landmark}
                                                onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                                placeholder="e.g., Near Metro Station"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                                            />
                                        </div>

                                        {/* City */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={newAddress.city}
                                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                                            >
                                                <option value="">Select City</option>
                                                <option value="Bangalore">Bangalore</option>
                                                <option value="Mysore">Mysore</option>
                                                <option value="Mangalore">Mangalore</option>
                                                <option value="Hubli">Hubli</option>
                                                <option value="Belgaum">Belgaum</option>
                                                <option value="Gulbarga">Gulbarga</option>
                                                <option value="Davangere">Davangere</option>
                                                <option value="Bellary">Bellary</option>
                                                <option value="Tumkur">Tumkur</option>
                                                <option value="Shimoga">Shimoga</option>
                                            </select>
                                        </div>

                                        {/* State (Fixed to Karnataka) */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                value="Karnataka"
                                                disabled
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-600 text-sm"
                                            />
                                        </div>

                                        {/* Pincode */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Pincode <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={newAddress.pincode}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                                    setNewAddress({ ...newAddress, pincode: value });
                                                }}
                                                placeholder="e.g., 560021"
                                                maxLength={6}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors text-sm"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Karnataka pincodes start with 5</p>
                                        </div>

                                        {/* Save Button */}
                                        <button
                                            onClick={handleSaveAddress}
                                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                        >
                                            Save Address
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {!showAddAddressForm && (
                                <div className="p-4 lg:p-6 border-t bg-white flex-shrink-0">
                                    <button
                                        onClick={() => handleConfirm()}
                                        disabled={!selectedAddress}
                                        className={`w-full py-4 rounded-xl font-bold text-white transition-all ${selectedAddress
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:scale-[1.02]'
                                                : 'bg-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        Confirm & Book
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LocationSelectionModal;
