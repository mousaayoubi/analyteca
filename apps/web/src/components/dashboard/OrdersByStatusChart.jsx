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

export default function OrdersByStatusChart({ title, data, loading }) {
  const normalized = (data || []).map((item) => ({
    status: item.status,
    orders: Number(item.orders || 0)
  }));

  return (
    <SectionCard title={title}>
      {loading ? (
        <div className="h-72 animate-pulse rounded-2xl bg-gray-100" />
      ) : !normalized.length ? (
        <EmptyStateCard
          title="No order status data"
          description="No order breakdown data is available for this date range."
        />
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={normalized}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </SectionCard>
  );
}
