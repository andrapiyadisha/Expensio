"use client";

import { User, Shield, Bell, Globe, Save } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@example.com");

  useEffect(() => {
    // Fetch current user info if needed
    const fetchUser = async () => {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.name) setName(data.name);
        // Currently only storing Name and Role and ID in DB
      }
    };
    fetchUser();
  }, []);

  const handleSave = () => {
    toast.success("Settings saved successfully!");
    // Note: Real update API call would go here
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">
            System <span className="text-blue-500">Settings</span>
          </h1>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mt-1 opacity-60">
            Manage backend preferences and global parameters
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Save size={16} />
          SAVE CHANGES
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SETTINGS TABS/NAV */}
        <div className="w-full lg:w-72 space-y-3">
          <SettingsNavItem icon={<User size={16} />} label="General Profile" active />
          <SettingsNavItem icon={<Shield size={16} />} label="Security & Access" />
          <SettingsNavItem icon={<Bell size={16} />} label="System Alerts" />
          <SettingsNavItem icon={<Globe size={16} />} label="Regional Config" />
        </div>

        {/* SETTINGS CONTENT */}
        <div className="flex-1 bg-background-card border border-border-main rounded-2xl p-8 shadow-xl shadow-black/20 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-32 -mt-32 transition-all duration-500"></div>

          <div className="relative z-10">
            <div className="mb-8 border-b border-border-main/50 pb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Authentication</h3>
              <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">General Profile</h2>
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Administrator Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background-main/50 border border-border-main rounded-xl py-3.5 px-5 text-sm font-bold text-text-primary focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:opacity-40"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Primary Contact (Email)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background-main/50 border border-border-main rounded-xl py-3.5 px-5 text-sm font-bold text-text-primary focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:opacity-40"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Workspace / Organization Identifier</label>
                <input
                  type="text"
                  defaultValue="Smart Finance Inc. Enterprise"
                  disabled
                  className="w-full bg-background-main/30 border border-border-main rounded-xl py-3.5 px-5 text-sm font-bold text-muted cursor-not-allowed outline-none select-none"
                />
              </div>

              <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-4 items-start items-center">
                <Shield className="text-blue-400 shrink-0" size={24} />
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-relaxed">
                  Modifying profile metadata influences global audit logs and systemic report generation headers. Ensure credentials align with standard protocol.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsNavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center justify-between px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active
      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm"
      : "text-text-secondary hover:text-text-primary hover:bg-background-main border border-transparent"
      }`}>
      <div className="flex items-center gap-3">
        {icon}
        {label}
      </div>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.5)]"></div>}
    </button>
  );
}
