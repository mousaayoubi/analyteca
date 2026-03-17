import { LogOut } from "lucide-react";

export default function DashboardHeaderBar({
  user,
  apiBaseUrl,
  onSignOut,
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-4">
          <img
            src="/analyteca-logo.png"
            alt="Analyteca"
            className="h-10 w-auto object-contain"
          />

          <div>
            <h1 className="text-[20px] font-semibold tracking-tight text-slate-900">
              Analyteca
            </h1>
            <p className="text-sm text-slate-500">
              Magento Analytics Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 md:flex md:items-center md:gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Connected
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
