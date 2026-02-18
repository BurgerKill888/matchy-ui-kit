import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plus, Clock, Heart, FileText, Eye, ArrowRight, Search,
  Compass, AlertTriangle, TrendingUp, Percent, Star
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUserSpace } from "@/contexts/UserSpaceContext";

// --- Mock Data ---
const vendeurMatches = [
  { id: 1, label: "Bureau 350m² Paris 8e", owner: "SCI Patrimoine", timer: "2j 14h", timerHours: 62, compatibility: 32, status: "new" as const, premium: false },
  { id: 2, label: "Immeuble mixte Lyon 6e", owner: "Foncière Grand Ouest", timer: "5j 629", timerHours: 122, compatibility: 85, status: "in_conversation" as const, premium: false },
  { id: 3, label: "Terrain 2ha Bordeaux", owner: "Nexity Régions", timer: "5 · 19h", timerHours: 19, compatibility: 78, status: "new" as const, premium: true },
];

const acquereurMatches = [
  { id: 1, label: "Bureau 350m² Paris 8e", owner: "SCI Patrimoine", timer: "2j 14h", timerHours: 62, compatibility: 92, status: "new" as const, premium: false },
  { id: 2, label: "Immeuble mixte Lyon 6e", owner: "Foncière Grand Ouest", timer: "0j 06h", timerHours: 6, compatibility: 85, status: "in_conversation" as const, premium: false },
];

// --- KPI Card ---
function KpiCard({ label, value, icon: Icon, trend, delay }: {
  label: string; value: string; icon: React.ElementType; trend: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-xl p-4 space-y-2"
    >
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="font-display text-3xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-primary flex items-center gap-1">
        <ArrowRight size={10} /> {trend}
      </p>
    </motion.div>
  );
}

// --- Timer color helper ---
function getTimerColor(hours: number) {
  if (hours < 24) return "text-destructive";
  return "text-muted-foreground";
}

// --- Match Card ---
function MatchCard({ match, index }: { match: typeof vendeurMatches[0]; index: number }) {
  const timerColor = getTimerColor(match.timerHours);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card rounded-xl p-4 flex items-center justify-between group hover:border-white/20 transition-all duration-200"
    >
      {/* Left: icon + info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center shrink-0">
          <Heart size={16} className="text-primary" />
          {match.status === "new" && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{match.label}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-xs text-muted-foreground">{match.owner}</p>
            {match.status === "in_conversation" && (
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 border-white/20 text-muted-foreground">
                en conversation
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Right: timer + progress + % + button */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <div className="flex items-center gap-1.5 text-xs whitespace-nowrap">
          {match.premium ? <Star size={11} className="text-primary" /> : <Clock size={11} className="text-muted-foreground" />}
          {match.timerHours < 24 && <AlertTriangle size={11} className="text-destructive" />}
          <span className={timerColor}>{match.timer}</span>
        </div>
        <div className="w-20 hidden sm:flex items-center gap-2">
          <Progress value={match.compatibility} className="h-1.5 flex-1" />
        </div>
        <span className="text-xs text-muted-foreground w-8 text-right">{match.compatibility}%</span>
        <Link to="/messaging">
          <Button size="sm" className="text-xs px-3 h-8 glow-gold">
            Voir <ArrowRight size={12} className="ml-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// --- Dashboard Vendeur ---
function VendeurDashboard() {
  const kpis = [
    { label: "Annonces actives", value: "2", icon: FileText, trend: "→ 1 cette semaine" },
    { label: "Vues reçues", value: "54", icon: Eye, trend: "→ 1 12% cette semaine" },
    { label: "Matchs en cours", value: "3", icon: Heart, trend: "→ 2 cette semaine" },
    { label: "Taux de match", value: "28%", icon: Percent, trend: "→ 1 3% cette semaine" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Espace Vendeur</h1>
          <p className="text-muted-foreground mt-1 text-sm">Bienvenue dans votre espace vendeur Matchstone.</p>
        </div>
        <Link to="/listings/create">
          <Button className="glow-gold font-medium">
            <Plus size={15} className="mr-1.5" /> Publier une annonce
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
    { label: "Fiches actives", value: "2", icon: FileText, trend: "→ 1 cette semaine" },
    { label: "Opportunités", value: "18", icon: Search, trend: "→ +3 cette semaine" },
    { label: "Matchs en cours", value: "2", icon: Heart, trend: "→ 2 cette semaine" },
    { label: "Taux de match", value: "41%", icon: TrendingUp, trend: "→ +5% cette semaine" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Espace Acquéreur</h1>
          <p className="text-muted-foreground mt-1 text-sm">Bienvenue dans votre espace acquéreur Matchstone.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/discovery">
            <Button className="glow-gold font-medium">
              <Compass size={15} className="mr-1.5" /> Découvrir
            </Button>
          </Link>
          <Link to="/criteria/create">
            <Button variant="outline" className="border-white/20 text-foreground hover:bg-white/5">
              <Plus size={15} className="mr-1.5" /> Nouvelle fiche
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
