import { useState } from "react";
import { Bell, Heart, MessageSquare, Clock, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const mockNotifications = [
  { id: 1, type: "match" as const, icon: Heart, text: "Nouveau match : Bureau 350m² Paris 8e — 92% compatible", time: "il y a 2h", read: false, href: "/matches" },
  { id: 2, type: "message" as const, icon: MessageSquare, text: "Nouveau message de SCI Patrimoine", time: "il y a 3h", read: false, href: "/messaging" },
  { id: 3, type: "timer" as const, icon: Clock, text: "Timer bientôt expiré : Terrain 2ha Bordeaux — 4h restantes", time: "il y a 5h", read: false, href: "/matches" },
  { id: 4, type: "view" as const, icon: Eye, text: "Votre annonce Bureau Paris 8e a atteint 50 vues", time: "il y a 1j", read: true, href: "/listings/1" },
];

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-foreground">
          <Bell size={18} />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold animate-pulse-gold"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-card border-border">
        <div className="p-3 border-b border-border">
          <h3 className="font-display font-semibold text-sm">Notifications</h3>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((notif) => (
            <Link key={notif.id} to={notif.href}>
              <div
                className={`flex items-start gap-3 p-3 hover:bg-secondary/50 transition-colors border-b border-border/50 ${
                  !notif.read ? "bg-primary/5" : ""
                }`}
              >
                <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  !notif.read ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"
                }`}>
                  <notif.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {notif.text}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">{notif.time}</p>
                </div>
                {!notif.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
              </div>
            </Link>
          ))}
        </div>
        {unreadCount > 0 && (
          <div className="p-2 border-t border-border">
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={markAllRead}>
              <Check size={12} className="mr-1" /> Tout marquer comme lu
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
