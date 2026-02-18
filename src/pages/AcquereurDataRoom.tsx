import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, Download, MapPin, Euro, Ruler, Zap, ArrowRight, Building2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { getTypeColor } from "@/lib/propertyTypes";

const dpeColors: Record<string, string> = {
  A: "#00A550", B: "#51B848", C: "#BAD429", D: "#FFF100",
  E: "#F5A623", F: "#F26423", G: "#E31837",
};

const mockGrantedDataRooms = [
  {
    id: 1,
    property: "Bureau 350m² Paris 8e",
    type: "Bureaux",
    owner: "SCI Patrimoine",
    surface: "350m²",
    price: "2 800 000 €",
    location: "Paris 8e",
    dpe: "B",
    compatibility: 92,
    grantedAt: "Il y a 2 jours",
    docCount: 5,
    documents: [
      { name: "Plan_niveau_1.pdf", size: "2.4 MB" },
      { name: "Photos_HD.zip", size: "15 MB" },
      { name: "Rapport_expertise.pdf", size: "3.2 MB" },
      { name: "Diagnostic_amiante.pdf", size: "1.1 MB" },
      { name: "Bail_commercial.pdf", size: "890 KB" },
    ],
  },
  {
    id: 2,
    property: "Immeuble mixte Lyon 6e",
    type: "Immeuble",
    owner: "Foncière Grand Ouest",
    surface: "1 200m²",
    price: "3 500 000 €",
    location: "Lyon 6e",
    dpe: "C",
    compatibility: 85,
    grantedAt: "Il y a 5 jours",
    docCount: 3,
    documents: [
      { name: "Plans_cadastraux.pdf", size: "4.1 MB" },
      { name: "Diagnostic_DPE.pdf", size: "980 KB" },
      { name: "Etat_locatif.xlsx", size: "230 KB" },
    ],
  },
];

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

export default function AcquereurDataRoom() {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (mockGrantedDataRooms.length === 0) {
    return (
      <AppLayout>
        <div className="p-6 md:p-8 max-w-4xl">
          <div className="flex items-center gap-3 mb-8">
            <FolderOpen className="text-primary" size={28} />
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">Mes Data Rooms</h1>
              <p className="text-sm text-muted-foreground">Les vendeurs qui vous ont autorisé l'accès à leurs documents</p>
            </div>
          </div>
          <EmptyState
            icon={FolderOpen}
            title="Aucun accès Data Room"
            subtitle="Lorsqu'un vendeur vous accordera l'accès à sa Data Room, vous pourrez consulter ses documents ici."
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <FolderOpen className="text-primary" size={28} />
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Mes Data Rooms</h1>
            <p className="text-sm text-muted-foreground">Les vendeurs qui vous ont autorisé l'accès à leurs documents</p>
          </div>
        </div>

        <div className="space-y-4">
          {mockGrantedDataRooms.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-xl overflow-hidden hover:border-primary/30 hover:shadow-card transition-all duration-200"
            >
              {/* Type color band */}
              <div className="h-1" style={{ backgroundColor: getTypeColor(room.type) }} />

              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Building2 className="text-primary" size={22} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{room.property}</h3>
                      <p className="text-sm text-muted-foreground">{room.owner}</p>
                      <div className="flex flex-wrap gap-2 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {room.location}</span>
                        <span className="flex items-center gap-1"><Ruler size={11} /> {room.surface}</span>
                        <span className="flex items-center gap-1"><Euro size={11} /> {room.price}</span>
                        <span className="flex items-center gap-1">
                          <Zap size={11} /> DPE <DpeBadge label={room.dpe} />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge variant="default" className="text-xs gap-1 bg-primary/20 text-primary border-primary/30">
                      <CheckCircle size={10} /> Accès accordé
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">{room.grantedAt}</span>
                    <span className="text-xs font-bold text-primary">{room.compatibility}% compatible</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setExpanded(expanded === room.id ? null : room.id)}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <FolderOpen size={13} />
                    {room.docCount} document{room.docCount > 1 ? "s" : ""} disponible{room.docCount > 1 ? "s" : ""}
                    <ArrowRight size={12} className={`transition-transform duration-200 ${expanded === room.id ? "rotate-90" : ""}`} />
                  </button>
                  <Link to={`/listings/${room.id}`}>
                    <Button size="sm" variant="outline" className="text-xs h-7 transition-transform duration-200 hover:scale-[1.02]">
                      Voir l'annonce
                    </Button>
                  </Link>
                </div>

                {/* Expanded documents */}
                {expanded === room.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 border-t border-border pt-4 space-y-2"
                  >
                    {room.documents.map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText size={16} className="text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-muted-foreground">{doc.size}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                          <Download size={13} />
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
