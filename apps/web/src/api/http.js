// apps/web/src/api/http.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:3000";

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch(path, { method = "GET", token, headers, body } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const res = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      `Request failed (${res.status})`;
    throw new ApiError(msg, { status: res.status, data });
  }

  return data;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
