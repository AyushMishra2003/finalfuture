import React, { useState } from "react";
import apiService from "../utils/api";

// Component for sending OTP using the backend API
export default function SendOtpComponent() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);

  // Generate OTP via backend
  const generateOtp = async (e) => {
    e.preventDefault();
    if (!phone) {
      setStatus({ type: "error", message: "Please enter phone number" });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      const response = await apiService.generateOTP({ phone });

      if (response.success) {
        setShowOtpForm(true);
        setStatus({ type: "success", message: response.message });
      } else {
        setStatus({
          type: "error",
          message: response.message || "Failed to generate OTP",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to generate OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP via backend
  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setStatus({ type: "error", message: "Please enter OTP" });
      return;
    }

    try {
      setLoading(true);
      setStatus(null);

      const response = await apiService.verifyOTP({ phone, otp });

      if (response.success) {
        setStatus({ type: "success", message: "OTP verified successfully!" });
        // Reset form after successful verification
        setPhone("");
        setOtp("");
        setShowOtpForm(false);
      } else {
        setStatus({
          type: "error",
          message: response.message || "Invalid OTP",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to verify OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setStatus(null);

      const response = await apiService.generateOTP({ phone });

      if (response.success) {
        setStatus({ type: "success", message: response.message });
      } else {
        setStatus({
          type: "error",
          message: response.message || "Failed to resend OTP",
        });
      }
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Failed to resend OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setShowOtpForm(false);
    setPhone("");
    setOtp("");
    setStatus(null);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Send OTP via FutureLabs</h2>

      {!showOtpForm ? (
        <form onSubmit={generateOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9746725584"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate OTP"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1">
              <input
                type="tel"
                value={phone}
                readOnly
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <div className="mt-1">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Resend
            </button>

            <button
              type="button"
              onClick={handleChangeNumber}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Change Number
            </button>
          </div>
        </form>
      )}

      {status && (
        <div
          className={`mt-4 p-3 rounded-md ${
            status.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          <p className="text-sm">{status.message}</p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>
          <strong>Note:</strong> This component uses the secure backend API to
          send OTPs via BhashSMS.
        </p>
        <p>
          The actual SMS sending is handled server-side to protect API
          credentials.
        </p>
      </div>
    </div>
  );
}
