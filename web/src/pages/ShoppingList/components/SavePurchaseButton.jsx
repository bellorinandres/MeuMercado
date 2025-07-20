// web/src/pages/ShoppingList/components/SavePurchaseButton.jsx
import React from 'react';

export default function SavePurchaseButton({ onSavePurchase, loading }) {
  return (
    <button
      onClick={onSavePurchase}
      disabled={loading} // Disable if overall page is loading or saving
      className={`mt-8 w-full px-6 py-3 rounded-lg font-semibold text-lg shadow-md
                 transition-all duration-200
                 ${loading
                   ? "bg-gray-400 cursor-not-allowed"
                   : "bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105"
                 }`}
    >
      {loading ? "Guardando..." : "Guardar Compra"}
    </button>
  );
}