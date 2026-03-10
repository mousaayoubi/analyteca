function formatSyncDate(value) {
  if (!value) return "Not synced yet";
  return new Date(value).toLocaleString();
}

export default function DashboardHeader({
  title,
  userName,
  range,
  onRangeChange,
  compareEnabled,
  onCompareChange,
  onSyncNow,
  syncing,
  lastSyncedAt,
  onLogout
}) {
  return (
    <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back{userName ? `, ${userName}` : ""}. Track store
            performance across revenue, orders, and sync health.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Last synced at: {formatSyncDate(lastSyncedAt)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
            <label className="text-sm text-gray-600">From</label>
            <input
              type="date"
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
              value={range.from}
              onChange={(e) =>
                onRangeChange((prev) => ({ ...prev, from: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
            <label className="text-sm text-gray-600">To</label>
            <input
              type="date"
              className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
              value={range.to}
              onChange={(e) =>
                onRangeChange((prev) => ({ ...prev, to: e.target.value }))
              }
            />
          </div>

          <label className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={compareEnabled}
              onChange={(e) => onCompareChange(e.target.checked)}
            />
            Compare previous period
          </label>

          <button
            onClick={onSyncNow}
            disabled={syncing}
            className="rounded-2xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {syncing ? "Syncing..." : "Sync Now"}
          </button>

          <button
            onClick={onLogout}
            className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
