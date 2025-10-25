import axios from 'axios';

// Configuração básica do Axios com variáveis de ambiente
const api = axios.create({
  baseURL: process.env.VUE_APP_AUTH_API_URL?.replace('/api/auth', '/api') || 'http://localhost:5000/api',
});

// Interceptor para adicionar o token JWT em cada requisição, se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Log para debug
console.log('🔐 axios.js configurado com baseURL:', api.defaults.baseURL);

export default api;