import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderLock, FileText, Download, Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { useParams, Link } from "react-router-dom";

const mockDataRooms: Record<string, { property: string; owner: string; documents: { name: string; size: string; status: string }[] }> = {
  "1": {
    property: "Bureau 350m² Paris 8e",
    owner: "SCI Patrimoine",
    documents: [
      { name: "Plan_niveau_1.pdf", size: "2.4 MB", status: "accessible" },
      { name: "Photos_HD.zip", size: "15 MB", status: "accessible" },
      { name: "Rapport_expertise.pdf", size: "3.2 MB", status: "accessible" },
      { name: "Diagnostic_amiante.pdf", size: "1.1 MB", status: "pending" },
      { name: "Bail_commercial.pdf", size: "890 KB", status: "locked" },
    ],
  },
  "2": {
    property: "Immeuble mixte Lyon 6e",
    owner: "Foncière Grand Ouest",
    documents: [
      { name: "Plans_cadastraux.pdf", size: "4.1 MB", status: "accessible" },
      { name: "Diagnostic_DPE.pdf", size: "980 KB", status: "accessible" },
      { name: "Etat_locatif.xlsx", size: "230 KB", status: "pending" },
    ],
  },
};

const fallbackDocuments = [
  { name: "Plan_niveau_1.pdf", size: "2.4 MB", status: "accessible" },
  { name: "Photos_HD.zip", size: "15 MB", status: "accessible" },
  { name: "Diagnostic_amiante.pdf", size: "1.1 MB", status: "pending" },
  { name: "Bail_commercial.pdf", size: "890 KB", status: "locked" },
  { name: "Rapport_expertise.pdf", size: "3.2 MB", status: "accessible" },
];

export default function DataRoom() {
  const { id } = useParams<{ id: string }>();
  const room = id ? mockDataRooms[id] : null;
  const documents = room?.documents ?? fallbackDocuments;
  const propertyName = room?.property ?? "Bureau 350m² Paris 8e";
  const ownerName = room?.owner ?? "";

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl">
        <Link to="/acquereur-dataroom" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={15} /> Mes Data Rooms
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <FolderLock className="text-primary" size={28} />
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Data Room</h1>
            <p className="text-sm text-muted-foreground">{propertyName}{ownerName && ` · ${ownerName}`}</p>
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {documents.map((doc) => (
              <div key={doc.name} className="flex items-center justify-between p-3 sm:p-4 hover:bg-secondary/30 transition-colors gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <FileText className="text-muted-foreground shrink-0" size={18} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  {doc.status === "accessible" && (
                    <>
                      <Badge variant="default" className="text-xs gap-1"><CheckCircle size={10} /> Accessible</Badge>
                      <Button size="sm" variant="ghost"><Download size={14} /></Button>
                    </>
                  )}
                  {doc.status === "pending" && (
                    <Badge variant="secondary" className="text-xs">En attente</Badge>
                  )}
                  {doc.status === "locked" && (
                    <Badge variant="outline" className="text-xs gap-1 text-muted-foreground"><Lock size={10} /> Verrouillé</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
