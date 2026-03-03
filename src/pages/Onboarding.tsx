import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ArrowLeft, ArrowRight, Check, Upload, X, Loader2, Briefcase, TrendingUp, Home, PiggyBank, Landmark, Shield, Scale, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserSpace } from "@/contexts/UserSpaceContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/* ========== DATA ========== */
const TYPOS_ACTIF = ["Maison", "Immeuble", "Appartement", "Terrain à potentiel", "Local commercial", "Bureaux", "Entrepôt / activité", "Ensemble immobilier mixte"];
const ETATS = ["Neuf", "Très bon état", "Bon état", "À rafraîchir", "À rénover", "À restructurer", "À démolir"];
const ETAT_SUBS: Record<string, string> = {
  "Neuf": "Construction récente", "Très bon état": "Aucun travaux à prévoir", "Bon état": "Travaux mineurs possibles",
  "À rafraîchir": "Travaux cosmétiques", "À rénover": "Travaux importants", "À restructurer": "Rénovation lourde", "À démolir": "Démolition totale",
};
const STRUCTURES = ["SCI", "SCCV", "Holding immobilière", "Foncière"];
const NATURES = ["Résidentiel", "Tertiaire", "Mixte"];
const STADES = ["En montage", "Permis obtenu", "En commercialisation", "Actif stabilisé"];
const SUPPORTS = ["SCPI", "OPCI", "Fonds d'investissement immobilier"];
const STRATEGIES = ["Rendement", "Valorisation à long terme", "Diversification patrimoniale"];

const PROFILE_TYPES = [
  { id: "agent", label: "Agent immobilier", desc: "Transaction pour compte de tiers", icon: Briefcase },
  { id: "marchand", label: "Marchand de biens", desc: "Achat-revente et création de valeur", icon: TrendingUp },
  { id: "promoteur", label: "Promoteur", desc: "Développement foncier et VEFA", icon: Building2 },
  { id: "fonciere", label: "Foncière / SCI", desc: "Détention et arbitrage patrimonial", icon: Home },
  { id: "investisseur", label: "Investisseur", desc: "Investissement structuré", icon: PiggyBank },
  { id: "banque", label: "Banque / Finance", desc: "Financement et structuration", icon: Landmark },
  { id: "assureur", label: "Assureur / SCPI", desc: "Fonds immobiliers et gestion", icon: Shield },
  { id: "notaire", label: "Notaire / Avocat", desc: "Cessions et conseil juridique", icon: Scale },
];

/* ========== PRIMITIVES ========== */
function InfoBox({ children, icon = "ℹ️" }: { children: React.ReactNode; icon?: string }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex gap-3 items-start text-sm mb-4">
      <span className="text-base shrink-0">{icon}</span>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mt-5 mb-3 pb-2 border-b border-border">{children}</div>;
}

function CheckItem({ label, checked, onClick, sub, multi = true }: { label: string; checked: boolean; onClick: () => void; sub?: string; multi?: boolean }) {
  return (
    <button type="button" onClick={onClick}
      className={cn("w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left mb-2",
        checked ? "border-primary bg-primary/10 shadow-[0_0_16px_hsl(var(--primary)/0.12)]" : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50"
      )}>
      <div className={cn("w-5 h-5 shrink-0 flex items-center justify-center border-2 transition-all text-xs",
        multi ? "rounded-md" : "rounded-full",
        checked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
      )}>{checked && <Check size={12} />}</div>
      <div className="flex-1 min-w-0">
        <div className={cn("text-sm", checked ? "font-semibold text-foreground" : "text-foreground/80")}>{label}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
    </button>
  );
}

function RadioOption({ label, desc, selected, onClick }: { label: string; desc?: string; selected: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={cn("flex-1 p-3 rounded-xl border-2 text-center transition-all duration-200",
        selected ? "border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.1)]" : "border-border bg-secondary/30 hover:border-primary/40"
      )}>
      <div className={cn("text-sm font-semibold", selected ? "text-primary" : "text-foreground/80")}>{label}</div>
      {desc && <div className="text-[10px] text-muted-foreground mt-0.5">{desc}</div>}
    </button>
  );
}

function RadioGroup({ label, options, value, onChange, error }: { label: string; options: string[]; value: string | null; onChange: (v: string) => void; error?: string | null }) {
  return (
    <div className="mb-4">
      <Label className="mb-2 block">{label} <span className="text-destructive">*</span></Label>
      <div className="flex gap-2 flex-wrap">
        {options.map(o => <RadioOption key={o} label={o} selected={value === o} onClick={() => onChange(o)} />)}
      </div>
      {error && <p className="text-xs text-destructive mt-1">⚠ {error}</p>}
    </div>
  );
}

function UploadZone({ label, files, onAdd, onRemove, accept, hint, icon = "📎" }: {
  label: string; files: { name: string; size: string; icon: string }[];
  onAdd: () => void; onRemove: (i: number) => void; accept?: string; hint?: string; icon?: string;
}) {
  return (
    <div className="mb-5">
      <Label className="mb-2 block">{label}</Label>
      <div onClick={onAdd}
        className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer bg-secondary/20 hover:border-primary/40 hover:bg-secondary/40 transition-all">
        <div className="text-3xl mb-2">{icon}</div>
        <div className="text-sm text-muted-foreground">Cliquez ou glissez-déposez vos fichiers ici</div>
        {accept && <div className="text-[11px] text-muted-foreground/70 mt-2">{accept}</div>}
      </div>
      {hint && <div className="text-[11px] text-muted-foreground mt-2">{hint}</div>}
      {files.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 bg-secondary/40 rounded-lg border border-border">
              <span className="text-base">{f.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-foreground truncate">{f.name}</div>
                <div className="text-[10px] text-muted-foreground">{f.size}</div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onRemove(i); }} className="text-muted-foreground hover:text-destructive transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StepperBar({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="glass-card rounded-xl p-4 mb-6 flex items-center justify-center gap-1 overflow-x-auto">
      {labels.map((l, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center" style={{ width: 56 }}>
            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
              i < current ? "bg-primary border-primary text-primary-foreground"
                : i === current ? "border-primary text-primary bg-primary/10" : "border-muted text-muted-foreground"
            )}>{i < current ? <Check size={12} /> : i + 1}</div>
            <div className={cn("text-[8px] mt-1 text-center leading-tight", i <= current ? "text-primary font-semibold" : "text-muted-foreground")}>{l}</div>
          </div>
          {i < labels.length - 1 && <div className={cn("w-4 h-0.5 mb-3", i < current ? "bg-primary" : "bg-muted")} />}
        </div>
      ))}
    </div>
  );
}

function InputField({ label, placeholder, value, onChange, suffix, error, required = true, type = "text" }: {
  label: string; placeholder?: string; value: string; onChange: (v: string) => void;
  suffix?: string; error?: string | null; required?: boolean; type?: string;
}) {
  return (
    <div className="mb-4">
      <Label>{label} {required ? <span className="text-destructive">*</span> : <span className="text-[10px] text-muted-foreground font-normal">(facultatif)</span>}</Label>
      <div className="relative mt-1.5">
        <Input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
          className={cn("bg-secondary border-border", suffix && "pr-10")} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-destructive mt-1">⚠ {error}</p>}
    </div>
  );
}

/* ========== MAIN ========== */
export default function Onboarding() {
  const navigate = useNavigate();
  const { setSpace } = useUserSpace();
  const { signIn, signUp, resetPassword } = useAuth();
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

  // Steps: 0=profil pro, 1=action métier, 2=opération, 3=intro, 4=questionnaire, 5=confirm
  const [step, setStep] = useState(0);
  const [qStep, setQStep] = useState(0);
  const [showErr, setShowErr] = useState(false);

  // Step 0: Professional profile
  const [proType, setProType] = useState("");
  const [proCompany, setProCompany] = useState("");
  const [proSiret, setProSiret] = useState("");
  const [proStatut, setProStatut] = useState("");
  const [proParticipation, setProParticipation] = useState("");
  const [proPoste, setProPoste] = useState("");
  const [proCarteT, setProCarteT] = useState("");
  const [proCarteTDate, setProCarteTDate] = useState<Date | undefined>(undefined);
  const [proDeclaration, setProDeclaration] = useState("");

  // Step 1: Action métier (vendeur/acquéreur)
  const [roles, setRoles] = useState<string[]>([]);
  const [opType, setOpType] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<string | null>(null);

  // Vendeur Actif
  const [vTypo, setVTypo] = useState<string[]>([]);
  const [vSurfB, setVSurfB] = useState(""); const [vSurfT, setVSurfT] = useState("");
  const [vNiv, setVNiv] = useState(""); const [vLots, setVLots] = useState("");
  const [vConst, setVConst] = useState<string | null>(null); const [vDiv, setVDiv] = useState<string | null>(null);
  const [vPLU, setVPLU] = useState(""); const [vEmp, setVEmp] = useState(""); const [vHaut, setVHaut] = useState("");
  const [vEtat, setVEtat] = useState<string | null>(null);
  const [vPrix, setVPrix] = useState(""); const [vCond, setVCond] = useState<string | null>(null);
  const [vAdr, setVAdr] = useState(""); const [vVille, setVVille] = useState("");
  const [vPhotos, setVPhotos] = useState<{ name: string; size: string; icon: string }[]>([]);
  const [vDocs, setVDocs] = useState<{ name: string; size: string; icon: string }[]>([]);

  // Vendeur Parts
  const [vpStruct, setVpStruct] = useState<string[]>([]);
  const [vpNature, setVpNature] = useState<string | null>(null);
  const [vpStade, setVpStade] = useState<string | null>(null);
  const [vpValo, setVpValo] = useState(""); const [vpRend, setVpRend] = useState(""); const [vpTRI, setVpTRI] = useState("");
  const [vpHorizon, setVpHorizon] = useState("");
  const [vpLoc, setVpLoc] = useState("");
  const [vpDocs, setVpDocs] = useState<{ name: string; size: string; icon: string }[]>([]);

  // Vendeur Invest
  const [viSupport, setViSupport] = useState<string[]>([]);
  const [viStrat, setViStrat] = useState<string | null>(null);
  const [viTicket, setViTicket] = useState(""); const [viRend, setViRend] = useState("");
  const [viRisque, setViRisque] = useState<string | null>(null); const [viDuree, setViDuree] = useState("");
  const [viDocs, setViDocs] = useState<{ name: string; size: string; icon: string }[]>([]);

  // Acquéreur Actif
  const [aTypo, setATypo] = useState<string[]>([]);
  const [aSurfBMin, setASurfBMin] = useState(""); const [aSurfBMax, setASurfBMax] = useState("");
  const [aSurfTMin, setASurfTMin] = useState(""); const [aSurfTMax, setASurfTMax] = useState("");
  const [aLotsMin, setALotsMin] = useState(""); const [aLotsMax, setALotsMax] = useState("");
  const [aConst, setAConst] = useState<string | null>(null); const [aDiv, setADiv] = useState<string | null>(null);
  const [aEtats, setAEtats] = useState<string[]>([]);
  const [aBudgMin, setABudgMin] = useState(""); const [aBudgMax, setABudgMax] = useState("");
  const [aAdr, setAAdr] = useState(""); const [aRayon, setARayon] = useState<string | null>(null);

  // Acquéreur Parts
  const [apStruct, setApStruct] = useState<string[]>([]);
  const [apNature, setApNature] = useState<string | null>(null);
  const [apStades, setApStades] = useState<string[]>([]);
  const [apBudgMin, setApBudgMin] = useState(""); const [apBudgMax, setApBudgMax] = useState("");
  const [apRendMin, setApRendMin] = useState(""); const [apTRI, setApTRI] = useState("");
  const [apHorizon, setApHorizon] = useState<string | null>(null);
  const [apLoc, setApLoc] = useState("");

  // Acquéreur Invest
  const [aiSupport, setAiSupport] = useState<string[]>([]);
  const [aiObj, setAiObj] = useState<string | null>(null);
  const [aiBudgMin, setAiBudgMin] = useState(""); const [aiBudgMax, setAiBudgMax] = useState("");
  const [aiHorizon, setAiHorizon] = useState<string | null>(null);
  const [aiRisque, setAiRisque] = useState<string | null>(null);

  const toggleArr = (arr: string[], set: (v: string[]) => void, v: string) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);
  const tryNext = (ok: boolean, fn: () => void) => { setShowErr(true); if (ok) { setShowErr(false); fn(); } };

  const addFakePhoto = () => setVPhotos(p => [...p, { name: `photo_${p.length + 1}.jpg`, size: "2.4 MB", icon: "🖼️" }]);
  const addFakeDoc = (setter: React.Dispatch<React.SetStateAction<{ name: string; size: string; icon: string }[]>>) =>
    setter(p => [...p, { name: `document_${p.length + 1}.pdf`, size: "1.1 MB", icon: "📄" }]);

  // Dynamic labels for questionnaire sub-steps
  const getQLabels = (): string[] => {
    if (activeRole === "vendeur") {
      if (opType === "actif") return ["Typologie", "Surfaces", "Urbanisme", "État", "Prix", "Localisation", "Photos", "Data Room"];
      if (opType === "parts") return ["Structure", "Actifs", "Stade", "Finances", "Horizon", "Localisation", "Documents"];
      return ["Support", "Stratégie", "Conditions", "Documents"];
    } else {
      if (opType === "actif") return ["Typologie", "Surfaces", "Structure", "Urbanisme", "État", "Budget", "Zone géo"];
      if (opType === "parts") return ["Structure", "Actifs", "Stade", "Finances", "Horizon", "Zone géo"];
      return ["Support", "Objectif", "Montant", "Horizon", "Risque"];
    }
  };
  const qLabels = getQLabels();

  // Progress: profil pro + action + opération + intro + questionnaire steps + confirm
  const topLevelSteps = 4; // profil pro, action, opération, intro
  const totalSteps = topLevelSteps + qLabels.length + 1; // +1 for confirm
  const currentStep = step <= 3 ? step + 1 : step === 5 ? totalSteps : topLevelSteps + qStep + 1;
  const stepLabels = ["Profil pro", "Action", "Opération", "Introduction"];
  const currentLabel = step <= 3 ? stepLabels[step] : step === 5 ? "Confirmation" : qLabels[qStep];
  const progress = (currentStep / totalSteps) * 100;

  const handleFinish = () => {
    // If dual role and first role done, switch to second
    if (roles.length === 2 && roles.indexOf(activeRole!) === 0) {
      setActiveRole(roles[1]);
      setOpType(null);
      setStep(2); // back to operation type for second role
      setQStep(0);
      setShowErr(false);
      return;
    }
    if (roles.includes("vendeur")) setSpace("vendeur");
    else setSpace("acquereur");
    navigate("/dashboard", { replace: true });
  };

  const goQNext = () => { if (qStep < qLabels.length - 1) setQStep(qStep + 1); else setStep(5); };
  const goQBack = () => { setShowErr(false); if (qStep > 0) setQStep(qStep - 1); else setStep(3); };

  const anim = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 }, transition: { duration: 0.25 } };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSubmitted(true);
    if (!authEmail || !authPassword) return;
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setAuthDone(true);
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

  // ==================== AUTH GATE ====================
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
        <div className="flex-1 flex items-center justify-center px-5 py-10">
          <AnimatePresence mode="wait">
            {/* LOGIN */}
            {authView === "login" && (
              <motion.div key="login" {...anim} className="w-full max-w-md">
                <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
                  <div className="text-center mb-6">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-4">Étape 1 sur 3 · Connexion</span>
                    <h1 className="font-display text-2xl font-bold mb-1">Connexion</h1>
                    <p className="text-sm text-muted-foreground">Accédez à votre compte Matchstone.</p>
                  </div>
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
                    <div className="text-center pt-2">
                      <p className="text-sm text-muted-foreground mb-2">Pas de compte ?</p>
                      <Button type="button" variant="outline" className="w-full h-11 text-base font-bold border-primary/40 text-primary hover:bg-primary/10"
                        onClick={() => { setAuthView("register"); setAuthSubmitted(false); }}>
                        Créer un compte
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {/* REGISTER */}
            {authView === "register" && (
              <motion.div key="register" {...anim} className="w-full max-w-md">
                <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
                  <div className="text-center mb-6">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-4">Étape 1 sur 3 · Créer un compte</span>
                    <h1 className="font-display text-2xl font-bold mb-1">Créer un compte</h1>
                    <p className="text-sm text-muted-foreground">Accès technique à la plateforme Matchstone.</p>
                  </div>
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

  // ==================== ONBOARDING STEPS ====================
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Building2 className="text-primary" size={22} />
            <span className="font-display text-lg font-bold">Match<span className="text-primary">stone</span></span>
          </div>
          <span className="text-xs text-muted-foreground">{currentStep}/{totalSteps} — {currentLabel}</span>
          <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Sauvegarder & quitter</button>
        </div>
        <div className="h-0.5 bg-muted">
          <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
        </div>
      </header>

      <div className="max-w-[600px] mx-auto px-5 py-8">
        <AnimatePresence mode="wait">

          {/* ==================== STEP 0: Profil professionnel ==================== */}
          {step === 0 && (
            <motion.div key="profil-pro" {...anim}>
              <div className="glass-card rounded-xl p-6 shadow-card">
                <div className="text-center mb-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-4">Étape 2 sur 3 · Profil professionnel</span>
                </div>
                <h2 className="font-display text-xl font-bold mb-1">Complétez votre profil professionnel</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Votre identité sur Matchstone : elle permet aux autres membres de vous identifier et de vous faire confiance.
                </p>

                <InfoBox icon="👤">Le profil professionnel est distinct de vos annonces ou fiches de recherche. Il représente <strong className="text-foreground">qui vous êtes</strong> sur la plateforme.</InfoBox>

                <SectionLabel>Votre activité principale</SectionLabel>
                <div className="grid grid-cols-2 gap-3 mb-2">
                  {PROFILE_TYPES.map((p) => {
                    const selected = proType === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setProType(p.id)}
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
                {showErr && !proType && <p className="text-xs text-destructive mb-3">⚠ Sélectionnez votre activité principale.</p>}

                <SectionLabel>Informations société</SectionLabel>
                <InputField label="Nom de la société" placeholder="ex : SCI Patrimoine" value={proCompany} onChange={setProCompany} error={showErr && !proCompany ? "Obligatoire" : null} />
                <InputField label="SIRET" placeholder="ex : 123 456 789 00012" value={proSiret} onChange={setProSiret} required={false} />

                <div className="mb-4">
                  <Label>Statut dans la structure <span className="text-destructive">*</span></Label>
                  <Select value={proStatut} onValueChange={(v) => { setProStatut(v); setProParticipation(""); setProPoste(""); }}>
                    <SelectTrigger className={cn("mt-1.5 bg-secondary border-border", showErr && !proStatut && "border-destructive ring-destructive/30 ring-2")}>
                      <SelectValue placeholder="Sélectionnez votre statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Gérant", "Président", "Associé", "Employé"].map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {showErr && !proStatut && <p className="text-xs text-destructive mt-1">⚠ Obligatoire</p>}
                </div>

                <AnimatePresence mode="wait">
                  {proStatut === "Associé" && (
                    <motion.div key="participation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                      <InputField label="Participation" placeholder="ex : 40% ou 200 parts sur 500" value={proParticipation} onChange={setProParticipation} required={false} />
                    </motion.div>
                  )}
                  {proStatut === "Employé" && (
                    <motion.div key="poste" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                      <InputField label="Poste occupé" placeholder="ex : Responsable acquisitions" value={proPoste} onChange={setProPoste} required={false} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {proType === "agent" && (
                    <motion.div key="carte-t" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                      <SectionLabel>Carte professionnelle</SectionLabel>
                      <InputField label="N° Carte professionnelle (Carte T)" placeholder="ex : CPI 7501 2023 000 000 001" value={proCarteT} onChange={setProCarteT} required={false} />
                      <div className="mb-4">
                        <Label>Date de validité <span className="text-[10px] text-muted-foreground font-normal">(facultatif)</span></Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full mt-1.5 justify-start text-left font-normal bg-secondary border-border", !proCarteTDate && "text-muted-foreground")}>
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {proCarteTDate ? format(proCarteTDate, "dd MMMM yyyy", { locale: fr }) : "Sélectionnez une date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={proCarteTDate} onSelect={setProCarteTDate} locale={fr} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </motion.div>
                  )}
                  {proType === "marchand" && (
                    <motion.div key="declaration" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
                      <SectionLabel>Informations réglementaires</SectionLabel>
                      <InputField label="N° Déclaration d'activité" placeholder="ex : 2023-001234" value={proDeclaration} onChange={setProDeclaration} required={false} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button className="w-full glow-gold mt-4" onClick={() => tryNext(!!(proType && proCompany && proStatut), () => setStep(1))}>
                  Continuer <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ==================== STEP 1: Action métier ==================== */}
          {step === 1 && (
            <motion.div key="action-metier" {...anim}>
              <div className="glass-card rounded-xl p-6 shadow-card">
                <div className="text-center mb-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 mb-4">Étape 3 sur 3 · Action métier</span>
                </div>
                <h2 className="font-display text-xl font-bold mb-1">Que souhaitez-vous faire ?</h2>
                <p className="text-sm text-muted-foreground mb-6">Choisissez votre première action. Vous pourrez toujours en ajouter d'autres plus tard.</p>

                <InfoBox icon="💡">Votre profil professionnel est enregistré. Vous allez maintenant créer votre première <strong className="text-foreground">annonce vendeur</strong> ou <strong className="text-foreground">fiche de recherche acquéreur</strong>.</InfoBox>

                <div className="flex gap-4 mb-4">
                  {[
                    { id: "vendeur", icon: "🏢", t: "Créer une annonce vendeur", d: "Publiez un bien à vendre et recevez des acquéreurs qualifiés" },
                    { id: "acquereur", icon: "🔍", t: "Créer une fiche acquéreur", d: "Définissez vos critères de recherche et recevez des opportunités ciblées" },
                  ].map(r => (
                    <button key={r.id} type="button" onClick={() => toggleArr(roles, setRoles, r.id)}
                      className={cn("flex-1 p-5 rounded-xl text-center border-2 transition-all duration-200",
                        roles.includes(r.id) ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
                          : showErr && roles.length === 0 ? "border-destructive/60 bg-secondary/30" : "border-border bg-secondary/30 hover:border-primary/40"
                      )}>
                      <div className="text-4xl mb-3">{r.icon}</div>
                      <div className="text-base font-bold mb-1">{r.t}</div>
                      <div className="text-xs text-muted-foreground leading-snug">{r.d}</div>
                      {roles.includes(r.id) && <div className="mt-3 text-primary text-xl font-bold">✓</div>}
                    </button>
                  ))}
                </div>
                {showErr && roles.length === 0 && <p className="text-xs text-destructive mb-3">⚠ Sélectionnez au moins une action.</p>}
                {roles.length === 2 && <InfoBox icon="💡">Vous remplirez d'abord l'annonce vendeur, puis la fiche acquéreur.</InfoBox>}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(0)}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                  <Button className="flex-1 glow-gold" onClick={() => tryNext(roles.length > 0, () => {
                    setActiveRole(roles.includes("vendeur") ? "vendeur" : "acquereur");
                    setStep(2);
                  })}>Continuer <ArrowRight className="ml-2" size={16} /></Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== STEP 2: Type d'opération ==================== */}
          {step === 2 && (
            <motion.div key="operation" {...anim}>
              <div className="glass-card rounded-xl p-6 shadow-card">
                <h2 className="font-display text-xl font-bold mb-1">Quel type d'opération ?</h2>
                <p className="text-sm text-muted-foreground mb-6">{activeRole === "vendeur" ? "Que souhaitez-vous vendre ?" : "Que recherchez-vous ?"}</p>
                {[
                  { id: "actif", icon: "🏠", t: "Actif immobilier", d: "Maison, immeuble, terrain, bureaux..." },
                  { id: "parts", icon: "📑", t: "Parts / société immobilière", d: "SCI, SCCV, holding, foncière..." },
                  { id: "invest", icon: "📊", t: "Investissement financier", d: "SCPI, OPCI, fonds immobilier" },
                ].map(o => (
                  <button key={o.id} type="button" onClick={() => setOpType(o.id)}
                    className={cn("w-full p-4 rounded-xl mb-2 flex items-center gap-4 border-2 transition-all text-left",
                      opType === o.id ? "border-primary bg-primary/10" : showErr && !opType ? "border-destructive/60 bg-secondary/30" : "border-border bg-secondary/30 hover:border-primary/40"
                    )}>
                    <div className="text-2xl w-10 text-center">{o.icon}</div>
                    <div className="flex-1"><div className="text-sm font-bold">{o.t}</div><div className="text-xs text-muted-foreground mt-0.5">{o.d}</div></div>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs",
                      opType === o.id ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                    )}>{opType === o.id && <Check size={10} />}</div>
                  </button>
                ))}
                {showErr && !opType && <p className="text-xs text-destructive mt-2">⚠ Sélectionnez un type d'opération.</p>}
                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                  <Button className="flex-1 glow-gold" onClick={() => tryNext(!!opType, () => setStep(3))}>Continuer <ArrowRight className="ml-2" size={16} /></Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== STEP 3: Introduction ==================== */}
          {step === 3 && (
            <motion.div key="intro" {...anim}>
              <div className="glass-card rounded-xl p-6 shadow-card text-center">
                <h2 className="font-display text-xl font-bold mb-1">
                  {activeRole === "vendeur" ? "Créer votre annonce vendeur" : "Créer votre fiche de recherche acquéreur"}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {activeRole === "vendeur"
                    ? "Renseignez les informations de votre bien pour être mis en relation avec des acquéreurs qualifiés."
                    : "Définissez vos critères pour recevoir des opportunités pertinentes."}
                </p>
                <div className="text-5xl mb-4">{activeRole === "vendeur" ? "📋" : "🔍"}</div>

                <InfoBox icon="⚠️">
                  {activeRole === "vendeur"
                    ? "Vous allez créer une <strong class='text-foreground'>annonce de vente</strong>, pas modifier votre profil. Votre profil professionnel est déjà enregistré."
                    : "Vous allez créer une <strong class='text-foreground'>fiche de recherche</strong>, pas modifier votre profil. Votre profil professionnel est déjà enregistré."}
                </InfoBox>

                <div className="flex justify-center gap-10 mb-8">
                  {[{ n: String(qLabels.length), l: "étapes" }, { n: "~5", l: "minutes" }, { n: "100%", l: "obligatoire" }].map(s => (
                    <div key={s.l} className="text-center">
                      <div className="text-2xl font-bold text-foreground">{s.n}</div>
                      <div className="text-xs text-muted-foreground">{s.l}</div>
                    </div>
                  ))}
                </div>
                <InfoBox icon="⚡">Tous les champs marqués <span className="text-destructive font-bold">*</span> sont obligatoires.</InfoBox>
                {activeRole === "vendeur" && <InfoBox icon="🔒">L'adresse exacte ne sera jamais publique.</InfoBox>}
                <InfoBox icon="💾">Progression sauvegardée automatiquement.</InfoBox>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => { setStep(2); setShowErr(false); }}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                  <Button className="flex-1 glow-gold" onClick={() => { setStep(4); setQStep(0); }}>Commencer <ArrowRight className="ml-2" size={16} /></Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== STEP 4: Questionnaire ==================== */}
          {step === 4 && (
            <motion.div key={`q-${activeRole}-${opType}-${qStep}`} {...anim}>
              <StepperBar current={qStep} labels={qLabels} />

              {/* ===== VENDEUR ACTIF ===== */}
              {activeRole === "vendeur" && opType === "actif" && (<>
                {qStep === 0 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">A/ Typologie du bien</h2>
                  <p className="text-sm text-muted-foreground mb-5">Type de bien proposé à la vente.</p>
                  {TYPOS_ACTIF.map(t => <CheckItem key={t} label={t} checked={vTypo.includes(t)} onClick={() => toggleArr(vTypo, setVTypo, t)} />)}
                  {showErr && !vTypo.length && <p className="text-xs text-destructive mt-2">⚠ Sélectionnez au moins une typologie.</p>}
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={() => { setStep(3); setShowErr(false); }}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(vTypo.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button>
                  </div>
                </div>}

                {qStep === 1 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">B/ Surfaces & structure</h2>
                  <p className="text-sm text-muted-foreground mb-4">Données exactes, pas d'approximation.</p>
                  <InfoBox icon="📐">Ces données servent directement au matching.</InfoBox>
                  <InputField label="Surface bâtie totale" type="number" placeholder="ex : 250" value={vSurfB} onChange={setVSurfB} suffix="m²" error={showErr && !vSurfB ? "Obligatoire" : null} />
                  <InputField label="Surface terrain" type="number" placeholder="ex : 500" value={vSurfT} onChange={setVSurfT} suffix="m²" error={showErr && !vSurfT ? "Obligatoire" : null} />
                  <InputField label="Nombre de niveaux" type="number" placeholder="ex : 3" value={vNiv} onChange={setVNiv} required={false} />
                  <InputField label="Nombre de lots" type="number" placeholder="ex : 6" value={vLots} onChange={setVLots} required={false} />
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(!!(vSurfB && vSurfT), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button>
                  </div>
                </div>}

                {qStep === 2 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">C/ Données d'urbanisme</h2>
                  <RadioGroup label="Constructible" options={["Oui", "Non", "Partiellement"]} value={vConst} onChange={setVConst} error={showErr && !vConst ? "Obligatoire" : null} />
                  <RadioGroup label="Divisible" options={["Oui", "Non", "Sous conditions"]} value={vDiv} onChange={setVDiv} error={showErr && !vDiv ? "Obligatoire" : null} />
                  <InputField label="Zone PLU" placeholder="ex : UB2" value={vPLU} onChange={setVPLU} required={false} />
                  <InputField label="Emprise au sol max" placeholder="ex : 70" value={vEmp} onChange={setVEmp} suffix="%" required={false} />
                  <InputField label="Hauteur max" placeholder="ex : 12" value={vHaut} onChange={setVHaut} suffix="m" required={false} />
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(!!(vConst && vDiv), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button>
                  </div>
                </div>}

                {qStep === 3 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">D/ État du bien</h2>
                  <p className="text-sm text-muted-foreground mb-5">Évaluation honnête de l'état actuel.</p>
                  {ETATS.map(e => <CheckItem key={e} label={e} sub={ETAT_SUBS[e]} checked={vEtat === e} onClick={() => setVEtat(e)} multi={false} />)}
                  {showErr && !vEtat && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(!!vEtat, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button>
                  </div>
                </div>}

                {qStep === 4 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">E/ Prix & conditions</h2>
                  <InputField label="Prix de vente" type="number" placeholder="2500000" value={vPrix} onChange={setVPrix} suffix="€" error={showErr && !vPrix ? "Obligatoire" : null} />
                  <RadioGroup label="Condition de vente" options={["Prix ferme", "Négociable", "Offres acceptées"]} value={vCond} onChange={setVCond} error={showErr && !vCond ? "Obligatoire" : null} />
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(!!(vPrix && vCond), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button>
                  </div>
                </div>}

                {qStep === 5 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">F/ Localisation</h2>
                  <InfoBox icon="🔒">L'adresse exacte ne sera jamais affichée publiquement.</InfoBox>
                  <InputField label="Adresse complète" placeholder="12 rue de la Paix, 75002 Paris" value={vAdr} onChange={setVAdr} error={showErr && !vAdr ? "Obligatoire" : null} />
                  <InputField label="Ville" placeholder="Paris" value={vVille} onChange={setVVille} error={showErr && !vVille ? "Obligatoire" : null} />
                  <div className="h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm mb-4">🗺️ Aperçu carte</div>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(!!(vAdr && vVille), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button>
                  </div>
                </div>}

                {qStep === 6 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">G/ Photos du bien</h2>
                  <UploadZone label="Photos" files={vPhotos} onAdd={addFakePhoto} onRemove={i => setVPhotos(p => p.filter((_, j) => j !== i))} accept="JPG, PNG, WEBP" hint="Min. 3 photos recommandées, max. 20." icon="📸" />
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                    <Button className="flex-1 glow-gold" onClick={goQNext}>Continuer <ArrowRight className="ml-2" size={16} /></Button>
                  </div>
                </div>}

                {qStep === 7 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">H/ Data Room</h2>
                  <InfoBox icon="🔒">Ces documents seront accessibles uniquement aux acquéreurs que vous autorisez.</InfoBox>
                  <UploadZone label="Documents confidentiels" files={vDocs} onAdd={() => addFakeDoc(setVDocs)} onRemove={i => setVDocs(p => p.filter((_, j) => j !== i))} accept="PDF, DOC, XLS" icon="📂" />
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                    <Button className="flex-1 glow-gold" onClick={goQNext}>Publier l'annonce <Check className="ml-2" size={16} /></Button>
                  </div>
                </div>}
              </>)}

              {/* ===== VENDEUR PARTS ===== */}
              {activeRole === "vendeur" && opType === "parts" && (<>
                {qStep === 0 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">A/ Structure juridique</h2>
                  {STRUCTURES.map(s => <CheckItem key={s} label={s} checked={vpStruct.includes(s)} onClick={() => toggleArr(vpStruct, setVpStruct, s)} />)}
                  {showErr && !vpStruct.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(vpStruct.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 1 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">B/ Nature des actifs</h2>
                  {NATURES.map(n => <CheckItem key={n} label={n} checked={vpNature === n} onClick={() => setVpNature(n)} multi={false} />)}
                  {showErr && !vpNature && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!vpNature, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 2 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">C/ Stade du projet</h2>
                  {STADES.map(s => <CheckItem key={s} label={s} checked={vpStade === s} onClick={() => setVpStade(s)} multi={false} />)}
                  {showErr && !vpStade && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!vpStade, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 3 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">D/ Données financières</h2>
                  <InputField label="Valorisation / prix de cession" type="number" placeholder="2000000" value={vpValo} onChange={setVpValo} suffix="€" error={showErr && !vpValo ? "Obligatoire" : null} />
                  <InputField label="Rendement actuel ou prévisionnel" placeholder="5.2" value={vpRend} onChange={setVpRend} suffix="%" error={showErr && !vpRend ? "Obligatoire" : null} />
                  <InputField label="TRI estimé" placeholder="8" value={vpTRI} onChange={setVpTRI} suffix="%" required={false} />
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(vpValo && vpRend), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 4 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">E/ Horizon</h2>
                  <InputField label="Durée de détention restante ou cible" placeholder="ex : 5 ans" value={vpHorizon} onChange={setVpHorizon} error={showErr && !vpHorizon ? "Obligatoire" : null} />
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!vpHorizon, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 5 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">F/ Localisation des actifs</h2>
                  <InputField label="Ville / zone géographique" placeholder="Paris, Lyon, Bordeaux..." value={vpLoc} onChange={setVpLoc} error={showErr && !vpLoc ? "Obligatoire" : null} />
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!vpLoc, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 6 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">G/ Documents Data Room</h2>
                  <UploadZone label="Documents confidentiels" files={vpDocs} onAdd={() => addFakeDoc(setVpDocs)} onRemove={i => setVpDocs(p => p.filter((_, j) => j !== i))} accept="PDF, DOC, XLS" icon="📂" />
                  <InfoBox icon="🔒">Accessibles uniquement aux acquéreurs autorisés.</InfoBox>
                  <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={goQNext}>Publier l'annonce <Check className="ml-2" size={16} /></Button></div>
                </div>}
              </>)}

              {/* ===== VENDEUR INVEST ===== */}
              {activeRole === "vendeur" && opType === "invest" && (<>
                {qStep === 0 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">A/ Type de support</h2>
                  {SUPPORTS.map(s => <CheckItem key={s} label={s} checked={viSupport.includes(s)} onClick={() => toggleArr(viSupport, setViSupport, s)} />)}
                  {showErr && !viSupport.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(viSupport.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 1 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">B/ Stratégie</h2>
                  {STRATEGIES.map(s => <CheckItem key={s} label={s} checked={viStrat === s} onClick={() => setViStrat(s)} multi={false} />)}
                  {showErr && !viStrat && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!viStrat, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 2 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">C/ Conditions</h2>
                  <InputField label="Ticket minimum" type="number" placeholder="5000" value={viTicket} onChange={setViTicket} suffix="€" error={showErr && !viTicket ? "Obligatoire" : null} />
                  <InputField label="Rendement cible" placeholder="4.5" value={viRend} onChange={setViRend} suffix="%" error={showErr && !viRend ? "Obligatoire" : null} />
                  <RadioGroup label="Niveau de risque" options={["Faible", "Modéré", "Dynamique"]} value={viRisque} onChange={setViRisque} error={showErr && !viRisque ? "Obligatoire" : null} />
                  <InputField label="Durée de placement recommandée" placeholder="ex : 8 ans" value={viDuree} onChange={setViDuree} error={showErr && !viDuree ? "Obligatoire" : null} />
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(viTicket && viRend && viRisque && viDuree), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 3 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">D/ Documents</h2>
                  <UploadZone label="Documents" files={viDocs} onAdd={() => addFakeDoc(setViDocs)} onRemove={i => setViDocs(p => p.filter((_, j) => j !== i))} accept="PDF, DOC" icon="📂" />
                  <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={goQNext}>Publier l'annonce <Check className="ml-2" size={16} /></Button></div>
                </div>}
              </>)}

              {/* ===== ACQUÉREUR ACTIF ===== */}
              {activeRole === "acquereur" && opType === "actif" && (<>
                {qStep === 0 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">A/ Typologie recherchée</h2>
                  <p className="text-sm text-muted-foreground mb-5">Quel(s) type(s) de bien ?</p>
                  {TYPOS_ACTIF.map(t => <CheckItem key={t} label={t} checked={aTypo.includes(t)} onClick={() => toggleArr(aTypo, setATypo, t)} />)}
                  {showErr && !aTypo.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(aTypo.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}

                {qStep === 1 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">B/ Surfaces recherchées</h2>
                  <p className="text-sm text-muted-foreground mb-4">Définissez vos fourchettes.</p>
                  <InfoBox icon="📐">Les fourchettes permettent un matching précis avec les biens disponibles.</InfoBox>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Surface bâtie min" type="number" placeholder="100" value={aSurfBMin} onChange={setASurfBMin} suffix="m²" error={showErr && !aSurfBMin ? "Obligatoire" : null} />
                    <InputField label="Surface bâtie max" type="number" placeholder="500" value={aSurfBMax} onChange={setASurfBMax} suffix="m²" error={showErr && !aSurfBMax ? "Obligatoire" : showErr && +aSurfBMax < +aSurfBMin ? "Max < min" : null} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Surface terrain min" type="number" placeholder="200" value={aSurfTMin} onChange={setASurfTMin} suffix="m²" error={showErr && !aSurfTMin ? "Obligatoire" : null} />
                    <InputField label="Surface terrain max" type="number" placeholder="2000" value={aSurfTMax} onChange={setASurfTMax} suffix="m²" error={showErr && !aSurfTMax ? "Obligatoire" : showErr && +aSurfTMax < +aSurfTMin ? "Max < min" : null} />
                  </div>
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(aSurfBMin && aSurfBMax && aSurfTMin && aSurfTMax) && +aSurfBMax >= +aSurfBMin && +aSurfTMax >= +aSurfTMin, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}

                {qStep === 2 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">C/ Structure acceptée</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Lots minimum" type="number" placeholder="1" value={aLotsMin} onChange={setALotsMin} error={showErr && !aLotsMin ? "Obligatoire" : null} />
                    <InputField label="Lots maximum" type="number" placeholder="20" value={aLotsMax} onChange={setALotsMax} required={false} />
                  </div>
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!aLotsMin, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}

                {qStep === 3 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">D/ Contraintes d'urbanisme</h2>
                  <RadioGroup label="Constructible obligatoire ?" options={["Oui", "Non", "Peu importe"]} value={aConst} onChange={setAConst} error={showErr && !aConst ? "Obligatoire" : null} />
                  <RadioGroup label="Division" options={["Obligatoire", "Souhaitée", "Peu importe"]} value={aDiv} onChange={setADiv} error={showErr && !aDiv ? "Obligatoire" : null} />
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(aConst && aDiv), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}

                {qStep === 4 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">E/ État du bien accepté</h2>
                  <p className="text-sm text-muted-foreground mb-5">Plusieurs choix possibles.</p>
                  {["Bon état", "À rafraîchir", "À rénover", "À restructurer", "À démolir"].map(e => <CheckItem key={e} label={e} checked={aEtats.includes(e)} onClick={() => toggleArr(aEtats, setAEtats, e)} />)}
                  {showErr && !aEtats.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(aEtats.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}

                {qStep === 5 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">F/ Budget</h2>
                  <p className="text-sm text-muted-foreground mb-5">Fourchette obligatoire.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Budget min" type="number" placeholder="200000" value={aBudgMin} onChange={setABudgMin} suffix="€" error={showErr && !aBudgMin ? "Obligatoire" : null} />
                    <InputField label="Budget max" type="number" placeholder="600000" value={aBudgMax} onChange={setABudgMax} suffix="€" error={showErr && !aBudgMax ? "Obligatoire" : showErr && +aBudgMax < +aBudgMin ? "Max < min" : null} />
                  </div>
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(aBudgMin && aBudgMax) && +aBudgMax >= +aBudgMin, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}

                {qStep === 6 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">G/ Zone géographique</h2>
                  <InputField label="Point central (adresse ou GPS)" placeholder="Paris 8e" value={aAdr} onChange={setAAdr} error={showErr && !aAdr ? "Obligatoire" : null} />
                  <RadioGroup label="Rayon de recherche" options={["1 km", "5 km", "10 km", "20 km", "Personnalisé"]} value={aRayon} onChange={setARayon} error={showErr && !aRayon ? "Obligatoire" : null} />
                  <div className="h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm mb-4">🗺️ Aperçu zone</div>
                  <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(aAdr && aRayon), goQNext)}>Valider ma fiche <Check className="ml-2" size={16} /></Button></div>
                </div>}
              </>)}

              {/* ===== ACQUÉREUR PARTS ===== */}
              {activeRole === "acquereur" && opType === "parts" && (<>
                {qStep === 0 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">A/ Type de structure recherchée</h2>
                  {STRUCTURES.map(s => <CheckItem key={s} label={s} checked={apStruct.includes(s)} onClick={() => toggleArr(apStruct, setApStruct, s)} />)}
                  {showErr && !apStruct.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(apStruct.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 1 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">B/ Nature des actifs recherchés</h2>
                  {NATURES.map(n => <CheckItem key={n} label={n} checked={apNature === n} onClick={() => setApNature(n)} multi={false} />)}
                  {showErr && !apNature && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!apNature, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 2 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">C/ Stade de projet accepté</h2>
                  <p className="text-sm text-muted-foreground mb-5">Plusieurs choix possibles.</p>
                  {STADES.map(s => <CheckItem key={s} label={s} checked={apStades.includes(s)} onClick={() => toggleArr(apStades, setApStades, s)} />)}
                  {showErr && !apStades.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(apStades.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 3 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">D/ Critères financiers</h2>
                  <p className="text-sm text-muted-foreground mb-4">Fourchettes.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Budget min" type="number" placeholder="500000" value={apBudgMin} onChange={setApBudgMin} suffix="€" error={showErr && !apBudgMin ? "Obligatoire" : null} />
                    <InputField label="Budget max" type="number" placeholder="5000000" value={apBudgMax} onChange={setApBudgMax} suffix="€" error={showErr && !apBudgMax ? "Obligatoire" : null} />
                  </div>
                  <InputField label="Rendement cible minimum" placeholder="4" value={apRendMin} onChange={setApRendMin} suffix="%" error={showErr && !apRendMin ? "Obligatoire" : null} />
                  <InputField label="TRI cible" placeholder="8" value={apTRI} onChange={setApTRI} suffix="%" required={false} />
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(apBudgMin && apBudgMax && apRendMin), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 4 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">E/ Horizon d'investissement</h2>
                  <RadioGroup label="Horizon" options={["Court terme", "Moyen terme", "Long terme"]} value={apHorizon} onChange={setApHorizon} error={showErr && !apHorizon ? "Obligatoire" : null} />
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!apHorizon, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 5 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">F/ Zone géographique</h2>
                  <RadioGroup label="Périmètre" options={["France entière", "Zones ciblées"]} value={apLoc || null} onChange={setApLoc} error={showErr && !apLoc ? "Obligatoire" : null} />
                  <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!apLoc, goQNext)}>Valider ma fiche <Check className="ml-2" size={16} /></Button></div>
                </div>}
              </>)}

              {/* ===== ACQUÉREUR INVEST ===== */}
              {activeRole === "acquereur" && opType === "invest" && (<>
                {qStep === 0 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">A/ Type de support recherché</h2>
                  {SUPPORTS.map(s => <CheckItem key={s} label={s} checked={aiSupport.includes(s)} onClick={() => toggleArr(aiSupport, setAiSupport, s)} />)}
                  {showErr && !aiSupport.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(aiSupport.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 1 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">B/ Objectif d'investissement</h2>
                  {["Rendement", "Sécurisation patrimoniale", "Diversification"].map(o => <CheckItem key={o} label={o} checked={aiObj === o} onClick={() => setAiObj(o)} multi={false} />)}
                  {showErr && !aiObj && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!aiObj, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 2 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">C/ Montant d'investissement</h2>
                  <p className="text-sm text-muted-foreground mb-4">Fourchette.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Budget min" type="number" placeholder="5000" value={aiBudgMin} onChange={setAiBudgMin} suffix="€" error={showErr && !aiBudgMin ? "Obligatoire" : null} />
                    <InputField label="Budget max" type="number" placeholder="100000" value={aiBudgMax} onChange={setAiBudgMax} suffix="€" error={showErr && !aiBudgMax ? "Obligatoire" : null} />
                  </div>
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(aiBudgMin && aiBudgMax), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 3 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">D/ Horizon d'investissement</h2>
                  <RadioGroup label="Horizon" options={["Court terme", "Moyen terme", "Long terme"]} value={aiHorizon} onChange={setAiHorizon} error={showErr && !aiHorizon ? "Obligatoire" : null} />
                  <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!aiHorizon, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                </div>}
                {qStep === 4 && <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">E/ Profil de risque</h2>
                  <RadioGroup label="Risque accepté" options={["Faible", "Modéré", "Dynamique"]} value={aiRisque} onChange={setAiRisque} error={showErr && !aiRisque ? "Obligatoire" : null} />
                  <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!aiRisque, goQNext)}>Valider ma fiche <Check className="ml-2" size={16} /></Button></div>
                </div>}
              </>)}
            </motion.div>
          )}

          {/* ==================== STEP 5: Confirmation ==================== */}
          {step === 5 && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <div className="glass-card rounded-xl p-6 shadow-card text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="font-display text-2xl font-bold mb-2">
                  {activeRole === "vendeur" ? "Votre annonce est en ligne !" : "Votre fiche de recherche est active !"}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {activeRole === "vendeur"
                    ? "Vous serez notifié dès qu'un acquéreur correspondra à votre annonce."
                    : "Vous serez notifié dès qu'un bien correspondra à vos critères de recherche."}
                </p>

                <div className="glass-card rounded-xl p-5 text-left text-sm space-y-2 mb-6">
                  <h3 className="font-display font-bold text-base mb-3 text-foreground">Récapitulatif</h3>
                  <div><span className="text-muted-foreground">Profil professionnel :</span> <span className="font-medium">{PROFILE_TYPES.find(p => p.id === proType)?.label || "—"}</span></div>
                  <div><span className="text-muted-foreground">Société :</span> <span className="font-medium">{proCompany}</span></div>
                  <div><span className="text-muted-foreground">Action :</span> <span className="font-medium">{activeRole === "vendeur" ? "Annonce vendeur" : "Fiche acquéreur"}</span></div>
                  <div><span className="text-muted-foreground">Opération :</span> <span className="font-medium">{opType === "actif" ? "Actif immobilier" : opType === "parts" ? "Parts / Société" : "Investissement financier"}</span></div>
                </div>

                {roles.length === 2 && roles.indexOf(activeRole!) === 0 ? (
                  <>
                    <Button className="w-full glow-gold mb-3" onClick={handleFinish}>
                      Continuer : créer {roles[1] === "vendeur" ? "mon annonce vendeur" : "ma fiche acquéreur"} → <ArrowRight className="ml-2" size={16} />
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => {
                      if (roles.includes("vendeur")) setSpace("vendeur");
                      else setSpace("acquereur");
                      navigate("/dashboard", { replace: true });
                    }}>Plus tard</Button>
                  </>
                ) : (
                  <Button className="w-full glow-gold" onClick={handleFinish}>
                    Accéder à mon tableau de bord <ArrowRight className="ml-2" size={16} />
                  </Button>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
