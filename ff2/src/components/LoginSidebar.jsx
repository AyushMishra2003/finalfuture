import React, { useState, useEffect } from "react";
import { baseUrl } from "../utils/config";
import { mergeGuestCartOnLogin } from "../utils/cart";
import { X, Smartphone, Mail, ArrowLeft } from "react-feather";

const API = `${baseUrl}/api/v1/auth`;

const LoginSidebar = ({ isOpen, onClose }) => {
  // view: 'login' | 'signup' | 'forgot'   |   method (within login): 'otp' | 'password'
  const [view, setView] = useState("login");
  const [method, setMethod] = useState("otp");
  const [otpStep, setOtpStep] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error"); // 'success' | 'error' | 'info'

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const notify = (text, type = "error") => { setMessage(text); setMessageType(type); };
  const resetMsg = () => setMessage("");

  // Store session, merge guest cart into account, then close + refresh.
  const finishAuth = async (data) => {
    const token = data.token;
    localStorage.setItem("userToken", token);
    localStorage.setItem("token", token);
    localStorage.setItem("userId", data.data.id);
    localStorage.setItem("userName", data.data.name || "User");
    localStorage.setItem("userPhone", data.data.phone || "");
    notify("Success! Redirecting…", "success");
    try { await mergeGuestCartOnLogin(); } catch (e) { /* non-blocking */ }
    setTimeout(() => { onClose(); window.location.reload(); }, 800);
  };

  const post = async (path, body) => {
    const res = await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  // ---- Mobile OTP ----
  const sendOtp = async (e) => {
    e.preventDefault();
    if (form.phone.length !== 10) return notify("Please enter a valid 10-digit phone number");
    setIsLoading(true); resetMsg();
    try {
      const data = await post("/otp/generate", { phone: form.phone });
      if (data.success) {
        setOtpStep(true);
        if (data.otp) notify(`Dev mode — your OTP is ${data.otp}`, "info");
        else notify("OTP sent to your phone" + (data.emailQueued ? " & email" : ""), "success");
      } else notify(data.error || data.message || "Failed to send OTP");
    } catch { notify("Error sending OTP. Please try again."); }
    finally { setIsLoading(false); }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (form.otp.length !== 6) return notify("Please enter the 6-digit OTP");
    setIsLoading(true); resetMsg();
    try {
      const data = await post("/otp/verify", { phone: form.phone, otp: form.otp });
      if (data.success) await finishAuth(data);
      else notify(data.error || data.message || "Invalid OTP");
    } catch { notify("Error verifying OTP. Please try again."); }
    finally { setIsLoading(false); }
  };

  // ---- Email + password login ----
  const passwordLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return notify("Please enter email and password");
    setIsLoading(true); resetMsg();
    try {
      const data = await post("/login", { email: form.email, password: form.password });
      if (data.success) await finishAuth(data);
      else notify(data.error || "Invalid credentials");
    } catch { notify("Login failed. Please try again."); }
    finally { setIsLoading(false); }
  };

  // ---- Sign up ----
  const signup = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = form;
    if (!name || !email || !phone || !password) return notify("Please fill in all fields");
    if (phone.length !== 10) return notify("Please enter a valid 10-digit phone number");
    if (password.length < 6) return notify("Password must be at least 6 characters");
    if (password !== confirmPassword) return notify("Passwords do not match");
    setIsLoading(true); resetMsg();
    try {
      const data = await post("/register", { name, email, phone, password });
      if (data.success) await finishAuth(data);
      else notify(data.error || "Could not create account");
    } catch { notify("Sign up failed. Please try again."); }
    finally { setIsLoading(false); }
  };

  // ---- Forgot password ----
  const forgot = async (e) => {
    e.preventDefault();
    if (!form.email) return notify("Please enter your email");
    setIsLoading(true); resetMsg();
    try {
      const data = await post("/forgotpassword", { email: form.email });
      if (data.success) {
        if (data.devResetUrl) notify(`Dev mode — reset link: ${data.devResetUrl}`, "info");
        else notify(data.message || "Reset link sent to your email.", "success");
      } else notify(data.error || "Could not process request");
    } catch { notify("Something went wrong. Please try again."); }
    finally { setIsLoading(false); }
  };

  const switchView = (v) => { setView(v); setOtpStep(false); resetMsg(); };

  if (!isOpen) return null;

  const T = "#2e9d91";
  const inputStyle = { borderRadius: 10, padding: "11px 14px", fontSize: 14 };

  return (
    <>
      <style>{`
        .auth-tab{flex:1;border:none;background:none;padding:11px 8px;font-size:14px;font-weight:600;color:#9ca3af;cursor:pointer;border-bottom:2px solid transparent;transition:.2s;display:flex;align-items:center;justify-content:center;gap:7px}
        .auth-tab.active{color:${T};border-bottom-color:${T}}
        .auth-primary-btn{background:linear-gradient(135deg,#2e9d91,#1f7068)!important;border:none!important;border-radius:10px!important;font-weight:600!important;padding:12px!important}
        .auth-primary-btn:hover{background:linear-gradient(135deg,#1f7068,#175950)!important}
        .auth-link{color:${T};background:none;border:none;padding:0;font-weight:600;font-size:13px;cursor:pointer}
        .auth-input:focus{border-color:${T};box-shadow:0 0 0 3px rgba(46,157,145,.12)}
      `}</style>

      <div className="position-fixed top-0 start-0 h-100 bg-white shadow"
        style={{ width: "100%", maxWidth: 420, zIndex: 1060, transform: "translateX(0)", transition: "transform .3s ease-in-out", overflowY: "auto" }}>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="mb-0 fw-bold" style={{ color: "#1a1d2e" }}>
            {view === "signup" ? "Create Account" : view === "forgot" ? "Reset Password" : "Login / Sign Up"}
          </h5>
          <button type="button" className="btn-close d-flex align-items-center" onClick={onClose} aria-label="Close" style={{ background: "none", border: "none" }}>
            <X size={22} />
          </button>
        </div>

        <div className="p-4">
          {/* Logo */}
          <div className="text-center mb-3">
            <img src={`/images/logo/favicon.jpg`} alt="FutureLabs" style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover" }} />
            {/* Home header wordmark logo */}
            <img
              src={`/images/logo/futurelabs24-logo.png`}
              alt="Future Labs 24.com"
              style={{ height: 30, width: "auto", maxWidth: 200, display: "block", margin: "10px auto 0" }}
              onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }}
            />
            <div className="text-muted mt-2" style={{ fontSize: 12 }}>Trusted Diagnostics &amp; Lab Tests</div>
          </div>

          {/* LOGIN */}
          {view === "login" && (
            <>
              <div className="d-flex mb-4 border-bottom">
                <button className={`auth-tab ${method === "otp" ? "active" : ""}`} onClick={() => { setMethod("otp"); setOtpStep(false); resetMsg(); }}>
                  <Smartphone size={16} /> Mobile OTP
                </button>
                <button className={`auth-tab ${method === "password" ? "active" : ""}`} onClick={() => { setMethod("password"); resetMsg(); }}>
                  <Mail size={16} /> Email Login
                </button>
              </div>

              {method === "otp" && !otpStep && (
                <form onSubmit={sendOtp}>
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Phone Number</label>
                  <div className="input-group mb-3">
                    <span className="input-group-text" style={{ borderRadius: "10px 0 0 10px" }}>+91</span>
                    <input type="tel" className="form-control auth-input" value={form.phone} onChange={set("phone")}
                      placeholder="10-digit mobile number" maxLength="10" style={{ ...inputStyle, borderRadius: "0 10px 10px 0" }} required />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 auth-primary-btn" disabled={isLoading}>
                    {isLoading ? "Sending…" : "Send OTP"}
                  </button>
                </form>
              )}

              {method === "otp" && otpStep && (
                <form onSubmit={verifyOtp}>
                  <p className="text-center text-muted" style={{ fontSize: 13 }}>OTP sent to +91 {form.phone}</p>
                  <input type="text" className="form-control form-control-lg text-center auth-input mb-3" value={form.otp} onChange={set("otp")}
                    placeholder="Enter 6-digit OTP" maxLength="6" style={{ letterSpacing: 6, fontWeight: 700 }} required />
                  <button type="submit" className="btn btn-primary w-100 auth-primary-btn" disabled={isLoading}>
                    {isLoading ? "Verifying…" : "Verify &amp; Continue"}
                  </button>
                  <div className="d-flex justify-content-between mt-3">
                    <button type="button" className="auth-link" onClick={sendOtp} disabled={isLoading}>Resend OTP</button>
                    <button type="button" className="auth-link" onClick={() => { setOtpStep(false); setForm((f) => ({ ...f, otp: "" })); resetMsg(); }}>Change number</button>
                  </div>
                </form>
              )}

              {method === "password" && (
                <form onSubmit={passwordLogin}>
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Email</label>
                  <input type="email" className="form-control auth-input mb-3" value={form.email} onChange={set("email")} placeholder="you@example.com" style={inputStyle} required />
                  <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Password</label>
                  <input type="password" className="form-control auth-input mb-2" value={form.password} onChange={set("password")} placeholder="Your password" style={inputStyle} required />
                  <div className="text-end mb-3">
                    <button type="button" className="auth-link" onClick={() => switchView("forgot")}>Forgot password?</button>
                  </div>
                  <button type="submit" className="btn btn-primary w-100 auth-primary-btn" disabled={isLoading}>
                    {isLoading ? "Logging in…" : "Login"}
                  </button>
                </form>
              )}

              <p className="text-center mt-4 mb-0 text-muted" style={{ fontSize: 13 }}>
                New here? <button type="button" className="auth-link" onClick={() => switchView("signup")}>Create an account</button>
              </p>
            </>
          )}

          {/* SIGN UP */}
          {view === "signup" && (
            <form onSubmit={signup}>
              <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Full Name</label>
              <input type="text" className="form-control auth-input mb-3" value={form.name} onChange={set("name")} placeholder="Your name" style={inputStyle} required />
              <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Email</label>
              <input type="email" className="form-control auth-input mb-3" value={form.email} onChange={set("email")} placeholder="you@example.com" style={inputStyle} required />
              <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Phone Number</label>
              <div className="input-group mb-3">
                <span className="input-group-text" style={{ borderRadius: "10px 0 0 10px" }}>+91</span>
                <input type="tel" className="form-control auth-input" value={form.phone} onChange={set("phone")} placeholder="10-digit mobile number" maxLength="10" style={{ ...inputStyle, borderRadius: "0 10px 10px 0" }} required />
              </div>
              <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Password</label>
              <input type="password" className="form-control auth-input mb-3" value={form.password} onChange={set("password")} placeholder="At least 6 characters" style={inputStyle} required />
              <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Confirm Password</label>
              <input type="password" className="form-control auth-input mb-3" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Re-enter password" style={inputStyle} required />
              <button type="submit" className="btn btn-primary w-100 auth-primary-btn" disabled={isLoading}>
                {isLoading ? "Creating account…" : "Sign Up"}
              </button>
              <p className="text-center mt-4 mb-0 text-muted" style={{ fontSize: 13 }}>
                Already have an account? <button type="button" className="auth-link" onClick={() => switchView("login")}>Login</button>
              </p>
            </form>
          )}

          {/* FORGOT PASSWORD */}
          {view === "forgot" && (
            <form onSubmit={forgot}>
              <button type="button" className="auth-link d-flex align-items-center gap-1 mb-3" onClick={() => switchView("login")}>
                <ArrowLeft size={14} /> Back to login
              </button>
              <p className="text-muted" style={{ fontSize: 13 }}>Enter your account email and we'll send you a link to reset your password.</p>
              <label className="form-label fw-semibold" style={{ fontSize: 13 }}>Email</label>
              <input type="email" className="form-control auth-input mb-3" value={form.email} onChange={set("email")} placeholder="you@example.com" style={inputStyle} required />
              <button type="submit" className="btn btn-primary w-100 auth-primary-btn" disabled={isLoading}>
                {isLoading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          )}

          {message && (
            <div className={`alert mt-3 mb-0 ${messageType === "success" ? "alert-success" : messageType === "info" ? "alert-info" : "alert-danger"}`}
              role="alert" style={{ fontSize: 13, wordBreak: "break-word" }}>
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50" style={{ zIndex: 1050 }} onClick={onClose}></div>
    </>
  );
};

export default LoginSidebar;
