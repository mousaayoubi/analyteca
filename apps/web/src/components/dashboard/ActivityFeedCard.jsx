import SectionCard from "./SectionCard";

export default function ActivityFeedCard({
  items = [],
  emptyMessage = "No recent activity available.",
  loading = false,
}) {
  return (
    <SectionCard
      title="Recent activity"
      subtitle="Operational events and dashboard updates"
    >
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-20 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-[220px] items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mt-1 h-3 w-3 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <span className="whitespace-nowrap text-xs text-slate-400">{item.time}</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.meta}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
