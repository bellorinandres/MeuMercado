import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// ✅ Manteniendo tu import original, asumiendo que listServices.js está en la misma carpeta
import { fetchListDetailsCompleted } from "./listServices";
import BackButton from "../components/Buttons/BackButton";

export default function ListDetailsPage() {
  const { listId } = useParams();
  const { user } = useContext(AuthContext);

  const [listDetails, setListDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getListDetails = async () => {
      // 1. Verificar autenticación primero
      if (!user || !user.token) {
        setError("Você não está autenticado(a). Por favor, faça login.");
        setIsLoading(false);
        setListDetails(null); // Asegura que no se muestre data vieja o se intente desestructurar
        return;
      }

      setIsLoading(true);
      setError(null); // Limpia errores anteriores en cada intento de carga
      setListDetails(null); // Asegura que listDetails sea null mientras carga, para evitar flickering de data vieja.

      try {
        const data = await fetchListDetailsCompleted(listId, user.token);

        setListDetails(data); // 'data' ya está en el formato final esperado
      } catch (err) {
        console.error("Erro ao buscar detalhes da lista:", err);
        setError(err.message || "Erro ao carregar os detalhes da lista.");
        setListDetails(null); // Asegura que sea null en caso de error para que se muestre el mensaje de "Lista no encontrada" o similar
      } finally {
        setIsLoading(false);
      }
    };

    getListDetails();
  }, [listId, user]);

  // --- Bloques de renderizado condicional completos ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-700">Carregando detalhes da lista...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-red-600 mb-4">Erro: {error}</p>
        <BackButton to="/dashboard" ariaLabel="Voltar para o Painel" />
      </div>
    );
  }

  // ✅ Esto es CRUCIAL: Solo intenta desestructurar si listDetails NO es null
  if (!listDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-700">Lista não encontrada.</p>
        <BackButton to="/dashboard" ariaLabel="Voltar para o Painel" />
      </div>
    );
  }

  // Si llegamos aquí, listDetails definitivamente no es null, por lo que es seguro desestructurar
  const {
    name,
    products,
    total_cost,
    purchased_at,
    is_completed,
    user_name,
    created_at,
  } = listDetails;

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <BackButton to="/dashboard" ariaLabel="Voltar para o Painel" />
          <h1 className="text-2xl font-bold text-gray-800 text-center flex-grow">
            Detalhes da Lista: {name}
          </h1>
          <div className="w-10"></div>
        </div>

        <div className="mb-4 text-gray-700 text-sm">
          <p>
            <strong>Criada em:</strong>{" "}
            {new Date(created_at).toLocaleDateString()}
          </p>
          {is_completed && purchased_at && (
            <p>
              <strong>Comprada em:</strong>{" "}
              {new Date(purchased_at).toLocaleDateString()}
            </p>
          )}
          <p>
            <strong>Status:</strong> {is_completed ? "Completa" : "Pendente"}
          </p>
          {user_name && (
            <p>
              <strong>Criada por:</strong> {user_name}
            </p>
          )}
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Produtos na Lista
        </h3>
        {products && products.length > 0 ? (
          <ul className="space-y-2">
            {products.map((product) => (
              <li
                key={product.id}
                className="p-3 border border-gray-200 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {product.quantity}
                  </p>
                  {/* ✅ APLICA parseFloat AQUÍ para product.price */}
                  {product.price &&
                    parseFloat(product.price) > 0 && ( // Verifica que exista antes de parsear y que sea > 0
                      <p className="text-sm text-gray-600">
                        Preço unitário: R${" "}
                        {parseFloat(product.price).toFixed(2)}
                      </p>
                    )}
                  {/* ✅ APLICA parseFloat AQUÍ para product.subtotal */}
                  {product.subtotal &&
                    parseFloat(product.subtotal) > 0 && ( // Verifica que exista antes de parsear y que sea > 0
                      <p className="text-sm text-gray-600">
                        Subtotal: R$ {parseFloat(product.subtotal).toFixed(2)}
                      </p>
                    )}
                  {typeof product.is_bought === "boolean" && (
                    <p
                      className={`text-xs font-semibold ${
                        product.is_bought ? "text-green-600" : "text-orange-500"
                      }`}
                    >
                      {product.is_bought ? "Comprado" : "Pendente"}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhum produto nesta lista.</p>
        )}

        {/* ✅ APLICA parseFloat AQUÍ para total_cost */}
        {total_cost &&
          parseFloat(total_cost) > 0 && ( // Verifica que exista antes de parsear y que sea > 0
            <div className="mt-6 p-4 bg-blue-50 rounded-md text-blue-800 font-bold">
              <p>
                Custo Total da Lista: R$ {parseFloat(total_cost).toFixed(2)}
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
