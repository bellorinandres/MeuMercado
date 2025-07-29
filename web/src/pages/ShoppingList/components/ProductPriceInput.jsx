import { useState, useEffect } from "react"; // <-- Importa useEffect

export default function ProductPriceInput({ product, onPriceChange }) {
  const [error, setError] = useState("");
  // Estado local para el valor del input, inicializado desde product.price
  // Esto permite que el input sea controlado
  const [inputValue, setInputValue] = useState(
    product.price > 0 ? product.price.toString() : ""
  );

  // Usa useEffect para actualizar inputValue si product.price cambia desde el padre
  // Esto es crucial cuando fetchList() recarga los datos desde el backend
  useEffect(() => {
    setInputValue(product.price > 0 ? product.price.toString() : "");
  }, [product.price]); // Se dispara cuando product.price cambia

  const handlePriceChange = (e) => {
    const value = e.target.value; // Obtén el valor como string inicialmente
    setInputValue(value); // Actualiza el estado local del input para que se refleje lo que escribe el usuario

    const parsedValue = parseFloat(value);

    // Si el valor está vacío, lo tratamos como 0 para el backend pero no mostramos error
    if (value === "") {
      setError(""); // Limpia cualquier error previo
      onPriceChange(product.id, 0); // Envía 0 al backend si el campo está vacío
      return;
    }

    if (isNaN(parsedValue) || parsedValue < 0) {
      setError("El precio debe ser un número positivo");
      // Opcional: Si quieres que el backend reciba 0 o el último valor válido en caso de error
      // onPriceChange(product.id, isNaN(parsedValue) ? 0 : parsedValue);
      return; // No se llama a onPriceChange si hay un error de validación
    }

    setError("");
    onPriceChange(product.id, parsedValue); // Envía el valor parseado al backend
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
            value={inputValue} // <-- ¡Vincula el valor al estado local!
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
