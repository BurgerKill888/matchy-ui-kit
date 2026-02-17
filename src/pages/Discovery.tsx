import AppLayout from "@/components/AppLayout";
import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from "framer-motion";
import { MapPin, Ruler, Euro, Building2, X, Heart, RotateCcw, CheckCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MatchCelebrationModal from "@/components/modals/MatchCelebrationModal";
import CompatibilityDetailModal from "@/components/CompatibilityDetailModal";
import EmptyState from "@/components/EmptyState";
import { getTypeColor } from "@/lib/propertyTypes";

const mockCards = [
  { id: 1, title: "Bureau 350m² Paris 8e", type: "Bureaux", surface: "350m²", price: "2 800 000 €", location: "Paris 8e", description: "Magnifique plateau de bureaux au cœur du 8ème, rénové en 2024. Vue dégagée, 8 places de parking.", owner: "SCI Patrimoine", compatibility: 92 },
  { id: 2, title: "Immeuble mixte Lyon 6e", type: "Immeuble", surface: "1 200m²", price: "3 500 000 €", location: "Lyon 6e", description: "Immeuble mixte commerce/habitation, bon rendement locatif. Proche transports en commun.", owner: "Foncière Grand Ouest", compatibility: 85 },
  { id: 3, title: "Terrain 2ha Bordeaux", type: "Terrain à potentiel", surface: "20 000m²", price: "1 800 000 €", location: "Bordeaux Métropole", description: "Terrain constructible en zone d'aménagement concerté. Idéal pour programme résidentiel ou mixte.", owner: "Groupe Nexity Régions", compatibility: 78 },
  { id: 4, title: "Local commercial Marseille", type: "Local commercial", surface: "180m²", price: "620 000 €", location: "Marseille Vieux-Port", description: "Emplacement premium pied d'immeuble. Double vitrine, forte visibilité. Libre de suite.", owner: "Cabinet Martin & Associés", compatibility: 88 },
  { id: 5, title: "Entrepôt logistique Roissy", type: "Entrepôt / activité", surface: "5 000m²", price: "4 200 000 €", location: "Roissy CDG", description: "Entrepôt classe A aux normes ICPE. Quais de chargement, sprinklers. Proximité autoroute A1.", owner: "Prologis France", compatibility: 71 },
  { id: 6, title: "Appartement T4 Neuilly", type: "Appartement", surface: "120m²", price: "1 450 000 €", location: "Neuilly-sur-Seine", description: "Bel appartement familial avec balcon et vue sur le Bois de Boulogne. Parking en sous-sol.", owner: "Agence Prestige", compatibility: 82 },
  { id: 7, title: "Maison de maître Versailles", type: "Maison", surface: "280m²", price: "2 100 000 €", location: "Versailles", description: "Maison de maître avec jardin arboré, 6 chambres, dépendances. Proximité gare et commerces.", owner: "SCI du Château", compatibility: 76 },
  { id: 8, title: "Ensemble mixte Nantes", type: "Ensemble immobilier mixte", surface: "3 200m²", price: "5 600 000 €", location: "Nantes Centre", description: "Ensemble immobilier mixte comprenant commerces en RDC et bureaux aux étages. Bon rendement.", owner: "Foncière Atlantique", compatibility: 90 },
  { id: 9, title: "Local d'activité Toulouse", type: "Entrepôt / activité", surface: "800m²", price: "380 000 €", location: "Toulouse Basso", description: "Local d'activité avec showroom, bureaux et atelier. Accès poids lourds.", owner: "SCI Midi", compatibility: 74 },
  { id: 10, title: "Bureau open-space Levallois", type: "Bureaux", surface: "450m²", price: "3 200 000 €", location: "Levallois-Perret", description: "Plateau open-space lumineux, climatisé, fibre optique. 12 places de parking.", owner: "Gecina", compatibility: 87 },
  { id: 11, title: "Immeuble résidentiel Strasbourg", type: "Immeuble", surface: "900m²", price: "1 900 000 €", location: "Strasbourg Petite France", description: "Immeuble résidentiel de 8 lots dans quartier historique. Rendement 5,2%.", owner: "SCI Alsace", compatibility: 83 },
  { id: 12, title: "Terrain viabilisé Montpellier", type: "Terrain à potentiel", surface: "5 000m²", price: "950 000 €", location: "Montpellier Nord", description: "Terrain viabilisé en zone AU, permis accordé pour 40 logements.", owner: "Promoteur Sud", compatibility: 79 },
  { id: 13, title: "Boutique Champs-Élysées", type: "Local commercial", surface: "95m²", price: "8 500 000 €", location: "Paris 8e", description: "Emplacement exceptionnel sur les Champs-Élysées. Vitrine 8m linéaires.", owner: "Foncière Luxe", compatibility: 68 },
  { id: 14, title: "Maison contemporaine Annecy", type: "Maison", surface: "200m²", price: "1 350 000 €", location: "Annecy-le-Vieux", description: "Villa contemporaine avec vue lac, piscine, 4 chambres. Terrain 1 200m².", owner: "Propriétaire privé", compatibility: 81 },
  { id: 15, title: "Appartement Haussmannien Paris 16e", type: "Appartement", surface: "180m²", price: "2 400 000 €", location: "Paris 16e", description: "Appartement de réception, moulures, parquet, cheminées. Gardien, digicode.", owner: "SCI Trocadéro", compatibility: 86 },
  { id: 16, title: "Entrepôt frigorifique Rungis", type: "Entrepôt / activité", surface: "2 500m²", price: "1 800 000 €", location: "Rungis MIN", description: "Entrepôt frigorifique aux normes. Quais réfrigérés, chambres froides.", owner: "Logistique Froid", compatibility: 72 },
  { id: 17, title: "Ensemble commercial Bordeaux", type: "Ensemble immobilier mixte", surface: "1 800m²", price: "3 900 000 €", location: "Bordeaux Lac", description: "Centre commercial de proximité, 12 cellules, parking 80 places.", owner: "Foncière Gironde", compatibility: 84 },
  { id: 18, title: "Bureau co-working Paris 11e", type: "Bureaux", surface: "600m²", price: "4 500 000 €", location: "Paris 11e", description: "Espace aménagé en co-working, 80 postes, salles de réunion, rooftop.", owner: "WeWork France", compatibility: 77 },
  { id: 19, title: "Immeuble neuf Grenoble", type: "Immeuble", surface: "1 500m²", price: "2 800 000 €", location: "Grenoble Centre", description: "Immeuble neuf BBC, 15 appartements, commerces en RDC. Livraison Q2 2026.", owner: "Promoteur Alpes", compatibility: 91 },
  { id: 20, title: "Local commercial Nice", type: "Local commercial", surface: "150m²", price: "720 000 €", location: "Nice Promenade", description: "Local commercial angle, double exposition, terrasse possible. Zone piétonne.", owner: "SCI Côte d'Azur", compatibility: 80 },
];

const typeFilters = ["Tous", "Bureaux", "Local commercial", "Terrain à potentiel", "Entrepôt / activité", "Immeuble", "Appartement", "Maison", "Ensemble immobilier mixte"];
const budgetFilters = ["Tous", "< 500K", "500K–1M", "1M–5M", "> 5M"];

function SwipeCard({ card, isTop, onSwipe, onScoreClick }: {
  card: (typeof mockCards)[0]; isTop: boolean; onSwipe: (d: "left" | "right") => void; onScoreClick: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const opacityLeft = useTransform(x, [-150, 0], [1, 0]);
  const opacityRight = useTransform(x, [0, 150], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 120) onSwipe("right");
    else if (info.offset.x < -120) onSwipe("left");
  };

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate, zIndex: isTop ? 10 : 0 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.6 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
      exit={{ x: 500, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="h-full glass-card rounded-2xl overflow-hidden shadow-elevated flex flex-col">
        {/* Type color band */}
        <div className="h-1" style={{ backgroundColor: getTypeColor(card.type) }} />
        <div className="relative h-44 bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center">
          <Building2 className="text-muted-foreground/15" size={80} />
          <div className="absolute top-4 left-4">
            <Badge className="text-xs font-semibold">{card.type}</Badge>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onScoreClick(); }}
            className="absolute top-4 right-4 flex items-center gap-1.5 bg-background/60 backdrop-blur-md rounded-full px-3 py-1 hover:bg-background/80 transition-colors cursor-pointer"
          >
            <span className="text-xs font-bold text-primary">{card.compatibility}%</span>
            <span className="text-xs text-muted-foreground">compatible</span>
          </button>

          {isTop && (
            <>
              <motion.div className="absolute top-4 left-4 px-4 py-2 rounded-lg border-2 border-destructive bg-destructive/20" style={{ opacity: opacityLeft }}>
                <span className="font-display font-bold text-destructive text-lg">PASSER</span>
              </motion.div>
              <motion.div className="absolute top-4 right-4 px-4 py-2 rounded-lg border-2 border-primary bg-primary/20" style={{ opacity: opacityRight }}>
                <span className="font-display font-bold text-primary text-lg">MATCH</span>
              </motion.div>
            </>
          )}
        </div>

        <div className="flex-1 p-5 flex flex-col">
          <h2 className="font-display text-xl font-bold mb-1">{card.title}</h2>
          <p className="text-sm text-primary font-medium mb-3">{card.owner}</p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1 bg-secondary/50 px-2.5 py-1 rounded-full"><MapPin size={12} className="text-primary" /> {card.location}</span>
            <span className="flex items-center gap-1 bg-secondary/50 px-2.5 py-1 rounded-full"><Ruler size={12} className="text-primary" /> {card.surface}</span>
            <span className="flex items-center gap-1 bg-secondary/50 px-2.5 py-1 rounded-full"><Euro size={12} className="text-primary" /> {card.price}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed flex-1">{card.description}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground/60 mt-3">
            <ChevronDown size={14} /> Swipez ou utilisez les boutons
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Discovery() {
  const [cards, setCards] = useState(mockCards);
  const [history, setHistory] = useState<(typeof mockCards)[0][]>([]);
  const [matchModal, setMatchModal] = useState(false);
  const [lastMatch, setLastMatch] = useState<(typeof mockCards)[0] | null>(null);
  const [scoreModal, setScoreModal] = useState(false);
  const [scoreCard, setScoreCard] = useState<(typeof mockCards)[0] | null>(null);
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [budgetFilter, setBudgetFilter] = useState("Tous");

  const handleSwipe = useCallback((direction: "left" | "right") => {
    const current = cards[cards.length - 1];
    if (!current) return;
    setHistory((prev) => [current, ...prev]);
    setCards((prev) => prev.slice(0, -1));
    if (direction === "right" && Math.random() > 0.5) {
      setLastMatch(current);
      setTimeout(() => setMatchModal(true), 400);
    }
  }, [cards]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const [last, ...rest] = history;
    setHistory(rest);
    setCards((prev) => [...prev, last]);
  };

  const resetCards = () => { setCards(mockCards); setHistory([]); };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-4">
          <h1 className="font-display text-2xl md:text-3xl font-bold">Découvrir</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {cards.length > 0
              ? `Découvrez les ${cards.length} opportunités que Matchstone a sélectionnées pour vous`
              : "Vous avez tout exploré !"}
          </p>
          {cards.length > 0 && (
            <p className="text-xs text-muted-foreground/70 mt-0.5">
              {cards.length} opportunité{cards.length > 1 ? "s" : ""} à découvrir
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-2 max-w-2xl">
          {typeFilters.map((f) => (
            <button key={f} onClick={() => setTypeFilter(f)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${typeFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-lg">
          {budgetFilters.map((f) => (
            <button key={f} onClick={() => setBudgetFilter(f)} className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${budgetFilter === f ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Card stack */}
        <div className="relative w-full max-w-sm h-[480px] mx-auto mb-8">
          {cards.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="Vous êtes à jour !"
              subtitle="Aucune nouvelle opportunité pour le moment. Nous vous notifierons dès qu'un bien correspondra à vos critères."
              ctaLabel="Revoir les annonces"
              ctaHref="#"
            />
          ) : (
            <AnimatePresence>
              {cards.slice(-2).map((card, i) => (
                <SwipeCard
                  key={card.id}
                  card={card}
                  isTop={i === Math.min(cards.length, 2) - 1}
                  onSwipe={handleSwipe}
                  onScoreClick={() => { setScoreCard(card); setScoreModal(true); }}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {cards.length > 0 && (
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 transition-transform duration-200 hover:scale-[1.02]" onClick={() => handleSwipe("left")}>
              <X size={22} className="text-destructive" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-border transition-transform duration-200 hover:scale-[1.02]" onClick={handleUndo} disabled={history.length === 0}>
              <RotateCcw size={16} />
            </Button>
            <Button size="icon" className="h-12 w-12 rounded-full glow-gold bg-primary hover:bg-primary/90 transition-transform duration-200 hover:scale-[1.02]" onClick={() => handleSwipe("right")}>
              <Heart size={22} className="text-primary-foreground" />
            </Button>
          </div>
        )}
      </div>

      <MatchCelebrationModal open={matchModal} onOpenChange={setMatchModal} matchName={lastMatch?.title ?? ""} matchOwner={lastMatch?.owner ?? ""} compatibility={lastMatch?.compatibility ?? 0} />
      <CompatibilityDetailModal open={scoreModal} onOpenChange={setScoreModal} score={scoreCard?.compatibility ?? 0} title={scoreCard?.title ?? ""} />
    </AppLayout>
  );
}
