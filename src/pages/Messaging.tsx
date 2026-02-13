import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Send, User } from "lucide-react";
import { useState } from "react";

const mockConversations = [
  { id: 1, name: "SCI Patrimoine", lastMessage: "Quand pouvons-nous visiter ?", timer: "2j 14h", unread: true },
  { id: 2, name: "Foncière Grand Ouest", lastMessage: "Documents reçus, merci.", timer: "5j 02h", unread: false },
  { id: 3, name: "Cabinet Martin & Associés", lastMessage: "Offre envoyée.", timer: "1j 08h", unread: true },
];

const mockMessages = [
  { id: 1, from: "them", text: "Bonjour, nous sommes intéressés par votre bureau Paris 8e. Quelles sont les conditions ?", time: "14:30" },
  { id: 2, from: "me", text: "Bonjour, merci pour votre intérêt. Le bien est disponible immédiatement. Souhaitez-vous planifier une visite ?", time: "14:45" },
  { id: 3, from: "them", text: "Oui, quand pouvons-nous visiter ?", time: "15:02" },
];

export default function Messaging() {
  const [selectedConv, setSelectedConv] = useState(1);
  const [message, setMessage] = useState("");

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Conversation list */}
        <div className="w-80 border-r border-border overflow-y-auto hidden md:block">
          <div className="p-4">
            <h2 className="font-display text-lg font-semibold mb-4">Conversations</h2>
            <div className="space-y-1">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedConv === conv.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-secondary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{conv.name}</span>
                    {conv.unread && <span className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{conv.lastMessage}</p>
                  <div className="flex items-center gap-1 text-xs text-primary/60 mt-1">
                    <Clock size={10} /> {conv.timer}
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
                <p className="font-semibold text-sm">SCI Patrimoine</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={10} /> Timer : 2j 14h</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-xl px-4 py-2.5 ${
                  msg.from === "me"
                    ? "bg-primary text-primary-foreground"
                    : "glass-card"
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
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message..."
                className="bg-secondary border-border"
              />
              <Button size="icon" className="shrink-0">
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
