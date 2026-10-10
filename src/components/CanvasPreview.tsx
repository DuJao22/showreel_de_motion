import React, { useEffect, useRef, useState } from 'react';
import { CinematicFilterConfig, Scene, Showreel } from '../types/showreel';
import { Maximize2, Minimize2, Eye, EyeOff, Radio, Clapperboard, Camera, Layers } from 'lucide-react';
import { cinematicPostProcessor, CINEMATIC_PRESETS } from '../utils/cinematicFilters';
import { compileSceneCode, renderEmergencySceneMotion } from '../utils/proceduralFallback';
import {
  calculateParallaxOffsets,
  renderParallaxDeepBackground,
  renderParallaxForeground,
} from '../utils/parallaxEngine';

interface CanvasPreviewProps {
  showreel: Showreel | null;
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isRecording: boolean;
  exportProgress?: number;
  showSafeAreas: boolean;
  onToggleSafeAreas: () => void;
  cinematicFilters: CinematicFilterConfig;
  onUpdateFilters: (filters: Partial<CinematicFilterConfig>) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onTakeSnapshot?: () => void;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  showreel,
  currentTime,
  isPlaying,
  onTogglePlay,
  isRecording,
  exportProgress = 0,
  showSafeAreas,
  onToggleSafeAreas,
  cinematicFilters,
  onUpdateFilters,
  canvasRef,
  onTakeSnapshot,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fps, setFps] = useState(60);
  const [parallaxEnabled, setParallaxEnabled] = useState(true);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseSmoothRef = useRef({ x: 0, y: 0 });
  const isHoveredRef = useRef(false);
  const frameCountRef = useRef(0);
  const lastFpsCalcRef = useRef(performance.now());

  // Determine current active scene
  let currentScene: Scene | null = null;
  let sceneRelativeT = 0;

  if (showreel && showreel.scenes.length > 0) {
    let accumulatedTime = 0;
    for (let i = 0; i < showreel.scenes.length; i++) {
      const scene = showreel.scenes[i];
      if (
        currentTime >= accumulatedTime &&
        currentTime < accumulatedTime + scene.duration
      ) {
        currentScene = scene;
        sceneRelativeT = Math.max(
          0,
          Math.min(1, (currentTime - accumulatedTime) / scene.duration)
        );
        break;
      }
      accumulatedTime += scene.duration;
    }

    if (!currentScene) {
      currentScene = showreel.scenes[showreel.scenes.length - 1];
      sceneRelativeT = 1;
    }
  }

  // Draw current frame to canvas whenever currentTime changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Measure FPS
    frameCountRef.current++;
    const now = performance.now();
    if (now - lastFpsCalcRef.current >= 1000) {
      setFps(Math.round((frameCountRef.current * 1000) / (now - lastFpsCalcRef.current)));
      frameCountRef.current = 0;
      lastFpsCalcRef.current = now;
    }

    // Interpolação suave (inércia/lerp) das coordenadas de Parallax 2.5D
    const smooth = mouseSmoothRef.current;
    const target = mouseTargetRef.current;
    smooth.x += (target.x - smooth.x) * 0.14;
    smooth.y += (target.y - smooth.y) * 0.14;

    const parallax = calculateParallaxOffsets(
      smooth.x,
      smooth.y,
      sceneRelativeT,
      currentTime,
      parallaxEnabled
    );

    ctx.save();
    try {
      // 1. Camada 0: Fundo Profundo 2.5D (z = 0.25)
      if (parallaxEnabled) {
        renderParallaxDeepBackground(
          ctx,
          W,
          H,
          parallax.bgX,
          parallax.bgY,
          sceneRelativeT,
          showreel?.dna.paleta.primary
        );
      }

      // 2. Camada 1: Cena Principal com Câmera Parallax (z = 1.0)
      ctx.save();
      if (parallaxEnabled) {
        // Câmera suave com zoom leve de 3.5% para eliminar recortes de borda durante deslocamento
        ctx.translate(W / 2 + parallax.sceneX, H / 2 + parallax.sceneY);
        ctx.scale(1.035, 1.035);
        ctx.translate(-W / 2, -H / 2);
      }

      if (currentScene) {
        if (!currentScene.compiledFn && currentScene.code) {
          try {
            currentScene.compiledFn = compileSceneCode(currentScene.code);
          } catch {
            // will fallback below
          }
        }

        if (currentScene.compiledFn) {
          currentScene.compiledFn(ctx, sceneRelativeT, W, H);
        } else {
          renderEmergencySceneMotion(ctx, sceneRelativeT, W, H, currentScene, showreel?.dna);
        }
      } else {
        renderEmergencySceneMotion(ctx, sceneRelativeT, W, H, { name: 'SHOWREEL MOTION', role: 'gancho' }, showreel?.dna);
      }

      ctx.restore(); // Fecha transformação da Camada 1

      // 3. Camada 2: Primeiro Plano Óptico 2.5D (z = 1.85)
      if (parallaxEnabled) {
        renderParallaxForeground(
          ctx,
          W,
          H,
          parallax.fgX,
          parallax.fgY,
          sceneRelativeT,
          showreel?.dna.paleta.accent
        );
      }

      // Apply Global Cinematic Post-Processing Filters (Grain, Vignette, Chromatic Aberration)
      if (cinematicFilters && cinematicFilters.enabled) {
        cinematicPostProcessor.apply(
          ctx,
          W,
          H,
          cinematicFilters,
          frameCountRef.current
        );
      }

      // Draw safe areas overlay if enabled
      if (showSafeAreas) {
        // 9:16 safe zones (10% top/bottom, 8% sides)
        const marginX = W * 0.08;
        const marginTop = H * 0.12;
        const marginBottom = H * 0.12;

        ctx.strokeStyle = 'rgba(255, 60, 100, 0.45)';
        ctx.lineWidth = 4;
        ctx.setLineDash([16, 12]);
        ctx.strokeRect(marginX, marginTop, W - marginX * 2, H - marginTop - marginBottom);

        // Center crosshair
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(W / 2 - 30, H / 2);
        ctx.lineTo(W / 2 + 30, H / 2);
        ctx.moveTo(W / 2, H / 2 - 30);
        ctx.lineTo(W / 2, H / 2 + 30);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.font = '600 24px monospace';
        ctx.fillStyle = 'rgba(255, 60, 100, 0.7)';
        ctx.textAlign = 'left';
        ctx.fillText('SAFE AREA 9:16 (STORIES / REELS)', marginX + 16, marginTop + 36);
      }
    } catch (renderErr) {
      console.warn('Erro na renderização da cena atual:', renderErr);
      try {
        renderEmergencySceneMotion(ctx, sceneRelativeT, W, H, currentScene || { name: 'MOTION SCENE', role: 'corpo' }, showreel?.dna);
      } catch {
        // ignore
      }
    } finally {
      ctx.restore();
    }
  }, [currentScene, sceneRelativeT, currentTime, showSafeAreas, cinematicFilters, parallaxEnabled, canvasRef, showreel?.dna]);

  // Cycle through cinematic presets: 35mm -> Arri -> Cyber -> Clean
  const handleCycleFilterPreset = () => {
    const current = cinematicFilters.preset;
    if (!cinematicFilters.enabled || current === 'clean') {
      onUpdateFilters(CINEMATIC_PRESETS['35mm']);
    } else if (current === '35mm') {
      onUpdateFilters(CINEMATIC_PRESETS['arri']);
    } else if (current === 'arri') {
      onUpdateFilters(CINEMATIC_PRESETS['cyber']);
    } else {
      onUpdateFilters(CINEMATIC_PRESETS['clean']);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'gancho':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'clímax':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'fechamento':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseTargetRef.current = {
      x: Math.max(-1, Math.min(1, nx)),
      y: Math.max(-1, Math.min(1, ny)),
    };
    isHoveredRef.current = true;
  };

  const handlePointerLeave = () => {
    mouseTargetRef.current = { x: 0, y: 0 };
    isHoveredRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full select-none"
    >
      {/* 9:16 Canvas Frame com dimensionamento responsivo otimizado e perspectiva 2.5D */}
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          perspective: 1200,
          transform:
            parallaxEnabled && isHoveredRef.current
              ? `perspective(1200px) rotateY(${mouseSmoothRef.current.x * 5}deg) rotateX(${-mouseSmoothRef.current.y * 5}deg)`
              : 'perspective(1200px) rotateY(0deg) rotateX(0deg)',
          transition: isHoveredRef.current ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        }}
        className="relative overflow-hidden rounded-xl bg-black shadow-2xl border border-white/[0.08] w-auto h-[46dvh] xs:h-[48dvh] sm:h-[52dvh] md:h-[56dvh] lg:h-[60dvh] max-h-[580px] aspect-[9/16] flex items-center justify-center cursor-crosshair group shrink-0"
      >
        {/* The 1080x1920 Physical Canvas */}
        <canvas
          ref={canvasRef}
          width={1080}
          height={1920}
          onClick={onTogglePlay}
          className="w-full h-full object-contain cursor-pointer block"
          title="Clique para reproduzir / pausar (Mova o cursor para Parallax 2.5D)"
        />

        {/* Minimalist Top HUD Overlay in Canvas - 100% responsivo sem estouro em mobile */}
        <div className="absolute top-2 inset-x-2 sm:top-2.5 sm:inset-x-2.5 flex items-center justify-between pointer-events-none z-20 gap-1">
          {/* Metadata */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-mono text-zinc-300 bg-black/85 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded border border-white/10 shrink-0">
            <span className="font-bold text-white uppercase tracking-wider">
              {currentScene?.role || 'cena'}
            </span>
            <span className="text-zinc-600 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-zinc-400 tabular-nums hidden sm:inline">{showreel?.dna.bpm || 120} BPM</span>
            <span className="text-zinc-600 hidden md:inline" aria-hidden="true">·</span>
            <span className="text-emerald-400 tabular-nums hidden md:inline">{fps} FPS</span>
          </div>

          <div className="flex items-center gap-1 pointer-events-auto shrink-0">
            {/* Toggle Parallax 2.5D */}
            <button
              onClick={() => setParallaxEnabled((prev) => !prev)}
              className={`p-1 sm:p-1.5 sm:px-2 rounded-md sm:rounded-lg text-xs backdrop-blur-md transition-all flex items-center gap-1 font-mono ${
                parallaxEnabled
                  ? 'bg-zinc-900/90 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-black/75 text-zinc-400 border border-white/10 hover:text-white'
              }`}
              title="Efeito Parallax 2.5D: Camadas de profundidade ativas com Mouse e Timeline"
            >
              <Layers className={`w-3.5 h-3.5 ${parallaxEnabled ? 'text-cyan-400' : 'text-zinc-400'}`} />
              <span className="hidden sm:inline uppercase text-[10px] font-semibold">
                2.5D {parallaxEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Filtro Cinematográfico */}
            <button
              onClick={handleCycleFilterPreset}
              className={`p-1 sm:p-1.5 sm:px-2 rounded-md sm:rounded-lg text-xs backdrop-blur-md transition-all flex items-center gap-1 font-mono ${
                cinematicFilters.enabled
                  ? 'bg-zinc-900/90 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-black/75 text-zinc-400 border border-white/10 hover:text-white'
              }`}
              title="Filtro Cinematográfico: 35mm / Arri / Cyber / Sem Filtro"
            >
              <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline uppercase text-[10px] font-semibold">
                {cinematicFilters.enabled ? cinematicFilters.preset : 'Filtro'}
              </span>
            </button>

            {/* Áreas de Segurança (stories/reels) */}
            <button
              onClick={onToggleSafeAreas}
              className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg text-xs backdrop-blur-md transition-all hidden xs:flex ${
                showSafeAreas
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
                  : 'bg-black/75 text-zinc-400 border border-white/10 hover:text-white'
              }`}
              title="Alternar Áreas de Segurança 9:16 (Stories / Reels)"
            >
              {showSafeAreas ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            {/* Capturar Snapshot */}
            {onTakeSnapshot && (
              <button
                onClick={onTakeSnapshot}
                className="p-1 sm:p-1.5 rounded-md sm:rounded-lg text-xs bg-black/75 text-zinc-400 border border-white/10 hover:text-white backdrop-blur-md transition-all hover:bg-zinc-800 hidden sm:flex"
                title="Capturar Foto do Frame Atual (1080x1920 PNG)"
              >
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            )}

            {/* Tela cheia */}
            <button
              onClick={toggleFullscreen}
              className="p-1 sm:p-1.5 rounded-md sm:rounded-lg text-xs bg-black/75 text-zinc-400 border border-white/10 hover:text-white backdrop-blur-md transition-all"
              title="Tela cheia"
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Live Recording HUD when Exporting */}
        {isRecording && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-30 pointer-events-auto">
            <div className="flex items-center gap-2.5 bg-zinc-900 border border-red-500/60 text-red-300 px-4 py-2 rounded-xl mb-4 shadow-lg">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="font-mono font-bold text-xs tracking-wider uppercase">
                Renderizando Showreel 1080×1920...
              </span>
            </div>

            <div className="w-64 bg-zinc-900 rounded-full h-2 overflow-hidden border border-zinc-800">
              <div
                className="bg-cyan-400 h-full transition-all duration-150"
                style={{ width: `${Math.round(exportProgress * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-[11px] font-mono text-zinc-400 tabular-nums">
              {Math.round(exportProgress * 100)}% processado
            </div>
          </div>
        )}

        {/* Play icon overlay on pause */}
        {!isPlaying && !isRecording && (
          <div
            onClick={onTogglePlay}
            className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center cursor-pointer transition-opacity"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/95 text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform">
              <svg className="w-6 h-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Bottom Corner Info */}
        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[10px] font-mono text-zinc-400 pointer-events-none z-10">
          <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-white/5">
            <span>1080 × 1920</span>
            <span className="text-zinc-600">·</span>
            <span>9:16</span>
          </div>

          <div className="bg-black/75 backdrop-blur-md px-2 py-0.5 rounded border border-white/5">
            {currentScene?.name ? currentScene.name.slice(0, 24) : 'Showreel'}
          </div>
        </div>
      </div>
    </div>
  );
};
