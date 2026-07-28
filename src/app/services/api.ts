export const BASE_URL = import.meta.env.VITE_API_URL as string ?? "http://localhost:5000/api";

export function getToken(): string | null {
  return localStorage.getItem("token");
}

function authHeader(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

export async function apiCall<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = "GET", body } = options;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) { 
        clearToken(); 
        if (window.location.pathname !== '/login') {
            window.location.href = "/login"; 
        }
    }
    const errData = await response.json().catch(() => ({}));
    throw new Error((errData as { message?: string }).message ?? `HTTP Error ${response.status}`);
  }

  const data = await response.json();
  return data.data as T;
}
