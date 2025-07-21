import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  getProfile,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/zod.validade.js";
import { loginSchema, registerSchema } from "../validator/user.validator.js";

const userRouter = express.Router();

// userRouter.get("/", getAllUsers);
// userRouter.get("/:id", getUserById);
userRouter.post("/register", validate(registerSchema), createUser);
userRouter.post("/login", validate(loginSchema), loginUser);
userRouter.get("/profile", verifyToken, getProfile);

export default userRouter;
