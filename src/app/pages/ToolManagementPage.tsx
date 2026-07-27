// ─── Page: Tool Management ──────────────────────────────────────────────────────
import { useState, useId } from "react";
import { useNavigate } from "react-router";
import {
  Search, Plus, MapPin, User, Clock, Eye, Edit2, Trash2,
  ChevronLeft, ChevronRight, X, Download, CheckCircle, QrCode,
} from "lucide-react";
import { tools } from "../data/mockData";
import { StatusBadge, QRCodeSVG } from "../components/shared";
import { QRGenerator, useQRDownload } from "../components/shared/QRGenerator";

// ─── Sub-komponen: Modal Tambah Alat dengan QR Generator ─────────────────────
function AddToolModal({ onClose, nextId }: { onClose: () => void; nextId: string }) {
  const uid = useId();
  const { handleCanvasReady, downloadQR } = useQRDownload();

  const [nama,   setNama]   = useState("");
  const [seri,   setSeri]   = useState("");
  const [kat,    setKat]    = useState("Network Equipment");
  const [lokasi, setLokasi] = useState("");
  const [desk,   setDesk]   = useState("");
  const [tgl,    setTgl]    = useState(new Date().toISOString().slice(0, 10));
  const [step,   setStep]   = useState<"form" | "done">("form");

  const cats = [...new Set(tools.map(t => t.category))];

  // Preview QR muncul hanya jika nama sudah diisi
  const qrValue = nama.trim() ? nextId : "";
  const canSubmit = nama.trim() && seri.trim() && lokasi.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: Panggil createTool() dari service saat Back-End siap
    setStep("done");
  };

  // ─── Step 2: Sukses + Tampilkan QR + Tombol Download ─────────────────────
  if (step === "done") return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-semibold text-slate-900 flex items-center gap-2">
            <QrCode size={17} className="text-blue-600" /> QR Code Berhasil Dibuat
          </h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X size={17} />
          </button>
        </div>
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle size={24} className="text-emerald-600" />
          </div>
          <div className="text-center">
            <p className="font-bold text-slate-900">{nama}</p>
            <p className="text-xs font-mono text-blue-600 mt-0.5">{nextId} · {seri}</p>
            <p className="text-xs text-slate-400 mt-1">Tempel QR Code ini pada alat fisiknya</p>
          </div>

          {/* QR Code asli yang bisa di-scan */}
          <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
            <QRGenerator value={nextId} size={180} onCanvasReady={handleCanvasReady} />
          </div>

          <p className="text-[10px] text-slate-400 text-center">
            Scan QR di atas menggunakan kamera HP untuk verifikasi
          </p>

          <button
            onClick={() => downloadQR(`QR-${nextId}`)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            <Download size={16} /> Unduh QR Code (PNG)
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 border border-border text-slate-600 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );

  // ─── Step 1: Form Isi Data + Preview QR Live ──────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-slate-900">Tambah Alat Baru</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
            <X size={17} />
          </button>
        </div>

        {/* Body: Form (kiri) + Preview QR (kanan) */}
        <div className="p-5 grid grid-cols-5 gap-5">

          {/* Form */}
          <div className="col-span-3 space-y-3">
            <div className="col-span-2">
              <label htmlFor={`${uid}-nama`} className="text-xs font-semibold text-slate-600 block mb-1.5">
                Nama Alat <span className="text-red-400">*</span>
              </label>
              <input
                id={`${uid}-nama`}
                type="text"
                value={nama}
                onChange={e => setNama(e.target.value)}
                placeholder="contoh: Kabel Tester Jaringan"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${uid}-seri`} className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Nomor Seri <span className="text-red-400">*</span>
                </label>
                <input
                  id={`${uid}-seri`}
                  type="text"
                  value={seri}
                  onChange={e => setSeri(e.target.value)}
                  placeholder="contoh: FLK-2024-001"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label htmlFor={`${uid}-kat`} className="text-xs font-semibold text-slate-600 block mb-1.5">Kategori</label>
                <select
                  id={`${uid}-kat`}
                  value={kat}
                  onChange={e => setKat(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                >
                  {cats.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor={`${uid}-lokasi`} className="text-xs font-semibold text-slate-600 block mb-1.5">
                Lokasi Penyimpanan <span className="text-red-400">*</span>
              </label>
              <input
                id={`${uid}-lokasi`}
                type="text"
                value={lokasi}
                onChange={e => setLokasi(e.target.value)}
                placeholder="contoh: Gudang IT A"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label htmlFor={`${uid}-desk`} className="text-xs font-semibold text-slate-600 block mb-1.5">Deskripsi</label>
              <textarea
                id={`${uid}-desk`}
                rows={2}
                value={desk}
                onChange={e => setDesk(e.target.value)}
                placeholder="Fungsi dan keterangan singkat alat..."
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none transition-all"
              />
            </div>

            <div>
              <label htmlFor={`${uid}-tgl`} className="text-xs font-semibold text-slate-600 block mb-1.5">Tanggal Pembelian</label>
              <input
                id={`${uid}-tgl`}
                type="date"
                value={tgl}
                onChange={e => setTgl(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Preview QR Code — live update saat user mengetik nama */}
          <div className="col-span-2 flex flex-col items-center justify-start">
            <div className="w-full bg-slate-50 rounded-xl border border-border p-4 flex flex-col items-center gap-3">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preview QR Code</div>

              <QRGenerator value={qrValue} size={148} onCanvasReady={handleCanvasReady} />

              {/* ID yang akan di-assign */}
              <div className="text-center">
                <div className="text-[10px] text-slate-400 mb-1">ID Alat yang akan dibuat</div>
                <span className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                  {nextId}
                </span>
              </div>

              {nama.trim() ? (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  QR siap di-scan
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 text-center">
                  Isi nama alat untuk<br />melihat preview QR
                </p>
              )}
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-2 leading-relaxed">
              QR code akan langsung<br />bisa diunduh setelah alat disimpan
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-5 pb-5 pt-2 border-t border-border mt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-border rounded-lg hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <QrCode size={14} /> Simpan Alat &amp; Buat QR
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Halaman Utama ────────────────────────────────────────────────────────────
export function ToolManagementPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const [catF, setCatF] = useState("all");
  const [pg, setPg] = useState(1);
  const [modal, setModal] = useState(false);
  const perPage = 8;

  // Auto-generate ID berikutnya (Back-End akan menentukan ID asli saat submit)
  const nextToolId = `TL-${String(tools.length + 1).padStart(3, "0")}`;

  const cats = [...new Set(tools.map(t => t.category))];
  const filtered = tools.filter(t => {
    const s = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return s && (statusF === "all" || t.status === statusF) && (catF === "all" || t.category === catF);
  });
  const paged = filtered.slice((pg - 1) * perPage, pg * perPage);
  const pages = Math.ceil(filtered.length / perPage);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-border shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-52">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari berdasarkan nama atau ID Alat..." value={search} onChange={e => { setSearch(e.target.value); setPg(1); }} className="pl-8 pr-4 py-2 text-xs bg-slate-50 border border-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <select value={statusF} onChange={e => { setStatusF(e.target.value); setPg(1); }} className="text-xs border border-border rounded-lg px-3 py-2 text-slate-600 focus:outline-none bg-white">
            <option value="all">Semua Status</option>
            <option value="available">Tersedia</option>
            <option value="borrowed">Dipinjam</option>
            <option value="overdue">Terlambat</option>
            <option value="damaged">Rusak</option>
          </select>
          <select value={catF} onChange={e => { setCatF(e.target.value); setPg(1); }} className="text-xs border border-border rounded-lg px-3 py-2 text-slate-600 focus:outline-none bg-white">
            <option value="all">Semua Kategori</option>
            {cats.map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-400">{filtered.length} alat</span>
            <button onClick={() => setModal(true)} className="flex items-center gap-1.5 bg-blue-600 text-white px-3.5 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors">
              <Plus size={13} /> Tambah Alat
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-slate-50/70">
                {["Kode QR","ID Alat","Nama Alat","Kategori","Lokasi","Status","Pengguna Terakhir","Scan Terakhir","Aksi"].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.map(t => (
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
                      <span className="text-xs text-slate-700">{t.lastUser}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Clock size={10} className="text-slate-300" />{t.lastScanTime}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => navigate(`/tools/${t.id}`)} className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye size={14} /></button>
                      <button className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"><Edit2 size={14} /></button>
                      <button className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-slate-400">Menampilkan {Math.min((pg-1)*perPage+1,filtered.length)}–{Math.min(pg*perPage,filtered.length)} dari {filtered.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPg(p => Math.max(1, p-1))} disabled={pg===1} className="p-1.5 rounded-lg border border-border text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"><ChevronLeft size={14} /></button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => setPg(i+1)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${pg===i+1?"bg-blue-600 text-white":"border border-border text-slate-500 hover:bg-slate-50"}`}>{i+1}</button>
            ))}
            <button onClick={() => setPg(p => Math.min(pages, p+1))} disabled={pg===pages} className="p-1.5 rounded-lg border border-border text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Modal dengan QR Generator */}
      {modal && <AddToolModal nextId={nextToolId} onClose={() => setModal(false)} />}
    </div>
  );
}
