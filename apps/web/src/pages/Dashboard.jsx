import { useEffect, useState } from "react";
import { magentoPing } from "../api/magento";
import { useAuth } from "../auth/AuthContext";

function Badge({ ok, text }) {
	return (
		<span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm",
        ok
          ? "border-emerald-900/60 bg-emerald-950/40 text-emerald-200"
          : "border-amber-900/60 bg-amber-950/40 text-amber-200",
      ].join(" ")}
    >
      <span className={["h-2 w-2 rounded-full", ok ? "bg-emerald-400" : "bg-amber-400"].join(" ")} />
      {text}
    </span>
  );
}

export default function Dashboard() {
	const { user, logout } = useAuth();
	const [conn, setConn] = useState({ status: "idle", data: null, err: "" });
	async function check() {
		setConn({ status: "loading", data: null, err: ""});
		try {
			const data = await magentoPing();
			setConn({ status: "ok", data, err: "" });
		} catch (e) {
			setConn({ status: "fail", data: null, err: e?.data?.message || e?.message || "Not connected" });
		}
	}

	useEffect(() => {
		check();
	}, []);

	const connected = conn.status === "ok";

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-400">Analyteca</div>
            <div className="text-lg font-semibold">Dashboard</div>
          </div>

          <div className="flex items-center gap-3">
            {conn.status === "loading" ? (
              <Badge ok={false} text="Checking Magento..." />
            ) : connected ? (
              <Badge ok={true} text="Connected" />
            ) : (
              <Badge ok={false} text="Not connected" />
            )}

            <button
              onClick={check}
              className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm hover:bg-slate-900"
            >
              Recheck
            </button>

            <button
              onClick={logout}
              className="rounded-lg bg-white text-slate-900 px-3 py-2 text-sm font-medium hover:bg-slate-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-slate-400">Signed in as</div>
              <div className="font-medium">{user?.email || "—"}</div>
              <div className="text-xs text-slate-500 mt-1">Role: {user?.role || "—"}</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-slate-400">Magento Ping</div>
              {connected ? (
                <div className="mt-1 text-sm text-slate-200">
                  Total Orders: <span className="font-semibold">{conn.data?.total_count ?? "—"}</span>
                </div>
              ) : (
                <div className="mt-1 text-sm text-amber-200">{conn.err}</div>
              )}
            </div>
          </div>

          {connected && conn.data?.sample ? (
            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <div className="text-sm text-slate-400 mb-2">Sample order</div>
              <pre className="text-xs overflow-auto">{JSON.stringify(conn.data.sample, null, 2)}</pre>
            </div>
          ) : null}
        </div>
      </main>
    </div>
	);
}
