import { DNA, RoleType, Scene } from '../types/showreel';
import { compileSceneCode, M } from './proceduralFallback';
import { verifyScene } from './sceneVerifier';

export interface MotionArchetypeDef {
  id: string;
  name: string;
  category: 'core' | 'neural' | 'spatial' | 'data' | 'kinetic';
  keywords: string[];
  generateCode: (params: {
    dna: DNA;
    role: RoleType;
    index: number;
    title: string;
    headline: string;
    subheadline: string;
    seed: number;
  }) => string;
}

/**
 * Normaliza e sanitiza strings para código JS em Canvas
 */
function sanitize(str: string): string {
  if (!str) return '';
  return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, ' ').trim();
}

/**
 * 16 Arquétipos Cinematográficos Distintos de Motion Design em Canvas 2D
 * Garantindo diversidade visual infinita e ZERO repetição em um mesmo showreel.
 */
export const MOTION_ARCHETYPES: MotionArchetypeDef[] = [
  // 1. TERMINAL NEURAL & CÓDIGO
  {
    id: 'terminal_neural',
    name: 'Terminal Neural & Fluxo de Código',
    category: 'neural',
    keywords: ['software', 'código', 'prompt', 'dev', 'terminal', 'linha', 'compilador', 'programar', 'ia', 'script', 'construir'],
    generateCode: ({ dna, role, title, headline, subheadline }) => {
      const { paleta, tipografia, bpm } = dna;
      const h = sanitize(headline || title || 'TERMINAL IA');
      const sub = sanitize(subheadline || 'NÚCLEO ATIVO');
      return `function drawScene(ctx, t, W, H) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '${paleta.bg}');
  bg.addColorStop(0.5, '#070b18');
  bg.addColorStop(1, '#03050c');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  M.grid(ctx, W, H, t, { step: 90, color: 'rgba(56, 189, 248, 0.06)', drift: 16 });

  // Terminal Holográfico 3D
  const pCard = M.seg(t, 0.0, 0.55);
  const cardScale = M.spring(pCard, 1.25, 0.6);
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.scale(cardScale, cardScale);
  M.monitor(ctx, 0, 0, 720, 430, t, {
    title: 'neural_kernel // prompt.ts',
    codeLines: [
      '> kernel: INITIALIZING AI SYNTHESIS',
      '> prompt: "${h.slice(0, 32)}"',
      '> cadence: ${bpm} BPM [STABLE]',
      '> status: EXECUTING MOTION GRAPHICS'
    ],
    hue: 195
  });
  ctx.restore();

  // Tipografia Cinética
  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 104,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 2. MATRIZ DE CUBOS ISOMÉTRICOS 3D
  {
    id: 'spatial_cubes',
    name: 'Matriz de Cubos Isométricos 3D',
    category: 'spatial',
    keywords: ['arquitetura', 'estrutura', 'bloco', 'modular', 'sistema', 'engenharia', 'matriz', 'cubo', 'dimensão'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'ARQUITETURA');
      const sub = sanitize(subheadline || 'SISTEMA MODULAR');
      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  M.grid(ctx, W, H, t, { step: 100, color: 'rgba(255, 255, 255, 0.05)', drift: 20 });

  // Cubo central sombreado com rotação multi-eixo
  const pCube = M.seg(t, 0.0, 0.55);
  const cubeScale = M.spring(pCube, 1.3, 0.6);
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.scale(cubeScale, cubeScale);
  M.cube(ctx, 0, 0, 170, { x: t * 1.8, y: t * 2.2, z: t * 0.6 }, { solid: true, hue: 215 });
  M.rings(ctx, 0, 0, M.seg(t, 0.05, 0.6), { count: 4, gap: 55, color: '${paleta.secondary}' });
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 100,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.45
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Barra de progresso rítmica
  ctx.fillStyle = '${paleta.secondary}';
  ctx.fillRect(80, H - 140, (W - 160) * t, 8);

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 3. TÚNEL HIPERESPAÇO 3D & ACELERAÇÃO
  {
    id: 'warp_tunnel',
    name: 'Túnel Hiperespaço 3D & Aceleração',
    category: 'kinetic',
    keywords: ['velocidade', 'aceleração', 'viagem', 'túnel', 'tempo', 'futuro', 'hiperespaço', 'salto', 'rápido'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'ALTA VELOCIDADE');
      const sub = sanitize(subheadline || 'TRANSIÇÃO DINÂMICA');
      return `function drawScene(ctx, t, W, H) {
  const flash = t < 0.08 ? 1 - t / 0.08 : 0;
  ctx.fillStyle = flash > 0 ? 'rgba(56, 189, 248, ' + (flash * 0.25) + ')' : '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Túnel octogonal 3D com aceleração contínua
  ctx.save();
  ctx.translate(W / 2, H * 0.44);
  M.tunnel(ctx, 0, 0, t, { sides: 8, speed: 3.2, color: '${paleta.primary}' });
  M.rings(ctx, 0, 0, M.seg(t, 0.0, 0.5), { count: 5, gap: 50, color: '${paleta.accent}' });
  ctx.restore();

  const tText = M.seg(t, 0.08, 0.55);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 110,
    color: '${paleta.text}',
    rise: 65,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 38px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 16, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 4. DASHBOARD SAAS & MÉTRICAS
  {
    id: 'saas_dashboard',
    name: 'Interface SaaS & Métricas Vivas',
    category: 'data',
    keywords: ['interface', 'dashboard', 'usuários', 'métrica', 'gráfico', 'escala', 'mrr', 'produto', 'app', 'crescimento'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'TRAÇÃO SAAS');
      const sub = sanitize(subheadline || 'CRESCIMENTO EXPONENCIAL');
      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Dashboard de Alta Fidelidade
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  M.dashboard(ctx, 0, 0, 720, 440, t, {
    title: '${h.slice(0, 18).toUpperCase()} // MÉTRICAS',
    mrr: '$100K+',
    users: '100.000',
    latency: '1.2ms'
  });
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 100,
    color: '${paleta.text}',
    rise: 55,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 5. ESFERA SINÁPTICA & PARTÍCULAS
  {
    id: 'synapse_sphere',
    name: 'Esfera Sináptica & Partículas 3D',
    category: 'neural',
    keywords: ['neural', 'sinapse', 'cérebro', 'inteligência', 'pensamento', 'modelo', 'conexão', 'rede', 'núcleo'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'REDE NEURAL');
      const sub = sanitize(subheadline || 'CONEXÕES SINÁPTICAS');
      return `function drawScene(ctx, t, W, H) {
  const bg = ctx.createRadialGradient(W / 2, H * 0.44, 80, W / 2, H * 0.44, H * 0.65);
  bg.addColorStop(0, '#0c1836');
  bg.addColorStop(0.6, '#060a18');
  bg.addColorStop(1, '${paleta.bg}');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Esfera 3D de Partículas conectadas
  ctx.save();
  ctx.translate(W / 2, H * 0.43);
  M.sphere(ctx, 0, 0, 195, { x: t * 1.5, y: t * 2.2, z: 0.2 }, { hue: 200, connect: true });
  M.rings(ctx, 0, 0, M.seg(t, 0.05, 0.6), { count: 4, gap: 55, color: '${paleta.primary}' });
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 104,
    color: '${paleta.text}',
    rise: 65,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 16, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 6. REDE GLOBAL & TRAÇÃO MUNDIAL
  {
    id: 'global_network',
    name: 'Rede Global & Tração Mundial',
    category: 'data',
    keywords: ['mundo', 'global', 'tração', 'países', 'planeta', 'alcance', '100.000', 'milhões', 'mapa', 'escala'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'ESCALA GLOBAL');
      const sub = sanitize(subheadline || '100.000 USUÁRIOS NO MUNDO');
      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Globo com Meridianos e Rotas
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  const rot = t * 2.5;
  ctx.strokeStyle = '${paleta.primary}';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 190, 0, Math.PI * 2);
  ctx.stroke();

  // Elipses orbitais representando latitude/longitude
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate(rot + (i * Math.PI) / 4);
    ctx.scale(1, 0.45);
    ctx.beginPath();
    ctx.arc(0, 0, 185, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  M.rings(ctx, 0, 0, M.seg(t, 0.05, 0.6), { count: 3, gap: 60, color: '${paleta.accent}' });
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 100,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.45
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 7. SILHUETA DO FUNDADOR & ILUMINAÇÃO VOLUMÉTRICA
  {
    id: 'founder_silhouette',
    name: 'Silhueta do Fundador & Neon Volumétrico',
    category: 'core',
    keywords: ['garoto', 'homem', 'mulher', 'fundador', 'pessoa', 'herói', 'silhueta', 'sozinho', 'quarto', 'madrugada', '03:42'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || '03:42 AM');
      const sub = sanitize(subheadline || 'CONSTRUINDO NA MADRUGADA');
      return `function drawScene(ctx, t, W, H) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#04050a');
  bg.addColorStop(0.5, '#070a16');
  bg.addColorStop(1, '#0c1228');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  M.grid(ctx, W, H, t, { step: 95, color: 'rgba(56, 189, 248, 0.05)', drift: 18 });

  // Monitor e Silhueta
  const pEase = M.spring(M.seg(t, 0.0, 0.6), 1.25, 0.55);
  M.character(ctx, W / 2, H * 0.58 + (1 - pEase) * 60, 1.2, t, 195);

  const tText = M.seg(t, 0.08, 0.55);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.22, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 130,
    color: '${paleta.text}',
    rise: 65,
    spread: 0.45
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 38px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.78 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 5, 10, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 8. EQUALIZADOR DE ONDAS & FREQUÊNCIA BPM
  {
    id: 'soundwave_frequency',
    name: 'Equalizador de Ondas & Frequência BPM',
    category: 'kinetic',
    keywords: ['ritmo', 'som', 'música', 'bpm', 'onda', 'frequência', 'áudio', 'ressonância', 'batida'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia, bpm } = dna;
      const h = sanitize(headline || title || 'RESSONÂNCIA');
      const sub = sanitize(subheadline || `${bpm} BPM SINCRONIZADO`);
      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Equalizador de Frequência Sonora
  const bars = 16;
  const barW = 28;
  const gap = 16;
  const totalW = bars * (barW + gap) - gap;
  const startX = (W - totalW) / 2;

  ctx.save();
  for (let i = 0; i < bars; i++) {
    const p = M.stagger(M.seg(t, 0.0, 0.6), i, bars, 0.3);
    const wave = Math.sin(t * 12 + i * 0.6) * 0.5 + 0.5;
    const barH = 120 + wave * 220 * M.spring(p, 1.4, 0.6);
    ctx.fillStyle = i % 2 === 0 ? '${paleta.primary}' : '${paleta.accent}';
    ctx.fillRect(startX + i * (barW + gap), H * 0.44 - barH / 2, barW, barH);
  }
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 104,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.secondary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 9. GRID SUÍÇO BRUTALISTA & PROPORÇÃO ÁUREA
  {
    id: 'swiss_grid',
    name: 'Grid Suíço Paramétrico & Proporção Áurea',
    category: 'spatial',
    keywords: ['geométrico', 'isometria', 'ângulo', 'prisma', 'suíço', 'grid', 'linhas', 'proporção'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'GRID SUÍÇO');
      const sub = sanitize(subheadline || 'PROPORÇÃO ÁUREA 1.618');
      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  M.grid(ctx, W, H, t, { step: 80, color: 'rgba(255, 255, 255, 0.08)', drift: 12 });

  // Retícula Isométrica Wireframe
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  M.cube(ctx, 0, 0, 180, { x: 0.6, y: t * 1.8, z: 0 }, { solid: false, strokeColor: '${paleta.primary}' });
  ctx.restore();

  // Miras milimétricas HUD
  M.crosshair(ctx, 80, 160, 26, '${paleta.accent}');
  M.crosshair(ctx, W - 80, 160, 26, '${paleta.accent}');

  const tText = M.seg(t, 0.1, 0.55);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 110,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 10. DETONAÇÃO DE ENERGIA & ANÉIS DE CHOQUE
  {
    id: 'shockwave_rings',
    name: 'Detonação de Energia & Anéis de Choque',
    category: 'kinetic',
    keywords: ['explosão', 'faísca', 'energia', 'detonação', 'choque', 'voltagem', 'raio', 'força'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'VOLTAGEM MÁXIMA');
      const sub = sanitize(subheadline || 'ONDA DE CHOQUE CINÉTICA');
      return `function drawScene(ctx, t, W, H) {
  const bg = ctx.createRadialGradient(W / 2, H * 0.43, 60, W / 2, H * 0.43, H * 0.6);
  bg.addColorStop(0, '#1c1028');
  bg.addColorStop(0.6, '#080514');
  bg.addColorStop(1, '${paleta.bg}');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Anéis expansivos de choque concêntricos
  M.rings(ctx, W / 2, H * 0.43, M.seg(t, 0.0, 0.65), { count: 6, gap: 45, color: '${paleta.accent}', w: 3 });

  // Núcleo estroboscópico
  const pCore = M.seg(t, 0.0, 0.5);
  const coreScale = M.spring(pCore, 1.4, 0.55);
  ctx.save();
  ctx.translate(W / 2, H * 0.43);
  ctx.scale(coreScale, coreScale);
  ctx.fillStyle = '${paleta.primary}';
  ctx.beginPath();
  ctx.arc(0, 0, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const tText = M.seg(t, 0.08, 0.55);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 104,
    color: '${paleta.text}',
    rise: 65,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.secondary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(6, 4, 14, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 11. GIROSCÓPIO QUÂNTICO MULTI-EIXO
  {
    id: 'quantum_gyroscope',
    name: 'Giroscópio Quântico Multi-Eixo',
    category: 'spatial',
    keywords: ['órbita', 'giroscópio', 'física', 'gravidade', 'átomo', 'quântico', 'esferas'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'FÍSICA QUÂNTICA');
      const sub = sanitize(subheadline || 'ÓRBITA EM EQUILÍBRIO');
      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Giroscópio 3D com anéis em rotações opostas
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.lineWidth = 4;
  for (let i = 0; i < 3; i++) {
    ctx.save();
    ctx.rotate(t * (2.0 + i * 0.8) * (i % 2 === 0 ? 1 : -1));
    ctx.scale(1, 0.35 + i * 0.15);
    ctx.strokeStyle = i === 0 ? '${paleta.primary}' : i === 1 ? '${paleta.secondary}' : '${paleta.accent}';
    ctx.beginPath();
    ctx.arc(0, 0, 160 + i * 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 100,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 12. CORTES CINÉTICOS EM FATIAS DIAGONAIS
  {
    id: 'kinetic_slashes',
    name: 'Cortes Cinéticos em Fatias Diagonais',
    category: 'kinetic',
    keywords: ['corte', 'fatia', 'rasgo', 'diagonal', 'contraste', 'impacto', 'tensão'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'CORTE CINÉTICO');
      const sub = sanitize(subheadline || 'TENSÃO GEOMÉTRICA');
      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Faixa diagonal cortando a tela em 45 graus
  const pSlash = M.seg(t, 0.0, 0.45);
  const slashEase = M.spring(pSlash, 1.35, 0.55);
  ctx.save();
  ctx.translate(W / 2, H * 0.44);
  ctx.rotate(-0.16);
  ctx.fillStyle = '${paleta.primary}';
  const sw = W * 1.6;
  const sh = 280 * slashEase;
  ctx.fillRect(-sw / 2, -sh / 2, sw, sh);
  ctx.restore();

  const tText = M.seg(t, 0.08, 0.55);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.44, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 120,
    color: '#000000',
    rise: 65,
    spread: 0.45
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 38px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 13. CHUVA DE DADOS & FLUXO BINÁRIO
  {
    id: 'matrix_stream',
    name: 'Chuva de Dados & Telemetria em Fluxo',
    category: 'data',
    keywords: ['dados', 'binário', 'fluxo', 'telemetria', 'stream', 'matriz', 'matriz de dados'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'FLUXO DE DADOS');
      const sub = sanitize(subheadline || 'TELEMETRIA EM TEMPO REAL');
      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Colunas de dados fluindo
  const cols = 8;
  const colW = W / cols;
  ctx.save();
  ctx.font = '600 24px "${tipografia.bodyFont}", monospace';
  ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
  for (let c = 0; c < cols; c++) {
    const yOffset = ((t * 800 + c * 140) % (H * 0.8));
    ctx.fillText('0x' + (c * 23).toString(16).toUpperCase(), c * colW + 20, yOffset);
    ctx.fillText('> SYNC', c * colW + 20, yOffset + 50);
  }
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 100,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 14. VARREDURA DE RADAR & RETÍCULA HUD
  {
    id: 'radar_sweep',
    name: 'Varredura de Radar & Retícula HUD',
    category: 'data',
    keywords: ['radar', 'rastreamento', 'varredura', 'busca', 'detectado', 'satélite', 'mira'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'ALVO LOCALIZADO');
      const sub = sanitize(subheadline || 'VARREDURA RADAR 360°');
      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Círculos concêntricos e varredura angular
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 180, 0, Math.PI * 2);
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.stroke();

  // Feixe de varredura rotativo
  const angle = t * Math.PI * 4;
  ctx.save();
  ctx.rotate(angle);
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 180, 0, Math.PI / 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 96,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 15. CARDS ISOMÉTRICOS EM PROFUNDIDADE Z-DEPTH
  {
    id: 'floating_cards',
    name: 'Cards Isométricos em Profundidade Z-Depth',
    category: 'spatial',
    keywords: ['camadas', 'cards', 'profundidade', 'vidro', 'holográfico', 'z-depth', 'perspectiva'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || '5 CAMADAS Z');
      const sub = sanitize(subheadline || 'PROFUNDIDADE ESPACIAL');
      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // 3 Cards flutuantes em cascata
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  for (let i = 0; i < 3; i++) {
    const p = M.stagger(M.seg(t, 0.0, 0.6), i, 3, 0.3);
    const scale = M.spring(p, 1.3, 0.6);
    const offsetY = -80 + i * 80;
    ctx.save();
    ctx.translate(0, offsetY);
    ctx.scale(scale, scale);
    ctx.fillStyle = i === 1 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.08)';
    ctx.strokeStyle = i === 1 ? '${paleta.primary}' : 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.fillRect(-260, -50, 520, 100);
    ctx.strokeRect(-260, -50, 520, 100);
    ctx.restore();
  }
  ctx.restore();

  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 104,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.4
  });
  ctx.restore();

  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.secondary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 16. RESOLUÇÃO HEROICA & ASSINATURA MONUMENTAL
  {
    id: 'hero_resolution',
    name: 'Resolução Heroica & Assinatura Monumental',
    category: 'core',
    keywords: ['fechamento', 'futuro', 'vitória', 'próximo', 'você', 'assinatura', 'resolução', 'final'],
    generateCode: ({ dna, title, headline, subheadline }) => {
      const { paleta, tipografia } = dna;
      const h = sanitize(headline || title || 'O PRÓXIMO É VOCÊ');
      const sub = sanitize(subheadline || 'CONSTRUA O FUTURO COM IA');
      return `function drawScene(ctx, t, W, H) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '${paleta.bg}');
  bg.addColorStop(1, '#020306');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Moldura Arquitetônica Heroica
  ctx.strokeStyle = '${paleta.primary}';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 90, W - 120, H - 180);

  // Esfera e retícula central
  ctx.save();
  ctx.translate(W / 2, H * 0.38);
  M.sphere(ctx, 0, 0, 190, { x: t * 1.4, y: t * 2.0, z: 0 }, { hue: 195, connect: true });
  ctx.restore();

  const tText = M.seg(t, 0.08, 0.55);
  ctx.save();
  M.kineticText(ctx, '${h.slice(0, 16)}', W / 2, H * 0.65, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 100,
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
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${sub.slice(0, 32)}', W / 2, H * 0.76 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.92, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(2, 3, 6, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },
];

/**
 * Divide o roteiro geral em fragmentos correspondentes a cada cena.
 */
export function segmentScriptIntoScenes(scriptText: string, sceneCount: number): string[] {
  if (!scriptText || scriptText.trim().length === 0) {
    return Array.from({ length: sceneCount }, (_, i) => `Cena 0${i + 1}`);
  }

  // Dividir por pontos finais, dois-pontos ou vírgulas de pausa
  const rawParts = scriptText
    .split(/(?:\. |\.\n|: |\n+)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  if (rawParts.length >= sceneCount) {
    return rawParts.slice(0, sceneCount);
  }

  // Se houver menos partes que cenas, subdividir por vírgulas ou duplicar proporcionalmente
  const subParts: string[] = [];
  for (const part of rawParts) {
    const commaParts = part.split(', ').filter((s) => s.trim().length > 4);
    if (commaParts.length > 1 && subParts.length + commaParts.length <= sceneCount) {
      subParts.push(...commaParts);
    } else {
      subParts.push(part);
    }
  }

  while (subParts.length < sceneCount) {
    const idx = subParts.length;
    subParts.push(`Progressão Narrativa 0${idx + 1}: ${scriptText.slice(0, 30)}...`);
  }

  return subParts.slice(0, sceneCount);
}

/**
 * Seleciona o melhor arquétipo para o fragmento do roteiro daquela cena,
 * garantindo ZERO repetição em relação aos arquétipos já utilizados no showreel.
 */
export function selectBestArchetype(
  snippet: string,
  role: RoleType,
  usedArchetypeIds: Set<string>
): MotionArchetypeDef {
  const lowerSnippet = snippet.toLowerCase();

  // Calcular score de afinidade com base nas palavras-chave
  const scored = MOTION_ARCHETYPES.map((arch) => {
    let score = 0;

    // Bônus se já foi usado (penalidade severa para evitar repetição!)
    if (usedArchetypeIds.has(arch.id)) {
      score -= 1000;
    }

    // Match de palavras-chave
    for (const kw of arch.keywords) {
      if (lowerSnippet.includes(kw)) {
        score += 10;
      }
    }

    // Afinidade dramática de papel
    if (role === 'gancho' && (arch.id === 'founder_silhouette' || arch.id === 'terminal_neural' || arch.id === 'shockwave_rings')) {
      score += 5;
    } else if (role === 'clímax' && (arch.id === 'warp_tunnel' || arch.id === 'shockwave_rings' || arch.id === 'saas_dashboard')) {
      score += 5;
    } else if (role === 'fechamento' && (arch.id === 'hero_resolution' || arch.id === 'synapse_sphere' || arch.id === 'swiss_grid')) {
      score += 5;
    }

    // Leve variação estocástica para quebrar empates
    score += Math.random() * 2;

    return { arch, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Selecionar o de maior pontuação
  return scored[0]?.arch || MOTION_ARCHETYPES[0];
}

/**
 * Extrai título e chamada curta para a cena a partir do fragmento do roteiro
 */
function extractHeadlineAndSub(snippet: string, role: RoleType): { headline: string; subheadline: string } {
  const clean = snippet.replace(/^[^a-zA-Z0-9À-ÿ]+/, '').trim();
  const words = clean.split(/\s+/);

  let headline = '';
  let subheadline = '';

  if (words.length <= 4) {
    headline = words.join(' ').toUpperCase();
    subheadline = clean.toUpperCase();
  } else {
    headline = words.slice(0, 3).join(' ').toUpperCase();
    subheadline = words.slice(3, 10).join(' ').toUpperCase();
  }

  if (role === 'gancho' && words.some((w) => w.includes(':') || w.toLowerCase().includes('madrugada'))) {
    headline = '03:42 AM';
  } else if (role === 'fechamento' && !headline) {
    headline = 'CONSTRUA COM IA';
  }

  return { headline, subheadline };
}

/**
 * Gera um conjunto completo de cenas de showreel com:
 * 1. Animações aleatórias sem repetição entre cenas.
 * 2. Visual estritamente alinhado com o roteiro daquela cena.
 * 3. 100% de compilação garantida e verificada.
 */
export function generateDiverseShowreelScenes(
  dna: DNA,
  scriptText: string
): Scene[] {
  const count = Math.max(6, dna.numeroCenas || 6);
  const avgDuration = Number((dna.duracaoAlvo / count).toFixed(1));
  const scriptSnippets = segmentScriptIntoScenes(scriptText, count);

  const usedArchetypeIds = new Set<string>();
  const scenes: Scene[] = [];

  for (let i = 0; i < count; i++) {
    const role: RoleType =
      i === 0 ? 'gancho' : i === count - 1 ? 'fechamento' : i === count - 2 ? 'clímax' : 'corpo';

    const snippet = scriptSnippets[i] || `Momento 0${i + 1}`;
    const archetype = selectBestArchetype(snippet, role, usedArchetypeIds);
    usedArchetypeIds.add(archetype.id);

    const { headline, subheadline } = extractHeadlineAndSub(snippet, role);
    const sceneName = `${i + 1}. ${headline || archetype.name}`;

    const code = archetype.generateCode({
      dna,
      role,
      index: i,
      title: sceneName,
      headline,
      subheadline,
      seed: i + Date.now(),
    });

    const compiledFn = compileSceneCode(code);
    const sceneDraft: Scene = {
      id: `scene_${i + 1}`,
      name: sceneName,
      duration: avgDuration,
      role,
      code,
      description: `${archetype.name} (baseado em: "${snippet.slice(0, 60)}...")`,
      scriptSnippet: snippet,
      archetypeId: archetype.id,
      archetypeName: archetype.name,
      validated: true,
      compiledFn,
    };

    const diag = verifyScene(sceneDraft, dna, true);
    sceneDraft.verification = diag;
    sceneDraft.validated = diag.valid;

    scenes.push(sceneDraft);
  }

  return scenes;
}

/**
 * Regenera a animação de UMA cena específica escolhendo um arquétipo aleatório
 * que ainda não esteja sendo usado nas outras cenas do showreel.
 */
export function regenerateSceneAnimationWithoutRepeat(
  dna: DNA,
  scene: Scene,
  otherScenes: Scene[],
  index: number
): Scene {
  const usedIds = new Set<string>(
    otherScenes
      .filter((s) => s.id !== scene.id && s.archetypeId)
      .map((s) => s.archetypeId as string)
  );

  const snippet = scene.scriptSnippet || scene.name;
  const newArchetype = selectBestArchetype(snippet, scene.role, usedIds);

  const { headline, subheadline } = extractHeadlineAndSub(snippet, scene.role);
  const newCode = newArchetype.generateCode({
    dna,
    role: scene.role,
    index,
    title: scene.name,
    headline,
    subheadline,
    seed: Date.now() + Math.random(),
  });

  const compiledFn = compileSceneCode(newCode);
  const updatedScene: Scene = {
    ...scene,
    code: newCode,
    archetypeId: newArchetype.id,
    archetypeName: newArchetype.name,
    description: `${newArchetype.name} (${snippet.slice(0, 45)}...)`,
    compiledFn,
  };

  const diag = verifyScene(updatedScene, dna, true);
  updatedScene.verification = diag;
  updatedScene.validated = diag.valid;

  return updatedScene;
}
