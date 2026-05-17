import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const BannerManager = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        imageUrl: "",
        linkUrl: "",
        bannerType: "main",
        displayOrder: 1,
        isActive: true
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const response = await axios.get("/api/v1/banners");
            setBanners(response.data.data);
        } catch (error) {
            console.error("Error fetching banners:", error);
            alert("Failed to fetch banners");
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
            if (editingBanner) {
                await axios.put(`/api/v1/banners/${editingBanner._id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Banner updated successfully!");
            } else {
                await axios.post("/api/v1/banners", formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Banner created successfully!");
            }
            resetForm();
            fetchBanners();
        } catch (error) {
            console.error("Error saving banner:", error);
            alert("Failed to save banner. Please try again.");
        }
    };

    const handleEdit = (banner) => {
        setEditingBanner(banner);
        setFormData({
            title: banner.title,
            description: banner.description,
            imageUrl: banner.imageUrl,
            linkUrl: banner.linkUrl,
            bannerType: banner.bannerType,
            displayOrder: banner.displayOrder,
            isActive: banner.isActive
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            try {
                const token = localStorage.getItem("adminToken");
                await axios.delete(`/api/v1/banners/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Banner deleted successfully!");
                fetchBanners();
            } catch (error) {
                console.error("Error deleting banner:", error);
                alert("Failed to delete banner. Please try again.");
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            imageUrl: "",
            linkUrl: "",
            bannerType: "main",
            displayOrder: 1,
            isActive: true
        });
        setEditingBanner(null);
        setShowForm(false);
    };

    if (loading) return <div className="admin-content">Loading banners...</div>;

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>Banner Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    {showForm ? "Cancel" : "+ Add New Banner"}
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="form-card">
                    <h2>{editingBanner ? "Edit Banner" : "Add New Banner"}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                    placeholder="Enter banner title"
                                />
                            </div>

                            <div className="form-group">
                                <label>Banner Type *</label>
                                <select
                                    name="bannerType"
                                    value={formData.bannerType}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                >
                                    <option value="main">Main Banner</option>
                                    <option value="bottom">Bottom Banner</option>
                                </select>
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="form-control"
                                    placeholder="Enter banner description"
                                />
                            </div>

                            <div className="form-group">
                                <label>Image URL *</label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleInputChange}
                                    required
                                    className="form-control"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="form-group">
                                <label>Link URL</label>
                                <input
                                    type="url"
                                    name="linkUrl"
                                    value={formData.linkUrl}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    placeholder="https://example.com/page"
                                />
                            </div>

                            <div className="form-group">
                                <label>Display Order</label>
                                <input
                                    type="number"
                                    name="displayOrder"
                                    value={formData.displayOrder}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="form-control"
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

                        {formData.imageUrl && (
                            <div className="image-preview">
                                <label>Preview:</label>
                                <img
                                    src={formData.imageUrl}
                                    alt="Banner preview"
                                    style={{ maxWidth: "100%", maxHeight: "200px", marginTop: "10px", borderRadius: "8px" }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        )}

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingBanner ? "Update Banner" : "Create Banner"}
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

            {/* Banners List */}
            <div className="table-card">
                <h2>Banners ({banners.length})</h2>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Order</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banners.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        No banners found. Create your first banner!
                                    </td>
                                </tr>
                            ) : (
                                banners.map((banner) => (
                                    <tr key={banner._id}>
                                        <td>
                                            <img
                                                src={banner.imageUrl}
                                                alt={banner.title}
                                                style={{
                                                    width: "100px",
                                                    height: "50px",
                                                    objectFit: "cover",
                                                    borderRadius: "4px"
                                                }}
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/100x50?text=No+Image';
                                                }}
                                            />
                                        </td>
                                        <td>{banner.title}</td>
                                        <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {banner.description || "N/A"}
                                        </td>
                                        <td>
                                            <span className={`badge ${banner.bannerType === 'main' ? 'badge-info' : 'badge-warning'}`}>
                                                {banner.bannerType}
                                            </span>
                                        </td>
                                        <td>{banner.displayOrder}</td>
                                        <td>
                                            <span className={`status ${banner.isActive ? 'delivered' : 'pending'}`}>
                                                {banner.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => handleEdit(banner)}
                                                    className="btn btn-info btn-sm"
                                                    title="Edit Banner"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(banner._id)}
                                                    className="btn btn-danger btn-sm"
                                                    title="Delete Banner"
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

export default BannerManager;
