// ─── API Base Utility ─────────────────────────────────────────────────────────
// File ini adalah pondasi untuk semua pemanggilan HTTP ke Back-End.
// Semua fungsi service menggunakan `apiCall` dari file ini.
//
// 🔧 CARA PAKAI (untuk tim Back-End):
// 1. Atur BASE_URL ke alamat server kalian (misal: http://localhost:8000/api)
// 2. Sistem token sudah siap — token disimpan di localStorage setelah login
// 3. Semua request otomatis menyertakan Authorization header
// ─────────────────────────────────────────────────────────────────────────────

// URL Back-End diambil dari file .env.local (lihat .env.example untuk panduan)
// Untuk mengganti: buka .env.local dan ubah nilai VITE_API_URL
// Tidak perlu menyentuh file kode ini sama sekali!
export const BASE_URL = import.meta.env.VITE_API_URL as string ?? "/api";

/** Ambil token dari localStorage (disimpan saat login) */
function getToken(): string | null {
  return localStorage.getItem("token");
}

/** Buat Authorization header secara otomatis */
function authHeader(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Simpan token ke localStorage setelah login berhasil */
export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

/** Hapus token dari localStorage saat logout */
export function clearToken() {
  localStorage.removeItem("token");
}

// ─── Generic Fetch Wrapper ────────────────────────────────────────────────────

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}

/**
 * Fungsi utama untuk memanggil API.
 * Secara otomatis menambahkan header JSON dan token autentikasi.
 *
 * @param endpoint - Path API, misal: "/tools" atau "/borrows/BR-001/return"
 * @param options  - Method HTTP dan body request (opsional)
 * @returns Data JSON dari server
 * @throws Error jika respons server bukan 2xx
 *
 * @example
 * // GET
 * const tools = await apiCall<Tool[]>("/tools");
 *
 * // POST
 * const borrow = await apiCall<BorrowRecord>("/borrows", {
 *   method: "POST",
 *   body: { toolId: "TL-001", employeeId: "EMP001" }
 * });
 */
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
    // TODO: Tambahkan handler untuk error 401 (redirect ke /login)
    // if (response.status === 401) { clearToken(); window.location.href = "/login"; }
    const errData = await response.json().catch(() => ({}));
    throw new Error((errData as { message?: string }).message ?? `HTTP Error ${response.status}`);
  }

  return response.json() as Promise<T>;
}
