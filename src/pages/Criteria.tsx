import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Heart, MapPin, Euro, Ruler, Zap, Edit, Trash2, Filter, X } from "lucide-react";
import { getTypeColor } from "@/lib/propertyTypes";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { DeleteContentModal, ContentDeletedModal } from "@/components/modals/SystemModals";

const dpeColors: Record<string, string> = {
  A: "#00A550",
  B: "#51B848",
  C: "#BAD429",
  D: "#FFF100",
  E: "#F5A623",
  F: "#F26423",
  G: "#E31837",
};

const mockCriteria = [
  {
    id: 1,
    name: "Fiche 1",
    title: "Bureaux IDF — 200 à 500m²",
    type: "Bureaux",
    surface: "200 – 500m²",
    budgetMin: "800 000 €",
    budgetMax: "3 000 000 €",
    location: "Île-de-France",
    status: "active" as const,
    matches: 5,
    dpe: ["A", "B", "C"],
  },
  {
    id: 2,
    name: "Fiche 2",
    title: "Entrepôts Lyon — > 2 000m²",
    type: "Entrepôt / activité",
    surface: "> 2 000m²",
    budgetMin: "1 000 000 €",
    budgetMax: "4 000 000 €",
    location: "Lyon Métropole",
    status: "active" as const,
    matches: 0,
    dpe: ["A", "B"],
  },
  {
    id: 3,
    name: "Fiche 3",
    title: "Terrains constructibles Bordeaux",
    type: "Terrain à potentiel",
    surface: "1 000 – 5 000m²",
    budgetMin: "500 000 €",
    budgetMax: "2 000 000 €",
    location: "Bordeaux Métropole",
    status: "active" as const,
    matches: 3,
    dpe: [],
  },
  {
    id: 4,
    name: "Commerce Paris Centre",
    title: "Local commercial Centre-ville",
    type: "Local commercial",
    surface: "50 – 200m²",
    budgetMin: "200 000 €",
    budgetMax: "800 000 €",
    location: "Paris 1er – 4ème",
    status: "draft" as const,
    matches: 0,
    dpe: ["B", "C", "D"],
  },
];

function DpeBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold text-white"
      style={{ backgroundColor: dpeColors[label] || "#888" }}
      title={`DPE classe ${label}`}
    >
      {label}
    </span>
  );
}

export default function CriteriaPage() {
  const [typeFilter, setTypeFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState("Tous");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteDoneOpen, setDeleteDoneOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<typeof mockCriteria[0] | null>(null);

  function handleDeleteClick(item: typeof mockCriteria[0]) {
    setDeleteTarget(item);
    setDeleteModalOpen(true);
  }

  function handleConfirmDelete() {
    setDeleteModalOpen(false);
    setDeleteDoneOpen(true);
  }

  const types = ["Bureaux", "Local commercial", "Terrain à potentiel", "Entrepôt / activité", "Immeuble", "Appartement", "Maison"];
  const statuses = ["Tous", "Active", "Brouillon"];

  function toggleType(t: string) {
    setTypeFilter(typeFilter.includes(t) ? typeFilter.filter((x) => x !== t) : [...typeFilter, t]);
  }

  const activeFilterCount = typeFilter.length + (statusFilter !== "Tous" ? 1 : 0);

  const filtered = mockCriteria.filter((c) => {
    const matchType = typeFilter.length === 0 || typeFilter.includes(c.type);
    const matchStatus = statusFilter === "Tous" || (statusFilter === "Active" ? c.status === "active" : c.status === "draft");
    return matchType && matchStatus;
  });

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Mes fiches de critères</h1>
            <p className="text-muted-foreground text-sm mt-1">Vos critères de recherche actifs sur le réseau</p>
          </div>
          <Link to="/criteria/create" className="block w-full sm:w-auto">
            <Button className="glow-gold transition-transform duration-200 hover:scale-[1.02] w-full sm:w-auto">
              <Plus size={16} className="mr-2" /> Nouvelle fiche
            </Button>
          </Link>
        </div>

        {/* Filter button */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            className={`text-xs h-8 gap-1.5 ${activeFilterCount > 0 ? "border-primary text-primary" : ""}`}
            onClick={() => setFilterModalOpen(true)}
          >
            <Filter size={13} />
            {activeFilterCount > 0 ? `${activeFilterCount} filtre${activeFilterCount > 1 ? "s" : ""}` : "Filtres"}
          </Button>
        </div>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {typeFilter.map((t) => (
              <button
                key={t}
                onClick={() => toggleType(t)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: getTypeColor(t) }} />
                {t}
                <X size={10} />
              </button>
            ))}
            {statusFilter !== "Tous" && (
              <button
                onClick={() => setStatusFilter("Tous")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-accent text-accent-foreground border border-border hover:bg-accent/80 transition-colors"
              >
                {statusFilter}
                <X size={10} />
              </button>
            )}
            <button onClick={() => { setTypeFilter([]); setStatusFilter("Tous"); }} className="px-2 py-1 rounded-full text-[10px] text-muted-foreground hover:text-foreground transition-colors">
              Tout effacer
            </button>
          </div>
        )}

        {/* Filter Modal */}
        <Dialog open={filterModalOpen} onOpenChange={setFilterModalOpen}>
          <DialogContent className="max-w-sm">
            <DialogTitle className="font-display text-lg">Filtres</DialogTitle>
            <DialogDescription className="sr-only">Filtrer les fiches par type de bien et statut</DialogDescription>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Type de bien</p>
                <div className="flex flex-wrap gap-1.5">
                  {types.map((t) => {
                    const isActive = typeFilter.includes(t);
                    const color = getTypeColor(t);
                    return (
                      <button
                        key={t}
                        onClick={() => toggleType(t)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                          isActive ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Statut</p>
                <div className="flex flex-wrap gap-1.5">
                  {statuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                        statusFilter === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setTypeFilter([]); setStatusFilter("Tous"); }}>
                  Réinitialiser
                </Button>
              )}
              <Button size="sm" onClick={() => setFilterModalOpen(false)}>Appliquer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="Aucune fiche de recherche"
            subtitle="Créez votre première fiche de recherche pour découvrir des opportunités compatibles."
            ctaLabel="+ Nouvelle fiche"
            ctaHref="/criteria/create"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="glass-card rounded-xl p-5 hover:border-primary/30 hover:shadow-card transition-all duration-200 group relative">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant={item.status === "active" ? "default" : "secondary"} className="text-xs shrink-0">
                          {item.status === "active" ? "Active" : "Brouillon"}
                        </Badge>
                        {item.matches > 0 && (
                          <span className="text-xs text-primary flex items-center gap-1 font-semibold">
                            <Heart size={11} /> {item.matches} match{item.matches > 1 ? "es" : ""}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-primary transition-colors leading-snug">{item.title}</h3>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Link to={`/criteria/create`}>
                        <Button size="sm" variant="outline" className="text-xs h-7 transition-transform duration-200 hover:scale-[1.02]">
                          <Edit size={12} className="mr-1" /> Modifier
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="text-xs h-7 border-destructive/40 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteClick(item)}>
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </div>

                  {/* Name badge - well integrated */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 bg-primary/8 text-primary border border-primary/15 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1 bg-secondary/60 px-2 py-0.5 rounded-full">
                      <MapPin size={11} className="text-primary" /> {item.location}
                    </span>
                    <span className="flex items-center gap-1 bg-secondary/60 px-2 py-0.5 rounded-full">
                      <Ruler size={11} className="text-primary" /> {item.surface}
                    </span>
                    <span className="flex items-center gap-1 bg-secondary/60 px-2 py-0.5 rounded-full">
                      <Euro size={11} className="text-primary" /> {item.budgetMin} – {item.budgetMax}
                    </span>
                  </div>

                  {/* DPE */}
                  {item.dpe.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Zap size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">DPE accepté :</span>
                      <div className="flex gap-1">
                        {item.dpe.map((d) => <DpeBadge key={d} label={d} />)}
                      </div>
                    </div>
                  )}
                  {item.dpe.length === 0 && (
                    <div className="flex items-center gap-2">
                      <Zap size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground italic">Pas de contrainte DPE</span>
                    </div>
                  )}
                </div>
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
            contentType="fiche"
            contentTitle={deleteTarget.title}
            contentSubtitle={`Budget : ${deleteTarget.budgetMin} – ${deleteTarget.budgetMax}`}
            onConfirm={handleConfirmDelete}
          />
          <ContentDeletedModal
            open={deleteDoneOpen}
            onOpenChange={setDeleteDoneOpen}
            contentType="fiche"
          />
        </>
      )}
    </AppLayout>
  );
}
