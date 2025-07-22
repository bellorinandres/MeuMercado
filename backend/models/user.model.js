import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  })
);

app.use(morgan("dev"));
app.use(express.json());

// tus rutas…
import userRouter from "./routes/user.routes.js";
import listRouter from "./routes/list.routes.js";
import { verifyToken } from "./middlewares/auth.middleware.js";
import { initDatabase } from "./config/db.js";

// Montar las rutas
app.use("/api/users", userRouter);
app.use("/api/lists", verifyToken, listRouter);

app.get("/", (req, res) => res.send("ShoppingListMVC API running 🚀"));

async function startServer() {
  try {
    await initDatabase(); // espera a que la base de datos esté lista
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server listening on port ${PORT}`);
      console.log(`✅ Accessible via http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error inicializando base de datos:", err);
    process.exit(1);
  }
}

startServer();
