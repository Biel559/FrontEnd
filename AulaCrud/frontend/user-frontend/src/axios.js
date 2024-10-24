import axios from 'axios';

// Configuração básica do Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Substitua pela URL correta do seu back-end
});

// Interceptor para adicionar o token JWT em cada requisição, se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
