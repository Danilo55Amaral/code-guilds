"use client";

import { useId } from "react";
import { Pt, jagged, mirror, poly } from "./events/dracoding/kit";

// ============================================================================
// MAGO DANILO — o guia do tutorial e das cenas dos eventos, em SVG puro, no
// estilo anguloso dos personagens da Noite de Dracoding: o guardião da
// CodeGuilds de armadura branca e dourada com gemas ciano, roupa escura por
// baixo, capa preta rasgada de um lado, cabelo branco penteado pra trás, olhos
// de luz, auréola dourada e um círculo mágico divino atrás, com runas e três
// medalhões de triângulo girando devagar. Animações (globals.css): respira,
// pisca, a capa balança, a auréola flutua, o orbe na mão pulsa, a boca mexe
// enquanto ele fala (`mouthOpen`) e cada `burstKey` novo solta um clarão do orbe.
// ============================================================================

const C = { x: 120, y: 118 }; // centro do círculo mágico atrás do mago
const GOLD = "#eab308";
const GOLD_LIGHT = "#fde68a";
const GOLD_DARK = "#a16207";
const CYAN = "#22d3ee";
const DARK = "#1f2430";
const SKIN = "#f3d2b5";

// Runas do anel: desenhos pequenos de traços, centrados em (0, 0)
const GLYPHS = [
  "M-3 -5 L-3 5 M-3 -5 L3 -1 M-3 0 L3 4",
  "M0 -5 L0 5 M-3 -2 L3 -2 M-3 2 L0 5",
  "M-3 5 L0 -5 L3 5 M-2 1 L2 1",
  "M-3 -4 L3 -4 L-3 4 L3 4",
  "M0 -5 L0 5 M0 -1 L-3 -5 M0 -1 L3 -5",
  "M-3 -5 L3 5 M3 -5 L-3 5 M-3 0 L3 0",
  "M-2 -5 Q4 -3 -2 0 Q4 3 -2 5",
  "M-3 -5 L-3 5 L3 5",
];

// Os três medalhões (graus, a partir da direita, sentido horário): em cima, à direita e à esquerda
const MEDALLIONS = [-90, -12, 192];

function deg(a: number) {
  return (a * Math.PI) / 180;
}

/** Triângulo com a ponta pra cima, inscrito num círculo de raio `r` em (cx, cy). */
function triangle(cx: number, cy: number, r: number, down = false): string {
  const s = down ? -1 : 1;
  return poly([
    [cx, cy - r * s],
    [cx + r * Math.cos(deg(30)), cy + (r / 2) * s],
    [cx - r * Math.cos(deg(30)), cy + (r / 2) * s],
  ]);
}

/** Medalhão do círculo: anel, triângulo e o "S" no meio, girando no lugar. `k` = escala; `w` engrossa os traços. */
function Medallion({ x, y, delay, k, w }: { x: number; y: number; delay: number; k: number; w: (n: number) => number }) {
  return (
    <g className="cg-anim-orbit-rev" style={{ "--cg-dur": "24s", "--cg-delay": `${delay}s` } as React.CSSProperties}>
      <circle cx={x} cy={y} r={16 * k} fill="#0b0b10" fillOpacity="0.55" stroke={GOLD_LIGHT} strokeWidth={w(1.8)} />
      <circle cx={x} cy={y} r={12.5 * k} fill="none" stroke={GOLD} strokeWidth={w(0.9)} />
      <path d={triangle(x, y, 11 * k)} fill="none" stroke={GOLD_LIGHT} strokeWidth={w(1.2)} strokeLinejoin="round" />
      <path
        d={`M${x + 2 * k} ${y - 3 * k} Q${x - 3 * k} ${y - 3 * k} ${x - 1 * k} ${y} Q${x + 3 * k} ${y + 2 * k} ${x - 2 * k} ${y + 4 * k}`}
        fill="none"
        stroke={GOLD_LIGHT}
        strokeWidth={w(1.1)}
        strokeLinecap="round"
      />
    </g>
  );
}

/**
 * O círculo mágico divino do Mago Danilo: anel de runas com os três medalhões (gira devagar) e o
 * triângulo de dentro (gira ao contrário). Centro em (cx, cy) e raio do anel de fora `r` (o do mago
 * é 108, e tudo o mais acompanha); `line` engrossa os traços quando o círculo fica pequeno — é
 * esse mesmo círculo que gira atrás do aluno na Aura do Mago Danilo (components/Avatar.tsx).
 */
export function DivineCircle({ cx, cy, r, line = 1 }: { cx: number; cy: number; r: number; line?: number }) {
  const k = r / 108;
  const w = (n: number) => n * k * line;
  const at = (radius: number, a: number): Pt => [cx + Math.cos(deg(a)) * radius * k, cy + Math.sin(deg(a)) * radius * k];
  const glyphs = Array.from({ length: 30 }, (_, i) => i * 12).filter((a) => MEDALLIONS.every((m) => Math.abs(((a - m + 540) % 360) - 180) > 14));
  return (
    <g style={{ filter: `drop-shadow(0 0 ${(3 * k * line).toFixed(2)}px rgba(253,224,71,0.85))` }}>
      {/* brilho de fundo respirando */}
      <g className="cg-anim-glow" style={{ "--cg-dur": "4s" } as React.CSSProperties}>
        <circle cx={cx} cy={cy} r={100 * k} fill="#fef9c3" opacity="0.08" />
      </g>
      {/* anel de fora, com as runas e os medalhões */}
      <g className="cg-anim-orbit" style={{ "--cg-dur": "70s", "--cg-origin": `${cx}px ${cy}px` } as React.CSSProperties}>
        <circle cx={cx} cy={cy} r={108 * k} fill="none" stroke={GOLD_LIGHT} strokeWidth={w(1.6)} />
        <circle cx={cx} cy={cy} r={94 * k} fill="none" stroke={GOLD} strokeWidth={w(1.2)} />
        {glyphs.map((a, i) => {
          const [x, y] = at(101, a);
          return (
            <path
              key={a}
              d={GLYPHS[i % GLYPHS.length]}
              transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a + 90}) scale(${(0.95 * k).toFixed(3)})`}
              fill="none"
              stroke={GOLD_LIGHT}
              strokeWidth={1.3 * line}
              strokeLinecap="round"
            />
          );
        })}
        {[6, 54, 126, 174, 234, 306].map((a) => {
          const [x, y] = at(116, a);
          return <circle key={a} cx={x} cy={y} r={2.2 * k * line} fill={GOLD_LIGHT} />;
        })}
        {MEDALLIONS.map((a, i) => {
          const [x, y] = at(108, a);
          return <Medallion key={a} x={x} y={y} delay={-i * 6} k={k} w={w} />;
        })}
      </g>
      {/* triângulo de dentro, girando ao contrário */}
      <g className="cg-anim-orbit-rev" style={{ "--cg-dur": "110s" } as React.CSSProperties}>
        <circle cx={cx} cy={cy} r={74 * k} fill="none" stroke={GOLD} strokeWidth={w(1)} strokeOpacity="0.8" />
        <circle cx={cx} cy={cy} r={68 * k} fill="none" stroke={GOLD_LIGHT} strokeWidth={w(0.8)} strokeDasharray={`${2 * k} ${5 * k}`} />
        <path d={triangle(cx, cy, 68 * k)} fill="none" stroke={GOLD_LIGHT} strokeWidth={w(1.4)} strokeLinejoin="round" />
        <circle cx={cx} cy={cy} r={34 * k} fill="none" stroke={GOLD} strokeWidth={w(1)} />
        <path d={triangle(cx, cy, 34 * k, true)} fill="none" stroke={GOLD} strokeWidth={w(1)} strokeLinejoin="round" />
        {Array.from({ length: 36 }, (_, i) => {
          const [x1, y1] = at(74, i * 10);
          const [x2, y2] = at(i % 3 ? 78 : 82, i * 10);
          return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`} stroke={GOLD} strokeWidth={w(1)} />;
        })}
      </g>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Peças do corpo (o lado direito do desenho é o espelho do esquerdo)
// ---------------------------------------------------------------------------

const PAULDRON: Pt[] = [
  [102, 126],
  [82, 118],
  [62, 98],
  [58, 112],
  [42, 100],
  [44, 122],
  [36, 140],
  [48, 158],
  [68, 162],
  [88, 152],
  [102, 140],
];
const PAULDRON_LOW: Pt[] = [
  [50, 152],
  [70, 160],
  [76, 172],
  [62, 182],
  [46, 176],
  [42, 162],
];
const COAT_FRONT: Pt[] = [
  [82, 132],
  [104, 132],
  [104, 202],
  [94, 202],
  [86, 170],
];
// aba da frente do sobretudo, longa e com duas pontas embaixo
const SKIRT: Pt[] = [
  [92, 208],
  [112, 210],
  [110, 246],
  [106, 292],
  [97, 320],
  [83, 306],
  [66, 318],
  [60, 300],
  [74, 256],
];
// placa de armadura no quadril
const TASSET: Pt[] = [
  [88, 206],
  [106, 208],
  [104, 228],
  [92, 238],
  [82, 226],
];
const BOOT: Pt[] = [
  [96, 282],
  [121, 282],
  [121, 320],
  [125, 334],
  [84, 334],
  [90, 318],
];
const KNEE: Pt[] = [
  [94, 280],
  [123, 280],
  [119, 296],
  [98, 296],
];

// O rosto: maçãs, mandíbula e queixo em curvas suaves, com a sombra fria do lado direito.
const FACE =
  "M104 76 C104 69.5 110.5 65 120 65 C129.5 65 136 69.5 136 76 L136.4 93 C136.4 101.5 133.5 107.5 127.5 112.4 Q120 117.2 112.5 112.4 C106.5 107.5 103.6 101.5 103.6 93 Z";
const FACE_SHADE = "M131 70 C134.5 74 136 79 136 84 L136.4 93 C136.4 101.5 133.5 107.5 127.5 112.4 C130.6 108 132 101 132 94 C132.3 85 132.6 77 131 70 Z";
const EAR = "M104 87.5 C100 85.5 98.4 90 99.4 95 C100.2 99 102.2 101.2 104.6 100.4 Z";
// Cabelo branco, corte masculino: laterais raspadas e o topo penteado pra trás,
// deixando a testa à mostra. Atrás: a parte raspada, rente à cabeça, com costeletas curtas na frente das orelhas.
const HAIR_BACK = "M120 56 C133 56 140 64 140.5 78 C141 86 140.5 92 139 97 L101 97 C99.5 92 99 86 99.5 78 C100 64 107 56 120 56 Z";
// o topo: mais baixo e anguloso, termina nas têmporas, com a linha do cabelo em M
const HAIR_TOP =
  "M101.2 80 L99.6 67 Q102 56 111.5 52 L120 50.6 L128.5 52 Q138 56 140.4 67 L138.8 80 L136.4 78 Q135.6 73 131.6 71.5 Q125.6 69.6 120 75 Q114.4 69.6 108.4 71.5 Q104.4 73 103.6 78 Z";
// o topete: mechas penteadas pra trás e pro lado, uma por cima da outra, com as pontas deitadas
const HAIR_TUFT = "M100 62 Q103 51 114 46 L111 53 Q116 45 126 41.5 L122.5 51 Q129 44 139 43 L134.5 51.5 Q142 48 148 52 L140 62 Z";
// sombra fria do lado direito do cabelo (a luz vem da esquerda, como na armadura)
const HAIR_SHADE = "M128.5 52 Q138 56 140.4 67 L138.8 80 L136.4 78 Q135.6 73 131.6 71.5 Q134 61 128.5 52 Z";

function Boot({ flip = false }: { flip?: boolean }) {
  const pts = flip ? mirror(BOOT, 120) : BOOT;
  const gx = flip ? 136 : 104;
  return (
    <g>
      <path d={poly(pts)} fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" strokeLinejoin="round" />
      <path d={poly(flip ? mirror(KNEE, 120) : KNEE)} fill={GOLD} stroke={GOLD_DARK} strokeWidth="0.8" />
      <circle cx={flip ? 131 : 109} cy="288" r="2.8" fill={CYAN} stroke={GOLD_DARK} strokeWidth="0.8" />
      <path d={flip ? "M146 322 L156 334 L130 334 L132 324 Z" : "M94 322 L84 334 L110 334 L108 324 Z"} fill={GOLD} stroke={GOLD_DARK} strokeWidth="0.8" />
      <circle cx={gx} cy="326" r="3.6" fill={CYAN} stroke={GOLD_DARK} strokeWidth="1" />
    </g>
  );
}

export default function WizardDanilo({ mouthOpen, burstKey, className = "" }: { mouthOpen: boolean; burstKey: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const ids = { white: `nw${uid}`, gem: `ng${uid}`, orb: `no${uid}`, glow: `nl${uid}`, eye: `ne${uid}` };
  const white = `url(#${ids.white})`;

  return (
    <svg viewBox="0 0 240 340" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        {/* branco da armadura: claro à esquerda, sombra fria à direita */}
        <linearGradient id={ids.white} gradientUnits="userSpaceOnUse" x1="40" y1="0" x2="200" y2="0">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#eef2f7" />
          <stop offset="1" stopColor="#b8c2d0" />
        </linearGradient>
        <radialGradient id={ids.gem} cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#ecfeff" />
          <stop offset="0.5" stopColor={CYAN} />
          <stop offset="1" stopColor="#0e7490" />
        </radialGradient>
        <radialGradient id={ids.orb} cx="0.4" cy="0.35">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#a5f3fc" />
          <stop offset="1" stopColor="#0891b2" />
        </radialGradient>
        {/* olhos de luz: brancos no meio, ciano nas bordas */}
        <radialGradient id={ids.eye} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#e0fbff" />
          <stop offset="1" stopColor="#67e8f9" />
        </radialGradient>
        <radialGradient id={ids.glow}>
          <stop offset="0" stopColor="#a5f3fc" stopOpacity="0.9" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ---- o círculo mágico atrás de tudo ---- */}
      <DivineCircle cx={C.x} cy={C.y} r={108} />

      {/* ---- capa preta rasgada, do lado direito ---- */}
      <g className="cg-anim-cape" style={{ "--cg-dur": "4.5s" } as React.CSSProperties}>
        <path
          d={jagged(
            [
              [138, 124],
              [168, 126],
              [190, 168],
              [206, 238],
              [214, 318],
              [178, 334],
              [152, 302],
              [146, 240],
              [140, 180],
            ],
            15,
            30,
            211,
            true,
            0.9,
          )}
          fill="#08080c"
        />
      </g>

      {/* corpo e cabeça respiram juntos (olhos e boca dentro do mesmo movimento) */}
      <g className="cg-anim-dragon-breathe">
        {/* ---- caudas do sobretudo (atrás das pernas) ---- */}
        <path
          d={poly([
            [86, 206],
            [154, 206],
            [168, 290],
            [186, 330],
            [160, 318],
            [140, 334],
            [120, 318],
            [100, 334],
            [80, 318],
            [54, 330],
            [72, 290],
          ])}
          fill="#cfd6e0"
          stroke={GOLD}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* ---- pernas e botas ---- */}
        <path d={poly([[101, 228], [119, 228], [118, 286], [101, 286]])} fill={DARK} />
        <path d={poly([[121, 228], [139, 228], [139, 286], [122, 286]])} fill="#171a24" />
        <Boot />
        <Boot flip />

        {/* ---- frente do sobretudo: abas brancas com acabamento dourado ---- */}
        {[false, true].map((flip) => (
          <g key={String(flip)}>
            <path d={poly(flip ? mirror(SKIRT, 120) : SKIRT)} fill={white} stroke={GOLD} strokeWidth="2.4" strokeLinejoin="round" />
            <path
              d={flip ? "M132 216 L134 290 L144 310 M156 302 L172 308 M140 250 C148 252 152 262 146 268" : "M108 216 L106 290 L96 310 M84 302 L68 308 M100 250 C92 252 88 262 94 268"}
              fill="none"
              stroke={GOLD}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path d={flip ? "M150 262 L160 258 L156 268 Z" : "M90 262 L80 258 L84 268 Z"} fill={GOLD} />
          </g>
        ))}

        {/* ---- tronco: roupa escura, sobretudo aberto e cinto ---- */}
        <path d={poly([[100, 128], [140, 128], [144, 202], [96, 202]])} fill={DARK} />
        <path d="M110 150 L110 200 M130 150 L130 200" stroke="#2c3240" strokeWidth="2" />
        {[false, true].map((flip) => (
          <g key={String(flip)}>
            <path d={poly(flip ? mirror(COAT_FRONT, 120) : COAT_FRONT)} fill={white} stroke="#94a3b8" strokeWidth="1" />
            <path d={flip ? "M136 132 L136 206" : "M104 132 L104 206"} stroke={GOLD} strokeWidth="2.6" />
          </g>
        ))}
        <path d={poly([[92, 196], [148, 196], [148, 208], [92, 208]])} fill={GOLD} stroke={GOLD_DARK} strokeWidth="1" />
        {[false, true].map((flip) => (
          <g key={String(flip)}>
            <path d={poly(flip ? mirror(TASSET, 120) : TASSET)} fill={white} stroke={GOLD} strokeWidth="2" strokeLinejoin="round" />
            <circle cx={flip ? 145 : 95} cy="220" r="2.8" fill={`url(#${ids.gem})`} stroke={GOLD_DARK} strokeWidth="0.8" />
          </g>
        ))}
        <path d={poly([[120, 194], [130, 204.5], [120, 215], [110, 204.5]])} fill={GOLD_LIGHT} stroke={GOLD_DARK} strokeWidth="1" />
        <circle cx="120" cy="204.5" r="4.6" fill={`url(#${ids.gem})`} />

        {/* ---- braço esquerdo, caído, com bracelete dourado e faixas ---- */}
        <g strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M64 160 L58 200 L64 236" stroke="#94a3b8" strokeWidth="21" />
          <path d="M64 160 L58 200 L64 236" stroke={white} strokeWidth="17" />
        </g>
        <path d={poly([[50, 212], [72, 210], [74, 232], [54, 236]])} fill={GOLD} stroke={GOLD_DARK} strokeWidth="1" />
        <circle cx="62" cy="222" r="3.4" fill={`url(#${ids.gem})`} />
        <path d="M51 192 L67 186 M50 199 L67 193" stroke="#f1e7c9" strokeWidth="3.2" strokeLinecap="round" />
        <g className="cg-anim-cape" style={{ "--cg-dur": "2.2s" } as React.CSSProperties}>
          <path d="M66 190 C76 196 74 208 82 214 C78 206 82 200 76 194 Z" fill="#f1e7c9" />
        </g>
        <path d={poly([[56, 236], [72, 236], [74, 250], [66, 256], [56, 250]])} fill="#111318" />

        {/* ---- braço direito, erguido, com a magia na mão ---- */}
        <g strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M176 160 L192 198 L204 176" stroke="#94a3b8" strokeWidth="21" />
          <path d="M176 160 L192 198 L204 176" stroke={white} strokeWidth="17" />
        </g>
        <path d={poly([[192, 182], [208, 170], [218, 184], [202, 196]])} fill={GOLD} stroke={GOLD_DARK} strokeWidth="1" />
        <circle cx="205" cy="183" r="3.4" fill={`url(#${ids.gem})`} />
        <path d={poly([[202, 168], [214, 160], [222, 166], [216, 176], [206, 176]])} fill="#111318" />
        <circle cx="214" cy="146" r="20" fill={`url(#${ids.glow})`} className="cg-anim-orb" />
        <circle cx="214" cy="146" r="8.5" fill={`url(#${ids.orb})`} stroke="#ecfeff" strokeWidth="1" />
        <circle key={burstKey} cx="214" cy="146" r="10" fill="none" stroke={GOLD_LIGHT} strokeWidth="3" className="cg-anim-burst" />
        {[
          [198, 132, 0],
          [230, 136, 0.7],
          [224, 122, 1.3],
        ].map(([x, y, d]) => (
          <path key={x} d={`M${x} ${y - 4} L${x + 1.2} ${y - 1.2} L${x + 4} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 4} L${x - 1.2} ${y + 1.2} L${x - 4} ${y} L${x - 1.2} ${y - 1.2} Z`} fill={GOLD_LIGHT} className="cg-anim-twinkle" style={{ animationDelay: `${d}s` }} />
        ))}

        {/* ---- ombreiras: placas pontudas em camadas, com gema ciano ---- */}
        {[false, true].map((flip) => (
          <g key={String(flip)} transform={flip ? "translate(240 0) scale(-1 1)" : undefined}>
            <path d={poly(PAULDRON_LOW)} fill={white} stroke={GOLD} strokeWidth="2" strokeLinejoin="round" />
            <path d={poly(PAULDRON)} fill={white} stroke={GOLD} strokeWidth="2.6" strokeLinejoin="round" />
            <path d="M58 112 L72 128 M44 122 L64 134 M62 98 L80 124" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M44 146 C58 156 78 154 96 140" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
            <path d={poly([[70, 128], [80, 138], [70, 148], [60, 138]])} fill={GOLD_LIGHT} stroke={GOLD_DARK} strokeWidth="1" />
            <circle cx="70" cy="138" r="4.4" fill={`url(#${ids.gem})`} />
            <circle cx="56" cy="168" r="2.6" fill={`url(#${ids.gem})`} stroke={GOLD_DARK} strokeWidth="0.8" />
          </g>
        ))}

        {/* ---- gola alta ---- */}
        <path d={poly([[100, 128], [90, 100], [104, 112], [110, 126]])} fill={white} stroke={GOLD} strokeWidth="2" strokeLinejoin="round" />
        <path d={poly([[140, 128], [150, 100], [136, 112], [130, 126]])} fill={white} stroke={GOLD} strokeWidth="2" strokeLinejoin="round" />

        {/* ---- pescoço, laterais do cabelo, orelhas e rosto ---- */}
        <path d={poly([[111, 106], [129, 106], [131, 126], [109, 126]])} fill="#dcb393" />
        {/* sombra do queixo no pescoço */}
        <path d="M111.5 110 Q120 119 128.5 110 L129 116.5 Q120 121.5 111 116.5 Z" fill="#c69c7b" />
        {/* as laterais raspadas, num cinza mais escuro que o topo */}
        <path d={HAIR_BACK} fill="#c3ccd8" stroke="#8a96a8" strokeWidth="1" strokeLinejoin="round" />
        <path d={EAR} fill={SKIN} stroke="#d9b08e" strokeWidth="0.8" />
        <path d={EAR} transform="translate(240 0) scale(-1 1)" fill="#e3bc9b" stroke="#d9b08e" strokeWidth="0.8" />
        <path d={FACE} fill={SKIN} />
        <path d={FACE_SHADE} fill="#e0b898" opacity="0.75" />

        {/* ---- sobrancelhas sérias e os olhos de luz (sem pupila), piscando ---- */}
        <path
          d="M118.6 89.6 C114 87.2 109 86.6 104.2 88 L104.4 86.4 C109 84.8 114.6 85 118.8 87.2 Z M121.4 89.6 C126 87.2 131 86.6 135.8 88 L135.6 86.4 C131 84.8 125.4 85 121.2 87.2 Z"
          fill="#64748b"
        />
        <g className="cg-anim-blink">
          {/* o brilho que escapa dos olhos e tinge o rosto de ciano */}
          <ellipse cx="112" cy="93" rx="10" ry="6" fill={`url(#${ids.glow})`} opacity="0.75" />
          <ellipse cx="128" cy="93" rx="10" ry="6" fill={`url(#${ids.glow})`} opacity="0.75" />
          <g style={{ filter: "drop-shadow(0 0 2px #cffafe) drop-shadow(0 0 4.5px rgba(34,211,238,0.85))" }}>
            {/* amêndoas: canto de fora um pouco mais alto, pálpebra de cima arqueada e a de baixo mais reta */}
            <path
              d="M105.8 92.4 C108.6 89.8 113.8 89.4 118.2 93.2 C114.6 95.9 109 96.1 105.8 92.4 Z M134.2 92.4 C131.4 89.8 126.2 89.4 121.8 93.2 C125.4 95.9 131 96.1 134.2 92.4 Z"
              fill={`url(#${ids.eye})`}
            />
            <ellipse cx="112" cy="92.9" rx="3.2" ry="1.6" fill="#ffffff" />
            <ellipse cx="128" cy="92.9" rx="3.2" ry="1.6" fill="#ffffff" />
          </g>
          <path d="M104.6 91.9 C108.2 89.1 114 88.7 118.6 93 M135.4 91.9 C131.8 89.1 126 88.7 121.4 93" stroke="#1e293b" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
        <path d="M121.2 95.5 C121.8 99 123 102 121.8 103.4 C121 104.1 119.8 104 119 103.5" stroke="#c4916e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {mouthOpen ? (
          <path d="M115.2 108.6 Q120 109.6 124.8 108.4 Q123.4 113 120 113.2 Q116.6 113 115.2 108.6 Z" fill="#5b1a12" />
        ) : (
          <path d="M115.6 109.2 Q120 110.2 124.4 109" stroke="#8a4535" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        )}

        {/* ---- cabelo de cima: penteado pra trás, sem franja, com o topete e um brilho anguloso ---- */}
        <path d={HAIR_TUFT} fill="#dbe2ea" stroke="#8a96a8" strokeWidth="1" strokeLinejoin="round" />
        <path d={HAIR_TOP} fill="#f1f5f9" stroke="#8a96a8" strokeWidth="1" strokeLinejoin="round" />
        <path d={HAIR_SHADE} fill="#d5dce5" />
        <path d={HAIR_TOP} fill="none" stroke="#8a96a8" strokeWidth="1" strokeLinejoin="round" />
        {/* fios: saem da linha do cabelo e seguem o penteado, pra trás e pro lado */}
        <g stroke="#b8c2cf" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M108.5 71.5 Q109 62 114 55 M116 73.5 Q118 63 124 54 M124 73 Q128 64 134 56 M131 71.5 Q135.5 66 138 60" />
          <path d="M102.6 77 L101.4 68 M137.4 77 L138.6 68" />
        </g>
        <path d="M104 64 L109 57.5 L116 54.5" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* ---- jabô creme com o broche de gema ---- */}
        {[0, 1, 2].map((k) => {
          const y = 126 + k * 9;
          const w = 13 - k * 2;
          return (
            <path
              key={k}
              d={`M${120 - w} ${y} L${120 + w} ${y} L${120 + w - 2} ${y + 9} L${120 + w / 3} ${y + 6} L120 ${y + 10} L${120 - w / 3} ${y + 6} L${120 - w + 2} ${y + 9} Z`}
              fill="#f1e7c9"
              stroke="#c9b48a"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
          );
        })}
        <path d={poly([[120, 122], [128, 130], [120, 138], [112, 130]])} fill={GOLD} stroke={GOLD_DARK} strokeWidth="1" />
        <circle cx="120" cy="130" r="3.8" fill={`url(#${ids.gem})`} />

        {/* ---- auréola dourada flutuando ---- */}
        <g className="cg-anim-aura-bob" style={{ "--cg-dur": "3.2s" } as React.CSSProperties}>
          <ellipse cx="120" cy="30" rx="27" ry="6.5" fill="none" stroke={GOLD_LIGHT} strokeWidth="4" style={{ filter: "drop-shadow(0 0 5px #fde047)" }} />
          <ellipse cx="120" cy="30" rx="27" ry="6.5" fill="none" stroke="#fffbeb" strokeWidth="1.2" />
        </g>
      </g>
    </svg>
  );
}
