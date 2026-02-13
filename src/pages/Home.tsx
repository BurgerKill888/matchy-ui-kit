import { Building2, ArrowRight, Shield, Zap, Users, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "@/components/modals/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: Target, title: "Matching intelligent", desc: "Algorithme de mise en relation ciblée entre vendeurs et acquéreurs professionnels." },
  { icon: Shield, title: "Réseau vérifié", desc: "Kbis, code NACE et documents de conformité validés pour chaque membre." },
  { icon: Zap, title: "Data Room sécurisée", desc: "Partagez vos documents sensibles dans un espace confidentiel contrôlé." },
  { icon: Users, title: "8 typologies", desc: "Agents, marchands de biens, promoteurs, foncières, notaires et plus." },
];

const packs = [
  { name: "Pack 1", price: "150", opportunities: "10", features: ["Accès réseau privé", "Matching intelligent", "Notifications qualifiées"] },
  { name: "Pack 2", price: "250", opportunities: "20", popular: true, features: ["Tout Pack 1", "20 opportunités actives", "Mise en relation directe"] },
  { name: "Pack 3", price: "600", opportunities: "50", features: ["Tout Pack 2", "Accès catalogue", "Veille stratégique"] },
];

export default function HomePage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const openAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Building2 className="text-primary" size={28} />
            <span className="font-display text-xl font-bold">Match<span className="text-primary">stone</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => openAuth("login")} className="text-muted-foreground hover:text-foreground">
              Connexion
            </Button>
            <Button size="sm" onClick={() => openAuth("register")} className="glow-gold">
              Inscription
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="relative container flex flex-col items-center text-center py-32 md:py-44">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-primary/10 text-primary border border-primary/20 mb-6">
              Réseau professionnel immobilier
            </span>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Swipez, matchez,<br />
              <span className="text-gradient-gold">signez.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Matchstone connecte vendeurs et acquéreurs qualifiés dans un réseau privé et sécurisé. 
              Accédez aux meilleures opportunités du marché.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => openAuth("register")} className="glow-gold text-base px-8">
                Rejoindre le réseau <ArrowRight className="ml-2" size={18} />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 border-border hover:bg-secondary">
                Découvrir
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Pourquoi Matchstone ?</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Une plateforme conçue par et pour les professionnels de l'immobilier.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="text-primary" size={20} />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Tarifs 2026</h2>
          <p className="text-muted-foreground text-lg">Choisissez le pack adapté à votre activité.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packs.map((pack, i) => (
            <motion.div
              key={pack.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative glass-card rounded-xl p-6 ${pack.popular ? 'border-primary/40 glow-gold' : ''}`}
            >
              {pack.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                  Populaire
                </span>
              )}
              <h3 className="font-display text-xl font-bold mb-1">{pack.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{pack.opportunities} opportunités actives</p>
              <div className="mb-6">
                <span className="text-3xl font-bold text-foreground">{pack.price}€</span>
                <span className="text-muted-foreground text-sm"> HT / mois</span>
              </div>
              <ul className="space-y-2 mb-6">
                {pack.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ChevronRight size={14} className="text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${pack.popular ? '' : 'variant-outline'}`} variant={pack.popular ? "default" : "outline"}>
                Choisir
              </Button>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8">
          Pack institutionnel / grands comptes : <span className="text-primary font-medium">sur devis</span>
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="text-primary" size={20} />
            <span className="font-display font-bold">Matchstone</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/legal" className="hover:text-foreground transition-colors">CGUs</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Confidentialité</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Matchstone. Tous droits réservés.</p>
        </div>
      </footer>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} mode={authMode} onModeChange={setAuthMode} />
    </div>
  );
}
