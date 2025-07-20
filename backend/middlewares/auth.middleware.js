// src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";

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

    // ✅ ¡CAMBIO CLAVE AQUÍ!
    // Asigna el ID del usuario al objeto `req.user` para coherencia.
    // Asegúrate de que `decoded.id_user` sea la propiedad correcta de tu payload JWT.
    // Si tu token está firmado con `{ id: user.id_user }`, entonces sería `decoded.id`.
    // Si está firmado con `{ id_user: user.id_user }`, entonces es `decoded.id_user`.
    req.user = { id: decoded.id }; // Suponiendo que tu JWT payload tiene 'id_user'

    next(); // Continúa con la siguiente función middleware o controlador
  });
};
