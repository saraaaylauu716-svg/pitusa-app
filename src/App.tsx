import { useState, useRef, useEffect } from "react";
import { Header } from "./components/Header.tsx";
import { MessageItem } from "./components/MessageItem.tsx";
import { ChatInput } from "./components/ChatInput.tsx";
import { SuggestedChips } from "./components/SuggestedChips.tsx";
import { RulesBanner } from "./components/RulesBanner.tsx";
import { ChatMessage } from "./types.ts";
import { BookOpen, ShieldCheck, MessageSquare } from "lucide-react";

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    content:
      "¡Hola! Soy **Pitusa** 🍪, tu IA especialista en **artistas musicales**.\n\nEstoy configurada para responder **absolutamente todo sobre los artistas y solo sobre ellos**: bandas, solistas, integrantes, discografías completas, álbumes cumbres, canciones emblemáticas, premios (Grammys, Gardel de Oro, Óscars, etc.), récords y biografías.\n\nSi tu pregunta trata sobre cualquier artista musical, te responderé con el máximo detalle y rigor. Si me preguntas sobre temas ajenos a artistas musicales, te responderé estrictamente que solo respondo sobre artistas y su obra musical.\n\n¿Sobre qué artista o banda te gustaría consultar?",
    timestamp: "Inicio",
  },
];

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history excluding the welcome system greeting
      const historyPayload = messages
        .filter((m) => m.id !== "welcome-1")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error("Error en la comunicación con el servicio.");
      }

      const data = await res.json();
      const replyText =
        data.reply ||
        "Lo siento, pero solo respondo consultas sobre artistas musicales, bandas, cantantes y su obra musical.";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMessage: ChatMessage = {
        id: `assistant-err-${Date.now()}`,
        role: "assistant",
        content:
          "Lo siento, pero solo respondo consultas sobre artistas musicales, bandas, cantantes y su obra musical.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="flex flex-col min-h-screen text-slate-100 font-sans antialiased relative bg-slate-950 selection:bg-amber-400 selection:text-slate-950">
      {/* Fondo de la imagen proporcionada (Nyan Cat) fijado a pantalla completa y 100% nítido */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/nyan_bg.jpg"
          alt="Fondo Nyan Cat"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header onReset={handleReset} isLoading={isLoading} />

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 flex flex-col gap-3">
          <RulesBanner />

          {/* Pantalla de chat totalmente transparente: sin fondo blanco, solo los globos de texto flotantes */}
          <div className="flex-1 bg-transparent p-2 sm:p-4 overflow-y-auto flex flex-col justify-between min-h-[440px]">
            {/* Conversation stream */}
            <div className="flex flex-col gap-4">
              {messages.map((msg) => (
                <MessageItem key={msg.id} message={msg} />
              ))}

              {isLoading && (
                <div className="flex gap-3 max-w-2xl mr-auto items-center text-amber-200 text-xs bg-slate-950/85 backdrop-blur-md border border-amber-400/40 px-4 py-3 rounded-2xl shadow-xl">
                  <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-amber-400">
                    <img src="/pitusa.jpg" alt="Pitusa" className="w-full h-full object-cover animate-pulse" />
                  </div>
                  <span className="font-medium">Pitusa está respondiendo sobre los artistas...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick empty state hints if only welcome message is present */}
            {messages.length === 1 && (
              <div className="mt-8 pt-4 text-center">
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                  <span className="text-sm">🍪</span>
                  <span>Pitusa: Responde absolutamente todo de los artistas musicales, solo de ellos</span>
                </div>
                <p className="text-[11px] text-slate-300 max-w-md mx-auto drop-shadow-sm mt-1">
                  Pregúntale a Pitusa sobre biografías, discografías, integrantes, canciones emblemáticas y premios de cualquier artista musical.
                </p>
              </div>
            )}
          </div>

          {/* Suggested Queries */}
          <SuggestedChips onSelect={handleSendMessage} disabled={isLoading} />

          {/* Input Bar */}
          <div className="sticky bottom-3 z-10">
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
            <div className="flex items-center justify-between text-[11px] text-white/90 drop-shadow-sm px-2 mt-1.5 font-medium">
              <span className="flex items-center gap-1.5 bg-slate-950/75 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Pitusa responde absolutamente todo de los artistas, solo de ellos
              </span>
              <span className="hidden sm:inline bg-slate-950/75 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10">Presione Enter para enviar</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
