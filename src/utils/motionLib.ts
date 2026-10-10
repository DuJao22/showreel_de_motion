/**
 * motionLib.ts — Motion Library para cenas drawScene(ctx, t, W, H) (1080x1920, t = 0..1)
 *
 * Fornece física de molas (oscilador harmônico), antecipação, cascata, easings,
 * tipografia cinética letra a letra, camadas procedurais (grid, rings, crosshair),
 * subframes / pós e margens seguras para Reels/TikTok.
 */

export interface KineticTextOptions {
  family?: string;
  weight?: number | string;
  maxW?: number;
  size?: number;
  color?: string;
  rise?: number;
  spread?: number;
  shadow?: string;
}

export interface GridOptions {
  step?: number;
  color?: string;
  drift?: number;
}

export interface RingsOptions {
  count?: number;
  r0?: number;
  gap?: number;
  color?: string;
  w?: number;
}

export interface SafeMargins {
  top: number;
  bottom: number;
  side: number;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ProjectedPoint extends Vec3 {
  scale: number;
}

export interface CubeOptions {
  solid?: boolean;
  hue?: number;
  strokeColor?: string;
  wireframe?: boolean;
  alpha?: number;
}

export interface SphereOptions {
  points?: number;
  hue?: number;
  color?: string;
  connect?: boolean;
  maxDist?: number;
  alpha?: number;
}

export interface TunnelOptions {
  sides?: number;
  rings?: number;
  speed?: number;
  color?: string;
  rotSpeed?: number;
  wireframe?: boolean;
}

export interface CardOptions {
  hue?: number;
  bg?: string;
  border?: string;
  glow?: boolean;
  contentFn?: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}

export interface MonitorOptions {
  title?: string;
  codeLines?: string[];
  cursor?: boolean;
  hue?: number;
}

export interface DashboardOptions {
  title?: string;
  mrr?: string;
  users?: string;
  latency?: string;
  progress?: number;
}

export interface MotionLib {
  TAU: number;
  n: (x: number, d?: number) => number;
  clamp: (x: number, a?: number, b?: number) => number;
  lerp: (a: number, b: number, p: number) => number;
  remap: (x: number, a: number, b: number, c: number, d: number) => number;
  seg: (t: number, a: number, b: number) => number;
  ease: {
    outCubic: (p: number) => number;
    outExpo: (p: number) => number;
    inExpo: (p: number) => number;
    inOutCubic: (p: number) => number;
    inOutQuint: (p: number) => number;
    outBack: (p: number, s?: number) => number;
  };
  spring: (p: number, freq?: number, zeta?: number) => number;
  anticipate: (p: number, pull?: number, split?: number, freq?: number, zeta?: number) => number;
  stagger: (p: number, i: number, count: number, spread?: number) => number;
  rng: (seed: number) => () => number;
  hash: (i: number) => number;
  noise: (x: number) => number;
  // 3D Perspective & Primitives
  v3: (x: number, y: number, z: number) => Vec3;
  rotate: (p: Vec3, rx?: number, ry?: number, rz?: number) => Vec3;
  project: (p: Vec3, cx: number, cy: number, fov?: number) => ProjectedPoint;
  cube: (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    rot?: Vec3,
    o?: CubeOptions
  ) => void;
  sphere: (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    rot?: Vec3,
    o?: SphereOptions
  ) => void;
  tunnel: (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    t: number,
    o?: TunnelOptions
  ) => void;
  card: (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    w: number,
    h: number,
    rot?: Vec3,
    o?: CardOptions
  ) => void;
  monitor: (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    w: number,
    h: number,
    t: number,
    o?: MonitorOptions
  ) => void;
  character: (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    scale?: number,
    t?: number,
    hue?: number
  ) => void;
  dashboard: (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    w: number,
    h: number,
    t: number,
    o?: DashboardOptions
  ) => void;
  fitFont: (
    ctx: CanvasRenderingContext2D,
    str: string,
    family: string,
    weight: number | string,
    maxW: number,
    maxSize: number,
    minSize?: number
  ) => number;
  kineticText: (
    ctx: CanvasRenderingContext2D,
    str: string,
    cx: number,
    cy: number,
    p: number,
    o?: KineticTextOptions
  ) => { size: number; width: number };
  grid: (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    t: number,
    o?: GridOptions
  ) => void;
  rings: (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    p: number,
    o?: RingsOptions
  ) => void;
  crosshair: (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    s?: number,
    color?: string,
    w?: number
  ) => void;
  snap: (
    draw: (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void,
    t: number,
    W: number,
    H: number
  ) => HTMLCanvasElement | null;
  motionBlur: (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    draw: (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void,
    t: number,
    shutter?: number,
    samples?: number
  ) => void;
  whip: (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    drawA: (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void,
    drawB: (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void,
    p: number
  ) => void;
  parallax: (
    ctx: CanvasRenderingContext2D,
    depth?: number,
    t?: number,
    customOffset?: { x?: number; y?: number }
  ) => { offsetX: number; offsetY: number };
  safe: SafeMargins;
}

export const M: MotionLib = (() => {
  const TAU = Math.PI * 2;

  /* ---------- segurança numérica ---------- */
  const n = (x: number, d = 0): number => (Number.isFinite(x) ? x : d);
  const clamp = (x: number, a = 0, b = 1): number => Math.min(b, Math.max(a, n(x, a)));
  const lerp = (a: number, b: number, p: number): number => a + (b - a) * p;
  const remap = (x: number, a: number, b: number, c: number, d: number): number =>
    lerp(c, d, clamp((x - a) / (b - a || 1)));
  // progresso local 0..1 do trecho [a,b] da cena
  const seg = (t: number, a: number, b: number): number => clamp((t - a) / (b - a || 1));

  /* ---------- easings ---------- */
  const ease = {
    outCubic: (p: number): number => 1 - Math.pow(1 - p, 3),
    outExpo: (p: number): number => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
    inExpo: (p: number): number => (p <= 0 ? 0 : Math.pow(2, 10 * p - 10)),
    inOutCubic: (p: number): number =>
      p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
    inOutQuint: (p: number): number =>
      p < 0.5 ? 16 * Math.pow(p, 5) : 1 - Math.pow(-2 * p + 2, 5) / 2,
    outBack: (p: number, s = 1.70158): number =>
      1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2),
  };

  /* ---------- física: mola amortecida (oscilador harmônico) ----------
   * p: progresso 0..1 | freq: ciclos no trecho | zeta: amortecimento (0.3 = elástico, 0.7 = suave)
   * Retorna 0 -> 1 com overshoot, e assenta exatamente em 1 no final. */
  const spring = (p: number, freq = 1.5, zeta = 0.45): number => {
    p = clamp(p);
    if (p <= 0) return 0;
    if (zeta >= 1) return ease.outExpo(p);
    const w0 = freq * TAU;
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const x =
      1 -
      Math.exp(-zeta * w0 * p) *
        (Math.cos(wd * p) + ((zeta * w0) / wd) * Math.sin(wd * p));
    return lerp(x, 1, ease.inOutCubic(remap(p, 0.8, 1, 0, 1))); // assenta sem salto
  };

  /* ---------- antecipação: recua, depois dispara com mola ----------
   * Valor vai de 0 -> -pull (recuo) -> 1 (com overshoot). */
  const anticipate = (
    p: number,
    pull = 0.15,
    split = 0.22,
    freq = 1.4,
    zeta = 0.5
  ): number => {
    p = clamp(p);
    if (p < split) return -pull * ease.outCubic(p / split);
    return lerp(-pull, 1, spring((p - split) / (1 - split), freq, zeta));
  };

  // atraso em cascata: item i de count, spread = fração do tempo usada no atraso
  const stagger = (p: number, i: number, count: number, spread = 0.5): number =>
    clamp((p - (i / Math.max(1, count - 1)) * spread) / (1 - spread || 1));

  /* ---------- determinismo ---------- */
  const rng = (seed: number) => {
    let a = seed | 0;
    return (): number => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const hash = (i: number): number => {
    const s = Math.sin(i * 127.1) * 43758.5453;
    return s - Math.floor(s);
  };

  // ruído suave 1D em -1..1 (use para "respirar" e drift orgânico)
  const noise = (x: number): number => {
    const i = Math.floor(x);
    const f = x - i;
    const u = f * f * (3 - 2 * f);
    return lerp(hash(i), hash(i + 1), u) * 2 - 1;
  };

  /* ---------- 3D e Perspectiva em Canvas 2D ---------- */
  const v3 = (x: number, y: number, z: number): Vec3 => ({
    x: n(x),
    y: n(y),
    z: n(z),
  });

  const rotate = (p: Vec3, rx = 0, ry = 0, rz = 0): Vec3 => {
    // Rotação em torno do eixo X
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const y1 = p.y * cosX - p.z * sinX;
    const z1 = p.y * sinX + p.z * cosX;

    // Rotação em torno do eixo Y
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const x2 = p.x * cosY + z1 * sinY;
    const z2 = -p.x * sinY + z1 * cosY;

    // Rotação em torno do eixo Z
    const cosZ = Math.cos(rz);
    const sinZ = Math.sin(rz);
    const x3 = x2 * cosZ - y1 * sinZ;
    const y3 = x2 * sinZ + y1 * cosZ;

    return { x: x3, y: y3, z: z2 };
  };

  const project = (p: Vec3, cx: number, cy: number, fov = 750): ProjectedPoint => {
    const depth = p.z + fov;
    const scale = depth > 20 ? fov / depth : 0.001;
    return {
      x: cx + p.x * scale,
      y: cy + p.y * scale,
      z: p.z,
      scale,
    };
  };

  const cube = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    rot: Vec3 = { x: 0, y: 0, z: 0 },
    o: CubeOptions = {}
  ): void => {
    const {
      solid = true,
      hue = 195,
      strokeColor = 'rgba(255,255,255,0.3)',
      wireframe = false,
      alpha = 1,
    } = o;

    const s = size / 2;
    // 8 vértices no espaço local
    const rawVertices: Vec3[] = [
      v3(-s, -s, -s), // 0: topo frontal esq
      v3(s, -s, -s),  // 1: topo frontal dir
      v3(s, s, -s),   // 2: base frontal dir
      v3(-s, s, -s),  // 3: base frontal esq
      v3(-s, -s, s),  // 4: topo traseiro esq
      v3(s, -s, s),   // 5: topo traseiro dir
      v3(s, s, s),    // 6: base traseira dir
      v3(-s, s, s),   // 7: base traseira esq
    ];

    // Rotaciona e projeta
    const rotVerts = rawVertices.map((v) => rotate(v, rot.x, rot.y, rot.z));
    const projVerts = rotVerts.map((v) => project(v, cx, cy));

    // 6 faces com normais no espaço rotacionado
    const faces = [
      { idx: [0, 1, 2, 3], normal: v3(0, 0, -1) }, // frente
      { idx: [5, 4, 7, 6], normal: v3(0, 0, 1) },  // trás
      { idx: [4, 0, 3, 7], normal: v3(-1, 0, 0) }, // esquerda
      { idx: [1, 5, 6, 2], normal: v3(1, 0, 0) },  // direita
      { idx: [4, 5, 1, 0], normal: v3(0, -1, 0) }, // topo
      { idx: [3, 2, 6, 7], normal: v3(0, 1, 0) },  // base
    ];

    ctx.save();
    ctx.globalAlpha = clamp(alpha);

    // Vetor de luz direcional suave
    const lightDir = { x: 0.5, y: -0.7, z: -0.6 };
    const lLen = Math.hypot(lightDir.x, lightDir.y, lightDir.z) || 1;
    const lx = lightDir.x / lLen;
    const ly = lightDir.y / lLen;
    const lz = lightDir.z / lLen;

    // Classifica faces por profundidade média (Z)
    const sortedFaces = faces
      .map((face) => {
        const rotNormal = rotate(face.normal, rot.x, rot.y, rot.z);
        const avgZ =
          face.idx.reduce((acc, i) => acc + rotVerts[i].z, 0) / face.idx.length;
        return { ...face, rotNormal, avgZ };
      })
      .sort((a, b) => b.avgZ - a.avgZ);

    for (const face of sortedFaces) {
      // Se não for wireframe, faz backface culling simples (se a normal aponta pra dentro da tela)
      if (!wireframe && face.rotNormal.z > 0.05) {
        continue;
      }

      ctx.beginPath();
      face.idx.forEach((vi, i) => {
        const p = projVerts[vi];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();

      if (solid && !wireframe) {
        // Cálculo de iluminação difusa
        const dot = -(
          face.rotNormal.x * lx +
          face.rotNormal.y * ly +
          face.rotNormal.z * lz
        );
        const intensity = clamp(0.25 + 0.75 * Math.max(0, dot), 0.2, 1);
        ctx.fillStyle = `hsla(${hue}, 80%, ${Math.round(intensity * 55)}%, 0.85)`;
        ctx.fill();
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.restore();
  };

  const sphere = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    radius: number,
    rot: Vec3 = { x: 0, y: 0, z: 0 },
    o: SphereOptions = {}
  ): void => {
    const {
      points = 70,
      hue = 190,
      color,
      connect = true,
      maxDist = 65,
      alpha = 1,
    } = o;

    ctx.save();
    ctx.globalAlpha = clamp(alpha);

    // Distribuição de Fibonacci na esfera (determinística e uniforme)
    const phi = (1 + Math.sqrt(5)) / 2;
    const goldenAngle = TAU / (phi * phi);

    const projectedList: ProjectedPoint[] = [];

    for (let i = 0; i < points; i++) {
      const y = 1 - (i / (points - 1 || 1)) * 2;
      const rAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * rAtY;
      const z = Math.sin(theta) * rAtY;

      const p3 = v3(x * radius, y * radius, z * radius);
      const rotP = rotate(p3, rot.x, rot.y, rot.z);
      const proj = project(rotP, cx, cy, 750);
      projectedList.push(proj);
    }

    // Conexões neurais/constelação entre nós próximos
    if (connect) {
      ctx.lineWidth = 1;
      for (let i = 0; i < projectedList.length; i++) {
        for (let j = i + 1; j < projectedList.length; j++) {
          const p1 = projectedList[i];
          const p2 = projectedList[j];
          const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (d < maxDist) {
            const edgeAlpha = (1 - d / maxDist) * 0.25;
            ctx.strokeStyle = color || `hsla(${hue}, 90%, 70%, ${edgeAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    }

    // Desenha pontos com brilho e ordenação de profundidade
    projectedList.sort((a, b) => b.z - a.z);
    for (const p of projectedList) {
      const ptAlpha = remap(p.z, -radius, radius, 0.9, 0.2);
      const ptRadius = Math.max(1.2, 3.5 * p.scale);

      ctx.fillStyle = color || `hsla(${hue}, 95%, 75%, ${ptAlpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, ptRadius, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  };

  const tunnel = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    t: number,
    o: TunnelOptions = {}
  ): void => {
    const {
      sides = 6,
      rings = 14,
      speed = 1,
      color = '#38bdf8',
      rotSpeed = 0.4,
    } = o;

    ctx.save();
    const angleStep = TAU / sides;
    const progress = (t * speed) % 1;
    const baseRot = t * rotSpeed;

    const ringPoints: ProjectedPoint[][] = [];

    for (let r = 0; r < rings; r++) {
      // Z viaja de 1400 (fundo) até 40 (câmera)
      const ringP = (r / rings + progress) % 1;
      const z = lerp(1400, 40, ease.outExpo(ringP));
      const ringRadius = 550;
      const pts: ProjectedPoint[] = [];

      for (let s = 0; s < sides; s++) {
        const a = s * angleStep + baseRot + ringP * 0.2;
        const p3 = v3(Math.cos(a) * ringRadius, Math.sin(a) * ringRadius, z - 700);
        pts.push(project(p3, cx, cy, 700));
      }
      ringPoints.push(pts);

      // Desenha o polígono do anel
      const ringAlpha = remap(z, 40, 1400, 0.7, 0.05);
      ctx.strokeStyle = color;
      ctx.globalAlpha = clamp(ringAlpha);
      ctx.lineWidth = Math.max(1, 2.5 * (1 - ringP));

      ctx.beginPath();
      pts.forEach((p, idx) => {
        if (idx === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.stroke();
    }

    // Trilhos longitudinais conectando anéis
    ctx.globalAlpha = 0.18;
    ctx.lineWidth = 1;
    for (let s = 0; s < sides; s++) {
      ctx.beginPath();
      for (let r = 0; r < ringPoints.length; r++) {
        const p = ringPoints[r][s];
        if (r === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    ctx.restore();
  };

  const card = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    w: number,
    h: number,
    rot: Vec3 = { x: 0, y: 0, z: 0 },
    o: CardOptions = {}
  ): void => {
    const {
      hue = 210,
      bg = 'rgba(12, 16, 28, 0.85)',
      border = 'rgba(56, 189, 248, 0.45)',
      glow = true,
      contentFn,
    } = o;

    const hw = w / 2;
    const hh = h / 2;
    const rawCorners: Vec3[] = [
      v3(-hw, -hh, 0),
      v3(hw, -hh, 0),
      v3(hw, hh, 0),
      v3(-hw, hh, 0),
    ];

    const rotCorners = rawCorners.map((p) => rotate(p, rot.x, rot.y, rot.z));
    const projCorners = rotCorners.map((p) => project(p, cx, cy));

    ctx.save();
    if (glow) {
      ctx.shadowColor = `hsla(${hue}, 90%, 60%, 0.35)`;
      ctx.shadowBlur = 30;
    }

    ctx.beginPath();
    projCorners.forEach((p, idx) => {
      if (idx === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();

    ctx.fillStyle = bg;
    ctx.fill();

    ctx.strokeStyle = border;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Se houver função de render de conteúdo interno no espaço do card
    if (contentFn) {
      ctx.save();
      ctx.translate(cx, cy);
      // Aplica rotação planar se for leve
      ctx.rotate(rot.z);
      contentFn(ctx, w, h);
      ctx.restore();
    }

    ctx.restore();
  };

  const monitor = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    w: number,
    h: number,
    t: number,
    o: MonitorOptions = {}
  ): void => {
    const {
      title = 'terminal // ai_core.ts',
      codeLines = [
        '> const ai = new NeuralDirector();',
        '> await ai.synthesize({ target: "SaaS", level: 99 });',
        '> status: 10,000 LOC COMPILED [PERFECT]',
        '> mrr: $48,200.00 /mo [SCALING]',
      ],
      cursor = true,
      hue = 195,
    } = o;

    ctx.save();
    // Brilho volumétrico no fundo do monitor
    const glowGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, w * 0.9);
    glowGrad.addColorStop(0, `hsla(${hue}, 90%, 55%, 0.16)`);
    glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(cx - w, cy - h, w * 2, h * 2);

    // Carcaça externa do monitor
    ctx.save();
    ctx.shadowColor = `hsla(${hue}, 90%, 50%, 0.4)`;
    ctx.shadowBlur = 24;
    ctx.fillStyle = '#070a14';
    ctx.strokeStyle = `hsla(${hue}, 80%, 65%, 0.6)`;
    ctx.lineWidth = 3;
    const r = 16;
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, cy - h / 2, w, h, r);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Barra de título do terminal
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(cx - w / 2 + 4, cy - h / 2 + 4, w - 8, 44, [12, 12, 0, 0]);
    ctx.fill();

    // Botões macOS estilo terminal (vermelho, amarelo, verde)
    const btnY = cy - h / 2 + 26;
    const btnColors = ['#ef4444', '#f59e0b', '#10b981'];
    btnColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx - w / 2 + 28 + i * 22, btnY, 6, 0, TAU);
      ctx.fill();
    });

    // Título do terminal
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 20px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, cx, btnY);

    // Linhas de código animadas
    const textStartY = cy - h / 2 + 85;
    ctx.textAlign = 'left';
    ctx.font = '500 22px "JetBrains Mono", monospace';

    const visibleCount = Math.min(
      codeLines.length,
      Math.floor(remap(t, 0.05, 0.85, 1, codeLines.length + 1))
    );

    codeLines.slice(0, visibleCount).forEach((line, i) => {
      const lineY = textStartY + i * 36;
      ctx.fillStyle =
        i === 0
          ? `hsl(${hue}, 90%, 75%)`
          : i === codeLines.length - 1
          ? '#4ade80'
          : '#e2e8f0';
      ctx.fillText(line, cx - w / 2 + 30, lineY);
    });

    // Cursor piscante
    if (cursor && Math.floor(t * 8) % 2 === 0) {
      const activeLineY = textStartY + (Math.max(0, visibleCount - 1)) * 36;
      const activeText = codeLines[Math.max(0, visibleCount - 1)] || '';
      ctx.font = '500 22px "JetBrains Mono", monospace';
      const textW = ctx.measureText(activeText).width;
      ctx.fillStyle = `hsl(${hue}, 100%, 70%)`;
      ctx.fillRect(cx - w / 2 + 34 + textW, activeLineY - 14, 10, 20);
    }

    // Suporte / Base do monitor
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(cx - 24, cy + h / 2, 48, 40);
    ctx.beginPath();
    ctx.roundRect(cx - 90, cy + h / 2 + 40, 180, 12, 6);
    ctx.fill();

    ctx.restore();
  };

  const character = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    scale = 1,
    t = 0,
    hue = 195
  ): void => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    // Efeito de respiro suave
    const breath = 1 + 0.02 * Math.sin(t * TAU * 1.5);
    ctx.scale(1, breath);

    // Silhueta do garoto / desenvolvedor: capuz e ombros
    ctx.fillStyle = '#070913';
    ctx.beginPath();
    // Ombros
    ctx.moveTo(-140, 160);
    ctx.quadraticCurveTo(-110, 80, -65, 50);
    // Pescoço / Capuz esquerdo
    ctx.quadraticCurveTo(-75, -20, -50, -80);
    // Topo da cabeça / Capuz
    ctx.quadraticCurveTo(0, -110, 50, -80);
    // Capuz direito
    ctx.quadraticCurveTo(75, -20, 65, 50);
    // Ombro direito
    ctx.quadraticCurveTo(110, 80, 140, 160);
    ctx.closePath();
    ctx.fill();

    // Fone de ouvido neon brilhante (Headphones)
    const phoneLight = remap(noise(t * 5), -1, 1, 0.7, 1);
    ctx.fillStyle = '#1e293b';
    // Haste
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#334155';
    ctx.beginPath();
    ctx.arc(0, -70, 62, Math.PI * 0.9, Math.PI * 2.1);
    ctx.stroke();

    // Concha esquerda
    ctx.fillStyle = `hsla(${hue}, 90%, 55%, ${0.8 * phoneLight})`;
    ctx.shadowColor = `hsla(${hue}, 100%, 60%, 0.6)`;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.ellipse(-58, -50, 14, 26, -0.1, 0, TAU);
    ctx.fill();

    // Concha direita
    ctx.beginPath();
    ctx.ellipse(58, -50, 14, 26, 0.1, 0, TAU);
    ctx.fill();

    // Luz da tela incidindo no rosto / óculos
    const faceLight = remap(noise(t * 8), -1, 1, 0.4, 0.9);
    ctx.fillStyle = `hsla(${hue}, 90%, 75%, ${0.35 * faceLight})`;
    ctx.shadowColor = `hsla(${hue}, 90%, 70%, 0.5)`;
    ctx.shadowBlur = 20;
    // Reflexo nos óculos/perfil
    ctx.beginPath();
    ctx.roundRect(-28, -60, 22, 10, 3);
    ctx.roundRect(6, -60, 22, 10, 3);
    ctx.fill();

    ctx.restore();
  };

  const dashboard = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    w: number,
    h: number,
    t: number,
    o: DashboardOptions = {}
  ): void => {
    const {
      title = 'HYPERSAAS // LIVE METRICS',
      mrr = '$48,200',
      users = '10,480',
      latency = '12ms',
      progress = 1,
    } = o;

    ctx.save();
    // Moldura principal de vidro (Glassmorphism)
    ctx.fillStyle = 'rgba(11, 15, 28, 0.92)';
    ctx.shadowColor = 'rgba(56, 189, 248, 0.3)';
    ctx.shadowBlur = 35;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 20);
    ctx.fill();
    ctx.stroke();

    // Header com status
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.roundRect(cx - w / 2 + 4, cy - h / 2 + 4, w - 8, 54, [16, 16, 0, 0]);
    ctx.fill();

    // Badge verde ONLINE
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(cx - w / 2 + 36, cy - h / 2 + 31, 6, 0, TAU);
    ctx.fill();

    ctx.font = '700 20px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, cx - w / 2 + 54, cy - h / 2 + 31);

    // 3 Cards de Métricas em grid
    const cardW = (w - 70) / 3;
    const cardH = 95;
    const cardY = cy - h / 2 + 75;

    const metrics = [
      { label: 'MRR ATUAL', val: mrr, color: '#38bdf8' },
      { label: 'USUÁRIOS ATIVOS', val: users, color: '#a855f7' },
      { label: 'LATÊNCIA P99', val: latency, color: '#10b981' },
    ];

    metrics.forEach((m, idx) => {
      const cardX = cx - w / 2 + 25 + idx * (cardW + 10);
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.font = '500 16px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(m.label, cardX + 16, cardY + 28);

      ctx.font = '800 30px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = m.color;
      ctx.fillText(m.val, cardX + 16, cardY + 68);
    });

    // Gráfico de Linha de Crescimento Neon (Growth Chart)
    const graphX = cx - w / 2 + 25;
    const graphY = cy - h / 2 + 195;
    const graphW = w - 50;
    const graphH = h - 225;

    // Fundo do gráfico
    ctx.fillStyle = 'rgba(255,255,255,0.02)';
    ctx.beginPath();
    ctx.roundRect(graphX, graphY, graphW, graphH, 14);
    ctx.fill();

    // Curva de crescimento com Bézier
    const pCount = 8;
    const pStep = graphW / (pCount - 1);
    const chartProgress = clamp(progress * remap(t, 0.1, 0.85, 0, 1));

    const points = [
      { x: graphX, y: graphY + graphH - 20 },
      { x: graphX + pStep, y: graphY + graphH - 45 },
      { x: graphX + pStep * 2, y: graphY + graphH - 60 },
      { x: graphX + pStep * 3, y: graphY + graphH - 95 },
      { x: graphX + pStep * 4, y: graphY + graphH - 120 },
      { x: graphX + pStep * 5, y: graphY + graphH - 170 },
      { x: graphX + pStep * 6, y: graphY + graphH - 220 },
      { x: graphX + graphW, y: graphY + 30 },
    ];

    ctx.save();
    ctx.beginPath();
    ctx.rect(graphX, graphY, graphW * chartProgress, graphH);
    ctx.clip();

    // Área sob a curva com gradiente
    const areaGrad = ctx.createLinearGradient(0, graphY, 0, graphY + graphH);
    areaGrad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
    areaGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cxp = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cxp, prev.y, cxp, curr.y, curr.x, curr.y);
    }
    ctx.lineTo(graphX + graphW, graphY + graphH);
    ctx.lineTo(graphX, graphY + graphH);
    ctx.closePath();
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Linha do gráfico
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cxp = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cxp, prev.y, cxp, curr.y, curr.x, curr.y);
    }
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 18;
    ctx.stroke();

    ctx.restore();

    // Ponto indicador pulsante no clímax do gráfico
    if (chartProgress > 0.85) {
      const lastP = points[points.length - 1];
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.arc(lastP.x, lastP.y, 8, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  };

  /* ---------- tipografia ---------- */
  const fitFont = (
    ctx: CanvasRenderingContext2D,
    str: string,
    family: string,
    weight: number | string,
    maxW: number,
    maxSize: number,
    minSize = 24
  ): number => {
    ctx.font = `${weight} ${maxSize}px ${family}`;
    const w = ctx.measureText(str).width || 1;
    const s =
      w > maxW ? Math.max(minSize, Math.floor((maxSize * maxW) / w)) : maxSize;
    ctx.font = `${weight} ${s}px ${family}`;
    return s;
  };

  // texto monumental letra a letra, centralizado de verdade, com mola + sombra projetada
  const kineticText = (
    ctx: CanvasRenderingContext2D,
    str: string,
    cx: number,
    cy: number,
    p: number,
    o: KineticTextOptions = {}
  ): { size: number; width: number } => {
    const {
      family = 'Inter, sans-serif',
      weight = 800,
      maxW = 900,
      size = 160,
      color = '#fff',
      rise = 70,
      spread = 0.6,
      shadow = 'rgba(0,0,0,0.45)',
    } = o;

    ctx.save();
    const s = fitFont(ctx, str, family, weight, maxW, size);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    const chars = [...str];
    const total = ctx.measureText(str).width;
    let x = cx - total / 2;
    chars.forEach((ch, i) => {
      const q = stagger(p, i, chars.length, spread);
      const e = spring(q, 1.4, 0.5);
      ctx.globalAlpha = clamp(q * 3);
      ctx.fillStyle = color;
      ctx.shadowColor = shadow;
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 8;
      ctx.fillText(ch, x, cy + (1 - e) * rise);
      x += ctx.measureText(ch).width;
    });
    ctx.restore();
    return { size: s, width: total };
  };

  /* ---------- camadas prontas (atmosfera / geometria / acentos) ---------- */
  const grid = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    t: number,
    o: GridOptions = {}
  ): void => {
    const {
      step = 90,
      color = 'rgba(255,255,255,0.06)',
      drift = 40,
    } = o;
    const off = (t * drift) % step;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -step + off; x < W + step; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (let y = -step + off; y < H + step; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();
    ctx.restore();
  };

  const rings = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    p: number,
    o: RingsOptions = {}
  ): void => {
    const {
      count = 5,
      r0 = 120,
      gap = 90,
      color = 'rgba(255,255,255,0.18)',
      w = 2,
    } = o;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    for (let i = 0; i < count; i++) {
      const e = spring(stagger(p, i, count, 0.5), 1.2, 0.55);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0, (r0 + i * gap) * e), 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  };

  const crosshair = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    s = 40,
    color = 'rgba(255,255,255,0.5)',
    w = 2
  ): void => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x - s, y);
    ctx.lineTo(x + s, y);
    ctx.moveTo(x, y - s);
    ctx.lineTo(x, y + s);
    ctx.stroke();
    ctx.restore();
  };

  /* ---------- pós: motion blur e transição entre cenas ---------- */
  let _off: HTMLCanvasElement | null = null;
  const snap = (
    draw: (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void,
    t: number,
    W: number,
    H: number
  ): HTMLCanvasElement | null => {
    if (typeof document === 'undefined') return null;
    if (!_off || _off.width !== W || _off.height !== H) {
      _off = document.createElement('canvas');
      _off.width = W;
      _off.height = H;
    }
    const c = _off.getContext('2d');
    if (!c) return null;
    c.save();
    c.clearRect(0, 0, W, H);
    draw(c, t, W, H);
    c.restore();
    return _off;
  };

  // motion blur por subframes (obturador curto = shutter ~0.01-0.03)
  const motionBlur = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    draw: (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void,
    t: number,
    shutter = 0.02,
    samples = 6
  ): void => {
    if (typeof document === 'undefined') return;
    const buf = document.createElement('canvas');
    buf.width = W;
    buf.height = H;
    const b = buf.getContext('2d');
    if (!b) return;

    for (let i = 0; i < samples; i++) {
      const ti = clamp(t - shutter * (1 - i / Math.max(1, samples - 1)));
      b.save();
      b.clearRect(0, 0, W, H);
      draw(b, ti, W, H);
      b.restore();
      ctx.save();
      ctx.globalAlpha = 1 / (i + 1);
      ctx.drawImage(buf, 0, 0);
      ctx.restore();
    }
  };

  // transição "zoom whip": A sai ampliando, B entra reduzindo (p = 0..1)
  const whip = (
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    drawA: (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void,
    drawB: (ctx: CanvasRenderingContext2D, t: number, W: number, H: number) => void,
    p: number
  ): void => {
    if (typeof document === 'undefined') return;
    const e = ease.inOutQuint(clamp(p));
    const a = document.createElement('canvas');
    a.width = W;
    a.height = H;
    const b = document.createElement('canvas');
    b.width = W;
    b.height = H;
    const ca = a.getContext('2d');
    const cb = b.getContext('2d');
    if (!ca || !cb) return;

    drawA(ca, 1, W, H);
    drawB(cb, 0, W, H);

    const put = (img: HTMLCanvasElement, k: number, alpha: number) => {
      ctx.save();
      ctx.globalAlpha = clamp(alpha);
      ctx.translate(W / 2, H / 2);
      ctx.scale(k, k);
      ctx.translate(-W / 2, -H / 2);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    };

    put(a, 1 + e * 0.35, 1 - e);
    put(b, 1.35 - e * 0.35, e);
  };

  // margens aproximadas de interface do Reels/TikTok em 1080x1920 (mantenha o texto dentro)
  const safe: SafeMargins = { top: 230, bottom: 440, side: 60 };

  /**
   * Deslocamento de profundidade Parallax 2.5D
   * Move o contexto com base na profundidade da camada (depth: 0.1 fundo distante .. 1.0 plano focal .. 2.0 primeiro plano)
   */
  const parallax = (
    ctx: CanvasRenderingContext2D,
    depth = 1.0,
    t = 0,
    customOffset?: { x?: number; y?: number }
  ): { offsetX: number; offsetY: number } => {
    const d = clamp(depth, 0.05, 3.0);
    const driftX = Math.sin(t * TAU) * 16 + Math.sin(t * TAU * 1.5) * 8;
    const driftY = Math.cos(t * TAU * 0.8) * 12 + Math.cos(t * TAU * 1.2) * 6;
    const offX = (customOffset?.x ?? driftX) * (d - 1.0);
    const offY = (customOffset?.y ?? driftY) * (d - 1.0);
    ctx.translate(offX, offY);
    return { offsetX: offX, offsetY: offY };
  };

  return {
    TAU,
    n,
    clamp,
    lerp,
    remap,
    seg,
    ease,
    spring,
    anticipate,
    stagger,
    rng,
    hash,
    noise,
    v3,
    rotate,
    project,
    cube,
    sphere,
    tunnel,
    card,
    monitor,
    character,
    dashboard,
    fitFont,
    kineticText,
    grid,
    rings,
    crosshair,
    snap,
    motionBlur,
    whip,
    parallax,
    safe,
  };
})();

// Attach to globalThis / window for direct accessibility
if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { M: MotionLib }).M = M;
}
if (typeof window !== 'undefined') {
  (window as unknown as { M: MotionLib }).M = M;
}

export default M;
