import { apiCall } from "./api";
import type { Employee } from "../types";

export interface GetEmployeesParams {
  search?: string;
  department?: string;
}

export async function getEmployees(params: GetEmployeesParams = {}): Promise<Employee[]> {
  const q = new URLSearchParams();
  if (params.search)     q.set("search",     params.search);
  if (params.department && params.department !== "all") q.set("department", params.department);
  return apiCall<Employee[]>(`/employees?${q.toString()}`);
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  return apiCall<Employee>(`/employees/${id}`);
}

export interface Department {
  id: number;
  name: string;
}

export async function getDepartments(): Promise<Department[]> {
  return apiCall<Department[]>("/employees/departments");
}
