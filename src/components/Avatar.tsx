import { useId } from "react";
import { AvatarConfig, Aura, HairStyle, Hat, PET_EMOJI, Pet, SKIN_TONES } from "@/engine/avatar";

// ============================================================================
// AVATAR — o personagem do aluno em SVG puro, montado em camadas:
// fundo → aura → cabelo de trás → roupa/pescoço → rosto → olhos/boca/detalhes →
// cabelo da frente → óculos → chapéu → mascote. Tudo num viewBox de 128x128.
// Aura, mascote e alguns óculos/chapéus são exclusivos da Loja.
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
const COVERING_HATS: Hat[] = ["mago", "bone", "elmo", "pirata", "cartola", "bruxa", "cabeca-abobora", "serpentes", "disco-ra", "gorro-noel", "gorro-elfo"];
/** Chapéus que escondem o cabelo da frente por inteiro. */
const FULL_HEAD_HATS: Hat[] = ["elmo", "elmo-espartano", "nemes"];
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
  if (FULL_HEAD_HATS.includes(hat)) return null; // elmos e o nemes cobrem a cabeça toda
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
    // --- fantasias de Halloween (exclusivas da Loja; ignoram a cor da roupa) ---
    case "vampiro":
      return (
        <g>
          <path d={body} fill="#18181b" />
          {/* gola alta da capa, forrada de vermelho */}
          <path d="M40 101 L28 74 L56 94 Z" fill="#18181b" stroke="#991b1b" strokeWidth="1.2" />
          <path d="M88 101 L100 74 L72 94 Z" fill="#18181b" stroke="#991b1b" strokeWidth="1.2" />
          <path d="M40 99 L32 80 L53 94 Z" fill="#991b1b" />
          <path d="M88 99 L96 80 L75 94 Z" fill="#991b1b" />
          <path d="M55 96 L64 114 L73 96 Z" fill="#f8fafc" />
          <path d="M59 96 L64 102 L69 96" fill="#18181b" />
          <circle cx="64" cy="107" r="3.2" fill="#dc2626" stroke="#fbbf24" strokeWidth="1.2" />
          <path d="M26 128 C30 114 38 108 44 106 M102 128 C98 114 90 108 84 106" stroke="#991b1b" strokeWidth="1.5" fill="none" opacity="0.7" />
        </g>
      );
    case "esqueleto":
      return (
        <g>
          <path d={body} fill="#111827" />
          <path d="M44 101 C52 98 58 99 64 101 C70 99 76 98 84 101" stroke="#e5e7eb" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M64 100 L64 127" stroke="#e5e7eb" strokeWidth="3" strokeLinecap="round" />
          {[106, 112, 118, 124].map((y) => (
            <path
              key={y}
              d={`M${48 + (y - 106) / 3} ${y} C54 ${y + 3} 60 ${y + 3} 64 ${y + 1} M${80 - (y - 106) / 3} ${y} C74 ${y + 3} 68 ${y + 3} 64 ${y + 1}`}
              stroke="#e5e7eb"
              strokeWidth="2.2"
              fill="none"
              strokeLinecap="round"
            />
          ))}
        </g>
      );
    case "abobora":
      return (
        <g>
          <path d={body} fill="#f97316" />
          <path d="M42 102 C37 112 37 121 39 128 M86 102 C91 112 91 121 89 128 M54 99 C51 110 51 120 52 128 M74 99 C77 110 77 120 76 128" stroke="#c2410c" strokeWidth="2" fill="none" />
          {/* carinha de Jack-o'-Lantern na barriga */}
          <path d="M55 108 L59 114 L51 114 Z M73 108 L77 114 L69 114 Z" fill="#fde047" stroke="#431407" strokeWidth="1" />
          <path d="M52 119 L56 122 L60 119 L64 122 L68 119 L72 122 L76 119 L72 126 L56 126 Z" fill="#fde047" stroke="#431407" strokeWidth="1" />
          <path d="M48 97 C54 91 59 96 64 93 C69 96 74 91 80 97 L75 101 L64 97 L53 101 Z" fill="#16a34a" />
        </g>
      );
    // --- Mitologia Grega ---
    case "toga":
      return (
        <g>
          <path d={body} fill="#f5f5f4" />
          <path d="M55 96 L64 108 L73 96 Z" fill={shade(skin, -0.08)} />
          {/* faixa dourada caindo do ombro esquerdo pro quadril direito */}
          <path d="M30 104 C44 98 52 100 60 108 C70 118 82 122 96 128 L84 128 C72 124 62 118 54 112 C46 106 40 106 34 110 Z" fill="#eab308" />
          <path d="M34 108 C46 102 54 106 62 114 C72 122 84 125 94 128" stroke="#a16207" strokeWidth="0.8" fill="none" />
          <path d="M40 112 C44 118 44 124 42 128 M86 108 C88 116 90 122 92 128" stroke="#d6d3d1" strokeWidth="1.4" fill="none" />
          <circle cx="36" cy="105" r="3.6" fill="#fde047" stroke="#a16207" strokeWidth="1" />
        </g>
      );
    case "hoplita":
      return (
        <g>
          <path d="M14 128 C16 104 30 97 42 97 L86 97 C98 97 112 104 114 128 Z" fill="#b91c1c" />
          <path d="M26 128 C26 108 40 98 64 98 C88 98 102 108 102 128 Z" fill={`url(#${steelId})`} opacity="0.35" />
          <path d="M28 128 C28 108 41 99 64 99 C87 99 100 108 100 128 Z" fill="#b45309" />
          <path d="M44 106 C50 111 57 111 62 106 M66 106 C71 111 78 111 84 106" stroke="#78350f" strokeWidth="1.6" fill="none" />
          <path d="M64 108 L64 126 M52 116 L76 116 M54 122 L74 122" stroke="#78350f" strokeWidth="1.2" />
          <path d="M40 102 C46 99 52 99 56 100 M72 100 C76 99 82 99 88 102" stroke="#fbbf24" strokeWidth="1.8" fill="none" />
          <circle cx="44" cy="104" r="2" fill="#fbbf24" />
          <circle cx="84" cy="104" r="2" fill="#fbbf24" />
        </g>
      );
    case "zeus":
      return (
        <g>
          <path d={body} fill="#f8fafc" />
          <path d="M20 128 C20 110 28 101 40 98 L58 128 Z" fill="#1d4ed8" />
          <path d="M40 98 L58 128" stroke="#fbbf24" strokeWidth="2" />
          <path d="M55 96 L64 106 L73 96 Z" fill={shade(skin, -0.08)} />
          {/* raio dourado no peito */}
          <path d="M70 102 L61 114 L67 114 L62 126 L76 110 L69 110 L74 102 Z" fill="#facc15" stroke="#a16207" strokeWidth="1" strokeLinejoin="round" />
        </g>
      );
    // --- Mitologia Egípcia ---
    case "farao":
      return (
        <g>
          <path d={body} fill="#f5f5f4" />
          {/* colar largo (usekh) em faixas azul, dourado e turquesa */}
          <path d="M36 100 C44 118 84 118 92 100" stroke="#1d4ed8" strokeWidth="4" fill="none" />
          <path d="M40 99 C47 113 81 113 88 99" stroke="#eab308" strokeWidth="3.5" fill="none" />
          <path d="M44 98 C50 108 78 108 84 98" stroke="#0d9488" strokeWidth="3" fill="none" />
          <path d="M48 97 C53 103 75 103 80 97" stroke="#eab308" strokeWidth="2.5" fill="none" />
          <ellipse cx="64" cy="118" rx="4.5" ry="5.5" fill="#1d4ed8" stroke="#eab308" strokeWidth="1.5" />
          <rect x="30" y="124" width="68" height="4" fill="#eab308" />
        </g>
      );
    case "mumia":
      return (
        <g>
          <path d={body} fill="#e7e5e4" />
          {[102, 108, 114, 120, 126].map((y, i) => (
            <path
              key={y}
              d={`M22 ${y + (i % 2 ? 4 : -2)} C44 ${y + (i % 2 ? -3 : 5)} 84 ${y + (i % 2 ? 6 : -4)} 106 ${y + (i % 2 ? -1 : 4)}`}
              stroke="#a8a29e"
              strokeWidth="1.6"
              fill="none"
            />
          ))}
          <path d="M84 110 C90 116 88 124 94 128" stroke="#d6d3d1" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M84 110 C90 116 88 124 94 128" stroke="#a8a29e" strokeWidth="0.8" fill="none" />
          <path d="M55 96 C58 100 70 100 73 96" stroke="#a8a29e" strokeWidth="1.4" fill="none" />
        </g>
      );
    case "cleopatra":
      return (
        <g>
          <path d={body} fill="#0d9488" />
          <path d="M34 101 C44 120 84 120 94 101" stroke="#eab308" strokeWidth="4.5" fill="none" />
          <path d="M39 100 C47 114 81 114 89 100" stroke="#dc2626" strokeWidth="2" fill="none" />
          <path d="M43 99 C50 110 78 110 85 99" stroke="#eab308" strokeWidth="3" fill="none" />
          <path d="M60 116 L68 116 L67 128 L61 128 Z" fill="#eab308" />
          <circle cx="64" cy="112" r="3" fill="#dc2626" stroke="#fde047" strokeWidth="1" />
        </g>
      );
    // --- Natal ---
    case "papai-noel":
      return (
        <g>
          <path d={body} fill="#dc2626" />
          <path d="M40 98 C48 106 80 106 88 98 C88 104 80 110 64 110 C48 110 40 104 40 98 Z" fill="#f8fafc" />
          <rect x="59" y="108" width="10" height="20" fill="#f8fafc" />
          <rect x="22" y="117" width="84" height="7" fill="#18181b" />
          <rect x="57" y="115.5" width="14" height="10" rx="1.5" fill="none" stroke="#fbbf24" strokeWidth="2.2" />
          <path d="M24 128 C26 122 28 120 30 119 M104 128 C102 122 100 120 98 119" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "sueter":
      return (
        <g>
          <path d={body} fill="#b91c1c" />
          <path d="M44 98 C50 104 78 104 84 98" stroke="#7f1d1d" strokeWidth="4" fill="none" />
          <rect x="22" y="108" width="84" height="8" fill="#15803d" />
          <path d="M22 116 L28 108 L34 116 L40 108 L46 116 L52 108 L58 116 L64 108 L70 116 L76 108 L82 116 L88 108 L94 116 L100 108 L106 116" stroke="#f8fafc" strokeWidth="1.4" fill="none" />
          {[32, 48, 64, 80, 96].map((x) => (
            <circle key={x} cx={x} cy="122" r="1.8" fill="#f8fafc" />
          ))}
        </g>
      );
    case "elfo":
      return (
        <g>
          <path d={body} fill="#16a34a" />
          <path d="M38 98 L44 106 L50 99 L56 107 L64 100 L72 107 L78 99 L84 106 L90 98 C84 96 72 95 64 95 C56 95 44 96 38 98 Z" fill="#dc2626" />
          {[44, 56, 72, 84].map((x, i) => (
            <circle key={x} cx={x} cy={i % 3 === 0 ? 106.5 : 107.5} r="2" fill="#fbbf24" stroke="#a16207" strokeWidth="0.6" />
          ))}
          <rect x="22" y="118" width="84" height="6" fill="#78350f" />
          <rect x="59" y="117" width="10" height="8" rx="1" fill="none" stroke="#fbbf24" strokeWidth="1.8" />
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
    // --- exclusivos da Loja ---
    case "neon":
      return (
        <g>
          <rect x="42" y="53" width="19" height="13" rx="6" fill="none" stroke="#e879f9" strokeWidth="5" opacity="0.3" />
          <rect x="67" y="53" width="19" height="13" rx="6" fill="none" stroke="#22d3ee" strokeWidth="5" opacity="0.3" />
          <rect x="42" y="53" width="19" height="13" rx="6" fill="#f0abfc" fillOpacity="0.22" stroke="#e879f9" strokeWidth="2.2" />
          <rect x="67" y="53" width="19" height="13" rx="6" fill="#a5f3fc" fillOpacity="0.22" stroke="#22d3ee" strokeWidth="2.2" />
          <path d="M61 59 L67 59" stroke="#c4b5fd" strokeWidth="2" />
          <path d="M42 58 L36 56 M86 58 L92 56" stroke="#c4b5fd" strokeWidth="1.8" />
        </g>
      );
    case "coracao":
      return (
        <g stroke="#9f1239" strokeWidth="1.4">
          {[52, 76].map((cx) => (
            <path
              key={cx}
              d={`M${cx} 68 C${cx - 8} 62 ${cx - 10} 57.5 ${cx - 8} 54.5 C${cx - 6} 51.5 ${cx - 2} 52 ${cx} 55 C${cx + 2} 52 ${cx + 6} 51.5 ${cx + 8} 54.5 C${cx + 10} 57.5 ${cx + 8} 62 ${cx} 68 Z`}
              fill="#e11d48"
              fillOpacity="0.88"
            />
          ))}
          <path d="M60 57 Q64 55 68 57 M44 56 L37 54 M84 56 L91 54" fill="none" strokeWidth="1.8" />
          <path d="M47 56 L49 55 M71 56 L73 55" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
        </g>
      );
    case "pixel":
      return (
        <g fill="#0b0b0f">
          <rect x="38" y="53" width="52" height="3.5" />
          <rect x="42" y="56.5" width="19" height="5" />
          <rect x="45" y="61.5" width="13" height="3.5" />
          <rect x="67" y="56.5" width="19" height="5" />
          <rect x="70" y="61.5" width="13" height="3.5" />
          <rect x="44" y="57.5" width="3" height="2" fill="#fff" />
          <rect x="47" y="59.5" width="2" height="2" fill="#fff" />
          <rect x="69" y="57.5" width="3" height="2" fill="#fff" />
          <rect x="72" y="59.5" width="2" height="2" fill="#fff" />
        </g>
      );
    // --- Halloween ---
    case "oculos-abobora":
      return (
        <g stroke="#c2410c" strokeWidth="2.4" strokeLinejoin="round">
          <path d="M43 66 L52 52 L61 66 Z" fill="#fde047" fillOpacity="0.55" />
          <path d="M67 66 L76 52 L85 66 Z" fill="#fde047" fillOpacity="0.55" />
          <path d="M61 62 Q64 59 67 62 M43 62 L37 59 M85 62 L91 59" fill="none" />
        </g>
      );
    case "vampiro":
      return (
        <g>
          <circle cx="52" cy="60" r="7.5" fill="#dc2626" fillOpacity="0.8" stroke="#18181b" strokeWidth="2" />
          <circle cx="76" cy="60" r="7.5" fill="#dc2626" fillOpacity="0.8" stroke="#18181b" strokeWidth="2" />
          <path d="M59.5 59 Q64 56 68.5 59 M44.5 59 L37 56 M83.5 59 L91 56" stroke="#18181b" strokeWidth="2" fill="none" />
          <path d="M48 57 L51 55 M72 57 L75 55" stroke="#fecaca" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      );
    case "teia":
      return (
        <g>
          {[52, 76].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="60" r="8" fill="rgba(255,255,255,0.08)" stroke="#d4d4d8" strokeWidth="1.8" />
              <path
                d={`M${cx - 8} 60 L${cx + 8} 60 M${cx} 52 L${cx} 68 M${cx - 5.6} 54.4 L${cx + 5.6} 65.6 M${cx + 5.6} 54.4 L${cx - 5.6} 65.6`}
                stroke="#e4e4e7"
                strokeWidth="0.7"
                opacity="0.85"
              />
              <circle cx={cx} cy="60" r="4" fill="none" stroke="#e4e4e7" strokeWidth="0.7" opacity="0.85" />
            </g>
          ))}
          <path d="M60 59 Q64 56 68 59 M44 59 L37 56 M84 59 L91 56" stroke="#d4d4d8" strokeWidth="1.8" fill="none" />
          {/* aranhinha pendurada na haste */}
          <path d="M89 57 L89 70" stroke="#d4d4d8" strokeWidth="0.6" />
          <circle cx="89" cy="72" r="2.2" fill="#18181b" />
          <path d="M86 70 L84 68 M86 72 L83.5 72 M92 70 L94 68 M92 72 L94.5 72" stroke="#18181b" strokeWidth="0.8" />
        </g>
      );
    // --- Mitologia Grega ---
    case "olhar-medusa":
      // olhos verdes brilhando com pupila de cobra
      return (
        <g>
          {[52, 76].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="60" r="8.5" fill="#22c55e" opacity="0.3" />
              <ellipse cx={cx} cy="60.5" rx="5.5" ry="6" fill="#4ade80" stroke="#15803d" strokeWidth="1" />
              <ellipse cx={cx} cy="60.5" rx="1.1" ry="4.6" fill="#052e16" />
              <circle cx={cx + 1.8} cy="58" r="1" fill="#f0fdf4" />
            </g>
          ))}
        </g>
      );
    case "oraculo":
      // venda dourada com o olho que tudo vê
      return (
        <g>
          <path d="M34 54 C50 51 78 51 94 54 L93 66 C78 68.5 50 68.5 35 66 Z" fill="#eab308" stroke="#a16207" strokeWidth="1.2" />
          <path d="M36 57 C50 55 78 55 92 57" stroke="#fde68a" strokeWidth="1" fill="none" opacity="0.7" />
          <path d="M56 60 C60 55 68 55 72 60 C68 65 60 65 56 60 Z" fill="#fef9c3" stroke="#78350f" strokeWidth="1" />
          <circle cx="64" cy="60" r="2.4" fill="#1e3a8a" />
          <path d="M35 60 L27 66 M35 63 L29 71" stroke="#eab308" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    // --- Mitologia Egípcia ---
    case "horus":
      // delineado de kohl no estilo do Olho de Hórus
      return (
        <g stroke="#0f172a" fill="none" strokeLinecap="round">
          <path d="M45 57 C49 53 56 53 59 56 L61 57 M45 57 L38 58" strokeWidth="2.2" />
          <path d="M83 57 C79 53 72 53 69 56 L67 57 M83 57 L90 58" strokeWidth="2.2" />
          <path d="M47 64 C47 68 44 71 42 70 C40 69 41 66 43 67" strokeWidth="1.6" />
          <path d="M81 64 C81 68 84 71 86 70 C88 69 87 66 85 67" strokeWidth="1.6" />
          <path d="M46 51 C50 49 56 49 60 51 M82 51 C78 49 72 49 68 51" stroke="#1d4ed8" strokeWidth="1.6" />
        </g>
      );
    case "oculos-farao":
      return (
        <g>
          <ellipse cx="52" cy="60" rx="8.5" ry="6.5" fill="#2dd4bf" fillOpacity="0.5" stroke="#eab308" strokeWidth="2.2" />
          <ellipse cx="76" cy="60" rx="8.5" ry="6.5" fill="#2dd4bf" fillOpacity="0.5" stroke="#eab308" strokeWidth="2.2" />
          <path d="M60.5 59 Q64 56.5 67.5 59 M43.5 59 L37 57 M84.5 59 L91 57" stroke="#eab308" strokeWidth="2" fill="none" />
          <path d="M47 58 L50 56 M71 58 L74 56" stroke="#f0fdfa" strokeWidth="1.3" strokeLinecap="round" />
          <ellipse cx="64" cy="55.5" rx="2" ry="1.5" fill="#1d4ed8" stroke="#eab308" strokeWidth="0.8" />
        </g>
      );
    // --- Natal ---
    case "oculos-noel":
      // óculos pequenos de meia-lua, na ponta do nariz, como os do Papai Noel
      return (
        <g stroke="#ca8a04" strokeWidth="1.6" fill="rgba(255,255,255,0.12)">
          <path d="M45 63 C45 68 59 68 59 63 Z" />
          <path d="M69 63 C69 68 83 68 83 63 Z" />
          <path d="M59 63.5 Q64 61 69 63.5 M45 63 L37 58 M83 63 L91 58" fill="none" />
        </g>
      );
    case "flocos":
      return (
        <g>
          {[52, 76].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="60" r="8" fill="#bfdbfe" fillOpacity="0.4" stroke="#e0f2fe" strokeWidth="1.8" />
              <g stroke="#fff" strokeWidth="1" strokeLinecap="round">
                {[0, 60, 120].map((a) => (
                  <line key={a} x1={cx - 5.5} y1="60" x2={cx + 5.5} y2="60" transform={`rotate(${a} ${cx} 60)`} />
                ))}
                <circle cx={cx} cy="60" r="1.2" fill="#fff" />
              </g>
            </g>
          ))}
          <path d="M60 59 Q64 56 68 59 M44 59 L37 56 M84 59 L91 56" stroke="#e0f2fe" strokeWidth="1.8" fill="none" />
        </g>
      );
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Aura e mascote (só da Loja)
// ---------------------------------------------------------------------------

const AURA_COLORS: Record<Exclude<Aura, "nenhum">, [string, string]> = {
  fogo: ["#fb923c", "#dc2626"],
  arcana: ["#c084fc", "#6366f1"],
  gelo: ["#a5f3fc", "#3b82f6"],
  estrelas: ["#fde68a", "#818cf8"],
  assombrada: ["#bbf7d0", "#15803d"],
  "lua-sangrenta": ["#fca5a5", "#7f1d1d"],
  morcegos: ["#c4b5fd", "#3b0764"],
  abobora: ["#fdba74", "#c2410c"],
  raios: ["#e0f2fe", "#1e3a8a"],
  poseidon: ["#67e8f9", "#0c4a6e"],
  olimpo: ["#fef3c7", "#b45309"],
  ra: ["#fef08a", "#c2410c"],
  areia: ["#fde68a", "#92400e"],
  hieroglifos: ["#fcd34d", "#1e3a8a"],
  neve: ["#e0f2fe", "#1e3a8a"],
  luzes: ["#fde68a", "#14532d"],
  aurora: ["#86efac", "#312e81"],
};

/** Floco de neve (aura Nevasca), centrado em (x, y), com raio `r`. */
function Snowflake({ x, y, r = 4 }: { x: number; y: number; r?: number }) {
  return (
    <g stroke="#fff" strokeWidth={r / 3.5} strokeLinecap="round" opacity="0.9">
      {[0, 60, 120].map((a) => (
        <line key={a} x1={x - r} y1={y} x2={x + r} y2={y} transform={`rotate(${a} ${x} ${y})`} />
      ))}
    </g>
  );
}

/** Raio em zigue-zague (aura Raios de Zeus), a partir de (x, y), no tamanho `s`. */
function Bolt({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 0 L-5 10 L-1 10 L-4 20 L5 7 L1 7 L4 0 Z"
      fill="#fde047"
      stroke="#fef9c3"
      strokeWidth="0.6"
      strokeLinejoin="round"
    />
  );
}

/** Nuvem de tempestade (aura Raios de Zeus), centrada em (x, y). */
function StormCloud({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#94a3b8" opacity="0.95">
      <circle cx="-7" cy="1" r="5" />
      <circle cx="0" cy="-2" r="7" />
      <circle cx="8" cy="1" r="5" />
      <rect x="-12" y="1" width="25" height="5" rx="2.5" />
    </g>
  );
}

/** Ankh, a cruz egípcia da vida (aura dos hieróglifos), centrada em (x, y). */
function Ankh({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#fcd34d" strokeWidth="2" fill="none" strokeLinecap="round">
      <ellipse cx="0" cy="-5" rx="3" ry="4" />
      <path d="M-6 0 L6 0 M0 -1 L0 11" />
    </g>
  );
}

/** Olho de Hórus pequeno (aura dos hieróglifos), centrado em (x, y). */
function EyeGlyph({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#fcd34d" strokeWidth="1.4" fill="none" strokeLinecap="round">
      <path d="M-7 0 C-3 -5 3 -5 7 0 C3 4 -3 4 -7 0 Z" />
      <circle cx="0" cy="0" r="1.8" fill="#fcd34d" />
      <path d="M-2 3 L-3 8 M1 3 C2 6 5 7 6 5" />
    </g>
  );
}

/** Morceguinho em silhueta, centrado em (x, y), no tamanho `s` (1 = ~14px de envergadura). */
function Bat({ x, y, s = 1, fill = "#0b0b0f" }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 0 C-2 -3 -5 -4 -8 -2 C-6 -1 -5.5 0.5 -6 2 C-4 1 -2.5 1.3 -1.5 2.5 C-0.8 1.6 0.8 1.6 1.5 2.5 C2.5 1.3 4 1 6 2 C5.5 0.5 6 -1 8 -2 C5 -4 2 -3 0 0 Z"
      fill={fill}
    />
  );
}

/** Fantasminha (aura assombrada), centrado em (x, y). */
function Ghost({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity="0.85">
      <path d="M0 -7 C-5 -7 -6 -2 -6 3 L-6 8 L-3 6 L0 8 L3 6 L6 8 L6 3 C6 -2 5 -7 0 -7 Z" fill="#f0fdf4" />
      <circle cx="-2" cy="-1" r="1.1" fill="#14532d" />
      <circle cx="2" cy="-1" r="1.1" fill="#14532d" />
    </g>
  );
}

/** Aboborinha (aura de abóboras), centrada em (x, y). */
function MiniPumpkin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 -6 L1 -9" stroke="#15803d" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="0" cy="0" rx="7" ry="5.5" fill="#f97316" />
      <path d="M-3 -5 C-4.5 -2 -4.5 2 -3 5 M3 -5 C4.5 -2 4.5 2 3 5" stroke="#c2410c" strokeWidth="0.8" fill="none" />
      <path d="M-3.5 -1.5 L-2 0.5 L-5 0.5 Z M3.5 -1.5 L5 0.5 L2 0.5 Z M-3 2.5 L3 2.5 L0 4 Z" fill="#fde047" />
    </g>
  );
}

/** Brilho atrás do personagem, desenhado logo depois do fundo. */
function AuraLayer({ aura, gradientId }: { aura: Aura; gradientId: string }) {
  if (aura === "nenhum") return null;
  const [inner, outer] = AURA_COLORS[aura];
  return (
    <g>
      <defs>
        {/* forte no meio do caminho até a borda — é essa faixa que aparece em volta do personagem */}
        <radialGradient id={gradientId} cx="50%" cy="46%" r="50%">
          <stop offset="0.3" stopColor={inner} stopOpacity="0.95" />
          <stop offset="0.72" stopColor={outer} stopOpacity="0.7" />
          <stop offset="1" stopColor={outer} stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <circle cx="64" cy="60" r="72" fill={`url(#${gradientId})`} />
      {aura === "neve" && (
        <g>
          {[
            [18, 22, 4],
            [36, 10, 3],
            [102, 14, 4.5],
            [112, 44, 3],
            [14, 56, 3.5],
            [108, 78, 4],
            [22, 90, 3],
            [90, 6, 2.5],
            [8, 38, 2.5],
            [120, 100, 2.5],
          ].map(([x, y, r]) => (
            <Snowflake key={`${x}-${y}`} x={x} y={y} r={r} />
          ))}
        </g>
      )}
      {aura === "luzes" && (
        <g>
          {/* fio com lâmpadas coloridas contornando o personagem */}
          <path d="M-2 40 C18 52 30 26 44 20 C54 14 74 14 84 20 C98 26 110 52 130 40" stroke="#14532d" strokeWidth="1.4" fill="none" />
          <path d="M4 92 C14 80 20 70 16 58 M124 92 C114 80 108 70 112 58" stroke="#14532d" strokeWidth="1.4" fill="none" />
          {[
            [8, 45, "#ef4444"],
            [22, 43, "#fbbf24"],
            [34, 31, "#22c55e"],
            [48, 19, "#3b82f6"],
            [64, 16, "#ef4444"],
            [80, 19, "#fbbf24"],
            [94, 31, "#22c55e"],
            [106, 43, "#3b82f6"],
            [120, 45, "#ef4444"],
            [16, 64, "#fbbf24"],
            [12, 80, "#3b82f6"],
            [112, 64, "#22c55e"],
            [116, 80, "#ef4444"],
          ].map(([x, y, color]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="5.5" fill={color as string} opacity="0.35" />
              <ellipse cx={x} cy={Number(y) + 1.5} rx="2" ry="3" fill={color as string} />
              <rect x={Number(x) - 1.3} y={Number(y) - 2.5} width="2.6" height="2" fill="#475569" />
            </g>
          ))}
        </g>
      )}
      {aura === "aurora" && (
        <g fill="none" strokeLinecap="round">
          <path d="M-6 26 C14 6 34 36 56 18 C78 0 98 30 134 10" stroke="#4ade80" strokeWidth="9" opacity="0.5" />
          <path d="M-6 38 C18 20 38 48 60 30 C82 12 104 42 134 24" stroke="#22d3ee" strokeWidth="6" opacity="0.45" />
          <path d="M-6 48 C20 34 40 58 64 42 C88 26 108 52 134 38" stroke="#a78bfa" strokeWidth="5" opacity="0.4" />
          {[
            [16, 70],
            [110, 66],
            [24, 96],
            [104, 94],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="#fff" stroke="none" />
          ))}
        </g>
      )}
      {aura === "raios" && (
        <g>
          <StormCloud x={24} y={20} s={1.1} />
          <StormCloud x={104} y={16} s={1} />
          <Bolt x={22} y={30} s={1.3} />
          <Bolt x={106} y={25} s={1.2} />
          <Bolt x={14} y={70} s={0.9} />
          <Bolt x={112} y={66} s={1} />
        </g>
      )}
      {aura === "poseidon" && (
        <g fill="none" strokeLinecap="round">
          {[
            [4, 96],
            [92, 100],
            [8, 72],
            [96, 76],
          ].map(([x, y]) => (
            <path
              key={`${x}-${y}`}
              d={`M${x} ${y} C${x + 5} ${y - 7} ${x + 11} ${y - 7} ${x + 14} ${y - 2} C${x + 11} ${y - 4} ${x + 8} ${y - 2} ${x + 9} ${y + 1} M${x + 14} ${y - 2} C${x + 18} ${y + 3} ${x + 24} ${y + 3} ${x + 28} ${y - 2}`}
              stroke="#e0f2fe"
              strokeWidth="2.2"
            />
          ))}
          {[
            [26, 40, 2.4],
            [102, 44, 2],
            [20, 54, 1.6],
            [108, 30, 1.6],
            [34, 20, 1.4],
          ].map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} stroke="#a5f3fc" strokeWidth="1" />
          ))}
        </g>
      )}
      {aura === "olimpo" && (
        <g stroke="#fde68a" strokeLinecap="round" opacity="0.75">
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <line key={i} x1={64 + Math.cos(a) * 44} y1={58 + Math.sin(a) * 44} x2={64 + Math.cos(a) * 66} y2={58 + Math.sin(a) * 66} strokeWidth={i % 2 ? 2 : 3.5} />;
          })}
        </g>
      )}
      {aura === "ra" && (
        <g>
          <circle cx="64" cy="50" r="40" fill="#f59e0b" opacity="0.45" />
          <g stroke="#fde047" strokeLinecap="round" opacity="0.8">
            {Array.from({ length: 20 }, (_, i) => {
              const a = (i / 20) * Math.PI * 2;
              return <line key={i} x1={64 + Math.cos(a) * 42} y1={50 + Math.sin(a) * 42} x2={64 + Math.cos(a) * (i % 2 ? 54 : 62)} y2={50 + Math.sin(a) * (i % 2 ? 54 : 62)} strokeWidth="2.5" />;
            })}
          </g>
        </g>
      )}
      {aura === "areia" && (
        <g>
          <path d="M-4 112 L18 82 L40 112 Z" fill="#b45309" opacity="0.85" />
          <path d="M18 82 L40 112 L26 112 Z" fill="#78350f" opacity="0.6" />
          <path d="M92 112 L112 86 L132 112 Z" fill="#b45309" opacity="0.85" />
          <path d="M112 86 L132 112 L120 112 Z" fill="#78350f" opacity="0.6" />
          <g stroke="#fef3c7" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7">
            <path d="M8 40 C20 34 30 38 36 32" />
            <path d="M92 30 C100 24 112 28 120 22" />
            <path d="M6 60 C14 56 22 60 28 55" />
            <path d="M100 58 C108 54 116 58 124 52" />
          </g>
        </g>
      )}
      {aura === "hieroglifos" && (
        <g>
          <Ankh x={20} y={40} s={1.1} />
          <EyeGlyph x={106} y={34} s={1.1} />
          <Ankh x={108} y={78} s={0.9} />
          <EyeGlyph x={20} y={84} s={0.9} />
          <path d="M34 16 l3 -3 l3 3 l3 -3 l3 3" stroke="#fcd34d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M84 12 l3 -3 l3 3 l3 -3 l3 3" stroke="#fcd34d" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </g>
      )}
      {aura === "assombrada" && (
        <g>
          <Ghost x={20} y={46} s={1.1} />
          <Ghost x={108} y={38} s={0.9} />
          <Ghost x={24} y={92} s={0.8} />
          <Ghost x={104} y={86} s={1} />
          <Ghost x={40} y={14} s={0.7} />
        </g>
      )}
      {aura === "lua-sangrenta" && (
        <g>
          <circle cx="98" cy="24" r="17" fill="#dc2626" opacity="0.9" />
          <circle cx="92" cy="20" r="3" fill="#b91c1c" opacity="0.6" />
          <circle cx="103" cy="30" r="2.2" fill="#b91c1c" opacity="0.6" />
          <Bat x={22} y={30} s={1.3} />
          <Bat x={34} y={16} s={0.9} />
          <Bat x={110} y={60} s={1} />
        </g>
      )}
      {aura === "morcegos" && (
        <g>
          <Bat x={18} y={40} s={1.4} />
          <Bat x={32} y={18} s={1} />
          <Bat x={96} y={14} s={1.2} />
          <Bat x={112} y={44} s={1.1} />
          <Bat x={20} y={80} s={0.9} />
          <Bat x={108} y={82} s={1.3} />
        </g>
      )}
      {aura === "abobora" && (
        <g>
          <MiniPumpkin x={18} y={44} s={1.2} />
          <MiniPumpkin x={110} y={40} s={1} />
          <MiniPumpkin x={22} y={90} s={0.9} />
          <MiniPumpkin x={106} y={88} s={1.2} />
          <MiniPumpkin x={34} y={14} s={0.8} />
          <MiniPumpkin x={94} y={12} s={0.8} />
        </g>
      )}
      {aura === "fogo" && (
        <g fill="#f97316" opacity="0.85">
          <path d="M26 92 C18 70 30 60 26 42 C36 54 38 46 40 36 C48 52 40 66 44 80 Z" />
          <path d="M102 92 C110 70 98 60 102 42 C92 54 90 46 88 36 C80 52 88 66 84 80 Z" />
          <path d="M50 22 C48 12 56 8 56 0 C62 8 60 14 64 18 C66 10 72 8 72 2 C78 12 76 20 78 24 Z" fill="#fbbf24" opacity="0.7" />
        </g>
      )}
      {aura === "gelo" && (
        <g fill="#e0f2fe" opacity="0.85">
          <path d="M22 60 L30 50 L34 62 Z" />
          <path d="M104 58 L96 48 L94 62 Z" />
          <path d="M30 30 L38 24 L38 36 Z" />
          <path d="M98 30 L90 24 L90 36 Z" />
          <path d="M64 2 L69 12 L59 12 Z" />
        </g>
      )}
      {(aura === "estrelas" || aura === "arcana") &&
        [
          [22, 40, 2.2],
          [104, 34, 2],
          [30, 18, 1.6],
          [98, 70, 1.8],
          [18, 76, 1.4],
          [110, 90, 1.4],
          [42, 8, 1.3],
          [88, 10, 1.6],
        ].map(([x, y, r]) =>
          aura === "estrelas" ? (
            <path
              key={`${x}-${y}`}
              d={`M${x} ${y - r * 2} L${x + r * 0.6} ${y - r * 0.6} L${x + r * 2} ${y} L${x + r * 0.6} ${y + r * 0.6} L${x} ${y + r * 2} L${x - r * 0.6} ${y + r * 0.6} L${x - r * 2} ${y} L${x - r * 0.6} ${y - r * 0.6} Z`}
              fill="#fef9c3"
            />
          ) : (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#f5d0fe" opacity="0.9" />
          ),
        )}
    </g>
  );
}

/** Mascote no ombro do personagem (emoji), desenhado por último. */
function PetLayer({ pet }: { pet: Pet }) {
  if (pet === "nenhum") return null;
  return (
    <g>
      <circle cx="97" cy="99" r="14" fill="#000" opacity="0.25" />
      <text x="97" y="107" fontSize="23" textAnchor="middle">
        {PET_EMOJI[pet]}
      </text>
    </g>
  );
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
    // --- exclusivos da Loja ---
    case "aureola":
      return (
        <g>
          <ellipse cx="64" cy="11" rx="25" ry="8" fill="#fde047" opacity="0.18" />
          <ellipse cx="64" cy="11" rx="20" ry="5" fill="none" stroke="#facc15" strokeWidth="3.6" />
          <ellipse cx="64" cy="10.4" rx="20" ry="5" fill="none" stroke="#fef9c3" strokeWidth="1.1" />
        </g>
      );
    case "chifres":
      return (
        <g stroke="#7f1d1d" strokeWidth="1">
          <path d="M45 32 C37 24 34 13 39 3 C41 14 48 21 54 25 Z" fill="#dc2626" />
          <path d="M83 32 C91 24 94 13 89 3 C87 14 80 21 74 25 Z" fill="#dc2626" />
          <path d="M41 9 C42 15 45 19 49 22" stroke="#fca5a5" strokeWidth="1.2" fill="none" opacity="0.7" />
          <path d="M87 9 C86 15 83 19 79 22" stroke="#fca5a5" strokeWidth="1.2" fill="none" opacity="0.7" />
        </g>
      );
    case "tiara":
      return (
        <g>
          <path d="M43 31 C52 24 76 24 85 31 L83 33.5 C75 28 53 28 45 33.5 Z" fill={`url(#${steelId})`} stroke="#64748b" strokeWidth="0.8" />
          <path d="M64 11 l2.4 5.6 6 .4 -4.6 3.8 1.6 5.8 -5.4 -3.3 -5.4 3.3 1.6 -5.8 -4.6 -3.8 6 -.4 z" fill="#a78bfa" stroke="#ede9fe" strokeWidth="0.8" />
          <circle cx="52" cy="27.5" r="1.8" fill="#f0abfc" />
          <circle cx="76" cy="27.5" r="1.8" fill="#f0abfc" />
        </g>
      );
    case "cartola":
      return (
        <g>
          <ellipse cx="64" cy="33" rx="32" ry="6" fill="#111827" />
          <path d="M46 33 L48 3 C58 0 70 0 80 3 L82 33 Z" fill="#1f2937" />
          <path d="M47.3 23 L80.7 23 L81.3 30.5 L46.7 30.5 Z" fill={accent} />
          <path d="M51 6 L52.5 21" stroke="#fff" strokeWidth="3" opacity="0.12" strokeLinecap="round" />
        </g>
      );
    // --- Halloween ---
    case "bruxa":
      return (
        <g>
          <ellipse cx="64" cy="34" rx="38" ry="7" fill="#18181b" />
          <path d="M44 33 C50 22 54 10 58 2 C62 -6 76 -8 88 -1 C77 0 72 6 72 14 C76 22 80 28 84 33 Z" fill="#27272a" />
          <path d="M45 28.5 C58 25.5 70 25.5 83 28.5 L84 33 C70 30 58 30 44 33 Z" fill="#7e22ce" />
          <rect x="60" y="26.5" width="8" height="6.5" rx="1" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
          <path d="M54 14 C56 10 60 9 62 12" stroke="#a855f7" strokeWidth="1" fill="none" opacity="0.6" />
        </g>
      );
    case "cabeca-abobora":
      return (
        <g>
          <path d="M62 8 C61 3 63 0 67 -1" stroke="#15803d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M66 6 C72 2 78 4 80 8 C74 9 70 8 66 6 Z" fill="#22c55e" />
          <ellipse cx="64" cy="22" rx="24" ry="15" fill="#f97316" />
          <path d="M52 9 C47 15 47 29 52 36 M76 9 C81 15 81 29 76 36 M64 7 L64 37" stroke="#c2410c" strokeWidth="1.8" fill="none" />
          <path d="M53 17 L57 23 L49 23 Z M75 17 L79 23 L71 23 Z" fill="#fde047" stroke="#431407" strokeWidth="0.8" />
          <path d="M50 27 L54 30 L58 27 L62 30 L66 27 L70 30 L74 27 L78 27 L74 33 L54 33 Z" fill="#fde047" stroke="#431407" strokeWidth="0.8" />
        </g>
      );
    case "orelhas-lobo":
      return (
        <g>
          <path d="M40 38 L34 8 L58 28 Z" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
          <path d="M42 33 L38 16 L53 28 Z" fill="#fda4af" />
          <path d="M88 38 L94 8 L70 28 Z" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
          <path d="M86 33 L90 16 L75 28 Z" fill="#fda4af" />
          <path d="M36 11 L39 17 M92 11 L89 17" stroke="#9ca3af" strokeWidth="1" />
        </g>
      );
    case "morcego":
      return (
        <g>
          {/* roxo com contorno lilás: aparece até em cima de cabelo preto */}
          <path d="M36 42 C40 20 88 20 92 42" stroke="#a855f7" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M36 42 C40 20 88 20 92 42" stroke="#3b0764" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path
            d="M64 22 C60 15 50 11 38 15 C44 17 46 20 46 25 C51 21 56 22 59 25 C61 23 62.5 22 64 23 C65.5 22 67 23 69 25 C72 22 77 21 82 25 C82 20 84 17 90 15 C78 11 68 15 64 22 Z"
            fill="#3b0764"
            stroke="#c084fc"
            strokeWidth="1.3"
          />
          <circle cx="62" cy="18.5" r="1" fill="#ef4444" />
          <circle cx="66" cy="18.5" r="1" fill="#ef4444" />
        </g>
      );
    // --- Mitologia Grega ---
    case "louros": {
      // folhas ao longo de dois ramos que se encontram na testa
      const leaves: [number, number, number][] = [
        [38, 46, -70],
        [39, 38, -55],
        [43, 31, -40],
        [49, 26, -25],
        [56, 23, -10],
      ];
      return (
        <g>
          <path d="M40 50 C38 36 48 24 62 22 M88 50 C90 36 80 24 66 22" stroke="#a16207" strokeWidth="1.8" fill="none" />
          {leaves.flatMap(([x, y, a]) => [
            <ellipse key={`l${x}`} cx={x} cy={y} rx="5" ry="2.3" fill="#eab308" stroke="#a16207" strokeWidth="0.6" transform={`rotate(${a} ${x} ${y})`} />,
            <ellipse key={`r${x}`} cx={128 - x} cy={y} rx="5" ry="2.3" fill="#eab308" stroke="#a16207" strokeWidth="0.6" transform={`rotate(${-a} ${128 - x} ${y})`} />,
          ])}
          <circle cx="64" cy="22" r="2.2" fill="#fde047" stroke="#a16207" strokeWidth="0.6" />
        </g>
      );
    }
    case "elmo-espartano":
      return (
        <g>
          {/* crista de crina vermelha */}
          <path d="M34 26 C38 -2 90 -2 94 26 C84 14 44 14 34 26 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
          <path d="M44 16 L46 6 M54 12 L55 2 M64 11 L64 0 M74 12 L73 2 M84 16 L82 6" stroke="#991b1b" strokeWidth="1" opacity="0.6" />
          {/* capacete de bronze com proteção de bochecha e de nariz */}
          <path
            d="M31 66 C29 30 44 18 64 18 C84 18 99 30 97 66 L87 70 L87 52 C80 49 71 49 67 52 L66 66 L62 66 L61 52 C57 49 48 49 41 52 L41 70 Z"
            fill="#b45309"
            stroke="#78350f"
            strokeWidth="1.2"
          />
          <path d="M40 30 C50 22 78 22 88 30" stroke="#fbbf24" strokeWidth="1.6" fill="none" opacity="0.7" />
          <path d="M41 52 C48 49 57 49 61 52 M67 52 C71 49 80 49 87 52" stroke="#78350f" strokeWidth="1.4" fill="none" />
        </g>
      );
    case "asas-hermes":
      return (
        <g>
          <path d="M38 42 C44 30 84 30 90 42" stroke="#eab308" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          {[1, -1].map((side) => {
            // asa esquerda desenhada em volta de x=36; a direita é o espelho em x=92
            const t = side === 1 ? "" : "translate(128 0) scale(-1 1)";
            return (
              <g key={side} transform={t}>
                <path d="M38 40 C28 36 18 26 14 14 C22 20 28 22 33 24 C27 18 25 11 26 5 C32 14 36 22 41 32 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
                <path d="M36 36 C28 30 22 24 18 17 M38 32 C33 25 30 18 28 10" stroke="#cbd5e1" strokeWidth="0.8" fill="none" />
              </g>
            );
          })}
        </g>
      );
    case "serpentes": {
      // cobras verdes saindo da cabeça, cada uma com a sua curva
      const snakes = [
        "M42 36 C34 30 42 22 34 14",
        "M52 30 C46 22 56 16 48 6",
        "M64 28 C60 20 68 12 62 2",
        "M76 30 C82 22 72 16 80 6",
        "M86 36 C94 30 86 22 94 14",
      ];
      const heads: [number, number][] = [
        [34, 13],
        [48, 5],
        [62, 1],
        [80, 5],
        [94, 13],
      ];
      return (
        <g>
          {snakes.map((d) => (
            <g key={d}>
              <path d={d} stroke="#15803d" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d={d} stroke="#4ade80" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeDasharray="2 3" />
            </g>
          ))}
          {heads.map(([x, y]) => (
            <g key={x}>
              <ellipse cx={x} cy={y} rx="3.8" ry="3" fill="#16a34a" stroke="#14532d" strokeWidth="0.8" />
              <circle cx={x - 1.2} cy={y - 0.6} r="0.8" fill="#fde047" />
              <circle cx={x + 1.2} cy={y - 0.6} r="0.8" fill="#fde047" />
            </g>
          ))}
        </g>
      );
    }
    // --- Mitologia Egípcia ---
    case "nemes":
      return (
        <g>
          {/* pano listrado do faraó: cobre a cabeça e desce atrás das orelhas até os ombros */}
          <path
            d="M40 42 C42 24 52 18 64 18 C76 18 86 24 88 42 L102 94 L88 98 L84 62 L81 46 C73 42 55 42 47 46 L44 62 L40 98 L26 94 Z"
            fill="#eab308"
            stroke="#a16207"
            strokeWidth="1"
          />
          {[52, 60, 68, 76, 84, 92].map((y) => (
            <g key={y} stroke="#1e40af" strokeWidth="3.4">
              <path d={`M${30 + (y - 52) * 0.04} ${y + 2} L${43 - (y - 52) * 0.08} ${y + 4}`} />
              <path d={`M${98 - (y - 52) * 0.04} ${y + 2} L${85 + (y - 52) * 0.08} ${y + 4}`} />
            </g>
          ))}
          <path d="M46 30 C56 25 72 25 82 30 M42 37 C54 32 74 32 86 37" stroke="#1e40af" strokeWidth="3" fill="none" />
          <path d="M45 45 C55 41 73 41 83 45" stroke="#1e3a8a" strokeWidth="3" fill="none" />
          {/* cobra real na testa */}
          <path d="M64 42 C61 41 60 36 62 33 C63 31 65 31 66 33 C68 36 67 41 64 42 Z" fill="#fde047" stroke="#a16207" strokeWidth="0.8" />
        </g>
      );
    case "anubis":
      return (
        <g>
          <path d="M42 38 L36 -2 L60 26 Z" fill="#111827" stroke="#eab308" strokeWidth="1.2" />
          <path d="M44 32 L40 8 L55 26 Z" fill="#eab308" opacity="0.85" />
          <path d="M86 38 L92 -2 L68 26 Z" fill="#111827" stroke="#eab308" strokeWidth="1.2" />
          <path d="M84 32 L88 8 L73 26 Z" fill="#eab308" opacity="0.85" />
          <path d="M38 42 C44 30 84 30 90 42" stroke="#eab308" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M38 42 C44 30 84 30 90 42" stroke="#1e40af" strokeWidth="1" fill="none" strokeDasharray="3 3" />
        </g>
      );
    case "uraeus":
      return (
        <g>
          <path d="M38 40 C45 29 83 29 90 40" stroke="#eab308" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M38 40 C45 29 83 29 90 40" stroke="#fde68a" strokeWidth="1" fill="none" />
          {/* cobra dourada erguida na frente */}
          <path d="M64 34 C57 32 55 23 58 16 C60 11 68 11 70 16 C73 23 71 32 64 34 Z" fill="#eab308" stroke="#a16207" strokeWidth="1" />
          <path d="M64 30 C61 29 60 24 62 20 C63 18 65 18 66 20 C68 24 67 29 64 30 Z" fill="#1d4ed8" />
          <circle cx="62.3" cy="17.5" r="0.9" fill="#dc2626" />
          <circle cx="65.7" cy="17.5" r="0.9" fill="#dc2626" />
          <circle cx="50" cy="33" r="1.8" fill="#0d9488" />
          <circle cx="78" cy="33" r="1.8" fill="#0d9488" />
        </g>
      );
    case "disco-ra":
      return (
        <g>
          <circle cx="64" cy="14" r="17" fill="#f97316" opacity="0.25" />
          {/* chifres em forma de lira segurando o disco do sol */}
          <path d="M50 32 C38 28 34 16 42 4 C40 14 44 22 54 26 Z" fill="#78350f" />
          <path d="M78 32 C90 28 94 16 86 4 C88 14 84 22 74 26 Z" fill="#78350f" />
          <circle cx="64" cy="15" r="12" fill="#dc2626" stroke="#eab308" strokeWidth="2" />
          <circle cx="60" cy="11" r="3" fill="#fca5a5" opacity="0.6" />
          <path d="M40 38 C46 28 82 28 88 38" stroke="#eab308" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M64 36 C61 35 60 31 62 28 C63 26.5 65 26.5 66 28 C68 31 67 35 64 36 Z" fill="#eab308" stroke="#a16207" strokeWidth="0.7" />
        </g>
      );
    // --- Natal ---
    case "gorro-noel":
      return (
        <g>
          {/* gorro vermelho caindo pro lado, com pompom */}
          <path d="M38 33 C44 14 58 5 70 7 C84 9 96 22 104 46 C97 39 91 34 88 33 Z" fill="#dc2626" />
          <path d="M70 9 C82 12 92 24 98 38" stroke="#991b1b" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M33 38 C33 30 44 27 64 27 C84 27 95 30 95 38 C95 45 84 42 64 42 C44 42 33 45 33 38 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.8" />
          <circle cx="104" cy="48" r="6.5" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.8" />
        </g>
      );
    case "chifres-rena":
      return (
        <g>
          <path d="M38 42 C44 30 84 30 90 42" stroke="#7c2d12" strokeWidth="3" fill="none" strokeLinecap="round" />
          {[1, -1].map((side) => (
            <g key={side} transform={side === 1 ? "" : "translate(128 0) scale(-1 1)"} stroke="#92400e" strokeWidth="3.4" fill="none" strokeLinecap="round">
              <path d="M45 33 C41 23 39 14 41 3" />
              <path d="M41 19 C35 17 31 12 31 5" />
              <path d="M41.5 11 C46 9.5 48 6 48 1" />
            </g>
          ))}
          <circle cx="47" cy="37" r="2.4" fill="#fbbf24" stroke="#a16207" strokeWidth="0.6" />
          <circle cx="81" cy="37" r="2.4" fill="#fbbf24" stroke="#a16207" strokeWidth="0.6" />
        </g>
      );
    case "azevinho": {
      const leaves: [number, number, number][] = [
        [40, 40, -65],
        [42, 32, -45],
        [48, 26, -25],
        [56, 23, -8],
      ];
      return (
        <g>
          {leaves.flatMap(([x, y, a]) => [
            <g key={`l${x}`} transform={`rotate(${a} ${x} ${y})`}>
              <ellipse cx={x} cy={y} rx="6" ry="2.8" fill="#15803d" stroke="#14532d" strokeWidth="0.7" />
              <path d={`M${x - 5} ${y} L${x + 5} ${y}`} stroke="#86efac" strokeWidth="0.5" />
            </g>,
            <g key={`r${x}`} transform={`rotate(${-a} ${128 - x} ${y})`}>
              <ellipse cx={128 - x} cy={y} rx="6" ry="2.8" fill="#15803d" stroke="#14532d" strokeWidth="0.7" />
              <path d={`M${123 - x} ${y} L${133 - x} ${y}`} stroke="#86efac" strokeWidth="0.5" />
            </g>,
          ])}
          {[
            [62, 22],
            [66, 22],
            [64, 19],
            [44, 29],
            [84, 29],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.5" />
          ))}
        </g>
      );
    }
    case "gorro-elfo":
      return (
        <g>
          {/* gorro verde pontudo virado pra trás, com sininho na ponta */}
          <path d="M40 34 C44 20 56 10 68 5 C78 1 88 3 94 10 C86 9 80 13 78 20 C83 25 86 30 88 34 Z" fill="#16a34a" />
          <path d="M60 12 C70 8 80 8 88 10" stroke="#15803d" strokeWidth="1.6" fill="none" />
          <path d="M37 36 C44 30 84 30 91 36 L91 41 C84 35 44 35 37 41 Z" fill="#dc2626" />
          <path d="M44 33 L46 39 M54 31.5 L55 37.5 M64 31 L64 37 M74 31.5 L73 37.5 M84 33 L82 39" stroke="#f8fafc" strokeWidth="1.6" />
          <circle cx="95" cy="12" r="3.6" fill="#fbbf24" stroke="#a16207" strokeWidth="0.8" />
          <path d="M93.5 13.5 L96.5 13.5" stroke="#78350f" strokeWidth="0.8" />
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
  const ids = { bg: `bg${uid}`, skin: `sk${uid}`, steel: `st${uid}`, gold: `gd${uid}`, aura: `au${uid}` };

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
        <AuraLayer aura={config.aura ?? "nenhum"} gradientId={ids.aura} />

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
        <PetLayer pet={config.pet ?? "nenhum"} />
      </svg>
    </div>
  );
}
