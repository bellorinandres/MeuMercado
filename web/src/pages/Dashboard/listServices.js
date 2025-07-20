// src/services/listService.js

// ✅ Define la URL base de tu API usando la variable de entorno de Vite
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// Si usas Create React App (CRA), descomenta la siguiente línea y comenta la de arriba:
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

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
        return {}; // Devuelve un objeto vacío si falla el parseo
      });
    }

    const errorMessage =
      errorData.message || `Error ${response.status}: Algo salió mal.`;

    const error = new Error(errorMessage);
    error.statusCode = response.status; // ✅ Añadir el status code al error
    throw error;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return {}; // Devuelve un objeto vacío si no hay contenido JSON (útil para DELETEs 204)
};

/**
 * Función auxiliar para construir los headers con el token.
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Object} Los headers para la petición.
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
 * Obtiene los detalles de una lista de compras específica.
 * Usada en ShoppingListPage para cargar los productos de una lista.
 * @param {string} listId - El ID de la lista.
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} - Objeto con los detalles de la lista (ej. { name, products: [] }).
 */
export const fetchShoppingListDetails = async (listId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lists/shopping/${listId}`, {
      method: "GET",
      headers: getAuthHeaders(token), // ✅ Usar la función auxiliar
    });
    const data = await handleApiResponse(response);

    // Procesar la data cruda del backend para el formato que espera el frontend
    if (!data || data.length === 0) {
      const error = new Error("Lista no encontrada o sin productos.");
      error.statusCode = 404;
      throw error;
    }

    const listName = data[0].name_list; // Asume que la columna es 'name_list'
    const products = data.map((item) => ({
      id: item.id_item, // ID del ítem en list_items
      name: item.product_name, // Nombre del producto del list_items
      quantity: item.quantity,
      price: item.price, // Si quieres el precio ya cargado desde la BD
      isBought: item.is_bought, // Estado de compra
    }));

    return { name: listName, products };
  } catch (error) {
    console.error("Error fetching shopping list details:", error);
    throw error;
  }
};

/**
 * Obtiene todas las listas (pendientes y compradas) de un usuario específico.
 * Usada en DashboardPage para mostrar todas las listas del usuario.
 *
 * NOTA: Si tu backend filtra las listas por el ID del usuario directamente desde el token
 * (es decir, `/api/lists` sin `userId` en la URL), entonces el `userId` no es necesario aquí
 * ni en la URL. Dejaré el `userId` en la URL por si es tu diseño actual.
 *
 * @param {string} userId - El ID del usuario.
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} - Objeto con dos arrays: `pending` y `purchased`.
 */
export const fetchAllListsByUserId = async (userId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lists/${userId}`, {
      // Revisa esta URL si el userId viene del token
      method: "GET",
      headers: getAuthHeaders(token),
    });
    return handleApiResponse(response); // Esto debería devolver { pending: [...], purchased: [...] }
  } catch (error) {
    console.error("Error fetching all lists by user ID:", error);
    throw error;
  }
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
  try {
    const response = await fetch(`${API_BASE_URL}/lists/${listId}/complete`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error("Error saving purchase:", error);
    throw error;
  }
};

/**
 * Elimina una lista de compras específica.
 * Usada en DashboardPage (a través de PendingLists/PurchasedLists) para borrar una lista.
 * @param {string} listId - El ID de la lista a eliminar.
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<boolean>} - `true` si la eliminación fue exitosa.
 */
export const deleteList = async (listId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
      method: "DELETE",
      // Para DELETE, Content-Type a menudo no es necesario en el request, pero el Authorization sí.
      headers: getAuthHeaders(token),
    });
    await handleApiResponse(response); // Si todo va bien, handleApiResponse devuelve {} o null para 204
    return true; // Si no hay errores, consideramos que se eliminó con éxito
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error;
  }
};

/**
 * Crea una nueva lista de compras.
 * @param {Object} listData - Objeto con los datos de la nueva lista (ej. { name: "Mi Nueva Lista", items: [{ name: "Leche", quantity: 1 }] }).
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} - La lista creada con su ID.
 */
export const createList = async (listData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lists`, {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(listData),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error("Error creating list:", error);
    throw error;
  }
};

/**
 * Actualiza los detalles de una lista o sus ítems.
 * @param {string} listId - El ID de la lista a actualizar.
 * @param {Object} updateData - Los datos a actualizar (ej. { name: "Nuevo Nombre" } o { items: [...] }).
 * @param {string} token - El token de autenticación del usuario.
 * @returns {Promise<Object>} - La lista actualizada.
 */
export const updateList = async (listId, updateData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lists/${listId}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(updateData),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error("Error updating list:", error);
    throw error;
  }
};

// Puedes añadir más funciones aquí para otros endpoints de items o listas específicas
/*
export const updateListItem = async (listId, itemId, itemData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lists/${listId}/items/${itemId}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData),
    });
    return handleApiResponse(response);
  } catch (error) {
    console.error("Error updating list item:", error);
    throw error;
  }
};
*/
