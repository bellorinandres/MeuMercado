// backend/controllers/user.controllers.js
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import {
  deleteUser,
  findAllUsers,
  getSettingsUserById,
  getUserPasswordHash,
  updateProfileById,
  updateSettingsById,
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
    const result = await updateProfileById(conn, userId, newName);

    if (result.affectedRows === 0) {
      return res.status(404).json({
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

export const deleteAccount = async (req, res) => {
  let conn;
  try {
    const { pass } = req.body;
    const userId = req.user.id;
    conn = await pool.getConnection();

    const userPassHash = await getUserPasswordHash(conn, userId);

    if (!userPassHash) {
      return res.status(404).json({
        message: "Usuario no encontrado.",
      });
    }

    const isMatch = await bcrypt.compare(pass, userPassHash);
    if (!isMatch) {
      return res.status(401).json({
        message: "Credenciales inválidas.",
      });
    }

    const result = await deleteUser(conn, userId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Usuario no encontrado o no se pudo eliminar.",
      });
    }

    res.status(200).json({
      message: "Cuenta eliminada con éxito.",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Error al eliminar la cuenta:", error);
    res.status(500).json({
      message: "Ocurrió un error en el servidor.",
      error: error.message,
    });
  } finally {
    if (conn) conn.release();
  }
};

// Esta función es un controlador para una ruta PUT o POST, por ejemplo, /api/settings
export const updateSettings = async (req, res) => {
  // 1. Obtener el ID del usuario del token de autenticación
  //    (Asumiendo que tu middleware de autenticación lo adjunta al objeto 'req')
  const userId = req.user.id;

  // 2. Obtener la nueva configuración del cuerpo de la solicitud
  const { language, currency } = req.body;
  console.log(req.body);

  // 3. Validar que los datos requeridos estén presentes
  if (!language || !currency) {
    return res.status(400).json({
      success: false,
      message: "Faltan parámetros de configuración (language y currency).",
    });
  }

  // 4. Llamar a la función del modelo para actualizar la configuración
  try {
    const result = await updateSettingsById(pool, userId, {
      language,
      currency,
    });

    // 5. Enviar una respuesta exitosa al cliente
    res.status(200).json({
      success: true,
      message: "Configuración actualizada con éxito.",
      result: result,
    });
  } catch (error) {
    // 6. Manejar errores
    console.error("Error en el controlador updateSettings:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al actualizar la configuración.",
    });
  }
};
