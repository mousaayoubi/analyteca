export default function DateRangeBar({
  range,
  setRange,
  onReset,
  onSync,
  isSyncing,
  sourceLabel,
  lastSyncedAt,
}) {
  return (
    <div className="flex w-full flex-col gap-4 xl:max-w-[900px]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
          Data source: {sourceLabel}
        </div>

        <div className="text-sm text-slate-500">
          Last synced at: <span className="font-semibold text-slate-700">{lastSyncedAt}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">From</span>
            <input
              type="date"
              value={range.from}
              onChange={(e) => setRange((prev) => ({ ...prev, from: e.target.value }))}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">To</span>
            <input
              type="date"
              value={range.to}
              onChange={(e) => setRange((prev) => ({ ...prev, to: e.target.value }))}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
          >
            Reset
          </button>

          <button
            onClick={onSync}
            disabled={isSyncing}
            className="h-12 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(14,165,233,0.3)] transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSyncing ? "Syncing..." : "Sync Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
