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
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (name, email, pass_hash) VALUES (?, ?, ?)",
    [name, email, hash]
  );
  return result;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};
