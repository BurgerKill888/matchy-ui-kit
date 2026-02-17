import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface CompatibilityDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number;
  title: string;
}

const mockCriteria = [
  { label: "Typologie", detail: "correspond (Logistique / Entrepôt)", status: "match" as const },
  { label: "Surface", detail: "5 000m² dans la fourchette (3 000 – 8 000m²)", status: "match" as const },
  { label: "Zone", detail: "Roissy CDG dans le rayon de 20km", status: "match" as const },
  { label: "Budget", detail: "4 200 000€ — au-dessus du budget max (3 500 000€)", status: "warning" as const },
  { label: "État du bien", detail: 'Classe A — vous recherchez "À rénover"', status: "mismatch" as const },
];

const statusConfig = {
  match: { icon: CheckCircle2, color: "text-success", label: "✅" },
  warning: { icon: AlertTriangle, color: "text-warning", label: "⚠️" },
  mismatch: { icon: XCircle, color: "text-destructive", label: "❌" },
};

export default function CompatibilityDetailModal({ open, onOpenChange, score, title }: CompatibilityDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">
            Détail de compatibilité — <span className="text-primary">{score}%</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground">{title}</p>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          {mockCriteria.map((c) => {
            const conf = statusConfig[c.status];
            return (
              <div key={c.label} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                <conf.icon size={16} className={`${conf.color} mt-0.5 shrink-0`} />
                <div>
                  <p className="text-sm font-medium">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
