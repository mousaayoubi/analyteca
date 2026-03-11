import SectionCard from "./SectionCard";

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export default function TopProductsTable({
  rows = [],
  emptyMessage = "No product data available.",
  loading = false,
}) {
  return (
    <SectionCard
      title="Top products"
      subtitle="Best-performing products in the selected range"
    >
      {loading ? (
        <div className="h-[320px] animate-pulse rounded-[22px] border border-slate-200 bg-slate-100" />
      ) : rows.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[22px] border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Product
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    SKU
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Units sold
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Revenue
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Conversion
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={`${row.sku}-${index}`}
                    className="border-t border-slate-100 transition hover:bg-sky-50/40"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">{row.name}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{row.sku}</td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-800">{row.units}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                      {formatMoney(row.revenue)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                        {row.conversion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
