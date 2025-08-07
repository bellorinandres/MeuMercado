// backend/routes/user.routes.js
import express from "express";

// --- Controladores ---
// Rutas de autenticación
import { loginUser, createUser } from "../controllers/auth.controllers.js";
// Rutas de usuario y configuración
import {
  deleteAccount,
  getConfig,
  updateNameById,
  updateSettings,
} from "../controllers/user.controllers.js";

// --- Middlewares ---
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/zod.validade.js";

// --- Validadores ---
import { loginSchema, registerSchema } from "../validator/user.validator.js";

const userRouter = express.Router();

// =======================================================
//   RUTAS DE AUTENTICACIÓN (LOGIN, REGISTRO)
// =======================================================

/**
 * @route POST /register
 * @description Registra un nuevo usuario
 * @access Public
 */
userRouter.post("/register", validate(registerSchema), createUser);

/**
 * @route POST /login
 * @description Inicia sesión de un usuario
 * @access Public
 */
userRouter.post("/login", validate(loginSchema), loginUser);

// =======================================================
//   RUTAS DE AJUSTES Y PERFIL DE USUARIO
// =======================================================

/**
 * @route GET /settings
 * @description Obtiene la configuración del usuario autenticado
 * @access Private (Requiere token)
 */
userRouter.get("/settings", verifyToken, getConfig);

/**
 * @route PUT /settings/name
 * @description Actualiza el nombre del usuario autenticado
 * @access Private (Requiere token)
 */
userRouter.put("/settings/name", verifyToken, updateNameById);

/**
 * @route PUT /settings/updateGeneral
 * @description Actualiza las configuraciones generales del usuario (idioma, moneda)
 * @access Private (Requiere token)
 */
userRouter.put("/settings/updateGeneral", verifyToken, updateSettings);

/**
 * @route DELETE /settings/delete
 * @description Elimina la cuenta del usuario autenticado
 * @access Private (Requiere token)
 */
userRouter.delete("/settings/delete", verifyToken, deleteAccount);

export default userRouter;
