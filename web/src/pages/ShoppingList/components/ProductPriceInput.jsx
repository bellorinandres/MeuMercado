// web/src/pages/ShoppingList/components/ProductPriceInput.jsx

export default function ProductPriceInput({ product, onPriceChange }) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-white shadow-sm">
      <div className="flex-grow mr-4">
        <p className="font-medium text-lg text-gray-800">{product.name}</p>
        <p className="text-sm text-gray-600">Cantidad: {product.quantity}</p>
      </div>
      <div className="flex items-center">
        <label htmlFor={`price-${product.id}`} className="sr-only">
          Precio para {product.name}
        </label>
        <span className="text-lg text-gray-700 mr-2">$</span>
        <input
          type="number"
          id={`price-${product.id}`}
          value={product.price}
          onChange={(e) => onPriceChange(product.id, e.target.value)}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="w-28 p-2 border border-gray-300 rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
}
