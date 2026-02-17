import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Heart, FileText, Eye, ArrowRight, Search, MessageSquare, TrendingUp, Compass } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserSpace } from "@/contexts/UserSpaceContext";

// --- Mock Data ---
const vendeurMatches = [
  { id: 1, label: "Bureau 350m² Paris 8e", owner: "SCI Patrimoine", timer: "2j 14h", compatibility: 92, status: "new" as const },
  { id: 2, label: "Immeuble mixte Lyon 6e", owner: "Foncière Grand Ouest", timer: "5j 02h", compatibility: 85, status: "in_conversation" as const },
  { id: 3, label: "Terrain 2ha Bordeaux", owner: "Nexity Régions", timer: "1j 08h", compatibility: 78, status: "new" as const },
];

const vendeurAnnonces = [
  { id: 1, title: "Bureau 350m² Paris 8e", status: "active" as const, views: 24, matches: 3 },
  { id: 2, title: "Local commercial Marseille", status: "active" as const, views: 12, matches: 1 },
  { id: 3, title: "Immeuble de rapport Lille", status: "draft" as const, views: 0, matches: 0 },
];

const acquereurMatches = [
  { id: 1, label: "Bureau 350m² Paris 8e", owner: "SCI Patrimoine", timer: "2j 14h", compatibility: 92, status: "new" as const },
  { id: 2, label: "Immeuble mixte Lyon 6e", owner: "Foncière Grand Ouest", timer: "5j 02h", compatibility: 85, status: "in_conversation" as const },
];

const acquereurFiches = [
  { id: 1, title: "Bureaux 200-500m² Paris", status: "active" as const, matches: 3, budget: "800K - 1.5M€" },
  { id: 2, title: "Local commercial Bordeaux centre", status: "active" as const, matches: 1, budget: "200K - 500K€" },
  { id: 3, title: "Entrepôt logistique IDF", status: "draft" as const, matches: 0, budget: "1M - 3M€" },
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
      className="glass-card rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={color} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="font-display text-2xl font-bold">{value}</p>
    </motion.div>
  );
}

// --- Match Card ---
function MatchCard({ match, index }: { match: typeof vendeurMatches[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass-card rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 transition-colors"
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
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock size={10} /> {match.timer}
            </span>
            <span className="text-xs font-semibold text-primary">{match.compatibility}%</span>
            {match.status === "in_conversation" && (
              <Badge variant="secondary" className="text-[10px] h-5">En conversation</Badge>
            )}
          </div>
        </div>
      </div>
      <Link to="/messaging">
        <Button size="sm" variant={match.status === "new" ? "default" : "outline"} className={match.status === "new" ? "glow-gold" : ""}>
          Voir <ArrowRight size={14} className="ml-1" />
        </Button>
      </Link>
    </motion.div>
  );
}

// --- Dashboard Vendeur ---
function VendeurDashboard() {
  const kpis = [
    { label: "Annonces actives", value: String(vendeurAnnonces.filter(a => a.status === "active").length), icon: FileText, color: "text-primary" },
    { label: "Vues reçues", value: "54", icon: Eye, color: "text-info" },
    { label: "Matches en cours", value: String(vendeurMatches.length), icon: Heart, color: "text-primary" },
    { label: "Taux de match", value: "28%", icon: TrendingUp, color: "text-success" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Espace Vendeur</h1>
          <p className="text-muted-foreground mt-1">Bienvenue dans votre espace vendeur Matchstone</p>
        </div>
        <Link to="/listings/create">
          <Button className="glow-gold">
            <Plus size={16} className="mr-2" /> Publier une annonce
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => <KpiCard key={k.label} {...k} delay={i * 0.05} />)}
      </div>

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="matches" className="gap-1.5"><Heart size={14} /> Matches</TabsTrigger>
          <TabsTrigger value="annonces" className="gap-1.5"><FileText size={14} /> Mes annonces</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-3">
          {vendeurMatches.length === 0 ? (
            <EmptyState icon={Heart} message="Pas encore de matches" ctaLabel="Publier une annonce" ctaHref="/listings/create" />
          ) : (
            vendeurMatches.map((m, i) => <MatchCard key={m.id} match={m} index={i} />)
          )}
        </TabsContent>

        <TabsContent value="annonces" className="space-y-3">
          {vendeurAnnonces.map((annonce, i) => (
            <motion.div
              key={annonce.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm">{annonce.title}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <Badge variant={annonce.status === "active" ? "default" : "secondary"} className="text-xs">
                    {annonce.status === "active" ? "Active" : "Brouillon"}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye size={12} /> {annonce.views}</span>
                  <span className="text-xs text-primary flex items-center gap-1"><Heart size={12} /> {annonce.matches}</span>
                </div>
              </div>
              <Link to={`/listings/${annonce.id}`}>
                <Button size="sm" variant="outline">Gérer</Button>
              </Link>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- Dashboard Acquéreur ---
function AcquereurDashboard() {
  const kpis = [
    { label: "Fiches actives", value: String(acquereurFiches.filter(f => f.status === "active").length), icon: FileText, color: "text-primary" },
    { label: "Opportunités découvertes", value: "18", icon: Search, color: "text-info" },
    { label: "Matches en cours", value: String(acquereurMatches.length), icon: Heart, color: "text-primary" },
    { label: "Taux de match", value: "35%", icon: TrendingUp, color: "text-success" },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Espace Acquéreur</h1>
          <p className="text-muted-foreground mt-1">Bienvenue dans votre espace acquéreur Matchstone</p>
        </div>
        <div className="flex gap-2">
          <Link to="/discovery">
            <Button className="glow-gold">
              <Compass size={16} className="mr-2" /> Découvrir
            </Button>
          </Link>
          <Link to="/criteria/create">
            <Button variant="outline">
              <Plus size={16} className="mr-2" /> Nouvelle fiche
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((k, i) => <KpiCard key={k.label} {...k} delay={i * 0.05} />)}
      </div>

      <Tabs defaultValue="matches" className="space-y-6">
        <TabsList className="bg-secondary border border-border">
          <TabsTrigger value="matches" className="gap-1.5"><Heart size={14} /> Matches</TabsTrigger>
          <TabsTrigger value="fiches" className="gap-1.5"><FileText size={14} /> Mes fiches</TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-3">
          {acquereurMatches.length === 0 ? (
            <EmptyState icon={Heart} message="Pas encore de matches" ctaLabel="Découvrir" ctaHref="/discovery" />
          ) : (
            acquereurMatches.map((m, i) => <MatchCard key={m.id} match={m} index={i} />)
          )}
        </TabsContent>

        <TabsContent value="fiches" className="space-y-3">
          {acquereurFiches.map((fiche, i) => (
            <motion.div
              key={fiche.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
            >
              <div>
                <p className="font-semibold text-sm">{fiche.title}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <Badge variant={fiche.status === "active" ? "default" : "secondary"} className="text-xs">
                    {fiche.status === "active" ? "Active" : "Brouillon"}
                  </Badge>
                  <span className="text-xs text-primary flex items-center gap-1"><Heart size={12} /> {fiche.matches}</span>
                  <span className="text-xs text-muted-foreground">{fiche.budget}</span>
                </div>
              </div>
              <Link to={`/criteria/${fiche.id}`}>
                <Button size="sm" variant="outline">Modifier</Button>
              </Link>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// --- Empty State ---
function EmptyState({ icon: Icon, message, ctaLabel, ctaHref }: {
  icon: React.ElementType; message: string; ctaLabel: string; ctaHref: string;
}) {
  return (
    <div className="text-center py-12">
      <Icon className="text-muted-foreground mx-auto mb-3" size={40} />
      <p className="text-muted-foreground">{message}</p>
      <Link to={ctaHref}>
        <Button className="mt-4 glow-gold">{ctaLabel}</Button>
      </Link>
    </div>
  );
}

// --- Main Dashboard ---
export default function Dashboard() {
  const { isVendeur } = useUserSpace();
  return (
    <AppLayout>
      {isVendeur ? <VendeurDashboard /> : <AcquereurDashboard />}
    </AppLayout>
  );
}
