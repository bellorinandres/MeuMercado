// web/src/pages/CreateList/CreateListService.js

import axiosInstance from "../../api/axiosInstance";

export const createList = async (listData, token) => {
  try {
    const response = await axiosInstance.post("/api/lists", listData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Error al crear la lista.";

    const err = new Error(message);
    err.statusCode = status;
    throw err;
  }
};
