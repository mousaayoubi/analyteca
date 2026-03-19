import { RefreshCw, BadgeDollarSign, Activity } from "lucide-react";

export default function PerformanceInsightsSection() {
  const items = [
    {
      title: "Sync confidence",
      description:
        "Manual sync and visible last-sync timestamp give the dashboard an operations-grade feel.",
      icon: RefreshCw,
      cardBg: "#E8F6FB",
      iconColor: "#0B84D8",
    },
    {
      title: "Revenue-first layout",
      description:
        "The top fold highlights revenue, order volume, AOV, and refunds exactly like a production analytics dashboard.",
      icon: BadgeDollarSign,
      cardBg: "#EFF4FA",
      iconColor: "#2563EB",
    },
    {
      title: "Trend visibility",
      description:
        "Revenue trend chart makes anomalies, growth, and dips visible at a glance for Testlicious.",
      icon: Activity,
      cardBg: "#EEF9FB",
      iconColor: "#0991B1",
    },
  ];

  return (
    <section
      className="rounded-[40px] border border-[#D6DEE7] bg-[#F7F8FA] shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
      style={{
        padding: "38px 36px 108px",
      }}
    >
      <div className="mb-10">
        <h2 className="text-[26px] leading-none font-semibold tracking-[-0.02em] text-[#0A1F44]">
          Performance insights
        </h2>
        <p className="mt-4 text-[18px] font-normal text-[#5E7695]">
          Executive summary styled like modern commerce analytics tools
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-[28px] border border-[#D8E3EC]"
              style={{
                backgroundColor: item.cardBg,
                padding: "24px 24px 26px",
                minHeight: "308px",
              }}
            >
              <div
                className="mb-5 flex h-[62px] w-[62px] items-center justify-center rounded-[18px] border border-[#D7E0E8] bg-white shadow-[0_4px_10px_rgba(15,23,42,0.08)]"
              >
                <Icon
                  size={28}
                  strokeWidth={2.2}
                  color={item.iconColor}
                />
              </div>

              <h3 className="text-[19px] font-semibold leading-[1.25] text-[#0A1F44]">
                {item.title}
              </h3>

              <p className="mt-3 max-w-[240px] text-[18px] leading-[1.65] text-[#4D6788]">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
