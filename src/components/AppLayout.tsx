import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, FileText,
  Settings, LogOut, Menu, X, Heart, Compass, Crown, LayoutGrid, PanelLeftClose, PanelLeftOpen, ArrowUpDown, ArrowUp, ArrowDown } from
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

function SpaceSwitcher({ collapsed, mobile }: { collapsed: boolean; mobile?: boolean }) {
  const { space, setSpace } = useUserSpace();
  const navigate = useNavigate();
  const location = useLocation();

  const targetSpace = space === "vendeur" ? "acquereur" : "vendeur";

  const handleSwitch = () => {
    const isOnOldSpacePage =
      (space === "vendeur" && VENDEUR_ONLY_PAGES.some(p => location.pathname.startsWith(p))) ||
      (space === "acquereur" && ACQUEREUR_ONLY_PAGES.some(p => location.pathname.startsWith(p)));

    setSpace(targetSpace);

    if (isOnOldSpacePage) {
      navigate("/dashboard", { replace: true });
    }
  };

  const currentLabel = space === "vendeur" ? "Vendeur" : "Acquéreur";

  if (mobile) {
    return (
      <button
        onClick={handleSwitch}
        className="md:hidden flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer hover:text-foreground transition-colors rounded-full px-2 py-1 hover:bg-secondary border border-border"
      >
        <ArrowUpDown size={10} className="shrink-0" />
        <span>{space === "vendeur" ? "V" : "A"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleSwitch}
      className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2'} text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors rounded-lg hover:bg-secondary w-full ${collapsed ? 'p-1.5' : 'px-3 py-2'}`}
    >
      <ArrowUpDown size={14} className="shrink-0" />
      {!collapsed && <span>{currentLabel}</span>}
    </button>
  );
}
export default function AppLayout({ children }: {children: React.ReactNode;}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { space, isAcquereur } = useUserSpace();

  const navItems = isAcquereur ? acquereurNav : vendeurNav;
  const allMobileNav = [...navItems, ...bottomNav];

  return (
    <div className="min-h-screen flex flex-col bg-background" data-space={space}>
      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 md:px-6 h-14 md:h-16">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-foreground">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="font-display text-lg md:text-xl font-bold text-foreground">
                Match<span className="text-primary">stone</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <SpaceSwitcher collapsed={false} mobile />
            <NotificationPanel />
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:sticky top-14 md:top-16 left-0 z-40 ${sidebarOpen ? 'w-64' : ''} ${!sidebarOpen ? '' : ''} ${collapsed ? 'md:w-14' : 'md:w-60'} h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-200 flex flex-col`}>
          <div className="pt-3" />

          <nav className={`flex flex-col gap-1 ${collapsed ? 'md:p-2' : 'md:px-4 md:pb-4'} px-4 pb-4 flex-1`}>
            {navItems.map((item) => {
              const active = location.pathname === item.href ||
              item.href !== "/dashboard" && location.pathname.startsWith(item.href);

              const linkContent = (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center ${collapsed ? 'md:justify-center' : 'gap-3'} ${collapsed ? 'md:px-0 px-3 py-2.5' : 'px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                  active ?
                  "bg-primary/10 text-primary" :
                  "text-muted-foreground hover:text-foreground hover:bg-secondary"}`
                  }>

                  <item.icon size={18} />
                  <span className={collapsed ? 'md:hidden' : ''}>{item.label}</span>
                  {item.vip && (
                    <span className={`ml-auto flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-primary ${collapsed ? 'md:hidden' : ''}`}>
                      <Crown size={11} />
                    </span>
                  )}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="text-xs hidden md:block">{item.label}</TooltipContent>
                  </Tooltip>
                );
              }
              return linkContent;
            })}
          </nav>

          {/* Collapse button */}
          <div className={`${collapsed ? 'px-2' : 'px-4'} pb-2`}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`hidden md:flex items-center ${collapsed ? 'justify-center' : 'gap-3'} ${collapsed ? 'px-0 py-2.5' : 'px-3 py-2.5'} rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hover:bg-secondary w-full`}
            >
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              {!collapsed && <span>Réduire</span>}
            </button>
          </div>

          {/* Bottom nav */}
          <div className={`${collapsed ? 'p-2' : 'p-4'} border-t border-border flex flex-col gap-1`}>
            {bottomNav.map((item) => {
              const active = location.pathname === item.href;
              const linkContent = (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center ${collapsed ? 'md:justify-center' : 'gap-3'} ${collapsed ? 'md:px-0 px-3 py-2.5' : 'px-3 py-2.5'} rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                  <item.icon size={18} />
                  <span className={collapsed ? 'md:hidden' : ''}>{item.label}</span>
                </Link>
              );
              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="text-xs hidden md:block">{item.label}</TooltipContent>
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
        <main className="flex-1 min-w-0 pb-16 md:pb-0">
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

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border">
        <div className="flex items-center justify-around h-14 px-1">
          {allMobileNav.map((item) => {
            const active = location.pathname === item.href ||
              (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-lg transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon size={20} className={active ? "text-primary" : ""} />
                <span className="text-[10px] font-medium leading-tight">{item.label.replace("Mon ", "").replace("Mes ", "")}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>);

}