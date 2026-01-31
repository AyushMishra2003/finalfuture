import React, { useState } from 'react';
import { X, Plus, User, Users, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PatientSelectionModal = ({ isOpen, onClose, onNext }) => {
    // State for existing family members (in real app, fetch from backend)
    const [familyMembers, setFamilyMembers] = useState([
        { id: 1, name: 'Rahul', age: 75, gender: 'M' },
        { id: 2, name: 'Chakravarthi', age: 43, gender: 'M' },
        { id: 3, name: 'Fazil', age: 25, gender: 'M' }
    ]);

    const [selectedPatients, setSelectedPatients] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [addingType, setAddingType] = useState(''); // 'self', 'mom', 'dad', 'spouse', 'other'

    // Form state for adding new patient
    const [newPatient, setNewPatient] = useState({
        name: '',
        age: '',
        gender: '',
        relation: ''
    });

    // Toggle patient selection
    const togglePatient = (patient) => {
        setSelectedPatients(prev => {
            const isSelected = prev.find(p => p.id === patient.id);
            if (isSelected) {
                return prev.filter(p => p.id !== patient.id);
            } else {
                return [...prev, patient];
            }
        });
    };

    // Handle adding new family member
    const handleAddMember = (type) => {
        setAddingType(type);
        setShowAddForm(true);

        // Pre-fill relation based on type
        const relations = {
            'self': 'Self',
            'mom': 'Mother',
            'dad': 'Father',
            'spouse': 'Spouse',
            'other': ''
        };

        setNewPatient({
            name: '',
            age: '',
            gender: type === 'mom' ? 'F' : type === 'dad' ? 'M' : '',
            relation: relations[type] || ''
        });
    };

    // Save new family member
    const handleSaveNewMember = () => {
        if (!newPatient.name || !newPatient.age || !newPatient.gender) {
            alert('Please fill all required fields');
            return;
        }

        const newMember = {
            id: Date.now(),
            name: newPatient.name,
            age: parseInt(newPatient.age),
            gender: newPatient.gender,
            relation: newPatient.relation
        };

        setFamilyMembers(prev => [...prev, newMember]);
        setSelectedPatients(prev => [...prev, newMember]);

        // Reset form
        setShowAddForm(false);
        setNewPatient({ name: '', age: '', gender: '', relation: '' });
        setAddingType('');
    };

    // Handle confirm
    const handleConfirm = () => {
        if (selectedPatients.length === 0) {
            alert('Please select at least one family member');
            return;
        }
        onNext(selectedPatients);
        // Don't reset selectedPatients here - parent will handle it
    };

    // Handle close
    const handleClose = () => {
        setSelectedPatients([]);
        setShowAddForm(false);
        onClose();
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
                        onClick={handleClose}
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
                            maxHeight: '75vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}
                        className="lg:fixed lg:inset-0 lg:flex lg:items-center lg:justify-center lg:max-h-[85vh] lg:bottom-auto lg:left-auto lg:right-auto"
                    >
                        <div className="bg-white rounded-t-3xl lg:rounded-3xl shadow-2xl w-full lg:max-w-md overflow-hidden flex flex-col" style={{ maxHeight: 'inherit' }}>

                            {/* Header */}
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 lg:px-6 lg:py-4 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <button
                                        onClick={handleClose}
                                        className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <X size={20} className="text-white lg:w-6 lg:h-6" />
                                    </button>
                                    <h2 className="text-lg lg:text-xl font-bold text-white">Select Family Member</h2>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4 lg:p-6" style={{ WebkitOverflowScrolling: 'touch' }}>

                                {!showAddForm ? (
                                    <>
                                        {/* Instructions */}
                                        <div className="mb-4 lg:mb-6">
                                            <p className="text-gray-900 font-semibold mb-1 text-sm lg:text-base">Select people to book</p>
                                            <p className="text-gray-500 text-xs lg:text-sm">(You can select multiple people at a time)</p>
                                        </div>

                                        {/* Family Members List */}
                                        <div className="space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                                            {familyMembers.map((member) => {
                                                const isSelected = selectedPatients.find(p => p.id === member.id);
                                                return (
                                                    <motion.button
                                                        key={member.id}
                                                        onClick={() => togglePatient(member)}
                                                        whileTap={{ scale: 0.98 }}
                                                        className={`w-full flex items-center justify-between p-3 lg:p-4 rounded-xl lg:rounded-2xl border-2 transition-all ${isSelected
                                                            ? 'border-emerald-500 bg-emerald-50'
                                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2 lg:gap-3">
                                                            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-emerald-100' : 'bg-gray-100'
                                                                }`}>
                                                                <User size={18} className={`lg:w-5 lg:h-5 ${isSelected ? 'text-emerald-600' : 'text-gray-600'}`} />
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="font-semibold text-gray-900 text-sm lg:text-base">{member.name}</p>
                                                                <p className="text-xs lg:text-sm text-gray-500">({member.age}/{member.gender})</p>
                                                            </div>
                                                        </div>

                                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected
                                                            ? 'border-emerald-500 bg-emerald-500'
                                                            : 'border-gray-300'
                                                            }`}>
                                                            {isSelected && (
                                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>

                                        {/* Add Family Member Section */}
                                        <div className="border-t pt-4 lg:pt-6">
                                            <h3 className="font-bold text-gray-900 mb-3 lg:mb-4 text-sm lg:text-base">Add Family Member</h3>
                                            <div className="grid grid-cols-4 gap-2 lg:gap-3">
                                                <button
                                                    onClick={() => handleAddMember('other')}
                                                    className="flex flex-col items-center gap-1 lg:gap-2 p-2 lg:p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-cyan-100 flex items-center justify-center">
                                                        <Plus size={20} className="text-cyan-600 lg:w-6 lg:h-6" />
                                                    </div>
                                                    <span className="text-[10px] lg:text-xs font-medium text-gray-700 text-center leading-tight">Add Family Member</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAddMember('mom')}
                                                    className="flex flex-col items-center gap-1 lg:gap-2 p-2 lg:p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-cyan-100 flex items-center justify-center">
                                                        <Plus size={20} className="text-cyan-600 lg:w-6 lg:h-6" />
                                                    </div>
                                                    <span className="text-[10px] lg:text-xs font-medium text-gray-700 text-center leading-tight">Add Mom</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAddMember('dad')}
                                                    className="flex flex-col items-center gap-1 lg:gap-2 p-2 lg:p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-cyan-100 flex items-center justify-center">
                                                        <Plus size={20} className="text-cyan-600 lg:w-6 lg:h-6" />
                                                    </div>
                                                    <span className="text-[10px] lg:text-xs font-medium text-gray-700 text-center leading-tight">Add Dad</span>
                                                </button>

                                                <button
                                                    onClick={() => handleAddMember('spouse')}
                                                    className="flex flex-col items-center gap-1 lg:gap-2 p-2 lg:p-3 rounded-xl hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-cyan-100 flex items-center justify-center">
                                                        <Plus size={20} className="text-cyan-600 lg:w-6 lg:h-6" />
                                                    </div>
                                                    <span className="text-[10px] lg:text-xs font-medium text-gray-700 text-center leading-tight">Add Spouse</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    /* Add Patient Form */
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                Add {addingType === 'other' ? 'Family Member' : addingType === 'mom' ? 'Mother' : addingType === 'dad' ? 'Father' : 'Spouse'}
                                            </h3>
                                            <button
                                                onClick={() => {
                                                    setShowAddForm(false);
                                                    setNewPatient({ name: '', age: '', gender: '', relation: '' });
                                                }}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>

                                        {/* Name Input */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={newPatient.name}
                                                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                                placeholder="Enter full name"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                                            />
                                        </div>

                                        {/* Age Input */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Age <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={newPatient.age}
                                                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                                                placeholder="Enter age"
                                                min="1"
                                                max="120"
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                                            />
                                        </div>

                                        {/* Gender Selection */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Gender <span className="text-red-500">*</span>
                                            </label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => setNewPatient({ ...newPatient, gender: 'M' })}
                                                    className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${newPatient.gender === 'M'
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    Male
                                                </button>
                                                <button
                                                    onClick={() => setNewPatient({ ...newPatient, gender: 'F' })}
                                                    className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${newPatient.gender === 'F'
                                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    Female
                                                </button>
                                            </div>
                                        </div>

                                        {/* Relation Input (if adding 'other') */}
                                        {addingType === 'other' && (
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Relation
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newPatient.relation}
                                                    onChange={(e) => setNewPatient({ ...newPatient, relation: e.target.value })}
                                                    placeholder="e.g., Brother, Sister, Friend"
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:outline-none transition-colors"
                                                />
                                            </div>
                                        )}

                                        {/* Save Button */}
                                        <button
                                            onClick={handleSaveNewMember}
                                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                        >
                                            Save & Select
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Footer - Next Button */}
                            {!showAddForm && (
                                <div className="p-4 lg:p-6 border-t bg-gray-50 flex-shrink-0">
                                    <button
                                        onClick={handleConfirm}
                                        disabled={selectedPatients.length === 0}
                                        className={`w-full py-4 rounded-xl font-bold text-white transition-all ${selectedPatients.length > 0
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-lg hover:scale-[1.02]'
                                            : 'bg-gray-300 cursor-not-allowed'
                                            }`}
                                    >
                                        Next {selectedPatients.length > 0 && `(${selectedPatients.length} selected)`}
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

export default PatientSelectionModal;
