import axios from 'axios';

const API = axios.create({
  baseURL: 'https://ecommerce-backend-ecru-two.vercel.app/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Products API
export const productsAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  create: (formData) => API.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/products/${id}`),
  getCategories: () => API.get('/products/categories/list'),
};

// Orders API
export const ordersAPI = {
  create: (data) => API.post('/orders', data),
  getMy: () => API.get('/orders/my'),
  getAll: (params) => API.get('/orders', { params }),
  getOne: (id) => API.get(`/orders/${id}`),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
  getStats: () => API.get('/orders/stats/summary'),
};

// Users API (Admin)
export const usersAPI = {
  getAll: (params) => API.get('/users', { params }),
  getStats: () => API.get('/users/stats'),
};

// Payment API
export const paymentAPI = {
  initiateJazzCash: (data) => API.post('/payment/jazzcash/initiate', data),
  initiateEasyPaisa: (data) => API.post('/payment/easypaisa/initiate', data),
  getStatus: (orderId) => API.get(`/payment/status/${orderId}`)
};

export default API;
