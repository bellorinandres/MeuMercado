import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // Asegúrate de que la ruta sea correcta

/**
 * Componente de ruta privada que verifica la autenticación del usuario.
 * Si el usuario no está autenticado, redirige a la página de inicio de sesión.
 * Muestra un indicador de carga mientras se verifica el estado de autenticación.
 *
 * @returns {JSX.Element} - Un spinner de carga, una redirección o el contenido anidado.
 */
function PrivateRoute() {
  const { user, loading } = useContext(AuthContext);

  // Muestra un spinner o un indicador de carga mientras se verifica el estado de autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-700">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Si no está cargando, redirige si no hay usuario o muestra el contenido anidado si sí lo hay
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute; // Exporta el componente
