import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Heart, ArrowRight, MessageSquare, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUserSpace } from "@/contexts/UserSpaceContext";

const mockMatches = [
  { id: 1, label: "Bureau 350m² Paris 8e", counterpart: "SCI Patrimoine", timer: "2j 14h", compatibility: 92, status: "new" as const },
  { id: 2, label: "Immeuble mixte Lyon 6e", counterpart: "Foncière Grand Ouest", timer: "5j 02h", compatibility: 85, status: "in_conversation" as const },
  { id: 3, label: "Terrain 2ha Bordeaux", counterpart: "Nexity Régions", timer: "1j 08h", compatibility: 78, status: "offer_sent" as const },
  { id: 4, label: "Local commercial Marseille", counterpart: "Cabinet Martin", timer: "0j 00h", compatibility: 88, status: "expired" as const },
];

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
  new: { label: "Nouveau", variant: "default" },
  in_conversation: { label: "En conversation", variant: "secondary" },
  offer_sent: { label: "Offre envoyée", variant: "outline" },
  expired: { label: "Expiré", variant: "secondary" },
};

export default function Matches() {
  const { isVendeur } = useUserSpace();
  const active = mockMatches.filter(m => m.status !== "expired");
  const expired = mockMatches.filter(m => m.status === "expired");

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Mes mises en relation en cours</h1>
          <p className="text-muted-foreground mt-1">
            {isVendeur
              ? "Suivez vos échanges avec les acquéreurs intéressés"
              : "Suivez vos échanges avec les vendeurs compatibles"}
          </p>
        </div>

        {/* Active */}
        <div className="space-y-3">
          {active.map((match, i) => {
            const st = statusLabels[match.status];
            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-5 flex items-center justify-between hover:border-primary/30 transition-colors"
              >
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
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={11} /> {match.timer}
                      </span>
                      <span className="text-xs font-bold text-primary">{match.compatibility}%</span>
                      <Badge variant={st.variant} className="text-[10px] h-5">
                        {st.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Link to="/messaging">
                  <Button size="sm" className={match.status === "new" ? "glow-gold" : ""} variant={match.status === "new" ? "default" : "outline"}>
                    {match.status === "new" ? "Voir" : "Converser"} <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
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
                  <Badge variant="secondary" className="text-xs">Expiré</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
