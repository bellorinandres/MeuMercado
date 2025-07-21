import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { fetchShoppingListDetails } from "../../services/listService"; // Para cargar los detalles de la lista
import BackButton from "../components/Buttons/BackButton";

export default function ListDetailsPage() {
  const { listId } = useParams();
  // const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [listDetails, setListDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getListDetails = async () => {
      if (!user || !user.token) {
        setError("Você não está autenticado(a). Por favor, faça login.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchShoppingListDetails(listId, user.token);
        setListDetails(data);
      } catch (err) {
        console.error("Erro ao buscar detalhes da lista:", err);
        setError(err.message || "Erro ao carregar os detalhes da lista.");
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

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <BackButton to="/dashboard" ariaLabel="Voltar para o Painel" />
          <h1 className="text-2xl font-bold text-gray-800 text-center flex-grow">
            Detalhes da Lista: {listDetails.name}
          </h1>
          <div className="w-10"></div>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Produtos na Lista
        </h3>
        {listDetails.products && listDetails.products.length > 0 ? (
          <ul className="space-y-2">
            {listDetails.products.map((product) => (
              <li
                key={product.id}
                className="p-3 border border-gray-200 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-medium text-gray-800">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantidade: {product.quantity}
                  </p>
                  {product.price > 0 && (
                    <p className="text-sm text-gray-600">
                      Preço: R$ {product.price.toFixed(2)}
                    </p>
                  )}
                  {typeof product.isBought === "boolean" && (
                    <p
                      className={`text-xs font-semibold ${
                        product.isBought ? "text-green-600" : "text-orange-500"
                      }`}
                    >
                      {product.isBought ? "Comprado" : "Pendente"}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhum produto nesta lista.</p>
        )}

        {listDetails.total_cost && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md text-blue-800 font-bold">
            <p>Custo Total: R$ {listDetails.total_cost.toFixed(2)}</p>
          </div>
        )}
        {listDetails.purchased_at && (
          <div className="mt-2 p-4 bg-gray-50 rounded-md text-gray-700">
            <p>
              Comprada em:{" "}
              {new Date(listDetails.purchased_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
