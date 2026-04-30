"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Users,
  Folder,
  Settings,
  ChevronRight
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-background-sidebar text-text-primary border-r border-border-main flex flex-col transition-all duration-300">
      {/* LOGO SECTION */}
      <div className="p-8">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-105">
            <span className="font-bold text-xl">EX</span>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-text-primary">Expense</h1>
            <p className="text-[10px] text-text-secondary font-medium tracking-wide opacity-70">Manager</p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] text-muted uppercase font-black tracking-[0.2em] px-4 mb-4 opacity-50">Menu</div>

        <NavItem href="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" active={pathname === "/admin"} />
        <NavItem href="/admin/expenses" icon={<Wallet size={18} />} label="Expenses" active={pathname.startsWith("/admin/expenses")} />
        <NavItem href="/admin/incomes" icon={<ArrowLeftRight size={18} />} label="Incomes" active={pathname.startsWith("/admin/incomes")} />
        <NavItem href="/admin/peoples" icon={<Users size={18} />} label="People" active={pathname.startsWith("/admin/peoples")} />
        <NavItem href="/admin/projects" icon={<Folder size={18} />} label="Projects" active={pathname.startsWith("/admin/projects")} />
        <NavItem href="/admin/settings" icon={<Settings size={18} />} label="Settings" active={pathname.startsWith("/admin/settings")} />

      </nav>
    </aside>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                 ${active
          ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
          : "text-text-secondary hover:text-text-primary hover:bg-background-card"
        }`}
    >
      <div className="flex items-center gap-3">
        <span className={`transition-colors duration-300 ${active ? "text-text-primary" : "text-muted group-hover:text-text-primary"}`}>
          {icon}
        </span>
        {label}
      </div>
      {active && <ChevronRight size={14} className="opacity-40" />}
    </Link>
  );
}
