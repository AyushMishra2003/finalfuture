import { baseUrl } from './config';

class ApiService {
  constructor() {
    this.baseURL = baseUrl;
    this.token = localStorage.getItem('token');
  }

  // Set token for authenticated requests
  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Remove token
  removeToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Get default headers
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth),
      ...options,
    };

    try {
      console.log(`Making request to: ${url}`);
      const response = await fetch(url, config);

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`HTTP Error ${response.status}: ${response.statusText}`, errorData);
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn('Response is not JSON:', contentType);
        return {};
      }

      const data = await response.json();
      console.log(`Successful response from: ${url}`, data);
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        const networkError = new Error(`Network error: Unable to connect to ${url}. Please make sure the backend is running at ${this.baseURL}.`);
        console.error(networkError.message);
        throw networkError;
      }
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const data = await this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async generateOTP(phoneData) {
    return this.request('/api/v1/auth/otp/generate', {
      method: 'POST',
      body: JSON.stringify(phoneData),
    });
  }

  async verifyOTP(otpData) {
    const data = await this.request('/api/v1/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify(otpData),
    });

    if (data.token) {
      this.setToken(data.token);
    }

    return data;
  }

  async getMe() {
    return this.request('/api/v1/auth/me', {
      includeAuth: true,
    });
  }

  async logout() {
    this.removeToken();
    return { success: true };
  }

  // Test methods
  async getTests() {
    return this.request('/api/v1/tests');
  }

  async getTestById(id) {
    return this.request(`/api/v1/tests/${id}`);
  }

  async getTestsByCategory(category) {
    return this.request(`/api/v1/tests/category/${category}`);
  }

  // Category methods
  async getCategories() {
    return this.request('/api/v1/category');
  }

  async getSelectedLessPrice() {
    return this.request('/api/v1/category/lessPrice/selected');
  }

  async getSelectedVitalOrgans() {
    return this.request('/api/v1/category/organ/selected');
  }

  async getSelectedWomenAge() {
    return this.request('/api/v1/category/womenage/selected');
  }

  async getSelectedWomenCare() {
    return this.request('/api/v1/category/women/selected');
  }

  async getSelectedMenAge() {
    return this.request('/api/v1/category/menage/selected');
  }

  async getSelectedMenCare() {
    return this.request('/api/v1/category/men/selected');
  }

  async getSelectedLifestyle() {
    return this.request('/api/v1/category/lifestyle/selected');
  }

  async getSelectedSpecialCare() {
    return this.request('/api/v1/tests/selected/Special Care Packages');
  }

  async getSelectedSingleTest() {
    return this.request('/api/v1/tests/selected/Single Test');
  }

  // Banner methods
  async getMainBanners() {
    return this.request('/api/v1/banners/main');
  }

  async getBottomBanners() {
    return this.request('/api/v1/banners/bottom');
  }

  async getRandomBanner() {
    return this.request('/api/v1/banners/bottom/random');
  }

  // Cart methods
  async getCart(userId) {
    return this.request(`/api/v1/cart/${userId}`);
  }

  async addToCart(userId, testId) {
    return this.request('/api/v1/cart/add', {
      method: 'POST',
      body: JSON.stringify({ userId, testId }),
    });
  }

  async removeFromCart(userId, testId) {
    return this.request('/api/v1/cart/remove', {
      method: 'DELETE',
      body: JSON.stringify({ userId, testId }),
    });
  }

  // Location methods
  async checkPincode(pincode) {
    return this.request(`/api/v1/locations/check/${pincode}`);
  }

  // Collector Folder Management (Admin)
  async getCollectorFolders() {
    return this.request('/api/v1/admin/collector-folders', {
      includeAuth: true
    });
  }

  async createCollectorFolder(data) {
    return this.request('/api/v1/admin/collector-folders', {
      method: 'POST',
      body: JSON.stringify(data),
      includeAuth: true
    });
  }

  async updateCollectorFolder(id, data) {
    return this.request(`/api/v1/admin/collector-folders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      includeAuth: true
    });
  }

  async deleteCollectorFolder(id) {
    return this.request(`/api/v1/admin/collector-folders/${id}`, {
      method: 'DELETE',
      includeAuth: true
    });
  }

  async getFolderByPincode(pincode) {
    return this.request(`/api/v1/admin/collector-folders/pincode/${pincode}`);
  }

  async getFolderStats(id) {
    return this.request(`/api/v1/admin/collector-folders/${id}/stats`, {
      includeAuth: true
    });
  }

  // Booking Management
  async getAvailableSlots(pincode, date) {
    return this.request(`/api/v1/bookings/available-slots?pincode=${pincode}&date=${date}`);
  }

  async findNextAvailableSlot(pincode, currentHour, date) {
    return this.request(`/api/v1/bookings/next-available-slot?pincode=${pincode}&currentHour=${currentHour}&date=${date}`);
  }

  async bookTimeSlot(data) {
    return this.request('/api/v1/bookings/book-slot', {
      method: 'POST',
      body: JSON.stringify(data),
      includeAuth: true
    });
  }

  async getCollectorBookings(folderId, date) {
    const url = date
      ? `/api/v1/bookings/collector/${folderId}?date=${date}`
      : `/api/v1/bookings/collector/${folderId}`;
    return this.request(url, {
      includeAuth: true
    });
  }

  async cancelBooking(orderId) {
    return this.request(`/api/v1/bookings/cancel/${orderId}`, {
      method: 'DELETE',
      includeAuth: true
    });
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;