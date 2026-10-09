"use client";

import { useId } from "react";
import { DragonPose } from "@/engine/elderDragon";

// ============================================================================
// VAELZHAR, O DRAGÃO ANCESTRAL — desenhado em SVG, de lado e olhando pra
// direita (viewBox 1000×700). Corpo vermelho-castanho de escamas, barriga de
// placas, espinhos nas costas e na cauda, chifres e garras de ouro e asas
// enormes de membrana, com runas douradas brilhando pelo corpo e um anel de
// runas girando em volta do pescoço quando ele chama a magia.
//
// É um "boneco articulado": quadril → corpo (inclina pra empinar) → pescoço
// (3 partes) → cabeça → mandíbula; cauda em 5 partes; asas, braços e pernas
// com as juntas no lugar certo. Cada pose é só uma lista de ângulos (RIGS): a
// troca de pose anima com transição, as asas batem no voo e a cauda ondula
// com as classes cg-anim-dragon-* do globals.css. dragonMouth() faz a mesma
// conta das juntas pra cena saber de onde (e pra onde) sai o fogo.
// ============================================================================

export const DRAGON_VIEW = { w: 1000, h: 700 };
/** O quadril: a raiz do boneco. */
const ROOT = { x: 400, y: 462 };

interface Rig {
  lift: number; // quanto o quadril desce (agachado)
  pitch: number; // inclinação do corpo (negativo = empina)
  neck: [number, number, number];
  head: number;
  jaw: number;
  tail: [number, number, number, number, number, number, number]; // positivo = desce
  wing: number; // ângulo das asas paradas (negativo = mais pra cima)
  flap: boolean; // batendo as asas
  hind: [number, number, number]; // coxa, canela, pé (positivo = pra trás)
  fore: [number, number, number]; // braço, antebraço, mão
}

const STAND_LEGS: [number, number, number] = [-24, 58, -34];

const RIGS: Record<DragonPose, Rig> = {
  voo: { lift: 0, pitch: 0, neck: [-24, 6, 16], head: 4, jaw: 0, tail: [-4, 4, 6, 4, 2, -4, -8], wing: 0, flap: true, hind: [70, 26, 34], fore: [46, -112, 40] },
  pouso: { lift: 0, pitch: -16, neck: [-24, 4, 22], head: 10, jaw: 0, tail: [24, 10, 6, 4, 2, -2, -6], wing: 0, flap: true, hind: [-14, 46, -26], fore: [8, -64, 16] },
  pe: { lift: 0, pitch: -30, neck: [-34, -2, 38], head: 16, jaw: 0, tail: [30, 10, -42, -24, -10, -6, -16], wing: 6, flap: false, hind: STAND_LEGS, fore: [-26, -74, -6] },
  fogo: { lift: 0, pitch: -14, neck: [-14, 2, 12], head: 2, jaw: 30, tail: [26, 12, -38, -24, -10, -6, -14], wing: -4, flap: false, hind: STAND_LEGS, fore: [12, -70, 14] },
  rugido: { lift: 0, pitch: -30, neck: [-26, -8, 2], head: 12, jaw: 40, tail: [34, 12, -44, -26, -12, -6, -16], wing: -16, flap: false, hind: STAND_LEGS, fore: [-52, -46, -20] },
  impulso: { lift: 26, pitch: -6, neck: [-18, 10, 18], head: 8, jaw: 0, tail: [34, 10, 2, -4, -4, -6, -10], wing: 30, flap: false, hind: [-46, 100, -54], fore: [24, -86, 28] },
};

const NECK_BASE = { x: 250, y: -46 };
const NECK_LEN = [62, 58, 54];
const NECK_W: [number, number][] = [
  [46, 38],
  [38, 32],
  [32, 27],
];
/** A cabeça é desenhada menor e ampliada aqui. */
const HEAD_SCALE = 1.32;
const TAIL_BASE = { x: -66, y: -2 };
// a cauda: comprida e fina, afinando até a ponta de chicote
const TAIL_LEN = [68, 64, 60, 56, 52, 48, 44];
const TAIL_W: [number, number][] = [
  [36, 30],
  [30, 25],
  [25, 20],
  [20, 16],
  [16, 12],
  [12, 8],
  [8, 5],
];
/** A junta da mandíbula na cabeça e a distância dela até a frente da boca (o fogo sai dali). */
const JAW_HINGE = { x: 34, y: 18 };
const MOUTH_REACH = 112;
/** Quanto a boca abre quando ele cospe fogo (no voo, a pose não abre a boca sozinha). */
const BREATH_JAW = 30;

const rad = (d: number) => (d * Math.PI) / 180;
function rot(x: number, y: number, deg: number): [number, number] {
  const a = rad(deg);
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
}

/**
 * A boca no desenho (viewBox) e a direção do fogo (graus), numa pose já parada: o meio da boca
 * aberta, entre os dentes de cima e a mandíbula, na linha que divide a abertura ao meio.
 */
export function dragonMouth(pose: DragonPose): { x: number; y: number; angle: number } {
  const r = RIGS[pose];
  let [x, y] = rot(NECK_BASE.x, NECK_BASE.y, r.pitch);
  x += ROOT.x;
  y += ROOT.y + r.lift;
  let a = r.pitch;
  r.neck.forEach((n, i) => {
    a += n;
    const [dx, dy] = rot(NECK_LEN[i], 0, a);
    x += dx;
    y += dy;
  });
  a += r.head;
  const jaw = Math.max(r.jaw, BREATH_JAW);
  const [ox, oy] = rot(MOUTH_REACH, 0, jaw / 2);
  const [mx, my] = rot((JAW_HINGE.x + ox) * HEAD_SCALE, (JAW_HINGE.y + oy) * HEAD_SCALE, a);
  return { x: x + mx, y: y + my, angle: a + jaw / 2 };
}

/** Onde ficam as garras dos pés em pé (âncora pra pôr o dragão no topo da pirâmide). */
export const DRAGON_FEET = { x: 422, y: 652 };

// ---------------------------------------------------------------------------
// formas
// ---------------------------------------------------------------------------

/** Cápsula ao longo de +x: largura `a` no começo e `b` no fim, pontas redondas (as juntas somem). */
function capsule(L: number, a: number, b: number): string {
  return `M0 ${-a} C${L * 0.45} ${-a} ${L * 0.7} ${-b} ${L} ${-b} A${b} ${b} 0 0 1 ${L} ${b} C${L * 0.7} ${b} ${L * 0.45} ${a} 0 ${a} A${a} ${a} 0 0 1 0 ${-a} Z`;
}

/** Só as bordas de cima e de baixo da cápsula: o contorno passa liso de uma parte pra outra, sem marcar as juntas. */
function edges(L: number, a: number, b: number): string {
  return `M0 ${-a} C${L * 0.45} ${-a} ${L * 0.7} ${-b} ${L} ${-b} M0 ${a} C${L * 0.45} ${a} ${L * 0.7} ${b} ${L} ${b}`;
}

/** Espinho curvo sobre a linha das costas: base em (x, y), varrido pra trás (-x). */
function spike(x: number, y: number, h: number, w: number, lean = 0.5): string {
  return `M${x - w} ${y} Q${x - w * 0.6 - h * lean * 0.4} ${y - h * 0.55} ${x - h * lean} ${y - h} Q${x + w * 0.1 - h * lean * 0.2} ${y - h * 0.4} ${x + w} ${y} Z`;
}

const TORSO =
  "M-84 -4 C-66 -58 8 -92 104 -90 C170 -89 222 -80 262 -60 C294 -44 304 -10 292 20 C276 56 222 80 154 84 C92 88 30 82 -12 68 C-54 54 -90 30 -84 -4 Z";
const BELLY = "M288 10 C274 50 222 74 154 78 C92 82 30 76 -16 62 C24 58 88 60 154 56 C214 52 264 36 288 10 Z";
const BELLY_LINES: [number, number, number][] = [
  [246, 36, 60],
  [212, 45, 68],
  [176, 51, 74],
  [140, 54, 77],
  [104, 56, 78],
  [68, 57, 76],
  [32, 55, 70],
];
// espinhos das costas: [x, y na linha das costas, altura]
const BACK_SPIKES: [number, number, number][] = [
  [-58, -40, 20],
  [-32, -62, 26],
  [-2, -78, 30],
  [32, -87, 32],
  [68, -90, 32],
  [104, -91, 30],
  [140, -89, 26],
  [226, -76, 28],
  [256, -64, 26],
];

// asa levantada: ombro em (0, 0), cotovelo, pulso e as pontas dos dedos
const WING_ELBOW: [number, number] = [34, -118];
const WING_WRIST: [number, number] = [-34, -300];
const WING_TIPS: [number, number][] = [
  [-250, -392],
  [-332, -262],
  [-318, -128],
  [-226, -22],
];
const MEMBRANE =
  "M0 0 C20 -40 30 -80 34 -118 C20 -180 -10 -250 -34 -300 C-110 -340 -180 -370 -250 -392 Q-215 -318 -332 -262 Q-237 -226 -318 -128 Q-201 -142 -226 -22 Q-150 -50 -70 6 Q-30 10 0 0 Z";

// runas douradas (traços tribais), em cada parte do corpo
const RUNE_BODY = [
  "M150 -50 C176 -58 204 -40 196 -16 C190 2 164 0 166 -16 C168 -26 182 -26 182 -18",
  "M118 -38 C134 -18 140 8 128 34 M128 34 C120 26 116 16 118 4",
  "M206 -4 C222 4 236 22 232 42",
  "M60 -54 C80 -40 88 -20 84 0 C80 -12 72 -20 62 -24",
];
const RUNE_THIGH = ["M-6 10 C12 4 24 20 16 34 C10 44 -6 40 -4 30 C-2 22 8 22 8 28", "M-20 52 C-8 64 4 72 10 86"];
const RUNE_NECK = "M10 -8 C22 -16 36 -12 44 -2 C36 -4 28 0 26 8";
const RUNE_TAIL = "M8 -6 C24 -14 40 -12 50 -2 M20 4 C30 0 38 2 44 8";
const RUNE_WING = "M10 -60 C26 -90 26 -110 14 -132 M-6 -170 C-20 -200 -26 -230 -24 -262";
const RING_GLYPHS = [
  "M-5 -6 L5 6 M5 -6 L-5 6",
  "M0 -7 L0 7 M-5 -2 L5 -2",
  "M-5 6 L0 -7 L5 6",
  "M-5 -6 L5 -6 L-5 6 L5 6",
  "M0 -7 L0 7 M0 -1 L-5 -6 M0 -1 L5 -6",
  "M-4 -7 Q6 -4 -2 0 Q6 4 -4 7",
];

function Runes({ paths, lit, delay = 0 }: { paths: string[]; lit: number; delay?: number }) {
  return (
    <g className="cg-anim-dragon-glow" style={{ "--cg-dur": lit > 0.6 ? "1.3s" : "3.2s", "--cg-delay": `${-delay}s`, opacity: 0.3 + lit * 0.7, transition: "opacity 0.8s" } as React.CSSProperties}>
      {paths.map((d) => (
        <g key={d} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={d} stroke="#f59e0b" strokeOpacity={0.25 + lit * 0.35} strokeWidth={4 + lit * 7} />
          <path d={d} stroke="#fef08a" strokeWidth="2.6" />
        </g>
      ))}
    </g>
  );
}

// ---------------------------------------------------------------------------
// partes
// ---------------------------------------------------------------------------

function Wing({ id, far, rig, beat }: { id: string; far?: boolean; rig: Rig; beat: number }) {
  const bone = far ? "#5a1d0c" : "#8a2e12";
  const boneLight = far ? "#7a3016" : "#c0502a";
  return (
    <g style={{ transform: `rotate(${rig.wing + (far ? 12 : 0)}deg)`, transformOrigin: "0 0", transition: EASE }}>
      <g
        className={rig.flap ? "cg-anim-dragon-beat" : "cg-anim-dragon-wing-breathe"}
        style={{ "--cg-dur": `${beat}s`, "--cg-delay": far ? "-0.04s" : "0s", transformOrigin: "0 0" } as React.CSSProperties}
      >
        <g transform={far ? "scale(0.9)" : undefined}>
          <path d={MEMBRANE} fill={`url(#${id}-${far ? "membrane-far" : "membrane"})`} stroke="#1f0a03" strokeWidth="3" strokeLinejoin="round" />
          {/* sombras entre os dedos e a borda grossa da asa */}
          <path d="M-34 -300 Q-140 -300 -332 -262 Q-200 -250 -34 -300 Z M-34 -300 Q-160 -200 -318 -128 Q-150 -190 -34 -300 Z" fill="#2a1206" opacity={far ? 0.35 : 0.22} />
          <path d="M-250 -392 Q-215 -318 -332 -262 Q-237 -226 -318 -128 Q-201 -142 -226 -22" fill="none" stroke="#3a1708" strokeWidth="5" strokeOpacity="0.55" />
          {/* veias e os rasgos antigos (a luz atravessa) */}
          <g fill="none" stroke="#3b1a0a" strokeOpacity="0.4" strokeWidth="1.4">
            <path d="M-120 -330 Q-170 -300 -210 -296" />
            <path d="M-110 -250 Q-170 -230 -230 -200" />
            <path d="M-90 -170 Q-150 -130 -200 -110" />
            <path d="M-60 -90 Q-110 -60 -150 -46" />
          </g>
          {!far && <path d="M-236 -330 l14 -10 l6 16 l-10 10 Z M-262 -180 l12 -6 l2 14 l-12 2 Z M-150 -64 l10 -4 l0 10 Z" fill="#fde7c2" opacity="0.85" />}
          {/* ossos: braço, antebraço e os dedos */}
          {WING_TIPS.map(([x, y], i) => {
            const d = `M${WING_WRIST[0]} ${WING_WRIST[1]} Q${(WING_WRIST[0] + x) / 2 + (i - 1.5) * 10} ${(WING_WRIST[1] + y) / 2 - 16} ${x} ${y}`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={bone} strokeWidth={i === 0 ? 11 : 8} strokeLinecap="round" />
                <path d={d} fill="none" stroke={boneLight} strokeWidth={i === 0 ? 4 : 3} strokeLinecap="round" strokeOpacity="0.8" />
              </g>
            );
          })}
          <path d={`M0 0 C20 -40 30 -80 ${WING_ELBOW[0]} ${WING_ELBOW[1]} C20 -180 -10 -250 ${WING_WRIST[0]} ${WING_WRIST[1]}`} fill="none" stroke="#2a0d04" strokeWidth="24" strokeLinecap="round" />
          <path d={`M0 0 C20 -40 30 -80 ${WING_ELBOW[0]} ${WING_ELBOW[1]} C20 -180 -10 -250 ${WING_WRIST[0]} ${WING_WRIST[1]}`} fill="none" stroke={bone} strokeWidth="18" strokeLinecap="round" />
          <path d={`M4 -6 C22 -44 30 -80 ${WING_ELBOW[0] - 2} ${WING_ELBOW[1]} C18 -180 -12 -248 ${WING_WRIST[0] - 2} ${WING_WRIST[1] + 4}`} fill="none" stroke={boneLight} strokeWidth="6" strokeLinecap="round" />
          {/* garras de ouro no cotovelo e no pulso */}
          <path d="M40 -118 C62 -118 74 -100 70 -80 C66 -96 56 -104 42 -106 Z" fill={`url(#${id}-gold)`} stroke="#2a0d04" strokeWidth="2" />
          <path d="M-30 -300 C-6 -318 18 -312 26 -292 C10 -302 -6 -302 -22 -292 Z" fill={`url(#${id}-gold)`} stroke="#2a0d04" strokeWidth="2" />
          {!far && <Runes paths={[RUNE_WING]} lit={0} />}
        </g>
      </g>
    </g>
  );
}

function Claw({ x, y, a, s = 1, id }: { x: number; y: number; a: number; s?: number; id: string }) {
  return (
    <path
      d="M0 -4 C10 -4 18 2 20 14 C14 8 8 6 0 5 Z"
      transform={`translate(${x} ${y}) rotate(${a}) scale(${s})`}
      fill={`url(#${id}-gold)`}
      stroke="#2a0d04"
      strokeWidth="1.4"
    />
  );
}

function HindLeg({ id, angles, far, lit }: { id: string; angles: [number, number, number]; far?: boolean; lit: number }) {
  const fill = `url(#${id}-${far ? "limb-far" : "limb"})`;
  return (
    <g style={{ transform: `rotate(${angles[0]}deg)`, transformOrigin: "0 0", transition: EASE }}>
      {/* coxa */}
      <path d="M-56 -42 C-68 28 -34 84 -16 104 L16 104 C44 72 58 8 48 -46 C28 -74 -38 -70 -56 -42 Z" fill={fill} stroke="#2a0a04" strokeWidth="2.5" />
      <path d="M-40 -10 C-30 30 -12 62 0 80" fill="none" stroke="#2a0a04" strokeOpacity="0.35" strokeWidth="2" />
      {!far && <path d="M30 -20 C40 20 30 70 14 98" fill="none" stroke="#fb923c" strokeOpacity="0.35" strokeWidth="4" />}
      {!far && <Runes paths={RUNE_THIGH} lit={lit} delay={0.6} />}
      <g transform="translate(0 100)">
        <g style={{ transform: `rotate(${angles[1]}deg)`, transformOrigin: "0 0", transition: EASE }}>
          {/* canela */}
          <path d="M-20 -6 C-22 30 -15 62 -11 90 L11 90 C15 62 20 30 20 -6 Z" fill={fill} stroke="#2a0a04" strokeWidth="2.2" />
          <circle cx="0" cy="0" r="17" fill={fill} />
          <path d="M-14 20 L-26 12 L-16 32 Z" fill="#4a1208" />
          <g transform="translate(0 90)">
            <g style={{ transform: `rotate(${angles[2]}deg)`, transformOrigin: "0 0", transition: EASE }}>
              {/* pé com as garras de ouro */}
              <circle cx="0" cy="0" r="11" fill={fill} />
              <path d="M-12 -8 C10 -12 34 -8 48 -2 C52 4 46 10 32 10 L-8 10 C-18 6 -18 -4 -12 -8 Z" fill={fill} stroke="#2a0a04" strokeWidth="2" />
              <Claw id={id} x={46} y={-2} a={0} s={1.25} />
              <Claw id={id} x={38} y={4} a={10} s={1.1} />
              <Claw id={id} x={26} y={8} a={18} s={1} />
              <Claw id={id} x={-12} y={2} a={150} s={0.9} />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

function ForeLeg({ id, angles, far }: { id: string; angles: [number, number, number]; far?: boolean }) {
  const fill = `url(#${id}-${far ? "limb-far" : "limb"})`;
  return (
    <g style={{ transform: `rotate(${angles[0]}deg)`, transformOrigin: "0 0", transition: EASE }}>
      <path d="M-20 -12 C-24 22 -14 52 -9 66 L11 66 C18 48 22 18 18 -12 C8 -24 -12 -24 -20 -12 Z" fill={fill} stroke="#2a0a04" strokeWidth="2.2" />
      <g transform="translate(0 64)">
        <g style={{ transform: `rotate(${angles[1]}deg)`, transformOrigin: "0 0", transition: EASE }}>
          <path d="M-10 -4 C-11 18 -8 38 -7 56 L7 56 C8 38 11 18 10 -4 Z" fill={fill} stroke="#2a0a04" strokeWidth="2" />
          <circle cx="0" cy="0" r="12" fill={fill} />
          <g transform="translate(0 56)">
            <g style={{ transform: `rotate(${angles[2]}deg)`, transformOrigin: "0 0", transition: EASE }}>
              <path d="M-9 -2 C-11 8 -6 16 2 17 C10 15 13 6 10 -2 Z" fill={fill} stroke="#2a0a04" strokeWidth="1.8" />
              <Claw id={id} x={4} y={14} a={80} s={0.95} />
              <Claw id={id} x={-2} y={14} a={96} s={0.9} />
              <Claw id={id} x={8} y={10} a={60} s={0.85} />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

// A cabeça (desenhada pra direita, a junta com o pescoço em 0,0): crânio comprido terminando num
// gancho de bico, sobrancelha pesada sobre o olho de brasa, dois chifres de ouro com anéis, a crista
// de lâminas atrás, espinhos na bochecha e embaixo da mandíbula e a bocarra cheia de dentes.
const SKULL =
  "M-28 -4 C-34 -30 -14 -48 16 -52 C40 -56 62 -50 80 -42 C98 -34 126 -28 152 -22 C172 -18 188 -11 196 -2 C202 8 196 20 184 32 C184 21 178 13 166 11 C130 13 96 15 66 17 C42 19 16 23 -4 19 C-18 15 -26 8 -28 -4 Z";
const LOWER_JAW =
  "M-50 -2 C-14 -6 52 -8 134 -8 C142 -4 142 6 134 12 C128 16 122 24 118 36 C112 26 104 20 92 20 C62 24 22 30 -24 26 C-46 22 -58 8 -50 -2 Z";
// dentes: [x, tamanho] — as presas da frente são as maiores
const UPPER_TEETH: [number, number][] = [
  [72, 9],
  [86, 12],
  [100, 10],
  [114, 14],
  [128, 12],
  [142, 16],
  [157, 21],
];
const LOWER_TEETH: [number, number][] = [
  [20, 8],
  [34, 11],
  [48, 9],
  [62, 12],
  [76, 10],
  [90, 13],
  [104, 12],
  [119, 16],
];
const HEAD_CREST = [
  "M-8 -40 C-28 -58 -52 -70 -82 -74 C-62 -60 -44 -48 -28 -32 Z",
  "M-20 -22 C-44 -34 -70 -40 -100 -38 C-76 -30 -54 -20 -34 -10 Z",
  "M-26 0 C-48 -4 -72 0 -96 10 C-72 8 -50 10 -30 14 Z",
];
const BROW_SPIKES = ["M48 -40 C36 -56 22 -66 4 -72 C18 -60 28 -50 34 -38 Z", "M64 -43 C56 -60 46 -72 30 -82 C42 -68 50 -56 52 -42 Z"];
const CHEEK_SPIKES = ["M-14 12 C-36 10 -60 16 -82 30 C-60 24 -38 24 -16 22 Z", "M-6 22 C-24 30 -40 42 -52 58 C-34 46 -20 38 -2 30 Z"];

function Head({ id, rig, mouthOpen, lit }: { id: string; rig: Rig; mouthOpen: boolean; lit: number }) {
  const jaw = Math.max(rig.jaw, mouthOpen ? BREATH_JAW : 0);
  const spikeFill = `url(#${id}-spike)`;
  const upperLip = (x: number) => 17 - (x - 66) * 0.06;
  return (
    <g style={{ transform: `rotate(${rig.head}deg) scale(${HEAD_SCALE})`, transformOrigin: "0 0", transition: EASE }}>
      {/* a crista de lâminas atrás da cabeça e o chifre de baixo */}
      {HEAD_CREST.map((d) => (
        <path key={d} d={d} fill={spikeFill} stroke="#2a0a04" strokeWidth="1.8" strokeLinejoin="round" />
      ))}
      <path d="M2 -16 C-26 -26 -62 -30 -98 -22 C-116 -18 -130 -10 -140 2 C-118 -4 -94 -6 -70 -4 C-40 -2 -18 4 -4 10 Z" fill={`url(#${id}-gold)`} stroke="#2a0d04" strokeWidth="2" />
      <path d="M-30 -20 C-60 -24 -90 -20 -118 -8" fill="none" stroke="#fff7d6" strokeWidth="1.6" strokeOpacity="0.6" />

      {/* a boca por dentro (escura) e a brasa quando ele cospe fogo */}
      <g style={{ opacity: jaw > 0 ? 1 : 0, transition: "opacity 0.25s" }}>
        <path d="M30 16 C80 12 140 10 176 14 L174 66 C130 56 80 42 30 24 Z" fill={`url(#${id}-maw)`} />
        <path d="M40 24 C80 32 120 44 152 52 C120 40 80 30 40 20 Z" fill="#7f1d1d" />
      </g>
      <g style={{ opacity: jaw > 0 ? 1 : 0, transition: "opacity 0.4s" }}>
        <path d="M44 18 L170 14 L150 50 Z" fill="#f97316" opacity="0.8" />
        <path d="M70 18 L160 15 L136 36 Z" fill="#fde047" opacity="0.85" />
      </g>

      {/* mandíbula: gira na junta, com os dentes, o gancho do queixo e os espinhos de baixo */}
      <g transform={`translate(${JAW_HINGE.x} ${JAW_HINGE.y})`}>
        <g style={{ transform: `rotate(${jaw}deg)`, transformOrigin: "0 0", transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)" }}>
          {[-20, 10, 40, 66].map((x, i) => {
            const y = 26 - i * 0.5;
            return <path key={x} d={`M${x} ${y} Q${x - 8} ${y + 10} ${x - 18} ${y + 16} Q${x - 6} ${y + 12} ${x + 10} ${y + 1} Z`} fill={spikeFill} stroke="#2a0a04" strokeWidth="1.2" />;
          })}
          {LOWER_TEETH.map(([x, h]) => (
            <path key={x} d={`M${x - 3.5} -7 Q${x - 1} ${-7 - h * 0.6} ${x + 1.5} ${-7 - h} Q${x + 2.5} ${-7 - h * 0.5} ${x + 3.5} -7 Z`} fill="#fffbeb" stroke="#7c2d12" strokeWidth="0.7" />
          ))}
          <path d={LOWER_JAW} fill={`url(#${id}-seg)`} stroke="#2a0a04" strokeWidth="2.4" strokeLinejoin="round" />
          <path d={LOWER_JAW} fill={`url(#${id}-scales)`} />
          <path d="M-40 4 C10 6 70 4 128 0" fill="none" stroke="#c2502a" strokeWidth="2" strokeOpacity="0.55" />
          {/* a luz da lava batendo embaixo */}
          <path d="M-30 25 C20 29 70 23 104 21" fill="none" stroke="#f97316" strokeWidth="2" strokeOpacity="0.4" strokeLinecap="round" />
        </g>
      </g>

      {/* espinhos da bochecha */}
      {CHEEK_SPIKES.map((d) => (
        <path key={d} d={d} fill={spikeFill} stroke="#2a0a04" strokeWidth="1.6" strokeLinejoin="round" />
      ))}

      {/* crânio e focinho, com o gancho do bico */}
      <path d={SKULL} fill={`url(#${id}-seg)`} stroke="#2a0a04" strokeWidth="2.6" strokeLinejoin="round" />
      <path d={SKULL} fill={`url(#${id}-scales)`} />
      {/* dentes de cima */}
      {UPPER_TEETH.map(([x, h]) => {
        const y = upperLip(x);
        return <path key={x} d={`M${x - 4} ${y} Q${x - 1} ${y + h * 0.6} ${x + 1.5} ${y + h} Q${x + 3} ${y + h * 0.5} ${x + 4} ${y} Z`} fill="#fffbeb" stroke="#7c2d12" strokeWidth="0.7" />;
      })}
      {/* placas do focinho, o brilho do alto da cabeça e da bochecha */}
      <g fill="none" stroke="#2a0a04" strokeOpacity="0.38" strokeWidth="1.5" strokeLinecap="round">
        <path d="M98 -34 C102 -24 103 -12 100 -2" />
        <path d="M122 -28 C126 -18 126 -8 123 2" />
        <path d="M146 -22 C150 -14 150 -4 147 6" />
        <path d="M-8 -2 C8 -12 30 -10 46 2" />
      </g>
      <path d="M20 -48 C50 -50 84 -40 110 -32 C140 -24 170 -17 192 -5" fill="none" stroke="#d9623a" strokeWidth="2.6" strokeOpacity="0.65" strokeLinecap="round" />
      {/* chifrinho do nariz, a narina com brasa */}
      <path d="M154 -21 C158 -35 166 -45 178 -51 C172 -39 170 -29 170 -18 Z" fill={spikeFill} stroke="#2a0a04" strokeWidth="1.5" />
      <path d="M174 -6 C180 -8 186 -6 188 -2" stroke="#1a0502" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="182" cy="-4" r="2.6" fill="#fb923c" opacity={jaw > 0 ? 0.95 : 0.4} />

      {/* o olho de brasa afundado, sob a sobrancelha pesada */}
      <path d="M58 -26 C70 -32 90 -30 100 -20 C92 -12 72 -10 60 -16 Z" fill="#1a0502" />
      <g style={{ filter: "drop-shadow(0 0 4px rgba(254,240,138,0.95))" }}>
        <path d="M66 -20 C74 -26 86 -25 94 -19 C86 -15 74 -14 66 -20 Z" fill={`url(#${id}-eye)`} />
        <path d="M81 -24 C79 -21 79 -17 81 -15" stroke="#1a0502" strokeWidth="2" strokeLinecap="round" />
      </g>
      <path d="M40 -40 C62 -46 92 -40 112 -30 C104 -26 94 -25 86 -27 C74 -30 58 -30 46 -26 C40 -28 38 -34 40 -40 Z" fill="#5a1608" stroke="#2a0a04" strokeWidth="1.8" />
      <path d="M44 -40 C66 -45 92 -39 110 -31" fill="none" stroke="#e0704a" strokeWidth="1.8" strokeOpacity="0.75" strokeLinecap="round" />
      {BROW_SPIKES.map((d) => (
        <path key={d} d={d} fill={spikeFill} stroke="#2a0a04" strokeWidth="1.5" strokeLinejoin="round" />
      ))}

      {/* o chifre grande de ouro, com anéis, varrendo pra trás */}
      <path
        d="M18 -46 C-6 -74 -48 -100 -100 -110 C-124 -114 -146 -110 -162 -100 C-138 -98 -114 -92 -90 -80 C-54 -62 -22 -38 -4 -22 Z"
        fill={`url(#${id}-gold)`}
        stroke="#2a0d04"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <g fill="none" stroke="#8a5a00" strokeOpacity="0.7" strokeWidth="1.6" strokeLinecap="round">
        <path d="M-14 -64 C-10 -58 -6 -50 -4 -44" />
        <path d="M-44 -84 C-40 -78 -36 -72 -34 -66" />
        <path d="M-76 -98 C-72 -92 -68 -88 -66 -84" />
        <path d="M-108 -106 C-104 -101 -100 -97 -98 -94" />
      </g>
      <path d="M10 -50 C-20 -76 -60 -98 -112 -106" fill="none" stroke="#fff7d6" strokeWidth="2" strokeOpacity="0.65" strokeLinecap="round" />
    </g>
  );
}

/** O anel de runas que gira em volta do pescoço quando ele chama a magia. */
function RuneRing({ show }: { show: boolean }) {
  const R = 158;
  return (
    <g transform="translate(272 -64)" style={{ filter: "drop-shadow(0 0 8px rgba(251,191,36,0.9))" }}>
      <g
        style={{
          // aparece se fechando no lugar; some rápido, se abrindo (antes de ele decolar)
          transform: `scale(${show ? 1 : 1.35})`,
          opacity: show ? 1 : 0,
          transformOrigin: "0 0",
          transition: show ? "transform 1.3s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.9s" : "transform 0.4s ease-in, opacity 0.35s",
        }}
      >
        <circle r={R + 14} fill="none" stroke="#f59e0b" strokeOpacity="0.25" strokeWidth="22" />
        <g className="cg-anim-dragon-spiral" style={{ "--cg-dur": "16s" } as React.CSSProperties}>
          <circle r={R} fill="none" stroke="#fde047" strokeWidth="3.5" />
          <circle r={R - 26} fill="none" stroke="#fbbf24" strokeWidth="2.2" />
          {Array.from({ length: 22 }, (_, i) => {
            const a = (i / 22) * 360;
            const [x, y] = rot(R - 13, 0, a);
            return (
              <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a + 90}) scale(1.15)`} fill="none" strokeLinecap="round">
                <path d={RING_GLYPHS[i % RING_GLYPHS.length]} stroke="#f59e0b" strokeOpacity="0.5" strokeWidth="5" />
                <path d={RING_GLYPHS[i % RING_GLYPHS.length]} stroke="#fef9c3" strokeWidth="1.8" />
              </g>
            );
          })}
        </g>
        <g className="cg-anim-dragon-spiral" style={{ "--cg-dur": "10s", animationDirection: "reverse" } as React.CSSProperties}>
          <circle r={R - 40} fill="none" stroke="#fde047" strokeWidth="2" strokeDasharray="4 10" />
          {[0, 120, 240].map((a) => {
            const [x, y] = rot(R - 40, 0, a);
            return <path key={a} d={`M${x} ${y - 9} L${x + 8} ${y + 6} L${x - 8} ${y + 6} Z`} fill="none" stroke="#fef08a" strokeWidth="2" />;
          })}
        </g>
      </g>
    </g>
  );
}

// ---------------------------------------------------------------------------
// o dragão
// ---------------------------------------------------------------------------

const EASE = "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)";

export default function ElderDragon({
  pose,
  mouthOpen = false,
  runes = 0,
  aura = false,
  className = "",
}: {
  pose: DragonPose;
  mouthOpen?: boolean;
  /** 0 = runas apagadinhas, 1 = acesas */
  runes?: number;
  /** o anel de runas girando em volta do pescoço */
  aura?: boolean;
  className?: string;
}) {
  const id = `dr${useId().replace(/:/g, "")}`;
  const rig = RIGS[pose];
  const beat = pose === "pouso" ? 0.62 : 0.9;
  const tailWave = rig.flap ? 2.2 : 4.2;

  return (
    <svg viewBox={`0 0 ${DRAGON_VIEW.w} ${DRAGON_VIEW.h}`} className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        {/* escamas: escuro nas costas, vermelho no meio, castanho-claro na barriga */}
        <linearGradient id={`${id}-seg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a1208" />
          <stop offset="0.45" stopColor="#8e2a14" />
          <stop offset="0.8" stopColor="#a8401d" />
          <stop offset="1" stopColor="#c76a36" />
        </linearGradient>
        <linearGradient id={`${id}-limb`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a33a1a" />
          <stop offset="0.6" stopColor="#7a2410" />
          <stop offset="1" stopColor="#4a1208" />
        </linearGradient>
        <linearGradient id={`${id}-limb-far`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5e1c0c" />
          <stop offset="1" stopColor="#2e0b04" />
        </linearGradient>
        <linearGradient id={`${id}-membrane`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a2683a" />
          <stop offset="0.5" stopColor="#7d4b26" />
          <stop offset="1" stopColor="#5a3218" />
        </linearGradient>
        <linearGradient id={`${id}-membrane-far`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e3a1e" />
          <stop offset="1" stopColor="#2e1708" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fef3c7" />
          <stop offset="0.35" stopColor="#facc15" />
          <stop offset="0.75" stopColor="#ca8a04" />
          <stop offset="1" stopColor="#713f12" />
        </linearGradient>
        <linearGradient id={`${id}-spike`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9623a" />
          <stop offset="1" stopColor="#5a1608" />
        </linearGradient>
        <linearGradient id={`${id}-maw`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b0f0a" />
          <stop offset="1" stopColor="#140303" />
        </linearGradient>
        <radialGradient id={`${id}-eye`} cx="0.45" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#fef9c3" />
          <stop offset="1" stopColor="#f59e0b" />
        </radialGradient>
        <pattern id={`${id}-scales`} width="18" height="13" patternUnits="userSpaceOnUse">
          <path d="M0 13 Q9 1 18 13" fill="none" stroke="#1a0502" strokeOpacity="0.28" strokeWidth="1.3" />
          <path d="M-9 6.5 Q0 -5.5 9 6.5 M9 6.5 Q18 -5.5 27 6.5" fill="none" stroke="#1a0502" strokeOpacity="0.2" strokeWidth="1.1" />
        </pattern>
      </defs>

      <g transform={`translate(${ROOT.x} ${ROOT.y})`}>
        <g style={{ transform: `translateY(${rig.lift}px)`, transition: EASE }}>
          {/* perna de trás do outro lado */}
          <g transform="translate(34 6) scale(1.12)">
            <HindLeg id={id} angles={[rig.hind[0] + 8, rig.hind[1], rig.hind[2]]} far lit={0} />
          </g>

          <g style={{ transform: `rotate(${rig.pitch}deg)`, transformOrigin: "0 0", transition: EASE }}>
            {/* asa do outro lado, atrás de tudo */}
            <g transform="translate(206 -86)">
              <Wing id={id} far rig={rig} beat={beat} />
            </g>
            {/* braço do outro lado */}
            <g transform="translate(252 40) scale(1.2)">
              <ForeLeg id={id} angles={[rig.fore[0] + 10, rig.fore[1], rig.fore[2]]} far />
            </g>

            {/* cauda: 7 partes, ondulando (desenhada espelhada: +x vai pra trás e ângulo positivo desce) */}
            <g transform={`translate(${TAIL_BASE.x} ${TAIL_BASE.y}) scale(-1 1)`}>
              <TailChain id={id} rig={rig} wave={tailWave} lit={runes} />
            </g>

            {/* corpo */}
            <path d={TORSO} fill={`url(#${id}-seg)`} stroke="#2a0a04" strokeWidth="3" />
            <path d={TORSO} fill={`url(#${id}-scales)`} />
            <path d={BELLY} fill="#c47a45" stroke="#7c2d12" strokeWidth="1.5" />
            {BELLY_LINES.map(([x, y0, y1]) => (
              <path key={x} d={`M${x - 3} ${y0 + 1} Q${x + 3} ${(y0 + y1) / 2} ${x - 2} ${y1 - 1}`} fill="none" stroke="#7c2d12" strokeWidth="1.6" />
            ))}
            {/* luz da lava batendo por baixo */}
            <path d="M268 18 C252 48 212 66 150 70 C90 74 30 70 -10 58" fill="none" stroke="#fb923c" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" />
            {BACK_SPIKES.map(([x, y, h]) => (
              <path key={x} d={spike(x, y + 2, h, 9)} fill={`url(#${id}-spike)`} stroke="#2a0a04" strokeWidth="1.2" />
            ))}
            <Runes paths={RUNE_BODY} lit={runes} />

            {/* braço da frente */}
            <g transform="translate(228 46) scale(1.25)">
              <ForeLeg id={id} angles={rig.fore} />
            </g>

            {/* o anel de runas: na frente do peito, atrás do pescoço e da asa */}
            <RuneRing show={aura} />

          </g>

          {/* perna de trás da frente */}
          <g transform="translate(12 14) scale(1.12)">
            <HindLeg id={id} angles={rig.hind} lit={runes} />
          </g>

          {/* o pescoço, a cabeça e a asa da frente vêm por último (mesma inclinação do corpo): quando a asa
              bate pra baixo, ela passa NA FRENTE da perna, e não pra dentro da coxa */}
          <g style={{ transform: `rotate(${rig.pitch}deg)`, transformOrigin: "0 0", transition: EASE }}>
            <g transform={`translate(${NECK_BASE.x} ${NECK_BASE.y})`}>
              <NeckChain id={id} rig={rig} mouthOpen={mouthOpen} lit={runes} />
            </g>
            <g transform="translate(176 -80)">
              <Wing id={id} rig={rig} beat={beat} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

function NeckChain({ id, rig, mouthOpen, lit }: { id: string; rig: Rig; mouthOpen: boolean; lit: number }) {
  const seg = (i: number): React.ReactNode => {
    if (i === NECK_LEN.length) return <Head id={id} rig={rig} mouthOpen={mouthOpen} lit={lit} />;
    const L = NECK_LEN[i];
    const [a, b] = NECK_W[i];
    return (
      <g style={{ transform: `rotate(${rig.neck[i]}deg)`, transformOrigin: "0 0", transition: EASE }}>
        <path d={capsule(L, a, b)} fill={`url(#${id}-seg)`} />
        <path d={capsule(L, a, b)} fill={`url(#${id}-scales)`} />
        <path d={edges(L, a, b)} fill="none" stroke="#2a0a04" strokeWidth="2.6" />
        {/* placas da garganta */}
        <path d={`M-4 ${a - 9} C${L * 0.4} ${a - 6} ${L * 0.7} ${b - 6} ${L + 4} ${b - 8} L${L + 2} ${b - 1} C${L * 0.7} ${b + 1} ${L * 0.4} ${a} -4 ${a - 1} Z`} fill="#c47a45" />
        {[0.3, 0.75].map((f) => (
          <path key={f} d={spike(L * f, -(a + (b - a) * f) + 3, 22 - i * 2, 8, 0.6)} fill={`url(#${id}-spike)`} stroke="#2a0a04" strokeWidth="1.2" />
        ))}
        <Runes paths={[RUNE_NECK]} lit={lit} delay={0.3 + i * 0.25} />
        <g transform={`translate(${L} 0)`}>{seg(i + 1)}</g>
      </g>
    );
  };
  return <>{seg(0)}</>;
}

function TailChain({ id, rig, wave, lit }: { id: string; rig: Rig; wave: number; lit: number }) {
  const seg = (i: number): React.ReactNode => {
    if (i === TAIL_LEN.length) {
      // a ponta da cauda: fina como um chicote
      return <path d="M-3 -5 C16 -6 36 -3 56 1 C36 4 16 6 -3 5 Z" fill={`url(#${id}-seg)`} stroke="#2a0a04" strokeWidth="1.8" strokeLinejoin="round" />;
    }
    const L = TAIL_LEN[i];
    const [a, b] = TAIL_W[i];
    return (
      <g style={{ transform: `rotate(${rig.tail[i]}deg)`, transformOrigin: "0 0", transition: EASE }}>
        <g className="cg-anim-dragon-wave" style={{ "--cg-dur": `${wave}s`, "--cg-delay": `${-i * 0.32}s`, transformOrigin: "0 0" } as React.CSSProperties}>
          <path d={capsule(L, a, b)} fill={`url(#${id}-seg)`} />
          <path d={capsule(L, a, b)} fill={`url(#${id}-scales)`} />
          <path d={edges(L, a, b)} fill="none" stroke="#2a0a04" strokeWidth="2.4" />
          {i < 5 && <path d={`M-4 ${a - 7} C${L * 0.4} ${a - 5} ${L * 0.7} ${b - 4} ${L + 3} ${b - 5} L${L + 2} ${b - 1} C${L * 0.7} ${b} ${L * 0.4} ${a} -4 ${a - 1} Z`} fill="#c47a45" />}
          {/* espinhos só perto do corpo; daí pra frente a cauda fica lisa */}
          {i < 3 &&
            [0.3, 0.75].map((f) => (
              // na cauda espelhada os espinhos varrem pra ponta (+x)
              <path key={f} d={spike(L * f, -(a + (b - a) * f) + 3, 16 - i * 4, 7, -0.6)} fill={`url(#${id}-spike)`} stroke="#2a0a04" strokeWidth="1.2" />
            ))}
          {i < 3 && <Runes paths={[RUNE_TAIL]} lit={lit} delay={0.9 + i * 0.25} />}
          <g transform={`translate(${L} 0)`}>{seg(i + 1)}</g>
        </g>
      </g>
    );
  };
  return <>{seg(0)}</>;
}
