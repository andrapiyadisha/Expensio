"use client";

import { useEffect, useState } from "react";
import { X, IndianRupee, Calendar, Tag, FileText, User, Briefcase, Paperclip, Loader2, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function AddExpenseModal({ open, onClose, onSuccess, initialData }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [people, setPeople] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    ExpenseDate: "",
    CategoryID: "",
    SubCategoryID: "",
    PeopleID: "",
    ProjectID: "",
    Amount: "",
    ExpenseDetail: "",
    Description: "",
    AttachmentPath: "",
    UserID: 1,
  });

  useEffect(() => {
    if (open) {
      setLoadingLookups(true);
      Promise.all([
        fetch("/api/categories", { credentials: "include" }).then(res => res.json()),
        fetch("/api/peoples", { credentials: "include" }).then(res => res.json()),
        fetch("/api/projects", { credentials: "include" }).then(res => res.json())
      ]).then(([cats, peps, projs]) => {
        setCategories(Array.isArray(cats) ? cats.filter((c: any) => c.IsExpense) : []);
        setPeople(Array.isArray(peps) ? peps : []);
        setProjects(Array.isArray(projs) ? projs : []);
      }).catch(err => {
        console.error("Lookup fetch failed", err);
        toast.error("Failed to load options");
      }).finally(() => setLoadingLookups(false));
    }
  }, [open]);

  useEffect(() => {
    if (form.CategoryID) {
      const selectedCat = categories.find((c: any) => c.CategoryID === parseInt(form.CategoryID));
      if (selectedCat && selectedCat.sub_categories) {
        setSubCategories(Array.isArray(selectedCat.sub_categories) ? selectedCat.sub_categories : []);
      } else {
        fetch("/api/sub-categories", { credentials: "include" }).then(res => res.json()).then(data => {
          setSubCategories(Array.isArray(data) ? data.filter((s: any) => s.CategoryID === parseInt(form.CategoryID)) : []);
        });
      }
    } else {
      setSubCategories([]);
    }
  }, [form.CategoryID, categories]);

  useEffect(() => {
    if (initialData) {
      setForm({
        ExpenseDate: initialData.ExpenseDate ? new Date(initialData.ExpenseDate).toISOString().split('T')[0] : "",
        CategoryID: initialData.CategoryID?.toString() || "",
        SubCategoryID: initialData.SubCategoryID?.toString() || "",
        PeopleID: initialData.PeopleID?.toString() || "",
        ProjectID: initialData.ProjectID?.toString() || "",
        Amount: initialData.Amount?.toString() || "",
        ExpenseDetail: initialData.ExpenseDetail || "",
        Description: initialData.Description || "",
        AttachmentPath: initialData.AttachmentPath || "",
        UserID: initialData.UserID || 1,
      });
    } else {
      setForm({
        ExpenseDate: new Date().toISOString().split('T')[0],
        CategoryID: "",
        SubCategoryID: "",
        PeopleID: "",
        ProjectID: "",
        Amount: "",
        ExpenseDetail: "",
        Description: "",
        AttachmentPath: "",
        UserID: 1,
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.Amount || !form.PeopleID || !form.ExpenseDate) {
      toast.error("Please fill required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/expenses", {
        method: initialData ? "PUT" : "POST",
        credentials: "include",
        body: JSON.stringify({
          ...form,
          ExpenseID: initialData?.ExpenseID,
          CategoryID: form.CategoryID ? parseInt(form.CategoryID) : null,
          SubCategoryID: form.SubCategoryID ? parseInt(form.SubCategoryID) : null,
          ProjectID: form.ProjectID ? parseInt(form.ProjectID) : null,
          PeopleID: parseInt(form.PeopleID),
          Amount: parseFloat(form.Amount),
          ExpenseDate: new Date(form.ExpenseDate).toISOString(),
        }),
      });

      if (res.ok) {
        toast.success(initialData ? "Expense updated" : "Expense added");
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.message || "Operation failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-main/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-lg rounded-[24px] bg-background-card border border-border-main shadow-2xl animate-in zoom-in duration-300 overflow-hidden relative">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gradient opacity-5 blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

        <div className="flex items-center justify-between px-8 py-6 border-b border-border-main relative z-10">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-text-primary">
              {initialData ? "Edit Expense" : "New Expense"}
            </h2>
            <p className="text-xs font-medium text-text-secondary mt-1">Record a new spending transaction</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-background-main/50 text-text-secondary hover:text-text-primary transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6 relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Transaction Date"
              type="date"
              required
              value={form.ExpenseDate}
              icon={<Calendar size={18} />}
              onChange={(e: any) => setForm({ ...form, ExpenseDate: e.target.value })}
            />

            <Input
              label="Amount (INR)"
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={form.Amount}
              icon={<IndianRupee size={18} />}
              className="font-bold"
              onChange={(e: any) => setForm({ ...form, Amount: e.target.value })}
            />
          </div>

          <Select
            label="Paid By / For"
            required
            value={form.PeopleID}
            icon={loadingLookups ? <Loader2 size={18} className="animate-spin text-blue-500" /> : <User size={18} />}
            disabled={loadingLookups}
            onChange={(e: any) => setForm({ ...form, PeopleID: e.target.value })}
          >
            <option value="" className="bg-background-card">Select Person</option>
            {people.map(p => <option key={p.PeopleID} value={p.PeopleID} className="bg-background-card">{p.PeopleName}</option>)}
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Category"
              value={form.CategoryID}
              icon={loadingLookups ? <Loader2 size={18} className="animate-spin text-blue-500" /> : <Tag size={18} />}
              disabled={loadingLookups}
              onChange={(e: any) => setForm({ ...form, CategoryID: e.target.value, SubCategoryID: "" })}
            >
              <option value="" className="bg-background-card">
                {loadingLookups ? "Loading..." : "Select Category"}
              </option>
              {categories.map(c => <option key={c.CategoryID} value={c.CategoryID} className="bg-background-card">{c.CategoryName}</option>)}
            </Select>

            <Select
              label="Sub-Category"
              value={form.SubCategoryID}
              disabled={!form.CategoryID}
              icon={<Tag size={18} />}
              onChange={(e: any) => setForm({ ...form, SubCategoryID: e.target.value })}
            >
              <option value="" className="bg-background-card">Select Sub</option>
              {subCategories.map(s => <option key={s.SubCategoryID} value={s.SubCategoryID} className="bg-background-card">{s.SubCategoryName}</option>)}
            </Select>
          </div>

          <Select
            label="Associated Project (Optional)"
            value={form.ProjectID}
            icon={loadingLookups ? <Loader2 size={18} className="animate-spin text-blue-500" /> : <Briefcase size={18} />}
            disabled={loadingLookups}
            onChange={(e: any) => setForm({ ...form, ProjectID: e.target.value })}
          >
            <option value="" className="bg-background-card">No Project</option>
            {projects.map(p => <option key={p.ProjectID} value={p.ProjectID} className="bg-background-card">{p.ProjectName}</option>)}
          </Select>

          <Input
            label="Expense Detail"
            placeholder="Where was this spent? (e.g. Amazon, Starbucks)"
            icon={<FileText size={18} />}
            value={form.ExpenseDetail}
            onChange={(e: any) => setForm({ ...form, ExpenseDetail: e.target.value })}
          />

          <div className="space-y-2 group">
            <label className="text-xs font-black uppercase tracking-widest text-text-secondary group-focus-within:text-blue-500 transition-colors">
              Attachment (Reference)
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-blue-500 transition-colors pointer-events-none">
                <Paperclip size={18} />
              </div>
              <input
                type="text"
                placeholder="Paste link or path to document"
                value={form.AttachmentPath}
                className="w-full pl-12 pr-4 py-3 bg-background-main/50 border border-border-main rounded-xl text-sm text-text-primary outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                onChange={(e) => setForm({ ...form, AttachmentPath: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-xs font-black uppercase tracking-widest text-text-secondary group-focus-within:text-blue-500 transition-colors">
              Additional Notes
            </label>
            <textarea
              placeholder="Any extra details..."
              value={form.Description}
              rows={3}
              className="w-full px-4 py-3 bg-background-main/50 border border-border-main rounded-xl text-sm text-text-primary outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-medium"
              onChange={(e) => setForm({ ...form, Description: e.target.value })}
            />
          </div>
        </form>

        <div className="flex justify-end gap-3 px-8 py-6 border-t border-border-main bg-background-main/30 relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-background-main transition-all border border-transparent hover:border-border-main"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-accent-gradient shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
          >
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Update Transaction" : "Save Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* HELPER COMPONENTS */
function Input({ label, icon, className = "", ...props }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-xs font-black uppercase tracking-widest text-text-secondary group-focus-within:text-blue-500 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-blue-500 transition-colors pointer-events-none">
          {icon}
        </div>
        <input
          {...props}
          className={`w-full pl-12 pr-4 py-3 bg-background-main/50 border border-border-main rounded-xl text-sm text-text-primary outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${className} font-medium`}
        />
      </div>
    </div>
  );
}

function Select({ label, icon, children, ...props }: any) {
  return (
    <div className="space-y-2 group">
      <label className="text-xs font-black uppercase tracking-widest text-text-secondary group-focus-within:text-blue-500 transition-colors">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-blue-500 transition-colors pointer-events-none">
          {icon}
        </div>
        <select
          {...props}
          className="w-full pl-12 pr-10 py-3 bg-background-main/50 border border-border-main rounded-xl text-sm text-text-primary outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {children}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none opacity-40 group-focus-within:text-blue-500 group-focus-within:opacity-100 transition-all">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}
