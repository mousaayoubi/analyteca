import { env } from "../../config/env.js";
import { getAdminToken, resetAdminTokenCache } from "./magento.adminToken.js";

function baseUrl() {
  return env.MAGENTO_BASE_URL.replace(/\/$/, "");
}

export async function magentoGet(path, params = {}) {
  const url = new URL(baseUrl() + path);

  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  }

  let token = await getAdminToken();

  // 1st attempt
  let res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  // If token expired/invalid, refresh once and retry
  if (res.status === 401) {
    resetAdminTokenCache();
    token = await getAdminToken();

    res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const err = new Error(data?.message || `Magento request failed (${res.status})`);
    err.status = res.status;
    err.details = data;
    err.url = url.toString();
    throw err;
  }

  return data;
}
