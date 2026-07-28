import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronLeft, ChevronRight, FileDown, FileText, Eye, Loader2 } from "lucide-react";
import { getBorrows, exportBorrows } from "../services/borrowService";
import type { BorrowRecord } from "../types";
import { BorrowBadge } from "../components/shared";

export function BorrowHistoryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sf, setSf] = useState<any>("all");
  const [pg, setPg] = useState(1);
  const perPage = 8;
  
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrows = async () => {
      setLoading(true);
      try {
        const res = await getBorrows({ search, status: sf, page: pg, limit: perPage });
        setRecords(res.data);
        setTotal(res.total);
      } catch(err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchBorrows();
  }, [search, sf, pg]);

  const pages = Math.ceil(total/perPage);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl border border-border shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-52">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Cari berdasarkan nama karyawan atau alat..." value={search} onChange={e => { setSearch(e.target.value); setPg(1); }} className="pl-8 pr-4 py-2 text-xs bg-slate-50 border border-border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <select value={sf} onChange={e => { setSf(e.target.value); setPg(1); }} className="text-xs border border-border rounded-lg px-3 py-2 text-slate-600 focus:outline-none bg-white">
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="returned">Dikembalikan</option>
            <option value="overdue">Terlambat</option>
          </select>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => exportBorrows("csv")} className="flex items-center gap-1.5 border border-border text-slate-500 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"><FileDown size={13} />Ekspor CSV</button>
            <button onClick={() => exportBorrows("pdf")} className="flex items-center gap-1.5 border border-border text-slate-500 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"><FileText size={13} />Ekspor PDF</button>
          </div>
        </div>
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
             <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-blue-500" /></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-slate-50/70">
                  {["ID","Karyawan","Alat","Waktu Pinjam","Waktu Kembali","Durasi","Status",""].map(h => (
                    <th key={h} className="text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3"><span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">{r.id}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 text-[10px] font-bold">{r.employeeName.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{r.employeeName}</div>
                          <div className="text-[10px] text-slate-400">{r.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold text-slate-800">{r.toolName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{r.toolId}</div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs text-slate-600">{new Date(r.borrowTime).toLocaleDateString()}</span></td>
                    <td className="px-4 py-3">{r.returnTime ? <span className="text-xs text-slate-600">{new Date(r.returnTime).toLocaleDateString()}</span> : <span className="text-[10px] text-slate-300 italic">Belum dikembalikan</span>}</td>
                    <td className="px-4 py-3">{r.duration ? <span className="text-xs text-slate-600">{r.duration}</span> : <span className="text-[10px] text-slate-300">—</span>}</td>
                    <td className="px-4 py-3"><BorrowBadge status={r.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/tools/${r.toolId}`)} className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"><Eye size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="px-4 py-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-slate-400">Menampilkan {Math.min((pg-1)*perPage+1,total||1)}–{Math.min(pg*perPage,total)} dari {total} catatan</span>
          <div className="flex items-center gap-1">
            <button onClick={()=>setPg(p=>Math.max(1,p-1))} disabled={pg===1} className="p-1.5 rounded-lg border border-border text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"><ChevronLeft size={14}/></button>
            {Array.from({length:pages},(_,i)=>(
              <button key={i} onClick={()=>setPg(i+1)} className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${pg===i+1?"bg-blue-600 text-white":"border border-border text-slate-500 hover:bg-slate-50"}`}>{i+1}</button>
            ))}
            <button onClick={()=>setPg(p=>Math.min(pages,p+1))} disabled={pg===pages || pages===0} className="p-1.5 rounded-lg border border-border text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors"><ChevronRight size={14}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}
