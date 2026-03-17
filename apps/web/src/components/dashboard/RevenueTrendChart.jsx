import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function formatMoney(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function RevenueTrendChart({ data, loading }) {
  if (loading) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
        Loading revenue trend...
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm font-medium text-slate-500">
        No revenue trend data available for the selected range.
      </div>
    );
  }

  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#11D8E7" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#0F6FFF" stopOpacity={0.04} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#E2E8F0" strokeDasharray="4 4" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748B", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `$${Number(value || 0).toLocaleString()}`}
            tick={{ fill: "#64748B", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid #E2E8F0",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            }}
            formatter={(value, name, item) => {
              if (name === "revenue") return [formatMoney(value), "Revenue"];
              if (name === "orders") return [value, "Orders"];
              return [value, name];
            }}
            labelFormatter={(label, payload) => {
              const point = payload?.[0]?.payload;
              return point?.date || label;
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#0F6FFF"
            strokeWidth={3}
            fill="url(#revenueFill)"
            activeDot={{ r: 5, fill: "#11D8E7", stroke: "#0F6FFF" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
