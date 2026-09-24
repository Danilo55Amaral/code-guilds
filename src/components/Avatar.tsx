import { useId } from "react";
import { AvatarConfig, HairStyle, Hat, SKIN_TONES } from "@/engine/avatar";

// ============================================================================
// AVATAR — o personagem do aluno em SVG puro, montado em camadas:
// fundo → cabelo de trás → roupa/pescoço → rosto → olhos/boca/detalhes →
// cabelo da frente → óculos → chapéu. Tudo num viewBox de 128x128.
// ============================================================================

/** Escurece (amount < 0) ou clareia (amount > 0) uma cor hex. */
function shade(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const target = amount < 0 ? 0 : 255;
  const t = Math.abs(amount);
  const mix = (c: number) => Math.round(c + (target - c) * t);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/** Chapéus que cobrem o topo da cabeça — cabelos altos ficam "por baixo" deles. */
const COVERING_HATS: Hat[] = ["mago", "bone", "elmo", "pirata"];
const TALL_HAIR: HairStyle[] = ["espetado", "moicano", "coque", "afro", "cacheado"];

// ---------------------------------------------------------------------------
// Cabelo
// ---------------------------------------------------------------------------

function HairBack({ style, color, hat }: { style: HairStyle; color: string; hat: Hat }) {
  const back = shade(color, -0.15);
  switch (style) {
    case "longo":
      return (
        <path
          d="M30 52 C30 28 46 18 64 18 C82 18 98 28 98 52 L100 108 C92 112 84 110 80 104 L84 70 L44 70 L48 104 C44 110 36 112 28 108 Z"
          fill={back}
        />
      );
    case "rabo":
      return (
        <g>
          <path d="M86 38 C106 42 110 68 100 90 C99 74 95 60 86 52 Z" fill={back} />
          <circle cx="90" cy="42" r="3.5" fill="#f43f5e" />
        </g>
      );
    case "coque":
      if (COVERING_HATS.includes(hat)) return null;
      return (
        <g>
          <circle cx="64" cy="20" r="11" fill={back} />
          <path d="M58 14 Q64 10 70 14" stroke={shade(color, 0.25)} strokeWidth="1.5" fill="none" opacity="0.6" />
        </g>
      );
    case "afro":
      return (
        <g>
          <circle cx="64" cy="48" r="40" fill={back} />
          {[
            [34, 30],
            [50, 16],
            [70, 13],
            [88, 22],
            [98, 42],
            [28, 50],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="6" fill={shade(color, -0.3)} opacity="0.25" />
          ))}
        </g>
      );
    case "cacheado":
      return (
        <g fill={back}>
          <circle cx="33" cy="62" r="8" />
          <circle cx="95" cy="62" r="8" />
          <circle cx="35" cy="74" r="7" />
          <circle cx="93" cy="74" r="7" />
        </g>
      );
    default:
      return null;
  }
}

function HairFront({ style, color, hat }: { style: HairStyle; color: string; hat: Hat }) {
  if (hat === "elmo") return null; // o elmo cobre a cabeça toda
  const effective: HairStyle = COVERING_HATS.includes(hat) && TALL_HAIR.includes(style) ? "curto" : style;
  const light = shade(color, 0.3);

  switch (effective) {
    case "careca":
      return <ellipse cx="54" cy="35" rx="8" ry="3.5" fill="#fff" opacity="0.22" transform="rotate(-20 54 35)" />;
    case "espetado":
      return (
        <path
          d="M34 58 L30 40 L40 42 L38 26 L50 32 L54 16 L62 28 L70 14 L74 28 L86 20 L86 34 L98 36 L94 58 C90 48 84 42 76 42 C68 46 58 46 50 42 C42 44 37 50 34 58 Z"
          fill={color}
        />
      );
    case "cacheado":
      return (
        <g fill={color}>
          <path d="M35 56 C32 36 46 24 64 24 C82 24 96 36 93 56 C88 46 80 42 64 42 C48 42 40 46 35 56 Z" />
          {[
            [37, 48, 8],
            [43, 36, 9],
            [53, 28, 9],
            [65, 25, 9],
            [77, 28, 9],
            [87, 36, 9],
            [91, 48, 8],
            [48, 42, 6],
            [80, 42, 6],
          ].map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
          ))}
          <path d="M50 30 Q54 27 58 30 M70 29 Q74 26 78 29" stroke={light} strokeWidth="1.4" fill="none" opacity="0.6" />
        </g>
      );
    case "afro":
      return <path d="M36 56 C36 40 48 32 64 32 C80 32 92 40 92 56 C90 36 80 24 64 24 C48 24 38 36 36 56 Z" fill={color} />;
    case "longo":
      return (
        <g fill={color}>
          <path d="M34 58 C32 34 46 22 64 22 C84 22 96 34 94 58 C88 44 78 38 66 40 C60 46 48 48 40 50 C38 52 36 55 34 58 Z" />
          <path d="M36 50 C34 62 34 76 38 88 L43 88 C40 74 40 62 42 52 Z" />
          <path d="M92 50 C94 62 94 76 90 88 L85 88 C88 74 88 62 86 52 Z" />
          <path d="M48 28 Q60 23 74 27" stroke={light} strokeWidth="2" fill="none" opacity="0.5" />
        </g>
      );
    case "rabo":
    case "coque":
      // penteado pra trás: testa livre, volume vai pro rabo/coque (camada de trás)
      return (
        <g>
          <path d="M36 54 C36 34 48 24 64 24 C80 24 92 34 92 54 C88 42 78 34 64 34 C50 34 40 42 36 54 Z" fill={color} />
          <path d="M46 30 Q58 26 70 28" stroke={light} strokeWidth="1.6" fill="none" opacity="0.5" />
        </g>
      );
    case "moicano":
      return (
        <g>
          <path d="M36 54 C36 36 48 28 64 28 C80 28 92 36 92 54 C88 44 78 38 64 38 C50 38 40 44 36 54 Z" fill={color} opacity="0.3" />
          <path d="M57 44 C55 30 56 16 64 6 C72 16 73 30 71 44 C68 42 60 42 57 44 Z" fill={color} />
          <path d="M64 10 L64 40" stroke={light} strokeWidth="1.2" opacity="0.5" />
        </g>
      );
    case "curto":
    default:
      return (
        <g>
          <path
            d="M34 58 C31 36 44 22 64 22 C85 22 97 36 94 58 C92 50 88 44 82 41 C76 45 64 46 52 42 C46 45 40 50 36 58 Z"
            fill={color}
          />
          <path d="M48 30 Q60 25 72 28" stroke={light} strokeWidth="2" fill="none" opacity="0.5" />
        </g>
      );
  }
}

// ---------------------------------------------------------------------------
// Roupa
// ---------------------------------------------------------------------------

function Outfit({ config, skin, steelId }: { config: AvatarConfig; skin: string; steelId: string }) {
  const c = config.outfitColor;
  const dark = shade(c, -0.25);
  const body = "M20 128 C20 106 36 96 64 96 C92 96 108 106 108 128 Z";

  switch (config.outfit) {
    case "moletom":
      return (
        <g>
          <path d={body} fill={c} />
          <path d="M40 100 C44 92 54 90 64 92 C74 90 84 92 88 100 C80 98 72 100 64 102 C56 100 48 98 40 100 Z" fill={dark} />
          <path d="M58 100 L57 114 M70 100 L71 114" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="57" cy="115" r="1.4" fill="#f8fafc" />
          <circle cx="71" cy="115" r="1.4" fill="#f8fafc" />
          <path d="M46 118 L82 118 L79 128 L49 128 Z" fill={dark} opacity="0.6" />
        </g>
      );
    case "manto":
      return (
        <g>
          <path d={body} fill={c} />
          <path d="M44 99 C50 90 58 92 64 95 C70 92 78 90 84 99 L76 105 L64 99 L52 105 Z" fill={dark} />
          <path d="M60 104 L58 128 M68 104 L70 128" stroke="#fbbf24" strokeWidth="2" />
          <path d="M40 114 l1.5 3 3 .5 -2.2 2 .6 3 -2.9 -1.5 -2.9 1.5 .6 -3 -2.2 -2 3 -.5 z" fill="#fde68a" />
          <path d="M88 110 l1.2 2.4 2.5 .4 -1.8 1.7 .4 2.5 -2.3 -1.2 -2.3 1.2 .4 -2.5 -1.8 -1.7 2.5 -.4 z" fill="#fde68a" />
        </g>
      );
    case "armadura":
      return (
        <g>
          <path d={body} fill={`url(#${steelId})`} />
          <ellipse cx="30" cy="108" rx="14" ry="10" fill={`url(#${steelId})`} stroke="#475569" strokeWidth="1.2" />
          <ellipse cx="98" cy="108" rx="14" ry="10" fill={`url(#${steelId})`} stroke="#475569" strokeWidth="1.2" />
          <path d="M64 102 L64 128" stroke="#475569" strokeWidth="1.2" />
          <path d="M52 96 C58 100 70 100 76 96 L76 100 C70 104 58 104 52 100 Z" fill="#94a3b8" />
          <circle cx="64" cy="115" r="5.5" fill={c} stroke="#fbbf24" strokeWidth="1.5" />
        </g>
      );
    case "tunica":
    default:
      return (
        <g>
          <path d={body} fill={c} />
          <path d="M55 96 L64 109 L73 96 Z" fill={shade(skin, -0.08)} />
          <path d="M53 96 L64 111 L75 96" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinejoin="round" />
          <rect x="20" y="121" width="88" height="7" fill="#78350f" />
          <rect x="60" y="120" width="8" height="8" rx="1.5" fill="#fbbf24" />
        </g>
      );
  }
}

// ---------------------------------------------------------------------------
// Rosto
// ---------------------------------------------------------------------------

function Eye({ cx, color }: { cx: number; color: string }) {
  return (
    <g>
      <ellipse cx={cx} cy="60" rx="5.5" ry="6" fill="#fff" />
      <circle cx={cx} cy="60.5" r="3.8" fill={color} stroke={shade(color, -0.35)} strokeWidth="0.8" />
      <circle cx={cx} cy="60.5" r="1.9" fill="#0b0b10" />
      <circle cx={cx + 1.4} cy="58.8" r="1.3" fill="#fff" />
      <circle cx={cx - 1.3} cy="62.2" r="0.6" fill="#fff" opacity="0.8" />
      <path d={`M${cx - 6} 58.5 Q${cx} 53 ${cx + 6} 58.5`} stroke="#1c1917" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </g>
  );
}

const BROWS: Record<AvatarConfig["expression"], string> = {
  feliz: "M45 50 Q52 46 59 49 M69 49 Q76 46 83 50",
  sorrisao: "M45 48 Q52 43 59 47 M69 47 Q76 43 83 48",
  confiante: "M45 48 Q52 43 59 47 M69 51 Q76 49 83 49",
  serio: "M45 48 L59 51.5 M69 51.5 L83 48",
};

function Mouth({ expression }: { expression: AvatarConfig["expression"] }) {
  const stroke = { stroke: "#5b2a1a", strokeWidth: 2.2, fill: "none", strokeLinecap: "round" as const };
  switch (expression) {
    case "sorrisao":
      return (
        <g>
          <path d="M55 72 Q64 85 73 72 Z" fill="#5b1a1a" />
          <path d="M56.5 72.3 L71.5 72.3 L70.5 75 Q64 76.5 57.5 75 Z" fill="#fff" />
          <ellipse cx="64" cy="79.5" rx="4" ry="2" fill="#e87a7a" />
        </g>
      );
    case "confiante":
      return <path d="M57 75 Q65 77.5 71 71.5" {...stroke} />;
    case "serio":
      return <path d="M58.5 75 L69.5 75" {...stroke} />;
    case "feliz":
    default:
      return <path d="M57 73 Q64 79.5 71 73" {...stroke} />;
  }
}

function FaceDetailLayer({ detail, skin, hair }: { detail: AvatarConfig["faceDetail"]; skin: string; hair: string }) {
  switch (detail) {
    case "sardas":
      return (
        <g fill={shade(skin, -0.35)}>
          {[
            [47, 66],
            [50.5, 68.5],
            [45, 69.5],
            [81, 66],
            [77.5, 68.5],
            [83, 69.5],
            [60, 64],
            [68, 64],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" />
          ))}
        </g>
      );
    case "bochechas":
      return (
        <g fill="#fb7185" opacity="0.45">
          <circle cx="46" cy="70" r="5" />
          <circle cx="82" cy="70" r="5" />
        </g>
      );
    case "cicatriz":
      return (
        <g stroke="#b86b6b" strokeLinecap="round">
          <path d="M78 47 L85 63" strokeWidth="1.8" />
          <path d="M78.5 51.5 L83 50.5 M80.5 56 L85 55 M82 60 L86.5 59" strokeWidth="1.1" />
        </g>
      );
    case "barba":
      return (
        <path
          d="M37 60 C39 80 49 93 64 93 C79 93 89 80 91 60 C87 72 80 78 72 79 C68 76.5 60 76.5 56 79 C48 78 41 72 37 60 Z"
          fill={hair}
        />
      );
    case "bigode":
      return <path d="M54 71.5 C57 66.5 62 67.5 64 70 C66 67.5 71 66.5 74 71.5 C70.5 70 67 71.5 64 72.2 C61 71.5 57.5 70 54 71.5 Z" fill={hair} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Óculos
// ---------------------------------------------------------------------------

function EyewearLayer({ eyewear }: { eyewear: AvatarConfig["eyewear"] }) {
  switch (eyewear) {
    case "redondo":
      return (
        <g stroke="#3f3f46" strokeWidth="2" fill="rgba(255,255,255,0.08)">
          <circle cx="52" cy="60" r="8" />
          <circle cx="76" cy="60" r="8" />
          <path d="M60 60 Q64 57 68 60 M44 59 L37 57 M84 59 L91 57" fill="none" />
        </g>
      );
    case "quadrado":
      return (
        <g stroke="#111827" fill="rgba(186,230,253,0.12)">
          <rect x="43" y="53" width="18" height="14" rx="3.5" strokeWidth="2.8" />
          <rect x="67" y="53" width="18" height="14" rx="3.5" strokeWidth="2.8" />
          <path d="M61 59 L67 59 M43 58 L37 56 M85 58 L91 56" strokeWidth="2.4" fill="none" />
        </g>
      );
    case "escuro":
      return (
        <g>
          <path d="M42 55 L61 55 L60 63 C59 67 55 68.5 51 68.5 C46 68.5 43 66 42 62 Z" fill="#0b1220" stroke="#111" strokeWidth="1.5" />
          <path d="M86 55 L67 55 L68 63 C69 67 73 68.5 77 68.5 C82 68.5 85 66 86 62 Z" fill="#0b1220" stroke="#111" strokeWidth="1.5" />
          <path d="M61 57 L67 57 M42 57 L37 55 M86 57 L91 55" stroke="#111" strokeWidth="2" />
          <path d="M45 58 L51 58 M70 58 L76 58" stroke="#fff" strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
        </g>
      );
    case "visor":
      return (
        <g>
          <path d="M38 54 C50 51 78 51 90 54 L89 65 C78 68 50 68 39 65 Z" fill="#22d3ee" fillOpacity="0.55" stroke="#0891b2" strokeWidth="1.5" />
          <path d="M42 57.5 L86 57.5" stroke="#fff" strokeWidth="1" opacity="0.55" />
          <rect x="34" y="55" width="5" height="9" rx="1.5" fill="#334155" />
          <rect x="89" y="55" width="5" height="9" rx="1.5" fill="#334155" />
        </g>
      );
    case "monoculo":
      return (
        <g stroke="#d4a017" fill="none">
          <circle cx="76" cy="60" r="8" strokeWidth="2.2" fill="rgba(255,255,255,0.1)" />
          <path d="M83 64 C88 74 86 84 80 94" strokeWidth="1" strokeDasharray="2 1.5" />
        </g>
      );
    case "tapa-olho":
      return (
        <g>
          <path d="M60 56 L92 48 M44 57 L35 52" stroke="#111827" strokeWidth="2" />
          <ellipse cx="52" cy="60" rx="8" ry="7" fill="#111827" />
        </g>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Chapéus
// ---------------------------------------------------------------------------

function HatLayer({ hat, accent, steelId, goldId }: { hat: Hat; accent: string; steelId: string; goldId: string }) {
  switch (hat) {
    case "mago":
      return (
        <g>
          <ellipse cx="64" cy="34" rx="36" ry="7" fill="#4c1d95" />
          <path d="M40 33 C46 22 52 10 60 2 C66 -4 78 -6 88 2 C80 2 74 6 72 12 C76 20 82 26 88 33 Z" fill="#6d28d9" />
          <path d="M41 31 C56 27 72 27 87 31 L88 34 C72 30 56 30 40 34 Z" fill="#fbbf24" />
          <path d="M58 15 l1.2 2.6 2.6 1.2 -2.6 1.2 -1.2 2.6 -1.2 -2.6 -2.6 -1.2 2.6 -1.2 z" fill="#fde68a" />
          <path d="M72 22 l.9 1.9 1.9 .9 -1.9 .9 -.9 1.9 -.9 -1.9 -1.9 -.9 1.9 -.9 z" fill="#fde68a" />
        </g>
      );
    case "coroa":
      return (
        <g>
          <path d="M42 31 L40 12 L50 20 L57 6 L64 18 L71 6 L78 20 L88 12 L86 31 Z" fill={`url(#${goldId})`} stroke="#a16207" strokeWidth="1" />
          <rect x="42" y="26" width="44" height="6" rx="1" fill="#eab308" stroke="#a16207" strokeWidth="0.8" />
          <circle cx="64" cy="29" r="2.5" fill="#dc2626" />
          <circle cx="52" cy="29" r="1.8" fill="#2563eb" />
          <circle cx="76" cy="29" r="1.8" fill="#16a34a" />
          {[
            [40, 12],
            [57, 6],
            [71, 6],
            [88, 12],
          ].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="2" fill="#fde047" />
          ))}
        </g>
      );
    case "bone":
      return (
        <g>
          <path d="M34 44 C34 24 48 16 64 16 C80 16 94 24 94 44 C84 40 74 38 64 38 C54 38 44 40 34 44 Z" fill={accent} />
          <path d="M30 44 C40 51 88 51 98 44 C90 39.5 38 39.5 30 44 Z" fill={shade(accent, -0.3)} />
          <path d="M64 17 L64 38" stroke={shade(accent, -0.25)} strokeWidth="1" opacity="0.6" />
          <circle cx="64" cy="17" r="2.5" fill={shade(accent, -0.2)} />
          <text x="64" y="33" textAnchor="middle" fontSize="8" fontWeight="bold" fontFamily="monospace" fill="#fff">
            {"</>"}
          </text>
        </g>
      );
    case "elmo":
      return (
        <g>
          <path d="M64 14 C60 2 70 -4 82 0 C73 2 70 8 68 14 Z" fill="#dc2626" />
          <path
            d="M32 66 C30 30 44 14 64 14 C84 14 98 30 96 66 L88 66 L88 47 C80 45 48 45 40 47 L40 66 Z"
            fill={`url(#${steelId})`}
            stroke="#475569"
            strokeWidth="1.2"
          />
          <path d="M40 47 C48 45 80 45 88 47 L88 51 C80 49 48 49 40 51 Z" fill="#94a3b8" />
          <rect x="61.5" y="46" width="5" height="20" rx="2" fill={`url(#${steelId})`} stroke="#475569" strokeWidth="0.8" />
          {[36, 92].map((x) => (
            <circle key={x} cx={x} cy="56" r="1.3" fill="#475569" />
          ))}
        </g>
      );
    case "pirata":
      return (
        <g>
          <path d="M44 34 C46 20 54 12 64 12 C74 12 82 20 84 34 Z" fill="#111827" />
          <path d="M24 40 C34 38 44 22 64 22 C84 22 94 38 104 40 C96 46 82 40 64 42 C46 40 32 46 24 40 Z" fill="#111827" />
          <path d="M24 40 C32 44 46 40 64 42 C82 40 96 44 104 40" stroke="#eab308" strokeWidth="1.5" fill="none" />
          <circle cx="64" cy="27" r="4" fill="#f8fafc" />
          <circle cx="62.5" cy="26.5" r="0.9" fill="#111827" />
          <circle cx="65.5" cy="26.5" r="0.9" fill="#111827" />
          <path d="M58 32 L70 36 M70 32 L58 36" stroke="#f8fafc" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      );
    case "fones":
      return (
        <g>
          <path d="M34 58 C33 24 95 24 94 58" stroke="#1f2937" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M37 50 C40 30 88 30 91 50" stroke="#475569" strokeWidth="1.5" fill="none" />
          <rect x="27" y="50" width="12" height="19" rx="5" fill="#111827" />
          <rect x="89" y="50" width="12" height="19" rx="5" fill="#111827" />
          <rect x="30" y="53" width="6" height="13" rx="3" fill={accent} />
          <rect x="92" y="53" width="6" height="13" rx="3" fill={accent} />
          <path d="M34 67 C37 80 47 84 56 82" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="57" cy="82" r="2.3" fill="#1f2937" />
        </g>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

export default function Avatar({
  config,
  ringColor,
  size = 96,
  framing = "full",
}: {
  config: AvatarConfig;
  ringColor?: string;
  size?: number;
  /** "face" dá zoom no rosto — usado nas miniaturas de óculos/expressão do editor. */
  framing?: "full" | "face";
}) {
  // ids únicos por avatar (vários na mesma tela); useId gera ":r1:", que não funciona dentro de url(#...)
  const uid = useId().replace(/:/g, "");
  const ids = { bg: `bg${uid}`, skin: `sk${uid}`, steel: `st${uid}`, gold: `gd${uid}` };

  const skin = SKIN_TONES[config.skinTone] ?? SKIN_TONES[3];
  const hair = config.hairColor;
  const browColor = config.hairStyle === "careca" ? shade(skin, -0.45) : shade(hair, -0.3);
  const bgBase = ringColor ?? "#6366f1";

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        boxShadow: ringColor ? `0 0 0 3px ${ringColor}` : undefined,
      }}
    >
      <svg viewBox={framing === "face" ? "30 30 68 68" : "0 0 128 128"} width="100%" height="100%">
        <defs>
          <radialGradient id={ids.bg} cx="50%" cy="40%" r="70%">
            <stop offset="0" stopColor={shade(bgBase, -0.45)} />
            <stop offset="1" stopColor="#0d0d14" />
          </radialGradient>
          <linearGradient id={ids.skin} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={shade(skin, 0.06)} />
            <stop offset="1" stopColor={shade(skin, -0.07)} />
          </linearGradient>
          <linearGradient id={ids.steel} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e2e8f0" />
            <stop offset="1" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id={ids.gold} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fde047" />
            <stop offset="1" stopColor="#ca8a04" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="128" height="128" fill={`url(#${ids.bg})`} />

        <HairBack style={config.hairStyle} color={hair} hat={config.hat} />

        {/* pescoço + roupa */}
        <rect x="55" y="80" width="18" height="20" fill={shade(skin, -0.14)} />
        <Outfit config={config} skin={skin} steelId={ids.steel} />

        {/* orelhas + rosto */}
        <ellipse cx="36" cy="61" rx="5" ry="7" fill={skin} />
        <ellipse cx="92" cy="61" rx="5" ry="7" fill={skin} />
        <ellipse cx="36.5" cy="61" rx="2.2" ry="4" fill={shade(skin, -0.15)} />
        <ellipse cx="91.5" cy="61" rx="2.2" ry="4" fill={shade(skin, -0.15)} />
        <path d="M36 56 C36 36 48 26 64 26 C80 26 92 36 92 56 C92 74 80 88 64 88 C48 88 36 74 36 56 Z" fill={`url(#${ids.skin})`} />

        {/* bochecha rosada leve (sempre) */}
        <g fill="#fb7185" opacity="0.16">
          <circle cx="46" cy="70" r="4.5" />
          <circle cx="82" cy="70" r="4.5" />
        </g>

        <FaceDetailLayer detail={config.faceDetail} skin={skin} hair={hair} />

        <Eye cx={52} color={config.eyeColor} />
        <Eye cx={76} color={config.eyeColor} />
        <path d={BROWS[config.expression]} stroke={browColor} strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M62 66 Q64 68.5 66 66" stroke={shade(skin, -0.28)} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <Mouth expression={config.expression} />

        <HairFront style={config.hairStyle} color={hair} hat={config.hat} />
        <EyewearLayer eyewear={config.eyewear} />
        <HatLayer hat={config.hat} accent={config.outfitColor} steelId={ids.steel} goldId={ids.gold} />
      </svg>
    </div>
  );
}
