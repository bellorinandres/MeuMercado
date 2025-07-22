import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import initDatabase from "./config/db.js";

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

app.use("/api/users", userRouter);
app.use("/api/lists", verifyToken, listRouter);

app.get("/", (req, res) => res.send("ShoppingListMVC API running 🚀"));

// inicializamos la base y arrancamos el servidor
const start = async () => {
  try {
    const pool = await initDatabase();
    app.locals.db = pool; // opcional para usar el pool en las rutas

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Error inicializando app:", err);
    process.exit(1);
  }
};

start();
