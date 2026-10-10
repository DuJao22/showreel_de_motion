import { Showreel, DNA, Scene } from '../types/showreel';
import { compileSceneCode } from './proceduralFallback';

/**
 * DNA Oficial Cinematográfico para "O Garoto que Criou um Software com IA — Showreel 30s"
 */
export const GAROTO_DNA: DNA = {
  id: 'dna_garoto_ia_30s',
  createdAt: Date.now(),
  estrutura: 'Jornada do Fundador Solitário (Herói + IA)',
  paleta: {
    id: 'cyber_founder',
    name: 'Cyber Founder 35mm (Ciano Elétrico & Obsidiana)',
    bg: '#04060c',
    card: '#0b1020',
    primary: '#38bdf8',
    secondary: '#818cf8',
    accent: '#10b981',
    text: '#f8fafc',
    subtext: '#94a3b8',
    tag: '#0284c7',
  },
  tipografia: {
    id: 'kinetic_mono_display',
    name: 'Plus Jakarta Sans + JetBrains Mono',
    displayFont: 'Plus Jakarta Sans',
    bodyFont: 'JetBrains Mono',
    styleDescription: 'Tipografia cinemática de alta precisão técnica e impacto monumental',
  },
  transicaoDominante: 'Whip Zoom & Perspective Warp',
  abertura: 'Madrugada Silenciosa // Iluminação Volumétrica',
  energia: 5,
  bpm: 128,
  numeroCenas: 6,
  duracaoAlvo: 30,
};

/**
 * Código executável da Cena 1: A Madrugada (0.0s - 4.5s)
 */
const SCENE_1_CODE = `function drawScene(ctx, t, W, H) {
  // 1. Fundo atmosférico profundo de madrugada
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#04050a');
  bg.addColorStop(0.5, '#070a14');
  bg.addColorStop(1, '#0c1222');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 2. Grid arquitetônico do quarto com perspectiva sutil
  M.grid(ctx, W, H, t, { step: 100, color: 'rgba(56, 189, 248, 0.05)', drift: 20 });

  // 3. Monitor volumétrico brilhando no quarto escuro
  const monP = M.seg(t, 0.0, 0.6);
  const monScale = M.spring(monP, 1.2, 0.55);
  ctx.save();
  ctx.translate(W / 2, H * 0.44);
  ctx.scale(monScale, monScale);
  M.monitor(ctx, 0, 0, 720, 440, t, {
    title: 'quarto // dev_room.ts',
    codeLines: [
      '> time: 03:42 AM [MADRUGADA]',
      '> status: TODO MUNDO DORMINDO',
      '> terminal: CONECTANDO AO NÚCLEO IA...',
      '> target: CONSTRUIR UM SOFTWARE DO ZERO'
    ],
    hue: 195
  });
  ctx.restore();

  // 4. Silhueta do garoto com capuz e fones neon
  const boyP = M.seg(t, 0.15, 0.7);
  const boyEase = M.spring(boyP, 1.3, 0.6);
  M.character(ctx, W / 2, H * 0.68 + (1 - boyEase) * 60, 1.15, t, 195);

  // 5. Tipografia Cinética de Impacto
  const tTitle = M.seg(t, 0.05, 0.5);
  ctx.save();
  M.kineticText(ctx, '03:42 AM', W / 2, H * 0.16, tTitle, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 170,
    color: '#f8fafc',
    rise: 60,
    spread: 0.5
  });
  ctx.restore();

  // Legenda com entrada em mola
  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 38px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('ELE ESTAVA CONSTRUINDO SOZINHO.', W / 2, H * 0.23 + (1 - e) * 20);
    ctx.restore();
  }

  // Crosshair e réguas de precisão
  M.crosshair(ctx, 120, H * 0.16, 24, 'rgba(56,189,248,0.4)');
  M.crosshair(ctx, W - 120, H * 0.16, 24, 'rgba(56,189,248,0.4)');

  // Fade de saída suave
  const out = M.ease.inOutCubic(M.seg(t, 0.90, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 5, 10, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

/**
 * Código executável da Cena 2: A Faísca / Um Único Prompt (4.5s - 9.0s)
 */
const SCENE_2_CODE = `function drawScene(ctx, t, W, H) {
  // 1. Fundo com gradiente radial de energia neural
  const bg = ctx.createRadialGradient(W / 2, H * 0.48, 80, W / 2, H * 0.48, H * 0.65);
  bg.addColorStop(0, '#0a1628');
  bg.addColorStop(0.6, '#060a14');
  bg.addColorStop(1, '#020307');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 2. Anéis concêntricos de choque e expansão
  M.rings(ctx, W / 2, H * 0.46, M.seg(t, 0.0, 0.65), {
    count: 5,
    r0: 160,
    gap: 100,
    color: 'rgba(56, 189, 248, 0.15)',
    w: 2
  });

  // 3. Esfera Neural 3D de Partículas e Conexões Sinápticas
  const rot = {
    x: t * 0.8 + 0.3,
    y: t * 1.5,
    z: 0.2
  };
  M.sphere(ctx, W / 2, H * 0.46, 320, rot, {
    points: 75,
    hue: 195,
    connect: true,
    maxDist: 85,
    alpha: remap(t, 0.85, 1.0, 1, 0.2)
  });

  // 4. Card Holográfico 3D com o Prompt do Usuário
  const cardP = M.seg(t, 0.2, 0.7);
  const cardSpring = M.spring(cardP, 1.3, 0.5);
  const cardRot = {
    x: 0.18 * (1 - cardSpring),
    y: -0.15 * Math.sin(t * Math.PI),
    z: 0
  };
  M.card(ctx, W / 2, H * 0.72, 860, 200, cardRot, {
    hue: 195,
    bg: 'rgba(8, 14, 28, 0.88)',
    border: 'rgba(56, 189, 248, 0.75)',
    glow: true,
    contentFn: (c, w, h) => {
      c.font = '600 24px "JetBrains Mono", monospace';
      c.fillStyle = '#38bdf8';
      c.textAlign = 'left';
      c.fillText('> PROMPT ENVIADO À IA:', -w / 2 + 40, -30);
      c.font = '800 32px "Plus Jakarta Sans", sans-serif';
      c.fillStyle = '#ffffff';
      c.fillText('"CRIE UM SOFTWARE COMPLETO"', -w / 2 + 40, 20);
    }
  });

  // 5. Título Principal Monumental
  const tMain = M.seg(t, 0.05, 0.55);
  M.kineticText(ctx, 'UM ÚNICO PROMPT', W / 2, H * 0.18, tMain, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 155,
    color: '#ffffff',
    rise: 80,
    spread: 0.5
  });

  // Legenda
  const legP = M.seg(t, 0.4, 0.85);
  if (legP > 0) {
    const e = M.ease.outCubic(legP);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 38px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.textAlign = 'center';
    ctx.fillText('DA IDEIA AO PRIMEIRO MÓDULO.', W / 2, H * 0.25 + (1 - e) * 20);
    ctx.restore();
  }

  // Fade de saída
  const out = M.ease.inOutCubic(M.seg(t, 0.90, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(2, 3, 7, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

/**
 * Código executável da Cena 3: A Matriz / Código e Arquitetura 3D (9.0s - 14.5s)
 */
const SCENE_3_CODE = `function drawScene(ctx, t, W, H) {
  // 1. Fundo do cosmos de código
  ctx.fillStyle = '#030509';
  ctx.fillRect(0, 0, W, H);

  // 2. Túnel 3D em perspectiva contínua
  M.tunnel(ctx, W / 2, H * 0.5, t, {
    sides: 6,
    rings: 12,
    speed: 1.5,
    color: '#38bdf8',
    rotSpeed: 0.6
  });

  // 3. Três Cubos 3D giratórios sombreados (microsserviços & arquitetura)
  const cubeRot1 = { x: t * 2.2, y: t * 3.1, z: 0 };
  const cubeRot2 = { x: -t * 1.8, y: t * 2.4, z: 0.4 };
  const cubeRot3 = { x: t * 1.5, y: -t * 2.0, z: -0.3 };

  // Cubo central herói
  const cP = M.seg(t, 0.1, 0.6);
  const cScale = M.spring(cP, 1.4, 0.5);
  ctx.save();
  ctx.translate(W / 2, H * 0.5);
  ctx.scale(cScale, cScale);
  M.cube(ctx, 0, 0, 220, cubeRot1, {
    solid: true,
    hue: 195,
    strokeColor: '#38bdf8',
    alpha: 0.95
  });
  ctx.restore();

  // Cubos satélites
  M.cube(ctx, W * 0.22, H * 0.42, 110, cubeRot2, { solid: true, hue: 260, strokeColor: '#a855f7', alpha: 0.7 });
  M.cube(ctx, W * 0.78, H * 0.58, 110, cubeRot3, { solid: true, hue: 160, strokeColor: '#10b981', alpha: 0.7 });

  // 4. Tipografia Monumental
  const tMat = M.seg(t, 0.05, 0.5);
  M.kineticText(ctx, 'ARQUITETURA VIVA', W / 2, H * 0.17, tMat, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 150,
    color: '#f8fafc',
    rise: 70
  });

  // Contador de Linhas de Código em Tempo Real
  const tCode = M.seg(t, 0.25, 0.85);
  const locCount = Math.floor(lerp(120, 12840, M.ease.outExpo(tCode)));
  ctx.save();
  ctx.font = '700 44px "JetBrains Mono", monospace';
  ctx.fillStyle = '#4ade80';
  ctx.textAlign = 'center';
  ctx.fillText(locCount.toLocaleString() + ' LINHAS DE CÓDIGO', W / 2, H * 0.25);
  ctx.font = '500 28px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('SINTETIZADAS EM SEGUNDOS', W / 2, H * 0.29);
  ctx.restore();

  // Acabamento de saída
  const out = M.ease.inOutCubic(M.seg(t, 0.90, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(3, 5, 9, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

/**
 * Código executável da Cena 4: A Interface / O Software Ganha Vida (14.5s - 20.0s)
 */
const SCENE_4_CODE = `function drawScene(ctx, t, W, H) {
  // 1. Fundo com gradiente e grid técnico
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#040712');
  bg.addColorStop(1, '#081022');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  M.grid(ctx, W, H, t, { step: 80, color: 'rgba(56, 189, 248, 0.07)', drift: 35 });

  // 2. Dashboard Futurista SaaS Herói
  const dashP = M.seg(t, 0.05, 0.6);
  const dashScale = M.spring(dashP, 1.3, 0.55);
  ctx.save();
  ctx.translate(W / 2, H * 0.54);
  ctx.scale(dashScale, dashScale);
  M.dashboard(ctx, 0, 0, 880, 720, t, {
    title: 'HYPERSAAS // v2.4 ONLINE',
    mrr: '$48,200',
    users: '10,480',
    latency: '12ms',
    progress: remap(t, 0.2, 0.85, 0.1, 1)
  });
  ctx.restore();

  // 3. Tipografia Heroica
  const tHero = M.seg(t, 0.0, 0.45);
  M.kineticText(ctx, 'O SOFTWARE NASCEU', W / 2, H * 0.15, tHero, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 155,
    color: '#ffffff',
    rise: 60
  });

  // Legenda
  const subP = M.seg(t, 0.35, 0.8);
  if (subP > 0) {
    const e = M.ease.outCubic(subP);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'center';
    ctx.fillText('UI MODERNA. ZERO LEGACY. 100% PRODUÇÃO.', W / 2, H * 0.22);
    ctx.restore();
  }

  // Tags flutuantes animadas
  const tagP = M.seg(t, 0.5, 0.9);
  if (tagP > 0) {
    const te = M.spring(tagP, 1.4, 0.5);
    ctx.save();
    ctx.translate(W * 0.76, H * 0.82);
    ctx.scale(te, te);
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(-120, -25, 240, 50, 25);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡ PRONTO PARA ESCALA', 0, 0);
    ctx.restore();
  }

  // Fade de saída
  const out = M.ease.inOutCubic(M.seg(t, 0.90, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 7, 18, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

/**
 * Código executável da Cena 5: A Explosão / Tração Global (20.0s - 25.5s)
 */
const SCENE_5_CODE = `function drawScene(ctx, t, W, H) {
  // 1. Fundo de aceleração exponencial
  const bg = ctx.createRadialGradient(W / 2, H * 0.45, 100, W / 2, H * 0.45, H * 0.7);
  bg.addColorStop(0, '#10223d');
  bg.addColorStop(0.5, '#070f1e');
  bg.addColorStop(1, '#02050b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 2. Anéis concêntricos de choque pulsando ao ritmo do BPM
  M.rings(ctx, W / 2, H * 0.45, M.seg(t, 0.0, 0.8), {
    count: 6,
    r0: 180,
    gap: 110,
    color: 'rgba(56, 189, 248, 0.22)',
    w: 3
  });

  // 3. Globo 3D de tráfego e usuários pelo mundo
  const globeRot = {
    x: 0.35,
    y: t * 2.8,
    z: 0.1
  };
  M.sphere(ctx, W / 2, H * 0.45, 280, globeRot, {
    points: 90,
    hue: 160,
    connect: true,
    maxDist: 80,
    alpha: 0.9
  });

  // 4. Contador Monumental de Usuários (0 -> 100.000)
  const countP = M.seg(t, 0.1, 0.8);
  const userNum = Math.floor(lerp(0, 100000, M.ease.outExpo(countP)));
  ctx.save();
  ctx.font = '900 160px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 40;
  ctx.fillText(userNum.toLocaleString(), W / 2, H * 0.20);
  ctx.font = '800 42px "JetBrains Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText('USUÁRIOS ATIVOS NO MUNDO', W / 2, H * 0.26);
  ctx.restore();

  // 5. Card de Faturamento / Validação
  const cardP = M.seg(t, 0.35, 0.85);
  const cardSpring = M.spring(cardP, 1.4, 0.55);
  ctx.save();
  ctx.translate(W / 2, H * 0.78);
  ctx.scale(cardSpring, cardSpring);
  ctx.fillStyle = 'rgba(8, 16, 32, 0.92)';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.roundRect(-380, -75, 760, 150, 24);
  ctx.fill();
  ctx.stroke();

  ctx.font = '600 24px "JetBrains Mono", monospace';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText('FATURAMENTO EM APENAS 3 SEMANAS', 0, -25);
  ctx.font = '900 52px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#10b981';
  ctx.fillText('+ US$ 48.200 / MÊS', 0, 35);
  ctx.restore();

  // Fade de saída
  const out = M.ease.inOutCubic(M.seg(t, 0.90, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(2, 5, 11, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

/**
 * Código executável da Cena 6: O Fechamento / O Próximo é Você (25.5s - 30.0s)
 */
const SCENE_6_CODE = `function drawScene(ctx, t, W, H) {
  // 1. Fundo épico final com gradiente dramático
  const bg = ctx.createRadialGradient(W / 2, H * 0.42, 60, W / 2, H * 0.42, H * 0.8);
  bg.addColorStop(0, '#152444');
  bg.addColorStop(0.5, '#070c18');
  bg.addColorStop(1, '#020306');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 2. Anéis concêntricos gloriosos
  M.rings(ctx, W / 2, H * 0.42, M.seg(t, 0.0, 0.7), {
    count: 7,
    r0: 150,
    gap: 90,
    color: 'rgba(56, 189, 248, 0.25)',
    w: 2
  });

  // 3. Silhueta Triunfante do Garoto / Fundador
  const boyP = M.seg(t, 0.05, 0.55);
  const boyEase = M.spring(boyP, 1.2, 0.6);
  M.character(ctx, W / 2, H * 0.62 + (1 - boyEase) * 80, 1.35, t, 195);

  // 4. Tipografia Monumental de Fechamento
  const tFinal = M.seg(t, 0.1, 0.6);
  M.kineticText(ctx, 'CONSTRUA COM IA', W / 2, H * 0.22, tFinal, {
    family: '"Plus Jakarta Sans", sans-serif',
    weight: 900,
    size: 165,
    color: '#ffffff',
    rise: 80,
    spread: 0.5
  });

  // Frase final de impacto
  const callP = M.seg(t, 0.35, 0.85);
  if (callP > 0) {
    const e = M.spring(callP, 1.3, 0.55);
    ctx.save();
    ctx.globalAlpha = clamp(callP * 2);
    ctx.translate(W / 2, H * 0.80);
    ctx.scale(e, e);

    // Botão de Call to Action
    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 35;
    ctx.beginPath();
    ctx.roundRect(-340, -45, 680, 90, 45);
    ctx.fill();

    ctx.fillStyle = '#020817';
    ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('O PRÓXIMO É VOCÊ →', 0, 0);
    ctx.restore();
  }

  // Assinatura discreta no topo
  ctx.save();
  ctx.font = '600 24px "JetBrains Mono", monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.textAlign = 'center';
  ctx.fillText('SHOWREEL MOTION // 30S VERTICAL', W / 2, H * 0.08);
  ctx.restore();

  // Vinheta de fechamento
  const out = M.ease.inOutCubic(M.seg(t, 0.92, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(2, 3, 6, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;

/**
 * Cria o objeto completo do showreel "O Garoto que Criou um Software com IA — Showreel 30s"
 * com todas as 6 cenas compiladas, validadas e prontas para playback a 60 FPS.
 */
export function getGarotoShowreel(): Showreel {
  const scenes: Scene[] = [
    {
      id: 'garoto_scene_1',
      name: '03:42 AM // A Madrugada',
      duration: 4.5,
      role: 'gancho',
      description: 'Quarto escuro iluminado pelo monitor volumétrico. Silhueta do garoto solitário construindo enquanto o mundo dorme.',
      code: SCENE_1_CODE,
      validated: true,
      compiledFn: compileSceneCode(SCENE_1_CODE),
    },
    {
      id: 'garoto_scene_2',
      name: 'A FAÍSCA // Um Único Prompt',
      duration: 4.5,
      role: 'corpo',
      description: 'Câmera mergulha na tela: terminal 3D e esfera neural de partículas giratória em órbita.',
      code: SCENE_2_CODE,
      validated: true,
      compiledFn: compileSceneCode(SCENE_2_CODE),
    },
    {
      id: 'garoto_scene_3',
      name: 'A MATRIZ // Código e Arquitetura 3D',
      duration: 5.5,
      role: 'corpo',
      description: 'Túnel 3D infinito e cubos sombreados giratórios representando microsserviços e 10.000 linhas de código geradas.',
      code: SCENE_3_CODE,
      validated: true,
      compiledFn: compileSceneCode(SCENE_3_CODE),
    },
    {
      id: 'garoto_scene_4',
      name: 'A INTERFACE // O Software Ganha Vida',
      duration: 5.5,
      role: 'clímax',
      description: 'Dashboard SaaS futurista com gráficos em tempo real, métricas de crescimento e interface moderna de alta performance.',
      code: SCENE_4_CODE,
      validated: true,
      compiledFn: compileSceneCode(SCENE_4_CODE),
    },
    {
      id: 'garoto_scene_5',
      name: 'A EXPLOSÃO // Tração Global',
      duration: 5.5,
      role: 'clímax',
      description: 'Globo com tráfego mundial, contador disparando de 0 para 100.000 usuários ativos e validação de faturamento.',
      code: SCENE_5_CODE,
      validated: true,
      compiledFn: compileSceneCode(SCENE_5_CODE),
    },
    {
      id: 'garoto_scene_6',
      name: 'O FECHAMENTO // O Próximo é Você',
      duration: 4.5,
      role: 'fechamento',
      description: 'Silhueta triunfante do fundador, tipografia heroica e chamada para ação com energia cinematográfica máxima.',
      code: SCENE_6_CODE,
      validated: true,
      compiledFn: compileSceneCode(SCENE_6_CODE),
    },
  ];

  return {
    id: 'garoto_software_ia_30s',
    title: 'O Garoto que Criou um Software com IA — Showreel 30s',
    concept: 'Jornada vertical cinematográfica de 30 segundos: do quarto escuro na madrugada ao software com 100k usuários e escala global.',
    directorNotes: 'Física harmônica de molas, 5 camadas de profundidade, tipografia monumental 1080x1920 e renderização 3D de alta performance.',
    totalDuration: 30,
    scenes,
    dna: GAROTO_DNA,
    script: 'O Garoto que Criou um Software com IA: Na madrugada escura, com um único prompt, linhas de código se tornaram uma arquitetura viva. A interface ganhou forma, o software nasceu, e em 3 semanas conquistou 100.000 usuários. O futuro pertence a quem constrói com IA.',
    generatedAt: Date.now(),
  };
}
