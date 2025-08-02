import { useState, useEffect } from "react";

export default function PersonalDataSection({ userData, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // Não precisa de phone se não for atualizado
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [originalName, setOriginalName] = useState("");

  // Sincronizar formData com userData da prop quando userData muda
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
      });
      setOriginalName(userData.name || ""); // Armazena o nome original
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Permitir apenas a mudança no campo 'name'
    if (name === "name") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // 1. Verificar se houve alguma mudança no nome
    if (formData.name === originalName) {
      setError("Nenhuma alteração feita. O nome é o mesmo.");
      return;
    }

    // 2. Validar o campo de nome
    if (!formData.name.trim()) {
      setError("O nome não pode estar vazio.");
      return;
    }

    // Apenas enviar o novo nome para a API
    const payload = {
      newName: formData.name,
    };

    try {
      // 3. Chamada à função onUpdate, passando apenas o payload necessário
      onUpdate(payload);
      setMessage("Dados pessoais atualizados com sucesso!");
      setOriginalName(formData.name); // Atualiza o nome original
    } catch (err) {
      setError("Erro ao atualizar o nome. Por favor, tente novamente.");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dados Pessoais</h2>

      {message && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            readOnly // Torna o campo de e-mail não editável
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm" // Adiciona um estilo para mostrar que não é editável
          />
        </div>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
