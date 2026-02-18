import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Send, User, Euro, Ruler, ExternalLink, FolderOpen, MessageSquare, Lock } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/EmptyState";
import { useUserSpace } from "@/contexts/UserSpaceContext";
import { Link } from "react-router-dom";

const mockConversations = [
  { id: 1, name: "SCI Patrimoine", lastMessage: "Quand pouvons-nous visiter ?", timer: "2j 14h", unread: true, property: "Bureau 350m² Paris 8e", surface: "350m²", price: "2 800 000 €", compatibility: 92, dataRoomAccess: false },
  { id: 2, name: "Foncière Grand Ouest", lastMessage: "Documents reçus, merci.", timer: "5j 02h", unread: false, property: "Immeuble mixte Lyon 6e", surface: "1 200m²", price: "3 500 000 €", compatibility: 85, dataRoomAccess: true },
  { id: 3, name: "Cabinet Martin & Associés", lastMessage: "Offre envoyée.", timer: "1j 08h", unread: true, property: "Local commercial Marseille", surface: "180m²", price: "620 000 €", compatibility: 88, dataRoomAccess: false },
];

const mockMessages = [
  { id: 1, from: "them", text: "Bonjour, nous sommes intéressés par votre bureau Paris 8e. Quelles sont les conditions ?", time: "14:30" },
  { id: 2, from: "me", text: "Bonjour, merci pour votre intérêt. Le bien est disponible immédiatement. Souhaitez-vous planifier une visite ?", time: "14:45" },
  { id: 3, from: "them", text: "Oui, quand pouvons-nous visiter ?", time: "15:02" },
];

export default function Messaging() {
  const [selectedConv, setSelectedConv] = useState(1);
  const [message, setMessage] = useState("");
  const { isVendeur } = useUserSpace();
  const conv = mockConversations.find((c) => c.id === selectedConv);
  const hasConversations = mockConversations.length > 0;

  if (!hasConversations) {
    return (
      <AppLayout>
        <EmptyState
          icon={MessageSquare}
          title="Aucune conversation"
          subtitle="Vos échanges avec les professionnels apparaîtront ici après un match."
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Conversation list */}
        <div className="w-80 border-r border-border overflow-y-auto hidden md:block">
          <div className="p-4">
            <h2 className="font-display text-lg font-semibold mb-4">Conversations</h2>
            <div className="space-y-1">
              {mockConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedConv(c.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    selectedConv === c.id ? "bg-primary/10 border border-primary/20" : "hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{c.name}</span>
                    {c.unread && <span className="w-2 h-2 rounded-full bg-primary animate-pulse-gold" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{c.lastMessage}</p>
                  <div className="flex items-center gap-1 text-xs text-primary/60 mt-1">
                    <Clock size={10} /> {c.timer}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={14} className="text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{conv?.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} /> Timer : {conv?.timer}</p>
              </div>
            </div>
          </div>

          {/* Property context banner */}
          {conv && (
            <div className="border-b border-border bg-secondary/30 px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground min-w-0">
                <span className="font-semibold text-foreground text-sm truncate">{conv.property}</span>
                <span className="flex items-center gap-1 shrink-0"><Ruler size={11} /> {conv.surface}</span>
                <span className="flex items-center gap-1 shrink-0"><Euro size={11} /> {conv.price}</span>
                <span className="text-primary font-bold shrink-0">{conv.compatibility}%</span>
              </div>
              <div className="flex gap-2 shrink-0">
                {/* Acquéreur: Data Room button */}
                {!isVendeur && (
                  conv.dataRoomAccess ? (
                    <Link to="/dataroom">
                      <Button variant="outline" size="sm" className="text-xs h-7 transition-transform duration-200 hover:scale-[1.02]">
                        <FolderOpen size={12} className="mr-1" /> Data Room
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" size="sm" className="text-xs h-7 transition-transform duration-200 hover:scale-[1.02]">
                      <Lock size={12} className="mr-1" /> Demander accès Data Room
                    </Button>
                  )
                )}
                <Button variant="outline" size="sm" className="text-xs h-7 transition-transform duration-200 hover:scale-[1.02]">
                  <ExternalLink size={12} className="mr-1" /> Voir l'annonce
                </Button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-xl px-4 py-2.5 ${
                  msg.from === "me" ? "bg-primary text-primary-foreground" : "glass-card"
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.from === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Votre message..." className="bg-secondary border-border" />
              <Button size="icon" className="shrink-0 transition-transform duration-200 hover:scale-[1.02]">
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
