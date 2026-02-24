import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  FolderOpen, CheckCircle, XCircle, Clock, Send, ShieldCheck,
  FileText, Info, AlertTriangle, ArrowLeft, Building2,
} from "lucide-react";

/* ========== Shared sub-components ========== */

const BienCard = () => (
  <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3 mb-4">
    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
      <Building2 className="text-muted-foreground" size={22} />
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold truncate">Bureau 350m² Paris 8e</p>
      <p className="text-xs text-muted-foreground">350 m² · 2 800 000 € · SCI Patrimoine</p>
    </div>
  </div>
);

const AcquereurCard = () => (
  <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-3 mb-4">
    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">CM</div>
    <div className="min-w-0">
      <p className="text-sm font-semibold truncate">Cabinet Martin & Associés</p>
      <p className="text-xs text-muted-foreground">Marchand de biens · Paris · Match le 18 fév.</p>
    </div>
  </div>
);

const InfoBanner = ({ icon: Icon = Info, children, variant = "info" }: { icon?: any; children: React.ReactNode; variant?: "info" | "warning" | "success" | "error" }) => {
  const styles = {
    info: "bg-secondary/60 border-border text-muted-foreground",
    warning: "bg-warning/10 border-warning/30 text-warning",
    success: "bg-success/10 border-success/30 text-success",
    error: "bg-destructive/10 border-destructive/30 text-destructive",
  };
  return (
    <div className={`flex items-start gap-2.5 rounded-lg border p-3 mb-3 text-xs leading-relaxed ${styles[variant]}`}>
      <Icon size={14} className="shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: "pending" | "granted" | "refused" }) => {
  const cfg = {
    pending: { icon: Clock, label: "En attente de réponse", className: "bg-warning/10 text-warning border-warning/30" },
    granted: { icon: CheckCircle, label: "Accès accordé", className: "bg-success/10 text-success border-success/30" },
    refused: { icon: XCircle, label: "Accès refusé", className: "bg-destructive/10 text-destructive border-destructive/30" },
  };
  const c = cfg[status];
  return (
    <div className={`flex items-center justify-center gap-2 rounded-lg border p-2.5 mb-4 text-sm font-semibold ${c.className}`}>
      <c.icon size={15} /> {c.label}
    </div>
  );
};

const RadioOption = ({ label, sub, checked, onClick }: { label: string; sub?: string; checked: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick} className={`w-full flex items-center gap-3 rounded-lg border p-3 mb-1.5 text-left transition-colors ${checked ? "border-primary bg-primary/10" : "border-border bg-transparent hover:bg-secondary/40"}`}>
    <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${checked ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
      {checked && <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground mx-auto mt-[3px]" />}
    </div>
    <div>
      <p className={`text-sm ${checked ? "font-semibold" : "font-normal"}`}>{label}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  </button>
);

/* ========== MODAL TYPES ========== */

export type DataRoomModalType =
  | "acq_request" | "acq_sent" | "acq_granted" | "acq_refused"
  | "sell_received" | "sell_grant" | "sell_grant_done"
  | "sell_refuse" | "sell_refuse_confirm" | "sell_refuse_done"
  | null;

interface Props {
  modal: DataRoomModalType;
  onChangeModal: (m: DataRoomModalType) => void;
}

export function DataRoomModals({ modal, onChangeModal }: Props) {
  const [msg, setMsg] = useState("");
  const [motifType, setMotifType] = useState<string | null>(null);
  const [motifDetail, setMotifDetail] = useState("");
  const [showErr, setShowErr] = useState(false);

  const close = () => { onChangeModal(null); setMsg(""); setMotifType(null); setMotifDetail(""); setShowErr(false); };
  const go = (m: DataRoomModalType) => { onChangeModal(m); setShowErr(false); };

  const motifLabels: Record<string, string> = {
    budget: "Budget insuffisant ou non confirmé",
    profil: "Profil non adapté au bien",
    avance: "Négociations avancées avec un autre acquéreur",
    autre: motifDetail || "Autre motif",
  };

  return (
    <>
      {/* ===== 1. ACQUÉREUR — Demander l'accès ===== */}
      <Dialog open={modal === "acq_request"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center items-center">
            <div className="text-4xl mb-2">📂</div>
            <DialogTitle className="font-display text-lg">Demander l'accès à la Data Room</DialogTitle>
            <DialogDescription>Envoyez une demande au vendeur pour consulter les documents confidentiels de ce bien.</DialogDescription>
          </DialogHeader>
          <BienCard />
          <InfoBanner icon={FileText}>La Data Room contient les documents essentiels : plans, diagnostics, titre de propriété, baux en cours, documents juridiques et financiers.</InfoBanner>
          <div className="space-y-1.5 mb-3">
            <Label className="text-xs">Message au vendeur</Label>
            <Textarea placeholder="Ex : Bonjour, nous sommes intéressés par ce bien et souhaiterions consulter les documents disponibles…" value={msg} onChange={(e) => setMsg(e.target.value)} rows={3} />
            <p className="text-[11px] text-muted-foreground">Facultatif mais recommandé. Un message personnalisé augmente vos chances.</p>
          </div>
          <InfoBanner icon={ShieldCheck}>Le vendeur sera notifié. Vos coordonnées restent confidentielles jusqu'à l'autorisation.</InfoBanner>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full" onClick={close}>Annuler</Button>
            <Button className="w-full glow-gold" onClick={() => go("acq_sent")}>Envoyer la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== 2. ACQUÉREUR — Confirmation envoi ===== */}
      <Dialog open={modal === "acq_sent"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center items-center">
            <div className="text-4xl mb-2">✅</div>
            <DialogTitle className="font-display text-lg">Demande envoyée</DialogTitle>
            <DialogDescription>Le vendeur a été notifié de votre demande d'accès à la Data Room.</DialogDescription>
          </DialogHeader>
          <BienCard />
          <StatusBadge status="pending" />
          <InfoBanner icon={Clock}>Le vendeur dispose de <strong>72h</strong> pour répondre. Vous recevrez une notification dès sa décision.</InfoBanner>
          <InfoBanner icon={Info}>En attendant, continuez à échanger via la messagerie.</InfoBanner>
          <Button className="w-full" onClick={close}>Retour à la conversation</Button>
        </DialogContent>
      </Dialog>

      {/* ===== 3. ACQUÉREUR — Accès accordé ===== */}
      <Dialog open={modal === "acq_granted"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center items-center">
            <div className="text-4xl mb-2">🎉</div>
            <DialogTitle className="font-display text-lg">Accès à la Data Room accordé !</DialogTitle>
            <DialogDescription>Le vendeur a accepté votre demande. Consultez les documents confidentiels.</DialogDescription>
          </DialogHeader>
          <BienCard />
          <StatusBadge status="granted" />
          <div className="rounded-lg border border-border bg-secondary/40 p-4 mb-4">
            <p className="text-xs font-semibold mb-2">Documents disponibles</p>
            {["Plans architecturaux (3 fichiers)", "Diagnostics techniques (DPE, amiante, plomb…)", "Titre de propriété", "Baux en cours (2 fichiers)", "Documents financiers"].map((d, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                <FileText size={13} className="text-muted-foreground" />
                <span className="text-xs">{d}</span>
              </div>
            ))}
          </div>
          <InfoBanner icon={AlertTriangle} variant="warning">Documents strictement confidentiels. Toute diffusion non autorisée viole les CGU de Matchstone.</InfoBanner>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full" onClick={close}>Fermer</Button>
            <Button className="w-full glow-gold" onClick={close}>Accéder à la Data Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== 4. ACQUÉREUR — Accès refusé ===== */}
      <Dialog open={modal === "acq_refused"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center items-center">
            <div className="text-4xl mb-2">🚫</div>
            <DialogTitle className="font-display text-lg">Accès à la Data Room refusé</DialogTitle>
            <DialogDescription>Le vendeur a décliné votre demande d'accès aux documents.</DialogDescription>
          </DialogHeader>
          <BienCard />
          <StatusBadge status="refused" />
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 mb-4">
            <p className="text-xs font-semibold text-destructive mb-1">Motif du refus</p>
            <p className="text-xs text-muted-foreground leading-relaxed">Le vendeur souhaite avancer uniquement avec des acquéreurs ayant confirmé un budget supérieur à 2,5M€ avec attestation bancaire.</p>
          </div>
          <InfoBanner icon={Info}>Vous pouvez envoyer un message au vendeur ou renvoyer une demande avec des éléments complémentaires.</InfoBanner>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full" onClick={close}>Fermer</Button>
            <Button className="w-full glow-gold" onClick={() => go("acq_request")}>Renvoyer une demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== 5. VENDEUR — Demande reçue ===== */}
      <Dialog open={modal === "sell_received"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center items-center">
            <div className="text-4xl mb-2">📩</div>
            <DialogTitle className="font-display text-lg">Nouvelle demande d'accès Data Room</DialogTitle>
            <DialogDescription>Un acquéreur souhaite consulter les documents de votre bien.</DialogDescription>
          </DialogHeader>
          <BienCard />
          <AcquereurCard />
          <div className="rounded-lg border border-border bg-secondary/40 p-3 mb-3">
            <p className="text-xs font-semibold mb-1.5">Message de l'acquéreur</p>
            <p className="text-xs text-muted-foreground italic leading-relaxed">"Bonjour, nous sommes intéressés par votre bureau Paris 8e. Nous sommes un cabinet de conseil en expansion et recherchons des locaux de standing. Pourriez-vous nous donner accès aux documents ?"</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/40 p-3 mb-3">
            <p className="text-xs font-semibold mb-2">Compatibilité du match</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[{ l: "Budget", v: "✅ Compatible" }, { l: "Surface", v: "✅ Compatible" }, { l: "Localisation", v: "✅ Zone ciblée" }].map((m) => (
                <div key={m.l}>
                  <p className="text-[10px] text-muted-foreground">{m.l}</p>
                  <p className="text-xs font-semibold text-success">{m.v}</p>
                </div>
              ))}
            </div>
          </div>
          <InfoBanner icon={AlertTriangle} variant="warning">Vous avez <strong>72h</strong> pour répondre. Sans réponse, la demande expirera automatiquement.</InfoBanner>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full" onClick={() => go("sell_refuse")}>Refuser</Button>
            <Button className="w-full glow-gold" onClick={() => go("sell_grant")}>Autoriser l'accès</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== 6. VENDEUR — Confirmer autorisation ===== */}
      <Dialog open={modal === "sell_grant"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center items-center">
            <div className="text-4xl mb-2">✅</div>
            <DialogTitle className="font-display text-lg">Confirmer l'autorisation</DialogTitle>
            <DialogDescription>Vous vous apprêtez à donner accès à vos documents confidentiels.</DialogDescription>
          </DialogHeader>
          <AcquereurCard />
          <InfoBanner icon={AlertTriangle} variant="warning">En autorisant l'accès, <strong>Cabinet Martin & Associés</strong> pourra consulter l'ensemble de vos documents pour ce bien.</InfoBanner>
          <InfoBanner icon={FileText}>Documents partagés : plans, diagnostics, titre de propriété, baux, documents financiers.</InfoBanner>
          <InfoBanner icon={ShieldCheck}>L'acquéreur est soumis à une clause de confidentialité. Tout usage abusif peut être signalé.</InfoBanner>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full" onClick={() => go("sell_received")}>
              <ArrowLeft size={14} className="mr-1.5" /> Retour
            </Button>
            <Button className="w-full glow-gold" onClick={() => go("sell_grant_done")}>Confirmer l'autorisation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== 6b. VENDEUR — Autorisation confirmée ===== */}
      <Dialog open={modal === "sell_grant_done"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center items-center">
            <div className="text-4xl mb-2">🎉</div>
            <DialogTitle className="font-display text-lg">Accès autorisé !</DialogTitle>
            <DialogDescription>L'acquéreur a été notifié et peut désormais consulter votre Data Room.</DialogDescription>
          </DialogHeader>
          <AcquereurCard />
          <InfoBanner icon={CheckCircle} variant="success">Cabinet Martin & Associés a maintenant accès à la Data Room de votre bien Bureau 350m² Paris 8e.</InfoBanner>
          <InfoBanner icon={Info}>Vous pouvez révoquer cet accès à tout moment depuis les paramètres de votre Data Room.</InfoBanner>
          <Button className="w-full" onClick={close}>Retour à la conversation</Button>
        </DialogContent>
      </Dialog>

      {/* ===== 7. VENDEUR — Refuser + motif ===== */}
      <Dialog open={modal === "sell_refuse"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center items-center">
            <div className="text-4xl mb-2">🚫</div>
            <DialogTitle className="font-display text-lg">Refuser la demande d'accès</DialogTitle>
            <DialogDescription>Indiquez la raison de votre refus. L'acquéreur recevra votre motif.</DialogDescription>
          </DialogHeader>
          <AcquereurCard />
          <div className="mb-3">
            <Label className="text-xs mb-2 block">Motif du refus <span className="text-destructive">*</span></Label>
            {[
              { id: "budget", l: "Budget insuffisant ou non confirmé", d: "L'acquéreur n'a pas démontré sa capacité financière" },
              { id: "profil", l: "Profil non adapté au bien", d: "Le type d'acquéreur ne correspond pas à votre cible" },
              { id: "avance", l: "Négociations avancées avec un autre acquéreur", d: "Vous êtes déjà en discussion exclusive" },
              { id: "autre", l: "Autre motif", d: "Précisez votre raison ci-dessous" },
            ].map((r) => (
              <RadioOption key={r.id} label={r.l} sub={r.d} checked={motifType === r.id} onClick={() => setMotifType(r.id)} />
            ))}
            {showErr && !motifType && <p className="text-[11px] text-destructive mt-1">⚠ Veuillez sélectionner un motif de refus.</p>}
          </div>
          {motifType === "autre" && (
            <div className="mb-3">
              <Label className="text-xs mb-1 block">Précisez votre motif <span className="text-destructive">*</span></Label>
              <Textarea placeholder="Expliquez brièvement la raison de votre refus…" value={motifDetail} onChange={(e) => setMotifDetail(e.target.value)} rows={3} />
              {showErr && motifType === "autre" && !motifDetail && <p className="text-[11px] text-destructive mt-1">⚠ Ce champ est obligatoire.</p>}
            </div>
          )}
          {motifType && motifType !== "autre" && (
            <div className="mb-3">
              <Label className="text-xs mb-1 block">Précisions supplémentaires</Label>
              <Textarea placeholder="Ajoutez un message personnalisé si vous le souhaitez (facultatif)…" value={motifDetail} onChange={(e) => setMotifDetail(e.target.value)} rows={2} />
            </div>
          )}
          <InfoBanner icon={Info}>Un motif clair et respectueux préserve votre réputation sur la plateforme.</InfoBanner>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full" onClick={() => go("sell_received")}>
              <ArrowLeft size={14} className="mr-1.5" /> Retour
            </Button>
            <Button variant="destructive" className="w-full" onClick={() => {
              setShowErr(true);
              if (motifType && (motifType !== "autre" || motifDetail)) go("sell_refuse_confirm");
            }}>Refuser la demande</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== 8. VENDEUR — Confirmation refus ===== */}
      <Dialog open={modal === "sell_refuse_confirm"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center items-center">
            <div className="text-4xl mb-2">⚠️</div>
            <DialogTitle className="font-display text-lg">Confirmer le refus</DialogTitle>
            <DialogDescription>Cette action est définitive pour cette demande. L'acquéreur pourra soumettre une nouvelle demande.</DialogDescription>
          </DialogHeader>
          <AcquereurCard />
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 mb-4">
            <p className="text-xs font-semibold text-destructive mb-1">Motif qui sera communiqué</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {motifType && motifLabels[motifType]}
              {motifDetail && motifType !== "autre" && <span className="block mt-1 italic text-muted-foreground/70">"{motifDetail}"</span>}
            </p>
          </div>
          <InfoBanner icon={AlertTriangle} variant="warning">L'acquéreur sera notifié immédiatement et verra le motif de votre refus.</InfoBanner>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" className="w-full" onClick={() => go("sell_refuse")}>Modifier le motif</Button>
            <Button variant="destructive" className="w-full" onClick={() => go("sell_refuse_done")}>Confirmer le refus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== 8b. VENDEUR — Refus confirmé ===== */}
      <Dialog open={modal === "sell_refuse_done"} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader className="text-center items-center">
            <div className="text-4xl mb-2">✅</div>
            <DialogTitle className="font-display text-lg">Demande refusée</DialogTitle>
            <DialogDescription>L'acquéreur a été notifié de votre décision.</DialogDescription>
          </DialogHeader>
          <AcquereurCard />
          <InfoBanner icon={XCircle} variant="error">L'accès à la Data Room a été refusé pour Cabinet Martin & Associés.</InfoBanner>
          <InfoBanner icon={Info}>L'acquéreur pourra soumettre une nouvelle demande s'il apporte de nouveaux éléments.</InfoBanner>
          <Button className="w-full" onClick={close}>Retour à la conversation</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
