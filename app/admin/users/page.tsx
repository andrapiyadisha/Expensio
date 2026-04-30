"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AddUserModal from "@/app/components/modals/AddUserModal";
import { User as UserIcon, Mail, Phone, Calendar, Plus, Trash2 } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (UserID: number) => {
        if (!confirm("Are you sure? This will delete all data related to this user.")) return;

        try {
            const res = await fetch("/api/users", {
                method: "DELETE",
                body: JSON.stringify({ UserID }),
            });

            if (res.ok) {
                toast.success("User deleted");
                fetchUsers();
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            toast.error("Error deleting user");
        }
    };

    const handleSaveUser = async (userData: any) => {
        try {
            const method = editingUser ? "PUT" : "POST";
            const body = editingUser
                ? { UserID: editingUser.UserID, ...userData }
                : userData;

            const res = await fetch("/api/users", {
                method,
                body: JSON.stringify(body),
            });

            if (res.ok) {
                toast.success(editingUser ? "User updated" : "User added");
                setOpen(false);
                setEditingUser(null);
                fetchUsers();
            } else {
                toast.error("Failed to save user");
            }
        } catch (error) {
            toast.error("Error saving user");
        }
    };

    return (
        <div className="space-y-10">
            {/* PAGE HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-black uppercase tracking-[0.2em] text-text-primary">System Access</h1>
                    <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mt-1 opacity-60">
                        Administrative Directory
                    </p>
                </div>

                <button
                    onClick={() => {
                        setEditingUser(null);
                        setOpen(true);
                    }}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <Plus size={16} />
                    Add Registry
                </button>
            </div>

            {/* ADD USER MODAL */}
            <AddUserModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    setEditingUser(null);
                }}
                onSave={handleSaveUser}
                initialData={editingUser}
            />

            {/* USERS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-text-secondary font-medium animate-pulse">
                        Loading Users...
                    </div>
                ) : users.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-text-secondary font-medium">
                        No users found.
                    </div>
                ) : (
                    users.map((user) => (
                        <div key={user.UserID} className="bg-background-card border border-border-main rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 group overflow-hidden relative shadow-xl shadow-black/20">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity blur duration-500"></div>

                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-background-main flex items-center justify-center overflow-hidden border border-border-main group-hover:border-blue-500/30 transition-all shadow-inner">
                                        {user.ProfileImage ? (
                                            <img src={user.ProfileImage} alt={user.UserName} className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon className="text-blue-400" size={28} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg tracking-tight text-text-primary group-hover:text-blue-400 transition-colors uppercase drop-shadow-sm">{user.UserName}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mt-1 opacity-60">ID: {user.UserID}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex items-center gap-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                                    <div className="w-8 h-8 rounded-lg bg-background-main flex items-center justify-center border border-border-main shadow-inner">
                                        <Mail size={14} className="text-blue-400 opacity-60" />
                                    </div>
                                    <span className="truncate">{user.EmailAddress}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                                    <div className="w-8 h-8 rounded-lg bg-background-main flex items-center justify-center border border-border-main shadow-inner">
                                        <Phone size={14} className="text-blue-400 opacity-60" />
                                    </div>
                                    <span className="tabular-nums">{user.MobileNo || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                                    <div className="w-8 h-8 rounded-lg bg-background-main flex items-center justify-center border border-border-main shadow-inner">
                                        <Calendar size={14} className="text-blue-400 opacity-60" />
                                    </div>
                                    <span>{new Date(user.Created).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-border-main/50 relative z-10">
                                <button
                                    onClick={() => {
                                        setEditingUser(user);
                                        setOpen(true);
                                    }}
                                    className="flex-1 py-3 text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 rounded-xl hover:bg-blue-500/20 border border-blue-500/20 transition-all active:scale-95 shadow-lg shadow-blue-900/10"
                                >
                                    Modify Access
                                </button>
                                <button
                                    onClick={() => handleDelete(user.UserID)}
                                    className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-rose-400 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 border border-rose-500/20 transition-all active:scale-95 shadow-lg shadow-rose-900/10"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
