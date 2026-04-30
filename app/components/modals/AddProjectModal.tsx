"use client";

import { useEffect, useState } from "react";
import { X, Briefcase, Calendar, FileText, Info, CheckCircle2 } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (project: any) => void;
    initialData?: any;
}

export default function AddProjectModal({ open, onClose, onSave, initialData }: Props) {
    const [form, setForm] = useState({
        ProjectName: "",
        ProjectStartDate: "",
        ProjectEndDate: "",
        ProjectDetail: "",
        Description: "",
        IsActive: true,
        UserID: 1,
        Budget: "",
        Progress: 0,
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                ...form,
                ...initialData,
                ProjectStartDate: initialData.ProjectStartDate ? new Date(initialData.ProjectStartDate).toISOString().split('T')[0] : "",
                ProjectEndDate: initialData.ProjectEndDate ? new Date(initialData.ProjectEndDate).toISOString().split('T')[0] : "",
                IsActive: Boolean(initialData.IsActive),
                Budget: initialData.Budget ? initialData.Budget.toString() : "",
                Progress: initialData.Progress || 0,
            });
        } else {
            setForm({
                ProjectName: "",
                ProjectStartDate: "",
                ProjectEndDate: "",
                ProjectDetail: "",
                Description: "",
                IsActive: true,
                UserID: 1,
                Budget: "",
                Progress: 0,
            });
        }
    }, [initialData, open]);

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.ProjectName) return;

        const submissionData = {
            ...form,
            ProjectStartDate: form.ProjectStartDate && form.ProjectStartDate.trim() !== "" ? new Date(form.ProjectStartDate).toISOString() : null,
            ProjectEndDate: form.ProjectEndDate && form.ProjectEndDate.trim() !== "" ? new Date(form.ProjectEndDate).toISOString() : null,
            Budget: parseFloat(form.Budget) || 0,
            Progress: parseInt(form.Progress.toString()) || 0,
        };

        onSave(submissionData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-main/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-lg rounded-[24px] bg-background-card border border-border-main shadow-2xl animate-in zoom-in duration-300 overflow-hidden relative">
                {/* Background Decorative Gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-gradient opacity-5 blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                <div className="flex items-center justify-between px-8 py-6 border-b border-border-main relative z-10">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-text-primary">
                            {initialData ? "Edit Project Details" : "Add New Project"}
                        </h2>
                        <p className="text-xs font-medium text-text-secondary mt-1">Define project scope, timeline and tracking</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-background-main/50 text-text-secondary hover:text-text-primary transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6 relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <Input
                        label="Project Name"
                        placeholder="e.g. Website Overhaul"
                        icon={<Briefcase size={18} />}
                        value={form.ProjectName}
                        onChange={(e: any) => setForm({ ...form, ProjectName: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Start Date"
                            type="date"
                            icon={<Calendar size={18} />}
                            value={form.ProjectStartDate}
                            onChange={(e: any) => setForm({ ...form, ProjectStartDate: e.target.value })}
                        />
                        <Input
                            label="Estimated End Date"
                            type="date"
                            icon={<Calendar size={18} />}
                            value={form.ProjectEndDate}
                            onChange={(e: any) => setForm({ ...form, ProjectEndDate: e.target.value })}
                        />
                    </div>

                    <Input
                        label="Project Goals"
                        placeholder="Define the primary objectives"
                        icon={<Info size={18} />}
                        value={form.ProjectDetail}
                        onChange={(e: any) => setForm({ ...form, ProjectDetail: e.target.value })}
                    />

                    <Input
                        label="Internal Description"
                        placeholder="e.g. Project constraints or notes"
                        icon={<FileText size={18} />}
                        value={form.Description}
                        onChange={(e: any) => setForm({ ...form, Description: e.target.value })}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Project Budget"
                            type="number"
                            placeholder="e.g. 500000"
                            icon={<span>₹</span>}
                            value={form.Budget}
                            onChange={(e: any) => setForm({ ...form, Budget: e.target.value })}
                        />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-xs font-black uppercase tracking-widest text-text-secondary">Progress</label>
                                <span className="text-[10px] font-black text-blue-400">{form.Progress}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={form.Progress}
                                onChange={(e: any) => setForm({ ...form, Progress: e.target.value })}
                                className="w-full h-2 bg-background-main rounded-full appearance-none cursor-pointer accent-blue-600 border border-border-main"
                            />
                        </div>
                    </div>

                    <div
                        className="flex items-center justify-between p-4 bg-background-main/30 rounded-xl border border-border-main/50 hover:border-blue-500/30 transition-all cursor-pointer group"
                        onClick={() => setForm({ ...form, IsActive: !form.IsActive })}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${form.IsActive ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' : 'bg-background-main border-border-main text-text-secondary'}`}>
                                <CheckCircle2 size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary">Project Lifecycle</p>
                                <p className="text-[10px] font-medium text-text-secondary">Currently {form.IsActive ? 'Active' : 'Inactive'}</p>
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
                            {initialData ? "Update Project" : "Save Project"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* MODAL INPUT COMPONENT */
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
