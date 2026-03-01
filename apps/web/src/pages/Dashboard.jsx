// apps/web/src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../auth/AuthContext";
import { getApiBaseUrl } from "../api/http";

export default function Dashboard() {
  const { user, token, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/analyteca-logo.png" alt="Analyteca" className="h-8 w-auto" />
            <div>
              <div className="text-sm font-semibold text-slate-900">Analyteca</div>
              <div className="text-xs text-slate-500">Magento Analytics Dashboard</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Connected
            </span>

            <button
              onClick={logout}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs text-slate-500">API Base URL</div>
            <div className="mt-1 font-mono text-sm text-slate-900">{getApiBaseUrl()}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs text-slate-500">Signed in as</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{user?.email || "—"}</div>
            <div className="text-xs text-slate-500">Role: {user?.role || "—"}</div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="text-xs text-slate-500">Token</div>
            <div className="mt-1 font-mono text-sm text-slate-900">
              {token ? `${token.slice(0, 18)}…${token.slice(-10)}` : "—"}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Next</h2>
          <p className="mt-1 text-sm text-slate-600">
            Add charts here (revenue, orders, AOV) using your Node endpoint: <span className="font-mono">/metrics/summary</span>.
          </p>
        </div>
      </main>
    </div>
  );
}
