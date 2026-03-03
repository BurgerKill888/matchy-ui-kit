import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Bell, User, Upload, X, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const STATUTS = [
  { id: "gerant", label: "Gérant(e)" },
  { id: "president", label: "Président(e)" },
  { id: "associe", label: "Associé(e)" },
  { id: "employe", label: "Employé(e) d'une structure immobilière" },
];

export default function Profile() {
  const [statut, setStatut] = useState("gerant");
  const [partsDetail, setPartsDetail] = useState("");
  const [quotePart, setQuotePart] = useState("");
  const [poste, setPoste] = useState("");
  const [carteT, setCarteT] = useState<{ name: string } | null>(null);
  const [declarationActivite, setDeclarationActivite] = useState<{ name: string } | null>(null);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-3xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">Profil & Paramètres</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="profile" className="gap-2"><User size={14} /> Profil</TabsTrigger>
            <TabsTrigger value="pro" className="gap-2"><Shield size={14} /> Professionnel</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell size={14} /> Notifications</TabsTrigger>
          </TabsList>

          {/* ===== ONGLET PROFIL ===== */}
          <TabsContent value="profile" className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="text-primary" size={28} />
                </div>
                <div>
                  <h2 className="font-semibold">Jean Dupont</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="text-xs gap-1"><Shield size={10} /> Marchand de biens</Badge>
                    <Badge variant="outline" className="text-xs">Vérifié</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prénom</Label>
                  <Input defaultValue="Jean" className="mt-1.5 bg-secondary border-border" />
                </div>
                <div>
                  <Label>Nom</Label>
                  <Input defaultValue="Dupont" className="mt-1.5 bg-secondary border-border" />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input defaultValue="jean.dupont@example.com" className="mt-1.5 bg-secondary border-border" />
              </div>
              <div>
                <Label>Téléphone</Label>
                <Input defaultValue="06 12 34 56 78" className="mt-1.5 bg-secondary border-border" />
              </div>
              <div>
                <Label>Ville</Label>
                <Input defaultValue="Paris" className="mt-1.5 bg-secondary border-border" />
              </div>
              <Button className="glow-gold">Enregistrer les modifications</Button>
            </div>
          </TabsContent>

          {/* ===== ONGLET PROFESSIONNEL ===== */}
          <TabsContent value="pro" className="space-y-6">
            <div className="glass-card rounded-xl p-6 space-y-6">
              <div>
                <h2 className="font-display text-lg font-bold mb-1">Identité professionnelle</h2>
                <p className="text-sm text-muted-foreground mb-5">Ces informations sont rattachées à votre profil et nécessaires avant toute publication.</p>
              </div>

              {/* Société & SIRET */}
              <div>
                <Label>Société</Label>
                <Input defaultValue="SCI Dupont Investissements" className="mt-1.5 bg-secondary border-border" />
              </div>
              <div>
                <Label>SIRET</Label>
                <Input defaultValue="123 456 789 00010" className="mt-1.5 bg-secondary border-border" />
              </div>

              {/* Statut / Fonction */}
              <div>
                <Label className="mb-2 block">Statut / Fonction <span className="text-destructive">*</span></Label>
                <div className="space-y-2">
                  {STATUTS.map(s => (
                    <button key={s.id} type="button" onClick={() => setStatut(s.id)}
                      className={cn("w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left",
                        statut === s.id ? "border-primary bg-primary/10" : "border-border bg-secondary/30 hover:border-primary/40"
                      )}>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs",
                        statut === s.id ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                      )}>{statut === s.id && <Check size={10} />}</div>
                      <span className={cn("text-sm", statut === s.id ? "font-semibold" : "text-foreground/80")}>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional fields based on statut */}
              {statut === "associe" && (
                <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                  <div>
                    <Label>Détention <span className="text-[10px] text-muted-foreground font-normal">(ex : 30 % ou 150 parts sur 500)</span></Label>
                    <Input placeholder="30 % ou 150 parts sur 500" value={partsDetail} onChange={e => setPartsDetail(e.target.value)}
                      className="mt-1.5 bg-secondary border-border" />
                  </div>
                  <div>
                    <Label>Quote-part <span className="text-[10px] text-muted-foreground font-normal">(facultatif)</span></Label>
                    <Input placeholder="ex : 30 %" value={quotePart} onChange={e => setQuotePart(e.target.value)}
                      className="mt-1.5 bg-secondary border-border" />
                  </div>
                </div>
              )}
              {statut === "employe" && (
                <div className="pl-4 border-l-2 border-primary/20">
                  <Label>Poste occupé <span className="text-destructive">*</span></Label>
                  <Input placeholder="ex : Directeur d'investissement" value={poste} onChange={e => setPoste(e.target.value)}
                    className="mt-1.5 bg-secondary border-border" />
                </div>
              )}

              {/* Carte T */}
              <div>
                <Label className="mb-2 block">Carte professionnelle (Carte T) <span className="text-[10px] text-muted-foreground font-normal">(agents immobiliers)</span></Label>
                {carteT ? (
                  <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-lg border border-border">
                    <span className="text-base">📄</span>
                    <span className="text-sm font-medium flex-1 truncate">{carteT.name}</span>
                    <button onClick={() => setCarteT(null)} className="text-muted-foreground hover:text-destructive"><X size={14} /></button>
                  </div>
                ) : (
                  <button onClick={() => setCarteT({ name: "carte_T_dupont.pdf" })}
                    className="w-full border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer bg-secondary/20 hover:border-primary/40 hover:bg-secondary/40 transition-all">
                    <Upload size={18} className="mx-auto mb-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Importer votre carte T</span>
                  </button>
                )}
              </div>

              {/* Déclaration d'activité */}
              <div>
                <Label className="mb-2 block">Déclaration d'activité <span className="text-[10px] text-muted-foreground font-normal">(le cas échéant)</span></Label>
                {declarationActivite ? (
                  <div className="flex items-center gap-3 p-3 bg-secondary/40 rounded-lg border border-border">
                    <span className="text-base">📄</span>
                    <span className="text-sm font-medium flex-1 truncate">{declarationActivite.name}</span>
                    <button onClick={() => setDeclarationActivite(null)} className="text-muted-foreground hover:text-destructive"><X size={14} /></button>
                  </div>
                ) : (
                  <button onClick={() => setDeclarationActivite({ name: "declaration_activite.pdf" })}
                    className="w-full border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer bg-secondary/20 hover:border-primary/40 hover:bg-secondary/40 transition-all">
                    <Upload size={18} className="mx-auto mb-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Importer votre déclaration</span>
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex gap-3 items-start text-sm">
                <span className="text-base shrink-0">🔒</span>
                <div className="text-muted-foreground leading-relaxed">
                  Ces documents ne seront partagés qu'avec vos contreparties validées et à des fins de vérification.
                </div>
              </div>

              <Button className="glow-gold">Enregistrer les modifications</Button>
            </div>
          </TabsContent>

          {/* ===== ONGLET NOTIFICATIONS ===== */}
          <TabsContent value="notifications" className="space-y-4">
            <div className="glass-card rounded-xl p-6 space-y-6">
              {[
                { label: "Nouveaux matches", desc: "Recevoir une notification quand un match est trouvé" },
                { label: "Messages", desc: "Être notifié des nouveaux messages" },
                { label: "Expiration timer", desc: "Alerte avant l'expiration d'un match" },
                { label: "Data Room", desc: "Notifications d'accès à la data room" },
                { label: "Newsletter", desc: "Actualités et opportunités du réseau" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
