// web/src/pages/components/Modals/AddItemModal.jsx
import { useState, useEffect, useRef } from "react";

export default function AddItemModal({ show, onClose, onAddItem }) {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  // Una referencia para el contenido del modal. Nos ayudará a detectar clics fuera de él.
  const modalContentRef = useRef(null);

  // Efecto para manejar el cierre del modal cuando se hace clic fuera de su contenido.
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el modal está visible y el clic no fue dentro del área del modal, ciérralo.
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    // Añade el "event listener" al documento solo cuando el modal está visible.
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Limpia el "event listener" cuando el componente se desmonta o el modal se cierra,
    // para evitar problemas de rendimiento o comportamientos inesperados.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]); // Este efecto se ejecuta cuando 'show' o 'onClose' cambian.

  // Si 'show' es falso, no renderizamos nada, manteniendo el modal oculto.
  if (!show) {
    return null;
  }

  // Manejador para el botón "Agregar" dentro del modal.
  const handleAddButtonClick = () => {
    // Validación básica: asegura que todos los campos estén llenos.
    if (!productName || !quantity || !price) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    // Llama a la función `onAddItem` que se pasó como prop, enviándole los datos del nuevo ítem.
    onAddItem({
      name: productName,
      quantity: parseFloat(quantity), // Convierte la cantidad a número (permite decimales)
      price: parseFloat(price), // Convierte el precio a número (permite decimales)
    });

    // Limpia los campos del formulario después de agregar el ítem.
    setProductName("");
    setQuantity("");
    setPrice("");
    onClose(); // Cierra el modal automáticamente después de agregar.
  };

  return (
    // Overlay oscuro de fondo que cubre toda la pantalla.
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      {/* Contenido principal del modal (el cuadro blanco con el formulario). */}
      <div
        ref={modalContentRef} // Asociamos la referencia al div del contenido del modal.
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100 opacity-100"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Agregar Nuevo Ítem
        </h2>

        {/* Campo para el Nombre del Producto */}
        <div className="mb-4">
          <label
            htmlFor="productName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Producto:
          </label>
          <input
            type="text"
            id="productName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del producto"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>

        {/* Campo para la Cantidad */}
        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Cantidad:
          </label>
          <input
            type="number"
            id="quantity"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 1 (unidad), 0.5 (kg)"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0"
            step="1" // Permite ingresar valores decimales.
          />
        </div>

        {/* Campo para el Precio */}
        <div className="mb-6">
          <label
            htmlFor="price"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Precio:
          </label>
          <input
            type="number"
            id="price"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 100.50"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        {/* Contenedor de los botones "Cancelar" y "Agregar" */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose} // Cierra el modal al hacer clic en Cancelar.
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-75"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddButtonClick} // Llama a la función que procesa los datos del formulario.
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
