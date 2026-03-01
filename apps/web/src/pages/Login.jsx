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
		<div className="min-h-screen bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center px-4">
      {/* subtle brand glow background */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-400 blur-3xl" />
        <div className="absolute top-40 left-1/3 h-72 w-72 rounded-full bg-brandBlue-500 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md rounded-2xl border border-slate-300 bg-white shadow-xl">
        <div className="p-7">
          {/* Logo */}
          <div className="flex items-center justify-center">
            <img
              src="/analyteca-logo.png"
              alt="Analyteca"
              className="h-60 w-auto drop-shadow-lg"
            />
          </div>

          <div className="mt-5 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Sign in
            </h1>
            <p className="text-l font-semibold text-slate-900">
              Use your Analyteca API credentials.
            </p>
          </div>

          <form className="mt-6 space-y-4">
            <div>
              <label className="text-3xl font-semibold text-slate-500">Email</label>
              <input
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30"
                placeholder="admin@analyteca.com"
                // value=...
                // onChange=...
              />
            </div>

            <div>
              <label className="text-3xl font-semibold text-slate-500">Password</label>
              <input
                type="password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/30"
                placeholder="••••••••"
                // value=...
                // onChange=...
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-brandBlue-600 to-brand-400 py-3 font-semibold text-slate-950 shadow-lg shadow-brand-400/20 hover:opacity-95 disabled:opacity-60"
            >
              Sign in
            </button>

            <p className="pt-2 text-xs text-slate-500">
		<div className="text-center">
              <span className="text-center text-brand-300">Analyteca © 2026 </span>
		</div>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
