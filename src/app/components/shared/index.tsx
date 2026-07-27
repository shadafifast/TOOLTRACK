// ─── Shared Components ──────────────────────────────────────────────────────────
// Komponen kecil yang dipakai ulang di banyak halaman

import type { ToolStatus, BorrowStatus } from "../../types";

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

/** Komponen QR Code generatif berbasis ID alat (untuk tampilan preview, bukan QR asli) */
export function QRCodeSVG({ id, size = 100 }: { id: string; size?: number }) {
  const M = 21;
  const c = size / M;
  const seed = id.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0);
  function cell(r: number, col: number): boolean {
    if (r < 7 && col < 7) {
      if (r === 0 || r === 6 || col === 0 || col === 6) return true;
      return r >= 2 && r <= 4 && col >= 2 && col <= 4;
    }
    if (r < 7 && col >= M - 7) {
      const lc = col - (M - 7);
      if (r === 0 || r === 6 || lc === 0 || lc === 6) return true;
      return r >= 2 && r <= 4 && lc >= 2 && lc <= 4;
    }
    if (r >= M - 7 && col < 7) {
      const lr = r - (M - 7);
      if (lr === 0 || lr === 6 || col === 0 || col === 6) return true;
      return lr >= 2 && lr <= 4 && col >= 2 && col <= 4;
    }
    if (r === 6 && col >= 8 && col <= M - 9) return col % 2 === 0;
    if (col === 6 && r >= 8 && r <= M - 9) return r % 2 === 0;
    return ((seed * 31 + r * 19 + col * 7) % 100) < 42;
  }
  const rects = [];
  for (let r = 0; r < M; r++) for (let col = 0; col < M; col++) {
    if (cell(r, col)) rects.push(<rect key={`${r}-${col}`} x={col * c} y={r * c} width={c - 0.3} height={c - 0.3} fill="#111827" />);
  }
  return (
    <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" className="rounded bg-white p-1">
      {rects}
    </svg>
  );
}
