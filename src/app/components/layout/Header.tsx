// ─── Layout: Header ────────────────────────────────────────────────────────────
import { Search, Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="bg-white border-b border-border px-4 md:px-6 py-3 md:py-3.5 flex items-center justify-between flex-shrink-0 gap-3">
      <div className="min-w-0">
        <h1 className="text-sm md:text-base font-semibold text-slate-900 leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5 hidden md:block">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Pencarian hanya tampil di layar md ke atas */}
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari cepat..."
            className="pl-8 pr-4 py-2 text-xs bg-slate-50 border border-border rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
        {/* TODO: Sambungkan ke sistem notifikasi */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
        </button>
        {/* TODO: Ganti dengan avatar user yang sedang login */}
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">RP</span>
        </div>
      </div>
    </div>
  );
}
