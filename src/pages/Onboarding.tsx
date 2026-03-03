import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, ArrowRight, Check, Loader2, Briefcase, Search, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserSpace } from "@/contexts/UserSpaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/* ========== MACRO PROGRESS BAR ========== */
const MACRO_STEPS = [
  { number: 1, label: "Créer un compte" },
  { number: 2, label: "Profil professionnel" },
  { number: 3, label: "Première action" },
];

function MacroProgressBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between max-w-md mx-auto mb-6">
      {MACRO_STEPS.map((step, i) => (
        <div key={step.number} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
              current > step.number
                ? "bg-primary border-primary text-primary-foreground"
                : current === step.number
                  ? "border-primary text-primary bg-primary/10"
                  : "border-muted text-muted-foreground"
            )}>
              {current > step.number ? <Check size={16} /> : step.number}
            </div>
            <span className={cn(
              "text-[10px] mt-1.5 text-center leading-tight whitespace-nowrap",
              current >= step.number ? "text-primary font-semibold" : "text-muted-foreground"
            )}>
              {step.label}
            </span>
          </div>
          {i < MACRO_STEPS.length - 1 && (
            <div className={cn(
              "flex-1 h-0.5 mx-3 mb-5 transition-all duration-300",
              current > step.number ? "bg-primary" : "bg-muted"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ========== PRIMITIVES ========== */
function InputField({ label, placeholder, value, onChange, error, required = true, type = "text" }: {
  label: string; placeholder?: string; value: string; onChange: (v: string) => void;
  error?: string | null; required?: boolean; type?: string;
}) {
  return (
    <div className="mb-4">
      <Label>{label} {required ? <span className="text-destructive">*</span> : <span className="text-[10px] text-muted-foreground font-normal">(facultatif)</span>}</Label>
      <div className="relative mt-1.5">
        <Input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
          className="bg-secondary border-border" />
      </div>
      {error && <p className="text-xs text-destructive mt-1">⚠ {error}</p>}
    </div>
  );
}

/* ========== MAIN ========== */
export default function Onboarding() {
  const navigate = useNavigate();
  const { setSpace } = useUserSpace();
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  // Auth gate
  const [authView, setAuthView] = useState<"login" | "register" | "forgot">("login");
  const [authDone, setAuthDone] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFirstName, setAuthFirstName] = useState("");
  const [authLastName, setAuthLastName] = useState("");
  const [authCompany, setAuthCompany] = useState("");
  const [authSubmitted, setAuthSubmitted] = useState(false);

  // Post-auth steps: 0 = profil professionnel, 1 = première action
  const [step, setStep] = useState(0);
  const [showErr, setShowErr] = useState(false);

  // Professional profile fields
  const [proCompany, setProCompany] = useState("");
  const [proFunction, setProFunction] = useState("");
  const [proPhone, setProPhone] = useState("");
  const [proCity, setProCity] = useState("");

  const anim = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 }, transition: { duration: 0.25 } };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitted(true);
    if (!authEmail || !authPassword) return;
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAuthDone(true);
      setProCompany(authCompany);
      toast({ title: "Connexion réussie", description: "Bienvenue sur Matchstone !" });
    }, 600);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitted(true);
    if (!authEmail || !authPassword || !authFirstName || !authLastName) return;
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAuthDone(true);
      setProCompany(authCompany);
      toast({ title: "Inscription réussie", description: "Bienvenue sur Matchstone !" });
    }, 600);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitted(true);
    if (!authEmail) return;
    setAuthLoading(true);
    try {
      const { error } = await resetPassword(authEmail);
      if (error) throw error;
      toast({ title: "Email envoyé", description: "Consultez votre boîte mail pour réinitialiser votre mot de passe." });
      setAuthView("login");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFirstAction = (action: "sell" | "search" | "explore") => {
    if (action === "sell") {
      setSpace("vendeur");
      navigate("/listings/create", { replace: true });
    } else if (action === "search") {
      setSpace("acquereur");
      navigate("/criteria/create", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  const macroStep = !authDone ? 1 : step === 0 ? 2 : 3;

  // ===== AUTH GATE (Macro step 1) =====
  if (!authDone) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border/50 bg-background/90 backdrop-blur-xl">
          <div className="container flex items-center justify-center h-14">
            <div className="flex items-center gap-2">
              <Building2 className="text-primary" size={22} />
              <span className="font-display text-lg font-bold">Match<span className="text-primary">stone</span></span>
            </div>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-10">
          <MacroProgressBar current={macroStep} />
          <AnimatePresence mode="wait">
            {/* LOGIN */}
            {authView === "login" && (
              <motion.div key="login" {...anim} className="w-full max-w-md">
                <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
                  <h1 className="font-display text-2xl font-bold mb-1">Connexion</h1>
                  <p className="text-sm text-muted-foreground mb-6">Accédez à votre compte Matchstone.</p>
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <Label htmlFor="auth-email">Email <span className="text-destructive">*</span></Label>
                      <Input id="auth-email" type="email" placeholder="jean@entreprise.com"
                        value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                        className={cn("mt-1.5 bg-background border-border", authSubmitted && !authEmail && "border-destructive ring-destructive/30 ring-2")} />
                      {authSubmitted && !authEmail && <p className="text-xs text-destructive mt-1 flex items-center gap-1">⚠ Obligatoire</p>}
                    </div>
                    <div>
                      <Label htmlFor="auth-pw">Mot de passe <span className="text-destructive">*</span></Label>
                      <Input id="auth-pw" type="password" placeholder="Votre mot de passe"
                        value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                        className={cn("mt-1.5 bg-background border-border", authSubmitted && !authPassword && "border-destructive ring-destructive/30 ring-2")} />
                      {authSubmitted && !authPassword && <p className="text-xs text-destructive mt-1 flex items-center gap-1">⚠ Obligatoire</p>}
                      <div className="flex justify-end mt-2">
                        <button type="button" onClick={() => { setAuthView("forgot"); setAuthSubmitted(false); }}
                          className="text-sm text-foreground hover:underline font-medium">Mot de passe oublié ?</button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-12 text-base font-bold" disabled={authLoading}>
                      {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Se connecter
                    </Button>
                    <div className="flex items-center gap-3 my-1">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-xs text-muted-foreground">ou</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <Button type="button" variant="outline" className="w-full h-12 text-base font-bold" disabled>
                      Continuer avec LinkedIn
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      Pas de compte ?{" "}
                      <button type="button" onClick={() => { setAuthView("register"); setAuthSubmitted(false); }}
                        className="text-foreground hover:underline font-semibold underline">Créer un compte</button>
                    </p>
                  </form>
                </div>
              </motion.div>
            )}

            {/* REGISTER */}
            {authView === "register" && (
              <motion.div key="register" {...anim} className="w-full max-w-md">
                <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
                  <h1 className="font-display text-2xl font-bold mb-1">Créer un compte</h1>
                  <p className="text-sm text-muted-foreground mb-6">Rejoignez Matchstone et accédez au matching immobilier.</p>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Prénom <span className="text-destructive">*</span></Label>
                        <Input placeholder="Jean" value={authFirstName} onChange={e => setAuthFirstName(e.target.value)}
                          className={cn("mt-1.5 bg-background border-border", authSubmitted && !authFirstName && "border-destructive ring-destructive/30 ring-2")} />
                        {authSubmitted && !authFirstName && <p className="text-xs text-destructive mt-1">⚠ Obligatoire</p>}
                      </div>
                      <div>
                        <Label>Nom <span className="text-destructive">*</span></Label>
                        <Input placeholder="Dupont" value={authLastName} onChange={e => setAuthLastName(e.target.value)}
                          className={cn("mt-1.5 bg-background border-border", authSubmitted && !authLastName && "border-destructive ring-destructive/30 ring-2")} />
                        {authSubmitted && !authLastName && <p className="text-xs text-destructive mt-1">⚠ Obligatoire</p>}
                      </div>
                    </div>
                    <div>
                      <Label>Société <span className="text-[10px] text-muted-foreground font-normal">(facultatif)</span></Label>
                      <Input placeholder="Nom de votre entreprise" value={authCompany} onChange={e => setAuthCompany(e.target.value)}
                        className="mt-1.5 bg-background border-border" />
                    </div>
                    <div>
                      <Label>Email <span className="text-destructive">*</span></Label>
                      <Input type="email" placeholder="jean@entreprise.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                        className={cn("mt-1.5 bg-background border-border", authSubmitted && !authEmail && "border-destructive ring-destructive/30 ring-2")} />
                      {authSubmitted && !authEmail && <p className="text-xs text-destructive mt-1">⚠ Obligatoire</p>}
                    </div>
                    <div>
                      <Label>Mot de passe <span className="text-destructive">*</span></Label>
                      <Input type="password" placeholder="Minimum 6 caractères" value={authPassword} onChange={e => setAuthPassword(e.target.value)}
                        className={cn("mt-1.5 bg-background border-border", authSubmitted && !authPassword && "border-destructive ring-destructive/30 ring-2")} />
                      {authSubmitted && !authPassword && <p className="text-xs text-destructive mt-1">⚠ Obligatoire</p>}
                    </div>
                    <Button type="submit" className="w-full h-12 text-base font-bold" disabled={authLoading}>
                      {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Créer mon compte
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      Déjà un compte ?{" "}
                      <button type="button" onClick={() => { setAuthView("login"); setAuthSubmitted(false); }}
                        className="text-foreground hover:underline font-semibold underline">Se connecter</button>
                    </p>
                  </form>
                </div>
              </motion.div>
            )}

            {/* FORGOT PASSWORD */}
            {authView === "forgot" && (
              <motion.div key="forgot" {...anim} className="w-full max-w-md">
                <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
                  <h1 className="font-display text-2xl font-bold mb-1">Mot de passe oublié</h1>
                  <p className="text-sm text-muted-foreground mb-6">Saisissez votre email pour recevoir un lien de réinitialisation.</p>
                  <form onSubmit={handleForgot} className="space-y-5">
                    <div>
                      <Label>Email <span className="text-destructive">*</span></Label>
                      <Input type="email" placeholder="jean@entreprise.com" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                        className={cn("mt-1.5 bg-background border-border", authSubmitted && !authEmail && "border-destructive ring-destructive/30 ring-2")} />
                      {authSubmitted && !authEmail && <p className="text-xs text-destructive mt-1">⚠ Obligatoire</p>}
                    </div>
                    <Button type="submit" className="w-full h-12 text-base font-bold" disabled={authLoading}>
                      {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Envoyer le lien
                    </Button>
                    <button type="button" onClick={() => { setAuthView("login"); setAuthSubmitted(false); }}
                      className="text-sm text-foreground hover:underline w-full text-center font-medium flex items-center justify-center gap-1">
                      <ArrowLeft size={14} /> Retour connexion
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ===== POST-AUTH FLOW =====
  const canProceedProfile = proCompany.trim() !== "" && proFunction.trim() !== "";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Building2 className="text-primary" size={22} />
            <span className="font-display text-lg font-bold">Match<span className="text-primary">stone</span></span>
          </div>
          <span className="text-xs text-muted-foreground">Étape {step + 2}/3</span>
          <button onClick={() => navigate("/dashboard")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Passer pour l'instant</button>
        </div>
      </header>

      <div className="max-w-[560px] mx-auto px-5 py-8">
        <MacroProgressBar current={macroStep} />

        <AnimatePresence mode="wait">
          {/* STEP 0: Profil professionnel (Macro step 2) */}
          {step === 0 && (
            <motion.div key="profile" {...anim}>
              <div className="glass-card rounded-xl p-6 shadow-card">
                <h2 className="font-display text-xl font-bold mb-1">Complétez votre profil professionnel</h2>
                <p className="text-sm text-muted-foreground mb-6">Votre identité sur Matchstone — société, fonction, coordonnées.</p>

                <InputField label="Société" placeholder="Nom de votre entreprise" value={proCompany} onChange={setProCompany}
                  error={showErr && !proCompany.trim() ? "Obligatoire" : null} />
                <InputField label="Fonction / Titre" placeholder="ex : Directeur d'investissement" value={proFunction} onChange={setProFunction}
                  error={showErr && !proFunction.trim() ? "Obligatoire" : null} />
                <InputField label="Téléphone" placeholder="06 XX XX XX XX" value={proPhone} onChange={setProPhone} required={false} />
                <InputField label="Ville" placeholder="Paris" value={proCity} onChange={setProCity} required={false} />

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex gap-3 items-start text-sm mt-2 mb-4">
                  <span className="text-base shrink-0">🔒</span>
                  <div className="text-muted-foreground leading-relaxed">
                    Ces informations ne seront partagées qu'avec vos contreparties validées.
                  </div>
                </div>

                <Button className="w-full glow-gold" onClick={() => {
                  setShowErr(true);
                  if (canProceedProfile) { setShowErr(false); setStep(1); }
                }}>
                  Continuer <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: Première action (Macro step 3) */}
          {step === 1 && (
            <motion.div key="action" {...anim}>
              <div className="glass-card rounded-xl p-6 shadow-card">
                <h2 className="font-display text-xl font-bold mb-1">Que souhaitez-vous faire ?</h2>
                <p className="text-sm text-muted-foreground mb-6">Choisissez votre première action sur la plateforme.</p>

                <div className="space-y-3 mb-4">
                  {[
                    { id: "sell" as const, icon: Briefcase, title: "Publier un bien à la vente", desc: "Créez une annonce et recevez des acquéreurs qualifiés" },
                    { id: "search" as const, icon: Search, title: "Rechercher un bien", desc: "Définissez vos critères et découvrez les opportunités" },
                    { id: "explore" as const, icon: Compass, title: "Explorer la plateforme", desc: "Découvrez Matchstone avant de vous lancer" },
                  ].map(action => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleFirstAction(action.id)}
                      className="w-full flex items-center gap-4 p-5 rounded-xl border-2 border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <action.icon size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold group-hover:text-primary transition-colors">{action.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{action.desc}</div>
                      </div>
                      <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Vous pourrez toujours faire les deux depuis votre dashboard.
                </p>

                <div className="mt-5 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => { setStep(0); setShowErr(false); }}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={16} /> Retour au profil
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
