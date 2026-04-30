"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export interface DashboardStats {
    totalIncome: number;
    totalExpense: number;
    totalBalance: number;
    thisMonthIncome: number;
    thisMonthExpense: number;
    lastMonthIncome: number;
    lastMonthExpense: number;
    incomeChangePercent: number;
    expenseChangePercent: number;
    totalPeople: number;
    totalProjects: number;
    recentTransactions: any[];
    monthlyExpenseData: number[];
    monthlyIncomeData: number[];
    monthlyLabels: string[];
    categoryWiseExpense: { category: string; total: number }[];
    topSpendingCategory: string;
}

export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/dashboard/summary", { credentials: "include" });
            if (!res.ok) throw new Error("Failed to fetch summary");
            const data = await res.json();
            setStats(data);
            setError(null);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error loading dashboard";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refresh: fetchStats };
}
