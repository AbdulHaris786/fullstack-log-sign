import axios from 'axios';

const API_BASE_URL = 'http://localhost:3003/api/users';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (userData) => api.post('/signup', userData),
  login: (credentials) => api.post('/login', credentials),
};

export const userAPI = {
  getProfile: () => api.get('/profile'),
  getUserById: (id) => api.get(`/${id}`),
  getAllStudents: () => api.get('/students'),
  getAllFaculty: () => api.get('/faculties'),
  getStudentById: (id) => api.get(`/students/${id}`),
  updateStudent: (id, data) => api.patch(`/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),
};

export default api;
