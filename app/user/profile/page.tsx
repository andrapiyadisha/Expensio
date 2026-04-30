"use client";

import { User, Phone, Mail, Shield, Save, Camera, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      toast.error("An error occurred while fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UserName: user.UserName,
          MobileNo: user.MobileNo,
          ProfileImage: user.ProfileImage
        }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
        fetchProfile();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      toast.error("An error occurred while saving profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 max-w-4xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-text-primary">
            Account <span className="text-blue-500">Profile</span>
          </h1>
          <p className="text-xs font-bold text-text-secondary uppercase tracking-[0.2em] mt-1 opacity-60">
            Personalize your account and contact details
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          SAVE PROFILE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PROFILE CARD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-background-card border border-border-main rounded-2xl p-8 flex flex-col items-center text-center shadow-xl shadow-black/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-500"></div>
            
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-background-main border-2 border-border-main flex items-center justify-center overflow-hidden">
                {user.ProfileImage ? (
                  <img src={user.ProfileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-muted" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-500/20 hover:scale-110 transition-all">
                <Camera size={14} />
              </button>
            </div>

            <h2 className="text-lg font-black text-text-primary uppercase tracking-tight">{user.UserName}</h2>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">{user.role?.RoleName || "User"}</p>
            
            <div className="w-full h-px bg-border-main/50 my-6"></div>
            
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-background-main rounded-lg border border-border-main">
                  <Mail size={14} className="text-muted" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest">Email Address</p>
                  <p className="text-[11px] font-bold text-text-primary truncate">{user.EmailAddress}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="p-2 bg-background-main rounded-lg border border-border-main">
                  <Shield size={14} className="text-muted" />
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted uppercase tracking-widest">Account ID</p>
                  <p className="text-[11px] font-bold text-text-primary uppercase tracking-tighter">#{user.UserID.toString().padStart(6, '0')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SETTINGS CONTENT */}
        <div className="lg:col-span-2 bg-background-card border border-border-main rounded-2xl p-8 shadow-xl shadow-black/20 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-32 -mt-32 transition-all duration-500"></div>

          <div className="relative z-10">
            <div className="mb-8 border-b border-border-main/50 pb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Configuration</h3>
              <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">Edit Profile</h2>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Full UserName</label>
                  <div className="relative group/input">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-blue-400 transition-colors" size={16} />
                    <input
                      type="text"
                      value={user.UserName}
                      onChange={(e) => setUser({ ...user, UserName: e.target.value })}
                      className="w-full bg-background-main/50 border border-border-main rounded-xl py-3.5 pl-12 pr-5 text-sm font-bold text-text-primary focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:opacity-40"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Mobile Number</label>
                  <div className="relative group/input">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-blue-400 transition-colors" size={16} />
                    <input
                      type="tel"
                      value={user.MobileNo || ""}
                      onChange={(e) => setUser({ ...user, MobileNo: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-background-main/50 border border-border-main rounded-xl py-3.5 pl-12 pr-5 text-sm font-bold text-text-primary focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:opacity-40"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Profile Image Link</label>
                <div className="relative group/input">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-blue-400 transition-colors" size={16} />
                  <input
                    type="text"
                    value={user.ProfileImage || ""}
                    onChange={(e) => setUser({ ...user, ProfileImage: e.target.value })}
                    placeholder="https://example.com/image.png"
                    className="w-full bg-background-main/50 border border-border-main rounded-xl py-3.5 pl-12 pr-5 text-sm font-bold text-text-primary focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:opacity-40"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-50">Email Address (Read Only)</label>
                <input
                  type="email"
                  value={user.EmailAddress}
                  disabled
                  className="w-full bg-background-main/30 border border-border-main rounded-xl py-3.5 px-5 text-sm font-bold text-muted cursor-not-allowed outline-none select-none"
                />
              </div>

              <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl flex gap-4 items-start items-center">
                <Shield className="text-blue-400 shrink-0" size={24} />
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-relaxed">
                  Your identity is protected. Only the Administrator can modify your system role or primary email address. Manage your contact details responsibly.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
