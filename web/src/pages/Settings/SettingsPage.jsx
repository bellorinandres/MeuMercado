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
// Importa las funciones del servicio para cargar datos, actualizar el nombre y la configuración, y eliminar la cuenta
import {
  fetchSettingsUser,
  updateName,
  deleteUser,
  updateGeneralSettings,
} from "./settings.services";

import BackButton from "../components/Buttons/BackButton";

export default function SettingsPage() {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Redirigir si no hay usuario autenticado
  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Cargar datos del usuario y sus configuraciones
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      if (user && user.token) {
        try {
          // Asumimos que fetchSettingsUser retorna un objeto { user: { name, email, language, currency } }
          const responseData = await fetchSettingsUser(user.token);
          setUserData(responseData.user);
        } catch (err) {
          console.error(
            "Error al cargar datos del usuario en SettingsPage:",
            err
          );
          setError(
            err.message || "Error al cargar tus datos. Intenta de nuevo."
          );
          if (err.statusCode === 401 || err.statusCode === 403) {
            logout();
            navigate("/login");
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadUserData();
  }, [user, navigate, logout]);

  // Manejador para actualizar datos personales (p.ej. nombre)
  const handleUserDataUpdate = async (updatedFields) => {
    try {
      setSuccessMessage(null);
      setError(null);
      const token = user.token;
      const response = await updateName(updatedFields, token);

      // Actualiza el estado local y el contexto de autenticación
      setUserData((prevData) => ({ ...prevData, ...updatedFields }));
      const updatedUser = { ...user, ...updatedFields };
      updateUser(updatedUser);
      setSuccessMessage(response.message || "Datos actualizados con éxito.");
    } catch (err) {
      console.error("Error al actualizar los datos del usuario:", err);
      const errorMessage =
        err.message || "Ocurrió un error al actualizar los datos.";
      setError(errorMessage);
    }
  };

  // NUEVO MANEJADOR PARA ACTUALIZAR CONFIGURACIONES GENERALES
  const handleSettingsUpdate = async (updatedSettings) => {
    try {
      setSuccessMessage(null);
      setError(null);
      const token = user.token;
      const response = await updateGeneralSettings(updatedSettings, token);

      // ✅ Solución: Construye el nuevo objeto de usuario con la estructura correcta
      const updatedUser = {
        ...user,
        settings: { ...user.settings, ...updatedSettings },
      };
      updateUser(updatedUser);

      setSuccessMessage(
        response.message || "Configuración actualizada con éxito."
      );
    } catch (err) {
      console.error("Error al actualizar la configuración general:", err);
      const errorMessage =
        err.message || "Ocurrió un error al actualizar la configuración.";
      setError(errorMessage);
    }
  };

  // Manejador para eliminar la cuenta de usuario
  const handleDeleteAccount = async (pass) => {
    try {
      setSuccessMessage(null);
      setError(null);
      const token = user.token;
      const response = await deleteUser(pass, token);
      setSuccessMessage(response.message || "Tu cuenta ha sido eliminada.");
      setTimeout(() => {
        logout();
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error al eliminar la cuenta:", err);
      const errorMessage =
        err.message || "Ocurrió un error al eliminar tu cuenta.";
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">Cargando configuraciones...</p>
      </div>
    );
  }

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
          {successMessage && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}

          <Routes>
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
              element={<AccountSection onDeleteAccount={handleDeleteAccount} />}
            />
            <Route
              path="/general"
              element={
                <GeneralSettingsSection
                  userSettings={userData} // <-- ¡CAMBIO CLAVE AQUÍ!
                  onUpdateSettings={handleSettingsUpdate}
                />
              }
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
