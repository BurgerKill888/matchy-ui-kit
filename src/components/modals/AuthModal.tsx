import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Loader2, Briefcase, TrendingUp, Home, PiggyBank, Landmark, Shield, Scale, ChevronLeft, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}

const profileTypes = [
  { id: "agent", label: "Agent immobilier", desc: "Transaction pour compte de tiers", icon: Briefcase },
  { id: "marchand", label: "Marchand de biens", desc: "Achat-revente et création de valeur", icon: TrendingUp },
  { id: "promoteur", label: "Promoteur", desc: "Développement foncier et VEFA", icon: Building2 },
  { id: "fonciere", label: "Foncière / SCI", desc: "Détention et arbitrage patrimonial", icon: Home },
  { id: "investisseur", label: "Investisseur", desc: "Investissement structuré", icon: PiggyBank },
  { id: "banque", label: "Banque / Finance", desc: "Financement et structuration", icon: Landmark },
  { id: "assureur", label: "Assureur / SCPI", desc: "Fonds immobiliers et gestion", icon: Shield },
  { id: "notaire", label: "Notaire / Avocat", desc: "Cessions et conseil juridique", icon: Scale },
];

const REGISTER_STEPS = [
  { label: "Profil", number: 1 },
  { label: "Identité", number: 2 },
  { label: "Confirmation", number: 3 },
];

export default function AuthModal({ open, onOpenChange, mode, onModeChange }: AuthModalProps) {
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [selectedProfile, setSelectedProfile] = useState("");
  const [registerStep, setRegisterStep] = useState(1);
  const { signIn, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setCompany("");
    setSelectedProfile("");
    setRegisterStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Fictif : pas de vraie auth
    setTimeout(() => {
      setLoading(false);
      if (mode === "login") {
        toast({ title: "Connexion réussie", description: "Bienvenue sur Matchstone !" });
        onOpenChange(false);
        resetForm();
        navigate("/dashboard");
      } else {
        toast({ title: "Inscription réussie", description: "Bienvenue ! Configurez votre profil." });
        onOpenChange(false);
        resetForm();
        navigate("/onboarding");
      }
    }, 600);
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

  // --- Forgot password ---
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

  // --- Login ---
  if (mode === "login") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="text-primary" size={24} />
              <DialogTitle className="font-display text-xl">Connexion</DialogTitle>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" className="mt-1.5 bg-secondary border-border" />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5 bg-secondary border-border" />
            </div>
            <button type="button" onClick={() => setForgotPassword(true)} className="text-sm text-primary hover:underline">
              Mot de passe oublié ?
            </button>
            <Button type="submit" className="w-full glow-gold" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Pas encore de compte ?
              <button type="button" onClick={() => { onModeChange("register"); resetForm(); }} className="text-primary hover:underline ml-1">
                S'inscrire
              </button>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // --- Register wizard ---
  const canProceedStep1 = selectedProfile !== "";
  const canProceedStep2 = firstName.trim() !== "" && lastName.trim() !== "" && email.trim() !== "" && password.length >= 6;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-border p-0 overflow-hidden">
        {/* Logo + Progress bar */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-center gap-2.5 mb-6">
            <Building2 className="text-primary" size={28} />
            <span className="font-display text-2xl font-bold tracking-tight">Match<span className="text-primary">stone</span></span>
          </div>
          <div className="flex items-center justify-between mb-2">
            {REGISTER_STEPS.map((step, i) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                  registerStep > step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : registerStep === step.number
                      ? "border-primary text-primary bg-primary/10"
                      : "border-muted text-muted-foreground"
                )}>
                  {registerStep > step.number ? <Check size={16} /> : step.number}
                </div>
                {i < REGISTER_STEPS.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-2 transition-all duration-300",
                    registerStep > step.number ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            {REGISTER_STEPS.map(s => (
              <span key={s.number} className={cn(registerStep >= s.number && "text-primary font-medium")}>{s.label}</span>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6 pt-2 min-h-[380px] flex flex-col">
          <AnimatePresence mode="wait">
            {/* Step 1: Profile type */}
            {registerStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="font-display text-xl font-bold mb-1">Quel est votre profil ?</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Sélectionnez votre activité principale pour personnaliser votre expérience Matchstone.
                </p>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {profileTypes.map((p) => {
                    const selected = selectedProfile === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedProfile(p.id)}
                        className={cn(
                          "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 text-center group",
                          selected
                            ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
                            : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60"
                        )}
                      >
                        {selected && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check size={12} className="text-primary-foreground" />
                          </div>
                        )}
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                          selected ? "bg-primary/20" : "bg-muted"
                        )}>
                          <p.icon size={20} className={cn(selected ? "text-primary" : "text-muted-foreground")} />
                        </div>
                        <span className={cn("font-semibold text-sm", selected && "text-primary")}>{p.label}</span>
                        <span className="text-xs text-muted-foreground leading-tight">{p.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Identity */}
            {registerStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="font-display text-xl font-bold mb-1">Créez votre compte</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Rejoignez la communauté Matchstone et accédez au matching immobilier.
                </p>
                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstname">Prénom *</Label>
                      <Input id="firstname" required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jean" className="mt-1.5 bg-secondary border-border" />
                    </div>
                    <div>
                      <Label htmlFor="lastname">Nom *</Label>
                      <Input id="lastname" required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Dupont" className="mt-1.5 bg-secondary border-border" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="company">Société</Label>
                    <Input id="company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Nom de votre entreprise (optionnel)" className="mt-1.5 bg-secondary border-border" />
                  </div>
                  <div>
                    <Label htmlFor="reg-email">Email *</Label>
                    <Input id="reg-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" className="mt-1.5 bg-secondary border-border" />
                  </div>
                  <div>
                    <Label htmlFor="reg-password">Mot de passe *</Label>
                    <Input id="reg-password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 6 caractères" className="mt-1.5 bg-secondary border-border" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {registerStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col"
              >
                <h2 className="font-display text-xl font-bold mb-1">Confirmez votre inscription</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Vérifiez vos informations avant de finaliser.
                </p>
                <div className="space-y-3 flex-1">
                  <div className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const prof = profileTypes.find(p => p.id === selectedProfile);
                        if (!prof) return null;
                        return (
                          <>
                            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                              <prof.icon size={20} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-sm">{prof.label}</p>
                              <p className="text-xs text-muted-foreground">{prof.desc}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    <div className="h-px bg-border" />
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <span className="text-muted-foreground">Prénom</span>
                      <span className="font-medium">{firstName}</span>
                      <span className="text-muted-foreground">Nom</span>
                      <span className="font-medium">{lastName}</span>
                      {company && (
                        <>
                          <span className="text-muted-foreground">Société</span>
                          <span className="font-medium">{company}</span>
                        </>
                      )}
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{email}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                    <p className="text-xs text-muted-foreground">
                      💡 <strong className="text-foreground">Astuce :</strong> Un email de vérification vous sera envoyé. Confirmez votre adresse pour accéder au matching et commencer à découvrir les opportunités.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => {
                if (registerStep === 1) {
                  onModeChange("login");
                  resetForm();
                } else {
                  setRegisterStep(s => s - 1);
                }
              }}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} />
              {registerStep === 1 ? "Déjà un compte ? Se connecter" : "Retour"}
            </button>

            {registerStep < 3 ? (
              <Button
                type="button"
                onClick={() => setRegisterStep(s => s + 1)}
                disabled={registerStep === 1 ? !canProceedStep1 : !canProceedStep2}
                className="glow-gold px-6"
              >
                Continuer
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit as any}
                disabled={loading}
                className="glow-gold px-6"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer mon compte
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
