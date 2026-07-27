// ─── Dashboard Layout ─────────────────────────────────────────────────────────
// Layout ini digunakan oleh semua halaman yang membutuhkan Sidebar dan Header.
// <Outlet /> adalah tempat di mana halaman yang aktif akan dirender oleh React Router.

import { Outlet, useLocation } from "react-router";
import { Sidebar } from "../components/layout/Sidebar";
import { Header }  from "../components/layout/Header";

// Peta metadata judul & subjudul berdasarkan prefix URL
const pageMeta: Record<string, { title: string; sub: string }> = {
  "/dashboard":        { title: "Dasbor",                  sub: "Selamat datang kembali, Reza. Ini ringkasan hari ini." },
  "/tools":            { title: "Manajemen Alat",           sub: "Kelola inventori, kode QR, dan catatan alat." },
  "/qr-scan":          { title: "Scanner QR",              sub: "Pindai kode QR alat untuk meminjam atau mengembalikan." },
  "/history":          { title: "Riwayat Peminjaman",       sub: "Jejak audit lengkap semua transaksi alat." },
  "/borrow-confirm":   { title: "Konfirmasi Peminjaman",    sub: "Konfirmasi transaksi peminjaman alat." },
  "/return-confirm":   { title: "Konfirmasi Pengembalian",  sub: "Catat pengembalian dan kondisi alat." },
};

export function DashboardLayout() {
  const { pathname } = useLocation();

  // Cocokkan URL saat ini ke metadata halaman (menggunakan prefix match)
  const metaKey = Object.keys(pageMeta).find(key => pathname.startsWith(key)) ?? "/dashboard";
  const meta = pageMeta[metaKey];

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden">
      {/* Sidebar hanya tampil di layar md ke atas */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={meta?.title ?? ""} subtitle={meta?.sub} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
