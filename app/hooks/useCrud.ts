"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface CrudOptions {
    limit?: number;
    categoryId?: string;
    projectId?: string;
    peopleId?: string;
    search?: string;
    sort?: string;
    startDate?: string;
    endDate?: string;
}

export function useCrud(endpoint: string) {
    const [data, setData] = useState<any[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [options, setOptions] = useState<CrudOptions>({ limit: 10, sort: 'date_desc' });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                ...Object.fromEntries(
                    Object.entries(options).filter(([_, v]) => v != null && v !== '')
                )
            });

            const res = await fetch(`${endpoint}?${params.toString()}`, { credentials: "include" });
            const result = await res.json();

            if (result.data) {
                setData(result.data);
                setMeta(result.meta);
            } else {
                setData(result); // Fallback for simple APIs
            }
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, [endpoint, page, options]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const deleteItem = async (idName: string, id: any) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(endpoint, {
                method: "DELETE",
                body: JSON.stringify({ [idName]: id }),
                credentials: "include"
            });
            if (res.ok) {
                toast.success("Deleted successfully");
                fetchData();
            } else {
                throw new Error("Failed to delete");
            }
        } catch (error) {
            toast.error("Error deleting item");
        }
    };

    return {
        data,
        meta,
        loading,
        page,
        setPage,
        options,
        setOptions,
        refresh: fetchData,
        deleteItem
    };
}
