// ─── QR Code Generator Component ─────────────────────────────────────────────
// Komponen ini menghasilkan QR Code yang BENAR-BENAR BISA DI-SCAN
// menggunakan library `qrcode` (bukan sekadar gambar dekoratif).
//
// Cara kerja:
// 1. Menerima string `value` (biasanya Tool ID seperti "TL-016")
// 2. Menggenerate QR code ke dalam elemen <canvas>
// 3. Menyediakan fungsi download sebagai file PNG

import { useEffect, useRef, useCallback } from "react";
import QRCode from "qrcode";

interface QRGeneratorProps {
  /** Nilai yang akan di-encode ke dalam QR Code (biasanya Tool ID) */
  value: string;
  /** Ukuran QR code dalam piksel (default: 200) */
  size?: number;
  /** Callback opsional untuk mendapatkan referensi canvas (untuk download) */
  onCanvasReady?: (canvas: HTMLCanvasElement) => void;
}

/** Merender QR Code yang bisa di-scan ke elemen canvas */
export function QRGenerator({ value, size = 200, onCanvasReady }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value.trim()) return;

    QRCode.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 2,
      color: {
        dark: "#111827",   // warna titik QR
        light: "#FFFFFF",  // warna background
      },
      errorCorrectionLevel: "H", // Level H = tahan kerusakan hingga 30%
    }).then(() => {
      if (onCanvasReady && canvasRef.current) {
        onCanvasReady(canvasRef.current);
      }
    }).catch((err) => {
      console.error("[QRGenerator] Gagal generate QR:", err);
    });
  }, [value, size, onCanvasReady]);

  if (!value.trim()) return (
    <div
      style={{ width: size, height: size }}
      className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center"
    >
      <p className="text-xs text-slate-400 text-center px-4">
        Isi nama alat<br />untuk preview QR
      </p>
    </div>
  );

  return (
    <canvas
      ref={canvasRef}
      className="rounded-xl shadow-sm"
      style={{ width: size, height: size }}
    />
  );
}

// ─── Hook: useQRDownload ────────────────────────────────────────────────────────
/** Hook untuk men-download QR Code sebagai file PNG */
export function useQRDownload() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    canvasRef.current = canvas;
  }, []);

  /**
   * Mendownload QR code sebagai file PNG
   * @param filename - Nama file yang didownload (tanpa ekstensi), contoh: "QR-TL-016"
   */
  const downloadQR = useCallback((filename: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Buat canvas baru dengan label teks di bawah QR
    const padding = 16;
    const labelHeight = 36;
    const newCanvas = document.createElement("canvas");
    newCanvas.width  = canvas.width  + padding * 2;
    newCanvas.height = canvas.height + padding * 2 + labelHeight;

    const ctx = newCanvas.getContext("2d")!;

    // Background putih
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

    // Border tipis
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, newCanvas.width - 1, newCanvas.height - 1);

    // Gambar QR code
    ctx.drawImage(canvas, padding, padding);

    // Label teks (Tool ID)
    ctx.fillStyle = "#111827";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText(filename.replace("QR-", ""), newCanvas.width / 2, canvas.height + padding + 22);

    // Download
    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = newCanvas.toDataURL("image/png");
    link.click();
  }, []);

  return { handleCanvasReady, downloadQR };
}
