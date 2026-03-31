import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('meditrust_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('meditrust_token');
      localStorage.removeItem('meditrust_user');
      localStorage.removeItem('meditrust_role');
      localStorage.removeItem('meditrust_entity_id');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
