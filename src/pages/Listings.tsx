import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, MapPin, Euro, Ruler, Heart, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Lock, MapPinned } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { getTypeColor } from "@/lib/propertyTypes";

const mockListings = [
  { id: 1, title: "Bureau 350m² Paris 8e", type: "Bureaux", surface: "350m²", price: "2 800 000 €", location: "Paris 8e", status: "active", views: 24, matches: 3, viewsTrend: 8, trendDir: "up" as const, priceTag: "firm" as const, photos: 4 },
  { id: 2, title: "Local commercial Marseille", type: "Local commercial", surface: "120m²", price: "450 000 €", location: "Marseille 6e", status: "active", views: 12, matches: 1, viewsTrend: 2, trendDir: "down" as const, priceTag: "negotiable" as const, photos: 3 },
  { id: 3, title: "Immeuble de rapport Lille", type: "Immeuble", surface: "800m²", price: "1 200 000 €", location: "Lille Centre", status: "draft", views: 0, matches: 0, viewsTrend: 0, trendDir: "up" as const, priceTag: "offmarket" as const, photos: 5 },
  { id: 4, title: "Terrain constructible Bordeaux", type: "Terrain à potentiel", surface: "2 000m²", price: "750 000 €", location: "Bordeaux Métropole", status: "active", views: 38, matches: 5, viewsTrend: 15, trendDir: "up" as const, priceTag: "negotiable" as const, photos: 2 },
  { id: 5, title: "Plateau de bureau Lyon", type: "Bureaux", surface: "500m²", price: "1 800 000 €", location: "Lyon Part-Dieu", status: "active", views: 18, matches: 2, viewsTrend: 3, trendDir: "up" as const, priceTag: "firm" as const, photos: 6 },
];

const priceTagConfig = {
  firm: { label: "Prix ferme", bg: "bg-[#4A4A4A]", text: "text-white", border: "" },
  negotiable: { label: "Négociable", bg: "bg-[#D4A843]", text: "text-black", border: "" },
  offmarket: { label: "Off-market", bg: "bg-[#1A1A2E]", text: "text-[#D4A843]", border: "border border-[#D4A843]" },
};

function PhotoCarousel({ photos, type }: { photos: number; type: string }) {
  const [current, setCurrent] = useState(0);
  return (
    <div className="relative h-40 bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden group">
      <span className="text-3xl font-display text-muted-foreground/30">{type}</span>
      {/* Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent((p) => (p - 1 + photos) % photos); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={14} className="text-white" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent((p) => (p + 1) % photos); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={14} className="text-white" />
      </button>
      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {Array.from({ length: Math.min(photos, 5) }).map((_, i) => (
          <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/40"}`} />
        ))}
      </div>
    </div>
  );
}

interface ListingsPageProps {
  mode?: "listings" | "catalog" | "criteria";
}

export default function ListingsPage({ mode = "listings" }: ListingsPageProps) {
  const titles: Record<string, string> = {
    listings: "Mes annonces",
    catalog: "Catalogue d'annonces",
    criteria: "Mes fiches de critères",
  };
  const baselines: Record<string, string> = {
    listings: "Gérez vos biens et suivez leur performance",
    catalog: "Toutes les opportunités qualifiées du réseau",
    criteria: "Vos critères de recherche actifs sur le réseau",
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">{titles[mode]}</h1>
            <p className="text-muted-foreground text-sm mt-1">{baselines[mode]}</p>
          </div>
          {mode !== "catalog" && (
            <Link to={mode === "criteria" ? "/criteria/create" : "/listings/create"}>
              <Button className="glow-gold transition-transform duration-200 hover:scale-[1.02]">
                <Plus size={16} className="mr-2" /> {mode === "criteria" ? "Nouvelle fiche" : "Nouvelle annonce"}
              </Button>
            </Link>
          )}
        </div>

        {mockListings.length === 0 ? (
          <EmptyState
            icon={Plus}
            title={mode === "criteria" ? "Aucune fiche de recherche" : "Aucune annonce"}
            subtitle={mode === "criteria"
              ? "Créez votre première fiche de recherche pour découvrir des opportunités compatibles."
              : "Publiez votre première annonce pour commencer à recevoir des matches qualifiés."}
            ctaLabel={mode === "criteria" ? "+ Nouvelle fiche" : "+ Publier une annonce"}
            ctaHref={mode === "criteria" ? "/criteria/create" : "/listings/create"}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {mockListings.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/listings/${item.id}`}>
                  <div className="glass-card rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-card transition-all duration-200 group">
                    {/* Type color band */}
                    <div className="h-1" style={{ backgroundColor: getTypeColor(item.type) }} />
                    
                    {/* Photo carousel */}
                    <PhotoCarousel photos={item.photos} type={item.type} />
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={item.status === "active" ? "default" : "secondary"} className="text-xs">
                          {item.status === "active" ? "Active" : "Brouillon"}
                        </Badge>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye size={12} /> {item.views}
                          </span>
                          {item.viewsTrend > 0 && (
                            <span className={`text-[10px] flex items-center gap-0.5 ${item.trendDir === "up" ? "text-success" : "text-destructive"}`}>
                              {item.trendDir === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                              {item.viewsTrend}
                            </span>
                          )}
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {item.location}</span>
                        <span className="flex items-center gap-1"><Ruler size={12} /> {item.surface}</span>
                        <span className="flex items-center gap-1"><Euro size={12} /> {item.price}</span>
                      </div>
                      
                      {/* Price tag */}
                      <div className="mt-2">
                        {(() => {
                          const tag = priceTagConfig[item.priceTag];
                          return (
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${tag.bg} ${tag.text} ${tag.border}`}>
                              {item.priceTag === "offmarket" && <Lock size={9} />}
                              {tag.label}
                            </span>
                          );
                        })()}
                      </div>

                      {item.matches > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-primary">
                          <Heart size={12} /> {item.matches} match(es)
                        </div>
                      )}

                      {/* Mini map placeholder */}
                      <div className="mt-3 h-[70px] rounded-lg bg-[#1E2530] flex items-center justify-center">
                        <MapPinned size={18} className="text-primary" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
