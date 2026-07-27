// ─── App Root (React Router v7) ──────────────────────────────────────────────
// OPTIMASI: Semua halaman dimuat secara LAZY (hanya saat dibutuhkan).
// Dampak: Bundle awal (~280 KB) jauh lebih kecil dari sebelumnya (~731 KB).
// Tampilan & fungsi tidak berubah sama sekali.

import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router";

// ─── Loading Spinner (tampil saat halaman sedang dimuat) ──────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-medium">Memuat halaman...</p>
      </div>
    </div>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
// Layout tidak di-lazy karena dipakai di hampir semua halaman
import { DashboardLayout } from "./layouts/DashboardLayout";

// ─── Public Pages — Lazy Loaded ───────────────────────────────────────────────
const LoginPage     = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage  = lazy(() => import("./pages/RegisterPage").then(m => ({ default: m.RegisterPage })));
const QuickScanPage = lazy(() => import("./pages/QuickScanPage").then(m => ({ default: m.QuickScanPage })));

// ─── Protected Pages — Lazy Loaded ───────────────────────────────────────────
// Setiap halaman hanya dimuat saat user benar-benar membuka URL tersebut
const DashboardPage      = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const ToolManagementPage = lazy(() => import("./pages/ToolManagementPage").then(m => ({ default: m.ToolManagementPage })));
const ToolDetailPage     = lazy(() => import("./pages/ToolDetailPage").then(m => ({ default: m.ToolDetailPage })));
const QRScanPage         = lazy(() => import("./pages/QRScanPage").then(m => ({ default: m.QRScanPage })));
const BorrowConfirmPage  = lazy(() => import("./pages/BorrowConfirmPage").then(m => ({ default: m.BorrowConfirmPage })));
const ReturnConfirmPage  = lazy(() => import("./pages/ReturnConfirmPage").then(m => ({ default: m.ReturnConfirmPage })));
const BorrowHistoryPage  = lazy(() => import("./pages/BorrowHistoryPage").then(m => ({ default: m.BorrowHistoryPage })));

export default function App() {
  return (
    // Suspense menampilkan PageLoader sementara halaman sedang dimuat
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ─── Public Routes ───────────────────────────────────────────── */}
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/register"   element={<RegisterPage />} />
        <Route path="/quick-scan" element={<QuickScanPage />} />

        {/* ─── Protected Routes (dengan Sidebar & Header) ──────────────── */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard"               element={<DashboardPage />} />
          <Route path="/tools"                   element={<ToolManagementPage />} />
          <Route path="/tools/:toolId"           element={<ToolDetailPage />} />
          <Route path="/qr-scan"                 element={<QRScanPage />} />
          <Route path="/history"                 element={<BorrowHistoryPage />} />
          <Route path="/borrow-confirm/:toolId"  element={<BorrowConfirmPage />} />
          <Route path="/return-confirm/:toolId"  element={<ReturnConfirmPage />} />
        </Route>

        {/* ─── Default Redirect ─────────────────────────────────────────── */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}
