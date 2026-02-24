import { env } from "../../config/env.js";

let cached = {
  token: null,
  // unix ms timestamp when we should refresh
  refreshAt: 0,
};

// Set conservative refresh (admin tokens often last ~1 hour depending on config)
const DEFAULT_TTL_MS = 55 * 60 * 1000;

export async function getAdminToken() {
  const now = Date.now();
  if (cached.token && now < cached.refreshAt) return cached.token;

  const url = env.MAGENTO_BASE_URL.replace(/\/$/, "") + "/rest/V1/integration/admin/token";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      username: env.MAGENTO_ADMIN_USER,
      password: env.MAGENTO_ADMIN_PASS,
    }),
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = data?.message || `Failed to get admin token (${res.status})`;
    const err = new Error(msg);
    err.status = res.status;
    err.details = data;
    throw err;
  }

  // Magento returns token as JSON string: "eyJ...."
  const token = typeof data === "string" ? data : String(data);
  // strip surrounding quotes if any
  const clean = token.replace(/^"+|"+$/g, "");

  cached.token = clean;
  cached.refreshAt = Date.now() + DEFAULT_TTL_MS;

  return clean;
}

// Optional: allow manual reset (useful if creds change)
export function resetAdminTokenCache() {
  cached = { token: null, refreshAt: 0 };
}
