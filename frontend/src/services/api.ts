import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  githubLogin: () => { window.location.href = `${API_BASE}/auth/github`; },
  getProfile: () => api.get('/auth/profile'),
};

export const repoAPI = {
  sync: () => api.post('/repos/sync'),
  getAll: (search?: string) => api.get('/repos', { params: { search } }),
  getOne: (id: number) => api.get(`/repos/${id}`),
};

export const scanAPI = {
  start: (repoId: number) => api.post(`/scans/repos/${repoId}/start`),
  getByRepo: (repoId: number) => api.get(`/scans/repos/${repoId}`),
  getOne: (scanId: number) => api.get(`/scans/${scanId}`),
};

export const vulnAPI = {
  getAll: (params?: {
    severity?: string;
    scanner?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/vulnerabilities', { params }),
  getOne: (id: number) => api.get(`/vulnerabilities/${id}`),
  getExplanation: (id: number) => api.get(`/vulnerabilities/${id}/explain`),
  getRemediation: (id: number) => api.get(`/vulnerabilities/${id}/remediate`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export default api;
