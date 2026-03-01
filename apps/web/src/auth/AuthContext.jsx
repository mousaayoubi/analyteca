// apps/web/src/auth/AuthContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { loginRequest } from "../api/auth";

const AuthContext = createContext(null);

const LS_TOKEN_KEY = "analyteca_token";
const LS_USER_KEY = "analyteca_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(LS_TOKEN_KEY) || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(LS_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthenticated = !!token;

  async function login({ email, password }) {
    const data = await loginRequest({ email, password }); // { token, user }
    if (!data?.token) throw new Error("Login failed: token missing");

    setToken(data.token);
    setUser(data.user || null);

    localStorage.setItem(LS_TOKEN_KEY, data.token);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(data.user || null));

    return data;
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem(LS_TOKEN_KEY);
    localStorage.removeItem(LS_USER_KEY);
  }

  const value = useMemo(
    () => ({ token, user, isAuthenticated, login, logout }),
    [token, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}
