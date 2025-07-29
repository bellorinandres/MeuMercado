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
import { ErrorScreen, LoadingScreen } from "./components/FeedbackScreens";
import ShoppingListHeader from "./components/ShoppingListHeader";
import TotalDisplay from "./components/TotalDisplay";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function ShoppingListPage() {
  const { listId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [listName, setListName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessModalMessage] = useState(""); // Renombrado para evitar conflicto

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
  if (loading) return <LoadingScreen message="Cargando lista..." />;
  if (error)
    return <ErrorScreen error={error} onRetry={() => navigate("/dashboard")} />;

  // --- Renderizado principal de la página ---
  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-md shadow-lg p-6 sm:p-8">
        {/* Encabezado */}
        <ShoppingListHeader title={listName} />

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
        <TotalDisplay amount={formatCurrency(totalCurrentCost)} />

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
