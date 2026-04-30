"use client";

import { useEffect, useState } from "react";
import { X, Tag, FileText, Hash, CheckCircle2 } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (category: any) => void;
    initialData?: any;
}

export default function AddCategoryModal({ open, onClose, onSave, initialData }: Props) {
    const [form, setForm] = useState({
        CategoryName: "",
        LogoPath: "",
        IsExpense: true,
        IsIncome: false,
        IsActive: true,
        Description: "",
        Sequence: 0,
        UserID: 1, // Default UserID
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                ...initialData,
                IsActive: Boolean(initialData.IsActive),
                IsExpense: Boolean(initialData.IsExpense),
                IsIncome: Boolean(initialData.IsIncome),
            });
        } else {
            setForm({
                CategoryName: "",
                LogoPath: "",
                IsExpense: true,
                IsIncome: false,
                IsActive: true,
                Description: "",
                Sequence: 0,
                UserID: 1,
            });
        }
    }, [initialData, open]);

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.CategoryName) return;
        onSave(form);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-main/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-lg rounded-[24px] bg-background-card border border-border-main shadow-2xl animate-in zoom-in duration-300 overflow-hidden relative">
                {/* Background Decorative Gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gradient opacity-5 blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                <div className="flex items-center justify-between px-8 py-6 border-b border-border-main relative z-10">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-text-primary">
                            {initialData ? "Edit Category Details" : "Add New Category"}
                        </h2>
                        <p className="text-xs font-medium text-text-secondary mt-1">Organize your financial transactions with precision</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-background-main/50 text-text-secondary hover:text-text-primary transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6 relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <Input
                        label="Category Name"
                        placeholder="e.g. Food, Salary, Housing"
                        icon={<Tag size={18} />}
                        value={form.CategoryName}
                        onChange={(e: any) => setForm({ ...form, CategoryName: e.target.value })}
                        required
                    />

                    <Input
                        label="Description"
                        placeholder="Purpose of this category..."
                        icon={<FileText size={18} />}
                        value={form.Description}
                        onChange={(e: any) => setForm({ ...form, Description: e.target.value })}
                    />

                    <Input
                        label="Display Priority"
                        type="number"
                        icon={<Hash size={18} />}
                        value={form.Sequence}
                        onChange={(e: any) => setForm({ ...form, Sequence: Number(e.target.value) })}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Toggle
                            label="Expense Source"
                            checked={form.IsExpense}
                            onChange={(checked) => setForm({ ...form, IsExpense: checked })}
                        />
                        <Toggle
                            label="Income Source"
                            checked={form.IsIncome}
                            onChange={(checked) => setForm({ ...form, IsIncome: checked })}
                        />
                    </div>

                    <div
                        className="flex items-center justify-between p-4 bg-background-main/30 rounded-xl border border-border-main/50 hover:border-brand-blue/30 transition-all cursor-pointer group"
                        onClick={() => setForm({ ...form, IsActive: !form.IsActive })}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${form.IsActive ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' : 'bg-background-main border-border-main text-text-secondary'}`}>
                                <CheckCircle2 size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary">Availability</p>
                                <p className="text-[10px] font-medium text-text-secondary">Category is {form.IsActive ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${form.IsActive ? 'bg-brand-green' : 'bg-background-main border-border-main'}`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${form.IsActive ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </button>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-border-main bg-background-main/30 -mx-8 px-8 py-6 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl text-sm font-bold text-text-secondary hover:text-text-primary hover:bg-background-main transition-all border border-transparent hover:border-border-main"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 rounded-xl text-sm font-bold text-white bg-accent-gradient shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            {initialData ? "Update Category" : "Save Category"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* HELPER COMPONENTS */
function Input({ label, icon, ...props }: any) {
    return (
        <div className="space-y-2 group">
            <label className="text-xs font-black uppercase tracking-widest text-text-secondary group-focus-within:text-brand-blue transition-colors">
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-brand-blue transition-colors pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-4 py-3 bg-background-main/50 border border-border-main rounded-xl text-sm text-text-primary outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all`}
                />
            </div>
        </div>
    );
}

function Toggle({ label, checked, onChange }: { label: string, checked: boolean, onChange: (val: boolean) => void }) {
    return (
        <div
            className="flex items-center gap-3 p-3 bg-background-main/30 rounded-xl border border-border-main/50 cursor-pointer group hover:bg-background-main/50 transition-all"
            onClick={() => onChange(!checked)}
        >
            <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${checked ? 'bg-brand-blue border-brand-blue' : 'border-border-main bg-background-main'}`}>
                {checked && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <label className="text-xs font-bold text-text-primary group-hover:text-brand-blue transition-colors cursor-pointer select-none">{label}</label>
        </div>
    );
}
