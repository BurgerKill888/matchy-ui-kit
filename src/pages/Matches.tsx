import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, ArrowRight, MessageSquare, Building2, AlertTriangle, Eye, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUserSpace } from "@/contexts/UserSpaceContext";
import EmptyState from "@/components/EmptyState";

const mockMatches = [
  { id: 1, label: "Bureau 350m² Paris 8e", counterpart: "SCI Patrimoine", timer: "2j 14h", timerHours: 62, compatibility: 92, status: "new" as const },
  { id: 2, label: "Immeuble mixte Lyon 6e", counterpart: "Foncière Grand Ouest", timer: "5j 02h", timerHours: 122, compatibility: 85, status: "in_conversation" as const },
  { id: 3, label: "Terrain 2ha Bordeaux", counterpart: "Nexity Régions", timer: "0j 18h", timerHours: 18, compatibility: 78, status: "offer_sent" as const },
  { id: 4, label: "Local commercial Marseille", counterpart: "Cabinet Martin", timer: "0j 00h", timerHours: 0, compatibility: 88, status: "expired" as const },
];

type Status = "new" | "in_conversation" | "offer_sent" | "expired";

const statusConfig: Record<Status, { label: string; variant: "default" | "secondary" | "outline"; ctaLabel: string; ctaIcon: React.ElementType; disabled?: boolean }> = {
  new: { label: "Nouveau", variant: "default", ctaLabel: "Découvrir", ctaIcon: Eye },
  in_conversation: { label: "En conversation", variant: "secondary", ctaLabel: "Converser", ctaIcon: MessageSquare },
  offer_sent: { label: "Offre envoyée", variant: "outline", ctaLabel: "Suivre", ctaIcon: Send },
  expired: { label: "Expiré", variant: "secondary", ctaLabel: "Expiré", ctaIcon: Clock, disabled: true },
};

const pipelineSteps: { key: Status; label: string }[] = [
  { key: "new", label: "Nouveau" },
  { key: "in_conversation", label: "En conversation" },
  { key: "offer_sent", label: "Offre envoyée" },
  { key: "expired", label: "Expiré" },
];

function getTimerStyle(hours: number) {
  if (hours <= 0) return "text-muted-foreground";
  if (hours < 24) return "text-destructive";
  if (hours < 48) return "text-warning";
  return "text-muted-foreground";
}

export default function Matches() {
  const { isVendeur, isAcquereur } = useUserSpace();
  const [filter, setFilter] = useState<Status | "all">("all");

  const counts = pipelineSteps.reduce((acc, s) => {
    acc[s.key] = mockMatches.filter((m) => m.status === s.key).length;
    return acc;
  }, {} as Record<Status, number>);

  const filtered = filter === "all" ? mockMatches : mockMatches.filter((m) => m.status === filter);
  const active = filtered.filter((m) => m.status !== "expired");
  const expired = filtered.filter((m) => m.status === "expired");

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl space-y-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Mes mises en relation en cours</h1>
          <p className="text-muted-foreground mt-1">
            {isVendeur
              ? "Suivez vos échanges avec les acquéreurs intéressés"
              : "Suivez vos échanges avec les vendeurs compatibles"}
          </p>
        </div>

        {/* Pipeline */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              filter === "all" ? "bg-primary text-primary-foreground border-primary glow-gold" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            Tous ({mockMatches.length})
          </button>
          {pipelineSteps.map((step) => (
            <button
              key={step.key}
              onClick={() => setFilter(step.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                filter === step.key
                  ? step.key === "expired"
                    ? "bg-muted text-muted-foreground border-border"
                    : "bg-primary text-primary-foreground border-primary glow-gold"
                  : step.key === "expired"
                  ? "border-border text-muted-foreground/50 hover:text-muted-foreground"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }`}
            >
              {step.label} ({counts[step.key]})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Aucune mise en relation pour le moment"
            subtitle={isVendeur
              ? "Vos annonces sont en ligne, les matches arriveront bientôt."
              : "Complétez vos fiches de recherche ou découvrez de nouvelles opportunités."}
            ctaLabel={isAcquereur ? "Découvrir" : undefined}
            ctaHref={isAcquereur ? "/discovery" : undefined}
          />
        ) : (
          <>
            {/* Active */}
            <div className="space-y-3">
              {active.map((match, i) => {
                const st = statusConfig[match.status];
                const timerColor = getTimerStyle(match.timerHours);
                return (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-xl p-5 hover:border-primary/30 hover:shadow-card transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Building2 className="text-primary" size={24} />
                          {match.status === "new" && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary glow-gold" />
                          )}
                        </div>
                        <div>
                          <p className="font-display font-semibold">{match.label}</p>
                          <p className="text-sm text-muted-foreground">{match.counterpart}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className={`text-xs flex items-center gap-1 font-medium ${timerColor}`}>
                              {match.timerHours > 0 && match.timerHours < 24 && <AlertTriangle size={10} />}
                              <Clock size={11} /> {match.timer}
                            </span>
                            <span className="text-xs font-bold text-primary">{match.compatibility}%</span>
                            <Badge variant={st.variant} className="text-[10px] h-5">
                              {st.label}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons — for acquéreur, show both "Converser" + "Voir l'annonce" */}
                      <div className="flex items-center gap-2 shrink-0">
                        {isAcquereur && (
                          <Link to={`/listings/${match.id}`}>
                            <Button size="sm" variant="outline" className="text-xs transition-transform duration-200 hover:scale-[1.02]">
                              Voir l'annonce
                            </Button>
                          </Link>
                        )}
                        <Link to="/messaging">
                          <Button
                            size="sm"
                            className={`transition-transform duration-200 hover:scale-[1.02] ${match.status === "new" ? "glow-gold" : ""}`}
                            variant={match.status === "new" ? "default" : "outline"}
                          >
                            <MessageSquare size={13} className="mr-1" />
                            Converser
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Expired */}
            {expired.length > 0 && (
              <div>
                <h2 className="font-display text-lg font-semibold mb-3 text-muted-foreground">Expirés</h2>
                <div className="space-y-2">
                  {expired.map((match) => (
                    <div key={match.id} className="glass-card rounded-xl p-4 flex items-center justify-between opacity-50">
                      <div className="flex items-center gap-3">
                        <Heart className="text-muted-foreground" size={18} />
                        <div>
                          <p className="font-medium text-sm">{match.label}</p>
                          <p className="text-xs text-muted-foreground">{match.counterpart}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="secondary" disabled className="text-xs">Expiré</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
