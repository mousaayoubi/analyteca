import { apiFetch } from "./http";

export async function loginRequest({ email, password }) {
  return apiFetch("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}
