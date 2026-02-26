import { apiFetch } from "./http";

export function magentoPing() {
	return apiFetch("/magento/ping", { method: "GET" });
}
