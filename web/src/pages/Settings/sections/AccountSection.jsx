// web/src/pages/Settings/components/Account/AccountSection.jsx
import { useState } from "react";
import DeleteAccountConfirmation from "./components/DeleteAccountConfirmation";

export default function AccountSection({ onDeleteAccount }) {
  // Acepta el prop onDeleteAccount
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const DevelopmentBadge = () => (
    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
      En desarrollo
    </span>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cuenta</h2>

      <div className="space-y-6">
        {/* Sección para cambiar contraseña: Deshabilitada */}
        <div className="border border-gray-200 rounded-md p-4 opacity-50 cursor-not-allowed">
          <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
            Cambiar Contraseña
            <DevelopmentBadge />
          </h3>
          <p className="text-gray-600 mb-4">
            Actualiza tu contraseña para mantener tu cuenta segura.
          </p>
          <button
            onClick={() => setShowChangePassword(true)}
            disabled
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-400"
          >
            Cambiar Contraseña
          </button>
          {showChangePassword && (
            <ChangePasswordForm
              onSubmit={() => {}} // Lógica de cambio de contraseña pendiente
              onCancel={() => setShowChangePassword(false)}
            />
          )}
        </div>

        {/* Sección para verificar correo: Deshabilitada */}
        <div className="border border-gray-200 rounded-md p-4 opacity-50 cursor-not-allowed">
          <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
            Verificar Correo Electrónico
            <DevelopmentBadge />
          </h3>
          <p className="text-gray-600 mb-4">
            Verifica tu email para una mayor seguridad y acceso a todas las
            funciones.
          </p>
          <button
            onClick={() => {}}
            disabled
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            Enviar Correo de Verificación
          </button>
        </div>

        {/* Sección para Eliminar Cuenta: Activa */}
        <div className="border border-red-200 bg-red-50 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Eliminar Cuenta
          </h3>
          <p className="text-red-600 mb-4">
            Esta acción es irreversible y eliminará todos tus datos.
          </p>
          <button
            onClick={() => setShowDeleteAccount(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Eliminar Mi Cuenta
          </button>
          {showDeleteAccount && (
            <DeleteAccountConfirmation
              onSubmit={onDeleteAccount} // <-- Aquí pasamos el prop directamente
              onCancel={() => setShowDeleteAccount(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
