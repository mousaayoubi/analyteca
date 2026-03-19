import { useEffect, useMemo, useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
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

function normalizeStatusBreakdown(items = []) {
  const normalized = Array.isArray(items)
    ? items.map((item) => ({
        status:
          item?.status ||
          item?.label ||
          item?.name ||
          item?.orderStatus ||
          "Unknown",
        orders:
          Number(
            item?.orders ??
              item?.orderCount ??
              item?.count ??
              item?.totalOrders ??
              0
          ) || 0,
        revenue:
          Number(
            item?.revenue ??
              item?.amount ??
              item?.totalRevenue ??
              item?.grandTotal ??
              0
          ) || 0,
      }))
    : [];

  const preferredOrder = ["complete", "pending", "processing"];
  const map = new Map(
    normalized.map((item) => [String(item.status).toLowerCase(), item])
  );

  const ordered = preferredOrder.map((key) => {
    const existing = map.get(key);
    return (
      existing || {
        status: key.charAt(0).toUpperCase() + key.slice(1),
        orders: 0,
        revenue: 0,
      }
    );
  });

  const extras = normalized.filter(
    (item) => !preferredOrder.includes(String(item.status).toLowerCase())
  );

  return [...ordered, ...extras];
}

function formatStatusLabel(status) {
  const value = String(status || "").trim();
  if (!value) return "Unknown";

  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function Dashboard() {
  const { token, user, logout } = useAuth();
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
  const statusBreakdown = normalizeStatusBreakdown(
    data?.statusBreakdown || data?.revenueByStatus || []
  );
  const timeseries = data?.timeseries || [];

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/analyteca-logo.png"
              alt="Analyteca"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                Analyteca
              </span>
              <span className="text-xs text-slate-500">
                Commerce intelligence
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-emerald-700">
                Connected
              </span>
            </div>

            <div className="hidden rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 sm:block">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
                Account
              </div>
              <div className="text-sm font-medium text-slate-700">
                {user?.email || user?.name || "Authenticated user"}
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-6 py-6">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Commerce analytics
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Revenue, orders, product mix, and status performance for
              Testlicious.
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
              className="
                inline-flex h-11 items-center gap-2 rounded-full
                bg-gradient-to-r from-sky-500 to-cyan-500
                px-6 text-sm font-semibold text-white
                shadow-[0_10px_24px_rgba(14,165,233,0.28)]
                transition-all duration-200
                hover:scale-[1.01] hover:from-sky-600 hover:to-cyan-600
                active:scale-[0.99]
                disabled:cursor-not-allowed disabled:opacity-70
              "
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync Now"}</span>
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Revenue" value={formatMoney(data?.revenue)} />
          <MetricCard label="Orders" value={formatNumber(data?.orders)} />
          <MetricCard label="AOV" value={formatMoney(data?.aov)} />
          <MetricCard label="Refunds" value={formatMoney(data?.refunds)} />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 xl:grid-cols-[1.65fr_0.95fr]">
          <RevenueOverTimeChart data={timeseries} loading={loading} />
          <StatusBreakdownPanel items={statusBreakdown} loading={loading} />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 xl:grid-cols-[1.7fr_1fr]">
          <TopProductsTable products={topProducts} loading={loading} />
          <RevenueByStatusDonut data={revenueByStatus} loading={loading} />
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.65fr_0.95fr]">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Performance insights
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Executive summary styled like modern commerce analytics tools.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <InfoCard
                title="Sync confidence"
                description={`Last synced at ${formatDateTime(
                  data?.lastSyncedAt
                )}`}
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
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Selected range
              </h2>
              <p className="mt-1 text-sm text-slate-500">Quick period context</p>
            </div>

            <div className="space-y-5">
              <RangeBlock label="From" value={range.from} />
              <RangeBlock label="To" value={range.to} />
              <RangeBlock
                label="Data source"
                value={data?.sourceLabel || apiBaseUrl || "Magento"}
              />
              <RangeBlock
                label="Last synced at"
                value={formatDateTime(data?.lastSyncedAt)}
              />
            </div>
          </section>
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
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div className="text-base font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm leading-6 text-slate-600">{description}</div>
    </div>
  );
}

function RangeBlock({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
      <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold text-slate-900">
        {value || "—"}
      </div>
    </div>
  );
}

function StatusBreakdownPanel({ items, loading }) {
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Status breakdown
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Order and revenue contribution by Magento order status
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <>
            <StatusBreakdownSkeleton />
            <StatusBreakdownSkeleton />
            <StatusBreakdownSkeleton />
          </>
        ) : safeItems.length ? (
          safeItems.map((item) => (
            <StatusBreakdownRow
              key={String(item.status).toLowerCase()}
              status={item.status}
              orders={item.orders}
              revenue={item.revenue}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No status breakdown data available for the selected period.
          </div>
        )}
      </div>
    </section>
  );
}

function StatusBreakdownRow({ status, orders, revenue }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0 flex-1">
          <div className="text-[18px] font-semibold text-slate-950">
            {formatStatusLabel(status)}
          </div>
          <div className="text-sm text-slate-500">Order status</div>
        </div>

        <div className="flex min-w-[120px] flex-col items-end gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Orders</div>
            <div className="text-[16px] font-semibold text-slate-950">
              {formatNumber(orders)}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-500">Revenue</div>
            <div className="text-[16px] font-semibold text-slate-950">
              {formatMoney(revenue)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBreakdownSkeleton() {
  return (
    <div className="animate-pulse rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
      <div className="flex items-center justify-between gap-6">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="h-4 w-24 rounded bg-slate-200" />
        </div>

        <div className="flex min-w-[120px] flex-col items-end gap-3">
          <div className="space-y-2 text-right">
            <div className="ml-auto h-3 w-12 rounded bg-slate-200" />
            <div className="ml-auto h-5 w-12 rounded bg-slate-200" />
          </div>

          <div className="space-y-2 text-right">
            <div className="ml-auto h-3 w-14 rounded bg-slate-200" />
            <div className="ml-auto h-5 w-20 rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
