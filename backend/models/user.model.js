// backend/models/user.model.js
import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const findAllUsers = async () => {
  const [rows] = await pool.query("SELECT id_user, name, email FROM users");
  return rows;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT name, email FROM users WHERE id_user = ?",
    [id]
  );
  return rows[0];
};
export const getSettingsUserById = async (conn, id_user) => {
  // Cambiado 'id' a 'id_user' para mayor claridad
  try {
    // Envuelve la operación en un bloque try-catch para manejar errores
    const [rows] = await conn.query(
      `SELECT
          u.id_user,
          u.name,
          u.email,          
          us.language,
          us.currency
       FROM
          users u
       JOIN
          user_settings us ON u.id_user = us.id_user
       WHERE
          u.id_user = ?`,
      [id_user] // Usa el nombre de la variable consistente
    );

    // Es buena práctica retornar null o undefined si no se encuentra el usuario
    // en lugar de un objeto vacío o undefined de rows[0].
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    // Registra el error para depuración
    console.error("Error en getSettingsUserById:", error);
    // Relanza el error para que el controlador pueda manejarlo
    throw error;
  }
};

export const insertUser = async (name, email, password) => {
  try {
    const hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (name, email, pass_hash) VALUES (?, ?, ?)`,
      [name, email, hash]
    );

    return {
      success: true,
      insertId: result.insertId,
    };
  } catch (err) {
    // Puedes decidir lanzar el error o devolver un objeto con error
    if (err.code === "ER_DUP_ENTRY") {
      return {
        success: false,
        error: "Email already registered",
      };
    }

    console.error("🔥 Error in insertUser:", err);
    throw err;
  }
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

export const createUserSettings = async (id_user, language, currency) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO user_settings (id_user, language, currency) VALUES (?, ?, ?)`,
      [id_user, language, currency]
    );

    // If the insert was successful, affectedRows will be 1
    if (result.affectedRows > 0) {
      return {
        success: true,
        message: "User settings created successfully.",
        id: id_user, // Optionally return the ID for confirmation
      };
    } else {
      // This case is unlikely for a simple INSERT if no error was thrown,
      // but it's good for robustness if the DB reports 0 affected rows.
      return {
        success: false,
        message: "Failed to create user settings (no rows affected).",
      };
    }
  } catch (err) {
    // Check for duplicate entry error specifically
    if (err.code === "ER_DUP_ENTRY") {
      console.warn(
        `Attempted to create duplicate settings for user ID: ${id_user}`
      );
      return {
        success: false,
        message: "User settings for this ID already exist.",
        code: "DUPLICATE_ENTRY", // Provide a custom error code for easier handling
      };
    }

    // Log the error for debugging purposes
    console.error("🔥 Error in createUserSettings:", err);

    // Re-throw the error for all other types of errors
    // This allows the calling controller to catch and handle unexpected database issues (e.g., connection issues, syntax errors)
    throw err;
  }
};

export const UpdateProfileById = async (conn, id_user, newName) => {
  try {
    const query = `
      UPDATE users
      SET name = ?
      WHERE id_user = ?;
    `;
    const [result] = await conn.query(query, [newName, id_user]);
    return result; // Esto contendrá info como `affectedRows`
  } catch (error) {
    console.error("Error updating list item price in model:", error);
    throw error;
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

export const deleteUser = async (conn, userId) => {
  try {
    const [result] = await conn.query(`DELETE FROM users WHERE id_user = ?`, [
      userId,
    ]);
    return result;
  } catch (error) {
    throw new Error("Error al eliminar el usuario: " + error.message);
  }
};
