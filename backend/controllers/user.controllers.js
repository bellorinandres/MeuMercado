// backend/controllers/user.controllers.js

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findAllUsers,
  findUserByEmail,
  findUserById,
  insertUser,
} from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const result = await insertUser(name, email, password);

    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    console.error("🔥 Error in createUser:", err);
    res.status(500).json({ error: err.message });
  }
p
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

export const getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ id_user: user.id_user, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
