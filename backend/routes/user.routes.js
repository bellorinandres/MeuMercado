import express from "express";
import { getProfile } from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/zod.validade.js";
import { loginSchema, registerSchema } from "../validator/user.validator.js";
import {
  forgotPassword,
  resetPassword,
  loginUser,
  createUser,
} from "../controllers/auth.controllers.js";

const userRouter = express.Router();

// userRouter.get("/", getAllUsers);
// userRouter.get("/:id", getUserById);
userRouter.post("/register", validate(registerSchema), createUser);
userRouter.post("/login", validate(loginSchema), loginUser);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/forgot-password", forgotPassword);

userRouter.get("/profile", verifyToken, getProfile);

export default userRouter;
