import { useEffect, useMemo, useState } from "react";
import { fetchSummary, triggerSync } from "../api/metrics";
import { getApiBaseUrl } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import RevenueOverTimeChart from "../components/dashboard/RevenueOverTimeChart";
import TopProductsTable from "../components/dashboard/TopProductsTable";
import RevenueByStatusDonut from "../components/dashboard/RevenueByStatusDonut";

function formatMoney(n) {
  const v = Number(n || 0);
  return v.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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

function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function Dashboard() {
  const { token } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [range, setRange] = useState(getDefaultRange());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");
      const summary = await fetchSummary(range, token);
      setData(summary);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.from, range.to, token]);

  async function handleSyncNow() {
    try {
      setSyncing(true);
      setError("");
      await triggerSync(token);
      await loadDashboard();
    } catch (err) {
      console.error(err);
      setError(err?.message || "Sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  const topProducts = data?.topProducts || [];
  const revenueByStatus = data?.revenueByStatus || data?.statusBreakdown || [];
  const timeseries = data?.timeseries || [];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Commerce analytics
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Revenue, orders, product mix, and status performance for Testlicious.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                From
              </label>
              <input
                type="date"
                value={range.from}
                onChange={(e) =>
                  setRange((prev) => ({ ...prev, from: e.target.value }))
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                To
              </label>
              <input
                type="date"
                value={range.to}
                onChange={(e) =>
                  setRange((prev) => ({ ...prev, to: e.target.value }))
                }
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-400"
              />
            </div>

            <button
              type="button"
              onClick={handleSyncNow}
              disabled={syncing}
              className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {syncing ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Revenue" value={formatMoney(data?.revenue)} />
          <MetricCard label="Orders" value={formatNumber(data?.orders)} />
          <MetricCard label="AOV" value={formatMoney(data?.aov)} />
          <MetricCard label="Refunds" value={formatMoney(data?.refunds)} />
        </div>

        <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">Performance insights</h2>
              <p className="mt-1 text-sm text-slate-500">
                Executive summary styled like modern commerce analytics tools.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <InfoCard
                title="Sync confidence"
                description={`Last synced at ${formatDateTime(data?.lastSyncedAt)}`}
              />
              <InfoCard
                title="Revenue-first layout"
                description="The dashboard keeps revenue, orders, AOV, and product performance immediately visible."
              />
              <InfoCard
                title="Trend visibility"
                description="Revenue over time, status mix, and top products explain what is driving the selected period."
              />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">Selected range</h2>
              <p className="mt-1 text-sm text-slate-500">Quick period context</p>
            </div>

            <RangeBlock label="From" value={range.from} />
            <RangeBlock label="To" value={range.to} />
            <RangeBlock label="Data source" value={data?.sourceLabel || "Magento"} />
            <RangeBlock
              label="Last synced at"
              value={formatDateTime(data?.lastSyncedAt)}
            />
          </section>
        </div>

        <div className="mb-6">
          <RevenueOverTimeChart data={timeseries} loading={loading} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
          <TopProductsTable products={topProducts} loading={loading} />
          <RevenueByStatusDonut data={revenueByStatus} loading={loading} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </div>
    </div>
  );
}

function InfoCard({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-slate-600">{description}</div>
    </div>
  );
}

function RangeBlock({ label, value }) {
  return (
    <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 last:mb-0">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold text-slate-900">{value || "—"}</div>
    </div>
  );
}
