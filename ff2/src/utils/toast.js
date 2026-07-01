// Lightweight, dependency-free toast notifications for smooth user feedback.
// Usage: showToast('Added to cart'); showToast('Something went wrong', 'error');

export const showToast = (message, type = 'success') => {
  if (typeof document === 'undefined') return;

  let container = document.getElementById('ff-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'ff-toast-container';
    container.style.cssText =
      'position:fixed;top:80px;right:20px;z-index:99999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
    document.body.appendChild(container);
  }

  const colors = {
    success: '#1f7068',
    error: '#dc2626',
    info: '#2563eb',
  };

  const toast = document.createElement('div');
  toast.style.cssText = `
    background:${colors[type] || colors.success};color:#fff;padding:12px 18px;border-radius:12px;
    font:600 14px/1.35 'Segoe UI',Roboto,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.2);
    max-width:340px;opacity:0;transform:translateX(24px);transition:opacity .25s,transform .25s;
    display:flex;align-items:center;gap:8px;pointer-events:auto;`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(24px)';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
};

export default showToast;
