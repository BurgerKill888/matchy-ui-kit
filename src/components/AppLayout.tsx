import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText, Search, MessageSquare,
  Settings, LogOut, Menu, X, Heart, Compass, BookOpen, FolderOpen, Crown } from
"lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserSpace } from "@/contexts/UserSpaceContext";
import { motion, AnimatePresence } from "framer-motion";
import NotificationPanel from "@/components/NotificationPanel";

type NavItem = {label: string;icon: React.ElementType;href: string;accent?: boolean;};

const vendeurNav: NavItem[] = [
{ label: "Mon dashboard", icon: LayoutDashboard, href: "/dashboard" },
{ label: "Mes matches", icon: Heart, href: "/matches" },
{ label: "Mes annonces", icon: FileText, href: "/listings" },
{ label: "Messagerie", icon: MessageSquare, href: "/messaging" },
{ label: "Paramètres", icon: Settings, href: "/settings" }];


const acquereurNav: NavItem[] = [
{ label: "Mon dashboard", icon: LayoutDashboard, href: "/dashboard" },
{ label: "Découvrir", icon: Compass, href: "/discovery", accent: true },
{ label: "Mes matches", icon: Heart, href: "/matches" },
{ label: "Mes fiches de critères", icon: FileText, href: "/criteria" },
{ label: "Messagerie", icon: MessageSquare, href: "/messaging" },
{ label: "Catalogue", icon: Crown, href: "/catalog", accent: true },
{ label: "Mes Data Rooms", icon: FolderOpen, href: "/acquereur-dataroom" },
{ label: "Paramètres", icon: Settings, href: "/settings" }];


function SpaceToggle() {
  const { space, setSpace } = useUserSpace();

  return (
    <div className="flex items-center gap-0.5 p-1 rounded-xl bg-secondary border border-border">
      {(["vendeur", "acquereur"] as const).map((s) =>
      <button
        key={s}
        onClick={() => setSpace(s)}
        className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
        space === s ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`
        }>

          {space === s &&
        <motion.div
          layoutId="space-toggle"
          className="absolute inset-0 bg-primary rounded-lg glow-gold"
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }} />

        }
          <span className="relative z-10">
            {s === "vendeur" ? "Espace Vendeur" : "Espace Acquéreur"}
          </span>
        </button>
      )}
    </div>);

}

export default function AppLayout({ children }: {children: React.ReactNode;}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { space, isAcquereur } = useUserSpace();

  const navItems = isAcquereur ? acquereurNav : vendeurNav;

  return (
    <div className="min-h-screen flex flex-col bg-background" data-space={space}>
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-foreground">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              
              <span className="font-display text-xl font-bold text-foreground hidden sm:inline">
                Match<span className="text-primary">stone</span>
              </span>
            </Link>
          </div>

          <SpaceToggle />

          <div className="flex items-center gap-1">
            {isAcquereur &&
            <Link to="/discovery">
                <Button size="sm" className="glow-gold hidden sm:flex">
                  <Compass size={16} className="mr-1.5" /> Découvrir
                </Button>
              </Link>
            }
            <NotificationPanel />
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-16 left-0 z-40 w-60 h-[calc(100vh-4rem)] bg-card border-r border-border transition-transform duration-200 flex flex-col`}>
          <nav className="flex flex-col gap-1 p-4 flex-1">
            {navItems.map((item) => {
              const active = location.pathname === item.href ||
              item.href !== "/dashboard" && location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                  active ?
                  "bg-primary/10 text-primary" :
                  item.accent ?
                  "text-primary/80 hover:text-primary hover:bg-primary/5" :
                  "text-muted-foreground hover:text-foreground hover:bg-secondary"}`
                  }>

                  <item.icon size={18} />
                  {item.label}
                  {item.accent && !active &&
                  <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse-gold" />
                  }
                </Link>);

            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary glow-gold" />
              {space === "vendeur" ? "Mode Vendeur" : "Mode Acquéreur"}
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen &&
        <div className="fixed inset-0 z-30 bg-background/60 md:hidden" onClick={() => setSidebarOpen(false)} />
        }

        {/* Main */}
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}>

              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>);

}