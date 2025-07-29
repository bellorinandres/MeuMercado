import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import SuccessModal from "../components/Modals/SuccessModal";

// Importa los otros sub-componentes
import ProductPriceInput from "./components/ProductPriceInput";
import SavePurchaseButton from "./components/SavePurchaseButton";
import {
  addItemsToList,
  completeShoppingList,
  getShoppingListDetails,
  updateListItemPrice,
} from "./shoppingService";
import { ErrorScreen, LoadingScreen } from "./components/FeedbackScreens";
import ShoppingListHeader from "./components/ShoppingListHeader";
import TotalDisplay from "./components/TotalDisplay";
import { formatCurrency } from "../../../utils/formatCurrency";
import AddItemButton from "./components/AddItemButton";
import AddItemModal from "../components/Modals/AddItemModal";

export default function ShoppingListPage() {
  const { listId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [listName, setListName] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessModalMessage] = useState("");

  // Estado para controlar la visibilidad del modal de agregar ítem
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Calcula el costo total actual
  const totalCurrentCost = useMemo(() => {
    return products.reduce((sum, product) => {
      const price = parseFloat(product.price);
      return sum + (isNaN(price) ? 0 : price * product.quantity);
    }, 0);
  }, [products]);

  // --- Funciones de Carga de Datos ---
  const fetchList = useCallback(async () => {
    if (!user || !user.id || !user.token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getShoppingListDetails(listId, user.token);
      setListName(data.name);
      // Asegura que price esté inicializado para los inputs
      setProducts(data.products.map((p) => ({ ...p, price: p.price || "" })));
    } catch (err) {
      setError("Error al cargar los detalles de la lista: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [listId, user, navigate]);

  // Efecto para cargar la lista al montar el componente o cambiar dependencias
  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // --- Manejadores de Eventos ---

  // Maneja el cambio de precio de un producto existente
  const handlePriceChange = useCallback(
    async (productId, newPrice) => {
      // 1. Actualiza el estado local inmediatamente para feedback rápido
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, price: newPrice } : product
        )
      );

      // 2. Si el precio es válido, envíalo al backend
      const parsedPrice = parseFloat(newPrice);
      if (!isNaN(parsedPrice) && parsedPrice >= 0 && productId) {
        try {
          // Llama al nuevo servicio para actualizar el precio en la DB
          await updateListItemPrice(productId, parsedPrice, user.token);
          console.log(
            `Precio del producto ${productId} actualizado en DB a ${parsedPrice}`
          );
          // No es necesario fetchList() aquí, ya que el estado local ya está actualizado.
          // fetchList() solo sería necesario si otros datos del ítem pudieran cambiar.
        } catch (err) {
          console.error("Error al guardar el precio en el backend:", err);
          // Opcional: Revertir el estado local o mostrar un mensaje de error al usuario
          setError("Error al guardar el precio. Intenta de nuevo.");
          // Podrías revertir el precio en el estado local si el guardado falla:
          // setProducts((prev) => prev.map(p => p.id === productId ? { ...p, price: originalPrice } : p));
        }
      }
    },
    [user.token]
  ); // `user.token` es una dependencia porque se usa en `updateListItemPrice`

  // Maneja la adición de un nuevo ítem desde el modal (SOLO AL ESTADO LOCAL)
  // Maneja la adición de un nuevo ítem desde el modal (AHORA CON BACKEND)
  const handleAddItem = useCallback(
    async (newItemData) => {
      if (!newItemData.name || !newItemData.quantity || !newItemData.price) {
        alert("Por favor, completa todos los campos del nuevo producto.");
        return;
      }

      setLoading(true); // Activa el estado de carga mientras se guarda en el backend
      try {
        // 1. Prepara el payload para el backend.
        // Notar que 'items' es un array que contiene un solo objeto,
        // ya que el modal agrega un ítem a la vez.
        const payload = [
          {
            name: newItemData.name,
            quantity: parseFloat(newItemData.quantity),
            price: parseFloat(newItemData.price),
            // No incluyas 'id' si el backend lo genera.
            // Asume que el backend asignará el 'is_bought' inicial (ej. 0 o false).
          },
        ];

        // 2. Llama a la función de servicio que interactúa con el backend
        await addItemsToList(listId, payload, user.token);

        // 3. Después de un éxito en el backend, recarga la lista
        // Esto asegura que el producto con su ID real del backend y
        // cualquier otra propiedad generada por el servidor, se muestre correctamente.
        await fetchList();
      } catch (err) {
        // Manejo de errores de la API
        setError("Error al agregar el producto: " + err.message);
        // Puedes usar un AlertDialog si tienes uno configurado para mostrar errores
        // setAlertDialogType("error");
        // setAlertDialogTitle("Error al agregar");
        // setAlertDialogMessage(err.message || "No se pudo agregar el producto.");
        // setShowAlertDialog(true);
      } finally {
        setLoading(false); // Desactiva el estado de carga
        setShowAddItemModal(false); // Cierra el modal de agregar ítem
      }
    },
    [listId, user, fetchList]
  ); // Añade 'fetchList' a las dependencias

  // Maneja el guardado de la compra
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
      name: listName,
      // Solo envía los ítems que tienen IDs reales si tu backend los requiere
      // Si el backend puede manejar ítems nuevos sin ID, puedes enviar todos
      // o filtrar los temporales (ej. .filter(p => !p.id.startsWith('new-')))
      items: products.map((p) => ({
        id: String(p.id).startsWith("new-") ? undefined : p.id,
        name: p.name,
        quantity: p.quantity,
        price: parseFloat(p.price),
      })),
      purchased_at: new Date().toISOString(),
      status: "completed",
    };

    console.log("Payload para guardar compra:", payload); // Puedes dejar este console.log para depuración

    setLoading(true); // Muestra el estado de carga al guardar
    try {
      await completeShoppingList(listId, payload, user.token);
      setSuccessModalMessage("¡Compra guardada con éxito!");
      setShowSuccessModal(true);
    } catch (err) {
      setError("Error al guardar la compra: " + err.message);
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  }, [listName, products, user.id, user.token, listId]);

  // Cierra el modal de éxito
  const handleCloseSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
    // Ya el modal debería manejar la navegación al dashboard
  }, []);

  // --- Renderizado Condicional ---
  if (loading) return <LoadingScreen message="Cargando lista..." />;
  if (error) return <ErrorScreen error={error} onRetry={() => fetchList()} />;

  // --- Renderizado Principal de la Página ---
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
                key={String(product.id)}
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

        {/* Botón para agregar un nuevo producto */}
        <div className="mt-4">
          <AddItemButton onClick={() => setShowAddItemModal(true)} />
        </div>

        {/* Total Current Cost Display */}
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

      {/* Modal para agregar nuevo ítem */}
      <AddItemModal
        show={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onAddItem={handleAddItem}
      />
    </div>
  );
}
