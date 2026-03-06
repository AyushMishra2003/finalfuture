import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle, Calendar } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    await new Promise(r => setTimeout(r, 1500));
    setStatus("success");
    setTimeout(() => {
      setStatus("idle");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    }, 3000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #f9fafb;
          color: #111827;
          -webkit-font-smoothing: antialiased;
        }

        /* ── TOP BAR ── */
        .topbar {
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          padding: 0 48px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          font-size: 16px;
          font-weight: 700;
          color: #111827;
          letter-spacing: -.3px;
        }
        .logo span { color: #2e9d91; }
        .topbar-tag {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .topbar-dot {
          width: 7px; height: 7px;
          background: #22c55e;
          border-radius: 50%;
        }

        /* ── PAGE WRAPPER ── */
        .page {
          max-width: 1160px;
          margin: 0 auto;
          padding: 64px 24px 80px;
        }

        /* ── PAGE HEADER ── */
        .page-header {
          margin-bottom: 56px;
        }
        .page-header-label {
          font-size: 12px;
          font-weight: 600;
          color: #2e9d91;
          letter-spacing: .1em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        .page-header h1 {
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 700;
          color: #111827;
          letter-spacing: -.5px;
          line-height: 1.15;
          margin-bottom: 12px;
        }
        .page-header p {
          font-size: 15px;
          color: #6b7280;
          font-weight: 400;
          line-height: 1.7;
          max-width: 480px;
        }

        /* ── MAIN GRID ── */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 32px;
          align-items: start;
        }
        @media(max-width: 900px) {
          .main-grid { grid-template-columns: 1fr; }
        }

        /* ── FORM CARD ── */
        .form-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          padding: 40px;
        }
        .form-card h2 {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 6px;
        }
        .form-card p {
          font-size: 13.5px;
          color: #9ca3af;
          margin-bottom: 32px;
          font-weight: 400;
        }

        /* Fields */
        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
        .field label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }
        .field input,
        .field select,
        .field textarea {
          width: 100%;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 11px 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #111827;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          appearance: none;
        }
        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: #2e9d91;
          box-shadow: 0 0 0 3px rgba(46,157,145,.1);
          background: #fff;
        }
        .field textarea { resize: none; }
        .field input::placeholder,
        .field textarea::placeholder { color: #d1d5db; }

        /* Submit */
        .btn-submit {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: #2e9d91;
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background .2s, transform .1s;
          margin-top: 8px;
        }
        .btn-submit:hover { background: #1d7069; }
        .btn-submit:active { transform: scale(.99); }
        .btn-submit.success { background: #16a34a; }
        .btn-submit.loading { background: #4fb3a9; cursor: not-allowed; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── RIGHT SIDEBAR ── */
        .sidebar { display: flex; flex-direction: column; gap: 16px; }

        /* Info Card */
        .info-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          padding: 28px;
        }
        .info-card h3 {
          font-size: 14px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 20px;
        }
        .info-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }
        .info-row:last-child { border-bottom: none; padding-bottom: 0; }
        .info-icon {
          width: 36px; height: 36px;
          min-width: 36px;
          background: #f0faf9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2e9d91;
        }
        .info-label {
          font-size: 11px;
          font-weight: 600;
          color: #9ca3af;
          letter-spacing: .06em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .info-value {
          font-size: 13.5px;
          font-weight: 500;
          color: #111827;
          line-height: 1.5;
        }

        /* Hours card */
        .hours-card {
          background: #0d2624;
          border-radius: 16px;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .hours-icon {
          width: 40px; height: 40px; min-width: 40px;
          background: rgba(46,157,145,.2);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #2e9d91;
        }
        .hours-text { font-size: 13px; font-weight: 400; color: rgba(255,255,255,.55); line-height: 1.5; }
        .hours-text strong { display: block; color: #fff; font-size: 14px; font-weight: 600; margin-bottom: 2px; }

        /* Quick actions */
        .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .qa-btn {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          transition: border-color .2s, box-shadow .2s, transform .15s;
          text-decoration: none;
        }
        .qa-btn:hover {
          border-color: #2e9d91;
          box-shadow: 0 4px 16px rgba(46,157,145,.1);
          transform: translateY(-1px);
        }
        .qa-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .qa-label {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          text-align: center;
        }
        .qa-sub {
          font-size: 10.5px;
          color: #9ca3af;
          font-weight: 400;
          text-align: center;
        }

        /* ── MAP ── */
        .map-section {
          margin-top: 32px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
          position: relative;
          height: 300px;
        }
        .map-section iframe {
          width: 100%; height: 100%; border: none;
          filter: saturate(.85);
        }
        .map-pill {
          position: absolute;
          bottom: 16px; left: 16px;
          background: #fff;
          border-radius: 10px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,.1);
          border: 1px solid #e5e7eb;
        }
        .map-pill-dot { width: 8px; height: 8px; background: #2e9d91; border-radius: 50%; flex-shrink: 0; }
        .map-pill span { font-size: 12.5px; font-weight: 600; color: #111827; }
        .map-directions {
          position: absolute;
          bottom: 16px; right: 16px;
          background: #2e9d91;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          padding: 10px 16px;
          border-radius: 10px;
          text-decoration: none;
          transition: background .2s;
        }
        .map-directions:hover { background: #1d7069; }
      `}</style>

      {/* Top Bar */}
      <div className="topbar">
        <div className="logo">Future<span>Lab</span> Diagnostics</div>
        <div className="topbar-tag">
          <div className="topbar-dot" />
          Open Today · 9 AM – 10 PM
        </div>
      </div>

      <div className="page">

        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5 }}
        >
          <div className="page-header-label">Contact Us</div>
          <h1>How can we<br />help you today?</h1>
          <p>Our patient care team typically responds within 2 hours. Fill in the form and we'll get back to you shortly.</p>
        </motion.div>

        {/* Main Grid */}
        <motion.div
          className="main-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5, delay: .1 }}
        >
          {/* Form */}
          <div className="form-card">
            <h2>Send a Message</h2>
            <p>We'll reply to your email within 2 business hours.</p>

            <form onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label>Full Name</label>
                  <input type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Phone Number</label>
                  <input type="tel" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} required />
                </div>
                <div className="field">
                  <label>Service</label>
                  <select name="service" value={form.service} onChange={handleChange}>
                    <option value="">Select a service</option>
                    <option value="booking">Test Booking</option>
                    <option value="home">Home Collection</option>
                    <option value="corporate">Corporate Enquiry</option>
                    <option value="support">Customer Support</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Message</label>
                <textarea name="message" rows={5} placeholder="Tell us how we can help..." value={form.message} onChange={handleChange} required />
              </div>

              <button
                type="submit"
                className={`btn-submit${status === 'loading' ? ' loading' : status === 'success' ? ' success' : ''}`}
                disabled={status !== 'idle'}
              >
                {status === 'idle' && <><Send size={15} /> Send Message</>}
                {status === 'loading' && <><div className="spinner" /> Sending…</>}
                {status === 'success' && <><CheckCircle size={15} /> Message Sent!</>}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="sidebar">

            {/* Contact Info */}
            <div className="info-card">
              <h3>Contact Information</h3>
              {[
                { Icon: MapPin, label: "Address", value: "No. 38, Sumangali Sevashram Road, Chola Nagar, Hebbal, Bengaluru — 560 024" },
                { Icon: Phone, label: "Phone",   value: "+91 81234 59263" },
                { Icon: Mail,  label: "Email",   value: "info@futurelabdiagnostics.in" },
              ].map(({ Icon, label, value }) => (
                <div className="info-row" key={label}>
                  <div className="info-icon"><Icon size={16} /></div>
                  <div>
                    <div className="info-label">{label}</div>
                    <div className="info-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="hours-card">
              <div className="hours-icon"><Clock size={18} /></div>
              <div className="hours-text">
                <strong>Working Hours</strong>
                Monday – Saturday · 9:00 AM to 10:00 PM
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              {[
                { icon: <MessageCircle size={18} color="#25D366" />, bg: "#f0fdf4", label: "WhatsApp", sub: "Chat instantly" },
                { icon: <Phone size={18} color="#2e9d91" />, bg: "#f0faf9", label: "Call Us", sub: "+91 81234 59263" },
                { icon: <Calendar size={18} color="#6366f1" />, bg: "#f5f3ff", label: "Book a Test", sub: "Schedule online" },
                { icon: <MapPin size={18} color="#f59e0b" />, bg: "#fffbeb", label: "Directions", sub: "Get directions" },
              ].map(({ icon, bg, label, sub }) => (
                <a href="#" className="qa-btn" key={label}>
                  <div className="qa-icon" style={{ background: bg }}>{icon}</div>
                  <div className="qa-label">{label}</div>
                  <div className="qa-sub">{sub}</div>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          className="map-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .5, delay: .2 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4118.625423745121!2d77.59385045912636!3d13.036324913658728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17007203752d%3A0xddf2692240187855!2sFUTURE%20LABS%20DIAGNOSTICS%20%26%20RESEARCH%20CENTRE!5e0!3m2!1sen!2sin!4v1768757129689!5m2!1sen!2sin"
            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-pill">
            <div className="map-pill-dot" />
            <span>Future Lab Diagnostics, Hebbal</span>
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=13.0363249,77.5938504"
            target="_blank" rel="noopener noreferrer"
            className="map-directions"
          >
            Get Directions →
          </a>
        </motion.div>

      </div>
    </>
  );
};

export default Contact;