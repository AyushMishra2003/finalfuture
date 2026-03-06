import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .oa-root {
    font-family: 'DM Sans', sans-serif;
    background: #f0f2f8;
    min-height: 100vh;
    padding: 24px 16px;
  }

  .oa-inner { max-width: 1100px; margin: 0 auto; }

  /* Header */
  .oa-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }

  .oa-header-icon {
    width: 48px; height: 48px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 4px 14px rgba(102,126,234,.35);
    flex-shrink: 0;
  }

  .oa-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(20px, 4vw, 28px);
    font-weight: 800; color: #1a1f36; letter-spacing: -0.5px;
  }

  /* Tabs */
  .oa-tabs { display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; }

  .oa-tab {
    flex: 1; min-width: 140px; padding: 12px 20px;
    border: 2px solid #e2e5f0; background: white; cursor: pointer;
    border-radius: 12px; font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: 14px; color: #6b7280;
    transition: all .25s; white-space: nowrap; text-align: center;
  }

  .oa-tab.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white; border-color: transparent;
    box-shadow: 0 4px 16px rgba(102,126,234,.3);
  }

  .oa-tab:not(.active):hover { border-color: #667eea; color: #667eea; }

  .oa-tab .badge {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 22px; height: 22px; border-radius: 100px;
    font-size: 11px; font-weight: 700; margin-left: 8px; padding: 0 6px;
    background: rgba(255,255,255,.25); color: inherit;
  }

  .oa-tab:not(.active) .badge { background: #f0f2f8; color: #667eea; }

  /* Loading */
  .oa-loading { text-align: center; padding: 60px 20px; color: #9ca3af; font-size: 16px; }

  .oa-spinner {
    width: 36px; height: 36px;
    border: 3px solid #e2e5f0; border-top-color: #667eea;
    border-radius: 50%; animation: spin .7s linear infinite; margin: 0 auto 12px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Grid */
  .oa-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
    gap: 18px;
  }

  /* Card */
  .oa-card {
    background: white; border-radius: 20px; border: 1.5px solid #e8eaf2;
    overflow: hidden; transition: transform .25s, box-shadow .25s, border-color .25s;
    display: flex; flex-direction: column;
  }

  .oa-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(102,126,234,.13); border-color: #c4caef;
  }

  .oa-card.assigned { border-left: 4px solid #22c55e; }

  .oa-card-stripe { height: 5px; background: linear-gradient(90deg, #667eea, #764ba2); }
  .oa-card.assigned .oa-card-stripe { background: linear-gradient(90deg, #22c55e, #16a34a); }

  .oa-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }

  .oa-card-head {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 18px; gap: 10px;
  }

  .oa-order-id { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; color: #1a1f36; }

  .oa-order-id span {
    font-size: 12px; font-weight: 600; color: #9ca3af;
    display: block; margin-bottom: 2px; font-family: 'DM Sans', sans-serif;
  }

  .oa-status-chip {
    padding: 5px 12px; border-radius: 100px; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.8px;
    background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white;
    white-space: nowrap; flex-shrink: 0; box-shadow: 0 2px 8px rgba(251,191,36,.3);
  }

  .oa-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; flex: 1; }
  .oa-info-item { display: flex; flex-direction: column; gap: 2px; }
  .oa-info-item.full { grid-column: 1 / -1; }

  .oa-info-label {
    font-size: 10px; font-weight: 600; color: #9ca3af;
    text-transform: uppercase; letter-spacing: 0.6px;
  }

  .oa-info-value { font-size: 13.5px; color: #374151; font-weight: 500; line-height: 1.4; word-break: break-word; }

  .oa-info-value.amount {
    font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #667eea;
  }

  .oa-gps-tag {
    display: inline-flex; align-items: center; gap: 4px; font-size: 11px;
    background: #eef0fb; color: #667eea; padding: 4px 8px;
    border-radius: 6px; font-weight: 600; margin-top: 2px;
  }

  .oa-divider { height: 1px; background: #f0f2f8; margin: 16px 0; }

  .oa-btn {
    width: 100%; padding: 13px; border: none; border-radius: 12px;
    font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 13.5px;
    cursor: pointer; transition: all .25s; text-transform: uppercase; letter-spacing: 0.5px;
    background: linear-gradient(135deg, #667eea, #764ba2); color: white;
    box-shadow: 0 4px 14px rgba(102,126,234,.28);
  }

  .oa-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(102,126,234,.4); }

  .oa-btn:disabled { background: #e5e7eb; color: #9ca3af; cursor: not-allowed; box-shadow: none; }

  /* ── PAGINATION ── */
  .oa-pagination-wrap {
    margin-top: 28px; display: flex; align-items: center;
    justify-content: space-between; flex-wrap: wrap; gap: 12px;
  }

  .oa-pagination-info { font-size: 13px; color: #9ca3af; font-weight: 500; }
  .oa-pagination-info strong { color: #374151; }

  .oa-pagination { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }

  .oa-page-btn {
    min-width: 38px; height: 38px; padding: 0 10px;
    border: 1.5px solid #e2e5f0; background: white; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
    color: #6b7280; cursor: pointer; transition: all .2s;
    display: flex; align-items: center; justify-content: center;
  }

  .oa-page-btn:hover:not(:disabled):not(.active) {
    border-color: #667eea; color: #667eea; background: #f5f6ff;
  }

  .oa-page-btn.active {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white; border-color: transparent;
    box-shadow: 0 3px 10px rgba(102,126,234,.3);
  }

  .oa-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .oa-page-btn.arrow { font-size: 18px; font-weight: 400; }

  .oa-page-dots {
    width: 38px; height: 38px; display: flex; align-items: center;
    justify-content: center; color: #9ca3af; font-size: 14px; letter-spacing: 1px;
  }

  /* Empty */
  .oa-empty {
    grid-column: 1 / -1; text-align: center; padding: 80px 20px;
    background: white; border-radius: 20px; border: 2px dashed #e2e5f0;
    color: #9ca3af; font-size: 16px;
  }
  .oa-empty-icon { font-size: 40px; display: block; margin-bottom: 12px; opacity: .6; }

  /* Modal */
  .oa-overlay {
    position: fixed; inset: 0; background: rgba(15,18,40,.55); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; padding: 16px; animation: fadeIn .2s;
  }

  @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }

  .oa-modal {
    background: white; border-radius: 24px; padding: 28px; max-width: 860px;
    width: 100%; max-height: 88vh; overflow-y: auto; position: relative; animation: slideUp .25s;
  }

  @keyframes slideUp { from { transform:translateY(20px); opacity:0 } to { transform:none; opacity:1 } }

  .oa-modal-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; padding-bottom: 18px; border-bottom: 2px solid #f0f2f8;
  }

  .oa-modal-head h3 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #1a1f36; }

  .oa-close {
    width: 36px; height: 36px; border-radius: 10px; border: none;
    background: #f0f2f8; cursor: pointer; font-size: 18px; color: #6b7280;
    transition: all .2s; display: flex; align-items: center; justify-content: center;
  }
  .oa-close:hover { background: #e2e5f0; color: #1a1f36; }

  .oa-collector {
    border: 1.5px solid #e8eaf2; border-radius: 16px; padding: 18px;
    margin-bottom: 14px; transition: border-color .2s, box-shadow .2s;
  }
  .oa-collector:hover { border-color: #667eea; box-shadow: 0 4px 16px rgba(102,126,234,.12); }

  .oa-collector-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; }
  .oa-collector-info { flex: 1; min-width: 200px; }
  .oa-collector-info h4 { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #1a1f36; margin-bottom: 10px; }
  .oa-collector-meta { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; }
  .oa-collector-row { font-size: 12.5px; color: #6b7280; }
  .oa-collector-row strong { color: #374151; font-weight: 600; }

  .oa-collector-right { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
  .oa-badges { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }

  .oa-badge { display: flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 100px; font-weight: 700; font-size: 13px; }
  .oa-badge.dist { background: #eff6ff; color: #2563eb; }
  .oa-badge.fare { background: #fff7ed; color: #ea580c; }

  .oa-btn-green {
    padding: 11px 22px; background: linear-gradient(135deg, #22c55e, #16a34a);
    color: white; border: none; border-radius: 10px; font-family: 'DM Sans', sans-serif;
    font-weight: 700; font-size: 13px; cursor: pointer; transition: all .25s;
    white-space: nowrap; box-shadow: 0 3px 10px rgba(34,197,94,.25);
  }
  .oa-btn-green:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(34,197,94,.35); }

  @media (max-width: 600px) {
    .oa-collector-right { align-items: flex-start; width: 100%; }
    .oa-badges { justify-content: flex-start; }
    .oa-btn-green { width: 100%; text-align: center; }
    .oa-modal { padding: 18px; border-radius: 18px; }
    .oa-pagination-wrap { justify-content: center; }
    .oa-pagination-info { width: 100%; text-align: center; }
  }

  @media (max-width: 480px) {
    .oa-tabs { flex-direction: column; }
    .oa-tab { min-width: unset; }
    .oa-page-btn { min-width: 34px; height: 34px; font-size: 12px; }
  }
`;

const ITEMS_PER_PAGE = 9;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="oa-pagination">
      <button
        className="oa-page-btn arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous page"
      >
        ‹
      </button>

      {getPageNumbers().map((page, idx) =>
        page === '...'
          ? <span key={`dots-${idx}`} className="oa-page-dots">···</span>
          : (
            <button
              key={page}
              className={`oa-page-btn ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
      )}

      <button
        className="oa-page-btn arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next page"
      >
        ›
      </button>
    </div>
  );
};

const OrderAssignment = () => {
  const [unassignedOrders, setUnassignedOrders] = useState([]);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [availableCollectors, setAvailableCollectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('unassigned');
  const [currentPage, setCurrentPage] = useState(1);

  const baseUrl = process.env.REACT_APP_API_URL || 'http://147.93.27.120:3000/api/v1';

  useEffect(() => {
    fetchOrders();
    setCurrentPage(1);
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const endpoint = activeTab === 'unassigned'
        ? '/admin/order-assignment/unassigned'
        : '/admin/order-assignment/assigned';
      const response = await axios.get(`${baseUrl}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (activeTab === 'unassigned') setUnassignedOrders(response.data.data);
      else setAssignedOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCollectors = async (orderId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${baseUrl}/admin/order-assignment/${orderId}/available-collectors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableCollectors(response.data.data);
      setSelectedOrder(orderId);
    } catch (error) {
      console.error('Error fetching collectors:', error);
      alert(error.response?.data?.error || 'Failed to fetch collectors');
    } finally {
      setLoading(false);
    }
  };

  const assignOrder = async (collectorFolderId) => {
    if (!window.confirm('Assign this order to the selected collector?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${baseUrl}/admin/order-assignment/${selectedOrder}/assign`,
        { collectorFolderId, scheduledDate: new Date(), scheduledHour: 9 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Order assigned successfully!');
      setSelectedOrder(null);
      setAvailableCollectors([]);
      fetchOrders();
    } catch (error) {
      console.error('Error assigning order:', error);
      alert('Failed to assign order');
    } finally {
      setLoading(false);
    }
  };

  const allOrders = activeTab === 'unassigned' ? unassignedOrders : assignedOrders;
  const totalPages = Math.ceil(allOrders.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const orders = allOrders.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="oa-root">
        <div className="oa-inner">

          {/* Header */}
          <div className="oa-header">
            <div className="oa-header-icon">📋</div>
            <h2>Order Assignment System</h2>
          </div>

          {/* Tabs */}
          <div className="oa-tabs">
            <button
              className={`oa-tab ${activeTab === 'unassigned' ? 'active' : ''}`}
              onClick={() => setActiveTab('unassigned')}
            >
              Unassigned <span className="badge">{unassignedOrders.length}</span>
            </button>
            <button
              className={`oa-tab ${activeTab === 'assigned' ? 'active' : ''}`}
              onClick={() => setActiveTab('assigned')}
            >
              Assigned <span className="badge">{assignedOrders.length}</span>
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="oa-loading">
              <div className="oa-spinner" />
              Fetching orders…
            </div>
          )}

          {/* Grid + Pagination */}
          {!loading && (
            <>
              <div className="oa-grid">
                {orders.length === 0 ? (
                  <div className="oa-empty">
                    <span className="oa-empty-icon">{activeTab === 'unassigned' ? '✅' : '📭'}</span>
                    {activeTab === 'unassigned' ? 'All orders are assigned!' : 'No assigned orders yet'}
                  </div>
                ) : orders.map((order) => (
                  <div key={order._id} className={`oa-card ${activeTab === 'assigned' ? 'assigned' : ''}`}>
                    <div className="oa-card-stripe" />
                    <div className="oa-card-body">

                      <div className="oa-card-head">
                        <div className="oa-order-id">
                          <span>Order ID</span>
                          #{order._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="oa-status-chip">{order.orderStatus}</div>
                      </div>

                      <div className="oa-info-grid">
                        <div className="oa-info-item">
                          <div className="oa-info-label">Customer</div>
                          <div className="oa-info-value">{order.user?.name || 'N/A'}</div>
                        </div>
                        <div className="oa-info-item">
                          <div className="oa-info-label">Phone</div>
                          <div className="oa-info-value">{order.user?.phone || 'N/A'}</div>
                        </div>
                        <div className="oa-info-item">
                          <div className="oa-info-label">Amount</div>
                          <div className="oa-info-value amount">₹{order.totalPrice}</div>
                        </div>
                        <div className="oa-info-item">
                          <div className="oa-info-label">Pincode</div>
                          <div className="oa-info-value">{order.shippingAddress?.postalCode || 'N/A'}</div>
                        </div>

                        {activeTab === 'unassigned' ? (
                          <>
                            <div className="oa-info-item full">
                              <div className="oa-info-label">Address</div>
                              <div className="oa-info-value">{order.readableAddress || order.shippingAddress?.address || 'N/A'}</div>
                            </div>
                            {order.shippingAddress?.location?.latitude && (
                              <div className="oa-info-item full">
                                <div className="oa-info-label">GPS</div>
                                <span className="oa-gps-tag">
                                  📍 {order.shippingAddress.location.latitude.toFixed(4)}, {order.shippingAddress.location.longitude.toFixed(4)}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="oa-info-item">
                              <div className="oa-info-label">Collector</div>
                              <div className="oa-info-value">{order.bookingDetails?.collectorName || 'N/A'}</div>
                            </div>
                            <div className="oa-info-item">
                              <div className="oa-info-label">Scheduled</div>
                              <div className="oa-info-value">
                                {order.bookingDetails?.scheduledDate
                                  ? new Date(order.bookingDetails.scheduledDate).toLocaleDateString()
                                  : 'N/A'}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {activeTab === 'unassigned' && (
                        <>
                          <div className="oa-divider" />
                          <button
                            className="oa-btn"
                            onClick={() => fetchAvailableCollectors(order._id)}
                            disabled={!order.shippingAddress?.location?.latitude}
                          >
                            {order.shippingAddress?.location?.latitude ? '🔍 Find Collectors' : '⚠ No Location Data'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Bar */}
              {allOrders.length > 0 && (
                <div className="oa-pagination-wrap">
                  <div className="oa-pagination-info">
                    Showing&nbsp;
                    <strong>{startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, allOrders.length)}</strong>
                    &nbsp;of&nbsp;
                    <strong>{allOrders.length}</strong>&nbsp;orders
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Collectors Modal */}
      {selectedOrder && availableCollectors.length > 0 && (
        <div className="oa-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="oa-modal" onClick={e => e.stopPropagation()}>
            <div className="oa-modal-head">
              <h3>🩸 Available Collectors</h3>
              <button className="oa-close" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            {availableCollectors.map((collector) => (
              <div key={collector._id} className="oa-collector">
                <div className="oa-collector-top">
                  <div className="oa-collector-info">
                    <h4>{collector.name}</h4>
                    <div className="oa-collector-meta">
                      <div className="oa-collector-row"><strong>Phlebotomist:</strong> {collector.phlebotomist?.name}</div>
                      <div className="oa-collector-row"><strong>Phone:</strong> {collector.phlebotomist?.phone}</div>
                      <div className="oa-collector-row"><strong>Capacity:</strong> {collector.maxOrdersPerHour}/hr</div>
                      <div className="oa-collector-row"><strong>Hours:</strong> {collector.workingHours.start}:00 – {collector.workingHours.end}:00</div>
                      <div className="oa-collector-row" style={{gridColumn:'1/-1'}}><strong>Pincodes:</strong> {collector.pincodes.join(', ')}</div>
                    </div>
                  </div>

                  <div className="oa-collector-right">
                    <div className="oa-badges">
                      <div className="oa-badge dist">📍 {collector.distance}</div>
                      <div className="oa-badge fare">💰 {collector.estimatedFare}</div>
                    </div>
                    <button className="oa-btn-green" onClick={() => assignOrder(collector._id)}>
                      Assign to {collector.phlebotomist?.name}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderAssignment;