import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Euro, Ruler, Search, Zap, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { getTypeColor } from "@/lib/propertyTypes";

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

const typeFilters = ["Tous", "Bureaux", "Local commercial", "Terrain à potentiel", "Entrepôt / activité", "Immeuble", "Appartement", "Maison", "Ensemble immobilier mixte"];
const budgetFilters = ["Tous", "< 500K", "500K–1M", "1M–5M", "> 5M"];
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
  const numStr = price.replace(/\s/g, "").replace("€", "").replace(/[^0-9]/g, "");
  const val = parseInt(numStr);
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
  const [dpeFilter, setDpeFilter] = useState("Tous");

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

        {/* Search & filters */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par titre, localisation, vendeur..."
              className="pl-9 bg-secondary border-border"
            />
          </div>

          {/* Type filters */}
          <div className="flex flex-wrap gap-2">
            {typeFilters.map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${typeFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Budget & DPE filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground self-center">Budget :</span>
              {budgetFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setBudgetFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${budgetFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground self-center flex items-center gap-1"><Zap size={12} /> DPE :</span>
              {dpeFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setDpeFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${dpeFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                  }`}
                  style={f !== "Tous" && dpeFilter === f ? {} : {}}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{filtered.length} annonce{filtered.length !== 1 ? "s" : ""} trouvée{filtered.length !== 1 ? "s" : ""}</p>
        </div>

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
