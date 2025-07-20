// web/src/pages/CreateList/CreateList.jsx
import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// ✅ Importa la función `createList` desde tu CreateListService.js
import { createList } from "./CreateListService"; // ✅ Ruta relativa correcta

// Importa tus componentes
import ListNameInput from "./components/ListNameInput";
import AddItemForm from "./components/AddItemForm";
import ShoppingListItem from "./components/ShoppingListItem";
import SaveListButton from "./components/SaveListButton";
import BackButton from "../components/Buttons/BackButton"; // Ajusta esta ruta si es necesario
import SuccessModal from "../components/Modals/SuccessModal"; // Ajusta esta ruta si es necesario

export default function CreateList() {
  const { user } = useContext(AuthContext);
  const [listName, setListName] = useState("");
  const [items, setItems] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleListNameChange = useCallback((event) => {
    setListName(event.target.value);
  }, []);

  const handleAddItem = useCallback((itemName) => {
    const newItem = {
      id: Date.now(),
      name: itemName,
      quantity: 1,
    };
    setItems((prevItems) => [...prevItems, newItem]);
  }, []);

  const handleIncreaseQuantity = useCallback((id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const handleDecreaseQuantity = useCallback((id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((idToRemove) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== idToRemove));
  }, []);

  const handleCloseSuccessModal = useCallback(() => {
    setShowSuccess(false);
    setListName("");
    setItems([]);
  }, []);

  const handleSaveList = useCallback(async () => {
    if (!listName.trim() || items.length === 0) {
      alert("Ponle nombre a la lista y agrega al menos un producto.");
      return;
    }

    if (!user || !user.token) {
      alert("No estás autenticado. Por favor, inicia sesión.");
      return;
    }

    const payload = {
      // Si tu backend extrae user_id del token, no lo envíes aquí:
      // user_id: user.id,
      name: listName,
      items: items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
    };

    console.log("Payload to save:", payload);
    setIsLoading(true);

    try {
      const responseData = await createList(payload, user.token); // ✅ Llama a la función del servicio
      console.log("Lista creada con éxito:", responseData);
      setSuccessMessage("¡Tu lista de compras ha sido guardada con éxito!");
      setShowSuccess(true);
    } catch (err) {
      console.error("Error al guardar la lista:", err);
      alert("Error: " + (err.message || "No se pudo guardar la lista."));
    } finally {
      setIsLoading(false);
    }
  }, [listName, items, user]);

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <BackButton to="/dashboard" ariaLabel="Regresar al Dashboard" />
          <h1 className="text-2xl font-bold text-gray-800 text-center flex-grow">
            Mi Lista de Compras
          </h1>
          <div className="w-10"></div>
        </div>

        <ListNameInput
          listName={listName}
          onListNameChange={handleListNameChange}
        />

        <AddItemForm onAddItem={handleAddItem} />

        <ul className="space-y-2 mb-4">
          {items.map((item) => (
            <ShoppingListItem
              key={item.id}
              item={item}
              onIncreaseQuantity={handleIncreaseQuantity}
              onDecreaseQuantity={handleDecreaseQuantity}
              onRemoveItem={handleRemoveItem}
            />
          ))}
        </ul>

        <SaveListButton onSaveList={handleSaveList} isLoading={isLoading} />

        <SuccessModal
          show={showSuccess}
          onClose={handleCloseSuccessModal}
          message={successMessage}
        />
      </div>
    </div>
  );
}
