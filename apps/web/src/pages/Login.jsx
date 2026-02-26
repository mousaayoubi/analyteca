import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
	const { login } = useAuth();
	const nav = useNavigate();
	const loc = useLocation();

	const from = loc.state?.from || "/";

	const [email, setEmail] = useState("admin@analyteca.com");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState("");

	async function onSubmit(e) {
		e.preventDafault();
		setErr("");
		setLoading(true);
		try {
			await login(email, password);
			nav(from, { replace: true });
		} catch (e) {
			setErr(e?.data?.error || e?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-lg">
        <div className="mb-6">
          <div className="text-sm text-slate-400">Analyteca</div>
          <h1 className="text-2xl font-semibold">Sign in</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Use your Analyteca API credentials.
          </p>
        </div>

        {err ? (
          <div className="mb-4 rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {err}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              className="mt-1 w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              className="mt-1 w-full rounded-lg bg-slate-950/60 border border-slate-800 px-3 py-2 outline-none focus:border-slate-600"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-white text-slate-900 font-medium py-2 hover:bg-slate-200 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 text-xs text-slate-500">
          Tip: your Node API must be running on <code>VITE_API_BASE_URL</code>.
        </div>
      </div>
    </div>
	);
}
