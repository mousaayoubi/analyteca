export default function MetricCard({
  title,
  value,
  subtitle,
  trend,
  accent = "default",
  loading = false,
}) {
  const accentStyles =
    accent === "primary"
      ? "border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50"
      : accent === "secondary"
      ? "border-cyan-200 bg-gradient-to-br from-cyan-50 to-slate-50"
      : "border-slate-200 bg-white";

  return (
    <div className={`rounded-[24px] border p-5 shadow-[0_8px_20px_rgba(15,23,42,0.05)] ${accentStyles}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          {loading ? (
            <div className="mt-3 h-9 w-28 animate-pulse rounded-xl bg-slate-200" />
          ) : (
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</h3>
          )}
        </div>

        {trend ? (
          <div className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-700">
            {trend}
          </div>
        ) : null}
      </div>

      {subtitle ? <p className="mt-3 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}
