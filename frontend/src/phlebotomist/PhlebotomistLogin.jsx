import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PhlebotomistLogin.css';

const PhlebotomistLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://147.93.27.120:3000/api/v1/collector/login', {
                phone: formData.phone,
                password: formData.password
            });

            if (response.data.success) {
                // Store token and user info
                localStorage.setItem('collectorToken', response.data.token);
                localStorage.setItem('collectorUser', JSON.stringify(response.data.user));

                // Redirect to dashboard
                navigate('/phlebotomist/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="phlebotomist-login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-circle">
                        <span className="logo-text">FL</span>
                    </div>
                    <h1>FutureLabs24.com</h1>
                    <h2>Phlebotomist Login</h2>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i>
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="phone">
                            <i className="fas fa-phone"></i> Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="Enter 10-digit phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            maxLength="10"
                            pattern="[0-9]{10}"
                            autoComplete="tel"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <i className="fas fa-lock"></i> Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Logging in...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-sign-in-alt"></i> Login
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Authorized Personnel Only</p>
                    <a href="/" className="back-home">
                        <i className="fas fa-home"></i> Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PhlebotomistLogin;
