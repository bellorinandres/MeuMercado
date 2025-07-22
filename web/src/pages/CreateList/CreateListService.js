// web/src/pages/CreateList/CreateListService.js

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Función auxiliar para manejar las respuestas de la API.
 * Centraliza la lógica de verificación de errores y parseo de JSON.
 * @param {Response} response - El objeto Response de la llamada a `fetch`.
 * @returns {Promise<any>} - La respuesta JSON parseada o un objeto vacío si no hay contenido.
 * @throws {Error} - Lanza un error si la respuesta no es exitosa (status >= 400).
 */
const handleApiResponse = async (response) => {
  if (!response.ok) {
    let errorData = {};
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      errorData = await response.json().catch((e) => {
        console.warn("Error parsing API error response as JSON:", e);
        return {};
      });
    }

    const errorMessage =
      errorData.message || `Error ${response.status}: Algo salió mal.`;

    const error = new Error(errorMessage);
    error.statusCode = response.status;
    throw error;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return {};
};

/**
 * Crea una nueva lista de compras.
 * @param {Object} listData - Objeto con los datos de la nueva lista (ej. { name: "Mi Nueva Lista", items: [{ name: "Leche", quantity: 1 }] }).
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} - La lista creada con su ID.
 */
export const createList = async (listData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(listData),
    });
    return handleApiResponse(response); // Asegúrate de que handleApiResponse está definido
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
};
