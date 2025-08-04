import express from "express";
import {
  deleteAccount,
  getConfig,
  updateNameById,
} from "../controllers/user.controllers.js";
import { validate } from "../middlewares/zod.validade.js";
import { loginSchema, registerSchema } from "../validator/user.validator.js";
import {
  forgotPassword,
  resetPassword,
  loginUser,
  createUser,
} from "../controllers/auth.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();
// GET - Select
userRouter.get("/settings", verifyToken, getConfig);

// PUT - Update
userRouter.put("/settings", verifyToken, updateNameById);
// userRouter.put("/settings/updatePassword");
// POST - Insert
userRouter.post("/register", validate(registerSchema), createUser);
userRouter.post("/login", validate(loginSchema), loginUser);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/forgot-password", forgotPassword);

// DELETE - Delete
userRouter.delete("/settings/delete", verifyToken, deleteAccount);
export default userRouter;
