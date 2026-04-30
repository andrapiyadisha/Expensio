"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  ArrowRight,
  Clock,
  Tag,
  IndianRupee,
  Users,
  Briefcase,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import StatCard from "../../components/cards/StatCard";
import ExpenseChart from "../../components/charts/ExpenseChart";
import { useDashboard } from "../../hooks/useDashboard";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ActivityTimeline from "../../components/dashboard/ActivityTimeline";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const { stats: data, loading, error } = useDashboard();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short'
    }).format(new Date(dateString));
  };

  if (loading || !data) {
    return (
      <div className="space-y-8 animate-pulse p-4">
        <div className="h-8 w-64 bg-background-card rounded-md"></div>
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
            System <span className="text-blue-500">Overview</span>
          </h1>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] mt-1 opacity-60">
            Global network snapshot
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Global Inflow"
          value={formatCurrency(data.totalIncome || 0)}
          subtitle="All Active Users"
          trend={data.incomeChangePercent}
        />
        <StatCard
          title="Global Outflow"
          value={formatCurrency(data.totalExpense || 0)}
          subtitle="All Active Users"
          trend={data.expenseChangePercent}
        />

        {/* Admin Specific Cards */}
        <div className="bg-background-card p-6 rounded-2xl border border-border-main hover:border-blue-500/50 transition-all group cursor-pointer shadow-xl shadow-black/20">
          <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest mb-1 group-hover:text-blue-400">Total Users</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-text-primary tabular-nums tracking-tighter group-hover:translate-x-1 transition-transform">{data.totalPeople || 0}</p>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-all">
              <Users size={18} />
            </div>
          </div>
        </div>

        <div className="bg-background-card p-6 rounded-2xl border border-border-main hover:border-indigo-500/50 transition-all group cursor-pointer shadow-xl shadow-black/20">
          <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest mb-1 group-hover:text-indigo-400">Total Projects</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-black text-text-primary tabular-nums tracking-tighter group-hover:translate-x-1 transition-transform">{data.totalProjects || 0}</p>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-all">
              <Briefcase size={18} />
            </div>
          </div>
        </div>
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
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">Global Sectors</h3>
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
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted opacity-60">Driver</span>
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
                  {formatCurrency(parseFloat(c.total))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS PANEL & ACTIVITY TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-background-card border border-border-main rounded-2xl overflow-hidden shadow-sm group flex flex-col h-full">
          <div className="px-8 py-5 border-b border-border-main flex justify-between items-center bg-background-main/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                <Clock size={16} />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">System Ledger</h3>
                <p className="text-[8px] font-bold text-muted mt-0.5 uppercase opacity-60">Most recent activity globally</p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-border-main/50 flex-grow">
            {data.recentTransactions?.length === 0 ? (
              <div className="py-20 text-center opacity-40 uppercase font-black text-[10px] tracking-widest">No activity recorded</div>
            ) : (
              data.recentTransactions?.map((tx: any, idx: number) => (
                <div key={idx} className="px-8 py-5 flex items-center justify-between hover:bg-background-main/40 transition-all group/tx">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-background-main border border-border-main rounded-xl group-hover/tx:border-blue-500/30 transition-all">
                      <span className="text-[9px] font-black uppercase text-muted tracking-tight">{formatDate(tx.date)?.split(' ')[1]}</span>
                      <span className="text-sm font-black text-text-primary">{formatDate(tx.date)?.split(' ')[0]}</span>
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
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(tx.amount))}
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

        <ActivityTimeline />
      </div>

    </div>
  );
}
