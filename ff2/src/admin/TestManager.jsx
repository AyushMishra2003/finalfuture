import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const TestManager = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    originalPrice: "",
    includes: "",
    preparation: "",
    reportsIn: "",
    isActive: true,
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockTests = [
      {
        id: 1,
        name: "Comprehensive Health Checkup",
        description: "Complete health assessment with 85+ parameters",
        category: "Health Checkup",
        price: 1299,
        originalPrice: 1999,
        includes: ["Blood Test", "Urine Test", "ECG"],
        preparation: "8 hours fasting required",
        reportsIn: "24 hours",
        isActive: true,
      },
      {
        id: 2,
        name: "Diabetes Care",
        description: "Comprehensive diabetes monitoring panel",
        category: "Special Care",
        price: 899,
        originalPrice: 1299,
        includes: ["Fasting Blood Sugar", "Post Prandial", "HbA1c"],
        preparation: "8 hours fasting required",
        reportsIn: "12 hours",
        isActive: true,
      },
      {
        id: 3,
        name: "Thyroid Function",
        description: "Complete thyroid function assessment",
        category: "Vital Organ",
        price: 699,
        originalPrice: 999,
        includes: ["T3", "T4", "TSH"],
        preparation: "No fasting required",
        reportsIn: "24 hours",
        isActive: true,
      },
    ];

    setTests(mockTests);
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTest) {
      // Update existing test
      setTests(
        tests.map((test) =>
          test.id === editingTest.id
            ? { ...formData, id: editingTest.id }
            : test
        )
      );
    } else {
      // Add new test
      const newTest = {
        ...formData,
        id: tests.length + 1,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
      };
      setTests([...tests, newTest]);
    }
    resetForm();
  };

  const handleEdit = (test) => {
    setEditingTest(test);
    setFormData({
      name: test.name,
      description: test.description,
      category: test.category,
      price: test.price,
      originalPrice: test.originalPrice,
      includes: test.includes.join(", "),
      preparation: test.preparation,
      reportsIn: test.reportsIn,
      isActive: test.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      setTests(tests.filter((test) => test.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price: "",
      originalPrice: "",
      includes: "",
      preparation: "",
      reportsIn: "",
      isActive: true,
    });
    setEditingTest(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="admin-content">Loading...</div>;
  }

  return (
    <div className="admin-content">
      <div className="admin-header">
        <h1>Manage Tests & Packages</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Test"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingTest ? "Edit Test" : "Add New Test"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
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
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
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
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                required
              ></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Includes (comma separated)</label>
                <input
                  type="text"
                  name="includes"
                  value={formData.includes}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Reports In</label>
                <input
                  type="text"
                  name="reportsIn"
                  value={formData.reportsIn}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Preparation</label>
              <input
                type="text"
                name="preparation"
                value={formData.preparation}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                Active
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingTest ? "Update Test" : "Add Test"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <h2>Tests & Packages</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Original Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id}>
                  <td>{test.name}</td>
                  <td>{test.category}</td>
                  <td>₹{test.price}</td>
                  <td>₹{test.originalPrice}</td>
                  <td>
                    <span
                      className={`status ${
                        test.isActive ? "delivered" : "pending"
                      }`}
                    >
                      {test.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(test)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(test.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TestManager;
