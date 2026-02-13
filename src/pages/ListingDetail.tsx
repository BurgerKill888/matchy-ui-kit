import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Ruler, Euro, Building2, Eye, Sparkles, FolderLock, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function ListingDetail() {
  const { id } = useParams();

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <Link to="/listings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Retour aux annonces
        </Link>

        <div className="glass-card rounded-xl overflow-hidden">
          <div className="h-48 md:h-64 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <Building2 className="text-muted-foreground/20" size={64} />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge>Active</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye size={12} /> 24 vues</span>
              <span className="text-xs text-primary flex items-center gap-1"><Sparkles size={12} /> 3 matches</span>
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Bureau 350m² Paris 8e</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><MapPin size={14} /> Paris 8e</span>
              <span className="flex items-center gap-1"><Ruler size={14} /> 350m²</span>
              <span className="flex items-center gap-1"><Euro size={14} /> 2 800 000 €</span>
            </div>

            <div className="prose prose-sm text-muted-foreground mb-8 max-w-none">
              <p>
                Magnifique plateau de bureaux situé au cœur du 8ème arrondissement de Paris. 
                Idéalement placé à proximité des Champs-Élysées, ce bien offre une surface de 350m² 
                répartis sur un seul niveau avec vue dégagée.
              </p>
              <h3 className="text-foreground font-display">Caractéristiques</h3>
              <ul>
                <li>Surface : 350m² en un seul plateau</li>
                <li>Étage : 5ème avec ascenseur</li>
                <li>Urbanisme : ZAC tertiaire</li>
                <li>État : Rénové en 2024</li>
                <li>Parking : 8 places en sous-sol</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/dataroom">
                <Button variant="outline">
                  <FolderLock size={16} className="mr-2" /> Accéder à la Data Room
                </Button>
              </Link>
              <Link to="/messaging">
                <Button className="glow-gold">
                  <MessageSquare size={16} className="mr-2" /> Contacter le vendeur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
