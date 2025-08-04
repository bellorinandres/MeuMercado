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

export const updateName = async (payload, token) => {
  try {
    const { data } = await axiosInstance.put(`/api/users/settings`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    // Se o erro tiver uma resposta da API (ex: 400, 404, 500)
    if (error.response) {
      console.error(
        "Erro ao atualizar o nome do utilizador:",
        error.response.data
      );
      throw new Error(
        error.response.data.message || "Ocorreu um erro na atualização."
      );
    } else if (error.request) {
      // Se a requisição foi feita, mas não houve resposta (ex: problema de rede)
      console.error("Erro de rede:", error.request);
      throw new Error(
        "Erro de conexão com o servidor. Por favor, tente novamente."
      );
    } else {
      // Outros erros
      console.error("Erro inesperado:", error.message);
      throw new Error(
        "Ocorreu um erro inesperado. Por favor, tente novamente."
      );
    }
  }
};
export const deleteUser = async (pass, token) => {
  try {
    const payload = { pass }; // Crea el objeto de datos con la contraseña

    const { data } = await axiosInstance.delete(`/api/users/settings/delete`, {
      headers: { Authorization: `Bearer ${token}` },
      data: payload, // <--- La forma correcta de enviar el cuerpo con .delete()
    });

    return data;
  } catch (error) {
    if (error.response) {
      console.error("Error al eliminar la cuenta:", error.response.data);
      throw new Error(
        error.response.data.message || "Ocurrió un error al eliminar la cuenta."
      );
    } else if (error.request) {
      console.error("Error de red:", error.request);
      throw new Error(
        "Error de conexión con el servidor. Por favor, inténtalo de nuevo."
      );
    } else {
      console.error("Error inesperado:", error.message);
      throw new Error(
        "Ocurrió un error inesperado. Por favor, inténtalo de nuevo."
      );
    }
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
