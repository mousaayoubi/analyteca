const API_BASE = import.meta.env.VITE_API_BASE_URL;

function getToken() {
	return localStorage.getItem("token") || "";
}

export async function apiFetch(path, { method = "GET", body, headers = {}, auth = true } = {}) {
	const h = { "Content-Type": "application/json", ...headers };
	if (auth) {
		const t = getToken();
		if (t) h.Authorization = `Bearer ${t}`;
	}

	const res = await fetch(`$API_BASE}${path}`, {
		method,
		headers: h,
		body: body ? JSON.stringify(body) : undefined,
	});

	const text = await res.text();
	let data = null;
	try {
		data = text ? JSON.parse(text) : null;
	} catch {
		data = { raw: text };
	}

	if (!res.ok) {
		const err = new Error(data?.message || data?.error || `Request failed (${res.status})`);
		err.status = res.status;
		err.data = data;
		throw err;
	}

	return data;
}
