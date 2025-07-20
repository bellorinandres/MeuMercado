// web/src/pages/CreateList/components/ShoppingListItem.jsx

export default function ShoppingListItem({
  item,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveItem,
}) {
  return (
    <li
      key={item.id}
      className="bg-gray-50 rounded-md p-3 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        {" "}
        {/* Nuevo div para agrupar el botón de eliminar y el nombre */}
        <button
          className="text-red-500 hover:text-red-700 font-bold text-lg leading-none" // Clases para el botón de eliminar
          onClick={() => onRemoveItem(item.id)}
          aria-label={`Eliminar ${item.name}`} // Mejora la accesibilidad
        >
          &times; {/* Carácter 'x' para cerrar o eliminar */}
        </button>
        <span className="text-gray-800">{item.name}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
          onClick={() => onDecreaseQuantity(item.id)}
        >
          -
        </button>
        <span className="text-gray-800 font-semibold">{item.quantity}</span>
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
          onClick={() => onIncreaseQuantity(item.id)}
        >
          +
        </button>
      </div>
    </li>
  );
}
