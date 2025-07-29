// src/services/authService.js

import axiosInstance from "../../api/axiosInstance";

// ✅ URL base ya viene configurada desde axiosInstance, no hace falta agregarla de nuevo

/**
 * Registrar un nuevo usuario.
 *
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function RegisterService(name, email, password) {
  try {
    const response = await axiosInstance.post("/api/users/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Error al registrar el usuario.";
    const statusCode = error.response?.status || 500;
    const err = new Error(message);
    err.statusCode = statusCode;
    throw err;
  }
}

/**
 * Iniciar sesión.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
export async function LoginServices(email, password) {
  try {
    const response = await axiosInstance.post("/api/users/login", {
      email,
      password,
    });

    const userData = response.data;

    // ✅ Guardar datos del usuario en localStorage (token, nombre, id, etc.)
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Credenciales incorrectas. Verifica tu correo y contraseña.";
    const statusCode = error.response?.status || 500;
    const err = new Error(message);
    err.statusCode = statusCode;
    throw err;
  }
}

/**
 * Cerrar sesión (limpiar localStorage)
 */
export function logout() {
  localStorage.removeItem("user");
  // También podrías redirigir al login si lo hacés desde un contexto
}

/* -------------------------------------------------
  Funciones para manejo de sesión en localStorage
---------------------------------------------------*/

// Guarda token y usuario en localStorage
export function saveSession({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Limpia token y usuario del localStorage
export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Obtiene token almacenado
export function getToken() {
  return localStorage.getItem("token");
}

// Obtiene usuario almacenado
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
