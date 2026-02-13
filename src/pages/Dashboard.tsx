import AppLayout from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Sparkles, FileText, Eye, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { NewMatchModal } from "@/components/modals/SystemModals";

const mockMatches = [
  { id: 1, label: "Bureau 350m² Paris 8e", timer: "2j 14h", type: "vendeur" },
  { id: 2, label: "Immeuble mixte Lyon 6e", timer: "5j 02h", type: "vendeur" },
  { id: 3, label: "Terrain 2ha Bordeaux", timer: "1j 08h", type: "acquéreur" },
];

const mockAnnonces = [
  { id: 1, title: "Bureau 350m² Paris 8e", status: "active", views: 24, matches: 3 },
  { id: 2, title: "Local commercial Marseille", status: "active", views: 12, matches: 1 },
  { id: 3, title: "Immeuble de rapport Lille", status: "draft", views: 0, matches: 0 },
];

export default function Dashboard() {
  const [matchModalOpen, setMatchModalOpen] = useState(false);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Bienvenue sur votre espace Matchstone</p>
          </div>
          <Link to="/listings/create">
            <Button className="glow-gold">
              <Plus size={16} className="mr-2" /> Créer une annonce
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="vendeur" className="space-y-6">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="vendeur">Vendeur</TabsTrigger>
            <TabsTrigger value="acquereur">Acquéreur</TabsTrigger>
          </TabsList>

          <TabsContent value="vendeur" className="space-y-6">
            {/* Matches */}
            <div>
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" /> Mes matches
              </h2>
              <div className="grid gap-3">
                {mockMatches.filter(m => m.type === "vendeur").map((match, i) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sparkles className="text-primary" size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{match.label}</p>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                          <Clock size={12} /> Timer : {match.timer}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setMatchModalOpen(true)}>
                      Voir <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Annonces */}
            <div>
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText size={18} className="text-primary" /> Mes annonces
              </h2>
              <div className="grid gap-3">
                {mockAnnonces.map((annonce, i) => (
                  <motion.div
                    key={annonce.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-sm">{annonce.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant={annonce.status === "active" ? "default" : "secondary"} className="text-xs">
                            {annonce.status === "active" ? "Active" : "Brouillon"}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Eye size={12} /> {annonce.views}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Sparkles size={12} /> {annonce.matches} match(es)
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link to={`/listings/${annonce.id}`}>
                      <Button size="sm" variant="ghost">Détail</Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="acquereur" className="space-y-6">
            <div>
              <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-primary" /> Mes matches
              </h2>
              <div className="grid gap-3">
                {mockMatches.filter(m => m.type === "acquéreur").map((match, i) => (
                  <motion.div
                    key={match.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sparkles className="text-primary" size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{match.label}</p>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                          <Clock size={12} /> Timer : {match.timer}
                        </div>
                      </div>
                    </div>
                    <Link to="/messaging">
                      <Button size="sm" variant="outline">
                        Converser <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="text-center py-8">
              <Link to="/criteria/create">
                <Button className="glow-gold">
                  <Plus size={16} className="mr-2" /> Créer une fiche de critères
                </Button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <NewMatchModal open={matchModalOpen} onOpenChange={setMatchModalOpen} />
    </AppLayout>
  );
}
