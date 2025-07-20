// web/src/pages/ShoppingList/ShoppingListPage.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import BackButton from "../components/Buttons/BackButton";
import SuccessModal from "../components/Modals/SuccessModal";

// Importa los nuevos sub-componentes
import ProductPriceInput from "./components/ProductPriceInput";
import SavePurchaseButton from "./components/SavePurchaseButton";
import {
  completeShoppingList,
  getShoppingListDetails,
} from "./shoppingService";

export default function ShoppingListPage() {
  const { id: listId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [listName, setListName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessModalMessage] = useState(""); // Renombrado para evitar conflicto

  // --- Utility for currency formatting ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // --- CALCULA EL COSTO TOTAL ACTUAL AQUI (ANTES DE handleSavePurchase) ---
  const totalCurrentCost = useMemo(() => {
    return products.reduce((sum, product) => {
      const price = parseFloat(product.price);
      return sum + (isNaN(price) ? 0 : price * product.quantity);
    }, 0);
  }, [products]);

  useEffect(() => {
    const fetchList = async () => {
      // Renombrado para evitar conflicto con la función importada
      if (!user || !user.id || !user.token) {
        console.warn(
          "Usuario no autenticado o token ausente. Redirigiendo a login."
        );
        navigate("/login");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // ✅ Usa la función del servicio para obtener los detalles
        const data = await getShoppingListDetails(listId, user.token);

        // El servicio ya procesa rawData a { name, products }
        setListName(data.name);
        setProducts(data.products.map((p) => ({ ...p, price: p.price || "" }))); // Asegura que price esté inicializado
      } catch (err) {
        // El error ya viene formateado desde apiRequest o getShoppingListDetails
        setError("Error al cargar los detalles de la lista: " + err.message);
        console.error("Error fetching list details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [listId, user, navigate]);

  // --- Manejadores de eventos ---
  const handlePriceChange = useCallback((productId, newPrice) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, price: newPrice } : product
      )
    );
  }, []);

  const handleSavePurchase = useCallback(async () => {
    if (!listName.trim() || products.length === 0) {
      alert("La lista no tiene nombre o no tiene productos.");
      return;
    }

    const allPricesValid = products.every(
      (p) =>
        p.price !== "" &&
        !isNaN(parseFloat(p.price)) &&
        parseFloat(p.price) >= 0
    );

    if (!allPricesValid) {
      alert(
        "Por favor, ingresa un precio válido (número positivo) para todos los productos."
      );
      return;
    }

    const payload = {
      userId: user.id,
      name: listName, // Ya tenemos el nombre de la lista aquí
      items: products.map((p) => ({
        id: p.id,
        name: p.name,
        quantity: p.quantity,
        price: parseFloat(p.price),
      })),
      purchased_at: new Date().toISOString(),
      status: "completed",
    };

    console.log("Payload para guardar compra:", payload);

    try {
      // ✅ Usa la función del servicio para completar la compra
      await completeShoppingList(listId, payload, user.token);

      setSuccessModalMessage("¡Compra guardada con éxito!");
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Error al guardar la compra:", err);
      alert("Error al guardar la compra: " + err.message);
    }
  }, [listName, products, user.id, user.token, listId]);

  const handleCloseSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
    // Ya el modal debería manejar la navegación al dashboard
  }, []);

  // --- Renderizado del estado de carga/error (igual que antes) ---
  if (loading) {
    return (
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-700">Cargando lista...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <p className="text-red-600 font-medium mb-3">
            ¡Oops! Algo salió mal.
          </p>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- Renderizado principal de la página ---
  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-md shadow-lg p-6 sm:p-8">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-6">
          <BackButton to="/dashboard" ariaLabel="Regresar al Dashboard" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center flex-grow">
            🛒 Comprar:{listName}
          </h1>
          <div className="w-10"></div>
        </div>

        {/* Lista de productos con campos de precio */}
        {products.length > 0 ? (
          <div className="space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 pb-2">
            {products.map((product) => (
              <ProductPriceInput
                key={product.id}
                product={product}
                onPriceChange={handlePriceChange}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center p-4 bg-gray-50 rounded-md">
            Esta lista no tiene productos o no se pudo cargar.
          </p>
        )}

        {/* Current Total Cost Display */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center text-xl font-semibold text-blue-800 shadow-sm">
          Total Actual: {formatCurrency(totalCurrentCost)}
        </div>

        {/* Save Purchase Button */}
        <SavePurchaseButton
          onSavePurchase={handleSavePurchase}
          loading={loading}
        />
      </div>

      {/* Success Modal */}
      <SuccessModal
        show={showSuccessModal}
        onClose={handleCloseSuccessModal}
        message={successMessage}
      />
    </div>
  );
}
