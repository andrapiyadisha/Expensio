"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, FolderPlus } from "lucide-react";
import AddSubCategoryModal from "@/app/components/modals/AddSubCategoryModal";

export default function SubCategoriesPage() {
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sub-categories");
      const data = await res.json();
      setSubCategories(data);
    } catch (error) {
      toast.error("Failed to load subcategories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (SubCategoryID: number) => {
    if (!confirm("Are you sure you want to delete this sub-category?")) return;

    try {
      const res = await fetch("/api/sub-categories", {
        method: "DELETE",
        body: JSON.stringify({ SubCategoryID }),
      });

      if (res.ok) {
        toast.success("Subcategory deleted");
        fetchSubCategories();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error deleting subcategory");
    }
  };

  const handleSave = async (subCategoryData: any) => {
    try {
      const method = editingSubCategory ? "PUT" : "POST";
      const body = editingSubCategory
        ? { SubCategoryID: editingSubCategory.SubCategoryID, ...subCategoryData }
        : subCategoryData;

      const res = await fetch("/api/sub-categories", {
        method,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        toast.success(editingSubCategory ? "Subcategory updated" : "Subcategory added");
        setOpen(false);
        setEditingSubCategory(null);
        fetchSubCategories();
      } else {
        toast.error("Failed to save subcategory");
      }
    } catch (error) {
      toast.error("Error saving subcategory");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">
            Sub <span className="text-indigo-500">Categories</span>
          </h1>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mt-1 opacity-60">
            Micro-Classification Vectors
          </p>
        </div>

        <button
          onClick={() => {
            setEditingSubCategory(null);
            setOpen(true);
          }}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={16} />
          ADD SUB CATEGORY
        </button>
      </div>

      <div className="bg-background-card border border-border-main rounded-2xl overflow-hidden shadow-xl shadow-black/20 group relative">
        <div className="px-8 py-6 border-b border-border-main flex justify-between items-center bg-background-main/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
              <FolderPlus size={16} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-primary">Detailed Matrix</h3>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-md border border-indigo-500/20">
            {subCategories.length} Elements
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background-main/80 border-b border-border-main">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Element Name</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Parent Node</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Vector Type</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Priority</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">State</th>
                <th className="px-8 py-5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main/50">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-widest text-muted animate-pulse">Scanning micro elements...</td></tr>
              ) : subCategories.length === 0 ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-widest text-muted">No elements defined</td></tr>
              ) : (
                subCategories.map((sub) => (
                  <tr key={sub.SubCategoryID} className="hover:bg-background-main/50 transition-all group/row">
                    <td className="px-8 py-6">
                      <div className="text-xs font-black text-text-primary uppercase tracking-tight group-hover/row:text-indigo-400 transition-colors">{sub.SubCategoryName}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest opacity-80 group-hover/row:opacity-100">{sub.categories?.CategoryName || "Orphaned"}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex gap-2 flex-wrap">
                        {sub.IsExpense && <span className="px-3 py-1 bg-rose-500/10 text-rose-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-rose-500/20 shadow-sm">Expense</span>}
                        {sub.IsIncome && <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-md text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm">Income</span>}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center text-sm font-black text-text-secondary tabular-nums opacity-70 group-hover/row:opacity-100">{sub.Sequence || 0}</td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest border transition-all ${sub.IsActive
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-sm"
                          : "bg-background-main text-text-secondary border-border-main opacity-50"
                        }`}>
                        {sub.IsActive ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex gap-2 justify-end opacity-0 group-hover/row:opacity-100 transition-all">
                        <button onClick={() => { setEditingSubCategory(sub); setOpen(true); }} className="p-2 hover:bg-background-main rounded-lg transition-all text-muted hover:text-indigo-400 border border-transparent hover:border-border-main"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(sub.SubCategoryID)} className="p-2 hover:bg-background-main rounded-lg transition-all text-muted hover:text-rose-400 border border-transparent hover:border-border-main"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddSubCategoryModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingSubCategory(null);
        }}
        onSave={handleSave}
        initialData={editingSubCategory}
      />
    </div>
  );
}
