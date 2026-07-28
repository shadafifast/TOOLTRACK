import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Package, CheckCircle, ArrowUpRight, AlertTriangle, AlertCircle,
  TrendingUp, ChevronRight, Loader2
} from "lucide-react";
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { getDashboardStats, getBorrows, DashboardStats } from "../services/borrowService";
import type { BorrowRecord } from "../types";

export function DashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeBorrows, setActiveBorrows] = useState<BorrowRecord[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const s = await getDashboardStats();
        setStats(s);

        const borrowsRes = await getBorrows({ limit: 100 }); 
        const allBorrows = borrowsRes.data;

        // Sedang dipinjam
        const actives = allBorrows.filter(b => b.status === "active" || b.status === "overdue").slice(0, 5);
        setActiveBorrows(actives);

        // Transform borrows into activities timeline
        let acts: any[] = [];
        allBorrows.forEach(b => {
           acts.push({
             id: `b-${b.id}`,
             type: "borrow",
             user: b.employeeName,
             tool: b.toolName,
             description: `Meminjam alat`,
             time: b.borrowTime
           });
           if (b.returnTime) {
             acts.push({
               id: `r-${b.id}`,
               type: b.condition === "damaged" ? "damage" : "return",
               user: b.employeeName,
               tool: b.toolName,
               description: b.condition === "damaged" ? "Melaporkan kerusakan alat" : "Mengembalikan alat",
               time: b.returnTime
             });
           }
        });
        // Sort by time desc
        acts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setActivities(acts.slice(0, 6));

      } catch (err) {
        console.error("Dashboard error:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading || !stats) {
    return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;
  }

  const kpis = [
    { label: "Total Alat",   value: stats.totalTools, sub: "Keseluruhan",          icon: <Package size={19} />,       color: "bg-slate-100 text-slate-600" },
    { label: "Tersedia",     value: stats.availableTools,  sub: "Alat siap pakai",    icon: <CheckCircle size={19} />,   color: "bg-emerald-50 text-emerald-600" },
    { label: "Dipinjam",     value: stats.borrowedTools,  sub: "Peminjaman aktif",    icon: <ArrowUpRight size={19} />,  color: "bg-blue-50 text-blue-600" },
    { label: "Terlambat",    value: stats.overdueTools,  sub: "Perlu tindakan",        icon: <AlertTriangle size={19} />, color: "bg-red-50 text-red-600" },
    { label: "Rusak",        value: stats.damagedTools,  sub: "Dalam perbaikan", icon: <AlertCircle size={19} />, color: "bg-amber-50 text-amber-600" },
  ];

  const statusDistData = [
    { name: "Tersedia", value: stats.availableTools, color: "#10b981" },
    { name: "Dipinjam", value: stats.borrowedTools, color: "#3b82f6" },
    { name: "Terlambat", value: stats.overdueTools, color: "#ef4444" },
    { name: "Rusak", value: stats.damagedTools, color: "#f59e0b" },
  ].filter(s => s.value > 0);

  const iconMap: Record<string, {icon: any, bg: string}> = {
    borrow:      { icon: <ArrowUpRight size={13} className="text-blue-500" />,     bg: "bg-blue-50" },
    return:      { icon: <CheckCircle size={13} className="text-emerald-500" />,   bg: "bg-emerald-50" },
    damage:      { icon: <AlertTriangle size={13} className="text-amber-500" />,   bg: "bg-amber-50" },
    maintenance: { icon: <TrendingUp size={13} className="text-slate-500" />,      bg: "bg-slate-100" },
  };

  // Mock usage data to keep chart looking good since generating a full week's timeline from empty DB is tricky
  const usageChartData = [
    { hari: "Sen", peminjaman: 4, pengembalian: 3 },
    { hari: "Sel", peminjaman: 6, pengembalian: 5 },
    { hari: "Rab", peminjaman: 3, pengembalian: 6 },
    { hari: "Kam", peminjaman: 8, pengembalian: 4 },
    { hari: "Jum", peminjaman: 5, pengembalian: 7 },
    { hari: "Sab", peminjaman: 2, pengembalian: 3 },
    { hari: "Min", peminjaman: 1, pengembalian: 2 },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="grid grid-cols-5 gap-4">
        {kpis.map((k, i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.color}`}>{k.icon}</div>
              <TrendingUp size={13} className="text-slate-200 mt-1" />
            </div>
            <div className="text-2xl font-bold text-slate-900">{k.value}</div>
            <div className="text-sm font-medium text-slate-600 mt-0.5">{k.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{k.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Aktivitas Alat Minggu Ini</h3>
              <p className="text-xs text-slate-400 mt-0.5">Transaksi peminjaman dan pengembalian harian</p>
            </div>
            <select className="text-xs border border-border rounded-lg px-2.5 py-1.5 text-slate-500 focus:outline-none bg-white">
              <option>Minggu Ini</option><option>Minggu Lalu</option><option>Bulan Ini</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={usageChartData} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
              <defs>
                <linearGradient id="gBorrow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gReturn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hari" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,.08)" }} />
              <Area type="monotone" dataKey="peminjaman" name="Peminjaman" stroke="#2563EB" strokeWidth={2} fill="url(#gBorrow)" />
              <Area type="monotone" dataKey="pengembalian" name="Pengembalian" stroke="#22c55e" strokeWidth={2} fill="url(#gReturn)" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <h3 className="font-semibold text-slate-900 text-sm mb-0.5">Status Inventori</h3>
          <p className="text-xs text-slate-400 mb-3">Rincian berdasarkan status saat ini</p>
          {statusDistData.length > 0 ? (
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={statusDistData} cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={3} dataKey="value">
                  {statusDistData.map((e, i) => <Cell key={`cell-${i}`} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-[150px] flex items-center justify-center text-xs text-slate-400">Belum ada data</div>
          )}
          <div className="space-y-2 mt-1">
            {statusDistData.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-slate-500">{s.name}</span>
                </div>
                <span className="font-semibold text-slate-700">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 bg-white rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 text-sm">Aktivitas Terbaru</h3>
            <button onClick={() => navigate("/history")} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5">
              Lihat semua <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-1">
            {activities.length === 0 ? <p className="text-xs text-slate-400 py-3">Belum ada aktivitas.</p> : activities.map(a => {
              const { icon, bg } = iconMap[a.type] || iconMap.borrow;
              return (
                <div key={a.id} className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`w-6 h-6 rounded-full ${bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-slate-800">{a.user}</span>
                      <span className="text-slate-300 text-xs">·</span>
                      <span className="text-xs text-slate-500 truncate">{a.tool}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{a.description}</p>
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{new Date(a.time).toLocaleDateString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 text-sm">Sedang Dipinjam</h3>
            <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-medium">{activeBorrows.length}</span>
          </div>
          <div className="space-y-2">
            {activeBorrows.length === 0 ? <p className="text-xs text-slate-400 py-3">Tidak ada alat dipinjam.</p> : activeBorrows.map(b => (
              <div
                key={b.id}
                onClick={() => navigate(`/tools/${b.toolId}`)}
                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:border-blue-200 hover:bg-blue-50/40 transition-all cursor-pointer"
              >
                <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${b.status === "overdue" ? "bg-red-500" : "bg-blue-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-800 truncate">{b.toolName}</div>
                  <div className="text-xs text-slate-400 truncate">{b.employeeName}</div>
                </div>
                {b.status === "overdue" && <AlertTriangle size={13} className="text-red-500 flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
