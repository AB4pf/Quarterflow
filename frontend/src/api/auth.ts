// Thin wrapper around the auth endpoints. No UI here — teammates can
// call these from whatever components/forms they build.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface AuthResponse {
  token: string;
  user: { id: number; email: string; name: string };
}

async function handle(res: Response) {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export function register(email: string, password: string, name: string): Promise<AuthResponse> {
  return fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  }).then(handle);
}

export function login(email: string, password: string): Promise<AuthResponse> {
  return fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handle);
}

export function me(token: string) {
  return fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handle);
}
