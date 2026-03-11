import SectionCard from "./SectionCard";

export default function ConversionFunnelCard({
  data = [],
  emptyMessage = "No funnel data available.",
  loading = false,
}) {
  const maxValue = Math.max(...data.map((item) => Number(item.value || 0)), 1);

  return (
    <SectionCard
      title="Conversion funnel"
      subtitle="Track journey from session to completed order"
    >
      {loading ? (
        <div className="h-[320px] animate-pulse rounded-[24px] border border-slate-200 bg-slate-100" />
      ) : data.length === 0 ? (
        <div className="flex h-[320px] items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((item, index) => {
            const width = `${Math.max((Number(item.value || 0) / maxValue) * 100, 10)}%`;

            return (
              <div key={`${item.label}-${index}`}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="font-semibold text-slate-900">
                    {Number(item.value || 0).toLocaleString()}
                  </span>
                </div>

                <div className="h-12 overflow-hidden rounded-2xl bg-slate-100">
                  <div
                    className="flex h-full items-center rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-400 px-4 text-sm font-semibold text-white"
                    style={{ width }}
                  >
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
