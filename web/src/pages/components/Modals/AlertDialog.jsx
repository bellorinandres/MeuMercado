// src/components/Modals/AlertDialog.jsx
import React from "react";

/**
 * Componente Modal de Alerta genérico (éxito o error).
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} props.show - Si el modal debe ser visible.
 * @param {string} props.title - El título del modal.
 * @param {string} props.message - El mensaje de la alerta.
 * @param {function} props.onClose - Función a ejecutar cuando el usuario cierra el modal.
 * @param {string} [props.type="info"] - Tipo de alerta ('success', 'error', 'info').
 */
export default function AlertDialog({
  show,
  title,
  message,
  onClose,
  type = "info",
}) {
  if (!show) {
    return null;
  }

  const titleColorClass =
    type === "success"
      ? "text-green-600"
      : type === "error"
      ? "text-red-600"
      : "text-blue-600";
  const buttonColorClass =
    type === "success"
      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
      : type === "error"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto text-center">
        <h3 className={`text-xl font-bold mb-3 ${titleColorClass}`}>{title}</h3>
        <p className="text-base text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`px-6 py-2 text-base font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonColorClass}`}
        >
          Ok
        </button>
      </div>
    </div>
  );
}
