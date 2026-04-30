"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  IndianRupee, 
  TrendingUp, 
  Briefcase, 
  BarChart2, 
  User 
} from "lucide-react";

const userMenu = [
  { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
  { name: "My Expenses", path: "/user/expenses", icon: IndianRupee },
  { name: "Incomes", path: "/user/incomes", icon: TrendingUp },
  { name: "Trips", path: "/user/trips", icon: Briefcase },
  { name: "Reports", path: "/user/reports", icon: BarChart2 },
  { name: "Profile", path: "/user/profile", icon: User },
];

export default function UserSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background-card border-r border-border-main text-text-primary p-6 flex flex-col h-screen sticky top-0">
      <div className="mb-10 px-2">
        <h2 className="text-2xl font-black tracking-tighter text-blue-500">
          EXPENSIO<span className="text-white">.</span>
        </h2>
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-muted opacity-40">User Console</p>
      </div>

      <nav className="flex-1 space-y-2">
        {userMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link 
              key={item.name} 
              href={item.path} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all group ${
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "text-text-secondary hover:bg-background-main hover:text-text-primary"
              }`}
            >
              <Icon size={18} className={`${isActive ? "text-white" : "text-muted group-hover:text-blue-500"} transition-colors`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-border-main/50">
        <div className="px-4 py-4 bg-background-main/50 rounded-2xl border border-border-main flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-black">
            U
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-black uppercase tracking-tight truncate">User Access</p>
            <Link href="/login" className="text-[9px] font-bold text-muted hover:text-rose-500 transition-colors uppercase tracking-widest">Sign Out</Link>
          </div>
        </div>
      </div>
    </aside>
  );
}