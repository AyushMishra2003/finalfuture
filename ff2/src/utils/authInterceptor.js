// Global auth wiring: attaches the right Bearer token to every API request,
// based on which area of the app is active (admin / collector / customer).
// Installed once at app startup (see index.js). Existing explicit
// Authorization headers are never overwritten.

import axios from 'axios';
import { baseUrl } from './config';

// Pick the token for the current context (the hash route determines the area).
const getToken = () => {
  const hash = (typeof window !== 'undefined' && window.location.hash) || '';
  if (hash.startsWith('#/admin')) return localStorage.getItem('adminToken');
  if (hash.startsWith('#/phlebotomist')) return localStorage.getItem('collectorToken');
  return localStorage.getItem('userToken') || localStorage.getItem('token');
};

export const installAuthInterceptors = () => {
  // --- axios ---
  axios.interceptors.request.use((config) => {
    const hasAuth = config.headers && (config.headers.Authorization || config.headers.authorization);
    if (!hasAuth) {
      const token = getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  // --- fetch (only for our API, only if no Authorization already set) ---
  const orig = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    try {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      const isApi = url.includes('/api/v1') || (baseUrl && url.startsWith(baseUrl));
      if (isApi) {
        const headers = new Headers(
          (init && init.headers) || (typeof input !== 'string' && input.headers) || {}
        );
        if (!headers.has('Authorization')) {
          const token = getToken();
          if (token) headers.set('Authorization', `Bearer ${token}`);
        }
        init = { ...init, headers };
      }
    } catch (e) {
      /* if anything goes wrong, fall through to a normal fetch */
    }
    return orig(input, init);
  };
};

export default installAuthInterceptors;
