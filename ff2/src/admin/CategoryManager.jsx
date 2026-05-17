import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    imagePath: "",
    isActive: true,
    isFeatured: false,
    isSelected: false,
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockCategories = [
      {
        id: 1,
        name: "Health Checkup",
        description: "Comprehensive health assessment packages",
        type: "health-package",
        imagePath: "/images/health-checkup.jpg",
        isActive: true,
        isFeatured: true,
        isSelected: true,
      },
      {
        id: 2,
        name: "Special Care",
        description: "Specialized care packages for specific conditions",
        type: "special-care",
        imagePath: "/images/special-care.jpg",
        isActive: true,
        isFeatured: true,
        isSelected: true,
      },
      {
        id: 3,
        name: "Vital Organ",
        description: "Organ-specific health assessments",
        type: "vital-organ",
        imagePath: "/images/vital-organ.jpg",
        isActive: true,
        isFeatured: false,
        isSelected: true,
      },
      {
        id: 4,
        name: "Women Care",
        description: "Health packages designed for women",
        type: "women-care",
        imagePath: "/images/women-care.jpg",
        isActive: true,
        isFeatured: false,
        isSelected: true,
      },
      {
        id: 5,
        name: "Men Care",
        description: "Health packages designed for men",
        type: "men-care",
        imagePath: "/images/men-care.jpg",
        isActive: true,
        isFeatured: false,
        isSelected: true,
      },
    ];

    setCategories(mockCategories);
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
    if (editingCategory) {
      // Update existing category
      setCategories(
        categories.map((category) =>
          category.id === editingCategory.id
            ? { ...formData, id: editingCategory.id }
            : category
        )
      );
    } else {
      // Add new category
      const newCategory = {
        ...formData,
        id: categories.length + 1,
      };
      setCategories([...categories, newCategory]);
    }
    resetForm();
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      type: category.type,
      imagePath: category.imagePath,
      isActive: category.isActive,
      isFeatured: category.isFeatured,
      isSelected: category.isSelected,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((category) => category.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "",
      imagePath: "",
      isActive: true,
      isFeatured: false,
      isSelected: false,
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="admin-content">Loading...</div>;
  }

  return (
    <div className="admin-content">
      <div className="admin-header">
        <h1>Manage Categories</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Category"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>
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
                <label>Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="health-package">Health Package</option>
                  <option value="special-care">Special Care</option>
                  <option value="vital-organ">Vital Organ</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="women-care">Women Care</option>
                  <option value="men-care">Men Care</option>
                </select>
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

            <div className="form-group">
              <label>Image Path</label>
              <input
                type="text"
                name="imagePath"
                value={formData.imagePath}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-checkboxes">
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

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  Featured
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isSelected"
                    checked={formData.isSelected}
                    onChange={handleInputChange}
                  />
                  Selected
                </label>
              </div>
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
                {editingCategory ? "Update Category" : "Add Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-card">
        <h2>Categories</h2>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Selected</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.type}</td>
                  <td>
                    <span
                      className={`status ${
                        category.isActive ? "delivered" : "pending"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status ${
                        category.isFeatured ? "delivered" : "pending"
                      }`}
                    >
                      {category.isFeatured ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status ${
                        category.isSelected ? "delivered" : "pending"
                      }`}
                    >
                      {category.isSelected ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(category.id)}
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

export default CategoryManager;
