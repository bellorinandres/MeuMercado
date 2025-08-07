// backend/models/user.model.js

import bcrypt from "bcrypt";
import pool from "../config/db.js";

// ----------------------------------------------------------------------
// Funciones relacionadas con USUARIOS
// ----------------------------------------------------------------------

/**
 * Inserta un nuevo usuario en la base de datos.
 * @param {string} name - Nombre del usuario.
 * @param {string} email - Correo electrónico del usuario.
 * @param {string} password - Contraseña sin hashear.
 * @returns {Promise<{success: boolean, insertId?: number, error?: string}>}
 */
export const insertUser = async (name, email, password) => {
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      `INSERT INTO users (name, email, pass_hash) VALUES (?, ?, ?)`,
      [name, email, hash]
    );
    return { success: true, insertId: result.insertId };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return { success: false, error: "Email already registered" };
    }
    console.error("🔥 Error in insertUser:", err);
    throw err;
  }
};

/**
 * Busca todos los usuarios (solo nombre y correo).
 * @returns {Promise<Array<{id_user: number, name: string, email: string}>>}
 */
export const findAllUsers = async () => {
  const [rows] = await pool.query("SELECT id_user, name, email FROM users");
  return rows;
};

/**
 * Busca un usuario por su ID.
 * @param {number} id_user - ID del usuario.
 * @returns {Promise<{name: string, email: string}|null>}
 */
export const findUserById = async (id_user) => {
  const [rows] = await pool.query(
    "SELECT name, email FROM users WHERE id_user = ?",
    [id_user]
  );
  return rows[0] || null;
};

/**
 * Busca un usuario por su correo electrónico.
 * @param {string} email - Correo electrónico del usuario.
 * @returns {Promise<{id_user: number, name: string, email: string, pass_hash: string}|null>}
 */
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0] || null;
};

/**
 * Actualiza el nombre de un usuario por su ID.
 * @param {object} conn - Objeto de conexión.
 * @param {number} id_user - ID del usuario.
 * @param {string} newName - Nuevo nombre del usuario.
 * @returns {Promise<object>}
 */
export const updateProfileById = async (conn, id_user, newName) => {
  try {
    const query = `UPDATE users SET name = ? WHERE id_user = ?;`;
    const [result] = await conn.query(query, [newName, id_user]);
    return result;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Elimina un usuario por su ID.
 * @param {object} conn - Objeto de conexión.
 * @param {number} id_user - ID del usuario.
 * @returns {Promise<object>}
 */
export const deleteUser = async (conn, id_user) => {
  try {
    const [result] = await conn.query(`DELETE FROM users WHERE id_user = ?`, [
      id_user,
    ]);
    return result;
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + error.message);
  }
};

export const getUserPasswordHash = async (conn, userId) => {
  try {
    const [rows] = await conn.query(
      `SELECT pass_hash FROM users WHERE id_user = ?`,

      [userId]
    );

    return rows.length > 0 ? rows[0].pass_hash : null;
  } catch (error) {
    throw new Error(
      "Error al obtener el hash de la contraseña: " + error.message
    );
  }
};

// ----------------------------------------------------------------------
// Funciones relacionadas con CONFIGURACIONES DE USUARIO
// ----------------------------------------------------------------------

/**
 * Crea una nueva configuración para un usuario.
 * @param {number} id_user - ID del usuario.
 * @param {string} language - Idioma.
 * @param {string} currency - Moneda.
 * @returns {Promise<object>}
 */
export const createUserSettings = async (id_user, language, currency) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO user_settings (id_user, language, currency) VALUES (?, ?, ?)`,
      [id_user, language, currency]
    );
    if (result.affectedRows > 0) {
      return { success: true, message: "User settings created." };
    }
    return { success: false, message: "Failed to create user settings." };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      console.warn(`Settings for user ID: ${id_user} already exist.`);
      return {
        success: false,
        message: "Settings for this user already exist.",
      };
    }
    console.error("🔥 Error in createUserSettings:", err);
    throw err;
  }
};

/**
 * Obtiene la configuración de un usuario por su ID.
 * @param {object} conn - Objeto de conexión.
 * @param {number} id_user - ID del usuario.
 * @returns {Promise<object|null>}
 */
export const getSettingsUserById = async (conn, id_user) => {
  try {
    const [rows] = await conn.query(
      `SELECT
        u.id_user,
        u.name,
        u.email,
        us.language,
        us.currency
      FROM
        users u
      LEFT JOIN
        user_settings us ON u.id_user = us.id_user
      WHERE
        u.id_user = ?`,
      [id_user]
    );

    // Si no se encuentra el usuario, retorna null.
    // Si se encuentra, pero no tiene settings, las columnas 'language' y 'currency' serán null.
    return rows[0] || null;
  } catch (error) {
    console.error("Error en getSettingsUserById:", error);
    throw error;
  }
};
/**
 * Actualiza la configuración de un usuario por su ID.
 * @param {object} conn - Objeto de conexión.
 * @param {number} id_user - ID del usuario.
 * @param {object} config - Objeto con 'language' y 'currency'.
 * @returns {Promise<object>}
 */
export const updateSettingsById = async (conn, id_user, config) => {
  try {
    const { language, currency } = config;
    const sql = `
      UPDATE user_settings
      SET language = ?, currency = ?
      WHERE id_user = ?
    `;
    const [result] = await conn.query(sql, [language, currency, id_user]);
    if (result.affectedRows === 0) {
      console.warn(
        `Advertencia: No se encontró configuración para el usuario con ID ${id_user}.`
      );
    }
    return result;
  } catch (error) {
    console.error("Error en updateSettingsById:", error);
    throw new Error(
      "Error al actualizar la configuración del usuario: " + error.message
    );
  }
};
