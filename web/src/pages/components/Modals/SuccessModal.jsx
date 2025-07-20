// src/components/SuccessModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function SuccessModal({ show, onClose, message }) {
  const navigate = useNavigate(); // Initialize useNavigate

  if (!show) return null;

  const handleCloseAndRedirect = () => {
    onClose(); // First, close the modal as usual
    navigate("/dashboard"); // Then, redirect to the dashboard
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full transform transition-all duration-300 scale-100 opacity-100">
        {" "}
        {/* Enhanced modal styling */}
        <h2 className="text-2xl font-bold mb-3 text-green-600 flex items-center">
          <span className="mr-2">✅</span> Éxito
        </h2>
        <p className="text-gray-700 text-base leading-relaxed">
          {message || "Operación realizada correctamente."}
        </p>
        <button
          onClick={handleCloseAndRedirect} // Use the new handler
          className="mt-6 w-full bg-green-600 text-white px-5 py-2.5 rounded-lg 
                     font-semibold text-base shadow-md hover:bg-green-700 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 
                     transition-colors duration-200 transform hover:scale-105"
        >
          Ir al Dashboard
        </button>
      </div>
    </div>
  );
}
