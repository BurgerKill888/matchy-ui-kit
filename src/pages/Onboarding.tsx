import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Search, Home, FileText, BarChart3, ArrowLeft, ArrowRight, Check, Info, Lock, MapPin, ClipboardList, Ruler, Landmark as LandmarkIcon, Paintbrush, Euro, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserSpace } from "@/contexts/UserSpaceContext";

const Q_STEPS = ["Typologie", "Surfaces", "Urbanisme", "État", "Prix", "Localisation"];

const typos = ["Maison", "Immeuble", "Appartement", "Terrain à potentiel", "Local commercial", "Bureaux", "Entrepôt / activité", "Ensemble immobilier mixte"];
const etats = ["Neuf", "Très bon état", "Bon état", "À rafraîchir", "À rénover", "À restructurer", "À démolir"];
const etatSubs: Record<string, string> = {
  "Neuf": "Construction récente, jamais habité",
  "Très bon état": "Aucun travaux à prévoir",
  "Bon état": "Quelques travaux mineurs possibles",
  "À rafraîchir": "Travaux cosmétiques (peinture, sols...)",
  "À rénover": "Travaux importants nécessaires",
  "À restructurer": "Rénovation lourde, modification de structure",
  "À démolir": "Démolition totale avant reconstruction",
};

function InfoBox({ children, icon = "ℹ️" }: { children: React.ReactNode; icon?: string }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex gap-3 items-start text-sm mb-4">
      <span className="text-base shrink-0">{icon}</span>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

function CheckItem({ label, checked, onClick, sub }: { label: string; checked: boolean; onClick: () => void; sub?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-200 text-left mb-2",
        checked
          ? "border-primary bg-primary/10 shadow-[0_0_16px_hsl(var(--primary)/0.12)]"
          : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50"
      )}
    >
      <div className={cn(
        "w-5 h-5 rounded-md shrink-0 flex items-center justify-center border-2 transition-all text-xs",
        checked ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
      )}>
        {checked && <Check size={12} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn("text-sm", checked ? "font-semibold text-foreground" : "text-foreground/80")}>{label}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </div>
    </button>
  );
}

function RadioOption({ label, desc, selected, onClick }: { label: string; desc?: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 p-3 rounded-xl border-2 text-center transition-all duration-200",
        selected
          ? "border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.1)]"
          : "border-border bg-secondary/30 hover:border-primary/40"
      )}
    >
      <div className={cn("text-sm font-semibold", selected ? "text-primary" : "text-foreground/80")}>{label}</div>
      {desc && <div className="text-[10px] text-muted-foreground mt-0.5">{desc}</div>}
    </button>
  );
}

function StepperBar({ current, labels }: { current: number; labels: string[] }) {
  return (
    <div className="glass-card rounded-xl p-4 mb-6 flex items-center justify-center gap-1">
      {labels.map((l, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center" style={{ width: 56 }}>
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
              i < current ? "bg-primary border-primary text-primary-foreground"
                : i === current ? "border-primary text-primary bg-primary/10"
                  : "border-muted text-muted-foreground"
            )}>
              {i < current ? <Check size={12} /> : i + 1}
            </div>
            <div className={cn(
              "text-[8px] mt-1 text-center leading-tight",
              i <= current ? "text-primary font-semibold" : "text-muted-foreground"
            )}>{l}</div>
          </div>
          {i < labels.length - 1 && (
            <div className={cn("w-4 h-0.5 mb-3", i < current ? "bg-primary" : "bg-muted")} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { setSpace } = useUserSpace();

  const [step, setStep] = useState(0);
  const [qStep, setQStep] = useState(0);
  const [showErr, setShowErr] = useState(false);

  // State
  const [roles, setRoles] = useState<string[]>([]);
  const [typo, setTypo] = useState<string[]>([]);
  const [surfBatie, setSurfBatie] = useState("");
  const [surfTerrain, setSurfTerrain] = useState("");
  const [niveaux, setNiveaux] = useState("");
  const [lots, setLots] = useState("");
  const [constructible, setConstructible] = useState<string | null>(null);
  const [division, setDivision] = useState<string | null>(null);
  const [zonagePLU, setZonagePLU] = useState("");
  const [emprise, setEmprise] = useState("");
  const [hauteur, setHauteur] = useState("");
  const [etatBati, setEtatBati] = useState<string | null>(null);
  const [prix, setPrix] = useState("");
  const [condPrix, setCondPrix] = useState<string | null>(null);
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");

  const toggleRole = (r: string) => setRoles(p => p.includes(r) ? p.filter(x => x !== r) : [...p, r]);
  const tryNext = (ok: boolean, fn: () => void) => { setShowErr(true); if (ok) { setShowErr(false); fn(); } };

  const totalSteps = 9;
  const currentStep = step <= 2 ? step + 1 : 3 + qStep + 1;
  const currentLabel = step === 0 ? "Profil" : step === 1 ? "Type d'opération" : step === 2 ? "Introduction" : Q_STEPS[qStep];
  const progress = (currentStep / totalSteps) * 100;

  const handleFinish = () => {
    if (roles.includes("vendeur")) {
      setSpace("vendeur");
    } else {
      setSpace("acquereur");
    }
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Building2 className="text-primary" size={22} />
            <span className="font-display text-lg font-bold">Match<span className="text-primary">stone</span></span>
          </div>
          <span className="text-xs text-muted-foreground">{currentStep}/{totalSteps} — {currentLabel}</span>
          <button onClick={() => navigate("/")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Sauvegarder & quitter
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-muted">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-[600px] mx-auto px-5 py-8">
        <AnimatePresence mode="wait">
          {/* STEP 0: Profile choice */}
          {step === 0 && (
            <motion.div key="profile" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              <div className="glass-card rounded-xl p-6 shadow-card">
                <h2 className="font-display text-xl font-bold mb-1">Comment souhaitez-vous utiliser Matchstone ?</h2>
                <p className="text-sm text-muted-foreground mb-6">Vous pourrez toujours activer l'autre profil plus tard depuis votre tableau de bord.</p>

                <div className="flex gap-4 mb-4">
                  {[
                    { id: "vendeur", icon: "🏢", t: "Vendeur", d: "Publiez vos biens et recevez des acquéreurs qualifiés" },
                    { id: "acquereur", icon: "🔍", t: "Acquéreur", d: "Définissez vos critères et recevez des opportunités ciblées" },
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggleRole(r.id)}
                      className={cn(
                        "flex-1 p-5 rounded-xl text-center border-2 transition-all duration-200",
                        roles.includes(r.id)
                          ? "border-primary bg-primary/10 shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
                          : showErr && roles.length === 0
                            ? "border-destructive/60 bg-secondary/30"
                            : "border-border bg-secondary/30 hover:border-primary/40"
                      )}
                    >
                      <div className="text-4xl mb-3">{r.icon}</div>
                      <div className="text-base font-bold mb-1">{r.t}</div>
                      <div className="text-xs text-muted-foreground leading-snug">{r.d}</div>
                      {roles.includes(r.id) && <div className="mt-3 text-primary text-xl font-bold">✓</div>}
                    </button>
                  ))}
                </div>

                {showErr && roles.length === 0 && (
                  <p className="text-xs text-destructive mb-3">⚠ Veuillez sélectionner au moins un profil pour continuer.</p>
                )}

                {roles.length === 2 && (
                  <InfoBox icon="💡">Vous pourrez basculer entre vos profils Vendeur et Acquéreur depuis votre tableau de bord.</InfoBox>
                )}

                <Button className="w-full glow-gold" onClick={() => tryNext(roles.length > 0, () => setStep(1))}>
                  Continuer <ArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: Operation type */}
          {step === 1 && (
            <motion.div key="operation" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              <div className="glass-card rounded-xl p-6 shadow-card">
                <h2 className="font-display text-xl font-bold mb-1">Quel type d'opération ?</h2>
                <p className="text-sm text-muted-foreground mb-6">Que souhaitez-vous vendre ?</p>

                {[
                  { id: "actif", icon: "🏠", t: "Actif immobilier", d: "Maison, immeuble, terrain, local commercial, bureaux..." },
                  { id: "parts", icon: "📑", t: "Parts ou société à objet immobilier", d: "SCI, SCCV, holding immobilière, foncière..." },
                  { id: "invest", icon: "📊", t: "Investissement financier immobilier", d: "SCPI, OPCI, fonds d'investissement immobilier" },
                ].map(o => (
                  <div
                    key={o.id}
                    className={cn(
                      "p-4 rounded-xl mb-2 flex items-center gap-4 cursor-pointer border-2 transition-all",
                      o.id === "actif"
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary/30 hover:border-primary/40"
                    )}
                  >
                    <div className="text-2xl w-10 text-center">{o.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{o.t}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{o.d}</div>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs",
                      o.id === "actif" ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                    )}>
                      {o.id === "actif" && <Check size={10} />}
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
                    <ArrowLeft className="mr-2" size={16} /> Retour
                  </Button>
                  <Button className="flex-1 glow-gold" onClick={() => setStep(2)}>
                    Continuer <ArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Intro */}
          {step === 2 && (
            <motion.div key="intro" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              <div className="glass-card rounded-xl p-6 shadow-card text-center">
                <h2 className="font-display text-xl font-bold mb-1">Publier votre bien</h2>
                <p className="text-sm text-muted-foreground mb-6">Renseignez les informations de votre actif immobilier pour être mis en relation avec des acquéreurs qualifiés.</p>

                <div className="text-5xl mb-4">📋</div>
                <div className="flex justify-center gap-10 mb-8">
                  {[{ n: "6", l: "étapes" }, { n: "~5", l: "minutes" }, { n: "100%", l: "obligatoire" }].map(s => (
                    <div key={s.l} className="text-center">
                      <div className="text-2xl font-bold text-foreground">{s.n}</div>
                      <div className="text-xs text-muted-foreground">{s.l}</div>
                    </div>
                  ))}
                </div>

                <InfoBox icon="⚡">Tous les champs marqués <span className="text-destructive font-bold">*</span> sont obligatoires. C'est ce qui garantit la qualité de vos matchs.</InfoBox>
                <InfoBox icon="🔒">L'adresse exacte de votre bien ne sera jamais rendue publique.</InfoBox>
                <InfoBox icon="💾">Votre progression est sauvegardée automatiquement. Vous pouvez quitter et reprendre plus tard.</InfoBox>

                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2" size={16} /> Retour
                  </Button>
                  <Button className="flex-1 glow-gold" onClick={() => setStep(3)}>
                    Commencer <ArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Questionnaire */}
          {step === 3 && (
            <motion.div key={`q-${qStep}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              <StepperBar current={qStep} labels={Q_STEPS} />

              {/* A/ Typologie */}
              {qStep === 0 && (
                <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">A/ Typologie du bien</h2>
                  <p className="text-sm text-muted-foreground mb-5">Sélectionnez le type de bien que vous proposez à la vente.</p>
                  {typos.map(t => (
                    <CheckItem key={t} label={t} checked={typo.includes(t)} onClick={() => setTypo(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t])} />
                  ))}
                  {showErr && typo.length === 0 && <p className="text-xs text-destructive mt-2">⚠ Veuillez sélectionner au moins une typologie.</p>}
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={() => { setStep(2); setShowErr(false); }}>
                      <ArrowLeft className="mr-2" size={16} /> Retour
                    </Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(typo.length > 0, () => setQStep(1))}>
                      Continuer <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </div>
                </div>
              )}

              {/* B/ Surfaces */}
              {qStep === 1 && (
                <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">B/ Surfaces & structure</h2>
                  <p className="text-sm text-muted-foreground mb-4">Renseignez les données exactes de votre bien.</p>
                  <InfoBox icon="📐">Ces données servent directement au matching. Des valeurs approximatives fausseraient les résultats.</InfoBox>

                  <div className="space-y-4">
                    <div>
                      <Label>Surface bâtie totale <span className="text-destructive">*</span></Label>
                      <div className="relative mt-1.5">
                        <Input type="number" placeholder="ex : 250" value={surfBatie} onChange={e => setSurfBatie(e.target.value)} className="bg-secondary border-border pr-10" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">m²</span>
                      </div>
                      {showErr && !surfBatie && <p className="text-xs text-destructive mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div>
                      <Label>Surface du terrain <span className="text-destructive">*</span></Label>
                      <div className="relative mt-1.5">
                        <Input type="number" placeholder="ex : 800" value={surfTerrain} onChange={e => setSurfTerrain(e.target.value)} className="bg-secondary border-border pr-10" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">m²</span>
                      </div>
                      {showErr && !surfTerrain && <p className="text-xs text-destructive mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre de niveaux <span className="text-destructive">*</span></Label>
                        <Input type="number" placeholder="ex : 3" value={niveaux} onChange={e => setNiveaux(e.target.value)} className="mt-1.5 bg-secondary border-border" />
                        {showErr && !niveaux && <p className="text-xs text-destructive mt-1">Obligatoire</p>}
                      </div>
                      <div>
                        <Label>Nombre de lots <span className="text-destructive">*</span></Label>
                        <Input type="number" placeholder="ex : 6" value={lots} onChange={e => setLots(e.target.value)} className="mt-1.5 bg-secondary border-border" />
                        {showErr && !lots && <p className="text-xs text-destructive mt-1">Obligatoire</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={() => { setQStep(0); setShowErr(false); }}>
                      <ArrowLeft className="mr-2" size={16} /> Retour
                    </Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(!!surfBatie && !!surfTerrain && !!niveaux && !!lots, () => setQStep(2))}>
                      Continuer <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </div>
                </div>
              )}

              {/* C/ Urbanisme */}
              {qStep === 2 && (
                <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">C/ Urbanisme & potentiel</h2>
                  <p className="text-sm text-muted-foreground mb-5">Ces informations qualifient le potentiel du bien pour les acquéreurs professionnels.</p>

                  <div className="mb-4">
                    <Label className="mb-2 block">Constructible ? <span className="text-destructive">*</span></Label>
                    <div className="flex gap-2">
                      {["Oui", "Partiellement", "À étudier"].map(o => (
                        <RadioOption key={o} label={o} selected={constructible === o} onClick={() => setConstructible(o)} />
                      ))}
                    </div>
                    {showErr && !constructible && <p className="text-xs text-destructive mt-1">Veuillez sélectionner une option</p>}
                  </div>

                  <div className="mb-4">
                    <Label className="mb-2 block">Division possible ? <span className="text-destructive">*</span></Label>
                    <div className="flex gap-2">
                      {["Oui", "Non", "À étudier"].map(o => (
                        <RadioOption key={o} label={o} selected={division === o} onClick={() => setDivision(o)} />
                      ))}
                    </div>
                    {showErr && !division && <p className="text-xs text-destructive mt-1">Veuillez sélectionner une option</p>}
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Informations complémentaires</p>
                    <div className="space-y-3">
                      <div>
                        <Label>Zonage PLU <span className="text-[10px] text-muted-foreground font-normal">(facultatif)</span></Label>
                        <Input placeholder="ex : UB, AU, N..." value={zonagePLU} onChange={e => setZonagePLU(e.target.value)} className="mt-1.5 bg-secondary border-border" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Emprise au sol <span className="text-[10px] text-muted-foreground font-normal">(fac.)</span></Label>
                          <div className="relative mt-1.5">
                            <Input placeholder="ex : 60" value={emprise} onChange={e => setEmprise(e.target.value)} className="bg-secondary border-border pr-8" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
                          </div>
                        </div>
                        <div>
                          <Label>Hauteur autorisée <span className="text-[10px] text-muted-foreground font-normal">(fac.)</span></Label>
                          <div className="relative mt-1.5">
                            <Input placeholder="ex : 12" value={hauteur} onChange={e => setHauteur(e.target.value)} className="bg-secondary border-border pr-8" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">m</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Règles de visibilité</p>
                    <InfoBox icon="👁️">
                      <strong className="text-foreground">Promoteurs</strong> verront votre bien uniquement s'il est constructible ou à potentiel.<br />
                      <strong className="text-foreground">Marchands de biens</strong> le verront uniquement s'il est divisible ou à potentiel.
                    </InfoBox>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" className="flex-1" onClick={() => { setQStep(1); setShowErr(false); }}>
                      <ArrowLeft className="mr-2" size={16} /> Retour
                    </Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(!!constructible && !!division, () => setQStep(3))}>
                      Continuer <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </div>
                </div>
              )}

              {/* D/ État */}
              {qStep === 3 && (
                <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">D/ État du bâti</h2>
                  <p className="text-sm text-muted-foreground mb-5">Dans quel état se trouve le bien ? Un seul choix.</p>
                  {etats.map(e => (
                    <CheckItem key={e} label={e} sub={etatSubs[e]} checked={etatBati === e} onClick={() => setEtatBati(e)} />
                  ))}
                  {showErr && !etatBati && <p className="text-xs text-destructive mt-2">⚠ Veuillez sélectionner l'état du bien.</p>}
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={() => { setQStep(2); setShowErr(false); }}>
                      <ArrowLeft className="mr-2" size={16} /> Retour
                    </Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(!!etatBati, () => setQStep(4))}>
                      Continuer <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </div>
                </div>
              )}

              {/* E/ Prix */}
              {qStep === 4 && (
                <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">E/ Prix</h2>
                  <p className="text-sm text-muted-foreground mb-5">Indiquez votre prix de vente et les conditions associées.</p>

                  <div className="mb-4">
                    <Label>Prix demandé <span className="text-destructive">*</span></Label>
                    <div className="relative mt-1.5">
                      <Input type="number" placeholder="ex : 450 000" value={prix} onChange={e => setPrix(e.target.value)} className="bg-secondary border-border pr-8" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">€</span>
                    </div>
                    {showErr && !prix && <p className="text-xs text-destructive mt-1">Ce champ est obligatoire</p>}
                  </div>

                  <div className="mb-4">
                    <Label className="mb-2 block">Conditions de vente <span className="text-destructive">*</span></Label>
                    <div className="flex gap-2">
                      {[
                        { id: "ferme", l: "Prix ferme", d: "Non négociable" },
                        { id: "nego", l: "Négociable", d: "Ouvert à la discussion" },
                        { id: "offmarket", l: "Off-market", d: "Prix non affiché" },
                      ].map(c => (
                        <RadioOption key={c.id} label={c.l} desc={c.d} selected={condPrix === c.id} onClick={() => setCondPrix(c.id)} />
                      ))}
                    </div>
                    {showErr && !condPrix && <p className="text-xs text-destructive mt-1">Veuillez sélectionner une condition de vente.</p>}
                  </div>

                  {condPrix === "offmarket" && (
                    <InfoBox icon="🔒">En mode off-market, votre prix ne sera pas visible. Les acquéreurs matchés verront uniquement que le bien correspond à leur budget.</InfoBox>
                  )}

                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" className="flex-1" onClick={() => { setQStep(3); setShowErr(false); }}>
                      <ArrowLeft className="mr-2" size={16} /> Retour
                    </Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(!!prix && !!condPrix, () => setQStep(5))}>
                      Continuer <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </div>
                </div>
              )}

              {/* F/ Localisation */}
              {qStep === 5 && (
                <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">F/ Localisation</h2>
                  <p className="text-sm text-muted-foreground mb-4">Où se situe le bien ?</p>
                  <InfoBox icon="🔒">L'adresse exacte et les coordonnées GPS restent confidentielles. Seules la ville et la zone sont visibles par les acquéreurs.</InfoBox>

                  <div className="space-y-4">
                    <div>
                      <Label>Adresse complète ou point GPS <span className="text-destructive">*</span></Label>
                      <Input placeholder="12 rue de la Paix, 75002 Paris" value={adresse} onChange={e => setAdresse(e.target.value)} className="mt-1.5 bg-secondary border-border" />
                      <p className="text-[10px] text-muted-foreground mt-1">Non visible publiquement</p>
                      {showErr && !adresse && <p className="text-xs text-destructive mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div>
                      <Label>Ville / Code postal <span className="text-destructive">*</span></Label>
                      <Input placeholder="Paris 75002" value={ville} onChange={e => setVille(e.target.value)} className="mt-1.5 bg-secondary border-border" />
                      {showErr && !ville && <p className="text-xs text-destructive mt-1">Ce champ est obligatoire</p>}
                    </div>
                    <div className="h-36 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
                      🗺️ Carte de localisation (aperçu zone)
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" className="flex-1" onClick={() => { setQStep(4); setShowErr(false); }}>
                      <ArrowLeft className="mr-2" size={16} /> Retour
                    </Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(!!adresse && !!ville, () => setStep(4))}>
                      Valider et publier <Check className="ml-2" size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 4: Confirmation */}
          {step === 4 && (
            <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <div className="glass-card rounded-xl p-6 shadow-card text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="font-display text-2xl font-bold mb-2">Votre bien est en ligne !</h2>
                <p className="text-sm text-muted-foreground mb-6">Vous recevrez une notification dès qu'un acquéreur correspondra à vos critères.</p>

                <div className="glass-card rounded-xl p-5 text-left text-sm space-y-2 mb-6">
                  <h3 className="font-display font-bold text-base mb-3 text-foreground">Récapitulatif</h3>
                  <div><span className="text-muted-foreground">Profil :</span> <span className="font-medium">Vendeur</span></div>
                  <div><span className="text-muted-foreground">Opération :</span> <span className="font-medium">Actif immobilier</span></div>
                  <div><span className="text-muted-foreground">Typologie :</span> <span className="font-medium">{typo.join(", ") || "—"}</span></div>
                  <div><span className="text-muted-foreground">Surface bâtie :</span> <span className="font-medium">{surfBatie ? surfBatie + " m²" : "—"}</span> · <span className="text-muted-foreground">Terrain :</span> <span className="font-medium">{surfTerrain ? surfTerrain + " m²" : "—"}</span></div>
                  <div><span className="text-muted-foreground">Niveaux :</span> <span className="font-medium">{niveaux || "—"}</span> · <span className="text-muted-foreground">Lots :</span> <span className="font-medium">{lots || "—"}</span></div>
                  <div><span className="text-muted-foreground">Constructible :</span> <span className="font-medium">{constructible || "—"}</span> · <span className="text-muted-foreground">Division :</span> <span className="font-medium">{division || "—"}</span></div>
                  {zonagePLU && <div><span className="text-muted-foreground">PLU :</span> <span className="font-medium">{zonagePLU}</span></div>}
                  {(emprise || hauteur) && (
                    <div>
                      {emprise && <><span className="text-muted-foreground">Emprise :</span> <span className="font-medium">{emprise}%</span> </>}
                      {hauteur && <><span className="text-muted-foreground">Hauteur :</span> <span className="font-medium">{hauteur}m</span></>}
                    </div>
                  )}
                  <div><span className="text-muted-foreground">État :</span> <span className="font-medium">{etatBati || "—"}</span></div>
                  <div><span className="text-muted-foreground">Prix :</span> <span className="font-medium">{prix ? Number(prix).toLocaleString("fr-FR") + " €" : "—"}</span> <span className="text-muted-foreground">({condPrix === "ferme" ? "Prix ferme" : condPrix === "nego" ? "Négociable" : "Off-market"})</span></div>
                  <div><span className="text-muted-foreground">Localisation :</span> <span className="font-medium">{ville || "—"}</span></div>
                </div>

                <Button className="w-full glow-gold mb-3" onClick={handleFinish}>
                  Accéder à mon tableau de bord <ArrowRight className="ml-2" size={16} />
                </Button>
                <Button variant="outline" className="w-full" onClick={() => {
                  setStep(1); setQStep(0); setTypo([]); setSurfBatie(""); setSurfTerrain("");
                  setNiveaux(""); setLots(""); setConstructible(null); setDivision(null);
                  setZonagePLU(""); setEmprise(""); setHauteur(""); setEtatBati(null);
                  setPrix(""); setCondPrix(null); setAdresse(""); setVille(""); setShowErr(false);
                }}>
                  Créer aussi un profil Acquéreur →
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
