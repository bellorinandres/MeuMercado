export default function TotalDisplay({ amount }) {
  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center text-xl font-semibold text-blue-800 shadow-sm">
      Total Actual: {amount}
    </div>
  );
}
