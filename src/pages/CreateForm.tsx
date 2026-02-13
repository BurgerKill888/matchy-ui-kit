import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CreateFormProps {
  mode?: "listing" | "criteria";
}

export default function CreateForm({ mode = "listing" }: CreateFormProps) {
  const isListing = mode === "listing";
  const title = isListing ? "Créer une annonce" : "Créer une fiche de critères";

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-2xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-8">{title}</h1>
        <div className="glass-card rounded-xl p-6 space-y-6">
          <div>
            <Label>Typologie de bien</Label>
            <Select>
              <SelectTrigger className="mt-1.5 bg-secondary border-border">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bureau">Bureau</SelectItem>
                <SelectItem value="commerce">Commerce</SelectItem>
                <SelectItem value="immeuble">Immeuble</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
                <SelectItem value="entrepot">Entrepôt</SelectItem>
                <SelectItem value="hotel">Hôtel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Surface (m²)</Label>
              <Input placeholder="ex: 350" className="mt-1.5 bg-secondary border-border" />
            </div>
            <div>
              <Label>Prix (€)</Label>
              <Input placeholder="ex: 2 800 000" className="mt-1.5 bg-secondary border-border" />
            </div>
          </div>
          <div>
            <Label>Localisation</Label>
            <Input placeholder="Ville, quartier..." className="mt-1.5 bg-secondary border-border" />
          </div>
          <div>
            <Label>Urbanisme</Label>
            <Select>
              <SelectTrigger className="mt-1.5 bg-secondary border-border">
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tertiaire">Tertiaire</SelectItem>
                <SelectItem value="mixte">Mixte</SelectItem>
                <SelectItem value="residentiel">Résidentiel</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="industriel">Industriel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isListing && (
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Décrivez le bien..." className="mt-1.5 bg-secondary border-border min-h-[120px]" />
            </div>
          )}
          <Button className="w-full glow-gold">
            {isListing ? "Publier l'annonce" : "Enregistrer la fiche"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
