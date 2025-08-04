// web/src/pages/ShoppingList/components/AddItemButton.jsx

export default function AddItemButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
    >
      Agregar Producto
    </button>
  );
}
