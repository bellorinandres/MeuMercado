// web/src/pages/Settings/components/GeneralSettingsSection.jsx
import React, { useState, useEffect } from "react";

// Recibe userSettings y onUpdateSettings del padre
export default function GeneralSettingsSection({
  userSettings,
  onUpdateSettings,
}) {
  const [language, setLanguage] = useState("es");
  const [currency, setCurrency] = useState("USD");

  // Sincronizar el estado interno con las props iniciales
  useEffect(() => {
    if (userSettings) {
      setLanguage(userSettings.language || "es");
      setCurrency(userSettings.currency || "USD");
    }
  }, [userSettings]);

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    // Notifica al padre (SettingsPage) y simula actualización
    onUpdateSettings({ settings: { ...userSettings, language: newLanguage } });
    alert(`Idioma cambiado a: ${newLanguage} (simulación frontend)`);
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    // Notifica al padre (SettingsPage) y simula actualización
    onUpdateSettings({ settings: { ...userSettings, currency: newCurrency } });
    alert(`Moneda cambiada a: ${newCurrency} (simulación frontend)`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Configuraciones Generales
      </h2>

      <div className="space-y-6">
        {/* Configuración de Idioma */}
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
            value={language}
            onChange={handleLanguageChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>

        {/* Configuración de Moneda */}
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
            value={currency}
            onChange={handleCurrencyChange}
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
