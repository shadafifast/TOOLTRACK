import { useState } from "react";
import { useNavigate } from "react-router";
import { QrCode, Eye, Scan, Loader2 } from "lucide-react";
import { login } from "../services/authService";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message || "Email atau password salah.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 mb-4">
            <QrCode size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">ToolTrack QR</h1>
          <p className="text-sm text-slate-400 mt-1">Selamat datang! Silakan masuk untuk melanjutkan.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm p-7 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="nama@perusahaan.com"
              className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 placeholder:text-slate-300"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50 placeholder:text-slate-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Eye size={15} className={showPass ? "" : "opacity-50"} />
              </button>
            </div>
            <div className="flex justify-end mt-1.5">
              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">Lupa password?</button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-blue-600/20 mt-1"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            Masuk
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-300">atau</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <button
            onClick={() => navigate("/quick-scan")}
            className="w-full flex items-center justify-center gap-2.5 border-2 border-blue-200 text-blue-600 bg-blue-50/60 py-2.5 rounded-xl text-sm font-semibold hover:border-blue-400 hover:bg-blue-100/60 active:scale-[0.98] transition-all"
          >
            <Scan size={16} />
            Scan QR Alat (Tanpa Login)
          </button>
        </div>

        <p className="text-center text-sm text-slate-400 mt-5">
          Belum punya akun?{" "}
          <button onClick={() => navigate("/register")} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
            Daftar
          </button>
        </p>
      </div>
    </div>
  );
}
