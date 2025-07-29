import BackButton from "../../components/Buttons/BackButton";

export default function ShoppingListHeader({ title }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <BackButton to="/dashboard" ariaLabel="Regresar al Dashboard" />
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center flex-grow">
        🛒 Comprar: {title}
      </h1>
      <div className="w-10" />
    </div>
  );
}
