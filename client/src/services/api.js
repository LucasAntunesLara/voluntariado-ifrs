import axios from "axios";

/**
 * Instância configurada do Axios para comunicação com o backend do sistema de voluntariado.
 */
const api = axios.create({
  baseURL: "http://localhost:3000", // Substitua pela URL da sua API backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para injetar o token JWT em todas as requisições autenticadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
