import express from "express";
import { getConfig } from "../controllers/user.controllers.js";
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

userRouter.get("/settings", verifyToken, getConfig);
userRouter.post("/register", validate(registerSchema), createUser);
userRouter.post("/login", validate(loginSchema), loginUser);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/forgot-password", forgotPassword);

export default userRouter;
