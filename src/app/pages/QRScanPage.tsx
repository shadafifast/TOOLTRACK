// ─── Page: QR Scanner ───────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Scan, ArrowUpRight, ArrowDownLeft, RefreshCw, Check } from "lucide-react";
import { tools } from "../data/mockData";
import { StatusBadge, QRCodeSVG } from "../components/shared";

export function QRScanPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"idle"|"scanning"|"done">("idle");
  const [result, setResult] = useState<typeof tools[0] | null>(null);
  const [scanIdx, setScanIdx] = useState(0);

  // TODO: Ganti simulasi ini dengan integrasi kamera nyata (WebRTC / library jsQR)
  const doScan = () => {
    setState("scanning");
    setTimeout(() => {
      setResult(tools[scanIdx % tools.length]);
      setScanIdx(i => i + 1);
      setState("done");
    }, 2400);
  };

  const reset = () => { setState("idle"); setResult(null); };
  useEffect(() => { doScan(); }, []);

  return (
    <div className="p-6">
      <style>{`
        @keyframes scanLine { 0%,100%{top:4%} 50%{top:88%} }
        @keyframes cornerPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .scan-beam { position:absolute; width:100%; height:2px; left:0; background:linear-gradient(90deg,transparent 0%,rgba(37,99,235,0.8) 50%,transparent 100%); box-shadow:0 0 10px rgba(37,99,235,0.5); animation:scanLine 2s ease-in-out infinite; }
        .corner-pulse { animation:cornerPulse 1.5s ease-in-out infinite; }
      `}</style>
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <div className="text-center mb-5">
            <h2 className="font-bold text-slate-900">Scanner Kode QR</h2>
            <p className="text-xs text-slate-400 mt-1">Posisikan kode QR di area pemindaian</p>
          </div>
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden" style={{ aspectRatio: "1" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
            {[["top-5 left-5","border-t-2 border-l-2"],["top-5 right-5","border-t-2 border-r-2"],["bottom-5 left-5","border-b-2 border-l-2"],["bottom-5 right-5","border-b-2 border-r-2"]].map(([pos,brd],i) => (
              <div key={i} className={`absolute ${pos} w-8 h-8 border-blue-400 ${brd} rounded-sm z-20 ${state==="scanning"?"corner-pulse":""}`} />
            ))}
            <div className="absolute inset-10 border border-dashed border-blue-500/20 rounded-xl overflow-hidden">
              {state === "scanning" && <div className="scan-beam" />}
            </div>
            {state === "idle" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3"><Scan size={26} className="text-blue-400" /></div>
                  <p className="text-blue-300 text-xs font-medium">Memindai Kode QR...</p>
                </div>
              </div>
            )}
            {state === "scanning" && (
              <div className="absolute bottom-5 inset-x-0 flex justify-center">
                <div className="bg-black/70 text-blue-400 text-xs px-4 py-1.5 rounded-full flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" /> Memindai...
                </div>
              </div>
            )}
            {state === "done" && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-emerald-500/40">
                    <Check size={30} className="text-white" />
                  </div>
                  <p className="text-white text-sm font-semibold">Alat Teridentifikasi!</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4">
            {state === "done" && (
              <button onClick={reset} className="w-full flex items-center justify-center gap-2 border border-border text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                <RefreshCw size={15} /> Scan Alat Lain
              </button>
            )}
            {state !== "done" && (
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                Kamera aktif — mendeteksi QR secara otomatis
              </div>
            )}
          </div>
        </div>

        <div>
          {!result ? (
            <div className="bg-white rounded-xl border border-border shadow-sm h-full flex items-center justify-center">
              <div className="text-center text-slate-300 px-8">
                <Scan size={44} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm font-semibold">Menunggu pemindaian</p>
                <p className="text-xs mt-1">Informasi alat akan muncul di sini</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-white rounded-xl border border-border shadow-sm p-5">
                <div className="flex items-start gap-4 mb-4">
                  <QRCodeSVG id={result.id} size={76} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{result.name}</h3>
                      <StatusBadge status={result.status} />
                    </div>
                    <div className="font-mono text-xs text-blue-600 mt-1">{result.id}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{result.category} · {result.location}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-border">
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 mb-0.5">Pengguna Terakhir</div>
                    <div className="text-xs font-bold text-slate-800">{result.lastUser}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 mb-0.5">Scan Terakhir</div>
                    <div className="text-xs font-bold text-slate-800">{result.lastScanTime}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {/* TODO: Sambungkan ke /borrow-confirm/:id setelah scan */}
                <button onClick={() => navigate(`/borrow-confirm/${result.id}`)} disabled={result.status!=="available"} className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ArrowUpRight size={16} /> Pinjam Alat
                </button>
                <button onClick={() => navigate(`/return-confirm/${result.id}`)} disabled={result.status!=="borrowed"&&result.status!=="overdue"} className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                  <ArrowDownLeft size={16} /> Kembalikan Alat
                </button>
              </div>
              <div className="bg-white rounded-xl border border-border shadow-sm p-4">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Deskripsi</div>
                <p className="text-xs text-slate-600 leading-relaxed">{result.description}</p>
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className="text-[10px] text-slate-400">Seri:</span>
                  <span className="text-[10px] font-mono text-slate-600">{result.serialNumber}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
