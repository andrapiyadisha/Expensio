import Link from "next/link";


const adminMenu = [
    { name: "Dashboard", path: "/admin" },
    { name: "Expenses", path: "/admin/expenses" },
    { name: "Trips", path: "/admin/trips" },
    { name: "Approvals", path: "/admin/approvals" },
    { name: "Users", path: "/admin/users" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Settings", path: "/admin/settings" },
];


export default function AdminSidebar() {
    return (
        <aside className="w-64 bg-background-sidebar text-text-primary border-r border-border-main p-8 flex flex-col transition-all duration-300">
            <div className="flex items-center gap-3 mb-10 group cursor-pointer">
                <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-xl shadow-lg transition-transform group-hover:scale-105">
                    <span className="font-bold text-xl">EX</span>
                </div>
                <div>
                    <h1 className="font-bold text-sm tracking-tight text-text-primary">Expense</h1>
                    <p className="text-[10px] text-text-secondary font-medium tracking-wide opacity-70">Manager</p>
                </div>
            </div>

            <nav className="space-y-1">
                <div className="text-[10px] text-text-secondary uppercase font-bold tracking-widest px-4 mb-4 opacity-50">Admin Menu</div>
                {adminMenu.map((item) => (
                    <Link
                        key={item.name}
                        href={item.path}
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-background-card border border-transparent transition-all active:scale-95"
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}