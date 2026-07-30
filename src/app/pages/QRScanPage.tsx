import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Scan, ArrowUpRight, ArrowDownLeft, RefreshCw,
  AlertTriangle, ImageIcon
} from "lucide-react";
import { getToolById } from "../services/toolService";
import type { Tool } from "../types";
import { StatusBadge, QRCodeSVG } from "../components/shared";
import { Html5Qrcode } from "html5-qrcode";

export function QRScanPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<Tool | null>(null);
  const [camError, setCamError] = useState("");
  const html5QrRef = useRef<Html5Qrcode | null>(null);
  // Guard untuk mencegah double-init di React Strict Mode (useEffect jalan 2x)
  const startedRef = useRef(false);

  const startCamera = (instance: Html5Qrcode) => {
    return instance.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 240, height: 240 } },
      (text) => {
        instance.stop().catch(console.error);
        handleScan(text);
      },
      () => {}
    );
  };

  useEffect(() => {
    // Strict Mode menjalankan useEffect 2x — cegah inisialisasi ganda
    if (startedRef.current) return;
    startedRef.current = true;

    const html5QrCode = new Html5Qrcode("main-reader");
    html5QrRef.current = html5QrCode;

    startCamera(html5QrCode).catch((err) => {
      console.error("Camera error:", err);
      setCamError("Tidak bisa mengakses kamera. Pastikan izin diberikan.");
      startedRef.current = false;
    });

    // Cleanup: hentikan kamera saat pindah halaman
    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
      // Reset guard agar bisa restart jika kembali ke halaman ini
      startedRef.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScan = async (toolId: string) => {
    try {
      const tool = await getToolById(toolId);
      if (tool) {
        if (tool.status === "available") {
          navigate(`/borrow-confirm/${tool.id}`, { replace: true });
        } else if (tool.status === "borrowed" || tool.status === "overdue") {
          navigate(`/return-confirm/${tool.id}`, { replace: true });
        } else {
          // Jika status rusak dll, tetap tampilkan hasilnya di kanan
          setResult(tool);
        }
      } else {
        alert("Alat tidak ditemukan di database.");
        resetScan();
      }
    } catch {
      alert("Alat tidak ditemukan atau ID tidak valid.");
      resetScan();
    }
  };

  const resetScan = () => {
    setResult(null);
    setCamError("");
    setTimeout(() => {
      const html5QrCode = new Html5Qrcode("main-reader");
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
        console.error(err);
        setCamError("Tidak bisa mengakses kamera.");
      });
    }, 300);
  };

  const handleUploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const scanner = new Html5Qrcode("img-scan-tmp");
        const decoded = await scanner.scanFile(file, false);
        await scanner.clear();
        handleScan(decoded);
      } catch {
        alert("Kode QR tidak terbaca dari gambar. Coba gunakan gambar yang lebih jelas.");
      }
    };
    input.click();
  };

  return (
    <div className="p-6">
      <div id="img-scan-tmp" style={{ display: "none" }} />
      <style>{`
        #main-reader video { width: 100% !important; height: 100% !important; object-fit: cover !important; }
        #main-reader > img { display: none !important; }
        #main-reader__scan_region { display: none !important; }
        #main-reader__dashboard { display: none !important; }
      `}</style>

      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-6">
        {/* Panel kiri: kamera */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 flex flex-col">
          <div className="text-center mb-5">
            <h2 className="font-bold text-slate-900">Scanner Kode QR</h2>
            <p className="text-xs text-slate-400 mt-1">Posisikan kode QR di area pemindaian</p>
          </div>

          <div className="relative bg-slate-950 rounded-2xl overflow-hidden flex-1 min-h-[300px]">
            <div id="main-reader" className="absolute inset-0 w-full h-full" />
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

          <div className="mt-4 space-y-2">
            {result ? (
              <button onClick={resetScan} className="w-full flex items-center justify-center gap-2 border border-border text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
                <RefreshCw size={15} /> Scan Alat Lain
              </button>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 py-1">
                  {!camError && <><span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" /> Kamera aktif — mendeteksi QR secara otomatis</>}
                </div>
                <button onClick={handleUploadImage} className="w-full flex items-center justify-center gap-2 border border-border text-slate-500 py-2.5 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors">
                  <ImageIcon size={14} /> Scan dari Gambar / File QR
                </button>
              </>
            )}
          </div>
        </div>

        {/* Panel kanan: hasil scan (Hanya muncul jika scan rusak/tidak bisa dipinjam dll) */}
        <div>
          {!result ? (
            <div className="bg-white rounded-xl border border-border shadow-sm h-full flex items-center justify-center min-h-[300px]">
              <div className="text-center text-slate-300 px-8">
                <Scan size={44} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm font-semibold">Menunggu pemindaian</p>
                <p className="text-xs mt-1">Akan otomatis dialihkan ke halaman peminjaman/pengembalian jika tersedia</p>
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
                    <div className="text-xs font-bold text-slate-800">{result.lastUser || "-"}</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <div className="text-[10px] text-slate-400 mb-0.5">Scan Terakhir</div>
                    <div className="text-xs font-bold text-slate-800">{result.lastScanTime || "-"}</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-border shadow-sm p-5 text-center">
                <AlertTriangle size={32} className="mx-auto text-amber-500 mb-3" />
                <h3 className="font-bold text-slate-900 mb-1">Tidak Dapat Dipinjam/Dikembalikan</h3>
                <p className="text-xs text-slate-500 mb-4">Status saat ini: <span className="font-semibold uppercase">{result.status}</span></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
