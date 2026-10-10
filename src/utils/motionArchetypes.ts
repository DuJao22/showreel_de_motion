import { DNA, RoleType, Scene, Showreel } from '../types/showreel';
import { compileSceneCode } from './proceduralFallback';
import { autoCertifyShowreel } from './sceneVerifier';
import { getRandomInt } from './dnaGenerator';

export interface ScriptSceneAnalysis {
  headline: string;
  subtext: string;
  semanticTheme:
    | 'night_spark'
    | 'ai_prompt'
    | 'code_dev'
    | 'ui_launch'
    | 'metrics_traction'
    | 'future_vision'
    | 'structure_grid'
    | 'sound_frequency';
  role: RoleType;
}

export interface MotionArchetypeDef {
  id: string;
  name: string;
  category: string;
  themes: string[];
  generator: (params: {
    headline: string;
    subtext: string;
    dna: DNA;
    role: RoleType;
    index: number;
    total: number;
    seed: number;
  }) => string;
}

/**
 * 12 Archetypes de Motion Design de Alto Nível Cinematográfico (Canvas 2D 9:16)
 * Todos utilizam a biblioteca M (motionLib) e física harmônica de molas.
 */
export const MOTION_ARCHETYPES: MotionArchetypeDef[] = [
  // 1. TERMINAL / CÓDIGO
  {
    id: 'terminal_code',
    name: 'Terminal & Arquitetura de Código',
    category: 'Cyber Tech',
    themes: ['code_dev', 'ai_prompt', 'night_spark'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  // Fundo com vinheta de estúdio
  const bg = ctx.createRadialGradient(W / 2, H * 0.45, 100, W / 2, H * 0.45, W);
  bg.addColorStop(0, '#0c1020');
  bg.addColorStop(1, '${paleta.bg}');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Grid técnico de fundo
  M.grid(ctx, W, H, t, { step: 90, color: 'rgba(255, 255, 255, 0.04)', drift: 12 });

  // Monitor / Janela de Terminal com mola
  const pWindow = M.seg(t, 0.0, 0.55);
  const winScale = M.spring(pWindow, 1.25, 0.55);
  ctx.save();
  ctx.translate(W / 2, H * 0.40);
  ctx.scale(winScale, winScale);
  M.monitor(ctx, 0, 0, 720, 440, t, {
    title: 'arch // core_${index + 1}.ts',
    codeLines: [
      '> import { NeuralAgent } from "@engine/core"',
      '> const system = await NeuralAgent.init()',
      '> [EXECUTION]: SYNCHRONIZING WITH KINETIC BUS',
      '> state: ACTIVE // CADENCE: ${bpm} BPM'
    ],
    cursor: true,
    hue: 195
  });
  ctx.restore();

  // Tipografia Cinética de Destaque
  const pText = M.seg(t, 0.1, 0.65);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.68, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 96,
    color: '${paleta.text}',
    rise: 50,
    spread: 0.4
  });
  ctx.restore();

  // Subtítulo de Apoio
  const pSub = M.seg(t, 0.35, 0.82);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 34px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${cleanS}'.toUpperCase(), W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Crosshairs de precisão
  M.crosshair(ctx, 80, 160, 24, '${paleta.accent}');
  M.crosshair(ctx, W - 80, 160, 24, '${paleta.accent}');

  // Transição de saída
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
    id: 'isometric_cubes',
    name: 'Estrutura Isométrica 3D & Cubos',
    category: 'Spatial 3D',
    themes: ['structure_grid', 'night_spark', 'code_dev'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Grid paramétrico isométrico
  M.grid(ctx, W, H, t, { step: 80, color: 'rgba(255, 255, 255, 0.05)', drift: 20 });

  // Grupo de Cubos 3D com física de molas
  const pIntro = M.seg(t, 0.0, 0.55);
  const scale = M.spring(pIntro, 1.3, 0.55);
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.scale(scale, scale);

  // Cubo central sólido
  M.cube(ctx, 0, 0, 170, { x: t * 1.8, y: t * 2.2, z: t * 0.5 }, { solid: true, hue: 205 });

  // Orbitais concêntricos
  M.rings(ctx, 0, 0, M.seg(t, 0.05, 0.65), { count: 4, gap: 55, color: '${paleta.primary}' });
  ctx.restore();

  // Tipografia Cinética
  const pText = M.seg(t, 0.1, 0.62);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.68, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 100,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.45
  });
  ctx.restore();

  // Legenda e BPM
  const pSub = M.seg(t, 0.35, 0.8);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.secondary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${cleanS}'.toUpperCase(), W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Barra de progresso rítmica
  ctx.fillStyle = '${paleta.primary}';
  ctx.fillRect(80, H - 140, (W - 160) * t, 10);

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(3, 5, 10, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 3. RADAR & ANÉIS CONCÊNTRICOS HUD
  {
    id: 'hud_radar_rings',
    name: 'Radar HUD & Anéis Cinéticos',
    category: 'Precision Motion',
    themes: ['sound_frequency', 'ai_prompt', 'night_spark'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '${paleta.bg}');
  bg.addColorStop(0.5, '#0a0e1c');
  bg.addColorStop(1, '#04060e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Radar central com scanner rotativo
  const cx = W / 2;
  const cy = H * 0.41;
  const pRad = M.seg(t, 0.0, 0.6);
  const sRad = M.spring(pRad, 1.3, 0.6);

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(sRad, sRad);

  // Anéis concêntricos com espessura refinada
  M.rings(ctx, 0, 0, M.seg(t, 0.05, 0.6), { count: 5, gap: 50, color: '${paleta.primary}', w: 2 });

  // Feixe de varredura rotativa
  const angle = t * Math.PI * 4;
  ctx.save();
  ctx.rotate(angle);
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, 260);
  grad.addColorStop(0, '${paleta.primary}');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 260, 0, Math.PI / 4);
  ctx.closePath();
  ctx.globalAlpha = 0.35;
  ctx.fill();
  ctx.restore();

  // Núcleo central pulsante
  ctx.fillStyle = '${paleta.accent}';
  ctx.beginPath();
  ctx.arc(0, 0, 16 + Math.sin(t * 12) * 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Tipografia Cinética
  const pText = M.seg(t, 0.1, 0.65);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.68, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 98,
    color: '${paleta.text}',
    rise: 55,
    spread: 0.4
  });
  ctx.restore();

  // Subtítulo
  const pSub = M.seg(t, 0.35, 0.82);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 34px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${cleanS}'.toUpperCase(), W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Quatro miras nos cantos
  M.crosshair(ctx, 90, 160, 26, '${paleta.primary}');
  M.crosshair(ctx, W - 90, 160, 26, '${paleta.primary}');
  M.crosshair(ctx, 90, H - 220, 26, '${paleta.primary}');
  M.crosshair(ctx, W - 90, H - 220, 26, '${paleta.primary}');

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 4. CONTADOR DE MÉTRICAS & GRÁFICO EXPLOSIVO
  {
    id: 'metrics_counter',
    name: 'Métricas, Escala & Gráfico Exponencial',
    category: 'Data Motion',
    themes: ['metrics_traction', 'ui_launch', 'future_vision'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Grid com drift vertical
  M.grid(ctx, W, H, t, { step: 90, color: 'rgba(255, 255, 255, 0.05)', drift: 18 });

  // Dashboard de Alta Performance
  const pDash = M.seg(t, 0.0, 0.55);
  const sDash = M.spring(pDash, 1.25, 0.6);
  ctx.save();
  ctx.translate(W / 2, H * 0.41);
  ctx.scale(sDash, sDash);

  // Placa de fundo do Dashboard
  const dw = 720;
  const dh = 440;
  ctx.fillStyle = 'rgba(12, 16, 28, 0.85)';
  ctx.strokeStyle = '${paleta.primary}';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-dw / 2, -dh / 2, dw, dh, 24);
  ctx.fill();
  ctx.stroke();

  // Contador de usuários / tração progressivo
  const pCount = M.seg(t, 0.1, 0.85);
  const countVal = Math.floor(M.ease.outExpo(pCount) * 100000);
  const fmt = countVal >= 1000 ? (countVal / 1000).toFixed(0) + 'K+' : countVal.toString();

  ctx.font = '900 100px "${tipografia.displayFont}", sans-serif';
  ctx.fillStyle = '${paleta.text}';
  ctx.textAlign = 'center';
  ctx.fillText(fmt, 0, -20);

  ctx.font = '700 28px "${tipografia.bodyFont}", monospace';
  ctx.fillStyle = '${paleta.accent}';
  ctx.fillText('USUÁRIOS ATIVOS // CRESCIMENTO', 0, 35);

  // Linha de sparkline com curva exponencial
  ctx.strokeStyle = '${paleta.secondary}';
  ctx.lineWidth = 5;
  ctx.beginPath();
  const graphP = M.seg(t, 0.15, 0.9);
  const graphW = dw - 120;
  const startX = -graphW / 2;
  const endX = startX + graphW * graphP;
  ctx.moveTo(startX, 150);
  for (let x = startX; x <= endX; x += 10) {
    const norm = (x - startX) / graphW;
    const y = 150 - Math.pow(norm, 2.2) * 75 - Math.sin(norm * 14 + t * 4) * 8;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();

  // Tipografia Cinética
  const pText = M.seg(t, 0.12, 0.65);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.68, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 96,
    color: '${paleta.text}',
    rise: 50,
    spread: 0.4
  });
  ctx.restore();

  // Subtítulo
  const pSub = M.seg(t, 0.35, 0.82);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 34px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${cleanS}'.toUpperCase(), W / 2, H * 0.77 + (1 - e) * 20);
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

  // 5. ESTILO SUÍÇO BRUTALISTA / BLOCOS TIPOGRÁFICOS
  {
    id: 'swiss_kinetic_blocks',
    name: 'Swiss Brutalist & Cortes Cinéticos',
    category: 'Editorial Swiss',
    themes: ['structure_grid', 'future_vision', 'ai_prompt'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Blocos retangulares de corte suíço entrando com molas
  const pBlock = M.seg(t, 0.0, 0.5);
  const blockW = M.spring(pBlock, 1.2, 0.6) * (W - 120);

  ctx.fillStyle = '${paleta.primary}';
  ctx.fillRect(60, H * 0.22, blockW, 14);

  // Moldura arquitetônica com medidas
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 120, W - 120, H - 240);

  // Bloco de acento colorido em movimento
  const pAccent = M.seg(t, 0.1, 0.7);
  const accY = H * 0.38 + Math.sin(t * 3) * 20;
  ctx.fillStyle = '${paleta.secondary}';
  ctx.globalAlpha = 0.2;
  ctx.fillRect(80, accY, W - 160, 180);
  ctx.globalAlpha = 1.0;

  // Tipografia Monumental de Poster Suíço
  const pText = M.seg(t, 0.08, 0.6);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.48, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 110,
    color: '${paleta.text}',
    rise: 70,
    spread: 0.5
  });
  ctx.restore();

  // Linhas de numeração suíça
  ctx.font = '800 28px "${tipografia.bodyFont}", monospace';
  ctx.fillStyle = '${paleta.accent}';
  ctx.fillText('0${index + 1} / SWISS GRID', 100, 180);

  // Subtítulo
  const pSub = M.seg(t, 0.35, 0.85);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.text}';
    ctx.textAlign = 'center';
    ctx.fillText('${cleanS}'.toUpperCase(), W / 2, H * 0.72 + (1 - e) * 20);
    ctx.restore();
  }

  // Transição de saída
  const out = M.ease.inOutCubic(M.seg(t, 0.9, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(3, 4, 8, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 6. ESFERA NEURAL & REDE DE CONSTELAÇÃO
  {
    id: 'neural_constellation',
    name: 'Rede Neural & Constelação 3D',
    category: 'AI Synthesis',
    themes: ['ai_prompt', 'night_spark', 'future_vision'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  const bg = ctx.createRadialGradient(W / 2, H * 0.42, 60, W / 2, H * 0.42, W);
  bg.addColorStop(0, '#0f172a');
  bg.addColorStop(1, '${paleta.bg}');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Esfera de partículas 3D conectada
  const pSphere = M.seg(t, 0.0, 0.55);
  const sScale = M.spring(pSphere, 1.25, 0.6);
  ctx.save();
  ctx.translate(W / 2, H * 0.41);
  ctx.scale(sScale, sScale);
  M.sphere(ctx, 0, 0, 190, { x: t * 1.4, y: t * 2.0, z: t * 0.3 }, { hue: 195, connect: true });
  ctx.restore();

  // Tipografia Cinética
  const pText = M.seg(t, 0.1, 0.65);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.68, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 96,
    color: '${paleta.text}',
    rise: 50,
    spread: 0.4
  });
  ctx.restore();

  // Subtítulo
  const pSub = M.seg(t, 0.35, 0.82);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 34px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${cleanS}'.toUpperCase(), W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Crosshair
  M.crosshair(ctx, 80, 160, 24, '${paleta.accent}');
  M.crosshair(ctx, W - 80, 160, 24, '${paleta.accent}');

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 7. TÚNEL GEOMÉTRICO 3D / WARP SPEED
  {
    id: 'warp_tunnel',
    name: 'Túnel Geométrico & Aceleração Warp',
    category: 'Hyper Motion',
    themes: ['sound_frequency', 'future_vision', 'metrics_traction'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  // Flash de aceleração inicial
  const flash = t < 0.08 ? (1 - t / 0.08) * 0.6 : 0;
  ctx.fillStyle = flash > 0 ? 'rgba(255, 255, 255, ' + flash + ')' : '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Túnel 3D em perspectiva central
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  M.tunnel(ctx, 0, 0, t, { sides: 8, speed: 2.8, color: '${paleta.primary}' });
  M.rings(ctx, 0, 0, M.seg(t, 0.0, 0.5), { count: 6, gap: 55, color: '${paleta.accent}' });
  ctx.restore();

  // Tipografia monumental de alta energia
  const pText = M.seg(t, 0.06, 0.55);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.68, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 110,
    color: '${paleta.text}',
    rise: 65,
    spread: 0.45
  });
  ctx.restore();

  // Subtítulo
  const pSub = M.seg(t, 0.32, 0.8);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 38px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${cleanS}'.toUpperCase(), W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.9, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(2, 3, 6, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 8. INTERFACE DE APLICATIVO / UI WINDOW GLASS
  {
    id: 'glass_ui_window',
    name: 'Interface de Aplicativo & Glassmorphism',
    category: 'Product Motion',
    themes: ['ui_launch', 'code_dev', 'metrics_traction'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Grid suave de fundo
  M.grid(ctx, W, H, t, { step: 80, color: 'rgba(255, 255, 255, 0.05)', drift: 14 });

  // Janela UI com cantos arredondados e física de mola
  const pUi = M.seg(t, 0.0, 0.55);
  const sUi = M.spring(pUi, 1.25, 0.6);
  ctx.save();
  ctx.translate(W / 2, H * 0.41);
  ctx.scale(sUi, sUi);

  const uw = 700;
  const uh = 430;
  // Fundo de vidro
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeStyle = '${paleta.primary}';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-uw / 2, -uh / 2, uw, uh, 20);
  ctx.fill();
  ctx.stroke();

  // Barra de título da janela
  ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
  ctx.beginPath();
  ctx.roundRect(-uw / 2, -uh / 2, uw, 60, [20, 20, 0, 0]);
  ctx.fill();

  // Botões de janela estilo macOS
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(-uw / 2 + 40, -uh / 2 + 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(-uw / 2 + 65, -uh / 2 + 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(-uw / 2 + 90, -uh / 2 + 30, 8, 0, Math.PI * 2);
  ctx.fill();

  // Título na barra
  ctx.font = '700 24px "${tipografia.bodyFont}", monospace';
  ctx.fillStyle = '${paleta.text}';
  ctx.textAlign = 'left';
  ctx.fillText('software // v1.0.0-release', -uw / 2 + 120, -uh / 2 + 38);

  // Elementos internos do app (botão de toggle e status)
  ctx.fillStyle = '${paleta.accent}';
  ctx.beginPath();
  ctx.roundRect(-uw / 2 + 40, -40, 260, 60, 12);
  ctx.fill();

  ctx.font = '800 24px "${tipografia.displayFont}", sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText('DEPLOY COMPLETO', -uw / 2 + 170, -2);

  // Barra de progresso interna
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.fillRect(-uw / 2 + 40, 60, uw - 80, 14);
  ctx.fillStyle = '${paleta.primary}';
  ctx.fillRect(-uw / 2 + 40, 60, (uw - 80) * Math.min(1, t * 1.4), 14);
  ctx.restore();

  // Tipografia Cinética
  const pText = M.seg(t, 0.1, 0.65);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.68, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 96,
    color: '${paleta.text}',
    rise: 50,
    spread: 0.4
  });
  ctx.restore();

  // Subtítulo
  const pSub = M.seg(t, 0.35, 0.82);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 34px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${cleanS}'.toUpperCase(), W / 2, H * 0.77 + (1 - e) * 20);
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

  // 9. DRAFT ARQUITETÔNICO & MEDIDAS BLUEPRINT
  {
    id: 'blueprint_cad',
    name: 'Blueprint CAD & Calibração de Precisão',
    category: 'Engineering CAD',
    themes: ['structure_grid', 'night_spark', 'code_dev'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#030712');
  bg.addColorStop(1, '#081026');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Grade milimétrica blueprint
  M.grid(ctx, W, H, t, { step: 60, color: 'rgba(56, 189, 248, 0.08)', drift: 10 });

  // Moldura com cotas de medidas e coordenadas
  ctx.strokeStyle = '${paleta.primary}';
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 100, W - 120, H - 200);

  // Linhas de cota animadas
  const pCota = M.seg(t, 0.05, 0.6);
  const cotaL = (W - 200) * M.ease.outCubic(pCota);
  ctx.strokeStyle = '${paleta.accent}';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(100, 140);
  ctx.lineTo(100 + cotaL, 140);
  ctx.stroke();

  // Texto de cota
  ctx.font = '700 24px "${tipografia.bodyFont}", monospace';
  ctx.fillStyle = '${paleta.accent}';
  ctx.fillText('DIM: 1080x1920 // CAD-GRID v2.4', 100, 130);

  // Geometria central blueprint
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  M.cube(ctx, 0, 0, 180, { x: t * 1.5, y: t * 2.0, z: 0 }, { solid: false, hue: 195 });
  ctx.restore();

  // Tipografia Cinética
  const pText = M.seg(t, 0.1, 0.65);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.68, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 96,
    color: '${paleta.text}',
    rise: 50,
    spread: 0.4
  });
  ctx.restore();

  // Subtítulo
  const pSub = M.seg(t, 0.35, 0.82);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 34px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${cleanS}'.toUpperCase(), W / 2, H * 0.77 + (1 - e) * 20);
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

  // 10. ONDAS LÍQUIDAS HARMÔNICAS & OSCILADOR SENOIDAL
  {
    id: 'liquid_harmonic_waves',
    name: 'Ondas Harmônicas & Espectro Líquido',
    category: 'Harmonic Fluid',
    themes: ['sound_frequency', 'ai_prompt', 'night_spark'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Múltiplas fitas senoidais harmônicas com gradientes
  const cy = H * 0.42;
  const waveCount = 5;

  for (let w = 0; w < waveCount; w++) {
    const phase = t * 6 + w * 0.8;
    const amp = 40 + w * 15;
    ctx.strokeStyle = w % 2 === 0 ? '${paleta.primary}' : '${paleta.secondary}';
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.3 + w * 0.15;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 15) {
      const y = cy + Math.sin(x * 0.008 + phase) * amp + Math.cos(x * 0.004 - phase * 0.5) * 20;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  // Tipografia Cinética
  const pText = M.seg(t, 0.1, 0.65);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.68, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 96,
    color: '${paleta.text}',
    rise: 50,
    spread: 0.4
  });
  ctx.restore();

  // Subtítulo
  const pSub = M.seg(t, 0.35, 0.82);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 34px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${cleanS}'.toUpperCase(), W / 2, H * 0.77 + (1 - e) * 20);
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

  // 11. SILHUETAS SAUL BASS & CORTES DE ALTO CONTRASTE
  {
    id: 'saul_bass_cuts',
    name: 'Saul Bass & Geometria de Alto Contraste',
    category: 'Kinetic Vintage',
    themes: ['night_spark', 'future_vision', 'ai_prompt'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, W, H);

  // Faixa diagonal cortando a tela inspirada em Saul Bass
  const pCut = M.seg(t, 0.0, 0.5);
  const cutProgress = M.spring(pCut, 1.2, 0.55);

  ctx.save();
  ctx.fillStyle = '${paleta.primary}';
  ctx.beginPath();
  ctx.moveTo(0, H * 0.2);
  ctx.lineTo(W * cutProgress, H * 0.35);
  ctx.lineTo(W * cutProgress, H * 0.65);
  ctx.lineTo(0, H * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Braço cinético recortado
  const pArm = M.seg(t, 0.15, 0.65);
  ctx.save();
  ctx.fillStyle = '${paleta.text}';
  ctx.translate(W / 2, H * 0.42);
  ctx.rotate(Math.sin(t * 4) * 0.15);
  ctx.fillRect(-180, -25, 360, 50);
  ctx.restore();

  // Tipografia Recortada
  const pText = M.seg(t, 0.1, 0.65);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.72, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 104,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.45
  });
  ctx.restore();

  // Subtítulo
  const pSub = M.seg(t, 0.35, 0.82);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${cleanS}'.toUpperCase(), W / 2, H * 0.82 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.9, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(2, 2, 2, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },

  // 12. MONÓLITO HEROICO & CLÍMAX PRISMÁTICO
  {
    id: 'heroic_monolith',
    name: 'Monólito Heroico & Revelação Prismática',
    category: 'Epic Climax',
    themes: ['future_vision', 'ui_launch', 'ai_prompt'],
    generator: ({ headline, subtext, dna, role, index }) => {
      const { paleta, tipografia, bpm } = dna;
      const cleanH = headline.replace(/'/g, "\\'").slice(0, 18);
      const cleanS = subtext.replace(/'/g, "\\'").slice(0, 50);

      return `function drawScene(ctx, t, W, H) {
  // Fundo com brilho volumétrico ascensional
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '${paleta.bg}');
  bg.addColorStop(0.6, '#0f172a');
  bg.addColorStop(1, '#020617');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Monólito prismático central em ascensão 3D
  const pMono = M.seg(t, 0.0, 0.55);
  const sMono = M.spring(pMono, 1.25, 0.6);

  ctx.save();
  ctx.translate(W / 2, H * 0.40);
  ctx.scale(sMono, sMono);

  // Feixes de luz ascendente
  const beamW = 280;
  const beamG = ctx.createLinearGradient(0, 300, 0, -300);
  beamG.addColorStop(0, 'transparent');
  beamG.addColorStop(0.5, '${paleta.primary}');
  beamG.addColorStop(1, 'transparent');
  ctx.fillStyle = beamG;
  ctx.globalAlpha = 0.25;
  ctx.fillRect(-beamW / 2, -300, beamW, 600);
  ctx.globalAlpha = 1.0;

  // Prisma 3D giratório central
  M.cube(ctx, 0, 0, 190, { x: t * 1.2, y: t * 2.0, z: 0 }, { solid: true, hue: 205 });
  M.rings(ctx, 0, 0, M.seg(t, 0.05, 0.65), { count: 5, gap: 50, color: '${paleta.accent}' });
  ctx.restore();

  // Tipografia Monumental
  const pText = M.seg(t, 0.1, 0.65);
  ctx.save();
  M.kineticText(ctx, '${cleanH}', W / 2, H * 0.68, pText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 104,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.45
  });
  ctx.restore();

  // Subtítulo e Call to Action
  const pSub = M.seg(t, 0.35, 0.82);
  if (pSub > 0) {
    const e = M.ease.outCubic(pSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${cleanS}'.toUpperCase(), W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Transição de saída
  const out = M.ease.inOutCubic(M.seg(t, 0.9, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(2, 4, 8, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
    },
  },
];

/**
 * Analisa semanticamente o roteiro fornecido pelo usuário e quebra em cenas coerentes,
 * extraindo para cada cena: título de impacto (headline), legenda explicativa e tema semântico.
 */
export function parseScriptToScenes(
  scriptText: string,
  targetDuration: number = 30,
  preferredSceneCount?: number
): ScriptSceneAnalysis[] {
  const clean = (scriptText || '').trim();

  // Dividir o texto por quebras de linha ou frases completas (pontuação)
  let rawSegments: string[] = [];

  // Se houver múltiplas linhas com números (ex: 1. Cena, 2. Cena)
  const lineSplits = clean.split(/\n+/).map((s) => s.trim()).filter((s) => s.length > 5);

  if (lineSplits.length >= 4) {
    rawSegments = lineSplits;
  } else {
    // Dividir por frases terminadas em ponto, dois-pontos ou ponto-e-vírgula
    rawSegments = clean
      .split(/(?<=[.:;!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 6);
  }

  // Se o texto for muito curto, fornecer fallback narrativo estruturado
  if (rawSegments.length === 0) {
    rawSegments = [
      'Na madrugada silenciosa com um único prompt.',
      'Linhas de código se transformaram em arquitetura viva.',
      'A interface ganhou forma e o software nasceu.',
      'Em semanas conquistou mais de cem mil usuários globais.',
      'O futuro do software pertence a quem constrói com IA.',
      'Comece agora a transformar suas ideias em realidade.',
    ];
  }

  // Calcular número alvo de cenas (mínimo 5, padrão 6 a 8 para 30s)
  const targetCount =
    preferredSceneCount ||
    Math.max(5, Math.min(10, Math.round(targetDuration / 5)));

  // Ajustar segmentos para ter o número exato de cenas
  const finalSegments: string[] = [];
  if (rawSegments.length <= targetCount) {
    finalSegments.push(...rawSegments);
    // Se faltarem, subdividir ou expandir
    while (finalSegments.length < targetCount) {
      const idx = finalSegments.length;
      finalSegments.push(`Construção e aceleração contínua // Etapa 0${idx + 1}`);
    }
  } else {
    // Agrupar ou selecionar os mais relevantes
    const step = rawSegments.length / targetCount;
    for (let i = 0; i < targetCount; i++) {
      const srcIdx = Math.floor(i * step);
      finalSegments.push(rawSegments[srcIdx]);
    }
  }

  // Mapear cada segmento para análise semântica
  return finalSegments.map((seg, idx, arr) => {
    const lower = seg.toLowerCase();
    const isFirst = idx === 0;
    const isLast = idx === arr.length - 1;
    const isPenultimate = idx === arr.length - 2;

    let role: RoleType = 'corpo';
    if (isFirst) role = 'gancho';
    else if (isLast) role = 'fechamento';
    else if (isPenultimate) role = 'clímax';

    // Detecção semântica por palavras-chave
    let theme: ScriptSceneAnalysis['semanticTheme'] = 'code_dev';
    if (
      lower.includes('madrugada') ||
      lower.includes('escuro') ||
      lower.includes('hora') ||
      lower.includes('noite') ||
      lower.includes('início') ||
      lower.includes('03:')
    ) {
      theme = 'night_spark';
    } else if (
      lower.includes('prompt') ||
      lower.includes('ia') ||
      lower.includes('inteligência') ||
      lower.includes('neural') ||
      lower.includes('modelo')
    ) {
      theme = 'ai_prompt';
    } else if (
      lower.includes('código') ||
      lower.includes('software') ||
      lower.includes('program') ||
      lower.includes('terminal') ||
      lower.includes('api') ||
      lower.includes('dev')
    ) {
      theme = 'code_dev';
    } else if (
      lower.includes('interface') ||
      lower.includes('design') ||
      lower.includes('produto') ||
      lower.includes('lanç') ||
      lower.includes('app')
    ) {
      theme = 'ui_launch';
    } else if (
      lower.includes('usuário') ||
      lower.includes('100') ||
      lower.includes('mil') ||
      lower.includes('métrica') ||
      lower.includes('escala') ||
      lower.includes('crescimento') ||
      lower.includes('mundo')
    ) {
      theme = 'metrics_traction';
    } else if (
      lower.includes('futuro') ||
      lower.includes('visão') ||
      lower.includes('pertence') ||
      lower.includes('revolução') ||
      lower.includes('construa')
    ) {
      theme = 'future_vision';
    } else if (
      lower.includes('arquitetura') ||
      lower.includes('grid') ||
      lower.includes('sistema') ||
      lower.includes('base')
    ) {
      theme = 'structure_grid';
    } else if (
      lower.includes('ritmo') ||
      lower.includes('som') ||
      lower.includes('frequência') ||
      lower.includes('onda') ||
      lower.includes('batida')
    ) {
      theme = 'sound_frequency';
    }

    // Extrair headline de alto impacto (1 a 3 palavras chaves)
    let headline = '';
    const words = seg.replace(/^[0-9]+[.\-:]\s*/, '').split(/\s+/);
    if (words.length <= 3) {
      headline = words.join(' ').toUpperCase();
    } else {
      // Procurar termos de destaque
      const highlight = words.slice(0, 3).join(' ').toUpperCase();
      headline = highlight;
    }

    // Limpeza de pontuação da headline
    headline = headline.replace(/[.,:;!?]/g, '').trim();

    return {
      headline: headline || `CENA 0${idx + 1}`,
      subtext: seg.replace(/^[0-9]+[.\-:]\s*/, '').slice(0, 80),
      semanticTheme: theme,
      role,
    };
  });
}

/**
 * Gera um showreel completo de motion design diretamente alinhado ao roteiro da cena,
 * GARANTINDO QUE CADA CENA UTILIZE UM ARQUÉTIPO VISUAL DIFERENTE (SEM REPETIR!).
 */
export function generateScriptDrivenShowreel(
  scriptText: string,
  dna: DNA,
  options?: {
    customTitle?: string;
    allowRandomizeColors?: boolean;
  }
): Showreel {
  const targetDuration = dna.duracaoAlvo || 30;
  const sceneAnalyses = parseScriptToScenes(scriptText, targetDuration, dna.numeroCenas);
  const sceneCount = sceneAnalyses.length;
  const avgDuration = Number((targetDuration / sceneCount).toFixed(1));

  // Pool de arquétipos disponíveis com embaralhamento estocástico
  const archetypePool = [...MOTION_ARCHETYPES].sort(() => Math.random() - 0.5);
  const usedArchetypeIds = new Set<string>();

  const scenes: Scene[] = [];

  for (let i = 0; i < sceneCount; i++) {
    const analysis = sceneAnalyses[i];
    const { headline, subtext, semanticTheme, role } = analysis;

    // Selecionar o melhor arquétipo disponível que combine com o tema e AINDA NÃO TENHA SIDO USADO
    let chosen = archetypePool.find(
      (a) => a.themes.includes(semanticTheme) && !usedArchetypeIds.has(a.id)
    );

    // Se todos do tema já foram usados, pegar o próximo não usado do pool
    if (!chosen) {
      chosen = archetypePool.find((a) => !usedArchetypeIds.has(a.id));
    }

    // Se o showreel tiver mais de 12 cenas e esgotar o pool, resetar o conjunto
    if (!chosen) {
      usedArchetypeIds.clear();
      chosen = archetypePool[i % archetypePool.length];
    }

    usedArchetypeIds.add(chosen.id);

    // Gerar código executável da cena
    const seed = getRandomInt(100, 9999);
    const code = chosen.generator({
      headline,
      subtext,
      dna,
      role,
      index: i,
      total: sceneCount,
      seed,
    });

    const compiledFn = compileSceneCode(code);

    scenes.push({
      id: `scene_${i + 1}_${chosen.id}`,
      name: `${i + 1}. ${headline}`,
      duration: avgDuration,
      role,
      code,
      description: `Cena de motion design roteirizada: "${subtext}". Arquétipo: ${chosen.name}`,
      scriptSnippet: subtext,
      archetypeId: chosen.id,
      archetypeName: chosen.name,
      validated: true,
      compiledFn,
    });
  }

  // Ajustar última cena para bater a duração exata
  const currentTotal = scenes.reduce((sum, s) => sum + s.duration, 0);
  const diff = Number((targetDuration - currentTotal).toFixed(2));
  if (scenes.length > 0 && Math.abs(diff) > 0.05) {
    scenes[scenes.length - 1].duration = Math.max(
      1.5,
      Number((scenes[scenes.length - 1].duration + diff).toFixed(1))
    );
  }

  const showreel: Showreel = {
    id: `reel_${Date.now()}_${getRandomInt(100, 999)}`,
    title: options?.customTitle || 'Motion Showreel Roteirizado (Sem Repetições)',
    concept: scriptText.slice(0, 120),
    totalDuration: scenes.reduce((sum, s) => sum + s.duration, 0),
    scenes,
    dna,
    script: scriptText,
    generatedAt: Date.now(),
  };

  // Certificar todas as cenas com o motor de auditoria em offscreen canvas
  return autoCertifyShowreel(showreel);
}
