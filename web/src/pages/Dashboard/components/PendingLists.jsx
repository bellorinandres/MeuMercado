// src/pages/Dashboard/components/PendingLists.jsx
import React from "react";
import DeleteListButton from "./DeleteListButton";
import StartShoppingButton from "./StartShoppingButton"; // ✅ Importa el nuevo componente

/**
 * Componente que muestra la sección de "Listas por comprar".
 * Mapea sobre el array de listas pendientes y renderiza un ListItem para cada una.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {Array<Object>} props.listas - Un array de objetos de listas pendientes.
 * @param {function} props.onDeleteList - Función para iniciar la eliminación de una lista.
 */
export default function PendingLists({ listas, onDeleteList }) {
  console.log("PendingLists props:", listas, onDeleteList);
  return (
    <section className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📝</span> Listas por comprar
      </h2>
      {listas.length > 0 ? (
        <ul className="space-y-4">
          {listas.map((lista) => (
            <li
              key={lista.id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white
                         flex flex-col sm:flex-row justify-between items-start sm:items-center
                         gap-y-3 sm:gap-x-4 transition-all duration-200 hover:shadow-md"
            >
              {/* Contenedor de la información de la lista y el botón de eliminar para desktop */}
              <div className="flex flex-grow flex-col sm:flex-row items-start sm:items-center w-full">
                {/* Botón de eliminar - visible en todas las pantallas, pero su posición cambia */}
                <div className="w-full flex justify-end sm:justify-start sm:mr-4">
                  <DeleteListButton onDelete={() => onDeleteList(lista.id)} />
                </div>

                {/* Información de la lista (nombre, productos, fecha) */}
                <div className="flex-grow text-gray-800 mt-2 sm:mt-0 w-full">
                  <p className="font-semibold text-base sm:text-lg truncate">
                    {lista.titulo}
                  </p>
                  <p className="text-sm text-gray-600">
                    {lista.productos} productos
                    {lista.fechaCreacion && (
                      <span className="block sm:inline sm:ml-2">
                        {" "}
                        | Creada: {lista.fechaCreacion}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Botón "Empezar Compra" - siempre a la derecha en desktop, abajo en mobile */}
              <div className="flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                <StartShoppingButton
                  listId={lista.id}
                  listTitle={lista.titulo}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 p-4 bg-gray-50 rounded-md text-sm sm:text-base">
          No tienes listas pendientes para comprar. ¡Crea una nueva!
        </p>
      )}
    </section>
  );
}
