import React, { useState } from 'react';
import { DNA } from '../types/showreel';
import {
  Dna,
  Shuffle,
  Zap,
  Activity,
  Film,
  Type,
  Palette as PaletteIcon,
  Layers,
  History,
  Check,
  Sparkles,
} from 'lucide-react';
import { getStoredDNAHistory } from '../utils/dnaGenerator';

interface DNACardProps {
  dna: DNA | null;
  onRerollDNA: () => void;
  onSelectStoredDNA?: (dna: DNA) => void;
}

export const DNACard: React.FC<DNACardProps> = ({
  dna,
  onRerollDNA,
  onSelectStoredDNA,
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  if (!dna) return null;

  const history = getStoredDNAHistory();

  const copyColorToClipboard = (colorStr: string) => {
    navigator.clipboard?.writeText(colorStr);
    setCopiedColor(colorStr);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className="w-full bg-[#11131c]/90 border border-zinc-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-xl flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0">
            <Dna className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100 font-mono">
              DNA Visual
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono">
              {dna.paleta.name} • {dna.bpm} BPM
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {history.length > 0 && (
            <button
              onClick={() => setShowHistoryModal(true)}
              className="p-1.5 px-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 text-[11px] font-mono flex items-center gap-1 transition-colors"
              title="Histórico de DNAs gerados"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Histórico</span>
            </button>
          )}

          <button
            onClick={onRerollDNA}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-[11px] font-mono font-medium flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="Sortear nova combinação de paleta, tipografia e ritmo"
          >
            <Shuffle className="w-3 h-3 text-amber-400" />
            <span>Sortear</span>
          </button>
        </div>
      </div>

      {/* Clean Grid of Key Parameters */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Paleta HSL Swatches */}
        <div className="bg-zinc-900/70 border border-zinc-800/60 rounded-xl p-2.5 flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono uppercase">
            <span className="flex items-center gap-1">
              <PaletteIcon className="w-3 h-3 text-cyan-400" />
              Cores HSL
            </span>
            {copiedColor && (
              <span className="text-emerald-400 lowercase text-[9px]">copiado!</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 pt-0.5">
            {[
              { label: 'bg', color: dna.paleta.bg },
              { label: 'pri', color: dna.paleta.primary },
              { label: 'sec', color: dna.paleta.secondary },
              { label: 'acc', color: dna.paleta.accent },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => copyColorToClipboard(item.color)}
                style={{ backgroundColor: item.color }}
                className="w-5 h-5 rounded-md border border-white/15 transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                title={`${item.label}: ${item.color}`}
              />
            ))}
          </div>
        </div>

        {/* Ritmo & BPM */}
        <div className="bg-zinc-900/70 border border-zinc-800/60 rounded-xl p-2.5 flex flex-col justify-between gap-1">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono uppercase">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400" />
              Ritmo
            </span>
            <span className="text-[10px] font-mono text-zinc-500">1080×1920</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold font-mono text-emerald-300">{dna.bpm}</span>
            <span className="text-[10px] font-mono text-zinc-400">BPM</span>
            <span className="text-[10px] text-zinc-500 ml-auto font-mono">
              {dna.numeroCenas} cenas
            </span>
          </div>
        </div>

        {/* Tipografia */}
        <div className="bg-zinc-900/70 border border-zinc-800/60 rounded-xl p-2.5 flex flex-col justify-between gap-1">
          <div className="flex items-center gap-1 text-zinc-400 text-[10px] font-mono uppercase">
            <Type className="w-3 h-3 text-purple-400" />
            Tipografia
          </div>
          <span className="text-[11px] font-semibold text-zinc-200 truncate" title={dna.tipografia.name}>
            {dna.tipografia.name}
          </span>
        </div>

        {/* Dinâmica & Energia */}
        <div className="bg-zinc-900/70 border border-zinc-800/60 rounded-xl p-2.5 flex flex-col justify-between gap-1">
          <div className="flex items-center justify-between text-zinc-400 text-[10px] font-mono uppercase">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Energia
            </span>
            <span className="font-mono text-[10px] text-amber-300 font-bold">{dna.energia}/5</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <div
                key={lvl}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  lvl <= dna.energia ? 'bg-amber-400' : 'bg-zinc-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#141724] border border-zinc-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl flex flex-col gap-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Histórico de DNAs</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-zinc-400 hover:text-white text-xs font-mono p-1"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-1">
              {history.map((histDNA, idx) => (
                <div
                  key={histDNA.id}
                  onClick={() => {
                    onSelectStoredDNA?.(histDNA);
                    setShowHistoryModal(false);
                  }}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    histDNA.id === dna.id
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                      : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        #{idx + 1} {histDNA.paleta.name}
                      </span>
                      {histDNA.id === dna.id && (
                        <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/30 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Atual
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono">
                      <span>{histDNA.bpm} BPM</span>
                      <span>Energia {histDNA.energia}/5</span>
                      <span>{histDNA.estrutura}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      style={{ backgroundColor: histDNA.paleta.primary }}
                      className="w-3.5 h-3.5 rounded-md border border-white/10"
                    />
                    <span
                      style={{ backgroundColor: histDNA.paleta.secondary }}
                      className="w-3.5 h-3.5 rounded-md border border-white/10"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-mono"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
