import { apiCall, saveToken, clearToken } from "./api";
import type { Employee } from "../types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  department: string;
  position: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Employee;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const data = await apiCall<AuthResponse>("/auth/login", { method: "POST", body: payload });
  saveToken(data.token);
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const data = await apiCall<AuthResponse>("/auth/register", { method: "POST", body: payload });
  saveToken(data.token);
  return data;
}

export async function logout(): Promise<void> {
  await apiCall("/auth/logout", { method: "POST" }).catch(() => {});
  clearToken();
}

export async function getMe(): Promise<Employee> {
  return apiCall<Employee>("/auth/me");
}
