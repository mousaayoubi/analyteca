import { apiFetch } from "./http";

export function fetchSummary(range = {}, token) {
  const { from, to } = range;

  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);

  const qs = params.toString();

  return apiFetch(`/api/metrics/summary${qs ? `?${qs}` : ""}`, {
    method: "GET",
    token,
  });
}

export async function triggerSync(token) {
  return apiFetch("/api/integrations/magento/sync", {
    method: "POST",
    token,
  });
}
