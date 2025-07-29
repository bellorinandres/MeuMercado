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
