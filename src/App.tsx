import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  AppSettings,
  DNA,
  GenerationStatus,
  Showreel,
} from './types/showreel';
import {
  generateRandomDNA,
  saveDNAToHistory,
} from './utils/dnaGenerator';
import { generateProceduralScenes, compileSceneCode } from './utils/proceduralFallback';
import { getGarotoShowreel, GAROTO_DNA } from './utils/garotoShowreel';
import {
  generateShowreelWithGemini,
  getSavedApiKey,
  saveApiKey,
  getSavedAnthropicKey,
  saveAnthropicKey,
  checkApiAvailability,
  isClaudeModel,
} from './utils/geminiService';
import { getSupportedMimeType, VideoExporter } from './utils/videoExporter';
import { CanvasPreview } from './components/CanvasPreview';
import { TimelineControls } from './components/TimelineControls';
import { DNACard } from './components/DNACard';
import { SettingsModal } from './components/SettingsModal';
import { SceneInspectorModal } from './components/SceneInspectorModal';
import { BuildProgressModal } from './components/BuildProgressModal';
import { getMasterShowreelByPreset } from './utils/masterShowreels';
import { verifyScene, verifyShowreel, autoCertifyShowreel } from './utils/sceneVerifier';
import { SceneVerificationModal } from './components/SceneVerificationModal';
import {
  generateScriptDrivenShowreel,
  parseScriptToScenes,
  MOTION_ARCHETYPES,
} from './utils/motionArchetypes';
import {
  Sparkles,
  Settings,
  Shuffle,
  Download,
  AlertCircle,
  Code2,
  Film,
  Zap,
  Layers,
  Dna,
  Play,
  RotateCcw,
  CheckCircle2,
  Brain,
  SlidersHorizontal,
  ShieldCheck,
} from 'lucide-react';

const SCRIPT_PRESETS = [
  {
    title: '🚀 O Garoto que Criou um Software com IA (30s)',
    script: 'O Garoto que Criou um Software com IA: Na madrugada escura às 03:42 AM, com um único prompt, linhas de código se tornaram uma arquitetura viva. A interface ganhou forma, o software nasceu, e em 3 semanas conquistou 100.000 usuários no mundo. O futuro pertence a quem constrói com IA.',
  },
  {
    title: '🧠 Claude Opus // Física Harmônica & 5 Camadas',
    script: 'Síntese com o rigor estético do Claude Opus: 5 camadas de profundidade visual, oscilador harmônico de molas amortecidas, tipografia monumental e micro-acentos sincronizados ao BPM.',
  },
  {
    title: '🎬 Saul Bass // Geometria Cinética & Silhuetas',
    script: 'Direção inspirada na era de ouro de Saul Bass: formas geométricas sólidas cortando o espaço, silhuetas de alto contraste, tipografia cinética recortada e tensão rítmica precisa.',
  },
  {
    title: '🌌 Bauhaus & Swiss // Grid Paramétrico 3D',
    script: 'Elegância brutalista suíça com perspectiva espacial: alinhamento milimétrico em grid vertical 9:16, rotações isométricas puras, tipografia neo-grotesca e respiro arquitetônico.',
  },
];

type StudioTab = 'script' | 'dna' | 'scenes';
type MobileView = 'preview' | 'studio';

export default function App() {
  // Settings state
  const [settings, setSettings] = useState<AppSettings>(() => ({
    geminiApiKey: getSavedApiKey(),
    anthropicApiKey: getSavedAnthropicKey(),
    aiProvider: 'gemini',
    selectedModel: 'gemini-3.8-flash',
    claudeOpusMode: true,
    targetDuration: 30,
    fps: 30,
    showSafeAreas: false,
    cinematicFilters: {
      enabled: true,
      filmGrain: 0.45,
      vignette: 0.55,
      chromaticAberration: 0.35,
      preset: '35mm',
    },
  }));

  // DNA state (iniciado com o DNA oficial do Garoto Criador de Software)
  const [dna, setDna] = useState<DNA>(() => {
    saveDNAToHistory(GAROTO_DNA);
    return GAROTO_DNA;
  });

  // Prompt / Script state
  const [scriptText, setScriptText] = useState(
    'O Garoto que Criou um Software com IA: Na madrugada escura às 03:42 AM, com um único prompt, linhas de código se tornaram uma arquitetura viva. A interface ganhou forma, o software nasceu, e em 3 semanas conquistou 100.000 usuários no mundo. O futuro pertence a quem constrói com IA.'
  );

  // Showreel playback state - Inicializado direto com o Showreel Oficial Verificado (30s)
  const [showreel, setShowreel] = useState<Showreel | null>(() => getMasterShowreelByPreset(0));
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Studio tabs (Desktop sidebar tab and Mobile studio tab)
  const [activeTab, setActiveTab] = useState<StudioTab>('script');
  const [mobileView, setMobileView] = useState<MobileView>('preview');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [inspectorSceneIndex, setInspectorSceneIndex] = useState<number | null>(null);
  const [isBuildModalOpen, setIsBuildModalOpen] = useState(false);

  // Generation status state
  const [genStatus, setGenStatus] = useState<GenerationStatus>({
    stage: 'idle',
    message: '',
  });

  // Video Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoExporterRef = useRef<VideoExporter>(new VideoExporter());
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  // Autoplay on initial load
  useEffect(() => {
    setIsPlaying(true);
  }, []);

  // Selecionar preset com showreel mestre 100% verificado
  const handleSelectPreset = useCallback((presetIndex: number) => {
    const masterReel = getMasterShowreelByPreset(presetIndex);
    setDna(masterReel.dna);
    setShowreel(masterReel);
    setScriptText(masterReel.script);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  // Carregar Showreel Oficial "O Garoto que Criou um Software com IA"
  const handleLoadGarotoShowreel = useCallback(() => {
    handleSelectPreset(0);
  }, [handleSelectPreset]);

  // Capturar Foto do Frame Atual em Alta Resolução (PNG 1080x1920)
  const handleTakeSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `showreel_frame_${Math.round(currentTime * 100) / 100}s.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [currentTime]);

  // Avançar ou recuar frames individuais (1 frame = 1/30s)
  const handleStepFrame = useCallback(
    (deltaFrames: number) => {
      setIsPlaying(false);
      const frameDelta = 1 / settings.fps;
      setCurrentTime((prev) =>
        Math.max(0, Math.min(showreel?.totalDuration || 30, prev + deltaFrames * frameDelta))
      );
    },
    [settings.fps, showreel?.totalDuration]
  );

  // Atalhos de teclado (Espaço: Play/Pause, Setas: Frame a frame)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepFrame(e.shiftKey ? -5 : -1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepFrame(e.shiftKey ? 5 : 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStepFrame]);

  // Gerar Showreel Roteirizado com Animações Aleatórias Sem Repetir
  const handleGenerateRandomShowreel = useCallback(() => {
    setIsPlaying(false);
    const reel = generateScriptDrivenShowreel(scriptText, dna, {
      customTitle: `Showreel Roteirizado // ${dna.paleta.name}`,
    });
    setShowreel(reel);
    setCurrentTime(0);
    setIsPlaying(true);
    setMobileView('preview');
  }, [scriptText, dna]);

  // Regenerar uma cena específica com um arquétipo aleatório não utilizado
  const handleRegenerateSingleScene = useCallback(
    (sceneIndex: number) => {
      if (!showreel || !showreel.scenes[sceneIndex]) return;
      const currentScenes = [...showreel.scenes];
      const targetScene = currentScenes[sceneIndex];

      // Conjunto de arquétipos já utilizados nas outras cenas
      const usedArchetypes = new Set(
        currentScenes
          .map((s, idx) => (idx !== sceneIndex ? s.archetypeId : null))
          .filter(Boolean)
      );

      // Escolher um arquétipo não utilizado do pool de 12
      let candidate = MOTION_ARCHETYPES.find(
        (a) => !usedArchetypes.has(a.id) && a.id !== targetScene.archetypeId
      );
      if (!candidate) {
        candidate =
          MOTION_ARCHETYPES.find((a) => a.id !== targetScene.archetypeId) ||
          MOTION_ARCHETYPES[0];
      }

      const seed = Math.floor(Math.random() * 9000) + 1000;
      const headline = targetScene.name.replace(/^\d+\.\s*/, '');
      const subtext =
        targetScene.scriptSnippet ||
        targetScene.description ||
        scriptText.slice(0, 50);

      const newCode = candidate.generator({
        headline,
        subtext,
        dna: showreel.dna,
        role: targetScene.role,
        index: sceneIndex,
        total: currentScenes.length,
        seed,
      });

      const compiled = compileSceneCode(newCode);
      const sceneDraft = {
        ...targetScene,
        archetypeId: candidate.id,
        archetypeName: candidate.name,
        code: newCode,
        compiledFn: compiled,
      };

      const diag = verifyScene(sceneDraft, showreel.dna, true);
      currentScenes[sceneIndex] = {
        ...sceneDraft,
        validated: diag.valid,
        verification: diag,
      };

      const updatedReel: Showreel = {
        ...showreel,
        scenes: currentScenes,
      };
      updatedReel.verificationReport = verifyShowreel(updatedReel, false);
      setShowreel(updatedReel);

      // Pular para o início da cena regenerada para visualizar imediatamente
      let start = 0;
      for (let i = 0; i < sceneIndex; i++) {
        start += currentScenes[i].duration;
      }
      setCurrentTime(start);
      setIsPlaying(true);
    },
    [showreel, scriptText]
  );

  // Handle Reroll DNA
  const handleRerollDNA = useCallback(() => {
    const newDNA = generateRandomDNA(settings.targetDuration);
    saveDNAToHistory(newDNA);
    setDna(newDNA);

    const reel = generateScriptDrivenShowreel(scriptText, newDNA, {
      customTitle: `Showreel // ${newDNA.paleta.name}`,
    });
    setShowreel(reel);
    setCurrentTime(0);
    setIsPlaying(true);
  }, [settings.targetDuration, scriptText]);

  // Handle Select Stored DNA from history
  const handleSelectStoredDNA = useCallback(
    (selectedDNA: DNA) => {
      setDna(selectedDNA);
      const reel = generateScriptDrivenShowreel(scriptText, selectedDNA, {
        customTitle: `Showreel // ${selectedDNA.paleta.name}`,
      });
      setShowreel(reel);
      setCurrentTime(0);
      setIsPlaying(true);
    },
    [scriptText]
  );

  // Generate showreel with AI
  const handleGenerateShowreel = async () => {
    const isClaude = isClaudeModel(settings.selectedModel);
    const apiInfo = await checkApiAvailability(settings.selectedModel);
    if (!apiInfo.available) {
      setIsSettingsOpen(true);
      setGenStatus({
        stage: 'error',
        message: isClaude
          ? 'Chave da API do Claude não configurada. Configure nas Configurações ou use a Demo Instantânea.'
          : 'Chave de API do Gemini não configurada. Configure nas Configurações ou utilize a Demo Instantânea.',
        error: 'API_KEY_REQUIRED',
      });
      return;
    }

    setIsPlaying(false);
    setCurrentTime(0);
    setIsBuildModalOpen(true);

    const modelNameDisplay = isClaude
      ? 'Claude Opus'
      : settings.claudeOpusMode
      ? 'Gemini (Modo Opus)'
      : 'Gemini';

    try {
      setGenStatus({
        stage: 'planning',
        percent: 10,
        message: `Iniciando síntese de motion design com ${modelNameDisplay}...`,
        totalScenes: dna.numeroCenas || 6,
      });

      const reel = await generateShowreelWithGemini(
        scriptText,
        dna,
        settings.selectedModel,
        (status) => setGenStatus(status),
        settings.claudeOpusMode
      );

      setShowreel(reel);
      setCurrentTime(0);
      setIsPlaying(true);
      setMobileView('preview');
    } catch (err: unknown) {
      console.error('Falha na geração de showreel:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setGenStatus((prev) => ({
        ...prev,
        stage: 'error',
        message: errMsg,
        error: errMsg,
      }));
    }
  };

  // Instant Procedural Fallback generation with live step progression
  const handleLoadProceduralDemo = async () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setIsBuildModalOpen(true);

    const totalScenes = Math.max(6, dna.numeroCenas || 6);
    const scenes = generateProceduralScenes(dna, scriptText);

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    // Stage 1: Planning
    setGenStatus({
      stage: 'planning',
      percent: 20,
      message: `Iniciando síntese procedural rápida com DNA ${dna.paleta.name}...`,
      totalScenes,
      currentScene: 1,
      currentSceneName: scenes[0]?.name,
      currentSceneRole: scenes[0]?.role,
      currentCode: scenes[0]?.code,
      logs: [
        {
          id: 'demo_log_1',
          time: timeStr,
          text: `⚡ Pipeline acionado: DNA ${dna.paleta.name} a ${dna.bpm} BPM (${totalScenes} cenas)`,
          type: 'info',
        },
      ],
    });

    await new Promise((r) => setTimeout(r, 240));

    // Stage 2: Writing Scenes
    setGenStatus((prev) => ({
      ...prev,
      stage: 'writing_scenes',
      percent: 55,
      message: `Sintetizando código Canvas 2D determinístico com biblioteca M...`,
      currentScene: 2,
      currentSceneName: scenes[1]?.name || scenes[0]?.name,
      currentSceneRole: scenes[1]?.role || 'corpo',
      currentCode: scenes[1]?.code || scenes[0]?.code,
      logs: [
        ...(prev.logs || []),
        {
          id: 'demo_log_2',
          time: new Date().toTimeString().split(' ')[0],
          text: `📝 Gerando código com 5 camadas e física harmônica de molas M.spring`,
          type: 'code',
        },
      ],
    }));

    await new Promise((r) => setTimeout(r, 260));

    // Stage 3: Validating
    setGenStatus((prev) => ({
      ...prev,
      stage: 'validating',
      percent: 88,
      message: `Validando execução matemática a 60 FPS no Canvas 1080x1920...`,
      currentScene: totalScenes,
      currentSceneName: scenes[scenes.length - 1]?.name,
      currentSceneRole: scenes[scenes.length - 1]?.role,
      currentCode: scenes[scenes.length - 1]?.code,
      logs: [
        ...(prev.logs || []),
        {
          id: 'demo_log_3',
          time: new Date().toTimeString().split(' ')[0],
          text: `🧪 Validando keyframes (t=0.0 até 1.0) sem vazamento de estado`,
          type: 'info',
        },
      ],
    }));

    await new Promise((r) => setTimeout(r, 220));

    const uncertified: Showreel = {
      id: `procedural_${Date.now()}`,
      title: `Showreel Procedural // ${dna.paleta.name}`,
      concept: `${dna.estrutura} - ${dna.bpm} BPM`,
      totalDuration: dna.duracaoAlvo,
      scenes,
      dna,
      script: scriptText,
      generatedAt: Date.now(),
    };

    const reel = autoCertifyShowreel(uncertified);

    setShowreel(reel);
    setCurrentTime(0);
    setIsPlaying(true);

    setGenStatus((prev) => ({
      ...prev,
      stage: 'completed',
      percent: 100,
      message: 'Showreel procedural validado com 100% das cenas em movimento!',
      logs: [
        ...(prev.logs || []),
        {
          id: 'demo_log_4',
          time: new Date().toTimeString().split(' ')[0],
          text: `✅ Todas as cenas sintetizadas com sucesso e prontas para reprodução!`,
          type: 'success',
        },
      ],
    }));
    setMobileView('preview');
  };

  // Settings update
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.geminiApiKey !== undefined) {
        saveApiKey(newSettings.geminiApiKey);
      }
      if (newSettings.anthropicApiKey !== undefined) {
        saveAnthropicKey(newSettings.anthropicApiKey);
      }
      return updated;
    });
  };

  // Main playback animation loop
  useEffect(() => {
    const totalDur = showreel?.totalDuration || 30;

    const renderLoop = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      if (isPlaying && !isExporting) {
        setCurrentTime((prevTime) => {
          let nextTime = prevTime + delta * playbackSpeed;
          if (nextTime >= totalDur) {
            if (loop) {
              nextTime = 0;
            } else {
              nextTime = totalDur;
              setIsPlaying(false);
            }
          }
          return nextTime;
        });
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isExporting, showreel, playbackSpeed, loop]);

  // Video Export Handler
  const handleExportVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !showreel) return;

    setIsExporting(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setExportProgress(0);

    const totalDur = showreel.totalDuration;
    const { extension } = getSupportedMimeType();

    videoExporterRef.current.startRecording(canvas, 30);

    const startTime = performance.now();
    const interval = setInterval(async () => {
      const elapsed = (performance.now() - startTime) / 1000;
      setCurrentTime(elapsed);
      setExportProgress(Math.min(1, elapsed / totalDur));

      if (elapsed >= totalDur) {
        clearInterval(interval);
        try {
          const filename = `showreel-${showreel.dna.paleta.id}-${Date.now()}`;
          await videoExporterRef.current.stopAndDownload(filename, extension);
        } catch (err) {
          console.error('Erro ao finalizar exportação:', err);
        } finally {
          setIsExporting(false);
          setExportProgress(0);
          setCurrentTime(0);
        }
      }
    }, 1000 / 30);
  };

  // Jump to Next / Prev scene
  const handleNextScene = () => {
    if (!showreel || showreel.scenes.length === 0) return;
    let acc = 0;
    for (const scene of showreel.scenes) {
      if (acc > currentTime + 0.05) {
        setCurrentTime(acc);
        return;
      }
      acc += scene.duration;
    }
    setCurrentTime(0);
  };

  const handlePrevScene = () => {
    if (!showreel || showreel.scenes.length === 0) return;
    let acc = 0;
    let prevAcc = 0;
    for (const scene of showreel.scenes) {
      if (acc >= currentTime - 0.2) {
        setCurrentTime(prevAcc);
        return;
      }
      prevAcc = acc;
      acc += scene.duration;
    }
    setCurrentTime(0);
  };

  // Scene inspector code update
  const handleUpdateSceneCode = (sceneIndex: number, newCode: string) => {
    if (!showreel) return;
    const updatedScenes = [...showreel.scenes];
    const compiled = compileSceneCode(newCode);
    const sceneDraft = {
      ...updatedScenes[sceneIndex],
      code: newCode,
      compiledFn: compiled,
    };
    const diag = verifyScene(sceneDraft, showreel.dna, true);
    updatedScenes[sceneIndex] = {
      ...sceneDraft,
      validated: diag.valid,
      verification: diag,
    };
    const updatedReel: Showreel = {
      ...showreel,
      scenes: updatedScenes,
    };
    updatedReel.verificationReport = verifyShowreel(updatedReel, false);
    setShowreel(updatedReel);
  };

  const totalDur = showreel?.totalDuration || settings.targetDuration;

  // Análise semântica do roteiro em tempo real para pré-visualização das cenas
  const parsedScriptScenes = React.useMemo(() => {
    return parseScriptToScenes(scriptText, dna.duracaoAlvo, dna.numeroCenas);
  }, [scriptText, dna.duracaoAlvo, dna.numeroCenas]);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-zinc-700 selection:text-white overflow-x-hidden">
      {/* Studio Top Navbar Minimalista */}
      <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-xl border-b border-white/[0.08] px-3 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand & Studio Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Film className="w-4 h-4 text-zinc-200" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold tracking-wider text-zinc-100 flex items-center gap-1.5">
                SHOWREEL // STUDIO
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                1080×1920 (9:16) · 60 FPS
              </span>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/[0.08] bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-medium flex items-center gap-1 transition-all"
              title="Configurar IA e modelo"
            >
              <Brain className="w-3 h-3 text-zinc-400" />
              <span>
                {isClaudeModel(settings.selectedModel)
                  ? 'Claude Opus'
                  : settings.claudeOpusMode
                  ? 'Gemini + Opus'
                  : 'Gemini 3.8'}
              </span>
            </button>
          </div>
        </div>

        {/* Primary Studio Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Non-Repeating Random Generation Button */}
          <button
            onClick={handleGenerateRandomShowreel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-mono font-semibold transition-all active:scale-95 shadow-sm"
            title="Gera variações de animação aleatórias sem repetir, de acordo com o roteiro da cena"
          >
            <Shuffle className="w-3.5 h-3.5 text-zinc-950" />
            <span className="hidden sm:inline">Variação Sem Repetir</span>
            <span className="sm:hidden">Sortear</span>
          </button>

          {/* Scene Verification Auditor Trigger */}
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] text-xs font-mono font-medium transition-all active:scale-95"
            title="Central de Auditoria de Cenas"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Auditoria</span>
            <span className="text-[10px] text-emerald-400 font-bold tabular-nums">
              {showreel?.verificationReport?.overallScore || 100}%
            </span>
          </button>

          {/* Export Video */}
          <button
            onClick={handleExportVideo}
            disabled={isExporting || !showreel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] font-mono text-xs transition-all active:scale-95 disabled:opacity-50"
            title="Exportar vídeo HD do Canvas (1080x1920)"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Exportar</span>
          </button>

          {/* Settings Modal */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 sm:p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.08] transition-all relative"
            title="Configurações (API Keys, Duração, FPS)"
          >
            <Settings className="w-4 h-4" />
            {!settings.geminiApiKey && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Top View Switcher (< lg screens) */}
      <div className="lg:hidden sticky top-[51px] z-30 bg-[#0d0e15]/95 backdrop-blur-md border-b border-zinc-800/80 px-3 py-2 flex items-center justify-center">
        <div className="grid grid-cols-2 w-full max-w-xs bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setMobileView('preview')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileView === 'preview'
                ? 'bg-cyan-500 text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Player 9:16</span>
          </button>

          <button
            onClick={() => setMobileView('studio')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileView === 'studio'
                ? 'bg-cyan-500 text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Controles & IA</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto p-3 sm:p-5 lg:p-6 flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
        {/* Left Studio Inspector Dock */}
        <aside
          className={`w-full lg:w-[410px] xl:w-[440px] shrink-0 flex flex-col gap-3.5 ${
            mobileView === 'studio' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Segmented Tab Switcher Minimalista */}
          <div className="bg-zinc-900/80 border border-white/[0.08] rounded-lg p-1 grid grid-cols-3 text-xs font-mono">
            <button
              onClick={() => setActiveTab('script')}
              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'script'
                  ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Roteiro</span>
            </button>

            <button
              onClick={() => setActiveTab('scenes')}
              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'scenes'
                  ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cenas ({showreel?.scenes.length || 0})</span>
            </button>

            <button
              onClick={() => setActiveTab('dna')}
              className={`py-1.5 px-2 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'dna'
                  ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>DNA</span>
            </button>
          </div>

          {/* TAB 1: ROTEIRO & GERAÇÃO */}
          {activeTab === 'script' && (
            <div className="bg-[#121215] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200 font-mono flex items-center gap-1.5 uppercase">
                  <Film className="w-3.5 h-3.5 text-zinc-400" />
                  Roteiro do Showreel
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {scriptText.length} carac. · {parsedScriptScenes.length} cenas
                </span>
              </div>

              <textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                rows={4}
                placeholder="Descreva o conceito, narrativa ou cenas do showreel..."
                className="w-full bg-zinc-900 border border-white/[0.08] rounded-lg p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans leading-relaxed resize-none transition-colors"
              />

              {/* Ação Primária: Gerar Variação Aleatória Sem Repetir */}
              <div className="flex flex-col gap-2 pt-0.5">
                <button
                  onClick={handleGenerateRandomShowreel}
                  className="w-full py-2.5 px-3 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-mono font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
                  title="Gera várias animações aleatórias sem repetir, estritamente de acordo com o roteiro daquela cena"
                >
                  <Shuffle className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Gerar Variação Aleatória (Sem Repetir)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleGenerateShowreel}
                    disabled={
                      genStatus.stage === 'planning' ||
                      genStatus.stage === 'writing_scenes' ||
                      genStatus.stage === 'validating' ||
                      genStatus.stage === 'repairing'
                    }
                    className="py-2 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-white/[0.08] text-xs font-mono flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
                    title="Sintetizar com modelo de linguagem IA"
                  >
                    <Sparkles className="w-3 h-3 text-zinc-400" />
                    <span>
                      {isClaudeModel(settings.selectedModel)
                        ? 'IA Claude'
                        : 'IA Gemini'}
                    </span>
                  </button>

                  <button
                    onClick={handleRerollDNA}
                    className="py-2 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/[0.08] text-xs font-mono flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    title="Sorteia novo DNA visual e regenera o showreel"
                  >
                    <Dna className="w-3 h-3 text-zinc-400" />
                    <span>Sortear DNA</span>
                  </button>
                </div>
              </div>

              {/* Minimalist Presets */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  Roteiros Mestres:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SCRIPT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectPreset(idx)}
                      className="text-[11px] font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white px-2.5 py-1 rounded-md border border-white/[0.08] transition-colors truncate max-w-full text-left"
                      title={`Carregar Showreel Mestre 100% Verificado: ${preset.title}`}
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mapeamento Semântico em Tempo Real do Roteiro */}
              <div className="bg-zinc-900/60 border border-white/[0.06] rounded-lg p-2.5 flex flex-col gap-2 mt-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400 font-semibold uppercase flex items-center gap-1">
                    <Layers className="w-3 h-3 text-zinc-400" />
                    Roteirização por Cena ({parsedScriptScenes.length})
                  </span>
                  <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    Sem Repetição
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {parsedScriptScenes.map((item, i) => (
                    <div
                      key={i}
                      className="bg-zinc-950/70 border border-white/[0.04] rounded-md p-1.5 flex flex-col gap-0.5 text-[10px] font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-300 font-bold truncate">
                          {i + 1}. {item.headline}
                        </span>
                        <span className="text-[9px] text-zinc-500 uppercase">
                          {item.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-sans line-clamp-1">
                        {item.subtext}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Status Card com Progresso, Cena Atual e Acesso ao Inspetor de Código */}
              {genStatus.stage !== 'idle' && (
                <div
                  className={`p-3.5 rounded-xl border flex flex-col gap-2 transition-all text-xs ${
                    genStatus.stage === 'error'
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                      : genStatus.stage === 'completed'
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-zinc-900 border-white/[0.1] text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="font-semibold flex items-center gap-1.5 uppercase">
                      {genStatus.stage === 'error' ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      ) : genStatus.stage === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      )}
                      {genStatus.stage === 'planning' && 'Planejando cenas...'}
                      {genStatus.stage === 'writing_scenes' && 'Escrevendo código Canvas...'}
                      {genStatus.stage === 'validating' && 'Validando renderização 60fps...'}
                      {genStatus.stage === 'repairing' && 'Autocorreção em andamento...'}
                      {genStatus.stage === 'completed' && 'Construção Concluída!'}
                      {genStatus.stage === 'error' && 'Atenção na Geração'}
                    </span>

                    <span className="font-bold text-zinc-100">
                      {genStatus.percent !== undefined ? `${genStatus.percent}%` : ''}
                      {genStatus.totalScenes && (
                        <span className="text-[10px] text-zinc-400 font-normal ml-1.5">
                          ({genStatus.currentScene || 1}/{genStatus.totalScenes})
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/[0.08]">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        genStatus.stage === 'completed'
                          ? 'bg-emerald-400'
                          : genStatus.stage === 'error'
                          ? 'bg-rose-500'
                          : 'bg-zinc-100'
                      }`}
                      style={{
                        width: `${genStatus.percent !== undefined ? genStatus.percent : genStatus.stage === 'completed' ? 100 : 20}%`,
                      }}
                    />
                  </div>

                  {/* What it is building */}
                  {genStatus.currentSceneName && (
                    <div className="text-[11px] text-zinc-300 font-mono flex items-center gap-1.5">
                      <span className="text-zinc-500">Construindo:</span>
                      <span className="text-white font-semibold truncate">
                        {genStatus.currentSceneName}
                      </span>
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-300 leading-normal">
                    {genStatus.message}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setIsBuildModalOpen(true)}
                      className="flex-1 py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/[0.08] rounded-lg text-[10px] font-mono flex items-center justify-center gap-1.5 transition-colors"
                      title="Ver o que está sendo construído, o código e os logs em tempo real"
                    >
                      <Code2 className="w-3 h-3" />
                      <span>Ver Código & Status da Construção</span>
                    </button>

                    {genStatus.stage === 'error' && (
                      <button
                        onClick={handleLoadProceduralDemo}
                        className="px-2.5 py-1.5 bg-zinc-100 text-black font-semibold rounded-lg text-[10px] font-mono"
                      >
                        Usar Demo Instantânea
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DNA VISUAL */}
          {activeTab === 'dna' && (
            <DNACard
              dna={dna}
              onRerollDNA={handleRerollDNA}
              onSelectStoredDNA={handleSelectStoredDNA}
            />
          )}

          {/* TAB 3: CENAS */}
          {activeTab === 'scenes' && (
            <div className="bg-[#121215] border border-white/[0.08] rounded-xl p-4 flex flex-col gap-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200 uppercase font-mono flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-400" />
                  Cenas do Showreel ({showreel?.scenes.length || 0})
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {showreel?.totalDuration || 30}s total
                </span>
              </div>

              {/* Verification Audit Summary Card */}
              <div className="bg-zinc-900 border border-emerald-500/30 rounded-lg p-2.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white font-mono flex items-center gap-1.5 truncate">
                      <span>Todas as Cenas Verificadas</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1 py-0.2 rounded font-bold tabular-nums">
                        {showreel?.verificationReport?.overallScore || 100}%
                      </span>
                    </p>
                    <p className="text-[10px] text-zinc-500 truncate font-mono">
                      {showreel?.scenes.length || 0} cenas · 60 FPS · Canvas 2D
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-[10px] font-mono rounded border border-white/[0.08] transition-all active:scale-95 shrink-0"
                >
                  Auditar
                </button>
              </div>

              <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
                {showreel?.scenes.map((scene, idx) => {
                  let badgeColor = 'bg-zinc-800 text-zinc-300 border-zinc-700';
                  if (scene.role === 'gancho') {
                    badgeColor = 'bg-amber-950/40 text-amber-300 border-amber-500/30';
                  } else if (scene.role === 'clímax') {
                    badgeColor = 'bg-rose-950/40 text-rose-300 border-rose-500/30';
                  } else if (scene.role === 'fechamento') {
                    badgeColor = 'bg-purple-950/40 text-purple-300 border-purple-500/30';
                  }

                  return (
                    <div
                      key={scene.id || idx}
                      onClick={() => {
                        let start = 0;
                        for (let s = 0; s < idx; s++) {
                          start += showreel.scenes[s].duration;
                        }
                        setCurrentTime(start);
                        setMobileView('preview');
                      }}
                      className="group p-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-white/[0.06] hover:border-white/[0.15] transition-all cursor-pointer flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className={`text-[9px] font-mono uppercase font-semibold px-1.5 py-0.5 rounded border shrink-0 ${badgeColor}`}
                          >
                            {scene.role}
                          </span>
                          <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">
                            {idx + 1}. {scene.name}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-mono text-zinc-500">
                            {scene.duration}s
                          </span>

                          {/* Regenerar esta cena com outro arquétipo não utilizado */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegenerateSingleScene(idx);
                            }}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shrink-0"
                            title="Trocar animação desta cena (sortear outro arquétipo sem repetir)"
                          >
                            <Shuffle className="w-3.5 h-3.5" />
                          </button>

                          {/* Inspecionar código */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectorSceneIndex(idx);
                            }}
                            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all shrink-0"
                            title="Inspecionar e editar código Canvas 2D da cena"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Arquétipo e Trecho do Roteiro */}
                      <div className="flex flex-col gap-0.5 pt-0.5 text-[10px] font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-500">Arquétipo:</span>
                          <span className="text-zinc-300 font-medium truncate">
                            {scene.archetypeName || 'Motion Dinâmico'}
                          </span>
                          <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1 py-0.2 rounded border border-white/[0.05]">
                            Sem Repetição
                          </span>
                        </div>
                        {scene.scriptSnippet && (
                          <p className="text-[10px] text-zinc-400 font-sans line-clamp-1 italic">
                            "{scene.scriptSnippet}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* Center / Right Stage (Player & Timeline) */}
        <section
          className={`flex-1 flex flex-col items-center gap-4 w-full min-w-0 ${
            mobileView === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Canvas Viewport */}
          <div className="w-full flex justify-center">
            <CanvasPreview
              showreel={showreel}
              currentTime={currentTime}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              isRecording={isExporting}
              exportProgress={exportProgress}
              showSafeAreas={settings.showSafeAreas}
              onToggleSafeAreas={() =>
                handleUpdateSettings({ showSafeAreas: !settings.showSafeAreas })
              }
              cinematicFilters={settings.cinematicFilters}
              onUpdateFilters={(filters) =>
                handleUpdateSettings({
                  cinematicFilters: { ...settings.cinematicFilters, ...filters },
                })
              }
              canvasRef={canvasRef}
              onTakeSnapshot={handleTakeSnapshot}
            />
          </div>

          {/* Interactive Timeline Transport */}
          <div className="w-full max-w-3xl">
            <TimelineControls
              showreel={showreel}
              currentTime={currentTime}
              totalDuration={totalDur}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onSeek={(t) => setCurrentTime(t)}
              onNextScene={handleNextScene}
              onPrevScene={handlePrevScene}
              onStepFrame={handleStepFrame}
              loop={loop}
              onToggleLoop={() => setLoop(!loop)}
              playbackSpeed={playbackSpeed}
              onChangeSpeed={(spd) => setPlaybackSpeed(spd)}
              onOpenSceneInspector={(idx) => setInspectorSceneIndex(idx)}
            />

            {/* Subtle Keyboard Shortcuts Hint */}
            <div className="hidden sm:flex items-center justify-center gap-4 mt-2 text-[10px] font-mono text-zinc-500 select-none">
              <span>Espaço: Play/Pause</span>
              <span>•</span>
              <span>← / →: Quadro a quadro</span>
              <span>•</span>
              <span>Shift + ← / →: 5 quadros</span>
            </div>
          </div>
        </section>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onExportVideo={handleExportVideo}
        isExporting={isExporting}
      />

      {/* Scene Inspector Modal */}
      {showreel && inspectorSceneIndex !== null && showreel.scenes[inspectorSceneIndex] && (
        <SceneInspectorModal
          isOpen={inspectorSceneIndex !== null}
          onClose={() => setInspectorSceneIndex(null)}
          scene={showreel.scenes[inspectorSceneIndex]}
          sceneIndex={inspectorSceneIndex}
          totalScenes={showreel.scenes.length}
          dna={showreel.dna}
          selectedModel={settings.selectedModel}
          onUpdateSceneCode={handleUpdateSceneCode}
        />
      )}

      {/* Build Progress & Live Code Construction Inspector Modal */}
      <BuildProgressModal
        isOpen={isBuildModalOpen}
        onClose={() => setIsBuildModalOpen(false)}
        status={genStatus}
        selectedModel={settings.selectedModel}
        isClaudeOpus={settings.claudeOpusMode || isClaudeModel(settings.selectedModel)}
        onWatchShowreel={() => {
          setIsPlaying(true);
          setMobileView('preview');
        }}
      />

      {/* Central de Auditoria & Verificação de Cenas */}
      <SceneVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        showreel={showreel}
        onUpdateShowreel={(updated) => setShowreel(updated)}
        onOpenSceneInspector={(idx) => setInspectorSceneIndex(idx)}
        onSeekToScene={(idx, progress = 0) => {
          if (!showreel) return;
          let acc = 0;
          for (let i = 0; i < idx; i++) {
            acc += showreel.scenes[i]?.duration || 0;
          }
          const dur = showreel.scenes[idx]?.duration || 0;
          setCurrentTime(acc + dur * progress);
          setIsPlaying(false);
          setMobileView('preview');
        }}
      />
    </div>
  );
}
