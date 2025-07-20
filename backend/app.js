// ShoppingListMVC Backend API
// Este archivo es el punto de entrada de la aplicación Express.
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import listRouter from "./routes/list.routes.js";
// import itemRouter from "./routes/item.routes.js"; // Si no lo usas, puedes comentarlo o eliminarlo
import pool from "./config/db.js"; // Asegúrate de que 'pool' se exporte correctamente desde db.js
import { verifyToken } from "./middlewares/auth.middleware.js";
import morgan from "morgan";

dotenv.config(); // Carga las variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---

// ✅ Configuración de CORS: Permite que tu API sea accesible desde otros orígenes
// Es crucial para que el frontend (especialmente desde otra IP/dispositivo) pueda comunicarse.
app.use(
  cors({
    origin: "*", // abierto para todos
  })
);
app.use(morgan("dev")); // Middleware para logs de peticiones en consola (útil en desarrollo)
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes JSON

// --- Rutas ---
app.use("/api/users", userRouter);
// ✅ Aplicamos verifyToken a todas las rutas de /api/lists
app.use("/api/lists", verifyToken, listRouter);
// app.use("/api/items", verifyToken, itemRouter); // Descomenta si usas itemRouter y necesitas token

// Ruta de prueba básica para verificar que la API está corriendo
app.get("/", (req, res) => {
  res.send("ShoppingListMVC API running 🚀");
});

// Ruta de prueba para verificar la conexión a la base de datos
app.get("/db-test", async (req, res) => {
  try {
    // Usar 'pool' para la consulta, no 'db' (que no está definido aquí)
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ dbTime: rows[0].now });
  } catch (err) {
    console.error("Error en /db-test:", err);
    res.status(500).send("DB connection failed");
  }
});

// --- Inicio del Servidor ---
// ✅ Escuchar en '0.0.0.0' para ser accesible desde otras IPs en la red local.
// Si no se especifica host, Express a menudo usa 0.0.0.0 por defecto, pero es mejor ser explícito.
app.listen(PORT, "0.0.0.0", () => {
  // ✅ Cambio aquí para escuchar en todas las interfaces
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`✅ Accessible via http://localhost:${PORT}`);
  // Para acceder desde otros dispositivos en la misma red, usa la IP de tu máquina:
  console.log(`✅ Accessible from network: http://192.168.1.7:${PORT} `);

  // Prueba la conexión a la base de datos al arrancar
  pool
    .query("SELECT NOW() AS now")
    .then(([rows]) => {
      console.log(
        `✅ Conectado a la base de datos. Hora del servidor DB: ${rows[0].now}`
      );
    })
    .catch((err) => {
      console.error("❌ Error al conectar a la base de datos:", err.message);
      // Opcional: Salir del proceso si la conexión a la DB es crítica al inicio
      // process.exit(1);
    });
});
