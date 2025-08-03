import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./components/LanguageSelector";

export default function LandingPage() {
  const { t } = useTranslation(); // Ahora también accedemos a 'i18n'
  const appName = "MeuMercado";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-8 sm:p-10 md:p-12 rounded-lg shadow-2xl text-center max-w-lg w-full transform transition-transform duration-500 ease-in-out hover:scale-105 relative">
        {/* Usamos el componente del selector de idioma aquí */}
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 animate-fade-in-down">
          {t("welcome_to")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-700">
            {appName}
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed animate-fade-in-up">
          {t("app_description")}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in">
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1"
            aria-label="Ir a la página de Iniciar Sesión"
          >
            {t("login_button")}
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:-translate-y-1"
            aria-label="Ir a la página de Registro"
          >
            {t("register_button")}
          </Link>
        </div>
      </div>
    </div>
  );
}
