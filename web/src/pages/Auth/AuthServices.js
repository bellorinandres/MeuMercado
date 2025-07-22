// src/services/authService.js

// ✅ Reutilizamos la misma variable de entorno para la URL base de la API
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
  console.log(import.meta.env.VITE_API_BASE_URL);

// Si usas Create React App (CRA) en lugar de Vite, descomenta la siguiente línea y comenta la de arriba:
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api";

/**
 * Función para registrar un nuevo usuario.
 *
 * @param {string} name - El nombre del usuario.
 * @param {string} email - El correo electrónico del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<Object>} La respuesta del servidor (ej. { message: "Registro exitoso", userId: 123 }).
 * @throws {Error} Si el registro falla (errores de validación, usuario ya existe, etc.).
 */
export async function RegisterService(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      // Intenta leer el mensaje de error del backend
      let errorData = { message: "Algo salió mal durante el registro." };
      try {
        // Asegúrate de que el backend siempre envía JSON en caso de error
        errorData = await response.json();
      } catch (e) {
        console.error("Error parsing register error response:", e);
      }
      // Lanza un error con el mensaje del backend o uno genérico
      const error = new Error(errorData.message || response.statusText);
      error.statusCode = response.status; // Para un manejo más específico si es necesario
      throw error;
    }

    // Si la respuesta es OK, devuelve el JSON (ej. { message: "Usuario registrado" })
    return await response.json();
  } catch (error) {
    console.error("Error in authService.register:", error);
    // Vuelve a lanzar el error para que el componente RegisterPage lo pueda manejar
    throw error;
  }
}

// Aquí irán otras funciones de autenticación como login, logout, etc.
// export async function login(email, password) { ... }
// export async function logout(token) { ... }
/**
 * Función para iniciar sesión de un usuario.
 *
 * @param {string} email - El correo electrónico del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<Object>} Un objeto con los datos del usuario logueado (ej. { id_user, name, token }).
 * @throws {Error} Si el inicio de sesión falla (credenciales incorrectas, error del servidor, etc.).
 */
export async function LoginServices(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorData = {
        message:
          "Credenciales incorrectas. Por favor, verifica tu correo y contraseña.",
      };
      try {
        // Asegúrate de que el backend siempre envía JSON en caso de error
        errorData = await response.json();
      } catch (e) {
        console.error("Error parsing login error response:", e);
      }
      // Lanza un error con el mensaje del backend o uno genérico
      const error = new Error(errorData.message || response.statusText);
      error.statusCode = response.status;
      throw error;
    }

    // Si la respuesta es OK (ej. 200), devuelve el JSON con los datos del usuario y el token
    return await response.json();
  } catch (error) {
    console.error("Error in authService.login:", error);
    // Vuelve a lanzar el error para que el componente LoginPage lo pueda manejar
    throw error;
  }
}

// Puedes añadir una función para logout si la necesitas, por ejemplo:
/*
export async function logout() {
  // Si tu backend tiene un endpoint de logout, puedes llamarlo aquí.
  // De lo contrario, el "logout" en el frontend suele ser borrar el token del almacenamiento local.
  // No hay necesidad de una llamada a la API si solo borras el token.
  console.log("User logged out (frontend action).");
  localStorage.removeItem('user'); // O el nombre de tu clave en localStorage
  // window.location.href = '/login'; // O usar navigate('/')
}
*/
