import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import SectionCard from "./SectionCard";
import EmptyStateCard from "./EmptyStateCard";

function formatMoney(n) {
  return Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD"
  });
}

export default function RevenueTrendChart({ title, data, loading }) {
  const normalized = (data || []).map((item) => ({
    date: item.date,
    revenue: Number(item.revenue || 0)
  }));

  return (
    <SectionCard title={title}>
      {loading ? (
        <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
      ) : !normalized.length ? (
        <EmptyStateCard
          title="No revenue data"
          description="No revenue trend data is available for this date range."
        />
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={normalized}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Area
                type="monotone"
                dataKey="revenue"
                strokeWidth={2}
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </SectionCard>
  );
}
