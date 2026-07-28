// ─── Shared Components ──────────────────────────────────────────────────────────
// Komponen kecil yang dipakai ulang di banyak halaman

import type { ToolStatus, BorrowStatus } from "../../types";
import { QRCodeSVG as QRCodeLib } from "qrcode.react";

// Konfigurasi tampilan badge status alat
const statusCfg: Record<ToolStatus, { label: string; bg: string; text: string; dot: string; border: string }> = {
  available: { label: "Tersedia",  bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-200" },
  borrowed:  { label: "Dipinjam", bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500",    border: "border-blue-200" },
  overdue:   { label: "Terlambat",bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-500",     border: "border-red-200" },
  damaged:   { label: "Rusak",    bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-500",   border: "border-amber-200" },
};

// Konfigurasi tampilan badge status peminjaman
const borrowCfg: Record<BorrowStatus, { label: string; bg: string; text: string }> = {
  active:   { label: "Aktif",        bg: "bg-blue-50",    text: "text-blue-700" },
  returned: { label: "Dikembalikan", bg: "bg-emerald-50", text: "text-emerald-700" },
  overdue:  { label: "Terlambat",    bg: "bg-red-50",     text: "text-red-700" },
};

/** Badge status untuk alat (Tersedia, Dipinjam, Terlambat, Rusak) */
export function StatusBadge({ status }: { status: ToolStatus }) {
  const c = statusCfg[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

/** Badge status untuk record peminjaman (Aktif, Dikembalikan, Terlambat) */
export function BorrowBadge({ status }: { status: BorrowStatus }) {
  const c = borrowCfg[status];
  return <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
}

/**
 * QR Code ASLI yang mengandung ID alat — bisa di-scan oleh kamera.
 * Menggunakan library qrcode.react untuk generate QR code standard.
 */
export function QRCodeSVG({ id, size = 100 }: { id: string; size?: number }) {
  return (
    <div
      id={`qr-svg-${id}`}
      className="bg-white rounded p-1 inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <QRCodeLib
        value={id}
        size={size - 8}
        level="M"
        bgColor="#ffffff"
        fgColor="#111827"
      />
    </div>
  );
}

