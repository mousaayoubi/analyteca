export default function SectionCard({
  title,
  description,
  action,
  children,
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          ) : null}
        </div>

        {action ? <div>{action}</div> : null}
      </div>

      {children}
    </section>
  );
}
