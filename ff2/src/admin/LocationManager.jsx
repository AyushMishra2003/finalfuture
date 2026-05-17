import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const LocationManager = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        email: "",
        isActive: true
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/v1/locations");
            setLocations(response.data.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
            alert("Failed to fetch locations");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("adminToken");
            if (editingLocation) {
                await axios.put(`/api/v1/locations/${editingLocation._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Location updated successfully!");
            } else {
                await axios.post("/api/v1/locations", formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Location created successfully!");
            }
            resetForm();
            fetchLocations();
        } catch (error) {
            console.error("Error saving location:", error);
            alert("Failed to save location. Please try again.");
        }
    };

    const handleEdit = (location) => {
        setEditingLocation(location);
        setFormData({
            name: location.name,
            address: location.address,
            city: location.city,
            state: location.state || "",
            pincode: location.pincode,
            phone: location.phone || "",
            email: location.email || "",
            isActive: location.isActive
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this location?")) {
            try {
                const token = localStorage.getItem("adminToken");
                await axios.delete(`/api/v1/locations/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Location deleted successfully!");
                fetchLocations();
            } catch (error) {
                console.error("Error deleting location:", error);
                alert("Failed to delete location. Please try again.");
            }
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem("adminToken");
            await axios.patch(
                `/api/v1/locations/${id}`,
                { isActive: !currentStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchLocations();
        } catch (error) {
            console.error("Error toggling status:", error);
            alert("Failed to update status. Please try again.");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            phone: "",
            email: "",
            isActive: true
        });
        setEditingLocation(null);
        setShowForm(false);
    };

    if (loading) return <div className="admin-content">Loading locations...</div>;

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Location Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    {showForm ? "Cancel" : "+ Add New Location"}
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="form-card">
                    <h2>{editingLocation ? "Edit Location" : "Add New Location"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Location Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                    placeholder="Enter location name"
                                />
                            </div>

                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                    placeholder="Enter city"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Address *</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                    rows="2"
                                    className="form-control"
                                    placeholder="Enter full address"
                                />
                            </div>

                            <div className="form-group">
                                <label>State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Enter state"
                                />
                            </div>

                            <div className="form-group">
                                <label>Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                    placeholder="Enter pincode"
                                    pattern="[0-9]{6}"
                                    title="Please enter a valid 6-digit pincode"
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Enter phone number"
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10-digit phone number"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                    />
                                    <span style={{ marginLeft: "8px" }}>Active</span>
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingLocation ? "Update Location" : "Create Location"}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Locations List */}
            <div className="table-card">
                <h2>Locations ({locations.length})</h2>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Pincode</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        No locations found. Add your first location!
                                    </td>
                                </tr>
                            ) : (
                                locations.map((location) => (
                                    <tr key={location._id}>
                                        <td>{location.name}</td>
                                        <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {location.address}
                                        </td>
                                        <td>{location.city}</td>
                                        <td>{location.pincode}</td>
                                        <td>{location.phone || "N/A"}</td>
                                        <td>
                                            <button
                                                onClick={() => toggleStatus(location._id, location.isActive)}
                                                className={`status ${location.isActive ? 'delivered' : 'pending'}`}
                                                style={{ cursor: "pointer", border: "none" }}
                                            >
                                                {location.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => handleEdit(location)}
                                                    className="btn btn-info btn-sm"
                                                    title="Edit Location"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(location._id)}
                                                    className="btn btn-danger btn-sm"
                                                    title="Delete Location"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LocationManager;
