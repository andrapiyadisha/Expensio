"use client";

export default function Footer() {
    return (
        <footer className="w-full py-6 mt-10 border-t border-border-main flex flex-col items-center justify-center gap-1 text-muted transition-all duration-300">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">© 2026 Expense Manager</p>
            <div className="flex items-center gap-3 text-[9px] font-medium opacity-60">
                <span>Version 1.0</span>
                <span>•</span>
                <span>Built with ❤️</span>
            </div>
        </footer>
    );
}
