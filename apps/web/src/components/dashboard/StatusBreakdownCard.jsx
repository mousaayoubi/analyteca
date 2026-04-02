import SectionCard from "./SectionCard";

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export default function StatusBreakdownCard({
  items = [],
  emptyMessage = "No status data available.",
  loading = false,
}) {
  return (
    <SectionCard
      title="Status breakdown"
      subtitle="Order and sales distribution by status"
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 animate-pulse rounded-[22px] border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.key}
              className="rounded-[22px] border border-slate-200 bg-white p-5 transition hover:border-sky-200 hover:shadow-[0_8px_18px_rgba(2,132,199,0.08)]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{item.label}</h4>
                  <p className="mt-1 text-sm text-slate-500">Order status</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-400">Orders</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{item.orders}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-400">Revenue</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">
                      {formatMoney(item.revenue)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-400">Trend</div>
                    <div className="mt-1 text-lg font-semibold text-sky-700">
                      {item.delta || "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
