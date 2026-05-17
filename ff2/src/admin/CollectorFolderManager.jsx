import React, { useState, useEffect } from 'react';
import apiService from '../utils/api';
import './CollectorFolderManager.css';

const CollectorFolderManager = () => {
    const [folders, setFolders] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingFolder, setEditingFolder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phlebotomistId: '',
        pincodes: '',
        maxOrdersPerHour: 5,
        workingHours: {
            start: 8,
            end: 18
        }
    });

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        setLoading(true);
        try {
            const response = await apiService.getCollectorFolders();
            if (response.success) {
                setFolders(response.data);
            }
        } catch (error) {
            console.error('Error fetching folders:', error);
            alert('Failed to fetch collector folders');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...formData,
                pincodes: formData.pincodes.split(',').map(p => p.trim()).filter(p => p)
            };

            let response;
            if (editingFolder) {
                response = await apiService.updateCollectorFolder(editingFolder._id, data);
            } else {
                response = await apiService.createCollectorFolder(data);
            }

            if (response.success) {
                alert(editingFolder ? 'Folder updated successfully!' : 'Folder created successfully!');
                setShowForm(false);
                setEditingFolder(null);
                fetchFolders();
                resetForm();
            }
        } catch (error) {
            console.error('Error saving folder:', error);
            alert('Failed to save collector folder');
        }
    };

    const handleEdit = (folder) => {
        setEditingFolder(folder);
        setFormData({
            name: folder.name,
            phlebotomistId: folder.phlebotomistId?._id || '',
            pincodes: folder.pincodes.join(', '),
            maxOrdersPerHour: folder.maxOrdersPerHour,
            workingHours: folder.workingHours
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this collector folder?')) {
            return;
        }

        try {
            const response = await apiService.deleteCollectorFolder(id);
            if (response.success) {
                alert('Folder deleted successfully!');
                fetchFolders();
            }
        } catch (error) {
            console.error('Error deleting folder:', error);
            alert('Failed to delete collector folder');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phlebotomistId: '',
            pincodes: '',
            maxOrdersPerHour: 5,
            workingHours: { start: 8, end: 18 }
        });
        setEditingFolder(null);
    };

    const handleCancel = () => {
        setShowForm(false);
        resetForm();
    };

    return (
        <div className="collector-folder-manager">
            <div className="manager-header">
                <h2>
                    <i className="fas fa-folder-open"></i> Collector Folder Management
                </h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        resetForm();
                        setShowForm(!showForm);
                    }}
                >
                    <i className="fas fa-plus"></i> {showForm ? 'Cancel' : 'Add New Folder'}
                </button>
            </div>

            {showForm && (
                <div className="folder-form card shadow-sm mb-4">
                    <div className="card-body">
                        <h3>
                            <i className="fas fa-edit"></i> {editingFolder ? 'Edit' : 'Create'} Collector Folder
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        <i className="fas fa-tag"></i> Folder Name *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="e.g., North Bangalore Team"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        <i className="fas fa-user-md"></i> Phlebotomist ID (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter phlebotomist user ID (optional)"
                                        value={formData.phlebotomistId}
                                        onChange={(e) => setFormData({ ...formData, phlebotomistId: e.target.value })}
                                    />
                                    <small className="text-muted">Leave blank to assign later. Get user ID from Users section.</small>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        <i className="fas fa-map-pin"></i> Pincodes (comma-separated) *
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="560001, 560002, 560003"
                                        value={formData.pincodes}
                                        onChange={(e) => setFormData({ ...formData, pincodes: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        <i className="fas fa-clock"></i> Max Orders Per Hour *
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="1"
                                        max="20"
                                        value={formData.maxOrdersPerHour}
                                        onChange={(e) => setFormData({ ...formData, maxOrdersPerHour: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        <i className="fas fa-hourglass-start"></i> Working Hours Start
                                    </label>
                                    <select
                                        className="form-control"
                                        value={formData.workingHours.start}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            workingHours: { ...formData.workingHours, start: parseInt(e.target.value) }
                                        })}
                                    >
                                        {[...Array(24)].map((_, i) => (
                                            <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        <i className="fas fa-hourglass-end"></i> Working Hours End
                                    </label>
                                    <select
                                        className="form-control"
                                        value={formData.workingHours.end}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            workingHours: { ...formData.workingHours, end: parseInt(e.target.value) }
                                        })}
                                    >
                                        {[...Array(24)].map((_, i) => (
                                            <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-success">
                                    <i className="fas fa-save"></i> {editingFolder ? 'Update' : 'Create'} Folder
                                </button>
                                <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>
                                    <i className="fas fa-times"></i> Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="folders-list">
                <h3>
                    <i className="fas fa-list"></i> Existing Folders ({folders.length})
                </h3>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : folders.length === 0 ? (
                    <div className="alert alert-info">
                        <i className="fas fa-info-circle"></i> No collector folders found. Create one to get started!
                    </div>
                ) : (
                    <div className="row">
                        {folders.map(folder => (
                            <div key={folder._id} className="col-md-6 col-lg-4 mb-4">
                                <div className="folder-card card h-100 shadow-sm">
                                    <div className="card-header bg-primary text-white">
                                        <h5 className="mb-0">
                                            <i className="fas fa-folder"></i> {folder.name}
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="folder-info">
                                            <p>
                                                <strong><i className="fas fa-user-md"></i> Phlebotomist:</strong><br />
                                                {folder.phlebotomistId?.name || 'Not assigned'}
                                                {folder.phlebotomistId?.phone && (
                                                    <small className="d-block text-muted">
                                                        {folder.phlebotomistId.phone}
                                                    </small>
                                                )}
                                            </p>

                                            <p>
                                                <strong><i className="fas fa-map-pin"></i> Pincodes:</strong><br />
                                                <span className="pincodes">
                                                    {folder.pincodes.map((pin, idx) => (
                                                        <span key={idx} className="badge bg-info me-1">{pin}</span>
                                                    ))}
                                                </span>
                                            </p>

                                            <p>
                                                <strong><i className="fas fa-map-marker-alt"></i> Location:</strong><br />
                                                <span className="text-muted">
                                                    {folder.pincodes.length > 0 ? `Serving ${folder.pincodes.length} pincode area${folder.pincodes.length > 1 ? 's' : ''}` : 'No location assigned'}
                                                </span>
                                            </p>

                                            <p>
                                                <strong><i className="fas fa-clock"></i> Max Orders/Hour:</strong>
                                                <span className="badge bg-success ms-2">{folder.maxOrdersPerHour}</span>
                                            </p>

                                            <p>
                                                <strong><i className="fas fa-business-time"></i> Working Hours:</strong><br />
                                                {folder.workingHours.start.toString().padStart(2, '0')}:00 -
                                                {folder.workingHours.end.toString().padStart(2, '0')}:00
                                            </p>

                                            <p>
                                                <strong><i className="fas fa-toggle-on"></i> Status:</strong>
                                                <span className={`badge ms-2 ${folder.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                    {folder.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="card-footer bg-light">
                                        <div className="btn-group w-100">
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleEdit(folder)}
                                            >
                                                <i className="fas fa-edit"></i> Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(folder._id)}
                                            >
                                                <i className="fas fa-trash"></i> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollectorFolderManager;
