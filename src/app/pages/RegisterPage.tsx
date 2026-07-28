import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { QrCode, Eye, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { getDepartments } from "../services/employeeService";
import { register } from "../services/authService";

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState(false);
  
  const [depts, setDepts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDepartments().then(setDepts).catch(console.error);
  }, []);

  const passMatch = pass === confirmPass;
  const canSubmit = name && email && dept && position && pass && passMatch && pass.length >= 6;

  const handleRegister = async () => { 
    if (!canSubmit) return;
    setLoading(true);
    try {
      await register({
        name,
        email,
        department: dept,
        position,
        phone,
        password: pass
      });
      setDone(true);
    } catch (err: any) {
      alert(err.message || "Gagal melakukan registrasi.");
    }
    setLoading(false);
  };

  if (done) return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-border shadow-sm p-10 text-center max-w-sm w-full">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
          <CheckCircle size={36} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">Akun Berhasil Dibuat!</h2>
        <p className="text-sm text-slate-500 mt-1">Selamat datang, <strong>{name}</strong>. Akun Anda sudah aktif.</p>
        <button onClick={() => navigate("/dashboard")} className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
          Masuk Sekarang
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-7">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 mb-3">
            <QrCode size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Buat Akun Baru</h1>
          <p className="text-xs text-slate-400 mt-1">Daftar untuk mengakses sistem ToolTrack QR</p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Nama Lengkap</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="contoh: Budi Santoso" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 placeholder:text-slate-300" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@perusahaan.com" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 placeholder:text-slate-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Departemen</label>
              <select value={dept} onChange={e => setDept(e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 text-slate-600">
                <option value="">Pilih departemen</option>
                {depts.map(d => <option key={d}>{d}</option>)}
                <option value="IT">IT</option>
                <option value="Network">Network</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Jabatan</label>
              <input type="text" value={position} onChange={e => setPosition(e.target.value)} placeholder="contoh: IT Support" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 placeholder:text-slate-300" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">No. Telepon <span className="text-slate-400 font-normal">(opsional)</span></label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+62 8xx-xxxx-xxxx" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 placeholder:text-slate-300" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={pass} onChange={e => setPass(e.target.value)} placeholder="Min. 6 karakter" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 placeholder:text-slate-300 pr-9" />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <Eye size={14} className={showPass ? "" : "opacity-50"} />
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Konfirmasi Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Ulangi password" className={`w-full px-3.5 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-slate-50 placeholder:text-slate-300 pr-9 transition-colors ${confirmPass && !passMatch ? "border-red-300 focus:ring-red-500/20 focus:border-red-400" : "border-border focus:ring-blue-500/20 focus:border-blue-500"}`} />
                {confirmPass && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passMatch ? <CheckCircle size={14} className="text-emerald-500" /> : <AlertTriangle size={14} className="text-red-400" />}
                  </span>
                )}
              </div>
              {confirmPass && !passMatch && <p className="text-[10px] text-red-500 mt-1">Password tidak cocok</p>}
            </div>
          </div>

          <button onClick={handleRegister} disabled={!canSubmit || loading} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all shadow-sm shadow-blue-600/20">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            Buat Akun
          </button>
        </div>

        <p className="text-center text-sm text-slate-400 mt-4">
          Sudah punya akun?{" "}
          <button onClick={() => navigate("/login")} className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Masuk</button>
        </p>
      </div>
    </div>
  );
}
