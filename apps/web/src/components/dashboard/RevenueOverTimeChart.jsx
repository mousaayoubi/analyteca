import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatMoney(n) {
  return Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatNumber(n) {
  return Number(n || 0).toLocaleString();
}

export default function RevenueOverTimeChart({ data = [], loading = false }) {
  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">
          Sales over time
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Daily sales trend for the selected Testlicious date range.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-sm text-slate-500">
          Loading revenue trend...
        </div>
      ) : data.length === 0 ? (
        <div className="py-16 text-center text-sm text-slate-500">
          No timeseries data found for the selected range.
        </div>
      ) : (
        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 12, right: 20, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#CBD5E1" }}
                minTickGap={24}
              />
              <YAxis
                tickFormatter={(value) => `$${Number(value || 0)}`}
                tick={{ fill: "#64748B", fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#CBD5E1" }}
                width={64}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 16,
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                }}
                formatter={(value, name, payload) => {
                  if (name === "revenue") return [formatMoney(value), "Revenue"];
                  if (name === "orders") return [formatNumber(value), "Orders"];
                  if (name === "aov") return [formatMoney(value), "AOV"];
                  return [value, name];
                }}
                labelFormatter={(label, payload) => {
                  const item = payload?.[0]?.payload;
                  return item?.date || label;
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563EB"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
