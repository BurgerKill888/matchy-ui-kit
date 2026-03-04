import AppLayout from "@/components/AppLayout";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Clock, Heart, MessageSquare, Send, Eye, AlertTriangle,
  MapPin, Ruler, Euro, FolderOpen, Lock, Info, X, Filter, ChevronDown, Check, ArrowUpDown, ArrowUp, ArrowDown, ImageIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useUserSpace } from "@/contexts/UserSpaceContext";
import { useIsMobile } from "@/hooks/use-mobile";
import EmptyState from "@/components/EmptyState";
import { Link } from "react-router-dom";
import { getTypeColor, typeColors } from "@/lib/propertyTypes";
import { motion, AnimatePresence } from "framer-motion";
import { NewMatchModal, StartConversationModal, DeclineMatchModal } from "@/components/modals/MatchActionModals";
import { DataRoomModals, DataRoomModalType } from "@/components/modals/DataRoomModals";

// --- Types ---
type Status = "new" | "in_conversation" | "offer_sent" | "expired";

interface MatchItem {
  id: number;
  property: string;
  type: string;
  counterpart: string;
  timer: string;
  timerHours: number;
  compatibility: number;
  status: Status;
  unread: boolean;
  lastMessage: string;
  price: string;
  pricePerM2: string;
  priceTag: string;
  location: string;
  surface: string;
  condition: string;
  dataRoomAccess: boolean;
  image: string;
}

interface ChatMessage {
  id: number;
  from: "me" | "them" | "system" | "dataroom_request";
  text: string;
  time: string;
}

// --- Mock data ---
const mockMatches: MatchItem[] = [
  { id: 1, property: "Bureau 350m² Paris 8e", type: "Bureaux", counterpart: "SCI Patrimoine", timer: "2j 14h", timerHours: 62, compatibility: 92, status: "new", unread: true, lastMessage: "", price: "2 800 000 €", pricePerM2: "8 000 €/m²", priceTag: "Prix ferme", location: "Paris 8e", surface: "350m²", condition: "Bon état", dataRoomAccess: false, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop" },
  { id: 2, property: "Immeuble mixte Lyon 6e", type: "Immeuble", counterpart: "Foncière Grand Ouest", timer: "5j 02h", timerHours: 122, compatibility: 85, status: "in_conversation", unread: false, lastMessage: "Documents reçus, merci.", price: "3 500 000 €", pricePerM2: "2 917 €/m²", priceTag: "Négociable", location: "Lyon 6e", surface: "1 200m²", condition: "À rénover", dataRoomAccess: true, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop" },
  { id: 3, property: "Local commercial Marseille", type: "Local commercial", counterpart: "Cabinet Martin & Associés", timer: "1j 08h", timerHours: 32, compatibility: 88, status: "offer_sent", unread: true, lastMessage: "Offre envoyée.", price: "620 000 €", pricePerM2: "3 444 €/m²", priceTag: "Off-market 🔒", location: "Marseille 2e", surface: "180m²", condition: "Neuf", dataRoomAccess: false, image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop" },
  { id: 4, property: "Terrain 2ha Bordeaux", type: "Terrain à potentiel", counterpart: "Nexity Régions", timer: "0j 00h", timerHours: 0, compatibility: 78, status: "expired", unread: false, lastMessage: "Délai expiré.", price: "1 200 000 €", pricePerM2: "60 €/m²", priceTag: "Négociable", location: "Bordeaux", surface: "2 ha", condition: "Terrain nu", dataRoomAccess: false, image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop" },
];

const mockMessagesByMatch: Record<number, ChatMessage[]> = {
  1: [],
  2: [
    { id: 1, from: "them", text: "Bonjour, nous sommes intéressés par votre immeuble mixte. Quelles sont les conditions ?", time: "14:30" },
    { id: 2, from: "me", text: "Bonjour, merci pour votre intérêt. Le bien est disponible immédiatement. Souhaitez-vous planifier une visite ?", time: "14:45" },
    { id: 3, from: "them", text: "Documents reçus, merci.", time: "15:02" },
    { id: 4, from: "dataroom_request", text: "Foncière Grand Ouest demande l'accès à la Data Room de votre bien.", time: "15:10" },
  ],
  3: [
    { id: 1, from: "them", text: "Bonjour, ce local nous intéresse fortement.", time: "10:00" },
    { id: 2, from: "me", text: "Merci, je vous envoie une offre formelle.", time: "10:30" },
    { id: 3, from: "me", text: "Offre envoyée.", time: "11:00" },
  ],
  4: [
    { id: 1, from: "them", text: "Le terrain est-il toujours disponible ?", time: "09:00" },
    { id: 2, from: "system", text: "Le délai de mise en relation a expiré.", time: "09:00" },
  ],
};

const statusConfig: Record<Status, { label: string; variant: "default" | "secondary" | "outline" }> = {
  new: { label: "Nouveau", variant: "default" },
  in_conversation: { label: "En conversation", variant: "secondary" },
  offer_sent: { label: "Offre envoyée", variant: "outline" },
  expired: { label: "Expiré", variant: "secondary" },
};

const pipelineSteps: { key: Status; label: string }[] = [
  { key: "new", label: "Nouveau" },
  { key: "in_conversation", label: "En conversation" },
  { key: "offer_sent", label: "Offre envoyée" },
  { key: "expired", label: "Expiré" },
];

const allPropertyTypes = ["Maison", "Immeuble", "Appartement", "Terrain à potentiel", "Local commercial", "Bureaux", "Entrepôt / activité", "Ensemble immobilier mixte"];

// --- Helpers ---
function getTimerStyle(hours: number) {
  if (hours <= 0) return "text-muted-foreground";
  if (hours < 24) return "text-destructive";
  if (hours < 48) return "text-warning";
  return "text-muted-foreground";
}

// =====================
// MAIN COMPONENT
// =====================
export default function Matches() {
  const { isVendeur, isAcquereur } = useUserSpace();
  const isMobile = useIsMobile();
  const isNarrow = useIsNarrow();

  const [filter, setFilter] = useState<Status | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"none" | "asc" | "desc">("none");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat" | "details">("list");
  const [detailsSlideOpen, setDetailsSlideOpen] = useState(false);

  // --- Match action modals (seller) ---
  const [newMatchModalOpen, setNewMatchModalOpen] = useState(false);
  const [startConvoModalOpen, setStartConvoModalOpen] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [actionMatchId, setActionMatchId] = useState<number | null>(null);

  const actionMatch = mockMatches.find((m) => m.id === actionMatchId) ?? null;
  const actionMatchInfo = actionMatch ? {
    property: actionMatch.property,
    surface: actionMatch.surface,
    price: actionMatch.price,
    condition: actionMatch.condition,
    counterpart: actionMatch.counterpart,
    counterpartRole: "Marchand de biens",
    counterpartBudget: "2 000 000 € – 3 500 000 €",
    compatibility: actionMatch.compatibility,
    timerHours: actionMatch.timerHours,
    timerMinutes: 59,
    criteria: [
      { label: "Budget", compatible: true },
      { label: "Surface", compatible: true },
      { label: "Typologie", compatible: true },
      { label: "Localisation", compatible: true },
      { label: "État du bien", compatible: false },
    ],
  } : null;

  const counts = pipelineSteps.reduce((acc, s) => {
    acc[s.key] = mockMatches.filter((m) => m.status === s.key).length;
    return acc;
  }, {} as Record<Status, number>);

  const filteredByStatus = filter === "all" ? mockMatches : mockMatches.filter((m) => m.status === filter);
  const filteredByType = typeFilter.length === 0 ? filteredByStatus : filteredByStatus.filter((m) => typeFilter.includes(m.type));
  const filtered = sortOrder === "none" ? filteredByType : [...filteredByType].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/\s/g, "").replace("€", ""));
    const priceB = parseInt(b.price.replace(/\s/g, "").replace("€", ""));
    return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
  });
  const active = filtered.filter((m) => m.status !== "expired");
  const expired = filtered.filter((m) => m.status === "expired");
  const selected = mockMatches.find((m) => m.id === selectedId) ?? null;
  const messages = selectedId ? (mockMessagesByMatch[selectedId] ?? []) : [];

  function selectMatch(id: number) {
    const match = mockMatches.find((m) => m.id === id);
    // Seller clicking a new match → show modal instead of chat
    if (isVendeur && match?.status === "new" && (mockMessagesByMatch[id] ?? []).length === 0) {
      setActionMatchId(id);
      setNewMatchModalOpen(true);
      return;
    }
    setSelectedId(id);
    if (isMobile) setMobileView("chat");
  }

  function handleAcceptMatch() {
    setNewMatchModalOpen(false);
    setStartConvoModalOpen(true);
  }

  function handleDeclineMatch() {
    setNewMatchModalOpen(false);
    setDeclineModalOpen(true);
  }

  function handleSendFirstMessage(msg: string) {
    setStartConvoModalOpen(false);
    if (actionMatchId) {
      setSelectedId(actionMatchId);
      if (isMobile) setMobileView("chat");
    }
    setActionMatchId(null);
  }

  function handleConfirmDecline(reason: string) {
    setDeclineModalOpen(false);
    setActionMatchId(null);
  }

  // --- Mobile navigation ---
  if (isMobile) {
    return (
      <AppLayout>
        <AnimatePresence mode="wait">
          {mobileView === "list" && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[calc(100vh-4rem)] flex flex-col">
              <MatchListColumn
                filter={filter} setFilter={setFilter} counts={counts}
                typeFilter={typeFilter} setTypeFilter={setTypeFilter}
                sortOrder={sortOrder} setSortOrder={setSortOrder}
                active={active} expired={expired} selectedId={selectedId}
                onSelect={selectMatch} filtered={filtered} isAcquereur={isAcquereur}
              />
            </motion.div>
          )}
          {mobileView === "chat" && selected && (
            <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-[calc(100vh-4rem)] flex flex-col">
              <div className="p-2 border-b border-border flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setMobileView("list")}>← Retour</Button>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setMobileView("details")}>
                  <Info size={16} className="mr-1" /> Détails
                </Button>
              </div>
              <ConversationColumn selected={selected} messages={messages} message={message} setMessage={setMessage} onShowDetails={() => setMobileView("details")} showDetailsBtn={false} isAcquereur={isAcquereur} />
            </motion.div>
          )}
          {mobileView === "details" && selected && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="h-[calc(100vh-4rem)] flex flex-col">
              <div className="p-2 border-b border-border">
                <Button variant="ghost" size="sm" onClick={() => setMobileView("chat")}>← Conversation</Button>
              </div>
              <ScrollArea className="flex-1">
                <PropertyDetailColumn selected={selected} isAcquereur={isAcquereur} />
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Match action modals */}
        {actionMatchInfo && (
          <>
            <NewMatchModal open={newMatchModalOpen} onOpenChange={setNewMatchModalOpen} match={actionMatchInfo} onAccept={handleAcceptMatch} onDecline={handleDeclineMatch} />
            <StartConversationModal open={startConvoModalOpen} onOpenChange={setStartConvoModalOpen} match={actionMatchInfo} onSend={handleSendFirstMessage} />
            <DeclineMatchModal open={declineModalOpen} onOpenChange={setDeclineModalOpen} match={actionMatchInfo} onConfirmDecline={handleConfirmDecline} />
          </>
        )}
      </AppLayout>
    );
  }

  // --- Desktop 3-column / 2-column ---
  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left column — match list */}
        <div className="w-80 xl:w-[22rem] border-r border-border flex flex-col shrink-0">
          <MatchListColumn
            filter={filter} setFilter={setFilter} counts={counts}
            typeFilter={typeFilter} setTypeFilter={setTypeFilter}
            sortOrder={sortOrder} setSortOrder={setSortOrder}
            active={active} expired={expired} selectedId={selectedId}
            onSelect={selectMatch} filtered={filtered} isAcquereur={isAcquereur}
          />
        </div>

        {/* Center — conversation */}
        <div className="flex-1 min-w-0 flex flex-col">
          {selected ? (
            <ConversationColumn
              selected={selected} messages={messages}
              message={message} setMessage={setMessage}
              onShowDetails={() => setDetailsSlideOpen(true)}
              showDetailsBtn={isNarrow} isAcquereur={isAcquereur}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={MessageSquare}
                title="Sélectionnez un match"
                subtitle="Cliquez sur un match pour démarrer ou poursuivre un échange."
              />
            </div>
          )}
        </div>

        {/* Right column — property details (hidden on narrow) */}
        {!isNarrow && selected && (
          <div className="w-80 border-l border-border shrink-0">
            <ScrollArea className="h-full">
              <PropertyDetailColumn selected={selected} isAcquereur={isAcquereur} />
            </ScrollArea>
          </div>
        )}

        {/* Slide-over for narrow screens */}
        <AnimatePresence>
          {isNarrow && detailsSlideOpen && selected && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-background/60"
                onClick={() => setDetailsSlideOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                className="fixed right-0 top-16 bottom-0 z-50 w-80 bg-card border-l border-border shadow-elevated"
              >
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <span className="text-sm font-semibold">Détails de l'annonce</span>
                  <Button variant="ghost" size="icon" onClick={() => setDetailsSlideOpen(false)}><X size={16} /></Button>
                </div>
                <ScrollArea className="h-[calc(100%-3.5rem)]">
                  <PropertyDetailColumn selected={selected} isAcquereur={isAcquereur} />
                </ScrollArea>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      {/* Match action modals */}
      {actionMatchInfo && (
        <>
          <NewMatchModal open={newMatchModalOpen} onOpenChange={setNewMatchModalOpen} match={actionMatchInfo} onAccept={handleAcceptMatch} onDecline={handleDeclineMatch} />
          <StartConversationModal open={startConvoModalOpen} onOpenChange={setStartConvoModalOpen} match={actionMatchInfo} onSend={handleSendFirstMessage} />
          <DeclineMatchModal open={declineModalOpen} onOpenChange={setDeclineModalOpen} match={actionMatchInfo} onConfirmDecline={handleConfirmDecline} />
        </>
      )}
    </AppLayout>
  );
}

// =====================
// HOOK: narrow screen (no right column)
// =====================
function useIsNarrow() {
  const [narrow, setNarrow] = useState(window.innerWidth < 1400);
  useEffect(() => {
    const handler = () => setNarrow(window.innerWidth < 1400);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return narrow;
}

// =====================
// LEFT COLUMN — Match list
// =====================
function MatchListColumn({
  filter, setFilter, counts, typeFilter, setTypeFilter, sortOrder, setSortOrder, active, expired, selectedId, onSelect, filtered, isAcquereur,
}: {
  filter: Status | "all"; setFilter: (f: Status | "all") => void;
  counts: Record<Status, number>;
  typeFilter: string[]; setTypeFilter: (f: string[]) => void;
  sortOrder: "none" | "asc" | "desc"; setSortOrder: (s: "none" | "asc" | "desc") => void;
  active: MatchItem[]; expired: MatchItem[];
  selectedId: number | null; onSelect: (id: number) => void;
  filtered: MatchItem[]; isAcquereur: boolean;
}) {
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  function toggleType(t: string) {
    setTypeFilter(typeFilter.includes(t) ? typeFilter.filter((x) => x !== t) : [...typeFilter, t]);
  }

  function cycleSortOrder() {
    setSortOrder(sortOrder === "none" ? "asc" : sortOrder === "asc" ? "desc" : "none");
  }

  const statusLabel = filter === "all" ? `Tous (${mockMatches.length})` : `${statusConfig[filter].label} (${counts[filter]})`;

  return (
    <>
      <div className="p-4 pb-2">
        <h2 className="font-display text-lg font-semibold">Mes matches</h2>
      </div>

      {/* Filter buttons row */}
      <div className="px-4 pb-3 flex items-center gap-2">
        {/* Status filter dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className={`text-xs h-7 gap-1 ${filter !== "all" ? "border-primary text-primary" : ""}`}
            onClick={() => { setStatusDropdownOpen(!statusDropdownOpen); setTypeDropdownOpen(false); }}
          >
            <Heart size={12} />
            {statusLabel}
            <ChevronDown size={11} className={`transition-transform ${statusDropdownOpen ? "rotate-180" : ""}`} />
          </Button>
          <AnimatePresence>
            {statusDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setStatusDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1 z-50 w-52 rounded-lg border border-border bg-card shadow-elevated p-1.5"
                >
                  <button
                    onClick={() => { setFilter("all"); setStatusDropdownOpen(false); }}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                      filter === "all" ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <span className="flex-1 text-left">Tous ({mockMatches.length})</span>
                    {filter === "all" && <Check size={12} className="text-primary shrink-0" />}
                  </button>
                  {pipelineSteps.map((step) => (
                    <button
                      key={step.key}
                      onClick={() => { setFilter(step.key); setStatusDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                        filter === step.key ? "bg-primary/10 text-foreground" : step.key === "expired" ? "text-muted-foreground/60 hover:bg-secondary hover:text-muted-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <span className="flex-1 text-left">{step.label} ({counts[step.key]})</span>
                      {filter === step.key && <Check size={12} className="text-primary shrink-0" />}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Type filter dropdown */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            className={`text-xs h-7 gap-1 ${typeFilter.length > 0 ? "border-primary text-primary" : ""}`}
            onClick={() => { setTypeDropdownOpen(!typeDropdownOpen); setStatusDropdownOpen(false); }}
          >
            <Filter size={12} />
            {typeFilter.length > 0 ? `${typeFilter.length} type${typeFilter.length > 1 ? "s" : ""}` : "Typologie"}
            <ChevronDown size={11} className={`transition-transform ${typeDropdownOpen ? "rotate-180" : ""}`} />
          </Button>
          <AnimatePresence>
            {typeDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setTypeDropdownOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full mt-1 z-50 w-56 rounded-lg border border-border bg-card shadow-elevated p-1.5"
                >
                  {allPropertyTypes.map((t) => {
                    const isActive = typeFilter.includes(t);
                    const color = getTypeColor(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                          isActive ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }`}
                      >
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="flex-1 text-left">{t}</span>
                        {isActive && <Check size={12} className="text-primary shrink-0" />}
                      </button>
                    );
                  })}
                  {typeFilter.length > 0 && (
                    <>
                      <Separator className="my-1" />
                      <button
                        onClick={() => setTypeFilter([])}
                        className="w-full text-center text-[11px] text-muted-foreground hover:text-foreground py-1"
                      >
                        Réinitialiser
                      </button>
                    </>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Sort button */}
        <Button
          variant="outline"
          size="sm"
          className={`text-xs h-7 w-7 p-0 shrink-0 ${sortOrder !== "none" ? "border-primary text-primary" : ""}`}
          onClick={cycleSortOrder}
          title={sortOrder === "none" ? "Trier par prix" : sortOrder === "asc" ? "Prix croissant" : "Prix décroissant"}
        >
          {sortOrder === "asc" ? <ArrowUp size={13} /> : sortOrder === "desc" ? <ArrowDown size={13} /> : <ArrowUpDown size={13} />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        {filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={Heart}
              title="Aucune mise en relation"
              subtitle="Vos matches apparaîtront ici."
              ctaLabel={isAcquereur ? "Découvrir" : undefined}
              ctaHref={isAcquereur ? "/discovery" : undefined}
            />
          </div>
        ) : (
          <div className="px-2 pb-2 space-y-2">
            {active.map((m, idx) => (
              <MatchListItem key={m.id} match={m} selected={selectedId === m.id} onSelect={onSelect} isFirstNew={idx === 0 && m.status === "new"} />
            ))}

            {expired.length > 0 && (
              <>
                <Separator className="my-2" />
                <p className="px-2 text-xs text-muted-foreground font-semibold mb-1">Expirés</p>
                {expired.map((m) => (
                  <MatchListItem key={m.id} match={m} selected={selectedId === m.id} onSelect={onSelect} />
                ))}
              </>
            )}
          </div>
        )}
      </ScrollArea>
    </>
  );
}

function FilterPill({ active, onClick, label, muted }: { active: boolean; onClick: () => void; label: string; muted?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all duration-200 ${
        active
          ? muted
            ? "bg-muted text-muted-foreground border-border"
            : "bg-primary text-primary-foreground border-primary glow-gold"
          : muted
            ? "border-border text-muted-foreground/50 hover:text-muted-foreground"
            : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
      }`}
    >
      {label}
    </button>
  );
}

function MatchListItem({ match, selected, onSelect, isFirstNew = false }: { match: MatchItem; selected: boolean; onSelect: (id: number) => void; isFirstNew?: boolean }) {
  const isExpired = match.status === "expired";
  const st = statusConfig[match.status];
  const timerUrgent = match.timerHours > 0 && match.timerHours < 24;
  const isOffmarket = match.priceTag.includes("Off-market");

  return (
    <button
      onClick={() => onSelect(match.id)}
      className={`w-full text-left rounded-xl transition-all duration-200 overflow-hidden border relative ${
        selected
          ? "bg-primary/10 border-primary/30"
          : isFirstNew
            ? "border-primary/50 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent ring-1 ring-primary/30 shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)] animate-pulse-gold"
            : isExpired
              ? "border-transparent opacity-50 hover:bg-secondary/50"
              : "border-transparent hover:bg-secondary/60"
      }`}
    >
      <div className="flex">
        {/* Image */}
        <div className="relative w-[130px] min-h-[110px] shrink-0 overflow-hidden">
          <img src={match.image} alt={match.property} className="w-full h-full object-cover" />
          <div className="absolute bottom-1.5 right-1.5 bg-black/50 rounded px-1.5 py-0.5 text-[9px] text-white/70 flex items-center gap-0.5">
            4 <ImageIcon size={9} />
          </div>
          {isExpired && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white/60 tracking-wider">EXPIRÉ</span>
            </div>
          )}
          {/* Unread dot */}
          {match.unread && !isExpired && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse-gold ring-2 ring-background" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-2.5 flex flex-col justify-center min-w-0">
          {/* Price row */}
          <div className="flex items-baseline gap-1.5 mb-0.5">
            <span className="text-sm font-extrabold text-foreground truncate">
              {isOffmarket ? "Confidentiel" : match.price}
            </span>
            {isOffmarket ? (
              <span className="text-[10px] text-primary flex items-center gap-0.5"><Lock size={9} /> Off-market</span>
            ) : (
              <span className="text-[10px] text-primary">{match.priceTag}</span>
            )}
          </div>

          {/* Title */}
          <p className="text-xs font-semibold text-foreground truncate mb-0.5">{match.property}</p>

          {/* Location + surface */}
          <p className="text-[11px] text-muted-foreground truncate mb-1.5">
            {match.location} · {match.surface}
          </p>

          {/* Footer: timer + closing */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={st.variant} className="text-[9px] h-3.5 px-1">{st.label}</Badge>
            <span className={`flex items-center gap-0.5 text-[10px] ${timerUrgent ? "text-warning" : "text-muted-foreground"}`}>
              {timerUrgent ? <AlertTriangle size={9} /> : <Clock size={9} />} {match.timer}
            </span>
            <span className="text-[10px] font-bold text-primary ml-auto">Compatibilité {match.compatibility}%</span>
          </div>
        </div>
      </div>
    </button>
  );
}

// =====================
// CENTER COLUMN — Conversation
// =====================
function ConversationColumn({
  selected, messages, message, setMessage, onShowDetails, showDetailsBtn, isAcquereur,
}: {
  selected: MatchItem; messages: ChatMessage[];
  message: string; setMessage: (v: string) => void;
  onShowDetails: () => void; showDetailsBtn: boolean; isAcquereur: boolean;
}) {
  const st = statusConfig[selected.status];
  const isNew = selected.status === "new" && messages.length === 0;
  const [headerDataRoomOpen, setHeaderDataRoomOpen] = useState(false);
  const [dataRoomModal, setDataRoomModal] = useState<DataRoomModalType>(null);

  return (
    <>
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div>
            <p className="font-semibold text-sm">{selected.counterpart}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant={st.variant} className="text-[10px] h-4 px-1.5">{st.label}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showDetailsBtn && (
            <Button variant="outline" size="sm" className="text-xs h-7" onClick={onShowDetails}>
              <Info size={12} className="mr-1" /> Détails de l'annonce
            </Button>
          )}
          {isAcquereur && (
            selected.dataRoomAccess ? (
              <Link to="/dataroom">
                <Button variant="outline" size="sm" className="text-xs h-7">
                  <FolderOpen size={12} className="mr-1" /> Data Room
                </Button>
              </Link>
            ) : (
              <>
                <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setHeaderDataRoomOpen(true)}>
                  <Lock size={12} className="mr-1" /> Demander accès Data Room
                </Button>
                <DataRoomRequestModal open={headerDataRoomOpen} onOpenChange={setHeaderDataRoomOpen} propertyName={selected.property} />
              </>
            )
          )}
          <div className="flex items-center gap-2 bg-primary/15 border border-primary/40 text-primary rounded-lg px-3 py-1.5 animate-pulse-gold">
            <Clock size={14} />
            <span className="font-bold text-sm tracking-wide">{selected.timer}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {isNew && (
            <div className="text-center py-8 space-y-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Heart className="text-primary" size={24} />
              </div>
              <p className="font-display text-lg font-semibold">Nouveau match !</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Envoyez un premier message pour démarrer l'échange.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : msg.from === "system" ? "justify-center" : msg.from === "dataroom_request" ? "justify-end" : "justify-start"}`}>
              {msg.from === "system" ? (
                <p className="text-xs text-muted-foreground italic bg-secondary/50 rounded-lg px-3 py-1.5">{msg.text}</p>
              ) : msg.from === "dataroom_request" && !isAcquereur ? (
                <div className="w-full max-w-sm rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <FolderOpen size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Demande d'accès Data Room</p>
                      <p className="text-[10px] text-muted-foreground">{msg.time}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{msg.text}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs glow-gold"
                      onClick={() => setDataRoomModal("sell_received")}
                    >
                      <Check size={13} className="mr-1" /> Accepter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() => setDataRoomModal("sell_refuse")}
                    >
                      <X size={13} className="mr-1" /> Décliner
                    </Button>
                  </div>
                </div>
              ) : msg.from === "dataroom_request" && isAcquereur ? null : (
                <div className={`max-w-[70%] rounded-xl px-4 py-2.5 ${
                  msg.from === "me" ? "bg-primary text-primary-foreground" : "glass-card"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.from === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      {selected.status !== "expired" && (
        <div className="border-t border-border p-4 shrink-0">
          <div className="flex gap-2">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Votre message..." className="bg-secondary border-border" />
            <Button size="icon" className="shrink-0">
              <Send size={16} />
            </Button>
          </div>
        </div>
      )}
      {!isAcquereur && <DataRoomModals modal={dataRoomModal} onChangeModal={setDataRoomModal} />}
    </>
  );
}

// =====================
// RIGHT COLUMN — Property details
// =====================
function PropertyDetailColumn({ selected, isAcquereur }: { selected: MatchItem; isAcquereur: boolean }) {
  const typeColor = getTypeColor(selected.type);
  const [dataRoomConfirmOpen, setDataRoomConfirmOpen] = useState(false);

  return (
    <div className="p-4 space-y-4">
      {/* Property image placeholder */}
      <div className="rounded-xl overflow-hidden">
        <div className="h-2 w-full" style={{ backgroundColor: typeColor }} />
        <div className="h-36 bg-secondary flex items-center justify-center">
          <span className="text-muted-foreground text-xs">Image du bien</span>
        </div>
      </div>

      {/* Type badge */}
      <Badge className="text-[11px]" style={{ backgroundColor: typeColor, color: "#fff", borderColor: typeColor }}>
        {selected.type}
      </Badge>

      <h3 className="font-display text-base font-semibold">{selected.property}</h3>

      {/* Price tag */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 text-sm font-bold">
          <Euro size={13} /> {selected.price}
        </span>
        <Badge variant="outline" className="text-[10px] h-5">{selected.priceTag}</Badge>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={13} /> {selected.location}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Ruler size={13} /> {selected.surface}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Heart size={13} className="text-primary" /> <span>Compatibilité <span className="font-semibold text-foreground">{selected.compatibility}%</span></span>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="rounded-xl bg-secondary h-28 flex items-center justify-center relative overflow-hidden">
        <MapPin size={20} className="text-primary" />
        <span className="absolute bottom-2 text-[10px] text-muted-foreground">Carte</span>
      </div>

      {/* Action buttons */}
      <div className="space-y-2">
        <Link to={`/listings/${selected.id}`} className="block">
          <Button variant="outline" size="sm" className="w-full text-xs">
            <Eye size={12} className="mr-1.5" /> Voir l'annonce complète
          </Button>
        </Link>

        {isAcquereur && (
          selected.dataRoomAccess ? (
            <Link to="/dataroom" className="block">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <FolderOpen size={12} className="mr-1.5" /> Accéder à la Data Room
              </Button>
            </Link>
          ) : (
            <>
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => setDataRoomConfirmOpen(true)}>
                <Lock size={12} className="mr-1.5" /> Demander accès Data Room
              </Button>
              <DataRoomRequestModal open={dataRoomConfirmOpen} onOpenChange={setDataRoomConfirmOpen} propertyName={selected.property} />
            </>
          )
        )}
      </div>
    </div>
  );
}

// =====================
// DATA ROOM REQUEST MODAL
// =====================
function DataRoomRequestModal({ open, onOpenChange, propertyName }: { open: boolean; onOpenChange: (v: boolean) => void; propertyName: string }) {
  const [sent, setSent] = useState(false);

  function handleConfirm() {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onOpenChange(false);
    }, 1800);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!sent) onOpenChange(v); }}>
      <DialogContent className="sm:max-w-sm bg-card border-border">
        <div className="flex flex-col items-center py-4 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            {sent ? <Check size={24} className="text-primary" /> : <FolderOpen size={24} className="text-primary" />}
          </div>
          <DialogTitle className="font-display text-xl mb-2">
            {sent ? "Demande envoyée !" : "Demander accès à la Data Room"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {sent
              ? "Le vendeur a été notifié. Vous recevrez une notification dès que l'accès sera accordé."
              : `Confirmez votre demande d'accès aux documents confidentiels pour "${propertyName}".`}
          </DialogDescription>
        </div>
        {!sent && (
          <DialogFooter className="flex-col gap-2">
            <Button className="w-full glow-gold" onClick={handleConfirm}>
              Confirmer la demande
            </Button>
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
