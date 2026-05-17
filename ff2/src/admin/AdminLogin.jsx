import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  const adminToken = localStorage.getItem("adminToken");
  if (adminToken) {
    return <Navigate to="/admin" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      if (
        credentials.username === "admin" &&
        credentials.password === "admin123"
      ) {
        // Successful login - redirect to admin dashboard
        localStorage.setItem("adminToken", "admin-token-123");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <h1>FutureLabs Admin</h1>
          <p>Sign in to access your admin dashboard</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" name="remember" />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2025 FutureLabs. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
