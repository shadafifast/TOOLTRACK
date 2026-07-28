import { apiCall, BASE_URL, getToken } from "./api";
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

export async function getTools(params: GetToolsParams = {}): Promise<GetToolsResponse> {
  const q = new URLSearchParams();
  if (params.search)   q.set("search",   params.search);
  if (params.status && params.status !== "all")   q.set("status",   params.status);
  if (params.category && params.category !== "all") q.set("category", params.category);
  if (params.page)     q.set("page",     String(params.page));
  if (params.limit)    q.set("limit",    String(params.limit));
  return apiCall<GetToolsResponse>(`/tools?${q.toString()}`);
}

export async function getToolById(id: string): Promise<Tool | null> {
  return apiCall<Tool>(`/tools/${id}`);
}

export async function createTool(payload: CreateToolPayload): Promise<Tool> {
  return apiCall<Tool>("/tools", { method: "POST", body: payload });
}

export async function updateTool(id: string, payload: Partial<Tool>): Promise<Tool> {
  return apiCall<Tool>(`/tools/${id}`, { method: "PUT", body: payload });
}

export async function deleteTool(id: string): Promise<void> {
  await apiCall(`/tools/${id}`, { method: "DELETE" });
}

export async function uploadToolPhoto(id: string, file: File): Promise<string> {
  const form = new FormData();
  form.append("photo", file);
  
  const token = getToken();
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  
  const res = await fetch(`${BASE_URL}/tools/${id}/photo`, {
    method: "POST",
    headers,
    body: form,
  });
  
  const resData = await res.json();
  if (!res.ok) {
     throw new Error(resData.message || "Failed to upload photo");
  }
  return resData.data.photoUrl;
}

export async function getToolCategories(): Promise<string[]> {
  return apiCall<string[]>("/tools/categories");
}

export async function getNextId(): Promise<{ nextId: string }> {
  return apiCall<{ nextId: string }>("/tools/next-id");
}
