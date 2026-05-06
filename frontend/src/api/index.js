import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users'),
};

export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  addMember: (projectId, userId) => api.post(`/projects/${projectId}/members/${userId}`),
  removeMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),
};

export const taskAPI = {
  getByProject: (projectId) => api.get(`/projects/${projectId}/tasks`),
  getById: (taskId) => api.get(`/tasks/${taskId}`),
  create: (projectId, data) => api.post(`/projects/${projectId}/tasks`, data),
  update: (taskId, data) => api.put(`/tasks/${taskId}`, data),
  updateStatus: (taskId, status) => api.patch(`/tasks/${taskId}/status`, { status }),
  delete: (taskId) => api.delete(`/tasks/${taskId}`),
  myTasks: () => api.get('/tasks/my'),
};

export const dashboardAPI = {
  get: () => api.get('/dashboard'),
};

export default api;
