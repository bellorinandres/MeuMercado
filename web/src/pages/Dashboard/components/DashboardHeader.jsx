// web/src/pages/Dashboard/components/DashboardHeader.jsx
import { Link } from "react-router-dom";

export default function DashboardHeader({ user, onLogout }) {
  // Define el nombre del usuario, con un fallback si no está disponible
  const userName = user?.name || "Invitado";

  return (
    <header
      className="flex flex-col md:flex-row md:justify-between md:items-center 
                       gap-4 md:gap-2 p-4 bg-white rounded-lg shadow-md mb-6"
    >
      {" "}
      {/* Añadidas clases de Tailwind para el contenedor */}
      {/* Sección de bienvenida */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
          👋 Bienvenido, {userName}
        </h1>
        <p className="text-gray-600 text-sm text-center md:text-left mt-1">
          {" "}
          {/* Texto de color más oscuro y margen superior */}
          Administra tus listas de compras fácilmente.
        </p>
      </div>
      {/* Contenedor de acciones: Configuración y Cerrar Sesión */}
      <div className="flex justify-center md:justify-end items-center gap-3 md:gap-4 mt-4 md:mt-0">
        {" "}
        {/* Ajustes de gap y margin */}
        {/* Botón de Configuración */}
        <Link
          to="/settings"
          className="inline-flex items-center px-4 py-2 border border-transparent 
                     text-sm font-medium rounded-md shadow-sm text-gray-700 bg-gray-200 
                     hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-gray-400 transition-colors duration-200"
          aria-label="Ir a Configuración"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="-ml-1 mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1.51-1V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1 1.51H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.82-.33z"></path>
          </svg>
          Configuración
        </Link>
        {/* Botón de Cerrar Sesión */}
        <button
          onClick={onLogout}
          className="inline-flex items-center px-4 py-2 border border-transparent 
                     text-sm font-medium rounded-md shadow-sm text-red-700 bg-red-100 
                     hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-red-400 transition-colors duration-200"
          aria-label="Cerrar sesión"
        >
          {/* Icono de puerta (cerrar sesión) - puedes usar un SVG o librería de iconos */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="-ml-1 mr-2 h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
