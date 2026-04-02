import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#64748b",
];

function formatMoney(n) {
  return Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function RevenueByStatusDonut({ data = [], loading = false }) {
  const totalRevenue = data.reduce((sum, item) => sum + Number(item?.revenue || 0), 0);

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">
          Sales by status
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Order sales distribution by status for the selected range.
        </p>
      </div>

      {loading ? (
        <div className="py-14 text-center text-sm text-slate-500">
          Loading status chart...
        </div>
      ) : data.length === 0 ? (
        <div className="py-14 text-center text-sm text-slate-500">
          No status revenue data found for the selected range.
        </div>
      ) : (
        <>
          <div className="relative h-[340px]">
            <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
              <div className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                Total Sales
              </div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {formatMoney(totalRevenue)}
              </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="revenue"
                  nameKey="status"
                  innerRadius={78}
                  outerRadius={120}
                  paddingAngle={3}
                  stroke="#ffffff"
                  strokeWidth={3}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.status}-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name, ctx) => [
                    formatMoney(value),
                    ctx?.payload?.status || name,
                  ]}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  formatter={(value, entry) => {
                    const payload = entry?.payload || {};
                    return `${payload.status || value} — ${formatMoney(payload.revenue || 0)}`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-3">
            {data.map((item, index) => (
              <div
                key={`${item.status}-${index}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div className="text-sm font-medium capitalize text-slate-800">
                    {item.status}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    {formatMoney(item.revenue)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {Number(item.orders || 0).toLocaleString()} orders
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
