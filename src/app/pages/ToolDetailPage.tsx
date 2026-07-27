// ─── Page: Tool Detail ──────────────────────────────────────────────────────────
// Halaman ini menggunakan useParams() untuk mendapatkan ID alat dari URL (/tools/:toolId)
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronLeft, Download, Plus, Edit2, ArrowUpRight, ArrowDownLeft,
  Clock, Package, CheckCircle, AlertTriangle, RefreshCw
} from "lucide-react";
import { tools, borrowHistory } from "../data/mockData";
import { StatusBadge, QRCodeSVG, BorrowBadge } from "../components/shared";

export function ToolDetailPage() {
  const navigate = useNavigate();
  const { toolId } = useParams<{ toolId: string }>();
  const [tab, setTab] = useState<"details"|"history"|"maintenance">("details");

  // TODO: Ganti dengan API GET /api/tools/:toolId untuk mengambil data alat dari server
  const tool = tools.find(t => t.id === toolId);

  // TODO: Ambil riwayat dari API GET /api/tools/:toolId/history
  const hist = tool ? borrowHistory.filter(b => b.toolId === tool.id) : [];

  if (!tool) return (
    <div className="p-6 flex items-center justify-center min-h-40">
      <div className="text-center text-slate-400">
        <p className="font-semibold">Alat tidak ditemukan.</p>
        <button onClick={() => navigate("/tools")} className="mt-2 text-xs text-blue-600 hover:text-blue-700">← Kembali ke Manajemen Alat</button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-5">
      <button onClick={() => navigate("/tools")} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium">
        <ChevronLeft size={14} /> Kembali ke Manajemen Alat
      </button>

      <div className="grid grid-cols-3 gap-5">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm flex flex-col items-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Kode QR</div>
            <QRCodeSVG id={tool.id} size={152} />
            <div className="mt-3 text-center">
              <div className="font-mono text-sm font-bold text-slate-700">{tool.id}</div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">{tool.serialNumber}</div>
            </div>
            {/* TODO: Sambungkan ke fungsi download QR dari Back-End */}
            <button className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors w-full justify-center">
              <Download size={14} /> Unduh Kode QR
            </button>
          </div>
          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Foto</div>
            <div className="aspect-video bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200">
              <div className="text-center text-slate-300">
                <Package size={28} className="mx-auto mb-1.5 opacity-50" />
                <div className="text-xs">Belum ada foto</div>
              </div>
            </div>
            <button className="mt-2.5 flex items-center gap-1.5 text-xs border border-border text-slate-500 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors w-full justify-center font-medium">
              <Plus size={12} /> Unggah Foto
            </button>
          </div>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{tool.name}</h2>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{tool.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <StatusBadge status={tool.status} />
                <button className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><Edit2 size={15} /></button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-border">
              {[
                { l: "ID Alat",            v: tool.id,            mono: true },
                { l: "Nomor Seri",         v: tool.serialNumber,  mono: true },
                { l: "Kategori",           v: tool.category,      mono: false },
                { l: "Lokasi Penyimpanan", v: tool.location,      mono: false },
                { l: "Tanggal Pembelian",  v: tool.purchaseDate,  mono: false },
                { l: "Scan Terakhir",      v: tool.lastScanTime,  mono: false },
              ].map((f, i) => (
                <div key={i}>
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{f.l}</div>
                  <div className={`text-sm font-semibold text-slate-800 ${f.mono ? "font-mono" : ""}`}>{f.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-xl border p-4 flex items-center justify-between ${
            tool.status === "available" ? "bg-emerald-50 border-emerald-200" :
            tool.status === "borrowed"  ? "bg-blue-50 border-blue-200" :
            tool.status === "overdue"   ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
          }`}>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Pengguna Terakhir</div>
              <div className="text-sm font-bold text-slate-800">{tool.lastUser}</div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Clock size={10} />{tool.lastScanTime}</div>
            </div>
            <div className="flex gap-2">
              {tool.status === "available" && (
                <button onClick={() => navigate(`/borrow-confirm/${tool.id}`)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                  <ArrowUpRight size={15} /> Pinjam Alat
                </button>
              )}
              {(tool.status === "borrowed" || tool.status === "overdue") && (
                <button onClick={() => navigate(`/return-confirm/${tool.id}`)} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors">
                  <ArrowDownLeft size={15} /> Kembalikan Alat
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="flex border-b border-border bg-slate-50/50">
              {(["details","history","maintenance"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={`px-5 py-3 text-xs font-semibold capitalize transition-colors ${tab===t ? "border-b-2 border-blue-600 text-blue-700 bg-white" : "text-slate-400 hover:text-slate-600"}`}>
                  {t === "details" ? "Statistik" : t === "history" ? "Riwayat Peminjaman" : "Log Pemeliharaan"}
                </button>
              ))}
            </div>
            <div className="p-5">
              {tab === "details" && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: "Total Peminjaman",   v: hist.length,                                  c: "text-slate-800" },
                    { l: "Aktif Saat Ini",     v: hist.filter(h=>h.status==="active").length,   c: "text-blue-600" },
                    { l: "Kejadian Terlambat", v: hist.filter(h=>h.status==="overdue").length,  c: "text-red-600" },
                    { l: "Dikembalikan Baik",  v: hist.filter(h=>h.status==="returned").length, c: "text-emerald-600" },
                  ].map((s,i) => (
                    <div key={i} className="p-3.5 bg-slate-50 rounded-xl">
                      <div className="text-xs text-slate-400 mb-1">{s.l}</div>
                      <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === "history" && (
                <div className="space-y-3">
                  {hist.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Belum ada riwayat peminjaman.</p>}
                  {hist.map((rec, i) => (
                    <div key={rec.id} className="flex items-start gap-3 relative">
                      {i < hist.length - 1 && <div className="absolute left-4 top-8 bottom-0 w-px bg-slate-100" />}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${rec.status==="returned"?"bg-emerald-50":rec.status==="overdue"?"bg-red-50":"bg-blue-50"}`}>
                        {rec.status==="returned"?<CheckCircle size={14} className="text-emerald-600"/>:rec.status==="overdue"?<AlertTriangle size={14} className="text-red-600"/>:<Clock size={14} className="text-blue-600"/>}
                      </div>
                      <div className="flex-1 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-800">{rec.employeeName}</span>
                          <BorrowBadge status={rec.status} />
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">Dipinjam: {rec.borrowTime}</div>
                        {rec.returnTime && <div className="text-xs text-slate-400">Dikembalikan: {rec.returnTime} · {rec.duration}</div>}
                        {rec.notes && <div className="text-xs text-slate-400 italic mt-0.5">{rec.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tab === "maintenance" && (
                <div className="text-center py-8 text-slate-300">
                  <RefreshCw size={28} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Belum ada catatan pemeliharaan.</p>
                  <button className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-semibold">+ Tambah Catatan Pemeliharaan</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
