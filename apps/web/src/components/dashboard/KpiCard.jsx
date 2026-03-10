function deltaColor(delta) {
  if (delta == null) return "text-gray-400";
  if (delta > 0) return "text-green-600";
  if (delta < 0) return "text-red-600";
  return "text-gray-500";
}

function deltaText(delta) {
  if (delta == null) return "No comparison";
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}% vs previous`;
}

export default function KpiCard({ label, value, delta }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
        {value}
      </div>
      <div className={`mt-2 text-sm font-medium ${deltaColor(delta)}`}>
        {deltaText(delta)}
      </div>
    </div>
  );
}
