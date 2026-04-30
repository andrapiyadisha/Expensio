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
    MoreVertical,
    Edit,
    Trash2,
    Paperclip,
    ArrowUpRight,
    ArrowDownRight,
    Wallet
} from "lucide-react";
import StatCard from "../../components/cards/StatCard";
import AddExpenseModal from "../../components/modals/AddExpenseModal";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<"table" | "card">("table");
    const [openModal, setOpenModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState<any>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [projectFilter, setProjectFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Summary Data
    const [summary, setSummary] = useState<any>({
        totalExpense: 0,
        thisMonthExpense: 0,
        expenseChangePercent: 0,
        topSpendingCategory: "None"
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
        fetchExpenses();
    }, [page, categoryFilter, projectFilter, startDate, endDate]);

    const fetchLookups = async () => {
        try {
            const [catRes, projRes] = await Promise.all([
                fetch("/api/categories"),
                fetch("/api/projects")
            ]);
            const cats = await catRes.json();
            const projs = await projRes.json();
            setCategories(cats.filter((c: any) => c.IsExpense));
            setProjects(projs);
        } catch (err) {
            console.error("Lookup fetch failed", err);
        }
    };

    const fetchSummary = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            setSummary({
                totalExpense: data.totalExpense || 0,
                thisMonthExpense: data.thisMonthExpense || 0,
                expenseChangePercent: data.expenseChangePercent || 0,
                topSpendingCategory: data.topSpendingCategory || "None"
            });
        } catch (err) {
            console.error("Summary fetch failed", err);
        }
    };

    const fetchExpenses = async () => {
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
            const res = await fetch(`/api/expenses?${params.toString()}`);
            const data = await res.json();
            setExpenses(data.data);
            setMeta(data.meta);
        } catch (error) {
            toast.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (ExpenseID: number) => {
        if (!confirm("Are you sure you want to delete this expense?")) return;
        try {
            const res = await fetch("/api/expenses", {
                method: "DELETE",
                body: JSON.stringify({ ExpenseID }),
            });
            if (res.ok) {
                toast.success("Expense deleted");
                fetchExpenses();
                fetchSummary();
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleExport = () => {
        window.location.href = "/api/expenses/export";
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* HEADER SECTION */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">
                        All <span className="text-blue-500">Expenses</span>
                    </h1>
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mt-1 opacity-60">
                        Aggregated spending across all users
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
                        onClick={() => { setEditingExpense(null); setOpenModal(true); }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Plus size={16} />
                        Add Expense
                    </button>
                </div>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard
                    title="Total Volumne"
                    value={formatCurrency(summary.totalExpense)}
                    subtitle="All-time Outflow"
                />
                <StatCard
                    title="This Month"
                    value={formatCurrency(summary.thisMonthExpense)}
                    subtitle="Current Cycle"
                    trend={summary.expenseChangePercent}
                />
                <StatCard
                    title="Highest Category"
                    value={summary.topSpendingCategory}
                    subtitle="Resource Allocation"
                />
            </div>

            {/* SEARCH & FILTER BAR */}
            <div className="bg-background-card border border-border-main rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-500"></div>

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6">
                    <div className="flex-1 w-full relative group/input">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-blue-400 transition-colors" size={18} />
                        <input
                            placeholder="Search details..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchExpenses()}
                            className="w-full bg-background-main/50 border border-border-main rounded-xl py-3.5 pl-12 pr-6 text-xs font-bold text-text-primary outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:opacity-40"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="flex-1 lg:flex-none bg-background-main/50 border border-border-main rounded-xl px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-text-primary outline-none cursor-pointer hover:border-blue-500/30 transition-all appearance-none min-w-[140px]"
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>)}
                        </select>

                        <select
                            value={projectFilter}
                            onChange={(e) => setProjectFilter(e.target.value)}
                            className="flex-1 lg:flex-none bg-background-main/50 border border-border-main rounded-xl px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-text-primary outline-none cursor-pointer hover:border-blue-500/30 transition-all appearance-none min-w-[140px]"
                        >
                            <option value="">All Projects</option>
                            {projects.map(p => <option key={p.ProjectID} value={p.ProjectID}>{p.ProjectName}</option>)}
                        </select>

                        <div className="h-10 w-px bg-border-main hidden lg:block mx-2"></div>

                        <div className="flex items-center bg-background-main/50 p-1 rounded-xl border border-border-main">
                            <button
                                onClick={() => setView("table")}
                                className={`p-2.5 rounded-lg transition-all ${view === "table" ? "bg-background-card text-blue-400 shadow-lg border border-border-main" : "text-muted hover:text-text-primary"}`}
                            >
                                <TableIcon size={16} />
                            </button>
                            <button
                                onClick={() => setView("card")}
                                className={`p-2.5 rounded-lg transition-all ${view === "card" ? "bg-background-card text-blue-400 shadow-lg border border-border-main" : "text-muted hover:text-text-primary"}`}
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
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Title / Entity</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Categorization</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Amount</th>
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-main/50">
                                {loading ? (
                                    <tr><td colSpan={5} className="py-20 text-center text-[10px] font-black uppercase tracking-widest text-muted animate-pulse">Synchronizing Data...</td></tr>
                                ) : expenses.length === 0 ? (
                                    <tr><td colSpan={5} className="py-20 text-center space-y-4">
                                        <div className="w-16 h-16 bg-background-main rounded-2xl flex items-center justify-center mx-auto border border-border-main">
                                            <Wallet size={24} className="text-muted" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted">Zero Records Found</p>
                                    </td></tr>
                                ) : (
                                    expenses.map((exp) => (
                                        <tr key={exp.ExpenseID} className="hover:bg-background-main/50 transition-all group/row">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-text-primary uppercase tracking-tight">
                                                        {new Date(exp.ExpenseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest">
                                                        {new Date(exp.ExpenseDate).getFullYear()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-black text-text-primary uppercase tracking-tight">{exp.ExpenseDetail || "Generic Expense"}</span>
                                                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest opacity-70">{exp.projects?.ProjectName || "Standalone"}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 bg-background-main border border-border-main rounded text-[9px] font-black uppercase tracking-widest text-text-secondary">
                                                        {exp.categories?.CategoryName}
                                                    </span>
                                                    {exp.sub_categories && (
                                                        <span className="text-muted text-[10px]">/</span>
                                                    )}
                                                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest">
                                                        {exp.sub_categories?.SubCategoryName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="text-sm font-black text-text-primary tabular-nums tracking-tighter">
                                                    {formatCurrency(parseFloat(exp.Amount))}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex gap-2 justify-end opacity-0 group-hover/row:opacity-100 transition-all">
                                                    <button
                                                        onClick={() => { setEditingExpense(exp); setOpenModal(true); }}
                                                        className="p-2 hover:bg-background-main rounded-lg text-muted hover:text-blue-400 border border-transparent hover:border-border-main transition-all"
                                                    >
                                                        <Edit size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(exp.ExpenseID)}
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
                    ) : expenses.length === 0 ? (
                        <div className="col-span-full py-20 text-center opacity-40 uppercase font-black text-[10px] tracking-widest">No entries found</div>
                    ) : (
                        expenses.map((exp) => (
                            <div key={exp.ExpenseID} className="bg-background-card border border-border-main rounded-2xl p-6 hover:border-blue-500/30 transition-all group hover:translate-y-[-4px] shadow-xl shadow-black/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                                    <button onClick={() => { setEditingExpense(exp); setOpenModal(true); }} className="p-2 bg-background-main border border-border-main rounded-lg text-muted hover:text-blue-400">
                                        <Edit size={14} />
                                    </button>
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-[0.2em] rounded">
                                        {exp.categories?.CategoryName}
                                    </div>
                                    <span className="text-[10px] font-black text-muted uppercase tracking-widest mt-1">
                                        {new Date(exp.ExpenseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-black text-text-primary uppercase tracking-tight line-clamp-1">{exp.ExpenseDetail || "N/A"}</h3>
                                        <p className="text-[9px] font-bold text-muted uppercase tracking-wider mt-1">{exp.sub_categories?.SubCategoryName || "No Subcategory"}</p>
                                    </div>

                                    <div className="flex justify-between items-end pt-4 border-t border-border-main/50">
                                        <div>
                                            <p className="text-[8px] font-black text-muted uppercase tracking-widest mb-1">Total Impact</p>
                                            <p className="text-lg font-black text-text-primary tracking-tighter">{formatCurrency(parseFloat(exp.Amount))}</p>
                                        </div>
                                        <button onClick={() => handleDelete(exp.ExpenseID)} className="text-rose-500/50 hover:text-rose-500 transition-colors p-1">
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
                    Showing <span className="text-text-primary">{expenses.length}</span> of <span className="text-text-primary">{meta.total}</span>
                </p>
                <div className="flex gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="p-3 bg-background-card border border-border-main rounded-xl text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <div className="flex items-center px-4 bg-background-main rounded-xl border border-border-main text-[10px] font-black uppercase text-blue-400">
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

            <AddExpenseModal
                open={openModal}
                onClose={() => { setOpenModal(false); setEditingExpense(null); }}
                onSuccess={() => { fetchExpenses(); fetchSummary(); }}
                initialData={editingExpense}
            />
        </div>
    );
}
