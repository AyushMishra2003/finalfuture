import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import { baseUrl } from "../utils/config";

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        verifiedUsers: 0,
        adminUsers: 0,
        newUsers: 0
    });

    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            const response = await axios.get(`${baseUrl}/api/v1/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await axios.get(`${baseUrl}/api/v1/users/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStats(response.data.data);
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem("adminToken");
            await axios.patch(
                `${baseUrl}/api/v1/users/${userId}/role`,
                { role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            fetchUsers();
            fetchStats();
            alert("User role updated successfully!");
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update user role. Please try again.");
        }
    };

    const handleVerificationToggle = async (userId) => {
        try {
            const token = localStorage.getItem("adminToken");
            await axios.patch(
                `${baseUrl}/api/v1/users/${userId}/verify`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            fetchUsers();
            fetchStats();
            alert("User verification status updated!");
        } catch (error) {
            console.error("Error updating verification:", error);
            alert("Failed to update verification status. Please try again.");
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                const token = localStorage.getItem("adminToken");
                await axios.delete(`${baseUrl}/api/v1/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                fetchUsers();
                fetchStats();
                alert("User deleted successfully!");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user. Please try again.");
            }
        }
    };

    const handleViewDetails = async (userId) => {
        try {
            const token = localStorage.getItem("adminToken");
            const response = await axios.get(`${baseUrl}/api/v1/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setSelectedUser(response.data.data);
            setShowModal(true);
        } catch (error) {
            console.error("Error fetching user details:", error);
            alert("Failed to fetch user details.");
        }
    };

    // Filter and search logic
    const filteredUsers = users.filter((user) => {
        const matchesFilter = filter === "all" || user.role === filter;
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm);
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="admin-content">
                <div className="loading-spinner">Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-content">
                <div className="error-message">{error}</div>
                <button onClick={fetchUsers} className="btn btn-primary">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="admin-content">
            <div className="admin-header">
                <h1>User Management</h1>
                <div className="filter-controls">
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-control search-input"
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="form-control filter-select"
                    >
                        <option value="all">All Users</option>
                        <option value="user">Regular Users</option>
                        <option value="admin">Admins</option>
                    </select>
                    <button onClick={fetchUsers} className="btn btn-secondary">
                        <i className="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-cards">
                <div className="stat-card">
                    <div className="stat-card-icon bg-primary">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-card-info">
                        <h3>{stats.totalUsers}</h3>
                        <p>Total Users</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon bg-success">
                        <i className="fas fa-user-check"></i>
                    </div>
                    <div className="stat-card-info">
                        <h3>{stats.verifiedUsers}</h3>
                        <p>Verified Users</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon bg-warning">
                        <i className="fas fa-user-shield"></i>
                    </div>
                    <div className="stat-card-info">
                        <h3>{stats.adminUsers}</h3>
                        <p>Admins</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-card-icon bg-info">
                        <i className="fas fa-user-plus"></i>
                    </div>
                    <div className="stat-card-info">
                        <h3>{stats.newUsers}</h3>
                        <p>New (30 days)</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="table-card">
                <h2>Users ({filteredUsers.length})</h2>
                <div className="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Verified</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: "center" }}>
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.name || "N/A"}</td>
                                        <td>{user.email || "N/A"}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                className="form-control role-select"
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleVerificationToggle(user._id)}
                                                className={`status ${user.isVerified ? "delivered" : "pending"}`}
                                                style={{ cursor: "pointer", border: "none" }}
                                            >
                                                {user.isVerified ? "✓ Verified" : "✗ Unverified"}
                                            </button>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => handleViewDetails(user._id)}
                                                    className="btn btn-info btn-sm"
                                                    title="View Details"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    className="btn btn-danger btn-sm"
                                                    title="Delete User"
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

            {/* User Details Modal */}
            {showModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>User Details</h2>
                            <button onClick={() => setShowModal(false)} className="close-btn">
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="user-detail-grid">
                                <div className="detail-item">
                                    <strong>Name:</strong>
                                    <span>{selectedUser.name || "N/A"}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Email:</strong>
                                    <span>{selectedUser.email || "N/A"}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Phone:</strong>
                                    <span>{selectedUser.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Role:</strong>
                                    <span className={`badge ${selectedUser.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>
                                        {selectedUser.role}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <strong>Verified:</strong>
                                    <span className={`badge ${selectedUser.isVerified ? 'badge-success' : 'badge-danger'}`}>
                                        {selectedUser.isVerified ? "Yes" : "No"}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <strong>Joined:</strong>
                                    <span>{new Date(selectedUser.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="detail-item">
                                    <strong>Total Orders:</strong>
                                    <span>{selectedUser.orders?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManager;
