import { useState, useCallback } from "react";
import { fetchAllListsByUserId, deleteList } from "../listServices";
import { useNavigate } from "react-router-dom";
import { formatDateToMonthYear } from "../../../../utils/dateUtils";

export function useLists(user, logout) {
  const navigate = useNavigate();

  const [pendingLists, setPendingLists] = useState([]);
  const [purchasedListsByMonth, setPurchasedListsByMonth] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.id || !user?.token) {
        navigate("/login");
        return;
      }

      const data = await fetchAllListsByUserId(user.id, user.token);

      const loadedPendingLists = data.pending.map((list) => ({
        id: list.id_list,
        titulo: list.name_list,
        productos: list.product_count,
        fechaCreacion: list.created_at.split("T")[0],
      }));

      setPendingLists(loadedPendingLists);

      const rawPurchasedLists = data.purchased;

      const groupedPurchasedLists = rawPurchasedLists.reduce((acc, list) => {
        const monthYear = formatDateToMonthYear(list.purchased_at);

        if (!acc[monthYear]) {
          acc[monthYear] = {
            lists: [],
            monthlyTotal: 0,
          };
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

      const sortedMonths = Object.keys(groupedPurchasedLists).sort((a, b) => {
        const dateA = new Date(a.replace(/(\w+)\s(\d{4})/, "$1 1, $2"));
        const dateB = new Date(b.replace(/(\w+)\s(\d{4})/, "$1 1, $2"));
        return dateB - dateA;
      });

      const orderedPurchasedLists = {};
      sortedMonths.forEach((month) => {
        orderedPurchasedLists[month] = groupedPurchasedLists[month];
      });

      setPurchasedListsByMonth(orderedPurchasedLists);
    } catch (err) {
      setError("Error al cargar tus listas. Por favor, inténtalo de nuevo.");
      if (err.message.includes("401") || err.message.includes("403")) {
        logout();
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate, logout]);

  const handleDeleteList = useCallback(
    async (listId) => {
      try {
        if (!user?.token) throw new Error("Token de usuario no disponible.");
        setIsLoading(true);
        setError(null);

        await deleteList(listId, user.token);
        await loadLists();

        return { success: true, message: "Lista eliminada con éxito." };
      } catch (err) {
        let message =
          "Error al eliminar la lista. Por favor, inténtalo de nuevo.";
        if (err.message.includes("404")) {
          message = "La lista no fue encontrada o ya ha sido eliminada.";
        } else if (err.message.includes("productos asociados")) {
          message =
            "No se puede eliminar la lista porque tiene productos asociados. Elimina primero los productos.";
        } else if (err.message.includes("401") || err.message.includes("403")) {
          message =
            "Tu sesión ha expirado o no tienes permiso. Por favor, inicia sesión de nuevo.";
          logout();
          navigate("/login");
        }
        setError(message);
        return { success: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    [user, loadLists, logout, navigate]
  );

  return {
    pendingLists,
    purchasedListsByMonth,
    isLoading,
    error,
    loadLists,
    handleDeleteList,
    setError,
  };
}
