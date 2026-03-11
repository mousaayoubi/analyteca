import SectionCard from "./SectionCard";

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export default function SalesChannelCard({
  data = [],
  emptyMessage = "No channel data available.",
  loading = false,
}) {
  return (
    <SectionCard
      title="Sales channels"
      subtitle="Revenue contribution by channel"
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                  <div className="text-xs text-slate-500">{item.orders} orders</div>
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {formatMoney(item.revenue)}
                </div>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
                  style={{ width: `${Math.max(0, Math.min(Number(item.share || 0), 100))}%` }}
                />
              </div>

              <div className="mt-2 text-xs text-slate-500">{item.share}% of sales</div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
