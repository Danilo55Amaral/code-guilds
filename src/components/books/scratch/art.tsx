"use client";

import type { ReactNode } from "react";

// ============================================================================
// PEÇAS DO LIVRO DE SCRATCH — os blocos do Scratch desenhados (com o encaixe
// de cima e de baixo, o chapéu dos eventos, o "C" das repetições e das
// condições, os campos brancos, as condições hexagonais e as variáveis), nas
// cores de cada categoria; o gato laranja (o nosso, desenhado pro livro) e a
// moldura do palco.
//
// O texto de um bloco usa marcações: (10) é o campo branco, [borda] é a lista
// de escolher, {pontos} é a variável (ou o valor de um sensor, como {resposta}),
// «tocando em [borda]?» é a condição e ⟦junte (a) (b)⟧ é um operador dentro do bloco.
// ============================================================================

export type Cat = "mov" | "apa" | "som" | "eve" | "con" | "sen" | "ope" | "var" | "lis" | "meu" | "can";

/** A cor de cada categoria (o bloco e a borda mais escura). */
export const CAT_COLOR: Record<Cat, [string, string]> = {
  mov: ["#4C97FF", "#3373CC"],
  apa: ["#9966FF", "#774DCB"],
  som: ["#CF63CF", "#BD42BD"],
  eve: ["#FFBF00", "#CC9900"],
  con: ["#FFAB19", "#CF8B17"],
  sen: ["#5CB1D6", "#2E8EB8"],
  ope: ["#59C059", "#389438"],
  var: ["#FF8C1A", "#DB6E00"],
  lis: ["#FF661A", "#E64D00"],
  meu: ["#FF6680", "#FF3355"],
  can: ["#0FBD8C", "#0B8E69"],
};

export const CAT_NAME: Record<Cat, string> = {
  mov: "Movimento",
  apa: "Aparência",
  som: "Som",
  eve: "Eventos",
  con: "Controle",
  sen: "Sensores",
  ope: "Operadores",
  var: "Variáveis",
  lis: "Listas",
  meu: "Meus Blocos",
  can: "Caneta",
};

/** A cor do livro (a do tomo de Scratch) e a mais escura. */
export const SCR = "#ea580c";
export const SCR_DARK = "#7c2d12";

/** Um bloco: a categoria, o texto (com as marcações) e, nos blocos em C, os blocos de dentro. */
export interface Blk {
  c: Cat;
  t: string;
  /** bloco de chapéu (os que começam um script: os eventos) */
  hat?: boolean;
  /** bloco de fim (nada encaixa embaixo: pare tudo, apague este clone) */
  cap?: boolean;
  /** os blocos de dentro do C (repita, sempre, se) */
  inner?: Blk[];
  /** o segundo braço do C (o senão) */
  inner2?: Blk[];
  /** o texto do meio, no se… senão */
  mid?: string;
}

const H = 32; // altura do bloco comum
const HAT = 46; // altura do bloco de chapéu (com a curva em cima)
const ARM = 18; // altura do braço de baixo do C
const IN = 14; // o recuo dos blocos de dentro do C
const CH = 7.8; // largura média de uma letra (a letra é em negrito, então sobra um pouco)
const FONT = "Helvetica, Arial, sans-serif";

// ---------------------------------------------------------------------------
// O texto do bloco: pedaços de texto, campos, listas, variáveis e condições
// ---------------------------------------------------------------------------

type Tok = { k: "txt" | "num" | "drop" | "var" | "bool" | "rep"; s: string };

// os valores que vêm dos Sensores (azul-claro), e não das Variáveis (laranja)
const SENSOR_VALUES = ["resposta", "cronômetro", "x do mouse", "y do mouse", "volume"];

function tokenize(text: string): Tok[] {
  const out: Tok[] = [];
  const re = /\(([^)]*)\)|\[([^\]]*)\]|\{([^}]*)\}|«([^»]*)»|⟦([^⟧]*)⟧|([^([{«⟦]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m[1] !== undefined) out.push({ k: "num", s: m[1] });
    else if (m[2] !== undefined) out.push({ k: "drop", s: m[2] });
    else if (m[3] !== undefined) out.push({ k: "var", s: m[3] });
    else if (m[4] !== undefined) out.push({ k: "bool", s: m[4] });
    else if (m[5] !== undefined) out.push({ k: "rep", s: m[5] });
    else if (m[6].trim()) out.push({ k: "txt", s: m[6].trim() });
  }
  return out;
}

function tokWidth(t: Tok): number {
  if (t.k === "txt") return t.s.length * CH;
  if (t.k === "num") return Math.max(22, t.s.length * CH + 14);
  if (t.k === "drop") return t.s.length * CH + 24;
  if (t.k === "var") return t.s.length * CH + 16;
  if (t.k === "rep") return lineWidth(tokenize(t.s)) + 16;
  return lineWidth(tokenize(t.s)) + 22;
}

function lineWidth(toks: Tok[]): number {
  return toks.reduce((w, t) => w + tokWidth(t), 0) + Math.max(0, toks.length - 1) * 5;
}

/** Os pedaços de uma linha, lado a lado, com o meio da altura em y. */
function Line({ toks, x, y, dark }: { toks: Tok[]; x: number; y: number; dark: string }) {
  let cx = x;
  return (
    <>
      {toks.map((t, i) => {
        const w = tokWidth(t);
        const left = cx;
        cx += w + 5;
        if (t.k === "txt")
          return (
            <text key={i} x={left} y={y + 4.5} fontSize="13" fontWeight="700" fill="#fff" fontFamily={FONT}>
              {t.s}
            </text>
          );
        if (t.k === "num")
          return (
            <g key={i}>
              <rect x={left} y={y - 10} width={w} height="20" rx="10" fill="#fff" stroke={dark} strokeWidth="0.8" />
              <text x={left + w / 2} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#575e75" fontFamily={FONT}>
                {t.s}
              </text>
            </g>
          );
        if (t.k === "drop")
          return (
            <g key={i}>
              <rect x={left} y={y - 10} width={w} height="20" rx="4" fill={dark} />
              <text x={left + 7} y={y + 4} fontSize="12" fontWeight="700" fill="#fff" fontFamily={FONT}>
                {t.s} ▾
              </text>
            </g>
          );
        if (t.k === "rep") {
          const [fill, edge] = CAT_COLOR.ope;
          return (
            <g key={i}>
              <rect x={left} y={y - 12} width={w} height="24" rx="12" fill={fill} stroke={edge} strokeWidth="1" />
              <Line toks={tokenize(t.s)} x={left + 8} y={y} dark={edge} />
            </g>
          );
        }
        if (t.k === "var") {
          const [fill, edge] = CAT_COLOR[SENSOR_VALUES.includes(t.s) ? "sen" : "var"];
          return (
            <g key={i}>
              <rect x={left} y={y - 10} width={w} height="20" rx="10" fill={fill} stroke={edge} strokeWidth="1" />
              <text x={left + w / 2} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" fontFamily={FONT}>
                {t.s}
              </text>
            </g>
          );
        }
        // a condição: hexágono (verde se for de Operadores, azul-claro se for de Sensores)
        const op = /[<>=]| e | ou |^não /.test(t.s);
        const [fill, edge] = CAT_COLOR[op ? "ope" : "sen"];
        const inner = tokenize(t.s);
        return (
          <g key={i}>
            <path d={`M${left} ${y} L${left + 10} ${y - 11} L${left + w - 10} ${y - 11} L${left + w} ${y} L${left + w - 10} ${y + 11} L${left + 10} ${y + 11} Z`} fill={fill} stroke={edge} strokeWidth="1" />
            <Line toks={inner} x={left + 11} y={y} dark={edge} />
          </g>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// Medindo e desenhando a pilha de blocos
// ---------------------------------------------------------------------------

function blockHeight(b: Blk): number {
  if (b.inner) {
    const h1 = Math.max(20, stackHeight(b.inner));
    const h2 = b.inner2 ? H + Math.max(20, stackHeight(b.inner2)) : 0;
    return H + h1 + h2 + ARM;
  }
  return b.hat ? HAT : H;
}

function stackHeight(bs: Blk[]): number {
  return bs.reduce((h, b) => h + blockHeight(b), 0);
}

function blockWidth(b: Blk): number {
  const own = Math.max(b.hat ? 100 : 48, lineWidth(tokenize(b.t)) + 18);
  if (!b.inner) return own;
  return Math.max(own, IN + stackWidth(b.inner), b.inner2 ? IN + stackWidth(b.inner2) : 0, b.mid ? lineWidth(tokenize(b.mid)) + 18 : 0);
}

function stackWidth(bs: Blk[]): number {
  return Math.max(0, ...bs.map(blockWidth));
}

/** O contorno de baixo de um pedaço, da direita (x + w) pra esquerda, com o calombo de encaixe. */
const bottomEdge = (x: number, y: number, w: number, bump = true) =>
  bump ? `L${x + w - 4} ${y} L${x + 30} ${y} L${x + 26} ${y + 4} L${x + 14} ${y + 4} L${x + 10} ${y} L${x + 4} ${y}` : `L${x + 4} ${y}`;

/** O contorno de cima, da esquerda pra direita, com o dente de encaixe. */
const topEdge = (x: number, y: number, w: number) => `L${x + 10} ${y} L${x + 14} ${y + 4} L${x + 26} ${y + 4} L${x + 30} ${y} L${x + w - 4} ${y}`;

function Block({ b, x, y, w }: { b: Blk; x: number; y: number; w: number }) {
  const [fill, edge] = CAT_COLOR[b.c];
  const toks = tokenize(b.t);
  if (b.inner) {
    const h1 = Math.max(20, stackHeight(b.inner));
    const h2 = b.inner2 ? Math.max(20, stackHeight(b.inner2)) : 0;
    const y1 = y + H; // começo do primeiro braço de dentro
    const yMid = y1 + h1; // o braço do meio (senão)
    const y2 = yMid + H; // começo do segundo braço
    const yEnd = b.inner2 ? y2 + h2 : yMid; // começo do braço de baixo
    const xi = x + IN;
    const innerTop = (yy: number) => `L${xi + 30} ${yy} L${xi + 26} ${yy + 4} L${xi + 14} ${yy + 4} L${xi + 10} ${yy} L${xi + 4} ${yy} Q${xi} ${yy} ${xi} ${yy + 4}`;
    const d = [
      `M${x} ${y + 4} Q${x} ${y} ${x + 4} ${y}`,
      topEdge(x, y, w),
      `Q${x + w} ${y} ${x + w} ${y + 4} L${x + w} ${y1 - 4} Q${x + w} ${y1} ${x + w - 4} ${y1}`,
      innerTop(y1),
      `L${xi} ${yMid - 4} Q${xi} ${yMid} ${xi + 4} ${yMid}`,
      b.inner2
        ? `L${x + w - 4} ${yMid} Q${x + w} ${yMid} ${x + w} ${yMid + 4} L${x + w} ${y2 - 4} Q${x + w} ${y2} ${x + w - 4} ${y2} ${innerTop(y2)} L${xi} ${yEnd - 4} Q${xi} ${yEnd} ${xi + 4} ${yEnd}`
        : "",
      `L${x + w - 4} ${yEnd} Q${x + w} ${yEnd} ${x + w} ${yEnd + 4} L${x + w} ${yEnd + ARM - 4} Q${x + w} ${yEnd + ARM} ${x + w - 4} ${yEnd + ARM}`,
      bottomEdge(x, yEnd + ARM, w, !b.cap),
      `Q${x} ${yEnd + ARM} ${x} ${yEnd + ARM - 4} Z`,
    ].join(" ");
    return (
      <g>
        <path d={d} fill={fill} stroke={edge} strokeWidth="1" />
        <Line toks={toks} x={x + 9} y={y + H / 2} dark={edge} />
        <Stack blocks={b.inner} x={xi} y={y1} />
        {b.mid && <Line toks={tokenize(b.mid)} x={x + 9} y={yMid + H / 2} dark={edge} />}
        {b.inner2 && <Stack blocks={b.inner2} x={xi} y={y2} />}
      </g>
    );
  }
  const h = b.hat ? HAT : H;
  const top = b.hat ? `M${x} ${y + 14} Q${x + 40} ${y - 6} ${x + 80} ${y + 12} L${x + w - 4} ${y + 12} Q${x + w} ${y + 12} ${x + w} ${y + 16}` : `M${x} ${y + 4} Q${x} ${y} ${x + 4} ${y} ${topEdge(x, y, w)} Q${x + w} ${y} ${x + w} ${y + 4}`;
  const d = `${top} L${x + w} ${y + h - 4} Q${x + w} ${y + h} ${x + w - 4} ${y + h} ${bottomEdge(x, y + h, w, !b.cap)} Q${x} ${y + h} ${x} ${y + h - 4} Z`;
  return (
    <g>
      <path d={d} fill={fill} stroke={edge} strokeWidth="1" />
      <Line toks={toks} x={x + 9} y={b.hat ? y + 12 + (h - 12) / 2 : y + h / 2} dark={edge} />
    </g>
  );
}

function Stack({ blocks, x, y }: { blocks: Blk[]; x: number; y: number }) {
  let cy = y;
  return (
    <>
      {blocks.map((b, i) => {
        const top = cy;
        cy += blockHeight(b);
        return <Block key={i} b={b} x={x} y={top} w={blockWidth(b)} />;
      })}
    </>
  );
}

/** Uma pilha de blocos dentro de outro desenho (o canto de cima em x, y, nas unidades do desenho). */
export function BlocksG({ blocks, x, y }: { blocks: Blk[]; x: number; y: number }) {
  return <Stack blocks={blocks} x={x} y={y} />;
}

/** A largura e a altura de uma pilha de blocos (pra posicionar dentro de outro desenho). */
export function blocksSize(blocks: Blk[]): { w: number; h: number } {
  return { w: stackWidth(blocks), h: stackHeight(blocks) };
}

/**
 * Um script do Scratch desenhado. `scripts` pode ter mais de uma pilha, lado a lado.
 * `em` é o tamanho de cada unidade do desenho na página.
 */
export function Script({ scripts, em = 0.052, label }: { scripts: Blk[][]; em?: number; label?: string }) {
  // um pouco maior que o `em` pedido, pra letra dos blocos ficar fácil de ler
  const k = em * 1.2;
  const gap = 24;
  const widths = scripts.map((s) => stackWidth(s));
  const heights = scripts.map((s) => stackHeight(s));
  const W = widths.reduce((a, b) => a + b, 0) + gap * (scripts.length - 1) + 4;
  const Hh = Math.max(...heights) + 8;
  let x = 2;
  return (
    <svg viewBox={`0 0 ${W} ${Hh}`} className="mx-auto block" style={{ height: `${Hh * k}em`, maxWidth: "100%" }} role="img" aria-label={label ?? scripts.map((s) => s.map((b) => b.t).join(", ")).join(" | ")}>
      {scripts.map((s, i) => {
        const left = x;
        x += widths[i] + gap;
        return (
          <g key={i}>
            <Stack blocks={s} x={left} y={2} />
          </g>
        );
      })}
    </svg>
  );
}

/** A plaquinha com o nome e a cor de uma categoria. */
export function CatChip({ c }: { c: Cat }) {
  return (
    <span className="inline-flex items-center gap-[0.25em] whitespace-nowrap rounded-full px-[0.5em] text-[0.82em] font-bold text-white" style={{ background: CAT_COLOR[c][0] }}>
      {CAT_NAME[c]}
    </span>
  );
}

// ---------------------------------------------------------------------------
// O gato laranja (desenhado pro livro) e o palco
// ---------------------------------------------------------------------------

/**
 * O gato laranja, com os pés em (x, y). `costume` 0 ou 1 troca a posição das pernas (pra andar);
 * `flip` vira ele pra esquerda.
 */
export function OrangeCat({ x = 0, y = 0, s = 1, costume = 0, flip = false }: { x?: number; y?: number; s?: number; costume?: 0 | 1; flip?: boolean }) {
  const legs = costume === 0 ? "M-12 -14 L-16 0 M10 -14 L14 0" : "M-12 -14 L-8 0 M10 -14 L6 0";
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d={legs} stroke="#f59e0b" strokeWidth="7" strokeLinecap="round" />
      <path d="M-22 -28 Q-40 -38 -34 -58" stroke="#f59e0b" strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="-26" rx="22" ry="16" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" />
      <ellipse cx="2" cy="-22" rx="12" ry="9" fill="#fde68a" />
      <path d="M14 -40 L13 -68 L24 -56 Z M28 -56 L38 -68 L38 -42 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="24" cy="-46" r="17" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" />
      <ellipse cx="28" cy="-42" rx="9" ry="6" fill="#fde68a" />
      <ellipse cx="19" cy="-50" rx="4" ry="5" fill="#fff" />
      <ellipse cx="31" cy="-50" rx="4" ry="5" fill="#fff" />
      <circle cx="20" cy="-49" r="2" fill="#1e293b" />
      <circle cx="32" cy="-49" r="2" fill="#1e293b" />
      <circle cx="28" cy="-43" r="2" fill="#1e293b" />
      <path d="M24 -39 Q28 -36 32 -39" stroke="#1e293b" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** A moldura de um palco (de largura w e altura h, o canto em x, y). */
export function StageFrame({ x, y, w, h, children, fill = "#fff" }: { x: number; y: number; w: number; h: number; children?: ReactNode; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx="6" fill={fill} stroke="#cbd5e1" strokeWidth="2" />
      {children}
    </g>
  );
}

/** A bandeira verde e o botão vermelho de parar (o centro da bandeira em x, y). */
export function FlagStop({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-6 -10 L-6 12" stroke="#4d7c0f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M-6 -10 Q0 -14 6 -10 Q12 -6 16 -10 L16 2 Q12 6 6 2 Q0 -2 -6 2 Z" fill="#4cbf56" stroke="#45993d" strokeWidth="1.5" />
      <polygon points="34,-10 42,-10 48,-4 48,4 42,10 34,10 28,4 28,-4" fill="#ec5959" stroke="#b84848" strokeWidth="1.5" />
    </g>
  );
}

/** A moldura das figuras de tocar. */
export function Panel({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      {title && <p className="mb-[0.3em] text-center text-[0.78em] font-bold uppercase tracking-wider text-[#8a7146]">{title}</p>}
      {children}
    </div>
  );
}

/** Um botão no formato (e na cor) de um bloco do Scratch, pras figuras de tocar. */
export function BlockButton({ c, children, onClick, disabled }: { c: Cat; children: ReactNode; onClick: () => void; disabled?: boolean }) {
  const [fill, edge] = CAT_COLOR[c];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border px-[0.6em] py-[0.15em] text-[0.8em] font-bold text-white shadow-sm transition-transform hover:scale-105 disabled:opacity-50"
      style={{ background: fill, borderColor: edge }}
    >
      {children}
    </button>
  );
}
