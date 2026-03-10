import SectionCard from "./SectionCard";
import EmptyStateCard from "./EmptyStateCard";

function formatMoney(n) {
  return Number(n || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD"
  });
}

export default function RecentOrdersTable({
  title,
  orders,
  loading,
  fullHeight
}) {
  return (
    <SectionCard title={title}>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : !(orders || []).length ? (
        <EmptyStateCard
          title="No orders found"
          description="No orders are available for this date range."
        />
      ) : (
        <div
          className={`overflow-hidden rounded-2xl border border-gray-200 ${
            fullHeight ? "min-h-[420px]" : ""
          }`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.entity_id || order.increment_id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      #{order.increment_id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.customer_name || order.customer_email || "Guest"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {order.status || "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      {formatMoney(order.grand_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
