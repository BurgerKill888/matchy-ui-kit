import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, AlertTriangle, Settings } from "lucide-react";
import { Link } from "react-router-dom";

// --- Types ---
interface TimerMatchInfo {
  property: string;
  surface: string;
  price: string;
  condition: string;
  counterpart: string;
  counterpartRole: string;
  matchDate: string;
}

// =====================
// 1. MATCH BIENTÔT EXPIRÉ
// =====================
interface MatchExpiringModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: TimerMatchInfo;
  hoursLeft: number;
  minutesLeft: number;
  onAccept: () => void;
  onDecline: () => void;
}

export function MatchExpiringModal({ open, onOpenChange, match, hoursLeft, minutesLeft, onAccept, onDecline }: MatchExpiringModalProps) {
  const h = String(hoursLeft).padStart(2, "0");
  const m = String(minutesLeft).padStart(2, "0");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center pt-8 pb-2 text-center">
          <span className="text-5xl mb-3">🚨</span>
          <h2 className="font-display text-xl font-bold text-destructive">Match bientôt expiré !</h2>
          <p className="text-sm text-muted-foreground mt-1">Répondez avant l'expiration pour ne pas manquer cette opportunité.</p>
        </div>

        <div className="w-full px-6 pb-6 space-y-4">
          {/* Property card */}
          <div className="border border-border rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{match.property}</p>
              <p className="text-xs text-muted-foreground">{match.surface} · {match.price} · {match.condition}</p>
            </div>
          </div>

          {/* Counterpart card */}
          <div className="border border-border rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 font-bold text-sm text-muted-foreground">
              {match.counterpart.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{match.counterpart}</p>
              <p className="text-xs text-muted-foreground">{match.counterpartRole}</p>
              <p className="text-xs text-muted-foreground">Match du {match.matchDate}</p>
            </div>
          </div>

          {/* Timer */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-1.5">
              <AlertTriangle size={14} className="text-destructive" />
              <span className="text-xs font-bold text-destructive uppercase tracking-wide">Expiration imminente</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2 text-center">
                <span className="font-display text-2xl font-bold text-destructive">{h}</span>
                <p className="text-[10px] text-destructive/70">heures</p>
              </div>
              <span className="text-xl font-bold text-muted-foreground">:</span>
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-2 text-center">
                <span className="font-display text-2xl font-bold text-destructive">{m}</span>
                <p className="text-[10px] text-destructive/70">min</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2.5 rounded-xl bg-destructive/5 border border-destructive/20 p-3 text-xs text-foreground leading-relaxed">
            <span className="shrink-0">🚨</span>
            <span>Ce match expire dans moins de <strong>{hoursLeft} heures</strong>. Sans réponse, il sera définitivement supprimé et vous ne pourrez plus contacter cet acquéreur pour ce bien.</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1 h-11" onClick={onDecline}>
              Décliner
            </Button>
            <Button className="flex-1 h-11 glow-gold bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onAccept}>
              Accepter & contacter maintenant
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// =====================
// 2. MATCH EXPIRÉ
// =====================
interface MatchExpiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: TimerMatchInfo;
  expiryDate: string;
  stats: { active: number; expired: number; accepted: number };
  onReturn: () => void;
}

export function MatchExpiredModal({ open, onOpenChange, match, expiryDate, stats, onReturn }: MatchExpiredModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center pt-8 pb-2 text-center">
          <span className="text-5xl mb-3">⏳</span>
          <h2 className="font-display text-xl font-bold text-destructive">Match expiré</h2>
          <p className="text-sm text-muted-foreground mt-1">Vous n'avez pas répondu dans le délai imparti.</p>
        </div>

        <div className="w-full px-6 pb-6 space-y-4">
          {/* Property card */}
          <div className="border border-border rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <MapPin size={16} className="text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{match.property}</p>
              <p className="text-xs text-muted-foreground">{match.surface} · {match.price} · {match.condition}</p>
            </div>
          </div>

          {/* Counterpart card */}
          <div className="border border-border rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 font-bold text-sm text-muted-foreground">
              {match.counterpart.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{match.counterpart}</p>
              <p className="text-xs text-muted-foreground">{match.counterpartRole}</p>
              <p className="text-xs text-muted-foreground">Match expiré le {expiryDate}</p>
            </div>
          </div>

          {/* Danger box */}
          <div className="flex items-start gap-2.5 rounded-xl bg-destructive/5 border border-destructive/20 p-3 text-xs text-foreground leading-relaxed">
            <span className="shrink-0">🚨</span>
            <span>Le délai de 48h est écoulé. Ce match a été automatiquement supprimé. <strong>La mise en relation n'est plus possible</strong> pour ce bien.</span>
          </div>

          {/* Info tip */}
          <div className="flex items-start gap-2.5 rounded-xl bg-secondary/60 border border-border p-3 text-xs text-muted-foreground leading-relaxed">
            <span className="shrink-0">💡</span>
            <span>Pour éviter de manquer vos prochains matchs, activez les notifications push et email dans vos <Link to="/settings" className="font-semibold text-foreground underline underline-offset-2" onClick={() => onOpenChange(false)}>Paramètres</Link>.</span>
          </div>

          {/* Stats */}
          <div className="border border-border rounded-xl p-4 text-center space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Statistiques</p>
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-xl font-bold text-foreground">{stats.active}</p>
                <p className="text-[10px] text-muted-foreground">matchs actifs</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-destructive">{stats.expired}</p>
                <p className="text-[10px] text-muted-foreground">expiré</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{stats.accepted}</p>
                <p className="text-[10px] text-muted-foreground">acceptés</p>
              </div>
            </div>
          </div>

          {/* Return button */}
          <Button className="w-full h-11" onClick={onReturn}>
            Retour à mes matchs
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
