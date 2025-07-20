

export default function ListNameInput({ listName, onListNameChange }) {
  return (
    <div className="mb-4">
      <label
        htmlFor="listName"
        className="block text-gray-700 text-sm font-bold mb-2"
      >
        Nombre de la Lista:
      </label>
      <input
        type="text"
        id="listName"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={listName}
        onChange={onListNameChange}
        placeholder="Ej: Compras del Super"
      />
    </div>
  );
}
