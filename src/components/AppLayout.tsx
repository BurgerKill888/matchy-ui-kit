import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText,
  Settings, LogOut, Menu, X, Heart, Compass, Crown, LayoutGrid, PanelLeftClose, PanelLeftOpen } from
"lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserSpace } from "@/contexts/UserSpaceContext";
import { motion, AnimatePresence } from "framer-motion";
import NotificationPanel from "@/components/NotificationPanel";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type NavItem = {label: string;icon: React.ElementType;href: string;vip?: boolean;};

const vendeurNav: NavItem[] = [
{ label: "Mon dashboard", icon: LayoutDashboard, href: "/dashboard" },
{ label: "Mes matches", icon: Heart, href: "/matches" },
{ label: "Mes annonces", icon: FileText, href: "/listings" }];

const acquereurNav: NavItem[] = [
{ label: "Mon dashboard", icon: LayoutDashboard, href: "/dashboard" },
{ label: "Mes matches", icon: Heart, href: "/matches" },
{ label: "Mes fiches", icon: FileText, href: "/criteria" },
{ label: "Catalogue", icon: LayoutGrid, href: "/catalog", vip: true }];

const bottomNav: NavItem[] = [
{ label: "Paramètres", icon: Settings, href: "/settings" }];


// Pages that are specific to one space and would cause confusion if staying on them
const VENDEUR_ONLY_PAGES = ["/listings", "/dataroom"];
const ACQUEREUR_ONLY_PAGES = ["/criteria", "/catalog", "/discovery", "/acquereur-dataroom"];

function SpaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const { space, setSpace } = useUserSpace();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const targetSpace = space === "vendeur" ? "acquereur" : "vendeur";
  const targetLabel = targetSpace === "vendeur" ? "Espace Vendeur" : "Espace Acquéreur";

  const handleSwitch = () => {
    const isOnOldSpacePage =
      (space === "vendeur" && VENDEUR_ONLY_PAGES.some(p => location.pathname.startsWith(p))) ||
      (space === "acquereur" && ACQUEREUR_ONLY_PAGES.some(p => location.pathname.startsWith(p)));

    setSpace(targetSpace);
    setOpen(false);

    if (isOnOldSpacePage) {
      navigate("/dashboard", { replace: true });
    }
  };

  const indicator = (
    <div className={`flex items-center gap-2 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors rounded-lg hover:bg-secondary ${collapsed ? 'justify-center p-1.5' : 'px-3 py-2'}`}>
      <div className="w-2 h-2 rounded-full bg-primary glow-gold shrink-0" />
      {!collapsed && <span>{space === "vendeur" ? "Mode Vendeur" : "Mode Acquéreur"}</span>}
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {indicator}
      </PopoverTrigger>
      <PopoverContent side={collapsed ? "right" : "top"} className="w-auto p-2" align="start">
        <button
          onClick={handleSwitch}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors w-full"
        >
          <div className="w-2 h-2 rounded-full bg-info" />
          Passer en {targetLabel}
        </button>
      </PopoverContent>
    </Popover>
  );
}
export default function AppLayout({ children }: {children: React.ReactNode;}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
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

          <div className="flex items-center gap-1">
            <NotificationPanel />
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-16 left-0 z-40 ${collapsed ? 'w-14' : 'w-60'} h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-200 flex flex-col`}>
          {/* Collapse toggle at top */}
          <div className={`${collapsed ? 'p-2' : 'px-4 pt-3 pb-1'} flex ${collapsed ? 'justify-center' : 'justify-end'}`}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary p-1.5"
            >
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>

          <nav className={`flex flex-col gap-1 ${collapsed ? 'p-2' : 'px-4 pb-4'} flex-1`}>
            {navItems.map((item) => {
              const active = location.pathname === item.href ||
              item.href !== "/dashboard" && location.pathname.startsWith(item.href);

              const linkContent = (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                  active ?
                  "bg-primary/10 text-primary" :
                  "text-muted-foreground hover:text-foreground hover:bg-secondary"}`
                  }>

                  <item.icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.vip && (
                    <span className="ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-primary">
                      <Crown size={11} />
                    </span>
                  )}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="text-xs">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return linkContent;
            })}
          </nav>

          {/* Bottom nav */}
          <div className={`${collapsed ? 'p-2' : 'p-4'} border-t border-border flex flex-col gap-1`}>
            {bottomNav.map((item) => {
              const active = location.pathname === item.href;
              const linkContent = (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                  <item.icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="text-xs">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return linkContent;
            })}
            <SpaceSwitcher collapsed={collapsed} />
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