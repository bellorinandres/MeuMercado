// web/src/pages/Dashboard/components/ViewDetailsButton.jsx
import { Link } from "react-router-dom";

/**
 * Componente de botón para ver los detalles de una lista.
 * Navega a la ruta `/list/:listId/details`.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.listId - El ID de la lista a la que se debe navegar.
 * @param {string} props.listTitle - El título de la lista para el aria-label.
 */
export default function ViewDetailsButton({ listId, listTitle }) {
  const buttonText = "Ver Detalhes"; // Texto directo en portugués
  const ariaLabelText = `Ver detalhes da lista ${listTitle}`; // Texto directo en portugués

  return (
    <Link
      to={`/list/${listId}/details`}
      className="inline-flex items-center px-3 py-1.5 border border-transparent
                 text-sm font-medium rounded-md shadow-sm text-white bg-blue-500
                 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2
                 focus:ring-blue-500 transition-colors duration-200"
      aria-label={ariaLabelText}
    >
      {buttonText}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        // CAMBIO AQUÍ: -ml-0.5 cambiado a ml-1 (o ml-0.5 si prefieres menos espacio)
        className="ml-1 h-4 w-4" // Eliminado -ml-0.5 y añadido ml-1 para espacio entre texto y SVG
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </Link>
  );
}
