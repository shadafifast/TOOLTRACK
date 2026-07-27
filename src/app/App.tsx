// ─── App Root (React Router v7) ──────────────────────────────────────────────
// File ini mengatur semua routing URL aplikasi.
// Setiap halaman sekarang punya URL sendiri (misal: /dashboard, /tools, dll)
// sehingga lebih profesional dan memudahkan debugging & deployment.

import { Routes, Route, Navigate } from "react-router";

// ─── Layout (Halaman yang memakai Sidebar & Header) ──────────────────────────
import { DashboardLayout } from "./layouts/DashboardLayout";

// ─── Public Pages (Tanpa Sidebar) ────────────────────────────────────────────
import { LoginPage }      from "./pages/LoginPage";
import { RegisterPage }   from "./pages/RegisterPage";
import { QuickScanPage }  from "./pages/QuickScanPage";

// ─── Protected Pages (Dengan Sidebar) ────────────────────────────────────────
import { DashboardPage }       from "./pages/DashboardPage";
import { ToolManagementPage }  from "./pages/ToolManagementPage";
import { ToolDetailPage }      from "./pages/ToolDetailPage";
import { QRScanPage }          from "./pages/QRScanPage";
import { BorrowConfirmPage }   from "./pages/BorrowConfirmPage";
import { ReturnConfirmPage }   from "./pages/ReturnConfirmPage";
import { BorrowHistoryPage }   from "./pages/BorrowHistoryPage";

export default function App() {
  return (
    <Routes>
      {/* ─── Public Routes (Tanpa Sidebar) ─────────────────────────── */}
      <Route path="/login"      element={<LoginPage />} />
      <Route path="/register"   element={<RegisterPage />} />
      <Route path="/quick-scan" element={<QuickScanPage />} />

      {/* ─── Protected Routes (Dengan Sidebar & Header) ─────────────── */}
      {/* DashboardLayout berisi Sidebar + Header, halaman dirender di dalamnya */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard"            element={<DashboardPage />} />
        <Route path="/tools"                element={<ToolManagementPage />} />
        <Route path="/tools/:toolId"        element={<ToolDetailPage />} />
        <Route path="/qr-scan"              element={<QRScanPage />} />
        <Route path="/history"              element={<BorrowHistoryPage />} />
        <Route path="/borrow-confirm/:toolId" element={<BorrowConfirmPage />} />
        <Route path="/return-confirm/:toolId" element={<ReturnConfirmPage />} />
      </Route>

      {/* ─── Default Redirect ───────────────────────────────────────── */}
      {/* Jika user membuka "/" langsung diarahkan ke halaman login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
