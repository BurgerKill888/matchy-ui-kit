import { useState } from "react";
import { Bell, Heart, MessageSquare, Clock, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { NewMatchModal, StartConversationModal, DeclineMatchModal } from "@/components/modals/MatchActionModals";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertTriangle, MapPin } from "lucide-react";

const mockMatchInfo = {
  property: "Bureau 350m² Paris 8e",
  surface: "350m²",
  price: "2 800 000 €",
  condition: "Bon état",
  counterpart: "SCI Patrimoine",
  counterpartRole: "Investisseur institutionnel",
  counterpartBudget: "2 000 000 – 4 000 000 €",
  compatibility: 92,
  timerHours: 47,
  timerMinutes: 30,
  criteria: [
    { label: "Localisation", compatible: true },
    { label: "Surface", compatible: true },
    { label: "Budget", compatible: true },
    { label: "Type de bien", compatible: true },
    { label: "DPE", compatible: false },
  ],
};

const timerMatchInfo = {
  property: "Terrain 2ha Bordeaux",
  surface: "2 000m²",
  price: "750 000 €",
  condition: "Terrain nu",
  counterpart: "Promoteur Sud-Ouest",
  counterpartRole: "Promoteur immobilier",
  compatibility: 83,
  timerHours: 4,
  timerMinutes: 0,
  criteria: [
    { label: "Localisation", compatible: true },
    { label: "Surface", compatible: true },
    { label: "Budget", compatible: true },
    { label: "Type de bien", compatible: false },
  ],
};

const mockNotifications = [
  { id: 1, type: "match" as const, icon: Heart, text: "Nouveau match : Bureau 350m² Paris 8e — 92% compatible", time: "il y a 2h", read: false, href: "/matches" },
  { id: 2, type: "message" as const, icon: MessageSquare, text: "Nouveau message de SCI Patrimoine", time: "il y a 3h", read: false, href: "/matches" },
  { id: 3, type: "timer" as const, icon: Clock, text: "Timer bientôt expiré : Terrain 2ha Bordeaux — 4h restantes", time: "il y a 5h", read: false, href: "/matches" },
  { id: 4, type: "view" as const, icon: Eye, text: "Votre annonce Bureau Paris 8e a atteint 50 vues", time: "il y a 1j", read: true, href: "/listings/1" },
];

function TimerExpiringModal({ open, onOpenChange, onGoToMatch }: { open: boolean; onOpenChange: (o: boolean) => void; onGoToMatch: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center pt-8 pb-2 text-center">
          <span className="text-5xl mb-3">⏳</span>
          <h2 className="font-display text-xl font-bold text-foreground">Timer bientôt expiré !</h2>
          <p className="text-sm text-muted-foreground mt-1">Répondez avant qu'il ne soit trop tard.</p>
        </div>
        <div className="w-full px-6 pb-6 space-y-4">
          <div className="border border-border rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{timerMatchInfo.property}</p>
              <p className="text-xs text-muted-foreground">{timerMatchInfo.surface} · {timerMatchInfo.price}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2 text-center">
              <span className="font-display text-2xl font-bold text-destructive">{timerMatchInfo.timerHours}</span>
              <p className="text-[10px] text-destructive/70">heures</p>
            </div>
            <span className="text-xl font-bold text-muted-foreground">:</span>
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2 text-center">
              <span className="font-display text-2xl font-bold text-destructive">00</span>
              <p className="text-[10px] text-destructive/70">min</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl bg-warning/10 border border-warning/30 p-3 text-xs text-warning-foreground leading-relaxed">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>Sans réponse dans les temps, ce match sera définitivement expiré et vous ne pourrez plus contacter cet acquéreur.</span>
          </div>

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1 h-11" onClick={() => onOpenChange(false)}>
              Plus tard
            </Button>
            <Button className="flex-1 h-11 glow-gold bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onGoToMatch}>
              Voir le match
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [newMatchOpen, setNewMatchOpen] = useState(false);
  const [startConvoOpen, setStartConvoOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [timerOpen, setTimerOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotifClick = (e: React.MouseEvent, notif: typeof mockNotifications[0]) => {
    if (notif.type === "match") {
      e.preventDefault();
      setPopoverOpen(false);
      setNewMatchOpen(true);
    } else if (notif.type === "timer") {
      e.preventDefault();
      setPopoverOpen(false);
      setTimerOpen(true);
    }
    // message & view: default Link navigation
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
            {notifications.map((notif) => {
              const isInteractive = notif.type === "match" || notif.type === "timer";
              const Wrapper = isInteractive ? "button" : Link;
              const wrapperProps = isInteractive
                ? { onClick: (e: React.MouseEvent) => handleNotifClick(e, notif), className: "w-full text-left" }
                : { to: notif.href };

              return (
                <Wrapper key={notif.id} {...(wrapperProps as any)}>
                  <div
                    className={`flex items-start gap-3 p-3 hover:bg-secondary/50 transition-colors border-b border-border/50 cursor-pointer ${
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
                </Wrapper>
              );
            })}
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

      {/* New Match Modal */}
      <NewMatchModal
        open={newMatchOpen}
        onOpenChange={setNewMatchOpen}
        match={mockMatchInfo}
        onAccept={() => { setNewMatchOpen(false); setStartConvoOpen(true); }}
        onDecline={() => { setNewMatchOpen(false); setDeclineOpen(true); }}
      />

      {/* Start Conversation Modal (after accepting) */}
      <StartConversationModal
        open={startConvoOpen}
        onOpenChange={setStartConvoOpen}
        match={mockMatchInfo}
        onSend={() => { setStartConvoOpen(false); navigate("/matches"); }}
      />

      {/* Decline Match Modal */}
      <DeclineMatchModal
        open={declineOpen}
        onOpenChange={setDeclineOpen}
        match={mockMatchInfo}
        onConfirmDecline={() => { setDeclineOpen(false); }}
      />

      {/* Timer Expiring Modal */}
      <TimerExpiringModal
        open={timerOpen}
        onOpenChange={setTimerOpen}
        onGoToMatch={() => { setTimerOpen(false); navigate("/matches"); }}
      />
    </>
  );
}
