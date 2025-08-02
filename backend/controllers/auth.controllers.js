// backend/controllers/auth.controllers.js
import pool from "../config/db.js";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createPasswordResetToken,
  getValidResetToken,
  deleteResetTokensByUserId,
} from "../models/passwordReset.model.js";
import { sendRecoveryEmail } from "../utils/emailService.js";
import {
  createUserSettings,
  findUserByEmail,
  insertUser,
} from "../models/user.model.js";
import { getDefaultSettingsByIp } from "../utils/locationUtils.js";

// Register a new user
// POST /api/users/register

export const createUser = async (req, res) => {
  let conn; // Initialize connection variable for proper release in finally block
  try {
    conn = await pool.getConnection(); // Obtain a connection from the pool

    const { name, email, password } = req.body;

    // --- 1. Basic Input Validation ---
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // --- 2. Get Client IP for Geo-location ---
    // IMPORTANT: If your app is behind a proxy (e.g., Nginx, Heroku, Vercel, Render),
    // the real IP is usually in 'x-forwarded-for'. Otherwise, 'req.connection.remoteAddress' or 'req.ip' is used.
    const clientIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log(clientIp);
    // For local development on some systems, req.connection.remoteAddress might be '::1' (IPv6 localhost) or '127.0.0.1' (IPv4 localhost).

    // --- 3. Check for Existing User ---
    const existingUser = await findUserByEmail(email); // Pass connection if your model uses it
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // --- 4. Insert New User into 'users' table ---
    // Assuming insertUser uses 'conn' and returns an object with insertId
    const userInsertResult = await insertUser(name, email, password);
    const newUserId = userInsertResult.insertId;

    if (!newUserId) {
      // This case should ideally not happen if insertUser works correctly,
      // but it's a safeguard.
      return res.status(500).json({ error: "Failed to create user." });
    }

    // --- 5. Determine Default Settings based on IP ---
    const { language: defaultLanguage, currency: defaultCurrency } =
      getDefaultSettingsByIp(clientIp);

    console.log(
      `Usuario ${newUserId} registrado con idioma: ${defaultLanguage}, moneda: ${defaultCurrency}`
    );

    // --- 6. Create Default User Settings ---
    // Use the id_user obtained from the user insertion
    const settingsResult = await createUserSettings(
      newUserId,
      defaultLanguage,
      defaultCurrency
    );

    // Optional: Handle the result from createUserSettings
    if (!settingsResult.success) {
      console.warn(
        `Could not create settings for user ${newUserId}: ${settingsResult.message}`
      );
      // You might choose to still return 201 for user creation,
      // but log the settings error or return a different status if settings are critical.
      // For now, we'll proceed as user was created.
    }

    // --- 7. Respond with Success ---
    res.status(201).json({
      id: newUserId,
      name,
      email,
      language: defaultLanguage,
      currency: defaultCurrency,
    });
  } catch (err) {
    console.error("🔥 Error in createUser:", err);
    // Be careful not to expose too much internal error detail in production
    res
      .status(500)
      .json({ error: "An unexpected error occurred during registration." });
  } finally {
    // Ensure the connection is released back to the pool
    if (conn) conn.release();
  }
};

// Login a user
// POST /api/users/login

export const loginUser = async (req, res) => {
  const { email, password } = req.validatedData;

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const validPassword = await bcrypt.compare(password, user.pass_hash);

    if (!validPassword) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 🔷 Firmar un token JWT con el id del usuario
    const token = jwt.sign({ id: user.id_user }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Devuelves el token y los datos en la respuesta
    res.json({
      token,
      id_user: user.id_user,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Forgot password
// POST /api/users/forgot-password

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await pool.query(
      "SELECT id, name FROM users WHERE email = ?",
      [email]
    );
    if (users.length === 0)
      return res.status(404).json({ message: "Correo no registrado" });

    const user = users[0];
    const token = CryptoJS.lib.WordArray.random(32).toString();
    const expiresAt = new Date(Date.now() + 3600 * 1000); // 1 hora

    await createPasswordResetToken(user.id, token, expiresAt);
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    await sendRecoveryEmail(user.name, email, resetLink);

    res.json({ message: "Enlace de recuperación enviado (simulado)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Reset password
// POST /api/users/reset-password

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const tokenData = await getValidResetToken(token);
    if (!tokenData)
      return res.status(400).json({ message: "Token inválido o expirado" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashed,
      tokenData.user_id,
    ]);
    await deleteResetTokensByUserId(tokenData.user_id);

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
