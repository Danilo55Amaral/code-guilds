"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Kid } from "./art";

// ============================================================================
// CAPÍTULO 8 — CONSUMO RESPONSÁVEL (missão "ODS: Consumo, Cidades e
// Biodiversidade", a parte do consumo): o carrinho de compras dando voltas
// nas setas da reciclagem, a economia linear × circular (de tocar), o
// celular que fica velho rápido e o lixo eletrônico, e o caminhão da
// logística reversa levando as pilhas e os pneus de volta para a fábrica.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o carrinho de compras dando voltas
// ---------------------------------------------------------------------------

function CartOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um carrinho de compras no meio de três setas verdes em círculo, o símbolo da reciclagem, girando devagar">
      <rect width="460" height="300" fill="#fefce8" />
      <g transform="translate(230 150)">
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="16s" repeatCount="indefinite" />
          {[0, 120, 240].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d="M-40 -104 A110 110 0 0 1 72 -82" stroke="#16a34a" strokeWidth="18" fill="none" strokeLinecap="round" />
              <path d="M66 -100 L98 -72 L58 -62 Z" fill="#16a34a" />
            </g>
          ))}
        </g>
        {/* o carrinho */}
        <g className="cg-anim-float">
          <path d="M-60 -30 L-44 -30 L-26 30 L40 30 L54 -14 L-36 -14" stroke="#1e293b" strokeWidth="6" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx="-16" cy="46" r="8" fill="#1e293b" />
          <circle cx="32" cy="46" r="8" fill="#1e293b" />
          <text x="10" y="18" textAnchor="middle" fontSize="28">
            🍎🥫
          </text>
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Economia linear × circular (de tocar)
// ---------------------------------------------------------------------------

const LINEAR = [
  { icon: "⛏️", name: "Extrair" },
  { icon: "🏭", name: "Produzir" },
  { icon: "🛍️", name: "Usar" },
  { icon: "🗑️", name: "Descartar" },
];

const CIRCULAR = [
  { icon: "🏭", name: "Produzir" },
  { icon: "🛍️", name: "Usar" },
  { icon: "🔧", name: "Consertar" },
  { icon: "🔁", name: "Reutilizar" },
  { icon: "♻️", name: "Reciclar" },
];

export function EconomyToggle() {
  const [circular, setCircular] = useState(false);
  const steps = circular ? CIRCULAR : LINEAR;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.5em]">
      <svg key={String(circular)} viewBox="0 0 520 200" className="block w-full rounded-lg" aria-label={circular ? "Economia circular: produzir, usar, consertar, reutilizar e reciclar, voltando ao começo" : "Economia linear: extrair, produzir, usar e descartar"}>
        <rect width="520" height="200" fill={circular ? "#f0fdf4" : "#fef2f2"} />
        {circular ? (
          <>
            <circle cx="260" cy="100" r="72" fill="none" stroke="#16a34a" strokeWidth="5" strokeDasharray="14 10">
              <animate attributeName="stroke-dashoffset" values="0;-48" dur="1.5s" repeatCount="indefinite" />
            </circle>
            {steps.map((s, i) => {
              const a = -Math.PI / 2 + (i / steps.length) * Math.PI * 2;
              const x = 260 + Math.cos(a) * 72;
              const y = 100 + Math.sin(a) * 72;
              return (
                <g key={s.name} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
                  <g className="cg-anim-pop" style={{ animationDelay: `${i * 0.12}s` }}>
                    <circle r="24" fill="#fff" stroke="#16a34a" strokeWidth="3" />
                    <text y="8" textAnchor="middle" fontSize="22">
                      {s.icon}
                    </text>
                  </g>
                  <text x={x > 260 ? 32 : -32} y="5" textAnchor={x > 260 ? "start" : "end"} fontSize="12" fontWeight="900" fill="#14532d" fontFamily="Georgia, serif">
                    {s.name}
                  </text>
                </g>
              );
            })}
          </>
        ) : (
          <>
            <path d="M60 100 L460 100" stroke="#dc2626" strokeWidth="5" strokeDasharray="14 10">
              <animate attributeName="stroke-dashoffset" values="0;-48" dur="1.5s" repeatCount="indefinite" />
            </path>
            {steps.map((s, i) => (
              <g key={s.name} transform={`translate(${60 + i * 133} 100)`}>
                <g className="cg-anim-pop" style={{ animationDelay: `${i * 0.12}s` }}>
                  <circle r="28" fill="#fff" stroke="#dc2626" strokeWidth="3" />
                  <text y="9" textAnchor="middle" fontSize="26">
                    {s.icon}
                  </text>
                </g>
                <text y="50" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#7f1d1d" fontFamily="Georgia, serif">
                  {s.name}
                </text>
              </g>
            ))}
            <text x="460" y="170" textAnchor="middle" fontSize="11.5" fontStyle="italic" fill="#991b1b" fontFamily="Georgia, serif">
              e vira lixo...
            </text>
          </>
        )}
      </svg>
      <div className="mt-[0.35em] flex justify-center gap-[0.4em] text-[0.88em]">
        <button type="button" onClick={() => setCircular(false)} className={`rounded-full border px-[0.8em] py-[0.1em] font-bold ${!circular ? "border-[#dc2626] bg-[#dc2626] text-white" : "border-[#d9c79d] bg-white"}`}>
          Linear
        </button>
        <button type="button" onClick={() => setCircular(true)} className={`rounded-full border px-[0.8em] py-[0.1em] font-bold ${circular ? "border-[#16a34a] bg-[#16a34a] text-white" : "border-[#d9c79d] bg-white"}`}>
          Circular
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// O celular que fica velho rápido e o lixo eletrônico
// ---------------------------------------------------------------------------

function EwasteArt() {
  return (
    <Art viewBox="0 0 560 210" label="Um celular que para de funcionar depois de pouco tempo e é jogado numa pilha de lixo eletrônico, com fios, teclados e baterias">
      <rect width="560" height="210" rx="14" fill="#f1f5f9" />
      {/* o celular envelhecendo */}
      {[0, 1, 2].map((k) => (
        <g key={k} transform={`translate(${60 + k * 90} 70)`}>
          <rect x="-24" y="-44" width="48" height="88" rx="8" fill="#1e293b" />
          <rect x="-19" y="-36" width="38" height="66" rx="3" fill={["#38bdf8", "#94a3b8", "#475569"][k]} />
          {k === 2 && <path d="M-14 -24 L10 6 L-4 4 L12 26" stroke="#e2e8f0" strokeWidth="2" fill="none" />}
          <text y="66" textAnchor="middle" fontSize="11.5" fontWeight="900" fill="#334155" fontFamily="Georgia, serif">
            {["novo", "1 ano depois", "2 anos depois"][k]}
          </text>
        </g>
      ))}
      <path d="M300 70 L350 120" stroke="#64748b" strokeWidth="3" strokeDasharray="6 5" className="cg-anim-dash" />
      {/* a pilha de lixo eletrônico */}
      <path d="M340 190 Q440 90 540 190 Z" fill="#94a3b8" />
      {["📱", "⌨️", "🔋", "💻", "🖱️", "📺"].map((e, i) => (
        <text key={i} x={380 + (i % 3) * 50} y={170 - Math.floor(i / 3) * 34} fontSize="24">
          {e}
        </text>
      ))}
      <text x="440" y="40" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#991b1b" fontFamily="Georgia, serif">
        lixo eletrônico
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A logística reversa
// ---------------------------------------------------------------------------

function ReverseLogisticsArt() {
  return (
    <Art viewBox="0 0 560 210" label="O caminho de volta: as pilhas, os pneus e o óleo usados vão do ponto de coleta, num caminhão, de volta para a fábrica, que recicla ou descarta direito">
      <rect width="560" height="210" rx="14" fill="#ecfeff" />
      <ellipse cx="280" cy="110" rx="210" ry="70" fill="none" stroke="#0891b2" strokeWidth="4" strokeDasharray="12 10" className="cg-anim-dash" />
      {/* a fábrica */}
      <g transform="translate(80 110)">
        <rect x="-40" y="-30" width="80" height="54" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
        <rect x="14" y="-56" width="14" height="26" fill="#64748b" />
        <rect x="-32" y="31" width="64" height="18" rx="5" fill="#ecfeff" />
        <text y="44" textAnchor="middle" fontSize="12" fontWeight="900" fill="#164e63" fontFamily="Georgia, serif">
          fábrica
        </text>
      </g>
      {/* a loja e o ponto de coleta */}
      <g transform="translate(480 110)">
        <rect x="-40" y="-30" width="80" height="54" fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
        <text y="0" textAnchor="middle" fontSize="20">
          🔋💡
        </text>
        <rect x="-56" y="31" width="112" height="18" rx="5" fill="#ecfeff" />
        <text y="44" textAnchor="middle" fontSize="12" fontWeight="900" fill="#164e63" fontFamily="Georgia, serif">
          ponto de coleta
        </text>
      </g>
      {/* o caminhão dando a volta */}
      <g>
        <animateMotion path="M280 40 A210 70 0 1 1 279 40" dur="9s" repeatCount="indefinite" rotate="auto" />
        <rect x="-26" y="-12" width="34" height="22" rx="3" fill="#0891b2" />
        <rect x="8" y="-6" width="16" height="16" rx="3" fill="#155e75" />
        <circle cx="-16" cy="12" r="5" fill="#1e293b" />
        <circle cx="14" cy="12" r="5" fill="#1e293b" />
      </g>
      <text x="280" y="200" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#0e7490" fontFamily="Georgia, serif">
        o produto usado volta para quem fabricou
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 8, content, bare });

export const chapter8: BookPage[] = [
  page(
    <ChapterOpener
      n={8}
      title="Consumo Responsável"
      goals={["A diferença entre economia linear e circular", "O que é obsolescência programada", "Para que serve a logística reversa", "Como ser um consumidor consciente"]}
    >
      <Fig h={34}>
        <CartOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔁">Linear ou circular?</H>
      <P>
        Na <T>economia linear</T>, o caminho é uma reta: extrair da natureza, produzir, usar e jogar fora. Na <T>economia circular</T>, os produtos são pensados para
        serem consertados, reaproveitados e reciclados, e o lixo quase desaparece. Compare:
      </P>
      <EconomyToggle />
      <Box kind="lembre">
        O <strong>ODS 12</strong> quer consumo e produção responsáveis: desperdiçar menos, reaproveitar mais e produzir sem esgotar a natureza.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📱">Feito para durar pouco</H>
      <P>
        A <T>obsolescência programada</T> acontece quando um produto é feito para durar pouco ou ficar ultrapassado rápido, para forçar uma nova compra. Ela aumenta
        muito o <T>lixo eletrônico</T>.
      </P>
      <Fig n="8.1" caption="O celular envelhece rápido e vira lixo eletrônico." h={22}>
        <EwasteArt />
      </Fig>
      <Box kind="atencao">
        Lixo eletrônico tem metais tóxicos, como chumbo e mercúrio, e também metais valiosos, como ouro e cobre. Ele nunca deve ir para o lixo comum.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🚚">A logística reversa</H>
      <P>
        A <T>logística reversa</T> é o caminho de volta: produtos e embalagens usados voltam até o fabricante, que recicla ou descarta do jeito certo. No Brasil, a{" "}
        <T>Política Nacional de Resíduos Sólidos</T> (2010) obriga a logística reversa de pilhas, pneus, óleo lubrificante, lâmpadas e eletrônicos.
      </P>
      <Fig n="8.2" caption="O caminhão da logística reversa leva o produto usado de volta." h={22}>
        <ReverseLogisticsArt />
      </Fig>
    </>,
  ),

  page(
    <>
      <H icon="🛒">O consumidor consciente</H>
      <P>Antes de comprar alguma coisa, vale fazer algumas perguntas:</P>
      <List
        items={[
          "Eu preciso mesmo disso, ou só quero na hora?",
          "Dá para consertar o que eu já tenho, pegar emprestado ou trocar?",
          "Esse produto dura bastante? Tem muita embalagem?",
          "De onde ele vem e como foi feito?",
        ]}
      />
      <Cards
        items={[
          { icon: "🔄", title: "Feira de trocas", text: "Livros, brinquedos e roupas que você não usa podem fazer outra pessoa feliz." },
          { icon: "🧵", title: "Conserto", text: "Costurar, colar e consertar fazem as coisas durarem muito mais." },
        ]}
      />
      <div className="mt-[0.5em] flex justify-center">
        <svg viewBox="0 0 200 90" className="h-[4.5em] w-auto" aria-hidden="true">
          <Kid x={60} y={86} s={1} shirt="#bf8b2e" skin="#8d5524" />
          <Kid x={140} y={86} s={1} shirt="#16a34a" skin="#f1c9a5" />
          <text x="100" y="40" textAnchor="middle" fontSize="22" className="cg-anim-float">
            📚
          </text>
        </svg>
      </div>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Economia linear: extrair, produzir, usar e descartar. Circular: consertar, reutilizar e reciclar.",
          "A obsolescência programada faz os produtos durarem pouco e aumenta o lixo eletrônico.",
          "Lixo eletrônico tem metais tóxicos e valiosos e não vai no lixo comum.",
          "A logística reversa leva pilhas, pneus, óleo e eletrônicos de volta ao fabricante.",
          "O ODS 12 pede consumo e produção responsáveis.",
        ]}
      />
      <Glossary
        items={[
          ["Economia circular", "Modelo em que os produtos são consertados, reaproveitados e reciclados."],
          ["Obsolescência programada", "Produto feito para durar pouco."],
          ["Logística reversa", "O caminho de volta dos produtos usados até o fabricante."],
          ["Lixo eletrônico", "Aparelhos eletrônicos jogados fora."],
          ["Consumo consciente", "Comprar pensando nas pessoas e no planeta."],
        ]}
      />
      <Quiz
        items={[
          ["O que é economia circular?", "Um modelo em que os produtos são reaproveitados, consertados e reciclados, reduzindo o lixo."],
          ["O que é obsolescência programada?", "Quando um produto é feito para durar pouco, forçando uma nova compra."],
          ["Cite um produto que tem logística reversa no Brasil.", "Pilhas, pneus, óleo, lâmpadas ou eletrônicos."],
          ["Qual ODS trata do consumo e da produção responsáveis?", "O ODS 12."],
        ]}
      />
    </>,
  ),
];
