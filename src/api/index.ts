import axios from 'axios';

// Set the base API URL from environment variables or default to local development server
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

// Create a configured axios instance with base URL and JSON content type header
export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add request interceptor to attach authentication token to headers if available
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

/**
 * Auth Service - Handles user authentication related API calls
 */
export const authService = {
  // Register a new user
  register: (data: any) => api.post('/auth/register', data),
  // Authenticate existing user
  login: (data: any) => api.post('/auth/login', data),
  // Get current user's profile data
  getMe: () => api.get('/auth/me'),
};

/**
 * Habit Service - Manages habit-related CRUD operations
 */
export const habitService = {
  // Fetch all habits for current user
  getHabits: () => api.get('/habits'),
  // Create a new habit
  createHabit: (data: any) => api.post('/habits', data),
  // Update an existing habit by ID
  updateHabit: (id: string, data: any) => api.put(`/habits/${id}`, data),
  // Delete a habit by ID
  deleteHabit: (id: string) => api.delete(`/habits/${id}`),
  // Toggle completion status for a habit on specific date
  toggleCompletion: (id: string, date: string) => api.post(`/habits/${id}/toggle-completion`, { date }),
};

/**
 * Analytics Service - Provides habit analytics and statistics
 */
export const analyticsService = {
    // Get analytics data for user's habits
    getAnalytics: () => api.get('/analytics'),
};

/**
 * Profile Service - Handles user profile management
 */
export const profileService = {
    // Get current user's profile information
    getProfile: () => api.get('/profile'),
    // Update profile text information (display name and bio)
    updateProfile: (data: { displayName: string; bio: string }) => api.put('/profile', data),
    // Upload new avatar image (uses multipart form data)
    updateAvatar: (formData: FormData) => api.put('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};
