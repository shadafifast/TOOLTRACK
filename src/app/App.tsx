// ─── App Root (React Router v7) ──────────────────────────────────────────────
// PERBAIKAN BUG: Suspense dipindah ke tiap route secara individual.
// Sebelumnya: 1 Suspense membungkus semua Routes → navigasi ke lazy page stuck,
//             harus refresh baru bisa pindah halaman.
// Sesudah:    Setiap route punya Suspense sendiri → navigasi langsung tanpa refresh.

import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router";

// ─── Loading Spinner ──────────────────────────────────────────────────────────
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

// Helper agar tidak perlu tulis <Suspense> berulang di setiap route
function Lazy({ component: Component }: { component: React.ComponentType }) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// ─── Layout ───────────────────────────────────────────────────────────────────
import { DashboardLayout } from "./layouts/DashboardLayout";

// ─── Public Pages — Lazy Loaded ───────────────────────────────────────────────
const LoginPage     = lazy(() => import("./pages/LoginPage").then(m => ({ default: m.LoginPage })));
const RegisterPage  = lazy(() => import("./pages/RegisterPage").then(m => ({ default: m.RegisterPage })));
const QuickScanPage = lazy(() => import("./pages/QuickScanPage").then(m => ({ default: m.QuickScanPage })));

// ─── Protected Pages — Lazy Loaded ───────────────────────────────────────────
const DashboardPage      = lazy(() => import("./pages/DashboardPage").then(m => ({ default: m.DashboardPage })));
const ToolManagementPage = lazy(() => import("./pages/ToolManagementPage").then(m => ({ default: m.ToolManagementPage })));
const ToolDetailPage     = lazy(() => import("./pages/ToolDetailPage").then(m => ({ default: m.ToolDetailPage })));
const QRScanPage         = lazy(() => import("./pages/QRScanPage").then(m => ({ default: m.QRScanPage })));
const BorrowConfirmPage  = lazy(() => import("./pages/BorrowConfirmPage").then(m => ({ default: m.BorrowConfirmPage })));
const ReturnConfirmPage  = lazy(() => import("./pages/ReturnConfirmPage").then(m => ({ default: m.ReturnConfirmPage })));
const BorrowHistoryPage  = lazy(() => import("./pages/BorrowHistoryPage").then(m => ({ default: m.BorrowHistoryPage })));

export default function App() {
  return (
    <Routes>
      {/* ─── Public Routes ─────────────────────────────────────────────── */}
      {/* Setiap route punya <Suspense> sendiri → navigasi tidak pernah stuck */}
      <Route path="/login"      element={<Lazy component={LoginPage} />} />
      <Route path="/register"   element={<Lazy component={RegisterPage} />} />
      <Route path="/quick-scan" element={<Lazy component={QuickScanPage} />} />

      {/* ─── Protected Routes (dengan Sidebar & Header) ──────────────────── */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard"               element={<Lazy component={DashboardPage} />} />
        <Route path="/tools"                   element={<Lazy component={ToolManagementPage} />} />
        <Route path="/tools/:toolId"           element={<Lazy component={ToolDetailPage} />} />
        <Route path="/qr-scan"                 element={<Lazy component={QRScanPage} />} />
        <Route path="/history"                 element={<Lazy component={BorrowHistoryPage} />} />
        <Route path="/borrow-confirm/:toolId"  element={<Lazy component={BorrowConfirmPage} />} />
        <Route path="/return-confirm/:toolId"  element={<Lazy component={ReturnConfirmPage} />} />
      </Route>

      {/* ─── Default Redirect ─────────────────────────────────────────────── */}
      <Route path="/"  element={<Navigate to="/login" replace />} />
      <Route path="*"  element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
