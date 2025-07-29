// web/src/pages/Dashboard/listServices.js
import axiosInstance from "../../api/axiosInstance";

/**
 * Obtiene todas las listas (pendientes y compradas) de un usuario específico.
 */
export const fetchAllListsByUserId = async (userId, token) => {
  try {
    const response = await axiosInstance.get(`/api/lists/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * Guarda y marca una compra como completada.
 */
export const savePurchase = async (listId, payload, token) => {
  try {
    const response = await axiosInstance.put(
      `/api/lists/${listId}/complete`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * Elimina una lista de compras específica.
 */
export const deleteList = async (listId, token) => {
  try {
    await axiosInstance.delete(`/api/lists/${listId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * Crea una nueva lista de compras.
 */
export const createList = async (listData, token) => {
  try {
    const response = await axiosInstance.post(`/api/lists`, listData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * Actualiza los detalles de una lista.
 */
export const updateList = async (listId, updateData, token) => {
  try {
    const response = await axiosInstance.put(
      `/api/lists/${listId}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * Obtiene los detalles completos de una lista completada.
 */
export const fetchListDetailsCompleted = async (listId, token) => {
  if (!listId) throw new Error("El ID de la lista es obligatorio.");
  if (!token) throw new Error("Token no proporcionado.");

  try {
    const response = await axiosInstance.get(
      `/api/lists/completeDetails/${listId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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
