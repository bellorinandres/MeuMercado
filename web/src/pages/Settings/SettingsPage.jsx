// web/src/pages/Settings/SettingsPage.jsx
import { useState, useEffect, useContext } from "react";
import {
  useNavigate,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
// Importa los subcomponentes
import PersonalDataSection from "./sections/PersonalDataSection";
import AccountSection from "./sections/AccountSection";
import GeneralSettingsSection from "./sections/GeneralSettingsSection";
import { fetchSettingsUser } from "./settings.services";
import BackButton from "../components/Buttons/BackButton";

export default function SettingsPage() {
  const { user, logout } = useContext(AuthContext); // Necesitamos el token del usuario y la función logout

  const navigate = useNavigate();
  const location = useLocation();

  // Inicializa userData como null, o con un objeto vacío si prefieres.
  // Será rellenado con los datos reales del backend.
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    console.log("Objeto user actual de AuthContext:", user);

    if (!user || !user.token) {
      navigate("/login");
      return; // Añade un return para detener la ejecución si no hay token
    }
    // ... el resto de tu loadUserData
  }, [user, navigate, logout]);

  // Cargar datos del usuario y sus configuraciones al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null); // Limpiar errores previos

      if (user && user.token) {
        try {
          // Llama a la función de servicio, solo pasas el token
          const responseData = await fetchSettingsUser(user.token);
          // Actualiza el estado con los datos del usuario y sus settings
          setUserData(responseData.user); // Asume que la API devuelve { user: {...} }
        } catch (err) {
          console.error(
            "Error al cargar datos del usuario en SettingsPage:",
            err
          );
          setError(
            err.message || "Error al cargar tus datos. Intenta de nuevo."
          );

          // Opcional: Si el token es inválido o expiró, desloguear al usuario
          if (err.statusCode === 401 || err.statusCode === 403) {
            logout(); // Función del AuthContext para limpiar el token y redirigir
            navigate("/login");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Si no hay token, no hay carga, pero ya se redirigió
      }
    };

    loadUserData(); // Ejecutar la función de carga
  }, [user, navigate, logout]); // Dependencias: recarga si el usuario o las funciones cambian

  // Función para actualizar los datos en el estado de SettingsPage
  // Esto se pasa a los subcomponentes para que puedan notificar cambios
  // (Esta función necesitará llamar al backend para guardar los cambios en el futuro)
  const handleUserDataUpdate = (updatedFields) => {
    setUserData((prevData) => ({
      ...prevData,
      ...updatedFields,
    }));
    // Por ahora, solo actualiza el estado local. En el futuro, aquí se haría la llamada PUT al backend.
    console.log(
      "Datos de usuario actualizados localmente (aún no en backend):",
      updatedFields
    );
  };

  // Renderiza un spinner o mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Cargando configuraciones...</p>
      </div>
    );
  }

  // Si userData es null después de cargar (ej. por un error), podrías mostrar un mensaje diferente
  if (!userData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-red-700">
        <p className="text-lg mb-4">
          No se pudieron cargar los datos del usuario.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  const baseSettingsPath = "/settings";

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 flex flex-col md:flex-row">
        {/* Navegación Lateral */}
        <nav className="w-full md:w-1/4 pr-0 md:pr-6 mb-6 md:mb-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            <BackButton /> Ajustes
          </h2>
          <ul className="space-y-2">
            <li>
              <Link
                to={`${baseSettingsPath}/personal`}
                className={`block p-3 rounded-md text-lg transition-colors duration-200
                  ${
                    location.pathname === `${baseSettingsPath}/personal`
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Datos Personales
              </Link>
            </li>
            <li>
              <Link
                to={`${baseSettingsPath}/account`}
                className={`block p-3 rounded-md text-lg transition-colors duration-200
                  ${
                    location.pathname === `${baseSettingsPath}/account`
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Cuenta
              </Link>
            </li>
            <li>
              <Link
                to={`${baseSettingsPath}/general`}
                className={`block p-3 rounded-md text-lg transition-colors duration-200
                  ${
                    location.pathname === `${baseSettingsPath}/general`
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                Configuraciones
              </Link>
            </li>
          </ul>
        </nav>

        {/* Contenido de la Sección Seleccionada */}
        <div className="flex-grow w-full md:w-3/4 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <Routes>
            {/* Secciones reciben userData y la función para actualizar el estado del padre */}
            <Route
              path="/"
              element={
                <PersonalDataSection
                  userData={userData}
                  onUpdate={handleUserDataUpdate}
                />
              }
            />
            <Route
              path="/personal"
              element={
                <PersonalDataSection
                  userData={userData}
                  onUpdate={handleUserDataUpdate}
                />
              }
            />
            <Route
              path="/account"
              element={<AccountSection />} // AccountSection no necesita userData directamente por ahora
            />
            <Route
              path="/general"
              element={
                <GeneralSettingsSection
                  userSettings={userData.settings}
                  onUpdateSettings={handleUserDataUpdate}
                />
              } // Le pasamos las settings
            />
            <Route
              path="*"
              element={
                <div className="p-6 text-center text-gray-600">
                  <h3 className="text-xl font-semibold mb-2">
                    Sección no encontrada
                  </h3>
                  <p>Por favor, selecciona una opción del menú lateral.</p>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
