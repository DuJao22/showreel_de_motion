import React, { useRef, useState } from 'react';
import { Showreel } from '../types/showreel';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
  Repeat,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface TimelineControlsProps {
  showreel: Showreel | null;
  currentTime: number;
  totalDuration: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onNextScene: () => void;
  onPrevScene: () => void;
  onStepFrame?: (delta: number) => void;
  loop: boolean;
  onToggleLoop: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onOpenSceneInspector?: (sceneIndex: number) => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  showreel,
  currentTime,
  totalDuration,
  isPlaying,
  onTogglePlay,
  onSeek,
  onNextScene,
  onPrevScene,
  onStepFrame,
  loop,
  onToggleLoop,
  playbackSpeed,
  onChangeSpeed,
  onOpenSceneInspector,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  // Format seconds into MM:SS.SS
  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateSeekFromPointer(e);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateSeekFromPointer(e);
    }
    // Calculate hover preview
    if (progressBarRef.current && totalDuration > 0) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverTime(pos * totalDuration);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const updateSeekFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || totalDuration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pos * totalDuration);
  };

  // Find active scene index
  let activeSceneIndex = 0;
  if (showreel && showreel.scenes.length > 0) {
    let acc = 0;
    for (let i = 0; i < showreel.scenes.length; i++) {
      if (currentTime >= acc && currentTime < acc + showreel.scenes[i].duration) {
        activeSceneIndex = i;
        break;
      }
      acc += showreel.scenes[i].duration;
    }
  }

  const progressFraction = totalDuration > 0 ? currentTime / totalDuration : 0;

  return (
    <div className="w-full bg-[#121215] border border-white/[0.08] rounded-xl p-2.5 sm:p-3 shadow-sm flex flex-col gap-2">
      {/* Interactive Scrubber with Scene Blocks */}
      <div className="flex flex-col gap-1">
        <div
          ref={progressBarRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={() => setHoverTime(null)}
          className="relative w-full h-7 sm:h-8 bg-zinc-950/80 rounded-lg cursor-pointer overflow-hidden border border-white/[0.06] select-none group flex"
        >
          {/* Overlaid Scene Slices */}
          {showreel && showreel.scenes.length > 0 ? (
            showreel.scenes.map((scene, idx) => {
              const widthPct = (scene.duration / totalDuration) * 100;
              let roleBg = 'bg-zinc-800/60 hover:bg-zinc-700/60 border-white/[0.08]';
              if (scene.role === 'gancho') {
                roleBg = 'bg-amber-950/40 hover:bg-amber-900/50 border-amber-500/30';
              } else if (scene.role === 'clímax') {
                roleBg = 'bg-rose-950/40 hover:bg-rose-900/50 border-rose-500/30';
              } else if (scene.role === 'fechamento') {
                roleBg = 'bg-purple-950/40 hover:bg-purple-900/50 border-purple-500/30';
              }

              return (
                <div
                  key={scene.id || idx}
                  style={{ width: `${widthPct}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    let start = 0;
                    for (let s = 0; s < idx; s++) {
                      start += showreel.scenes[s].duration;
                    }
                    onSeek(start);
                  }}
                  className={`h-full border-r relative transition-colors ${roleBg} flex items-center justify-between px-1.5 sm:px-2`}
                  title={`${scene.name} (${scene.role}) - ${scene.duration}s`}
                >
                  <span className="text-[9px] sm:text-[10px] font-mono font-semibold uppercase text-zinc-300 truncate pointer-events-none">
                    {idx + 1}. {scene.role}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-400 hidden lg:inline">
                    {scene.duration}s
                  </span>
                </div>
              );
            })
          ) : (
            <div className="w-full h-full bg-zinc-800/40" />
          )}

          {/* Played Progress Gradient Tint */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-cyan-500/30 to-amber-500/30 pointer-events-none"
            style={{ width: `${progressFraction * 100}%` }}
          />

          {/* Current Scrubber Needle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)] pointer-events-none z-10 -translate-x-1/2"
            style={{ left: `${progressFraction * 100}%` }}
          >
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full -translate-x-1 -translate-y-1 shadow-md" />
          </div>

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-7 -translate-x-1/2 bg-black/90 text-cyan-300 text-[10px] font-mono px-2 py-0.5 rounded border border-cyan-500/30 pointer-events-none z-20 whitespace-nowrap shadow-lg"
              style={{
                left: `${(hoverTime / (totalDuration || 1)) * 100}%`,
              }}
            >
              {formatTimecode(hoverTime)}
            </div>
          )}
        </div>
      </div>

      {/* Main Transport Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
        {/* Left: Timecode and Scene Quick Info */}
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
          <div className="font-mono text-xs tracking-wider bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-white/[0.08] text-zinc-300 shrink-0">
            <span className="text-white font-bold">{formatTimecode(currentTime)}</span>
            <span className="text-zinc-600 mx-1">/</span>
            <span className="text-zinc-400">{formatTimecode(totalDuration)}</span>
          </div>

          {showreel && showreel.scenes[activeSceneIndex] && (
            <button
              onClick={() => onOpenSceneInspector?.(activeSceneIndex)}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-300 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1.5 rounded-lg border border-white/[0.08] transition-all hover:border-white/[0.2] truncate max-w-[170px] sm:max-w-[200px]"
              title="Clique para inspecionar / editar o código desta cena"
            >
              <span className="text-zinc-500 shrink-0">Cena {activeSceneIndex + 1}:</span>
              <span className="text-zinc-200 font-medium truncate">
                {showreel.scenes[activeSceneIndex].name}
              </span>
            </button>
          )}
        </div>

        {/* Center: Playback Transport Buttons */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <button
            onClick={onPrevScene}
            className="p-2 sm:p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.08] transition-all active:scale-95"
            title="Cena anterior"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {onStepFrame && (
            <button
              onClick={() => onStepFrame(-1)}
              className="hidden sm:flex p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.08] transition-all active:scale-95"
              title="Voltar 1 frame (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onTogglePlay}
            className="p-2 sm:p-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-bold shadow-sm transition-all active:scale-95"
            title={isPlaying ? 'Pausar (Espaço)' : 'Reproduzir (Espaço)'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          {onStepFrame && (
            <button
              onClick={() => onStepFrame(1)}
              className="hidden sm:flex p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.08] transition-all active:scale-95"
              title="Avançar 1 frame (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onNextScene}
            className="p-2 sm:p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-all active:scale-95"
            title="Próxima cena"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSeek(0)}
            className="p-2 sm:p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-all active:scale-95"
            title="Reiniciar timeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Loop & Speed toggles */}
        <div className="flex items-center justify-end w-full sm:w-auto gap-2">
          {/* Loop toggle */}
          <button
            onClick={onToggleLoop}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono transition-all flex items-center gap-1.5 ${
              loop
                ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
            }`}
            title="Repetir em loop"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>LOOP</span>
          </button>

          {/* Playback Speed */}
          <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-1 text-xs font-mono text-zinc-300">
            <Gauge className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={playbackSpeed}
              onChange={(e) => onChangeSpeed(Number(e.target.value))}
              className="bg-transparent border-none text-zinc-300 focus:outline-none cursor-pointer text-xs"
              title="Velocidade de reprodução"
            >
              <option value={0.5} className="bg-zinc-900 text-white">0.5x</option>
              <option value={1} className="bg-zinc-900 text-white">1.0x</option>
              <option value={1.5} className="bg-zinc-900 text-white">1.5x</option>
              <option value={2} className="bg-zinc-900 text-white">2.0x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
