import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, Eye, MapPin, Ruler, Heart, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Lock, Images, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { getTypeColor, typeColors } from "@/lib/propertyTypes";
import { DeleteContentModal, ContentDeletedModal } from "@/components/modals/SystemModals";

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

const mockListings = [
  { id: 1, title: "Bureau 350m² Paris 8e", type: "Bureaux", surface: "350m²", price: "2 800 000 €", location: "Paris 8e", status: "active", views: 24, matches: 3, viewsTrend: 8, trendDir: "up" as const, priceTag: "firm" as const, photos: 4, dpe: "B" },
  { id: 2, title: "Local commercial Marseille", type: "Local commercial", surface: "120m²", price: "450 000 €", location: "Marseille 6e", status: "active", views: 12, matches: 1, viewsTrend: 2, trendDir: "down" as const, priceTag: "negotiable" as const, photos: 3, dpe: "D" },
  { id: 3, title: "Immeuble de rapport Lille", type: "Immeuble", surface: "800m²", price: "1 200 000 €", location: "Lille Centre", status: "draft", views: 0, matches: 0, viewsTrend: 0, trendDir: "up" as const, priceTag: "offmarket" as const, photos: 5, dpe: "E" },
  { id: 4, title: "Terrain constructible Bordeaux", type: "Terrain à potentiel", surface: "2 000m²", price: "750 000 €", location: "Bordeaux Métropole", status: "active", views: 38, matches: 5, viewsTrend: 15, trendDir: "up" as const, priceTag: "negotiable" as const, photos: 2, dpe: null },
  { id: 5, title: "Plateau de bureau Lyon", type: "Bureaux", surface: "500m²", price: "1 800 000 €", location: "Lyon Part-Dieu", status: "active", views: 18, matches: 2, viewsTrend: 3, trendDir: "up" as const, priceTag: "firm" as const, photos: 6, dpe: "A" },
  { id: 6, title: "Entrepôt logistique Roissy", type: "Entrepôt / activité", surface: "5 000m²", price: "4 200 000 €", location: "Roissy CDG", status: "active", views: 29, matches: 4, viewsTrend: 6, trendDir: "up" as const, priceTag: "negotiable" as const, photos: 4, dpe: "B" },
  { id: 7, title: "Maison de maître Versailles", type: "Maison", surface: "280m²", price: "2 100 000 €", location: "Versailles", status: "active", views: 11, matches: 1, viewsTrend: 2, trendDir: "up" as const, priceTag: "firm" as const, photos: 7, dpe: "F" },
  { id: 8, title: "Ensemble mixte Nantes", type: "Ensemble immobilier mixte", surface: "3 200m²", price: "5 600 000 €", location: "Nantes Centre", status: "draft", views: 0, matches: 0, viewsTrend: 0, trendDir: "up" as const, priceTag: "offmarket" as const, photos: 5, dpe: "C" },
];

const priceTagConfig = {
  firm: { label: "Prix ferme", bg: "bg-[#4A4A4A]", text: "text-white", border: "" },
  negotiable: { label: "Négociable", bg: "bg-[#D4A843]", text: "text-black", border: "" },
  offmarket: { label: "Off-market", bg: "bg-[#1A1A2E]", text: "text-[#D4A843]", border: "border border-[#D4A843]" },
};

const dpeColors: Record<string, string> = {
  A: "#00A550", B: "#51B848", C: "#BAD429", D: "#F5C518",
  E: "#F5A623", F: "#F26423", G: "#E31837",
};

function DpeBadge({ dpe }: { dpe: string | null }) {
  if (!dpe) return null;
  const color = dpeColors[dpe] ?? "#5A6B7A";
  return (
    <div className="mt-2 flex items-center gap-1.5">
      <Zap size={11} className="text-muted-foreground" />
      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">DPE</span>
      <span
        className="w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold text-white shadow-sm"
        style={{ backgroundColor: color }}
      >
        {dpe}
      </span>
    </div>
  );
}

function PhotoCarousel({ photos, type, status, priceTag, hidePause }: { photos: number; type: string; status: string; priceTag: string; hidePause?: boolean }) {
  const [current, setCurrent] = useState(0);
  const isDraft = status === "draft" && !hidePause;
  return (
    <div className="relative h-44 bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden group">
      <span className="text-4xl font-display text-muted-foreground/15 italic font-light text-center px-4">{type}</span>

      {/* Draft / Pause overlay */}
      {isDraft && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[5]">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-5 py-2.5 text-sm font-bold text-white/70 tracking-wider">
            ⏸ EN PAUSE
          </div>
        </div>
      )}

      {/* Status badge top-left */}
      <div className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold border ${
        isDraft
          ? "bg-orange-500/15 border-orange-500/30 text-orange-400"
          : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isDraft ? "bg-orange-400" : "bg-emerald-400"}`} />
        {isDraft ? "En pause" : "Active"}
      </div>

      {/* Off-market badge top-right */}
      {priceTag === "offmarket" && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold bg-primary/15 border border-primary/30 text-primary">
          <Lock size={9} /> Off-market
        </div>
      )}

      {/* Photo count bottom-right */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-md px-2.5 py-1 z-10">
        <Images size={11} className="text-white/80" />
        <span className="text-[11px] text-white/80 font-medium">{photos}</span>
      </div>

      {/* Nav arrows */}
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
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {Array.from({ length: Math.min(photos, 5) }).map((_, i) => (
          <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/30"}`} />
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteDoneOpen, setDeleteDoneOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<typeof mockListings[0] | null>(null);

  const filtered = typeFilter === "Tous" ? mockListings : mockListings.filter((l) => l.type === typeFilter);

  function handleDeleteClick(e: React.MouseEvent, item: typeof mockListings[0]) {
    e.preventDefault();
    e.stopPropagation();
    setDeleteTarget(item);
    setDeleteModalOpen(true);
  }

  function handleConfirmDelete() {
    setDeleteModalOpen(false);
    setDeleteDoneOpen(true);
  }

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
                  <div className={`glass-card rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-card transition-all duration-200 group ${item.status === "draft" ? "opacity-80" : ""}`}>
                    {/* Type color band */}
                    <div className="h-1" style={{ backgroundColor: getTypeColor(item.type) }} />

                    {/* Photo carousel with status overlay */}
                    <PhotoCarousel photos={item.photos} type={item.type} status={item.status} priceTag={item.priceTag} hidePause={mode === "catalog"} />

                    <div className={`p-4 ${item.status === "draft" ? "opacity-60" : ""}`}>
                      {/* Prix + price tag */}
                      <div className="flex items-baseline gap-2 mb-1.5">
                        {item.priceTag === "offmarket" ? (
                          <span className="text-xl font-extrabold text-foreground tracking-tight">Prix confidentiel</span>
                        ) : (
                          <span className="text-xl font-extrabold text-foreground tracking-tight">{item.price}</span>
                        )}
                        {item.priceTag !== "offmarket" && (
                          <span className="text-[11px] font-semibold text-primary bg-primary/10 rounded px-2 py-0.5">
                            {priceTagConfig[item.priceTag].label}
                          </span>
                        )}
                      </div>

                      {/* Titre */}
                      <h3 className="font-bold text-sm mb-2 text-foreground group-hover:text-primary transition-colors">{item.title}</h3>

                      {/* Infos techniques inline */}
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {item.location}</span>
                        <span className="flex items-center gap-1"><Ruler size={11} /> {item.surface}</span>
                        {item.dpe && (
                          <span className="flex items-center gap-1">
                            <Zap size={11} /> DPE
                            <span
                              className="w-4 h-4 flex items-center justify-center rounded text-[9px] font-bold text-white ml-0.5"
                              style={{ backgroundColor: dpeColors[item.dpe] ?? "#5A6B7A" }}
                            >
                              {item.dpe}
                            </span>
                          </span>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-border/50 mb-3" />

                      {/* Stats row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Eye size={11} /> {item.views} vues
                          </span>
                          {item.viewsTrend > 0 && (
                            <span className={`text-[11px] flex items-center gap-0.5 ${item.trendDir === "up" ? "text-emerald-400" : "text-destructive"}`}>
                              {item.trendDir === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                              {item.viewsTrend}
                            </span>
                          )}
                        </div>

                        {/* Matches badge */}
                        {item.matches > 0 ? (
                          <div className="flex items-center gap-1.5 bg-primary/10 rounded-lg px-3 py-1.5">
                            <Heart size={12} className="text-primary fill-primary" />
                            <span className="text-[13px] font-bold text-primary">{item.matches} match{item.matches > 1 ? "s" : ""}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/30">Aucun match pour le moment</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete modals */}
      {deleteTarget && (
        <>
          <DeleteContentModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            contentType="annonce"
            contentTitle={deleteTarget.title}
            contentSubtitle={`${deleteTarget.surface} · ${deleteTarget.price} · ${deleteTarget.location}`}
            onConfirm={handleConfirmDelete}
            onPause={() => setDeleteModalOpen(false)}
          />
          <ContentDeletedModal
            open={deleteDoneOpen}
            onOpenChange={setDeleteDoneOpen}
            contentType="annonce"
          />
        </>
      )}
    </AppLayout>
  );
}
