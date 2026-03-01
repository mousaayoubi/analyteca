// src/pages/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchSummary } from "../api/metrics";
import { getApiBaseUrl } from "../api/http";
import { useAuth } from "../auth/AuthContext";

function formatMoney(n) {
  const v = Number(n || 0);
  return v.toLocaleString(undefined, { style: "currency", currency: "USD" });
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

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

  const [range, setRange] = useState(getDefaultRange);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

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
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, [token, range.from, range.to]);

  const totals = summary?.totals || { revenue: 0, orders: 0, aov: 0, refunds: 0 };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/assets/analyteca-logo.png" alt="Analyteca" className="h-9 w-9 object-contain" />
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
        {/* Info cards */}
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

        {/* Range + KPIs */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-lg font-semibold text-slate-900">Metrics Summary</div>
              <div className="text-sm text-slate-500">Pulled from your Node API: /metrics/summary</div>
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
            </div>
          </div>

          {err ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <Kpi title="Revenue" value={loading ? "…" : formatMoney(totals.revenue)} />
            <Kpi title="Orders" value={loading ? "…" : formatNumber(totals.orders)} />
            <Kpi title="AOV" value={loading ? "…" : formatMoney(totals.aov)} />
            <Kpi title="Refunds" value={loading ? "…" : formatMoney(totals.refunds)} />
          </div>

          <div className="mt-6 text-sm text-slate-500">
            Range: <span className="font-medium text-slate-700">{summary?.range?.from || range.from}</span> →{" "}
            <span className="font-medium text-slate-700">{summary?.range?.to || range.to}</span>
            {" · "}
            Days: <span className="font-medium text-slate-700">{summary?.daily?.length ?? "—"}</span>
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
