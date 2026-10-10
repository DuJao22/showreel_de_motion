import React, { useState } from 'react';
import { Showreel, ShowreelVerificationReport } from '../types/showreel';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Clock,
  Layers,
  Code2,
  Film,
  Activity,
  Sparkles,
} from 'lucide-react';
import { verifyShowreel, autoCertifyShowreel } from '../utils/sceneVerifier';

interface SceneVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  showreel: Showreel | null;
  onUpdateShowreel: (updated: Showreel) => void;
  onOpenSceneInspector: (index: number) => void;
  onSeekToScene: (index: number, progressInScene?: number) => void;
}

export const SceneVerificationModal: React.FC<SceneVerificationModalProps> = ({
  isOpen,
  onClose,
  showreel,
  onUpdateShowreel,
  onOpenSceneInspector,
  onSeekToScene,
}) => {
  if (!isOpen || !showreel) return null;

  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [report, setReport] = useState<ShowreelVerificationReport>(() => {
    return showreel.verificationReport || verifyShowreel(showreel, true);
  });

  const handleRunFullAudit = () => {
    setIsRunningAudit(true);
    setTimeout(() => {
      const newReport = verifyShowreel(showreel, true);
      setReport(newReport);
      onUpdateShowreel({
        ...showreel,
        verificationReport: newReport,
      });
      setIsRunningAudit(false);
    }, 150);
  };

  const handleAutoRepairAndCertify = () => {
    setIsRunningAudit(true);
    setTimeout(() => {
      const certified = autoCertifyShowreel(showreel);
      onUpdateShowreel(certified);
      const newReport = verifyShowreel(certified, true);
      setReport(newReport);
      setIsRunningAudit(false);
    }, 200);
  };

  const allValid = report.allScenesValid;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 z-50 animate-fadeIn">
      <div className="bg-[#10121c] border border-zinc-800 rounded-2xl w-full max-w-4xl p-4 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base sm:text-lg">
                  Auditoria de Verificação do Showreel
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md uppercase font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                  {report.overallScore}% Aprovado
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Verificação profunda e determinística de 100% das cenas do Canvas 2D (1080×1920)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-mono"
          >
            ✕
          </button>
        </div>

        {/* Global Certification Status Card */}
        <div
          className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
            allValid
              ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-200'
              : 'bg-amber-950/25 border-amber-500/40 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border shrink-0 ${
                allValid
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
              }`}
            >
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">
                {allValid
                  ? 'SHOWREEL 100% VERIFICADO & CERTIFICADO'
                  : 'AUDITORIA DETECTOU ITENS A CORRIGIR'}
              </h4>
              <p className="text-zinc-300 text-[11px] leading-relaxed">
                {allValid
                  ? `Todas as ${report.totalScenes} cenas passaram em 100% dos testes de keyframes, sem vazamento de estado e com orçamento de 60 FPS cumprido.`
                  : `${report.verifiedScenes} de ${report.totalScenes} cenas validadas. Clique em Auto-Reparar para certificar todas as cenas automaticamente.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleRunFullAudit}
              disabled={isRunningAudit}
              className="py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 text-xs font-mono font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningAudit ? 'animate-spin' : ''}`} />
              <span>Re-Auditar</span>
            </button>

            {!allValid && (
              <button
                onClick={handleAutoRepairAndCertify}
                disabled={isRunningAudit}
                className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs font-mono flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Reparar Cenas</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Summary Metrics (Zero-Pill, Clean Typography, Tabular-Nums) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[11px] text-zinc-400 font-mono">Cenas Verificadas</span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              {report.verifiedScenes} / {report.totalScenes}
            </span>
            <span className="text-[10px] text-emerald-400">
              {Math.round((report.verifiedScenes / Math.max(1, report.totalScenes)) * 100)}% Cobertura
            </span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[11px] text-zinc-400 font-mono">Keyframes Testados</span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              {report.totalKeyframesTested} quadros
            </span>
            <span className="text-[10px] text-zinc-400">t = 0.0 a 1.0 (7 pontos)</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[11px] text-zinc-400 font-mono">Latência Média</span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              {report.averageLatencyMs} ms
            </span>
            <span className="text-[10px] text-cyan-400">Orçamento &lt; 16.6ms (60 FPS)</span>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[11px] text-zinc-400 font-mono">Vazamento de Contexto</span>
            <span className="text-lg font-bold text-white font-mono tabular-nums">
              {report.leakCount === 0 ? '0 Leaks' : `${report.leakCount} Alertas`}
            </span>
            <span className="text-[10px] text-emerald-400">Save / Restore Pareados</span>
          </div>
        </div>

        {/* Detailed Scene List Audit Matrix with Keyframe Thumbnails */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800/80 pb-1.5">
            <span>Matriz de Diagnóstico por Cena ({showreel.scenes.length} cenas)</span>
            <span>Clique nos quadros para navegar</span>
          </div>

          {showreel.scenes.map((scene, idx) => {
            const diag = report.sceneDiagnostics[idx];
            const isValid = diag?.valid;

            return (
              <div
                key={scene.id || idx}
                className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 flex flex-col gap-2.5 hover:border-zinc-700 transition-all"
              >
                {/* Scene Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-mono font-bold text-zinc-400 shrink-0">
                      #{idx + 1}
                    </span>
                    <h5 className="font-semibold text-white text-xs truncate">{scene.name}</h5>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 bg-zinc-800/90 px-1.5 py-0.5 rounded">
                      {scene.role}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {scene.duration}s
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono font-medium flex items-center gap-1 ${
                        isValid ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {isValid ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>
                        {isValid
                          ? `100% Verificada (${diag.keyframesPassed}/7 quadros)`
                          : 'Atenção na Verificação'}
                      </span>
                    </span>

                    <button
                      onClick={() => {
                        onClose();
                        onOpenSceneInspector(idx);
                      }}
                      className="p-1 text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800 rounded transition-colors text-xs font-mono flex items-center gap-1"
                      title="Editar código desta cena"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Inspecionar</span>
                    </button>
                  </div>
                </div>

                {/* Diagnostics Metrics Row */}
                {diag && (
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-zinc-400">
                    <span>
                      Latência:{' '}
                      <strong className="text-zinc-200 tabular-nums">
                        {diag.renderLatencyMs}ms
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      FPS Estimado:{' '}
                      <strong className="text-zinc-200 tabular-nums">
                        {diag.fpsEstimate} FPS
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      Balanço de Estado:{' '}
                      <strong
                        className={
                          diag.canvasStateBalanced ? 'text-emerald-400' : 'text-amber-400'
                        }
                      >
                        {diag.canvasStateBalanced ? 'Equilibrado (0 leaks)' : 'Desbalanceado'}
                      </strong>
                    </span>
                    <span>·</span>
                    <span>
                      Render Ativo:{' '}
                      <strong className="text-emerald-400">
                        {diag.nonEmptyPixels ? 'Sim' : 'Aviso'}
                      </strong>
                    </span>
                  </div>
                )}

                {/* Filmstrip Keyframe Thumbnails (t = 0.0, 0.25, 0.50, 0.75, 1.00) */}
                {diag?.thumbnailUrls && diag.thumbnailUrls.length > 0 && (
                  <div className="flex flex-col gap-1 pt-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      Filmstrip de Keyframes (Clique para navegar):
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {diag.thumbnailUrls.map((thumbUrl, thumbIdx) => {
                        const tVal = [0.0, 0.25, 0.5, 0.75, 1.0][thumbIdx];
                        return (
                          <div
                            key={thumbIdx}
                            onClick={() => {
                              onSeekToScene(idx, tVal);
                              onClose();
                            }}
                            className="group/thumb relative aspect-[9/16] rounded-lg overflow-hidden border border-zinc-800 hover:border-cyan-400 cursor-pointer transition-all bg-black shadow-sm"
                            title={`Navegar para Cena #${idx + 1} no instante t=${tVal.toFixed(2)}`}
                          >
                            <img
                              src={thumbUrl}
                              alt={`Keyframe t=${tVal}`}
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-x-0 bottom-0 bg-black/75 px-1 py-0.5 text-center text-[9px] font-mono text-zinc-300">
                              t={tVal.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Warning message if any */}
                {diag?.error && (
                  <div className="p-2 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] font-mono">
                    {diag.error}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
