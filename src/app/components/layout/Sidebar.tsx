// ─── Layout: Sidebar ───────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Wrench, QrCode, History, LogOut } from "lucide-react";
import { getMe, logout } from "../../services/authService";
import type { Employee } from "../../types";

export function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [user, setUser] = useState<Employee | null>(null);

  useEffect(() => {
    getMe().then(setUser).catch(console.error);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const nav = [
    { path: "/dashboard", label: "Dasbor",             icon: <LayoutDashboard size={17} /> },
    { path: "/tools",     label: "Manajemen Alat",     icon: <Wrench size={17} /> },
    { path: "/qr-scan",   label: "Scanner QR",         icon: <QrCode size={17} /> },
    { path: "/history",   label: "Riwayat Peminjaman", icon: <History size={17} /> },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className="w-[220px] flex-shrink-0 bg-slate-900 flex flex-col h-full">
      {/* Logo & Brand */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/30">
            <QrCode size={19} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-tight tracking-tight">ToolTrack QR</div>
            <div className="text-slate-500 text-xs mt-0.5">Sistem Aset TIK</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-3 px-2.5 overflow-y-auto">
        <div className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-2 mb-1">Navigasi</div>
        {nav.map(item => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-0.5 ${
              isActive(item.path)
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="px-3 py-3.5 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{user ? user.avatar : "..."}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-xs font-semibold truncate">{user ? user.name : "Memuat..."}</div>
            <div className="text-slate-500 text-[10px] truncate">{user ? user.position : ""}</div>
          </div>
          <button onClick={handleLogout} title="Keluar" className="text-slate-600 hover:text-red-400 transition-colors p-1">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
