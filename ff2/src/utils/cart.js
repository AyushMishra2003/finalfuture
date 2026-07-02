// Unified cart service.
//
// - Guests: cart lives in localStorage (key "cart"), works without login.
// - Logged in: every change is mirrored to the account (PUT /cart/me) so the
//   cart shows up in the profile and follows the user across devices.
// - On login: the guest cart is merged into the account (POST /cart/me/merge).
//
// All mutations dispatch a "cartUpdated" event (and a legacy "storage" event)
// so the header badge and cart page update live.

import { API_V1 } from './config';

const CART_KEY = 'cart';

const getToken = () =>
  localStorage.getItem('userToken') || localStorage.getItem('token');

const isLoggedIn = () => !!(getToken() && localStorage.getItem('userId'));

// Stable identity for an item whether it carries _id, id or just a name.
const keyOf = (it) => String((it && (it.cartId || it._id || it.id || it.name)) || '');

const normalize = (items) =>
  (Array.isArray(items) ? items : [])
    .filter((it) => it && (it._id || it.id || it.name))
    .map((it) => ({
      ...it,
      cartId: keyOf(it),
      quantity: it.quantity && it.quantity > 0 ? it.quantity : 1,
    }));

const readLocal = () => {
  try {
    return normalize(JSON.parse(localStorage.getItem(CART_KEY)) || []);
  } catch {
    return [];
  }
};

const emit = (items) => {
  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items }));
};

// Best-effort persist to the account; never blocks the UI.
const persistRemote = (items) => {
  if (!isLoggedIn()) return;
  fetch(`${API_V1}/cart/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ items }),
  }).catch(() => {});
};

const writeLocal = (items, { sync = true } = {}) => {
  const norm = normalize(items);
  localStorage.setItem(CART_KEY, JSON.stringify(norm));
  emit(norm);
  if (sync) persistRemote(norm);
  return norm;
};

const mergeArrays = (a, b) => {
  const map = new Map();
  [...normalize(a), ...normalize(b)].forEach((it) => {
    const k = it.cartId;
    if (map.has(k)) {
      map.get(k).quantity = Math.max(map.get(k).quantity, it.quantity);
    } else {
      map.set(k, { ...it });
    }
  });
  return Array.from(map.values());
};

// ---- Public API -----------------------------------------------------------

export const getCart = () => readLocal();

export const getCartCount = () =>
  readLocal().reduce((n, it) => n + (it.quantity || 1), 0);

export const isInCart = (item) =>
  readLocal().some((it) => it.cartId === keyOf(item));

export const addToCart = (item, qty = 1) => {
  const items = readLocal();
  const k = keyOf(item);
  const existing = items.find((it) => it.cartId === k);
  if (existing) {
    existing.quantity = (existing.quantity || 1) + qty;
  } else {
    items.push({ ...item, cartId: k, quantity: qty });
  }
  return writeLocal(items);
};

export const removeFromCart = (cartId) =>
  writeLocal(readLocal().filter((it) => it.cartId !== String(cartId)));

export const setQuantity = (cartId, quantity) => {
  const q = Math.max(1, parseInt(quantity, 10) || 1);
  return writeLocal(
    readLocal().map((it) =>
      it.cartId === String(cartId) ? { ...it, quantity: q } : it
    )
  );
};

export const incrementQuantity = (cartId) => {
  const it = readLocal().find((i) => i.cartId === String(cartId));
  return setQuantity(cartId, (it ? it.quantity : 1) + 1);
};

export const decrementQuantity = (cartId) => {
  const it = readLocal().find((i) => i.cartId === String(cartId));
  return setQuantity(cartId, Math.max(1, (it ? it.quantity : 1) - 1));
};

export const clearCart = () => writeLocal([]);

// Pull the account cart and merge it into the local cart (call on app start
// when a session exists, so the saved cart reappears on a new device/tab).
export const loadAccountCart = async () => {
  if (!isLoggedIn()) return readLocal();
  try {
    const res = await fetch(`${API_V1}/cart/me`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.data)) {
      const merged = mergeArrays(readLocal(), data.data);
      return writeLocal(merged); // also re-persists the union
    }
  } catch {
    /* offline-friendly: keep local */
  }
  return readLocal();
};

// Merge the guest cart into the account on login, then adopt the result.
export const mergeGuestCartOnLogin = async () => {
  if (!isLoggedIn()) return readLocal();
  try {
    const res = await fetch(`${API_V1}/cart/me/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ items: readLocal() }),
    });
    const data = await res.json();
    if (data && data.success && Array.isArray(data.data)) {
      return writeLocal(data.data, { sync: false });
    }
  } catch {
    /* keep local cart if merge fails */
  }
  return readLocal();
};

// Subscribe to live cart changes. Returns an unsubscribe fn.
export const onCartChange = (handler) => {
  const fn = () => handler(readLocal());
  window.addEventListener('cartUpdated', fn);
  window.addEventListener('storage', fn);
  return () => {
    window.removeEventListener('cartUpdated', fn);
    window.removeEventListener('storage', fn);
  };
};

export const cartTotals = (items = readLocal()) => {
  const subtotal = items.reduce(
    (t, it) => t + (it.price || 0) * (it.quantity || 1),
    0
  );
  const mrp = items.reduce(
    (t, it) => t + (it.originalPrice || it.price || 0) * (it.quantity || 1),
    0
  );
  const savings = Math.max(0, mrp - subtotal);
  // Add a home-visit charge for low-value bookings (payable subtotal < ₹1200).
  const homeVisitCharge = subtotal > 0 && subtotal < 1200 ? 200 : 0;
  return { subtotal, mrp, savings, homeVisitCharge, total: subtotal + homeVisitCharge };
};
