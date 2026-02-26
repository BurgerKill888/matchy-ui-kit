import { useState } from "react";
import { Bell, Heart, MessageSquare, Clock, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { NewMatchModal, StartConversationModal, DeclineMatchModal } from "@/components/modals/MatchActionModals";
import { MatchExpiringModal, MatchExpiredModal } from "@/components/modals/TimerModals";

const mockMatchInfo = {
  property: "Bureau 350m² Paris 8e",
  surface: "350m²",
  price: "2 800 000 €",
  condition: "Bon état",
  counterpart: "Cabinet Martin & Associés",
  counterpartRole: "Marchand de biens",
  counterpartBudget: "2 000 000 – 4 000 000 €",
  compatibility: 92,
  timerHours: 47,
  timerMinutes: 30,
  matchDate: "20 février 2026",
  criteria: [
    { label: "Localisation", compatible: true },
    { label: "Surface", compatible: true },
    { label: "Budget", compatible: true },
    { label: "Type de bien", compatible: true },
    { label: "DPE", compatible: false },
  ],
};

const timerMatchInfo = {
  property: "Bureau 350m² Paris 8e",
  surface: "350m²",
  price: "2 800 000 €",
  condition: "Bon état",
  counterpart: "Cabinet Martin & Associés",
  counterpartRole: "Marchand de biens",
  matchDate: "20 février 2026",
};

const mockNotifications = [
  { id: 1, type: "match" as const, icon: Heart, text: "Nouveau match : Bureau 350m² Paris 8e — 92% compatible", time: "il y a 2h", read: false, href: "/matches" },
  { id: 2, type: "message" as const, icon: MessageSquare, text: "Nouveau message de SCI Patrimoine", time: "il y a 3h", read: false, href: "/matches" },
  { id: 3, type: "timer" as const, icon: Clock, text: "Timer bientôt expiré : Bureau 350m² Paris 8e — 2h restantes", time: "il y a 5h", read: false, href: "/matches" },
  { id: 4, type: "view" as const, icon: Eye, text: "Votre annonce Bureau Paris 8e a atteint 50 vues", time: "il y a 1j", read: true, href: "/listings/1" },
];

export default function NotificationPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [newMatchOpen, setNewMatchOpen] = useState(false);
  const [startConvoOpen, setStartConvoOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [expiringOpen, setExpiringOpen] = useState(false);
  const [expiredOpen, setExpiredOpen] = useState(false);
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
      setExpiringOpen(true);
    }
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

      {/* Start Conversation Modal */}
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

      {/* Match Expiring Modal */}
      <MatchExpiringModal
        open={expiringOpen}
        onOpenChange={setExpiringOpen}
        match={timerMatchInfo}
        hoursLeft={2}
        minutesLeft={34}
        onAccept={() => { setExpiringOpen(false); setStartConvoOpen(true); }}
        onDecline={() => { setExpiringOpen(false); setDeclineOpen(true); }}
      />

      {/* Match Expired Modal */}
      <MatchExpiredModal
        open={expiredOpen}
        onOpenChange={setExpiredOpen}
        match={timerMatchInfo}
        expiryDate="22 février 2026"
        stats={{ active: 3, expired: 1, accepted: 5 }}
        onReturn={() => { setExpiredOpen(false); navigate("/matches"); }}
      />
    </>
  );
}
