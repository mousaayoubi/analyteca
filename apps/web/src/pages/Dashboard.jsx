import { useCallback, useEffect, useMemo, useState } from "react";
import DashboardHeaderBar from "../components/dashboard/DashboardHeaderBar";
import DateRangeBar from "../components/dashboard/DateRangeBar";
import MetricCard from "../components/dashboard/MetricCard";
import SectionCard from "../components/dashboard/SectionCard";
import RevenueTrendChart from "../components/dashboard/RevenueTrendChart";
import { fetchSummary } from "../api/metrics";
import { getApiBaseUrl } from "../api/http";
import { useAuth } from "../auth/AuthContext";
import {
  Activity,
  BadgeDollarSign,
  CreditCard,
  RefreshCw,
  ShoppingCart,
  Wallet,
} from "lucide-react";

function formatMoney(value) {
  const amount = Number(value || 0);
  return amount.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function formatDateInput(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function getDefaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 60);

  return {
    from: formatDateInput(from),
    to: formatDateInput(to),
  };
}

function formatDisplayDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString();
}

function normalizeTimeseries(payload) {
  const raw =
    payload?.timeseries ||
    payload?.revenueSeries ||
    payload?.daily ||
    payload?.series ||
    payload?.chart ||
    [];

  if (!Array.isArray(raw)) return [];

  return raw.map((item, index) => {
    const label =
      item.label ||
      item.date ||
      item.day ||
      item.period ||
      item.name ||
      `Point ${index + 1}`;

    return {
      label,
      date: item.date || item.day || item.label || label,
      revenue: Number(
        item.revenue ??
          item.totalRevenue ??
          item.grand_total ??
          item.amount ??
          0
      ),
      orders: Number(
        item.orders ??
          item.orderCount ??
          item.totalOrders ??
          item.count ??
          0
      ),
      aov: Number(
        item.aov ??
          item.averageOrderValue ??
          item.avgOrderValue ??
          0
      ),
    };
  });
}

function normalizeStatusBreakdown(payload) {
  const raw =
    payload?.statusBreakdown ||
    payload?.statuses ||
    payload?.status_breakdown ||
    [];

  if (!Array.isArray(raw)) return [];

  return raw.map((item) => ({
    status: item.status || item.name || "Unknown",
    orders: Number(item.orders ?? item.count ?? 0),
    revenue: Number(item.revenue ?? item.amount ?? 0),
  }));
}

function normalizeSummary(payload) {
  const revenue =
    payload?.revenue ??
    payload?.totalRevenue ??
    payload?.summary?.revenue ??
    0;

  const orders =
    payload?.orders ??
    payload?.totalOrders ??
    payload?.summary?.orders ??
    0;

  const aov =
    payload?.aov ??
    payload?.averageOrderValue ??
    payload?.summary?.aov ??
    (Number(orders) > 0 ? Number(revenue) / Number(orders) : 0);

  const refunds =
    payload?.refunds ??
    payload?.totalRefunds ??
    payload?.summary?.refunds ??
    0;

  return {
    revenue: Number(revenue || 0),
    orders: Number(orders || 0),
    aov: Number(aov || 0),
    refunds: Number(refunds || 0),
    timeseries: normalizeTimeseries(payload),
    statusBreakdown: normalizeStatusBreakdown(payload),
    lastSyncedAt:
      payload?.lastSyncedAt ||
      payload?.syncedAt ||
      payload?.fetchedAt ||
      payload?.updatedAt ||
      null,
    sourceLabel:
      payload?.sourceLabel ||
      payload?.source ||
      "Custom Magento API",
  };
}

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const [range, setRange] = useState(getDefaultRange());
  const [data, setData] = useState({
    revenue: 0,
    orders: 0,
    aov: 0,
    refunds: 0,
    timeseries: [],
    statusBreakdown: [],
    lastSyncedAt: null,
    sourceLabel: "Custom Magento API",
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(
    async ({ from, to }, isManualSync = false) => {
      try {
        setError("");
        if (isManualSync) {
          setSyncing(true);
        } else {
          setLoading(true);
        }

        const response = await fetchSummary({
          from,
          to,
          token,
        });

        setData(normalizeSummary(response));
      } catch (err) {
        setError(
          err?.message || "Failed to load analytics summary from Testlicious."
        );
      } finally {
        setLoading(false);
        setSyncing(false);
      }
    },
    [token]
  );

  useEffect(() => {
    loadDashboard(range);
  }, [range, loadDashboard]);

  const handleRangeChange = (key, value) => {
    setRange((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setRange(getDefaultRange());
  };

  const handleSyncNow = async () => {
    await loadDashboard(range, true);
  };

  const statusCards = data.statusBreakdown.length
    ? data.statusBreakdown
    : [
        { status: "Complete", orders: 0, revenue: 0 },
        { status: "Pending", orders: 0, revenue: 0 },
        { status: "Processing", orders: 0, revenue: 0 },
      ];

  return (
    <div className="min-h-screen bg-[#F4F8FC]">
      <DashboardHeaderBar
        user={user}
        apiBaseUrl={apiBaseUrl}
        onSignOut={logout}
      />

      <main className="mx-auto w-full max-w-[1600px] px-6 py-6 lg:px-8 lg:py-8">
        <div className="space-y-6">
          <DateRangeBar
            title="Metrics Summary"
            subtitle="Pulled from your Node API: /api/metrics/summary"
            sourceLabel={data.sourceLabel}
            lastSyncedAt={data.lastSyncedAt}
            from={range.from}
            to={range.to}
            loading={loading}
            syncing={syncing}
            onChange={handleRangeChange}
            onReset={handleReset}
            onSync={handleSyncNow}
          />

          {error ? (
            <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700 shadow-sm">
              {error}
            </div>
          ) : null}

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Revenue"
              value={formatMoney(data.revenue)}
              icon={BadgeDollarSign}
              tone="primary"
              subtitle="Total revenue for selected period"
            />
            <MetricCard
              title="Orders"
              value={formatNumber(data.orders)}
              icon={ShoppingCart}
              tone="sky"
              subtitle="Orders captured from Testlicious"
            />
            <MetricCard
              title="AOV"
              value={formatMoney(data.aov)}
              icon={CreditCard}
              tone="cyan"
              subtitle="Average order value"
            />
            <MetricCard
              title="Refunds"
              value={formatMoney(data.refunds)}
              icon={Wallet}
              tone="slate"
              subtitle="Refunded amount in selected range"
            />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
            <SectionCard
              title="Revenue trend"
              description={`Live revenue performance from ${formatDisplayDate(
                range.from
              )} to ${formatDisplayDate(range.to)}`}
              action={
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700">
                  <Activity className="h-4 w-4" />
                  Live from Testlicious
                </div>
              }
            >
              <RevenueTrendChart data={data.timeseries} loading={loading} />
            </SectionCard>

            <SectionCard
              title="Status breakdown"
              description="Order and revenue contribution by Magento order status"
            >
              <div className="space-y-3">
                {statusCards.map((item) => (
                  <div
                    key={item.status}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-sky-200 hover:shadow-sm"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {item.status}
                      </div>
                      <div className="text-xs text-slate-500">
                        Order status
                      </div>
                    </div>

                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <div className="text-xs text-slate-500">Orders</div>
                        <div className="text-base font-semibold text-slate-900">
                          {formatNumber(item.orders)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">Revenue</div>
                        <div className="text-base font-semibold text-slate-900">
                          {formatMoney(item.revenue)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <SectionCard
              title="Performance insights"
              description="Executive summary styled like modern commerce analytics tools"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-4">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <RefreshCw className="h-5 w-5 text-sky-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Sync confidence
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Manual sync and visible last-sync timestamp give the dashboard
                    an operations-grade feel.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50 to-sky-50 p-4">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <BadgeDollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Revenue-first layout
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    The top fold highlights revenue, order volume, AOV, and refunds
                    exactly like a production analytics dashboard.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-cyan-50 to-slate-50 p-4">
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Activity className="h-5 w-5 text-cyan-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Trend visibility
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Revenue trend chart makes anomalies, growth, and dips visible at
                    a glance for Testlicious.
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              title="Selected range"
              description="Quick period context"
            >
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    From
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {formatDisplayDate(range.from)}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
                    To
                  </div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">
                    {formatDisplayDate(range.to)}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-500 to-cyan-500 p-4 text-white">
                  <div className="text-xs uppercase tracking-[0.14em] text-white/80">
                    Data source
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {data.sourceLabel}
                  </div>
                </div>
              </div>
            </SectionCard>
          </section>
        </div>
      </main>
    </div>
  );
}
