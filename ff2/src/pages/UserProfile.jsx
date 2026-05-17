import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Edit2, Save, X } from 'react-feather';
import { baseUrl } from "../utils/config";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India'
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('userToken') || localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/api/v1/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.data);
                setFormData({
                    name: data.data.name || '',
                    email: data.data.email || ''
                });
                localStorage.setItem("userName", data.data.name || "User");
            } else {
                console.error("Profile fetch unsuccessful:", data);
                setError(data.message || "Failed to load profile data");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError(`Profile fetch failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEdit = () => {
        setIsEditing(true);
        setSuccess('');
        setError('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({
            name: user.name || '',
            email: user.email || ''
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('userToken');

        try {
            const response = await fetch(`${baseUrl}/api/v1/auth/updatedetails`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.success) {
                setUser(data.data);
                setIsEditing(false);
                setSuccess('Profile updated successfully!');
                localStorage.setItem("userName", data.data.name || "User");

                // Dispatch event to update header
                window.dispatchEvent(new Event('storage'));

            } else {
                setError(data.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const token = localStorage.getItem('userToken') || localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/" replace />;
    }

    const handleAddressChange = (e) => {
        setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('userToken');
        const currentAddresses = user?.addresses || [];
        const updatedAddresses = [...currentAddresses, newAddress];

        try {
            const response = await fetch(`${baseUrl}/api/v1/auth/updatedetails`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ addresses: updatedAddresses })
            });
            const data = await response.json();

            if (data.success) {
                setUser(data.data);
                setShowAddressForm(false);
                setNewAddress({ street: '', city: '', state: '', zip: '', country: 'India' });
                setSuccess('Address added successfully!');
            } else {
                setError(data.error || 'Failed to add address');
            }
        } catch (error) {
            console.error("Error adding address:", error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) {
        return (
            <div className="container py-5 text-center" style={{ marginTop: '100px' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5" style={{ marginTop: '100px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">


                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-primary text-white p-4 d-flex justify-content-between align-items-center">
                            <h3 className="mb-0 text-white">My Profile</h3>
                            {!isEditing ? (
                                <button
                                    className="btn btn-light btn-sm d-flex align-items-center gap-2"
                                    onClick={handleEdit}
                                >
                                    <Edit2 size={16} /> Edit Profile
                                </button>
                            ) : (
                                <button
                                    className="btn btn-light btn-sm d-flex align-items-center gap-2"
                                    onClick={handleCancel}
                                >
                                    <X size={16} /> Cancel
                                </button>
                            )}
                        </div>
                        <div className="card-body p-4">
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <div className="text-center mb-4">
                                <div
                                    className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-3"
                                    style={{ width: '100px', height: '100px' }}
                                >
                                    <User size={40} className="text-primary" />
                                </div>
                                <h4>{user?.name || 'Guest User'}</h4>
                                <p className="text-muted">{user?.phone ? `+91 ${user.phone}` : 'No phone number'}</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Full Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0"><User size={18} /></span>
                                            <input
                                                type="text"
                                                className={`form-control ${isEditing ? '' : 'bg-light border-start-0'}`}
                                                name="name"
                                                value={isEditing ? formData.name : (user?.name || 'Guest User')}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted">Phone Number</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0"><Phone size={18} /></span>
                                            <input
                                                type="text"
                                                className="form-control bg-light border-start-0"
                                                value={user?.phone || ''}
                                                readOnly
                                                disabled
                                            />
                                        </div>
                                        {isEditing && <div className="form-text">Phone number cannot be changed.</div>}
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label text-muted">Email Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light border-end-0"><Mail size={18} /></span>
                                            <input
                                                type="email"
                                                className={`form-control ${isEditing ? '' : 'bg-light border-start-0'}`}
                                                name="email"
                                                value={isEditing ? formData.email : (user?.email || '')}
                                                onChange={handleChange}
                                                readOnly={!isEditing}
                                                placeholder={isEditing ? "Enter your email" : "No email provided"}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="mt-4 d-flex justify-content-end gap-2">
                                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                                        <button type="submit" className="btn btn-primary d-flex align-items-center gap-2">
                                            <Save size={18} /> Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>

                            {!isEditing && (
                                <div className="mt-5 border-top pt-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="mb-0">Saved Addresses</h5>
                                        {!showAddressForm && (
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => setShowAddressForm(true)}
                                            >
                                                Add New Address
                                            </button>
                                        )}
                                    </div>

                                    {showAddressForm && (
                                        <div className="card mb-4 bg-light border-0">
                                            <div className="card-body">
                                                <h6 className="mb-3">Add New Address</h6>
                                                <form onSubmit={handleSaveAddress}>
                                                    <div className="row g-3">
                                                        <div className="col-12">
                                                            <input type="text" className="form-control" name="street" placeholder="Street Address" value={newAddress.street} onChange={handleAddressChange} required />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input type="text" className="form-control" name="city" placeholder="City" value={newAddress.city} onChange={handleAddressChange} required />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input type="text" className="form-control" name="state" placeholder="State/Province" value={newAddress.state} onChange={handleAddressChange} required />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input type="text" className="form-control" name="zip" placeholder="ZIP / Postal Code" value={newAddress.zip} onChange={handleAddressChange} required />
                                                        </div>
                                                        <div className="col-md-6">
                                                            <input type="text" className="form-control" name="country" value={newAddress.country} disabled />
                                                        </div>
                                                        <div className="col-12 d-flex gap-2 justify-content-end">
                                                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddressForm(false)}>Cancel</button>
                                                            <button type="submit" className="btn btn-primary btn-sm">Save Address</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                    {user?.addresses && user.addresses.length > 0 ? (
                                        <div className="row g-3">
                                            {user.addresses.map((addr, index) => (
                                                <div key={index} className="col-md-6">
                                                    <div className="card card-body h-100 border-light bg-light">
                                                        <div className="d-flex align-items-start gap-3">
                                                            <MapPin size={20} className="text-primary mt-1" />
                                                            <div>
                                                                <p className="mb-1 fw-bold">{addr.street}</p>
                                                                <p className="mb-1 small text-muted">{addr.city}, {addr.state} - {addr.zip}</p>
                                                                <p className="mb-0 small text-muted">{addr.country}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        !showAddressForm && (
                                            <div className="alert alert-light border border-dashed text-center py-4">
                                                <MapPin size={24} className="text-muted mb-2" />
                                                <p className="mb-2 text-muted">No addresses saved yet</p>
                                                <button className="btn btn-outline-primary btn-sm" onClick={() => setShowAddressForm(true)}>Add New Address</button>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
