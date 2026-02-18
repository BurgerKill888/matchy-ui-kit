import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Clock, Heart, FileText, Eye, ArrowRight, Search,
  Compass, AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUserSpace } from "@/contexts/UserSpaceContext";
import EmptyState from "@/components/EmptyState";

// --- Mock Data ---
const vendeurMatches = [
  { id: 1, label: "Bureau 350m² Paris 8e", owner: "SCI Patrimoine", timer: "2j 14h", timerHours: 62, compatibility: 92, status: "new" as const },
  { id: 2, label: "Immeuble mixte Lyon 6e", owner: "Foncière Grand Ouest", timer: "5j 02h", timerHours: 122, compatibility: 85, status: "in_conversation" as const },
  { id: 3, label: "Terrain 2ha Bordeaux", owner: "Nexity Régions", timer: "0j 18h", timerHours: 18, compatibility: 78, status: "new" as const },
];

const vendeurAlerts = [
  { id: 1, icon: AlertTriangle, text: "Immeuble de rapport Lille — Brouillon depuis 5 jours", cta: "Finaliser", href: "/listings/3", color: "text-warning" },
  { id: 2, icon: AlertTriangle, text: "Local commercial Marseille — Aucun match depuis 7 jours", cta: "Ajuster", href: "/listings/2", color: "text-destructive" },
];

const acquereurMatches = [
  { id: 1, label: "Bureau 350m² Paris 8e", owner: "SCI Patrimoine", timer: "2j 14h", timerHours: 62, compatibility: 92, status: "new" as const },
  { id: 2, label: "Immeuble mixte Lyon 6e", owner: "Foncière Grand Ouest", timer: "0j 06h", timerHours: 6, compatibility: 85, status: "in_conversation" as const },
];

// --- KPI Card ---
function KpiCard({ label, value, icon: Icon, color, delay }: {
  label: string; value: string; icon: React.ElementType; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-xl p-4 hover:border-primary/20 transition-all duration-200 hover:shadow-card"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={color} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="font-display text-2xl font-bold">{value}</p>
    </motion.div>
  );
}

// --- Timer color helper ---
function getTimerStyle(hours: number) {
  if (hours < 24) return "text-destructive";
  if (hours < 48) return "text-warning";
  return "text-muted-foreground";
}

// --- Match Card ---
function MatchCard({ match, index }: { match: typeof vendeurMatches[0]; index: number }) {
  const timerColor = getTimerStyle(match.timerHours);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 hover:shadow-card transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Heart className="text-primary" size={20} />
          {match.status === "new" && (
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary glow-gold" />
          )}
        </div>
        <div>
          <p className="font-semibold text-sm">{match.label}</p>
          <p className="text-xs text-muted-foreground">{match.owner}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs flex items-center gap-1 font-medium ${timerColor}`}>
              {match.timerHours < 24 && <AlertTriangle size={10} />}
              <Clock size={10} /> {match.timer}
            </span>
            {match.status === "in_conversation" && (
              <Badge variant="secondary" className="text-[10px] h-5">En conversation</Badge>
            )}
          </div>
        </div>
      </div>
      <Link to="/messaging">
        <Button size="sm" variant={match.status === "new" ? "default" : "outline"} className={`transition-transform duration-200 hover:scale-[1.02] ${match.status === "new" ? "glow-gold" : ""}`}>
          Voir <ArrowRight size={14} className="ml-1" />
        </Button>
      </Link>
    </motion.div>
  );
}

// --- Alert Card ---
function AlertCard({ alert, index }: { alert: typeof vendeurAlerts[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.06 }}
      className="glass-card rounded-xl p-4 flex items-center justify-between hover:border-primary/20 hover:shadow-card transition-all duration-200"
    >
      <div className="flex items-center gap-3">
        <alert.icon size={18} className={alert.color} />
        <p className="text-sm text-foreground/90">{alert.text}</p>
      </div>
      <Link to={alert.href}>
        <Button size="sm" variant="outline" className="shrink-0 transition-transform duration-200 hover:scale-[1.02]">
          {alert.cta}
        </Button>
      </Link>
    </motion.div>
  );
}

// --- Dashboard Vendeur ---
function VendeurDashboard() {
  const kpis = [
    { label: "Annonces actives", value: "2", icon: FileText, color: "text-primary" },
    { label: "Vues reçues", value: "54", icon: Eye, color: "text-info" },
    { label: "Matches en cours", value: "3", icon: Heart, color: "text-primary" },
  ];

  const hasData = true; // toggle for empty state

  if (!hasData) {
    return (
      <div className="p-6 md:p-8 max-w-6xl space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Espace Vendeur</h1>
          <p className="text-muted-foreground mt-1">Bienvenue dans votre espace vendeur Matchstone</p>
        </div>
        <EmptyState
          icon={FileText}
          title="Votre espace vendeur est prêt"
          subtitle="Publiez votre première annonce pour commencer à recevoir des matches qualifiés."
          ctaLabel="+ Publier une annonce"
          ctaHref="/listings/create"
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Espace Vendeur</h1>
          <p className="text-muted-foreground mt-1">Bienvenue dans votre espace vendeur Matchstone</p>
        </div>
        <Link to="/listings/create">
          <Button className="glow-gold transition-transform duration-200 hover:scale-[1.02]">
            <Plus size={16} className="mr-2" /> Publier une annonce
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => <KpiCard key={k.label} {...k} delay={i * 0.05} />)}
      </div>

      {/* Matches */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2">
          <Heart size={18} className="text-primary" /> Matches récents
        </h2>
        {vendeurMatches.map((m, i) => <MatchCard key={m.id} match={m} index={i} />)}
      </div>

    </div>
  );
}

// --- Dashboard Acquéreur ---
function AcquereurDashboard() {
  const kpis = [
    { label: "Fiches actives", value: "2", icon: FileText, color: "text-primary" },
    { label: "Opportunités découvertes", value: "18", icon: Search, color: "text-info" },
    { label: "Matches en cours", value: "2", icon: Heart, color: "text-primary" },
  ];

  const hasData = true;

  if (!hasData) {
    return (
      <div className="p-6 md:p-8 max-w-6xl space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Espace Acquéreur</h1>
          <p className="text-muted-foreground mt-1">Bienvenue dans votre espace acquéreur Matchstone</p>
        </div>
        <EmptyState
          icon={Search}
          title="Votre espace acquéreur est prêt"
          subtitle="Créez votre première fiche de recherche pour découvrir des opportunités compatibles."
          ctaLabel="+ Nouvelle fiche de recherche"
          ctaHref="/criteria/create"
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Espace Acquéreur</h1>
          <p className="text-muted-foreground mt-1">Bienvenue dans votre espace acquéreur Matchstone</p>
        </div>
        <div className="flex gap-2">
          <Link to="/discovery">
            <Button className="glow-gold transition-transform duration-200 hover:scale-[1.02]">
              <Compass size={16} className="mr-2" /> Découvrir
            </Button>
          </Link>
          <Link to="/criteria/create">
            <Button variant="outline" className="transition-transform duration-200 hover:scale-[1.02]">
              <Plus size={16} className="mr-2" /> Nouvelle fiche
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => <KpiCard key={k.label} {...k} delay={i * 0.05} />)}
      </div>

      {/* Matches */}
      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2">
          <Heart size={18} className="text-primary" /> Matches récents
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
