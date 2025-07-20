// web/src/pages/CreateList/components/SaveListButton.jsx

export default function SaveListButton({ onSaveList }) {
  return (
    <div className="mt-6 text-center">
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={onSaveList}
      >
        Guardar Lista
      </button>
    </div>
  );
}
