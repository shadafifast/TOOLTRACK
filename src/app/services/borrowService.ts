import { apiCall, BASE_URL, getToken } from "./api";
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
  status?: BorrowStatus | "all" | string;
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
  todayBorrows?: number; 
  todayReturns?: number;
}

export async function getBorrows(params: GetBorrowsParams = {}): Promise<GetBorrowsResponse> {
  const q = new URLSearchParams();
  if (params.status && params.status !== "all")     q.set("status",     params.status);
  if (params.toolId)     q.set("toolId",     params.toolId);
  if (params.employeeId) q.set("employeeId", params.employeeId);
  if (params.search)     q.set("search",     params.search);
  if (params.page)       q.set("page",       String(params.page));
  if (params.limit)      q.set("limit",      String(params.limit));
  return apiCall<GetBorrowsResponse>(`/borrows?${q.toString()}`);
}

export async function getToolBorrowHistory(toolId: string): Promise<BorrowRecord[]> {
  return apiCall<BorrowRecord[]>(`/tools/${toolId}/history`);
}

export async function createBorrow(payload: BorrowPayload): Promise<BorrowRecord> {
  return apiCall<BorrowRecord>("/borrows", { method: "POST", body: payload });
}

export async function returnBorrow(borrowId: string, payload: ReturnPayload): Promise<BorrowRecord> {
  return apiCall<BorrowRecord>(`/borrows/${borrowId}/return`, { method: "PATCH", body: payload });
}

export async function quickBorrow(toolId: string, employeeId: string): Promise<BorrowRecord> {
  const estimatedReturnDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return apiCall<BorrowRecord>("/borrows/quick", { method: "POST", body: { toolId, employeeId, estimatedReturnDate } });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  return apiCall<DashboardStats>("/dashboard/stats");
}

export async function exportBorrows(format: "csv" | "pdf"): Promise<void> {
  const token = getToken();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  
  const res = await fetch(`${BASE_URL}/borrows/export?format=${format}`, { headers });
  if (!res.ok) throw new Error("Gagal mengunduh file");
  
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `riwayat-peminjaman.${format}`;
  a.click();
}
