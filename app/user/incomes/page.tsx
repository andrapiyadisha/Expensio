"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    Plus,
    Search,
    Filter,
    Download,
    LayoutGrid,
    Table as TableIcon,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    MoreVertical,
    Edit,
    Trash2,
    Paperclip,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    TrendingUp,
    CreditCard
} from "lucide-react";
import StatCard from "../../components/cards/StatCard";
import AddIncomeModal from "../../components/modals/AddIncomeModal";

export default function IncomesPage() {
    const [incomes, setIncomes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"table" | "card">("table");
    const [openModal, setOpenModal] = useState(false);
    const [editingIncome, setEditingIncome] = useState<any>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [projectFilter, setProjectFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Summary Data
    const [summary, setSummary] = useState<any>({
        totalIncome: 0,
        thisMonthIncome: 0,
        incomeChangePercent: 0,
        topIncomeCategory: "None"
    });

    // Pagination
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<any>({ totalPages: 1, total: 0 });

    // Lookups
    const [categories, setCategories] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        fetchLookups();
        fetchSummary();
    }, []);

    useEffect(() => {
        fetchIncomes();
    }, [page, categoryFilter, projectFilter, startDate, endDate]);

    const fetchLookups = async () => {
        try {
            const [catRes, projRes] = await Promise.all([
                fetch("/api/categories"),
                fetch("/api/projects")
            ]);
            const cats = await catRes.json();
            const projs = await projRes.json();
            setCategories(cats.filter((c: any) => c.IsIncome));
            setProjects(projs);
        } catch (err) {
            console.error("Lookup fetch failed", err);
        }
    };

    const fetchSummary = async () => {
        try {
            const res = await fetch("/api/dashboard/summary");
            const data = await res.json();
            setSummary({
                totalIncome: data.totalIncome || 0,
                thisMonthIncome: data.thisMonthIncome || 0,
                incomeChangePercent: data.incomeChangePercent || 0,
                topIncomeCategory: data.topIncomeCategory || "None"
            });
        } catch (err) {
            console.error("Summary fetch failed", err);
        }
    };

    const fetchIncomes = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "10",
                search,
                categoryId: categoryFilter,
                projectId: projectFilter,
                startDate,
                endDate
            });
            const res = await fetch(`/api/incomes?${params.toString()}`);
            const data = await res.json();
            setIncomes(data.data);
            setMeta(data.meta);
        } catch (error) {
            toast.error("Failed to load incomes");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (IncomeID: number) => {
        if (!confirm("Are you sure you want to delete this income record?")) return;
        try {
            const res = await fetch("/api/incomes", {
                method: "DELETE",
                body: JSON.stringify({ IncomeID }),
            });
            if (res.ok) {
                toast.success("Income deleted");
                fetchIncomes();
                fetchSummary();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleExport = () => {
        window.location.href = "/api/incomes/export";
    };

    // Modern Date Format Utility (Native)
    const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">
                        All <span className="text-emerald-500">Incomes</span>
                    </h1>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mt-1 opacity-60">
                        Aggregated revenue streams across all users
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={handleExport}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-background-card border border-border-main text-text-primary px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-background-main transition-all group"
                    >
                        <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                        Export
                    </button>
                    <button
                        onClick={() => { setEditingIncome(null); setOpenModal(true); }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Plus size={16} />
                        Add Income
                    </button>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    title="Total Treasury"
                    value={formatCurrency(summary.totalIncome)}
                    subtitle="Lifetime Inflow"
                />
                <StatCard
                    title="Monthly Delta"
                    value={formatCurrency(summary.thisMonthIncome)}
                    subtitle="Current Cycle"
                    trend={summary.incomeChangePercent}
                />
                <StatCard
                    title="Primary Source"
                    value={summary.topIncomeCategory}
                    subtitle="Main Contributor"
                />
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="bg-background-card border border-border-main rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-500"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex-1 w-full relative group/input">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-emerald-400 transition-colors" size={18} />
                        <input
                            placeholder="Search details..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchIncomes()}
                            className="w-full bg-background-main/50 border border-border-main rounded-xl py-3.5 pl-12 pr-6 text-xs font-bold text-text-primary outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:opacity-40"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="flex-1 lg:flex-none relative h-full">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full bg-background-main/50 border border-border-main rounded-xl px-4 pr-10 py-3.5 text-[10px] font-black uppercase tracking-widest text-text-primary outline-none cursor-pointer hover:border-emerald-500/30 transition-all appearance-none min-w-[140px]"
                            >
                                <option value="">All Categories</option>
                                {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none opacity-50" />
                        </div>

                        <div className="flex-1 lg:flex-none relative h-full">
                            <select
                                value={projectFilter}
                                onChange={(e) => setProjectFilter(e.target.value)}
                                className="w-full bg-background-main/50 border border-border-main rounded-xl px-4 pr-10 py-3.5 text-[10px] font-black uppercase tracking-widest text-text-primary outline-none cursor-pointer hover:border-emerald-500/30 transition-all appearance-none min-w-[140px]"
                            >
                                <option value="">All Projects</option>
                                {projects.map(p => <option key={p.ProjectID} value={p.ProjectID}>{p.ProjectName}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none opacity-50" />
                        </div>

                        <div className="h-10 w-px bg-border-main hidden lg:block mx-2"></div>

                        <div className="flex items-center bg-background-main/50 p-1 rounded-xl border border-border-main">
                            <button
                                onClick={() => setView("table")}
                                className={`p-2.5 rounded-lg transition-all ${view === "table" ? "bg-background-card text-emerald-400 shadow-lg border border-border-main" : "text-muted hover:text-text-primary"}`}
                            >
                                <TableIcon size={16} />
                            </button>
                            <button
                                onClick={() => setView("card")}
                                className={`p-2.5 rounded-lg transition-all ${view === "card" ? "bg-background-card text-emerald-400 shadow-lg border border-border-main" : "text-muted hover:text-text-primary"}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            {view === "table" ? (
                <div className="bg-background-card border border-border-main rounded-2xl overflow-hidden shadow-xl shadow-black/20 group">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-background-main/80 border-b border-border-main">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Date</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Entity / Source</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Classification</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Inflow</th>
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-main/50">
                                {loading ? (
                                    <tr><td colSpan={5} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-muted animate-pulse">Scanning Ledger...</td></tr>
                                ) : incomes.length === 0 ? (
                                    <tr><td colSpan={5} className="py-20 text-center space-y-4">
                                        <div className="w-16 h-16 bg-background-main rounded-2xl flex items-center justify-center mx-auto border border-border-main">
                                            <Wallet size={24} className="text-muted" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">No Income Records Available</p>
                                    </td></tr>
                                ) : (
                                    incomes.map((inc) => (
                                        <tr key={inc.IncomeID} className="hover:bg-background-main/50 transition-all group/row">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-text-primary uppercase tracking-tight">
                                                        {formatDate(inc.IncomeDate, { day: '2-digit', month: 'short' })}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest">
                                                        {formatDate(inc.IncomeDate, { year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-text-primary uppercase tracking-tight">{inc.IncomeDetail || "Generic Credit"}</span>
                                                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest opacity-70">{inc.projects?.ProjectName || "Standalone"}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 bg-background-main border border-border-main rounded text-[9px] font-black uppercase tracking-widest text-text-secondary">
                                                        {inc.categories?.CategoryName}
                                                    </span>
                                                    {inc.sub_categories && (
                                                        <span className="text-muted text-[10px]">/</span>
                                                    )}
                                                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest">
                                                        {inc.sub_categories?.SubCategoryName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-sm font-black text-emerald-400 tabular-nums tracking-tighter">
                                                    +{formatCurrency(parseFloat(inc.Amount))}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex gap-2 justify-end opacity-0 group-hover/row:opacity-100 transition-all">
                                                    {inc.AttachmentPath && (
                                                        <a href={inc.AttachmentPath} target="_blank" rel="noreferrer" className="p-2 hover:bg-background-main rounded-lg text-muted hover:text-emerald-400 transition-all">
                                                            <Paperclip size={14} />
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => { setEditingIncome(inc); setOpenModal(true); }}
                                                        className="p-2 hover:bg-background-main rounded-lg text-muted hover:text-blue-400 border border-transparent hover:border-border-main transition-all"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(inc.IncomeID)}
                                                        className="p-2 hover:bg-background-main rounded-lg text-muted hover:text-rose-400 border border-transparent hover:border-border-main transition-all"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-48 bg-background-card border border-border-main rounded-2xl animate-pulse"></div>
                        ))
                    ) : incomes.length === 0 ? (
                        <div className="col-span-full py-20 text-center opacity-40 uppercase font-black text-[10px] tracking-widest">ledger empty</div>
                    ) : (
                        incomes.map((inc) => (
                            <div key={inc.IncomeID} className="bg-background-card border border-border-main rounded-2xl p-6 hover:border-emerald-500/30 transition-all group hover:translate-y-[-4px] shadow-xl shadow-black/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                                    <button onClick={() => { setEditingIncome(inc); setOpenModal(true); }} className="p-2 bg-background-main border border-border-main rounded-lg text-muted hover:text-blue-400">
                                        <Edit size={14} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.2em] rounded">
                                        {inc.categories?.CategoryName}
                                    </div>
                                    <span className="text-[10px] font-black text-muted uppercase tracking-widest mt-1">
                                        {formatDate(inc.IncomeDate, { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-black text-text-primary uppercase tracking-tight line-clamp-1">{inc.IncomeDetail || "N/A"}</h3>
                                        <p className="text-[9px] font-bold text-muted uppercase tracking-wider mt-1">{inc.sub_categories?.SubCategoryName || "Direct Revenue"}</p>
                                    </div>

                                    <div className="flex justify-between items-end pt-4 border-t border-border-main/50">
                                        <div>
                                            <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Total Yield</p>
                                            <p className="text-lg font-black text-emerald-400 tracking-tighter">+{formatCurrency(parseFloat(inc.Amount))}</p>
                                        </div>
                                        <button onClick={() => handleDelete(inc.IncomeID)} className="text-rose-500/50 hover:text-rose-500 transition-colors p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* PAGINATION */}
            <div className="flex justify-between items-center py-6">
                <p className="text-[10px] font-black text-muted uppercase tracking-widest">
                    Displaying <span className="text-text-primary">{incomes.length}</span> of <span className="text-text-primary">{meta.total}</span>
                </p>
                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-3 bg-background-card border border-border-main rounded-xl text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div className="flex items-center px-4 bg-background-main rounded-xl border border-border-main text-[10px] font-black uppercase text-emerald-400">
                        {page} / {meta.totalPages}
                    </div>
                    <button
                        disabled={page === meta.totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="p-3 bg-background-card border border-border-main rounded-xl text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <AddIncomeModal
                open={openModal}
                onClose={() => { setOpenModal(false); setEditingIncome(null); }}
                onSuccess={() => { fetchIncomes(); fetchSummary(); }}
                initialData={editingIncome}
            />
        </div>
    );
}
