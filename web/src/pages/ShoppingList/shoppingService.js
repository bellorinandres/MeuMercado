// ✅ Importa `import.meta.env` para Vite
// Si usas Create React App (CRA), sería `process.env.NODE_ENV`
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Si usas Create React App (CRA) en lugar de Vite, descomenta la siguiente línea y comenta la de arriba:
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";


/**
 * Función genérica para manejar las solicitudes HTTP.
 * Incluye el manejo de autenticación (token) y errores comunes.
 *
 * @param {string} url - La URL del endpoint (ej. "/lists/shopping/123").
 * @param {string} method - El método HTTP (GET, POST, PUT, DELETE).
 * @param {string} token - El token de autenticación del usuario.
 * @param {Object} [body=null] - El cuerpo de la solicitud para POST/PUT.
 * @returns {Promise<Object>} La respuesta JSON de la API.
 * @throws {Error} Si la respuesta de la API no es OK o hay un error de red.
 */
async function apiRequest(url, method = "GET", token, body = null) {
  const headers = {
    "Content-Type": "application/json",
    // ✅ Solo añade el Authorization header si el token existe
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    // Manejo de errores de HTTP (4xx, 5xx)
    if (!response.ok) {
      // Intenta parsear el error del cuerpo, incluso si no es un JSON válido
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (jsonError) {
        // Si no se puede parsear como JSON, usa un mensaje genérico
        console.warn("Could not parse error response as JSON:", jsonError);
      }

      const errorMessage =
        errorData.message || `Error ${response.status}: ${response.statusText}`;

      // Puedes lanzar errores específicos si quieres manejarlos en los componentes
      if (response.status === 401 || response.status === 403) {
        // Aquí podrías emitir un evento global para desloguear al usuario
        // O simplemente lanzar un error para que el componente lo capture y redirija
        const authError = new Error("Authentication error: " + errorMessage);
        authError.statusCode = response.status; // Añadir el status code al error
        throw authError;
      }

      const httpError = new Error(errorMessage);
      httpError.statusCode = response.status; // Añadir el status code al error
      throw httpError;
    }

    // Si la respuesta es 204 No Content (DELETE, por ejemplo), no intentes parsear JSON
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Request Error [${method} ${url}]:`, error);
    throw error; // Re-lanza el error para que el componente pueda manejarlo
  }
}

/**
 * Obtiene los detalles de una lista de compras específica.
 *
 * @param {string} listId - El ID de la lista.
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} Un objeto con el nombre de la lista y sus productos.
 * @throws {Error} Si la lista no se encuentra, no pertenece al usuario o hay un error de red/API.
 */
export async function getShoppingListDetails(listId, token) {
  try {
    const rawData = await apiRequest(`/lists/shopping/${listId}`, "GET", token);

    // Si el backend devuelve un array vacío, o null, significa que no hay datos para esa lista/usuario
    if (!rawData || rawData.length === 0) {
      // Considera lanzar un error para que el componente pueda manejar un 404
      const notFoundError = new Error("Lista no encontrada o no tienes permiso para verla.");
      notFoundError.statusCode = 404; // Añadir un status code para manejo específico
      throw notFoundError;
    }

    // Asumimos que rawData es un array de objetos (filas del JOIN)
    const listName = rawData[0].name_list; // Asume que la columna es 'name_list'
    const products = rawData.map((item) => ({
      id: item.id_item, // ID del ítem en list_items
      name: item.product_name, // Nombre del producto del list_items
      quantity: item.quantity,
      price: item.price, // Incluye el precio si lo necesitas, como lo agregamos en el modelo
      isBought: item.is_bought, // Incluye el estado de compra
    }));

    return { name: listName, products };
  } catch (error) {
    console.error("Error in getShoppingListDetails:", error);
    throw error; // Propaga el error para que el componente lo maneje
  }
}

/**
 * Completa y guarda una compra de lista.
 *
 * @param {string} listId - El ID de la lista a completar.
 * @param {Object} payload - Los datos de la compra (debe contener un array 'items' con id y price).
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} La respuesta de la API.
 * @throws {Error} Si la solicitud falla.
 */
export async function completeShoppingList(listId, payload, token) {
  try {
    const response = await apiRequest(
      `/lists/${listId}/complete`,
      "PUT",
      token,
      payload
    );
    return response;
  } catch (error) {
    console.error("Error in completeShoppingList:", error);
    throw error;
  }
}

/**
 * Crea una nueva lista con ítems.
 * Crea una nueva lista con los detalles proporcionados (nombre, ítems).
 *
 * @param {Object} listData - Objeto con 'name' (string) y 'items' (Array de {name, quantity}).
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} La respuesta de la API, incluyendo el ID de la nueva lista.
 * @throws {Error} Si la creación de la lista falla.
 */
export async function createList(listData, token) {
  try {
    const response = await apiRequest("/lists", "POST", token, listData);
    return response;
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
}

/**
 * Elimina una lista por su ID.
 *
 * @param {string} listId - El ID de la lista a eliminar.
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<null>} Devuelve null si la eliminación fue exitosa (código 204).
 * @throws {Error} Si la eliminación falla (lista no encontrada, no autorizada, error del servidor).
 */
export async function deleteList(listId, token) {
  try {
    const response = await apiRequest(`/lists/${listId}`, "DELETE", token);
    return response; // Será null para 204 No Content
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error;
  }
}

/**
 * Obtiene todas las listas pendientes (no compradas) para el usuario autenticado.
 * Asume que el backend ya filtra por el `user_id` del token.
 *
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Array<Object>>} Un array de listas pendientes.
 * @throws {Error} Si la solicitud falla.
 */
export async function getPendingLists(token) {
  // Ajusta la URL si tu backend requiere el user_id en la ruta
  // Si tu ruta es `/api/lists/pending` y el backend usa req.user.id del token, no necesitas user_id aquí.
  // Si es `/api/lists/user/:userId/pending`, necesitarías pasar el userId aquí.
  // Basado en tu `list.controllers.js`, `getPendingListsByUserId` toma user_id de `req.params`,
  // pero `getListsByUser` la usa. Asegúrate de que tu ruta API coincida.
  // Asumiendo que usarás una ruta donde el user_id viene del token, como en `/lists/pending`
  try {
    const response = await apiRequest(`/lists/pending`, "GET", token);
    return response;
  } catch (error) {
    console.error("Error fetching pending lists:", error);
    throw error;
  }
}

/**
 * Obtiene todas las listas compradas para el usuario autenticado.
 *
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Array<Object>>} Un array de listas compradas.
 * @throws {Error} Si la solicitud falla.
 */
export async function getPurchasedLists(token) {
  // Similar a getPendingLists, asumiendo que el backend usa el user_id del token.
  try {
    const response = await apiRequest(`/lists/purchased`, "GET", token);
    return response;
  } catch (error) {
    console.error("Error fetching purchased lists:", error);
    throw error;
  }
}

// Puedes añadir más funciones aquí para otros endpoints, por ejemplo, para ítems individuales:
/*
export async function updateListItem(listId, itemId, itemData, token) {
  return apiRequest(`/lists/${listId}/items/${itemId}`, "PUT", token, itemData);
}

export async function deleteListItem(listId, itemId, token) {
  return apiRequest(`/lists/${listId}/items/${itemId}`, "DELETE", token);
}
*/