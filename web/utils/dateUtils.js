export function formatDateToMonthYear(dateString) {
  if (!dateString) return "Fecha desconocida";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long" };
  return date.toLocaleDateString("es-ES", options);
}
