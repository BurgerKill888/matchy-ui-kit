import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Sparkles, FileText, Eye, ArrowRight, Search, Heart, MessageSquare, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockMatches = [
  { id: 1, label: "Bureau 350m² Paris 8e", owner: "SCI Patrimoine", timer: "2j 14h", compatibility: 92, status: "new" },
  { id: 2, label: "Immeuble mixte Lyon 6e", owner: "Foncière Grand Ouest", timer: "5j 02h", compatibility: 85, status: "in_conversation" },
  { id: 3, label: "Terrain 2ha Bordeaux", owner: "Nexity Régions", timer: "1j 08h", compatibility: 78, status: "new" },
];

const stats = [
  { label: "Matches actifs", value: "3", icon: Sparkles, color: "text-primary" },
  { label: "Vues reçues", value: "54", icon: Eye, color: "text-info" },
  { label: "Conversations", value: "2", icon: MessageSquare, color: "text-success" },
  { label: "Taux de match", value: "28%", icon: TrendingUp, color: "text-primary" },
];

const mockAnnonces = [
  { id: 1, title: "Bureau 350m² Paris 8e", status: "active", views: 24, matches: 3 },
  { id: 2, title: "Local commercial Marseille", status: "active", views: 12, matches: 1 },
  { id: 3, title: "Immeuble de rapport Lille", status: "draft", views: 0, matches: 0 },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Bienvenue sur votre espace Matchstone</p>
          </div>
          <div className="flex gap-2">
            <Link to="/discovery">
              <Button variant="outline">
                <Search size={16} className="mr-2" /> Découvrir
              </Button>
            </Link>
            <Link to="/listings/create">
              <Button className="glow-gold">
                <Plus size={16} className="mr-2" /> Publier
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={16} className={stat.color} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <p className="font-display text-2xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="matches" className="space-y-6">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="matches" className="gap-1.5">
              <Heart size={14} /> Matches
            </TabsTrigger>
            <TabsTrigger value="annonces" className="gap-1.5">
              <FileText size={14} /> Mes annonces
            </TabsTrigger>
          </TabsList>

          {/* Matches Tab */}
          <TabsContent value="matches" className="space-y-3">
            {mockMatches.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-4 flex items-center justify-between group hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Sparkles className="text-primary" size={20} />
                    {match.status === "new" && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary glow-gold" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{match.label}</p>
                    <p className="text-xs text-muted-foreground">{match.owner}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock size={10} /> {match.timer}
                      </span>
                      <span className="text-xs font-semibold text-primary">{match.compatibility}%</span>
                      {match.status === "in_conversation" && (
                        <Badge variant="secondary" className="text-[10px] h-5">En conversation</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Link to={match.status === "in_conversation" ? "/messaging" : `/listings/${match.id}`}>
                  <Button size="sm" variant={match.status === "new" ? "default" : "outline"} className={match.status === "new" ? "glow-gold" : ""}>
                    {match.status === "new" ? "Voir" : "Converser"} <ArrowRight size={14} className="ml-1" />
                  </Button>
                </Link>
              </motion.div>
            ))}

            {mockMatches.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="text-muted-foreground mx-auto mb-3" size={40} />
                <p className="text-muted-foreground">Pas encore de matches</p>
                <Link to="/discovery">
                  <Button className="mt-4 glow-gold">
                    <Search size={16} className="mr-2" /> Découvrir des opportunités
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Annonces Tab */}
          <TabsContent value="annonces" className="space-y-3">
            {mockAnnonces.map((annonce, i) => (
              <motion.div
                key={annonce.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
              >
                <div>
                  <p className="font-semibold text-sm">{annonce.title}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <Badge variant={annonce.status === "active" ? "default" : "secondary"} className="text-xs">
                      {annonce.status === "active" ? "Active" : "Brouillon"}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye size={12} /> {annonce.views}
                    </span>
                    <span className="text-xs text-primary flex items-center gap-1">
                      <Sparkles size={12} /> {annonce.matches}
                    </span>
                  </div>
                </div>
                <Link to={`/listings/${annonce.id}`}>
                  <Button size="sm" variant="ghost">Détail</Button>
                </Link>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
