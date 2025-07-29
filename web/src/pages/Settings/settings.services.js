//
import axiosInstance from "../../api/axiosInstance";

export const fetchSettingsUser = async (token) => {
  
  try {
    const response = await axiosInstance.get(`/api/users/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * Manejo de errores centralizado para Axios.
 */
const handleAxiosError = (error) => {
  const status = error.response?.status || 500;
  const message = error.response?.data?.message || "Error en la solicitud.";
  const err = new Error(message);
  err.statusCode = status;
  throw err;
};
