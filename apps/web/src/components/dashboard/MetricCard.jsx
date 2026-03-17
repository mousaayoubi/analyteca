const toneMap = {
  primary:
    "from-[#0F6FFF] to-[#11D8E7] text-white shadow-sky-200",
  sky:
    "from-sky-500 to-blue-500 text-white shadow-sky-200",
  cyan:
    "from-cyan-500 to-sky-500 text-white shadow-cyan-200",
  slate:
    "from-slate-700 to-slate-500 text-white shadow-slate-200",
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "primary",
}) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-500">{title}</div>
          <div className="mt-3 text-[34px] font-semibold tracking-tight text-slate-950">
            {value}
          </div>
          <div className="mt-2 text-sm text-slate-500">{subtitle}</div>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ${toneMap[tone]}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
