import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  QrCode, ChevronLeft, CheckCircle, MapPin, User, X,
  AlertTriangle, Loader2, ImageIcon
} from "lucide-react";
import { StatusBadge, QRCodeSVG } from "../components/shared";
import { getToolById } from "../services/toolService";
import { getEmployees } from "../services/employeeService";
import { quickBorrow, getToolBorrowHistory, returnBorrow } from "../services/borrowService";
import type { Tool, Employee, BorrowRecord } from "../types";
import { Html5Qrcode } from "html5-qrcode";

export function QuickScanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"scan" | "borrow" | "return" | "done">("scan");
  const [scannedTool, setScannedTool] = useState<Tool | null>(null);
  const [camError, setCamError] = useState("");
  const html5QrRef = useRef<Html5Qrcode | null>(null);

  // States for Borrow
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Employee[]>([]);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [showSug, setShowSug] = useState(false);
  const [borrowing, setBorrowing] = useState(false);

  // States for Return
  const [activeRec, setActiveRec] = useState<BorrowRecord | null>(null);
  const [condition, setCondition] = useState("good");
  const [notes, setNotes] = useState("");

  const condOpts = [
    { value: "excellent", label: "Sangat Baik", active: "border-emerald-500 bg-emerald-50 text-emerald-700", dot: "bg-emerald-500" },
    { value: "good",      label: "Baik",        active: "border-blue-500 bg-blue-50 text-blue-700",         dot: "bg-blue-500" },
    { value: "fair",      label: "Cukup",       active: "border-amber-500 bg-amber-50 text-amber-700",      dot: "bg-amber-500" },
    { value: "damaged",   label: "Rusak",       active: "border-red-500 bg-red-50 text-red-700",            dot: "bg-red-500" },
  ];

  // Guard untuk mencegah double-init di React Strict Mode (useEffect jalan 2x)
  const startedRef = useRef(false);

  // Mulai kamera hanya saat step === "scan"
  useEffect(() => {
    if (step !== "scan") return;
    if (startedRef.current) return;
    startedRef.current = true;

    const html5QrCode = new Html5Qrcode("reader");
    html5QrRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (text) => {
        html5QrCode.stop().catch(console.error);
        handleScan(text);
      },
      () => {}
    ).catch((err) => {
      console.error("Camera error:", err);
      setCamError("Tidak bisa mengakses kamera. Pastikan perangkat memiliki kamera dan izin diberikan.");
      startedRef.current = false;
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
      startedRef.current = false;
    };
  }, [step]);

  useEffect(() => {
    if (query.length >= 2) {
      getEmployees({ search: query }).then(res => setSuggestions(res.slice(0, 5))).catch(console.error);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleScan = async (toolId: string) => {
    try {
      const tool = await getToolById(toolId);
      if (tool) {
        setScannedTool(tool);
        if (tool.status === "available") {
          setStep("borrow");
        } else if (tool.status === "borrowed" || tool.status === "overdue") {
          try {
            const hist = await getToolBorrowHistory(tool.id);
            const rec = hist.find(r => r.status === "active" || r.status === "overdue");
            setActiveRec(rec || null);
          } catch {
            setActiveRec(null);
          }
          setStep("return");
        } else {
          setStep("borrow"); // to show "Alat tidak tersedia"
        }
      } else {
        alert("Alat tidak ditemukan di database.");
        setStep("scan");
      }
    } catch {
      alert("Alat tidak ditemukan atau ID salah.");
      setStep("scan");
    }
  };

  const handleUploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const scanner = new Html5Qrcode("img-scan-tmp-qs");
        const decoded = await scanner.scanFile(file, false);
        await scanner.clear();
        if (html5QrRef.current?.isScanning) {
          await html5QrRef.current.stop().catch(console.error);
        }
        handleScan(decoded);
      } catch {
        alert("Kode QR tidak terbaca dari gambar. Coba gunakan gambar yang lebih jelas.");
      }
    };
    input.click();
  };

  const doBorrow = async () => {
    if (!selected || !scannedTool) return;
    setBorrowing(true);
    try {
      await quickBorrow(scannedTool.id, selected.id);
      setStep("done");
    } catch (err: any) {
      alert(err.message || "Gagal meminjam alat.");
    }
    setBorrowing(false);
  };

  const doReturn = async () => {
    if (!activeRec) return;
    setBorrowing(true);
    try {
      await returnBorrow(activeRec.id, { condition: condition as "excellent"|"good"|"fair"|"damaged", notes });
      setStep("done");
    } catch (err: any) {
      alert(err.message || "Gagal mengembalikan alat.");
    }
    setBorrowing(false);
  };

  if (step === "done" && scannedTool) return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-10 text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
          <CheckCircle size={36} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">
          {activeRec ? "Pengembalian Berhasil!" : "Peminjaman Berhasil!"}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          <span className="font-semibold text-slate-700">{scannedTool.name}</span> berhasil 
          {activeRec ? " dikembalikan." : " dipinjam oleh"}
        </p>
        
        {!activeRec && selected && (
          <div className="mt-3 flex items-center justify-center gap-2.5">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-xs font-bold">{selected.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-slate-800">{selected.name}</div>
              <div className="text-xs text-slate-400">{selected.department}</div>
            </div>
          </div>
        )}
        
        <button onClick={() => navigate("/login")} className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
          Selesai
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div id="img-scan-tmp-qs" style={{ display: "none" }} />
      <style>{`
        #reader video { width: 100% !important; height: 100% !important; object-fit: cover !important; }
        #reader > img { display: none !important; }
        #reader__scan_region { display: none !important; }
        #reader__dashboard { display: none !important; }
      `}</style>

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/login")} className="p-2 bg-white border border-border rounded-xl text-slate-400 hover:text-slate-600 transition-colors shadow-sm">
            <ChevronLeft size={17} />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Scan QR Alat</h1>
            <p className="text-xs text-slate-400">Pindai QR untuk pinjam/kembalikan</p>
          </div>
          <div className="ml-auto w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow shadow-blue-600/30">
            <QrCode size={15} className="text-white" />
          </div>
        </div>

        {/* Step: SCAN */}
        {step === "scan" && (
          <div className="space-y-3">
            <div className="bg-slate-950 rounded-2xl overflow-hidden relative" style={{ aspectRatio: "1" }}>
              <div id="reader" className="absolute inset-0 w-full h-full" />
              <div className="absolute inset-0 pointer-events-none z-10">
                <span className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-md" />
                <span className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr-md" />
                <span className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-md" />
                <span className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-md" />
              </div>
              {camError && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/80 p-4 text-center">
                  <div className="text-red-400 text-xs">
                    <AlertTriangle className="mx-auto mb-2" size={24} />
                    {camError}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-1">
              {!camError && <><span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" /> Kamera aktif — mendeteksi QR secara otomatis</>}
            </div>

            <button onClick={handleUploadImage} className="w-full flex items-center justify-center gap-2 border border-border bg-white text-slate-500 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm">
              <ImageIcon size={14} /> Scan dari Gambar / File QR
            </button>
          </div>
        )}

        {/* TOOL INFO HEADER (For Borrow and Return) */}
        {(step === "borrow" || step === "return") && scannedTool && (
          <div className="bg-white rounded-2xl border border-border shadow-sm p-4 mb-4">
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5 ${step === "borrow" ? "text-emerald-600" : "text-amber-600"}`}>
              {step === "borrow" ? <><CheckCircle size={11} /> Alat Tersedia</> : <><AlertTriangle size={11} /> Mengembalikan Alat</>}
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
        )}

        {/* Step: BORROW */}
        {step === "borrow" && scannedTool && (
          <div className="space-y-4">
            {scannedTool.status !== "available" ? (
              <div className="bg-white rounded-2xl border border-border shadow-sm p-5 text-center">
                <AlertTriangle size={32} className="mx-auto text-amber-500 mb-3" />
                <h3 className="font-bold text-slate-900 mb-1">Alat Tidak Tersedia</h3>
                <p className="text-xs text-slate-500 mb-4">Status saat ini: <span className="font-semibold uppercase">{scannedTool.status}</span></p>
                <button onClick={() => { setStep("scan"); setScannedTool(null); }} className="w-full bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Scan Ulang</button>
              </div>
            ) : (
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
                      className="w-full pl-9 pr-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50"
                    />
                    {selected && (
                      <button onClick={() => { setSelected(null); setQuery(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  {showSug && suggestions.length > 0 && !selected && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-20 overflow-hidden max-h-48 overflow-y-auto">
                      {suggestions.map(emp => (
                        <button key={emp.id} onMouseDown={() => { setSelected(emp); setQuery(""); setShowSug(false); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-blue-50 transition-colors text-left">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-[10px] font-bold">{emp.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
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
                      <span className="text-blue-700 text-xs font-bold">{selected.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-blue-900">{selected.name}</div>
                      <div className="text-xs text-blue-600">{selected.department} · {selected.id}</div>
                    </div>
                    <CheckCircle size={16} className="text-blue-500 ml-auto flex-shrink-0" />
                  </div>
                )}
              </div>
            )}

            {scannedTool.status === "available" && (
              <>
                <button onClick={doBorrow} disabled={!selected || borrowing} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-40 transition-colors shadow-sm shadow-blue-600/20">
                  {borrowing ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />} Pinjam Alat Sekarang
                </button>
                <button onClick={() => { setStep("scan"); setScannedTool(null); }} className="w-full text-slate-400 text-xs hover:text-slate-600 transition-colors py-1">
                  ← Scan ulang alat lain
                </button>
              </>
            )}
          </div>
        )}

        {/* Step: RETURN */}
        {step === "return" && scannedTool && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-border shadow-sm p-5">
              {activeRec && (
                <div className="mb-4 pb-4 border-b border-border">
                  <div className="text-xs text-slate-500 mb-1">Dipinjam oleh:</div>
                  <div className="font-bold text-slate-800">{activeRec.employeeName}</div>
                </div>
              )}
              
              <label className="text-xs font-bold text-slate-700 block mb-2">Kondisi Alat saat Dikembalikan</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {condOpts.map(opt => (
                  <button key={opt.value} onClick={() => setCondition(opt.value)} className={`py-2 px-2 text-[11px] font-semibold rounded-xl border-2 transition-all flex items-center gap-2 ${condition===opt.value ? opt.active : "border-border text-slate-400 hover:border-slate-300"}`}>
                    <span className={`w-2 h-2 rounded-full ${condition===opt.value ? opt.dot : "bg-slate-200"}`} />
                    {opt.label}
                  </button>
                ))}
              </div>

              <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Tambahan (opsional)</label>
              <textarea 
                rows={2} 
                value={notes} 
                onChange={e => setNotes(e.target.value)} 
                placeholder="Misal: ada goresan..."
                className="w-full px-3 py-2 text-xs border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none bg-slate-50" 
              />
            </div>
            
            <button onClick={doReturn} disabled={!activeRec || borrowing} className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 transition-colors shadow-sm shadow-emerald-600/20">
              {borrowing ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />} Konfirmasi Pengembalian
            </button>
            <button onClick={() => { setStep("scan"); setScannedTool(null); setActiveRec(null); }} className="w-full text-slate-400 text-xs hover:text-slate-600 transition-colors py-1">
              ← Batal & Scan ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
