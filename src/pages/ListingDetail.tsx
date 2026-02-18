import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Ruler, Euro, Building2, Eye, Sparkles, FolderLock, MessageSquare, Star, CheckCircle, ExternalLink, Zap, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useUserSpace } from "@/contexts/UserSpaceContext";
import { getTypeColor } from "@/lib/propertyTypes";

function PhotoCarousel({ photos, type }: { photos: number; type: string }) {
  const [current, setCurrent] = useState(0);
  return (
    <div className="relative h-52 md:h-72 bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden group">
      <Building2 className="text-muted-foreground/10" size={80} />
      {/* Badge photos */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 rounded-full px-2.5 py-1">
        <Images size={12} className="text-white" />
        <span className="text-xs text-white font-medium">{photos}</span>
      </div>
      {/* Arrows */}
      <button
        onClick={() => setCurrent((p) => (p - 1 + photos) % photos)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronLeft size={18} className="text-white" />
      </button>
      <button
        onClick={() => setCurrent((p) => (p + 1) % photos)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <ChevronRight size={18} className="text-white" />
      </button>
      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: Math.min(photos, 5) }).map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/40"}`}
          />
        ))}
      </div>
      {/* Type badge */}
      <div className="absolute top-4 left-4">
        <Badge className="text-xs">{type}</Badge>
      </div>
    </div>
  );
}

const dpeColors: Record<string, string> = {
  A: "#00A550", B: "#51B848", C: "#BAD429", D: "#FFF100",
  E: "#F5A623", F: "#F26423", G: "#E31837",
};

const mockListing = {
  id: 1,
  title: "Bureau 350m² Paris 8e",
  type: "Bureaux",
  status: "active",
  views: 24,
  matches: 3,
  location: "Paris 8e",
  surface: "350m²",
  price: "2 800 000 €",
  dpe: "B",
  ges: "E",
  photos: 4,
  description: `Magnifique plateau de bureaux situé au cœur du 8ème arrondissement de Paris. 
Idéalement placé à proximité des Champs-Élysées, ce bien offre une surface de 350m² 
répartis sur un seul niveau avec vue dégagée.`,
  features: [
    "Surface : 350m² en un seul plateau",
    "Étage : 5ème avec ascenseur",
    "Urbanisme : ZAC tertiaire",
    "État : Rénové en 2024",
    "Parking : 8 places en sous-sol",
    "DPE : Classe B — performance énergétique optimisée",
  ],
  owner: {
    name: "Jean-Pierre Moreau",
    company: "SCI Patrimoine",
    since: "8 ans sur Matchstone",
    responseRate: "98%",
    responseTime: "Répond en moins de 2h",
    deals: 14,
    rating: 4.8,
  },
  reviews: [
    { id: 1, author: "Foncière Grand Ouest", rating: 5, date: "Janvier 2026", comment: "Transaction fluide, vendeur très professionnel et transparent sur les documents. Data Room complète et bien organisée." },
    { id: 2, author: "SCI Rhône Investissement", rating: 5, date: "Octobre 2025", comment: "Excellente expérience. Toutes les informations étaient exactes, les délais respectés. Je recommande." },
    { id: 3, author: "Cabinet Duval & Associés", rating: 4, date: "Juillet 2025", comment: "Bien conforme à la description. Quelques délais administratifs mais vendeur très disponible." },
  ],
};

function HorizontalBar({ classes, colors, active, label }: { classes: string[]; colors: string[]; active: string | null; label: string }) {
  if (!active) return null;
  const activeIdx = classes.indexOf(active);
  return (
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
      <div className="flex items-end gap-0.5">
        {classes.map((cls, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div key={cls} className="relative flex-1 flex flex-col items-center gap-1">
              {isActive ? (
                <div
                  className="text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded text-white shadow-md"
                  style={{ backgroundColor: colors[idx] }}
                >
                  {cls}
                </div>
              ) : (
                <div className="h-6" />
              )}
              <div
                className={`w-full rounded-sm transition-all ${isActive ? "opacity-100" : "opacity-25"}`}
                style={{ backgroundColor: colors[idx], height: isActive ? "14px" : "10px" }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EnergyDiagnostic({ dpe, ges }: { dpe: string | null; ges: string | null }) {
  if (!dpe && !ges) return null;
  const dpeClasses = ["A", "B", "C", "D", "E", "F", "G"];
  const dpeColors = ["#00A550", "#51B848", "#BAD429", "#FFF100", "#F5A623", "#F26423", "#E31837"];
  const gesClasses = ["A", "B", "C", "D", "E", "F", "G"];
  const gesColors = ["#E8D5F0", "#D4B8E8", "#BE9ADE", "#A87CD4", "#8B5EC8", "#6E40BC", "#4B2499"];
  return (
    <div className="glass-card rounded-xl p-5 mb-6">
      <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
        <Zap size={16} className="text-primary" /> Performance énergétique
      </h3>
      <div className="flex gap-6 flex-wrap">
        <HorizontalBar
          classes={dpeClasses}
          colors={dpeColors}
          active={dpe}
          label="Diagnostic de performance énergétique (DPE)"
        />
        <HorizontalBar
          classes={gesClasses}
          colors={gesColors}
          active={ges}
          label="Indice d'émission de gaz à effet de serre (GES)"
        />
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          className={i <= Math.round(rating) ? "text-primary fill-primary" : "text-muted-foreground/30"}
        />
      ))}
    </div>
  );
}

export default function ListingDetail() {
  const { id } = useParams();
  const { isAcquereur } = useUserSpace();
  const listing = mockListing; // In real app, fetch by id

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl space-y-6">
        <Link to="/listings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Retour aux annonces
        </Link>

        {/* Main card */}
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Type color band */}
          <div className="h-1" style={{ backgroundColor: getTypeColor(listing.type) }} />

          {/* Photo carousel */}
          <PhotoCarousel photos={listing.photos} type={listing.type} />

          <div className="p-6 md:p-8">
            {/* Status bar */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <Badge variant={listing.status === "active" ? "default" : "secondary"}>Active</Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye size={12} /> {listing.views} vues</span>
              <span className="text-xs text-primary flex items-center gap-1"><Sparkles size={12} /> {listing.matches} matches</span>
              {listing.dpe && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded"
                  style={{ backgroundColor: dpeColors[listing.dpe], color: listing.dpe === "D" ? "#000" : "#fff" }}
                >
                  <Zap size={10} /> DPE {listing.dpe}
                </span>
              )}
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">{listing.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><MapPin size={14} /> {listing.location}</span>
              <span className="flex items-center gap-1"><Ruler size={14} /> {listing.surface}</span>
              <span className="flex items-center gap-1"><Euro size={14} /> {listing.price}</span>
            </div>

            <div className="text-sm text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">
              {listing.description}
            </div>

            <h3 className="font-display font-semibold mb-3">Caractéristiques</h3>
            <ul className="space-y-1.5 mb-8">
              {listing.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle size={14} className="text-primary shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            {/* DPE + GES */}
            <EnergyDiagnostic dpe={listing.dpe} ges={listing.ges} />

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/dataroom">
                <Button variant="outline" className="transition-transform duration-200 hover:scale-[1.02]">
                  <FolderLock size={16} className="mr-2" /> Accéder à la Data Room
                </Button>
              </Link>
              {isAcquereur && (
                <Link to="/messaging">
                  <Button className="glow-gold transition-transform duration-200 hover:scale-[1.02]">
                    <MessageSquare size={16} className="mr-2" /> Contacter le vendeur
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border">
            <h2 className="font-display text-lg font-semibold flex items-center gap-2">
              <MapPin size={18} className="text-primary" /> Localisation
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">{listing.location}</p>
          </div>
          {/* Static map placeholder */}
          <div className="relative h-56 bg-[#1A2335] overflow-hidden">
            {/* Grid lines simulating a map */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(222 20% 40%)" strokeWidth="0.5" />
                </pattern>
                <pattern id="bigGrid" width="120" height="120" patternUnits="userSpaceOnUse">
                  <rect width="120" height="120" fill="url(#grid)" />
                  <path d="M 120 0 L 0 0 0 120" fill="none" stroke="hsl(222 20% 35%)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#bigGrid)" />
              {/* Simulated roads */}
              <rect x="0" y="90" width="100%" height="8" fill="hsl(222 20% 25%)" opacity="0.8" />
              <rect x="180" y="0" width="8" height="100%" fill="hsl(222 20% 25%)" opacity="0.8" />
              <rect x="320" y="0" width="12" height="100%" fill="hsl(222 20% 22%)" opacity="0.9" />
              <rect x="0" y="170" width="100%" height="6" fill="hsl(222 20% 25%)" opacity="0.7" />
              {/* Simulated blocks */}
              <rect x="20" y="20" width="70" height="60" rx="3" fill="hsl(222 25% 18%)" />
              <rect x="100" y="20" width="70" height="60" rx="3" fill="hsl(222 25% 18%)" />
              <rect x="340" y="20" width="80" height="60" rx="3" fill="hsl(222 25% 18%)" />
              <rect x="20" y="108" width="150" height="50" rx="3" fill="hsl(222 25% 18%)" />
              <rect x="340" y="108" width="80" height="50" rx="3" fill="hsl(222 25% 18%)" />
              <rect x="20" y="186" width="60" height="50" rx="3" fill="hsl(222 25% 18%)" />
              <rect x="95" y="186" width="75" height="50" rx="3" fill="hsl(222 25% 18%)" />
            </svg>
            {/* Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary glow-gold flex items-center justify-center shadow-lg">
                <MapPin size={18} className="text-primary-foreground" />
              </div>
              <div className="w-3 h-3 rounded-full bg-primary/40 mt-1 blur-sm" />
            </div>
            {/* Label */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-foreground font-medium border border-border">
              {listing.location}
            </div>
            {/* External map link */}
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(listing.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border flex items-center gap-1 transition-colors"
            >
              <ExternalLink size={11} /> Ouvrir dans Maps
            </a>
          </div>
        </div>

        {/* Vendor Review Section */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="font-display text-lg font-semibold mb-6 flex items-center gap-2">
            <Star size={18} className="text-primary" /> Faites connaissance avec le vendeur
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            {/* Owner card */}
            <div className="glass-card rounded-xl p-5 flex flex-col items-center text-center sm:w-52 shrink-0 border border-primary/10">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-3 border-2 border-primary/30">
                <span className="font-display text-xl font-bold text-primary">
                  {listing.owner.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <p className="font-semibold text-sm">{listing.owner.name}</p>
              <p className="text-xs text-muted-foreground">{listing.owner.company}</p>
              <div className="border-t border-border w-full my-3" />
              <div className="space-y-2 w-full">
                <div>
                  <p className="font-bold text-lg">{listing.owner.deals}</p>
                  <p className="text-xs text-muted-foreground">transactions</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <p className="font-bold text-lg">{listing.owner.rating}</p>
                    <Star size={14} className="text-primary fill-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground">note globale</p>
                </div>
                <div>
                  <p className="font-bold text-sm">{listing.owner.since}</p>
                  <p className="text-xs text-muted-foreground">membre depuis</p>
                </div>
              </div>
            </div>

            {/* Owner info */}
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="font-semibold text-sm mb-2">Informations sur le vendeur</h3>
                <div className="space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success shrink-0" />
                    Taux de réponse : {listing.owner.responseRate}
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success shrink-0" />
                    {listing.owner.responseTime}
                  </p>
                  <p className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success shrink-0" />
                    Compte vérifié Matchstone
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={14} className="text-muted-foreground shrink-0" />
                    Basé à Paris, France
                  </p>
                </div>
              </div>
              <Link to="/messaging">
                <Button className="glow-gold transition-transform duration-200 hover:scale-[1.02]">
                  <MessageSquare size={16} className="mr-2" /> Envoyer un message
                </Button>
              </Link>
            </div>
          </div>

          {/* Reviews */}
          <div className="border-t border-border pt-5">
            <div className="flex items-center gap-3 mb-4">
              <p className="font-semibold">Avis ({listing.reviews.length})</p>
              <div className="flex items-center gap-1.5">
                <StarRating rating={listing.owner.rating} />
                <span className="text-sm font-bold">{listing.owner.rating}/5</span>
              </div>
            </div>
            <div className="space-y-4">
              {listing.reviews.map((review) => (
                <div key={review.id} className="bg-secondary/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{review.author[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{review.author}</p>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
