"use client";

import { useEffect, useState } from "react";
import { X, User, Mail, Lock, Phone, Image as ImageIcon } from "lucide-react";

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (user: any) => void;
    initialData?: any;
}

export default function AddUserModal({ open, onClose, onSave, initialData }: Props) {
    const [form, setForm] = useState({
        UserName: "",
        EmailAddress: "",
        Password: "",
        MobileNo: "",
        ProfileImage: "",
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                ...initialData,
                Password: initialData.Password || "", // Usually we don't send password back, but schema requires it
            });
        } else {
            setForm({
                UserName: "",
                EmailAddress: "",
                Password: "",
                MobileNo: "",
                ProfileImage: "",
            });
        }
    }, [initialData, open]);

    if (!open) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.UserName || !form.EmailAddress || !form.Password) return;
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
                            {initialData ? "Edit User Account" : "Add New User"}
                        </h2>
                        <p className="text-xs font-medium text-text-secondary mt-1">Manage application access and profile</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-background-main/50 text-text-secondary hover:text-text-primary transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6 relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <Input
                        label="User Full Name"
                        placeholder="John Doe"
                        icon={<User size={18} />}
                        value={form.UserName}
                        onChange={(e: any) => setForm({ ...form, UserName: e.target.value })}
                        required
                    />

                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john.doe@example.com"
                        icon={<Mail size={18} />}
                        value={form.EmailAddress}
                        onChange={(e: any) => setForm({ ...form, EmailAddress: e.target.value })}
                        required
                    />

                    <Input
                        label="Account Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock size={18} />}
                        value={form.Password}
                        onChange={(e: any) => setForm({ ...form, Password: e.target.value })}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Mobile Number"
                            placeholder="+91 98765 43210"
                            icon={<Phone size={18} />}
                            value={form.MobileNo}
                            onChange={(e: any) => setForm({ ...form, MobileNo: e.target.value })}
                        />

                        <Input
                            label="Profile Image URL"
                            placeholder="https://..."
                            icon={<ImageIcon size={18} />}
                            value={form.ProfileImage || ""}
                            onChange={(e: any) => setForm({ ...form, ProfileImage: e.target.value })}
                        />
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
                            {initialData ? "Update User" : "Save User Account"}
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
