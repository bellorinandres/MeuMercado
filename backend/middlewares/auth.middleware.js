// src/middleware/auth.middleware.js
import jwt, { decode } from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No se proporcionó token" });
  }

  const token = authHeader.split(" ")[1];
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    
    if (err) {
      // Manejo más específico de errores de JWT
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Token expirado. Por favor, inicia sesión de nuevo.",
        });
      }
      return res.status(403).json({ message: "Token inválido." });
    }

    req.user = { id: decoded.id };
    
    next(); // Continúa con la siguiente función middleware o controlador
  });
};
