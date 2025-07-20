// web/src/pages/CreateList/components/AddItemForm.jsx
import { useState } from "react";

export default function AddItemForm({ onAddItem }) {
  const [newItemName, setNewItemName] = useState("");

  const handleNewItemNameChange = (event) => {
    setNewItemName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página
    if (newItemName.trim() !== "") {
      onAddItem(newItemName); // Llama a la función pasada desde el padre
      setNewItemName(""); // Limpia el input
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={newItemName}
        onChange={handleNewItemNameChange}
        placeholder="Agregar nuevo ítem..."
      />
      <button
        type="submit" // Cambiado a type="submit" para que funcione con el formulario
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Agregar
      </button>
    </form>
  );
}
