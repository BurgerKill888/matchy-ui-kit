import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Clock, Heart, FileText, Eye, ArrowRight, Search,
  Compass, AlertTriangle, Star, ClipboardList, Lock, ImageIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUserSpace } from "@/contexts/UserSpaceContext";

// --- Mock Data ---
const vendeurMatches = [
  { id: 1, title: "Bureau 350m² Paris 8e", location: "Paris 8e", surface: "350 m²", price: "2 800 000 €", condition: "Prix ferme", photos: 4, matchs: 3, timer: "2j 14h", timerHours: 62, status: "active" as string, offmarket: false, acquéreur: "SCI Patrimoine" },
  { id: 2, title: "Immeuble 1200m² Lyon 6e", location: "Lyon 6e", surface: "1 200 m²", price: "4 500 000 €", condition: "Négociable", photos: 6, matchs: 1, timer: "5j 06h", timerHours: 126, status: "active" as string, offmarket: true, acquéreur: "Foncière Grand Ouest" },
  { id: 3, title: "Terrain 2ha Bordeaux", location: "Bordeaux", surface: "20 000 m²", price: "1 200 000 €", condition: "Négociable", photos: 3, matchs: 0, timer: "0j 19h", timerHours: 19, status: "active" as string, offmarket: false, acquéreur: "Nexity Régions" },
];

const acquereurMatches = [
  { id: 1, title: "Bureau 350m² Paris 8e", location: "Paris 8e", surface: "350 m²", price: "2 800 000 €", condition: "Prix ferme", photos: 4, matchs: 3, timer: "2j 14h", timerHours: 62, status: "active" as string, offmarket: false, acquéreur: "SCI Patrimoine" },
  { id: 2, title: "Immeuble mixte Lyon 6e", location: "Lyon 6e", surface: "800 m²", price: "3 200 000 €", condition: "Négociable", photos: 5, matchs: 1, timer: "0j 06h", timerHours: 6, status: "active" as string, offmarket: false, acquéreur: "Foncière Grand Ouest" },
];

// --- KPI Card ---
function KpiCard({ label, value, icon: Icon, delay }: {
  label: string; value: string; icon: React.ElementType; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-xl p-3 sm:p-4 space-y-1.5 sm:space-y-2"
    >
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-muted-foreground" />
        <span className="text-[11px] sm:text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="font-display text-2xl sm:text-3xl font-bold text-foreground">{value}</p>
    </motion.div>
  );
}

// --- Timer color helper ---
function getTimerColor(hours: number) {
  if (hours < 24) return "text-destructive";
  return "text-muted-foreground";
}

// --- Horizontal Match Card ---
function MatchCard({ match, index }: { match: typeof vendeurMatches[0]; index: number }) {
  const timerUrgent = match.timerHours < 24;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Link to="/matches" className="block">
        <div className="glass-card rounded-xl overflow-hidden flex flex-col sm:flex-row group hover:border-white/20 transition-all duration-200">
          {/* Image placeholder */}
          <div className="relative w-full sm:w-[180px] h-[140px] sm:h-auto sm:min-h-[130px] bg-gradient-to-br from-secondary to-background flex items-center justify-center shrink-0">
            <span className="text-muted-foreground/20 text-2xl italic font-light">Photo</span>
            <div className="absolute bottom-2 right-2 bg-black/50 rounded px-2 py-0.5 text-[10px] text-white/70 flex items-center gap-1">
              {match.photos} <ImageIcon size={10} />
            </div>
            {match.status === "paused" && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-[11px] font-bold text-white/60 tracking-wider">⏸ EN PAUSE</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-3.5 flex flex-col justify-center min-w-0">
            {/* Price row */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-lg font-extrabold text-foreground">
                {match.offmarket ? "Prix confidentiel" : match.price}
              </span>
              {match.offmarket ? (
                <span className="text-[11px] text-primary flex items-center gap-1"><Lock size={10} /> Off-market</span>
              ) : (
                <span className="text-[11px] text-primary">{match.condition}</span>
              )}
            </div>

            {/* Title */}
            <p className="text-sm font-semibold text-foreground mb-1 truncate">{match.title}</p>

            {/* Location + surface + acquéreur */}
            <p className="text-xs text-muted-foreground mb-2.5 truncate">
              {match.location} · {match.surface}
              {match.acquéreur && (
                <><span className="text-white/10 mx-1.5">·</span><span className="text-foreground font-semibold">{match.acquéreur}</span></>
              )}
            </p>

            {/* Footer: timer + matchs */}
            <div className="flex items-center gap-4">
              <span className={`flex items-center gap-1 text-[11px] ${timerUrgent ? "text-warning" : "text-muted-foreground"}`}>
                {timerUrgent ? <AlertTriangle size={11} /> : <Clock size={11} />} {match.timer}
              </span>
              {match.matchs > 0 ? (
                <span className="text-xs font-bold text-primary">🎯 {match.matchs} match{match.matchs > 1 ? "s" : ""}</span>
              ) : (
                <span className="text-[11px] text-white/20">Aucun match</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// --- Dashboard Vendeur ---
function VendeurDashboard() {
  const kpis = [
    { label: "Annonces actives", value: "2", icon: FileText },
    { label: "Vues reçues", value: "54", icon: Eye },
    { label: "Matchs en cours", value: "3", icon: Heart },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Espace Vendeur</h1>
          <p className="text-muted-foreground mt-1 text-sm">Bienvenue dans votre espace vendeur Matchstone.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link to="/onboarding" className="flex-1 sm:flex-initial">
            <Button variant="outline" className="border-white/20 text-foreground hover:bg-white/5 w-full">
              <ClipboardList size={15} className="mr-1.5" /> Onboarding
            </Button>
          </Link>
          <Link to="/listings/create" className="flex-1 sm:flex-initial">
            <Button className="glow-gold font-medium w-full">
              <Plus size={15} className="mr-1.5" /> Publier
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {kpis.map((k, i) => <KpiCard key={k.label} {...k} delay={i * 0.05} />)}
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-base font-semibold flex items-center gap-2 text-foreground">
          <Heart size={16} className="text-primary fill-primary" /> Matchs récents
        </h2>
        {vendeurMatches.map((m, i) => <MatchCard key={m.id} match={m} index={i} />)}
      </div>
    </div>
  );
}

// --- Dashboard Acquéreur ---
function AcquereurDashboard() {
  const kpis = [
    { label: "Fiches actives", value: "2", icon: FileText },
    { label: "Opportunités", value: "18", icon: Search },
    { label: "Matchs en cours", value: "2", icon: Heart },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">Espace Acquéreur</h1>
          <p className="text-muted-foreground mt-1 text-sm">Bienvenue dans votre espace acquéreur Matchstone.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/criteria/create">
            <Button variant="outline" className="border-white/20 text-foreground hover:bg-white/5 w-full sm:w-auto">
              <Plus size={15} className="mr-1.5" /> Nouvelle fiche
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {kpis.map((k, i) => <KpiCard key={k.label} {...k} delay={i * 0.05} />)}
      </div>

      <div className="space-y-3">
        <h2 className="font-display text-base font-semibold flex items-center gap-2 text-foreground">
          <Heart size={16} className="text-primary fill-primary" /> Matchs récents
        </h2>
        {acquereurMatches.map((m, i) => <MatchCard key={m.id} match={m} index={i} />)}
      </div>
    </div>
  );
}


export default function Dashboard() {
  const { isVendeur } = useUserSpace();
  return (
    <AppLayout>
      {isVendeur ? <VendeurDashboard /> : <AcquereurDashboard />}
    </AppLayout>
  );
}
