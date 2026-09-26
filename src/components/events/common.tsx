"use client";

import { useState } from "react";
import { AvatarConfig } from "@/engine/avatar";
import { AcademyEvent } from "@/engine/specialEvents";
import Avatar from "../Avatar";
import { CoinIcon } from "../GameUI";

// ============================================================================
// PEÇAS COMUNS DA ARTE DOS EVENTOS — o que mais de um evento usa: céu
// estrelado, o castelo da CodeGuilds, névoa, relâmpagos, confete, raios de
// luz, a área dos personagens (acima do balão de fala) e a vitrine da
// recompensa final. Tudo ocupa o elemento pai (absolute), então serve pra
// tela cheia da cena e pros cards/banners.
// ============================================================================

const STARS = Array.from({ length: 42 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 23 + 7) % 62,
  size: 1 + (i % 3),
  delay: (i % 9) * 0.35,
}));

/** Estrelinhas cintilando na parte de cima do céu. */
export function Stars({ opacity = 1 }: { opacity?: number }) {
  return (
    <>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="cg-anim-twinkle absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, opacity }}
        />
      ))}
    </>
  );
}

// Janelas acesas do castelo: [x, y, largura, altura] no viewBox.
const WINDOWS = [
  [440, 170, 10, 16],
  [440, 215, 10, 16],
  [592, 110, 10, 18],
  [745, 160, 10, 16],
  [745, 212, 10, 16],
  [520, 205, 12, 18],
  [668, 205, 12, 18],
  [270, 232, 8, 12],
  [921, 238, 8, 12],
];

/**
 * Silhueta do castelo da CodeGuilds, colada no chão. `lit` = janelas acesas
 * (`windowColor` muda a cor da luz). O "slice" corta o topo quando a caixa é
 * mais larga que o desenho; `scale` encolhe o castelo a partir do chão pra ele
 * caber inteiro em caixas baixas (card, fundo das cenas). Nas cenas em que ele
 * é o protagonista, scale 1 e uma caixa alta. `children` desenha por cima do
 * castelo (no mesmo viewBox), ex.: a sirene no topo da torre.
 */
export function Castle({
  lit = true,
  className = "h-[46%]",
  fill = "#07030d",
  scale = 0.64,
  windowColor = "#fbbf24",
  children,
}: {
  lit?: boolean;
  className?: string;
  fill?: string;
  scale?: number;
  windowColor?: string;
  children?: React.ReactNode;
}) {
  return (
    <svg viewBox="0 -20 1200 360" preserveAspectRatio="xMidYMax slice" className={`absolute bottom-0 left-0 w-full ${className}`} aria-hidden="true">
      <path d="M0 340 L0 300 C200 280 400 292 600 286 C800 280 1000 292 1200 300 L1200 340 Z" fill={fill} />
      <g transform={`translate(600 300) scale(${scale}) translate(-600 -300)`}>
        <g fill={fill}>
          <rect x="250" y="200" width="50" height="110" />
          <polygon points="240,200 275,140 310,200" />
          <rect x="410" y="130" width="70" height="180" />
          <polygon points="398,130 445,50 492,130" />
          <rect x="470" y="170" width="260" height="140" />
          {Array.from({ length: 9 }, (_, i) => (
            <rect key={i} x={470 + i * 30} y="155" width="18" height="16" />
          ))}
          <rect x="565" y="80" width="70" height="110" />
          <polygon points="553,80 600,-12 647,80" />
          <rect x="720" y="120" width="70" height="190" />
          <polygon points="708,120 755,40 802,120" />
          <rect x="900" y="210" width="50" height="100" />
          <polygon points="890,210 925,150 960,210" />
        </g>
        <path d="M572 310 L572 262 A28 28 0 0 1 628 262 L628 310 Z" fill="#150a22" />
        {lit &&
          WINDOWS.map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="2" fill={windowColor} className="cg-anim-eye" style={{ animationDelay: `${i * 0.37}s`, filter: `drop-shadow(0 0 6px ${windowColor})` }} />
          ))}
        {children}
      </g>
    </svg>
  );
}

export function Fog({ tint = "rgba(203,213,225,0.3)" }: { tint?: string }) {
  return (
    <div
      className="cg-anim-fog pointer-events-none absolute -left-[20%] bottom-0 h-[24%] w-[140%]"
      style={{ background: `radial-gradient(50% 65% at 50% 100%, ${tint}, transparent 70%)`, filter: "blur(10px)" }}
    />
  );
}

/** Clarão e raios piscando. `flash` é a classe da cor do clarão; `glow`, a cor do brilho dos raios. */
export function Lightning({ flash = "bg-violet-100", glow = "#c4b5fd" }: { flash?: string; glow?: string }) {
  return (
    <>
      <div className={`cg-anim-lightning pointer-events-none absolute inset-0 ${flash}`} style={{ mixBlendMode: "overlay" }} />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="cg-anim-lightning pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <path d="M22 0 L18 18 L24 20 L15 42 L21 43 L12 64" stroke="#f5f3ff" strokeWidth="0.6" fill="none" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
        <path d="M82 0 L86 14 L80 16 L88 34" stroke="#f5f3ff" strokeWidth="0.45" fill="none" style={{ filter: `drop-shadow(0 0 2px ${glow})` }} />
      </svg>
    </>
  );
}

/** Área dos personagens: acima do balão de fala da cena (que ocupa a parte de baixo da tela). */
export function Stage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`absolute inset-x-0 bottom-[33%] top-[9%] flex items-end justify-center ${className}`}>{children}</div>;
}

export function Confetti({ colors }: { colors: string[] }) {
  // Sorteado uma vez só por cena (senão cada re-render embaralharia tudo).
  const [pieces] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: colors[i % colors.length],
      size: 6 + Math.random() * 7,
      round: Math.random() < 0.3,
      delay: 0.4 + Math.random() * 1.6,
      duration: 2.6 + Math.random() * 1.8,
      drift: -90 + Math.random() * 180,
      spin: 360 + Math.random() * 900,
    })),
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="cg-anim-confetti absolute top-0"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.round ? p.size : p.size * 1.4,
              backgroundColor: p.color,
              borderRadius: p.round ? "9999px" : "2px",
              "--cg-delay": `${p.delay}s`,
              "--cg-duration": `${p.duration}s`,
              "--cg-drift": `${p.drift}px`,
              "--cg-spin": `${p.spin}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Raios de luz girando atrás da cena (vitória). `color` é a cor dos raios (rgba). */
export function Rays({ color = "rgba(253,230,138,0.5)" }: { color?: string }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[42%] aspect-square w-[140vmax] -translate-x-1/2 -translate-y-1/2">
      <div
        className="cg-anim-spin-slow h-full w-full rounded-full opacity-40"
        style={{
          background: `repeating-conic-gradient(from 0deg, ${color} 0deg 6deg, transparent 6deg 18deg)`,
          maskImage: "radial-gradient(circle, black 0%, transparent 60%)",
          WebkitMaskImage: "radial-gradient(circle, black 0%, transparent 60%)",
        }}
      />
    </div>
  );
}

/** Última cena do final: as recompensas do evento aparecendo e o aluno com o visual novo. */
export function RewardShowcase({ event, avatar, ringColor = "#fbbf24" }: { event: AcademyEvent; avatar: AvatarConfig | null; ringColor?: string }) {
  const { reward } = event;
  return (
    <Stage className="!justify-start !items-center flex-col gap-4 pt-[2%]">
      <div className="flex flex-wrap justify-center gap-2 px-4">
        <span className="cg-anim-pop flex items-center gap-2 rounded-full border border-amber-300/70 bg-black/60 px-3 py-1.5 text-sm font-bold text-amber-200" style={{ animationDelay: "0.8s" }}>
          <span className="text-xl">{reward.item.icon}</span> {reward.item.name}
        </span>
        <span className="cg-anim-pop rounded-full border border-violet-300/70 bg-black/60 px-3 py-1.5 text-sm font-bold text-violet-200" style={{ animationDelay: "1.1s" }}>
          ✦ +{reward.xp} XP
        </span>
        <span className="cg-anim-pop flex items-center gap-1.5 rounded-full border border-amber-300/70 bg-black/60 px-3 py-1.5 text-sm font-bold text-amber-300" style={{ animationDelay: "1.4s" }}>
          <CoinIcon size={16} /> +{reward.coins}
        </span>
      </div>
      <div className="cg-anim-pop relative" style={{ animationDelay: "0.3s" }}>
        <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: ringColor, opacity: 0.7 }} />
        <div className="cg-anim-float relative">{avatar && <Avatar config={avatar} ringColor={ringColor} size={170} />}</div>
      </div>
    </Stage>
  );
}
