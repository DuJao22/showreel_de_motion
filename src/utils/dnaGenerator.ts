import { DNA, Palette, TypographyCombo } from '../types/showreel';

export const ESTRUTURAS = [
  'narrativa linear',
  'explosão-respiro-explosão',
  'crescendo',
  'loop circular',
  'tipografia cinética pura',
  'glitch/digital',
  'minimalista elegante',
  '3D fake com perspectiva',
  'colagem/grid dinâmico',
  'liquid/orgânico',
] as const;

export const PALETAS: Palette[] = [
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    tag: 'Ciano & Magenta Elétrico',
    bg: 'hsl(225, 40%, 6%)',
    card: 'hsl(225, 30%, 12%)',
    primary: 'hsl(185, 100%, 50%)',
    secondary: 'hsl(310, 95%, 55%)',
    accent: 'hsl(55, 100%, 55%)',
    text: 'hsl(0, 0%, 98%)',
    subtext: 'hsl(220, 20%, 75%)',
  },
  {
    id: 'brutalist-acid',
    name: 'Brutalist Acid',
    tag: 'Lima Ácido & Ultravioleta',
    bg: 'hsl(240, 25%, 5%)',
    card: 'hsl(240, 20%, 11%)',
    primary: 'hsl(85, 100%, 52%)',
    secondary: 'hsl(270, 90%, 60%)',
    accent: 'hsl(0, 0%, 100%)',
    text: 'hsl(60, 30%, 96%)',
    subtext: 'hsl(240, 15%, 70%)',
  },
  {
    id: 'swiss-sunset',
    name: 'Swiss Sunset',
    tag: 'Carmesim Suíço & Tangerina',
    bg: 'hsl(15, 25%, 6%)',
    card: 'hsl(15, 20%, 12%)',
    primary: 'hsl(350, 90%, 58%)',
    secondary: 'hsl(30, 95%, 54%)',
    accent: 'hsl(48, 100%, 62%)',
    text: 'hsl(45, 30%, 97%)',
    subtext: 'hsl(20, 15%, 75%)',
  },
  {
    id: 'tokyo-noir',
    name: 'Tokyo Noir',
    tag: 'Azul Eletrizante & Sinal Vermelho',
    bg: 'hsl(220, 30%, 4%)',
    card: 'hsl(220, 25%, 10%)',
    primary: 'hsl(210, 100%, 56%)',
    secondary: 'hsl(5, 95%, 58%)',
    accent: 'hsl(190, 90%, 70%)',
    text: 'hsl(210, 20%, 98%)',
    subtext: 'hsl(215, 20%, 72%)',
  },
  {
    id: 'bio-organic',
    name: 'Bio Organic',
    tag: 'Esmeralda Vital & Verde Lima',
    bg: 'hsl(140, 35%, 5%)',
    card: 'hsl(140, 25%, 11%)',
    primary: 'hsl(155, 95%, 48%)',
    secondary: 'hsl(95, 90%, 52%)',
    accent: 'hsl(50, 100%, 65%)',
    text: 'hsl(120, 25%, 97%)',
    subtext: 'hsl(135, 15%, 74%)',
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    tag: 'Ouro Solar & Âmbar Vulcânico',
    bg: 'hsl(20, 35%, 5%)',
    card: 'hsl(20, 28%, 11%)',
    primary: 'hsl(42, 100%, 53%)',
    secondary: 'hsl(15, 95%, 55%)',
    accent: 'hsl(340, 85%, 60%)',
    text: 'hsl(35, 40%, 98%)',
    subtext: 'hsl(25, 20%, 75%)',
  },
  {
    id: 'vapor-dream',
    name: 'Vapor Dream',
    tag: 'Lavanda Holográfica & Ciano Glow',
    bg: 'hsl(255, 35%, 6%)',
    card: 'hsl(255, 25%, 12%)',
    primary: 'hsl(275, 90%, 65%)',
    secondary: 'hsl(190, 95%, 55%)',
    accent: 'hsl(330, 95%, 65%)',
    text: 'hsl(270, 30%, 98%)',
    subtext: 'hsl(260, 20%, 76%)',
  },
  {
    id: 'monochrome-voltage',
    name: 'Monochrome Voltage',
    tag: 'Preto & Branco com Pulso Amarelo',
    bg: 'hsl(0, 0%, 5%)',
    card: 'hsl(0, 0%, 12%)',
    primary: 'hsl(0, 0%, 98%)',
    secondary: 'hsl(55, 100%, 50%)',
    accent: 'hsl(0, 0%, 80%)',
    text: 'hsl(0, 0%, 100%)',
    subtext: 'hsl(0, 0%, 70%)',
  },
  {
    id: 'cobalt-energy',
    name: 'Cobalt Energy',
    tag: 'Cobalto Puro & Laranja Supersônico',
    bg: 'hsl(225, 45%, 5%)',
    card: 'hsl(225, 30%, 11%)',
    primary: 'hsl(220, 100%, 58%)',
    secondary: 'hsl(25, 100%, 54%)',
    accent: 'hsl(195, 100%, 65%)',
    text: 'hsl(215, 35%, 98%)',
    subtext: 'hsl(220, 20%, 74%)',
  },
  {
    id: 'matcha-minimal',
    name: 'Matcha Minimal',
    tag: 'Sálvia Nórdica & Terracota Suave',
    bg: 'hsl(125, 20%, 6%)',
    card: 'hsl(125, 15%, 12%)',
    primary: 'hsl(110, 50%, 62%)',
    secondary: 'hsl(18, 75%, 60%)',
    accent: 'hsl(40, 60%, 78%)',
    text: 'hsl(45, 25%, 96%)',
    subtext: 'hsl(115, 12%, 72%)',
  },
  {
    id: 'deep-matrix',
    name: 'Deep Matrix',
    tag: 'Fósforo Terminal & Menta Cibernética',
    bg: 'hsl(150, 45%, 4%)',
    card: 'hsl(150, 30%, 9%)',
    primary: 'hsl(140, 100%, 48%)',
    secondary: 'hsl(170, 95%, 52%)',
    accent: 'hsl(80, 100%, 55%)',
    text: 'hsl(145, 40%, 96%)',
    subtext: 'hsl(150, 20%, 72%)',
  },
  {
    id: 'hyper-luxury',
    name: 'Hyper Luxury',
    tag: 'Ouro Champanhe & Borgonha Profundo',
    bg: 'hsl(345, 35%, 5%)',
    card: 'hsl(345, 25%, 11%)',
    primary: 'hsl(42, 85%, 60%)',
    secondary: 'hsl(345, 80%, 55%)',
    accent: 'hsl(200, 70%, 80%)',
    text: 'hsl(40, 30%, 98%)',
    subtext: 'hsl(350, 15%, 75%)',
  },
];

export const TIPOGRAFIAS: TypographyCombo[] = [
  {
    id: 'syne-space-mono',
    name: 'Display Sans + Mono',
    displayFont: "'Syne', sans-serif",
    bodyFont: "'Space Mono', monospace",
    styleDescription: 'Vanguarda contemporânea com estética técnica refinada',
  },
  {
    id: 'impact-inter',
    name: 'Heavy Brutalist + Neutral',
    displayFont: "'Inter', sans-serif",
    bodyFont: "'Inter', sans-serif",
    styleDescription: 'Impacto brutalista sólido balanceado por legibilidade suíça',
  },
  {
    id: 'playfair-montserrat',
    name: 'Editorial Serif + Geometric Sans',
    displayFont: "'Playfair Display', serif",
    bodyFont: "'Inter', sans-serif",
    styleDescription: 'Alta moda editorial combinada com precisão geométrica',
  },
  {
    id: 'orbitron-mono',
    name: 'Cyber Tech + Futuristic Sans',
    displayFont: "'Orbitron', sans-serif",
    bodyFont: "'Space Mono', monospace",
    styleDescription: 'Ficção científica e interfaces HUD cinematográficas',
  },
  {
    id: 'grotesk-mono',
    name: 'Neo-Grotesk + Technical Mono',
    displayFont: "'Plus Jakarta Sans', sans-serif",
    bodyFont: "'Space Mono', monospace",
    styleDescription: 'Design digital de ponta com detalhes de protótipo de software',
  },
  {
    id: 'bebas-clean',
    name: 'Kinetic Condensed + Clean Body',
    displayFont: "'Bebas Neue', sans-serif",
    bodyFont: "'Inter', sans-serif",
    styleDescription: 'Pôsteres dinâmicos de alta voltagem e tipografia vertical',
  },
  {
    id: 'bold-humanist',
    name: 'Bold Expressive + Humanist',
    displayFont: "'Syne', sans-serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    styleDescription: 'Curvas expressivas marcantes e ritmo caloroso moderno',
  },
  {
    id: 'minimal-stark',
    name: 'Minimal Stark + Ultra Light',
    displayFont: "'Inter', sans-serif",
    bodyFont: "'Space Mono', monospace",
    styleDescription: 'Minimalismo escandinavo puro com peso contrastante extremo',
  },
];

export const TRANSIÇÕES = [
  'wipe',
  'zoom through',
  'morph',
  'mask reveal',
  'slice',
  'whip pan',
  'flash cut',
] as const;

export const ABERTURAS = [
  'gancho de impacto',
  'pergunta',
  'texto gigante',
  'objeto em close',
  'tela vazia que explode',
] as const;

const DNA_STORAGE_KEY = 'motion_dna_history';

/**
 * Returns a cryptographically random integer in [min, max] (inclusive).
 */
export function getRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const maxUint = 0xffffffff;
  const limit = maxUint - (maxUint % range);
  const arr = new Uint32Array(1);

  let val: number;
  do {
    crypto.getRandomValues(arr);
    val = arr[0];
  } while (val >= limit);

  return min + (val % range);
}

/**
 * Pick an item from an array using crypto.getRandomValues
 */
export function getRandomChoice<T>(items: readonly T[]): T {
  const index = getRandomInt(0, items.length - 1);
  return items[index];
}

/**
 * Retrieves the last stored DNAs (up to 10) from localStorage
 */
export function getStoredDNAHistory(): DNA[] {
  try {
    const raw = localStorage.getItem(DNA_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.slice(0, 10);
  } catch (err) {
    console.warn('Erro ao carregar histórico de DNA do localStorage:', err);
  }
  return [];
}

/**
 * Saves a new DNA into localStorage, maintaining at most 10 DNAs.
 */
export function saveDNAToHistory(dna: DNA): DNA[] {
  try {
    const current = getStoredDNAHistory();
    const updated = [dna, ...current.filter((d) => d.id !== dna.id)].slice(0, 10);
    localStorage.setItem(DNA_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Erro ao salvar histórico de DNA no localStorage:', err);
    return [];
  }
}

/**
 * Clears the stored DNA history
 */
export function clearDNAHistory(): void {
  try {
    localStorage.removeItem(DNA_STORAGE_KEY);
  } catch (err) {
    console.warn('Erro ao limpar histórico:', err);
  }
}

/**
 * Generates a unique DNA using crypto.getRandomValues.
 * Rule: Forbids repeating 'estrutura', 'paleta', and 'transicaoDominante'
 * of the last 3 DNAs stored in localStorage.
 */
export function generateRandomDNA(targetDuration: number = 45): DNA {
  const history = getStoredDNAHistory();
  const last3 = history.slice(0, 3);

  const forbiddenEstruturas = new Set(last3.map((d) => d.estrutura));
  const forbiddenPaletas = new Set(last3.map((d) => d.paleta.id));
  const forbiddenTransicoes = new Set(last3.map((d) => d.transicaoDominante));

  // Filter candidates to guarantee the no-repeat rule
  let candidateEstruturas = ESTRUTURAS.filter((e) => !forbiddenEstruturas.has(e));
  if (candidateEstruturas.length === 0) candidateEstruturas = [...ESTRUTURAS];

  let candidatePaletas = PALETAS.filter((p) => !forbiddenPaletas.has(p.id));
  if (candidatePaletas.length === 0) candidatePaletas = [...PALETAS];

  let candidateTransicoes = TRANSIÇÕES.filter((t) => !forbiddenTransicoes.has(t));
  if (candidateTransicoes.length === 0) candidateTransicoes = [...TRANSIÇÕES];

  // Draw DNA attributes
  const estrutura = getRandomChoice(candidateEstruturas);
  const paleta = getRandomChoice(candidatePaletas);
  const transicaoDominante = getRandomChoice(candidateTransicoes);
  const tipografia = getRandomChoice(TIPOGRAFIAS);
  const abertura = getRandomChoice(ABERTURAS);

  // ENERGIA: 1 a 5
  const energia = getRandomInt(1, 5);

  // BPM: 90 a 140
  const bpm = getRandomInt(90, 140);

  // NÚMERO DE CENAS: entre 6 e 16
  // Scaled proportionally to target duration (e.g. 30s -> 6-9 scenes, 90s -> 10-16 scenes)
  const minScenes = Math.max(6, Math.min(12, Math.floor(targetDuration / 5.5)));
  const maxScenes = Math.min(16, Math.max(minScenes + 2, Math.ceil(targetDuration / 3.5)));
  const numeroCenas = getRandomInt(minScenes, maxScenes);

  const newDNA: DNA = {
    id: `dna_${Date.now()}_${getRandomInt(1000, 9999)}`,
    createdAt: Date.now(),
    estrutura,
    paleta,
    tipografia,
    transicaoDominante,
    abertura,
    energia,
    bpm,
    numeroCenas,
    duracaoAlvo: targetDuration,
  };

  return newDNA;
}
