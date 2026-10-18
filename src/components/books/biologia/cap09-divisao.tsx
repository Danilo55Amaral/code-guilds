"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 9 — DIVISÃO CELULAR E SÍNTESE DE PROTEÍNAS (missão "Biologia:
// Divisão Celular e Síntese de Proteínas"): a célula se dividindo em duas, a
// mitose fase por fase (passa sozinha ou o aluno escolhe a fase), a meiose
// formando os gametas, o ribossomo lendo o RNA mensageiro códon por códon e
// montando a proteína, e a enzima encaixando no substrato como uma chave.
// ============================================================================

/** troca de passo sozinho a cada `ms` (enquanto `playing`) */
function useStepper(count: number, ms: number, playing: boolean): [number, (n: number) => void] {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => setStep((s) => (s + 1) % count), ms);
    return () => window.clearInterval(t);
  }, [count, ms, playing]);
  return [step, setStep];
}

// ---------------------------------------------------------------------------
// Abertura: uma célula virando duas (em loop)
// ---------------------------------------------------------------------------

function DividingCellArt() {
  const loop = { dur: "6s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 460 300" label="Uma célula se dividindo em duas células iguais">
      <circle cx="230" cy="150" r="140" fill="#fde68a" opacity="0.25" className="cg-anim-glow" />
      {[-1, 1].map((s) => (
        <g key={s}>
          <animateTransform attributeName="transform" type="translate" values={`0 0;0 0;${s * 70} 0;${s * 70} 0;0 0`} keyTimes="0;0.25;0.6;0.9;1" {...loop} />
          <ellipse cx="230" cy="150" rx="96" ry="90" fill="#fecdd3" stroke="#f43f5e" strokeWidth="5" opacity="0.92">
            <animate attributeName="rx" values="96;96;72;72;96" keyTimes="0;0.25;0.6;0.9;1" {...loop} />
            <animate attributeName="ry" values="90;90;76;76;90" keyTimes="0;0.25;0.6;0.9;1" {...loop} />
          </ellipse>
          {/* o núcleo de cada lado se formando */}
          <circle cx={230 + s * 6} cy="150" r="34" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="3" opacity="0">
            <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.55;0.65;0.9;1" {...loop} />
          </circle>
          {[-12, 0, 12].map((y) => (
            <path key={y} d={`M${226 + s * 6} ${150 + y - 9} L${234 + s * 6} ${150 + y + 9}`} stroke={s < 0 ? "#8b5cf6" : "#ec4899"} strokeWidth="5" strokeLinecap="round" />
          ))}
        </g>
      ))}
      {/* o núcleo da célula-mãe sumindo quando a divisão começa */}
      <circle cx="230" cy="150" r="44" fill="#ddd6fe" stroke="#7c3aed" strokeWidth="3">
        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.2;0.3;0.92;1" {...loop} />
      </circle>
      <path d="M210 140 C220 130 230 160 240 150 S256 140 252 162" stroke="#7c3aed" strokeWidth="2.5" fill="none">
        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.2;0.3;0.92;1" {...loop} />
      </path>
      <text x="230" y="290" textAnchor="middle" fontSize="15" fontWeight="900" fill="#9f1239" fontFamily="Georgia, serif">
        1 célula → 2 células iguais
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A mitose, fase por fase
// ---------------------------------------------------------------------------

const PHASES = [
  { name: "Intérfase", text: "A célula cresce e duplica o DNA. Os cromossomos ainda estão soltinhos, como fios, dentro do núcleo." },
  { name: "Prófase", text: "Os cromossomos se enrolam e ficam grossos e visíveis, cada um com duas cópias (as cromátides-irmãs). O núcleo começa a se desfazer." },
  { name: "Metáfase", text: "Os cromossomos se alinham bem no meio da célula, presos pelas fibras do fuso, que saem dos dois polos." },
  { name: "Anáfase", text: "As fibras puxam e as cromátides-irmãs se separam, cada uma indo para um polo da célula." },
  { name: "Telófase", text: "Um núcleo novo se forma em cada polo e a célula se divide ao meio (citocinese): agora são duas células iguais!" },
];

const CHROMOSOMES = [
  { color: "#8b5cf6", len: 34, pro: [234, 88, 30] },
  { color: "#ec4899", len: 34, pro: [286, 92, -20] },
  { color: "#3b82f6", len: 24, pro: [240, 134, 60] },
  { color: "#f59e0b", len: 24, pro: [288, 130, -45] },
];

function chromatidPose(c: number, sister: 0 | 1, phase: number): { x: number; y: number; rot: number; opacity: number } {
  const [px, py, prot] = CHROMOSOMES[c].pro;
  const side = sister === 0 ? -1 : 1;
  switch (phase) {
    case 0:
      return { x: px + side * 3, y: py, rot: prot + side * 14, opacity: 0 };
    case 1:
      return { x: px + side * 3, y: py, rot: prot + side * 14, opacity: 1 };
    case 2:
      return { x: 260 + side * 4, y: 50 + c * 40, rot: side * 12, opacity: 1 };
    case 3:
      return { x: 260 + side * 74, y: 66 + c * 30, rot: side * -8, opacity: 1 };
    default:
      return { x: 260 + side * 84, y: 82 + c * 15, rot: side * 20 + (c % 2 ? 25 : -25), opacity: 1 };
  }
}

export function MitosisStepper() {
  const [playing, setPlaying] = useState(true);
  const [phase, setPhase] = useStepper(PHASES.length, 2800, playing);
  const ease = "transform 1.1s cubic-bezier(0.45, 0.05, 0.3, 1), opacity 0.8s";
  const half = (s: -1 | 1): CSSProperties => ({
    transform: phase === 4 ? `translate(${s * 74}px, 0) scale(0.56, 0.92)` : "none",
    transformOrigin: "260px 110px",
    transformBox: "view-box",
    transition: ease,
  });
  const show = (on: boolean): CSSProperties => ({ opacity: on ? 1 : 0, transition: "opacity 0.8s" });
  return (
    <div>
      <Art viewBox="0 0 520 220" label={`Mitose: ${PHASES[phase].name}`}>
        {/* a membrana (na telófase vira duas) */}
        {([-1, 1] as const).map((s) => (
          <ellipse key={s} cx="260" cy="110" rx="140" ry="96" fill="#fff1f2" stroke="#f43f5e" strokeWidth="4" style={half(s)} />
        ))}
        {/* o núcleo da célula-mãe e a cromatina */}
        <g style={show(phase <= 1)}>
          <circle cx="262" cy="110" r="56" fill="#ede9fe" stroke="#7c3aed" strokeWidth="3" strokeDasharray={phase === 1 ? "10 8" : undefined} />
          <g style={show(phase === 0)}>
            {["M222 96 C236 80 246 112 262 96 S288 84 296 104", "M226 124 C240 136 256 112 270 128 S292 136 300 120", "M240 110 C250 104 262 120 278 110"].map((d) => (
              <path key={d} d={d} stroke="#a78bfa" strokeWidth="2" fill="none" />
            ))}
          </g>
        </g>
        {/* os centríolos nos polos e as fibras do fuso */}
        <g style={show(phase >= 1 && phase <= 3)}>
          {[132, 388].map((x) => (
            <g key={x}>
              <rect x={x - 7} y="104" width="14" height="6" rx="2" fill="#64748b" />
              <rect x={x - 3} y="100" width="6" height="14" rx="2" fill="#94a3b8" />
            </g>
          ))}
        </g>
        <g style={show(phase === 2)}>
          {CHROMOSOMES.flatMap((_, c) => [
            <line key={`l${c}`} x1="138" y1="110" x2="254" y2={50 + c * 40} stroke="#94a3b8" strokeWidth="1.3" />,
            <line key={`r${c}`} x1="382" y1="110" x2="266" y2={50 + c * 40} stroke="#94a3b8" strokeWidth="1.3" />,
          ])}
        </g>
        <g style={show(phase === 3)}>
          {CHROMOSOMES.flatMap((_, c) => [
            <line key={`l${c}`} x1="138" y1="110" x2="186" y2={66 + c * 30} stroke="#94a3b8" strokeWidth="1.3" />,
            <line key={`r${c}`} x1="382" y1="110" x2="334" y2={66 + c * 30} stroke="#94a3b8" strokeWidth="1.3" />,
          ])}
        </g>
        {/* os núcleos novos */}
        <g style={show(phase === 4)}>
          {[178, 342].map((x) => (
            <circle key={x} cx={x} cy="106" r="44" fill="#ede9fe" fillOpacity="0.6" stroke="#7c3aed" strokeWidth="2.5" />
          ))}
        </g>
        {/* as cromátides */}
        {CHROMOSOMES.flatMap((ch, c) =>
          ([0, 1] as const).map((sister) => {
            const p = chromatidPose(c, sister, phase);
            return (
              <g key={`${c}-${sister}`} style={{ transform: `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`, opacity: p.opacity, transition: ease }}>
                <rect x="-4.5" y={-ch.len / 2} width="9" height={ch.len} rx="4.5" fill={ch.color} stroke="#1e1b4b" strokeWidth="1" />
              </g>
            );
          }),
        )}
        <text x="260" y="214" textAnchor="middle" fontSize="15" fontWeight="900" fill="#9f1239" fontFamily="Georgia, serif">
          {PHASES[phase].name}
        </text>
      </Art>
      <div className="mt-[0.3em] flex flex-wrap items-center justify-center gap-[0.3em]">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="rounded-full border border-[#be123c] bg-[#be123c] px-[0.7em] py-[0.1em] text-[0.78em] font-bold text-white"
        >
          {playing ? "❚❚ Pausar" : "► Passar sozinho"}
        </button>
        {PHASES.map((ph, i) => (
          <button
            key={ph.name}
            type="button"
            onClick={() => {
              setPlaying(false);
              setPhase(i);
            }}
            className={`rounded-full border px-[0.6em] py-[0.1em] text-[0.78em] font-bold transition-colors ${phase === i ? "border-[#be123c] bg-[#ffe4e6] text-[#9f1239]" : "border-[#d9c79d] bg-[#fffaf0] text-[#5b4a2e] hover:bg-[#ffe4e6]"}`}
          >
            {i + 1}. {ph.name}
          </button>
        ))}
      </div>
      <p key={phase} className="cg-anim-fade mt-[0.4em] min-h-[3em] rounded-xl border border-[#fda4af] bg-[#fff1f2] px-[0.8em] py-[0.4em] text-[0.88em] leading-[1.45] text-[#881337]">
        <strong>{PHASES[phase].name}:</strong> {PHASES[phase].text}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A meiose: 1 célula (46) → 2 → 4 gametas (23)
// ---------------------------------------------------------------------------

function MeiosisArt() {
  const cell = (x: number, y: number, r: number, n: string, delay: number, gamete = false) => (
    <g className="cg-anim-pop" style={{ animationDelay: `${delay}s` }}>
      <circle cx={x} cy={y} r={r} fill={gamete ? "#fef3c7" : "#fff1f2"} stroke={gamete ? "#d97706" : "#f43f5e"} strokeWidth="3" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={r > 30 ? 16 : 13} fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        {n}
      </text>
    </g>
  );
  const arrow = (x1: number, y1: number, x2: number, y2: number, k: number) => (
    <path key={k} d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#b08a52" strokeWidth="2.5" strokeDasharray="6 4" className="cg-anim-dash" />
  );
  return (
    <Art viewBox="0 0 560 200" label="Meiose: uma célula com 46 cromossomos forma 4 células com 23 cromossomos, os gametas">
      {cell(70, 100, 40, "46", 0)}
      {arrow(110, 90, 190, 60, 1)}
      {arrow(110, 110, 190, 140, 2)}
      {cell(220, 55, 30, "23", 0.4)}
      {cell(220, 145, 30, "23", 0.4)}
      {[
        [250, 50, 360, 30],
        [250, 60, 360, 80],
        [250, 140, 360, 120],
        [250, 150, 360, 170],
      ].map(([a, b, c, d], k) => arrow(a, b, c, d, k + 3))}
      {[30, 80, 120, 170].map((y, i) => cell(385, y, 22, "23", 0.8 + i * 0.1, true))}
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="700" fill="#5b4a2e">
        <text x="70" y="160" textAnchor="middle">
          célula-mãe
        </text>
        <text x="220" y="196" textAnchor="middle">
          1ª divisão
        </text>
        <text x="470" y="96" textAnchor="middle" fill="#92400e" fontWeight="900" fontSize="13">
          4 gametas
        </text>
        <text x="470" y="114" textAnchor="middle">
          com metade dos
        </text>
        <text x="470" y="130" textAnchor="middle">
          cromossomos
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Do DNA à proteína: o ribossomo lendo o RNA mensageiro
// ---------------------------------------------------------------------------

const CODONS = [
  { codon: "AUG", amino: "Met", color: "#8b5cf6" },
  { codon: "GCU", amino: "Ala", color: "#22c55e" },
  { codon: "UUC", amino: "Phe", color: "#f59e0b" },
  { codon: "GGA", amino: "Gly", color: "#3b82f6" },
  { codon: "UAA", amino: "PARE", color: "#dc2626" },
];
const RNA_COLOR: Record<string, string> = { A: "#ef4444", U: "#a855f7", G: "#f59e0b", C: "#22c55e" };

export function ProteinSynthesis() {
  // passos 0 a 3: um aminoácido chega a cada códon; 4 e 5: o códon PARE solta a proteína pronta
  const [step, setStep] = useStepper(CODONS.length + 1, 1700, true);
  const at = Math.min(step, CODONS.length - 1);
  const done = step >= CODONS.length - 1;
  const ribosomeX = 92 + at * 88;
  const chain = CODONS.slice(0, done ? CODONS.length - 1 : step);
  return (
    <div>
      <Art viewBox="0 0 540 210" label="O ribossomo anda pelo RNA mensageiro, lê um códon de cada vez e junta os aminoácidos, formando a proteína">
        {/* o RNA mensageiro com os códons */}
        <rect x="30" y="150" width="480" height="8" rx="4" fill="#c4b5fd" />
        {CODONS.map((c, i) => (
          <g key={c.codon}>
            {c.codon.split("").map((b, k) => (
              <g key={k}>
                <rect x={60 + i * 88 + k * 22} y="158" width="18" height="22" rx="3" fill={RNA_COLOR[b]} />
                <text x={69 + i * 88 + k * 22} y="174" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="monospace">
                  {b}
                </text>
              </g>
            ))}
            <text x={92 + i * 88} y="198" textAnchor="middle" fontSize="11" fontWeight="700" fill="#5b4a2e" fontFamily="Georgia, serif">
              {i === CODONS.length - 1 ? "parada" : `códon ${i + 1}`}
            </text>
          </g>
        ))}
        {/* o ribossomo (anda de códon em códon) */}
        <g style={{ transform: `translate(${ribosomeX}px, 0)`, transition: "transform 0.9s cubic-bezier(0.45, 0.05, 0.3, 1)" }}>
          <ellipse cx="0" cy="118" rx="52" ry="34" fill="#fde68a" stroke="#b45309" strokeWidth="3" opacity="0.92" />
          <ellipse cx="0" cy="168" rx="46" ry="16" fill="#fcd34d" stroke="#b45309" strokeWidth="3" opacity="0.85" />
          {/* o RNA transportador trazendo o aminoácido do códon */}
          {!done && (
            <g key={step} className="cg-anim-rise">
              <path d="M-12 140 L-12 112 L12 112 L12 140" stroke="#0f766e" strokeWidth="5" fill="none" />
              <circle cx="0" cy="98" r="13" fill={CODONS[at].color} stroke="#1e1b4b" strokeWidth="1.5" />
              <text x="0" y="102" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
                {CODONS[at].amino}
              </text>
            </g>
          )}
        </g>
        {/* a corrente de aminoácidos já ligados, presa ao que acabou de chegar (ou solta, quando fica pronta) */}
        {chain.map((c, j) => {
          const x = done ? 200 + j * 34 : ribosomeX - (chain.length - j) * 30;
          const y = done ? 40 : 98;
          return (
            <g key={c.codon} style={{ transform: `translate(${x}px, ${y}px)`, transition: "transform 0.9s cubic-bezier(0.45, 0.05, 0.3, 1)" }}>
              <line x1="0" y1="0" x2={done ? (j < chain.length - 1 ? 34 : 0) : 30} y2="0" stroke="#475569" strokeWidth="3" />
              <circle cx="0" cy="0" r="13" fill={c.color} stroke="#1e1b4b" strokeWidth="1.5" />
              <text x="0" y="4" textAnchor="middle" fontSize="9.5" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
                {c.amino}
              </text>
            </g>
          );
        })}
        {done && (
          <text x="270" y="16" textAnchor="middle" fontSize="15" fontWeight="900" fill="#15803d" fontFamily="Georgia, serif" className="cg-anim-pop">
            Códon PARE: a proteína está pronta!
          </text>
        )}
      </Art>
      <div className="mt-[0.2em] flex justify-center">
        <button type="button" onClick={() => setStep(0)} className="rounded-full border border-[#d9c79d] bg-[#fffaf0] px-[0.8em] py-[0.1em] text-[0.78em] font-bold text-[#5b4a2e] hover:bg-amber-100">
          ↺ Começar de novo
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A enzima: o substrato encaixa, é cortado em dois e a enzima fica igualzinha
// ---------------------------------------------------------------------------

function EnzymeArt() {
  const loop = { dur: "6s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 540 170" label="A enzima recebe o substrato no sítio ativo, como chave e fechadura, quebra o substrato em dois produtos e fica pronta para a próxima">
      {/* a enzima com o encaixe */}
      <path d="M200 40 C260 20 320 30 340 70 L300 70 L300 100 L340 100 C320 140 260 150 200 130 C170 120 160 60 200 40 Z" fill="#a7f3d0" stroke="#047857" strokeWidth="3" />
      <text x="230" y="90" textAnchor="middle" fontSize="13" fontWeight="900" fill="#065f46" fontFamily="Georgia, serif">
        Enzima
      </text>
      {/* o substrato: chega, encaixa e se parte */}
      <g>
        <animateMotion values="440,0;352,0;352,0;352,0" keyTimes="0;0.3;0.6;1" calcMode="linear" {...loop} />
        <animate attributeName="opacity" values="1;1;1;0;0" keyTimes="0;0.55;0.6;0.62;1" {...loop} />
        <rect x="-52" y="70" width="40" height="30" rx="4" fill="#fda4af" stroke="#be123c" strokeWidth="2.5" />
        <rect x="-12" y="74" width="34" height="22" rx="11" fill="#fdba74" stroke="#c2410c" strokeWidth="2.5" />
      </g>
      <circle cx="320" cy="85" r="30" fill="#fde047" opacity="0">
        <animate attributeName="opacity" values="0;0;0.6;0;0" keyTimes="0;0.4;0.5;0.62;1" {...loop} />
      </circle>
      {/* os dois produtos indo embora */}
      {[
        [-1, "#fda4af", "#be123c"],
        [1, "#fdba74", "#c2410c"],
      ].map(([s, fill, stroke]) => (
        <g key={s as number} opacity="0">
          <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.6;0.62;0.95;1" {...loop} />
          <animateMotion values={`300,0;300,0;${(s as number) < 0 ? "400,-40" : "420,40"};${(s as number) < 0 ? "400,-40" : "420,40"}`} keyTimes="0;0.62;0.9;1" calcMode="linear" {...loop} />
          {(s as number) < 0 ? <rect x="0" y="70" width="40" height="30" rx="4" fill={fill as string} stroke={stroke as string} strokeWidth="2.5" /> : <rect x="0" y="74" width="34" height="22" rx="11" fill={fill as string} stroke={stroke as string} strokeWidth="2.5" />}
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="700" fill="#5b4a2e">
        <text x="440" y="60" textAnchor="middle">
          substrato
        </text>
        <text x="460" y="160" textAnchor="middle">
          produtos
        </text>
        <text x="230" y="160" textAnchor="middle">
          a enzima não se gasta: fica pronta pra próxima
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 9, content, bare });

export const chapter9: BookPage[] = [
  page(
    <ChapterOpener
      n={9}
      title="Divisão Celular e Proteínas"
      goals={["Como uma célula se divide em duas na mitose", "Como a meiose forma os gametas", "Como a célula lê o DNA e fabrica proteínas", "O que são enzimas, células-tronco e a técnica CRISPR"]}
    >
      <Fig h={34}>
        <DividingCellArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔄">Mitose: uma célula vira duas</H>
      <P>
        Você começou como uma única célula, o zigoto. Hoje tem trilhões! Isso foi possível graças à <T>mitose</T>, a divisão em que uma célula forma <T>duas células iguais</T>{" "}
        a ela, com o mesmo número de cromossomos. A mitose faz o corpo crescer e repõe as células que morrem, como na cicatrização de um machucado.
      </P>
      <Fig n="9.1" caption="As fases da mitose. Toque numa fase para parar nela, ou deixe passar sozinho." h={28}>
        <MitosisStepper />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="✂️">Meiose: a divisão que forma os gametas</H>
      <P>
        Se o óvulo e o espermatozoide tivessem 46 cromossomos cada, o zigoto teria 92! Para isso não acontecer existe a <T>meiose</T>: uma divisão em duas etapas que forma{" "}
        <T>quatro células com metade dos cromossomos</T> (23). Na fecundação, 23 + 23 = 46, e o número certo volta.
      </P>
      <Fig n="9.2" caption="Na meiose, uma célula com 46 cromossomos forma quatro gametas com 23." h={22}>
        <MeiosisArt />
      </Fig>
      <Table
        head={["", "Mitose", "Meiose"]}
        rows={[
          ["Células formadas", "2, iguais à mãe", "4, diferentes entre si"],
          ["Cromossomos (humanos)", "46 → 46", "46 → 23"],
          ["Para que serve", "Crescer e repor células", "Formar os gametas"],
          ["Onde acontece", "No corpo todo", "Nos ovários e testículos"],
        ]}
      />
      <Box kind="sabia">Na meiose, os cromossomos de cada par trocam pedacinhos entre si (o <em>crossing-over</em>). É por isso que irmãos dos mesmos pais não nascem iguais!</Box>
    </>,
  ),

  page(
    <>
      <H icon="🏭">Do DNA à proteína</H>
      <P>
        As <T>proteínas</T> fazem quase tudo no corpo: formam os músculos, carregam o oxigênio, defendem o organismo. Elas são correntes de <T>aminoácidos</T> (existem 20 tipos),
        montadas a partir da receita do DNA em duas etapas:
      </P>
      <P>
        1. <T>Transcrição</T>: no núcleo, o trecho do DNA (o gene) é copiado em uma molécula de <T>RNA mensageiro</T>, que sai para o citoplasma. 2. <T>Tradução</T>: o{" "}
        <T>ribossomo</T> lê o RNA mensageiro de três em três letras. Cada trinca é um <T>códon</T>, que indica um aminoácido, trazido pelo RNA transportador.
      </P>
      <Fig n="9.3" caption="O ribossomo anda pelo RNA mensageiro, códon por códon, e a corrente de aminoácidos cresce até o códon de parada." h={26}>
        <ProteinSynthesis />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="🔬">Enzimas, células-tronco e a biotecnologia de ponta</H>
      <P>
        As <T>enzimas</T> são proteínas que <T>aceleram as reações químicas</T> do corpo. Cada uma tem um encaixe (o sítio ativo) que só serve para uma substância, como uma chave
        e a sua fechadura. A amilase da saliva, por exemplo, começa a digerir o amido na boca.
      </P>
      <Fig n="9.4" caption="O modelo chave-fechadura: o substrato encaixa, é transformado e a enzima continua inteira." h={20}>
        <EnzymeArt />
      </Fig>
      <Cards
        items={[
          { icon: "🌟", title: "Células-tronco", text: "Podem virar vários tipos de célula. São estudadas para regenerar tecidos e tratar doenças." },
          { icon: "✂️", title: "CRISPR", text: "Uma “tesoura” que edita o DNA com precisão. Deu o Nobel de Química de 2020 a Emmanuelle Charpentier e Jennifer Doudna." },
          { icon: "🧪", title: "PCR", text: "Copia trechos de DNA ou RNA milhões de vezes, até dar para detectar. Muito usado nos testes da pandemia." },
          { icon: "💉", title: "Vacinas modernas", text: "Algumas usam RNA mensageiro: ensinam a célula a fazer um pedaço do vírus e treinar as defesas." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Mitose: 1 célula → 2 células iguais (46 → 46). Fases: prófase, metáfase, anáfase e telófase.",
          "Meiose: 1 célula → 4 gametas com metade dos cromossomos (46 → 23).",
          "Transcrição: DNA → RNA mensageiro (no núcleo). Tradução: o ribossomo lê os códons e junta os aminoácidos.",
          "Um códon = 3 bases. Proteínas são feitas de aminoácidos (20 tipos).",
          "Enzimas aceleram as reações; CRISPR edita o DNA; PCR copia o material genético.",
        ]}
      />
      <Glossary
        items={[
          ["Cromátide", "Cada uma das duas cópias de um cromossomo duplicado."],
          ["Gameta", "Célula reprodutiva (óvulo ou espermatozoide), com 23 cromossomos."],
          ["Códon", "Trinca de bases do RNA mensageiro que indica um aminoácido."],
          ["Ribossomo", "Estrutura que monta as proteínas."],
          ["Enzima", "Proteína que acelera uma reação química."],
        ]}
      />
      <Quiz
        items={[
          ["O que acontece na mitose?", "Uma célula se divide em duas células iguais a ela."],
          ["Quantas células a meiose forma, e com quantos cromossomos (em humanos)?", "Quatro células, cada uma com 23 cromossomos."],
          ["Qual molécula leva a receita do DNA até os ribossomos?", "O RNA mensageiro."],
          ["Quantas bases formam um códon?", "Três."],
        ]}
      />
    </>,
  ),
];
