import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background-main text-text-primary transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 bg-background-main overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-10">
            {children}
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
