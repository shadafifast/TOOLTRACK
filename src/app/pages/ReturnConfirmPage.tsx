// ─── Page: Return Confirm ────────────────────────────────────────────────────────
// Menggunakan useParams() untuk mendapatkan toolId dari URL (/return-confirm/:toolId)
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, CheckCircle, Check, Loader2 } from "lucide-react";
import { QRCodeSVG } from "../components/shared";
// ─── Service Imports (API Layer) ───────────────────────────────────────────
import { getToolById, getToolBorrowHistory, returnBorrow } from "../services";
import { useEffect } from "react";
import type { Tool, BorrowRecord } from "../types";

export function ReturnConfirmPage() {
  const navigate = useNavigate();
  const { toolId } = useParams<{ toolId: string }>();
  const [condition, setCondition] = useState("good");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null);
  const [activeRec, setActiveRec] = useState<BorrowRecord | null>(null);

  // Ambil data tool & record aktif dari service
  useEffect(() => {
    if (!toolId) return;
    getToolById(toolId).then(t => setTool(t));
    getToolBorrowHistory(toolId).then(hist => {
      const rec = hist.find(r => r.status === "active" || r.status === "overdue");
      setActiveRec(rec ?? null);
    });
  }, [toolId]);

  const condOpts = [
    { value: "excellent", label: "Sangat Baik", active: "border-emerald-500 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
    { value: "good",      label: "Baik",        active: "border-blue-500 bg-blue-50 text-blue-700",         dot: "bg-blue-500" },
    { value: "fair",      label: "Cukup",       active: "border-amber-500 bg-amber-50 text-amber-700",      dot: "bg-amber-500" },
    { value: "damaged",   label: "Rusak",       active: "border-red-500 bg-red-50 text-red-700",            dot: "bg-red-500" },
  ];

  if (!tool) return (
    <div className="p-6 text-center text-slate-400">
      <p>Alat tidak ditemukan.</p>
      <button onClick={() => navigate(-1)} className="mt-2 text-xs text-blue-600">← Kembali</button>
    </div>
  );

  // Panggil service returnBorrow (saat ini mock, nanti terhubung ke real API)
  const handleConfirm = async () => {
    if (!activeRec) return;
    setLoading(true);
    try {
      await returnBorrow(activeRec.id, { condition: condition as "excellent"|"good"|"fair"|"damaged", notes });
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="p-6 flex items-center justify-center min-h-80">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-10 text-center max-w-sm">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
          <Check size={36} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Pengembalian Dikonfirmasi!</h2>
        <p className="text-sm text-slate-500">{tool.name} telah berhasil dikembalikan.</p>
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          Kondisi tercatat: <strong className="capitalize">{condition}</strong>
        </div>
        <button onClick={() => navigate("/dashboard")} className="mt-5 w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">Kembali ke Dasbor</button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-5 font-medium"><ChevronLeft size={14} /> Back</button>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl border border-border shadow-sm">
          <div className="p-5 border-b border-border">
            <h2 className="font-bold text-slate-900">Konfirmasi Pengembalian Alat</h2>
            <p className="text-xs text-slate-400 mt-1">Catat detail pengembalian dan kondisi alat</p>
          </div>
          <div className="p-5 space-y-4">
            <div className={`flex items-center gap-4 p-4 rounded-xl border ${tool.status==="overdue"?"bg-red-50 border-red-200":"bg-emerald-50 border-emerald-200"}`}>
              <QRCodeSVG id={tool.id} size={60} />
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">{tool.name}</div>
                <div className="text-xs font-mono text-emerald-700 mt-0.5">{tool.id}</div>
                {activeRec && <div className="text-xs text-slate-500 mt-0.5">Dipinjam oleh: {activeRec.employeeName} pada {activeRec.borrowTime}</div>}
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 mb-0.5">Durasi</div>
                <div className={`text-sm font-bold ${tool.status==="overdue"?"text-red-600":"text-slate-800"}`}>
                  {tool.status==="overdue"?"Terlambat":"~6 jam"}
                </div>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-2">Kondisi Alat</label>
              <div className="grid grid-cols-4 gap-2">
                {condOpts.map(opt => (
                  <button key={opt.value} onClick={() => setCondition(opt.value)} className={`py-2.5 px-2 text-xs font-semibold rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${condition===opt.value ? opt.active : "border-border text-slate-400 hover:border-slate-300 hover:text-slate-600"}`}>
                    <span className={`w-2 h-2 rounded-full ${condition===opt.value ? opt.dot : "bg-slate-200"}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Catatan Pengembalian <span className="text-slate-400 font-normal">(opsional)</span></label>
              <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Deskripsikan masalah, kerusakan, atau catatan tentang kondisi alat..." className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" />
            </div>
          </div>
          <div className="flex gap-3 p-5 border-t border-border">
            <button onClick={() => navigate(-1)} disabled={loading} className="flex-1 py-2.5 border border-border text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-40">Batal</button>
            <button onClick={handleConfirm} disabled={loading} className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
              {loading ? "Memproses..." : "Konfirmasi Kembali"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
