"use client";

import { useId } from "react";

// ============================================================================
// ARTE DA TELA INICIAL — o logo da CodeGuilds, a faixa embaixo dele e o botão
// Play, em SVG puro. Tudo em ouro (o metal do Mago Danilo) com magia: o logo
// tem a aura dourada, o rastro de varinha e faíscas;
// o botão é o portal arcano do mago: o selo de ouro com o anel de runas e o
// vórtice girando, com o ▶ no meio e a faixa embaixo.
// `fontFamily` vem da fonte da tela (Cinzel Decorative); `animate` = false
// desliga os brilhos que passam (quem pediu menos movimento no sistema).
// ============================================================================

/** Estrelinha de quatro pontas (faísca), centrada em (x, y), com raio `r`. */
function sparklePath(x: number, y: number, r: number): string {
  const k = r * 0.22;
  return `M${x} ${y - r} L${x + k} ${y - k} L${x + r} ${y} L${x + k} ${y + k} L${x} ${y + r} L${x - k} ${y + k} L${x - r} ${y} L${x - k} ${y - k} Z`;
}

/** As faixas do ouro: claro em cima, a "linha do horizonte" escura no meio e o reflexo embaixo. */
function GoldStops() {
  return (
    <>
      <stop offset="0" stopColor="#fffbeb" />
      <stop offset="0.28" stopColor="#fde68a" />
      <stop offset="0.5" stopColor="#f59e0b" />
      <stop offset="0.54" stopColor="#92400e" />
      <stop offset="0.62" stopColor="#d97706" />
      <stop offset="0.82" stopColor="#fcd34d" />
      <stop offset="1" stopColor="#fef3c7" />
    </>
  );
}

// Faíscas em volta do logo: [x, y, raio, atraso s]
const LOGO_SPARKLES: [number, number, number, number][] = [
  [92, 92, 13, 0],
  [828, 110, 16, 0.9],
  [770, 52, 9, 1.7],
  [150, 250, 9, 2.3],
  [452, 40, 11, 1.2],
  [868, 238, 10, 0.5],
  [40, 196, 8, 2.8],
];

/**
 * O nome CodeGuilds em ouro, com a aura dourada, o rastro de varinha e as faíscas. São duas camadas no
 * mesmo viewBox: embaixo, o metal (parado, com o desfoque da aura e a sombra, que são caros de desenhar);
 * por cima, numa camada própria, só o que anima (o brilho passando, a estrela e as faíscas). Assim a
 * animação não obriga a redesenhar o desfoque a cada quadro.
 */
export function TitleLogo({ fontFamily, animate = true, className = "" }: { fontFamily: string; animate?: boolean; className?: string }) {
  const id = `lg${useId().replace(/:/g, "")}`;
  const word = (extra: React.SVGProps<SVGTextElement>) => (
    <text
      x="450"
      y="214"
      textAnchor="middle"
      fontSize="150"
      fontWeight="900"
      textLength="820"
      lengthAdjust="spacingAndGlyphs"
      style={{ fontFamily }}
      {...extra}
    >
      CodeGuilds
    </text>
  );

  return (
    <div className={`relative ${className}`} role="img" aria-label="CodeGuilds">
      {/* o metal, parado (a sombra embaixo dele também fica só nesta camada) */}
      <svg viewBox="0 0 900 330" className="block w-full overflow-visible" style={{ filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.7))" }} aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-gold`} x1="0" y1="90" x2="0" y2="230" gradientUnits="userSpaceOnUse">
            <GoldStops />
          </linearGradient>
          <linearGradient id={`${id}-trail`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fde68a" stopOpacity="0" />
            <stop offset="0.6" stopColor="#fde68a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff7d6" />
          </linearGradient>
          <filter id={`${id}-blur`} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* aura dourada, a "espessura" do metal (a sombra em baixo) e o contorno escuro */}
        {word({ fill: "none", stroke: "#f59e0b", strokeWidth: 26, opacity: 0.55, filter: `url(#${id}-blur)` })}
        {word({ y: 222, fill: "#5b2a07", stroke: "#1c0a02", strokeWidth: 14, strokeLinejoin: "round" })}
        {word({ fill: `url(#${id}-gold)`, stroke: "#2a1205", strokeWidth: 8, strokeLinejoin: "round", paintOrder: "stroke" })}
        {/* o fio de luz por dentro das letras */}
        {word({ fill: "none", stroke: "#fff7d6", strokeWidth: 1.4, opacity: 0.65 })}

        {/* o rastro da varinha embaixo do nome */}
        <path d="M150 268 C330 304 560 302 748 250" fill="none" stroke={`url(#${id}-trail)`} strokeWidth="5" strokeLinecap="round" />
        <path d="M180 282 C360 312 560 310 720 270" fill="none" stroke="#fbbf24" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* o que anima, numa camada só dela (will-change), por cima do metal */}
      <svg viewBox="0 0 900 330" className="absolute inset-0 h-full w-full overflow-visible" style={{ willChange: "transform" }} aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-shine`} gradientUnits="userSpaceOnUse" x1="-320" y1="0" x2="-120" y2="60">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
            {animate && (
              <>
                <animate attributeName="x1" values="-320;1100;1100" keyTimes="0;0.45;1" dur="5s" repeatCount="indefinite" />
                <animate attributeName="x2" values="-120;1300;1300" keyTimes="0;0.45;1" dur="5s" repeatCount="indefinite" />
              </>
            )}
          </linearGradient>
        </defs>
        {/* o brilho passando pelas letras */}
        {word({ fill: `url(#${id}-shine)`, opacity: 0.85 })}

        {/* a estrela na ponta do rastro */}
        <g className="cg-anim-glow" style={{ "--cg-dur": "1.8s" } as React.CSSProperties}>
          <circle cx="752" cy="248" r="16" fill="#fde68a" opacity="0.35" />
          <path d={sparklePath(752, 248, 20)} fill="#fff7d6" />
        </g>

        {/* faíscas piscando em volta (o brilho delas é um contorno largo e claro, não um filtro) */}
        {LOGO_SPARKLES.map(([x, y, r, delay]) => (
          <path
            key={`${x}-${y}`}
            d={sparklePath(x, y, r)}
            fill="#fde68a"
            stroke="#fbbf24"
            strokeOpacity="0.45"
            strokeWidth="4"
            strokeLinejoin="round"
            paintOrder="stroke"
            className="cg-anim-twinkle"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

/** A faixa embaixo do logo, com as pontas dobradas. */
export function TitleRibbon({ text, fontFamily, className = "" }: { text: string; fontFamily: string; className?: string }) {
  const id = `rb${useId().replace(/:/g, "")}`;

  return (
    <svg viewBox="0 0 640 74" className={`overflow-visible ${className}`} role="img" aria-label={text}>
      <defs>
        <linearGradient id={`${id}-cloth`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="0.55" stopColor="#4c1d95" />
          <stop offset="1" stopColor="#2e1065" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <GoldStops />
        </linearGradient>
      </defs>
      {/* as pontas, atrás */}
      <path d="M70 22 L4 22 L30 44 L4 66 L90 66 Z" fill="#2e1065" stroke={`url(#${id}-gold)`} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M570 22 L636 22 L610 44 L636 66 L550 66 Z" fill="#2e1065" stroke={`url(#${id}-gold)`} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M70 56 L90 66 L90 56 Z M570 56 L550 66 L550 56 Z" fill="#1e0b3b" />
      {/* a faixa da frente */}
      <path d="M70 8 L570 8 L570 56 L70 56 Z" fill={`url(#${id}-cloth)`} stroke={`url(#${id}-gold)`} strokeWidth="3" />
      <path d="M78 15 L562 15 M78 49 L562 49" stroke="#fbbf24" strokeOpacity="0.45" strokeWidth="1" />
      <text
        x="320"
        y="40"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        textLength="440"
        lengthAdjust="spacingAndGlyphs"
        fill="#fde68a"
        style={{ fontFamily, filter: "drop-shadow(0 1px 0 #1e0b3b)" }}
      >
        {text}
      </text>
    </svg>
  );
}

// Bolas de fogo correndo pela chama: [y, raio, atraso s, distância]
const FIRE_PUFFS: [number, number, number, number][] = [
  [56, 14, 0, 330],
  [66, 12, 0.18, 300],
  [52, 10, 0.36, 350],
  [64, 16, 0.5, 320],
  [58, 11, 0.66, 290],
];
// Brasas voando pra fora da chama: [x, y, atraso s]
const FIRE_EMBERS: [number, number, number][] = [
  [120, 30, 0.1],
  [210, 96, 0.4],
  [290, 18, 0.7],
  [340, 104, 0.25],
  [180, 12, 0.55],
];

/**
 * O sopro de fogo do Dragão Ancestral: a chama sai da boca (a ponta esquerda
 * do desenho, no meio da altura) e abre pra direita, tremendo, com as bolas
 * de fogo correndo por ela e as brasas voando. Quem usa gira e posiciona
 * pela boca do dragão.
 */
export function DragonBreath({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  const id = `fb${useId().replace(/:/g, "")}`;

  return (
    <svg viewBox="0 0 400 120" className={`overflow-visible ${className}`} style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-outer`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff7d6" />
          <stop offset="0.12" stopColor="#fde047" />
          <stop offset="0.45" stopColor="#f97316" />
          <stop offset="0.8" stopColor="#dc2626" stopOpacity="0.85" />
          <stop offset="1" stopColor="#7f1d1d" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-core`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#fef08a" />
          <stop offset="1" stopColor="#fb923c" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-puff`}>
          <stop offset="0" stopColor="#fef9c3" />
          <stop offset="0.5" stopColor="#fb923c" />
          <stop offset="1" stopColor="#dc2626" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="cg-anim-fire-stream">
        <g className="cg-anim-fire-flicker">
          {/* o clarão em volta (transparente e sem desfoque: a chama treme rápido demais pra refazer um filtro a cada quadro), a chama e o miolo */}
          <path d="M0 60 C60 36 170 4 400 -8 L400 128 C170 116 60 84 0 60 Z" fill={`url(#${id}-outer)`} opacity="0.4" />
          <path d="M0 60 C80 44 200 24 380 18 L380 102 C200 96 80 76 0 60 Z" fill={`url(#${id}-outer)`} />
          <path d="M0 60 C70 52 170 44 290 42 L290 78 C170 76 70 68 0 60 Z" fill={`url(#${id}-core)`} />
        </g>
        {FIRE_PUFFS.map(([y, r, delay, tx]) => (
          <circle
            key={delay}
            cx="30"
            cy={y}
            r={r}
            fill={`url(#${id}-puff)`}
            className="cg-anim-fire-puff"
            style={{ "--cg-delay": `${delay}s`, "--cg-tx": `${tx}px` } as React.CSSProperties}
          />
        ))}
        {FIRE_EMBERS.map(([x, y, delay]) => (
          <circle key={delay} cx={x} cy={y} r="3" fill="#fde047" stroke="#f97316" strokeOpacity="0.5" strokeWidth="3" paintOrder="stroke" className="cg-anim-twinkle" style={{ animationDelay: `${delay}s` }} />
        ))}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// O botão Play: o PORTAL ARCANO (viewBox 320×330; o centro do portal em 160, 150)
// ---------------------------------------------------------------------------

const PORTAL = { x: 160, y: 150 };

/** Um braço da espiral do portal: sai do meio e abre até a borda, começando no ângulo `start`. */
function spiralArm(start: number, turns = 1.4, outer = 86): string {
  const steps = 48;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = ((start + t * turns * 360) * Math.PI) / 180;
    const r = 4 + t * (outer - 4);
    points.push(`${(PORTAL.x + Math.cos(a) * r).toFixed(1)} ${(PORTAL.y + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${points.join(" L")}`;
}

const SPIRAL_ARMS = [0, 120, 240].map((start) => spiralArm(start));
const SPIRAL_ARMS_BACK = [60, 180, 300].map((start) => spiralArm(start, 1.1, 88));

// As runas do anel (traços pequenos, centrados em 0, 0), uma a cada 22,5°
const RUNES = [
  "M-3 -5 L-3 5 M-3 -5 L3 -1 M-3 0 L3 4",
  "M0 -5 L0 5 M-3 -2 L3 -2 M-3 2 L0 5",
  "M-3 5 L0 -5 L3 5 M-2 1 L2 1",
  "M-3 -4 L3 -4 L-3 4 L3 4",
  "M0 -5 L0 5 M0 -1 L-3 -5 M0 -1 L3 -5",
  "M-3 -5 L3 5 M3 -5 L-3 5 M-3 0 L3 0",
  "M-2 -5 Q4 -3 -2 0 Q4 3 -2 5",
  "M-3 -5 L-3 5 L3 5",
];

/** Ponto no círculo em volta do portal (ângulo em graus, 0 = à direita, sentido horário). */
function around(angle: number, r: number): [number, number] {
  const a = (angle * Math.PI) / 180;
  return [PORTAL.x + Math.cos(a) * r, PORTAL.y + Math.sin(a) * r];
}

/** Ponta de lança do anel, apontando pra fora no ângulo `angle`. */
function spike(angle: number, from: number, to: number, half: number): string {
  const [tx, ty] = around(angle, to);
  const [lx, ly] = around(angle - half, from);
  const [rx, ry] = around(angle + half, from);
  return `M${lx.toFixed(1)} ${ly.toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)} L${rx.toFixed(1)} ${ry.toFixed(1)} Z`;
}

/**
 * O desenho do botão Play: o portal arcano do Mago Danilo. Um selo redondo
 * com o anel grosso de ouro (pontas de lança e gemas ciano), o anel de runas
 * douradas girando e, no meio, o portal: um vórtice violeta e ciano com os
 * braços em espiral girando e o ▶ brilhando. Embaixo, a faixa vermelha com o
 * texto. `fast` = o portal gira mais rápido (o mouse em cima do botão).
 */
export function PlayButtonArt({ label, fontFamily, fast = false }: { label: string; fontFamily: string; fast?: boolean }) {
  const id = `pb${useId().replace(/:/g, "")}`;
  const gold = `url(#${id}-gold)`;
  const spin = (seconds: number) => ({ "--cg-origin": `${PORTAL.x}px ${PORTAL.y}px`, "--cg-dur": `${seconds}s` }) as React.CSSProperties;
  // o giro extra do mouse em cima: roda junto com o normal e fica pausado no resto do tempo
  // (pausar em vez de tirar a animação evita o portal "pular" quando o mouse entra ou sai)
  const boost = (seconds: number) => ({ ...spin(seconds), animationPlayState: fast ? "running" : "paused" }) as React.CSSProperties;

  return (
    <svg viewBox="0 0 320 330" className="w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <GoldStops />
        </linearGradient>
        <radialGradient id={`${id}-vortex`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.16" stopColor="#a5f3fc" />
          <stop offset="0.36" stopColor="#22d3ee" />
          <stop offset="0.62" stopColor="#7c3aed" />
          <stop offset="0.86" stopColor="#4c1d95" />
          <stop offset="1" stopColor="#1e0b3b" />
        </radialGradient>
        <radialGradient id={`${id}-cyan`} cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ecfeff" />
          <stop offset="0.45" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#155e75" />
        </radialGradient>
        <linearGradient id={`${id}-ribbon`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ef4444" />
          <stop offset="0.55" stopColor="#b91c1c" />
          <stop offset="1" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id={`${id}-text`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#fff7d6" />
          <stop offset="1" stopColor="#fcd34d" />
        </linearGradient>
        {/* os brilhos são degradês (blur e drop-shadow eram refeitos a cada quadro, com o portal girando) */}
        <radialGradient id={`${id}-halo`}>
          <stop offset="0.35" stopColor="#8b5cf6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-play-glow`}>
          <stop offset="0" stopColor="#ecfeff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-portal`}>
          <circle cx={PORTAL.x} cy={PORTAL.y} r="88" />
        </clipPath>
      </defs>

      {/* a luz do portal vazando em volta */}
      <circle cx={PORTAL.x} cy={PORTAL.y} r="168" fill={`url(#${id}-halo)`} className="cg-anim-glow" />

      {/* as pontas de lança nos quatro lados e as menores entre elas */}
      {[-90, 0, 180].map((a) => (
        <path key={a} d={spike(a, 126, 158, 9)} fill={gold} stroke="#2a1205" strokeWidth="2.5" strokeLinejoin="round" />
      ))}
      {[-45, 45, 135, 225].map((a) => (
        <path key={a} d={spike(a, 128, 146, 6)} fill={gold} stroke="#2a1205" strokeWidth="2" strokeLinejoin="round" />
      ))}

      {/* o anel de ouro, com o contorno escuro e o fio de luz */}
      <circle cx={PORTAL.x} cy={PORTAL.y} r="134" fill="#1c0a02" />
      <circle cx={PORTAL.x} cy={PORTAL.y} r="131" fill={gold} />
      <circle cx={PORTAL.x} cy={PORTAL.y} r="127" fill="none" stroke="#fff7d6" strokeOpacity="0.55" strokeWidth="1.5" />
      {/* as gemas ciano no anel */}
      {[-45, 45, 135, 225].map((a) => {
        const [x, y] = around(a, 122);
        return (
          <g key={a}>
            <circle cx={x} cy={y} r="9" fill="#22d3ee" opacity="0.45" className="cg-anim-glow" />
            <circle cx={x} cy={y} r="6" fill={`url(#${id}-cyan)`} stroke="#2a1205" strokeWidth="1.5" />
          </g>
        );
      })}

      {/* o anel de runas, girando */}
      <circle cx={PORTAL.x} cy={PORTAL.y} r="113" fill="#1e0b3b" stroke="#2a1205" strokeWidth="2" />
      <circle cx={PORTAL.x} cy={PORTAL.y} r="111" fill="none" stroke="#fbbf24" strokeOpacity="0.8" strokeWidth="1.5" />
      <circle cx={PORTAL.x} cy={PORTAL.y} r="92" fill="none" stroke="#fbbf24" strokeOpacity="0.8" strokeWidth="1.5" />
      <g className="cg-anim-orbit" style={boost(6)}>
        <g className="cg-anim-orbit" style={spin(40)}>
          {Array.from({ length: 16 }, (_, i) => {
            const angle = i * 22.5;
            const [x, y] = around(angle, 101.5);
            // a runa e, embaixo, o mesmo traço largo e transparente fazendo o brilho
            return (
              <g key={angle} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${angle + 90}) scale(1.35)`} fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d={RUNES[i % RUNES.length]} stroke="#fde047" strokeOpacity="0.35" strokeWidth="3.6" />
                <path d={RUNES[i % RUNES.length]} stroke="#fde68a" strokeWidth="1.4" />
              </g>
            );
          })}
        </g>
      </g>

      {/* o portal: o vórtice, as espirais girando e as faíscas sendo puxadas */}
      <g clipPath={`url(#${id}-portal)`}>
        <circle cx={PORTAL.x} cy={PORTAL.y} r="90" fill={`url(#${id}-vortex)`} />
        <g className="cg-anim-orbit" style={boost(1.6)}>
          <g className="cg-anim-orbit" style={spin(9)}>
            {SPIRAL_ARMS_BACK.map((d) => (
              <path key={d} d={d} fill="none" stroke="#c4b5fd" strokeOpacity="0.45" strokeWidth="9" strokeLinecap="round" />
            ))}
          </g>
          <g className="cg-anim-orbit" style={spin(5)}>
            {SPIRAL_ARMS.map((d) => (
              <path key={d} d={d} fill="none" stroke="#ecfeff" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" />
            ))}
          </g>
        </g>
        {[
          [118, 112, 0],
          [208, 128, 0.7],
          [130, 196, 1.4],
          [196, 186, 2.1],
        ].map(([x, y, delay]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="#fff" className="cg-anim-twinkle" style={{ animationDelay: `${delay}s` }} />
        ))}
      </g>
      <circle cx={PORTAL.x} cy={PORTAL.y} r="88" fill="none" stroke="#2a1205" strokeWidth="3" />

      {/* o ▶ no meio do portal, pulsando */}
      <g className="cg-anim-glow" style={{ "--cg-dur": "1.8s" } as React.CSSProperties}>
        <circle cx={PORTAL.x} cy={PORTAL.y} r="44" fill={`url(#${id}-play-glow)`} />
        <path
          d="M150 124 Q146 122 146 127 L146 173 Q146 178 150 176 L188 154 Q192 150 188 146 Z"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.45"
          strokeWidth="12"
          strokeLinejoin="round"
        />
        <path
          d="M150 124 Q146 122 146 127 L146 173 Q146 178 150 176 L188 154 Q192 150 188 146 Z"
          fill="#ffffff"
          stroke="#4c1d95"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      </g>

      {/* a faixa com o texto, passando na frente do anel embaixo */}
      <path d="M44 268 L8 268 L24 286 L8 304 L64 304 Z" fill="#7f1d1d" stroke={gold} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M276 268 L312 268 L296 286 L276 304 L256 304 Z" fill="#7f1d1d" stroke={gold} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M44 294 L64 304 L64 294 Z M276 294 L256 304 L256 294 Z" fill="#450a0a" />
      <path d="M44 252 Q160 240 276 252 L276 294 Q160 282 44 294 Z" fill={`url(#${id}-ribbon)`} stroke={gold} strokeWidth="3" strokeLinejoin="round" />
      <path d="M52 259 Q160 248 268 259 M52 287 Q160 276 268 287" fill="none" stroke="#fbbf24" strokeOpacity="0.5" strokeWidth="1" />
      {/* a sombra do texto: uma cópia escura logo embaixo (sem filtro) */}
      <text x="160" y="286" textAnchor="middle" fontSize="34" fontWeight="900" letterSpacing="6" fill="#000" fillOpacity="0.45" style={{ fontFamily }} aria-hidden="true">
        {label}
      </text>
      <text
        x="160"
        y="284"
        textAnchor="middle"
        fontSize="34"
        fontWeight="900"
        letterSpacing="6"
        fill={`url(#${id}-text)`}
        stroke="#450a0a"
        strokeWidth="5"
        strokeLinejoin="round"
        paintOrder="stroke"
        style={{ fontFamily }}
      >
        {label}
      </text>

      {/* faíscas */}
      {(
        [
          [24, 60, 9, 0.4],
          [300, 96, 10, 1.3],
          [286, 22, 7, 2],
          [34, 214, 6, 2.6],
        ] as const
      ).map(([x, y, r, delay]) => (
        <path key={`${x}-${y}`} d={sparklePath(x, y, r)} fill="#fde68a" className="cg-anim-twinkle" style={{ animationDelay: `${delay}s` }} />
      ))}
    </svg>
  );
}
