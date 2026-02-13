import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderLock, FileText, Download, Lock, CheckCircle } from "lucide-react";

const mockDocuments = [
  { name: "Plan_niveau_1.pdf", size: "2.4 MB", status: "accessible" },
  { name: "Photos_HD.zip", size: "15 MB", status: "accessible" },
  { name: "Diagnostic_amiante.pdf", size: "1.1 MB", status: "pending" },
  { name: "Bail_commercial.pdf", size: "890 KB", status: "locked" },
  { name: "Rapport_expertise.pdf", size: "3.2 MB", status: "accessible" },
];

export default function DataRoom() {
  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <FolderLock className="text-primary" size={28} />
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold">Data Room</h1>
            <p className="text-sm text-muted-foreground">Bureau 350m² Paris 8e</p>
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {mockDocuments.map((doc) => (
              <div key={doc.name} className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="text-muted-foreground" size={18} />
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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

        <div className="mt-6 flex gap-3">
          <Button variant="outline">Demander l'accès</Button>
          <Button className="glow-gold">Autoriser un accès</Button>
        </div>
      </div>
    </AppLayout>
  );
}
