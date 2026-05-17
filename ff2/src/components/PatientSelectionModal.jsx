import React, { useState, useEffect } from 'react';
import { X, Plus, User, Users, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { baseUrl } from '../utils/config';

const PatientSelectionModal = ({ isOpen, onClose, onNext }) => {
    const [familyMembers, setFamilyMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPatients, setSelectedPatients] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [newPatient, setNewPatient] = useState({
        name: '',
        age: '',
        gender: '',
        relation: ''
    });

    useEffect(() => {
        if (isOpen) fetchFamilyMembers();
    }, [isOpen]);

    const fetchFamilyMembers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('userToken');
            if (!token) { setLoading(false); return; }
            const response = await axios.get(`${baseUrl}/api/v1/family-members`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) setFamilyMembers(response.data.data);
        } catch (error) {
            console.error('Error fetching family members:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePatient = (patient) => {
        setSelectedPatients(prev => {
            const isSelected = prev.find(p => p._id === patient._id);
            return isSelected ? prev.filter(p => p._id !== patient._id) : [...prev, patient];
        });
    };

    const handleSaveNewMember = async () => {
        if (!newPatient.name || !newPatient.age || !newPatient.gender) {
            alert('Please fill all required fields');
            return;
        }
        try {
            const token = localStorage.getItem('userToken');
            if (!token) { alert('Please login to add family members'); return; }

            const response = await axios.post(
                `${baseUrl}/api/v1/family-members`,
                {
                    name: newPatient.name,
                    age: parseInt(newPatient.age),
                    gender: newPatient.gender,
                    relation: newPatient.relation
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                const newMember = response.data.data;
                setFamilyMembers(prev => [...prev, newMember]);
                setSelectedPatients(prev => [...prev, newMember]);
                setShowAddForm(false);
                setNewPatient({ name: '', age: '', gender: '', relation: '' });
            }
        } catch (error) {
            console.error('Error adding family member:', error);
            alert(error.response?.data?.error || 'Failed to add family member');
        }
    };

    const handleDeleteMember = async (memberId) => {
        if (!window.confirm('Remove this family member?')) return;
        try {
            setDeletingId(memberId);
            const token = localStorage.getItem('userToken');
            await axios.delete(`${baseUrl}/api/v1/family-members/${memberId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFamilyMembers(prev => prev.filter(m => m._id !== memberId));
            setSelectedPatients(prev => prev.filter(p => p._id !== memberId));
        } catch (error) {
            console.error('Error deleting family member:', error);
            // If API doesn't exist, remove locally
            setFamilyMembers(prev => prev.filter(m => m._id !== memberId));
            setSelectedPatients(prev => prev.filter(p => p._id !== memberId));
        } finally {
            setDeletingId(null);
        }
    };

    const handleConfirm = () => {
        if (selectedPatients.length === 0) {
            alert('Please select at least one family member');
            return;
        }
        onNext(selectedPatients);
    };

    const handleClose = () => {
        setSelectedPatients([]);
        setShowAddForm(false);
        setNewPatient({ name: '', age: '', gender: '', relation: '' });
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
                            position: 'fixed', inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
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
                            position: 'fixed', bottom: 0, left: 0, right: 0,
                            zIndex: 9999, maxHeight: '80vh',
                            display: 'flex', flexDirection: 'column'
                        }}
                    >
                        <div className="bg-white rounded-t-3xl shadow-2xl w-full overflow-hidden flex flex-col" style={{ maxHeight: 'inherit' }}>

                            {/* Header */}
                            <div style={{
                                background: 'linear-gradient(135deg, #007A5E 0%, #00b386 100%)',
                                padding: '16px 20px',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between', flexShrink: 0
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button onClick={handleClose}
                                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        <X size={20} color="#fff" />
                                    </button>
                                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem' }}>
                                        {showAddForm ? 'Add Family Member' : 'Select Patient'}
                                    </span>
                                </div>
                                {!showAddForm && (
                                    <button
                                        onClick={() => setShowAddForm(true)}
                                        style={{
                                            background: 'rgba(255,255,255,0.2)',
                                            border: '1.5px solid rgba(255,255,255,0.5)',
                                            borderRadius: '10px', padding: '6px 14px',
                                            color: '#fff', fontWeight: 600, fontSize: '0.82rem',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                                        }}
                                    >
                                        <Plus size={15} /> Add Member
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', WebkitOverflowScrolling: 'touch' }}>

                                {!showAddForm ? (
                                    <>
                                        {/* Instruction */}
                                        <p style={{ color: '#555', fontSize: '0.82rem', marginBottom: '14px' }}>
                                            Select members to book for. Tap a card to select, 🗑 to remove.
                                        </p>

                                        {/* Members list */}
                                        {loading ? (
                                            <div style={{ textAlign: 'center', padding: '30px 0' }}>
                                                <div className="spinner-border text-success" role="status" />
                                                <p style={{ color: '#888', fontSize: '0.82rem', marginTop: '8px' }}>Loading...</p>
                                            </div>
                                        ) : familyMembers.length === 0 ? (
                                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                                <Users size={48} color="#ccc" style={{ marginBottom: '12px' }} />
                                                <p style={{ color: '#888', fontSize: '0.9rem', fontWeight: 600 }}>No members added yet</p>
                                                <p style={{ color: '#aaa', fontSize: '0.78rem', marginTop: '4px' }}>Tap "Add Member" above to get started</p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                {familyMembers.map((member) => {
                                                    const isSelected = selectedPatients.find(p => p._id === member._id);
                                                    return (
                                                        <motion.div
                                                            key={member._id}
                                                            whileTap={{ scale: 0.98 }}
                                                            style={{
                                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                                padding: '12px 14px',
                                                                borderRadius: '14px',
                                                                border: `2px solid ${isSelected ? '#007A5E' : '#e5e7eb'}`,
                                                                background: isSelected ? '#f0fdf8' : '#fff',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease',
                                                                boxShadow: isSelected ? '0 2px 10px rgba(0,122,94,0.12)' : '0 1px 4px rgba(0,0,0,0.05)'
                                                            }}
                                                            onClick={() => togglePatient(member)}
                                                        >
                                                            {/* Avatar + Info */}
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                <div style={{
                                                                    width: '42px', height: '42px', borderRadius: '50%',
                                                                    background: isSelected ? '#d1fae5' : '#f3f4f6',
                                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                    flexShrink: 0
                                                                }}>
                                                                    <User size={20} color={isSelected ? '#007A5E' : '#6b7280'} />
                                                                </div>
                                                                <div>
                                                                    <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111', margin: 0 }}>{member.name}</p>
                                                                    <p style={{ fontSize: '0.75rem', color: '#888', margin: 0 }}>
                                                                        {member.age} yrs • {member.gender === 'M' ? 'Male' : 'Female'}
                                                                        {member.relation ? ` • ${member.relation}` : ''}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Right side: checkbox + delete */}
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={e => e.stopPropagation()}>
                                                                {/* Delete */}
                                                                <button
                                                                    onClick={() => handleDeleteMember(member._id)}
                                                                    disabled={deletingId === member._id}
                                                                    style={{
                                                                        background: '#fff0f0', border: '1.5px solid #fca5a5',
                                                                        borderRadius: '8px', padding: '6px',
                                                                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                                                                        transition: 'all 0.2s'
                                                                    }}
                                                                    title="Remove member"
                                                                >
                                                                    <Trash2 size={15} color="#ef4444" />
                                                                </button>

                                                                {/* Checkbox */}
                                                                <div
                                                                    onClick={() => togglePatient(member)}
                                                                    style={{
                                                                        width: '22px', height: '22px', borderRadius: '50%',
                                                                        border: `2px solid ${isSelected ? '#007A5E' : '#d1d5db'}`,
                                                                        background: isSelected ? '#007A5E' : '#fff',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        cursor: 'pointer', flexShrink: 0
                                                                    }}
                                                                >
                                                                    {isSelected && (
                                                                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={3}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* ---- Add Member Form ---- */
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {/* Name */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                                Full Name <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={newPatient.name}
                                                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                                                placeholder="Enter full name"
                                                style={{
                                                    width: '100%', padding: '11px 14px',
                                                    borderRadius: '12px', border: '2px solid #e5e7eb',
                                                    fontSize: '0.9rem', outline: 'none',
                                                    transition: 'border-color 0.2s'
                                                }}
                                                onFocus={e => e.target.style.borderColor = '#007A5E'}
                                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                                            />
                                        </div>

                                        {/* Age */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                                Age <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={newPatient.age}
                                                onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                                                placeholder="Enter age"
                                                min="1" max="120"
                                                style={{
                                                    width: '100%', padding: '11px 14px',
                                                    borderRadius: '12px', border: '2px solid #e5e7eb',
                                                    fontSize: '0.9rem', outline: 'none'
                                                }}
                                                onFocus={e => e.target.style.borderColor = '#007A5E'}
                                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                                            />
                                        </div>

                                        {/* Gender */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
                                                Gender <span style={{ color: '#ef4444' }}>*</span>
                                            </label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                {['M', 'F'].map(g => (
                                                    <button key={g}
                                                        onClick={() => setNewPatient({ ...newPatient, gender: g })}
                                                        style={{
                                                            padding: '11px',
                                                            borderRadius: '12px',
                                                            border: `2px solid ${newPatient.gender === g ? '#007A5E' : '#e5e7eb'}`,
                                                            background: newPatient.gender === g ? '#f0fdf8' : '#fff',
                                                            color: newPatient.gender === g ? '#007A5E' : '#374151',
                                                            fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer',
                                                            transition: 'all 0.2s'
                                                        }}
                                                    >
                                                        {g === 'M' ? '♂ Male' : '♀ Female'}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Relation */}
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                                Relation <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={newPatient.relation}
                                                onChange={(e) => setNewPatient({ ...newPatient, relation: e.target.value })}
                                                placeholder="e.g. Self, Mother, Father, Spouse…"
                                                style={{
                                                    width: '100%', padding: '11px 14px',
                                                    borderRadius: '12px', border: '2px solid #e5e7eb',
                                                    fontSize: '0.9rem', outline: 'none'
                                                }}
                                                onFocus={e => e.target.style.borderColor = '#007A5E'}
                                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                                            />
                                        </div>

                                        {/* Actions */}
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                                            <button
                                                onClick={() => { setShowAddForm(false); setNewPatient({ name: '', age: '', gender: '', relation: '' }); }}
                                                style={{
                                                    flex: 1, padding: '12px',
                                                    borderRadius: '12px', border: '2px solid #e5e7eb',
                                                    background: '#fff', color: '#6b7280',
                                                    fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveNewMember}
                                                style={{
                                                    flex: 2, padding: '12px',
                                                    borderRadius: '12px', border: 'none',
                                                    background: 'linear-gradient(135deg, #007A5E, #00b386)',
                                                    color: '#fff', fontWeight: 700,
                                                    fontSize: '0.9rem', cursor: 'pointer',
                                                    boxShadow: '0 4px 12px rgba(0,122,94,0.3)'
                                                }}
                                            >
                                                Save & Select
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer - Next button */}
                            {!showAddForm && (
                                <div style={{ padding: '14px 20px', borderTop: '1px solid #f3f4f6', background: '#fafafa', flexShrink: 0 }}>
                                    <button
                                        onClick={handleConfirm}
                                        disabled={selectedPatients.length === 0}
                                        style={{
                                            width: '100%', padding: '14px',
                                            borderRadius: '14px', border: 'none',
                                            background: selectedPatients.length > 0
                                                ? 'linear-gradient(135deg, #007A5E, #00b386)'
                                                : '#e5e7eb',
                                            color: selectedPatients.length > 0 ? '#fff' : '#9ca3af',
                                            fontWeight: 700, fontSize: '1rem',
                                            cursor: selectedPatients.length > 0 ? 'pointer' : 'not-allowed',
                                            boxShadow: selectedPatients.length > 0 ? '0 4px 14px rgba(0,122,94,0.3)' : 'none',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {selectedPatients.length > 0
                                            ? `Next  (${selectedPatients.length} selected)`
                                            : 'Select a member to continue'}
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
