import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, ShoppingBag, MapPin, LogOut, Package, Calendar, Clock,
  CheckCircle, CreditCard, Edit2, Save, X, Home as HomeIcon, Grid,
} from "react-feather";
import { baseUrl } from "../utils/config";
import { showToast } from "../utils/toast";

const T = "#2e9d91";
const TD = "#1f7068";

// Map an order status to a colour + label
const statusMeta = (s = "pending") => {
  const k = String(s).toLowerCase();
  if (["completed", "delivered", "report_ready"].includes(k)) return { color: "#16a34a", bg: "#f0fdf4", label: "Completed" };
  if (["cancelled", "canceled", "failed"].includes(k)) return { color: "#dc2626", bg: "#fef2f2", label: "Cancelled" };
  if (["processing", "confirmed", "sample_collected", "assigned"].includes(k)) return { color: "#2563eb", bg: "#eff6ff", label: s.replace(/_/g, " ") };
  return { color: "#d97706", bg: "#fffbeb", label: s.replace(/_/g, " ") };
};

const Dashboard = ({ defaultTab = "overview" }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken") || localStorage.getItem("token");

  const [tab, setTab] = useState(defaultTab);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [showAddr, setShowAddr] = useState(false);
  const [addr, setAddr] = useState({ address: "", city: "", state: "Karnataka", pincode: "" });

  useEffect(() => {
    if (!token) { navigate("/"); return; }
    (async () => {
      try {
        const [meRes, ordRes] = await Promise.all([
          fetch(`${baseUrl}/api/v1/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${baseUrl}/api/v1/orders/myorders`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const me = await meRes.json();
        const ord = await ordRes.json();
        if (me.success) { setUser(me.data); setForm({ name: me.data.name || "", email: me.data.email || "" }); }
        if (ord.success) setOrders(ord.data || []);
      } catch (e) { showToast("Could not load your dashboard", "error"); }
      finally { setLoading(false); }
    })();
  }, [token, navigate]);

  const logout = () => {
    ["userToken", "token", "userId", "userName", "userPhone"].forEach((k) => localStorage.removeItem(k));
    window.dispatchEvent(new Event("storage"));
    navigate("/");
    window.location.reload();
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/updatedetails`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data); setEditing(false);
        localStorage.setItem("userName", data.data.name || "User");
        window.dispatchEvent(new Event("storage"));
        showToast("Profile updated");
      } else showToast(data.error || "Update failed", "error");
    } catch { showToast("Update failed", "error"); }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    const updated = [...(user?.addresses || []), addr];
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/updatedetails`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ addresses: updated }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data); setShowAddr(false);
        setAddr({ address: "", city: "", state: "Karnataka", pincode: "" });
        showToast("Address saved");
      } else showToast(data.error || "Could not save address", "error");
    } catch { showToast("Could not save address", "error"); }
  };

  if (!token) return null;

  const initials = (user?.name || "U").trim().charAt(0).toUpperCase();
  const paidCount = orders.filter((o) => o.isPaid).length;

  const navItems = [
    { key: "overview", label: "Overview", icon: <Grid size={18} /> },
    { key: "orders", label: "My Orders", icon: <ShoppingBag size={18} /> },
    { key: "profile", label: "Profile", icon: <User size={18} /> },
    { key: "addresses", label: "Addresses", icon: <MapPin size={18} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", paddingTop: 90, fontFamily: "Segoe UI, Roboto, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 60px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }} className="dash-grid">
        <style>{`@media(max-width:820px){.dash-grid{grid-template-columns:1fr!important}}`}</style>

        {/* Sidebar */}
        <aside style={{ background: "#fff", borderRadius: 16, padding: 18, height: "fit-content", boxShadow: "0 4px 20px rgba(0,0,0,.05)" }}>
          <div style={{ textAlign: "center", padding: "10px 0 18px", borderBottom: "1px solid #eef2f7" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 10px", background: `linear-gradient(135deg,${T},${TD})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700 }}>{initials}</div>
            <div style={{ fontWeight: 700, color: "#1a1d2e" }}>{user?.name || "User"}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{user?.phone ? `+91 ${user.phone}` : user?.email}</div>
          </div>
          <nav style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map((n) => (
              <button key={n.key} onClick={() => setTab(n.key)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, textAlign: "left",
                  background: tab === n.key ? "#e8f7f6" : "transparent", color: tab === n.key ? TD : "#4b5563" }}>
                {n.icon} {n.label}
              </button>
            ))}
            <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#dc2626", background: "transparent", marginTop: 6 }}>
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main>
          {loading ? (
            <div style={{ textAlign: "center", padding: 80, color: "#9ca3af" }}>Loading your dashboard…</div>
          ) : (
            <>
              {/* OVERVIEW */}
              {tab === "overview" && (
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1d2e", margin: "0 0 4px" }}>Hi {user?.name || "there"} 👋</h2>
                  <p style={{ color: "#6b7280", margin: "0 0 20px", fontSize: 14 }}>Here's a snapshot of your account.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 16, marginBottom: 24 }}>
                    {[
                      { icon: <ShoppingBag size={20} />, label: "Total Orders", value: orders.length },
                      { icon: <CreditCard size={20} />, label: "Paid Orders", value: paidCount },
                      { icon: <MapPin size={20} />, label: "Saved Addresses", value: (user?.addresses || []).length },
                    ].map((s, i) => (
                      <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 4px 20px rgba(0,0,0,.05)" }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: "#e8f7f6", color: TD, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>{s.icon}</div>
                        <div style={{ fontSize: 26, fontWeight: 800, color: "#1a1d2e" }}>{s.value}</div>
                        <div style={{ fontSize: 13, color: "#6b7280" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg,${T},${TD})`, color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 600, cursor: "pointer" }}><HomeIcon size={16} /> Browse Tests</button>
                    <button onClick={() => setTab("orders")} style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", color: TD, border: `1.5px solid ${T}`, borderRadius: 10, padding: "12px 20px", fontWeight: 600, cursor: "pointer" }}><ShoppingBag size={16} /> View Orders</button>
                  </div>
                </div>
              )}

              {/* ORDERS */}
              {tab === "orders" && (
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1d2e", margin: "0 0 16px" }}>My Orders</h2>
                  {orders.length === 0 ? (
                    <div style={{ background: "#fff", borderRadius: 14, padding: "50px 20px", textAlign: "center" }}>
                      <ShoppingBag size={48} color="#cbd5e1" />
                      <p style={{ color: "#6b7280", margin: "14px 0" }}>No orders yet.</p>
                      <button onClick={() => navigate("/")} style={{ background: `linear-gradient(135deg,${T},${TD})`, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>Browse Tests</button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {orders.map((o) => {
                        const sm = statusMeta(o.orderStatus);
                        return (
                          <div key={o._id} style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 4px 20px rgba(0,0,0,.05)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                              <div>
                                <div style={{ fontWeight: 700, color: "#1a1d2e" }}>Order #{String(o._id).slice(-8).toUpperCase()}</div>
                                <div style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                                  <Calendar size={13} /> {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </div>
                              </div>
                              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <span style={{ fontSize: 12, fontWeight: 700, textTransform: "capitalize", padding: "5px 12px", borderRadius: 20, color: sm.color, background: sm.bg }}>{sm.label}</span>
                                <span style={{ fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 20, color: o.isPaid ? "#16a34a" : "#d97706", background: o.isPaid ? "#f0fdf4" : "#fffbeb" }}>{o.isPaid ? "Paid" : "Payment Pending"}</span>
                              </div>
                            </div>
                            <div style={{ borderTop: "1px dashed #eef2f7", marginTop: 14, paddingTop: 12 }}>
                              {(o.orderItems || []).map((it, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#4b5563", padding: "3px 0" }}>
                                  <span><Package size={13} style={{ verticalAlign: "middle", color: T }} /> {it.name} × {it.quantity || 1}</span>
                                  <span>₹{(it.price || 0) * (it.quantity || 1)}</span>
                                </div>
                              ))}
                              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginTop: 8, color: "#1a1d2e" }}>
                                <span>Total</span><span style={{ color: TD }}>₹{o.totalPrice}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE */}
              {tab === "profile" && (
                <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 4px 20px rgba(0,0,0,.05)", maxWidth: 560 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1d2e", margin: 0 }}>Profile</h2>
                    {!editing ? (
                      <button onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "#e8f7f6", color: TD, border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}><Edit2 size={14} /> Edit</button>
                    ) : (
                      <button onClick={() => { setEditing(false); setForm({ name: user.name || "", email: user.email || "" }); }} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f3f4f6", color: "#4b5563", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}><X size={14} /> Cancel</button>
                    )}
                  </div>
                  <form onSubmit={saveProfile}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Full Name</label>
                    <input value={editing ? form.name : (user?.name || "")} onChange={(e) => setForm({ ...form, name: e.target.value })} readOnly={!editing}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8ecf4", margin: "6px 0 16px", background: editing ? "#fff" : "#f9fafb" }} />
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Phone</label>
                    <input value={user?.phone || ""} readOnly style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8ecf4", margin: "6px 0 16px", background: "#f9fafb" }} />
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Email</label>
                    <input type="email" value={editing ? form.email : (user?.email || "")} onChange={(e) => setForm({ ...form, email: e.target.value })} readOnly={!editing} placeholder={editing ? "Add your email" : "No email"}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8ecf4", margin: "6px 0 16px", background: editing ? "#fff" : "#f9fafb" }} />
                    {editing && (
                      <button type="submit" style={{ display: "flex", alignItems: "center", gap: 8, background: `linear-gradient(135deg,${T},${TD})`, color: "#fff", border: "none", borderRadius: 10, padding: "12px 22px", fontWeight: 600, cursor: "pointer" }}><Save size={16} /> Save Changes</button>
                    )}
                  </form>
                </div>
              )}

              {/* ADDRESSES */}
              {tab === "addresses" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1d2e", margin: 0 }}>Saved Addresses</h2>
                    {!showAddr && <button onClick={() => setShowAddr(true)} style={{ background: `linear-gradient(135deg,${T},${TD})`, color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 600, cursor: "pointer" }}>+ Add Address</button>}
                  </div>
                  {showAddr && (
                    <form onSubmit={saveAddress} style={{ background: "#fff", borderRadius: 14, padding: 18, marginBottom: 16, boxShadow: "0 4px 20px rgba(0,0,0,.05)" }}>
                      <input placeholder="Full address" value={addr.address} onChange={(e) => setAddr({ ...addr, address: e.target.value })} required style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8ecf4", marginBottom: 10 }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        <input placeholder="City" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} required style={{ padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8ecf4" }} />
                        <input placeholder="State" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} style={{ padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8ecf4" }} />
                        <input placeholder="Pincode" value={addr.pincode} onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} required style={{ padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e8ecf4" }} />
                      </div>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
                        <button type="button" onClick={() => setShowAddr(false)} style={{ background: "#f3f4f6", color: "#4b5563", border: "none", borderRadius: 8, padding: "9px 16px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                        <button type="submit" style={{ background: `linear-gradient(135deg,${T},${TD})`, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", fontWeight: 600, cursor: "pointer" }}>Save</button>
                      </div>
                    </form>
                  )}
                  {(user?.addresses || []).length === 0 && !showAddr ? (
                    <div style={{ background: "#fff", borderRadius: 14, padding: "40px 20px", textAlign: "center", color: "#9ca3af" }}>
                      <MapPin size={40} color="#cbd5e1" /><p style={{ marginTop: 12 }}>No addresses saved yet.</p>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
                      {(user?.addresses || []).map((a, i) => (
                        <div key={i} style={{ background: "#fff", borderRadius: 14, padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,.05)", display: "flex", gap: 10 }}>
                          <MapPin size={18} color={T} style={{ flexShrink: 0, marginTop: 2 }} />
                          <div style={{ fontSize: 13, color: "#4b5563" }}>
                            <div style={{ fontWeight: 600, color: "#1a1d2e" }}>{a.address || a.street}</div>
                            <div>{a.city}{a.state ? `, ${a.state}` : ""}{(a.pincode || a.zip) ? ` - ${a.pincode || a.zip}` : ""}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
