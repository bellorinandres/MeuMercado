import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
console.log(axiosInstance.defaults.baseURL);
// Interceptor para manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Token inválido o expirado");

      // ✅ Limpiar localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // ✅ Redirigir al login (solo si estás en el navegador)
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
