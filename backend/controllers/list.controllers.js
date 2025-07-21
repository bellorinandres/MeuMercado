import pool from "../config/db.js"; // Necesitas importar el pool aquí para gestionar las conexiones directamente en el controlador

import {
  insertList,
  insertListItems,
  getPendingListsByUserId,
  getPurchasedListsByUserId,
  getListItemsByListId,
  deleteListById,
  completeListPurchase,
} from "../models/list.models.js";

// --- Controlador para crear una nueva lista ---
export const createList = async (req, res) => {
  const { name, items } = req.body;
  const userId = req.user.id; // Asumiendo que user ID viene de la autenticación

  // Validación de entrada
  if (!name || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Nombre de la lista y al menos un ítem son requeridos.",
    });
  }

  let conn; // Declarar 'conn' fuera del try para que sea accesible en el 'finally'
  try {
    conn = await pool.getConnection(); // ✅ Obtener una conexión del pool
    await conn.beginTransaction(); // ✅ Iniciar la transacción

    // Llamar a insertList, pasando la conexión `conn`
    const listId = await insertList(conn, userId, name); // `insertList` ahora debe aceptar `conn` como primer parámetro

    // Insertar los ítems de la lista, pasando la misma conexión `conn`
    await insertListItems(conn, listId, items); // `insertListItems` ya acepta `conn`

    await conn.commit(); // ✅ Confirmar la transacción si todo fue bien
    res.status(201).json({ message: "Lista creada con éxito", listId });
  } catch (error) {
    if (conn) {
      await conn.rollback(); // ✅ Deshacer la transacción en caso de error
    }
    console.error("Error creating list (controller):", error);
    res.status(500).json({
      message: "Error interno del servidor al crear la lista.",
      details: error.message,
    }); // Añadir detalles del error
  } finally {
    if (conn) {
      conn.release(); // ✅ Liberar la conexión SIEMPRE
    }
  }
};

// --- Controlador para obtener listas pendientes y compradas por usuario ---
export const getListsByUser = async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: "user_id requerido" });
  }

  // Estas funciones de modelo (getPendingListsByUserId, getPurchasedListsByUserId)
  // PUEDEN gestionar sus propias conexiones internamente si no son parte de una transacción con otras.
  // Asumo que actualmente lo hacen o que sus modelos están ajustados.
  try {
    const pending = await getPendingListsByUserId(user_id);
    const purchased = await getPurchasedListsByUserId(user_id);

    res.json({
      pending,
      purchased,
    });
  } catch (err) {
    console.error("Error in getListsByUser controller:", err); // Log más específico
    res
      .status(500)
      .json({ error: err.message || "Error al obtener las listas." });
  }
};

// --- Controlador para obtener detalles de una lista de compras ---
export const getShoppingListDetails = async (req, res) => {
  const { list_id } = req.params;
  const userId = req.user.id;

  if (!list_id) {
    return res.status(400).json({ message: "list_id requerido" });
  }

  // Asumo que getListItemsByListId gestiona su propia conexión.
  try {
    const items = await getListItemsByListId(list_id, userId);

    if (items.length === 0) {
      // Podría ser una lista vacía o que no existe/no pertenece al usuario
      return res
        .status(404)
        .json({ message: "Lista o ítems no encontrados para el usuario." });
    }

    res.status(200).json(items);
    console.log(
      "Detalles de la lista obtenidos (en controlador):",
      items.length,
      "items."
    );
  } catch (error) {
    console.error(
      "Error al obtener los detalles de la lista (controlador):",
      error
    );
    res.status(500).json({
      message: "Error interno del servidor al obtener detalles de la lista.",
    });
  }
};

// --- Controlador para eliminar una lista ---
export const deleteList = async (req, res) => {
  const { list_id } = req.params;
  const userId = req.user.id;

  // Asumo que deleteListById gestiona su propia conexión y transacción interna si la requiere.
  try {
    const deleted = await deleteListById(list_id, userId);

    if (!deleted) {
      return res.status(404).json({
        message: "Lista no encontrada o no tienes permiso para eliminarla.",
      });
    }

    return res.status(204).send(); // 204 No Content para eliminación exitosa
  } catch (error) {
    console.error("Error in deleteList controller:", error);
    // Un mensaje de error más genérico si la lógica de FK no es crítica para el usuario final
    return res.status(500).json({
      message: "Error interno del servidor al eliminar la lista.",
      error: error.message,
    });
  }
};

// --- Controlador para completar la compra de una lista ---
export const completeList = async (req, res) => {
  const { listId } = req.params;
  const userId = req.user.id;
  const { items } = req.body; // Array de ítems con sus precios actualizados

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message:
        "Datos de compra inválidos: 'items' es requerido y debe ser un array no vacío.",
    });
  }

  // Puedes añadir validaciones más específicas para cada ítem si es necesario
  // Por ejemplo: items.every(item => typeof item.id === 'number' && typeof item.price === 'number')

  console.log(
    "Completando compra de lista:",
    listId,
    "para usuario:",
    userId,
    "con items:",
    items.length,
    "ítems"
  );

  // Asumo que completeListPurchase gestiona su propia conexión y transacción interna.
  // Si en el futuro completeListPurchase necesitara interactuar con otras funciones del modelo
  // dentro de una misma transacción (ej. actualizar el balance del usuario), entonces
  // este controlador también debería obtener y pasar la conexión.
  try {
    const success = await completeListPurchase(parseInt(listId), userId, items);

    if (!success) {
      return res
        .status(404)
        .json({ message: "Lista no encontrada o no pertenece al usuario." });
    }

    res
      .status(200)
      .json({ message: "Compra de lista completada y guardada con éxito." });
  } catch (error) {
    console.error("Error en completeList del controlador:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor al completar la compra." });
  }
};

export const getDetailListCompleted = async (req, res) => {
  const { list_id } = req.params;
  const userId = req.user.id;

  if (!list_id) {
    return res.status(400).json({ message: "list_id requerido" });
  }

  try {
    const list = await getListItemsByListId(list_id, userId);

    if (list.length === 0) {
      // Podría ser una lista vacía o que no existe/no pertenece al usuario
      return res
        .status(404)
        .json({ message: "Lista o ítems no encontrados para el usuario." });
    }

    res.status(200).json(list);
    console.log(
      "Detalles de la lista obtenidos (en controlador):",
      list.length,
      "items."
    );
  } catch (error) {
    console.error(
      "Error al obtener los detalles de la lista (controlador):",
      error
    );
    res.status(500).json({
      message: "Error interno del servidor al obtener detalles de la lista.",
    });
  }
};
