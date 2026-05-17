import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminAuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem("adminToken");

    // Don't redirect if we're already on the login page
    if (!adminToken && location.pathname !== "/admin/login") {
      // Redirect to login page if not authenticated and not already on login page
      navigate("/admin/login");
    }
  }, [navigate, location.pathname]);

  // Check if admin is logged in
  const adminToken = localStorage.getItem("adminToken");

  // Allow access to login page even when not authenticated
  if (!adminToken && location.pathname === "/admin/login") {
    return children;
  }

  if (!adminToken) {
    // Don't render children if not authenticated and not on login page
    return null;
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default AdminAuthWrapper;
