"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table, useUid } from "../BookParts";
import type { BookPage } from "../types";
import { Kid, Tree } from "./art";

// ============================================================================
// CAPÍTULO 2 — PEQUENAS ATITUDES, GRANDE IMPACTO (missão "ODS: Pequenas
// Atitudes, Grande Impacto"): o lixo caindo nas lixeiras coloridas, a
// pirâmide dos 3 Rs, o jogo de separar o lixo, a composteira com as
// minhocas e a casa com as atitudes do dia a dia.
// ============================================================================

/** As lixeiras da coleta seletiva (as cores da resolução Conama 275). */
const BINS = [
  { id: "papel", name: "Papel", color: "#2563eb" },
  { id: "plastico", name: "Plástico", color: "#dc2626" },
  { id: "vidro", name: "Vidro", color: "#16a34a" },
  { id: "metal", name: "Metal", color: "#eab308" },
  { id: "organico", name: "Orgânico", color: "#92400e" },
] as const;

type BinId = (typeof BINS)[number]["id"];

/** Uma lixeira (o pé em x, y), com a tampa abrindo e fechando. */
function Bin({ x, y, color, label, delay = 0 }: { x: number; y: number; color: string; label: string; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-24 -54 L24 -54 L20 0 L-20 0 Z" fill={color} stroke="#1e293b" strokeWidth="2" />
      <path d="M-10 -40 L-8 -10 M0 -40 L0 -10 M10 -40 L8 -10" stroke="#fff" strokeWidth="2" opacity="0.35" />
      <g>
        <animateTransform attributeName="transform" type="rotate" values="0 -26 -56;-28 -26 -56;0 -26 -56;0 -26 -56" keyTimes="0;0.15;0.3;1" dur="4s" begin={`${-delay}s`} repeatCount="indefinite" />
        <rect x="-28" y="-62" width="56" height="9" rx="3" fill={color} stroke="#1e293b" strokeWidth="2" />
      </g>
      <text y="18" textAnchor="middle" fontSize="12" fontWeight="900" fill="#1e293b" fontFamily="Georgia, serif">
        {label}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// Abertura: o lixo caindo nas lixeiras certas
// ---------------------------------------------------------------------------

function RecyclingOpenerArt() {
  const falling = ["📰", "🥤", "🍾", "🥫", "🍌"];
  return (
    <Art viewBox="0 0 460 300" label="Cinco lixeiras coloridas da coleta seletiva, com jornal, garrafa plástica, garrafa de vidro, lata e casca de banana caindo em cada uma">
      <rect width="460" height="300" fill="#ecfdf5" />
      <rect y="250" width="460" height="50" fill="#bbf7d0" />
      <Tree x={30} y={252} s={0.8} />
      <Tree x={436} y={252} s={0.7} color="#22c55e" />
      {BINS.map((b, i) => (
        <g key={b.id}>
          <Bin x={70 + i * 80} y={244} color={b.color} label={b.name} delay={i * 0.8} />
          <text x={70 + i * 80} textAnchor="middle" fontSize="26" opacity="0">
            <animate attributeName="y" values="64;64;180;180" keyTimes="0;0.05;0.15;1" dur="4s" begin={`${-i * 0.8 + 0.6}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;1;0;0" keyTimes="0;0.05;0.14;0.16;1" dur="4s" begin={`${-i * 0.8 + 0.6}s`} repeatCount="indefinite" />
            {falling[i]}
          </text>
        </g>
      ))}
      <text x="230" y="34" textAnchor="middle" fontSize="18" fontWeight="900" fill="#166534" fontFamily="Georgia, serif">
        cada coisa no seu lugar!
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A pirâmide dos 3 Rs
// ---------------------------------------------------------------------------

function ThreeRsArt() {
  const rs = [
    { r: "Reduzir", text: "comprar e gastar menos", color: "#16a34a", w: 360 },
    { r: "Reutilizar", text: "usar de novo", color: "#0ea5e9", w: 260 },
    { r: "Reciclar", text: "transformar em outro produto", color: "#f59e0b", w: 160 },
  ];
  return (
    <Art viewBox="0 0 560 210" label="A pirâmide dos 3 Rs de cabeça para baixo: reduzir em cima, que é o mais importante, depois reutilizar e, por último, reciclar">
      <rect width="560" height="210" rx="14" fill="#f8fafc" />
      {rs.map((item, i) => (
        <g key={item.r} className="cg-anim-rise" style={{ animationDelay: `${i * 0.2}s` }}>
          <rect x={200 - item.w / 2} y={20 + i * 60} width={item.w} height="52" rx="8" fill={item.color} />
          <text x="200" y={44 + i * 60} textAnchor="middle" fontSize="18" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
            {i + 1}. {item.r}
          </text>
          <text x="200" y={62 + i * 60} textAnchor="middle" fontSize="11.5" fill="#fff" fontFamily="Georgia, serif">
            {item.text}
          </text>
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <path d="M420 30 L420 180" stroke="#64748b" strokeWidth="3" markerEnd="url(#ods-seta-baixo)" />
        <defs>
          <marker id="ods-seta-baixo" viewBox="0 0 10 10" refX="5" refY="8" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 0 L5 10 Z" fill="#64748b" />
          </marker>
        </defs>
        <text x="434" y="44" fill="#166534">mais importante</text>
        <text x="434" y="176" fill="#92400e">o último recurso</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo da coleta seletiva (de tocar)
// ---------------------------------------------------------------------------

const TRASH: { icon: string; name: string; bin: BinId }[] = [
  { icon: "📰", name: "Jornal velho", bin: "papel" },
  { icon: "🥤", name: "Copo plástico", bin: "plastico" },
  { icon: "🍾", name: "Garrafa de vidro", bin: "vidro" },
  { icon: "🥫", name: "Lata de molho", bin: "metal" },
  { icon: "🍌", name: "Casca de banana", bin: "organico" },
  { icon: "📦", name: "Caixa de papelão", bin: "papel" },
  { icon: "🧴", name: "Frasco de xampu", bin: "plastico" },
  { icon: "🍎", name: "Resto de maçã", bin: "organico" },
];

export function RecycleSorter() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const done = index >= TRASH.length;
  const item = TRASH[Math.min(index, TRASH.length - 1)];

  function choose(bin: BinId) {
    if (done) return;
    const right = BINS.find((b) => b.id === item.bin)!;
    if (bin === item.bin) {
      setScore((s) => s + 1);
      setFeedback({ ok: true, text: `Isso! ${item.name} vai na lixeira de ${right.name.toLowerCase()}.` });
      setIndex((i) => i + 1);
    } else {
      setFeedback({ ok: false, text: `Hum, não. Pense: do que é feito ${item.name.toLowerCase()}?` });
    }
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setFeedback(null);
  }

  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em] text-center">
      {done ? (
        <div className="cg-anim-pop py-[0.6em]">
          <p className="text-[2em]">🏆</p>
          <p className="cg-book-title text-[1.1em] font-black text-[#166534]">Parabéns! Você separou todo o lixo.</p>
          <p className="text-[0.85em] text-[#3b2a14]">
            Acertos de primeira: {score} de {TRASH.length}
          </p>
          <button type="button" onClick={restart} className="mt-[0.4em] rounded-full border border-[#16a34a] px-[0.9em] py-[0.15em] text-[0.85em] font-bold text-[#166534] hover:bg-[#dcfce7]">
            Jogar de novo
          </button>
        </div>
      ) : (
        <>
          <p className="text-[0.8em] font-bold uppercase tracking-wider text-[#8a7146]">
            Item {index + 1} de {TRASH.length}: em qual lixeira vai?
          </p>
          <p key={index} className="cg-anim-pop text-[2.4em] leading-none">
            {item.icon}
          </p>
          <p className="cg-book-title font-black text-[#3b2a14]">{item.name}</p>
        </>
      )}
      <div className="mt-[0.4em] flex flex-wrap justify-center gap-[0.3em]">
        {BINS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => choose(b.id)}
            disabled={done}
            className="rounded-lg px-[0.7em] py-[0.25em] text-[0.82em] font-black text-white shadow transition-transform hover:scale-105 disabled:opacity-50"
            style={{ background: b.color }}
          >
            🗑️ {b.name}
          </button>
        ))}
      </div>
      {feedback && !done && (
        <p className={`mt-[0.35em] rounded-lg px-[0.6em] py-[0.2em] text-[0.82em] font-bold ${feedback.ok ? "bg-[#dcfce7] text-[#166534]" : "bg-[#ffe4e6] text-[#9f1239]"}`}>
          {feedback.text}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A composteira com as minhocas
// ---------------------------------------------------------------------------

function CompostArt() {
  return (
    <Art viewBox="0 0 560 220" label="Uma composteira em camadas: em cima, cascas de frutas e folhas; no meio, as minhocas trabalhando; embaixo, o adubo pronto indo para a horta">
      <rect width="560" height="220" rx="14" fill="#fefce8" />
      {/* a caixa */}
      <rect x="60" y="30" width="200" height="170" rx="10" fill="#fde68a" stroke="#92400e" strokeWidth="3" />
      <rect x="66" y="40" width="188" height="50" fill="#84cc16" />
      <rect x="66" y="90" width="188" height="56" fill="#a16207" />
      <rect x="66" y="146" width="188" height="48" fill="#451a03" />
      {["🍌", "🍂", "🥕", "🍂", "🍎"].map((e, i) => (
        <text key={i} x={84 + i * 38} y="74" fontSize="22">
          {e}
        </text>
      ))}
      {/* as minhocas se mexendo */}
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${90 + k * 56} ${112 + (k % 2) * 16} q8 -8 16 0 t16 0 t16 0`} stroke="#f472b6" strokeWidth="5" fill="none" strokeLinecap="round">
          <animateTransform attributeName="transform" type="translate" values="0 0;10 0;0 0" dur={`${2 + k * 0.5}s`} repeatCount="indefinite" />
        </path>
      ))}
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900">
        <text x="270" y="68" fill="#3f6212">restos de frutas e folhas</text>
        <text x="270" y="122" fill="#713f12">minhocas e micróbios trabalhando</text>
        <text x="270" y="176" fill="#451a03">adubo pronto</text>
      </g>
      {/* o adubo indo pra horta */}
      <path d="M260 184 Q330 200 420 196" stroke="#78350f" strokeWidth="3" strokeDasharray="6 5" fill="none" className="cg-anim-dash" />
      <rect x="400" y="196" width="140" height="14" rx="4" fill="#78350f" />
      {[420, 455, 490, 520].map((x, i) => (
        <g key={x} transform={`translate(${x} 196)`}>
          <g className="cg-anim-rise" style={{ animationDelay: `${i * 0.2}s` }}>
            <path d="M0 0 L0 -18" stroke="#15803d" strokeWidth="3" />
            <ellipse cx="-6" cy="-18" rx="7" ry="4" fill="#22c55e" />
            <ellipse cx="6" cy="-22" rx="7" ry="4" fill="#16a34a" />
          </g>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A casa com as atitudes do dia a dia
// ---------------------------------------------------------------------------

function HomeHabitsArt() {
  const u = useUid("bike");
  return (
    <Art viewBox="0 0 560 220" label="Uma casa com atitudes sustentáveis: a luz apagada no quarto vazio, a torneira fechada ao escovar os dentes e a criança indo de bicicleta para a escola">
      <rect width="560" height="220" rx="14" fill="#e0f2fe" />
      <rect y="186" width="560" height="34" fill="#86efac" />
      {/* a casa */}
      <path d="M40 90 L150 30 L260 90 Z" fill="#dc2626" />
      <rect x="56" y="90" width="188" height="96" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
      {/* quarto vazio com a luz apagada */}
      <rect x="70" y="104" width="70" height="56" fill="#334155" stroke="#92400e" strokeWidth="2" />
      <circle cx="105" cy="116" r="7" fill="#94a3b8" />
      <text x="105" y="176" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="Georgia, serif">
        luz apagada
      </text>
      {/* banheiro com a torneira fechada */}
      <rect x="160" y="104" width="70" height="56" fill="#bae6fd" stroke="#92400e" strokeWidth="2" />
      <path d="M186 118 L200 118 L200 126" stroke="#475569" strokeWidth="4" fill="none" />
      <text x="194" y="142" textAnchor="middle" fontSize="16">
        🚰
      </text>
      <text x="195" y="176" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#1e293b" fontFamily="Georgia, serif">
        torneira fechada
      </text>
      {/* a criança de bicicleta indo pra escola */}
      <defs>
        <clipPath id={u}>
          <rect width="560" height="220" rx="14" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${u})`}>
        <animateTransform attributeName="transform" type="translate" values="0 0;200 0" dur="7s" repeatCount="indefinite" />
        <g transform="translate(290 186)">
          {[-16, 16].map((cx) => (
            <g key={cx} transform={`translate(${cx} -12)`}>
              <circle r="11" fill="none" stroke="#1e293b" strokeWidth="3" />
              <g>
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.8s" repeatCount="indefinite" />
                <path d="M-11 0 L11 0 M0 -11 L0 11" stroke="#94a3b8" strokeWidth="1.5" />
              </g>
            </g>
          ))}
          <path d="M-16 -12 L-2 -12 L6 -28 M-2 -12 L16 -12 L8 -28" stroke="#16a34a" strokeWidth="3" fill="none" />
          <Kid x={0} y={-12} s={0.55} shirt="#f59e0b" />
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontWeight="900">
        <rect x="470" y="110" width="74" height="76" fill="#fecaca" stroke="#991b1b" strokeWidth="2" />
        <text x="507" y="150" textAnchor="middle" fontSize="12" fill="#7f1d1d">
          escola
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 2, content, bare });

export const chapter2: BookPage[] = [
  page(
    <ChapterOpener
      n={2}
      title="Pequenas Atitudes, Grande Impacto"
      goals={["O que são os 3 Rs e por que a ordem importa", "As cores da coleta seletiva", "Como funciona a compostagem", "Atitudes do dia a dia que ajudam o planeta"]}
    >
      <Fig h={34}>
        <RecyclingOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="♻️">Os 3 Rs</H>
      <P>
        Um brasileiro produz, em média, cerca de <T>1 quilo de lixo por dia</T>. Para diminuir esse monte, existem os <T>3 Rs</T> da sustentabilidade. E a ordem importa:
        primeiro <T>reduzir</T>, depois <T>reutilizar</T> e, por último, <T>reciclar</T>.
      </P>
      <Fig n="2.1" caption="O melhor lixo é o que nem chega a existir." h={22}>
        <ThreeRsArt />
      </Fig>
      <Cards
        items={[
          { icon: "🍶", title: "Reduzir", text: "Usar uma garrafinha em vez de copos descartáveis." },
          { icon: "🏺", title: "Reutilizar", text: "Um pote de vidro vira porta-lápis; um pneu velho, um vaso." },
          { icon: "🏭", title: "Reciclar", text: "A lata vira lata de novo; o papel vira papel." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🗑️">A coleta seletiva</H>
      <P>
        Na <T>coleta seletiva</T>, o lixo que pode ser reciclado é separado em lixeiras de cores diferentes. É bom lavar as embalagens antes: sujeira atrapalha a
        reciclagem. Teste o que você sabe:
      </P>
      <RecycleSorter />
      <Box kind="atencao">
        <strong>Pilhas, baterias e remédios</strong> não vão em nenhuma dessas lixeiras: eles têm substâncias perigosas e devem ir para pontos de coleta especiais.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌱">Compostagem e o tempo do lixo</H>
      <P>
        Metade do lixo de casa é <T>orgânico</T>: cascas, restos de comida, folhas. Na <T>compostagem</T>, minhocas e micróbios transformam esses restos em{" "}
        <T>adubo</T> para hortas e jardins.
      </P>
      <Fig n="2.2" caption="A composteira: o lixo orgânico vira adubo." h={22}>
        <CompostArt />
      </Fig>
      <Table
        head={["Material", "Tempo para se decompor (aproximado)"]}
        rows={[
          ["Casca de fruta", "algumas semanas"],
          ["Papel", "de 3 a 6 meses"],
          ["Lata de alumínio", "de 200 a 500 anos"],
          ["Garrafa plástica", "mais de 400 anos"],
          ["Vidro", "milhares de anos (mas pode ser reciclado infinitas vezes)"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🏡">Atitudes do dia a dia</H>
      <P>
        Muitas atitudes simples ajudam vários ODS ao mesmo tempo. Apagar a luz ao sair de um cômodo economiza energia (<T>ODS 7</T>) e diminui as emissões de gases
        (<T>ODS 13</T>). Fechar a torneira cuida da água (<T>ODS 6</T>).
      </P>
      <Fig n="2.3" caption="Em casa e no caminho da escola dá para fazer muita coisa." h={22}>
        <HomeHabitsArt />
      </Fig>
      <Cards
        items={[
          { icon: "🚿", title: "Banho curto", text: "Cada minuto a menos no chuveiro economiza vários litros." },
          { icon: "🚲", title: "A pé ou de bike", text: "Ir a pé, de bicicleta ou de ônibus polui menos que ir sozinho de carro." },
        ]}
      />
      <Box kind="experimente">Durante uma semana, anote as atitudes sustentáveis da sua família. Quantas vocês conseguem fazer?</Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Os 3 Rs, nessa ordem: reduzir, reutilizar e reciclar.",
          "Coleta seletiva: azul papel, vermelha plástico, verde vidro, amarela metal e marrom orgânico.",
          "Pilhas, baterias e remédios vão para pontos de coleta especiais.",
          "Na compostagem, o lixo orgânico vira adubo.",
          "Apagar a luz, fechar a torneira e andar a pé ou de bicicleta ajudam vários ODS.",
        ]}
      />
      <Glossary
        items={[
          ["Reduzir", "Consumir e desperdiçar menos."],
          ["Reutilizar", "Usar de novo, do mesmo jeito ou com outra função."],
          ["Reciclar", "Transformar o material usado em um produto novo."],
          ["Coleta seletiva", "Separar o lixo reciclável por tipo de material."],
          ["Compostagem", "Transformar restos orgânicos em adubo."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a ordem dos 3 Rs?", "Reduzir, reutilizar e reciclar."],
          ["Qual é a cor da lixeira do vidro?", "Verde."],
          ["O que é compostagem?", "Transformar restos de alimentos e folhas em adubo."],
          ["Por que a garrafinha reutilizável é melhor que o copo descartável?", "Porque gera muito menos lixo plástico."],
        ]}
      />
    </>,
  ),
];
