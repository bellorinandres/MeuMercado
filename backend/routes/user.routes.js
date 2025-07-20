import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  getProfile,
} from "../controllers/user.controllers.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/register", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", verifyToken, getProfile);

export default userRouter;
