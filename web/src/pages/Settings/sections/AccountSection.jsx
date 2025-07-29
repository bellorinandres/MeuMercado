// web/src/pages/Settings/components/Account/AccountSection.jsx
import { useState } from "react";

export default function AccountSection() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  // Funciones placeholder para el Viernes
  const handleChangePassword = (currentPassword, newPassword) => {
    alert(
      `Simulando cambio de contraseña: Actual: ${currentPassword}, Nueva: ${newPassword}`
    );
    // Aquí, en el futuro, harías la llamada a la API
    setShowChangePassword(false); // Cierra el formulario
  };

  const handleDeleteAccount = (password) => {
    alert(`Simulando eliminación de cuenta con contraseña: ${password}`);
    // Aquí, en el futuro, harías la llamada a la API
    setShowDeleteAccount(false); // Cierra el modal
  };

  const handleVerifyEmail = () => {
    alert("Simulando envío de correo de verificación (solo frontend).");
    // Aquí, en el futuro, harías la llamada a la API
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cuenta</h2>

      <div className="space-y-6">
        {/* Sección para cambiar contraseña */}
        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Cambiar Contraseña
          </h3>
          <p className="text-gray-600 mb-4">
            Actualiza tu contraseña para mantener tu cuenta segura.
          </p>
          <button
            onClick={() => setShowChangePassword(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Cambiar Contraseña
          </button>
          {showChangePassword && (
            <ChangePasswordForm
              onSubmit={handleChangePassword}
              onCancel={() => setShowChangePassword(false)}
            />
          )}
        </div>

        {/* Sección para verificar correo */}
        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Verificar Correo Electrónico
          </h3>
          <p className="text-gray-600 mb-4">
            Verifica tu email para una mayor seguridad y acceso a todas las
            funciones.
          </p>
          <button
            onClick={handleVerifyEmail}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Enviar Correo de Verificación
          </button>
        </div>

        {/* Sección para Eliminar Cuenta */}
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
              onSubmit={handleDeleteAccount}
              onCancel={() => setShowDeleteAccount(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
