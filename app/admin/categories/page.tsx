"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, FolderTree } from "lucide-react";
import AddCategoryModal from "@/app/components/modals/AddCategoryModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (CategoryID: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        body: JSON.stringify({ CategoryID }),
      });

      if (res.ok) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting category");
    }
  };

  const handleSave = async (categoryData: any) => {
    try {
      const method = editingCategory ? "PUT" : "POST";
      const body = editingCategory
        ? { CategoryID: editingCategory.CategoryID, ...categoryData }
        : categoryData;

      const res = await fetch("/api/categories", {
        method,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingCategory ? "Category updated" : "Category added");
        setOpen(false);
        setEditingCategory(null);
        fetchCategories();
      } else {
        toast.error("Failed to save category");
      }
    } catch (error) {
      toast.error("Error saving category");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">
            Master <span className="text-blue-500">Categories</span>
          </h1>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mt-1 opacity-60">
            Define global classification vectors
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setOpen(true);
          }}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={16} />
          ADD CATEGORY
        </button>
      </div>

      <div className="bg-background-card border border-border-main rounded-2xl overflow-hidden shadow-xl shadow-black/20 group relative">
        <div className="px-8 py-6 border-b border-border-main flex justify-between items-center bg-background-main/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <FolderTree size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">Ontology Map</h3>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-md border border-blue-500/20">
            {categories.length} Nodes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-main/80 border-b border-border-main">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Node Name</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Vector Type</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Priority</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">State</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-widest text-muted animate-pulse">Mapping classification network...</td></tr>
              ) : categories.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-widest text-muted">No nodes initialized</td></tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.CategoryID} className="hover:bg-background-main/50 transition-all group/row">
                    <td className="px-8 py-6">
                      <div className="text-xs font-black text-text-primary uppercase tracking-tight group-hover/row:text-blue-400 transition-colors">{cat.CategoryName}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2 flex-wrap">
                        {cat.IsExpense && <span className="px-3 py-1 bg-rose-500/10 text-rose-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-rose-500/20 shadow-sm">Expense</span>}
                        {cat.IsIncome && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm">Income</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center text-sm font-black text-text-secondary tabular-nums opacity-70 group-hover/row:opacity-100">{cat.Sequence || 0}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border transition-all ${cat.IsActive
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-sm"
                          : "bg-background-main text-text-secondary border-border-main opacity-50"
                        }`}>
                        {cat.IsActive ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex gap-2 justify-end opacity-0 group-hover/row:opacity-100 transition-all">
                        <button onClick={() => { setEditingCategory(cat); setOpen(true); }} className="p-2 hover:bg-background-main rounded-lg transition-all text-muted hover:text-blue-400 border border-transparent hover:border-border-main"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(cat.CategoryID)} className="p-2 hover:bg-background-main rounded-lg transition-all text-muted hover:text-rose-400 border border-transparent hover:border-border-main"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddCategoryModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSave}
        initialData={editingCategory}
      />
    </div>
  );
}
