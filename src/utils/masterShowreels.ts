import { Showreel, DNA, Scene } from '../types/showreel';
import { getGarotoShowreel, GAROTO_DNA } from './garotoShowreel';
import { compileSceneCode } from './proceduralFallback';
import { autoCertifyShowreel } from './sceneVerifier';

// -------------------------------------------------------------
// 1. CLAUDE OPUS // FÍSICA HARMÔNICA & 5 CAMADAS (30s)
// -------------------------------------------------------------
export const CLAUDE_OPUS_DNA: DNA = {
  id: 'dna_claude_opus_30s',
  createdAt: Date.now(),
  estrutura: 'Síntese de Alta Fidelidade (Claude Opus)',
  paleta: {
    id: 'opus_harmonic',
    name: 'Opus Titanium & Cobalt (Harmônico 35mm)',
    bg: '#05070f',
    card: '#0c1024',
    primary: '#60a5fa',
    secondary: '#a78bfa',
    accent: '#38bdf8',
    text: '#f8fafc',
    subtext: '#94a3b8',
    tag: '#3b82f6',
  },
  tipografia: {
    id: 'opus_display',
    name: 'Plus Jakarta Sans + JetBrains Mono',
    displayFont: 'Plus Jakarta Sans',
    bodyFont: 'JetBrains Mono',
    styleDescription: 'Tipografia cinética com peso 900 monumental e réguas métricas suíças',
  },
  transicaoDominante: 'Harmonic Damped Spring & Z-Axis Pull',
  abertura: 'Oscilador de Molas // Vácuo Cósmico',
  energia: 5,
  bpm: 124,
  numeroCenas: 6,
  duracaoAlvo: 30,
};

const OPUS_SCENE_1 = `function drawScene(ctx, t, W, H) {
  // 1. Fundo profundo com gradiente de vácuo
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#040612');
  bg.addColorStop(0.5, '#080d24');
  bg.addColorStop(1, '#0c1438');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 2. Grid de respiro paramétrico
  M.grid(ctx, W, H, t, { step: 95, color: 'rgba(96, 165, 250, 0.06)', drift: 18 });

  // 3. Esfera de Partículas Harmônicas
  const pIntro = M.seg(t, 0.0, 0.55);
  const scale = M.spring(pIntro, 1.3, 0.55);
  ctx.save();
  ctx.translate(W / 2, H * 0.43);
  ctx.scale(scale, scale);
  M.sphere(ctx, 0, 0, 190, { x: t * 1.4, y: t * 2.0, z: 0.2 }, { hue: 220, connect: true });
  M.rings(ctx, 0, 0, M.seg(t, 0.05, 0.6), { count: 4, gap: 55, color: 'rgba(96, 165, 250, 0.3)' });
  ctx.restore();

  // 4. Tipografia Monumental
  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, 'CLAUDE OPUS', W / 2, H * 0.68, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 110,
    color: '#f8fafc',
    rise: 65,
    spread: 0.45
  });
  ctx.restore();

  // Subtítulo em mola
  const tSub = M.seg(t, 0.35, 0.85);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#60a5fa';
    ctx.textAlign = 'center';
    ctx.fillText('// OSCILADOR HARMÔNICO & 5 CAMADAS', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Miras HUD
  M.crosshair(ctx, 90, 160, 24, 'rgba(96,165,250,0.5)');
  M.crosshair(ctx, W - 90, 160, 24, 'rgba(96,165,250,0.5)');

  const out = M.ease.inOutCubic(M.seg(t, 0.9, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 18, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const OPUS_SCENE_2 = `function drawScene(ctx, t, W, H) {
  // Gradiente radial
  const bg = ctx.createRadialGradient(W/2, H*0.44, 100, W/2, H*0.44, H*0.7);
  bg.addColorStop(0, '#0c1636');
  bg.addColorStop(1, '#040610');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Monitor 3D com análise quântica
  const pCard = M.seg(t, 0.0, 0.5);
  const cardScale = M.spring(pCard, 1.25, 0.6);
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.scale(cardScale, cardScale);
  M.monitor(ctx, 0, 0, 700, 430, t, {
    title: 'neural_kernel // harmonic.ts',
    codeLines: [
      '> physics: DAMPED_HARMONIC_OSCILLATOR',
      '> zeta: 0.58 [CRITICALLY_TUNED]',
      '> layers: 5 Z-DEPTH ELEVATIONS ACTIVE',
      '> fps: 60.0 [ZERO_FRAME_DROPS]'
    ],
    hue: 220
  });
  ctx.restore();

  // Tipografia
  const tText = M.seg(t, 0.12, 0.6);
  ctx.save();
  M.kineticText(ctx, 'FÍSICA PURA', W / 2, H * 0.68, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 110,
    color: '#ffffff',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  // Legenda
  const tSub = M.seg(t, 0.35, 0.85);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#a78bfa';
    ctx.textAlign = 'center';
    ctx.fillText('// RIGOR MATEMÁTICO DETERMINÍSTICO', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 16, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const OPUS_SCENE_3 = `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#050711';
  ctx.fillRect(0, 0, W, H);

  // Cubo 3D com sombra e rotação multi-eixo
  const pCube = M.seg(t, 0.0, 0.55);
  const cubeScale = M.spring(pCube, 1.3, 0.6);
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.scale(cubeScale, cubeScale);
  M.cube(ctx, 0, 0, 170, { x: t * 2.2, y: t * 2.8, z: t * 0.8 }, { solid: true, hue: 225 });
  M.rings(ctx, 0, 0, M.seg(t, 0.05, 0.6), { count: 5, gap: 50, color: 'rgba(96, 165, 250, 0.3)' });
  ctx.restore();

  // Tipografia
  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, 'PROFUNDIDADE', W / 2, H * 0.68, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 104,
    color: '#f8fafc',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('// 5 CAMADAS DE MATRIZ ESPACIAL', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Barra de progresso rítmica
  ctx.fillStyle = '#60a5fa';
  ctx.fillRect(90, H - 150, (W - 180) * t, 8);

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 16, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const OPUS_SCENE_4 = `function drawScene(ctx, t, W, H) {
  // Flash Cut sutil
  const flash = t < 0.08 ? 1 - t / 0.08 : 0;
  ctx.fillStyle = flash > 0 ? 'rgba(96, 165, 250, ' + (flash * 0.3) + ')' : '#040612';
  ctx.fillRect(0, 0, W, H);

  // Túnel 3D Octogonal
  ctx.save();
  ctx.translate(W / 2, H * 0.44);
  M.tunnel(ctx, 0, 0, t, { sides: 8, speed: 2.8, color: '#60a5fa' });
  ctx.restore();

  // Tipografia de Clímax
  const tText = M.seg(t, 0.08, 0.55);
  ctx.save();
  M.kineticText(ctx, 'ALTA VELOCIDADE', W / 2, H * 0.68, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 96,
    color: '#ffffff',
    rise: 65,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#a78bfa';
    ctx.textAlign = 'center';
    ctx.fillText('// 124 BPM SINCRONIA TOTAL', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 18, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const OPUS_SCENE_5 = `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#060814';
  ctx.fillRect(0, 0, W, H);

  // Dashboard de Alta Performance
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  M.dashboard(ctx, 0, 0, 720, 440, t, {
    title: 'OPUS ENGINE // MÉTRICAS',
    mrr: '$120K',
    users: '60 FPS',
    latency: '0.8ms'
  });
  ctx.restore();

  // Tipografia
  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, 'CLÍMAX ÓPTICO', W / 2, H * 0.68, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 104,
    color: '#ffffff',
    rise: 55,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('// RENDERING A 60 FPS CRAVADO', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.9, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 18, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const OPUS_SCENE_6 = `function drawScene(ctx, t, W, H) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#040612');
  bg.addColorStop(1, '#020308');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Esfera e Moldura HUD
  ctx.save();
  ctx.translate(W / 2, H * 0.38);
  M.sphere(ctx, 0, 0, 210, { x: t * 1.5, y: t * 2.2, z: 0 }, { hue: 220, connect: true });
  ctx.restore();

  ctx.strokeStyle = 'rgba(96, 165, 250, 0.4)';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 90, W - 120, H - 180);

  // Tipografia Final
  const tText = M.seg(t, 0.08, 0.55);
  ctx.save();
  M.kineticText(ctx, 'O FUTURO É AGORA', W / 2, H * 0.65, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 96,
    color: '#ffffff',
    rise: 50,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.85);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#60a5fa';
    ctx.textAlign = 'center';
    ctx.fillText('DIREÇÃO CLAUDE OPUS // 2026', W / 2, H * 0.76 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.92, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(2, 3, 8, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

export function getClaudeOpusShowreel(): Showreel {
  const scenes: Scene[] = [
    {
      id: 'opus_scene_1',
      name: 'OSCILADOR HARMÔNICO // Abertura',
      duration: 5.0,
      role: 'gancho',
      description: 'Esfera de partículas e molas com amortecimento crítico equilibrado e tipografia monumental.',
      code: OPUS_SCENE_1,
      validated: true,
      compiledFn: compileSceneCode(OPUS_SCENE_1),
    },
    {
      id: 'opus_scene_2',
      name: 'NÚCLEO NEURAL // Física Pura',
      duration: 5.0,
      role: 'corpo',
      description: 'Terminal paramétrico 3D e renderização determinística sem vazamento de estado.',
      code: OPUS_SCENE_2,
      validated: true,
      compiledFn: compileSceneCode(OPUS_SCENE_2),
    },
    {
      id: 'opus_scene_3',
      name: '5 CAMADAS // Profundidade Espacial',
      duration: 5.0,
      role: 'corpo',
      description: 'Cubo 3D sombreado e rotações com respiro arquitetônico.',
      code: OPUS_SCENE_3,
      validated: true,
      compiledFn: compileSceneCode(OPUS_SCENE_3),
    },
    {
      id: 'opus_scene_4',
      name: 'ALTA VELOCIDADE // Sincronia 124 BPM',
      duration: 5.0,
      role: 'corpo',
      description: 'Túnel poligonal em cascata e tipografia cinética deslizante.',
      code: OPUS_SCENE_4,
      validated: true,
      compiledFn: compileSceneCode(OPUS_SCENE_4),
    },
    {
      id: 'opus_scene_5',
      name: 'CLÍMAX ÓPTICO // 60 FPS Cravado',
      duration: 5.0,
      role: 'clímax',
      description: 'Dashboard de métricas volumétricas com picos de aceleração.',
      code: OPUS_SCENE_5,
      validated: true,
      compiledFn: compileSceneCode(OPUS_SCENE_5),
    },
    {
      id: 'opus_scene_6',
      name: 'ASSINATURA FINAL // O Futuro é Agora',
      duration: 5.0,
      role: 'fechamento',
      description: 'Fechamento editorial com assinatura cinematográfica pura.',
      code: OPUS_SCENE_6,
      validated: true,
      compiledFn: compileSceneCode(OPUS_SCENE_6),
    },
  ];

  const reel: Showreel = {
    id: 'claude_opus_harmonic_30s',
    title: 'Claude Opus // Física Harmônica & 5 Camadas (30s)',
    concept: 'Síntese rigorosa com osciladores de molas amortecidas, 5 camadas Z-depth e tipografia monumental.',
    directorNotes: 'Física elástica de molas não-lineares M.spring, contraste cirúrgico e timing calibrado a 124 BPM.',
    totalDuration: 30,
    scenes,
    dna: CLAUDE_OPUS_DNA,
    script: 'Síntese com o rigor estético do Claude Opus: 5 camadas de profundidade visual, oscilador harmônico de molas amortecidas, tipografia monumental e micro-acentos sincronizados ao BPM.',
    generatedAt: Date.now(),
  };

  return autoCertifyShowreel(reel);
}

// -------------------------------------------------------------
// 2. SAUL BASS // GEOMETRIA CINÉTICA & SILHUETAS (30s)
// -------------------------------------------------------------
export const SAUL_BASS_DNA: DNA = {
  id: 'dna_saul_bass_30s',
  createdAt: Date.now(),
  estrutura: 'Geometria Cinética & Silhuetas de Bass',
  paleta: {
    id: 'bass_chroma',
    name: 'Saul Bass Heritage (Cinnabar Red & Obsidian)',
    bg: '#0c0608',
    card: '#1c0c10',
    primary: '#ef4444',
    secondary: '#f97316',
    accent: '#fbbf24',
    text: '#fafaf9',
    subtext: '#d6d3d1',
    tag: '#dc2626',
  },
  tipografia: {
    id: 'bass_display',
    name: 'Bebas Neue + JetBrains Mono',
    displayFont: 'Bebas Neue',
    bodyFont: 'JetBrains Mono',
    styleDescription: 'Tipografia recortada de alto contraste óptico com estética analógica 35mm',
  },
  transicaoDominante: 'Diagonal Slash & High-Contrast Cut',
  abertura: 'Corte Vermelho // Silhueta Rasgada',
  energia: 5,
  bpm: 132,
  numeroCenas: 6,
  duracaoAlvo: 30,
};

const BASS_SCENE_1 = `function drawScene(ctx, t, W, H) {
  // Fundo preto puro
  ctx.fillStyle = '#0a0507';
  ctx.fillRect(0, 0, W, H);

  // Faixa vermelha recortada de Saul Bass
  const pSlash = M.seg(t, 0.0, 0.4);
  const slashEase = M.spring(pSlash, 1.4, 0.55);
  ctx.save();
  ctx.translate(W / 2, H * 0.44);
  ctx.rotate(-0.15);
  ctx.fillStyle = '#ef4444';
  const slashW = W * 1.5;
  const slashH = 340 * slashEase;
  ctx.fillRect(-slashW / 2, -slashH / 2, slashW, slashH);
  ctx.restore();

  // Silhueta cortando o espaço
  const pBoy = M.seg(t, 0.15, 0.65);
  const boyEase = M.spring(pBoy, 1.3, 0.6);
  M.character(ctx, W / 2, H * 0.48 + (1 - boyEase) * 80, 1.3, t, 0);

  // Tipografia Recortada
  const tText = M.seg(t, 0.08, 0.5);
  ctx.save();
  M.kineticText(ctx, 'VERTIGO', W / 2, H * 0.18, tText, {
    family: '"Bebas Neue", sans-serif',
    weight: 900,
    size: 190,
    color: '#fafaf9',
    rise: 70,
    spread: 0.4
  });
  ctx.restore();

  // Legenda
  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 38px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f97316';
    ctx.textAlign = 'center';
    ctx.fillText('// O CORTE DE SAUL BASS', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(10, 5, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const BASS_SCENE_2 = `function drawScene(ctx, t, W, H) {
  // Fundo vermelho vivo
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(0, 0, W, H);

  // Espiral cinética hipnótica de Bass
  const pSpin = t * 3.5;
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.rotate(pSpin);
  for (let r = 260; r > 30; r -= 40) {
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 1.4);
    ctx.lineWidth = 26;
    ctx.strokeStyle = r % 80 === 0 ? '#0a0507' : '#fafaf9';
    ctx.stroke();
  }
  ctx.restore();

  // Tipografia Monumental
  const tText = M.seg(t, 0.1, 0.55);
  ctx.save();
  M.kineticText(ctx, 'TENSÃO ÓPTICA', W / 2, H * 0.68, tText, {
    family: '"Bebas Neue", sans-serif',
    weight: 900,
    size: 160,
    color: '#0a0507',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 38px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fafaf9';
    ctx.textAlign = 'center';
    ctx.fillText('// CINÉTICA GEOMÉTRICA PURA', W / 2, H * 0.78 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(10, 5, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const BASS_SCENE_3 = `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#0a0507';
  ctx.fillRect(0, 0, W, H);

  // Linhas diagonais cortando em ritmo sincopado
  const lines = 6;
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  for (let i = 0; i < lines; i++) {
    const p = M.stagger(M.seg(t, 0.0, 0.6), i, lines, 0.4);
    const w = 500 * M.spring(p, 1.3, 0.6);
    ctx.fillStyle = i % 2 === 0 ? '#ef4444' : '#fafaf9';
    ctx.fillRect(-w / 2, -220 + i * 80, w, 36);
  }
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, 'RITMO BRUTO', W / 2, H * 0.68, tText, {
    family: '"Bebas Neue", sans-serif',
    weight: 900,
    size: 160,
    color: '#fafaf9',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fbbf24';
    ctx.textAlign = 'center';
    ctx.fillText('// 132 BPM CORTE PRECISO', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(10, 5, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const BASS_SCENE_4 = `function drawScene(ctx, t, W, H) {
  // Flash Cut invertido
  const flash = t < 0.1 ? 1 - t / 0.1 : 0;
  ctx.fillStyle = flash > 0 ? '#ef4444' : '#0a0507';
  ctx.fillRect(0, 0, W, H);

  // Cubo 3D de Alto Contraste
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  M.cube(ctx, 0, 0, 180, { x: t * 2.0, y: t * 2.5, z: 0.3 }, { solid: false, strokeColor: '#ef4444' });
  M.rings(ctx, 0, 0, M.seg(t, 0.05, 0.5), { count: 5, gap: 50, color: '#fbbf24' });
  ctx.restore();

  const tText = M.seg(t, 0.08, 0.5);
  ctx.save();
  M.kineticText(ctx, 'CLÍMAX VISCERAL', W / 2, H * 0.68, tText, {
    family: '"Bebas Neue", sans-serif',
    weight: 900,
    size: 150,
    color: '#fafaf9',
    rise: 65,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.3, 0.75);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 38px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'center';
    ctx.fillText('// COLISÃO GEOMÉTRICA TOTAL', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.9, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(10, 5, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const BASS_SCENE_5 = `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#0a0507';
  ctx.fillRect(0, 0, W, H);

  // Silhuetas em espelho e labirinto
  ctx.save();
  ctx.translate(W / 2, H * 0.4);
  M.character(ctx, -140, 0, 1.1, t, 0);
  M.character(ctx, 140, 0, 1.1, t, 0);
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.55);
  ctx.save();
  M.kineticText(ctx, 'DUPLICIDADE', W / 2, H * 0.66, tText, {
    family: '"Bebas Neue", sans-serif',
    weight: 900,
    size: 160,
    color: '#ef4444',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fafaf9';
    ctx.textAlign = 'center';
    ctx.fillText('// O DESIGN QUE DEFINIU O CINEMA', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.9, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(10, 5, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const BASS_SCENE_6 = `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#0a0507';
  ctx.fillRect(0, 0, W, H);

  // Moldura espessa brutalista
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 14;
  ctx.strokeRect(60, 90, W - 120, H - 180);

  // Silhueta central vitoriosa
  M.character(ctx, W / 2, H * 0.38, 1.35, t, 0);

  const tText = M.seg(t, 0.08, 0.55);
  ctx.save();
  M.kineticText(ctx, 'SAUL BASS LEGACY', W / 2, H * 0.64, tText, {
    family: '"Bebas Neue", sans-serif',
    weight: 900,
    size: 140,
    color: '#fafaf9',
    rise: 50,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.85);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 38px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ef4444';
    ctx.textAlign = 'center';
    ctx.fillText('DIREÇÃO DE ARTE ATEMPORAL', W / 2, H * 0.75 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.92, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(10, 5, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

export function getSaulBassShowreel(): Showreel {
  const scenes: Scene[] = [
    {
      id: 'bass_scene_1',
      name: 'O RASGO // Abertura',
      duration: 5.0,
      role: 'gancho',
      description: 'Faixa diagonal vermelha e silhueta inspirada na cinematografia de Saul Bass.',
      code: BASS_SCENE_1,
      validated: true,
      compiledFn: compileSceneCode(BASS_SCENE_1),
    },
    {
      id: 'bass_scene_2',
      name: 'ESPIRAL // Tensão Óptica',
      duration: 5.0,
      role: 'corpo',
      description: 'Espiral hipnótica em rotação contínua e tipografia em corte seco.',
      code: BASS_SCENE_2,
      validated: true,
      compiledFn: compileSceneCode(BASS_SCENE_2),
    },
    {
      id: 'bass_scene_3',
      name: 'RITMO BRUTO // 132 BPM',
      duration: 5.0,
      role: 'corpo',
      description: 'Barras cinéticas em cascata e contraste analógico 35mm.',
      code: BASS_SCENE_3,
      validated: true,
      compiledFn: compileSceneCode(BASS_SCENE_3),
    },
    {
      id: 'bass_scene_4',
      name: 'COLISÃO // Clímax Visceral',
      duration: 5.0,
      role: 'clímax',
      description: 'Cubo 3D em wireframe vermelho com corte estroboscópico.',
      code: BASS_SCENE_4,
      validated: true,
      compiledFn: compileSceneCode(BASS_SCENE_4),
    },
    {
      id: 'bass_scene_5',
      name: 'DUPLICIDADE // Labirinto de Silhuetas',
      duration: 5.0,
      role: 'corpo',
      description: 'Silhuetas espelhadas em alta tensão espacial.',
      code: BASS_SCENE_5,
      validated: true,
      compiledFn: compileSceneCode(BASS_SCENE_5),
    },
    {
      id: 'bass_scene_6',
      name: 'LEGADO // Assinatura Monumental',
      duration: 5.0,
      role: 'fechamento',
      description: 'Moldura espessa e assinatura geométrica final de Saul Bass.',
      code: BASS_SCENE_6,
      validated: true,
      compiledFn: compileSceneCode(BASS_SCENE_6),
    },
  ];

  const reel: Showreel = {
    id: 'saul_bass_kinetic_30s',
    title: 'Saul Bass // Geometria Cinética & Silhuetas (30s)',
    concept: 'Direção cinematográfica clássica: formas geométricas puras, recortes ópticos e silhuetas de alto contraste.',
    directorNotes: 'Estética analógica de Saul Bass: cores viscerais, tipografia recortada monumental e ritmo cirúrgico no BPM 132.',
    totalDuration: 30,
    scenes,
    dna: SAUL_BASS_DNA,
    script: 'Direção inspirada na era de ouro de Saul Bass: formas geométricas sólidas cortando o espaço, silhuetas de alto contraste, tipografia cinética recortada e tensão rítmica precisa.',
    generatedAt: Date.now(),
  };

  return autoCertifyShowreel(reel);
}

// -------------------------------------------------------------
// 3. BAUHAUS & SWISS // GRID PARAMÉTRICO 3D (30s)
// -------------------------------------------------------------
export const BAUHAUS_SWISS_DNA: DNA = {
  id: 'dna_bauhaus_swiss_30s',
  createdAt: Date.now(),
  estrutura: 'Grid Suíço Paramétrico & Isometria 3D',
  paleta: {
    id: 'swiss_modern',
    name: 'Swiss Monochrome & Emerald (Brutalismo Arquitetônico)',
    bg: '#050807',
    card: '#0a1410',
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#6ee7b7',
    text: '#f2fbf7',
    subtext: '#99b6a8',
    tag: '#059669',
  },
  tipografia: {
    id: 'swiss_display',
    name: 'Plus Jakarta Sans + JetBrains Mono',
    displayFont: 'Plus Jakarta Sans',
    bodyFont: 'JetBrains Mono',
    styleDescription: 'Neo-grotesco brutalista com alinhamento milimétrico em grid vertical 9:16',
  },
  transicaoDominante: 'Isometric Axial Rotation & Grid Expansion',
  abertura: 'Grid Paramétrico // Proporção Áurea',
  energia: 5,
  bpm: 120,
  numeroCenas: 6,
  duracaoAlvo: 30,
};

const BAUHAUS_SCENE_1 = `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#050807';
  ctx.fillRect(0, 0, W, H);

  // Grid arquitetônico suíço de alta precisão
  M.grid(ctx, W, H, t, { step: 80, color: 'rgba(16, 185, 129, 0.1)', drift: 12 });

  // Cubo Isométrico Wireframe com rotação pura
  const pCube = M.seg(t, 0.0, 0.6);
  const cubeScale = M.spring(pCube, 1.25, 0.6);
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.scale(cubeScale, cubeScale);
  M.cube(ctx, 0, 0, 170, { x: 0.6, y: t * 1.8, z: 0 }, { solid: false, strokeColor: '#10b981' });
  ctx.restore();

  // Tipografia Suíça Pura
  const tText = M.seg(t, 0.1, 0.55);
  ctx.save();
  M.kineticText(ctx, 'GRID SUÍÇO', W / 2, H * 0.68, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 110,
    color: '#f2fbf7',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText('// PROPORÇÃO ÁUREA & ISOMETRIA 3D', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Miras e réguas
  M.crosshair(ctx, 80, 150, 24, '#10b981');
  M.crosshair(ctx, W - 80, 150, 24, '#10b981');

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(5, 8, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const BAUHAUS_SCENE_2 = `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#060a08';
  ctx.fillRect(0, 0, W, H);

  // Monitor Bauhaus com matriz de alinhamento
  const pCard = M.seg(t, 0.0, 0.55);
  const cardScale = M.spring(pCard, 1.25, 0.6);
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.scale(cardScale, cardScale);
  M.monitor(ctx, 0, 0, 680, 420, t, {
    title: 'swiss_grid // coordinates.ts',
    codeLines: [
      '> grid: 1080x1920 MODULAR_SYSTEM',
      '> ratio: 1.618 GOLDEN_PROPORTION',
      '> alignment: AXIAL_PERFECTION',
      '> status: ARCHITECTURAL_RIGOR'
    ],
    hue: 155
  });
  ctx.restore();

  const tText = M.seg(t, 0.12, 0.6);
  ctx.save();
  M.kineticText(ctx, 'ARQUITETURA', W / 2, H * 0.68, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 104,
    color: '#ffffff',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#34d399';
    ctx.textAlign = 'center';
    ctx.fillText('// RESPIRO ESPACIAL & ELEGÂNCIA', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(5, 8, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const BAUHAUS_SCENE_3 = `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#050807';
  ctx.fillRect(0, 0, W, H);

  // Cubos 3D múltiplos em formação de torre
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  for (let i = -1; i <= 1; i++) {
    M.cube(ctx, i * 160, 0, 120, { x: t * 1.5 + i * 0.5, y: t * 2.0, z: 0 }, { solid: true, hue: 155 });
  }
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, 'MATRIZ MODULAR', W / 2, H * 0.68, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 100,
    color: '#f2fbf7',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText('// EQUILÍBRIO ENTRE PESO E VÁCUO', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Barra de progresso rítmica
  ctx.fillStyle = '#10b981';
  ctx.fillRect(80, H - 140, (W - 160) * t, 8);

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(5, 8, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const BAUHAUS_SCENE_4 = `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#050807';
  ctx.fillRect(0, 0, W, H);

  // Túnel Isométrico Hexagonal
  ctx.save();
  ctx.translate(W / 2, H * 0.44);
  M.tunnel(ctx, 0, 0, t, { sides: 6, speed: 2.5, color: '#10b981' });
  ctx.restore();

  const tText = M.seg(t, 0.08, 0.55);
  ctx.save();
  M.kineticText(ctx, 'PERSPECTIVA', W / 2, H * 0.68, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 104,
    color: '#ffffff',
    rise: 65,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#6ee7b7';
    ctx.textAlign = 'center';
    ctx.fillText('// EIXOS X, Y E Z EM HARMONIA', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(5, 8, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const BAUHAUS_SCENE_5 = `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#060a08';
  ctx.fillRect(0, 0, W, H);

  // Dashboard de Alta Rigidez Suíça
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  M.dashboard(ctx, 0, 0, 720, 440, t, {
    title: 'BAUHAUS // DIMENSÕES',
    mrr: '1.618',
    users: '100%',
    latency: '120 BPM'
  });
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, 'PICO DE CLAREZA', W / 2, H * 0.68, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 104,
    color: '#f2fbf7',
    rise: 55,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText('// ORDEM GRÁFICA SEM RUÍDO', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.9, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(5, 8, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

const BAUHAUS_SCENE_6 = `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#050807';
  ctx.fillRect(0, 0, W, H);

  // Esfera e Grid de Fechamento
  ctx.save();
  ctx.translate(W / 2, H * 0.38);
  M.sphere(ctx, 0, 0, 200, { x: t * 1.4, y: t * 2.0, z: 0 }, { hue: 155, connect: true });
  ctx.restore();

  ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 90, W - 120, H - 180);

  const tText = M.seg(t, 0.08, 0.55);
  ctx.save();
  M.kineticText(ctx, 'FORMA E FUNÇÃO', W / 2, H * 0.65, tText, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 96,
    color: '#ffffff',
    rise: 50,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.85);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText('BAUHAUS // SWISS MODERN 2026', W / 2, H * 0.76 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.92, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(5, 8, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

export function getBauhausSwissShowreel(): Showreel {
  const scenes: Scene[] = [
    {
      id: 'bauhaus_scene_1',
      name: 'GRID SUÍÇO // Abertura',
      duration: 5.0,
      role: 'gancho',
      description: 'Grid paramétrico 9:16 e cubo isométrico wireframe com rotação espacial pura.',
      code: BAUHAUS_SCENE_1,
      validated: true,
      compiledFn: compileSceneCode(BAUHAUS_SCENE_1),
    },
    {
      id: 'bauhaus_scene_2',
      name: 'ARQUITETURA // Coordenadas',
      duration: 5.0,
      role: 'corpo',
      description: 'Terminal neo-grotesco com proporção áurea e respiro estrutural.',
      code: BAUHAUS_SCENE_2,
      validated: true,
      compiledFn: compileSceneCode(BAUHAUS_SCENE_2),
    },
    {
      id: 'bauhaus_scene_3',
      name: 'MATRIZ MODULAR // 3D Espacial',
      duration: 5.0,
      role: 'corpo',
      description: 'Múltiplos cubos isométricos em equilíbrio modular.',
      code: BAUHAUS_SCENE_3,
      validated: true,
      compiledFn: compileSceneCode(BAUHAUS_SCENE_3),
    },
    {
      id: 'bauhaus_scene_4',
      name: 'PERSPECTIVA // Eixos X, Y, Z',
      duration: 5.0,
      role: 'corpo',
      description: 'Túnel hexagonal isométrico com aceleração paramétrica.',
      code: BAUHAUS_SCENE_4,
      validated: true,
      compiledFn: compileSceneCode(BAUHAUS_SCENE_4),
    },
    {
      id: 'bauhaus_scene_5',
      name: 'PICO DE CLAREZA // 120 BPM',
      duration: 5.0,
      role: 'clímax',
      description: 'Dashboard de precisão geométrica com contraste esmeralda e obsidiana.',
      code: BAUHAUS_SCENE_5,
      validated: true,
      compiledFn: compileSceneCode(BAUHAUS_SCENE_5),
    },
    {
      id: 'bauhaus_scene_6',
      name: 'FORMA E FUNÇÃO // Fechamento',
      duration: 5.0,
      role: 'fechamento',
      description: 'Assinatura moderna suíça com grid limpo e proporção perene.',
      code: BAUHAUS_SCENE_6,
      validated: true,
      compiledFn: compileSceneCode(BAUHAUS_SCENE_6),
    },
  ];

  const reel: Showreel = {
    id: 'bauhaus_swiss_grid_30s',
    title: 'Bauhaus & Swiss // Grid Paramétrico 3D (30s)',
    concept: 'Elegância brutalista suíça com perspectiva espacial: alinhamento milimétrico em grid vertical 9:16.',
    directorNotes: 'Geometria isométrica 3D rigorosa, tipografia neo-grotesca e respiro arquitetônico sem poluição visual.',
    totalDuration: 30,
    scenes,
    dna: BAUHAUS_SWISS_DNA,
    script: 'Elegância brutalista suíça com perspectiva espacial: alinhamento milimétrico em grid vertical 9:16, rotações isométricas puras, tipografia neo-grotesca e respiro arquitetônico.',
    generatedAt: Date.now(),
  };

  return autoCertifyShowreel(reel);
}

// -------------------------------------------------------------
// GET MASTER SHOWREEL POR PRESET INDEX OU ID
// -------------------------------------------------------------
export function getMasterShowreelByPreset(index: number): Showreel {
  switch (index) {
    case 0:
      return autoCertifyShowreel(getGarotoShowreel());
    case 1:
      return getClaudeOpusShowreel();
    case 2:
      return getSaulBassShowreel();
    case 3:
      return getBauhausSwissShowreel();
    default:
      return autoCertifyShowreel(getGarotoShowreel());
  }
}
