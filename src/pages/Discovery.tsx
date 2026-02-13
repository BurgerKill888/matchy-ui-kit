import AppLayout from "@/components/AppLayout";
import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from "framer-motion";
import { MapPin, Ruler, Euro, Building2, X, Heart, RotateCcw, Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MatchCelebrationModal from "@/components/modals/MatchCelebrationModal";

const mockCards = [
  {
    id: 1,
    title: "Bureau 350m² Paris 8e",
    type: "Bureau",
    surface: "350m²",
    price: "2 800 000 €",
    location: "Paris 8e",
    description: "Magnifique plateau de bureaux au cœur du 8ème, rénové en 2024. Vue dégagée, 8 places de parking.",
    owner: "SCI Patrimoine",
    compatibility: 92,
  },
  {
    id: 2,
    title: "Immeuble mixte Lyon 6e",
    type: "Immeuble",
    surface: "1 200m²",
    price: "3 500 000 €",
    location: "Lyon 6e",
    description: "Immeuble mixte commerce/habitation, bon rendement locatif. Proche transports en commun.",
    owner: "Foncière Grand Ouest",
    compatibility: 85,
  },
  {
    id: 3,
    title: "Terrain 2ha Bordeaux",
    type: "Terrain",
    surface: "20 000m²",
    price: "1 800 000 €",
    location: "Bordeaux Métropole",
    description: "Terrain constructible en zone d'aménagement concerté. Idéal pour programme résidentiel ou mixte.",
    owner: "Groupe Nexity Régions",
    compatibility: 78,
  },
  {
    id: 4,
    title: "Local commercial Marseille",
    type: "Commerce",
    surface: "180m²",
    price: "620 000 €",
    location: "Marseille Vieux-Port",
    description: "Emplacement premium pied d'immeuble. Double vitrine, forte visibilité. Libre de suite.",
    owner: "Cabinet Martin & Associés",
    compatibility: 88,
  },
  {
    id: 5,
    title: "Entrepôt logistique Roissy",
    type: "Logistique",
    surface: "5 000m²",
    price: "4 200 000 €",
    location: "Roissy CDG",
    description: "Entrepôt classe A aux normes ICPE. Quais de chargement, sprinklers. Proximité autoroute A1.",
    owner: "Prologis France",
    compatibility: 71,
  },
];

function SwipeCard({
  card,
  isTop,
  onSwipe,
}: {
  card: (typeof mockCards)[0];
  isTop: boolean;
  onSwipe: (direction: "left" | "right") => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const opacityLeft = useTransform(x, [-150, 0], [1, 0]);
  const opacityRight = useTransform(x, [0, 150], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 120) {
      onSwipe("right");
    } else if (info.offset.x < -120) {
      onSwipe("left");
    }
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
      exit={{
        x: 500,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      <div className="h-full glass-card rounded-2xl overflow-hidden shadow-elevated flex flex-col">
        {/* Card header with type visual */}
        <div className="relative h-44 bg-gradient-to-br from-secondary via-muted to-secondary flex items-center justify-center">
          <Building2 className="text-muted-foreground/15" size={80} />
          <div className="absolute top-4 left-4">
            <Badge className="text-xs font-semibold">{card.type}</Badge>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-background/60 backdrop-blur-md rounded-full px-3 py-1">
            <span className="text-xs font-bold text-primary">{card.compatibility}%</span>
            <span className="text-xs text-muted-foreground">compatible</span>
          </div>

          {/* Swipe indicators */}
          {isTop && (
            <>
              <motion.div
                className="absolute top-4 left-4 px-4 py-2 rounded-lg border-2 border-destructive bg-destructive/20"
                style={{ opacity: opacityLeft }}
              >
                <span className="font-display font-bold text-destructive text-lg">PASSER</span>
              </motion.div>
              <motion.div
                className="absolute top-4 right-4 px-4 py-2 rounded-lg border-2 border-primary bg-primary/20"
                style={{ opacity: opacityRight }}
              >
                <span className="font-display font-bold text-primary text-lg">MATCH</span>
              </motion.div>
            </>
          )}
        </div>

        {/* Card body */}
        <div className="flex-1 p-5 flex flex-col">
          <h2 className="font-display text-xl font-bold mb-1">{card.title}</h2>
          <p className="text-sm text-primary font-medium mb-3">{card.owner}</p>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1 bg-secondary/50 px-2.5 py-1 rounded-full">
              <MapPin size={12} className="text-primary" /> {card.location}
            </span>
            <span className="flex items-center gap-1 bg-secondary/50 px-2.5 py-1 rounded-full">
              <Ruler size={12} className="text-primary" /> {card.surface}
            </span>
            <span className="flex items-center gap-1 bg-secondary/50 px-2.5 py-1 rounded-full">
              <Euro size={12} className="text-primary" /> {card.price}
            </span>
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

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      const current = cards[cards.length - 1];
      if (!current) return;

      setHistory((prev) => [current, ...prev]);
      setCards((prev) => prev.slice(0, -1));

      if (direction === "right") {
        // Simulate match on ~50% of likes
        if (Math.random() > 0.5) {
          setLastMatch(current);
          setTimeout(() => setMatchModal(true), 400);
        }
      }
    },
    [cards]
  );

  const handleUndo = () => {
    if (history.length === 0) return;
    const [last, ...rest] = history;
    setHistory(rest);
    setCards((prev) => [...prev, last]);
  };

  const resetCards = () => {
    setCards(mockCards);
    setHistory([]);
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-[calc(100vh-4rem)]">
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl md:text-3xl font-bold">Découvrir</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {cards.length > 0
              ? `${cards.length} opportunité${cards.length > 1 ? "s" : ""} à découvrir`
              : "Vous avez tout exploré !"}
          </p>
        </div>

        {/* Card stack */}
        <div className="relative w-full max-w-sm h-[480px] mx-auto mb-8">
          {cards.length === 0 ? (
            <div className="h-full glass-card rounded-2xl flex flex-col items-center justify-center gap-4">
              <Eye className="text-muted-foreground" size={48} />
              <p className="text-muted-foreground font-medium">Plus d'opportunités pour le moment</p>
              <Button variant="outline" onClick={resetCards} className="mt-2">
                <RotateCcw size={14} className="mr-2" /> Revoir les annonces
              </Button>
            </div>
          ) : (
            <AnimatePresence>
              {cards.slice(-2).map((card, i) => (
                <SwipeCard
                  key={card.id}
                  card={card}
                  isTop={i === Math.min(cards.length, 2) - 1}
                  onSwipe={handleSwipe}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Action buttons */}
        {cards.length > 0 && (
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
              onClick={() => handleSwipe("left")}
            >
              <X size={22} className="text-destructive" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full border-border"
              onClick={handleUndo}
              disabled={history.length === 0}
            >
              <RotateCcw size={16} />
            </Button>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full glow-gold bg-primary hover:bg-primary/90"
              onClick={() => handleSwipe("right")}
            >
              <Heart size={22} className="text-primary-foreground" />
            </Button>
          </div>
        )}
      </div>

      <MatchCelebrationModal
        open={matchModal}
        onOpenChange={setMatchModal}
        matchName={lastMatch?.title ?? ""}
        matchOwner={lastMatch?.owner ?? ""}
        compatibility={lastMatch?.compatibility ?? 0}
      />
    </AppLayout>
  );
}
