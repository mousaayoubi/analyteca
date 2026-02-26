import { apiFetch } from "./http";

export function loginApi(email, password) {
	return apiFetch("/auth/login", {
		method: "POST",
		auth: false,
		body: { email, password },
	});
}
