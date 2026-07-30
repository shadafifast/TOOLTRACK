import { useState, useEffect, useRef } from "react";
import { useNavigate as useNav } from "react-router";
import { Search, Bell, LogOut, Shield, AlertTriangle, Clock } from "lucide-react";
import { getMe, logout } from "../../services/authService";
import { getTools } from "../../services/toolService";
import { getBorrows } from "../../services/borrowService";
import type { Employee, Tool, BorrowRecord } from "../../types";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNav();
  
  // User Profile
  const [user, setUser] = useState<Employee | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notifications
  const [notifications, setNotifications] = useState<BorrowRecord[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch User Profile
    getMe().then(setUser).catch(console.error);

    // Fetch Notifications (Recent borrows)
    getBorrows({ limit: 5 }).then(res => {
      setNotifications(res.data);
      // Unread counts based on overdue borrows
      const overdue = res.data.filter(b => b.status === "overdue").length;
      setUnreadCount(overdue > 0 ? overdue : 0);
    }).catch(console.error);
  }, []);

  // Quick Search Handler
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const delayDebounce = setTimeout(() => {
        getTools({ search: searchQuery, limit: 5 }).then(res => {
          setSearchResults(res.data);
          setShowSearchDropdown(true);
        }).catch(console.error);
      }, 300);
      return () => clearTimeout(delayDebounce);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchQuery]);

  // Click Outside Handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(`/tools/${searchResults[0].id}`);
      setShowSearchDropdown(false);
      setSearchQuery("");
    } else if (searchQuery.trim()) {
      getTools({ search: searchQuery.trim(), limit: 1 }).then(res => {
        if (res.data.length > 0) {
          navigate(`/tools/${res.data[0].id}`);
        } else {
          navigate(`/tools?search=${encodeURIComponent(searchQuery.trim())}`);
        }
        setShowSearchDropdown(false);
        setSearchQuery("");
      }).catch(() => {
        navigate(`/tools?search=${encodeURIComponent(searchQuery.trim())}`);
        setShowSearchDropdown(false);
        setSearchQuery("");
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  // Get Initials for Avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white border-b border-border px-4 md:px-6 py-3 md:py-3.5 flex items-center justify-between flex-shrink-0 gap-3 relative z-30">
      <div className="min-w-0">
        <h1 className="text-sm md:text-base font-semibold text-slate-900 leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5 hidden md:block">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* 1. Quick Search */}
        <div ref={searchRef} className="relative hidden md:block">
          <form onSubmit={handleSearchSubmit}>
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari cepat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 text-xs bg-slate-50 border border-border rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </form>

          {/* Search Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-border rounded-xl shadow-lg overflow-hidden py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 border-b border-slate-50 uppercase tracking-wider">Hasil Pencarian Cepat</div>
              {searchResults.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    navigate(`/tools/${tool.id}`);
                    setShowSearchDropdown(false);
                    setSearchQuery("");
                  }}
                  className="w-full px-3 py-2 hover:bg-slate-50 flex flex-col items-start text-left transition-colors"
                >
                  <span className="text-xs font-semibold text-slate-800 truncate w-full">{tool.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">{tool.id} · {tool.location}</span>
                </button>
              ))}
              <div className="p-2 border-t border-slate-50 text-center">
                <button
                  onClick={() => {
                    navigate(`/tools?search=${encodeURIComponent(searchQuery)}`);
                    setShowSearchDropdown(false);
                    setSearchQuery("");
                  }}
                  className="text-[10px] text-blue-600 font-bold hover:text-blue-700 transition-colors"
                >
                  Lihat semua hasil
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Notifications Dropdown */}
        <div ref={notificationsRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell size={17} />
            {unreadCount > 0 ? (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
            ) : notifications.length > 0 ? (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white" />
            ) : null}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-white border border-border rounded-xl shadow-lg overflow-hidden py-1 z-50">
              <div className="px-4 py-2.5 text-xs font-bold text-slate-900 border-b border-border flex items-center justify-between">
                <span>Notifikasi & Aktivitas</span>
                {unreadCount > 0 && (
                  <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-100">{unreadCount} Terlambat</span>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">Tidak ada aktivitas peminjaman.</div>
                ) : (
                  notifications.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => {
                        navigate(`/tools/${rec.toolId}`);
                        setShowNotifications(false);
                      }}
                      className="w-full px-4 py-3 hover:bg-slate-50 transition-colors text-left flex items-start gap-2.5"
                    >
                      <div className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${rec.status === "overdue" ? "bg-red-50 text-red-600" : rec.status === "returned" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                        {rec.status === "overdue" ? <AlertTriangle size={12} /> : <Clock size={12} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-700 leading-snug">
                          <span className="font-bold text-slate-900">{rec.employeeName}</span> {rec.status === "returned" ? "mengembalikan" : "meminjam"} <span className="font-bold text-slate-900">{rec.toolName}</span>.
                        </p>
                        {rec.status === "overdue" && (
                          <p className="text-[10px] text-red-500 font-semibold mt-0.5">Alat terlambat dikembalikan!</p>
                        )}
                        <span className="text-[9px] text-slate-400 block mt-1">{new Date(rec.borrowTime).toLocaleDateString("id-ID")}</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-border text-center">
                <button
                  onClick={() => {
                    navigate("/history");
                    setShowNotifications(false);
                  }}
                  className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors"
                >
                  Lihat Riwayat Lengkap
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity border-2 border-transparent focus:border-blue-300"
          >
            <span className="text-white text-xs font-bold">
              {user ? getInitials(user.name) : "RP"}
            </span>
          </button>

          {showProfile && user && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-border rounded-xl shadow-lg overflow-hidden py-1 z-50">
              <div className="px-4 py-3 border-b border-border bg-slate-50/50">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
                <div className="mt-2 flex flex-col gap-1 items-start">
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[9px] font-bold px-2 py-0.5 rounded-full capitalize flex items-center gap-1">
                    <Shield size={9} />
                    {user.role}
                  </span>
                  <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-semibold px-2 py-0.5 rounded-full">
                    {user.position}
                  </span>
                </div>
              </div>
              
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-semibold flex items-center gap-2 transition-colors text-left"
                >
                  <LogOut size={13} />
                  Logout / Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
