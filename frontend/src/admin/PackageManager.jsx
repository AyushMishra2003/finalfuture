import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import "./PackageManager.css";

const PackageManager = () => {
    const [packages, setPackages] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [selectedTests, setSelectedTests] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        shortDescription: "",
        category: "",
        subcategory: "",
        price: "",
        originalPrice: "",
        preparation: "No special preparation required",
        reportsIn: "24-48 hours",
        fastingRequired: false,
        homeSampleCollection: true,
        isActive: true,
        isFeatured: false,
        ageGroup: "All Ages",
        gender: "All",
        benefits: "",
        whoShouldTake: "",
        tags: "",
    });

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://147.93.27.120:3000/api/v1";

    // Fetch packages and tests
    useEffect(() => {
        fetchPackages();
        fetchTests();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/packages`);
            const data = await response.json();
            if (data.success) {
                setPackages(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching packages:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTests = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tests`);
            const data = await response.json();
            if (data.success) {
                setTests(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching tests:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleTestSelection = (testId) => {
        setSelectedTests((prev) => {
            if (prev.includes(testId)) {
                return prev.filter((id) => id !== testId);
            } else {
                return [...prev, testId];
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (selectedTests.length === 0) {
            alert("Please select at least one test for the package");
            return;
        }

        const packageData = {
            ...formData,
            price: Number(formData.price),
            originalPrice: Number(formData.originalPrice),
            includedTests: selectedTests.map((testId) => ({ testId })),
            benefits: formData.benefits.split(",").map((b) => b.trim()).filter((b) => b),
            whoShouldTake: formData.whoShouldTake.split(",").map((w) => w.trim()).filter((w) => w),
            tags: formData.tags.split(",").map((t) => t.trim()).filter((t) => t),
        };

        try {
            const url = editingPackage
                ? `${API_BASE_URL}/packages/${editingPackage._id}`
                : `${API_BASE_URL}/packages`;

            const method = editingPackage ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(packageData),
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message || `Package ${editingPackage ? "updated" : "created"} successfully!`);
                fetchPackages();
                resetForm();
            } else {
                alert(data.message || "Failed to save package");
            }
        } catch (error) {
            console.error("Error saving package:", error);
            alert("Error saving package");
        }
    };

    const handleEdit = (pkg) => {
        setEditingPackage(pkg);
        setFormData({
            name: pkg.name,
            description: pkg.description,
            shortDescription: pkg.shortDescription || "",
            category: pkg.category,
            subcategory: pkg.subcategory || "",
            price: pkg.price,
            originalPrice: pkg.originalPrice || "",
            preparation: pkg.preparation,
            reportsIn: pkg.reportsIn,
            fastingRequired: pkg.fastingRequired,
            homeSampleCollection: pkg.homeSampleCollection,
            isActive: pkg.isActive,
            isFeatured: pkg.isFeatured,
            ageGroup: pkg.ageGroup || "All Ages",
            gender: pkg.gender || "All",
            benefits: pkg.benefits ? pkg.benefits.join(", ") : "",
            whoShouldTake: pkg.whoShouldTake ? pkg.whoShouldTake.join(", ") : "",
            tags: pkg.tags ? pkg.tags.join(", ") : "",
        });
        setSelectedTests(pkg.includedTests.map((t) => t.testId._id || t.testId));
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this package?")) {
            try {
                const response = await fetch(`${API_BASE_URL}/packages/${id}`, {
                    method: "DELETE",
                });

                const data = await response.json();

                if (data.success) {
                    alert("Package deleted successfully!");
                    fetchPackages();
                } else {
                    alert(data.message || "Failed to delete package");
                }
            } catch (error) {
                console.error("Error deleting package:", error);
                alert("Error deleting package");
            }
        }
    };

    const toggleStatus = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/packages/${id}/toggle-active`, {
                method: "PATCH",
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                fetchPackages();
            } else {
                alert(data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error toggling status:", error);
            alert("Error updating status");
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            shortDescription: "",
            category: "",
            subcategory: "",
            price: "",
            originalPrice: "",
            preparation: "No special preparation required",
            reportsIn: "24-48 hours",
            fastingRequired: false,
            homeSampleCollection: true,
            isActive: true,
            isFeatured: false,
            ageGroup: "All Ages",
            gender: "All",
            benefits: "",
            whoShouldTake: "",
            tags: "",
        });
        setSelectedTests([]);
        setEditingPackage(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="admin-content">Loading...</div>;
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Manage Health Packages</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Cancel" : "Create New Package"}
                </button>
            </div>

            {showForm && (
                <div className="form-card">
                    <h2>{editingPackage ? "Edit Package" : "Create New Package"}</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Basic Information */}
                        <div className="form-section">
                            <h3>Basic Information</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Package Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Complete Health Checkup"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Health Checkup">Health Checkup</option>
                                        <option value="Special Care">Special Care</option>
                                        <option value="Vital Organ">Vital Organ</option>
                                        <option value="Women Care">Women Care</option>
                                        <option value="Men Care">Men Care</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                        <option value="Exclusive">Exclusive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Short Description</label>
                                <input
                                    type="text"
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleInputChange}
                                    placeholder="Brief one-line description"
                                    maxLength="200"
                                />
                            </div>

                            <div className="form-group">
                                <label>Full Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Detailed description of the package"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="form-section">
                            <h3>Pricing</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Original Price (₹)</label>
                                    <input
                                        type="number"
                                        name="originalPrice"
                                        value={formData.originalPrice}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Test Selection */}
                        <div className="form-section">
                            <h3>Select Tests to Include *</h3>
                            <div className="test-selection-grid">
                                {tests.map((test) => (
                                    <div key={test._id} className="test-checkbox-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={selectedTests.includes(test._id)}
                                                onChange={() => handleTestSelection(test._id)}
                                            />
                                            <span className="test-name">{test.name}</span>
                                            <span className="test-category">({test.category})</span>
                                            <span className="test-price">₹{test.price}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <p className="selected-count">
                                Selected: {selectedTests.length} test(s)
                            </p>
                        </div>

                        {/* Test Details */}
                        <div className="form-section">
                            <h3>Test Details</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Preparation</label>
                                    <input
                                        type="text"
                                        name="preparation"
                                        value={formData.preparation}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 8 hours fasting required"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Reports In</label>
                                    <input
                                        type="text"
                                        name="reportsIn"
                                        value={formData.reportsIn}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 24-48 hours"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Age Group</label>
                                    <select
                                        name="ageGroup"
                                        value={formData.ageGroup}
                                        onChange={handleInputChange}
                                    >
                                        <option value="All Ages">All Ages</option>
                                        <option value="Children">Children</option>
                                        <option value="Youth">Youth</option>
                                        <option value="Adults">Adults</option>
                                        <option value="Seniors">Seniors</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="All">All</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="form-section">
                            <h3>Additional Information</h3>
                            <div className="form-group">
                                <label>Benefits (comma separated)</label>
                                <textarea
                                    name="benefits"
                                    value={formData.benefits}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="e.g., Early disease detection, Comprehensive health assessment"
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Who Should Take (comma separated)</label>
                                <textarea
                                    name="whoShouldTake"
                                    value={formData.whoShouldTake}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="e.g., People above 40, Those with family history of diabetes"
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Tags (comma separated)</label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="e.g., popular, trending, recommended"
                                />
                            </div>
                        </div>

                        {/* Status Checkboxes */}
                        <div className="form-section">
                            <h3>Status</h3>
                            <div className="checkbox-group-row">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="fastingRequired"
                                        checked={formData.fastingRequired}
                                        onChange={handleInputChange}
                                    />
                                    Fasting Required
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="homeSampleCollection"
                                        checked={formData.homeSampleCollection}
                                        onChange={handleInputChange}
                                    />
                                    Home Sample Collection
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleInputChange}
                                    />
                                    Active
                                </label>
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleInputChange}
                                    />
                                    Featured
                                </label>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingPackage ? "Update Package" : "Create Package"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Packages Table */}
            <div className="table-card">
                <h2>Health Packages ({packages.length})</h2>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Tests</th>
                                <th>Price</th>
                                <th>Discount</th>
                                <th>Status</th>
                                <th>Featured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.length === 0 ? (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No packages found. Create your first package!
                                    </td>
                                </tr>
                            ) : (
                                packages.map((pkg) => (
                                    <tr key={pkg._id}>
                                        <td>
                                            <strong>{pkg.name}</strong>
                                            {pkg.shortDescription && (
                                                <div className="text-muted small">
                                                    {pkg.shortDescription}
                                                </div>
                                            )}
                                        </td>
                                        <td>{pkg.category}</td>
                                        <td>{pkg.totalTests || pkg.includedTests?.length || 0}</td>
                                        <td>
                                            <div>₹{pkg.price}</div>
                                            {pkg.originalPrice && (
                                                <div className="text-muted small">
                                                    <del>₹{pkg.originalPrice}</del>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {pkg.discountPercentage > 0 && (
                                                <span className="badge badge-success">
                                                    {pkg.discountPercentage}% OFF
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <span
                                                className={`status ${pkg.isActive ? "delivered" : "pending"
                                                    }`}
                                                onClick={() => toggleStatus(pkg._id)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {pkg.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            {pkg.isFeatured && (
                                                <span className="badge badge-warning">⭐ Featured</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="btn btn-sm btn-secondary"
                                                    onClick={() => handleEdit(pkg)}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleDelete(pkg._id)}
                                                >
                                                    Delete
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

export default PackageManager;
