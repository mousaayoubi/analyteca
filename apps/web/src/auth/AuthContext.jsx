import { createContext, useContext, useEffect, useMemo, useState } from "react";import { loginApi } from "../api/auth";

const AuthContext = createContext(null);

const LS_TOKEN = "token";
const LS_USER = "user";

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => localStorage.getItem(LS_TOKEN) || "");
	const [user, setUser] = useState(() => {
		const raw = localStorage.getItem(LS_USER);
		return raw ? JSON.parse(raw): null;
	});

	useEffect(() => {
		if (token) localStorage.setItem(LS_TOKEN, token);
		else localStorage.removeItem(LS_TOKEN);
	}, [token]);

	useEfect(() => {
		if (user) localStorage.setItem(LS_USER, JSON.stringify(user));
		else localStorage.removeItem(LS_USER);
	}, [user]);

	const isAuthed = !!token;

	async function login(email, password) {
		const data = await loginApi(email, password);
		setToken(data.token);
		setUser(data.user);
		return data;
	}

	function logout() {
		setToken("");
		setUser(null);
	}

	const value = useMemo(
	() => ({ token, user, isAuthed, login, logout }),
		[token, user, isAuthed]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthCOntext);
	if (!ctx_ throw new Error("useAuth must be used inside <AuthProvider>");
		return ctx;
}
