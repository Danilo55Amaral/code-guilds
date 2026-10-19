"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Kid, Sun, Tree } from "./art";

// ============================================================================
// CAPÍTULO 7 — FOME ZERO, SAÚDE E EDUCAÇÃO (as perguntas dos ODS 2, 3 e 4 das
// missões "ODS" e da agroecologia de "ODS: Consumo, Cidades e
// Biodiversidade"): a horta da escola crescendo, o caminho do alimento com o
// desperdício em cada etapa, o sítio agroecológico com as abelhas, o jogo do
// Guia Alimentar (de tocar) e a escola com os livros voando.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a horta da escola
// ---------------------------------------------------------------------------

function GardenOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Crianças cuidando da horta da escola: as verduras crescendo, o regador molhando as plantas e o Sol brilhando">
      <rect width="460" height="300" fill="#ecfccb" />
      <Sun x={400} y={56} r={26} />
      <rect y="200" width="460" height="100" fill="#a16207" />
      {[0, 1, 2].map((row) => (
        <rect key={row} x="40" y={212 + row * 28} width="380" height="16" rx="8" fill="#78350f" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i} transform={`translate(${70 + i * 40} ${214 + (i % 3) * 28})`}>
          <g className="cg-anim-rise" style={{ animationDelay: `${i * 0.12}s` }}>
            <path d="M0 0 L0 -16" stroke="#15803d" strokeWidth="3" />
            <ellipse cx="-7" cy="-16" rx="9" ry="5" fill="#22c55e" />
            <ellipse cx="7" cy="-20" rx="9" ry="5" fill="#16a34a" />
            {i % 3 === 0 && <circle cx="0" cy="-26" r="5" fill="#ef4444" />}
          </g>
        </g>
      ))}
      <Kid x={110} y={204} s={1.1} shirt="#4c9f38" skin="#8d5524" />
      <g transform="translate(330 204)">
        <Kid x={0} y={0} s={1.1} shirt="#dda63a" skin="#f1c9a5" />
        {/* o regador e a água */}
        <g>
          <animateTransform attributeName="transform" type="rotate" values="0 -20 -40;-20 -20 -40;0 -20 -40" dur="3s" repeatCount="indefinite" />
          <rect x="-44" y="-46" width="24" height="16" rx="4" fill="#0ea5e9" />
          <path d="M-44 -40 L-60 -48" stroke="#0ea5e9" strokeWidth="4" />
        </g>
        {[0, 1, 2].map((k) => (
          <circle key={k} cx="-62" r="2.5" fill="#38bdf8">
            <animate attributeName="cy" values="-44;-4" dur="0.9s" begin={`${-k * 0.3}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O caminho do alimento e o desperdício
// ---------------------------------------------------------------------------

function FoodWasteArt() {
  const steps = [
    { icon: "🚜", name: "Plantação" },
    { icon: "🚚", name: "Transporte" },
    { icon: "🏪", name: "Mercado" },
    { icon: "🍽️", name: "Casa" },
  ];
  return (
    <Art viewBox="0 0 560 200" label="O caminho do alimento: da plantação ao transporte, ao mercado e à casa; em cada etapa, um pouco da comida é perdida ou jogada fora">
      <rect width="560" height="200" rx="14" fill="#fefce8" />
      <path d="M70 80 L490 80" stroke="#d6b77a" strokeWidth="8" strokeLinecap="round" />
      {steps.map((s, i) => (
        <g key={s.name} transform={`translate(${70 + i * 140} 80)`}>
          <circle r="32" fill="#fff" stroke="#ca8a04" strokeWidth="3" />
          <text y="11" textAnchor="middle" fontSize="30">
            {s.icon}
          </text>
          <text y="52" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#713f12" fontFamily="Georgia, serif">
            {s.name}
          </text>
          {/* a comida caindo fora do caminho */}
          <text x="22" textAnchor="middle" fontSize="16">
            <animate attributeName="y" values="20;150" dur="2.4s" begin={`${-i * 0.6}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="2.4s" begin={`${-i * 0.6}s`} repeatCount="indefinite" />
            🍅
          </text>
        </g>
      ))}
      <rect x="40" y="168" width="480" height="20" rx="6" fill="#fde68a" />
      <text x="280" y="183" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
        cerca de 1/3 dos alimentos do mundo é perdido ou desperdiçado
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O sítio agroecológico
// ---------------------------------------------------------------------------

function AgroecologyArt() {
  return (
    <Art viewBox="0 0 560 210" label="Um sítio agroecológico com muitas plantas diferentes misturadas, árvores, abelhas voando entre as flores e uma família colhendo, sem agrotóxicos">
      <rect width="560" height="210" rx="14" fill="#e0f2fe" />
      <path d="M0 150 Q280 120 560 150 L560 210 L0 210 Z" fill="#65a30d" />
      <Tree x={40} y={160} s={1} />
      <Tree x={520} y={160} s={0.9} color="#22c55e" />
      {/* plantas variadas */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = 90 + i * 34;
        const kind = i % 3;
        return (
          <g key={i} transform={`translate(${x} ${160 + (i % 2) * 14})`}>
            <path d="M0 0 L0 -24" stroke="#166534" strokeWidth="3" />
            {kind === 0 && <circle cy="-28" r="8" fill="#ef4444" />}
            {kind === 1 && <ellipse cy="-28" rx="10" ry="6" fill="#facc15" />}
            {kind === 2 && (
              <g>
                <circle cy="-30" r="6" fill="#f472b6" />
                <circle cy="-30" r="2.5" fill="#fde047" />
              </g>
            )}
          </g>
        );
      })}
      {/* as abelhas */}
      {[0, 1, 2].map((k) => (
        <g key={k}>
          <animateMotion path={`M${120 + k * 120} 110 q40 -30 80 0 t80 0 q-40 30 -80 0 t-80 0`} dur={`${5 + k}s`} repeatCount="indefinite" />
          <ellipse rx="6" ry="4" fill="#facc15" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M-1 -4 L-1 4 M2 -4 L2 4" stroke="#1e293b" strokeWidth="1.5" />
          <ellipse cx="-1" cy="-6" rx="4" ry="2.5" fill="#fff" opacity="0.8">
            <animate attributeName="ry" values="2.5;0.8;2.5" dur="0.15s" repeatCount="indefinite" />
          </ellipse>
        </g>
      ))}
      <Kid x={300} y={178} s={0.9} shirt="#dda63a" skin="#c68642" />
      <text x="280" y="36" textAnchor="middle" fontSize="13" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">
        muitas plantas juntas, abelhas e nenhum agrotóxico
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo do Guia Alimentar (de tocar)
// ---------------------------------------------------------------------------

type FoodKind = "natura" | "processado" | "ultra";

const KINDS: { id: FoodKind; name: string; color: string; tip: string }[] = [
  { id: "natura", name: "In natura", color: "#16a34a", tip: "Do jeito que vem da natureza, ou quase: deve ser a base da alimentação." },
  { id: "processado", name: "Processado", color: "#ca8a04", tip: "Alimento com sal, açúcar ou óleo adicionado, como queijo e pão: com moderação." },
  { id: "ultra", name: "Ultraprocessado", color: "#dc2626", tip: "Feito na fábrica com muitos ingredientes artificiais: é melhor evitar." },
];

const FOODS: { icon: string; name: string; kind: FoodKind }[] = [
  { icon: "🍎", name: "Maçã", kind: "natura" },
  { icon: "🥤", name: "Refrigerante", kind: "ultra" },
  { icon: "🥕", name: "Cenoura", kind: "natura" },
  { icon: "🧀", name: "Queijo", kind: "processado" },
  { icon: "🍟", name: "Salgadinho de pacote", kind: "ultra" },
  { icon: "🍚", name: "Arroz e feijão", kind: "natura" },
  { icon: "🍞", name: "Pão francês", kind: "processado" },
  { icon: "🍪", name: "Biscoito recheado", kind: "ultra" },
];

export function FoodGuideGame() {
  const [index, setIndex] = useState(0);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const done = index >= FOODS.length;
  const food = FOODS[Math.min(index, FOODS.length - 1)];

  function choose(kind: FoodKind) {
    if (done) return;
    const right = KINDS.find((k) => k.id === food.kind)!;
    if (kind === food.kind) {
      setMsg({ ok: true, text: `Certo! ${food.name}: ${right.name.toLowerCase()}. ${right.tip}` });
      setIndex((i) => i + 1);
    } else {
      setMsg({ ok: false, text: "Quase! Pense: esse alimento vem direto da natureza ou de uma fábrica?" });
    }
  }

  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em] text-center">
      {done ? (
        <div className="cg-anim-pop">
          <p className="text-[2em]">🥗</p>
          <p className="cg-book-title font-black text-[#166534]">Muito bem! Você conhece o Guia Alimentar.</p>
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setMsg(null);
            }}
            className="mt-[0.3em] rounded-full border border-[#16a34a] px-[0.9em] py-[0.1em] text-[0.85em] font-bold text-[#166534]"
          >
            Jogar de novo
          </button>
        </div>
      ) : (
        <>
          <p className="text-[0.8em] font-bold uppercase tracking-wider text-[#8a7146]">
            Alimento {index + 1} de {FOODS.length}
          </p>
          <p key={index} className="cg-anim-pop text-[2.4em] leading-none">
            {food.icon}
          </p>
          <p className="cg-book-title font-black text-[#3b2a14]">{food.name}</p>
          <div className="mt-[0.3em] flex flex-wrap justify-center gap-[0.3em]">
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => choose(k.id)}
                className="rounded-lg px-[0.7em] py-[0.2em] text-[0.82em] font-black text-white shadow transition-transform hover:scale-105"
                style={{ background: k.color }}
              >
                {k.name}
              </button>
            ))}
          </div>
        </>
      )}
      {msg && (
        <p className={`mt-[0.35em] rounded-lg px-[0.6em] py-[0.2em] text-[0.8em] font-bold ${msg.ok ? "bg-[#dcfce7] text-[#166534]" : "bg-[#ffe4e6] text-[#9f1239]"}`}>{msg.text}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// A escola com os livros voando
// ---------------------------------------------------------------------------

function SchoolArt() {
  return (
    <Art viewBox="0 0 560 210" label="Uma escola com crianças entrando e livros abertos voando como pássaros em volta do prédio">
      <rect width="560" height="210" rx="14" fill="#fef2f2" />
      <rect y="176" width="560" height="34" fill="#86efac" />
      <path d="M170 70 L280 24 L390 70 Z" fill="#c5192d" />
      <rect x="186" y="70" width="188" height="106" fill="#fde68a" stroke="#92400e" strokeWidth="2" />
      <rect x="262" y="120" width="36" height="56" fill="#92400e" />
      {[200, 330].map((x) => (
        <rect key={x} x={x} y="88" width="30" height="24" fill="#bae6fd" stroke="#92400e" strokeWidth="2" />
      ))}
      <text x="280" y="62" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
        ESCOLA
      </text>
      {/* os livros voando */}
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <animateMotion path="M90 60 C160 0 400 0 470 60 C400 120 160 120 90 60 Z" dur="10s" begin={`${-k * 2.5}s`} repeatCount="indefinite" />
          <g>
            <animateTransform attributeName="transform" type="scale" values="1 1;1 0.4;1 1" dur="0.5s" repeatCount="indefinite" />
            <path d="M0 0 L-14 -6 L-14 6 Z" fill={["#2563eb", "#16a34a", "#dc2626", "#f59e0b"][k]} />
            <path d="M0 0 L14 -6 L14 6 Z" fill={["#60a5fa", "#4ade80", "#f87171", "#fbbf24"][k]} />
          </g>
        </g>
      ))}
      <Kid x={150} y={180} s={0.9} shirt="#2563eb" skin="#8d5524" />
      <Kid x={420} y={180} s={0.9} shirt="#dd1367" skin="#f1c9a5" />
      <Kid x={460} y={180} s={0.75} shirt="#fcc30b" skin="#c68642" />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 7, content, bare });

export const chapter7: BookPage[] = [
  page(
    <ChapterOpener
      n={7}
      title="Fome Zero, Saúde e Educação"
      goals={["O que é o ODS 2 e por que tanta comida é desperdiçada", "O que é agroecologia", "Como comer melhor com o Guia Alimentar", "Por que a educação é a base de tudo"]}
    >
      <Fig h={34}>
        <GardenOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌾">Fome zero</H>
      <P>
        O <T>ODS 2</T> quer acabar com a fome no mundo até 2030. O mundo produz comida suficiente para todos, mas milhões de pessoas ainda passam fome. Ao mesmo
        tempo, segundo a ONU, cerca de <T>um terço</T> dos alimentos produzidos é <T>perdido ou desperdiçado</T>.
      </P>
      <Fig n="7.1" caption="Em cada etapa do caminho, um pouco da comida vai embora." h={20}>
        <FoodWasteArt />
      </Fig>
      <Box kind="sabia">
        Em 2014, o Brasil saiu do <strong>Mapa da Fome</strong> da ONU. Anos depois voltou a ele, e saiu de novo em 2025. Combater a fome é um trabalho que não pode
        parar.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🐝">Agroecologia</H>
      <P>
        A <T>agroecologia</T> é um jeito de produzir alimentos que respeita a natureza: usa pouco ou nenhum <T>agrotóxico</T>, mistura várias plantas e valoriza a
        biodiversidade, como as abelhas que polinizam as flores.
      </P>
      <Fig n="7.2" caption="No sítio agroecológico, as plantas, os bichos e as pessoas se ajudam." h={22}>
        <AgroecologyArt />
      </Fig>
      <Cards
        items={[
          { icon: "🚜", title: "Agricultura familiar", text: "Pequenos produtores plantam boa parte da comida que chega à nossa mesa." },
          { icon: "🥬", title: "Da horta à mesa", text: "Hortas na escola e em casa ensinam de onde vem o alimento." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🍎">Saúde e alimentação</H>
      <P>
        O <T>ODS 3</T> quer saúde e bem-estar para todos. Vacinas, saneamento e uma boa alimentação são a base. O <T>Guia Alimentar para a População Brasileira</T>{" "}
        ensina: prefira os alimentos <T>in natura</T> e evite os <T>ultraprocessados</T>. Classifique:
      </P>
      <FoodGuideGame />
      <Box kind="lembre">
        No Brasil, o <strong>SUS</strong> (Sistema Único de Saúde) atende qualquer pessoa de graça, das vacinas às cirurgias.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📚">Educação de qualidade</H>
      <P>
        O <T>ODS 4</T> quer que todas as crianças e jovens tenham acesso a uma escola boa, gratuita e inclusiva. A educação abre caminho para todos os outros ODS: quem
        estuda entende melhor o mundo e consegue mudá-lo.
      </P>
      <Fig n="7.3" caption="A escola é o lugar onde os ODS começam." h={22}>
        <SchoolArt />
      </Fig>
      <Box kind="sabia">
        O educador <strong>Paulo Freire</strong>, patrono da educação brasileira, dizia que ensinar é ajudar as pessoas a lerem o mundo, e não só as palavras.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O ODS 2 quer acabar com a fome; cerca de 1/3 dos alimentos do mundo é perdido ou desperdiçado.",
          "A agroecologia produz alimentos respeitando a natureza, com pouco ou nenhum agrotóxico.",
          "O ODS 3 trata da saúde; o Guia Alimentar recomenda alimentos in natura e evitar ultraprocessados.",
          "O SUS atende todas as pessoas de graça.",
          "O ODS 4 quer educação de qualidade, gratuita e inclusiva para todos.",
        ]}
      />
      <Glossary
        items={[
          ["Desperdício", "Comida boa que é jogada fora."],
          ["Agroecologia", "Produção de alimentos que respeita a natureza."],
          ["Agrotóxico", "Produto químico usado contra pragas nas plantações."],
          ["In natura", "Alimento do jeito que vem da natureza."],
          ["Ultraprocessado", "Alimento de fábrica, com muitos ingredientes artificiais."],
        ]}
      />
      <Quiz
        items={[
          ["Qual ODS quer acabar com a fome?", "O ODS 2, fome zero e agricultura sustentável."],
          ["Quanto dos alimentos do mundo é perdido ou desperdiçado?", "Cerca de um terço."],
          ["O que é agroecologia?", "Produzir alimentos respeitando a natureza, com pouco ou nenhum agrotóxico."],
          ["Qual ODS trata da educação de qualidade?", "O ODS 4."],
        ]}
      />
    </>,
  ),
];
