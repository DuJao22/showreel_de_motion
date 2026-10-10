import React, { useState, useEffect, useRef } from 'react';
import { BuildSceneProgress, GenerationStatus, RoleType } from '../types/showreel';
import {
  Sparkles,
  Code2,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Minimize2,
  Maximize2,
  Copy,
  Check,
  Layers,
  ArrowRight,
  Eye,
  Activity,
  Zap,
} from 'lucide-react';

interface BuildProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: GenerationStatus;
  onWatchShowreel?: () => void;
  selectedModel?: string;
  isClaudeOpus?: boolean;
}

export const BuildProgressModal: React.FC<BuildProgressModalProps> = ({
  isOpen,
  onClose,
  status,
  onWatchShowreel,
  selectedModel = 'gemini-3.8-flash',
  isClaudeOpus = true,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'logs'>('code');
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs to bottom as they arrive
  useEffect(() => {
    if (activeTab === 'logs' && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [status.logs?.length, activeTab]);

  // Keep inspected scene synced with current scene unless user explicitly clicked another scene
  useEffect(() => {
    if (selectedSceneIndex === null && status.currentScene) {
      setSelectedSceneIndex(status.currentScene - 1);
    }
  }, [status.currentScene, selectedSceneIndex]);

  if (!isOpen) return null;

  const percent = status.percent !== undefined ? status.percent : status.stage === 'completed' ? 100 : 15;
  const isCompleted = status.stage === 'completed';
  const isError = status.stage === 'error';

  // Get active scene data
  const currentSceneProg: BuildSceneProgress | undefined =
    status.scenesProgress && status.scenesProgress.length > 0
      ? (selectedSceneIndex !== null && status.scenesProgress[selectedSceneIndex]) ||
        status.scenesProgress.find((s) => s.index === status.currentScene) ||
        status.scenesProgress[0]
      : undefined;

  const inspectedCode =
    (selectedSceneIndex !== null && status.scenesProgress?.[selectedSceneIndex]?.codeSnippet) ||
    status.currentCode ||
    currentSceneProg?.codeSnippet ||
    '// Aguardando síntese e compilação do código Canvas 2D...\n// function drawScene(ctx, t, W, H) { ... }';

  const handleCopyCode = async () => {
    if (!inspectedCode) return;
    try {
      await navigator.clipboard.writeText(inspectedCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // ignore
    }
  };

  const getRoleBadge = (role?: RoleType) => {
    switch (role) {
      case 'gancho':
        return {
          label: 'GANCHO // ABERTURA',
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        };
      case 'clímax':
        return {
          label: 'CLÍMAX // PICO',
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        };
      case 'fechamento':
        return {
          label: 'FECHAMENTO // RESOLUÇÃO',
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        };
      default:
        return {
          label: 'CORPO // PROGRESSÃO',
          bg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
        };
    }
  };

  const roleInfo = getRoleBadge(currentSceneProg?.role || status.currentSceneRole);

  // If Minimized: Show sleek floating dock
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-slideUp">
        <div className="bg-[#0f111a]/95 border border-cyan-500/40 rounded-2xl p-3 shadow-2xl backdrop-blur-xl flex items-center gap-3.5 max-w-md text-xs font-mono">
          <div className="relative flex items-center justify-center">
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : isError ? (
              <AlertCircle className="w-6 h-6 text-rose-400" />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
            )}
          </div>

          <div className="flex flex-col gap-0.5 min-w-[170px]">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="font-semibold uppercase text-zinc-200">
                {isCompleted ? 'Construção Concluída' : isError ? 'Erro na Geração' : 'Construindo Showreel'}
              </span>
              <span className="font-bold text-cyan-400">{percent}%</span>
            </div>
            <p className="text-[11px] text-zinc-300 truncate font-sans font-medium">
              {status.currentSceneName || status.message}
            </p>
            {/* Mini progress bar */}
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 border-l border-zinc-800 pl-2">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white"
              title="Expandir Inspetor de Construção"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            {isCompleted && onWatchShowreel && (
              <button
                onClick={() => {
                  onWatchShowreel();
                  onClose();
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-[10px] hover:bg-emerald-400 flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                <span>Ver</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-2.5 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-[#0c0d16] border border-zinc-800/90 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-zinc-800/80 bg-[#10121d]/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl border flex items-center justify-center ${
                isCompleted
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isError
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <Activity className="w-5 h-5 animate-pulse" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base tracking-tight flex items-center gap-2">
                  <span>Status da Construção do Showreel</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold uppercase bg-zinc-800 border border-zinc-700 text-zinc-300">
                    {status.stage === 'planning'
                      ? 'Planejando Arquitetura'
                      : status.stage === 'writing_scenes'
                      ? 'Sintetizando Código'
                      : status.stage === 'validating'
                      ? 'Validando Canvas 2D'
                      : status.stage === 'repairing'
                      ? 'Auto-correção com IA'
                      : status.stage === 'completed'
                      ? 'Showreel Pronto'
                      : 'Erro'}
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-zinc-400 flex items-center gap-2 font-mono">
                <span>Motor: {selectedModel}</span>
                {isClaudeOpus && (
                  <span className="text-amber-400/90 font-semibold">• Modo Inteligência Claude Opus</span>
                )}
                <span>• Canvas 1080×1920 @ 60 FPS</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 sm:p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-mono transition-colors"
              title="Minimizar para acompanhar na tela do Studio"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 text-xs font-mono transition-colors"
              title="Fechar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Global Progress Bar Strip */}
        <div className="px-4 sm:px-6 py-3 bg-[#0e101a] border-b border-zinc-800/80 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-cyan-400 font-bold">{percent}%</span>
              <span className="text-zinc-500">•</span>
              <span className="text-zinc-200 truncate max-w-[260px] sm:max-w-md font-sans">
                {status.message}
              </span>
            </div>
            {status.totalScenes && (
              <span className="text-[11px] text-zinc-400 font-semibold shrink-0">
                Cena {status.currentScene || 1} de {status.totalScenes}
              </span>
            )}
          </div>

          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/30'
                  : isError
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-md shadow-cyan-500/30'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Scene Pipeline Horizontal Strip */}
        {status.scenesProgress && status.scenesProgress.length > 0 && (
          <div className="px-4 sm:px-6 py-2.5 bg-[#0b0c14] border-b border-zinc-800/70 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2 min-w-max">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mr-1">
                Pipeline de Cenas:
              </span>
              {status.scenesProgress.map((scene, idx) => {
                const isCurrent = (status.currentScene || 1) === scene.index;
                const isInspected = selectedSceneIndex === idx;
                const isSceneCompleted = scene.status === 'completed';
                const isSceneRepairing = scene.status === 'repairing';
                const isSceneValidating = scene.status === 'validating';

                return (
                  <button
                    key={scene.id || idx}
                    onClick={() => setSelectedSceneIndex(idx)}
                    className={`flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-mono border transition-all ${
                      isInspected
                        ? 'bg-zinc-800 border-cyan-500 text-white shadow-sm'
                        : isCurrent
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-200 animate-pulse'
                        : isSceneCompleted
                        ? 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        : 'bg-zinc-950/40 border-zinc-900 text-zinc-600'
                    }`}
                  >
                    <span className="font-bold text-[10px]">0{scene.index}</span>
                    <span className="truncate max-w-[90px] text-[11px] capitalize">
                      {scene.role}
                    </span>
                    {isSceneCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isSceneRepairing ? (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    ) : isSceneValidating || isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-zinc-700" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content Body: Split View (Details & Code / Logs) */}
        <div className="flex-1 min-h-[380px] grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Column: O Que Ele Está Construindo (3.5 cols) */}
          <div className="lg:col-span-4 p-4 sm:p-5 border-b lg:border-b-0 lg:border-r border-zinc-800/80 bg-[#0d0e17]/80 flex flex-col gap-3.5 overflow-y-auto">
            <div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-semibold">
                O que o agente está construindo:
              </span>
              <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                {currentSceneProg?.name || status.currentSceneName || 'Arquitetura Geral do Showreel'}
              </h4>
            </div>

            {/* Role & Specs Box */}
            <div className="bg-[#121422] border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">Papel Dramático:</span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${roleInfo.bg}`}
                >
                  {roleInfo.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Duração Alvo:</span>
                <span className="text-zinc-200 font-semibold">
                  {currentSceneProg?.duration || 4.5}s ({Math.round((currentSceneProg?.duration || 4.5) * 60)} frames @ 60fps)
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Resolução:</span>
                <span className="text-cyan-300 font-semibold">1080 × 1920 (Vertical 9:16)</span>
              </div>

              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-400">Física do Canvas:</span>
                <span className="text-zinc-200">M.spring & M.kineticText</span>
              </div>
            </div>

            {/* Motion Directives injected */}
            <div className="bg-[#121422] border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-2 text-xs">
              <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                Diretrizes do Diretor Mestre:
              </span>
              <ul className="space-y-1.5 text-[11px] text-zinc-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>5 Camadas em ordem rigorosa: Fundo procedural, geometria, tipografia, mira/dados e vinheta.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Física harmônica com molas (overshoot elástico, zero interpolação linear sem graça).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Margens seguras 9:16 aplicadas para Reels/TikTok.</span>
                </li>
              </ul>
            </div>

            {/* Stage Summary Status */}
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs font-mono ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : isError
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                  : 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isError ? (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
              )}
              <span className="text-[11px] leading-snug">
                {isCompleted
                  ? 'Todas as cenas validadas e montadas com perfeição matemática!'
                  : isError
                  ? status.error || 'Ocorreu um erro durante a compilação das cenas.'
                  : `Em andamento: ${status.message}`}
              </span>
            </div>
          </div>

          {/* Right Column: Code Stream & Terminal Logs (8.5 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-[#080910] overflow-hidden">
            {/* View Switcher: Código vs Terminal */}
            <div className="px-4 py-2.5 bg-[#0f111d] border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'code'
                      ? 'bg-zinc-800 text-cyan-300 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Código Canvas 2D da Cena</span>
                </button>

                <button
                  onClick={() => setActiveTab('logs')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    activeTab === 'logs'
                      ? 'bg-zinc-800 text-amber-300 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Terminal de Construção ({status.logs?.length || 0})</span>
                </button>
              </div>

              {activeTab === 'code' && (
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-[11px] font-mono transition-colors"
                  title="Copiar código Canvas 2D"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-400" />
                      <span>Copiar Código</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* TAB CONTENT 1: CÓDIGO DA CENA */}
            {activeTab === 'code' && (
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto font-mono text-xs leading-relaxed text-zinc-300 bg-[#090a12] select-text">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80 text-[10px] text-zinc-500">
                  <span>
                    ARQUIVO: <span className="text-cyan-400">drawScene(ctx, t, W, H)</span> // JavaScript Puro
                  </span>
                  <span>CANVAS 2D • 60 FPS DETERMINÍSTICO</span>
                </div>

                <pre className="overflow-x-auto p-2 bg-[#0c0d16] rounded-xl border border-zinc-800/60 font-mono text-[11px] sm:text-xs text-cyan-100 whitespace-pre leading-relaxed">
                  {inspectedCode}
                </pre>
              </div>
            )}

            {/* TAB CONTENT 2: TERMINAL DE LOGS */}
            {activeTab === 'logs' && (
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto font-mono text-xs text-zinc-300 bg-[#07080e] flex flex-col gap-1.5 select-text">
                {status.logs && status.logs.length > 0 ? (
                  status.logs.map((log) => {
                    const isCode = log.type === 'code';
                    const isSuccess = log.type === 'success';
                    const isWarn = log.type === 'warn';
                    const isErr = log.type === 'error';

                    return (
                      <div
                        key={log.id}
                        className={`flex items-start gap-2 text-[11px] font-mono py-0.5 ${
                          isSuccess
                            ? 'text-emerald-300'
                            : isErr
                            ? 'text-rose-300'
                            : isWarn
                            ? 'text-amber-300'
                            : isCode
                            ? 'text-purple-300'
                            : 'text-zinc-300'
                        }`}
                      >
                        <span className="text-zinc-600 select-none">[{log.time}]</span>
                        <span className="leading-snug">{log.text}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-zinc-500 text-xs py-4 text-center">
                    Aguardando primeiros eventos de compilação...
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-4 sm:px-6 py-3.5 bg-[#0f111c] border-t border-zinc-800 flex items-center justify-between">
          <div className="text-[11px] font-mono text-zinc-400">
            {isCompleted ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Showreel de motion pronto para reprodução
              </span>
            ) : isError ? (
              <span className="text-rose-400">Erro na síntese</span>
            ) : (
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Construindo cenas dinâmicas com física M...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isCompleted && onWatchShowreel ? (
              <button
                onClick={() => {
                  onWatchShowreel();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Assistir Showreel no Player</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-mono transition-colors"
              >
                {isCompleted ? 'Fechar' : 'Minimizar Janela'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
