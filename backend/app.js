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
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
console.log(process.env.FRONTEND_URL);

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/test-cors", (req, res) => {
  res.json({ message: "Backend y CORS funcionando ✅" });
});

// tus rutas…
import userRouter from "./routes/user.routes.js";
import listRouter from "./routes/list.routes.js";
import { verifyToken } from "./middlewares/auth.middleware.js";
import { initDatabase } from "./config/db.js";

app.use("/api/users", userRouter);
app.use("/api/lists", verifyToken, listRouter);

app.get("/", (req, res) => res.send("ShoppingListMVC API running 🚀"));

initDatabase((err) => {
  if (err) {
    console.error("❌ Error inicializando base de datos:", err);
    process.exit(1);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server listening on port ${PORT}`);
    console.log(`✅ Accessible via http://localhost:${PORT}`);
  });
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`✅ Accessible via http://localhost:${PORT}`);
});
