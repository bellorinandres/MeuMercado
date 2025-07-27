import pool from "../config/db.js";

export const createPasswordResetToken = async (userId, token, expiresAt) => {
  await pool.query(
    "INSERT INTO password_resets (id_user, token, expires_at) VALUES (?, ?, ?)",
    [userId, token, expiresAt]
  );
};

export const getValidResetToken = async (token) => {
  const [rows] = await pool.query(
    "SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()",
    [token]
  );
  return rows[0];
};

export const deleteResetTokensByUserId = async (userId) => {
  await pool.query("DELETE FROM password_resets WHERE id_user = ?", [userId]);
};
