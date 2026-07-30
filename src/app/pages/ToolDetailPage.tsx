import { useState, useEffect, useId } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ChevronLeft, Download, Edit2, ArrowUpRight, ArrowDownLeft,
  Clock, Package, CheckCircle, AlertTriangle, RefreshCw, Loader2,
  Save, X, Camera
} from "lucide-react";
import { StatusBadge, QRCodeSVG, BorrowBadge } from "../components/shared";
import { getToolById, updateTool, uploadToolPhoto, getToolCategories } from "../services/toolService";
import { getToolBorrowHistory } from "../services/borrowService";
import { getMe } from "../services/authService";
import type { Tool, Employee } from "../types";

// ─── Modal Edit Alat (inline di halaman detail) ──────────────────────────────
function EditToolModal({ tool, onClose, onSaved }: { tool: Tool; onClose: () => void; onSaved: (updated: Tool) => void }) {
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
      const updated = await updateTool(tool.id, {
        name: nama, serialNumber: seri, category: kat,
        location: lokasi, description: desk,
        status: status as any,
        purchaseDate: tgl || undefined,
      });
      onSaved(updated);
      onClose();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan perubahan.");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Edit2 size={16} className="text-blue-600" /> Edit Alat
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{tool.id}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"><X size={17} /></button>
        </div>
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

// ─── Halaman Detail Alat ─────────────────────────────────────────────────────
export function ToolDetailPage() {
  const navigate = useNavigate();
  const { toolId } = useParams<{ toolId: string }>();
  const [tab, setTab] = useState<"details"|"history"|"maintenance">("details");

  const [tool, setTool] = useState<Tool | null>(null);
  const [hist, setHist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [user, setUser] = useState<Employee | null>(null);

  const loadData = () => {
    if (!toolId) return;
    setLoading(true);
    Promise.all([
      getToolById(toolId).catch(() => null),
      getToolBorrowHistory(toolId).catch(() => []),
      getMe().catch(() => null)
    ]).then(([t, h, u]) => {
      setTool(t);
      setHist(h);
      setUser(u);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, [toolId]);

  // ── Unduh QR Code sebagai PNG ────────────────────────────────────────────
  const handleDownloadQR = () => {
    if (!tool) return;
    const wrapper = document.getElementById(`qr-svg-${tool.id}`);
    if (!wrapper) return;
    const canvas = wrapper.querySelector("canvas");
    const svg = wrapper.querySelector("svg");
    
    const cardCanvas = document.createElement("canvas");
    const ctx = cardCanvas.getContext("2d");
    if (!ctx) return;
    
    // Card dimensions (premium card layout)
    const cardWidth = 400;
    const cardHeight = 460;
    cardCanvas.width = cardWidth;
    cardCanvas.height = cardHeight;
    
    // Fill background with white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cardWidth, cardHeight);
    
    // Draw subtle border around the card
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, cardWidth - 4, cardHeight - 4);
    
    const drawQR = (qrImg: HTMLCanvasElement | HTMLImageElement) => {
      // Centered QR Code
      const qrSize = 300;
      const qrX = (cardWidth - qrSize) / 2;
      const qrY = 40; 
      
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      
      // Draw Text Label below it (monospace bold)
      ctx.fillStyle = "#1e293b"; 
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tool.id, cardWidth / 2, 395); 
      
      const a = document.createElement("a");
      a.href = cardCanvas.toDataURL("image/png");
      a.download = `QR-${tool.id}.png`;
      a.click();
    };

    if (canvas) {
      drawQR(canvas);
    } else if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        drawQR(img);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  };

  // ── Upload Foto Alat ─────────────────────────────────────────────────────
  const handleUploadPhoto = () => {
    if (!tool) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      setUploadingPhoto(true);
      try {
        const photoUrl = await uploadToolPhoto(tool.id, file);
        setTool(prev => prev ? { ...prev, photoUrl } : prev);
      } catch (err: any) {
        alert(err.message || "Gagal mengunggah foto.");
      }
      setUploadingPhoto(false);
    };
    input.click();
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

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
        {/* Kolom kiri: QR & Foto */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm flex flex-col items-center">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Kode QR</div>
            <QRCodeSVG id={tool.id} size={152} />
            <div className="mt-3 text-center">
              <div className="font-mono text-sm font-bold text-slate-700">{tool.id}</div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">{tool.serialNumber}</div>
            </div>
            <button onClick={handleDownloadQR} className="mt-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors w-full justify-center">
              <Download size={14} /> Unduh Kode QR
            </button>
          </div>

          <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Foto Alat</div>
            <div className="aspect-video bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-200 overflow-hidden">
              {tool.photoUrl ? (
                <img src={tool.photoUrl} alt={tool.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-slate-300">
                  <Package size={28} className="mx-auto mb-1.5 opacity-50" />
                  <div className="text-xs">Belum ada foto</div>
                </div>
              )}
            </div>
            {user?.role === 'admin' && (
              <button onClick={handleUploadPhoto} disabled={uploadingPhoto} className="mt-2.5 flex items-center gap-1.5 text-xs border border-border text-slate-500 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors w-full justify-center font-medium disabled:opacity-50">
                {uploadingPhoto ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
                {uploadingPhoto ? "Mengunggah..." : tool.photoUrl ? "Ganti Foto" : "Unggah Foto"}
              </button>
            )}
          </div>
        </div>

        {/* Kolom kanan: Info & Tab */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{tool.name}</h2>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{tool.description || <span className="italic text-slate-300">Tidak ada deskripsi</span>}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <StatusBadge status={tool.status} />
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setShowEdit(true)}
                    title="Edit alat"
                    className="p-1.5 text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={15} />
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-border">
              {[
                { l: "ID Alat",            v: tool.id,            mono: true },
                { l: "Nomor Seri",         v: tool.serialNumber,  mono: true },
                { l: "Kategori",           v: tool.category,      mono: false },
                { l: "Lokasi Penyimpanan", v: tool.location,      mono: false },
                { l: "Tanggal Pembelian",  v: tool.purchaseDate ? new Date(tool.purchaseDate).toLocaleDateString() : "-", mono: false },
                { l: "Scan Terakhir",      v: tool.lastScanTime ? new Date(tool.lastScanTime).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }).replace(/\./g, ":") : "-", mono: false },
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
              <div className="text-sm font-bold text-slate-800">{tool.lastUser || "-"}</div>
              <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <Clock size={10} />
                {tool.lastScanTime ? new Date(tool.lastScanTime).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                }).replace(/\./g, ":") : "-"}
              </div>
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

          {/* Tab: Statistik / Riwayat / Pemeliharaan */}
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
                        <div className="text-xs text-slate-400 mt-0.5">Dipinjam: {new Date(rec.borrowTime).toLocaleString()}</div>
                        {rec.returnTime && <div className="text-xs text-slate-400">Dikembalikan: {new Date(rec.returnTime).toLocaleString()}</div>}
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

      {/* Modal edit */}
      {showEdit && (
        <EditToolModal
          tool={tool}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => setTool(updated)}
        />
      )}
    </div>
  );
}
