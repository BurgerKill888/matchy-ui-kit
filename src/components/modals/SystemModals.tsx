import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Clock, LogOut, Trash2, AlertTriangle } from "lucide-react";

interface MatchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewMatchModal({ open, onOpenChange }: MatchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border text-center">
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="text-primary" size={28} />
          </div>
          <DialogTitle className="font-display text-xl mb-2">Nouveau match !</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Un acquéreur correspond à votre annonce. Démarrez la conversation avant l'expiration du timer.
          </DialogDescription>
        </div>
        <DialogFooter className="flex-col gap-2">
          <Button className="w-full glow-gold">Démarrer la conversation</Button>
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>Plus tard</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TimerExpiredModal({ open, onOpenChange }: MatchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border text-center">
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Clock className="text-destructive" size={28} />
          </div>
          <DialogTitle className="font-display text-xl mb-2">Timer expiré</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Le délai de réponse pour ce match est écoulé. L'opportunité n'est plus disponible.
          </DialogDescription>
        </div>
        <DialogFooter>
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>Compris</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LogoutModal({ open, onOpenChange }: MatchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border">
        <div className="flex flex-col items-center py-4 text-center">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <LogOut className="text-muted-foreground" size={24} />
          </div>
          <DialogTitle className="font-display text-xl mb-2">Se déconnecter ?</DialogTitle>
          <DialogDescription>Vous serez redirigé vers la page d'accueil.</DialogDescription>
        </div>
        <DialogFooter className="flex-col gap-2">
          <Button variant="destructive" className="w-full">Se déconnecter</Button>
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteAccountModal({ open, onOpenChange }: MatchModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border">
        <div className="flex flex-col items-center py-4 text-center">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Trash2 className="text-destructive" size={24} />
          </div>
          <DialogTitle className="font-display text-xl mb-2">Supprimer le compte ?</DialogTitle>
          <DialogDescription>Cette action est irréversible. Toutes vos données seront supprimées.</DialogDescription>
        </div>
        <DialogFooter className="flex-col gap-2">
          <Button variant="destructive" className="w-full">Supprimer définitivement</Button>
          <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>Annuler</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UnsavedChangesModal({ open, onOpenChange, onDiscard }: MatchModalProps & { onDiscard?: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border">
        <div className="flex flex-col items-center py-4 text-center">
          <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center mb-4">
            <AlertTriangle className="text-warning" size={24} />
          </div>
          <DialogTitle className="font-display text-xl mb-2">Modifications non enregistrées</DialogTitle>
          <DialogDescription>Voulez-vous quitter sans enregistrer vos modifications ?</DialogDescription>
        </div>
        <DialogFooter className="flex-col gap-2">
          <Button className="w-full">Enregistrer</Button>
          <Button variant="outline" className="w-full" onClick={onDiscard}>Quitter sans enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
