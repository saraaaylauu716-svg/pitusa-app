import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp, Lock, CheckCircle2 } from "lucide-react";

export const RulesBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-950/75 backdrop-blur-md border border-white/15 rounded-xl p-3 text-xs text-slate-200 shadow-lg transition-all">
      <button
        type="button"
        id="toggle-rules-info"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-medium text-slate-200 hover:text-white transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Normas operativas: Todo sobre Artistas, Solo sobre Ellos</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <span>{isOpen ? "Ocultar detalles" : "Ver reglas aplicadas"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-3 pt-2.5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
            <span>
              <strong className="text-amber-300">Todo sobre los artistas:</strong> Información exhaustiva de solistas, bandas, discografías, álbumes, canciones, integrantes, premios, récords y biografías.
            </span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
            <span>
              <strong className="text-amber-300">Solo de ellos (Filtro estricto):</strong> Si la consulta no es sobre un artista musical o su obra, responde con rigor: <em>&quot;Lo siento, pero no dispongo de esa información en la base de datos proporcionada.&quot;</em>
            </span>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
            <span>
              <strong className="text-amber-300">Rigor enciclopédico:</strong> Datos verificados, cronologías exactas, galardones oficiales y contexto histórico musical.
            </span>
          </div>

          <div className="flex items-start gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <span>
              <strong className="text-amber-300">Acceso protegido:</strong> La base de datos documental se mantiene segura y privada en el servidor.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
