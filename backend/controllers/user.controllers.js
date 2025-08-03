// backend/controllers/user.controllers.js

import pool from "../config/db.js";
import {
  findAllUsers,
  findUserById,
  getSettingsUserById,
  UpdateProfileById,
} from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getConfig = async (req, res) => {
  const userId = req.user.id;

  let conn;
  try {
    conn = await pool.getConnection();
    const userWithSettings = await getSettingsUserById(conn, userId);
    if (!userId) {
      // Esto solo debería pasar si verifyToken no funciona bien
      return res.status(400).json({ message: "ID de usuario no disponible." });
    }

    if (!userWithSettings) {
      // Esto podría ocurrir si el usuario existe pero no tiene entrada en user_settings (lo cual no debería pasar si la lógica de registro es correcta)
      return res
        .status(404)
        .json({ message: "Usuario o sus configuraciones no encontradas." });
    }

    // Devuelve los datos del usuario incluyendo language y currency
    res.status(200).json({
      user: {
        id: userWithSettings.id_user,
        name: userWithSettings.name,
        email: userWithSettings.email,
        settings: {
          language: userWithSettings.language,
          currency: userWithSettings.currency,
        },
      },
    });
  } catch (error) {
    console.error("Error en el controlador getMe:", error);
    res.status(500).json({
      message: "Error al obtener los datos del usuario.",
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
};

export const updateNameById = async (req, res) => {
  let conn;
  try {
    const { newName } = req.body;
    const userId = req.user.id;

    if (!userId || !newName) {
      return res.status(400).json({
        message: "ID de usuário e novo nome são obrigatórios.",
      });
    }

    conn = await pool.getConnection();
    const result = await UpdateProfileById(conn, userId, newName);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          message: "Utilizador não encontrado ou nenhum nome foi alterado.",
        });
    }

    res.status(200).json({
      message: "Nome atualizado com sucesso.",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Erro no controlador updateNameById:", error);
    res.status(500).json({
      message: "Ocorreu um erro interno do servidor.",
    });
  } finally {
    if (conn) conn.release();
  }
};
