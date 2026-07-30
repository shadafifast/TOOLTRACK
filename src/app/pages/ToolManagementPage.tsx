import { useState, useId, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search, Plus, MapPin, User, Clock, Eye, Edit2, Trash2,
  ChevronLeft, ChevronRight, X, Download, CheckCircle, QrCode, Loader2, Save
} from "lucide-react";
import { StatusBadge, QRCodeSVG } from "../components/shared";
import { QRGenerator, useQRDownload } from "../components/shared/QRGenerator";
import { getTools, createTool, deleteTool, updateTool, getToolCategories, getNextId } from "../services/toolService";
import { getMe } from "../services/authService";
import type { Tool, Employee } from "../types";

// ─── Modal: Tambah Alat ───────────────────────────────────────────────────────
function AddToolModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const uid = useId();
  const { handleCanvasReady, downloadQR } = useQRDownload();

  const [nextId, setNextId] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [loadingInit, setLoadingInit] = useState(true);

  const [nama,   setNama]   = useState("");
  const [seri,   setSeri]   = useState("");
  const [kat,    setKat]    = useState("");
  const [lokasi, setLokasi] = useState("");
  const [desk,   setDesk]   = useState("");
  const [tgl,    setTgl]    = useState(new Date().toISOString().slice(0, 10));
  const [step,   setStep]   = useState<"form" | "loading" | "done">("form");

  useEffect(() => {
    Promise.all([getNextId(), getToolCategories()]).then(([idRes, catRes]) => {
      setNextId(idRes.nextId);
      setCats(catRes);
      if (catRes.length > 0) setKat(catRes[0]);
      setLoadingInit(false);
    });
  }, []);

  const qrValue = nama.trim() ? nextId : "";
  const canSubmit = nama.trim() && seri.trim() && lokasi.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStep("loading");
    try {
      await createTool({ name: nama, serialNumber: seri, category: kat, location: lokasi, description: desk, purchaseDate: tgl });
      setStep("done");
      onSuccess();
    } catch {
      alert("Gagal menyimpan alat");
      setStep("form");
    }
  };

  if (loadingInit) return <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"><Loader2 className="animate-spin text-white w-10 h-10" /></div>;

  if (step === "done") return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <QrCode size={17} className="text-blue-600" /> QR Code Berhasil Dibuat
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X size={17} /></button>
        </div>
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center"><CheckCircle size={24} className="text-emerald-600" /></div>
          <div className="text-center">
            <p className="font-bold text-slate-900">{nama}</p>
            <p className="text-xs font-mono text-blue-600 mt-0.5">{nextId} · {seri}</p>
            <p className="text-xs text-slate-400 mt-1">Tempel QR Code ini pada alat fisiknya</p>
          </div>
          <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
            <QRGenerator value={nextId} size={180} onCanvasReady={handleCanvasReady} />
          </div>
          <button onClick={() => downloadQR(`QR-${nextId}`)} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20">
            <Download size={16} /> Unduh QR Code (PNG)
          </button>
          <button onClick={onClose} className="w-full py-2.5 border border-border text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">Selesai</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-slate-900">Tambah Alat Baru</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X size={17} /></button>
        </div>
        <div className="p-5 grid grid-cols-5 gap-5">
          <div className="col-span-3 space-y-3">
            <div>
              <label htmlFor={`${uid}-nama`} className="text-xs font-semibold text-slate-600 block mb-1.5">Nama Alat *</label>
              <input id={`${uid}-nama`} type="text" value={nama} onChange={e => setNama(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${uid}-seri`} className="text-xs font-semibold text-slate-600 block mb-1.5">Nomor Seri *</label>
                <input id={`${uid}-seri`} type="text" value={seri} onChange={e => setSeri(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-lg" />
              </div>
              <div>
                <label htmlFor={`${uid}-kat`} className="text-xs font-semibold text-slate-600 block mb-1.5">Kategori</label>
                <select id={`${uid}-kat`} value={kat} onChange={e => setKat(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-lg">
                  {cats.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor={`${uid}-lokasi`} className="text-xs font-semibold text-slate-600 block mb-1.5">Lokasi Penyimpanan *</label>
              <input id={`${uid}-lokasi`} type="text" value={lokasi} onChange={e => setLokasi(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-lg" />
            </div>
            <div>
              <label htmlFor={`${uid}-tgl`} className="text-xs font-semibold text-slate-600 block mb-1.5">Tanggal Pembelian</label>
              <input id={`${uid}-tgl`} type="date" value={tgl} onChange={e => setTgl(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-lg" />
            </div>
            <div>
              <label htmlFor={`${uid}-desk`} className="text-xs font-semibold text-slate-600 block mb-1.5">Deskripsi</label>
              <textarea id={`${uid}-desk`} rows={2} value={desk} onChange={e => setDesk(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-lg" />
            </div>
          </div>
          <div className="col-span-2 flex flex-col items-center justify-start">
            <div className="w-full bg-slate-50 rounded-xl border border-border p-4 flex flex-col items-center gap-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview QR Code</div>
              <QRGenerator value={qrValue} size={148} onCanvasReady={handleCanvasReady} />
              <div className="text-center">
                <div className="text-[10px] text-slate-400 mb-1">ID Alat yang akan dibuat</div>
                <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">{nextId}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2.5 px-5 pb-5 pt-2 border-t border-border mt-1">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 border border-border rounded-lg hover:bg-slate-50 transition-colors">Batal</button>
          <button onClick={handleSubmit} disabled={!canSubmit || step === "loading"} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 transition-colors">
            {step === "loading" ? <Loader2 size={14} className="animate-spin" /> : <QrCode size={14} />} Simpan Alat & Buat QR
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal: Edit Alat ─────────────────────────────────────────────────────────
function EditToolModal({ tool, onClose, onSuccess }: { tool: Tool; onClose: () => void; onSuccess: () => void }) {
  const uid = useId();
  const [cats, setCats] = useState<string[]>([]);

  const [nama,   setNama]   = useState(tool.name);
  const [seri,   setSeri]   = useState(tool.serialNumber);
  const [kat,    setKat]    = useState(tool.category);
  const [lokasi, setLokasi] = useState(tool.location);
  const [desk,   setDesk]   = useState(tool.description || "");
  const [status, setStatus] = useState(tool.status);
  const [tgl,    setTgl]    = useState(tool.purchaseDate ? tool.purchaseDate.slice(0, 10) : "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getToolCategories().then(setCats).catch(console.error);
  }, []);

  const canSubmit = nama.trim() && seri.trim() && lokasi.trim();

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      await updateTool(tool.id, {
        name: nama,
        serialNumber: seri,
        category: kat,
        location: lokasi,
        description: desk,
        status: status as any,
        purchaseDate: tgl || undefined,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan perubahan.");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Edit2 size={16} className="text-blue-600" /> Edit Alat
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{tool.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X size={17} /></button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          <div>
            <label htmlFor={`${uid}-nama`} className="text-xs font-semibold text-slate-600 block mb-1.5">Nama Alat *</label>
            <input id={`${uid}-nama`} type="text" value={nama} onChange={e => setNama(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${uid}-seri`} className="text-xs font-semibold text-slate-600 block mb-1.5">Nomor Seri *</label>
              <input id={`${uid}-seri`} type="text" value={seri} onChange={e => setSeri(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50" />
            </div>
            <div>
              <label htmlFor={`${uid}-kat`} className="text-xs font-semibold text-slate-600 block mb-1.5">Kategori</label>
              <select id={`${uid}-kat`} value={kat} onChange={e => setKat(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none bg-slate-50 text-slate-700">
                {cats.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${uid}-lokasi`} className="text-xs font-semibold text-slate-600 block mb-1.5">Lokasi Penyimpanan *</label>
              <input id={`${uid}-lokasi`} type="text" value={lokasi} onChange={e => setLokasi(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50" />
            </div>
            <div>
              <label htmlFor={`${uid}-status`} className="text-xs font-semibold text-slate-600 block mb-1.5">Status</label>
              <select id={`${uid}-status`} value={status} onChange={e => setStatus(e.target.value as any)} className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none bg-slate-50 text-slate-700">
                <option value="available">Tersedia</option>
                <option value="borrowed">Dipinjam</option>
                <option value="overdue">Terlambat</option>
                <option value="damaged">Rusak</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={`${uid}-tgl`} className="text-xs font-semibold text-slate-600 block mb-1.5">Tanggal Pembelian</label>
            <input id={`${uid}-tgl`} type="date" value={tgl} onChange={e => setTgl(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50" />
          </div>

          <div>
            <label htmlFor={`${uid}-desk`} className="text-xs font-semibold text-slate-600 block mb-1.5">Deskripsi</label>
            <textarea id={`${uid}-desk`} rows={3} value={desk} onChange={e => setDesk(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 resize-none" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-5 pb-5 pt-2 border-t border-border">
          <button onClick={onClose} disabled={saving} className="px-4 py-2 text-sm font-medium text-slate-600 border border-border rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-40">Batal</button>
          <button onClick={handleSubmit} disabled={!canSubmit || saving} className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Utama: Manajemen Alat ────────────────────────────────────────────
export function ToolManagementPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState<any>("all");
  const [catF, setCatF] = useState("all");
  const [pg, setPg] = useState(1);
  const [modal, setModal] = useState(false);
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const perPage = 8;

  const [tools, setTools] = useState<Tool[]>([]);
  const [total, setTotal] = useState(0);
  const [cats, setCats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Employee | null>(null);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await getTools({ search, status: statusF, category: catF, page: pg, limit: perPage });
      setTools(res.data);
      setTotal(res.total);
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getToolCategories().then(setCats).catch(console.error);
    getMe().then(setUser).catch(console.error);
  }, []);

  useEffect(() => {
    fetchTools();
  }, [search, statusF, catF, pg]);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Yakin ingin menghapus alat "${name}"?\n\nTindakan ini tidak bisa dibatalkan.`)) {
      try {
        await deleteTool(id);
        fetchTools();
      } catch (err: any) {
        alert(err.message || "Gagal menghapus alat.");
      }
    }
  };

  const pages = Math.ceil(total / perPage);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-border shadow-sm">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-52">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari berdasarkan nama atau ID Alat..." value={search} onChange={e => { setSearch(e.target.value); setPg(1); }} className="pl-8 pr-4 py-2 text-xs bg-slate-50 border border-border rounded-lg w-full focus:outline-none" />
          </div>
          <select value={statusF} onChange={e => { setStatusF(e.target.value); setPg(1); }} className="text-xs border border-border rounded-lg px-3 py-2 text-slate-600">
            <option value="all">Semua Status</option>
            <option value="available">Tersedia</option>
            <option value="borrowed">Dipinjam</option>
            <option value="overdue">Terlambat</option>
            <option value="damaged">Rusak</option>
          </select>
          <select value={catF} onChange={e => { setCatF(e.target.value); setPg(1); }} className="text-xs border border-border rounded-lg px-3 py-2 text-slate-600">
            <option value="all">Semua Kategori</option>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-400">{total} alat</span>
            {user?.role === 'admin' && (
              <button onClick={() => setModal(true)} className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700">
                <Plus size={13} /> Tambah Alat
              </button>
            )}
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-slate-50/70">
                  {["Kode QR","ID Alat","Nama Alat","Kategori","Lokasi","Status","Pengguna Terakhir","Scan Terakhir","Aksi"].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tools.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3"><QRCodeSVG id={t.id} size={42} /></td>
                    <td className="px-4 py-3"><span className="text-[11px] font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{t.id}</span></td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-slate-800">{t.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.serialNumber}</div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs text-slate-600">{t.category}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={11} className="text-slate-300 flex-shrink-0" />{t.location}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0"><User size={10} className="text-slate-400" /></div>
                        <span className="text-xs text-slate-700">{t.lastUser || "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock size={10} className="text-slate-300" />{t.lastScanTime || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-0.5">
                        <button onClick={() => navigate(`/tools/${t.id}`)} title="Lihat detail" className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye size={14} /></button>
                        {user?.role === 'admin' && (
                          <>
                            <button onClick={() => setEditTool(t)} title="Edit alat" className="p-1.5 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"><Edit2 size={14} /></button>
                            <button onClick={() => handleDelete(t.id, t.name)} title="Hapus alat" className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={14} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {tools.length === 0 && !loading && (
                  <tr>
                    <td colSpan={9} className="text-center text-xs text-slate-400 py-12">Tidak ada alat ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-slate-400">Menampilkan {Math.min((pg-1)*perPage+1, total || 1)}–{Math.min(pg*perPage, total)} dari {total}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPg(p => Math.max(1, p-1))} disabled={pg===1} className="p-1.5 rounded-lg border border-border text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"><ChevronLeft size={14} /></button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => setPg(i+1)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${pg===i+1?"bg-blue-600 text-white":"border border-border text-slate-500 hover:bg-slate-50"}`}>{i+1}</button>
            ))}
            <button onClick={() => setPg(p => Math.min(pages, p+1))} disabled={pg===pages || pages===0} className="p-1.5 rounded-lg border border-border text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && <AddToolModal onSuccess={() => fetchTools()} onClose={() => setModal(false)} />}
      {editTool && <EditToolModal tool={editTool} onSuccess={() => fetchTools()} onClose={() => setEditTool(null)} />}
    </div>
  );
}
