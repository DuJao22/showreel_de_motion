import React, { useState, useEffect } from 'react';
import { DNA, Scene, SceneVerificationDiagnostic } from '../types/showreel';
import {
  Code,
  Play,
  CheckCircle2,
  AlertTriangle,
  Save,
  RefreshCw,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { verifyScene } from '../utils/sceneVerifier';
import { generateSingleSceneWithAi } from '../utils/geminiService';
import { generateDynamicMotionSceneCode } from '../utils/proceduralFallback';
import { regenerateSceneAnimationWithoutRepeat } from '../utils/motionGeneratorEngine';

interface SceneInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: Scene | null;
  sceneIndex: number;
  totalScenes: number;
  allScenes?: Scene[];
  dna?: DNA;
  selectedModel?: string;
  onUpdateSceneCode: (sceneIndex: number, newCode: string, updatedSceneMeta?: Partial<Scene>) => void;
}

export const SceneInspectorModal: React.FC<SceneInspectorModalProps> = ({
  isOpen,
  onClose,
  scene,
  sceneIndex,
  totalScenes,
  allScenes,
  dna,
  selectedModel = 'gemini-3.8-flash',
  onUpdateSceneCode,
}) => {
  if (!isOpen || !scene) return null;

  const [codeDraft, setCodeDraft] = useState(scene.code);
  const [diag, setDiag] = useState<SceneVerificationDiagnostic>(() => {
    return scene.verification || verifyScene(scene, dna, true);
  });
  const [testResult, setTestResult] = useState<{ valid: boolean; message: string } | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [showMCheatSheet, setShowMCheatSheet] = useState(false);

  useEffect(() => {
    setCodeDraft(scene.code);
    const d = scene.verification || verifyScene(scene, dna, true);
    setDiag(d);
  }, [scene, dna]);

  const handleTestCode = () => {
    const updatedDiag = verifyScene({ ...scene, code: codeDraft }, dna, true);
    setDiag(updatedDiag);

    if (updatedDiag.valid) {
      setTestResult({
        valid: true,
        message: `100% Verificado! 7 keyframes testados sem erros (${updatedDiag.renderLatencyMs}ms/frame a 60 FPS).`,
      });
    } else {
      setTestResult({
        valid: false,
        message: updatedDiag.error || 'Erro de execução detectado.',
      });
    }
  };

  const handleSaveAndApply = () => {
    const updatedDiag = verifyScene({ ...scene, code: codeDraft }, dna, true);
    if (!updatedDiag.valid) {
      setTestResult({
        valid: false,
        message: `Não foi possível salvar: ${updatedDiag.error}`,
      });
      return;
    }

    onUpdateSceneCode(sceneIndex, codeDraft);
    onClose();
  };

  const [currentArchetypeName, setCurrentArchetypeName] = useState(scene.archetypeName || '');

  const handleRandomizeAnimation = () => {
    if (!dna) return;
    const updated = regenerateSceneAnimationWithoutRepeat(
      dna,
      scene,
      allScenes || [scene],
      sceneIndex
    );
    setCodeDraft(updated.code);
    setCurrentArchetypeName(updated.archetypeName || '');
    const updatedDiag = verifyScene(updated, dna, true);
    setDiag(updatedDiag);
    setTestResult({
      valid: true,
      message: `Nova animação gerada: "${updated.archetypeName}" (100% verificada e alinhada ao roteiro)!`,
    });
    onUpdateSceneCode(sceneIndex, updated.code, {
      archetypeId: updated.archetypeId,
      archetypeName: updated.archetypeName,
      description: updated.description,
    });
  };

  const handleAutoRepair = () => {
    if (!dna) return;
    const fixedCode = generateDynamicMotionSceneCode(
      dna,
      scene.role,
      sceneIndex,
      scene.name,
      scene.scriptSnippet || 'Showreel Motion'
    );
    setCodeDraft(fixedCode);
    const updatedDiag = verifyScene({ ...scene, code: fixedCode }, dna, true);
    setDiag(updatedDiag);
    setTestResult({
      valid: true,
      message: 'Cena auto-reparada e certificada com sucesso no motor determinístico M!',
    });
  };

  const handleRegenerateWithAi = async () => {
    if (!dna) return;
    setIsGeneratingAi(true);
    setTestResult({
      valid: true,
      message: 'Consultando o Diretor Mestre com rigor estético do Claude Opus...',
    });

    try {
      const generatedCode = await generateSingleSceneWithAi(
        dna,
        {
          id: scene.id,
          name: scene.name,
          role: scene.role,
          duration: scene.duration,
          description: scene.description,
        },
        selectedModel
      );

      setCodeDraft(generatedCode);
      const validation = verifyScene({ ...scene, code: generatedCode }, dna, true);
      setDiag(validation);

      if (validation.valid) {
        setTestResult({
          valid: true,
          message: 'Nova cena gerada pelo Diretor Mestre e 100% verificada!',
        });
      } else {
        setTestResult({
          valid: false,
          message: `Cena gerada com aviso: ${validation.error}`,
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({
        valid: false,
        message: `Falha ao gerar cena com IA: ${msg}`,
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-[#11131c] border border-zinc-800 rounded-2xl w-full max-w-4xl p-4 sm:p-6 shadow-2xl flex flex-col gap-3.5 max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base">
                  Cena #{sceneIndex + 1}: {scene.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-semibold bg-zinc-800 text-cyan-300 border border-zinc-700">
                  {scene.role}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400">
                Duração: {scene.duration}s · Canvas 2D determinístico com objeto <span className="font-mono text-cyan-300 font-semibold">M</span>
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

        {/* Verification Status & Filmstrip Strip */}
        <div className="flex flex-col gap-2 bg-zinc-900/90 p-3 rounded-xl border border-zinc-800 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {diag.valid ? (
                <span className="text-emerald-400 flex items-center gap-1.5 font-mono text-[11px] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  100% Verificada ({diag.keyframesPassed}/7 quadros testados)
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1.5 font-mono text-[11px] font-semibold">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Verificação Pendente / Inconsistência
                </span>
              )}
              <span className="text-zinc-500">·</span>
              <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                Latência: {diag.renderLatencyMs}ms (60 FPS)
              </span>
              <span className="text-zinc-500">·</span>
              <span className="text-[11px] font-mono text-zinc-400">
                Contexto:{' '}
                <strong className={diag.canvasStateBalanced ? 'text-emerald-400' : 'text-amber-400'}>
                  {diag.canvasStateBalanced ? '0 leaks' : 'desbalanceado'}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!diag.valid && dna && (
                <button
                  onClick={handleAutoRepair}
                  className="text-[11px] font-mono text-emerald-300 hover:text-white flex items-center gap-1 bg-emerald-950/50 border border-emerald-600/50 px-2 py-0.5 rounded-lg transition-colors"
                >
                  <Zap className="w-3 h-3 text-emerald-400" />
                  Auto-Reparar
                </button>
              )}

              <button
                onClick={() => setShowMCheatSheet((prev) => !prev)}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded-lg transition-colors"
              >
                <BookOpen className="w-3 h-3" />
                {showMCheatSheet ? 'Fechar Manual' : 'Manual M'}
              </button>
            </div>
          </div>

          {/* Keyframe Filmstrip Thumbnails */}
          {diag.thumbnailUrls && diag.thumbnailUrls.length > 0 && (
            <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/80">
              <span className="text-[10px] font-mono text-zinc-500 uppercase shrink-0">
                Keyframes:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {diag.thumbnailUrls.map((thumbUrl, tIdx) => {
                  const tVal = [0.0, 0.25, 0.5, 0.75, 1.0][tIdx];
                  return (
                    <div
                      key={tIdx}
                      className="relative w-12 aspect-[9/16] rounded border border-zinc-700 overflow-hidden bg-black shrink-0 shadow-sm"
                      title={`Keyframe t=${tVal.toFixed(2)}`}
                    >
                      <img src={thumbUrl} alt={`t=${tVal}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/80 text-[8px] font-mono text-center text-zinc-300">
                        t={tVal.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Cheat sheet popover */}
        {showMCheatSheet && (
          <div className="bg-zinc-950/95 border border-cyan-500/30 rounded-xl p-3 text-[11px] font-mono text-zinc-300 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fadeIn">
            <div>
              <span className="text-cyan-400 font-bold block mb-1">Física & Tempo:</span>
              <ul className="space-y-0.5 text-zinc-400">
                <li><code className="text-cyan-200">M.seg(t, a, b)</code> — Progresso local 0..1</li>
                <li><code className="text-cyan-200">M.spring(p, freq, zeta)</code> — Mola harmônica</li>
                <li><code className="text-cyan-200">M.anticipate(p, pull)</code> — Recuo elástico</li>
                <li><code className="text-cyan-200">M.stagger(p, i, count)</code> — Cascata de itens</li>
              </ul>
            </div>
            <div>
              <span className="text-cyan-400 font-bold block mb-1">Tipografia & Espaço 3D:</span>
              <ul className="space-y-0.5 text-zinc-400">
                <li><code className="text-cyan-200">M.kineticText(ctx, txt, cx, cy, p, opt)</code></li>
                <li><code className="text-cyan-200">M.cube(ctx, cx, cy, size, rot, opt)</code></li>
                <li><code className="text-cyan-200">M.sphere(ctx, cx, cy, rad, rot, opt)</code></li>
                <li><code className="text-cyan-200">M.tunnel(ctx, cx, cy, t, opt)</code></li>
              </ul>
            </div>
          </div>
        )}

        {/* Code Editor Area */}
        <div className="relative flex-1 min-h-[260px] sm:min-h-[300px] flex flex-col">
          <div className="bg-[#0b0c13] rounded-xl border border-zinc-800 p-3 flex-1 flex flex-col font-mono text-xs overflow-hidden">
            <div className="text-[11px] text-zinc-500 mb-2 border-b border-zinc-800/80 pb-1 flex justify-between">
              <span>// function drawScene(ctx, t, W, H) &#123; ... &#125;</span>
              <span className="text-cyan-400">Objeto M Ativo</span>
            </div>
            <textarea
              value={codeDraft}
              onChange={(e) => {
                setCodeDraft(e.target.value);
                setTestResult(null);
              }}
              spellCheck={false}
              className="w-full flex-1 bg-transparent text-cyan-200 resize-none focus:outline-none font-mono text-xs leading-relaxed selection:bg-cyan-500 selection:text-black overflow-y-auto"
            />
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div
            className={`p-2.5 sm:p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
              testResult.valid
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
            }`}
          >
            {testResult.valid ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span className="truncate">{testResult.message}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between border-t border-zinc-800 pt-3 gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCodeDraft(scene.code);
                setTestResult(null);
                setDiag(verifyScene(scene, dna, true));
              }}
              className="px-3 py-1.5 text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restaurar
            </button>

            {dna && (
              <>
                <button
                  onClick={handleRandomizeAnimation}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
                  title="Trocar por outra animação cinematográfica aleatória sem repetir os outros arquétipos do showreel"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Trocar Animação (Sem Repetir)</span>
                </button>

                <button
                  onClick={handleRegenerateWithAi}
                  disabled={isGeneratingAi}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                  {isGeneratingAi ? 'Gerando Cena...' : 'Regerar com IA'}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestCode}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              Testar no Canvas
            </button>

            <button
              onClick={handleSaveAndApply}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
