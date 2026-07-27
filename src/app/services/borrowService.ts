// ─── Borrow Service ───────────────────────────────────────────────────────────
// Semua fungsi yang berhubungan dengan peminjaman & pengembalian alat.
//
// 🔧 UNTUK TIM BACK-END:
// Endpoint yang dibutuhkan:
//   GET   /api/borrows                    → response: BorrowRecord[]  (query: ?status=&toolId=&employeeId=&page=&limit=)
//   POST  /api/borrows                    → body: BorrowPayload → response: BorrowRecord
//   PATCH /api/borrows/:id/return         → body: ReturnPayload → response: BorrowRecord
//   GET   /api/borrows/export?format=csv  → response: File (CSV)
//   GET   /api/borrows/export?format=pdf  → response: File (PDF)
//   GET   /api/dashboard/stats            → response: DashboardStats
// ─────────────────────────────────────────────────────────────────────────────

import { borrowHistory as mockHistory } from "../data/mockData";
import type { BorrowRecord, BorrowStatus } from "../types";

export interface BorrowPayload {
  toolId: string;
  employeeId: string;
  estimatedReturnDate: string;
  notes?: string;
}

export interface ReturnPayload {
  condition: "excellent" | "good" | "fair" | "damaged";
  notes?: string;
}

export interface GetBorrowsParams {
  status?: BorrowStatus | "all";
  toolId?: string;
  employeeId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetBorrowsResponse {
  data: BorrowRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface DashboardStats {
  totalTools: number;
  availableTools: number;
  borrowedTools: number;
  overdueTools: number;
  damagedTools: number;
  todayBorrows: number;
  todayReturns: number;
}

// ─── Fungsi-fungsi Service ────────────────────────────────────────────────────

/** Ambil semua riwayat peminjaman (dengan filter & pagination) */
export async function getBorrows(params: GetBorrowsParams = {}): Promise<GetBorrowsResponse> {
  // ✅ MOCK DATA:
  const { status = "all", toolId, employeeId, search = "", page = 1, limit = 8 } = params;
  const filtered = mockHistory.filter(r => {
    const matchStatus = status === "all" || r.status === status;
    const matchTool = !toolId || r.toolId === toolId;
    const matchEmp = !employeeId || r.employeeId === employeeId;
    const matchSearch =
      r.toolName.toLowerCase().includes(search.toLowerCase()) ||
      r.employeeName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchTool && matchEmp && matchSearch;
  });
  return { data: filtered.slice((page-1)*limit, page*limit), total: filtered.length, page, limit };

  // 🔌 REAL API:
  // const q = new URLSearchParams();
  // if (params.status)     q.set("status",     params.status);
  // if (params.toolId)     q.set("toolId",     params.toolId);
  // if (params.employeeId) q.set("employeeId", params.employeeId);
  // if (params.search)     q.set("search",     params.search);
  // if (params.page)       q.set("page",       String(params.page));
  // if (params.limit)      q.set("limit",      String(params.limit));
  // return apiCall<GetBorrowsResponse>(`/borrows?${q.toString()}`);
}

/** Ambil riwayat peminjaman satu alat berdasarkan toolId */
export async function getToolBorrowHistory(toolId: string): Promise<BorrowRecord[]> {
  // ✅ MOCK DATA:
  return mockHistory.filter(r => r.toolId === toolId);

  // 🔌 REAL API:
  // return apiCall<BorrowRecord[]>(`/tools/${toolId}/history`);
}

/** Buat peminjaman baru */
export async function createBorrow(payload: BorrowPayload): Promise<BorrowRecord> {
  // ✅ MOCK DATA:
  console.log("[borrowService] createBorrow mock →", payload);
  const newRecord: BorrowRecord = {
    id: `BR-${String(mockHistory.length + 1).padStart(3, "0")}`,
    toolId: payload.toolId,
    toolName: payload.toolId, // nama akan diisi oleh back-end
    employeeId: payload.employeeId,
    employeeName: payload.employeeId, // nama akan diisi oleh back-end
    department: "",
    borrowTime: new Date().toLocaleString("id-ID"),
    returnTime: null,
    duration: null,
    status: "active",
    condition: null,
    notes: payload.notes ?? null,
  };
  return newRecord;

  // 🔌 REAL API:
  // return apiCall<BorrowRecord>("/borrows", { method: "POST", body: payload });
}

/** Konfirmasi pengembalian alat */
export async function returnBorrow(borrowId: string, payload: ReturnPayload): Promise<BorrowRecord> {
  // ✅ MOCK DATA:
  console.log("[borrowService] returnBorrow mock →", borrowId, payload);
  const existing = mockHistory.find(r => r.id === borrowId)!;
  return {
    ...existing,
    returnTime: new Date().toLocaleString("id-ID"),
    status: "returned",
    condition: payload.condition,
    notes: payload.notes ?? null,
  };

  // 🔌 REAL API:
  // return apiCall<BorrowRecord>(`/borrows/${borrowId}/return`, { method: "PATCH", body: payload });
}

/** Ambil statistik untuk Dasbor */
export async function getDashboardStats(): Promise<DashboardStats> {
  // ✅ MOCK DATA:
  return {
    totalTools: 15,
    availableTools: 9,
    borrowedTools: 4,
    overdueTools: 2,
    damagedTools: 1,
    todayBorrows: 3,
    todayReturns: 1,
  };

  // 🔌 REAL API:
  // return apiCall<DashboardStats>("/dashboard/stats");
}

/** Ekspor data riwayat (CSV atau PDF) */
export async function exportBorrows(format: "csv" | "pdf"): Promise<void> {
  // ✅ MOCK DATA:
  console.log(`[borrowService] export mock → format: ${format}`);
  alert(`Fitur ekspor ${format.toUpperCase()} akan tersedia setelah Back-End terhubung.`);

  // 🔌 REAL API:
  // const res = await fetch(`${BASE_URL}/borrows/export?format=${format}`, { headers: authHeader() });
  // const blob = await res.blob();
  // const url = URL.createObjectURL(blob);
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = `riwayat-peminjaman.${format}`;
  // a.click();
}
