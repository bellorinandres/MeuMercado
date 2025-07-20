import pool from "../config/db.js";

export const findItemsByList = async (list_id) => {
  const [rows] = await pool.query(
    "SELECT id_item, product_name, quantity, price, is_bought FROM list_items WHERE id_list = ?",
    [list_id]
  );
  return rows;
};

export const findItemById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id_item, product_name, quantity, price, is_bought FROM list_items WHERE id_item = ?",
    [id]
  );
  return rows[0];
};

export const insertItem = async (list_id, product_name, quantity, price) => {
  const [result] = await pool.query(
    "INSERT INTO list_items (id_list, product_name, quantity, price) VALUES (?, ?, ?, ?)",
    [list_id, product_name, quantity, price]
  );
  return result;
};

export const updateItem = async (id, is_bought) => {
  const [result] = await pool.query(
    "UPDATE list_items SET is_bought = ? WHERE id_item = ?",
    [is_bought, id]
  );
  return result;
};

export const removeItem = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM list_items WHERE id_item = ?",
    [id]
  );
  return result;
};

export const updateItemPriceAndStatus = async (id, price, is_bought) => {
  const [result] = await db.query(
    "UPDATE list_items SET price = ?, is_bought = ? WHERE id_item = ?",
    [price, is_bought, id]
  );
  return result;
};
