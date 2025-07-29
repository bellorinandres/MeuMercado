export const LoadingScreen = ({ message = "Cargando..." }) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center p-6 bg-white rounded-lg shadow-lg">
      <svg
        className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <p className="text-gray-700">{message}</p>
    </div>
  </div>
);

export const ErrorScreen = ({ error, onRetry }) => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center p-6 bg-white rounded-lg shadow-lg">
      <p className="text-red-600 font-medium mb-3">¡Oops! Algo salió mal.</p>
      <p className="text-gray-700">{error}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
      >
        Volver al Dashboard
      </button>
    </div>
  </div>
);
