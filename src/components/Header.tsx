import React from "react";
import { Sparkles, Database, RefreshCw } from "lucide-react";

interface HeaderProps {
  onReset: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, isLoading }) => {
  return (
    <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-md sticky top-0 z-20 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-400 shadow-md shrink-0 bg-amber-50 relative group">
            <img
              src="/pitusa.jpg"
              alt="Pitusa - IA Musical"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5 drop-shadow-sm">
                Pitusa
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-amber-300" />
                IA Artistas Musicales
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Sabe absolutamente todo de los artistas musicales, solo de ellos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-white/10 font-medium backdrop-blur-sm">
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span>Base de datos protegida</span>
          </div>

          <button
            type="button"
            id="btn-clear-chat"
            onClick={onReset}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-800/90 rounded-lg transition-colors cursor-pointer disabled:opacity-50 border border-white/15 backdrop-blur-sm shadow-sm"
            title="Reiniciar chat con Pitusa"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Nuevo chat</span>
          </button>
        </div>
      </div>
    </header>
  );
};
