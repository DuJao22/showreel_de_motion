/**
 * parallaxEngine.ts — Sistema de Efeito Parallax 2.5D para Showreel Motion Design
 *
 * Fornece cálculo de profundidade multi-camadas (z-depth), tracking do ponteiro/mouse
 * com interpolação suave (inércia/lerp) e deriva cinematográfica contínua da timeline.
 */

export interface ParallaxCoords {
  targetX: number; // -1.0 a +1.0
  targetY: number;
  smoothX: number;
  smoothY: number;
}

export interface ParallaxOffset {
  bgX: number; // Camada profunda (z = 0.25)
  bgY: number;
  sceneX: number; // Plano focal (z = 1.0)
  sceneY: number;
  fgX: number; // Primeiro plano óptico (z = 1.85)
  fgY: number;
  rotX: number; // Tilt de perspectiva 3D em graus
  rotY: number;
}

/**
 * Calcula deslocamento multi-camadas 2.5D combinando interação do cursor e drift da timeline
 */
export function calculateParallaxOffsets(
  smoothX: number,
  smoothY: number,
  sceneT: number,
  currentTime: number,
  enabled: boolean = true
): ParallaxOffset {
  if (!enabled) {
    return {
      bgX: 0,
      bgY: 0,
      sceneX: 0,
      sceneY: 0,
      fgX: 0,
      fgY: 0,
      rotX: 0,
      rotY: 0,
    };
  }

  // Deriva senoidal suave da câmera cinematográfica ao longo da timeline
  const tau = Math.PI * 2;
  const driftX = Math.sin(sceneT * tau) * 15 + Math.sin(currentTime * 1.4) * 8;
  const driftY = Math.cos(sceneT * tau * 0.8) * 11 + Math.cos(currentTime * 1.0) * 6;

  // Interação do mouse com amplitude calibrada para viewport 1080x1920
  const mouseAmplitude = 38;
  const totalX = smoothX * mouseAmplitude + driftX;
  const totalY = smoothY * mouseAmplitude + driftY;

  return {
    // Fundo distante (move-se a 25% da velocidade)
    bgX: totalX * 0.25,
    bgY: totalY * 0.25,

    // Cena principal (plano focal a 100%)
    sceneX: totalX * 1.0,
    sceneY: totalY * 1.0,

    // Primeiro plano óptico (move-se a 185% da velocidade, ampliando o efeito 2.5D)
    fgX: totalX * 1.85,
    fgY: totalY * 1.85,

    // Rotação sutil da câmera em perspectiva (graus)
    rotX: -smoothY * 5.5,
    rotY: smoothX * 5.5,
  };
}

/**
 * Renderiza camada de fundo profundo 2.5D (z = 0.25)
 * Gera partículas espaciais sutis e malha de coordenadas que amplificam a tridimensionalidade
 */
export function renderParallaxDeepBackground(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  offsetX: number,
  offsetY: number,
  sceneT: number,
  color?: string
) {
  ctx.save();
  ctx.translate(offsetX, offsetY);

  // Grid de pontos esparsos de profundidade
  const cols = 6;
  const rows = 10;
  const stepX = W / cols;
  const stepY = H / rows;

  ctx.fillStyle = color ? `${color}18` : 'rgba(255, 255, 255, 0.04)';
  for (let c = 0; c <= cols; c++) {
    for (let r = 0; r <= rows; r++) {
      const px = c * stepX;
      const py = r * stepY;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Partículas cósmicas lentas flutuando no plano distante
  const particleCount = 18;
  for (let i = 0; i < particleCount; i++) {
    const seed = i * 137.5;
    const px = ((Math.sin(seed) * 0.5 + 0.5) * W + Math.sin(sceneT * Math.PI + i) * 20) % W;
    const py = ((Math.cos(seed * 1.3) * 0.5 + 0.5) * H + sceneT * 30 * ((i % 3) + 1)) % H;
    const rad = 2 + (i % 3) * 1.5;
    const alpha = 0.06 + (i % 5) * 0.03;

    ctx.fillStyle = color ? `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}` : `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Renderiza camada de primeiro plano óptico 2.5D (z = 1.85)
 * Elementos que passam mais rápido que a cena (bokeh, flares e partículas de poeira luminosa)
 */
export function renderParallaxForeground(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  offsetX: number,
  offsetY: number,
  sceneT: number,
  accentColor?: string
) {
  ctx.save();
  ctx.translate(offsetX, offsetY);

  // Bokeh luminoso e partículas ópticas em alta velocidade de paralaxe
  const bokehCount = 12;
  for (let i = 0; i < bokehCount; i++) {
    const seed = i * 73.1;
    const px = ((Math.cos(seed) * 0.5 + 0.5) * (W + 200) - 100 + Math.sin(sceneT * 2 + i) * 60) % W;
    const py = ((Math.sin(seed * 1.7) * 0.5 + 0.5) * (H + 200) - 100 - sceneT * 90 * ((i % 2) + 1)) % H;
    const radius = 12 + (i % 4) * 14;

    const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
    if (i % 2 === 0 && accentColor) {
      grad.addColorStop(0, `${accentColor}33`);
      grad.addColorStop(0.5, `${accentColor}12`);
      grad.addColorStop(1, 'transparent');
    } else {
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.16)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
      grad.addColorStop(1, 'transparent');
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Linha tênue de scanner óptico / crosshair de profundidade nos cantos
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  const cornerPad = 48;
  const cornerLen = 28;

  // Canto superior direito
  ctx.beginPath();
  ctx.moveTo(W - cornerPad - cornerLen, cornerPad);
  ctx.lineTo(W - cornerPad, cornerPad);
  ctx.lineTo(W - cornerPad, cornerPad + cornerLen);
  ctx.stroke();

  // Canto inferior esquerdo
  ctx.beginPath();
  ctx.moveTo(cornerPad + cornerLen, H - cornerPad);
  ctx.lineTo(cornerPad, H - cornerPad);
  ctx.lineTo(cornerPad, H - cornerPad - cornerLen);
  ctx.stroke();

  ctx.restore();
}
