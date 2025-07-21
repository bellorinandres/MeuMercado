// src/pages/Dashboard/components/StartShoppingButton.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Componente de botón para iniciar la compra de una lista.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.listId - El ID de la lista a la que se enlaza el botón.
 * @param {string} props.listTitle - El título de la lista, usado para el aria-label.
 */
export default function StartShoppingButton({ listId, listTitle }) {
  return (
    <Link
      to={`/list/${listId}/purchase`}
      className="inline-flex items-center px-4 py-2 border border-transparent
                 text-sm font-medium rounded-md shadow-sm text-white bg-green-600
                 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                 focus:ring-green-500 transition-colors duration-200"
      aria-label={`Iniciar la compra de la lista ${listTitle}`}
    >
      {/* Ícono de carrito de compras */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="-ml-1 mr-2 h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      Iniciar Compra
    </Link>
  );
}
