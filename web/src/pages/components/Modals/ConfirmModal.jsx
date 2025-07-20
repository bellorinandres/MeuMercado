// src/components/Modals/ConfirmModal.jsx
import React from "react";

/**
 * Componente Modal de Confirmación genérico.
 * @param {Object} props - Las propiedades del componente.
 * @param {boolean} props.show - Si el modal debe ser visible.
 * @param {string} props.title - El título del modal.
 * @param {string} props.message - El mensaje de confirmación.
 * @param {function} props.onConfirm - Función a ejecutar cuando el usuario confirma.
 * @param {function} props.onCancel - Función a ejecutar cuando el usuario cancela.
 * @param {string} [props.confirmText="Confirmar"] - Texto del botón de confirmación.
 * @param {string} [props.cancelText="Cancelar"] - Texto del botón de cancelación.
 * @param {string} [props.confirmButtonClass="bg-red-600 hover:bg-red-700"] - Clases Tailwind para el botón de confirmación.
 */
export default function ConfirmModal({
  show,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Eliminar", // Por defecto para la eliminación
  cancelText = "Cancelar",
  confirmButtonClass = "bg-red-600 hover:bg-red-700 focus:ring-red-500", // Estilo por defecto para botón de eliminar
}) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
        <p className="text-sm text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
