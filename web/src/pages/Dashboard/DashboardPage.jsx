import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PendingLists from "./components/PendingLists";
import PurchasedLists from "./components/PurchasedLists";
import DashboardHeader from "./components/DashboardHeader";
import NewListButton from "./components/NewListButton";
import { AuthContext } from "../../context/AuthContext";
import IsLoading from "./components/IsLoading";
import ConfirmModal from "../components/Modals/ConfirmModal";
import AlertDialog from "../components/Modals/AlertDialog";
import { useLists } from "../Dashboard/hooks/useList";

export default function DashboardPage() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    pendingLists,
    purchasedListsByMonth,
    isLoading,
    error,
    loadLists, // <-- Importante para cargar las listas
    handleDeleteList,
  } = useLists(user, logout);

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [listToDeleteId, setListToDeleteId] = useState(null);

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertDialogType, setAlertDialogType] = useState("info");
  const [alertDialogMessage, setAlertDialogMessage] = useState("");
  const [alertDialogTitle, setAlertDialogTitle] = useState("");

  // Llama loadLists cuando el componente se monta
  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const handleInitiateDelete = (listId) => {
    setListToDeleteId(listId);
    setShowConfirmDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmDeleteModal(false);
    setListToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDeleteModal(false);
    if (!listToDeleteId) return;

    const result = await handleDeleteList(listToDeleteId);

    setAlertDialogType(result.success ? "success" : "error");
    setAlertDialogTitle(result.success ? "¡Éxito!" : "Error");
    setAlertDialogMessage(result.message);
    setShowAlertDialog(true);

    setListToDeleteId(null);
  };

  const handleCloseAlertDialog = () => {
    setShowAlertDialog(false);
    setAlertDialogMessage("");
    setAlertDialogTitle("");
    setAlertDialogType("info");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
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
          <PurchasedLists
            listas={purchasedListsByMonth}
            onDeleteList={handleInitiateDelete}
          />
        </main>
        <div className="flex justify-center md:justify-end mt-8">
          <NewListButton />
        </div>
      </div>
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
