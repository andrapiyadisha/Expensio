"use client";

import { useEffect, useState } from "react";
import { X, User, Briefcase, Mail, Phone, FileText, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (person: any) => void;
  initialData?: any;
}

export default function AddPersonModal({ open, onClose, onSave, initialData }: Props) {
  const [form, setForm] = useState({
    PeopleName: "",
    Email: "",
    MobileNo: "",
    PeopleCode: "",
    Password: "123", // Default password since it's required in schema
    Description: "",
    IsActive: true,
    UserID: 1, // Default UserID for now as auth is not implemented
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...form,
        ...initialData,
        IsActive: Boolean(initialData.IsActive),
      });
    } else {
      setForm({
        PeopleName: "",
        Email: "",
        MobileNo: "",
        PeopleCode: "",
        Password: "123",
        Description: "",
        IsActive: true,
        UserID: 1,
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.PeopleName || !form.Email) return;

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
              {initialData ? "Edit Person Profile" : "Add New Person"}
            </h2>
            <p className="text-xs font-medium text-text-secondary mt-1">Manage stakeholder and contact details</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-background-main/50 text-text-secondary hover:text-text-primary transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6 relative z-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="e.g. John Doe"
              icon={<User size={18} />}
              value={form.PeopleName}
              onChange={(e: any) => setForm({ ...form, PeopleName: e.target.value })}
              required
            />
            <Input
              label="People Code"
              placeholder="e.g. JD-001"
              icon={<Briefcase size={18} />}
              value={form.PeopleCode}
              onChange={(e: any) => setForm({ ...form, PeopleCode: e.target.value })}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="john.doe@example.com"
            icon={<Mail size={18} />}
            value={form.Email}
            onChange={(e: any) => setForm({ ...form, Email: e.target.value })}
            required
          />

          <Input
            label="Mobile Number"
            placeholder="+91 98765 43210"
            icon={<Phone size={18} />}
            value={form.MobileNo}
            onChange={(e: any) => setForm({ ...form, MobileNo: e.target.value })}
          />

          <Input
            label="Role / Description"
            placeholder="e.g. Lead Designer"
            icon={<FileText size={18} />}
            value={form.Description}
            onChange={(e: any) => setForm({ ...form, Description: e.target.value })}
          />

          <div
            className="flex items-center justify-between p-4 bg-background-main/30 rounded-xl border border-border-main/50 hover:border-brand-blue/30 transition-all cursor-pointer group"
            onClick={() => setForm({ ...form, IsActive: !form.IsActive })}
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${form.IsActive ? 'bg-brand-green/10 border-brand-green/30 text-brand-green' : 'bg-background-main border-border-main text-text-secondary'}`}>
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">Account Status</p>
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
              {initialData ? "Update Person" : "Save Person"}
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
