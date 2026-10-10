import React, { useState } from 'react';
import { AppSettings } from '../types/showreel';
import {
  Settings,
  Key,
  Cpu,
  Clock,
  Download,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Clapperboard,
  Sparkles,
  Brain,
  Layers,
  Wand2,
} from 'lucide-react';
import { getSupportedMimeType } from '../utils/videoExporter';
import { CINEMATIC_PRESETS } from '../utils/cinematicFilters';
import { isClaudeModel } from '../utils/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onExportVideo: () => void;
  isExporting: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onExportVideo,
  isExporting,
}) => {
  // Gemini key state
  const [geminiKeyInput, setGeminiKeyInput] = useState(settings.geminiApiKey || '');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [savedGeminiSuccess, setSavedGeminiSuccess] = useState(false);
  const [geminiTestStatus, setGeminiTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [geminiTestMessage, setGeminiTestMessage] = useState('');

  // Anthropic / Claude key state
  const [anthropicKeyInput, setAnthropicKeyInput] = useState(settings.anthropicApiKey || '');
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  const [savedAnthropicSuccess, setSavedAnthropicSuccess] = useState(false);
  const [anthropicTestStatus, setAnthropicTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [anthropicTestMessage, setAnthropicTestMessage] = useState('');

  if (!isOpen) return null;

  const handleSaveGeminiKey = () => {
    onUpdateSettings({ geminiApiKey: geminiKeyInput.trim() });
    setSavedGeminiSuccess(true);
    setTimeout(() => setSavedGeminiSuccess(false), 2000);
  };

  const handleSaveAnthropicKey = () => {
    onUpdateSettings({ anthropicApiKey: anthropicKeyInput.trim() });
    setSavedAnthropicSuccess(true);
    setTimeout(() => setSavedAnthropicSuccess(false), 2000);
  };

  const testGeminiApiKey = async () => {
    const keyToTest = geminiKeyInput.trim();
    if (!keyToTest) {
      setGeminiTestStatus('error');
      setGeminiTestMessage('Por favor, cole sua chave do Gemini primeiro.');
      return;
    }

    setGeminiTestStatus('testing');
    setGeminiTestMessage('Testando conexão com a API do Gemini...');

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-key': keyToTest,
        },
        body: JSON.stringify({
          model: 'gemini-3.8-flash',
          systemInstruction: 'Respond only with OK',
          userPrompt: 'Ping test',
        }),
      });

      if (res.ok) {
        setGeminiTestStatus('success');
        setGeminiTestMessage('Conexão realizada com sucesso! Chave do Gemini ativa.');
        onUpdateSettings({ geminiApiKey: keyToTest });
        return;
      }

      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || `HTTP ${res.status}`);
    } catch (err: unknown) {
      setGeminiTestStatus('error');
      const errMessage = err instanceof Error ? err.message : String(err);
      setGeminiTestMessage(`Erro ao validar chave: ${errMessage}`);
    }
  };

  const testAnthropicApiKey = async () => {
    const keyToTest = anthropicKeyInput.trim();
    if (!keyToTest) {
      setAnthropicTestStatus('error');
      setAnthropicTestMessage('Por favor, cole sua chave da Anthropic primeiro.');
      return;
    }

    setAnthropicTestStatus('testing');
    setAnthropicTestMessage('Testando conexão com Claude Opus...');

    try {
      const res = await fetch('/api/claude/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-anthropic-key': keyToTest,
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          systemInstruction: 'Responda apenas com OK',
          userPrompt: 'Ping test',
        }),
      });

      if (res.ok) {
        setAnthropicTestStatus('success');
        setAnthropicTestMessage('Conexão realizada com sucesso! Claude Opus autenticado.');
        onUpdateSettings({ anthropicApiKey: keyToTest });
        return;
      }

      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || `HTTP ${res.status}`);
    } catch (err: unknown) {
      setAnthropicTestStatus('error');
      const errMessage = err instanceof Error ? err.message : String(err);
      setAnthropicTestMessage(`Erro ao validar chave Anthropic: ${errMessage}`);
    }
  };

  const { extension } = getSupportedMimeType();
  const isSelectedModelClaude = isClaudeModel(settings.selectedModel);

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-[#12141e] border border-zinc-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl shadow-cyan-950/40 flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                Configurações & Inteligência de Motion
              </h2>
              <p className="text-xs text-zinc-400">
                Motores de IA (Claude Opus & Gemini), arquitetura de código, filtros e exportação
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-mono transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 1. SELEÇÃO DO MODELO / MOTOR DE IA */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 font-mono uppercase">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Modelo & Motor de Síntese
            </label>
            <span className="text-[10px] font-mono text-zinc-400">
              {isSelectedModelClaude ? 'Anthropic Engine' : 'Google AI Studio Engine'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                id: 'claude-3-opus-20240229',
                provider: 'Anthropic',
                name: 'Claude 3 Opus',
                badge: 'Mestre em Código Canvas 2D',
                desc: 'Máxima precisão espacial, física harmônica de molas e composições complexas.',
                badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                activeBg: 'bg-amber-950/40 border-amber-500 shadow-amber-900/30 shadow-md',
              },
              {
                id: 'claude-3-7-sonnet-20250219',
                provider: 'Anthropic',
                name: 'Claude 3.7 Sonnet',
                badge: 'Raciocínio Híbrido',
                desc: 'Síntese veloz com rigor matemático e alinhamento tipográfico de precisão.',
                badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
                activeBg: 'bg-orange-950/40 border-orange-500 shadow-orange-900/30 shadow-md',
              },
              {
                id: 'gemini-3.8-flash',
                provider: 'Google AI',
                name: 'Gemini 3.8 Flash',
                badge: 'Ultra-Rápido (Recomendado)',
                desc: 'Geração instantânea e fluida com suporte total ao DNA sorteado.',
                badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
                activeBg: 'bg-cyan-950/40 border-cyan-500 shadow-cyan-900/30 shadow-md',
              },
              {
                id: 'gemini-3.1-pro-preview',
                provider: 'Google AI',
                name: 'Gemini 3.1 Pro',
                badge: 'Direção Cinematográfica',
                desc: 'Raciocínio estético apurado e alta densidade de detalhes visuais.',
                badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                activeBg: 'bg-purple-950/40 border-purple-500 shadow-purple-900/30 shadow-md',
              },
            ].map((m) => {
              const isSelected = settings.selectedModel === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onUpdateSettings({ selectedModel: m.id })}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? m.activeBg
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-zinc-100 font-mono flex items-center gap-1.5">
                      {m.name}
                      <span className={`text-[9px] px-1.5 py-0.5 rounded border ${m.badgeColor}`}>
                        {m.badge}
                      </span>
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                  </div>
                  <span className="text-[10px] text-zinc-400 leading-relaxed mt-1">
                    {m.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. MODO INTELIGÊNCIA CLAUDE OPUS (TOGGLE) */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-zinc-900 to-amber-950/20 border border-amber-500/30 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-zinc-100 uppercase font-mono">
                Inteligência do Claude Opus em Código (5 Camadas & Física)
              </span>
            </div>
            <button
              onClick={() =>
                onUpdateSettings({
                  claudeOpusMode: !settings.claudeOpusMode,
                })
              }
              className={`text-[10px] font-mono px-3 py-1 rounded-full font-bold border transition-colors ${
                settings.claudeOpusMode
                  ? 'bg-amber-500 text-black border-amber-400 font-black'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              }`}
            >
              {settings.claudeOpusMode ? 'ATIVADO' : 'DESATIVADO'}
            </button>
          </div>

          <p className="text-[11px] text-zinc-300 leading-relaxed">
            Injeta a constituição de código do <strong>Claude Opus</strong> em todas as gerações:
            orquestração de 5 camadas visuais (Backdrop, Malha Espacial, Tipografia Monumental, Acentos Vetoriais, Framing 9:16),
            física de molas harmônicas amortecidas (sem interpolação linear) e cálculo de bounding-box tipográfico com <code className="text-amber-300 font-mono">ctx.measureText</code>.
          </p>
        </div>

        {/* 3. API KEYS SECTION (ANTHROPIC & GEMINI) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Claude / Anthropic Key */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 font-mono">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                API Key Claude (Anthropic)
              </label>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" /> localStorage
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type={showAnthropicKey ? 'text' : 'password'}
                value={anthropicKeyInput}
                onChange={(e) => setAnthropicKeyInput(e.target.value)}
                placeholder="sk-ant-api03-..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono pr-16"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                  className="p-1 text-zinc-400 hover:text-zinc-200"
                  title={showAnthropicKey ? 'Ocultar' : 'Mostrar'}
                >
                  {showAnthropicKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleSaveAnthropicKey}
                  className="px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] rounded transition-colors"
                >
                  {savedAnthropicSuccess ? 'Salvo!' : 'Salvar'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono">
              <button
                onClick={testAnthropicApiKey}
                disabled={anthropicTestStatus === 'testing'}
                className="text-amber-400 hover:underline flex items-center gap-1"
              >
                {anthropicTestStatus === 'testing' ? 'Testando...' : '⚡ Testar Claude Opus'}
              </button>
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-zinc-200 flex items-center gap-0.5"
              >
                Obter na Anthropic <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {anthropicTestMessage && (
              <div
                className={`p-2 rounded-lg text-[10px] font-mono flex items-center gap-1.5 ${
                  anthropicTestStatus === 'success'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                }`}
              >
                {anthropicTestStatus === 'success' ? (
                  <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                )}
                <span className="truncate">{anthropicTestMessage}</span>
              </div>
            )}
          </div>

          {/* Gemini Key */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 font-mono">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                API Key Gemini (Google)
              </label>
              <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" /> localStorage
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                type={showGeminiKey ? 'text' : 'password'}
                value={geminiKeyInput}
                onChange={(e) => setGeminiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono pr-16"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="p-1 text-zinc-400 hover:text-zinc-200"
                  title={showGeminiKey ? 'Ocultar' : 'Mostrar'}
                >
                  {showGeminiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleSaveGeminiKey}
                  className="px-2 py-0.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-[10px] rounded transition-colors"
                >
                  {savedGeminiSuccess ? 'Salvo!' : 'Salvar'}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono">
              <button
                onClick={testGeminiApiKey}
                disabled={geminiTestStatus === 'testing'}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                {geminiTestStatus === 'testing' ? 'Testando...' : '⚡ Testar Gemini'}
              </button>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-zinc-200 flex items-center gap-0.5"
              >
                Obter no Google <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {geminiTestMessage && (
              <div
                className={`p-2 rounded-lg text-[10px] font-mono flex items-center gap-1.5 ${
                  geminiTestStatus === 'success'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-950/60 text-rose-300 border border-rose-500/40'
                }`}
              >
                {geminiTestStatus === 'success' ? (
                  <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                )}
                <span className="truncate">{geminiTestMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Target Duration (30 to 90s) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 font-mono uppercase">
              <Clock className="w-4 h-4 text-amber-400" />
              Duração Alvo do Showreel (30 a 90s)
            </label>
            <span className="text-sm font-bold font-mono text-amber-300">
              {settings.targetDuration} segundos
            </span>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min={30}
              max={90}
              step={5}
              value={settings.targetDuration}
              onChange={(e) =>
                onUpdateSettings({ targetDuration: Number(e.target.value) })
              }
              className="w-full accent-amber-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>30s (Impacto Rápido)</span>
            <span>60s (Padrão Comercial)</span>
            <span>90s (Reel Completo)</span>
          </div>
        </div>

        {/* 5. Filtros Cinematográficos Globais */}
        <div className="flex flex-col gap-3 pt-2 border-t border-zinc-800/80">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5 font-mono uppercase">
              <Clapperboard className="w-4 h-4 text-amber-400" />
              Filtros Cinematográficos Globais (Canvas 2D)
            </label>
            <button
              onClick={() =>
                onUpdateSettings({
                  cinematicFilters: {
                    ...settings.cinematicFilters,
                    enabled: !settings.cinematicFilters.enabled,
                  },
                })
              }
              className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold border transition-colors ${
                settings.cinematicFilters.enabled
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-800 text-zinc-500 border-zinc-700'
              }`}
            >
              {settings.cinematicFilters.enabled ? 'ATIVADO' : 'DESATIVADO'}
            </button>
          </div>

          <p className="text-[11px] text-zinc-400">
            Processamento de pós-produção em tempo real com blit acelerado: granulação de película orgânica, vinheta de lente e aberração cromática.
          </p>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: '35mm', name: '35mm Película', desc: 'Granulação clássica + vinheta' },
              { id: 'arri', name: 'Arri Cinema', desc: 'Look limpo de sensor digital' },
              { id: 'cyber', name: 'Cyber Óptico', desc: 'Aberração & distorção forte' },
              { id: 'clean', name: 'Sem Filtros', desc: 'Canvas bruto transparente' },
            ].map((p) => {
              const isSelected =
                settings.cinematicFilters.preset === p.id &&
                (p.id === 'clean'
                  ? !settings.cinematicFilters.enabled
                  : settings.cinematicFilters.enabled);

              return (
                <button
                  key={p.id}
                  onClick={() => {
                    const presetConfig =
                      CINEMATIC_PRESETS[p.id as keyof typeof CINEMATIC_PRESETS];
                    onUpdateSettings({ cinematicFilters: presetConfig });
                  }}
                  className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 text-white shadow-md'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="font-semibold text-xs text-zinc-100 font-mono">
                    {p.name}
                  </span>
                  <span className="text-[9px] text-zinc-500 mt-1">{p.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Fine-Tuning Sliders if enabled */}
          {settings.cinematicFilters.enabled && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 flex flex-col gap-2.5">
              {/* Film Grain Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-300">Granulação de Filme (Film Grain)</span>
                  <span className="text-amber-400 font-bold">
                    {Math.round(settings.cinematicFilters.filmGrain * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.cinematicFilters.filmGrain}
                  onChange={(e) =>
                    onUpdateSettings({
                      cinematicFilters: {
                        ...settings.cinematicFilters,
                        filmGrain: Number(e.target.value),
                        preset: 'custom',
                      },
                    })
                  }
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Vignette Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-300">Vinheta Óptica (Vignette)</span>
                  <span className="text-amber-400 font-bold">
                    {Math.round(settings.cinematicFilters.vignette * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.cinematicFilters.vignette}
                  onChange={(e) =>
                    onUpdateSettings({
                      cinematicFilters: {
                        ...settings.cinematicFilters,
                        vignette: Number(e.target.value),
                        preset: 'custom',
                      },
                    })
                  }
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>

              {/* Chromatic Aberration Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-zinc-300">Aberração Cromática Leve (Lens Fringe)</span>
                  <span className="text-amber-400 font-bold">
                    {Math.round(settings.cinematicFilters.chromaticAberration * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={settings.cinematicFilters.chromaticAberration}
                  onChange={(e) =>
                    onUpdateSettings({
                      cinematicFilters: {
                        ...settings.cinematicFilters,
                        chromaticAberration: Number(e.target.value),
                        preset: 'custom',
                      },
                    })
                  }
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* 6. Export Video Button */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 font-mono uppercase">
              Exportação de Vídeo
            </span>
            <span className="text-[11px] font-mono text-zinc-400">
              Resolução: 1080×1920 (9:16) • Formato: {extension.toUpperCase()}
            </span>
          </div>

          <button
            onClick={() => {
              onClose();
              onExportVideo();
            }}
            disabled={isExporting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>
              {isExporting ? 'Gravando showreel...' : `Exportar ${extension.toUpperCase()} (1080×1920)`}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
