import { apiFetch } from "./http";

export function fetchSummary({ token, from, to } = {}) {
	const params = new URLSearchParams();
	if (from) params.set("from", from);
	if (to) params.set("to", to);

	const qs = params.toString();
	return apiFetch(`/metrics/summary${qs ? `?${qs}` : ""}`, { token });
}
