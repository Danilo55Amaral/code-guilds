"use client";

import WizardDanilo from "../WizardDanilo";

// ============================================================================
// BANNER DA BIBLIOTECA DE MISSÕES — a biblioteca mágica da CodeGuilds: as
// estantes cheias de livros ao fundo, a janela em arco com a lua, velas
// flutuando (a chama tremendo), livros voando e batendo as capas como asas,
// poeira de luz no ar e o Mago Danilo atrás do púlpito, com o livro aberto
// brilhando, virando as páginas e soltando runas do conhecimento.
// ============================================================================

// Livros das estantes, sorteados uma vez só (sempre o mesmo resultado): [x, largura, altura, cor, inclinação]
const SPINE_COLORS = ["#7c2d12", "#1e3a8a", "#14532d", "#581c87", "#92400e", "#0f766e", "#831843", "#3f3f46", "#713f12", "#312e81"];
const SHELVES = [128, 248, 368]; // a altura de cada prateleira (o pé dos livros)
const BOOKS = SHELVES.flatMap((base, row) => {
  const list: [number, number, number, string, number][] = [];
  let seed = 7 + row * 31;
  const next = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let x = 8; x < 1192; ) {
    // o vão da janela fica sem livros
    if (x > 690 && x < 860) {
      x = 860;
      continue;
    }
    const w = 13 + Math.round(next() * 13);
    const h = 58 + Math.round(next() * 36);
    const tilt = next() < 0.08 ? (next() < 0.5 ? -9 : 9) : 0;
    list.push([x, w, h, SPINE_COLORS[Math.floor(next() * SPINE_COLORS.length)], tilt]);
    x += w + (next() < 0.15 ? 10 : 2);
  }
  return list.map(([x, w, h, c, t]) => ({ x, w, h, c, t, base }));
});

// Velas flutuando: [x, y, atraso]
const CANDLES: [number, number, number][] = [
  [110, 40, 0],
  [330, 70, 1.1],
  [600, 28, 0.5],
  [800, 62, 1.6],
  [1030, 40, 0.8],
];
// Poeira de luz: [x, y, atraso]
const DUST = Array.from({ length: 26 }, (_, i) => [((i * 97) % 1180) + 10, ((i * 53) % 360) + 20, (i % 9) * 0.35] as [number, number, number]);

/** Um livro voando: as duas capas batem como asas (girando pela lombada). */
function FlyingBook({ color }: { color: string }) {
  return (
    <g>
      {[0, 1].map((side) => (
        <g key={side} transform={side ? "scale(-1 1)" : undefined}>
          <g className="cg-anim-aura-wing" style={{ "--cg-dur": "0.55s" } as React.CSSProperties}>
            <path d="M0 0 L-22 -6 L-24 10 L0 16 Z" fill={color} stroke="#0b0b10" strokeWidth="1" />
            <path d="M-2 2 L-19 -2 L-20 9 L-2 13 Z" fill="#fbf0d0" />
          </g>
        </g>
      ))}
      <rect x="-2" y="-1" width="4" height="18" rx="1" fill="#fde68a" />
    </g>
  );
}

function LibraryScene() {
  return (
    <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id="lib-moonlight" cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#c7d2fe" stopOpacity="0.55" />
          <stop offset="1" stopColor="#1e1b4b" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lib-candle" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fde68a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* a janela em arco, com o céu da noite e a lua */}
      <g>
        <path d="M700 400 L700 150 A75 75 0 0 1 850 150 L850 400 Z" fill="#0b1030" stroke="#3b2414" strokeWidth="10" />
        <circle cx="775" cy="190" r="140" fill="url(#lib-moonlight)" />
        <circle cx="806" cy="138" r="22" fill="#fef3c7" />
        <circle cx="816" cy="131" r="20" fill="#0b1030" />
        {[
          [730, 120, 0],
          [760, 210, 0.7],
          [825, 230, 1.4],
          [740, 300, 0.4],
          [810, 330, 1.9],
          [770, 160, 1.1],
        ].map(([x, y, d], i) => (
          <circle key={i} cx={x} cy={y} r="1.8" fill="#fff" className="cg-anim-twinkle" style={{ animationDelay: `${d}s` }} />
        ))}
        <path d="M775 76 L775 400 M700 240 L850 240" stroke="#3b2414" strokeWidth="6" />
      </g>

      {/* as estantes com os livros */}
      <g opacity="0.75">
        {BOOKS.map((b, i) => (
          <g key={i} transform={b.t ? `rotate(${b.t} ${b.x + b.w / 2} ${b.base})` : undefined}>
            <rect x={b.x} y={b.base - b.h} width={b.w} height={b.h} rx="1.5" fill={b.c} />
            <rect x={b.x} y={b.base - b.h + 8} width={b.w} height="3" fill="#fbbf24" opacity="0.55" />
            <rect x={b.x} y={b.base - 14} width={b.w} height="2.5" fill="#fbbf24" opacity="0.4" />
            <rect x={b.x + 1} y={b.base - b.h + 2} width="2.5" height={b.h - 4} fill="#fff" opacity="0.08" />
          </g>
        ))}
        {SHELVES.map((y) => (
          <g key={y}>
            <rect x="0" y={y} width="700" height="12" fill="#4a2a14" />
            <rect x="850" y={y} width="350" height="12" fill="#4a2a14" />
            <rect x="0" y={y} width="700" height="3" fill="#7c4a24" />
            <rect x="850" y={y} width="350" height="3" fill="#7c4a24" />
          </g>
        ))}
      </g>

      {/* poeira de luz no ar */}
      {DUST.map(([x, y, d], i) => (
        <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 2.2 : 1.3} fill="#fde68a" className="cg-anim-twinkle" style={{ animationDelay: `${d}s` }} />
      ))}

      {/* as velas flutuando */}
      {CANDLES.map(([x, y, d], i) => (
        <g key={i} className="cg-anim-float" style={{ animationDelay: `${d}s` }}>
          <circle cx={x} cy={y - 6} r="34" fill="url(#lib-candle)" />
          <rect x={x - 6} y={y} width="12" height="34" rx="2" fill="#fef3c7" />
          <path d={`M${x - 6} ${y + 4} C${x - 3} ${y + 10} ${x - 1} ${y + 4} ${x + 1} ${y + 12} C${x + 3} ${y + 6} ${x + 5} ${y + 9} ${x + 6} ${y + 3} L${x + 6} ${y} L${x - 6} ${y} Z`} fill="#fde68a" />
          <path d={`M${x} ${y} L${x} ${y - 4}`} stroke="#1c1917" strokeWidth="1.4" />
          <g className="cg-anim-flicker">
            <path d={`M${x} ${y - 22} C${x + 6} ${y - 14} ${x + 5} ${y - 5} ${x} ${y - 3} C${x - 5} ${y - 5} ${x - 6} ${y - 14} ${x} ${y - 22} Z`} fill="#f97316" />
            <path d={`M${x} ${y - 16} C${x + 3} ${y - 11} ${x + 3} ${y - 6} ${x} ${y - 4.5} C${x - 3} ${y - 6} ${x - 3} ${y - 11} ${x} ${y - 16} Z`} fill="#fef9c3" />
          </g>
        </g>
      ))}

      {/* livros voando pela biblioteca */}
      {[
        ["#7c3aed", 90, 15, 0],
        ["#0f766e", 190, 19, -8],
        ["#b45309", 300, 22, -14],
      ].map(([color, y, dur, delay], i) => (
        <g
          key={i}
          className="cg-anim-lib-fly"
          style={{ "--cg-tx": "1380px", "--cg-ty": `${-30 - i * 12}px`, "--cg-dur": `${dur}s`, "--cg-delay": `${delay}s` } as React.CSSProperties}
        >
          <g transform={`translate(-90 ${y as number}) rotate(-8)`}>
            <FlyingBook color={color as string} />
          </g>
        </g>
      ))}
    </svg>
  );
}

/** O púlpito com o livro aberto brilhando: a página vira sem parar e as runas sobem. */
function Lectern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`overflow-visible ${className}`} aria-hidden="true">
      <defs>
        <radialGradient id="lib-bookglow" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0" stopColor="#fef3c7" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#fbbf24" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lib-wood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#451a03" />
          <stop offset="0.5" stopColor="#92400e" />
          <stop offset="1" stopColor="#451a03" />
        </linearGradient>
      </defs>
      {/* o pé do púlpito */}
      <path d="M86 92 L114 92 L118 180 L82 180 Z" fill="url(#lib-wood)" stroke="#1c0a02" strokeWidth="1.5" />
      <path d="M56 180 L144 180 L150 196 L50 196 Z" fill="#78350f" stroke="#1c0a02" strokeWidth="1.5" />
      <path d="M82 120 L118 120 M83 150 L117 150" stroke="#fbbf24" strokeWidth="2" opacity="0.6" />
      {/* o tampo inclinado */}
      <path d="M30 80 L170 80 L178 98 L22 98 Z" fill="#92400e" stroke="#1c0a02" strokeWidth="1.5" />
      {/* a luz saindo do livro */}
      <ellipse cx="100" cy="50" rx="80" ry="60" fill="url(#lib-bookglow)" className="cg-anim-glow" />
      <path d="M60 70 L40 -40 L160 -40 L140 70 Z" fill="#fde68a" opacity="0.12" className="cg-anim-beam" />
      {/* o livro aberto */}
      <path d="M100 84 C84 76 58 74 36 78 L40 52 C62 48 86 50 100 58 Z" fill="#fbf0d0" stroke="#a87d3f" strokeWidth="1.2" />
      <path d="M100 84 C116 76 142 74 164 78 L160 52 C138 48 114 50 100 58 Z" fill="#f6e3b4" stroke="#a87d3f" strokeWidth="1.2" />
      {[60, 65, 70].map((y) => (
        <path key={y} d={`M48 ${y} C64 ${y - 3} 82 ${y - 2} 94 ${y + 2} M106 ${y + 2} C118 ${y - 2} 136 ${y - 3} 152 ${y}`} stroke="#b08a52" strokeWidth="1" fill="none" opacity="0.7" />
      ))}
      {/* a página virando */}
      <path
        d="M100 58 C114 50 138 48 160 52 L164 78 C142 74 116 76 100 84 Z"
        fill="#fffaeb"
        stroke="#a87d3f"
        strokeWidth="1"
        className="cg-anim-lib-page"
        style={{ "--cg-dur": "3.8s" } as React.CSSProperties}
      />
      {/* as runas do conhecimento subindo */}
      {(
        [
          ["</>", 62, 0],
          ["π", 92, 0.8],
          ["★", 120, 1.6],
          ["∑", 140, 2.4],
          ["{ }", 78, 3.1],
          ["01", 108, 2],
        ] as [string, number, number][]
      ).map(([rune, x, d]) => (
        <text
          key={rune}
          x={x}
          y="44"
          textAnchor="middle"
          fontSize="13"
          fontWeight="bold"
          fontFamily="monospace"
          fill="#fde68a"
          className="cg-anim-aura-rise"
          style={{ "--cg-dur": "3.2s", "--cg-delay": `${d}s`, filter: "drop-shadow(0 0 4px #fbbf24)" } as React.CSSProperties}
        >
          {rune}
        </text>
      ))}
    </svg>
  );
}

export default function LibraryBanner({ total, done, subjects }: { total: number; done: number; subjects: number }) {
  return (
    <div
      className="cg-dark-scope relative mb-6 overflow-hidden rounded-3xl border border-amber-500/30"
      style={{
        background:
          "radial-gradient(55% 80% at 52% 40%, rgba(99,102,241,0.28), transparent 70%), radial-gradient(45% 70% at 90% 90%, rgba(245,158,11,0.3), transparent 70%), linear-gradient(160deg, #120a05 0%, #2a1609 50%, #1a1033 100%)",
        boxShadow: "0 24px 70px -30px rgba(245,158,11,0.6)",
      }}
    >
      <LibraryScene />
      {/* escurece o lado do texto, pra ler bem por cima das estantes */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="relative flex flex-col items-center gap-2 p-6 sm:min-h-[300px] sm:flex-row sm:items-end sm:justify-between sm:p-8">
        <div className="relative max-w-xl self-center text-center sm:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">📜 Missões da Academia</p>
          <h1 className="cg-anim-shimmer mt-2 font-serif text-4xl font-black uppercase tracking-wide sm:text-5xl">Biblioteca de Missões</h1>
          <p className="mt-2 text-sm text-amber-50/85">
            Cada tomo guarda as missões de uma matéria. Escolha um livro, abra o pergaminho e prove o seu conhecimento pra ganhar XP, moedas e itens!
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="rounded-full border border-amber-400/40 bg-black/40 px-3 py-1.5 text-xs font-semibold text-amber-100 backdrop-blur">📚 {subjects} matérias</span>
            <span className="rounded-full border border-violet-400/40 bg-black/40 px-3 py-1.5 text-xs font-semibold text-violet-100 backdrop-blur">⚔️ {total} missões</span>
            <span className="rounded-full border border-emerald-400/40 bg-black/40 px-3 py-1.5 text-xs font-semibold text-emerald-100 backdrop-blur">✓ {done} concluídas</span>
          </div>
        </div>

        {/* o Mago Danilo atrás do púlpito */}
        <div className="pointer-events-none relative -mb-6 h-48 shrink-0 sm:-mb-8 sm:mr-2 sm:h-[300px]">
          <div className="cg-anim-wizard-enter h-full">
            <div className="cg-anim-float h-full">
              <WizardDanilo mouthOpen={false} burstKey={0} className="h-full w-auto drop-shadow-[0_0_24px_rgba(250,204,21,0.4)]" />
            </div>
          </div>
          <Lectern className="absolute -left-[38%] bottom-[2%] w-[78%]" />
        </div>
      </div>
    </div>
  );
}
