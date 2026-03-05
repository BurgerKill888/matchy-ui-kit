import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, Bell, User } from "lucide-react";

export default function Profile() {
  return (
    <AppLayout>
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-6 sm:mb-8">Profil & Paramètres</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="profile" className="gap-2"><User size={14} /> Profil</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell size={14} /> Notifications</TabsTrigger>
          </TabsList>

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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Label>Société</Label>
                <Input defaultValue="SCI Dupont Investissements" className="mt-1.5 bg-secondary border-border" />
              </div>
              <div>
                <Label>SIRET</Label>
                <Input defaultValue="123 456 789 00010" className="mt-1.5 bg-secondary border-border" />
              </div>
              <Button className="glow-gold">Enregistrer les modifications</Button>
            </div>
          </TabsContent>

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
