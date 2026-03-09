// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchSummary } from "../api/metrics";
import { getApiBaseUrl } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import { fetchLastSync, runSyncNow } from "../api/sync";

function formatMoney(n, currency = "USD") {
  const v = Number(n || 0);
  return v.toLocaleString(undefined, { style: "currency", currency });
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString();
}

function getDefaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 60);
  const iso = (d) => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(to) };
}

function daysInRangeInclusive(fromIso, toIso) {
  if (!fromIso || !toIso) return 0;
  const from = new Date(`${fromIso}T00:00:00Z`);
  const to = new Date(`${toIso}T00:00:00Z`);
  const diffMs = to.getTime() - from.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  return diffDays + 1;
}

function formatDateTime(value) {
  if (!value) return "—";
  const normalized = value.includes("T") ? value : value.replace(" ", "T");
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function getDataSourceLabel(summary) {
  if (
    summary?.dataSource === "custom-magento-api" ||
    summary?.source === "custom_magento_api"
  ) {
    return "Custom Magento API";
  }

  return "Magento API";
}

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const [range, setRange] = useState(getDefaultRange);

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [lastSyncAt, setLastSyncAt] = useState(null);
  const [lastSyncLoading, setLastSyncLoading] = useState(false);

  const [syncing, setSyncing] = useState(false);
  const [syncErr, setSyncErr] = useState("");

  async function refreshSummary(currentRange = range) {
    setLoading(true);
    setErr("");

    try {
      const data = await fetchSummary({
        token,
        from: currentRange.from,
        to: currentRange.to,
      });
      setSummary(data);
    } catch (e) {
      setErr(e?.message || "Failed to load summary");
    } finally {
      setLoading(false);
    }
  }

  async function refreshLastSync() {
    setLastSyncLoading(true);

    try {
      const data = await fetchLastSync({ token });
      setLastSyncAt(data?.lastSyncAt || null);
    } catch {
      setLastSyncAt(null);
    } finally {
      setLastSyncLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;

    setLoading(true);
    setErr("");

    fetchSummary({ token, from: range.from, to: range.to })
      .then((data) => {
        if (!alive) return;
        setSummary(data);
      })
      .catch((e) => {
        if (!alive) return;
        setErr(e?.message || "Failed to load summary");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [token, range.from, range.to]);

  useEffect(() => {
    if (!token) return;
    refreshLastSync();
  }, [token]);

  async function onSyncNow() {
    setSyncErr("");
    setSyncing(true);

    try {
      await runSyncNow({ token, from: range.from, to: range.to });
      await refreshLastSync();
      await refreshSummary(range);
    } catch (e) {
      setSyncErr(e?.message || "Sync failed");
    } finally {
      setSyncing(false);
    }
  }

  const currency = summary?.currency || "USD";
  const revenue = summary?.total_revenue ?? 0;
  const orders = summary?.total_orders ?? 0;
  const aov = summary?.average_order_value ?? 0;
  const refunds = summary?.refunds ?? 0;

  const displayFrom = summary?.from || range.from;
  const displayTo = summary?.to || range.to;
  const daysInRange = daysInRangeInclusive(displayFrom, displayTo);
  const dataSourceLabel = getDataSourceLabel(summary);
  const statusBreakdown = Array.isArray(summary?.status_breakdown)
    ? summary.status_breakdown
    : [];

  const displayedLastSyncAt = summary?.last_synced_at || lastSyncAt;

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/analyteca-logo.png"
              alt="Analyteca"
              className="h-9 w-9 object-contain"
            />
            <div>
              <div className="text-lg font-semibold text-slate-900">Analyteca</div>
              <div className="text-sm text-slate-500">Magento Analytics Dashboard</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Connected
            </span>
            <button
              onClick={logout}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">API Base URL</div>
            <div className="mt-2 font-mono text-slate-900">{apiBaseUrl}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Signed in as</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{user?.email}</div>
            <div className="text-sm text-slate-500">Role: {user?.role}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">Token</div>
            <div className="mt-2 font-mono text-slate-900">
              {token ? `${token.slice(0, 18)}…${token.slice(-10)}` : "—"}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">Metrics Summary</div>
              <div className="mt-1 text-sm text-slate-500">
                Pulled from your Node API: /api/metrics/summary
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-medium text-violet-700">
                  Data source: {dataSourceLabel}
                </span>

                <div className="text-sm text-slate-600">
                  Last synced at:{" "}
                  <span className="font-medium text-slate-800">
                    {lastSyncLoading && !summary?.last_synced_at
                      ? "…"
                      : formatDateTime(displayedLastSyncAt)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600">From</label>
                <input
                  type="date"
                  value={range.from}
                  onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
                  className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-cyan-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600">To</label>
                <input
                  type="date"
                  value={range.to}
                  onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
                  className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-cyan-300"
                />
              </div>

              <button
                onClick={() => setRange(getDefaultRange())}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>

              <button
                onClick={onSyncNow}
                disabled={syncing || !token}
                className="rounded-xl bg-gradient-to-r from-sky-600 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-400/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {syncing ? "Syncing…" : "Sync Now"}
              </button>
            </div>
          </div>

          {syncErr ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {syncErr}
            </div>
          ) : null}

          {err ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {err}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Kpi title="Revenue" value={loading ? "…" : formatMoney(revenue, currency)} />
            <Kpi title="Orders" value={loading ? "…" : formatNumber(orders)} />
            <Kpi title="AOV" value={loading ? "…" : formatMoney(aov, currency)} />
            <Kpi title="Refunds" value={loading ? "…" : formatMoney(refunds, currency)} />
          </div>

          <div className="mt-6 text-sm text-slate-500">
            Range: <span className="font-medium text-slate-700">{displayFrom}</span> →{" "}
            <span className="font-medium text-slate-700">{displayTo}</span>
            {" · "}
            Days: <span className="font-medium text-slate-700">{loading ? "—" : daysInRange}</span>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-900">Status breakdown</div>

            {loading ? (
              <div className="mt-3 text-sm text-slate-500">Loading…</div>
            ) : statusBreakdown.length === 0 ? (
              <div className="mt-3 text-sm text-slate-500">No orders found for this range.</div>
            ) : (
              <div className="mt-4 space-y-3">
                {statusBreakdown.map((item) => (
                  <div
                    key={item.status}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <div className="text-sm font-semibold capitalize text-slate-900">
                        {item.status}
                      </div>
                      <div className="text-xs text-slate-500">Order status</div>
                    </div>

                    <div className="flex gap-6">
                      <div>
                        <div className="text-xs text-slate-500">Orders</div>
                        <div className="text-sm font-semibold text-slate-900">
                          {formatNumber(item.total_orders)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">Revenue</div>
                        <div className="text-sm font-semibold text-slate-900">
                          {formatMoney(item.total_revenue, currency)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function Kpi({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-medium text-slate-600">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
