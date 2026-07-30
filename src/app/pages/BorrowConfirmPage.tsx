// ─── Page: Borrow Confirm ────────────────────────────────────────────────────────
// Menggunakan useParams() untuk mendapatkan toolId dari URL (/borrow-confirm/:toolId)
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, CheckCircle, Check, Loader2 } from "lucide-react";
import { StatusBadge, QRCodeSVG } from "../components/shared";
// ─── Service Imports (API Layer) ───────────────────────────────────────────
import { getEmployees, getToolById, createBorrow } from "../services";
import { useEffect } from "react";
import type { Employee } from "../types";
import type { Tool } from "../types";

export function BorrowConfirmPage() {
  const navigate = useNavigate();
  const { toolId } = useParams<{ toolId: string }>();
  const [empId, setEmpId] = useState("");
  
  // Tanggal pengembalian default 7 hari dari sekarang
  const defaultRetDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [retDate, setRetDate] = useState(defaultRetDate);
  
  // Tanggal/waktu pinjam saat ini
  const currentDateTime = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null);
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);

  // Ambil data tool & karyawan dari service (mock atau API)
  useEffect(() => {
    if (!toolId) return;
    getToolById(toolId).then(t => setTool(t));
    getEmployees().then(list => {
      setEmployeeList(list);
      if (list.length > 0) setEmpId(list[0].id);
    });
  }, [toolId]);

  const emp = employeeList.find(e => e.id === empId) || employeeList[0];

  if (!tool || !emp) return (
    <div className="p-6 text-center text-slate-400 flex flex-col items-center justify-center h-40">
      <Loader2 size={24} className="animate-spin mb-2" />
      <p>Memuat data...</p>
    </div>
  );

  // Panggil service createBorrow (saat ini mock, nanti terhubung ke real API)
  const handleConfirm = async () => {
    if (!emp || !tool) return;
    setLoading(true);
    try {
      await createBorrow({ toolId: tool.id, employeeId: emp.id, estimatedReturnDate: retDate, notes });
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
        <h2 className="text-xl font-bold text-slate-900 mb-2">Peminjaman Dikonfirmasi!</h2>
        <p className="text-sm text-slate-500">{tool.name} dipinjam oleh <strong>{emp.name}</strong></p>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
          Estimasi pengembalian: <strong>{retDate}</strong>
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
            <h2 className="font-bold text-slate-900">Konfirmasi Peminjaman Alat</h2>
            <p className="text-xs text-slate-400 mt-1">Periksa detail sebelum mengkonfirmasi transaksi</p>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <QRCodeSVG id={tool.id} size={60} />
              <div className="flex-1">
                <div className="text-sm font-bold text-blue-900">{tool.name}</div>
                <div className="text-xs font-mono text-blue-600 mt-0.5">{tool.id}</div>
                <div className="text-xs text-blue-700 mt-0.5">{tool.category} · {tool.location}</div>
              </div>
              <StatusBadge status={tool.status} />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Karyawan</label>
              <select value={empId} onChange={e => setEmpId(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white">
                {employeeList.map(e => <option key={e.id} value={e.id}>{e.name} — {e.department} ({e.id})</option>)}
              </select>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl grid grid-cols-2 gap-3 text-xs">
              {[["ID Karyawan",emp.id],["Departemen",emp.department],["Jabatan",emp.position],["Peminjaman Aktif",`${emp.activeBorrows} alat`]].map(([l,v]) => (
                <div key={l}><div className="text-slate-400 mb-0.5">{l}</div><div className="font-semibold text-slate-800">{v}</div></div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Tanggal/Waktu Pinjam</label>
                <input type="datetime-local" value={currentDateTime} readOnly className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">Estimasi Pengembalian</label>
                <input type="date" value={retDate} onChange={e => setRetDate(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Catatan <span className="text-slate-400 font-normal">(opsional)</span></label>
              <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Tujuan peminjaman, lokasi penggunaan..." className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" />
            </div>
          </div>
          <div className="flex gap-3 p-5 border-t border-border">
            <button onClick={() => navigate(-1)} disabled={loading} className="flex-1 py-2.5 border border-border text-slate-600 text-sm font-semibold rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-40">Batal</button>
            <button onClick={handleConfirm} disabled={loading || !emp} className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
              {loading ? "Memproses..." : "Konfirmasi Pinjam"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
