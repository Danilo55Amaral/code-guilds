"use client";

import { Pt, RimGradient, SilhouetteFilter, animVars, claw, ellipsePoints, jagged, mirror, poly, useSvgId } from "./kit";
import { Crow, MapleLeaf } from "./creatures";

// ============================================================================
// OS VILÕES DE A NOITE DE DRACODING — o Conde Dracoding (o chefe), o
// Lobisloop (o lobisomem) e o Espantabyte (o espantalho de cabeça de abóbora),
// mais o Seu Lupércio (o Lobisloop depois de quebrado o feitiço) e o Dracoding
// de Bolso (o vampiro encolhido pelo sol). Desenhos grandes, com gradientes e
// luz de contorno; `talking` abre a boca de quem está falando.
// ============================================================================

// ---------------------------------------------------------------------------
// Conde Dracoding (viewBox 400×560, de frente, de capa aberta como asas)
// ---------------------------------------------------------------------------

// A capa aberta pelos braços vira duas asas de morcego, com as pontas no chão.
const CAPE =
  "M200 166 L252 192 L338 206 Q390 222 398 282 Q330 322 384 398 Q316 430 350 496 Q290 494 284 554 L116 554 Q110 494 50 496 Q84 430 16 398 Q70 322 2 282 Q10 222 62 206 L148 192 Z";
// as "varetas" da asa, do pulso até cada ponta
const CAPE_RIBS = ["M338 206 Q372 236 398 282", "M338 206 Q356 300 384 398", "M338 206 Q334 360 350 496", "M62 206 Q28 236 2 282", "M62 206 Q44 300 16 398", "M62 206 Q66 360 50 496"];

const COLLAR_LEFT: Pt[] = [
  [186, 196],
  [150, 192],
  [122, 126],
  [146, 140],
  [138, 98],
  [162, 122],
  [168, 92],
  [190, 150],
];
const COLLAR_LEFT_INNER: Pt[] = [
  [184, 190],
  [156, 186],
  [134, 136],
  [152, 146],
  [148, 112],
  [166, 130],
  [172, 108],
  [188, 152],
];

/** Babado da camisa (jabô) na altura `y`, com `w` de meia-largura e a barra em zigue-zague. */
function ruffle(y: number, w: number): string {
  const teeth = 5;
  const pts: Pt[] = [
    [200 - w, y],
    [200 + w, y],
  ];
  for (let i = 0; i <= teeth * 2; i++) {
    const x = 200 + w - (i * (2 * w)) / (teeth * 2);
    pts.push([x, y + (i % 2 ? 7 : 11)]);
  }
  return poly(pts);
}

/** Mão de dedos longos e unhas pontudas, apontando pra direita a partir do pulso (0, 0). */
function VampireHand({ transform, skin }: { transform: string; skin: string }) {
  const fingers: [number, number, number, number, number][] = [
    [10, -9, 40, -27, 3.2],
    [15, -4, 49, -11, 3.2],
    [15, 3, 48, 8, 3],
    [10, 8, 37, 23, 2.8],
    [0, 8, 9, 25, 3],
  ];
  return (
    <g transform={transform}>
      <path d={poly([[-4, -9], [12, -11], [18, 0], [12, 10], [-4, 9]])} fill={skin} />
      {fingers.map(([x1, y1, x2, y2, w]) => {
        const nx = x1 + (x2 - x1) * 0.72;
        const ny = y1 + (y2 - y1) * 0.72;
        return (
          <g key={`${x2}-${y2}`}>
            <path d={claw(x1, y1, x2, y2, w, 0.3)} fill={skin} />
            <path d={claw(nx, ny, x2 + (x2 - x1) * 0.08, y2 + (y2 - y1) * 0.08, w * 0.7, 0.2)} fill="#2a0610" />
          </g>
        );
      })}
    </g>
  );
}

export function CountDracoding({
  talking = false,
  silhouette = false,
  magic = false,
  className = "",
}: {
  talking?: boolean;
  /** Só a sombra (preta), com os olhos acesos: o vampiro ainda escondido. */
  silhouette?: boolean;
  /** Magia vermelha saindo das mãos. */
  magic?: boolean;
  className?: string;
}) {
  const id = useSvgId();
  const skin = `url(#${id}-skin)`;
  const rim = `url(#${id}-rim)`;
  return (
    <svg viewBox="0 0 400 560" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-lining`} cx="200" cy="320" r="270" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#be123c" />
          <stop offset="0.5" stopColor="#6b0a24" />
          <stop offset="1" stopColor="#1f030b" />
        </radialGradient>
        <linearGradient id={`${id}-coat`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#07050b" />
          <stop offset="0.6" stopColor="#171122" />
          <stop offset="1" stopColor="#2e2442" />
        </linearGradient>
        <linearGradient id={`${id}-skin`} gradientUnits="userSpaceOnUse" x1="150" y1="0" x2="250" y2="0">
          <stop offset="0" stopColor="#77718f" />
          <stop offset="0.48" stopColor="#c9c4de" />
          <stop offset="1" stopColor="#f1effa" />
        </linearGradient>
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#232046" />
          <stop offset="1" stopColor="#040308" />
        </linearGradient>
        <linearGradient id={`${id}-vest`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a1a2e" />
          <stop offset="1" stopColor="#36050f" />
        </linearGradient>
        <radialGradient id={`${id}-eye`}>
          <stop offset="0" stopColor="#fff1f2" />
          <stop offset="0.35" stopColor="#fb7185" />
          <stop offset="1" stopColor="#9f1239" />
        </radialGradient>
        <radialGradient id={`${id}-ruby`} cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#ffe4e6" />
          <stop offset="0.4" stopColor="#e11d48" />
          <stop offset="1" stopColor="#4c0519" />
        </radialGradient>
        <RimGradient id={`${id}-rim`} x1={10} x2={390} left="#a5b4fc" right="#fb7185" />
        <SilhouetteFilter id={`${id}-sil`} />
      </defs>

      <g filter={silhouette ? `url(#${id}-sil)` : undefined}>
        {/* ---- capa: asas de morcego, balançando ---- */}
        <g className="cg-anim-cape" style={animVars({ dur: 5.5 })}>
          <path d={CAPE} fill="#07050b" stroke={rim} strokeWidth="3" strokeLinejoin="round" />
          <path d={CAPE} fill={`url(#${id}-lining)`} transform="translate(200 380) scale(0.92) translate(-200 -380)" />
          <g fill="none" strokeLinecap="round">
            {["M168 230 Q146 390 158 548", "M232 230 Q254 390 242 548", "M120 250 Q92 400 104 540", "M280 250 Q308 400 296 540"].map((d) => (
              <path key={d} d={d} stroke="#2a0310" strokeWidth="7" opacity="0.55" />
            ))}
            {["M150 240 Q132 380 140 520", "M250 240 Q268 380 260 520"].map((d) => (
              <path key={d} d={d} stroke="#fb7185" strokeWidth="2" opacity="0.22" />
            ))}
            {CAPE_RIBS.map((d) => (
              <path key={d} d={d} stroke="#16020a" strokeWidth="3.5" opacity="0.9" />
            ))}
          </g>
        </g>
      </g>

      {/* corpo e olhos respiram juntos (os olhos ficam fora do filtro de silhueta, pra continuarem acesos) */}
      <g className="cg-anim-dragon-breathe">
        <g filter={silhouette ? `url(#${id}-sil)` : undefined}>
          {/* ---- pernas e cauda do fraque ---- */}
          <path d={poly([[166, 330], [234, 330], [258, 472], [228, 452], [214, 404], [186, 404], [172, 452], [142, 472]])} fill="#0d0913" stroke={rim} strokeWidth="2" />
          <path d={poly([[180, 372], [198, 372], [194, 542], [176, 542]])} fill="#0b0810" />
          <path d={poly([[202, 372], [220, 372], [224, 542], [206, 542]])} fill="#0b0810" />
          <path d="M219 380 L223 538" stroke="#4b4466" strokeWidth="1.5" opacity="0.7" />
          <path d="M160 552 L176 536 L196 538 L198 552 Z M202 552 L204 538 L224 536 L242 552 Z" fill="#040306" stroke={rim} strokeWidth="1.5" />

          {/* ---- braços abertos segurando a capa ---- */}
          <path d={poly([[242, 192], [300, 196], [336, 200], [338, 220], [300, 222], [244, 234]])} fill={`url(#${id}-coat)`} stroke={rim} strokeWidth="2" />
          <path d={poly([[158, 192], [100, 196], [64, 200], [62, 220], [100, 222], [156, 234]])} fill="#0a0710" stroke={rim} strokeWidth="2" />
          <path d={jagged([[334, 196], [346, 194], [350, 210], [346, 226], [334, 224]], 3, 5, 2)} fill="#e5e7eb" stroke="#94a3b8" strokeWidth="0.8" />
          <path d={jagged(mirror([[334, 196], [346, 194], [350, 210], [346, 226], [334, 224]], 200), 3, 5, 3)} fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
          <VampireHand transform="translate(350 210) rotate(-18)" skin={skin} />
          <VampireHand transform="translate(50 210) scale(-1 1) rotate(-18)" skin={skin} />

          {/* ---- gola alta, atrás da cabeça ---- */}
          <path d={poly(COLLAR_LEFT)} fill="#0b0810" stroke={rim} strokeWidth="2" strokeLinejoin="round" />
          <path d={poly(COLLAR_LEFT_INNER)} fill={`url(#${id}-lining)`} />
          <path d={poly(mirror(COLLAR_LEFT, 200))} fill="#0b0810" stroke={rim} strokeWidth="2" strokeLinejoin="round" />
          <path d={poly(mirror(COLLAR_LEFT_INNER, 200))} fill={`url(#${id}-lining)`} />

          {/* ---- fraque, colete, camisa e medalhão ---- */}
          <path d={poly([[150, 194], [250, 194], [248, 262], [234, 346], [166, 346], [152, 262]])} fill={`url(#${id}-coat)`} stroke={rim} strokeWidth="2" />
          <path d={poly([[184, 212], [216, 212], [226, 330], [200, 348], [174, 330]])} fill={`url(#${id}-vest)`} />
          {[290, 310, 330].map((y) => (
            <circle key={y} cx="200" cy={y} r="3" fill="#d4a017" stroke="#713f12" strokeWidth="0.6" />
          ))}
          <path d={poly([[176, 196], [200, 262], [188, 304], [158, 232]])} fill="#251b33" />
          <path d={poly([[224, 196], [200, 262], [212, 304], [242, 232]])} fill="#3a2d52" />
          <path d="M226 200 L240 232 L212 302" stroke="#8b7ab3" strokeWidth="1.4" fill="none" opacity="0.55" />
          <path d={poly([[186, 196], [214, 196], [200, 250]])} fill="#e5e7eb" />
          {[
            [204, 13],
            [215, 11],
            [226, 9],
          ].map(([y, w]) => (
            <path key={y} d={ruffle(y, w)} fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.8" />
          ))}
          <path d="M184 200 Q200 238 216 200" stroke="#d4a017" strokeWidth="1.6" fill="none" />
          <g className="cg-anim-glow"><circle cx="200" cy="248" r="13" fill="#f43f5e" opacity="0.35" /></g>
          <path d={poly([[200, 233], [213, 248], [200, 263], [187, 248]])} fill="#a16207" stroke="#fde68a" strokeWidth="1" />
          <circle cx="200" cy="248" r="6.5" fill={`url(#${id}-ruby)`} />

          {/* ---- pescoço e cabeça ---- */}
          <path d={poly([[190, 158], [210, 158], [214, 198], [186, 198]])} fill="#8e89ab" />
          <path d={poly([[162, 104], [134, 78], [152, 118], [165, 132]])} fill={skin} stroke={rim} strokeWidth="1.5" />
          <path d={poly([[158, 108], [143, 92], [154, 118]])} fill="#5f5a7a" />
          <path d={poly([[238, 104], [266, 78], [248, 118], [235, 132]])} fill={skin} stroke={rim} strokeWidth="1.5" />
          <path d={poly([[242, 108], [257, 92], [246, 118]])} fill="#8e89ab" />
          <path
            d="M200 62 C226 62 241 80 241 106 C241 126 237 140 229 152 L214 170 L200 177 L186 170 L171 152 C163 140 159 126 159 106 C159 80 174 62 200 62 Z"
            fill={skin}
            stroke={rim}
            strokeWidth="2"
          />
          {/* maçãs do rosto fundas e queixo */}
          <path d="M166 124 L186 152 L178 126 Z" fill="#5f5a7a" opacity="0.55" />
          <path d="M234 124 L214 152 L222 126 Z" fill="#8e89ab" opacity="0.45" />
          <path d="M186 170 L200 177 L214 170 L200 172 Z" fill="#5f5a7a" opacity="0.6" />
          {/* cabelo penteado pra trás, com o bico na testa */}
          <path
            d="M157 112 C152 74 172 46 200 44 C228 46 248 74 243 112 C240 96 234 84 226 78 L210 84 L200 101 L190 84 L174 78 C166 84 160 96 157 112 Z"
            fill={`url(#${id}-hair)`}
            stroke={rim}
            strokeWidth="1.5"
          />
          <g stroke="#6366f1" strokeWidth="1.6" fill="none" opacity="0.55" strokeLinecap="round">
            <path d="M176 56 C190 49 210 49 224 56" />
            <path d="M166 72 C174 62 184 57 194 56" />
            <path d="M234 72 C226 62 216 57 206 56" />
          </g>
          <path d="M158 108 L164 128 L167 104 Z M242 108 L236 128 L233 104 Z" fill="#05040a" />
          {/* sobrancelhas bravas, nariz e linhas do rosto */}
          <path d={poly([[167, 99], [196, 108], [195, 113], [169, 106]])} fill="#05040a" />
          <path d={poly([[233, 99], [204, 108], [205, 113], [231, 106]])} fill="#05040a" />
          <path d="M168 111 L196 113 L193 118 L171 116 Z M232 111 L204 113 L207 118 L229 116 Z" fill="#4e4968" opacity="0.55" />
          <path d="M175 126 L189 127 M225 126 L211 127" stroke="#4e4968" strokeWidth="1.4" opacity="0.5" strokeLinecap="round" />
          <path d="M197 166 L200 171 L203 166" stroke="#4e4968" strokeWidth="1.2" fill="none" opacity="0.5" />
          <path d="M200 113 L195.5 137 L201 140 L206 137" stroke="#4e4968" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
          <path d="M178 139 L185 150 M222 139 L215 148" stroke="#4e4968" strokeWidth="1.4" opacity="0.6" />
          {/* boca: fechada com o sorrisinho e as presas, ou aberta falando */}
          {talking ? (
            <g>
              <path d="M184 147 Q200 150 217 145 Q212 168 200 169 Q189 168 184 147 Z" fill="#2a0510" stroke="#1a0208" strokeWidth="1" />
              <path d="M187 148.5 Q200 151 214 147 L213 151 Q200 154 188 152 Z" fill="#e5e7eb" />
              <path d="M189 149.5 L192.5 161 L195.5 150.5 Z M205.5 150 L208.5 161 L212 148.8 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
            </g>
          ) : (
            <g>
              <path d="M184 150 Q194 155 200 154.5 Q208 154 217 147" stroke="#2a0510" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path d="M190 152.5 L192.5 161.5 L195.5 154 Z M205.5 154 L208.5 161.5 L211 151.6 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
            </g>
          )}
        </g>

        {/* ---- olhos vermelhos (acesos até na silhueta) ---- */}
        <g style={{ filter: `drop-shadow(0 0 ${silhouette ? 7 : 4}px #f43f5e)` }}>
          <path d="M172 116 L194 117.5 L189 123.5 L175 122 Z M228 116 L206 117.5 L211 123.5 L225 122 Z" fill={`url(#${id}-eye)`} />
          <path d="M182 117 L184 117 L184 123 L182 123 Z M216 117 L218 117 L218 123 L216 123 Z" fill="#1a0208" />
          <path d="M172 116 L194 117.5 L189 123.5 L175 122 Z M228 116 L206 117.5 L211 123.5 L225 122 Z" fill="#fb7185" className="cg-anim-eye" opacity="0.6" />
        </g>
      </g>

      {/* ---- magia vermelha nas mãos ---- */}
      {magic &&
        [
          [384, 186],
          [16, 186],
        ].map(([x, y], i) => (
          <g key={x}>
            <circle cx={x} cy={y} r="26" fill="#f43f5e" opacity="0.25" className="cg-anim-orb" style={{ animationDelay: `${i * 0.5}s` }} />
            <circle cx={x} cy={y} r="11" fill="#fda4af" opacity="0.8" className="cg-anim-orb" style={{ animationDelay: `${i * 0.5}s` }} />
            {[0, 1, 2].map((k) => (
              <circle key={k} cx={x + (k - 1) * 14} cy={y - 22 - k * 6} r="2" fill="#ffe4e6" className="cg-anim-twinkle" style={{ animationDelay: `${k * 0.4 + i * 0.3}s` }} />
            ))}
          </g>
        ))}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Lobisloop, o lobisomem (viewBox 440×540, curvado, de garras abertas)
// ---------------------------------------------------------------------------

const WOLF_TORSO = jagged(
  [
    [150, 178],
    [290, 178],
    [330, 206],
    [318, 262],
    [296, 322],
    [270, 370],
    [170, 370],
    [144, 322],
    [122, 262],
    [110, 206],
  ],
  7,
  13,
  3,
);
const WOLF_CHEST = jagged(
  [
    [178, 204],
    [262, 204],
    [280, 248],
    [262, 300],
    [220, 334],
    [178, 300],
    [160, 248],
  ],
  6,
  12,
  5,
);
const WOLF_MANE = jagged(ellipsePoints(220, 152, 102, 76, 22), 17, 15, 7, true, 0.85);
const WOLF_MANE_INNER = jagged(ellipsePoints(220, 150, 80, 58, 18), 10, 13, 9, true, 0.8);
const WOLF_RAG: Pt[] = [
  [116, 206],
  [160, 178],
  [178, 214],
  [168, 250],
  [152, 236],
  [142, 262],
  [126, 242],
];
const WOLF_SHORTS = jagged(
  [
    [166, 362],
    [274, 362],
    [298, 420],
    [244, 428],
    [226, 404],
    [214, 404],
    [196, 428],
    [142, 420],
  ],
  5,
  10,
  11,
);
const WOLF_LEG: Pt[] = [
  [160, 410],
  [202, 412],
  [192, 452],
  [198, 492],
  [204, 512],
  [150, 514],
  [164, 492],
  [148, 452],
];
const WOLF_ARM = jagged(
  [
    [136, 186],
    [156, 228],
    [120, 292],
    [102, 356],
    [60, 352],
    [66, 288],
    [96, 206],
  ],
  6,
  12,
  13,
);

function WolfArm({ id, transform, delay }: { id: string; transform?: string; delay: number }) {
  return (
    <g transform={transform}>
      <g className="cg-anim-swing" style={animVars({ dur: 3.2, delay, angle: 3, origin: "80% 0%" })}>
        <path d={WOLF_ARM} fill={`url(#${id}-fur)`} stroke={`url(#${id}-rim)`} strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M128 230 L112 262 M104 300 L94 330" stroke="#0b1220" strokeWidth="2" opacity="0.6" />
        <path d={jagged([[58, 348], [104, 352], [108, 378], [92, 394], [60, 392], [50, 374]], 4, 9, 17)} fill="#1a2438" stroke={`url(#${id}-rim)`} strokeWidth="2" />
        {[56, 71, 86, 100].map((x, i) => (
          <g key={x}>
            <path d={poly([[x - 6, 384], [x + 6, 386], [x + 4, 402], [x - 4, 400]])} fill="#1a2438" />
            <path d={claw(x, 398, x + 4 - i, 428 - (i === 3 ? 6 : 0), 4.2, 0.5)} fill="#e7e5e4" stroke="#78716c" strokeWidth="0.8" />
          </g>
        ))}
      </g>
    </g>
  );
}

export function Lobisloop({ talking = false, howling = false, className = "" }: { talking?: boolean; howling?: boolean; className?: string }) {
  const id = useSvgId();
  const rim = `url(#${id}-rim)`;
  const fur = `url(#${id}-fur)`;
  const open = talking || howling;
  return (
    <svg viewBox="0 0 440 540" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-fur`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a3a55" />
          <stop offset="1" stopColor="#0b1120" />
        </linearGradient>
        <linearGradient id={`${id}-chest`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b6c88" />
          <stop offset="1" stopColor="#26344c" />
        </linearGradient>
        <linearGradient id={`${id}-muzzle`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#64748b" />
          <stop offset="1" stopColor="#2b3b55" />
        </linearGradient>
        <radialGradient id={`${id}-eye`}>
          <stop offset="0" stopColor="#fef9c3" />
          <stop offset="0.45" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#9a3412" />
        </radialGradient>
        <RimGradient id={`${id}-rim`} x1={40} x2={400} left="#7dd3fc" right="#fb923c" />
      </defs>

      <g className="cg-anim-dragon-breathe">
        {/* juba atrás da cabeça e dos ombros, em duas camadas */}
        <path d={WOLF_MANE} fill="#0b1220" stroke={rim} strokeWidth="2.5" strokeLinejoin="round" />
        <path d={WOLF_MANE_INNER} fill="#16213a" />

        {/* pernas de lobo (dobradas pra trás) e garras dos pés */}
        {[0, 1].map((side) => (
          <g key={side} transform={side ? "translate(440 0) scale(-1 1)" : undefined}>
            <path d={jagged(WOLF_LEG, 4, 10, 19 + side)} fill={fur} stroke={rim} strokeWidth="2.5" />
            {[156, 170, 184].map((x) => (
              <path key={x} d={claw(x, 510, x - 4, 526, 3.4, 0.4)} fill="#e7e5e4" stroke="#78716c" strokeWidth="0.6" />
            ))}
          </g>
        ))}

        {/* braços */}
        <WolfArm id={id} delay={0} />
        <WolfArm id={id} transform="translate(440 0) scale(-1 1)" delay={-1.6} />

        {/* tronco, peito e o que sobrou da roupa de vigia */}
        <path d={WOLF_TORSO} fill={fur} stroke={rim} strokeWidth="2.5" strokeLinejoin="round" />
        <path d={WOLF_CHEST} fill={`url(#${id}-chest)`} opacity="0.92" />
        <g stroke="#1e293b" strokeWidth="2.2" fill="none" opacity="0.7" strokeLinecap="round">
          <path d="M178 236 Q198 254 216 242 M262 236 Q242 254 224 242" />
          <path d="M206 272 L234 272 M204 292 L236 292 M210 312 L230 312" />
        </g>
        {[0, 1].map((side) => (
          <g key={side} transform={side ? "translate(440 0) scale(-1 1)" : undefined}>
            <path d={jagged(WOLF_RAG, 5, 9, 23 + side)} fill="#5b3a22" stroke="#2b1a10" strokeWidth="1.2" />
            <path d="M130 214 L150 200 M136 228 L160 212" stroke="#3b2414" strokeWidth="2" opacity="0.7" />
          </g>
        ))}
        <path d={WOLF_SHORTS} fill="#1e3a5f" stroke={rim} strokeWidth="2" />
        <path d={poly([[178, 380], [200, 378], [202, 398], [180, 400]])} fill="#2c4f7a" stroke="#0f1d33" strokeWidth="1" strokeDasharray="3 2" />
        <path d={poly([[164, 350], [276, 350], [278, 368], [162, 368]])} fill="#2b1a10" />
        <rect x="210" y="350" width="20" height="18" rx="2" fill="none" stroke="#ca8a04" strokeWidth="3" />
        {/* relógio de bolso quebrado, balançando na corrente */}
        <g className="cg-anim-swing" style={animVars({ dur: 2.4, angle: 10, origin: "50% 0%" })}>
          <path d="M240 366 Q250 384 257 392" stroke="#ca8a04" strokeWidth="1.8" fill="none" strokeDasharray="2.5 1.5" />
          <circle cx="258" cy="404" r="12" fill="#ca8a04" stroke="#713f12" strokeWidth="1.5" />
          <circle cx="258" cy="404" r="8.5" fill="#fef3c7" />
          <path d="M258 404 L258 398 M258 404 L262 406" stroke="#1c1917" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M252 398 L257 404 L254 410 M262 397 L259 402" stroke="#78716c" strokeWidth="0.8" fill="none" />
        </g>

        {/* ---- cabeça (um pouco maior que o resto, pra impor respeito) ---- */}
        <g transform="translate(220 190) scale(1.12) translate(-220 -190)">
        <g className={howling ? "cg-anim-howl" : "cg-anim-swing"} style={howling ? undefined : animVars({ dur: 4.6, angle: 2, origin: "50% 100%" })}>
          {/* orelhas */}
          <path d={poly([[184, 100], [164, 34], [210, 82]])} fill={fur} stroke={rim} strokeWidth="2" strokeLinejoin="round" />
          <path d={poly([[184, 93], [171, 52], [200, 82]])} fill="#4a1d1d" />
          <path d={poly([[256, 100], [276, 34], [230, 82]])} fill={fur} stroke={rim} strokeWidth="2" strokeLinejoin="round" />
          <path d={poly([[256, 93], [269, 52], [240, 82]])} fill="#4a1d1d" />
          {/* crânio e tufos das bochechas, abertos pros lados */}
          <path d={jagged([[182, 82], [258, 82], [276, 112], [268, 146], [246, 162], [194, 162], [172, 146], [164, 112]], 4, 12, 29)} fill={fur} stroke={rim} strokeWidth="2" />
          <path d={jagged([[172, 116], [132, 130], [158, 140], [136, 160], [176, 154], [190, 164]], 3, 9, 31)} fill="#26344c" stroke={rim} strokeWidth="1.5" />
          <path d={jagged(mirror([[172, 116], [132, 130], [158, 140], [136, 160], [176, 154], [190, 164]], 220), 3, 9, 37)} fill="#26344c" stroke={rim} strokeWidth="1.5" />
          <path d="M204 90 L210 104 M220 88 L220 104 M236 90 L230 104" stroke="#0b1220" strokeWidth="2.4" fill="none" opacity="0.7" strokeLinecap="round" />
          {/* sobrancelhas pesadas em V e olhos de fogo */}
          <path d={poly([[170, 102], [216, 118], [214, 127], [174, 114]])} fill="#070b14" />
          <path d={poly(mirror([[170, 102], [216, 118], [214, 127], [174, 114]], 220))} fill="#070b14" />
          <g style={{ filter: "drop-shadow(0 0 5px #f59e0b)" }}>
            <path d={poly([[180, 118], [210, 126], [203, 134], [186, 130]])} fill={`url(#${id}-eye)`} />
            <path d={poly(mirror([[180, 118], [210, 126], [203, 134], [186, 130]], 220))} fill={`url(#${id}-eye)`} />
            <path d="M194 121 L197 121.8 L197 132 L194 131.2 Z M246 121 L243 121.8 L243 132 L246 131.2 Z" fill="#1c0a00" />
            <path d={`${poly([[180, 118], [210, 126], [203, 134], [186, 130]])} ${poly(mirror([[180, 118], [210, 126], [203, 134], [186, 130]], 220))}`} fill="#fde68a" opacity="0.5" className="cg-anim-eye" />
          </g>
          {/* focinho comprido, nariz na ponta e o rosnado embaixo */}
          <g>
            {/* maxilar de baixo (desce quando ele fala ou uiva) e o fundo da boca */}
            {open && <path d={poly([[200, 202], [240, 202], [236, 214 + (howling ? 16 : 10)], [204, 214 + (howling ? 16 : 10)]])} fill="#3f0a0a" />}
            <g transform={open ? `translate(0 ${howling ? 16 : 10}) rotate(${howling ? 6 : 3} 220 206)` : undefined}>
              <path d={jagged([[204, 206], [236, 206], [230, 226], [210, 226]], 2, 8, 41)} fill="#26344c" stroke={rim} strokeWidth="1.5" />
              <path d="M206 208 L209 202 L212 208 L215 203 L218 208 L222 208 L225 203 L228 208 L231 202 L234 208 Z" fill="#f5f5f4" />
            </g>
            <path d={poly([[202, 124], [238, 124], [250, 170], [242, 204], [198, 204], [190, 170]])} fill={`url(#${id}-muzzle)`} stroke={rim} strokeWidth="1.5" />
            <path d="M220 128 L220 174" stroke="#94a3b8" strokeWidth="3" opacity="0.35" strokeLinecap="round" />
            <path d="M196 156 L206 162 M244 156 L234 162 M194 168 L204 171 M246 168 L236 171" stroke="#0f172a" strokeWidth="1.6" />
            {/* nariz em triângulo, com as narinas e o brilho */}
            <path d={poly([[207, 180], [233, 180], [229, 191], [220, 197], [211, 191]])} fill="#050505" />
            <path d="M212 187 Q215 184 218 188 M222 188 Q225 184 228 187" stroke="#3f3f46" strokeWidth="1.6" fill="none" />
            <path d="M211 182.5 L221 182" stroke="#9ca3af" strokeWidth="1.6" opacity="0.65" strokeLinecap="round" />
            <path d="M220 197 L220 202 M204 203 Q212 209 220 202 Q228 209 236 203" stroke="#0b1220" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* dentes de cima, com as duas presas */}
            <path d="M206 205 L209 211 L212 205 L215 210 L218 205 L222 205 L225 210 L228 205 L231 211 L234 205 Z" fill="#f5f5f4" />
            <path d={`${claw(207, 203, 208, 222, 3, 0)} ${claw(233, 203, 232, 222, 3, 0)}`} fill="#fafaf9" stroke="#a8a29e" strokeWidth="0.5" />
          </g>
        </g>
        </g>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Espantabyte, o espantalho (viewBox 400×560, preso na estaca, braços abertos)
// ---------------------------------------------------------------------------

const SCARECROW_SLEEVE = jagged(
  [
    [156, 204],
    [100, 208],
    [60, 212],
    [54, 238],
    [100, 240],
    [156, 248],
  ],
  3,
  12,
  31,
);
const PUMPKIN =
  "M200 68 L226 64 C250 66 266 80 272 98 L276 120 C280 146 272 166 260 178 L238 190 L200 194 L162 190 L140 178 C128 166 120 146 124 120 L128 98 C134 80 150 66 174 64 Z";
const CARVE_EYES = "M150 114 L188 127 L182 133 L176 129 L170 140 L162 131 L154 136 Z M250 114 L212 127 L218 133 L224 129 L230 140 L238 131 L246 136 Z";
const CARVE_NOSE = "M195 138 L205 138 L208 146 L200 152 L192 146 Z";
const MOUTH_TOP = "M140 152 L152 158 L160 152 L168 164 L176 156 L186 168 L196 158 L206 170 L216 158 L226 168 L234 156 L244 162 L252 152 L262 150";
function mouthPath(open: boolean): string {
  const drop = open ? 12 : 0;
  const bottom: Pt[] = [
    [254, 166],
    [246, 176],
    [238, 172],
    [228, 184],
    [218, 178],
    [206, 188],
    [196, 180],
    [186, 188],
    [176, 178],
    [166, 182],
    [156, 172],
    [148, 168],
  ];
  return `${MOUTH_TOP} ${bottom.map(([x, y]) => `L${x} ${y + drop * (1 - Math.abs(x - 200) / 70)}`).join(" ")} Z`;
}

/** As mãos de galhos retorcidos, saindo do punho em (0, 0) pra esquerda. */
function TwigHand() {
  const twigs = ["M2 -6 C-12 -12 -24 -10 -34 -2 L-38 10", "M2 0 C-14 0 -24 8 -30 22", "M2 4 C-8 12 -14 24 -14 36", "M4 6 C4 20 0 30 -6 40"];
  const tips: [number, number, number][] = [
    [-38, 10, 110],
    [-30, 22, 120],
    [-14, 36, 100],
    [-6, 40, 105],
  ];
  return (
    <g>
      {twigs.map((d) => (
        <g key={d} fill="none" strokeLinecap="round">
          <path d={d} stroke="#24170d" strokeWidth="6.5" />
          <path d={d} stroke="#5b3d22" strokeWidth="3" />
        </g>
      ))}
      {tips.map(([x, y, a]) => (
        <path key={`${x}-${y}`} d="M0 -2.5 L9 0 L0 2.5 Z" transform={`translate(${x} ${y}) rotate(${a})`} fill="#1c1917" />
      ))}
    </g>
  );
}

/** Palha espetada saindo de (x, y), virada pro ângulo `angle` (graus), com `count` fios. */
function Straw({ x, y, angle, spread = 50, length = 26, count = 9 }: { x: number; y: number; angle: number; spread?: number; length?: number; count?: number }) {
  return (
    <g strokeLinecap="round">
      {Array.from({ length: count }, (_, i) => {
        const a = ((angle - spread / 2 + (spread * i) / (count - 1)) * Math.PI) / 180;
        const len = length * (0.7 + ((i * 37) % 10) / 22);
        return (
          <path
            key={i}
            d={`M${x} ${y} L${(x + Math.cos(a) * len).toFixed(1)} ${(y + Math.sin(a) * len).toFixed(1)}`}
            stroke={i % 3 === 0 ? "#f2c766" : i % 3 === 1 ? "#d9a441" : "#a87a2a"}
            strokeWidth={i % 2 ? 2.4 : 1.6}
          />
        );
      })}
    </g>
  );
}

export function Espantabyte({ talking = false, className = "" }: { talking?: boolean; className?: string }) {
  const id = useSvgId();
  const rim = `url(#${id}-rim)`;
  return (
    <svg viewBox="0 0 400 560" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <pattern id={`${id}-plaid`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <rect width="22" height="22" fill="#6e2510" />
          <rect y="8" width="22" height="6" fill="#3d1206" opacity="0.85" />
          <rect x="8" width="6" height="22" fill="#3d1206" opacity="0.6" />
          <path d="M0 3 H22 M0 19 H22 M3 0 V22 M19 0 V22" stroke="#c2620f" strokeWidth="1" opacity="0.55" />
        </pattern>
        <linearGradient id={`${id}-denim`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b5a50" />
          <stop offset="1" stopColor="#16261f" />
        </linearGradient>
        <linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2b1b10" />
          <stop offset="0.6" stopColor="#5a3a22" />
          <stop offset="1" stopColor="#2b1b10" />
        </linearGradient>
        <radialGradient id={`${id}-pumpkin`} cx="235" cy="100" r="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fdba74" />
          <stop offset="0.35" stopColor="#ea580c" />
          <stop offset="0.8" stopColor="#9a3412" />
          <stop offset="1" stopColor="#5a1e08" />
        </radialGradient>
        <radialGradient id={`${id}-fire`} cx="200" cy="150" r="70" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fefce8" />
          <stop offset="0.4" stopColor="#fde047" />
          <stop offset="1" stopColor="#f97316" />
        </radialGradient>
        <linearGradient id={`${id}-hat`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a332c" />
          <stop offset="1" stopColor="#0f0c0a" />
        </linearGradient>
        <RimGradient id={`${id}-rim`} x1={20} x2={380} left="#93c5fd" right="#fb923c" />
      </defs>

      {/* estaca e travessa de madeira */}
      <path d={poly([[192, 186], [208, 186], [211, 560], [189, 560]])} fill={`url(#${id}-wood)`} stroke={rim} strokeWidth="1.5" />
      <path d={poly([[28, 214], [372, 211], [372, 226], [28, 229]])} fill={`url(#${id}-wood)`} />
      <path d="M196 260 L198 320 M203 380 L204 450 M199 480 L200 540" stroke="#1c120a" strokeWidth="1.4" opacity="0.7" />

      <g className="cg-anim-swing" style={animVars({ dur: 5, angle: 1.2, origin: "50% 100%" })}>
        {/* pernas penduradas, a calça rasgada e a palha saindo */}
        <Straw x={160} y={498} angle={100} spread={70} length={30} />
        <Straw x={220} y={510} angle={88} spread={60} length={34} />
        <path d={jagged([[160, 370], [196, 372], [192, 430], [172, 500], [148, 500], [164, 428]], 3, 10, 37)} fill={`url(#${id}-denim)`} stroke={rim} strokeWidth="2" />
        <path d={jagged([[204, 372], [240, 370], [238, 432], [233, 512], [207, 512], [212, 432]], 3, 10, 41)} fill={`url(#${id}-denim)`} stroke={rim} strokeWidth="2" />
        <path d={poly([[214, 452], [232, 450], [233, 470], [215, 472]])} fill="#7c4a1e" stroke="#2b1a10" strokeWidth="1" strokeDasharray="3 2" />
        <path d="M156 492 L176 494 M210 506 L232 506" stroke="#6b4423" strokeWidth="4" strokeLinecap="round" />

        {/* braços abertos na travessa, com cipós e mãos de galho */}
        {[0, 1].map((side) => (
          <g key={side} transform={side ? "translate(400 0) scale(-1 1)" : undefined}>
            <Straw x={56} y={225} angle={180} spread={80} length={36} count={13} />
            <path d={SCARECROW_SLEEVE} fill={`url(#${id}-plaid)`} stroke={rim} strokeWidth="2" />
            <path d="M150 226 C138 210 128 240 116 224 C104 208 92 240 80 224 C70 212 64 232 56 226" stroke="#3f6212" strokeWidth="3.4" fill="none" strokeLinecap="round" />
            {[
              [126, 214, -30],
              [96, 236, 30],
              [74, 216, -20],
            ].map(([x, y, a]) => (
              <path key={x} d="M0 0 C4 -6 12 -6 16 0 C12 6 4 6 0 0 Z" transform={`translate(${x} ${y}) rotate(${a})`} fill="#65a30d" />
            ))}
            <g transform="translate(54 226) scale(1.75)">
              <g className="cg-anim-swing" style={animVars({ dur: 2.2 + side * 0.4, angle: 6, origin: "100% 30%" })}>
                <TwigHand />
              </g>
            </g>
          </g>
        ))}

        {/* camisa xadrez, macacão remendado e cinto de corda */}
        <path d={poly([[144, 202], [256, 202], [252, 256], [148, 256]])} fill={`url(#${id}-plaid)`} stroke={rim} strokeWidth="2" />
        <path d={jagged([[158, 234], [242, 234], [246, 300], [250, 374], [150, 374], [154, 300]], 2, 14, 43)} fill={`url(#${id}-denim)`} stroke={rim} strokeWidth="2" />
        <path d={poly([[160, 236], [174, 236], [170, 204], [156, 206]])} fill="#2a4239" />
        <path d={poly(mirror([[160, 236], [174, 236], [170, 204], [156, 206]], 200))} fill="#2a4239" />
        <circle cx="167" cy="240" r="3.2" fill="#a16207" />
        <circle cx="233" cy="240" r="3.2" fill="#a16207" />
        <path d={poly([[184, 266], [214, 264], [216, 292], [182, 294]])} fill="#7c4a1e" stroke="#2b1a10" strokeWidth="1" />
        <path d="M188 270 L192 274 M196 268 L200 272 M206 268 L210 272 M188 288 L192 284 M206 288 L210 284" stroke="#e7d3a8" strokeWidth="1" />
        <path d="M150 330 Q200 340 250 330" stroke="#6b4423" strokeWidth="5" fill="none" />
        <path d="M232 334 L238 360 M236 334 L246 356" stroke="#6b4423" strokeWidth="3" strokeLinecap="round" />
        <MapleLeaf x={168} y={312} s={0.8} rotate={-20} color="#b91c1c" />
        <MapleLeaf x={236} y={286} s={0.65} rotate={30} color="#d97706" />

        {/* gola de palha amarrada com corda */}
        <Straw x={200} y={196} angle={90} spread={200} length={30} count={17} />
        <path d="M166 198 Q200 208 234 198" stroke="#6b4423" strokeWidth="5" fill="none" />

        {/* ---- cabeça de abóbora (inclinada) e chapéu ---- */}
        <g className="cg-anim-swing" style={animVars({ dur: 3.6, angle: 3, origin: "50% 100%" })}>
          <g transform="rotate(-6 200 130)">
            <path d={PUMPKIN} fill={`url(#${id}-pumpkin)`} stroke={rim} strokeWidth="2.5" />
            <g stroke="#7c2d12" strokeWidth="2.5" fill="none" opacity="0.55">
              <path d="M200 70 C193 100 193 160 200 192 M174 66 C160 96 158 160 170 190 M226 66 C240 96 242 160 230 190 M150 76 C136 104 134 156 146 182 M250 76 C264 104 266 156 254 182" />
            </g>
            <path d="M234 74 C246 84 252 102 252 120 M258 92 C264 104 266 116 266 128" stroke="#fed7aa" strokeWidth="2.5" fill="none" opacity="0.5" strokeLinecap="round" />
            {/* o rosto esculpido: borda escura (a casca grossa) e o fogo lá dentro */}
            <g stroke="#3b1203" strokeWidth="5" strokeLinejoin="round">
              <path d={CARVE_EYES} fill="#3b1203" />
              <path d={CARVE_NOSE} fill="#3b1203" />
              <path d={mouthPath(talking)} fill="#3b1203" />
            </g>
            <g style={{ filter: "drop-shadow(0 0 8px #fbbf24)" }}>
              <path d={CARVE_EYES} fill={`url(#${id}-fire)`} />
              <path d={CARVE_NOSE} fill={`url(#${id}-fire)`} />
              <path d={mouthPath(talking)} fill={`url(#${id}-fire)`} />
              <g className="cg-anim-eye" fill="#fff7ed" opacity="0.55">
                <path d={CARVE_EYES} />
                <path d={mouthPath(talking)} />
              </g>
            </g>

            <HatShape fill={`url(#${id}-hat)`} rim={rim} />
          </g>
        </g>
      </g>
    </svg>
  );
}

// O chapéu do Espantabyte: remendado, dobrado pra trás, com folhas na fita e um
// corvo na aba. Desenhado nas coordenadas da cabeça do espantalho.
const HAT_CONE = jagged(
  [
    [142, 88],
    [258, 82],
    [244, 50],
    [224, 26],
    [198, 12],
    [162, 8],
    [128, 16],
    [106, 32],
    [122, 32],
    [152, 30],
    [180, 38],
    [172, 60],
  ],
  3,
  18,
  47,
);
const HAT_BRIM = jagged(
  [
    [92, 96],
    [150, 84],
    [250, 78],
    [310, 84],
    [314, 94],
    [250, 100],
    [150, 104],
    [96, 108],
  ],
  4,
  16,
  53,
);

function HatShape({ fill, rim, crow = true }: { fill: string; rim: string; crow?: boolean }) {
  return (
    <g>
      <path d={HAT_CONE} fill={fill} stroke={rim} strokeWidth="2" />
      <path d={poly([[198, 40], [222, 37], [225, 58], [201, 61]])} fill="#4a4234" stroke="#16120e" strokeWidth="1" strokeDasharray="3 2" />
      <path d={HAT_BRIM} fill={fill} stroke={rim} strokeWidth="2" />
      <path d="M146 84 Q200 72 256 78" stroke="#7c4a1e" strokeWidth="7" fill="none" />
      <MapleLeaf x={160} y={80} s={1} rotate={-30} color="#dc2626" />
      <MapleLeaf x={178} y={76} s={0.85} rotate={10} color="#f59e0b" />
      <MapleLeaf x={246} y={78} s={0.9} rotate={40} color="#ea580c" />
      {crow && (
        <g transform="translate(286 52) scale(0.95)">
          <Crow perched />
        </g>
      )}
    </g>
  );
}

/** O chapéu do Espantabyte sozinho (caído no campo, ou brilhando como prêmio). */
export function ScarecrowHat({ className = "", glow = false }: { className?: string; glow?: boolean }) {
  const id = useSvgId();
  return (
    <svg viewBox="80 -10 250 130" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-hat`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a332c" />
          <stop offset="1" stopColor="#0f0c0a" />
        </linearGradient>
        <RimGradient id={`${id}-rim`} x1={80} x2={330} left="#93c5fd" right="#fbbf24" />
      </defs>
      {glow && (
        <g className="cg-anim-glow">
          <ellipse cx="205" cy="64" rx="120" ry="58" fill="#fbbf24" opacity="0.3" style={{ filter: "blur(14px)" }} />
        </g>
      )}
      <HatShape fill={`url(#${id}-hat)`} rim={`url(#${id}-rim)`} />
    </svg>
  );
}

/** O monte de palha que sobrou do Espantabyte. */
export function StrawPile({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 120" className={`overflow-visible ${className}`} aria-hidden="true">
      <path d={jagged([[20, 118], [60, 70], [120, 44], [190, 50], [250, 78], [286, 118]], 9, 9, 131)} fill="#b7832f" />
      <path d={jagged([[50, 118], [90, 84], [150, 66], [210, 76], [260, 118]], 7, 8, 137)} fill="#d9a441" />
      <g stroke="#f2c766" strokeWidth="2" strokeLinecap="round">
        {Array.from({ length: 16 }, (_, i) => {
          const x = 40 + i * 15;
          return <path key={i} d={`M${x} ${110 - (i % 4) * 6} L${x + ((i % 3) - 1) * 14} ${70 + (i % 5) * 8}`} />;
        })}
      </g>
      <path d="M90 100 L210 96" stroke="#6b4423" strokeWidth="4" />
      <path d={poly([[120, 104], [180, 100], [184, 116], [118, 118]])} fill="#2a4239" opacity="0.9" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Seu Lupércio, o vigia da torre do relógio (o Lobisloop sem o feitiço)
// ---------------------------------------------------------------------------

export function Lupercio({ className = "" }: { className?: string }) {
  const id = useSvgId();
  const rim = `url(#${id}-rim)`;
  return (
    <svg viewBox="0 0 220 400" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-coat`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#1e293b" />
          <stop offset="1" stopColor="#475569" />
        </linearGradient>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b7835a" />
          <stop offset="1" stopColor="#e8b98a" />
        </linearGradient>
        <RimGradient id={`${id}-rim`} x1={10} x2={210} left="#fbbf24" right="#cbd5e1" />
      </defs>
      {/* luz da lanterna */}
      <g className="cg-anim-glow"><circle cx="44" cy="150" r="58" fill="#fbbf24" opacity="0.22" /></g>
      {/* botas e pernas */}
      <path d="M86 392 L92 330 L110 330 L108 392 Z M118 392 L116 330 L134 330 L142 392 Z" fill="#111827" />
      <path d="M78 398 L110 398 L110 386 L84 386 Z M116 398 L150 398 L144 386 L118 386 Z" fill="#0b0f19" stroke={rim} strokeWidth="1.5" />
      {/* casaco comprido de vigia */}
      <path d={poly([[80, 150], [140, 150], [156, 250], [150, 340], [70, 340], [64, 250]])} fill={`url(#${id}-coat)`} stroke={rim} strokeWidth="2" />
      <path d={poly([[100, 152], [110, 220], [120, 152]])} fill="#e2e8f0" />
      <path d={poly([[86, 150], [110, 210], [100, 250], [78, 190]])} fill="#334155" />
      <path d={poly([[134, 150], [110, 210], [120, 250], [142, 190]])} fill="#3f4d63" />
      {[230, 262, 294].map((y) => (
        <circle key={y} cx="110" cy={y} r="3.4" fill="#ca8a04" stroke="#713f12" strokeWidth="0.8" />
      ))}
      <path d="M68 300 L152 300" stroke="#0f172a" strokeWidth="6" />
      <path d="M96 150 C100 166 120 166 124 150 L120 176 L100 176 Z" fill="#b91c1c" />
      {/* braço erguendo a lanterna e mão na cintura */}
      <path d={poly([[82, 156], [60, 168], [40, 160], [36, 172], [62, 186], [88, 182]])} fill="#334155" stroke={rim} strokeWidth="1.5" />
      <path d={poly([[138, 158], [160, 210], [146, 250], [134, 244], [144, 212], [130, 180]])} fill="#3f4d63" stroke={rim} strokeWidth="1.5" />
      <circle cx="36" cy="164" r="7" fill={`url(#${id}-skin)`} />
      <g transform="translate(44 124)">
        <path d="M-2 -8 C-2 -18 10 -18 10 -8" stroke="#713f12" strokeWidth="2.5" fill="none" />
        <path d={poly([[-10, -6], [18, -6], [14, 2], [-6, 2]])} fill="#3f3f46" />
        <rect x="-8" y="2" width="24" height="30" rx="3" fill="#fde68a" stroke="#3f3f46" strokeWidth="2.5" />
        <path d="M4 10 C-2 18 0 26 4 28 C8 26 10 18 4 10 Z" fill="#f97316" className="cg-anim-flicker" />
        <path d={poly([[-10, 32], [18, 32], [14, 38], [-6, 38]])} fill="#3f3f46" />
      </g>
      {/* cabeça: bigodão branco, sobrancelhas grossas e quepe de vigia */}
      <path d={poly([[98, 132], [122, 132], [124, 152], [96, 152]])} fill="#a8774f" />
      <path d="M110 74 C128 74 136 88 136 104 C136 124 126 140 110 142 C94 140 84 124 84 104 C84 88 92 74 110 74 Z" fill={`url(#${id}-skin)`} stroke={rim} strokeWidth="1.5" />
      <path d="M86 108 L80 112 L84 122 Z M134 108 L140 112 L136 122 Z" fill="#b7835a" />
      <path d="M110 104 L106 118 L114 118 Z" fill="#a8774f" />
      <path d={jagged([[92, 122], [128, 122], [136, 132], [122, 130], [110, 126], [98, 130], [84, 132]], 3, 5, 59)} fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.8" />
      <path d="M96 99 L106 100 M114 100 L124 99" stroke="#1c1917" strokeWidth="2.6" strokeLinecap="round" />
      <path d={jagged([[90, 92], [106, 94], [106, 96], [90, 96]], 2, 4, 61)} fill="#e2e8f0" />
      <path d={jagged([[114, 94], [130, 92], [130, 96], [114, 96]], 2, 4, 67)} fill="#e2e8f0" />
      <path d="M84 84 C86 64 134 64 136 84 Z" fill="#1e293b" stroke={rim} strokeWidth="1.5" />
      <path d="M80 86 L140 86 L146 92 L84 92 Z" fill="#0f172a" />
      <circle cx="110" cy="76" r="5" fill="#ca8a04" stroke="#fde68a" strokeWidth="0.8" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Dracoding de Bolso (o vampiro encolhido, de óculos escuros) — viewBox 200×160
// ---------------------------------------------------------------------------

export function MiniDracoding({ className = "" }: { className?: string }) {
  const id = useSvgId();
  return (
    <svg viewBox="0 0 200 160" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a39fc0" />
          <stop offset="1" stopColor="#efedf8" />
        </linearGradient>
        <radialGradient id={`${id}-lining`} cx="100" cy="90" r="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e11d48" />
          <stop offset="1" stopColor="#4c0519" />
        </radialGradient>
      </defs>
      {/* asas-capa batendo */}
      {[0, 1].map((side) => (
        <g key={side} transform={side ? "translate(200 0) scale(-1 1)" : undefined}>
          <g className="cg-anim-wing-l" style={{ transformOrigin: "100% 30%" }}>
            <path d="M84 78 L40 52 L6 66 Q22 74 18 88 Q34 86 38 102 Q52 94 62 110 Q70 96 86 100 Z" fill="#07050b" />
            <path d="M80 82 L42 60 L18 70 Q30 78 28 88 Q40 88 44 98 Q54 94 62 104 Q68 94 82 96 Z" fill={`url(#${id}-lining)`} />
            <path d="M84 78 L40 52 M84 82 L28 88 M84 86 L44 98 M84 90 L62 108" stroke="#1a0208" strokeWidth="1.6" />
          </g>
        </g>
      ))}
      {/* corpinho de fraque e gola alta */}
      <path d={poly([[86, 96], [114, 96], [118, 140], [82, 140]])} fill="#0f0b16" />
      <path d={poly([[94, 98], [106, 98], [100, 122]])} fill="#f1f5f9" />
      <circle cx="100" cy="114" r="3" fill="#e11d48" />
      <path d="M90 140 L88 152 M110 140 L112 152" stroke="#0f0b16" strokeWidth="5" strokeLinecap="round" />
      <path d={poly([[88, 98], [70, 72], [84, 76], [80, 60], [96, 86]])} fill="#0b0810" />
      <path d={poly(mirror([[88, 98], [70, 72], [84, 76], [80, 60], [96, 86]], 100))} fill="#0b0810" />
      {/* cabeça com orelhas pontudas, cabelo de bico e óculos escuros */}
      <path d="M72 62 L60 46 L76 56 Z M128 62 L140 46 L124 56 Z" fill={`url(#${id}-skin)`} />
      <path d="M100 30 C118 30 128 44 128 62 C128 78 116 92 100 94 C84 92 72 78 72 62 C72 44 82 30 100 30 Z" fill={`url(#${id}-skin)`} />
      <path d="M71 60 C68 38 84 26 100 26 C116 26 132 38 129 60 C126 48 120 42 112 40 L100 54 L88 40 C80 42 74 48 71 60 Z" fill="#0b0810" />
      <path d="M82 34 C90 30 110 30 118 34" stroke="#6366f1" strokeWidth="1.4" fill="none" opacity="0.6" />
      <path d="M76 62 L98 62 L96 72 L80 72 Z M102 62 L124 62 L120 72 L104 72 Z" fill="#0a0a0a" stroke="#27272a" strokeWidth="1" />
      <path d="M98 64 L102 64" stroke="#0a0a0a" strokeWidth="2" />
      <path d="M80 64 L86 64 M106 64 L112 64" stroke="#a5f3fc" strokeWidth="1.6" opacity="0.8" strokeLinecap="round" />
      <path d="M90 80 Q100 86 110 80" stroke="#2a0510" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M93 82 L95 88 L97 83 Z M103 83 L105 88 L107 82 Z" fill="#fff" />
    </svg>
  );
}
