const tabs = [
  { key: "overview", label: "Overview" },
  { key: "charts", label: "Charts" },
  { key: "orders", label: "Orders" },
  { key: "products", label: "Products" },
  { key: "sync-logs", label: "Sync Logs" }
];

export default function DashboardTabs({ tab, onChange }) {
  return (
    <div className="mb-6 overflow-x-auto">
      <div className="inline-flex min-w-full gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        {tabs.map((item) => {
          const active = tab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={[
                "rounded-xl px-4 py-2 text-sm font-medium transition",
                active
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
