import SectionCard from "./SectionCard";
import EmptyStateCard from "./EmptyStateCard";

function formatMoney(n) {
  return Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD"
  });
}

export default function TopProductsCard({ title, items, loading, expanded }) {
  const data = expanded ? items || [] : (items || []).slice(0, 5);

  return (
    <SectionCard title={title}>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : !data.length ? (
        <EmptyStateCard
          title="No product data"
          description="No product revenue data is available for this date range."
        />
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div
              key={`${item.sku}-${index}`}
              className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-gray-900">
                  {item.name || item.sku}
                </div>
                <div className="truncate text-xs text-gray-500">
                  SKU: {item.sku || "—"} • Qty: {Number(item.qty_sold || 0)}
                </div>
              </div>
              <div className="ml-4 text-sm font-semibold text-gray-900">
                {formatMoney(item.revenue || 0)}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
