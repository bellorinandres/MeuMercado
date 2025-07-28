import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
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
      if (!user || !user.token) {
        setError("Você não está autenticado(a). Por favor, faça login.");
        setIsLoading(false);
        setListDetails(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      setListDetails(null);

      try {
        const data = await fetchListDetailsCompleted(listId, user.token);
        setListDetails(data);
      } catch (err) {
        console.error("Erro ao buscar detalhes da lista:", err);
        setError(err.message || "Erro ao carregar os detalhes da lista.");
        setListDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    getListDetails();
  }, [listId, user]);

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

  if (!listDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-gray-700">Lista não encontrada.</p>
        <BackButton to="/dashboard" ariaLabel="Voltar para o Painel" />
      </div>
    );
  }

  const {
    name,
    products,
    total_cost,
    purchased_at,
    is_completed,
    user_name,
    created_at,
  } = listDetails;

  // Filtrar produtos comprados e com preço válido
  const purchasedProductsWithPrice = products.filter(
    (product) => product.is_bought && parseFloat(product.price) > 0
  );

  // Filtrar produtos que não foram comprados OU estão com preço 0
  const pendingProducts = products.filter(
    (product) => !product.is_bought || parseFloat(product.price) === 0
  );

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

        {/* --- Produtos Comprados --- */}
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Produtos Comprados
        </h3>
        {purchasedProductsWithPrice && purchasedProductsWithPrice.length > 0 ? (
          <ul className="space-y-2">
            {purchasedProductsWithPrice.map((product) => (
              <li
                key={product.id}
                className="p-3 border border-gray-200 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantidade: {product.quantity}
                  </p>
                  {product.price && parseFloat(product.price) > 0 && (
                    <p className="text-sm text-gray-600">
                      Preço unitário: R$ {parseFloat(product.price).toFixed(2)}
                    </p>
                  )}
                  {product.subtotal && parseFloat(product.subtotal) > 0 && (
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
          <p className="text-gray-500">
            Nenhum produto comprado com preço válido nesta lista.
          </p>
        )}

        {/* --- Produtos Pendentes/Não Comprados --- */}
        {pendingProducts && pendingProducts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-orange-600 mb-2">
              Produtos Pendentes ou sem Preço
            </h3>
            <ul className="space-y-2">
              {pendingProducts.map((product) => (
                <li
                  key={`pending-${product.id}`}
                  className="p-3 border border-orange-200 rounded-md bg-orange-50"
                >
                  <div>
                    {" "}
                    {/* Agregamos un div para mantener la estructura */}
                    <p className="font-medium text-orange-800">
                      {product.name}
                    </p>
                    <p className="text-sm text-orange-700">
                      Quantidade: {product.quantity}
                    </p>
                    {typeof product.is_bought === "boolean" && (
                      <p
                        className={`text-xs font-semibold ${
                          product.is_bought
                            ? "text-green-600"
                            : "text-orange-500"
                        }`}
                      >
                        {product.is_bought ? "Comprado" : "Pendente"}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {total_cost && parseFloat(total_cost) > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md text-blue-800 font-bold">
            <p>Custo Total da Lista: R$ {parseFloat(total_cost).toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
