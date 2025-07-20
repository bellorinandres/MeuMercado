// src/pages/ShoppingList/components/DeleteListButton.jsx


/**
 * Componente de botón para eliminar una lista.
 * @param {Object} props - Las propiedades del componente.
 * @param {function} props.onDelete - La función que se ejecutará cuando se haga clic en el botón.
 * @param {boolean} [props.disabled=false] - Indica si el botón debe estar deshabilitado.
 */
export default function DeleteListButton({ onDelete, disabled = false }) {
  
  return (
    <button
      onClick={onDelete}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center // Añadido justify-center para centrar el icono
        p-2 // Reduced padding to make it more compact
        border border-transparent 
        text-sm font-medium rounded-md shadow-sm text-white 
        bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-red-500
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
      aria-label="Eliminar lista de compras"
      title="Eliminar esta lista de compras" // El title es importante para accesibilidad
    >
      {/* Icono de papelera (Trash can) */}
      <svg
        className="h-5 w-5" // Quitamos -ml-1 y mr-2
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}