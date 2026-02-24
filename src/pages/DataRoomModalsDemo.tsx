import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { DataRoomModals, DataRoomModalType } from "@/components/modals/DataRoomModals";

export default function DataRoomModalsDemo() {
  const [modal, setModal] = useState<DataRoomModalType>(null);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-3xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Modales Data Room</h1>
        <p className="text-sm text-muted-foreground mb-8">Cliquez sur chaque bouton pour prévisualiser la modale correspondante.</p>

        {/* Acquéreur */}
        <div className="glass-card rounded-xl p-6 mb-5">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Côté Acquéreur</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setModal("acq_request")}>1. Demander l'accès</Button>
            <Button variant="outline" size="sm" onClick={() => setModal("acq_sent")}>2. Confirmation envoi</Button>
            <Button variant="outline" size="sm" onClick={() => setModal("acq_granted")}>3. Accès accordé</Button>
            <Button variant="outline" size="sm" onClick={() => setModal("acq_refused")}>4. Accès refusé</Button>
          </div>
        </div>

        {/* Vendeur */}
        <div className="glass-card rounded-xl p-6">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Côté Vendeur</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setModal("sell_received")}>5. Demande reçue</Button>
            <Button variant="outline" size="sm" onClick={() => setModal("sell_grant")}>6. Confirmer autorisation</Button>
            <Button variant="outline" size="sm" onClick={() => setModal("sell_refuse")}>7. Refuser + motif</Button>
            <Button variant="outline" size="sm" onClick={() => setModal("sell_refuse_confirm")}>8. Confirmation refus</Button>
          </div>
        </div>
      </div>

      <DataRoomModals modal={modal} onChangeModal={setModal} />
    </AppLayout>
  );
}
