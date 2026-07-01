import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { baseUrl } from "../utils/config";
import { mergeGuestCartOnLogin } from "../utils/cart";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("error");
  const [done, setDone] = useState(false);

  const T = "#2e9d91";

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { setType("error"); return setMsg("Password must be at least 6 characters"); }
    if (password !== confirm) { setType("error"); return setMsg("Passwords do not match"); }
    setLoading(true); setMsg("");
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/resetpassword/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        // Log the user straight in
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.data.id);
        localStorage.setItem("userName", data.data.name || "User");
        localStorage.setItem("userPhone", data.data.phone || "");
        try { await mergeGuestCartOnLogin(); } catch (e) { /* non-blocking */ }
        setDone(true); setType("success"); setMsg("Password updated! Redirecting…");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setType("error"); setMsg(data.error || "Invalid or expired reset link");
      }
    } catch {
      setType("error"); setMsg("Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#eef2f7", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Segoe UI, Roboto, sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 8px 32px rgba(31,112,104,.1)", width: "100%", maxWidth: 420, overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(135deg,#2e9d91,#1f7068)", padding: "26px", textAlign: "center" }}>
          <img src="/images/logo/favicon.jpg" alt="FutureLabs" style={{ width: 52, height: 52, borderRadius: 12, objectFit: "cover" }} />
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, marginTop: 8 }}>FutureLabs</div>
        </div>
        <div style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 6px", color: "#1a1d2e" }}>Set a new password</h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 20px" }}>Choose a strong password for your account.</p>

          {!done && (
            <form onSubmit={submit}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters"
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8ecf4", fontSize: 14, margin: "6px 0 16px" }} required />
              <label style={{ fontSize: 13, fontWeight: 600 }}>Confirm Password</label>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter password"
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8ecf4", fontSize: 14, margin: "6px 0 20px" }} required />
              <button type="submit" disabled={loading}
                style={{ width: "100%", padding: 13, border: "none", borderRadius: 10, color: "#fff", fontWeight: 600, fontSize: 15, cursor: "pointer", background: "linear-gradient(135deg,#2e9d91,#1f7068)" }}>
                {loading ? "Updating…" : "Reset Password"}
              </button>
            </form>
          )}

          {msg && (
            <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 10, fontSize: 13,
              background: type === "success" ? "#f0fdf4" : "#fef2f2", color: type === "success" ? "#16a34a" : "#dc2626", wordBreak: "break-word" }}>
              {msg}
            </div>
          )}

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
            <Link to="/" style={{ color: T, fontWeight: 600, textDecoration: "none" }}>Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
