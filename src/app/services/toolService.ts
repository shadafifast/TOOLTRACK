// ─── Tool Service ─────────────────────────────────────────────────────────────
// Semua fungsi yang berhubungan dengan data Alat (Tool).
//
// 🔧 UNTUK TIM BACK-END:
// Endpoint yang dibutuhkan:
//   GET    /api/tools                → response: Tool[]  (mendukung query: ?search=&status=&category=&page=&limit=)
//   GET    /api/tools/:id            → response: Tool
//   POST   /api/tools                → body: CreateToolPayload → response: Tool (beserta QR code yang digenerate)
//   PUT    /api/tools/:id            → body: Partial<Tool> → response: Tool
//   DELETE /api/tools/:id            → response: { success: true }
//   GET    /api/tools/:id/history    → response: BorrowRecord[]
//   POST   /api/tools/:id/photo      → body: FormData (multipart) → response: { photoUrl: string }
// ─────────────────────────────────────────────────────────────────────────────

import { apiCall } from "./api";
import { tools as mockTools } from "../data/mockData";
import type { Tool, ToolStatus } from "../types";

export interface GetToolsParams {
  search?: string;
  status?: ToolStatus | "all";
  category?: string;
  page?: number;
  limit?: number;
}

export interface GetToolsResponse {
  data: Tool[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateToolPayload {
  name: string;
  category: string;
  location: string;
  serialNumber: string;
  purchaseDate: string;
  description: string;
}

// ─── Fungsi-fungsi Service ────────────────────────────────────────────────────

/** Ambil daftar semua alat (dengan filter & pagination) */
export async function getTools(params: GetToolsParams = {}): Promise<GetToolsResponse> {
  // ✅ MOCK DATA (hapus ini saat Back-End siap):
  const { search = "", status = "all", category = "all", page = 1, limit = 8 } = params;
  const filtered = mockTools.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === "all" || t.status === status;
    const matchCat = category === "all" || t.category === category;
    return matchSearch && matchStatus && matchCat;
  });
  const paginated = filtered.slice((page - 1) * limit, page * limit);
  return { data: paginated, total: filtered.length, page, limit };

  // 🔌 REAL API (uncomment saat Back-End siap):
  // const q = new URLSearchParams();
  // if (params.search)   q.set("search",   params.search);
  // if (params.status)   q.set("status",   params.status);
  // if (params.category) q.set("category", params.category);
  // if (params.page)     q.set("page",     String(params.page));
  // if (params.limit)    q.set("limit",    String(params.limit));
  // return apiCall<GetToolsResponse>(`/tools?${q.toString()}`);
}

/** Ambil detail satu alat berdasarkan ID */
export async function getToolById(id: string): Promise<Tool | null> {
  // ✅ MOCK DATA:
  return mockTools.find(t => t.id === id) ?? null;

  // 🔌 REAL API:
  // return apiCall<Tool>(`/tools/${id}`);
}

/** Tambah alat baru (QR code di-generate otomatis oleh Back-End) */
export async function createTool(payload: CreateToolPayload): Promise<Tool> {
  // ✅ MOCK DATA:
  console.log("[toolService] createTool mock →", payload);
  const newTool: Tool = {
    id: `TL-${String(mockTools.length + 1).padStart(3, "0")}`,
    ...payload,
    status: "available",
    lastUser: "-",
    lastScanTime: new Date().toISOString().slice(0, 16).replace("T", " "),
  };
  return newTool;

  // 🔌 REAL API:
  // return apiCall<Tool>("/tools", { method: "POST", body: payload });
}

/** Update data alat */
export async function updateTool(id: string, payload: Partial<Tool>): Promise<Tool> {
  // ✅ MOCK DATA:
  const existing = mockTools.find(t => t.id === id)!;
  return { ...existing, ...payload };

  // 🔌 REAL API:
  // return apiCall<Tool>(`/tools/${id}`, { method: "PUT", body: payload });
}

/** Hapus alat */
export async function deleteTool(id: string): Promise<void> {
  // ✅ MOCK DATA:
  console.log("[toolService] deleteTool mock →", id);

  // 🔌 REAL API:
  // await apiCall(`/tools/${id}`, { method: "DELETE" });
}

/** Upload foto alat */
export async function uploadToolPhoto(id: string, file: File): Promise<string> {
  // ✅ MOCK DATA:
  console.log("[toolService] uploadPhoto mock →", id, file.name);
  return URL.createObjectURL(file);

  // 🔌 REAL API:
  // const form = new FormData();
  // form.append("photo", file);
  // const res = await fetch(`${BASE_URL}/tools/${id}/photo`, {
  //   method: "POST",
  //   headers: authHeader(),
  //   body: form,
  // });
  // const data = await res.json();
  // return data.photoUrl;
}

/** Ambil semua kategori alat yang tersedia */
export async function getToolCategories(): Promise<string[]> {
  // ✅ MOCK DATA:
  return [...new Set(mockTools.map(t => t.category))];

  // 🔌 REAL API:
  // return apiCall<string[]>("/tools/categories");
}
