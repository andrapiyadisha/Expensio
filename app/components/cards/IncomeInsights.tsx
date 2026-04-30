export default function IncomeInsights({ topSource = "N/A", percentage = 0 }: { topSource?: string; percentage?: number }) {
  return (
    <div className="bg-background-card border border-border-main rounded-xl p-8 flex flex-col justify-center h-full">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-muted">Intelligent Summary</h3>
      <p className="text-xs font-bold text-text-primary uppercase tracking-tight leading-relaxed">
        Primary equity source identified as <span className="text-background bg-foreground px-2 py-0.5 rounded ml-1">{topSource}</span>.
        {percentage > 0 && <span className="block mt-2 opacity-60 text-[10px]">Accounts for {percentage.toFixed(1)}% of total verified liquidity.</span>}
      </p>
    </div>
  );
}
