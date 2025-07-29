import { formatDateToMonthYear } from "../../../utils/dateUtils";

/**
 * Procesa listas pendientes a un formato consumible por el componente.
 */
export function mapPendingLists(pendingRaw) {
  return pendingRaw.map((list) => ({
    id: list.id_list,
    titulo: list.name_list,
    productos: list.product_count,
    fechaCreacion: list.created_at.split("T")[0],
  }));
}

/**
 * Agrupa listas compradas por mes y año, ordena de más reciente a más antiguo.
 */
export function groupAndSortPurchasedLists(purchasedRaw) {
  const grouped = purchasedRaw.reduce((acc, list) => {
    const monthYear = formatDateToMonthYear(list.purchased_at);

    if (!acc[monthYear]) {
      acc[monthYear] = { lists: [], monthlyTotal: 0 };
    }

    const listTotalCost = parseFloat(list.total_cost || 0);

    acc[monthYear].lists.push({
      id: list.id_list,
      titulo: list.name_list,
      totalProductos: list.total_products,
      totalCosto: listTotalCost,
      fechaCompra: list.purchased_at
        ? new Date(list.purchased_at).toLocaleDateString("es-ES")
        : "N/A",
    });

    acc[monthYear].monthlyTotal += listTotalCost;
    return acc;
  }, {});

  // Ordenar meses de más reciente a más antiguo
  const sortedMonths = Object.keys(grouped).sort((a, b) => {
    const dateA = new Date(a.replace(/(\w+)\s(\d{4})/, "$1 1, $2"));
    const dateB = new Date(b.replace(/(\w+)\s(\d{4})/, "$1 1, $2"));
    return dateB - dateA;
  });

  const ordered = {};
  sortedMonths.forEach((month) => {
    ordered[month] = grouped[month];
  });

  return ordered;
}
