import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building2, Briefcase, Landmark, Home, Shield, Scale, TrendingUp, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";

const profiles = [
  { id: "agent", label: "Agent immobilier", desc: "Transaction pour compte de tiers", icon: Briefcase, nace: "68.31" },
  { id: "marchand", label: "Marchand de biens", desc: "Achat-revente et création de valeur", icon: TrendingUp, nace: "68.10" },
  { id: "promoteur", label: "Promoteur immobilier", desc: "Développement foncier et VEFA", icon: Building2, nace: "41.10" },
  { id: "fonciere", label: "Foncière", desc: "Détention long terme et arbitrage", icon: Home, nace: "68.20" },
  { id: "investisseur", label: "Investisseur (SCI/Holding)", desc: "Investissement structuré", icon: PiggyBank, nace: "68.20" },
  { id: "banque", label: "Banque / Établissement financier", desc: "Financement et structuration", icon: Landmark, nace: "64.19" },
  { id: "assureur", label: "Assureur / Société de gestion", desc: "SCPI, OPCI, fonds immobiliers", icon: Shield, nace: "65.12" },
  { id: "notaire", label: "Notaire", desc: "Cessions et dossiers sensibles", icon: Scale, nace: "69.10Z" },
];

interface ProfileSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (profileId: string) => void;
}

export default function ProfileSelectionModal({ open, onOpenChange, onSelect }: ProfileSelectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-center">Choisissez votre profil professionnel</DialogTitle>
          <p className="text-sm text-muted-foreground text-center mt-1">
            Tous les profils peuvent acheter et vendre, sous réserve des rôles et justificatifs.
          </p>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {profiles.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelect(p.id)}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-secondary/50 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <p.icon className="text-primary" size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{p.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                <p className="text-xs text-primary/60 mt-1">NACE : {p.nace}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
