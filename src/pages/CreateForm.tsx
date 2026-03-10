import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import AppLayout from "@/components/AppLayout";

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

function RadioGroup({ label, options, value, onChange, error }: { label: string; options: string[]; value: string | null; onChange: (v: string) => void; error?: string | null }) {
  return (
    <div className="mb-4">
      <Label className="mb-2 block">{label} <span className="text-destructive">*</span></Label>
      <div className="flex gap-2 flex-wrap">
        {options.map(o => (
          <button key={o} type="button" onClick={() => onChange(o)}
            className={cn("flex-1 min-w-[80px] p-3 rounded-xl border-2 text-center transition-all duration-200",
              value === o ? "border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.1)]" : "border-border bg-secondary/30 hover:border-primary/40"
            )}>
            <div className={cn("text-sm font-semibold", value === o ? "text-primary" : "text-foreground/80")}>{o}</div>
          </button>
        ))}
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
    <div className="glass-card rounded-xl p-3 sm:p-4 mb-6 flex items-center justify-center gap-0">
      {labels.map((l, i) => (
        <div key={i} className="flex items-center flex-1 min-w-0">
          <div className="flex flex-col items-center w-full min-w-0">
            <div className={cn("w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 transition-all shrink-0",
              i < current ? "bg-primary border-primary text-primary-foreground"
                : i === current ? "border-primary text-primary bg-primary/10" : "border-muted text-muted-foreground"
            )}>{i < current ? <Check size={10} /> : i + 1}</div>
            <div className={cn("text-[7px] sm:text-[8px] mt-1 text-center leading-tight truncate w-full px-0.5", i <= current ? "text-primary font-semibold" : "text-muted-foreground")}>{l}</div>
          </div>
          {i < labels.length - 1 && <div className={cn("w-3 sm:w-4 h-0.5 mb-3 shrink-0", i < current ? "bg-primary" : "bg-muted")} />}
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
          className={cn("bg-secondary border-border", suffix && "pr-10", error && "border-destructive ring-destructive/30 ring-2")} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-destructive mt-1">⚠ {error}</p>}
    </div>
  );
}

/* ========== MAIN ========== */
interface CreateFormProps {
  mode?: "listing" | "criteria";
}

export default function CreateForm({ mode = "listing" }: CreateFormProps) {
  const navigate = useNavigate();
  const isVendeur = mode === "listing";
  const role = isVendeur ? "vendeur" : "acquereur";

  // Wizard state
  const [wizStep, setWizStep] = useState<"opType" | "intro" | "questionnaire" | "confirm">("opType");
  const [opType, setOpType] = useState<string | null>(null);
  const [qStep, setQStep] = useState(0);
  const [showErr, setShowErr] = useState(false);

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

  // Dynamic labels
  // Criteria name (acquéreur only)
  const [criteriaName, setCriteriaName] = useState("");

  const getQLabels = (): string[] => {
    if (isVendeur) {
      if (opType === "actif") return ["Typologie", "Surfaces", "Urbanisme", "État", "Prix", "Localisation", "Photos", "Data Room"];
      if (opType === "parts") return ["Structure", "Actifs", "Stade", "Finances", "Horizon", "Localisation", "Documents"];
      return ["Support", "Stratégie", "Conditions", "Documents"];
    } else {
      if (opType === "actif") return ["Nom", "Typologie", "Surfaces", "Structure", "Urbanisme", "État", "Budget", "Zone géo"];
      if (opType === "parts") return ["Nom", "Structure", "Actifs", "Stade", "Finances", "Horizon", "Zone géo"];
      return ["Nom", "Support", "Objectif", "Montant", "Horizon", "Risque"];
    }
  };
  const qLabels = getQLabels();

  const goQNext = () => { if (qStep < qLabels.length - 1) setQStep(qStep + 1); else setWizStep("confirm"); };
  const goQBack = () => { setShowErr(false); if (qStep > 0) setQStep(qStep - 1); else setWizStep("intro"); };

  const anim = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 }, transition: { duration: 0.25 } };

  const totalSteps = 2 + qLabels.length + 1; // opType + intro + steps + confirm
  const currentStep = wizStep === "opType" ? 1 : wizStep === "intro" ? 2 : wizStep === "confirm" ? totalSteps : 2 + qStep + 1;
  const progress = (currentStep / totalSteps) * 100;

  const backUrl = isVendeur ? "/listings" : "/criteria";

  return (
    <AppLayout>
      <div className="min-h-[calc(100vh-4rem)]">
        {/* Progress bar */}
        <div className="border-b border-border bg-card/50 px-6 py-3 flex items-center justify-between">
          <h1 className="font-display text-lg font-bold">
            {isVendeur ? "Créer une annonce" : "Créer une fiche de recherche"}
          </h1>
          <span className="text-xs text-muted-foreground">{currentStep}/{totalSteps}</span>
        </div>
        <div className="h-0.5 bg-muted">
          <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
        </div>

        <div className="max-w-[600px] mx-auto px-5 py-8">
          <AnimatePresence mode="wait">

            {/* STEP: Operation type */}
            {wizStep === "opType" && (
              <motion.div key="opType" {...anim}>
                <div className="glass-card rounded-xl p-6 shadow-card">
                  <h2 className="font-display text-xl font-bold mb-1">Quel type d'opération ?</h2>
                  <p className="text-sm text-muted-foreground mb-6">{isVendeur ? "Que souhaitez-vous vendre ?" : "Que recherchez-vous ?"}</p>
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
                    <Button variant="outline" className="flex-1" onClick={() => navigate(backUrl)}><ArrowLeft className="mr-2" size={16} /> Annuler</Button>
                    <Button className="flex-1 glow-gold" onClick={() => tryNext(!!opType, () => setWizStep("intro"))}>Continuer <ArrowRight className="ml-2" size={16} /></Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP: Intro */}
            {wizStep === "intro" && (
              <motion.div key="intro" {...anim}>
                <div className="glass-card rounded-xl p-6 shadow-card text-center">
                  <h2 className="font-display text-xl font-bold mb-1">{isVendeur ? "Publier votre bien" : "Créer votre fiche de recherche"}</h2>
                  <p className="text-sm text-muted-foreground mb-6">{isVendeur ? "Renseignez les informations pour être mis en relation avec des acquéreurs qualifiés." : "Définissez vos critères pour recevoir des opportunités pertinentes."}</p>
                  <div className="text-5xl mb-4">{isVendeur ? "📋" : "🔍"}</div>
                  <div className="flex justify-center gap-10 mb-8">
                    {[{ n: String(qLabels.length), l: "étapes" }, { n: "~5", l: "minutes" }, { n: "100%", l: "obligatoire" }].map(s => (
                      <div key={s.l} className="text-center">
                        <div className="text-2xl font-bold text-foreground">{s.n}</div>
                        <div className="text-xs text-muted-foreground">{s.l}</div>
                      </div>
                    ))}
                  </div>
                  <InfoBox icon="⚡">Tous les champs marqués <span className="text-destructive font-bold">*</span> sont obligatoires.</InfoBox>
                  {isVendeur && <InfoBox icon="🔒">L'adresse exacte ne sera jamais publique.</InfoBox>}
                  <InfoBox icon="💾">Progression sauvegardée automatiquement.</InfoBox>
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" className="flex-1" onClick={() => { setWizStep("opType"); setShowErr(false); }}><ArrowLeft className="mr-2" size={16} /> Retour</Button>
                    <Button className="flex-1 glow-gold" onClick={() => { setWizStep("questionnaire"); setQStep(0); }}>Commencer <ArrowRight className="ml-2" size={16} /></Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP: Questionnaire */}
            {wizStep === "questionnaire" && (
              <motion.div key={`q-${opType}-${qStep}`} {...anim}>
                <StepperBar current={qStep} labels={qLabels} />

                {/* ===== VENDEUR ACTIF ===== */}
                {isVendeur && opType === "actif" && (<>
                  {qStep === 0 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">A/ Typologie du bien</h2>
                    <p className="text-sm text-muted-foreground mb-5">Type de bien proposé à la vente.</p>
                    {TYPOS_ACTIF.map(t => <CheckItem key={t} label={t} checked={vTypo.includes(t)} onClick={() => toggleArr(vTypo, setVTypo, t)} />)}
                    {showErr && !vTypo.length && <p className="text-xs text-destructive mt-2">⚠ Sélectionnez au moins une typologie.</p>}
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(vTypo.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 1 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">B/ Surfaces & structure</h2>
                    <p className="text-sm text-muted-foreground mb-4">Données exactes, pas d'approximation.</p>
                    <InfoBox icon="📐">Ces données servent directement au matching.</InfoBox>
                    <InputField label="Surface bâtie totale" type="number" placeholder="ex : 250" value={vSurfB} onChange={setVSurfB} suffix="m²" error={showErr && !vSurfB ? "Obligatoire" : null} />
                    <InputField label="Surface du terrain" type="number" placeholder="ex : 800" value={vSurfT} onChange={setVSurfT} suffix="m²" error={showErr && !vSurfT ? "Obligatoire" : showErr && vSurfB && vSurfT && +vSurfT < +vSurfB ? "Ne peut être < surface bâtie" : null} />
                    <InputField label="Nombre de niveaux" type="number" placeholder="3" value={vNiv} onChange={setVNiv} error={showErr && !vNiv ? "Obligatoire" : null} />
                    <InputField label="Nombre de lots" type="number" placeholder="6" value={vLots} onChange={setVLots} error={showErr && !vLots ? "Obligatoire" : null} />
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(vSurfB && vSurfT && vNiv && vLots) && +vSurfT >= +vSurfB, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 2 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">C/ Urbanisme & potentiel</h2>
                    <p className="text-sm text-muted-foreground mb-4">Qualifie le potentiel pour les acquéreurs pro.</p>
                    <RadioGroup label="Constructible ?" options={["Oui", "Partiellement", "À étudier"]} value={vConst} onChange={setVConst} error={showErr && !vConst ? "Obligatoire" : null} />
                    <RadioGroup label="Division possible ?" options={["Oui", "Non", "À étudier"]} value={vDiv} onChange={setVDiv} error={showErr && !vDiv ? "Obligatoire" : null} />
                    <SectionLabel>Compléments</SectionLabel>
                    <InputField label="Zonage PLU" placeholder="UB, AU, N..." value={vPLU} onChange={setVPLU} required={false} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Emprise au sol" placeholder="60" value={vEmp} onChange={setVEmp} suffix="%" required={false} />
                      <InputField label="Hauteur autorisée" placeholder="12" value={vHaut} onChange={setVHaut} suffix="m" required={false} />
                    </div>
                    <SectionLabel>Visibilité</SectionLabel>
                    <InfoBox icon="👁️"><strong>Promoteurs</strong> : voient si constructible/potentiel. <strong>Marchands de biens</strong> : voient si divisible/potentiel.</InfoBox>
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(vConst && vDiv), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 3 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">D/ État du bâti</h2>
                    <p className="text-sm text-muted-foreground mb-5">Un seul choix.</p>
                    {ETATS.map(e => <CheckItem key={e} label={e} sub={ETAT_SUBS[e]} checked={vEtat === e} onClick={() => setVEtat(e)} multi={false} />)}
                    {showErr && !vEtat && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!vEtat, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 4 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">E/ Prix</h2>
                    <p className="text-sm text-muted-foreground mb-5">Prix de vente et conditions.</p>
                    <InputField label="Prix demandé" type="number" placeholder="450000" value={vPrix} onChange={setVPrix} suffix="€" error={showErr && !vPrix ? "Obligatoire" : null} />
                    <RadioGroup label="Conditions" options={["Prix ferme", "Négociable", "Off-market"]} value={vCond} onChange={setVCond} error={showErr && !vCond ? "Obligatoire" : null} />
                    {vCond === "Off-market" && <InfoBox icon="🔒">Prix non visible. Les acquéreurs matchés verront uniquement que le bien entre dans leur budget.</InfoBox>}
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(vPrix && vCond), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 5 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">F/ Localisation</h2>
                    <p className="text-sm text-muted-foreground mb-5">Où se situe le bien ?</p>
                    <InfoBox icon="🔒">L'adresse reste confidentielle.</InfoBox>
                    <InputField label="Adresse ou point GPS" placeholder="12 rue de la Paix, 75002" value={vAdr} onChange={setVAdr} error={showErr && !vAdr ? "Obligatoire" : null} />
                    <InputField label="Ville / Code postal" placeholder="Paris 75002" value={vVille} onChange={setVVille} error={showErr && !vVille ? "Obligatoire" : null} />
                    <div className="h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm mb-4">🗺️ Aperçu carte</div>
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(vAdr && vVille), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 6 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">G/ Photos du bien</h2>
                    <p className="text-sm text-muted-foreground mb-5">Ajoutez des photos pour améliorer la visibilité.</p>
                    <UploadZone label="Photos" files={vPhotos} onAdd={addFakePhoto} onRemove={i => setVPhotos(p => p.filter((_, j) => j !== i))} accept="JPG, PNG, WEBP — Max 10 Mo par fichier" hint="Minimum 3 photos recommandées. Maximum 20." icon="🖼️" />
                    {showErr && vPhotos.length < 1 && <p className="text-xs text-destructive">⚠ Ajoutez au moins une photo.</p>}
                    <InfoBox icon="💡">Des photos de qualité augmentent significativement l'intérêt des acquéreurs.</InfoBox>
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(vPhotos.length >= 1, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 7 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">H/ Documents Data Room</h2>
                    <p className="text-sm text-muted-foreground mb-5">Déposez les documents que les acquéreurs autorisés pourront consulter.</p>
                    <UploadZone label="Documents confidentiels" files={vDocs} onAdd={() => addFakeDoc(setVDocs)} onRemove={i => setVDocs(p => p.filter((_, j) => j !== i))} accept="PDF, DOC, XLS — Max 50 Mo par fichier" hint="Plans, diagnostics, titre de propriété, baux..." icon="📂" />
                    <InfoBox icon="🔒">Ces documents ne seront accessibles qu'aux acquéreurs dont vous aurez autorisé l'accès à la Data Room.</InfoBox>
                    <InfoBox icon="💡">Vous pourrez ajouter ou retirer des documents à tout moment.</InfoBox>
                    <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={goQNext}>Valider et publier <Check className="ml-2" size={16} /></Button></div>
                  </div>}
                </>)}

                {/* ===== VENDEUR PARTS ===== */}
                {isVendeur && opType === "parts" && (<>
                  {qStep === 0 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">A/ Type de structure</h2>
                    <p className="text-sm text-muted-foreground mb-5">Quelle structure vendez-vous ?</p>
                    {STRUCTURES.map(s => <CheckItem key={s} label={s} checked={vpStruct.includes(s)} onClick={() => toggleArr(vpStruct, setVpStruct, s)} />)}
                    {showErr && !vpStruct.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(vpStruct.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 1 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">B/ Nature des actifs détenus</h2>
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
                    <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={goQNext}>Valider et publier <Check className="ml-2" size={16} /></Button></div>
                  </div>}
                </>)}

                {/* ===== VENDEUR INVEST ===== */}
                {isVendeur && opType === "invest" && (<>
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
                    <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={goQNext}>Valider et publier <Check className="ml-2" size={16} /></Button></div>
                  </div>}
                </>)}

                {/* ===== ACQUÉREUR ACTIF ===== */}
                {!isVendeur && opType === "actif" && (<>
                  {qStep === 0 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">Nommez votre fiche</h2>
                    <p className="text-sm text-muted-foreground mb-5">Donnez un nom à cette fiche pour la retrouver facilement.</p>
                    <InputField label="Nom de la fiche" placeholder="ex : Bureaux IDF — 200 à 500m²" value={criteriaName} onChange={setCriteriaName} error={showErr && !criteriaName.trim() ? "Obligatoire" : null} />
                    <InfoBox icon="🏷️">Ce nom apparaîtra sur votre fiche et dans vos filtres de matches.</InfoBox>
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!criteriaName.trim(), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 1 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">A/ Typologie recherchée</h2>
                    <p className="text-sm text-muted-foreground mb-5">Quel(s) type(s) de bien ?</p>
                    {TYPOS_ACTIF.map(t => <CheckItem key={t} label={t} checked={aTypo.includes(t)} onClick={() => toggleArr(aTypo, setATypo, t)} />)}
                    {showErr && !aTypo.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(aTypo.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 2 && <div className="glass-card rounded-xl p-6 shadow-card">
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
                  {qStep === 3 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">C/ Structure acceptée</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Lots minimum" type="number" placeholder="1" value={aLotsMin} onChange={setALotsMin} error={showErr && !aLotsMin ? "Obligatoire" : null} />
                      <InputField label="Lots maximum" type="number" placeholder="20" value={aLotsMax} onChange={setALotsMax} required={false} />
                    </div>
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!aLotsMin, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 4 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">D/ Contraintes d'urbanisme</h2>
                    <RadioGroup label="Constructible obligatoire ?" options={["Oui", "Non", "Peu importe"]} value={aConst} onChange={setAConst} error={showErr && !aConst ? "Obligatoire" : null} />
                    <RadioGroup label="Division" options={["Obligatoire", "Souhaitée", "Peu importe"]} value={aDiv} onChange={setADiv} error={showErr && !aDiv ? "Obligatoire" : null} />
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(aConst && aDiv), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 5 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">E/ État du bien accepté</h2>
                    <p className="text-sm text-muted-foreground mb-5">Plusieurs choix possibles.</p>
                    {["Bon état", "À rafraîchir", "À rénover", "À restructurer", "À démolir"].map(e => <CheckItem key={e} label={e} checked={aEtats.includes(e)} onClick={() => toggleArr(aEtats, setAEtats, e)} />)}
                    {showErr && !aEtats.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(aEtats.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 6 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">F/ Budget</h2>
                    <p className="text-sm text-muted-foreground mb-5">Fourchette obligatoire.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Budget min" type="number" placeholder="200000" value={aBudgMin} onChange={setABudgMin} suffix="€" error={showErr && !aBudgMin ? "Obligatoire" : null} />
                      <InputField label="Budget max" type="number" placeholder="600000" value={aBudgMax} onChange={setABudgMax} suffix="€" error={showErr && !aBudgMax ? "Obligatoire" : showErr && +aBudgMax < +aBudgMin ? "Max < min" : null} />
                    </div>
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(aBudgMin && aBudgMax) && +aBudgMax >= +aBudgMin, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 7 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">G/ Zone géographique</h2>
                    <InputField label="Point central (adresse ou GPS)" placeholder="Paris 8e" value={aAdr} onChange={setAAdr} error={showErr && !aAdr ? "Obligatoire" : null} />
                    <RadioGroup label="Rayon de recherche" options={["1 km", "5 km", "10 km", "20 km", "Personnalisé"]} value={aRayon} onChange={setARayon} error={showErr && !aRayon ? "Obligatoire" : null} />
                    <div className="h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm mb-4">🗺️ Aperçu zone</div>
                    <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!(aAdr && aRayon), goQNext)}>Valider ma recherche <Check className="ml-2" size={16} /></Button></div>
                  </div>}
                </>)}

                {/* ===== ACQUÉREUR PARTS ===== */}
                {!isVendeur && opType === "parts" && (<>
                  {qStep === 0 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">Nommez votre fiche</h2>
                    <p className="text-sm text-muted-foreground mb-5">Donnez un nom à cette fiche pour la retrouver facilement.</p>
                    <InputField label="Nom de la fiche" placeholder="ex : SCI Lyon — Résidentiel" value={criteriaName} onChange={setCriteriaName} error={showErr && !criteriaName.trim() ? "Obligatoire" : null} />
                    <InfoBox icon="🏷️">Ce nom apparaîtra sur votre fiche et dans vos filtres de matches.</InfoBox>
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!criteriaName.trim(), goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 1 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">A/ Type de structure recherchée</h2>
                    {STRUCTURES.map(s => <CheckItem key={s} label={s} checked={apStruct.includes(s)} onClick={() => toggleArr(apStruct, setApStruct, s)} />)}
                    {showErr && !apStruct.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(apStruct.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 2 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">B/ Nature des actifs recherchés</h2>
                    {NATURES.map(n => <CheckItem key={n} label={n} checked={apNature === n} onClick={() => setApNature(n)} multi={false} />)}
                    {showErr && !apNature && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!apNature, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 3 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">C/ Stade de projet accepté</h2>
                    <p className="text-sm text-muted-foreground mb-5">Plusieurs choix possibles.</p>
                    {STADES.map(s => <CheckItem key={s} label={s} checked={apStades.includes(s)} onClick={() => toggleArr(apStades, setApStades, s)} />)}
                    {showErr && !apStades.length && <p className="text-xs text-destructive mt-2">⚠ Obligatoire.</p>}
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(apStades.length > 0, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 4 && <div className="glass-card rounded-xl p-6 shadow-card">
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
                  {qStep === 5 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">E/ Horizon d'investissement</h2>
                    <RadioGroup label="Horizon" options={["Court terme", "Moyen terme", "Long terme"]} value={apHorizon} onChange={setApHorizon} error={showErr && !apHorizon ? "Obligatoire" : null} />
                    <div className="flex gap-3 mt-6"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!apHorizon, goQNext)}>Continuer <ArrowRight className="ml-2" size={16} /></Button></div>
                  </div>}
                  {qStep === 6 && <div className="glass-card rounded-xl p-6 shadow-card">
                    <h2 className="font-display text-xl font-bold mb-1">F/ Zone géographique</h2>
                    <RadioGroup label="Périmètre" options={["France entière", "Zones ciblées"]} value={apLoc || null} onChange={setApLoc} error={showErr && !apLoc ? "Obligatoire" : null} />
                    <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!apLoc, goQNext)}>Valider ma recherche <Check className="ml-2" size={16} /></Button></div>
                  </div>}
                </>)}

                {/* ===== ACQUÉREUR INVEST ===== */}
                {!isVendeur && opType === "invest" && (<>
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
                    <div className="flex gap-3 mt-4"><Button variant="outline" className="flex-1" onClick={goQBack}><ArrowLeft className="mr-2" size={16} /> Retour</Button><Button className="flex-1 glow-gold" onClick={() => tryNext(!!aiRisque, goQNext)}>Valider ma recherche <Check className="ml-2" size={16} /></Button></div>
                  </div>}
                </>)}
              </motion.div>
            )}

            {/* STEP: Confirmation */}
            {wizStep === "confirm" && (
              <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                <div className="glass-card rounded-xl p-6 shadow-card text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="font-display text-2xl font-bold mb-2">{isVendeur ? "Votre annonce est en ligne !" : "Votre fiche de recherche est active !"}</h2>
                  <p className="text-sm text-muted-foreground mb-6">{isVendeur ? "Vous serez notifié dès qu'un acquéreur correspondra." : "Vous serez notifié dès qu'un bien correspondra à vos critères."}</p>

                  <div className="glass-card rounded-xl p-5 text-left text-sm space-y-2 mb-6">
                    <h3 className="font-display font-bold text-base mb-3 text-foreground">Récapitulatif</h3>
                    <div><span className="text-muted-foreground">Profil :</span> <span className="font-medium">{isVendeur ? "Vendeur" : "Acquéreur"}</span></div>
                    <div><span className="text-muted-foreground">Opération :</span> <span className="font-medium">{opType === "actif" ? "Actif immobilier" : opType === "parts" ? "Parts / Société" : "Investissement financier"}</span></div>
                  </div>

                  <Button className="w-full glow-gold" onClick={() => navigate(backUrl, { replace: true })}>
                    Retour à {isVendeur ? "mes annonces" : "mes fiches"} <ArrowRight className="ml-2" size={16} />
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
