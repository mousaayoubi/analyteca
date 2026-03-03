import { apiFetch } from "./http";

export async function fetchLastSync({ token }) {
  return apiFetch("/sync/last", { token });
}

export async function runSyncNow({ token, from, to }) {
  return apiFetch("/sync/run", {
    method: "POST",
    token,
    body: { from, to },
  });
}
