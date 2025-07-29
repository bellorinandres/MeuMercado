// src/pages/Dashboard/components/PendingLists.jsx
import DeleteListButton from "./DeleteListButton";
import StartShoppingButton from "./StartShoppingButton";

export default function PendingLists({ listas, onDeleteList }) {
  // console.log("PendingLists props:", listas, onDeleteList);

  return (
    <section className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📝</span> Listas por comprar
      </h2>
      {listas.length > 0 ? (
        <ul className="space-y-4">
          {listas.map((lista) => {
            return (
              <li
                key={lista.id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white
                         flex flex-col sm:flex-row justify-between items-start sm:items-center
                         gap-y-3 sm:gap-x-4 transition-all duration-200 hover:shadow-md"
              >
                {/* Información de la lista (nombre, productos, fecha) */}
                <div className="flex-grow text-gray-800 w-full">
                  <p className="font-semibold text-base sm:text-lg truncate">
                    {lista.titulo}
                  </p>
                  <p className="text-sm text-gray-600">
                    {lista.productos} productos
                    {lista.fechaCreacion && (
                      <span className="block sm:inline sm:ml-2">
                        {" "}
                        Creada en: {lista.fechaCreacion}
                      </span>
                    )}
                  </p>
                </div>

                {/* Contenedor para ambos botones: Borrar (30%) y Empezar Compra (70%) */}
                {/* Se invierte el orden de los div internos */}
                <div className="flex flex-row items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                  {/* Botón de eliminar - 30% de ancho en móvil, se vuelve 'auto' en sm */}
                  <div className="w-3/10 sm:w-auto">
                    <DeleteListButton onDelete={() => onDeleteList(lista.id)} />
                  </div>

                  {/* Botón "Empezar Compra" - 70% de ancho en móvil, se vuelve 'auto' en sm */}
                  <div className="w-7/10 sm:w-auto">
                    <StartShoppingButton
                      listId={lista.id}
                      listTitle={lista.titulo}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 p-4 bg-gray-50 rounded-md text-sm sm:text-base">
          No tienes listas pendientes para comprar. ¡Crea una nueva!
        </p>
      )}
    </section>
  );
}
