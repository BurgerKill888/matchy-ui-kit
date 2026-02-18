import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  User, FileText, CreditCard, Bell, Shield, CheckCircle2, Clock, AlertTriangle, Plus,
  Receipt, Trash2, Lock, Globe, Palette, Download, ExternalLink, LogOut, ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const documents = [
  { name: "Extrait Kbis", status: "valid" as const },
  { name: "Code NACE 68.20", status: "valid" as const },
  { name: "Déclaration d'activité", status: "pending" as const },
  { name: "Organigramme capitalistique", status: "missing" as const },
];

const docStatusConfig = {
  valid: { icon: CheckCircle2, color: "text-success", label: "Validé" },
  pending: { icon: Clock, color: "text-warning", label: "En attente de validation" },
  missing: { icon: AlertTriangle, color: "text-destructive", label: "Non fourni" },
};

const notifications = [
  { key: "match", label: "Nouveau match", defaultOn: true },
  { key: "message", label: "Nouveau message", defaultOn: true },
  { key: "timer", label: "Timer bientôt expiré", defaultOn: true },
  { key: "report", label: "Rapport hebdomadaire par email", defaultOn: false },
  { key: "dataroom", label: "Accès Data Room accordé", defaultOn: true },
];

const mockInvoices = [
  { id: "INV-2026-02", date: "01/02/2026", amount: "150 € HT", status: "paid" },
  { id: "INV-2026-01", date: "01/01/2026", amount: "150 € HT", status: "paid" },
  { id: "INV-2025-12", date: "01/12/2025", amount: "150 € HT", status: "paid" },
];

export default function Settings() {
  const hasAllValid = documents.every((d) => d.status === "valid");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionAlerts, setSessionAlerts] = useState(true);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-3xl space-y-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground mt-1">Votre profil, vos documents et votre abonnement</p>
        </div>

        {/* Section 1: Mon profil */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <User size={18} className="text-primary" />
            <h2 className="font-display text-lg font-semibold">Mon profil</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="text-primary" size={28} />
            </div>
            <div>
              <h3 className="font-semibold">SCI Patrimoine</h3>
              <p className="text-sm text-muted-foreground">Investisseur (SCI)</p>
              <Badge className="text-xs mt-1 gap-1"><Shield size={10} /> Investisseur qualifié</Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Représentant</Label>
              <Input defaultValue="Jean Dupont" className="mt-1.5 bg-secondary border-border" />
            </div>
            <div>
              <Label>Nom de la structure</Label>
              <Input defaultValue="SCI Patrimoine" className="mt-1.5 bg-secondary border-border" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input defaultValue="contact@sci-patrimoine.fr" className="mt-1.5 bg-secondary border-border" />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input defaultValue="+33 6 12 34 56 78" className="mt-1.5 bg-secondary border-border" />
            </div>
          </div>
          <Button className="glow-gold transition-transform duration-200 hover:scale-[1.02]">Enregistrer</Button>
        </motion.div>

        {/* Section 2: Documents & Validation */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              <h2 className="font-display text-lg font-semibold">Documents & Validation</h2>
            </div>
            <Badge variant={hasAllValid ? "default" : "secondary"} className="text-xs gap-1">
              {hasAllValid ? <><CheckCircle2 size={10} /> Compte vérifié</> : <><Clock size={10} /> Vérification en cours</>}
            </Badge>
          </div>
          <div className="space-y-3">
            {documents.map((doc) => {
              const conf = docStatusConfig[doc.status];
              return (
                <div key={doc.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <conf.icon size={16} className={conf.color} />
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className={`text-xs ${conf.color}`}>{conf.label}</p>
                    </div>
                  </div>
                  {doc.status === "missing" && (
                    <Button variant="outline" size="sm" className="text-xs transition-transform duration-200 hover:scale-[1.02]">
                      <Plus size={12} className="mr-1" /> Ajouter
                    </Button>
                  )}
                  {doc.status === "valid" && (
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground">
                      <Download size={12} className="mr-1" /> Télécharger
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Section 3: Mon abonnement */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-primary" />
            <h2 className="font-display text-lg font-semibold">Mon abonnement</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Pack 1 — 150€ HT/mois</p>
              <p className="text-xs text-muted-foreground">Renouvellement : 15/03/2026</p>
            </div>
            <Badge className="text-xs">Actif</Badge>
          </div>
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Opportunités actives</span>
              <span className="font-semibold text-primary">7 / 10</span>
            </div>
            <Progress value={70} className="h-2" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="text-sm transition-transform duration-200 hover:scale-[1.02]">Changer de pack</Button>
            <Button variant="outline" className="text-sm transition-transform duration-200 hover:scale-[1.02]">+ Opportunités (+20€ HT/mois)</Button>
          </div>
        </motion.div>

        {/* Section 4: Factures */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Receipt size={18} className="text-primary" />
            <h2 className="font-display text-lg font-semibold">Factures</h2>
          </div>
          <div className="space-y-2">
            {mockInvoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <FileText size={14} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{inv.id}</p>
                    <p className="text-xs text-muted-foreground">{inv.date} · {inv.amount}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground">
                  <Download size={12} /> PDF
                </Button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Section 5: Préférences de notification */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-primary" />
            <h2 className="font-display text-lg font-semibold">Préférences de notification</h2>
          </div>
          {notifications.map((n) => (
            <div key={n.key} className="flex items-center justify-between">
              <p className="text-sm font-medium">{n.label}</p>
              <Switch defaultChecked={n.defaultOn} />
            </div>
          ))}
        </motion.div>

        {/* Section 6: Préférences d'affichage */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Palette size={18} className="text-primary" />
            <h2 className="font-display text-lg font-semibold">Préférences d'affichage</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Langue</p>
              <p className="text-xs text-muted-foreground">Langue de l'interface</p>
            </div>
            <Select defaultValue="fr">
              <SelectTrigger className="w-32 h-8 text-xs bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Devise</p>
              <p className="text-xs text-muted-foreground">Devise d'affichage des prix</p>
            </div>
            <Select defaultValue="eur">
              <SelectTrigger className="w-32 h-8 text-xs bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eur">€ Euro</SelectItem>
                <SelectItem value="usd">$ Dollar</SelectItem>
                <SelectItem value="gbp">£ Sterling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Section 7: Sécurité */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-primary" />
            <h2 className="font-display text-lg font-semibold">Sécurité</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Authentification à deux facteurs (2FA)</p>
              <p className="text-xs text-muted-foreground">Sécurisez votre compte avec une seconde vérification</p>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Alertes de connexion</p>
              <p className="text-xs text-muted-foreground">Soyez notifié de chaque nouvelle session</p>
            </div>
            <Switch checked={sessionAlerts} onCheckedChange={setSessionAlerts} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Modifier le mot de passe</p>
              <p className="text-xs text-muted-foreground">Dernière modification il y a 3 mois</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1 transition-transform duration-200 hover:scale-[1.02]">
              Modifier <ChevronRight size={12} />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sessions actives</p>
              <p className="text-xs text-muted-foreground">Gérez les appareils connectés à votre compte</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1 transition-transform duration-200 hover:scale-[1.02]">
              Voir <ExternalLink size={12} />
            </Button>
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Se déconnecter de tous les appareils</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1 border-destructive/40 text-destructive hover:bg-destructive/10 transition-transform duration-200 hover:scale-[1.02]">
              <LogOut size={12} /> Déconnecter
            </Button>
          </div>
        </motion.div>

        {/* Section 8: Données & Confidentialité */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Globe size={18} className="text-primary" />
            <h2 className="font-display text-lg font-semibold">Données & Confidentialité</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Exporter mes données</p>
              <p className="text-xs text-muted-foreground">Téléchargez une copie de vos données (RGPD)</p>
            </div>
            <Button variant="outline" size="sm" className="text-xs gap-1 transition-transform duration-200 hover:scale-[1.02]">
              <Download size={12} /> Exporter
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Politique de confidentialité</p>
              <p className="text-xs text-muted-foreground">Consultez nos engagements de protection des données</p>
            </div>
            <Button variant="ghost" size="sm" className="text-xs gap-1 text-muted-foreground">
              Voir <ExternalLink size={12} />
            </Button>
          </div>
        </motion.div>

        {/* Section 9: Zone danger — Suppression de compte */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-xl p-6 space-y-4 border border-destructive/20">
          <div className="flex items-center gap-2">
            <Trash2 size={18} className="text-destructive" />
            <h2 className="font-display text-lg font-semibold text-destructive">Zone critique</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Supprimer le compte</p>
              <p className="text-xs text-muted-foreground">Cette action est irréversible. Toutes vos données seront supprimées.</p>
            </div>
            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-destructive/40 text-destructive hover:bg-destructive/10 transition-transform duration-200 hover:scale-[1.02]"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={12} className="mr-1" /> Supprimer
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowDeleteConfirm(false)}>Annuler</Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs"
                >
                  Confirmer la suppression
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
