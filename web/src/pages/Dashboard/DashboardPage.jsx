import { useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PendingLists from "./components/PendingLists";
import PurchasedLists from "./components/PurchasedLists";
import DashboardHeader from "./components/DashboardHeader";
import NewListButton from "./components/NewListButton";
import { AuthContext } from "../../context/AuthContext";
import IsLoading from "./components/IsLoading";
import { deleteList, fetchAllListsByUserId } from "./listServices";
import ConfirmModal from "../components/Modals/ConfirmModal";
import AlertDialog from "../components/Modals/AlertDialog";

export default function DashboardPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [pendingLists, setPendingLists] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Estados para los modales
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [listToDeleteId, setListToDeleteId] = useState(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertDialogType, setAlertDialogType] = useState("info");
  const [alertDialogMessage, setAlertDialogMessage] = useState("");
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [purchasedListsByMonth, setPurchasedListsByMonth] = useState({}); // ✅ Renombrado y tipo de estado

  // Helper para formatear la fecha a un string de mes y año
  const formatDateToMonthYear = (dateString) => {
    if (!dateString) return "Fecha desconocida";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString("es-ES", options);
  };

  const loadLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.id || !user?.token) {
        console.warn(
          "Usuario no autenticado o token ausente. Redirigiendo a login."
        );
        navigate("/login");
        return;
      }

      const data = await fetchAllListsByUserId(user.id, user.token);

      // Procesamiento de listas pendientes (sin cambios)|
      const loadedPendingLists = data.pending.map((list) => ({
        id: list.id_list,
        titulo: list.name_list,
        productos: list.product_count,
        fechaCreacion: list.created_at.split("T")[0],
      }));
      setPendingLists(loadedPendingLists);

      // ✅ PROCESAR, AGRUPAR Y CALCULAR TOTALES PARA LAS LISTAS COMPRADAS
      const rawPurchasedLists = data.purchased;

      const groupedPurchasedLists = rawPurchasedLists.reduce((acc, list) => {
        const monthYear = formatDateToMonthYear(list.purchased_at);

        if (!acc[monthYear]) {
          acc[monthYear] = {
            lists: [], // Array para las listas de este mes
            monthlyTotal: 0, // ✅ Inicializa el total mensual
          };
        }

        const listTotalCost = parseFloat(list.total_cost || 0); // Asegura que sea un número

        acc[monthYear].lists.push({
          id: list.id_list,
          titulo: list.name_list,
          totalProductos: list.total_products,
          totalCosto: listTotalCost, // Ya es un número aquí
          fechaCompra: list.purchased_at
            ? new Date(list.purchased_at).toLocaleDateString("es-ES")
            : "N/A",
        });

        acc[monthYear].monthlyTotal += listTotalCost; // ✅ Suma al total mensual

        return acc;
      }, {});

      // Ordenar los meses para que el más reciente aparezca primero
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
      console.error("Failed to fetch lists:", err);
      if (err.message.includes("401") || err.message.includes("403")) {
        logout();
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate, logout]);

  // Efecto para cargar las listas al montar el componente o cambiar el usuario
  useEffect(() => {
    loadLists();
  }, [loadLists]); // Depende de loadLists, que es un useCallback

  // ✅ Función que se llama cuando se hace clic en el botón de eliminar de una lista
  const handleInitiateDelete = (listId) => {
    setListToDeleteId(listId); // Guarda el ID de la lista a eliminar
    setShowConfirmDeleteModal(true); // Abre el modal de confirmación
  };

  // ✅ Función para cerrar el modal de confirmación
  const handleCancelDelete = () => {
    setShowConfirmDeleteModal(false);
    setListToDeleteId(null);
  };

  // ✅ Función para confirmar la eliminación (ejecuta la lógica real)
  const handleConfirmDelete = useCallback(async () => {
    setShowConfirmDeleteModal(false); // Cierra el modal de confirmación inmediatamente
    if (!listToDeleteId) return;

    try {
      setIsLoading(true);
      setError(null);

      if (!user?.token) {
        throw new Error("Token de usuario no disponible para eliminar.");
      }

      await deleteList(listToDeleteId, user.token);
      await loadLists(); // Recarga las listas para reflejar el cambio

      setAlertDialogType("success");
      setAlertDialogTitle("¡Éxito!");
      setAlertDialogMessage("Lista eliminada con éxito.");
      setShowAlertDialog(true); // Muestra el modal de éxito
    } catch (err) {
      console.error("Failed to delete list:", err);
      let errorMessage =
        "Error al eliminar la lista. Por favor, inténtalo de nuevo.";
      if (err.message.includes("404")) {
        errorMessage = "La lista no fue encontrada o ya ha sido eliminada.";
      } else if (
        err.message.includes(
          "No se puede eliminar la lista porque tiene productos asociados."
        )
      ) {
        errorMessage =
          "No se puede eliminar la lista porque tiene productos asociados. Elimina primero los productos de la lista.";
      } else if (err.message.includes("401") || err.message.includes("403")) {
        errorMessage =
          "Tu sesión ha expirado o no tienes permiso. Por favor, inicia sesión de nuevo.";
        logout();
        navigate("/login");
      }

      setAlertDialogType("error");
      setAlertDialogTitle("Error");
      setAlertDialogMessage(errorMessage);
      setShowAlertDialog(true); // Muestra el modal de error
      setError(errorMessage); // También puedes mantener el estado de error para otros usos si quieres
    } finally {
      setIsLoading(false);
      setListToDeleteId(null); // Limpia el ID de la lista después de la operación
    }
  }, [listToDeleteId, user, loadLists, logout, navigate]); // Dependencias

  const handleCloseAlertDialog = () => {
    setShowAlertDialog(false);
    setAlertDialogMessage("");
    setAlertDialogTitle("");
    setAlertDialogType("info"); // Reinicia el tipo
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Render de estados especiales
  if (isLoading) {
    return <IsLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <p className="text-red-600 font-medium mb-3">
            ¡Oops! Algo salió mal.
          </p>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <DashboardHeader user={user} onLogout={handleLogout} />
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PendingLists
            listas={pendingLists}
            onDeleteList={handleInitiateDelete}
          />
          <PurchasedLists listas={purchasedListsByMonth} />
        </main>
        <div className="flex justify-center md:justify-end mt-8">
          <NewListButton />
        </div>
      </div>
      {/* ✅ Modales */}
      <ConfirmModal
        show={showConfirmDeleteModal}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar esta lista? Esta acción es irreversible y también eliminará todos los productos asociados."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <AlertDialog
        show={showAlertDialog}
        title={alertDialogTitle}
        message={alertDialogMessage}
        onClose={handleCloseAlertDialog}
        type={alertDialogType}
      />
    </div>
  );
}
