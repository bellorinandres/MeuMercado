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
  // Contexto de autenticación para obtener el usuario y la función de logout
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados principales para la data y el UI
  const [pendingLists, setPendingLists] = useState([]);
  const [purchasedListsByMonth, setPurchasedListsByMonth] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el modal de confirmación de eliminación
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [listToDeleteId, setListToDeleteId] = useState(null);

  // Estados para el modal de alerta (éxito/error/info)
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertDialogType, setAlertDialogType] = useState("info");
  const [alertDialogMessage, setAlertDialogMessage] = useState("");
  const [alertDialogTitle, setAlertDialogTitle] = useState("");

  // --- Funciones Auxiliares ---

  /**
   * Formatea una cadena de fecha a un string de mes y año (ej: "julio 2025").
   * @param {string} dateString - La fecha en formato string.
   * @returns {string} Fecha formateada o "Fecha desconocida".
   */
  const formatDateToMonthYear = (dateString) => {
    if (!dateString) return "Fecha desconocida";
    const date = new Date(dateString);
    const options = { year: "numeric", month: "long" };
    return date.toLocaleDateString("es-ES", options);
  };

  /**
   * Carga y procesa todas las listas (pendientes y compradas) del usuario.
   * Utiliza useCallback para memorizar la función y evitar recargas innecesarias.
   */
  const loadLists = useCallback(async () => {
    try {
      setIsLoading(true); // Inicia el estado de carga
      setError(null); // Limpia cualquier error previo

      // Redirige al login si el usuario no está autenticado
      if (!user?.id || !user?.token) {
        navigate("/login");
        return;
      }

      // Obtiene todas las listas del backend
      const data = await fetchAllListsByUserId(user.id, user.token);

      // --- Procesamiento de Listas Pendientes ---
      const loadedPendingLists = data.pending.map((list) => ({
        id: list.id_list,
        titulo: list.name_list,
        // product_count ya viene del backend gracias a la corrección SQL
        productos: list.product_count,
        fechaCreacion: list.created_at.split("T")[0],
      }));
      setPendingLists(loadedPendingLists);

      // --- Procesamiento y Agrupación de Listas Compradas ---
      const rawPurchasedLists = data.purchased;

      const groupedPurchasedLists = rawPurchasedLists.reduce((acc, list) => {
        const monthYear = formatDateToMonthYear(list.purchased_at);

        if (!acc[monthYear]) {
          acc[monthYear] = {
            lists: [], // Array para las listas de este mes
            monthlyTotal: 0, // Inicializa el total mensual
          };
        }

        const listTotalCost = parseFloat(list.total_cost || 0); // Asegura que sea un número

        acc[monthYear].lists.push({
          id: list.id_list,
          titulo: list.name_list,
          totalProductos: list.total_products,
          totalCosto: listTotalCost,
          fechaCompra: list.purchased_at
            ? new Date(list.purchased_at).toLocaleDateString("es-ES")
            : "N/A",
        });

        acc[monthYear].monthlyTotal += listTotalCost; // Suma al total mensual
        return acc;
      }, {});

      // Ordena los meses para que el más reciente aparezca primero
      const sortedMonths = Object.keys(groupedPurchasedLists).sort((a, b) => {
        const dateA = new Date(a.replace(/(\w+)\s(\d{4})/, "$1 1, $2"));
        const dateB = new Date(b.replace(/(\w+)\s(\d{4})/, "$1 1, $2"));
        return dateB - dateA;
      });

      // Construye el objeto final de listas compradas ordenadas por mes
      const orderedPurchasedLists = {};
      sortedMonths.forEach((month) => {
        orderedPurchasedLists[month] = groupedPurchasedLists[month];
      });

      setPurchasedListsByMonth(orderedPurchasedLists);
    } catch (err) {
      // Manejo de errores durante la carga de listas
      setError("Error al cargar tus listas. Por favor, inténtalo de nuevo.");
      if (err.message.includes("401") || err.message.includes("403")) {
        // Si el error es de autenticación, cierra sesión y redirige
        logout();
        navigate("/login");
      }
    } finally {
      setIsLoading(false); // Finaliza el estado de carga
    }
  }, [user, navigate, logout]); // Dependencias para useCallback

  // --- Funciones de Manejo de Eventos y Modales ---

  /**
   * Inicia el proceso de eliminación de una lista, abriendo el modal de confirmación.
   * @param {string} listId - El ID de la lista a eliminar.
   */
  const handleInitiateDelete = (listId) => {
    setListToDeleteId(listId); // Guarda el ID de la lista
    setShowConfirmDeleteModal(true); // Muestra el modal de confirmación
  };

  /**
   * Cancela la operación de eliminación y cierra el modal de confirmación.
   */
  const handleCancelDelete = () => {
    setShowConfirmDeleteModal(false);
    setListToDeleteId(null); // Limpia el ID guardado
  };

  /**
   * Ejecuta la eliminación de la lista después de la confirmación del usuario.
   * Utiliza useCallback para memorizar la función.
   */
  const handleConfirmDelete = useCallback(async () => {
    setShowConfirmDeleteModal(false); // Cierra el modal de confirmación
    if (!listToDeleteId) return; // Asegura que haya un ID para eliminar

    try {
      setIsLoading(true); // Inicia la carga
      setError(null); // Limpia errores previos

      if (!user?.token) {
        throw new Error("Token de usuario no disponible para eliminar.");
      }

      await deleteList(listToDeleteId, user.token); // Llama al servicio de eliminación
      await loadLists(); // Recarga las listas para actualizar la UI

      // Muestra un mensaje de éxito
      setAlertDialogType("success");
      setAlertDialogTitle("¡Éxito!");
      setAlertDialogMessage("Lista eliminada con éxito.");
      setShowAlertDialog(true);
    } catch (err) {
      // Manejo de errores durante la eliminación
      let errorMessage =
        "Error al eliminar la lista. Por favor, inténtalo de nuevo.";
      if (err.message.includes("404")) {
        errorMessage = "La lista no fue encontrada o ya ha sido eliminada.";
      } else if (err.message.includes("productos asociados")) {
        errorMessage =
          "No se puede eliminar la lista porque tiene productos asociados. Elimina primero los productos de la lista.";
      } else if (err.message.includes("401") || err.message.includes("403")) {
        errorMessage =
          "Tu sesión ha expirado o no tienes permiso. Por favor, inicia sesión de nuevo.";
        logout(); // Cierra sesión en caso de error de autenticación
        navigate("/login"); // Redirige al login
      }

      // Muestra un mensaje de error
      setAlertDialogType("error");
      setAlertDialogTitle("Error");
      setAlertDialogMessage(errorMessage);
      setShowAlertDialog(true);
      setError(errorMessage); // También actualiza el estado de error principal
    } finally {
      setIsLoading(false); // Finaliza la carga
      setListToDeleteId(null); // Limpia el ID de la lista
    }
  }, [listToDeleteId, user, loadLists, logout, navigate]); // Dependencias

  /**
   * Cierra el modal de alerta y reinicia sus estados.
   */
  const handleCloseAlertDialog = () => {
    setShowAlertDialog(false);
    setAlertDialogMessage("");
    setAlertDialogTitle("");
    setAlertDialogType("info"); // Reinicia a tipo 'info' por defecto
  };

  /**
   * Maneja el cierre de sesión del usuario.
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // --- Efectos de Carga de Datos ---

  // Efecto para cargar las listas al montar el componente o cuando 'loadLists' cambia
  useEffect(() => {
    loadLists();
  }, [loadLists]);

  // --- Renderizado Condicional ---

  // Muestra un componente de carga si isLoading es true
  if (isLoading) {
    return <IsLoading />;
  }

  // Muestra un mensaje de error si hay un error y no está cargando
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <p className="text-red-600 font-medium mb-3">
            ¡Oops! Algo salió mal.
          </p>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()} // Permite al usuario reintentar la carga
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // --- Renderizado Principal del Dashboard ---
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl mx-auto space-y-8">
        <DashboardHeader user={user} onLogout={handleLogout} />
        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PendingLists
            listas={pendingLists}
            onDeleteList={handleInitiateDelete}
          />
          <PurchasedLists
            listas={purchasedListsByMonth}
            onDeleteList={handleInitiateDelete}
          />
        </main>
        <div className="flex justify-center md:justify-end mt-8">
          <NewListButton />
        </div>
      </div>
      {/* Modales de Confirmación y Alerta */}
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
