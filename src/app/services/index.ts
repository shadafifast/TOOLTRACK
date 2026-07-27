// ─── Services Index ───────────────────────────────────────────────────────────
// File ini mengekspor semua service ke satu titik masuk.
// Gunakan import dari sini agar konsisten di seluruh aplikasi.
//
// Contoh penggunaan di halaman manapun:
//   import { getTools, createBorrow, login } from "../services";
// ─────────────────────────────────────────────────────────────────────────────

export * from "./authService";
export * from "./toolService";
export * from "./borrowService";
export * from "./employeeService";
