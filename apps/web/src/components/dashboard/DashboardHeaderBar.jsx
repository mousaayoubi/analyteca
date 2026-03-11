import analytecaLogo from "/analyteca-logo.png";

export default function DashboardHeaderBar({
  apiBaseUrl,
  userEmail,
  role,
  tokenPreview,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-sky-100 bg-sky-50">
            <img
              src={analytecaLogo}
              alt="Analyteca"
              className="h-9 w-9 object-contain"
            />
          </div>

          <div>
            <div className="text-[30px] font-semibold tracking-tight text-slate-900">
              Analyteca
            </div>
            <div className="text-sm text-slate-500">Magento Analytics Dashboard</div>
          </div>
        </div>

        <div className="hidden items-center gap-4 xl:flex">
          <InfoPill label="API Base URL" value={apiBaseUrl} />
          <InfoPill label="Signed in as" value={userEmail} helper={`Role: ${role}`} />
          <InfoPill label="Token" value={tokenPreview} mono />
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Connected
          </div>

          <button
            onClick={onLogout}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mx-auto block w-full max-w-[1600px] px-6 pb-5 xl:hidden lg:px-8">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <InfoPill label="API Base URL" value={apiBaseUrl} />
          <InfoPill label="Signed in as" value={userEmail} helper={`Role: ${role}`} />
          <InfoPill label="Token" value={tokenPreview} mono />
        </div>
      </div>
    </header>
  );
}

function InfoPill({ label, value, helper, mono = false }) {
  return (
    <div className="min-w-[240px] rounded-[22px] border border-sky-100 bg-slate-50 px-5 py-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
        {label}
      </div>
      <div className={`mt-2 text-sm font-semibold text-slate-900 ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
      {helper ? <div className="mt-1 text-xs text-slate-500">{helper}</div> : null}
    </div>
  );
}
