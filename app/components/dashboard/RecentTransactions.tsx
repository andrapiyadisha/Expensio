import { ArrowUpRight, ShoppingBag, Edit2, Trash2, Calendar, Tag, CheckCircle2 } from "lucide-react";

export default function RecentTransactions({ transactions = [] }: { transactions?: any[] }) {
  return (
    <div className="bg-background-card border border-border-main rounded-xl p-8 shadow-sm flex flex-col h-full transition-all duration-300">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Recent Activity</h3>
          <p className="text-[10px] font-bold text-muted mt-1 uppercase opacity-60">Transactional History</p>
        </div>
        <button className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-text-primary transition-colors underline underline-offset-4">View All</button>
      </div>

      <div className="space-y-3 flex-grow">
        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted opacity-40">
            <Calendar size={32} className="mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest">No transactions found</p>
          </div>
        )}
        {transactions.map((t, i) => (
          <div
            key={i}
            className="group flex items-center justify-between p-4 rounded-xl bg-background-main/20 border border-transparent hover:border-border-main hover:bg-background-main/50 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              {/* Type Icon */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-lg bg-background-main border border-border-main transition-all group-hover:scale-105 duration-300 ${t.type === 'income' ? 'text-blue-400 group-hover:border-blue-400/30' : 'text-rose-400 group-hover:border-rose-400/30'}`}
              >
                {t.type === 'income' ? <ArrowUpRight size={18} /> : <ShoppingBag size={18} />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-text-primary text-xs tracking-tight group-hover:text-blue-400 transition-colors uppercase">{t.title}</p>
                  {/* Status Badge */}
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-sm shadow-emerald-950/20">
                    <CheckCircle2 size={8} />
                    <span className="text-[7px] font-black uppercase tracking-widest">Verified</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 opacity-80">
                  <div className="flex items-center gap-1 text-[9px] text-text-secondary font-bold uppercase tracking-wider">
                    <Calendar size={10} className="text-blue-500/50" />
                    {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-text-secondary font-bold uppercase tracking-wider px-2 py-0.5 bg-background-main rounded-full border border-border-main group-hover:border-blue-500/20 transition-all">
                    <Tag size={10} className="text-blue-500/50" />
                    {t.category || "General"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className={`text-sm font-black tabular-nums tracking-tighter drop-shadow-sm ${t.type === 'income' ? 'text-blue-400' : 'text-rose-400'}`}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
              </span>

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                <button className="p-1 px-2 rounded-md bg-background-main border border-border-main hover:bg-foreground hover:text-background text-text-secondary transition-all shadow-lg shadow-black/40">
                  <Edit2 size={12} />
                </button>
                <button className="p-1 px-2 rounded-md bg-background-main border border-border-main hover:bg-rose-500 hover:text-white text-text-secondary transition-all shadow-lg shadow-black/40">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
