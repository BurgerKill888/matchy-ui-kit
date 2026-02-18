import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, MapPin, Euro, Ruler, Heart, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Lock, MapPinned, Pencil, Images, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { getTypeColor, typeColors } from "@/lib/propertyTypes";

const typeList = [
  "Tous",
  "Bureaux",
  "Local commercial",
  "Terrain à potentiel",
  "Entrepôt / activité",
  "Immeuble",
  "Appartement",
  "Maison",
  "Ensemble immobilier mixte",
];

const dpeColors: Record<string, string> = {
  A: "#00A550", B: "#51B848", C: "#BAD429", D: "#FFF100",
  E: "#F5A623", F: "#F26423", G: "#E31837",
};

const mockListings = [
  { id: 1, title: "Bureau 350m² Paris 8e", type: "Bureaux", surface: "350m²", price: "2 800 000 €", location: "Paris 8e", status: "active", views: 24, matches: 3, viewsTrend: 8, trendDir: "up" as const, priceTag: "firm" as const, photos: 4, dpe: "B" },
  { id: 2, title: "Local commercial Marseille", type: "Local commercial", surface: "120m²", price: "450 000 €", location: "Marseille 6e", status: "active", views: 12, matches: 1, viewsTrend: 2, trendDir: "down" as const, priceTag: "negotiable" as const, photos: 3, dpe: "D" },
  { id: 3, title: "Immeuble de rapport Lille", type: "Immeuble", surface: "800m²", price: "1 200 000 €", location: "Lille Centre", status: "draft", views: 0, matches: 0, viewsTrend: 0, trendDir: "up" as const, priceTag: "offmarket" as const, photos: 5, dpe: "E" },
  { id: 4, title: "Terrain constructible Bordeaux", type: "Terrain à potentiel", surface: "2 000m²", price: "750 000 €", location: "Bordeaux Métropole", status: "active", views: 38, matches: 5, viewsTrend: 15, trendDir: "up" as const, priceTag: "negotiable" as const, photos: 2, dpe: null },
  { id: 5, title: "Plateau de bureau Lyon", type: "Bureaux", surface: "500m²", price: "1 800 000 €", location: "Lyon Part-Dieu", status: "active", views: 18, matches: 2, viewsTrend: 3, trendDir: "up" as const, priceTag: "firm" as const, photos: 6, dpe: "A" },
];

const priceTagConfig = {
  firm: { label: "Prix ferme", bg: "bg-[#4A4A4A]", text: "text-white", border: "" },
  negotiable: { label: "Négociable", bg: "bg-[#D4A843]", text: "text-black", border: "" },
  offmarket: { label: "Off-market", bg: "bg-[#1A1A2E]", text: "text-[#D4A843]", border: "border border-[#D4A843]" },
};

// DPE bar SeLoger-style
function DpeBar({ dpe }: { dpe: string | null }) {
  if (!dpe) return null;
  const classes = ["A", "B", "C", "D", "E", "F", "G"];
  const widths = [40, 52, 64, 76, 88, 100, 100];
  const colors = ["#00A550", "#51B848", "#BAD429", "#FFF100", "#F5A623", "#F26423", "#E31837"];
  const textColors = ["white", "white", "black", "black", "black", "white", "white"];
  return (
    <div className="mt-3 space-y-0.5">
      <div className="flex items-center gap-1 mb-1">
        <Zap size={11} className="text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground font-medium">DPE</span>
      </div>
      {classes.map((cls, idx) => {
        const isActive = cls === dpe;
        return (
          <div key={cls} className="flex items-center gap-1.5">
            <div
              className={`flex items-center justify-end pr-2 rounded-sm transition-all ${isActive ? "ring-1 ring-white/40 shadow-sm" : "opacity-40"}`}
              style={{
                width: `${widths[idx]}%`,
                backgroundColor: colors[idx],
                height: isActive ? "14px" : "10px",
              }}
            >
              <span
                className="text-[9px] font-bold"
                style={{ color: textColors[idx] }}
              >
                {cls}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PhotoCarousel({ photos, type }: { photos: number; type: string }) {
  const [current, setCurrent] = useState(0);
  return (
    <div className="relative h-44 bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden group">
      <span className="text-3xl font-display text-muted-foreground/20">{type}</span>
      {/* Photo count badge */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
        <Images size={11} className="text-white" />
        <span className="text-[10px] text-white font-medium">{photos}</span>
      </div>
      {/* Arrows */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent((p) => (p - 1 + photos) % photos); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronLeft size={14} className="text-white" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrent((p) => (p + 1) % photos); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
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
  mode?: "listings" | "catalog";
}

export default function ListingsPage({ mode = "listings" }: ListingsPageProps) {
  const [typeFilter, setTypeFilter] = useState("Tous");

  const filtered = typeFilter === "Tous" ? mockListings : mockListings.filter((l) => l.type === typeFilter);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              {mode === "catalog" ? "Catalogue d'annonces" : "Mes annonces"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === "catalog"
                ? "Toutes les opportunités qualifiées du réseau"
                : "Gérez vos biens, suivez les vues et les matches en temps réel"}
            </p>
          </div>
          {mode !== "catalog" && (
            <Link to="/listings/create">
              <Button className="glow-gold transition-transform duration-200 hover:scale-[1.02]">
                <Plus size={16} className="mr-2" /> Nouvelle annonce
              </Button>
            </Link>
          )}
        </div>

        {/* Type pills */}
        <div className="flex flex-wrap gap-2 mt-4 mb-6">
          {typeList.map((t) => {
            const color = t === "Tous" ? undefined : typeColors[t];
            const isActive = typeFilter === t;
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  isActive
                    ? "border-primary text-primary-foreground bg-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                }`}
              >
                {color && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                )}
                {t}
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="Aucune annonce"
            subtitle="Publiez votre première annonce pour commencer à recevoir des matches qualifiés."
            ctaLabel="+ Publier une annonce"
            ctaHref="/listings/create"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item, i) => (
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
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye size={12} /> {item.views}
                          </span>
                          {item.viewsTrend > 0 && (
                            <span className={`text-[10px] flex items-center gap-0.5 ${item.trendDir === "up" ? "text-success" : "text-destructive"}`}>
                              {item.trendDir === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                              {item.viewsTrend}
                            </span>
                          )}
                          {/* Edit icon */}
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className="w-6 h-6 rounded-md bg-secondary/60 hover:bg-secondary flex items-center justify-center transition-colors"
                            title="Modifier l'annonce"
                          >
                            <Pencil size={11} className="text-muted-foreground hover:text-foreground" />
                          </button>
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

                      {/* DPE SeLoger-style */}
                      <DpeBar dpe={item.dpe} />

                      {/* Mini map placeholder */}
                      <div className="mt-3 h-[60px] rounded-lg bg-[#1E2530] flex items-center justify-center">
                        <MapPinned size={16} className="text-primary" />
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
