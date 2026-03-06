import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { font-family: 'Nunito', sans-serif; background: #eef2f7; }

  /* ===== TOP NAVBAR (desktop only) ===== */
  .top-navbar {
    display: none;
    background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
    color: white; padding: 0 32px; height: 64px;
    align-items: center; justify-content: space-between;
    box-shadow: 0 2px 12px rgba(26,115,232,0.3);
    position: sticky; top: 0; z-index: 100;
  }
  .navbar-brand { display: flex; align-items: center; gap: 12px; }
  .navbar-logo {
    width: 40px; height: 40px; background: white; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 900; color: #1a73e8;
  }
  .navbar-title { font-size: 18px; font-weight: 800; }
  .navbar-sub { font-size: 12px; opacity: 0.8; font-weight: 600; }
  .navbar-right { display: flex; align-items: center; gap: 20px; font-size: 13px; font-weight: 600; opacity: 0.9; }

  /* ===== MOBILE HEADER ===== */
  .mobile-header {
    background: linear-gradient(135deg, #1a73e8, #0d47a1);
    color: white; padding: 20px 16px 24px;
    border-radius: 0 0 24px 24px;
    box-shadow: 0 4px 16px rgba(26,115,232,0.35);
  }
  .header-top { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .header-logo {
    width: 42px; height: 42px; background: white; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; font-weight: 900; color: #1a73e8; flex-shrink: 0;
  }
  .header-title h1 { font-size: 16px; font-weight: 800; }
  .header-title p  { font-size: 12px; opacity: 0.85; font-weight: 600; }
  .header-meta { font-size: 11px; opacity: 0.8; font-weight: 600; }

  /* ===== LAYOUT CONTAINERS ===== */
  .mobile-layout  { display: block; padding-bottom: 40px; }
  .desktop-layout { display: none; max-width: 1400px; margin: 0 auto; padding: 28px 32px; flex-direction: column; gap: 24px; }

  /* ===== STATS ===== */
  .stats-grid {
    display: grid; grid-template-columns: repeat(5,1fr);
    gap: 8px; padding: 16px 16px 0;
  }
  .stat-card {
    background: white; border-radius: 14px; padding: 12px 6px;
    text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.07);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
  .stat-icon  { font-size: 20px; margin-bottom: 4px; }
  .stat-info h3 { font-size: 15px; font-weight: 800; color: #1a1a2e; }
  .stat-info p  { font-size: 10px; color: #888; font-weight: 600; }

  /* ===== LOCATION BAR ===== */
  .location-bar {
    background: white; margin: 12px 16px 0; border-radius: 14px;
    padding: 12px 14px; display: flex; align-items: center; gap: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.07); font-size: 12px; color: #444; font-weight: 600;
  }
  .btn-refresh {
    margin-left: auto; background: #e8f0fe; border: none; border-radius: 8px;
    padding: 6px 12px; font-size: 12px; color: #1a73e8; cursor: pointer;
    font-weight: 700; white-space: nowrap; font-family: 'Nunito', sans-serif;
  }

  /* ===== ORDER CARDS ===== */
  .orders-section { padding: 16px 16px 0; }
  .section-title { font-size: 15px; font-weight: 800; color: #1a1a2e; margin-bottom: 12px; }
  .orders-grid-desktop { display: grid; grid-template-columns: repeat(auto-fill,minmax(340px,1fr)); gap: 16px; }

  .order-card {
    background: white; border-radius: 18px; padding: 16px; margin-bottom: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08); border-left: 4px solid #1a73e8;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .order-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.12); }
  .orders-grid-desktop .order-card { margin-bottom: 0; }
  .order-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .order-id      { font-size: 13px; font-weight: 800; color: #1a1a2e; }
  .order-patient { font-size: 12px; color: #555; margin-top: 2px; }
  .order-phone   { font-size: 12px; color: #555; }
  .order-address { font-size: 11px; color: #888; margin-top: 4px; line-height: 1.4; }
  .order-amount  { font-size: 15px; font-weight: 800; color: #1a73e8; }
  .status-badge  { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: capitalize; }
  .status-badge.scheduled  { background: #fff3e0; color: #e65100; }
  .status-badge.processing { background: #e3f2fd; color: #1565c0; }
  .status-badge.delivered  { background: #e8f5e9; color: #2e7d32; }
  .order-meta { display: flex; gap: 10px; margin: 8px 0; align-items: center; flex-wrap: wrap; }
  .meta-pill { background: #f5f5f5; border-radius: 8px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: #555; }
  .order-actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }

  .btn-view {
    flex: 1; min-width: 80px; background: #e8f0fe; color: #1a73e8;
    border: none; border-radius: 10px; padding: 9px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif; transition: background 0.15s;
  }
  .btn-view:hover { background: #d2e3fc; }
  .btn-start {
    flex: 1; min-width: 80px; background: linear-gradient(135deg,#43a047,#2e7d32);
    color: white; border: none; border-radius: 10px; padding: 9px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
  }
  .btn-complete {
    flex: 1; min-width: 80px; background: linear-gradient(135deg,#1a73e8,#0d47a1);
    color: white; border: none; border-radius: 10px; padding: 9px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
  }
  .empty-state {
    text-align: center; padding: 60px 20px; color: #aaa; font-size: 15px; font-weight: 600;
    background: white; border-radius: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .loading { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 16px; color: #1a73e8; }
  .error   { display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 16px; color: #e53935; }

  /* ===== MODAL OVERLAY ===== */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 1000;
    display: flex; align-items: flex-end; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn { from { transform: scale(0.93); opacity:0; } to { transform: scale(1); opacity:1; } }

  /* Mobile: show bottom sheet, hide desktop dialog */
  .mobile-modal-only  { display: block; }
  .desktop-modal-only { display: none; }

  /* MOBILE: bottom sheet */
  .modal-sheet {
    background: #f0f4f8; width: 100%; max-width: 480px; max-height: 92vh;
    border-radius: 24px 24px 0 0; overflow-y: auto;
    animation: slideUp 0.28s cubic-bezier(0.34,1.2,0.64,1);
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

  .modal-handle-bar { width: 40px; height: 4px; background: #ccc; border-radius: 4px; margin: 12px auto 0; }

  .modal-header {
    background: linear-gradient(135deg,#1a73e8,#0d47a1); padding: 16px 20px 18px;
    display: flex; align-items: center; justify-content: space-between; color: white;
  }
  .modal-header-left { display: flex; align-items: center; gap: 10px; }
  .modal-header-icon  { font-size: 24px; }
  .modal-header-title { font-size: 16px; font-weight: 800; }
  .modal-header-sub   { font-size: 12px; opacity: 0.8; font-weight: 600; }
  .modal-close-btn {
    background: rgba(255,255,255,0.2); border: none; color: white;
    width: 32px; height: 32px; border-radius: 50%; font-size: 20px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-family: 'Nunito', sans-serif; flex-shrink: 0;
  }
  .modal-close-btn:hover { background: rgba(255,255,255,0.35); }

  .modal-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }

  /* ===== DETAIL CARDS ===== */
  .detail-card { background: white; border-radius: 18px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
  .detail-card-header {
    padding: 12px 16px; font-size: 13px; font-weight: 800; color: #1a1a2e;
    border-bottom: 1px solid #f0f0f0; background: #fafafa;
    display: flex; align-items: center; gap: 8px;
  }
  .detail-card-body { padding: 14px 16px; }
  .info-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 6px 0; font-size: 13px; border-bottom: 1px solid #f9f9f9; }
  .info-row:last-child { border-bottom: none; }
  .info-label { color: #888; font-weight: 600; flex-shrink: 0; margin-right: 12px; }
  .info-value { color: #1a1a2e; font-weight: 700; text-align: right; }
  .patient-actions { display: flex; gap: 10px; margin-top: 14px; }
  .btn-gps {
    flex: 1; background: #1a73e8; color: white; border: none; border-radius: 10px;
    padding: 10px; font-size: 13px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-family: 'Nunito', sans-serif;
  }
  .btn-call {
    flex: 1; background: #43a047; color: white; border: none; border-radius: 10px;
    padding: 10px; font-size: 13px; font-weight: 700; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-family: 'Nunito', sans-serif;
  }

  /* Status steps */
  .status-steps { display: flex; gap: 8px; padding: 14px 16px; }
  .step-btn {
    flex: 1; border: none; border-radius: 12px; padding: 10px 6px;
    font-size: 12px; font-weight: 700; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    font-family: 'Nunito', sans-serif; text-align: center; line-height: 1.3;
    transition: transform 0.15s;
  }
  .step-btn:active { transform: scale(0.96); }
  .step-btn .step-check { font-size: 18px; }
  .step-btn.reached  { background: #43a047; color: white; }
  .step-btn.collected{ background: #43a047; color: white; }
  .step-btn.moving   { background: #f57c00; color: white; }
  .step-btn.inactive { background: #e0e0e0; color: #888; }

  /* Sample collection */
  .sample-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 14px 16px; }
  .sample-box { border: 2px dashed #ddd; border-radius: 14px; padding: 14px 10px; text-align: center; }
  .sample-box:hover { border-color: #1a73e8; }
  .sample-box-title { font-size: 12px; font-weight: 800; color: #333; margin-bottom: 10px; }
  .sample-camera  { font-size: 32px; margin-bottom: 6px; cursor: pointer; }
  .sample-time    { font-size: 11px; color: #888; font-weight: 600; margin-bottom: 8px; }
  .sample-checkbox-row { display: flex; align-items: center; gap: 6px; justify-content: center; font-size: 11px; font-weight: 700; color: #555; }
  .sample-checkbox-row input[type="checkbox"] { accent-color: #1a73e8; width: 14px; height: 14px; }

  /* Payment */
  .payment-list { padding: 14px 16px; display: flex; flex-direction: column; gap: 8px; }
  .payment-row { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; }
  .payment-row input[type="checkbox"] { accent-color: #1a73e8; width: 16px; height: 16px; }
  .payment-row.prepaid   { color: #e53935; }
  .payment-row.pending   { color: #f57c00; }
  .payment-row.collected { color: #43a047; }
  .payment-total { margin-top: 6px; padding-top: 10px; border-top: 1px solid #eee; font-size: 14px; font-weight: 800; color: #1a1a2e; display: flex; justify-content: space-between; }

  /* Handover */
  .handover-list { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
  .handover-btn {
    background: #43a047; color: white; border: none; border-radius: 14px; padding: 14px 16px;
    font-size: 14px; font-weight: 800; cursor: pointer;
    display: flex; align-items: center; justify-content: space-between;
    font-family: 'Nunito', sans-serif; transition: background 0.2s;
  }
  .handover-btn:hover { background: #388e3c; }
  .handover-btn .check-icon { font-size: 20px; }

  /* Tests */
  .test-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 13px; border-bottom: 1px solid #f5f5f5; }
  .test-row:last-child { border-bottom: none; }
  .test-name  { color: #444; font-weight: 600; }
  .test-price { color: #1a73e8; font-weight: 700; }
  .tests-total { display: flex; justify-content: space-between; padding-top: 10px; margin-top: 4px; border-top: 2px solid #e8f0fe; font-size: 14px; font-weight: 800; color: #1a1a2e; }

  .btn-navigate-full {
    width: 100%; background: linear-gradient(135deg,#1a73e8,#0d47a1); color: white;
    border: none; border-radius: 14px; padding: 14px; font-size: 14px; font-weight: 800;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-navigate-full:hover { opacity: 0.9; }

  /* Scrollbar */
  .modal-sheet::-webkit-scrollbar { width: 4px; }
  .modal-sheet::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

  /* ===== DESKTOP RESPONSIVE (768px+) ===== */
  @media (min-width: 768px) {
    .mobile-header  { display: none; }
    .mobile-layout  { display: none; }
    .top-navbar     { display: flex; }
    .desktop-layout { display: flex; }

    /* Stats bigger */
    .desktop-layout .stats-grid { padding: 0; gap: 16px; }
    .desktop-layout .stat-card  { padding: 20px 12px; border-radius: 18px; }
    .desktop-layout .stat-icon  { font-size: 28px; margin-bottom: 8px; }
    .desktop-layout .stat-info h3 { font-size: 22px; }
    .desktop-layout .stat-info p  { font-size: 12px; }

    /* Location bar */
    .desktop-layout .location-bar { margin: 0; border-radius: 16px; font-size: 13px; padding: 14px 18px; }

    /* Section title */
    .desktop-layout .section-title { font-size: 18px; margin-bottom: 16px; }

    /* Modal overlay: center for desktop */
    .modal-overlay { align-items: center; justify-content: center; }

    /* Switch: hide mobile sheet, show desktop dialog */
    .mobile-modal-only  { display: none; }
    .desktop-modal-only {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }
`;

const PhlebotomistDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [locationAddress, setLocationAddress] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [samplePhotos, setSamplePhotos] = useState({});
  const [sampleChecks, setSampleChecks] = useState({});
  const [paymentCollected, setPaymentCollected] = useState({});
  const [handoverStatus, setHandoverStatus] = useState({});

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => { fetchDashboard(); requestLocation(); }, []);

  useEffect(() => {
    if (currentLocation?.latitude) {
      fetchLocationAddress(currentLocation.latitude, currentLocation.longitude);
    }
  // eslint-disable-next-line
  }, [currentLocation]);

  const fetchLocationAddress = async (lat, lon) => {
    try {
      const r = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      if (r.data?.display_name) setLocationAddress(r.data.display_name);
    } catch { setLocationAddress(`${lat.toFixed(4)}, ${lon.toFixed(4)}`); }
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (p) => {
          const lat = p.coords.latitude;
          const lon = p.coords.longitude;
          console.log('Your Current Location:', { lat, lon });
          setCurrentLocation({ latitude: lat, longitude: lon });
          updatePhlebotomistLocation(lat, lon);
        },
        (e) => {
          console.error('Location error:', e);
          alert('Please allow location access to see your current location');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const updatePhlebotomistLocation = async (latitude, longitude) => {
    try {
      const token = localStorage.getItem('collectorToken');
      await axios.put(`${baseUrl}/phlebotomist/location`, { latitude, longitude }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (e) { console.error(e); }
  };

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('collectorToken');
      const r = await axios.get(`${baseUrl}/phlebotomist/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
      setDashboardData(r.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('collectorToken'); window.location.href = '/phlebotomist/login';
      } else if (error.response?.status === 404) { alert('No collector folder assigned. Please contact admin.'); }
      else { alert('Failed to load dashboard'); }
    } finally { setLoading(false); }
  };

  const viewOrderDetails = async (orderId) => {
    try {
      const token = localStorage.getItem('collectorToken');
      const r = await axios.get(`${baseUrl}/phlebotomist/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } });
      setSelectedOrder(r.data.data);
    } catch { alert('Failed to load order details'); }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('collectorToken');
      await axios.put(`${baseUrl}/phlebotomist/orders/${orderId}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Status updated successfully!');
      fetchDashboard(); setSelectedOrder(null);
    } catch { alert('Failed to update status'); }
  };

  const openNavigation = (url) => window.open(url, '_blank');

  const uploadSamplePhoto = async (orderId, type, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const token = localStorage.getItem('collectorToken');
      await axios.post(`${baseUrl}/phlebotomist/orders/${orderId}/sample-photo`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setSamplePhotos(prev => ({ ...prev, [`${orderId}-${type}`]: URL.createObjectURL(file) }));
      alert('Photo uploaded successfully!');
    } catch { alert('Failed to upload photo'); }
  };

  const toggleSampleCheck = (orderId, type) => {
    setSampleChecks(prev => ({ ...prev, [`${orderId}-${type}`]: !prev[`${orderId}-${type}`] }));
  };

  const collectPayment = async (orderId, amount) => {
    try {
      const token = localStorage.getItem('collectorToken');
      await axios.post(`${baseUrl}/phlebotomist/orders/${orderId}/collect-payment`, 
        { amount, method: 'Cash' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPaymentCollected(prev => ({ ...prev, [orderId]: true }));
      alert('Payment collected successfully!');
    } catch { alert('Failed to collect payment'); }
  };

  const toggleHandover = (orderId, type) => {
    setHandoverStatus(prev => ({ ...prev, [`${orderId}-${type}`]: !prev[`${orderId}-${type}`] }));
  };

  if (loading)        return <div className="loading">Loading dashboard...</div>;
  if (!dashboardData) return <div className="error">Failed to load dashboard</div>;

  const { collectorFolder, stats, orders, phlebotomistLocation } = dashboardData;

  /* ── Shared order card ── */
  const OrderCard = ({ order }) => (
    <div className="order-card">
      <div className="order-card-top">
        <div>
          <div className="order-id">Order #{order._id.slice(-6)}</div>
          <div className="order-patient">👤 {order.user?.name}</div>
          <div className="order-phone">📞 {order.user?.phone}</div>
          <div className="order-address">📍 {order.shippingAddress?.address}</div>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div className="order-amount">₹{order.totalPrice}</div>
          <div style={{ marginTop:6 }}>
            <span className={`status-badge ${order.orderStatus}`}>{order.orderStatus}</span>
          </div>
        </div>
      </div>
      <div className="order-meta">
        <span className="meta-pill">📍 {order.distance}</span>
        <span className="meta-pill">💰 {order.estimatedFare}</span>
      </div>
      <div className="order-actions">
        <button className="btn-view" onClick={() => viewOrderDetails(order._id)}>View Details</button>
        {order.orderStatus === 'scheduled' && (
          <button className="btn-start" onClick={() => updateOrderStatus(order._id, 'processing')}>Start Collection</button>
        )}
        {order.orderStatus === 'processing' && (
          <button className="btn-complete" onClick={() => updateOrderStatus(order._id, 'delivered')}>Mark Complete</button>
        )}
      </div>
    </div>
  );

  /* ── Location bar ── */
  const LocationBar = ({ className = '' }) => (
    currentLocation ? (
      <div className={`location-bar ${className}`}>
        <span>📍</span>
        <span style={{ flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {locationAddress || 'Loading address...'}
        </span>
        <button className="btn-refresh" onClick={requestLocation}>🔄 Update</button>
      </div>
    ) : null
  );

  /* ── Modal inner content ── */
  const ModalContent = () => (
    <>
      <div className="modal-handle-bar" />
      <div className="modal-header">
        <div className="modal-header-left">
          <span className="modal-header-icon">🩸</span>
          <div>
            <div className="modal-header-title">FutureLabs24.com</div>
            <div className="modal-header-sub">Phlebotomist Dashboard</div>
          </div>
        </div>
        <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>×</button>
      </div>

      <div className="modal-body">

        {/* 1. Patient Details */}
        <div className="detail-card">
          <div className="detail-card-header">👤 Patient Details</div>
          <div className="detail-card-body">
            <div className="info-row"><span className="info-label">Booking Name</span><span className="info-value">{selectedOrder.user?.name}</span></div>
            <div className="info-row"><span className="info-label">Address</span><span className="info-value">{selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}</span></div>
            <div className="info-row"><span className="info-label">Phone</span><span className="info-value">{selectedOrder.user?.phone}</span></div>
            <div className="info-row"><span className="info-label">Email</span><span className="info-value">{selectedOrder.user?.email}</span></div>
            <div className="patient-actions">
              {selectedOrder.navigationUrl && (
                <button className="btn-gps" onClick={() => openNavigation(selectedOrder.navigationUrl)}>📍 GPS Location</button>
              )}
              <button className="btn-call" onClick={() => window.open(`tel:${selectedOrder.user?.phone}`)}>📞 Call</button>
            </div>
          </div>
        </div>

        {/* 2. Phlebotomy Status */}
        <div className="detail-card">
          <div className="detail-card-header">✅ Phlebotomy Status</div>
          <div className="status-steps">
            <button
              className={`step-btn ${selectedOrder.orderStatus !== 'scheduled' ? 'reached' : 'inactive'}`}
              onClick={() => selectedOrder.orderStatus === 'scheduled' && updateOrderStatus(selectedOrder._id, 'processing')}
            >
              <span className="step-check">{selectedOrder.orderStatus !== 'scheduled' ? '✅' : '⭕'}</span>
              <span>Reached</span>
            </button>
            <button className={`step-btn ${selectedOrder.orderStatus === 'delivered' ? 'collected' : 'inactive'}`}>
              <span className="step-check">{selectedOrder.orderStatus === 'delivered' ? '✅' : '⭕'}</span>
              <span>Collected Sample</span>
            </button>
            <button
              className={`step-btn ${selectedOrder.orderStatus === 'processing' ? 'moving' : 'inactive'}`}
              onClick={() => selectedOrder.orderStatus === 'processing' && updateOrderStatus(selectedOrder._id, 'delivered')}
            >
              <span className="step-check">→</span>
              <span>Moving to Next Patient</span>
            </button>
          </div>
        </div>

        {/* 3. Sample Collection */}
        <div className="detail-card">
          <div className="detail-card-header">🧪 Sample Collection</div>
          <div className="sample-grid">
            {[{t:'Blood Sample Pic',cb:'Random Sample',type:'blood'},{t:'Urine Sample Pic',cb:'Not Given',type:'urine'}].map((s,i) => (
              <div key={i} className="sample-box">
                <div className="sample-box-title">{s.t}</div>
                <input type="file" accept="image/*" id={`mobile-${s.type}-${selectedOrder._id}`} style={{display:'none'}} onChange={(e)=>uploadSamplePhoto(selectedOrder._id,s.type,e.target.files[0])} />
                <div className="sample-camera" onClick={()=>document.getElementById(`mobile-${s.type}-${selectedOrder._id}`).click()} style={{position:'relative',width:80,height:80,margin:'0 auto',border:samplePhotos[`${selectedOrder._id}-${s.type}`]?'none':'2px dashed #ccc',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center'}}>
                  {samplePhotos[`${selectedOrder._id}-${s.type}`] ? <img src={samplePhotos[`${selectedOrder._id}-${s.type}`]} alt={s.t} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:8}} /> : '📷'}
                </div>
                <div className="sample-time">Collected at: {new Date().toLocaleTimeString()}</div>
                <div className="sample-checkbox-row"><input type="checkbox" checked={sampleChecks[`${selectedOrder._id}-${s.type}`]||false} onChange={()=>toggleSampleCheck(selectedOrder._id,s.type)} /><span>{s.cb}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Payment Status */}
        <div className="detail-card">
          <div className="detail-card-header">💳 Payment Status</div>
          <div className="payment-list">
            <div className={`payment-row ${selectedOrder.isPaid?'collected':'prepaid'}`}><input type="checkbox" checked={selectedOrder.isPaid} readOnly /><span>{selectedOrder.isPaid?'Prepaid':'Not Prepaid'}</span></div>
            <div className={`payment-row ${!selectedOrder.isPaid&&!paymentCollected[selectedOrder._id]?'pending':'collected'}`}><input type="checkbox" checked={!selectedOrder.isPaid&&!paymentCollected[selectedOrder._id]} readOnly /><span>Payment Pending Rs. {selectedOrder.totalPrice}</span></div>
            <div className={`payment-row ${paymentCollected[selectedOrder._id]?'collected':'pending'}`} style={{cursor:!selectedOrder.isPaid?'pointer':'default'}} onClick={()=>!selectedOrder.isPaid&&!paymentCollected[selectedOrder._id]&&collectPayment(selectedOrder._id,selectedOrder.totalPrice)}><input type="checkbox" checked={paymentCollected[selectedOrder._id]||false} onChange={()=>!selectedOrder.isPaid&&collectPayment(selectedOrder._id,selectedOrder.totalPrice)} /><span>Payment Collected By Phlebo Rs. {selectedOrder.totalPrice}</span></div>
            <div className="payment-total"><span>TOTAL CASH ON HAND:</span><span>Rs. {paymentCollected[selectedOrder._id]?selectedOrder.totalPrice:0}</span></div>
          </div>
        </div>

        {/* 5. Tests Ordered */}
        <div className="detail-card">
          <div className="detail-card-header">🔬 Tests Ordered</div>
          <div className="detail-card-body">
            {selectedOrder.orderItems?.map((item, i) => (
              <div key={i} className="test-row"><span className="test-name">{item.name}</span><span className="test-price">₹{item.price}</span></div>
            ))}
            <div className="tests-total"><span>Total</span><span>₹{selectedOrder.totalPrice}</span></div>
          </div>
        </div>

        {/* 6. Final Handover – full width on desktop */}
        <div className="detail-card modal-full">
          <div className="detail-card-header">📦 Final Handover</div>
          <div className="handover-list">
            <button className="handover-btn" onClick={()=>toggleHandover(selectedOrder._id,'sample')} style={{background:handoverStatus[`${selectedOrder._id}-sample`]?'#43a047':'#e0e0e0',color:handoverStatus[`${selectedOrder._id}-sample`]?'white':'#888'}}><span>✅ Sample Handover</span><span className="check-icon">{handoverStatus[`${selectedOrder._id}-sample`]?'✅':'⭕'}</span></button>
            <button className="handover-btn" onClick={()=>toggleHandover(selectedOrder._id,'amount')} style={{background:handoverStatus[`${selectedOrder._id}-amount`]?'#43a047':'#e0e0e0',color:handoverStatus[`${selectedOrder._id}-amount`]?'white':'#888'}}><span>✅ Amount Handover to Lab</span><span className="check-icon">{handoverStatus[`${selectedOrder._id}-amount`]?'✅':'⭕'}</span></button>
          </div>
        </div>

        {/* 7. Navigate – full width on desktop */}
        {selectedOrder.navigationUrl && (
          <div className="modal-full">
            <button className="btn-navigate-full" onClick={() => openNavigation(selectedOrder.navigationUrl)}>
              🗺️ Open in Google Maps
            </button>
          </div>
        )}

      </div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="phlebotomist-dashboard">

        {/* ── DESKTOP NAVBAR ── */}
        {/* <div className="top-navbar">
          <div className="navbar-brand">
            <div className="navbar-logo">FL</div>
            <div>
              <div className="navbar-title">FutureLabs24.com</div>
              <div className="navbar-sub">Phlebotomist Dashboard</div>
            </div>
          </div>
          <div className="navbar-right">
            <span>👤 {collectorFolder.name}</span>
            <span>🕐 {collectorFolder.workingHours.start}:00 – {collectorFolder.workingHours.end}:00</span>
            <span>📌 {collectorFolder.pincodes.join(', ')}</span>
          </div>
        </div> */}

        {/* ── MOBILE HEADER ── */}
        <div className="mobile-header">
          <div className="header-top">
            <div className="header-logo">FL</div>
            <div className="header-title">
              <h1>FutureLabs24.com</h1>
              <p>Phlebotomist Dashboard</p>
            </div>
          </div>
          <div className="header-meta">
            {collectorFolder.name} &nbsp;|&nbsp; {collectorFolder.workingHours.start}:00 – {collectorFolder.workingHours.end}:00
          </div>
        </div>

        {/* ── MOBILE LAYOUT ── */}
        <div className="mobile-layout">
          <div className="stats-grid">
            {[
              { icon:'📋', val:stats.totalOrders, label:'Total'     },
              { icon:'⏳', val:stats.pending,     label:'Pending'   },
              { icon:'🔄', val:stats.inProgress,  label:'Active'    },
              { icon:'✅', val:stats.completed,   label:'Done'      },
              { icon:'💰', val:`₹${stats.totalRevenue}`, label:'Revenue' },
            ].map((s,i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-info"><h3>{s.val}</h3><p>{s.label}</p></div>
              </div>
            ))}
          </div>
          <LocationBar />
          <div className="orders-section">
            <h2 className="section-title">📦 Assigned Orders (Sorted by Distance)</h2>
            {orders.length === 0
              ? <div className="empty-state">No orders assigned yet</div>
              : orders.map(o => <OrderCard key={o._id} order={o} />)
            }
          </div>
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="desktop-layout">
          <div className="stats-grid">
            {[
              { icon:'📋', val:stats.totalOrders,        label:'Total Orders'  },
              { icon:'⏳', val:stats.pending,            label:'Pending'       },
              { icon:'🔄', val:stats.inProgress,         label:'In Progress'   },
              { icon:'✅', val:stats.completed,          label:'Completed'     },
              { icon:'💰', val:`₹${stats.totalRevenue}`, label:'Total Revenue' },
            ].map((s,i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-info"><h3>{s.val}</h3><p>{s.label}</p></div>
              </div>
            ))}
          </div>
          <LocationBar />
          <div className="orders-section">
            <h2 className="section-title">📦 Assigned Orders <span style={{ color:'#888', fontWeight:600, fontSize:14 }}>(Sorted by Distance)</span></h2>
            {orders.length === 0
              ? <div className="empty-state">No orders assigned yet</div>
              : <div className="orders-grid-desktop">{orders.map(o => <OrderCard key={o._id} order={o} />)}</div>
            }
          </div>
        </div>

        {/* ── MOBILE MODAL (bottom sheet) ── */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}
               style={{ display: 'flex' }}>
            {/* Mobile sheet */}
            <div className="modal-sheet mobile-modal-only" onClick={e => e.stopPropagation()}>
              <ModalContent />
            </div>
            {/* Desktop dialog */}
            <div onClick={e => e.stopPropagation()} className="desktop-modal-only" style={{
              background: '#f0f4f8',
              width: '680px',
              maxWidth: '92vw',
              maxHeight: '88vh',
              borderRadius: '24px',
              flexDirection: 'column',
              boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
              fontFamily: "'Nunito', sans-serif",
            }}>
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg,#1a73e8,#0d47a1)',
                padding: '20px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexShrink: 0, borderRadius: '24px 24px 0 0',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <span style={{ fontSize:26 }}>🩸</span>
                  <div>
                    <div style={{ fontSize:18, fontWeight:800, color:'white' }}>FutureLabs24.com</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.8)', fontWeight:600 }}>Phlebotomist Dashboard</div>
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} style={{
                  background:'rgba(255,255,255,0.2)', border:'none', color:'white',
                  width:36, height:36, borderRadius:'50%', fontSize:22, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontFamily:"'Nunito', sans-serif", flexShrink:0,
                }}>×</button>
              </div>

              {/* Scrollable body */}
              <div style={{ flex:1, minHeight:0, overflowY:'auto', padding:'20px', display:'flex', flexDirection:'column', gap:14 }}>

                {/* 1. Patient Details */}
                <div style={{ background:'white', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
                  <div style={{ padding:'12px 16px', fontSize:14, fontWeight:800, color:'#1a1a2e', borderBottom:'1px solid #f0f0f0', background:'#fafafa', borderRadius:'16px 16px 0 0' }}>👤 Patient Details</div>
                  <div style={{ padding:'14px 16px' }}>
                    {[
                      { label:'Booking Name', value: selectedOrder.user?.name },
                      { label:'Address',      value: `${selectedOrder.shippingAddress?.address || ''}, ${selectedOrder.shippingAddress?.city || ''}` },
                      { label:'Phone',        value: selectedOrder.user?.phone },
                      { label:'Email',        value: selectedOrder.user?.email },
                    ].map((r,i) => (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'7px 0', fontSize:13, borderBottom:'1px solid #f9f9f9' }}>
                        <span style={{ color:'#888', fontWeight:600, flexShrink:0, marginRight:12 }}>{r.label}</span>
                        <span style={{ color:'#1a1a2e', fontWeight:700, textAlign:'right' }}>{r.value}</span>
                      </div>
                    ))}
                    <div style={{ display:'flex', gap:10, marginTop:14 }}>
                      {selectedOrder.navigationUrl && (
                        <button onClick={() => openNavigation(selectedOrder.navigationUrl)} style={{ flex:1, background:'#1a73e8', color:'white', border:'none', borderRadius:10, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}>📍 GPS Location</button>
                      )}
                      <button onClick={() => window.open(`tel:${selectedOrder.user?.phone}`)} style={{ flex:1, background:'#43a047', color:'white', border:'none', borderRadius:10, padding:'10px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'Nunito',sans-serif" }}>📞 Call</button>
                    </div>
                  </div>
                </div>

                {/* 2. Phlebotomy Status */}
                <div style={{ background:'white', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
                  <div style={{ padding:'12px 16px', fontSize:14, fontWeight:800, color:'#1a1a2e', borderBottom:'1px solid #f0f0f0', background:'#fafafa', borderRadius:'16px 16px 0 0' }}>✅ Phlebotomy Status</div>
                  <div style={{ padding:'14px 16px', display:'flex', gap:10 }}>
                    <button onClick={() => selectedOrder.orderStatus === 'scheduled' && updateOrderStatus(selectedOrder._id,'processing')} style={{ flex:1, border:'none', borderRadius:12, padding:'10px 6px', background: selectedOrder.orderStatus !== 'scheduled' ? '#43a047' : '#e0e0e0', color: selectedOrder.orderStatus !== 'scheduled' ? 'white' : '#888', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4, fontFamily:"'Nunito',sans-serif" }}>
                      <span style={{ fontSize:20 }}>{selectedOrder.orderStatus !== 'scheduled' ? '✅' : '⭕'}</span><span>Reached</span>
                    </button>
                    <button style={{ flex:1, border:'none', borderRadius:12, padding:'10px 6px', background: selectedOrder.orderStatus === 'delivered' ? '#43a047' : '#e0e0e0', color: selectedOrder.orderStatus === 'delivered' ? 'white' : '#888', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4, fontFamily:"'Nunito',sans-serif" }}>
                      <span style={{ fontSize:20 }}>{selectedOrder.orderStatus === 'delivered' ? '✅' : '⭕'}</span><span>Collected Sample</span>
                    </button>
                    <button onClick={() => selectedOrder.orderStatus === 'processing' && updateOrderStatus(selectedOrder._id,'delivered')} style={{ flex:1, border:'none', borderRadius:12, padding:'10px 6px', background: selectedOrder.orderStatus === 'processing' ? '#f57c00' : '#e0e0e0', color: selectedOrder.orderStatus === 'processing' ? 'white' : '#888', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4, fontFamily:"'Nunito',sans-serif" }}>
                      <span style={{ fontSize:20 }}>→</span><span>Moving to Next</span>
                    </button>
                  </div>
                </div>

                {/* 3. Sample Collection */}
                <div style={{ background:'white', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
                  <div style={{ padding:'12px 16px', fontSize:14, fontWeight:800, color:'#1a1a2e', borderBottom:'1px solid #f0f0f0', background:'#fafafa', borderRadius:'16px 16px 0 0' }}>🧪 Sample Collection</div>
                  <div style={{ padding:'14px 16px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                    {[{t:'Blood Sample Pic',cb:'Random Sample',type:'blood'},{t:'Urine Sample Pic',cb:'Not Given',type:'urine'}].map((s,i) => (
                      <div key={i} style={{ border:'2px dashed #ddd', borderRadius:14, padding:'14px 10px', textAlign:'center' }}>
                        <div style={{ fontSize:12, fontWeight:800, color:'#333', marginBottom:8 }}>{s.t}</div>
                        <input type="file" accept="image/*" id={`${s.type}-${selectedOrder._id}`} style={{display:'none'}} onChange={(e)=>uploadSamplePhoto(selectedOrder._id,s.type,e.target.files[0])} />
                        <div style={{ fontSize:32, marginBottom:6, cursor:'pointer', position:'relative', width:80, height:80, margin:'0 auto', border:samplePhotos[`${selectedOrder._id}-${s.type}`]?'none':'2px dashed #ccc', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={()=>document.getElementById(`${s.type}-${selectedOrder._id}`).click()}>
                          {samplePhotos[`${selectedOrder._id}-${s.type}`] ? <img src={samplePhotos[`${selectedOrder._id}-${s.type}`]} alt={s.t} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:8}} /> : '📷'}
                        </div>
                        <div style={{ fontSize:11, color:'#888', fontWeight:600, marginBottom:8 }}>Collected at: {new Date().toLocaleTimeString()}</div>
                        <div style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'center', fontSize:11, fontWeight:700, color:'#555' }}>
                          <input type="checkbox" checked={sampleChecks[`${selectedOrder._id}-${s.type}`]||false} onChange={()=>toggleSampleCheck(selectedOrder._id,s.type)} style={{ accentColor:'#1a73e8', width:14, height:14 }} /><span>{s.cb}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Payment Status */}
                <div style={{ background:'white', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
                  <div style={{ padding:'12px 16px', fontSize:14, fontWeight:800, color:'#1a1a2e', borderBottom:'1px solid #f0f0f0', background:'#fafafa', borderRadius:'16px 16px 0 0' }}>💳 Payment Status</div>
                  <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, fontWeight:700, color:selectedOrder.isPaid?'#43a047':'#e53935' }}><input type="checkbox" checked={selectedOrder.isPaid} readOnly style={{ width:16, height:16, accentColor:'#1a73e8' }} /><span>{selectedOrder.isPaid?'Prepaid':'Not Prepaid'}</span></div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, fontWeight:700, color:!selectedOrder.isPaid&&!paymentCollected[selectedOrder._id]?'#f57c00':'#888' }}><input type="checkbox" checked={!selectedOrder.isPaid&&!paymentCollected[selectedOrder._id]} readOnly style={{ width:16, height:16, accentColor:'#1a73e8' }} /><span>Payment Pending Rs. {selectedOrder.totalPrice}</span></div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, fontWeight:700, color:paymentCollected[selectedOrder._id]?'#43a047':'#888', cursor:!selectedOrder.isPaid?'pointer':'default' }} onClick={()=>!selectedOrder.isPaid&&!paymentCollected[selectedOrder._id]&&collectPayment(selectedOrder._id,selectedOrder.totalPrice)}><input type="checkbox" checked={paymentCollected[selectedOrder._id]||false} onChange={()=>!selectedOrder.isPaid&&collectPayment(selectedOrder._id,selectedOrder.totalPrice)} style={{ width:16, height:16, accentColor:'#1a73e8', cursor:'pointer' }} /><span>Payment Collected By Phlebo Rs. {selectedOrder.totalPrice}</span></div>
                    <div style={{ marginTop:6, paddingTop:10, borderTop:'1px solid #eee', fontSize:14, fontWeight:800, color:'#1a1a2e', display:'flex', justifyContent:'space-between' }}>
                      <span>TOTAL CASH ON HAND:</span><span>Rs. {paymentCollected[selectedOrder._id]?selectedOrder.totalPrice:0}</span>
                    </div>
                  </div>
                </div>

                {/* 5. Tests Ordered */}
                <div style={{ background:'white', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
                  <div style={{ padding:'12px 16px', fontSize:14, fontWeight:800, color:'#1a1a2e', borderBottom:'1px solid #f0f0f0', background:'#fafafa', borderRadius:'16px 16px 0 0' }}>🔬 Tests Ordered</div>
                  <div style={{ padding:'14px 16px' }}>
                    {selectedOrder.orderItems?.map((item,i) => (
                      <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', fontSize:13, borderBottom:'1px solid #f5f5f5' }}>
                        <span style={{ color:'#444', fontWeight:600 }}>{item.name}</span>
                        <span style={{ color:'#1a73e8', fontWeight:700 }}>₹{item.price}</span>
                      </div>
                    ))}
                    <div style={{ display:'flex', justifyContent:'space-between', paddingTop:10, marginTop:4, borderTop:'2px solid #e8f0fe', fontSize:14, fontWeight:800, color:'#1a1a2e' }}>
                      <span>Total</span><span>₹{selectedOrder.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {/* 6. Final Handover */}
                <div style={{ background:'white', borderRadius:16, boxShadow:'0 2px 8px rgba(0,0,0,0.07)' }}>
                  <div style={{ padding:'12px 16px', fontSize:14, fontWeight:800, color:'#1a1a2e', borderBottom:'1px solid #f0f0f0', background:'#fafafa', borderRadius:'16px 16px 0 0' }}>📦 Final Handover</div>
                  <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:10 }}>
                    {[{t:'✅ Sample Handover',type:'sample'},{t:'✅ Amount Handover to Lab',type:'amount'}].map((h,i) => (
                      <button key={i} onClick={()=>toggleHandover(selectedOrder._id,h.type)} style={{ background:handoverStatus[`${selectedOrder._id}-${h.type}`]?'#43a047':'#e0e0e0', color:handoverStatus[`${selectedOrder._id}-${h.type}`]?'white':'#888', border:'none', borderRadius:14, padding:'14px 16px', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:"'Nunito',sans-serif", display:'flex', alignItems:'center', justifyContent:'space-between', transition:'all 0.2s' }}>
                        <span>{h.t}</span><span>{handoverStatus[`${selectedOrder._id}-${h.type}`]?'✅':'⭕'}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 7. Navigate */}
                {selectedOrder.navigationUrl && (
                  <button onClick={() => openNavigation(selectedOrder.navigationUrl)} style={{ width:'100%', background:'linear-gradient(135deg,#1a73e8,#0d47a1)', color:'white', border:'none', borderRadius:14, padding:16, fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:"'Nunito',sans-serif", display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                    🗺️ Open in Google Maps
                  </button>
                )}

              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default PhlebotomistDashboard;