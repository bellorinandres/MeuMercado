// src/services/listService.js

// Define la URL base de tu API usando la variable de entorno de Vite.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

/**
 * Función auxiliar para procesar las respuestas de la API.
 * Centraliza el manejo de errores y el parseo de JSON.
 * @param {Response} response - El objeto Response de la llamada a `fetch`.
 * @returns {Promise<any>} - La respuesta JSON parseada o un objeto vacío si no hay contenido JSON.
 * @throws {Error} - Lanza un error si la respuesta no es exitosa (status >= 400).
 */
const handleApiResponse = async (response) => {
  if (!response.ok) {
    let errorData = {};
    const contentType = response.headers.get("content-type");

    // Intenta parsear la respuesta de error como JSON si el tipo de contenido lo indica
    if (contentType && contentType.includes("application/json")) {
      errorData = await response.json().catch((e) => {
        // Advertencia si no se puede parsear la respuesta de error, pero no bloquea.
        console.warn(
          "Error al parsear la respuesta de error de la API como JSON:",
          e
        );
        return {}; // Devuelve un objeto vacío para continuar
      });
    }

    // Construye un mensaje de error a partir de los datos del error o un mensaje genérico
    const errorMessage =
      errorData.message || `Error ${response.status}: Algo salió mal.`;

    const error = new Error(errorMessage);
    error.statusCode = response.status; // Adjunta el código de estado HTTP al objeto de error
    throw error;
  }

  // Si la respuesta es exitosa, intenta parsear como JSON
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  // Si no hay contenido JSON (ej. para respuestas 204 No Content de DELETE), devuelve un objeto vacío
  return {};
};

/**
 * Función auxiliar para construir los encabezados de la petición, incluyendo el token de autorización.
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Object} Los encabezados configurados para la petición.
 */
const getAuthHeaders = (token) => {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Obtiene todas las listas (pendientes y compradas) de un usuario específico.
 * Usada en DashboardPage.
 * @param {string} userId - El ID del usuario.
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} - Objeto con dos arrays: `pending` y `purchased`.
 */
export const fetchAllListsByUserId = async (userId, token) => {
  const response = await fetch(`${API_BASE_URL}/api/lists/${userId}`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });
  return handleApiResponse(response); // El error se propaga automáticamente si handleApiResponse lo lanza
};

/**
 * Guarda y marca una compra como completada, actualizando los precios de los productos.
 * Usada en ShoppingListPage cuando el usuario termina de ingresar precios y guarda la compra.
 * @param {string} listId - El ID de la lista a completar.
 * @param {Object} payload - Los datos a enviar (ej. `items`, `total_cost`, `purchased_at`).
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} - La respuesta del servidor tras guardar.
 */
export const savePurchase = async (listId, payload, token) => {
  const response = await fetch(`${API_BASE_URL}/api/lists/${listId}/complete`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleApiResponse(response);
};

/**
 * Elimina una lista de compras específica.
 * Usada en DashboardPage para borrar una lista.
 * @param {string} listId - El ID de la lista a eliminar.
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<boolean>} - `true` si la eliminación fue exitosa.
 */
export const deleteList = async (listId, token) => {
  const response = await fetch(`${API_BASE_URL}/api/lists/${listId}`, {
    method: "DELETE",
    headers: getAuthHeaders(token),
  });
  await handleApiResponse(response); // handleApiResponse manejará errores; si no hay, devuelve un objeto vacío
  return true; // Si llegamos aquí, la operación fue exitosa
};

/**
 * Crea una nueva lista de compras.
 * @param {Object} listData - Objeto con los datos de la nueva lista (ej. { name: "Mi Nueva Lista", items: [{ name: "Leche", quantity: 1 }] }).
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} - La lista creada con su ID.
 */
export const createList = async (listData, token) => {
  const response = await fetch(`${API_BASE_URL}/api/lists`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: JSON.stringify(listData),
  });
  return handleApiResponse(response);
};

/**
 * Actualiza los detalles de una lista o sus ítems.
 * @param {string} listId - El ID de la lista a actualizar.
 * @param {Object} updateData - Los datos a actualizar (ej. { name: "Nuevo Nombre" } o { items: [...] }).
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} - La lista actualizada.
 */
export const updateList = async (listId, updateData, token) => {
  const response = await fetch(`${API_BASE_URL}/api/lists/${listId}`, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(updateData),
  });
  return handleApiResponse(response);
};

/**
 * Obtiene los detalles completos de una lista de compras (incluyendo ítems y precios finales).
 * Usada en ListDetailsPage para mostrar una lista ya completada.
 * @param {string} listId - El ID de la lista.
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} - Objeto con los detalles de la lista y sus productos.
 * @throws {Error} - Lanza un error si el ID o el token no son proporcionados.
 */
export const fetchListDetailsCompleted = async (listId, token) => {
  if (!listId) {
    throw new Error("El ID de la lista es obligatorio para buscar detalles.");
  }
  if (!token) {
    throw new Error("El token de autenticación no fue proporcionado.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/lists/completeDetails/${listId}`,
    {
      method: "GET",
      headers: getAuthHeaders(token),
    }
  );
  return handleApiResponse(response);
};
