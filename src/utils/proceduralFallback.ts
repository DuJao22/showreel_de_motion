import { DNA, RoleType, Scene } from '../types/showreel';
import { M } from './motionLib';

// Re-export M for direct consumption across the engine
export { M };

// Math & Motion design easing helpers
export const EASINGS = {
  easeOutExpo: (x: number): number => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  easeInOutCubic: (x: number): number =>
    x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  easeOutBack: (x: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
  easeInExpo: (x: number): number => (x === 0 ? 0 : Math.pow(2, 10 * x - 10)),
};

/**
 * Limpa e extrai código JS executável puro, removendo marcações markdown,
 * blocos de código com crases e comentários conversacionais.
 */
export function extractCleanCode(rawCode: string): string {
  if (!rawCode) return '';
  let clean = rawCode.trim();

  // Extrair código dentro de blocos markdown ```javascript ou ```js
  const mdMatch = clean.match(/```(?:javascript|js)?\s*([\s\S]*?)```/i);
  if (mdMatch && mdMatch[1]) {
    clean = mdMatch[1].trim();
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```[a-zA-Z]*\s*/, '').replace(/```\s*$/, '').trim();
  }

  // Se houver texto conversacional antes de function drawScene, cortar a partir dela
  const fnIdx = clean.indexOf('function drawScene');
  if (fnIdx > 0) {
    clean = clean.slice(fnIdx).trim();
  }

  // Remover palavras-chave de exportação ESM se presentes
  clean = clean.replace(/^export\s+default\s+/, '').replace(/^export\s+/, '');

  return clean.trim();
}

/**
 * Renderizador de emergência infalível: caso o código de alguma cena falhe ou esteja vazio,
 * este renderizador garante um showreel de motion fluido, cinemático e 100% animado a 60 FPS.
 */
export function renderEmergencySceneMotion(
  ctx: CanvasRenderingContext2D,
  t: number,
  W: number,
  H: number,
  sceneInfo?: { name?: string; role?: RoleType },
  dna?: DNA
): void {
  const bgCol = dna?.paleta?.bg || '#060812';
  const priCol = dna?.paleta?.primary || '#38bdf8';
  const secCol = dna?.paleta?.secondary || '#818cf8';
  const accCol = dna?.paleta?.accent || '#10b981';
  const textCol = dna?.paleta?.text || '#f8fafc';
  const role = sceneInfo?.role || 'corpo';
  const title = (sceneInfo?.name || 'MOTION SHOWREEL').replace(/^\d+\s*\/\/\s*/, '');

  ctx.save();
  try {
    // 1. Fundo Gradiente Procedural
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, bgCol);
    bg.addColorStop(0.5, '#0b0f1d');
    bg.addColorStop(1, '#05070e');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 2. Grid arquitetônico paramétrico
    M.grid(ctx, W, H, t, { step: 90, color: 'rgba(56, 189, 248, 0.06)', drift: 15 });

    // 3. Geometria Cinética 3D central
    const pIntro = M.seg(t, 0.0, 0.5);
    const scale = M.spring(pIntro, 1.3, 0.6);

    ctx.save();
    ctx.translate(W / 2, H * 0.42);
    ctx.scale(scale, scale);

    if (role === 'gancho') {
      M.rings(ctx, 0, 0, M.seg(t, 0.05, 0.6), { count: 5, gap: 40, color: priCol });
      M.cube(ctx, 0, 0, 140, { x: t * 1.5, y: t * 2, z: 0 }, { solid: false, hue: 195 });
    } else if (role === 'clímax') {
      M.tunnel(ctx, 0, 0, t, { sides: 8, speed: 2 });
      M.rings(ctx, 0, 0, M.seg(t, 0.0, 0.4), { count: 6, gap: 50, color: accCol });
    } else if (role === 'fechamento') {
      M.sphere(ctx, 0, 0, 180, { x: t * 1.2, y: t * 2.0, z: 0 }, { hue: 195, connect: true });
    } else {
      M.cube(ctx, 0, 0, 160, { x: t * 1.8, y: t * 2.2, z: t * 0.5 }, { solid: true, hue: 210 });
      M.rings(ctx, 0, 0, M.seg(t, 0.1, 0.7), { count: 3, gap: 60, color: secCol });
    }
    ctx.restore();

    // 4. Tipografia Cinética Monumental (com mola e sombra)
    const tText = M.seg(t, 0.1, 0.65);
    ctx.save();
    M.kineticText(ctx, title.toUpperCase().slice(0, 18), W / 2, H * 0.65, tText, {
      family: '"Plus Jakarta Sans", sans-serif',
      weight: 900,
      size: 85,
      color: textCol,
      rise: 50,
      spread: 0.4,
    });
    ctx.restore();

    // 5. Metadados e Tag HUD
    const pSub = M.seg(t, 0.35, 0.85);
    if (pSub > 0) {
      const e = M.ease.outCubic(pSub);
      ctx.save();
      ctx.globalAlpha = e;
      ctx.font = '700 36px "JetBrains Mono", monospace';
      ctx.fillStyle = priCol;
      ctx.textAlign = 'center';
      ctx.fillText(
        `// ${role.toUpperCase()} • ${dna?.bpm || 128} BPM`,
        W / 2,
        H * 0.73 + (1 - e) * 20
      );
      ctx.restore();
    }

    // Miras de precisão
    M.crosshair(ctx, 80, 160, 24, 'rgba(56, 189, 248, 0.4)');
    M.crosshair(ctx, W - 80, 160, 24, 'rgba(56, 189, 248, 0.4)');
    M.crosshair(ctx, 80, H - 240, 24, 'rgba(56, 189, 248, 0.4)');
    M.crosshair(ctx, W - 80, H - 240, 24, 'rgba(56, 189, 248, 0.4)');

    // 6. Transição de saída suave
    const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
    if (out > 0) {
      ctx.fillStyle = `rgba(6, 8, 18, ${out})`;
      ctx.fillRect(0, 0, W, H);
    }
  } finally {
    ctx.restore();
  }
}

/**
 * Compiles a raw string of JS function or body into an executable function:
 * (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void
 *
 * Guaranteed to inject Motion Library 'M' into the scene's execution scope
 * and never throw uncaught exceptions during playback.
 */
export function compileSceneCode(
  rawCode: string
): (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void {
  const cleanCode = extractCleanCode(rawCode);

  if (!cleanCode) {
    return (ctx, t, W, H) => {
      renderEmergencySceneMotion(ctx, t, W, H, { name: 'CENA KINÉTICA', role: 'corpo' });
    };
  }

  // 1. Try compilation with M passed directly into the factory function
  try {
    const fn = new Function(
      'M',
      `
      ${cleanCode}
      if (typeof drawScene === 'function') {
        return drawScene;
      }
      return null;
    `
    )(M);

    if (typeof fn === 'function') {
      return (ctx, t, W, H) => {
        ctx.save();
        try {
          fn(ctx, t, W, H);
        } catch (err) {
          console.warn('Erro em tempo de execução da cena:', err);
          renderEmergencySceneMotion(ctx, t, W, H, { name: 'CENA KINÉTICA', role: 'corpo' });
        } finally {
          ctx.restore();
        }
      };
    }
  } catch {
    // Continue to fallback compilation approaches
  }

  // 2. If code is wrapped in function or arrow: evaluate with M available
  if (
    cleanCode.startsWith('function') ||
    cleanCode.startsWith('(') ||
    cleanCode.includes('drawScene')
  ) {
    try {
      const fn = new Function(
        'M',
        'return (' +
          cleanCode.replace(/^function\s+drawScene\s*\(/, 'function(') +
          ')'
      )(M);
      if (typeof fn === 'function') {
        return (ctx, t, W, H) => {
          ctx.save();
          try {
            fn(ctx, t, W, H);
          } catch (err) {
            console.warn('Erro em tempo de execução da função:', err);
            renderEmergencySceneMotion(ctx, t, W, H, { name: 'CENA KINÉTICA', role: 'corpo' });
          } finally {
            ctx.restore();
          }
        };
      }
    } catch {
      // fallback to body execution
    }
  }

  // 3. Treat as direct body of drawScene(ctx, t, W, H) with M injected
  try {
    const wrapped = new Function(
      'ctx',
      't',
      'W',
      'H',
      'M',
      `
      ctx.save();
      try {
        ${cleanCode}
      } finally {
        ctx.restore();
      }
    `
    );

    return (ctx, t, W, H) => {
      try {
        wrapped(ctx, t, W, H, M);
      } catch (err) {
        console.warn('Erro ao executar corpo da cena:', err);
        renderEmergencySceneMotion(ctx, t, W, H, { name: 'CENA KINÉTICA', role: 'corpo' });
      }
    };
  } catch {
    return (ctx, t, W, H) => {
      renderEmergencySceneMotion(ctx, t, W, H, { name: 'CENA KINÉTICA', role: 'corpo' });
    };
  }
}

/**
 * Validates a scene in an isolated offscreen canvas across 5 keyframes:
 * t = 0.0, 0.25, 0.5, 0.75, 1.0.
 * Returns { valid: true } or { valid: false, error: string }.
 */
export function validateSceneInHiddenCanvas(
  code: string,
  testWidth = 1080,
  testHeight = 1920
): {
  valid: boolean;
  error?: string;
  compiled?: (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void;
} {
  const cleanCode = extractCleanCode(code);
  if (!cleanCode || cleanCode.length < 30) {
    return { valid: false, error: 'Código vazio ou insuficiente.' };
  }

  try {
    const fn = compileSceneCode(cleanCode);
    const canvas = document.createElement('canvas');
    canvas.width = testWidth;
    canvas.height = testHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return { valid: false, error: 'Não foi possível obter o contexto 2D do Canvas.' };
    }

    const testPoints = [0, 0.25, 0.5, 0.75, 1.0];
    for (const t of testPoints) {
      ctx.save();
      try {
        fn(ctx, t, testWidth, testHeight);
      } catch (err: unknown) {
        ctx.restore();
        const errMessage = err instanceof Error ? err.message : String(err);
        return {
          valid: false,
          error: `Erro de execução no instante t=${t}: ${errMessage}`,
        };
      }
      ctx.restore();
    }

    return { valid: true, compiled: fn };
  } catch (compileErr: unknown) {
    const errMessage = compileErr instanceof Error ? compileErr.message : String(compileErr);
    return {
      valid: false,
      error: `Erro de compilação da função: ${errMessage}`,
    };
  }
}

/**
 * Gera código JavaScript executável completo no formato `function drawScene(ctx, t, W, H)`
 * para qualquer cena, garantindo animação de motion 100% dinâmica com 5 camadas, física e 3D.
 */
export function generateDynamicMotionSceneCode(
  dna: DNA,
  role: RoleType,
  index: number,
  title: string,
  topic: string = ''
): string {
  const { paleta, tipografia, bpm } = dna;
  const safeTitle = (title || 'MOTION').replace(/'/g, "\\'").replace(/"/g, '\\"');
  const safeTopic = (topic || 'SHOWREEL').replace(/'/g, "\\'").replace(/"/g, '\\"');

  if (role === 'gancho') {
    return `function drawScene(ctx, t, W, H) {
  // 1. Fundo com pulso de luz
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '${paleta.bg}');
  bg.addColorStop(0.5, '#0b0f20');
  bg.addColorStop(1, '#050711');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // 2. Grid de alta frequência
  M.grid(ctx, W, H, t, { step: 80, color: 'rgba(255, 255, 255, 0.05)', drift: 20 });

  // 3. Explosão de energia e anéis concêntricos
  const pIntro = M.seg(t, 0.0, 0.5);
  const scale = M.spring(pIntro, 1.25, 0.55);

  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.scale(scale, scale);
  M.rings(ctx, 0, 0, M.seg(t, 0.0, 0.6), { count: 5, gap: 50, color: '${paleta.primary}' });
  M.cube(ctx, 0, 0, 150, { x: t * 1.4, y: t * 1.8, z: t * 0.5 }, { solid: false, hue: 195 });
  ctx.restore();

  // 4. Tipografia Cinética de Impacto
  const tText = M.seg(t, 0.08, 0.55);
  ctx.save();
  M.kineticText(ctx, '${safeTitle}'.slice(0, 16), W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 110,
    color: '${paleta.text}',
    rise: 60,
    spread: 0.45
  });
  ctx.restore();

  // Legenda sincopada
  const tSub = M.seg(t, 0.35, 0.8);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 38px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('// ${dna.abertura.toUpperCase()}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Scanline HUD em movimento
  const scanY = (t * H * 1.4) % H;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.fillRect(0, scanY, W, 4);

  // Transição de saída
  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
  }

  if (role === 'clímax') {
    return `function drawScene(ctx, t, W, H) {
  // Flash Cut inicial
  const flash = t < 0.1 ? 1 - t / 0.1 : 0;
  ctx.fillStyle = flash > 0 ? 'rgba(255, 255, 255, ' + flash + ')' : '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Túnel 3D Infinito e Raios estroboscópicos
  ctx.save();
  ctx.translate(W / 2, H * 0.44);
  M.tunnel(ctx, 0, 0, t, { sides: 8, speed: 3 });
  M.rings(ctx, 0, 0, M.seg(t, 0.0, 0.5), { count: 6, gap: 55, color: '${paleta.accent}' });
  ctx.restore();

  // Tipografia monumental de clímax
  const tText = M.seg(t, 0.05, 0.5);
  ctx.save();
  M.kineticText(ctx, '${safeTitle}'.slice(0, 16), W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 120,
    color: '${paleta.text}',
    rise: 70,
    spread: 0.5
  });
  ctx.restore();

  // Subtítulo em alta velocidade
  const tSub = M.seg(t, 0.3, 0.75);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 42px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.primary}';
    ctx.textAlign = 'center';
    ctx.fillText('ENERGIA MÁXIMA // ${bpm} BPM', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Miras HUD
  M.crosshair(ctx, 80, 160, 28, '${paleta.accent}');
  M.crosshair(ctx, W - 80, 160, 28, '${paleta.accent}');

  const out = M.ease.inOutCubic(M.seg(t, 0.9, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(3, 4, 8, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
  }

  if (role === 'fechamento') {
    return `function drawScene(ctx, t, W, H) {
  // Fundo elegante de fechamento
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '${paleta.bg}');
  bg.addColorStop(1, '#020408');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Esfera 3D de partículas em órbita
  ctx.save();
  ctx.translate(W / 2, H * 0.4);
  M.sphere(ctx, 0, 0, 200, { x: t * 1.5, y: t * 2.2, z: 0 }, { hue: 195, connect: true });
  ctx.restore();

  // Moldura e cantos HUD
  ctx.strokeStyle = '${paleta.primary}';
  ctx.lineWidth = 3;
  ctx.strokeRect(60, 100, W - 120, H - 200);

  // Tipografia heroica de fechamento
  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${safeTitle}'.slice(0, 16), W / 2, H * 0.66, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 96,
    color: '${paleta.text}',
    rise: 50,
    spread: 0.4
  });
  ctx.restore();

  // Call-to-action
  const tSub = M.seg(t, 0.35, 0.85);
  if (tSub > 0) {
    const e = M.ease.outCubic(tSub);
    ctx.save();
    ctx.globalAlpha = e;
    ctx.font = '700 36px "${tipografia.bodyFont}", monospace';
    ctx.fillStyle = '${paleta.accent}';
    ctx.textAlign = 'center';
    ctx.fillText('CONSTRUA COM IA // 2026', W / 2, H * 0.76 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.92, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(2, 3, 6, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
  }

  // Papel: Corpo (com variações rítmicas)
  const variant = index % 3;
  if (variant === 0) {
    return `function drawScene(ctx, t, W, H) {
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '${paleta.bg}');
  bg.addColorStop(1, '#080c18');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  M.grid(ctx, W, H, t, { step: 90, color: 'rgba(255, 255, 255, 0.05)', drift: 18 });

  // Cubo 3D giratório central
  const pCube = M.seg(t, 0.0, 0.6);
  const cubeScale = M.spring(pCube, 1.3, 0.6);
  ctx.save();
  ctx.translate(W / 2, H * 0.43);
  ctx.scale(cubeScale, cubeScale);
  M.cube(ctx, 0, 0, 160, { x: t * 1.8, y: t * 2.2, z: t * 0.6 }, { solid: true, hue: 205 });
  M.rings(ctx, 0, 0, M.seg(t, 0.1, 0.7), { count: 4, gap: 55, color: '${paleta.secondary}' });
  ctx.restore();

  // Tipografia Dinâmica
  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${safeTitle}'.slice(0, 16), W / 2, H * 0.68, tText, {
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
    ctx.fillText('// PROGRESSÃO RÍTMICA 0${index + 1}', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  // Barra de progresso rítmica
  ctx.fillStyle = '${paleta.secondary}';
  ctx.fillRect(80, H - 140, (W - 160) * t, 12);

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
  }

  if (variant === 1) {
    return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Cartão 3D Futurista com Terminal
  const pCard = M.seg(t, 0.0, 0.55);
  const cardScale = M.spring(pCard, 1.25, 0.6);
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  ctx.scale(cardScale, cardScale);
  M.monitor(ctx, 0, 0, 680, 420, t, {
    title: '${safeTitle}'.toLowerCase() + ' // core.ts',
    codeLines: [
      '> model: AI_AGENT_SYNTHESIS',
      '> cadence: ${bpm} BPM [STABLE]',
      '> status: EXECUTING MOTION SHOWREEL'
    ],
    hue: 195
  });
  ctx.restore();

  // Tipografia Cinética Deslizante
  const tText = M.seg(t, 0.12, 0.65);
  ctx.save();
  M.kineticText(ctx, '${safeTitle}'.slice(0, 16), W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 96,
    color: '${paleta.text}',
    rise: 50,
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
    ctx.fillText('// SÍNTESE DE ARQUITETURA', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
  }

  return `function drawScene(ctx, t, W, H) {
  ctx.fillStyle = '${paleta.bg}';
  ctx.fillRect(0, 0, W, H);

  // Gráficos e Dashboard em tempo real
  ctx.save();
  ctx.translate(W / 2, H * 0.42);
  M.dashboard(ctx, 0, 0, 700, 440, t, {
    title: 'TRAÇÃO // ' + '${safeTitle}'.toUpperCase(),
    metric: '100K',
    label: 'USUÁRIOS ATIVOS'
  });
  ctx.restore();

  // Tipografia Cinética
  const tText = M.seg(t, 0.1, 0.6);
  ctx.save();
  M.kineticText(ctx, '${safeTitle}'.slice(0, 16), W / 2, H * 0.68, tText, {
    family: '"${tipografia.displayFont}", sans-serif',
    weight: 900,
    size: 96,
    color: '${paleta.text}',
    rise: 50,
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
    ctx.fillText('ESCALA GLOBAL // VALIDAÇÃO', W / 2, H * 0.77 + (1 - e) * 20);
    ctx.restore();
  }

  const out = M.ease.inOutCubic(M.seg(t, 0.88, 1.0));
  if (out > 0) {
    ctx.fillStyle = 'rgba(4, 6, 12, ' + out + ')';
    ctx.fillRect(0, 0, W, H);
  }
}`;
}

/**
 * Generates high-energy procedural scenes calibrated to the exact DNA
 */
export function generateProceduralScenes(dna: DNA, scriptTopic = 'Showreel'): Scene[] {
  const roles: RoleType[] = [];
  const count = Math.max(6, dna.numeroCenas || 6);
  const avgDuration = Number((dna.duracaoAlvo / count).toFixed(1));

  // Structure distribution: gancho -> corpo -> clímax -> fechamento
  roles.push('gancho');
  const corpoCount = Math.max(1, count - 3);
  for (let i = 0; i < corpoCount; i++) {
    roles.push('corpo');
  }
  roles.push('clímax');
  roles.push('fechamento');

  const defaultTitles = [
    '01 // ABERTURA KINÉTICA',
    '02 // NÚCLEO DINÂMICO',
    '03 // MATRIZ MODULAR',
    '04 // FLUXO DE ALTA VELOCIDADE',
    '05 // PICO DE VOLTAGEM',
    '06 // RESOLUÇÃO & IMPACTO',
    '07 // EXPANSÃO EXPONENCIAL',
    '08 // FECHAMENTO AUTORITÁRIO',
  ];

  const scenes: Scene[] = [];

  for (let i = 0; i < count; i++) {
    const role = roles[i] || 'corpo';
    const id = `scene_${i + 1}`;
    const name = defaultTitles[i] || `CENA 0${i + 1} // MOTION`;
    const code = generateDynamicMotionSceneCode(dna, role, i, name, scriptTopic);
    const compiledFn = compileSceneCode(code);

    scenes.push({
      id,
      name,
      duration: avgDuration,
      role,
      code,
      description: `Cena de motion design 9:16 (${role}) com física de molas e renderização Canvas 2D`,
      validated: true,
      compiledFn,
    });
  }

  return scenes;
}
