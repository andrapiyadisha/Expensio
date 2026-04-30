"use client";
import { Bell, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [userName, setUserName] = useState("Loading...");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUserName(data.name || "User");
        } else {
          setUserName("User");
        }
      } catch (error) {
        setUserName("User");
      }
    }
    fetchUser();
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-background-main border-b border-border-main px-8 h-16 flex justify-between items-center transition-all duration-300">

      <div>
        <h2 className="text-sm font-bold text-text-primary tracking-tight uppercase">Dashboard</h2>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-card transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full border border-background-main"></span>
        </button>

        <div className="flex items-center gap-2 ml-2 pl-4 border-l border-border-main relative group">
          <div className="w-8 h-8 rounded-full bg-background-card border border-border-main flex items-center justify-center text-text-secondary group-hover:text-text-primary transition-all cursor-pointer">
            <User size={16} />
          </div>
          <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-all hidden md:block cursor-pointer">
            {userName}
          </span>

          <div className="absolute top-full right-0 mt-2 w-48 bg-background-card border border-border-main rounded-xl shadow-xl shadow-black/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
            <button
              onClick={async () => {
                try {
                  await fetch("/api/auth/logout", {
                    method: "POST",
                    credentials: "include"
                  });
                  
                  window.location.href = "/";
                } catch (error) {
                  console.error("Logout failed", error);
                }
              }}
              className="w-full text-left px-4 py-3 text-xs font-bold text-rose-500 uppercase tracking-widest hover:bg-background-main transition-colors flex items-center gap-2"
            >
              Terminal Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
