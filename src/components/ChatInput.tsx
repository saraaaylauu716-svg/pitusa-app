import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [input]);

  return (
    <form
      id="chat-input-form"
      onSubmit={handleSubmit}
      className="relative flex items-end gap-2 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-white/20 p-2 shadow-2xl focus-within:border-amber-400/60 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all"
    >
      <textarea
        ref={textareaRef}
        id="input-query-field"
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Pregúntale a Pitusa sobre cualquier artista musical..."
        disabled={isLoading}
        className="w-full resize-none bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-hidden disabled:opacity-50 max-h-36 min-h-[44px]"
      />

      <button
        type="submit"
        id="btn-send-message"
        disabled={!input.trim() || isLoading}
        className="shrink-0 h-11 w-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-bold shadow-md"
        title="Enviar consulta (Enter)"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
        ) : (
          <Send className="w-4 h-4 text-slate-950" />
        )}
      </button>
    </form>
  );
};
