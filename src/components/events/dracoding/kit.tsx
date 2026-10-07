"use client";

import { useId } from "react";

// ============================================================================
// FERRAMENTAS DE DESENHO DE A NOITE DE DRACODING — o estilo deste evento é
// diferente dos outros: silhuetas pontudas e anguladas (pelo, palha, capas
// rasgadas), sombras fortes e "luz de contorno" (o luar azul de um lado e o
// fogo das abóboras do outro, como nas ilustrações de Halloween). Aqui ficam
// as funções que montam esses contornos e as peças que todos os desenhos usam.
// ============================================================================

export type Pt = [number, number];

const round = (v: number) => Math.round(v * 10) / 10;

/** Área com sinal do polígono: positiva quando os pontos vão no sentido horário (na tela, com y pra baixo). */
function signedArea(points: Pt[]): number {
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    sum += x1 * y2 - x2 * y1;
  }
  return sum;
}

/**
 * Contorno "rasgado": liga os pontos com dentinhos pontudos virados pra fora
 * (pelo de lobisomem, palha, pano rasgado). `depth` = tamanho dos dentes,
 * `step` = distância entre eles, `seed` = muda o sorteio do tamanho de cada
 * dente (sempre o mesmo resultado pro mesmo seed), `irregular` = o quanto o
 * tamanho dos dentes varia (0 = todos iguais, 0.9 = bem bagunçado). Num contorno
 * aberto, os dentes vão pra esquerda de quem anda pelos pontos (use `depth` negativo pra virar).
 */
export function jagged(points: Pt[], depth = 6, step = 14, seed = 1, closed = true, irregular = 0.45): string {
  const flip = closed && signedArea(points) < 0 ? -1 : 1;
  const pts = closed ? [...points, points[0]] : points;
  let d = `M${round(pts[0][0])} ${round(pts[0][1])}`;
  let k = seed * 7919;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const n = Math.max(1, Math.round(len / step));
    const nx = ((y2 - y1) / len) * flip;
    const ny = (-(x2 - x1) / len) * flip;
    for (let j = 1; j <= n; j++) {
      k = (k * 9301 + 49297) % 233280;
      const size = depth * (1 - irregular + (k / 233280) * irregular * 2);
      const mid = (j - 0.5) / n;
      const end = j / n;
      d += ` L${round(x1 + (x2 - x1) * mid + nx * size)} ${round(y1 + (y2 - y1) * mid + ny * size)}`;
      d += ` L${round(x1 + (x2 - x1) * end)} ${round(y1 + (y2 - y1) * end)}`;
    }
  }
  return closed ? `${d} Z` : d;
}

/** Polígono simples (cantos vivos). */
export function poly(points: Pt[]): string {
  return `M${points.map(([x, y]) => `${round(x)} ${round(y)}`).join(" L")} Z`;
}

/** Espelha os pontos na vertical x = `cx` (e inverte a ordem, pra continuar no mesmo sentido). */
export function mirror(points: Pt[], cx: number): Pt[] {
  return points.map(([x, y]) => [2 * cx - x, y] as Pt).reverse();
}

/** Pontos numa elipse (pra jubas e tufos), começando no topo e indo no sentido horário. */
export function ellipsePoints(cx: number, cy: number, rx: number, ry: number, count: number): Pt[] {
  return Array.from({ length: count }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / count;
    return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry] as Pt;
  });
}

/** Dedo/garra afinando até a ponta, de (x1, y1) até a ponta (x2, y2), com largura `w` na base. */
export function claw(x1: number, y1: number, x2: number, y2: number, w: number, bend = 0.25): string {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  // o meio sai um pouco pro lado, pra garra ficar curvada
  const mx = x1 + (x2 - x1) * 0.55 + nx * len * bend * 0.3;
  const my = y1 + (y2 - y1) * 0.55 + ny * len * bend * 0.3;
  return `M${round(x1 + nx * w)} ${round(y1 + ny * w)} Q${round(mx + nx * w * 0.6)} ${round(my + ny * w * 0.6)} ${round(x2)} ${round(y2)} Q${round(mx - nx * w * 0.4)} ${round(my - ny * w * 0.4)} ${round(x1 - nx * w)} ${round(y1 - ny * w)} Z`;
}

/** Prefixo único pros ids dos gradientes de um desenho (cada desenho na tela tem os seus). */
export function useSvgId(): string {
  return useId().replace(/:/g, "");
}

/**
 * Gradiente da luz de contorno, usado no `stroke` das silhuetas: o luar
 * (`left`) acende as bordas da esquerda e o fogo (`right`) as da direita; o meio
 * fica apagado. Vai em coordenadas do desenho (de x1 a x2).
 */
export function RimGradient({ id, x1, x2, left = "#93c5fd", right = "#f59e0b", leftOpacity = 0.7, rightOpacity = 0.85 }: { id: string; x1: number; x2: number; left?: string; right?: string; leftOpacity?: number; rightOpacity?: number }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={x1} y1="0" x2={x2} y2="0">
      <stop offset="0" stopColor={left} stopOpacity={leftOpacity} />
      <stop offset="0.38" stopColor={left} stopOpacity="0" />
      <stop offset="0.62" stopColor={right} stopOpacity="0" />
      <stop offset="1" stopColor={right} stopOpacity={rightOpacity} />
    </linearGradient>
  );
}

/** Filtro que escurece tudo até virar silhueta (os olhos, desenhados por fora, continuam acesos). */
export function SilhouetteFilter({ id, tint = [0.05, 0.02, 0.06] }: { id: string; tint?: [number, number, number] }) {
  const [r, g, b] = tint;
  return (
    <filter id={id}>
      <feColorMatrix type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  0 0 0 1 0`} />
    </filter>
  );
}

/** Estilo das animações com variáveis (duração, atraso, ponto de giro...). */
export function animVars(vars: { dur?: number; delay?: number; origin?: string; angle?: number; dx?: number; dy?: number; spin?: number }): React.CSSProperties {
  const style: Record<string, string> = {};
  if (vars.dur !== undefined) style["--cg-dur"] = `${vars.dur}s`;
  if (vars.delay !== undefined) style["--cg-delay"] = `${vars.delay}s`;
  if (vars.origin !== undefined) style["--cg-origin"] = vars.origin;
  if (vars.angle !== undefined) style["--cg-angle"] = `${vars.angle}deg`;
  if (vars.dx !== undefined) style["--cg-dx"] = `${vars.dx}px`;
  if (vars.dy !== undefined) style["--cg-dy"] = `${vars.dy}px`;
  if (vars.spin !== undefined) style["--cg-spin"] = `${vars.spin}deg`;
  return style as React.CSSProperties;
}
