import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function LegalPage({ type }: { type: "cgu" | "privacy" }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="container flex items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="text-primary" size={24} />
            <span className="font-display text-lg font-bold">Match<span className="text-primary">stone</span></span>
          </Link>
        </div>
      </header>
      <div className="container max-w-3xl py-16">
        <h1 className="font-display text-3xl font-bold mb-8">
          {type === "cgu" ? "Conditions Générales d'Utilisation" : "Politique de Confidentialité"}
        </h1>
        <div className="prose prose-sm text-muted-foreground max-w-none space-y-6">
          <p>Dernière mise à jour : 13 février 2026</p>
          <h2 className="text-foreground font-display">1. Objet</h2>
          <p>
            Les présentes {type === "cgu" ? "conditions générales d'utilisation" : "dispositions relatives à la protection des données personnelles"} régissent 
            l'utilisation de la plateforme Matchstone, réseau professionnel dédié aux acteurs de l'immobilier.
          </p>
          <h2 className="text-foreground font-display">2. Accès au service</h2>
          <p>
            L'accès complet à Matchstone est conditionné à la validation du Kbis, du code NACE et des documents de conformité. 
            Les rôles vendeur et acquéreur sont définis opération par opération.
          </p>
          <h2 className="text-foreground font-display">3. Responsabilités</h2>
          <p>
            Matchstone agit en tant qu'intermédiaire de mise en relation entre professionnels de l'immobilier. 
            La plateforme ne saurait être tenue responsable des transactions conclues entre ses membres.
          </p>
        </div>
      </div>
    </div>
  );
}
