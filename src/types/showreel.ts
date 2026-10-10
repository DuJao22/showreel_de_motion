export type RoleType = 'gancho' | 'corpo' | 'clímax' | 'fechamento';

export interface HSLColor {
  h: number;
  s: number;
  l: number;
  str: string;
}

export interface Palette {
  id: string;
  name: string;
  bg: string;
  card: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  subtext: string;
  tag: string;
}

export interface TypographyCombo {
  id: string;
  name: string;
  displayFont: string;
  bodyFont: string;
  styleDescription: string;
}

export interface DNA {
  id: string;
  createdAt: number;
  estrutura: string;
  paleta: Palette;
  tipografia: TypographyCombo;
  transicaoDominante: string;
  abertura: string;
  energia: number; // 1 to 5
  bpm: number; // 90 to 140
  numeroCenas: number; // 6 to 16
  duracaoAlvo: number; // 30 to 90s
}

export interface SceneVerificationDiagnostic {
  valid: boolean;
  score: number; // 0 to 100
  keyframesTested: number; // e.g. 7
  keyframesPassed: number;
  renderLatencyMs: number; // e.g. 1.2
  fpsEstimate: number; // e.g. 60
  canvasStateBalanced: boolean; // save/restore matched
  nonEmptyPixels: boolean; // canvas actually has content drawn
  hasNanOrInf: boolean;
  warnings: string[];
  error?: string;
  checkedAt: number;
  thumbnailUrls?: string[]; // small data URLs for filmstrip
}

export interface ShowreelVerificationReport {
  showreelId: string;
  totalScenes: number;
  verifiedScenes: number;
  allScenesValid: boolean;
  overallScore: number; // 0 to 100
  totalKeyframesTested: number;
  averageLatencyMs: number;
  maxLatencyMs: number;
  leakCount: number;
  certifiedAt: number;
  certificationId: string;
  sceneDiagnostics: SceneVerificationDiagnostic[];
}

export interface Scene {
  id: string;
  name: string;
  duration: number; // in seconds
  role: RoleType;
  code: string; // pure JS function body or function(ctx, t, W, H)
  description?: string;
  scriptSnippet?: string;
  archetypeId?: string;
  archetypeName?: string;
  validated?: boolean;
  verification?: SceneVerificationDiagnostic;
  correctionAttempts?: number;
  compiledFn?: (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void;
}

export interface Showreel {
  id: string;
  title: string;
  concept: string;
  directorNotes?: string;
  totalDuration: number;
  scenes: Scene[];
  dna: DNA;
  script: string;
  generatedAt: number;
  verificationReport?: ShowreelVerificationReport;
}

export type GenerationStage = 
  | 'idle' 
  | 'dna_rolling' 
  | 'planning' 
  | 'writing_scenes' 
  | 'validating' 
  | 'repairing' 
  | 'completed' 
  | 'error';

export interface BuildLogEntry {
  id: string;
  time: string;
  text: string;
  type?: 'info' | 'code' | 'success' | 'warn' | 'error';
  sceneIndex?: number;
}

export interface BuildSceneProgress {
  index: number;
  id: string;
  name: string;
  role: RoleType;
  duration: number;
  status: 'pending' | 'generating' | 'validating' | 'repairing' | 'completed' | 'error';
  codeSnippet?: string;
  validationError?: string;
}

export interface GenerationStatus {
  stage: GenerationStage;
  message: string;
  percent?: number;
  currentScene?: number;
  totalScenes?: number;
  currentSceneName?: string;
  currentSceneRole?: RoleType;
  currentCode?: string;
  scenesProgress?: BuildSceneProgress[];
  logs?: BuildLogEntry[];
  attempt?: number;
  error?: string;
}

export interface CinematicFilterConfig {
  enabled: boolean;
  filmGrain: number; // 0 to 1
  vignette: number; // 0 to 1
  chromaticAberration: number; // 0 to 1
  preset: '35mm' | 'arri' | 'cyber' | 'clean' | 'custom';
}

export interface AppSettings {
  geminiApiKey: string;
  anthropicApiKey: string;
  aiProvider: 'gemini' | 'claude';
  selectedModel: string;
  claudeOpusMode: boolean; // Injeta rigor de código, física e arquitetura de 5 camadas do Claude Opus
  targetDuration: number; // 30 to 90
  fps: number; // 30 or 60
  showSafeAreas: boolean;
  cinematicFilters: CinematicFilterConfig;
}
