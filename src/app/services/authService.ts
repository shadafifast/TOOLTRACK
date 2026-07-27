// ─── Auth Service ─────────────────────────────────────────────────────────────
// Semua fungsi yang berhubungan dengan autentikasi (login, register, logout).
//
// 🔧 UNTUK TIM BACK-END:
// Endpoint yang dibutuhkan:
//   POST /api/auth/login    → body: { email, password } → response: { token, user }
//   POST /api/auth/register → body: { name, email, dept, position, phone, password } → response: { token, user }
//   POST /api/auth/logout   → (opsional, untuk invalidasi token di server)
//   GET  /api/auth/me       → response: { user } (untuk validasi session yang masih aktif)
// ─────────────────────────────────────────────────────────────────────────────

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

// ─── MOCK DATA (AKTIF) ────────────────────────────────────────────────────────
// Blok kode di bawah ini adalah implementasi SEMENTARA menggunakan data palsu.
// Saat Back-End siap, hapus blok MOCK DATA dan uncomment blok REAL API.

/** Login user dan simpan token ke localStorage */
export async function login(payload: LoginPayload): Promise<AuthResponse> {
  // ✅ MOCK DATA (hapus ini saat Back-End siap):
  console.log("[authService] login mock →", payload.email);
  const mockUser: Employee = {
    id: "EMP005", name: "Reza Pratama", department: "Manajemen IT",
    position: "Manajer IT", email: payload.email, phone: "+62 816-5678-9012",
    avatar: "RP", activeBorrows: 0, totalBorrows: 18,
  };
  saveToken("mock-jwt-token-12345");
  return { token: "mock-jwt-token-12345", user: mockUser };

  // 🔌 REAL API (uncomment saat Back-End siap):
  // const data = await apiCall<AuthResponse>("/auth/login", { method: "POST", body: payload });
  // saveToken(data.token);
  // return data;
}

/** Daftar user baru */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  // ✅ MOCK DATA:
  console.log("[authService] register mock →", payload.name);
  const mockUser: Employee = {
    id: "EMP999", name: payload.name, department: payload.department,
    position: payload.position, email: payload.email, phone: payload.phone ?? "",
    avatar: payload.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),
    activeBorrows: 0, totalBorrows: 0,
  };
  saveToken("mock-jwt-token-new-user");
  return { token: "mock-jwt-token-new-user", user: mockUser };

  // 🔌 REAL API:
  // const data = await apiCall<AuthResponse>("/auth/register", { method: "POST", body: payload });
  // saveToken(data.token);
  // return data;
}

/** Logout dan hapus token */
export async function logout(): Promise<void> {
  // ✅ MOCK DATA:
  clearToken();
  console.log("[authService] logout mock");

  // 🔌 REAL API:
  // await apiCall("/auth/logout", { method: "POST" }).catch(() => {});
  // clearToken();
}

/** Ambil data user yang sedang login */
export async function getMe(): Promise<Employee> {
  // ✅ MOCK DATA:
  return {
    id: "EMP005", name: "Reza Pratama", department: "Manajemen IT",
    position: "Manajer IT", email: "reza.pratama@company.com", phone: "+62 816-5678-9012",
    avatar: "RP", activeBorrows: 0, totalBorrows: 18,
  };

  // 🔌 REAL API:
  // return apiCall<Employee>("/auth/me");
}
