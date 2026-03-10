import {
  BarChart,
  Bar,
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

export default function RevenueByStatusChart({ title, data, loading }) {
  const normalized = (data || []).map((item) => ({
    status: item.status,
    revenue: Number(item.revenue || 0)
  }));

  return (
    <SectionCard title={title}>
      {loading ? (
        <div className="h-80 animate-pulse rounded-2xl bg-gray-100" />
      ) : !normalized.length ? (
        <EmptyStateCard
          title="No status revenue data"
          description="No revenue-by-status data is available for this date range."
        />
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={normalized}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(value) => formatMoney(value)} />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </SectionCard>
  );
}
