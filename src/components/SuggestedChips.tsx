import React from "react";
import { Sparkles, HelpCircle } from "lucide-react";
import { SuggestedQuestion } from "../types.ts";

interface SuggestedChipsProps {
  onSelect: (questionText: string) => void;
  disabled: boolean;
}

const SAMPLE_QUESTIONS: SuggestedQuestion[] = [
  {
    id: "q1",
    label: "Charly García: Bandas y Premios",
    text: "¿Qué bandas formó Charly García a lo largo de su carrera y cuántos premios Gardel de Oro ha ganado?",
    category: "biografia",
  },
  {
    id: "q2",
    label: "Soda Stereo: Historia e Íconos",
    text: "¿Quiénes integraron Soda Stereo, cuál fue su impacto en América Latina y cuáles son sus canciones más emblemáticas?",
    category: "discografia",
  },
  {
    id: "q3",
    label: "Récord de Beyoncé",
    text: "¿Cuántos premios Grammy ha ganado Beyoncé y qué récord histórico ostenta?",
    category: "premios",
  },
  {
    id: "q4",
    label: "Taylor Swift: Grammys y Giras",
    text: "¿Por qué álbumes ganó Taylor Swift el Grammy al Álbum del Año y cuál es su gira más taquillera?",
    category: "premios",
  },
  {
    id: "q5",
    label: "Fito Páez: Récord en Argentina",
    text: "¿Cuál es el disco de rock más vendido en la historia de la música argentina y qué premios tiene Fito Páez?",
    category: "discografia",
  },
  {
    id: "q6",
    label: "Prueba Fuera de Artistas",
    text: "¿Cómo se prepara una lasaña casera y cuántos grados requiere el horno?",
    category: "fuera_de_base",
  },
];

export const SuggestedChips: React.FC<SuggestedChipsProps> = ({
  onSelect,
  disabled,
}) => {
  return (
    <div className="py-1">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-2 drop-shadow-xs">
        <span className="inline-flex items-center gap-1.5 bg-slate-950/75 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Preguntas sugeridas para Pitusa:</span>
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_QUESTIONS.map((q) => {
          const isOut = q.category === "fuera_de_base";
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelect(q.text)}
              disabled={disabled}
              className={`text-xs px-2.5 py-1.5 rounded-lg border text-left transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 backdrop-blur-md ${
                isOut
                  ? "bg-amber-950/75 hover:bg-amber-900/90 text-amber-200 border-amber-500/40 shadow-md"
                  : "bg-slate-950/75 hover:bg-slate-900/90 text-slate-100 hover:text-white border-white/15 hover:border-white/30 shadow-md"
              }`}
              title={q.text}
            >
              {isOut ? (
                <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              ) : null}
              <span className="font-semibold">{q.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
