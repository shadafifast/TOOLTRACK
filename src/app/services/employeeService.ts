// ─── Employee Service ─────────────────────────────────────────────────────────
// Semua fungsi yang berhubungan dengan data Karyawan (Employee).
//
// 🔧 UNTUK TIM BACK-END:
// Endpoint yang dibutuhkan:
//   GET /api/employees              → response: Employee[]  (query: ?search=&department=)
//   GET /api/employees/:id          → response: Employee
//   GET /api/employees/departments  → response: string[] (daftar nama departemen)
// ─────────────────────────────────────────────────────────────────────────────

import { employees as mockEmployees } from "../data/mockData";
import type { Employee } from "../types";

export interface GetEmployeesParams {
  search?: string;
  department?: string;
}

// ─── Fungsi-fungsi Service ────────────────────────────────────────────────────

/** Ambil daftar semua karyawan */
export async function getEmployees(params: GetEmployeesParams = {}): Promise<Employee[]> {
  // ✅ MOCK DATA:
  const { search = "", department = "all" } = params;
  return mockEmployees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = department === "all" || e.department === department;
    return matchSearch && matchDept;
  });

  // 🔌 REAL API:
  // const q = new URLSearchParams();
  // if (params.search)     q.set("search",     params.search);
  // if (params.department) q.set("department", params.department);
  // return apiCall<Employee[]>(`/employees?${q.toString()}`);
}

/** Ambil detail satu karyawan berdasarkan ID */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  // ✅ MOCK DATA:
  return mockEmployees.find(e => e.id === id) ?? null;

  // 🔌 REAL API:
  // return apiCall<Employee>(`/employees/${id}`);
}

/** Ambil daftar semua departemen */
export async function getDepartments(): Promise<string[]> {
  // ✅ MOCK DATA:
  return [...new Set(mockEmployees.map(e => e.department))].sort();

  // 🔌 REAL API:
  // return apiCall<string[]>("/employees/departments");
}
