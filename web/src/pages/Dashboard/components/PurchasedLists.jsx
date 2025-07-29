// web/src/pages/Dashboard/components/PurchasedLists.jsx
import ViewDetailsButton from "../components/ViewDetailsButton";
import DeleteListButton from "./DeleteListButton";

export default function PurchasedLists({ listas, onDeleteList }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const sortedMonths = Object.keys(listas).sort((a, b) => {
    // Asegurarse de que los meses estén ordenados correctamente
    const dateA = new Date(a.replace(/(\w+)\s(\d{4})/, "$1 1, $2"));
    const dateB = new Date(b.replace(/(\w+)\s(\d{4})/, "$1 1, $2"));
    return dateB - dateA; // Para ordenar de más nuevo a más viejo
  });

  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📦</span> Listas compradas
      </h2>

      {sortedMonths.length > 0 ? (
        <div className="space-y-6">
          {sortedMonths.map((mes) => (
            <div key={mes} className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-xl text-gray-700">{mes}</h3>
                <span className="text-lg font-bold text-blue-700">
                  Total del mes: {formatCurrency(listas[mes].monthlyTotal)}
                </span>
              </div>
              <ul className="space-y-3">
                {listas[mes].lists.map((lista) => (
                  <li
                    key={lista.id}
                    className="p-3 border border-gray-200 rounded-md bg-white
                               flex flex-col sm:flex-row justify-between items-start sm:items-center
                               gap-y-3 sm:gap-x-4 transition-all duration-200 hover:shadow-md"
                  >
                    {/* Información de la lista */}
                    <div className="flex-grow text-gray-800 w-full">
                      <p className="font-semibold text-lg">{lista.titulo}</p>
                      {lista.totalProductos !== undefined && (
                        <p className="text-sm text-gray-600 mt-1">
                          Productos:{" "}
                          <span className="font-semibold">
                            {lista.totalProductos}
                          </span>
                        </p>
                      )}
                      {lista.totalCosto !== undefined && (
                        <p className="text-sm text-gray-600">
                          Costo Total:{" "}
                          <span className="font-semibold text-green-700">
                            {formatCurrency(lista.totalCosto)}
                          </span>
                        </p>
                      )}
                      {lista.fechaCompra && (
                        <p className="text-xs text-gray-500 mt-1">
                          Fecha de compra: {lista.fechaCompra}
                        </p>
                      )}
                    </div>

                    {/* Contenedor para ambos botones: Eliminar (izquierda 30%) y Ver Detalles (derecha 70%) */}
                    {/* Uniformidad con PendingLists: siempre flex-row, anchos fijos en móvil */}
                    <div className="flex flex-row items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                      {/* Botón de eliminar - 30% de ancho en móvil, se vuelve 'auto' en sm */}
                      <div className="w-3/10 sm:w-auto">
                        <DeleteListButton
                          onDelete={() => onDeleteList(lista.id)}
                        />
                      </div>
                      {/* Botón "Ver Detalles" - 70% de ancho en móvil, se vuelve 'auto' en sm */}
                      <div className="w-7/10 sm:w-auto">
                        <ViewDetailsButton
                          listId={lista.id}
                          listTitle={lista.titulo}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 p-4 bg-gray-50 rounded-md">
          No tienes listas compradas aún.
        </p>
      )}
    </section>
  );
}
