// Development mode - set to true to use mock data, false to use API
export const USE_MOCK_DATA = false;

// Public URL for assets (especially for GitHub Pages deployment)
export const PUBLIC_URL = process.env.PUBLIC_URL || '';

// Helper function to get correct image path
export const getImagePath = (imagePath) => {
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${PUBLIC_URL}/${cleanPath}`;
};

// API Configuration
// Option 1: Local development server
// export const baseUrl = "http://localhost:5000";
export const baseUrl = "http://147.93.27.120:3000";

export const API_ENDPOINTS = {
  // Main banners
  MAIN_BANNERS: '/api/v1/banners/main',
  BOTTOM_BANNERS: '/api/v1/banners/bottom',
  RANDOM_BANNER: '/api/v1/banners/bottom/random',

  // Categories
  LESS_PRICE: '/api/v1/category/lessPrice/selected',
  VITAL_ORGANS: '/api/v1/category/organ/selected',
  WOMEN_AGE: '/api/v1/category/womenage/selected',
  WOMEN_CARE: '/api/v1/category/women/selected',
  MEN_AGE: '/api/v1/category/menage/selected',
  MEN_CARE: '/api/v1/category/men/selected',
  LIFESTYLE: '/api/v1/category/lifestyle/selected',

  // Tests
  SPECIAL_CARE: '/api/v1/tests/selected/Special Care Packages',
  SINGLE_TEST: '/api/v1/tests/selected/Single Test',
  EXCLUSIVE_TESTS: '/api/v1/tests/category/Exclusive',

  // Dynamic endpoints
  TESTS_BY_CATEGORY: (category) => `/api/v1/tests/category/${category}`,
  TEST_BY_ID: (id) => `/api/v1/tests/${id}`,

  // Cart
  CART: (userId) => `/api/v1/cart/${userId}`,
  CART_ADD: '/api/v1/cart/add',
  CART_REMOVE: '/api/v1/cart/remove',

  // Auth
  AUTH_REGISTER: '/api/v1/auth/register',
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_OTP_GENERATE: '/api/v1/auth/otp/generate',
  AUTH_OTP_VERIFY: '/api/v1/auth/otp/verify',
  AUTH_ME: '/api/v1/auth/me',

  // Locations
  CHECK_PINCODE: (pincode) => `/api/v1/locations/check/${pincode}`,
};