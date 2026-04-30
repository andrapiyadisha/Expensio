"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  Tag,
  IndianRupee,
  LayoutDashboard,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import StatCard from "../../components/cards/StatCard";
import ExpenseChart from "../../components/charts/ExpenseChart";

// Native Chart.js components
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/summary");
      const summaryData = await res.json();
      setData(summaryData);
    } catch (error) {
      console.error("Failed to fetch dashboard summary", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short'
    }).format(new Date(dateString));
  };

  if (loading || !data) {
    return (
      <div className="space-y-8 animate-pulse p-4">
        <div className="h-8 w-48 bg-background-card rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-background-card rounded-2xl border border-border-main"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-80 bg-background-card rounded-2xl border border-border-main"></div>
          <div className="h-80 bg-background-card rounded-2xl border border-border-main"></div>
        </div>
      </div>
    );
  }

  // Pre-process Category Data for mini Donut
  const topCategories = data.categoryWiseExpense?.slice(0, 3) || [];
  const categoryChartData = {
    labels: topCategories.map((c: any) => c.category),
    datasets: [{
      data: topCategories.map((c: any) => c.total),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)', // blue
        'rgba(16, 185, 129, 0.8)', // emerald
        'rgba(244, 63, 94, 0.8)',  // rose
      ],
      borderWidth: 0,
    }]
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black uppercase tracking-tight text-text-primary">
            Quick <span className="text-blue-500">Overview</span>
          </h1>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mt-1 opacity-60">
            Current financial snapshot
          </p>
        </div>
        <Link
          href="/user/reports"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors group"
        >
          View Full Reports
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Inflow"
          value={formatCurrency(data.totalIncome)}
          subtitle="Cumulative Reciepts"
          trend={data.incomeChangePercent}
        />
        <StatCard
          title="Total Outflow"
          value={formatCurrency(data.totalExpense)}
          subtitle="Cumulative Payments"
          trend={data.expenseChangePercent}
        />
        <StatCard
          title="Net Liquidity"
          value={formatCurrency(data.totalBalance)}
          subtitle="Available Capital"
        />
        <StatCard
          title="Monthly Delta"
          value={formatCurrency(data.thisMonthIncome - data.thisMonthExpense)}
          subtitle="Current Cycle Net"
        />
      </div>

      {/* ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SMALL MONTHLY CHART */}
        <div className="lg:col-span-2 bg-background-card border border-border-main rounded-2xl p-8 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-500"></div>
          <div className="h-[280px]">
            <ExpenseChart
              labels={data.monthlyLabels}
              expenses={data.monthlyExpenseData}
              incomes={data.monthlyIncomeData}
            />
          </div>
        </div>

        {/* TOP CATEGORIES DONUT */}
        <div className="bg-background-card border border-border-main rounded-2xl p-8 shadow-sm group">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">Top Sectors</h3>
              <p className="text-[8px] font-bold text-muted mt-1 uppercase opacity-60">Expense Focus</p>
            </div>
          </div>

          <div className="relative h-48 flex items-center justify-center">
            <Doughnut
              data={categoryChartData}
              options={{
                cutout: '80%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true }
                }
              }}
            />
            <div className="absolute flex flex-col items-center">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted opacity-60">Focus</span>
              <span className="text-sm font-black text-text-primary tracking-tighter">
                {topCategories[0]?.category || "None"}
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {topCategories.map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between group/item">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: categoryChartData.datasets[0].backgroundColor[i] }}></div>
                  <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tight">{c.category}</span>
                </div>
                <span className="text-[10px] font-black text-text-primary tabular-nums">
                  ₹{parseFloat(c.total).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS PANEL */}
      <div className="bg-background-card border border-border-main rounded-2xl overflow-hidden shadow-sm group">
        <div className="px-8 py-5 border-b border-border-main flex justify-between items-center bg-background-main/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Clock size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">Live Ledger</h3>
              <p className="text-[8px] font-bold text-muted mt-0.5 uppercase opacity-60">Most recent activity</p>
            </div>
          </div>
          <Link
            href="/user/expenses"
            className="px-4 py-2 bg-background-main border border-border-main rounded-xl text-[9px] font-black text-muted uppercase tracking-widest hover:text-blue-500 hover:border-blue-500/30 transition-all"
          >
            Full History
          </Link>
        </div>

        <div className="divide-y divide-border-main/50">
          {data.recentTransactions?.length === 0 ? (
            <div className="py-20 text-center opacity-40 uppercase font-black text-[10px] tracking-widest">No activity recorded</div>
          ) : (
            data.recentTransactions.map((tx: any) => (
              <div key={tx.id} className="px-8 py-5 flex items-center justify-between hover:bg-background-main/40 transition-all group/tx">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center w-12 h-12 bg-background-main border border-border-main rounded-xl group-hover/tx:border-blue-500/30 transition-all">
                    <span className="text-[9px] font-black uppercase text-muted tracking-tight">{formatDate(tx.date).split(' ')[1]}</span>
                    <span className="text-sm font-black text-text-primary">{formatDate(tx.date).split(' ')[0]}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-text-primary uppercase tracking-tight">{tx.title}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Tag size={10} className="text-muted" />
                      <span className="text-[9px] font-black text-muted uppercase tracking-widest opacity-60">{tx.category || "General"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className={`text-[13px] font-black tabular-nums tracking-tighter ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}₹{parseFloat(tx.amount).toLocaleString()}
                  </span>
                  <span className={`text-[8px] font-black uppercase tracking-widest mt-1 opacity-50 ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {tx.type}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* DASHBOARD FOOTER ACTION */}
      <div className="flex flex-col sm:flex-row gap-6">
        <Link
          href="/user/expenses"
          className="flex-1 p-6 bg-background-card border border-border-main rounded-2xl hover:border-blue-500/30 transition-all group shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
              <IndianRupee size={20} />
            </div>
            <ExternalLink size={14} className="text-muted opacity-20 group-hover:opacity-100 transition-all" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-tight text-text-primary">Track Expense</h4>
          <p className="text-[10px] font-bold text-muted mt-1 uppercase opacity-60">Log new operational costs</p>
        </Link>

        <Link
          href="/user/incomes"
          className="flex-1 p-6 bg-background-card border border-border-main rounded-2xl hover:border-emerald-500/30 transition-all group shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <TrendingUp size={20} />
            </div>
            <ExternalLink size={14} className="text-muted opacity-20 group-hover:opacity-100 transition-all" />
          </div>
          <h4 className="text-xs font-black uppercase tracking-tight text-text-primary">Record Income</h4>
          <p className="text-[10px] font-bold text-muted mt-1 uppercase opacity-60">Register new revenue inflow</p>
        </Link>
      </div>
    </div>
  );
}
