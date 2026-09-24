import React, { useState } from "react";
import { Copy, Check, User, Bot, AlertCircle } from "lucide-react";
import { ChatMessage } from "../types.ts";

interface MessageItemProps {
  message: ChatMessage;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";
  const isStrictNotFound =
    message.content.trim() ===
    "Lo siento, pero no dispongo de esa información en la base de datos proporcionada.";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API unavailable
    }
  };

  return (
    <div
      id={`message-${message.id}`}
      className={`flex gap-3 max-w-3xl ${
        isAssistant ? "mr-auto" : "ml-auto flex-row-reverse"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold shadow-md overflow-hidden ${
          isAssistant
            ? "ring-2 ring-amber-400 bg-amber-100"
            : "ring-2 ring-indigo-400/50 bg-indigo-600 text-white"
        }`}
      >
        {isAssistant ? (
          <img
            src="/pitusa.jpg"
            alt="Pitusa"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>

      <div
        className={`relative group rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xl backdrop-blur-md transition-all ${
          isAssistant
            ? isStrictNotFound
              ? "bg-amber-950/85 border border-amber-500/50 text-amber-100 rounded-tl-xs"
              : "bg-slate-950/85 border border-white/20 text-slate-100 rounded-tl-xs"
            : "bg-indigo-600/90 border border-indigo-400/30 text-white rounded-tr-xs"
        }`}
      >
        {isAssistant && (
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/10">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <span>🍪</span> Pitusa
            </span>
            {isStrictNotFound && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-900/60 px-2 py-0.5 rounded-full border border-amber-500/40">
                <AlertCircle className="w-3 h-3" />
                Solo Artistas
              </span>
            )}
          </div>
        )}

        <div className="whitespace-pre-wrap font-sans text-sm">{message.content}</div>

        <div
          className={`flex items-center justify-between gap-4 mt-2 pt-1 border-t text-[11px] ${
            isAssistant
              ? isStrictNotFound
                ? "border-amber-500/20 text-amber-300/70"
                : "border-white/10 text-slate-400"
              : "border-indigo-400/30 text-indigo-200"
          }`}
        >
          <span>{message.timestamp}</span>

          {isAssistant && (
            <button
              type="button"
              onClick={handleCopy}
              className="hover:text-amber-300 text-slate-400 transition-colors p-1 rounded inline-flex items-center gap-1 cursor-pointer"
              title="Copiar respuesta"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Copiar</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
