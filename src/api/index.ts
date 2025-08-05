import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Auth Service
export const authService = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Habit Service
export const habitService = {
  getHabits: () => api.get('/habits'),
  createHabit: (data: any) => api.post('/habits', data),
  updateHabit: (id: string, data: any) => api.put(`/habits/${id}`, data),
  deleteHabit: (id: string) => api.delete(`/habits/${id}`),
  toggleCompletion: (id: string, date: string) => api.post(`/habits/${id}/toggle-completion`, { date }),
};

// Analytics Service (NEW)
export const analyticsService = {
    getAnalytics: () => api.get('/analytics'),
};

// Profile Service (NEW)
export const profileService = {
    getProfile: () => api.get('/profile'),
    updateProfile: (data: { displayName: string; bio: string }) => api.put('/profile', data),
    updateAvatar: (formData: FormData) => api.put('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};