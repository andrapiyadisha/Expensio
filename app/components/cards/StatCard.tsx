import { TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function StatCard({
  title,
  value,
  subtitle,
  trend,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
}) {
  const isPositive = trend !== undefined && trend > 0;

  return (
    <div
      className="
        bg-background-card
        text-text-primary
        border border-border-main
        rounded-xl
        p-8
        transition-all duration-300
        hover:border-blue-500/50
        group
        relative
        overflow-hidden
        shadow-xl shadow-black/20
      "
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity blur duration-500"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{title}</p>
          <div className="p-2 bg-background-main rounded-lg border border-border-main group-hover:border-blue-500/20 group-hover:text-blue-400 transition-all font-black text-[10px] tracking-widest flex items-center justify-center">
            <Activity size={12} />
          </div>
        </div>

        <div className="mt-8 mb-4">
          <h2 className="text-3xl font-black tracking-tight tabular-nums drop-shadow-sm group-hover:translate-x-1 transition-transform">
            {value}
          </h2>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-60">
            {subtitle}
          </p>

          {trend !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black tracking-widest ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
