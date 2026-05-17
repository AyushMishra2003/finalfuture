import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppointmentTimeModal = ({ isOpen, onClose, onNext, selectedPatients = [] }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [location, setLocation] = useState('13, Rajajinagar, Rajajinagar - 560021');

    // Generate next 7 days
    const generateDates = () => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            dates.push({
                id: i,
                day: dayNames[date.getDay()],
                date: date.getDate(),
                month: monthNames[date.getMonth()],
                fullDate: date
            });
        }

        return dates;
    };

    // Time slots
    const timeSlots = [
        '05:30 AM', '06:00 AM', '06:30 AM',
        '08:30 AM', '09:00 AM', '09:30 AM',
        '10:00 AM', '10:30 AM'
    ];

    const dates = generateDates();

    const handleConfirm = () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time');
            return;
        }

        const appointmentDetails = {
            date: selectedDate,
            time: selectedTime,
            patients: selectedPatients
        };

        onNext(appointmentDetails);
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
                            maxHeight: '80vh',
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
                                <h2 className="text-lg lg:text-xl font-bold text-gray-900">Select Appointment Time</h2>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ WebkitOverflowScrolling: 'touch' }}>

                                {/* Select date and time */}
                                <div className="mb-4">
                                    <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2">Select date and time</h3>

                                    {/* Fasting Warning */}
                                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                                        <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs lg:text-sm text-amber-900">
                                            <span className="font-semibold">This test requires 8 hours of fasting.</span> Select your slot accordingly.
                                        </p>
                                    </div>
                                </div>

                                {/* Date Selection */}
                                <div className="mb-6">
                                    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                                        {dates.map((date) => (
                                            <button
                                                key={date.id}
                                                onClick={() => setSelectedDate(date)}
                                                className={`flex-shrink-0 flex flex-col items-center justify-center w-16 lg:w-20 py-3 rounded-xl border-2 transition-all ${selectedDate?.id === date.id
                                                    ? 'bg-cyan-500 border-cyan-500 text-white'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                <span className={`text-xs font-medium ${selectedDate?.id === date.id ? 'text-white' : 'text-gray-600'}`}>
                                                    {date.day}
                                                </span>
                                                <span className={`text-xl lg:text-2xl font-bold mt-1 ${selectedDate?.id === date.id ? 'text-white' : 'text-gray-900'}`}>
                                                    {date.date}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Slots */}
                                <div className="mb-6">
                                    <div className="grid grid-cols-3 gap-2 lg:gap-3">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-3 px-2 rounded-xl border-2 font-semibold text-sm lg:text-base transition-all ${selectedTime === time
                                                    ? 'bg-cyan-500 border-cyan-500 text-white'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                    <MapPin size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900 font-medium">{location}</p>
                                        <button className="text-xs lg:text-sm text-cyan-600 font-semibold mt-1">
                                            Change
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 lg:p-6 border-t bg-white flex-shrink-0">
                                <button
                                    onClick={handleConfirm}
                                    disabled={!selectedDate || !selectedTime}
                                    className={`w-full py-4 rounded-xl font-bold text-white transition-all ${selectedDate && selectedTime
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:scale-[1.02]'
                                        : 'bg-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    Confirm Appointment
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AppointmentTimeModal;
