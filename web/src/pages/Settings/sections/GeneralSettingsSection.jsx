// web/src/pages/Settings/components/GeneralSettingsSection.jsx

import { useState, useEffect } from "react";

export default function GeneralSettingsSection({
  userSettings, // Aquí userSettings será el objeto userData completo
  onUpdateSettings,
}) {
  const [currentSettings, setCurrentSettings] = useState({
    language: "es",
    currency: "USD",
  });

  // Sincronizar el estado interno con las props iniciales del padre
  useEffect(() => {
    if (userSettings) {
      // Accede directamente a userSettings.language y userSettings.currency
      setCurrentSettings({
        language: userSettings.settings.language || "es",
        currency: userSettings.settings.currency || "USD",
      });
    }
  }, [userSettings]);

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    const newSettings = { ...currentSettings, [name]: value };
    setCurrentSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Configuraciones Generales
      </h2>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Idioma
          </label>
          <select
            id="language"
            name="language"
            value={currentSettings.language}
            onChange={handleSettingsChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tipo de Moneda
          </label>
          <select
            id="currency"
            name="currency"
            value={currentSettings.currency}
            onChange={handleSettingsChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="USD">Dólar Americano (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="BRL">Real Brasileño (BRL)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
