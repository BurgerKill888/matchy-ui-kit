import { Link, useLocation } from "react-router-dom";
import { Building2, LayoutDashboard, FileText, Search, MessageSquare, Settings, LogOut, Menu, X, FolderLock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Mes annonces", icon: FileText, href: "/listings" },
  { label: "Catalogue", icon: Search, href: "/catalog" },
  { label: "Mes critères", icon: FileText, href: "/criteria" },
  { label: "Data Room", icon: FolderLock, href: "/dataroom" },
  { label: "Messagerie", icon: MessageSquare, href: "/messaging" },
  { label: "Profil", icon: Settings, href: "/profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-foreground">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="text-primary" size={28} />
              <span className="font-display text-xl font-bold text-foreground">Match<span className="text-primary">stone</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-card border-r border-border transition-transform duration-200`}>
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-background/60 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
