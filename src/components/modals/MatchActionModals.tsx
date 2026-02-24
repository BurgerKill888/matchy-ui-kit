import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  CheckSquare, XCircle, Clock, MapPin, Ruler, AlertTriangle,
  MessageSquare, Send, Lock,
} from "lucide-react";

// --- Types ---
interface MatchInfo {
  property: string;
  surface: string;
  price: string;
  condition: string;
  counterpart: string;
  counterpartRole: string;
  counterpartBudget?: string;
  compatibility: number;
  timerHours: number;
  timerMinutes: number;
  criteria: { label: string; compatible: boolean }[];
}

// =====================
// 1. NEW MATCH MODAL
// =====================
interface NewMatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: MatchInfo;
  onAccept: () => void;
  onDecline: () => void;
}

export function NewMatchModal({ open, onOpenChange, match, onAccept, onDecline }: NewMatchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="flex flex-col items-center"
        >
          {/* Header icon */}
          <div className="pt-8 pb-2 flex flex-col items-center">
            <span className="text-5xl mb-3">🎯</span>
            <h2 className="font-display text-2xl font-bold text-foreground">Nouveau match !</h2>
            <p className="text-sm text-muted-foreground mt-1">Un acquéreur correspond à votre bien.</p>
          </div>

          <div className="w-full px-6 pb-6 space-y-4">
            {/* Property card */}
            <div className="border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{match.property}</p>
                <p className="text-xs text-muted-foreground">
                  {match.surface} · {match.price} · {match.condition}
                </p>
              </div>
            </div>

            {/* Lightning separator */}
            <div className="flex justify-center">
              <span className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-lg">⚡</span>
            </div>

            {/* Buyer card */}
            <div className="border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 font-bold text-sm text-muted-foreground">
                {match.counterpart.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{match.counterpart}</p>
                <p className="text-xs text-muted-foreground">{match.counterpartRole}</p>
                {match.counterpartBudget && (
                  <p className="text-xs text-muted-foreground">Budget : {match.counterpartBudget}</p>
                )}
              </div>
            </div>

            {/* Compatibility score */}
            <div className="border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Score de compatibilité</span>
                <span className="text-xl font-bold text-primary">{match.compatibility}%</span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${match.compatibility}%` }}
                  transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="space-y-1.5">
                {match.criteria.map((c) => (
                  <div key={c.label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{c.label}</span>
                    {c.compatible ? (
                      <span className="flex items-center gap-1 text-primary font-medium">
                        <CheckSquare size={12} /> Compatible
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-destructive font-medium">
                        <XCircle size={12} /> Hors critère
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">Temps restant pour répondre</p>
              <div className="flex items-center justify-center gap-2">
                <div className="bg-secondary rounded-lg px-4 py-2 text-center">
                  <span className="font-display text-2xl font-bold text-foreground">{match.timerHours}</span>
                  <p className="text-[10px] text-muted-foreground">heures</p>
                </div>
                <span className="text-xl font-bold text-muted-foreground">:</span>
                <div className="bg-secondary rounded-lg px-4 py-2 text-center">
                  <span className="font-display text-2xl font-bold text-foreground">{match.timerMinutes}</span>
                  <p className="text-[10px] text-muted-foreground">min</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mt-1">
                <Clock size={11} />
                <span>Vous avez <strong className="text-foreground">48h</strong> pour accepter ou décliner ce match. Sans réponse, le match expirera.</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 h-11"
                onClick={onDecline}
              >
                Décliner
              </Button>
              <Button
                className="flex-1 h-11 glow-gold bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={onAccept}
              >
                Accepter & contacter
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// =====================
// 2. START CONVERSATION MODAL
// =====================
interface StartConversationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: MatchInfo;
  onSend: (message: string) => void;
}

const messageSuggestions = [
  { icon: "🤝", label: "Demander les conditions de vente détaillées" },
  { icon: "📅", label: "Proposer un créneau de visite" },
  { icon: "📁", label: "Demander l'accès à la Data Room" },
];

export function StartConversationModal({ open, onOpenChange, match, onSend }: StartConversationModalProps) {
  const [msg, setMsg] = useState(
    `Bonjour, nous avons matché sur votre bien ${match.property}. Je souhaiterais en savoir plus sur les conditions de vente et la disponibilité pour une visite...`
  );

  function applySuggestion(label: string) {
    if (label.includes("conditions")) {
      setMsg(`Bonjour, nous avons matché sur votre bien ${match.property}. Pourriez-vous me communiquer les conditions de vente détaillées ?`);
    } else if (label.includes("visite")) {
      setMsg(`Bonjour, nous avons matché sur votre bien ${match.property}. Seriez-vous disponible pour organiser une visite ?`);
    } else if (label.includes("Data Room")) {
      setMsg(`Bonjour, nous avons matché sur votre bien ${match.property}. Serait-il possible d'accéder à la Data Room pour consulter les documents ?`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center">
          {/* Header */}
          <div className="pt-8 pb-2 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
              <MessageSquare size={24} className="text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">Démarrer la conversation</h2>
            <p className="text-sm text-muted-foreground mt-1 text-center px-4">
              Envoyez un premier message pour engager l'échange.
            </p>
          </div>

          <div className="w-full px-6 pb-6 space-y-4">
            {/* Property card */}
            <div className="border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{match.property}</p>
                <p className="text-xs text-muted-foreground">
                  {match.surface} · {match.price} · {match.condition}
                </p>
              </div>
            </div>

            {/* Buyer card */}
            <div className="border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 font-bold text-sm text-muted-foreground">
                {match.counterpart.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{match.counterpart}</p>
                <p className="text-xs text-muted-foreground">{match.counterpartRole}</p>
              </div>
            </div>

            {/* Message area */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Votre message</label>
              <Textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={4}
                className="bg-secondary border-border resize-none text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Un premier message personnalisé augmente vos chances d'obtenir une réponse rapide.
              </p>
            </div>

            {/* Suggestions */}
            <div className="border border-primary/20 rounded-xl p-3 bg-primary/5 space-y-2">
              <p className="text-xs font-semibold text-foreground">Suggestions de premier message :</p>
              {messageSuggestions.map((s) => (
                <button
                  key={s.label}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-sm text-foreground"
                  onClick={() => applySuggestion(s.label)}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Privacy notice */}
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Lock size={12} className="shrink-0 mt-0.5" />
              <span>Vos coordonnées personnelles restent confidentielles. Toute communication passe par la messagerie Matchstone.</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1 h-11" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button
                className="flex-1 h-11 glow-gold bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => onSend(msg)}
                disabled={!msg.trim()}
              >
                Envoyer le message
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// =====================
// 3. DECLINE MATCH MODAL
// =====================
interface DeclineMatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match: MatchInfo;
  onConfirmDecline: (reason: string) => void;
}

export function DeclineMatchModal({ open, onOpenChange, match, onConfirmDecline }: DeclineMatchModalProps) {
  const [reason, setReason] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center">
          {/* Header */}
          <div className="pt-8 pb-2 flex flex-col items-center">
            <span className="text-5xl mb-3">👎</span>
            <h2 className="font-display text-xl font-bold text-foreground">Décliner ce match ?</h2>
            <p className="text-sm text-muted-foreground mt-1 text-center px-4">
              Cette action est définitive. Le match sera supprimé.
            </p>
          </div>

          <div className="w-full px-6 pb-6 space-y-4">
            {/* Property card */}
            <div className="border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{match.property}</p>
                <p className="text-xs text-muted-foreground">
                  {match.surface} · {match.price} · {match.condition}
                </p>
              </div>
            </div>

            {/* Buyer card */}
            <div className="border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 font-bold text-sm text-muted-foreground">
                {match.counterpart.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{match.counterpart}</p>
                <p className="text-xs text-muted-foreground">{match.counterpartRole}</p>
              </div>
            </div>

            {/* Warning */}
            <div className="border border-primary/30 bg-primary/5 rounded-xl p-3 flex items-start gap-2.5">
              <AlertTriangle size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-foreground">
                En déclinant, vous ne pourrez plus être mis en relation avec cet acquéreur pour ce bien spécifique.
              </p>
            </div>

            {/* Reason */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Raison du refus</label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="Facultatif. Votre retour nous aide à améliorer la qualité des matchs..."
                className="bg-secondary border-border resize-none text-sm"
              />
              <p className="text-[11px] text-muted-foreground">Non visible par l'autre partie.</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-1">
              <Button variant="outline" className="flex-1 h-11" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-11"
                onClick={() => onConfirmDecline(reason)}
              >
                Décliner ce match
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
