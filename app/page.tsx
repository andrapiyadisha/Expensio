import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background-main text-text-primary selection:bg-blue-500/30 font-sans">
      {/* Navigation Bar */}
      <nav className="border-b border-border-main bg-background-main/80 backdrop-blur-md fixed top-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 size={18} className="text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">Expense Manager</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold text-muted hover:text-text-primary uppercase tracking-widest transition-colors">
              Login
            </Link>
            <Link href="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            Production Ready
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-text-primary mb-6 leading-[1.1]">
            Smart Financial <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Control For Teams
            </span>
          </h1>

          <p className="text-base md:text-lg text-muted font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate ledger for tracking expenses, managing income, and deriving powerful insights. Bring absolute transparency to your organization.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all group">
              Login To Dashboard
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-background-card hover:bg-background-main border border-border-main text-text-primary px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
              Register Entity
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t border-border-main bg-background-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-background-card border border-border-main rounded-3xl p-8 hover:border-blue-500/30 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="text-blue-400" size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-3">Granular Analytics</h3>
              <p className="text-xs text-muted leading-relaxed font-medium">
                Parse down your cashflow with native charting structures, keeping your organization's trajectory clear.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background-card border border-border-main rounded-3xl p-8 hover:border-emerald-500/30 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-3">Enterprise Security</h3>
              <p className="text-xs text-muted leading-relaxed font-medium">
                Bulletproof Role-Based Access Controls (RBAC) securely separates Administrator arrays from User matrices.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background-card border border-border-main rounded-3xl p-8 hover:border-indigo-500/30 hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-text-primary mb-3">Lightning Fast</h3>
              <p className="text-xs text-muted leading-relaxed font-medium">
                Built structurally entirely on Next.js 15, yielding practically immediate frontend navigation latency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-main py-8 px-6 text-center bg-background-main">
        <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} Expense Manager. All rights strictly reserved.
        </p>
      </footer>
    </div>
  );
}
