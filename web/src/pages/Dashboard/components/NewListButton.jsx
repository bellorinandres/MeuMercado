import { Link } from "react-router-dom";

export default function NewListButton() {
  return (
    // Hemos eliminado las clases de flex justify del div contenedor
    // y aplicaremos el posicionamiento fijo directamente al Link.
    <Link
      to="/createList" // Make sure this path matches the one defined in App.jsx
      // Asegúrate de que esta ruta coincida con la definida en App.jsx
      className="fixed bottom-6 right-6 // ✅ NEW: Fixed position at bottom-right
                 bg-green-600 hover:bg-green-700 text-white font-bold
                 py-3 px-6 rounded-full shadow-lg text-lg
                 transition duration-300 ease-in-out
                 whitespace-nowrap
                 z-50 // ✅ NEW: Ensure it's above other content
                "
    >
      + Nueva lista
    </Link>
  );
}
