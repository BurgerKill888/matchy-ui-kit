import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Sparkles, MapPin, Euro, Ruler } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

const mockListings = [
  { id: 1, title: "Bureau 350m² Paris 8e", type: "Bureau", surface: "350m²", price: "2 800 000 €", location: "Paris 8e", status: "active", views: 24, matches: 3 },
  { id: 2, title: "Local commercial Marseille", type: "Commerce", surface: "120m²", price: "450 000 €", location: "Marseille 6e", status: "active", views: 12, matches: 1 },
  { id: 3, title: "Immeuble de rapport Lille", type: "Immeuble", surface: "800m²", price: "1 200 000 €", location: "Lille Centre", status: "draft", views: 0, matches: 0 },
  { id: 4, title: "Terrain constructible Bordeaux", type: "Terrain", surface: "2 000m²", price: "750 000 €", location: "Bordeaux Métropole", status: "active", views: 38, matches: 5 },
  { id: 5, title: "Plateau de bureau Lyon", type: "Bureau", surface: "500m²", price: "1 800 000 €", location: "Lyon Part-Dieu", status: "active", views: 18, matches: 2 },
];

interface ListingsPageProps {
  mode?: "listings" | "catalog" | "criteria";
}

export default function ListingsPage({ mode = "listings" }: ListingsPageProps) {
  const titles = {
    listings: "Mes annonces",
    catalog: "Catalogue d'annonces",
    criteria: "Mes fiches de critères",
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold">{titles[mode]}</h1>
          {mode !== "catalog" && (
            <Link to={mode === "criteria" ? "/criteria/create" : "/listings/create"}>
              <Button className="glow-gold">
                <Plus size={16} className="mr-2" /> {mode === "criteria" ? "Nouvelle fiche" : "Nouvelle annonce"}
              </Button>
            </Link>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockListings.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/listings/${item.id}`}>
                <div className="glass-card rounded-xl overflow-hidden hover:border-primary/30 transition-all group">
                  <div className="h-32 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                    <span className="text-3xl font-display text-muted-foreground/30">{item.type}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={item.status === "active" ? "default" : "secondary"} className="text-xs">
                        {item.status === "active" ? "Active" : "Brouillon"}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye size={12} /> {item.views}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
                      <span className="flex items-center gap-1"><Ruler size={12} /> {item.surface}</span>
                      <span className="flex items-center gap-1"><Euro size={12} /> {item.price}</span>
                    </div>
                    {item.matches > 0 && (
                      <div className="mt-3 flex items-center gap-1 text-xs text-primary">
                        <Sparkles size={12} /> {item.matches} match(es)
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
