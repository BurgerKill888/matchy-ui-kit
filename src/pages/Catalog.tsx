import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Euro, Ruler, Search, Zap, Building2, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { getTypeColor, typeColors } from "@/lib/propertyTypes";

const dpeColors: Record<string, string> = {
  A: "#00A550", B: "#51B848", C: "#BAD429", D: "#FFF100",
  E: "#F5A623", F: "#F26423", G: "#E31837",
};

const mockCatalog = [
  { id: 1, title: "Bureau 350m² Paris 8e", type: "Bureaux", surface: "350m²", price: "2 800 000 €", location: "Paris 8e", owner: "SCI Patrimoine", dpe: "B", compatibility: 92 },
  { id: 2, title: "Local commercial Marseille", type: "Local commercial", surface: "120m²", price: "450 000 €", location: "Marseille 6e", owner: "Cabinet Martin", dpe: "D", compatibility: 78 },
  { id: 3, title: "Immeuble de rapport Lille", type: "Immeuble", surface: "800m²", price: "1 200 000 €", location: "Lille Centre", owner: "SCI Flandres", dpe: "E", compatibility: 65 },
  { id: 4, title: "Terrain constructible Bordeaux", type: "Terrain à potentiel", surface: "2 000m²", price: "750 000 €", location: "Bordeaux Métropole", owner: "Promoteur Sud-Ouest", dpe: null, compatibility: 83 },
  { id: 5, title: "Plateau de bureau Lyon", type: "Bureaux", surface: "500m²", price: "1 800 000 €", location: "Lyon Part-Dieu", owner: "Foncière Grand Ouest", dpe: "A", compatibility: 88 },
  { id: 6, title: "Entrepôt logistique Roissy", type: "Entrepôt / activité", surface: "5 000m²", price: "4 200 000 €", location: "Roissy CDG", owner: "Prologis France", dpe: "B", compatibility: 71 },
  { id: 7, title: "Maison de maître Versailles", type: "Maison", surface: "280m²", price: "2 100 000 €", location: "Versailles", owner: "SCI du Château", dpe: "F", compatibility: 60 },
  { id: 8, title: "Ensemble mixte Nantes", type: "Ensemble immobilier mixte", surface: "3 200m²", price: "5 600 000 €", location: "Nantes Centre", owner: "Foncière Atlantique", dpe: "C", compatibility: 90 },
];

const typeList = ["Tous", "Bureaux", "Local commercial", "Terrain à potentiel", "Entrepôt / activité", "Immeuble", "Appartement", "Maison", "Ensemble immobilier mixte"];
const dpeFilters = ["Tous", "A", "B", "C", "D", "E", "F", "G"];

function DpeBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold text-white"
      style={{ backgroundColor: dpeColors[label] || "#888" }}
    >
      {label}
    </span>
  );
}

function matchBudget(price: string, filter: string): boolean {
  const val = parseInt(price.replace(/\s/g, "").replace(/[^0-9]/g, ""));
  if (filter === "< 500K") return val < 500000;
  if (filter === "500K–1M") return val >= 500000 && val <= 1000000;
  if (filter === "1M–5M") return val > 1000000 && val <= 5000000;
  if (filter === "> 5M") return val > 5000000;
  return true;
}

export default function CatalogPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [budgetFilter, setBudgetFilter] = useState("Tous");
  const [surfaceFilter, setSurfaceFilter] = useState("Tous");
  const [dpeFilter, setDpeFilter] = useState("Tous");
  const [showFilters, setShowFilters] = useState(true);

  const filtered = mockCatalog.filter((item) => {
    const matchSearch = search === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase()) ||
      item.owner.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "Tous" || item.type === typeFilter;
    const matchBud = budgetFilter === "Tous" || matchBudget(item.price, budgetFilter);
    const matchDpe = dpeFilter === "Tous" || item.dpe === dpeFilter;
    return matchSearch && matchType && matchBud && matchDpe;
  });

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold">Catalogue</h1>
          <p className="text-muted-foreground text-sm mt-1">Toutes les opportunités qualifiées du réseau</p>
        </div>

        {/* Search bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ville, code postal, type de bien, vendeur..."
              className="pl-9 bg-secondary border-border"
            />
          </div>
          <Button
            variant="outline"
            className={`gap-1.5 text-sm ${showFilters ? "border-primary text-primary" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={15} />
            Filtres
          </Button>
        </div>

        {/* SeLoger-inspired filter panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-xl p-4 mb-5 space-y-4"
          >
            {/* Type de bien */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Type de bien</p>
              <div className="flex flex-wrap gap-1.5">
                {typeList.map((t) => {
                  const color = t === "Tous" ? undefined : typeColors[t];
                  const isActive = typeFilter === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTypeFilter(t)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                        isActive ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {color && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget + Surface + DPE */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Budget</p>
                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                  <SelectTrigger className="h-8 text-xs bg-secondary border-border">
                    <SelectValue placeholder="Tous les budgets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tous">Tous les budgets</SelectItem>
                    <SelectItem value="< 500K">Moins de 500 000 €</SelectItem>
                    <SelectItem value="500K–1M">500 000 – 1 000 000 €</SelectItem>
                    <SelectItem value="1M–5M">1 000 000 – 5 000 000 €</SelectItem>
                    <SelectItem value="> 5M">Plus de 5 000 000 €</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Surface</p>
                <Select value={surfaceFilter} onValueChange={setSurfaceFilter}>
                  <SelectTrigger className="h-8 text-xs bg-secondary border-border">
                    <SelectValue placeholder="Toutes surfaces" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tous">Toutes surfaces</SelectItem>
                    <SelectItem value="< 100">Moins de 100 m²</SelectItem>
                    <SelectItem value="100-500">100 – 500 m²</SelectItem>
                    <SelectItem value="500-2000">500 – 2 000 m²</SelectItem>
                    <SelectItem value="> 2000">Plus de 2 000 m²</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide flex items-center gap-1">
                  <Zap size={11} /> DPE
                </p>
                <div className="flex flex-wrap gap-1">
                  {dpeFilters.map((f) => (
                    <button
                      key={f}
                      onClick={() => setDpeFilter(f)}
                      className={`w-7 h-7 rounded text-[10px] font-bold border transition-all duration-200 ${
                        dpeFilter === f
                          ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                          : "border-border opacity-60 hover:opacity-100"
                      }`}
                      style={f !== "Tous" ? { backgroundColor: dpeColors[f], color: ["D", "C"].includes(f) ? "black" : "white" } : {}}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted-foreground">{filtered.length} annonce{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground h-7"
                onClick={() => { setTypeFilter("Tous"); setBudgetFilter("Tous"); setSurfaceFilter("Tous"); setDpeFilter("Tous"); setSearch(""); }}
              >
                Réinitialiser
              </Button>
            </div>
          </motion.div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Aucun résultat"
            subtitle="Modifiez vos filtres pour afficher plus d'opportunités."
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

                    {/* Image placeholder */}
                    <div className="h-36 bg-gradient-to-br from-secondary to-muted flex items-center justify-center relative">
                      <Building2 className="text-muted-foreground/20" size={48} />
                      <div className="absolute top-3 left-3">
                        <Badge className="text-xs">{item.type}</Badge>
                      </div>
                      {/* Compatibility */}
                      <div className="absolute top-3 right-3 bg-background/60 backdrop-blur-md rounded-full px-2 py-0.5">
                        <span className="text-xs font-bold text-primary">{item.compatibility}%</span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">{item.owner}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {item.location}</span>
                        <span className="flex items-center gap-1"><Ruler size={11} /> {item.surface}</span>
                        <span className="flex items-center gap-1"><Euro size={11} /> {item.price}</span>
                      </div>

                      {/* DPE */}
                      {item.dpe && (
                        <div className="flex items-center gap-2">
                          <Zap size={11} className="text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">DPE</span>
                          <DpeBadge label={item.dpe} />
                        </div>
                      )}
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
