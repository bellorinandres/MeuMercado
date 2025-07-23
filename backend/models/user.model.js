// backend/models/user.model.js
import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const findAllUsers = async () => {
  const [rows] = await pool.query("SELECT id_user, name, email FROM users");
  return rows;
};

export const findUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id_user, name, email FROM users WHERE id_user = ?",
    [id]
  );
  return rows[0];
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
