import { useState } from "react";

export default function ProductPriceInput({ product, onPriceChange }) {
  const [error, setError] = useState("");

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);

    if (value < 0) {
      setError("El precio no puede ser negativo");
      return;
    }

    setError("");
    onPriceChange(product.id, isNaN(value) ? 0 : value); // por si dejan vacío
  };

  return (
    <div className="flex flex-col gap-1 p-3 border border-gray-200 rounded-md bg-white shadow-sm">
      <div className="flex items-center justify-between">
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
            onChange={handlePriceChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-28 p-2 border rounded-md text-gray-800 focus:ring-blue-500 focus:border-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">⚠️ {error}</p>}
    </div>
  );
}
