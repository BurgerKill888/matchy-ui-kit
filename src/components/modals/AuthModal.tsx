import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}

export default function AuthModal({ open, onOpenChange, mode, onModeChange }: AuthModalProps) {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setCompany("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({ title: "Connexion réussie", description: "Bienvenue sur Matchstone !" });
        onOpenChange(false);
        resetForm();
      } else {
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          company_name: company,
        });
        if (error) throw error;
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte.",
        });
        onOpenChange(false);
        resetForm();
      }
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      toast({ title: "Email envoyé", description: "Consultez votre boîte mail pour réinitialiser votre mot de passe." });
      setForgotPassword(false);
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="reset-email">Email</Label>
              <Input id="reset-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" className="mt-1.5 bg-secondary border-border" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Réinitialiser le mot de passe
            </Button>
            <button type="button" onClick={() => setForgotPassword(false)} className="text-sm text-primary hover:underline w-full text-center">
              Retour à la connexion
            </button>
          </form>
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstname">Prénom</Label>
                  <Input id="firstname" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jean" className="mt-1.5 bg-secondary border-border" />
                </div>
                <div>
                  <Label htmlFor="lastname">Nom</Label>
                  <Input id="lastname" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Dupont" className="mt-1.5 bg-secondary border-border" />
                </div>
              </div>
              <div>
                <Label htmlFor="company">Société</Label>
                <Input id="company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Nom de votre entreprise" className="mt-1.5 bg-secondary border-border" />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" className="mt-1.5 bg-secondary border-border" />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5 bg-secondary border-border" />
          </div>
          {mode === "login" && (
            <button type="button" onClick={() => setForgotPassword(true)} className="text-sm text-primary hover:underline">
              Mot de passe oublié ?
            </button>
          )}
          <Button type="submit" className="w-full glow-gold" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Se connecter" : "Créer mon compte"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <button
              type="button"
              onClick={() => { onModeChange(mode === "login" ? "register" : "login"); resetForm(); }}
              className="text-primary hover:underline ml-1"
            >
              {mode === "login" ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
