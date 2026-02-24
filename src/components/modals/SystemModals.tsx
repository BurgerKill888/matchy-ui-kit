import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  LogOut, Trash2, AlertTriangle, Clock, Shield, Save,
  MapPin, Ruler, FileText, Search, CheckCircle2,
} from "lucide-react";

// ========================
// SHARED PRIMITIVES
// ========================
interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ModalIcon({ emoji, className }: { emoji: string; className?: string }) {
  return <span className={`text-5xl mb-3 block ${className ?? ""}`}>{emoji}</span>;
}

function InfoBox({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-secondary/60 border border-border p-3 text-xs text-muted-foreground leading-relaxed">
      <span className="shrink-0">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

function WarnBox({ icon = "⚠️", children }: { icon?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-warning/10 border border-warning/30 p-3 text-xs text-warning-foreground leading-relaxed">
      <span className="shrink-0">{icon}</span>
      <div>{children}</div>
    </div>
  );
}

function DangerBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-destructive/5 border border-destructive/20 p-3 text-xs text-destructive leading-relaxed">
      <span className="shrink-0">🚨</span>
      <div>{children}</div>
    </div>
  );
}

function SuccessBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-success/10 border border-success/30 p-3 text-xs text-success leading-relaxed">
      <CheckCircle2 size={14} className="shrink-0" />
      <div>{children}</div>
    </div>
  );
}

function RadioOption({ label, sub, checked, onClick }: { label: string; sub?: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 rounded-lg border transition-all mb-1.5 ${checked ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}
    >
      <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${checked ? "border-primary bg-primary" : "border-muted-foreground/40"}`}>
        {checked && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" /></div>}
      </div>
      <div>
        <p className={`text-sm ${checked ? "font-semibold text-foreground" : "text-foreground"}`}>{label}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </button>
  );
}

// ========================
// 1. LOGOUT SIMPLE
// ========================
export function LogoutModal({ open, onOpenChange, onConfirm }: BaseModalProps & { onConfirm: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center pt-8 pb-2 text-center">
          <ModalIcon emoji="🚪" />
          <h2 className="font-display text-xl font-bold">Se déconnecter ?</h2>
          <p className="text-sm text-muted-foreground mt-1">Vous serez redirigé vers la page d'accueil.</p>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <InfoBox icon="💾">Vos données et vos matchs en cours sont sauvegardés. Vous les retrouverez à votre prochaine connexion.</InfoBox>
          <DialogFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button className="w-full" onClick={onConfirm}>Se déconnecter</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========================
// 2. LOGOUT ALL DEVICES
// ========================
export function LogoutAllDevicesModal({ open, onOpenChange, onConfirm }: BaseModalProps & { onConfirm: () => void }) {
  const sessions = [
    { device: "Chrome · MacBook Pro", loc: "Paris, FR", time: "Maintenant", active: true },
    { device: "Safari · iPhone 15", loc: "Paris, FR", time: "Il y a 2h", active: false },
    { device: "Chrome · Windows", loc: "Lyon, FR", time: "Il y a 3 jours", active: false },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center pt-8 pb-2 text-center">
          <ModalIcon emoji="🔒" />
          <h2 className="font-display text-xl font-bold">Déconnexion de tous les appareils</h2>
          <p className="text-sm text-muted-foreground mt-1">Vous serez déconnecté partout, y compris sur cet appareil.</p>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <WarnBox>Toutes vos sessions actives seront fermées immédiatement. Vous devrez vous reconnecter sur chaque appareil.</WarnBox>

          <div className="rounded-xl bg-secondary/40 border border-border p-3.5 space-y-0">
            <p className="text-xs font-semibold text-foreground mb-2">Sessions actives</p>
            {sessions.map((s, i) => (
              <div key={i} className={`flex items-center justify-between py-2 text-xs ${i < sessions.length - 1 ? "border-b border-border" : ""}`}>
                <div>
                  <p className="font-medium text-foreground">{s.device}</p>
                  <p className="text-muted-foreground text-[11px]">{s.loc}</p>
                </div>
                <span className={s.active ? "text-success font-semibold" : "text-muted-foreground"}>{s.time}</span>
              </div>
            ))}
          </div>

          <InfoBox icon="💡">Utilisez cette option si vous suspectez un accès non autorisé à votre compte.</InfoBox>
          <DialogFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button variant="destructive" className="w-full" onClick={onConfirm}>Tout déconnecter</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========================
// 3. SESSION EXPIRED
// ========================
export function SessionExpiredModal({ open, onOpenChange, onReconnect }: BaseModalProps & { onReconnect: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center pt-8 pb-2 text-center">
          <ModalIcon emoji="⏰" />
          <h2 className="font-display text-xl font-bold">Session expirée</h2>
          <p className="text-sm text-muted-foreground mt-1">Votre session a expiré par mesure de sécurité.</p>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <WarnBox>Pour protéger votre compte, les sessions sont automatiquement fermées après une période d'inactivité prolongée.</WarnBox>
          <InfoBox icon="💾">Vos données sont sauvegardées. Si vous étiez en train de remplir un formulaire, votre progression a été conservée.</InfoBox>
          <Button className="w-full" onClick={onReconnect}>Se reconnecter</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========================
// 4. LOGOUT DONE
// ========================
export function LogoutDoneModal({ open, onOpenChange, onHome }: BaseModalProps & { onHome: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center py-8 text-center px-6">
          <ModalIcon emoji="👋" />
          <h2 className="font-display text-xl font-bold mb-2">À bientôt !</h2>
          <p className="text-sm text-muted-foreground mb-5">Vous avez été déconnecté avec succès.</p>
          <Button className="w-full" onClick={onHome}>Retour à l'accueil</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========================
// 5. DELETE ACCOUNT — STEP 1 (REASON)
// ========================
export function DeleteAccountStep1Modal({ open, onOpenChange, onContinue }: BaseModalProps & { onContinue: (reason: string, detail: string) => void }) {
  const [reason, setReason] = useState<string | null>(null);
  const [detail, setDetail] = useState("");
  const [showErr, setShowErr] = useState(false);

  const reasons = [
    { id: "no_match", l: "Je ne reçois pas assez de matchs", s: "Pas suffisamment d'opportunités pertinentes" },
    { id: "found", l: "J'ai trouvé ce que je cherchais", s: "Transaction conclue, plus besoin de la plateforme" },
    { id: "complex", l: "La plateforme est trop complexe", s: "Difficulté d'utilisation" },
    { id: "price", l: "Le prix ne me convient pas", s: "L'abonnement est trop cher" },
    { id: "other", l: "Autre raison", s: "Précisez ci-dessous" },
  ];

  function handleContinue() {
    setShowErr(true);
    if (reason && (reason !== "other" || detail.trim())) {
      onContinue(reason, detail);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center pt-8 pb-2 text-center">
          <ModalIcon emoji="🗑️" />
          <h2 className="font-display text-xl font-bold text-destructive">Supprimer votre compte</h2>
          <p className="text-sm text-muted-foreground mt-1">Avant de partir, dites-nous pourquoi.</p>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Raison de la suppression <span className="text-destructive">*</span></label>
            {reasons.map((r) => (
              <RadioOption key={r.id} label={r.l} sub={r.s} checked={reason === r.id} onClick={() => setReason(r.id)} />
            ))}
            {showErr && !reason && <p className="text-[11px] text-destructive">⚠ Veuillez sélectionner une raison.</p>}
          </div>

          {reason === "other" && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Précisez <span className="text-destructive">*</span></label>
              <Textarea
                value={detail} onChange={(e) => setDetail(e.target.value)}
                placeholder="Expliquez-nous votre raison..."
                rows={3} className="bg-secondary border-border resize-none text-sm"
              />
              {showErr && reason === "other" && !detail.trim() && <p className="text-[11px] text-destructive">⚠ Ce champ est obligatoire.</p>}
            </div>
          )}

          {reason === "no_match" && <InfoBox icon="💡">Avez-vous pensé à élargir vos critères de recherche ? Des fourchettes plus larges augmentent significativement le nombre de matchs.</InfoBox>}
          {reason === "price" && <InfoBox icon="💡">Contactez-nous à <strong>support@matchstone.fr</strong> pour discuter d'une offre adaptée à votre activité.</InfoBox>}

          <DialogFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button variant="destructive" className="w-full" onClick={handleContinue}>Continuer</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========================
// 6. DELETE ACCOUNT — STEP 2 (CONFIRM)
// ========================
export function DeleteAccountStep2Modal({ open, onOpenChange, onConfirm, onBack }: BaseModalProps & { onConfirm: () => void; onBack: () => void }) {
  const [checks, setChecks] = useState({ matchs: false, data: false, irreversible: false });
  const [confirmText, setConfirmText] = useState("");
  const [showErr, setShowErr] = useState(false);

  const allChecked = checks.matchs && checks.data && checks.irreversible;
  const deletionItems = [
    "Toutes vos annonces et fiches de recherche",
    "Tous vos matchs en cours et historiques",
    "Toutes vos conversations et messages",
    "Tous vos documents Data Room",
    "Votre historique de transactions",
    "Vos paramètres et préférences",
  ];

  function handleConfirm() {
    setShowErr(true);
    if (allChecked && confirmText === "SUPPRIMER") onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center pt-8 pb-2 text-center">
          <ModalIcon emoji="⚠️" />
          <h2 className="font-display text-xl font-bold text-destructive">Confirmer la suppression</h2>
          <p className="text-sm text-muted-foreground mt-1">Cette action est irréversible.</p>
        </div>
        <div className="px-6 pb-6 space-y-4">
          <DangerBox>La suppression de votre compte entraîne la perte <strong>définitive et irréversible</strong> de toutes vos données.</DangerBox>

          <div className="rounded-xl bg-destructive/5 border border-destructive/20 p-4 space-y-1">
            <p className="text-xs font-semibold text-destructive mb-2">Ce qui sera supprimé :</p>
            {deletionItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-destructive">
                <span>✕</span><span>{item}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground">Je comprends que :</p>
            {[
              { key: "matchs" as const, label: "Mes matchs en cours seront annulés immédiatement" },
              { key: "data" as const, label: "Toutes mes données seront définitivement supprimées" },
              { key: "irreversible" as const, label: "Cette action est irréversible" },
            ].map((c) => (
              <label key={c.key} className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox checked={checks[c.key]} onCheckedChange={() => setChecks((p) => ({ ...p, [c.key]: !p[c.key] }))} />
                <span className="text-xs text-foreground">{c.label}</span>
              </label>
            ))}
            {showErr && !allChecked && <p className="text-[11px] text-destructive">⚠ Vous devez cocher toutes les cases.</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Tapez "SUPPRIMER" pour confirmer</label>
            <Input
              value={confirmText} onChange={(e) => setConfirmText(e.target.value)}
              placeholder="SUPPRIMER"
              className="bg-secondary border-border text-sm"
            />
            {showErr && confirmText && confirmText !== "SUPPRIMER" && <p className="text-[11px] text-destructive">⚠ Tapez exactement SUPPRIMER</p>}
            {showErr && !confirmText && <p className="text-[11px] text-destructive">⚠ Ce champ est obligatoire.</p>}
          </div>

          <DialogFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={onBack}>Retour</Button>
            <Button variant="destructive" className="w-full" disabled={!allChecked || confirmText !== "SUPPRIMER"} onClick={handleConfirm}>
              Supprimer définitivement mon compte
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========================
// 7. ACCOUNT DELETED CONFIRMATION
// ========================
export function AccountDeletedModal({ open, onOpenChange, onHome }: BaseModalProps & { onHome: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center py-8 text-center px-6 space-y-4">
          <ModalIcon emoji="👋" />
          <h2 className="font-display text-xl font-bold">Compte supprimé</h2>
          <p className="text-sm text-muted-foreground">Votre compte et toutes vos données ont été supprimés.</p>
          <SuccessBox>Un email de confirmation a été envoyé à votre adresse.</SuccessBox>
          <InfoBox icon="⏱️">Vous disposez de <strong>30 jours</strong> pour nous contacter à <strong>support@matchstone.fr</strong> si vous changez d'avis.</InfoBox>
          <InfoBox icon="💡">Vous pouvez recréer un compte à tout moment avec la même adresse email.</InfoBox>
          <Button className="w-full" onClick={onHome}>Retour à l'accueil</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========================
// 8. DELETE CONTENT (annonce / fiche / document)
// ========================
export type ContentType = "annonce" | "fiche" | "document";

interface DeleteContentModalProps extends BaseModalProps {
  contentType: ContentType;
  contentTitle: string;
  contentSubtitle: string;
  onConfirm: () => void;
  onPause?: () => void;
}

export function DeleteContentModal({ open, onOpenChange, contentType, contentTitle, contentSubtitle, onConfirm, onPause }: DeleteContentModalProps) {
  const emoji = contentType === "annonce" ? "🏢" : contentType === "fiche" ? "🔍" : "📄";
  const heading = contentType === "annonce" ? "Supprimer cette annonce ?" : contentType === "fiche" ? "Supprimer cette fiche de recherche ?" : "Supprimer ce document ?";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center pt-8 pb-2 text-center">
          <ModalIcon emoji={emoji} />
          <h2 className="font-display text-xl font-bold">{heading}</h2>
          <p className="text-sm text-muted-foreground mt-1">Cette action nécessite votre confirmation.</p>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {/* Content card */}
          <div className="rounded-xl bg-secondary/40 border border-border p-3.5 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-xl shrink-0">{emoji}</div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{contentTitle}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{contentSubtitle}</p>
            </div>
          </div>

          {contentType === "annonce" && (
            <>
              <WarnBox>En supprimant cette annonce :</WarnBox>
              <div className="rounded-xl bg-warning/10 border border-warning/30 p-3.5 space-y-1">
                {[
                  "Les matchs associés seront annulés",
                  "Les conversations en cours seront archivées",
                  "Les demandes Data Room en attente seront refusées",
                  "L'annonce ne sera plus visible par les acquéreurs",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-warning-foreground"><span>⚠️</span>{item}</div>
                ))}
              </div>
              <InfoBox icon="💡">Alternative : vous pouvez <strong>mettre en pause</strong> votre annonce au lieu de la supprimer. Elle sera masquée mais conservée.</InfoBox>
            </>
          )}

          {contentType === "fiche" && (
            <>
              <WarnBox>En supprimant cette fiche, vous ne recevrez plus de matchs correspondant à ces critères.</WarnBox>
              <InfoBox icon="💡">Vos conversations existantes issues de cette recherche seront conservées.</InfoBox>
            </>
          )}

          {contentType === "document" && (
            <WarnBox>Ce document ne sera plus accessible aux acquéreurs qui ont accès à votre Data Room.</WarnBox>
          )}

          <DialogFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>Annuler</Button>
            {contentType === "annonce" && onPause && (
              <Button variant="outline" className="w-full" onClick={onPause}>Mettre en pause</Button>
            )}
            <Button variant="destructive" className="w-full" onClick={onConfirm}>Supprimer</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========================
// 9. CONTENT DELETED CONFIRMATION
// ========================
export function ContentDeletedModal({ open, onOpenChange, contentType }: BaseModalProps & { contentType: ContentType }) {
  const title = contentType === "annonce" ? "Annonce supprimée" : contentType === "fiche" ? "Fiche supprimée" : "Document supprimé";
  const desc = contentType === "annonce"
    ? "Les matchs associés ont été annulés et les acquéreurs notifiés."
    : contentType === "fiche"
      ? "Vous ne recevrez plus de matchs pour cette recherche."
      : "Le document a été retiré de votre Data Room.";
  const success = contentType === "annonce"
    ? "Vos conversations existantes restent accessibles dans vos archives."
    : contentType === "fiche"
      ? "Vous pouvez créer une nouvelle recherche à tout moment."
      : "Les acquéreurs ayant accès à la Data Room seront notifiés.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center py-8 text-center px-6 space-y-4">
          <ModalIcon emoji="✅" />
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{desc}</p>
          <SuccessBox>{success}</SuccessBox>
          <Button className="w-full" onClick={() => onOpenChange(false)}>Retour</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ========================
// 10. UNSAVED CHANGES
// ========================
type UnsavedContext = "questionnaire" | "annonce" | "profil" | "dataroom";

interface UnsavedChangesModalProps extends BaseModalProps {
  context: UnsavedContext;
  onDiscard: () => void;
  onSave: () => void;
}

export function UnsavedChangesModal({ open, onOpenChange, context, onDiscard, onSave }: UnsavedChangesModalProps) {
  const desc: Record<UnsavedContext, string> = {
    questionnaire: "Vous n'avez pas terminé le questionnaire.",
    annonce: "Vos modifications d'annonce n'ont pas été enregistrées.",
    profil: "Les modifications de votre profil n'ont pas été sauvegardées.",
    dataroom: "Des documents sont en cours d'upload.",
  };

  const discardLabel: Record<UnsavedContext, string> = {
    questionnaire: "Quitter",
    annonce: "Quitter sans enregistrer",
    profil: "Quitter sans enregistrer",
    dataroom: "Quitter sans enregistrer",
  };

  const saveLabel: Record<UnsavedContext, string> = {
    questionnaire: "Reprendre le questionnaire",
    annonce: "Enregistrer et quitter",
    profil: "Enregistrer et quitter",
    dataroom: "Attendre la fin de l'upload",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border p-0 overflow-hidden">
        <div className="flex flex-col items-center pt-8 pb-2 text-center">
          <ModalIcon emoji="💾" />
          <h2 className="font-display text-xl font-bold">Modifications non enregistrées</h2>
          <p className="text-sm text-muted-foreground mt-1">{desc[context]}</p>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {context === "questionnaire" && (
            <>
              <div className="rounded-xl bg-secondary/40 border border-border p-3.5">
                <p className="text-xs font-semibold text-foreground mb-2">Progression actuelle</p>
                <div className="flex gap-1 mb-2">
                  {["Typologie", "Surfaces", "Urbanisme", "État", "Prix", "Localisation", "Photos", "Data Room"].map((s, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full ${i < 3 ? "bg-foreground" : i === 3 ? "bg-primary" : "bg-muted"}`} />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">3 étapes sur 8 complétées</p>
              </div>
              <InfoBox icon="💾">Votre progression est sauvegardée automatiquement. Vous pourrez reprendre là où vous en étiez.</InfoBox>
            </>
          )}

          {context === "annonce" && <WarnBox>Si vous quittez maintenant, les modifications suivantes seront perdues : prix mis à jour, nouvelles photos ajoutées.</WarnBox>}
          {context === "profil" && <WarnBox>Les modifications de votre nom, email ou mot de passe ne seront pas appliquées.</WarnBox>}
          {context === "dataroom" && (
            <>
              <WarnBox>Un upload de document est en cours. Si vous quittez, le fichier ne sera pas enregistré.</WarnBox>
              <div className="rounded-xl bg-secondary/40 border border-border p-3.5 flex items-center gap-3">
                <span className="text-lg">📄</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">Plans_architecturaux.pdf</p>
                  <div className="h-1 bg-muted rounded-full mt-1.5">
                    <div className="h-1 bg-primary rounded-full" style={{ width: "67%" }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">67% — 3.2 MB / 4.8 MB</p>
                </div>
              </div>
            </>
          )}

          <DialogFooter className="flex-col gap-2">
            <Button variant="destructive" className="w-full" onClick={onDiscard}>{discardLabel[context]}</Button>
            <Button className="w-full" onClick={onSave}>{saveLabel[context]}</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
