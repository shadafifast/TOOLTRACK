// ─── Page: Quick Scan (Tanpa Login) ─────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { QrCode, ChevronLeft, CheckCircle, MapPin, User, X, Scan } from "lucide-react";
import { tools, employees } from "../data/mockData";
import { StatusBadge, QRCodeSVG } from "../components/shared";

export function QuickScanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"scan" | "borrow" | "done">("scan");
  const [scanning, setScanning] = useState(false);
  const [scannedTool, setScannedTool] = useState<typeof tools[0] | null>(null);
  const [scanIdx, setScanIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<typeof employees[0] | null>(null);
  const [showSug, setShowSug] = useState(false);

  const suggestions = query.length >= 1
    ? employees.filter(e => e.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : [];

  // TODO: Ganti dengan integrasi kamera nyata (WebRTC / jsQR)
  const doScan = () => {
    setScanning(true);
    setTimeout(() => {
      const avail = tools.filter(t => t.status === "available");
      setScannedTool(avail[scanIdx % avail.length]);
      setScanIdx(i => i + 1);
      setScanning(false);
      setStep("borrow");
    }, 2000);
  };

  useEffect(() => { doScan(); }, []);

  const doBorrow = () => {
    if (!selected) return;
    // TODO: Sambungkan ke API POST /api/borrows/quick
    setStep("done");
  };

  if (step === "done" && scannedTool && selected) return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-10 text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
          <CheckCircle size={36} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Peminjaman Berhasil!</h2>
        <p className="text-sm text-slate-500 mt-1">
          <span className="font-semibold text-slate-700">{scannedTool.name}</span> berhasil dipinjam oleh
        </p>
        <div className="mt-3 flex items-center justify-center gap-2.5">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 text-xs font-bold">{selected.name.split(" ").map(n => n[0]).join("").slice(0,2)}</span>
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-slate-800">{selected.name}</div>
            <div className="text-xs text-slate-400">{selected.department}</div>
          </div>
        </div>
        <div className="mt-5 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 text-left space-y-1.5">
          <div className="flex justify-between"><span>Alat</span><span className="font-semibold text-slate-700 text-right max-w-40 truncate">{scannedTool.name}</span></div>
          <div className="flex justify-between"><span>Lokasi</span><span className="font-semibold text-slate-700">{scannedTool.location}</span></div>
          <div className="flex justify-between"><span>Waktu pinjam</span><span className="font-semibold text-slate-700">Sekarang</span></div>
        </div>
        <button onClick={() => navigate("/login")} className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
          Selesai
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <style>{`
        @keyframes scanLine2 { 0%,100%{top:4%} 50%{top:88%} }
        .scan-beam2 { position:absolute; width:100%; height:2px; left:0;
          background:linear-gradient(90deg,transparent 0%,rgba(37,99,235,0.9) 50%,transparent 100%);
          box-shadow:0 0 10px rgba(37,99,235,0.5);
          animation:scanLine2 1.8s ease-in-out infinite; }
      `}</style>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/login")} className="p-2 bg-white border border-border rounded-xl text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
            <ChevronLeft size={17} />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Scan QR Alat</h1>
            <p className="text-xs text-slate-400">Pindai kode QR pada alat untuk meminjam</p>
          </div>
          <div className="ml-auto w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow shadow-blue-600/30">
            <QrCode size={15} className="text-white" />
          </div>
        </div>

        {step === "scan" && (
          <div className="space-y-3">
            <div className="bg-slate-950 rounded-2xl overflow-hidden relative" style={{ aspectRatio: "1" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
              {[["top-4 left-4","border-t-2 border-l-2"],["top-4 right-4","border-t-2 border-r-2"],["bottom-4 left-4","border-b-2 border-l-2"],["bottom-4 right-4","border-b-2 border-r-2"]].map(([pos,brd],i) => (
                <div key={i} className={`absolute ${pos} w-8 h-8 border-blue-400 ${brd} rounded-sm z-20`} />
              ))}
              <div className="absolute inset-8 border border-dashed border-blue-500/20 rounded-xl overflow-hidden">
                {scanning && <div className="scan-beam2" />}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                {scanning ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Scan size={26} className="text-blue-400" />
                    </div>
                    <p className="text-blue-300 text-xs font-medium">Memindai QR Code...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <QrCode size={28} className="text-blue-400" />
                    </div>
                    <p className="text-slate-400 text-xs">Arahkan kamera ke QR Code</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              Kamera aktif — mendeteksi QR secara otomatis
            </div>
          </div>
        )}

        {step === "borrow" && scannedTool && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-4">
              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <CheckCircle size={11} /> Alat Ditemukan
              </div>
              <div className="flex items-center gap-3">
                <QRCodeSVG id={scannedTool.id} size={58} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-900 leading-snug">{scannedTool.name}</div>
                  <div className="text-xs font-mono text-blue-600 mt-0.5">{scannedTool.id}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin size={10} className="text-slate-300" />{scannedTool.location}
                  </div>
                </div>
                <StatusBadge status={scannedTool.status} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <label className="text-xs font-bold text-slate-700 block mb-1">Nama Peminjam</label>
              <p className="text-xs text-slate-400 mb-3">Ketik nama Anda, lalu pilih dari daftar</p>
              <div className="relative">
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={selected ? selected.name : query}
                    onChange={e => { setQuery(e.target.value); setSelected(null); setShowSug(true); }}
                    onFocus={() => setShowSug(true)}
                    placeholder="Ketik nama peminjam..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50"
                  />
                  {selected && (
                    <button onClick={() => { setSelected(null); setQuery(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>
                  )}
                </div>
                {showSug && suggestions.length > 0 && !selected && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                    {suggestions.map(emp => (
                      <button key={emp.id} onMouseDown={() => { setSelected(emp); setQuery(""); setShowSug(false); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-blue-50 transition-colors text-left">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-[10px] font-bold">{emp.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{emp.name}</div>
                          <div className="text-xs text-slate-400">{emp.department} · {emp.id}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selected && (
                <div className="mt-3 flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="w-9 h-9 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 text-xs font-bold">{selected.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-900">{selected.name}</div>
                    <div className="text-xs text-blue-600">{selected.department} · {selected.id}</div>
                  </div>
                  <CheckCircle size={16} className="text-blue-500 ml-auto flex-shrink-0" />
                </div>
              )}
            </div>

            <button onClick={doBorrow} disabled={!selected} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-600/20">
              <CheckCircle size={15} /> Pinjam Alat Sekarang
            </button>
            <button onClick={() => { setStep("scan"); setScannedTool(null); }} className="w-full text-slate-400 text-xs hover:text-slate-600 transition-colors py-1">
              ← Scan ulang alat lain
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
