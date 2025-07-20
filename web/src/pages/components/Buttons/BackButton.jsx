// web/src/components/BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton({
  to = -1,
  ariaLabel = "Regresar",
  className = "",
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof to === "number") {
      navigate(to); // Navega hacia atrás en el historial (ej: -1)
    } else {
      navigate(to); // Navega a una ruta específica (ej: "/dashboard")
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-2 ${className}`}
      aria-label={ariaLabel}
    >
      {/* Icono de flecha SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
    </button>
  );
}
