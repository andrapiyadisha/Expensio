"use client";

import { useState, useEffect } from "react";
import {
    Download,
    TrendingUp,
    TrendingDown,
    CreditCard,
    Wallet,
    PieChart as PieChartIcon,
    BarChart2,
    Calendar,
    Filter,
    ArrowRight,
    ChevronDown,
    FileText,
    Briefcase,
    Loader2,
    X
} from "lucide-react";
import toast from "react-hot-toast";
import StatCard from "../../components/cards/StatCard";
import ExpenseChart from "../../components/charts/ExpenseChart";
import IncomeSourceChart from "../../components/charts/IncomeSourceChart";

// Native Chart.js components
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
    const [data, setData] = useState<any>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [isExporting, setIsExporting] = useState<string | null>(null);
    const [statementData, setStatementData] = useState<any>(null);
    const [showStatement, setShowStatement] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [summaryRes, projectsRes] = await Promise.all([
                fetch("/api/dashboard/summary"),
                fetch("/api/projects")
            ]);
            const summaryData = await summaryRes.json();
            const projectsData = await projectsRes.json();
            setData(summaryData);
            setProjects(projectsData);
        } catch (error) {
            console.error("Failed to fetch reports data", error);
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

    const handleExport = async (type: 'excel' | 'pdf') => {
        try {
            setIsExporting(type);
            const res = await fetch(`/api/reports/export/${type}`);
            if (!res.ok) throw new Error("Export failed");
            
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = type === 'excel' ? "Financial_Report.xlsx" : "Wealth_Report.pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success(`${type.toUpperCase()} exported successfully`);
        } catch (error) {
            toast.error(`Failed to export ${type}`);
        } finally {
            setIsExporting(null);
        }
    };

    const handleGenerateStatement = async () => {
        try {
            setIsExporting('statement');
            const res = await fetch("/api/reports/statement");
            const statement = await res.json();
            setStatementData(statement);
            setShowStatement(true);
        } catch (error) {
            toast.error("Failed to generate statement");
        } finally {
            setIsExporting(null);
        }
    };

    const getProfitLossStatus = (net: number) => {
        if (net > 0) return { label: "PROFIT", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
        if (net < 0) return { label: "DEFICIT", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
        return { label: "BREAK-EVEN", color: "text-muted bg-background-main border-border-main" };
    };

    if (loading || !data) {
        return (
            <div className="space-y-8 animate-pulse p-4">
                <div className="h-10 w-48 bg-background-card rounded-md"></div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-background-card rounded-2xl border border-border-main"></div>)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-80 bg-background-card rounded-2xl border border-border-main"></div>
                    <div className="h-80 bg-background-card rounded-2xl border border-border-main"></div>
                </div>
            </div>
        );
    }

    // Pre-process Category Data for Donut Chart
    const categoryChartData = {
        labels: data.categoryWiseExpense?.map((c: any) => c.category) || [],
        datasets: [{
            data: data.categoryWiseExpense?.map((c: any) => c.total) || [],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)', // blue
                'rgba(16, 185, 129, 0.8)', // emerald
                'rgba(244, 63, 94, 0.8)',  // rose
                'rgba(245, 158, 11, 0.8)',  // amber
                'rgba(139, 92, 246, 0.8)',  // violet
            ],
            borderWidth: 0,
            hoverOffset: 20
        }]
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">
                        Financial <span className="text-blue-500">Analytics</span>
                    </h1>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mt-1 opacity-60">
                        Intelligent insights into your cashflow
                    </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => handleExport('pdf')}
                        disabled={!!isExporting}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-background-card border border-border-main text-text-primary px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-background-main transition-all group disabled:opacity-50"
                    >
                        {isExporting === 'pdf' ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />}
                        PDF Report
                    </button>
                    <button 
                        onClick={() => handleExport('excel')}
                        disabled={!!isExporting}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isExporting === 'excel' ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                        Export Excel
                    </button>
                </div>
            </div>

            {/* TOP SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Inflow"
                    value={formatCurrency(data.totalIncome)}
                    subtitle="Lifetime Revenue"
                    trend={data.incomeChangePercent}
                />
                <StatCard
                    title="Total Outflow"
                    value={formatCurrency(data.totalExpense)}
                    subtitle="Lifetime Expenses"
                    trend={data.expenseChangePercent}
                />
                <StatCard
                    title="Net Balance"
                    value={formatCurrency(data.totalBalance)}
                    subtitle="Current Liquidity"
                />
                <StatCard
                    title="Cycle Delta"
                    value={formatCurrency(data.thisMonthIncome - data.thisMonthExpense)}
                    subtitle="Active Month Net"
                />
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Monthly Bar Chart */}
                <div className="lg:col-span-3 bg-background-card border border-border-main rounded-2xl p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-32 -mt-32 group-hover:bg-blue-500/10 transition-all duration-500"></div>

                    <div className="relative h-full">
                        <ExpenseChart
                            labels={data.monthlyLabels}
                            expenses={data.monthlyExpenseData}
                            incomes={data.monthlyIncomeData}
                        />
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="lg:col-span-2 bg-background-card border border-border-main rounded-2xl p-8 shadow-sm relative overflow-hidden group">
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-primary">Capital Allocation</h3>
                                <p className="text-[10px] font-bold text-muted mt-1 uppercase opacity-60">Expense Distribution</p>
                            </div>
                            <PieChartIcon size={18} className="text-blue-500" />
                        </div>

                        <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
                            <Doughnut
                                data={categoryChartData}
                                options={{
                                    cutout: '75%',
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            backgroundColor: '#1e293b',
                                            titleColor: '#f1f5f9',
                                            bodyColor: '#94a3b8',
                                            padding: 12,
                                            cornerRadius: 8,
                                            borderColor: '#334155',
                                            borderWidth: 1,
                                        }
                                    }
                                }}
                            />
                            <div className="absolute flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted opacity-60">Top Seg</span>
                                <span className="text-lg font-black text-text-primary tracking-tighter">
                                    {data.topSpendingCategory || "N/A"}
                                </span>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {data.categoryWiseExpense?.slice(0, 4).map((c: any, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryChartData.datasets[0].backgroundColor[i] }}></div>
                                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tight truncate">
                                        {c.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* PROJECT PERFORMANCE TABLE */}
            <div className="bg-background-card border border-border-main rounded-2xl overflow-hidden shadow-xl shadow-black/20 group">
                <div className="px-8 py-6 border-b border-border-main flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-primary">Engagement Performance</h3>
                        <p className="text-[10px] font-bold text-muted mt-1 uppercase opacity-60">Project-wise financial status</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-background-main border border-border-main rounded-lg text-[9px] font-black text-muted uppercase tracking-widest">
                        <Briefcase size={12} />
                        {projects.length} Active Trips
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-background-main/80 border-b border-border-main">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Trip / Project Details</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Inflow</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Outflow</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Net Liquidity</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-main/50">
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center opacity-40 uppercase font-black text-[10px] tracking-widest">No commercial data linked to projects</td>
                                </tr>
                            ) : (
                                projects.map((proj) => {
                                    const status = getProfitLossStatus(0 - proj.Spent); // Inflow data missing in api/projects, assuming outflow only for now or 0 inflow
                                    return (
                                        <tr key={proj.ProjectID} className="hover:bg-background-main/50 transition-all group/row">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-text-primary uppercase tracking-tight">{proj.ProjectName}</span>
                                                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-60 truncate max-w-[200px]">{proj.ProjectDetail || "Strategic Initiative"}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-[11px] font-black text-emerald-400 opacity-40 tabular-nums">
                                                    ₹0.00
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-[11px] font-black text-rose-400 tabular-nums">
                                                    ₹{parseFloat(proj.Spent).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`text-[12px] font-black tabular-nums tracking-tighter ${proj.Spent > 0 ? 'text-rose-400' : 'text-text-primary'}`}>
                                                    -₹{parseFloat(proj.Spent).toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-center">
                                                    <span className={`px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-[0.2em] border ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FINAL ANALYTICS FOOTER */}
            <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                        <TrendingUp className="text-white" size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-text-primary">Capital Sustainability</h4>
                        <p className="text-[10px] font-bold text-muted mt-1 uppercase opacity-60">Analytics calculated based on all recorded ledger entries</p>
                    </div>
                </div>
                <button 
                    onClick={handleGenerateStatement}
                    disabled={!!isExporting}
                    className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isExporting === 'statement' && <Loader2 size={14} className="animate-spin" />}
                    Generate Full Statement
                </button>
            </div>

            {/* STATEMENT MODAL */}
            {showStatement && statementData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-background-card border border-border-main rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
                        <div className="px-8 py-6 border-b border-border-main flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-text-primary">Financial Statement</h3>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Full Ledger Audit Summary</p>
                            </div>
                            <button onClick={() => setShowStatement(false)} className="p-2 hover:bg-background-main rounded-xl transition-colors">
                                <X size={20} className="text-text-secondary" />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Total Inflow</span>
                                    <span className="text-xl font-black text-text-primary">{formatCurrency(statementData.totalIncome)}</span>
                                </div>
                                <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                                    <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest block mb-1">Total Outflow</span>
                                    <span className="text-xl font-black text-text-primary">{formatCurrency(statementData.totalExpense)}</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Monthly Performance</h4>
                                <div className="space-y-3">
                                    {statementData.monthlyBreakdown.map((m: any) => (
                                        <div key={m.month} className="flex items-center justify-between text-xs p-3 bg-background-main/50 rounded-xl border border-border-main/50">
                                            <span className="font-black text-text-primary uppercase tracking-tighter w-12">{m.month}</span>
                                            <div className="flex-1 flex gap-4 justify-end">
                                                <span className="text-emerald-400 font-bold">+{formatCurrency(m.income)}</span>
                                                <span className="text-rose-400 font-bold">-{formatCurrency(m.expense)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-4">Project Insights</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {statementData.projectBreakdown.map((p: any) => (
                                        <div key={p.name} className="p-4 bg-background-main/30 border border-border-main/30 rounded-2xl">
                                            <span className="text-[11px] font-black text-text-primary uppercase block mb-2">{p.name}</span>
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span className="text-muted">Net:</span>
                                                <span className={p.income - p.expense >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                                    {formatCurrency(p.income - p.expense)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-background-main/50 border-t border-border-main text-center">
                            <p className="text-[9px] font-bold text-muted uppercase tracking-widest">End of Financial Statement</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
