import { CalendarDays, RefreshCw } from "lucide-react";

function formatDateTime(dateValue) {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleString();
}

export default function DateRangeBar({
  title,
  subtitle,
  sourceLabel,
  lastSyncedAt,
  from,
  to,
  loading,
  syncing,
  onChange,
  onReset,
  onSync,
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h2 className="text-[18px] font-semibold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 px-4 py-2 text-sm font-semibold text-sky-700">
              Data source: {sourceLabel}
            </div>

            <div className="text-sm text-slate-600">
              Last synced at:{" "}
              <span className="font-semibold text-slate-800">
                {formatDateTime(lastSyncedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                From
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={from}
                  onChange={(e) => onChange("from", e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </label>

            <label className="block">
              <div className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                To
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={to}
                  onChange={(e) => onChange("to", e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={onSync}
              disabled={loading || syncing}
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <RefreshCw
                className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`}
              />
              {syncing ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
