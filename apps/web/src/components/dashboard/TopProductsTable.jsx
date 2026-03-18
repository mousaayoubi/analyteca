function formatMoney(n) {
  return Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString();
}

export default function TopProductsTable({ products = [], loading = false }) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">
            Top products
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Highest revenue products for the selected Testlicious date range.
          </p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
          {products.length} items
        </div>
      </div>

      {loading ? (
        <div className="py-14 text-center text-sm text-slate-500">
          Loading top products...
        </div>
      ) : products.length === 0 ? (
        <div className="py-14 text-center text-sm text-slate-500">
          No top product data found for the selected range.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Product
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    SKU
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Qty Sold
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Orders
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    Revenue
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((item, index) => (
                  <tr
                    key={`${item.sku || item.name}-${index}`}
                    className="border-t border-slate-200"
                  >
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">
                        {item.name || "Unnamed product"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {item.sku || "—"}
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-slate-900">
                      {formatNumber(item.qtySold)}
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-slate-900">
                      {formatNumber(item.orders)}
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-semibold text-slate-900">
                      {formatMoney(item.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
