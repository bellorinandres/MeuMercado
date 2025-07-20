// web/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Public/LandingPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import LoginPage from "./pages/Auth/LoginPage";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import CreateList from "./pages/CreateList/CreateList"; // Make sure the path is correct
import ShoppingList from "./pages/ShoppingList/ShoppingList";

// ---
// Componente PrivateRoute mejorado
function PrivateRoute({ children }) {
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
          <p className="text-gray-700">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está cargando, redirige si no hay usuario o muestra el contenido si sí lo hay
  return user ? children : <Navigate to="/login" replace />; // Usa `replace` para evitar historiales infinitos
}

// ---

export default function App() {
  return (
    // Es CRUCIAL que BrowserRouter envuelva toda tu aplicación,
    // generalmente en index.js o main.jsx, como se explicó antes.
    // Esto asegura que AuthProvider y todos los componentes anidados
    // tengan acceso al contexto de enrutamiento.
    // Aquí solo mostramos las Routes.
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/createList"
        element={
          <PrivateRoute>
            <CreateList />
          </PrivateRoute>
        }
      />
      <Route
        path="/list/:id/purchase" // Esta es la ruta a la que apunta el botón "Iniciar Compra"
        element={
          <PrivateRoute>
            <ShoppingList /> {/* Aquí se renderiza tu nueva página */}
          </PrivateRoute>
        }
      />
      {/* Puedes añadir una ruta de fallback para páginas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
