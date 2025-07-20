// web/src/pages/Dashboard/components/PurchasedLists.jsx
import { Link } from "react-router-dom";

export default function PurchasedLists({ listas }) {
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
                {/* ✅ Mostrar el total del mes aquí */}
                <span className="text-lg font-bold text-blue-700">
                  Total del mes: {formatCurrency(listas[mes].monthlyTotal)}
                </span>
              </div>
              <ul className="space-y-3">
                {/* ✅ Acceder a listas[mes].lists para mapear las listas individuales */}
                {listas[mes].lists.map((lista) => (
                  <li
                    key={lista.id}
                    className="p-3 border border-gray-200 rounded-md bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex-grow text-gray-800">
                      <p className="font-semibold text-lg">{lista.titulo}</p>

                      {lista.totalProductos !== undefined && ( // Asegurarse de que existe
                        <p className="text-sm text-gray-600 mt-1">
                          Productos:{" "}
                          <span className="font-semibold">
                            {lista.totalProductos}
                          </span>
                        </p>
                      )}
                      {/* ✅ Mostrar el total de cada compra aquí */}
                      {lista.totalCosto !== undefined && ( // Asegurarse de que existe
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

                    <Link
                      to={`/list/${lista.id}/details`}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent
                                 text-sm font-medium rounded-md shadow-sm text-white bg-blue-500
                                 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2
                                 focus:ring-blue-500 transition-colors duration-200"
                      aria-label={`Ver detalles de la lista ${lista.titulo}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="-ml-0.5 mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 16l-4-4m0 0l4-4m-4 4h12"
                        />
                      </svg>
                      Ver Detalles
                    </Link>
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
