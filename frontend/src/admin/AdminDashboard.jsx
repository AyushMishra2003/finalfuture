import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import TestManager from "./TestManager";
import CategoryManager from "./CategoryManager";
import OrderManager from "./OrderManager";
import PackageManager from "./PackageManager";
import UserManager from "./UserManager";
import BannerManager from "./BannerManager";
import LocationManager from "./LocationManager";
import ReportsManager from "./ReportsManager";
import CollectorFolderManager from "./CollectorFolderManager";
import OrderAssignment from "./OrderAssignment";
import "./AdminDashboard.css";

// Mock data for demonstration
const mockTestData = [
  { name: "Blood Test", category: "Health Checkup", price: 499, orders: 120 },
  { name: "Diabetes Panel", category: "Special Care", price: 899, orders: 85 },
  { name: "Thyroid Test", category: "Vital Organ", price: 699, orders: 95 },
  { name: "Liver Function", category: "Vital Organ", price: 799, orders: 78 },
  { name: "Kidney Profile", category: "Vital Organ", price: 899, orders: 65 },
];

const mockOrderData = [
  { name: "Jan", orders: 45 },
  { name: "Feb", orders: 52 },
  { name: "Mar", orders: 48 },
  { name: "Apr", orders: 78 },
  { name: "May", orders: 65 },
  { name: "Jun", orders: 82 },
];

const mockCategoryData = [
  { name: "Health Checkup", value: 35 },
  { name: "Special Care", value: 25 },
  { name: "Vital Organ", value: 20 },
  { name: "Women Care", value: 10 },
  { name: "Men Care", value: 10 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove admin token and redirect to login
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "tests":
        return <TestManager />;
      case "packages":
        return <PackageManager />;
      case "categories":
        return <CategoryManager />;
      case "orders":
        return <OrderManager />;
      case "users":
        return <UserManager />;
      case "banners":
        return <BannerManager />;
      case "locations":
        return <LocationManager />;
      case "reports":
        return <ReportsManager />;
      case "bookings":
        return <CollectorFolderManager />;
      case "order-assignment":
        return <OrderAssignment />;
      default: // dashboard
        return (
          <div className="admin-content">
            {/* Stats Cards */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-card-icon bg-primary">
                  <i className="fas fa-flask"></i>
                </div>
                <div className="stat-card-info">
                  <h3>128</h3>
                  <p>Total Tests</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon bg-success">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="stat-card-info">
                  <h3>342</h3>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon bg-warning">
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-card-info">
                  <h3>1,254</h3>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon bg-info">
                  <i className="fas fa-rupee-sign"></i>
                </div>
                <div className="stat-card-info">
                  <h3>₹4,82,340</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="charts-container">
              <div className="chart-card">
                <h3>Orders Overview</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockOrderData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="orders" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h3>Category Distribution</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {mockCategoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
              <h3>Recent Orders</h3>
              <div className="activity-table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#FL2025001</td>
                      <td>John Doe</td>
                      <td>2025-09-20</td>
                      <td>₹1,299</td>
                      <td>
                        <span className="status delivered">Delivered</span>
                      </td>
                    </tr>
                    <tr>
                      <td>#FL2025002</td>
                      <td>Jane Smith</td>
                      <td>2025-09-20</td>
                      <td>₹899</td>
                      <td>
                        <span className="status processing">Processing</span>
                      </td>
                    </tr>
                    <tr>
                      <td>#FL2025003</td>
                      <td>Robert Johnson</td>
                      <td>2025-09-19</td>
                      <td>₹1,599</td>
                      <td>
                        <span className="status shipped">Shipped</span>
                      </td>
                    </tr>
                    <tr>
                      <td>#FL2025004</td>
                      <td>Emily Davis</td>
                      <td>2025-09-19</td>
                      <td>₹699</td>
                      <td>
                        <span className="status pending">Pending</span>
                      </td>
                    </tr>
                    <tr>
                      <td>#FL2025005</td>
                      <td>Michael Wilson</td>
                      <td>2025-09-18</td>
                      <td>₹2,199</td>
                      <td>
                        <span className="status delivered">Delivered</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <h2>FutureLabs Admin</h2>
        </div>
        <ul className="admin-nav">
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </li>
          <li
            className={activeTab === "tests" ? "active" : ""}
            onClick={() => setActiveTab("tests")}
          >
            <i className="fas fa-flask"></i> Tests & Packages
          </li>
          <li
            className={activeTab === "packages" ? "active" : ""}
            onClick={() => setActiveTab("packages")}
          >
            <i className="fas fa-box"></i> Health Packages
          </li>
          <li
            className={activeTab === "categories" ? "active" : ""}
            onClick={() => setActiveTab("categories")}
          >
            <i className="fas fa-tags"></i> Categories
          </li>
          <li
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            <i className="fas fa-shopping-cart"></i> Orders
          </li>
          <li
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            <i className="fas fa-users"></i> Users
          </li>
          <li
            className={activeTab === "banners" ? "active" : ""}
            onClick={() => setActiveTab("banners")}
          >
            <i className="fas fa-image"></i> Banners
          </li>
          <li
            className={activeTab === "locations" ? "active" : ""}
            onClick={() => setActiveTab("locations")}
          >
            <i className="fas fa-map-marker-alt"></i> Locations
          </li>
          <li
            className={activeTab === "reports" ? "active" : ""}
            onClick={() => setActiveTab("reports")}
          >
            <i className="fas fa-chart-bar"></i> Reports
          </li>
          <li
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            <i className="fas fa-calendar-check"></i> Booking Management
          </li>
          <li
            className={activeTab === "order-assignment" ? "active" : ""}
            onClick={() => setActiveTab("order-assignment")}
          >
            <i className="fas fa-user-md"></i> Order Assignment
          </li>
          <li onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
          </div>
          <div className="admin-header-right">
            <div className="admin-user">
              <i className="fas fa-user-circle"></i>
              <span>Admin User</span>
            </div>
          </div>
        </div>

        {/* Render active content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
