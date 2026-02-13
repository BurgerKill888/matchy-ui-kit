import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Building2 } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}

export default function AuthModal({ open, onOpenChange, mode, onModeChange }: AuthModalProps) {
  const [forgotPassword, setForgotPassword] = useState(false);

  if (forgotPassword) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="text-primary" size={24} />
              <DialogTitle className="font-display text-xl">Mot de passe oublié</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reset-email">Email</Label>
              <Input id="reset-email" type="email" placeholder="votre@email.com" className="mt-1.5 bg-secondary border-border" />
            </div>
            <Button className="w-full">Réinitialiser le mot de passe</Button>
            <button onClick={() => setForgotPassword(false)} className="text-sm text-primary hover:underline w-full text-center">
              Retour à la connexion
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="text-primary" size={24} />
            <DialogTitle className="font-display text-xl">
              {mode === "login" ? "Connexion" : "Inscription"}
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          {mode === "register" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstname">Prénom</Label>
                  <Input id="firstname" placeholder="Jean" className="mt-1.5 bg-secondary border-border" />
                </div>
                <div>
                  <Label htmlFor="lastname">Nom</Label>
                  <Input id="lastname" placeholder="Dupont" className="mt-1.5 bg-secondary border-border" />
                </div>
              </div>
              <div>
                <Label htmlFor="company">Société</Label>
                <Input id="company" placeholder="Nom de votre entreprise" className="mt-1.5 bg-secondary border-border" />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre@email.com" className="mt-1.5 bg-secondary border-border" />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" placeholder="••••••••" className="mt-1.5 bg-secondary border-border" />
          </div>
          {mode === "login" && (
            <button onClick={() => setForgotPassword(true)} className="text-sm text-primary hover:underline">
              Mot de passe oublié ?
            </button>
          )}
          <Button className="w-full glow-gold">
            {mode === "login" ? "Se connecter" : "Créer mon compte"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <button
              onClick={() => onModeChange(mode === "login" ? "register" : "login")}
              className="text-primary hover:underline ml-1"
            >
              {mode === "login" ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
