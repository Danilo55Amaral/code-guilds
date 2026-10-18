"use client";

import WizardDanilo from "../WizardDanilo";

// ============================================================================
// BANNER DA BIBLIOTECA VIRTUAL — o grande salão de leitura da Academia: os
// arcos de pedra com as estantes até o teto, a rosácea de vitral girando
// devagar e jogando feixes de luz colorida, livros voando em roda em volta
// dela, lampiões balançando nas correntes, a escada de biblioteca, os
// símbolos das matérias subindo como fumaça mágica e o Mago Danilo com o
// livro aberto flutuando na frente dele, virando as páginas sozinho.
// ============================================================================

const SPINES = ["#7c2d12", "#1e3a8a", "#14532d", "#581c87", "#92400e", "#0f766e", "#831843", "#3f3f46", "#713f12", "#312e81", "#065f46", "#9f1239"];

/** Os livros de uma estante: sorteados uma vez só (sempre o mesmo resultado). */
function shelfBooks(x0: number, x1: number, bases: number[], seed0: number) {
  return bases.flatMap((base, row) => {
    const list: { x: number; w: number; h: number; c: string; base: number }[] = [];
    let seed = seed0 + row * 17;
    const next = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let x = x0; x < x1 - 10; ) {
      const w = 10 + Math.round(next() * 10);
      list.push({ x, w, h: 40 + Math.round(next() * 26), c: SPINES[Math.floor(next() * SPINES.length)], base });
      x += w + (next() < 0.12 ? 8 : 1.5);
    }
    return list;
  });
}

const SHELF_ROWS = [120, 196, 272, 348];
const LEFT_BOOKS = shelfBooks(18, 282, SHELF_ROWS, 11);
const MID_BOOKS = shelfBooks(328, 548, SHELF_ROWS, 29);
const RIGHT_BOOKS = shelfBooks(978, 1190, SHELF_ROWS, 47);

const GLASS = ["#2563eb", "#7c3aed", "#dc2626", "#f59e0b", "#059669", "#db2777"];
const RUNES: [string, number, number][] = [
  ["π", 620, 0],
  ["DNA", 700, 1.3],
  ["H₂O", 820, 2.4],
  ["E=mc²", 900, 0.7],
  ["Aa", 660, 3.1],
  ["∑", 860, 1.9],
  ["√x", 760, 3.6],
];
// o caminho dos livros voando em roda em volta da rosácea
const ORBIT = "M560 168 A200 64 0 1 1 960 168 A200 64 0 1 1 560 168 Z";
const ORBIT_BOOKS = ["#b91c1c", "#1d4ed8", "#059669", "#7c3aed", "#d97706"];

function Shelf({ books, x0, x1 }: { books: ReturnType<typeof shelfBooks>; x0: number; x1: number }) {
  return (
    <g>
      <rect x={x0} y="40" width={x1 - x0} height="380" fill="#1c0f06" />
      {books.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={b.base - b.h} width={b.w} height={b.h} rx="1.2" fill={b.c} />
          <rect x={b.x} y={b.base - b.h + 6} width={b.w} height="2.5" fill="#fbbf24" opacity="0.5" />
          <rect x={b.x + 1} y={b.base - b.h + 2} width="2" height={b.h - 4} fill="#fff" opacity="0.08" />
        </g>
      ))}
      {SHELF_ROWS.map((y) => (
        <g key={y}>
          <rect x={x0} y={y} width={x1 - x0} height="10" fill="#4a2a14" />
          <rect x={x0} y={y} width={x1 - x0} height="2.5" fill="#7c4a24" />
        </g>
      ))}
    </g>
  );
}

/** Um arco de pedra por cima de uma estante. */
function Arch({ x0, x1 }: { x0: number; x1: number }) {
  const mid = (x0 + x1) / 2;
  const r = (x1 - x0) / 2;
  return (
    <g>
      <path d={`M${x0 - 14} 420 L${x0 - 14} 60 A${r + 14} ${r * 0.4 + 14} 0 0 1 ${x1 + 14} 60 L${x1 + 14} 420 L${x1} 420 L${x1} 60 A${r} ${r * 0.4} 0 0 0 ${x0} 60 L${x0} 420 Z`} fill="#3b2a1d" stroke="#1c120a" strokeWidth="2" />
      <path d={`M${x0} 60 A${r} ${r * 0.4} 0 0 1 ${x1} 60`} fill="none" stroke="#6b5440" strokeWidth="2" />
      <circle cx={mid} cy={60 - r * 0.4 - 4} r="6" fill="#fbbf24" opacity="0.7" />
    </g>
  );
}

function FlyingBook({ color }: { color: string }) {
  return (
    <g>
      {[0, 1].map((side) => (
        <g key={side} transform={side ? "scale(-1 1)" : undefined}>
          <g className="cg-anim-aura-wing" style={{ "--cg-dur": "0.6s" } as React.CSSProperties}>
            <path d="M0 0 L-18 -5 L-20 8 L0 13 Z" fill={color} stroke="#0b0b10" strokeWidth="1" />
            <path d="M-2 2 L-15 -1 L-16 7 L-2 11 Z" fill="#fbf0d0" />
          </g>
        </g>
      ))}
      <rect x="-1.5" y="-1" width="3" height="15" rx="1" fill="#fde68a" />
    </g>
  );
}

function HallScene() {
  return (
    <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="vlib-rose" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fef3c7" stopOpacity="0.9" />
          <stop offset="0.6" stopColor="#a78bfa" stopOpacity="0.35" />
          <stop offset="1" stopColor="#1e1b4b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vlib-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fde68a" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="vlib-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1709" />
          <stop offset="1" stopColor="#0b0603" />
        </linearGradient>
      </defs>

      {/* as estantes nos arcos */}
      <Shelf books={LEFT_BOOKS} x0={10} x1={290} />
      <Shelf books={MID_BOOKS} x0={320} x1={556} />
      <Shelf books={RIGHT_BOOKS} x0={970} x1={1200} />
      <Arch x0={10} x1={290} />
      <Arch x0={320} x1={556} />
      <Arch x0={970} x1={1200} />

      {/* a escada de biblioteca encostada na estante da direita */}
      <g opacity="0.9">
        <path d="M1010 410 L1050 90 M1060 410 L1098 90" stroke="#7c4a24" strokeWidth="7" strokeLinecap="round" />
        {Array.from({ length: 9 }, (_, i) => {
          const t = (i + 0.5) / 9;
          const y = 410 - t * 320;
          return <path key={i} d={`M${1010 + t * 40} ${y} L${1060 + t * 38} ${y}`} stroke="#a16207" strokeWidth="5" />;
        })}
      </g>

      {/* a rosácea de vitral, girando devagar, e a luz que ela joga */}
      <path d="M690 230 L560 420 L780 420 Z" fill="url(#vlib-beam)" className="cg-anim-beam" />
      <path d="M830 230 L800 420 L1010 420 Z" fill="url(#vlib-beam)" className="cg-anim-beam" style={{ animationDelay: "0.6s" }} />
      <circle cx="760" cy="160" r="150" fill="url(#vlib-rose)" className="cg-anim-glow" style={{ "--cg-dur": "4s" } as React.CSSProperties} />
      <circle cx="760" cy="160" r="104" fill="#1c120a" stroke="#6b5440" strokeWidth="8" />
      <g className="cg-anim-spin-slow" style={{ animationDuration: "80s", transformOrigin: "760px 160px", transformBox: "view-box" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <g key={i} transform={`rotate(${i * 30} 760 160)`}>
            <path d="M760 160 L742 70 A92 92 0 0 1 778 70 Z" fill={GLASS[i % GLASS.length]} opacity="0.85" stroke="#1c120a" strokeWidth="3" />
            <circle cx="760" cy="84" r="7" fill={GLASS[(i + 3) % GLASS.length]} stroke="#1c120a" strokeWidth="2" />
          </g>
        ))}
      </g>
      <circle cx="760" cy="160" r="30" fill="#fef3c7" stroke="#1c120a" strokeWidth="4" />
      {/* um livro aberto no centro do vitral */}
      <path d="M760 172 C752 166 740 165 732 167 L734 150 C742 148 752 149 760 155 Z M760 172 C768 166 780 165 788 167 L786 150 C778 148 768 149 760 155 Z" fill="#92400e" />

      {/* livros voando em roda em volta da rosácea */}
      {ORBIT_BOOKS.map((color, i) => (
        <g key={color}>
          <animateMotion dur="22s" begin={`${-i * 4.4}s`} repeatCount="indefinite" path={ORBIT} />
          <FlyingBook color={color} />
        </g>
      ))}

      {/* lampiões balançando */}
      {[
        [470, 0],
        [620, 0.8],
        [905, 1.5],
      ].map(([x, d]) => (
        <g key={x} className="cg-anim-swing" style={{ "--cg-origin": "50% 0%", "--cg-dur": "4s", "--cg-delay": `${d}s` } as React.CSSProperties}>
          <line x1={x} y1="0" x2={x} y2="60" stroke="#78716c" strokeWidth="2" />
          <circle cx={x} cy="76" r="26" fill="#fbbf24" opacity="0.25" className="cg-anim-glow" />
          <path d={`M${x - 10} 62 L${x + 10} 62 L${x + 13} 88 L${x - 13} 88 Z`} fill="#fde68a" stroke="#78350f" strokeWidth="2.5" />
          <rect x={x - 15} y="86" width="30" height="5" rx="2" fill="#78350f" />
          <path d={`M${x - 7} 58 L${x + 7} 58 L${x} 52 Z`} fill="#78350f" />
        </g>
      ))}

      {/* os símbolos das matérias subindo */}
      {RUNES.map(([rune, x, d]) => (
        <text
          key={rune}
          x={x}
          y="380"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fontFamily="Georgia, serif"
          fill="#fde68a"
          className="cg-anim-aura-rise"
          style={{ "--cg-dur": "5s", "--cg-delay": `${d}s`, filter: "drop-shadow(0 0 5px #fbbf24)" } as React.CSSProperties}
        >
          {rune}
        </text>
      ))}

      {/* o chão de madeira e a poeira de luz */}
      <rect x="0" y="392" width="1200" height="28" fill="url(#vlib-floor)" />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={((i * 89) % 1180) + 10} cy={((i * 47) % 360) + 20} r={i % 4 === 0 ? 2 : 1.2} fill="#fde68a" className="cg-anim-twinkle" style={{ animationDelay: `${(i % 8) * 0.4}s` }} />
      ))}
    </svg>
  );
}

/** O livro aberto flutuando na frente do mago: as páginas viram sozinhas e soltam faíscas. */
function FloatingBook({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 150" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id="vlib-bookglow" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="#fef3c7" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="80" rx="95" ry="64" fill="url(#vlib-bookglow)" className="cg-anim-glow" />
      <g className="cg-anim-float">
        {/* a capa por baixo */}
        <path d="M100 112 C80 102 46 100 20 106 L26 74 C52 68 82 70 100 80 Z" fill="#064e3b" />
        <path d="M100 112 C120 102 154 100 180 106 L174 74 C148 68 118 70 100 80 Z" fill="#065f46" />
        {/* as páginas */}
        <path d="M100 106 C82 96 52 94 28 99 L33 70 C57 65 84 67 100 76 Z" fill="#fbf0d0" stroke="#a87d3f" strokeWidth="1.2" />
        <path d="M100 106 C118 96 148 94 172 99 L167 70 C143 65 116 67 100 76 Z" fill="#f6e3b4" stroke="#a87d3f" strokeWidth="1.2" />
        {[78, 84, 90].map((y) => (
          <path key={y} d={`M40 ${y} C58 ${y - 3} 78 ${y - 2} 92 ${y + 3} M108 ${y + 3} C122 ${y - 2} 142 ${y - 3} 160 ${y}`} stroke="#b08a52" strokeWidth="1" fill="none" opacity="0.7" />
        ))}
        <path
          d="M100 76 C116 67 143 65 167 70 L172 99 C148 94 118 96 100 106 Z"
          fill="#fffaeb"
          stroke="#a87d3f"
          strokeWidth="1"
          className="cg-anim-lib-page"
          style={{ "--cg-dur": "3s" } as React.CSSProperties}
        />
        {[
          [60, 0],
          [100, 0.9],
          [140, 1.8],
          [80, 2.4],
          [124, 1.3],
        ].map(([x, d], i) => (
          <path
            key={i}
            d={`M${x} 52 l2 5 l5 1 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -1 Z`}
            fill="#fde68a"
            className="cg-anim-aura-rise"
            style={{ "--cg-dur": "2.6s", "--cg-delay": `${d}s`, filter: "drop-shadow(0 0 4px #fbbf24)" } as React.CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}

export default function VirtualLibraryBanner({ subjects, ready, chapters }: { subjects: number; ready: number; chapters: number }) {
  return (
    <div
      className="cg-dark-scope relative mb-6 overflow-hidden rounded-3xl border border-amber-500/30"
      style={{
        background:
          "radial-gradient(45% 70% at 63% 38%, rgba(167,139,250,0.35), transparent 70%), radial-gradient(40% 60% at 95% 95%, rgba(245,158,11,0.28), transparent 70%), linear-gradient(170deg, #160c05 0%, #2b170a 55%, #140d26 100%)",
        boxShadow: "0 24px 70px -30px rgba(167,139,250,0.6)",
      }}
    >
      <HallScene />
      {/* escurece o lado do texto, pra ler bem por cima das estantes */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/5" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="relative flex flex-col items-center gap-2 p-6 sm:min-h-[300px] sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="relative max-w-xl self-center text-center sm:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">📚 Biblioteca Virtual</p>
          <h1 className="cg-anim-shimmer mt-2 font-serif text-4xl font-black uppercase tracking-wide sm:text-5xl">Biblioteca da Academia</h1>
          <p className="mt-2 text-sm text-amber-50/85">
            Aqui ficam os livros de cada matéria dos tomos do conhecimento. Escolha um livro, abra e leia com calma: tem explicação de livro didático, desenhos que se
            mexem e testes rápidos pra você chegar nas missões sabendo tudo!
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="rounded-full border border-amber-400/40 bg-black/40 px-3 py-1.5 text-xs font-semibold text-amber-100 backdrop-blur">📚 {subjects} matérias na estante</span>
            <span className="rounded-full border border-emerald-400/40 bg-black/40 px-3 py-1.5 text-xs font-semibold text-emerald-100 backdrop-blur">
              📖 {ready} {ready === 1 ? "livro pronto" : "livros prontos"} pra ler
            </span>
            <span className="rounded-full border border-violet-400/40 bg-black/40 px-3 py-1.5 text-xs font-semibold text-violet-100 backdrop-blur">🔖 {chapters} capítulos</span>
          </div>
        </div>

        {/* o Mago Danilo com o livro flutuando na frente */}
        <div className="pointer-events-none relative -mb-6 h-48 shrink-0 sm:-mb-8 sm:mr-2 sm:h-[300px]">
          <div className="cg-anim-wizard-enter h-full">
            <div className="cg-anim-float h-full">
              <WizardDanilo mouthOpen={false} burstKey={0} className="h-full w-auto drop-shadow-[0_0_24px_rgba(167,139,250,0.45)]" />
            </div>
          </div>
          <FloatingBook className="absolute -left-[46%] bottom-[8%] w-[84%]" />
        </div>
      </div>
    </div>
  );
}
