"use client";

interface ProjectCardProps {
  name: string;
  manager: string;
  budget: number;
  spent: number;
  status: "Active" | "Completed" | "Delayed" | "Inactive";
  progress: number;
}

export default function ProjectCard({
  name,
  manager,
  budget,
  spent,
  status,
  progress,
}: ProjectCardProps) {
  const percent = budget > 0 ? Math.round((spent / budget) * 100) : 0;

  const statusStyle =
    status === "Active"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-sm shadow-emerald-950/20"
      : status === "Completed"
        ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm shadow-blue-950/20"
        : "bg-background-main text-text-secondary border-border-main opacity-60";

  return (
    <div className="bg-background-card border border-border-main rounded-xl p-8 space-y-8 hover:border-blue-500/30 transition-all duration-300 group relative overflow-hidden shadow-xl shadow-black/20">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur duration-500"></div>

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-black uppercase tracking-tight text-text-primary group-hover:text-blue-400 transition-colors drop-shadow-sm">{name}</h3>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1 opacity-60">Lead: {manager}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-[0.2em] border ${statusStyle}`}>
          {status}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-1">Allocation</p>
            <p className="text-sm font-black text-text-primary">₹{budget.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted mb-1">Utilization</p>
            <p className="text-sm font-black text-text-primary">₹{spent.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em]">
            <span className={percent > 100 ? "text-rose-400 animate-pulse drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]" : "text-text-secondary"}>
              {percent > 100 ? "CRITICAL OVERRUN" : "Utilization Index"}
            </span>
            <span className="text-text-primary tabular-nums">{percent}%</span>
          </div>
          <div className="w-full h-2 bg-background-main rounded-full overflow-hidden border border-border-main/50 shadow-inner">
            <div
              className={`h-full transition-all duration-1000 ease-out shadow-lg ${percent > 100 ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-blue-600 to-blue-400'}`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-border-main/30">
          <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em]">
            <span className="text-text-secondary">Completion Progress</span>
            <span className="text-blue-400 tabular-nums">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-background-main rounded-full overflow-hidden border border-border-main/30">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.2)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
