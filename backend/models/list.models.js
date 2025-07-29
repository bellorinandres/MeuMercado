import pool from "../config/db.js"; // Ensure this path is correct and db.js exports the 'pool'
// Asegúrate de que esta ruta sea correcta y que db.js exporte el 'pool'

/**
 * Inserts a new list into the database.
 * This function is designed to be used within a transaction,
 * so it receives an existing connection `conn` from the controller.
 * It does NOT manage its own connection (get/release).
 *
 * Inserta una nueva lista en la base de datos.
 * Esta función está diseñada para ser usada dentro de una transacción,
 * por lo que recibe una conexión `conn` existente desde el controlador.
 * NO gestiona su propia conexión (obtener/liberar).
 *
 * @param {object} conn - The database connection object (from pool.getConnection()).
 * @param {number} user_id - The ID of the user creating the list.
 * @param {string} name - The name of the list.
 * @returns {Promise<number>} The ID of the newly inserted list.
 * @throws {Error} If there is a database error during insertion.
 */
export const insertList = async (conn, user_id, name) => {
  try {
    const [result] = await conn.query(
      // Use the provided 'conn'
      // Usa la 'conn' proporcionada
      "INSERT INTO lists (id_user, name_list) VALUES (?, ?)",
      [user_id, name]
    );
    return result.insertId;
  } catch (error) {
    console.error("Error in insertList model:", error);
    throw error;
  }
  // The connection is NOT released here; it's handled by the calling function (controller) for transactions.
  // La conexión NO se libera aquí; es manejada por la función que la llama (controlador) para transacciones.
};

/**
 * Inserts multiple items into the 'list_items' table for a given list.
 * This function is designed to be used within a transaction,
 * so it receives an existing connection `conn` from the controller.
 * It does NOT manage its own connection (get/release).
 *
 * Inserta múltiples ítems en la tabla 'list_items' para una lista dada.
 * Esta función está diseñada para ser usada dentro de una transacción,
 * por lo que recibe una conexión `conn` existente desde el controlador.
 * NO gestiona su propia conexión (obtener/liberar).
 *
 * @param {object} conn - The database connection object (from pool.getConnection()).
 * @param {number} list_id - The ID of the list to which items belong.
 * @param {Array<object>} items - An array of item objects, each with 'name' (string) and 'quantity' (number).
 * Example: [{ name: 'Milk', quantity: 1 }, { name: 'Bread', quantity: 2 }]
 * @returns {Promise<void>} A Promise that resolves when all items are inserted.
 * @throws {Error} If 'items' is not an array or is empty, or if a database error occurs during insertion.
 * @throws {TypeError} If any item's 'name' is not a string or 'quantity' is not a number.
 */
export const insertListItems = async (conn, list_id, items) => {
  if (!Array.isArray(items) || items.length === 0) {
    console.error(
      "Error: 'items' is not an array or is empty in insertListItems model."
    );
    throw new Error("'items' must be a non-empty array of item objects.");
  }

  const values = items.map((item, index) => {
    if (typeof item.name !== "string" || typeof item.quantity !== "number") {
      console.error(
        `Type Error for item [${index}]: name='${
          item.name
        }' (${typeof item.name}), quantity='${
          item.quantity
        }' (${typeof item.quantity})`
      );
      throw new TypeError(
        `Item [${index}] has an incorrect name or quantity type. Expected string/number.`
      );
    }
    const itemPrice = typeof item.price === "number" ? item.price : 0.0;
    console.log(itemPrice);
    return [
      list_id,
      item.name,
      item.quantity,
      itemPrice,
      0, // is_bought (initial value)
    ];
  });

  try {
    // Al ejecutar la consulta, conn.query devuelve un array donde el primer elemento
    // es el objeto de resultados de la consulta (que contiene affectedRows, insertId, etc.)
    // y el segundo elemento son las definiciones de los campos.
    const queryResult = await conn.query(
      // <--- Cambiado a queryResult
      `INSERT INTO list_items (id_list, product_name, quantity, price, is_bought) VALUES ?`,
      [values]
    );
    // Debemos devolver el primer elemento del array de resultados de la consulta
    return queryResult[0]; // <--- ¡Devuelve el objeto de resultados que contiene affectedRows!
  } catch (dbError) {
    console.error(
      "Error executing batch insert in insertListItems model:",
      dbError
    );
    throw dbError;
  }
};

/**
 * Retrieves all lists (pending or completed) for a specific user,
 * including a count of products in each list.
 *
 * Recupera todas las listas (pendientes o completadas) para un usuario específico,
 * incluyendo un conteo de productos en cada lista.
 *
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Array<object>>} An array of list objects.
 * @throws {Error} If there is a database error.
 */
export const getAllListsByUserId = async (user_id) => {
  let conn;
  try {
    conn = await pool.getConnection(); // Get connection from pool
    // Obtener conexión del pool
    const [rows] = await conn.query(
      `
      SELECT
        l.id_list,
        l.name_list,
        l.created_at,
        l.is_completed,
        l.purchased_at,
        COUNT(li.id_item) AS product_count
      FROM lists l
      LEFT JOIN list_items li ON l.id_list = li.id_list
      WHERE l.id_user = ?
      GROUP BY l.id_list, l.name_list, l.created_at, l.is_completed, l.purchased_at
      ORDER BY l.created_at DESC
      `,
      [user_id]
    );
    return rows;
  } catch (error) {
    console.error("Error in getAllListsByUserId model:", error);
    throw error;
  } finally {
    if (conn) conn.release(); // Release the connection
    // Liberar la conexión
  }
};

/**
 * Marks a list as completed, updating its status and purchase date.
 * (Note: This function might be replaced/improved by `completeListPurchase` for full purchase details).
 *
 * Marca una lista como completada, actualizando su estado y fecha de compra.
 * (Nota: ¡Esta función podría ser reemplazada/mejorada por `completeListPurchase` para detalles completos de compra!)
 *
 * @param {number} list_id - The ID of the list to complete.
 * @returns {Promise<boolean>} True if the list was updated, false otherwise.
 * @throws {Error} If there is a database error.
 */
export const completeList = async (list_id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [result] = await conn.query(
      `
      UPDATE lists
      SET is_completed = 1, purchased_at = NOW()
      WHERE id_list = ?
      `,
      [list_id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in completeList model:", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Retrieves only the pending (incomplete) lists for a specific user.
 *
 * Recupera solo las listas pendientes (incompletas) para un usuario específico.
 *
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Array<object>>} An array of pending list objects.
 * @throws {Error} If there is a database error.
 */
export const getPendingListsByUserId = async (user_id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT
            l.id_list,
            l.name_list,
            l.created_at,
            COUNT(li.id_item) AS product_count -- Contamos los ítems en la tabla list_items
        FROM
            lists l
        LEFT JOIN
            list_items li ON l.id_list = li.id_list -- Unimos 'lists' con 'list_items' usando 'id_list'
        WHERE
            l.id_user = ? AND l.is_completed = 0
        GROUP BY
            l.id_list, l.name_list, l.created_at`,
      [user_id]
    );
    return rows;
  } catch (error) {
    console.error("Error in getPendingListsByUserId model:", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Retrieves the purchased (completed) lists for a specific user,
 * including the total number of products and total cost for each list.
 *
 * Recupera las listas compradas (completadas) para un usuario específico,
 * incluyendo el número total de productos y el costo total de cada lista.
 *
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Array<object>>} An array of purchased list objects with aggregated data.
 * @throws {Error} If there is a database error.
 */
export const getPurchasedListsByUserId = async (user_id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT
          l.id_list,
          l.name_list,
          l.purchased_at,
          SUM(li.quantity) AS total_products,  -- Sum total quantity of products
          -- Suma la cantidad total de productos
          SUM(li.quantity * li.price) AS total_cost -- Calculate total cost
          -- Calcula el costo total
       FROM lists l
       JOIN list_items li ON l.id_list = li.id_list
       WHERE l.id_user = ? AND l.is_completed = 1
       GROUP BY l.id_list, l.name_list, l.purchased_at
       ORDER BY l.purchased_at DESC`,
      [user_id]
    );
    return rows;
  } catch (error) {
    console.error("Error in getPurchasedListsByUserId model:", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Retrieves the details of a specific shopping list, including all its items.
 * Ensures the list belongs to the specified user for security.
 *
 * Recupera los detalles de una lista de compras específica, incluyendo todos sus ítems.
 * Asegura que la lista pertenezca al usuario especificado por seguridad.
 *
 * @param {number} list_id - The ID of the list to retrieve.
 * @param {number} user_id - The ID of the user who owns the list.
 * @returns {Promise<Array<object>>} An array of item objects belonging to the list.
 * @throws {Error} If there is a database error.
 */
export const getListItemsByListId = async (list_id, user_id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT
          l.id_list,
          l.name_list,
          l.is_completed,
          l.purchased_at,
          li.id_item,
          li.product_name,
          li.quantity,
          li.price,
          li.is_bought
       FROM
          lists l
       JOIN
          list_items li ON l.id_list = li.id_list
       WHERE
          l.id_list = ? AND l.id_user = ?;`, // Ensures the list belongs to the user
      // Asegura que la lista pertenezca al usuario
      [list_id, user_id]
    );
    return rows;
  } catch (error) {
    console.error("Error in getListItemsByListId model:", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * Deletes a list and all its associated items within a database transaction.
 * Ensures the list belongs to the specified user before deletion.
 *
 * Elimina una lista y todos sus ítems asociados dentro de una transacción de base de datos.
 * Asegura que la lista pertenezca al usuario especificado antes de la eliminación.
 *
 * @param {number} list_id - The ID of the list to delete.
 * @param {number} user_id - The ID of the user who owns the list.
 * @returns {Promise<boolean>} True if the list was successfully deleted, false if not found or unauthorized.
 * @throws {Error} If there is a database error during the transaction.
 */
export const deleteListById = async (list_id, user_id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // Start the transaction
    // Iniciar la transacción

    // 1. Delete all items associated with this list first
    // 1. Eliminar todos los ítems asociados a esta lista primero
    const [deleteItemsResult] = await conn.query(
      "DELETE FROM list_items WHERE id_list = ?",
      [list_id]
    );
    // console.log(`Deleted ${deleteItemsResult.affectedRows} items for list ${list_id}`); // Debug log (can be uncommented for specific debugging if needed)
    // console.log(`Se eliminaron ${deleteItemsResult.affectedRows} ítems para la lista ${list_id}`); // Log de depuración (puede descomentarse para depuración específica si es necesario)

    // 2. Then, delete the list. Add `id_user` to the WHERE condition for security
    // 2. Luego, eliminar la lista. Se agrega `id_user` a la condición WHERE por seguridad
    const [deleteListResult] = await conn.query(
      "DELETE FROM lists WHERE id_list = ? AND id_user = ?",
      [list_id, user_id]
    );

    if (deleteListResult.affectedRows === 0) {
      await conn.rollback(); // Rollback if list not found or unauthorized
      // Deshacer si la lista no se encontró o no pertenece al usuario
      return false; // Not deleted because not found or not owned by user
      // No se eliminó porque no se encontró o no es del usuario
    }

    await conn.commit(); // Commit the transaction
    // Confirmar la transacción
    return true; // Success
    // Éxito
  } catch (error) {
    if (conn) await conn.rollback(); // Rollback in case of error
    // Deshacer en caso de error
    console.error("Error in deleteListById model:", error);
    throw error;
  } finally {
    if (conn) conn.release(); // Always release the connection
    // Siempre liberar la conexión
  }
};

/**
 * Completes a list purchase by updating item prices and marking the list as completed.
 * It's performed within a database transaction to ensure data consistency.
 *
 * Completa la compra de una lista actualizando los precios de los ítems y marcando la lista como completada.
 * Se realiza dentro de una transacción de base de datos para asegurar la consistencia de los datos.
 *
 * @param {number} listId - The ID of the list to complete.
 * @param {number} userId - The ID of the user who owns the list.
 * @param {Array<object>} items - An array of item objects with 'id' (item ID) and 'price' (updated price).
 * Example: [{ id: 101, price: 2.50 }, { id: 102, price: 1.75 }]
 * @returns {Promise<boolean>} True if the purchase was successfully completed, false if the list was not found or unauthorized.
 * @throws {Error} If a database error occurs during the transaction.
 */
export const completeListPurchase = async (listId, userId, items) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction(); // Start transaction
    // Iniciar transacción

    // Step 1: Update price and mark as bought for each item in `list_items`
    // Paso 1: Actualizar el precio y marcar como comprado para cada ítem en `list_items`
    for (const item of items) {
      // It's crucial to include `id_list` in the WHERE clause to ensure the item belongs to the correct list and user.
      // Es crucial incluir `id_list` en la cláusula WHERE para asegurar que el ítem pertenece a la lista y al usuario correctos.
      const itemUpdateQuery = `
        UPDATE list_items
        SET price = ?, is_bought = 1
        WHERE id_item = ? AND id_list = ?;
      `;
      // Use conn.execute for prepared statements with placeholders (more secure against SQL injection)
      // Usa conn.execute para sentencias preparadas con marcadores de posición (más seguro contra inyección SQL)
      await conn.execute(itemUpdateQuery, [item.price, item.id, listId]);
    }

    // Step 2: Update the main list (`lists`)
    // Paso 2: Actualizar la lista principal (`lists`)
    const listUpdateQuery = `
      UPDATE lists
      SET
        is_completed = 1,
        purchased_at = NOW()
        -- You might want to calculate and update total_cost and total_products here if your 'lists' table has those columns.
        -- For example: , total_cost = (SELECT SUM(price * quantity) FROM list_items WHERE id_list = ?)
        -- Podrías querer calcular y actualizar total_cost y total_products aquí si tu tabla 'lists' tiene esas columnas.
        -- Por ejemplo: , total_cost = (SELECT SUM(price * quantity) FROM list_items WHERE id_list = ?)
      WHERE id_list = ? AND id_user = ?;
    `;
    const [listUpdateResult] = await conn.execute(listUpdateQuery, [
      listId,
      userId,
    ]);

    if (listUpdateResult.affectedRows === 0) {
      // If no rows were updated in 'lists', it means the list does not exist
      // or does not belong to the user. Rollback all operations.
      // Si no se actualizó ninguna fila en 'lists', significa que la lista no existe
      // o no pertenece al usuario. Deshacer todas las operaciones.
      await conn.rollback();
      return false;
    }

    await conn.commit(); // Commit the transaction if all went well
    // Confirmar la transacción si todo fue bien
    return true;
  } catch (error) {
    if (conn) {
      await conn.rollback(); // If something fails, rollback all changes in the transaction
      // Si algo falla, deshacer todos los cambios de la transacción
    }
    console.error("Error in completeListPurchase model (transaction):", error);
    throw error; // Re-throw the error for the controller to catch
    // Re-lanzar el error para que el controlador lo capture
  } finally {
    if (conn) {
      conn.release(); // Always release the connection
      // Siempre liberar la conexión
    }
  }
};

export const getListCompleteByUserIdListId = async (list_id, user_id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query(
      `SELECT
        u.name AS nombre_usuario,
        u.email AS email_usuario,
        l.name_list AS nombre_de_lista,
        l.created_at AS fecha_creacion_lista,
        l.is_completed AS lista_completada,
        l.purchased_at AS fecha_compra_lista,
        li.id_item AS id_item,
        li.product_name AS nombre_producto,
        li.quantity AS cantidad_producto,
        li.price AS precio_unitario,
        (li.quantity * li.price) AS subtotal_item,
        li.is_bought AS producto_comprado,
        SUM(li.quantity) OVER (PARTITION BY l.id_list) AS cantidad_total_productos_en_lista,
        SUM(li.quantity * li.price) OVER (PARTITION BY l.id_list) AS precio_total_lista
      FROM
          lists l
      JOIN
          users u ON l.id_user = u.id_user
      JOIN
          list_items li ON l.id_list = li.id_list
      WHERE
          l.id_user = ? AND l.id_list = ?
      ORDER BY
          li.id_item;`, // Ensure the list belongs to the user
      [user_id, list_id]
    );
    return rows;
  } catch (error) {
    console.error("Error in getListItemsByListId model:", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

export const updateListItemPrice = async (conn, listItemId, newPrice) => {
  try {
    const query = `
      UPDATE list_items
      SET price = ?
      WHERE id_item = ?;
    `;
    const [result] = await conn.query(query, [newPrice, listItemId]);
    return result; // Esto contendrá info como `affectedRows`
  } catch (error) {
    console.error("Error updating list item price in model:", error);
    throw error;
  }
};