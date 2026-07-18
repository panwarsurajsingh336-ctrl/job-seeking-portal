import axios from 'axios';
import demoApi from './demoApi.js';

const apiUrl = import.meta.env.VITE_API_URL;
const api = apiUrl ? axios.create({ baseURL: apiUrl }) : demoApi;

if (apiUrl) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('job_portal_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
}

export default api;
