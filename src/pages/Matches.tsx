import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Sparkles, ArrowRight, MessageSquare, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const mockMatches = [
  { id: 1, label: "Bureau 350m² Paris 8e", owner: "SCI Patrimoine", timer: "2j 14h", compatibility: 92, status: "new" as const },
  { id: 2, label: "Immeuble mixte Lyon 6e", owner: "Foncière Grand Ouest", timer: "5j 02h", compatibility: 85, status: "in_conversation" as const },
  { id: 3, label: "Terrain 2ha Bordeaux", owner: "Nexity Régions", timer: "1j 08h", compatibility: 78, status: "new" as const },
  { id: 4, label: "Local commercial Marseille", owner: "Cabinet Martin", timer: "3j 20h", compatibility: 88, status: "expired" as const },
];

export default function Matches() {
  const active = mockMatches.filter(m => m.status !== "expired");
  const expired = mockMatches.filter(m => m.status === "expired");

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Mes matches</h1>
          <p className="text-muted-foreground mt-1">{active.length} match{active.length > 1 ? "es" : ""} actif{active.length > 1 ? "s" : ""}</p>
        </div>

        {/* Active */}
        <div className="space-y-3">
          {active.map((match, i) => (
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
                  <p className="text-sm text-muted-foreground">{match.owner}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={11} /> Timer : {match.timer}
                    </span>
                    <span className="text-xs font-bold text-primary">{match.compatibility}% compatible</span>
                    {match.status === "in_conversation" && (
                      <Badge variant="secondary" className="text-[10px] h-5">
                        <MessageSquare size={10} className="mr-1" /> En cours
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Link to={match.status === "in_conversation" ? "/messaging" : `/listings/${match.id}`}>
                <Button size="sm" className={match.status === "new" ? "glow-gold" : ""} variant={match.status === "new" ? "default" : "outline"}>
                  {match.status === "new" ? "Découvrir" : "Converser"} <ArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Expired */}
        {expired.length > 0 && (
          <div>
            <h2 className="font-display text-lg font-semibold mb-3 text-muted-foreground">Expirés</h2>
            <div className="space-y-2">
              {expired.map((match) => (
                <div key={match.id} className="glass-card rounded-xl p-4 flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-muted-foreground" size={18} />
                    <div>
                      <p className="font-medium text-sm">{match.label}</p>
                      <p className="text-xs text-muted-foreground">{match.owner}</p>
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
