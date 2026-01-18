import React, { useState, useEffect } from "react";
import { baseUrl } from "../utils/config";
import { X } from "react-feather";

const LoginSidebar = ({ isOpen, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length !== 10) {
      setMessage("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/otp/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();
      if (data.success) {
        setShowOtpForm(true);
        if (data.otp) {
          setMessage(`OTP sent successfully! (Dev Code: ${data.otp})`);
        } else {
          setMessage("OTP sent successfully!");
        }
      } else {
        setMessage(data.message || "Failed to send OTP");
      }
    } catch (error) {
      setMessage("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber, otp }),
      });

      const data = await response.json();
      if (data.success) {
        const token = data.token;
        localStorage.setItem("userToken", token);
        localStorage.setItem("token", token);
        localStorage.setItem("userId", data.data.id);
        localStorage.setItem("userName", data.data.name || "User");
        localStorage.setItem("userPhone", data.data.phone);
        setMessage("Login successful!");

        setTimeout(() => {
          onClose(); // Close sidebar using prop
          window.location.reload();
        }, 1000);
      } else {
        setMessage(data.message || "Invalid OTP");
      }
    } catch (error) {
      setMessage("Error verifying OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/v1/auth/otp/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("OTP resent successfully!");
      } else {
        setMessage(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setMessage("Error resending OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setShowOtpForm(false);
    setPhoneNumber("");
    setOtp("");
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="position-fixed top-0 start-0 h-100 bg-white shadow"
        style={{
          width: "100%",
          maxWidth: "400px",
          zIndex: "1060",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease-in-out"
        }}
      >
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="mb-0">Login / Sign Up</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div className="login-form-container p-4">
          <div className="login-banner mb-4 text-center">
            <img
              src={`${process.env.PUBLIC_URL}/images/logo/WhatsApp Image 2025-08-19 at 17.38.25_562bb83d.jpg`}
              alt="Login Banner"
              className="img-fluid"
              style={{ maxWidth: "200px", height: "auto" }}
            />
          </div>
          {!showOtpForm ? (
            <form onSubmit={handlePhoneSubmit}>
              <h4 className="text-center mb-4">Login with Phone Number</h4>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <div className="input-group">
                  <span className="input-group-text">+91</span>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter 10-digit phone number"
                    maxLength="10"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit}>
              <h4 className="text-center mb-4">Enter OTP</h4>
              <p className="text-center">OTP sent to +91{phoneNumber}</p>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label">
                  OTP
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg text-center"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  required
                />
              </div>
              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-success btn-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>

              <div className="mt-3 text-center">
                <p className="mb-2">
                  Didn't receive the code?
                  <button
                    type="button"
                    className="btn btn-link p-0 ms-2"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    Resend Code
                  </button>
                </p>
                <p>
                  <button
                    type="button"
                    className="btn btn-link p-0"
                    onClick={handleChangeNumber}
                  >
                    Change Number
                  </button>
                </p>
              </div>
            </form>
          )}

          {message && (
            <div
              className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"
                } mt-3`}
              role="alert"
            >
              {message}
            </div>
          )}
        </div>
      </div>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
        style={{ zIndex: "1050" }}
        onClick={onClose}
      ></div>
    </>
  );
};

export default LoginSidebar;
