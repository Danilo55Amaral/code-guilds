"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { MATH, MATH_DARK, Panel, Slider } from "./art";

// ============================================================================
// CAPÍTULO 3 — PORCENTAGEM (missão "Matemática: Porcentagem e Proporção", a
// parte da porcentagem): a vitrine em liquidação, os 100 quadradinhos, a
// calculadora de porcentagem (de tocar), as etiquetas de desconto e aumento e
// as pilhas de moedas dos juros.
// ============================================================================

const brl = (v: number) => `R$ ${v.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}`;

// ---------------------------------------------------------------------------
// Abertura: a vitrine em liquidação
// ---------------------------------------------------------------------------

function SaleOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma camiseta na vitrine com a etiqueta balançando: de 80 reais por 60 reais, 25% de desconto, e sinais de por cento caindo">
      <rect width="460" height="300" fill="#fdf4ff" />
      <rect x="40" y="40" width="380" height="220" rx="12" fill="#fff" stroke="#c084fc" strokeWidth="4" />
      {/* os % caindo */}
      {[70, 150, 300, 380].map((x, i) => (
        <text key={x} x={x} y="120" fontSize="22" fontWeight="900" fill="#d8b4fe" fontFamily="Georgia, serif">
          <animate attributeName="y" values="40;250" dur="5s" begin={`${-i * 1.2}s`} repeatCount="indefinite" />%
        </text>
      ))}
      {/* a camiseta */}
      <path d="M110 100 L150 80 Q170 96 190 80 L230 100 L215 130 L200 124 L200 220 L140 220 L140 124 L125 130 Z" fill="#7c3aed" stroke="#3b0764" strokeWidth="3" strokeLinejoin="round" />
      <text x="170" y="170" textAnchor="middle" fontSize="26" fontWeight="900" fill="#fde68a" fontFamily="Georgia, serif">
        π
      </text>
      {/* a etiqueta balançando no barbante */}
      <path d="M225 100 L280 110" stroke="#78350f" strokeWidth="2" />
      <g transform="translate(280 110)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-8;8;-8" dur="2.6s" repeatCount="indefinite" />
          <path d="M0 0 L20 -14 L140 -14 L140 96 L20 96 Z" fill="#fde047" stroke="#a16207" strokeWidth="2" />
          <circle cx="16" cy="0" r="5" fill="#fff" stroke="#a16207" />
          <text x="80" y="18" textAnchor="middle" fontSize="18" fill="#78350f" fontFamily="Georgia, serif" textDecoration="line-through">
            R$ 80
          </text>
          <text x="80" y="50" textAnchor="middle" fontSize="28" fontWeight="900" fill="#b91c1c" fontFamily="Georgia, serif">
            R$ 60
          </text>
          <text x="80" y="80" textAnchor="middle" fontSize="16" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
            25% OFF
          </text>
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os 100 quadradinhos (a figura) e a calculadora (de tocar)
// ---------------------------------------------------------------------------

function HundredGrid({ painted, size = 14 }: { painted: number; size?: number }) {
  return (
    <svg viewBox={`0 0 ${size * 10 + 2} ${size * 10 + 2}`} className="h-full w-full" aria-label={`${painted} de 100 quadradinhos pintados`}>
      {Array.from({ length: 100 }, (_, k) => (
        <rect key={k} x={1 + (k % 10) * size} y={1 + Math.floor(k / 10) * size} width={size - 2} height={size - 2} rx="2" fill={k < painted ? MATH : "#ede9fe"} />
      ))}
    </svg>
  );
}

function QuarterArt() {
  return (
    <Art viewBox="0 0 560 190" label="Cem quadradinhos com 25 pintados, um quarto, e ao lado as formas de escrever: 25%, 25/100, 1/4 e 0,25">
      <rect width="560" height="190" rx="14" fill="#faf5ff" />
      {Array.from({ length: 100 }, (_, k) => (
        <rect key={k} x={60 + (k % 10) * 16} y={15 + Math.floor(k / 10) * 16} width="14" height="14" rx="2" fill="#ede9fe">
          {k < 25 && <animate attributeName="fill" values="#ede9fe;#ede9fe;#7c3aed;#7c3aed" keyTimes={`0;${(k * 0.025).toFixed(3)};${(k * 0.025 + 0.02).toFixed(3)};1`} dur="5s" repeatCount="indefinite" />}
        </rect>
      ))}
      <g fontFamily="Georgia, serif" fontWeight="900" fill={MATH_DARK}>
        <text x="270" y="60" fontSize="34">
          25%
        </text>
        <text x="270" y="100" fontSize="22">
          = 25/100 = 1/4
        </text>
        <text x="270" y="134" fontSize="22">
          = 0,25
        </text>
        <text x="270" y="166" fontSize="13" fill="#6b21a8">
          25 quadradinhos de cada 100
        </text>
      </g>
    </Art>
  );
}

export function PercentCalc() {
  const [value, setValue] = useState(250);
  const [pct, setPct] = useState(10);
  const result = (value * pct) / 100;
  return (
    <Panel title="Calculadora de porcentagem">
      <div className="flex items-center gap-[0.8em]">
        <div className="h-[6.5em] w-[6.5em] shrink-0">
          <HundredGrid painted={pct} />
        </div>
        <div className="min-w-0 flex-1 space-y-[0.3em]">
          <Slider label="Por cento" value={pct} min={0} max={100} step={5} onChange={setPct} suffix="%" />
          <Slider label="Do valor" value={value} min={0} max={500} step={10} onChange={setValue} />
          <p className="cg-book-title text-center text-[1.15em] font-black" style={{ color: MATH_DARK }}>
            {pct}% de {value} = {result.toLocaleString("pt-BR")}
          </p>
          <p className="text-center text-[0.78em] text-[#3b2a14]">
            {value} ÷ 100 × {pct}
          </p>
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As etiquetas de desconto e de aumento
// ---------------------------------------------------------------------------

function TagsArt() {
  const tag = (x: number, title: string, from: string, delta: string, to: string, color: string, arrow: "down" | "up", i: number) => (
    <g transform={`translate(${x} 30)`}>
      <rect width="210" height="130" rx="12" fill="#fff" stroke={color} strokeWidth="3" />
      <text x="105" y="26" textAnchor="middle" fontSize="15" fontWeight="900" fill={color} fontFamily="Georgia, serif">
        {title}
      </text>
      <text x="105" y="58" textAnchor="middle" fontSize="20" fontWeight="700" fill="#334155" fontFamily="Georgia, serif">
        {from}
      </text>
      <text x="105" y="84" textAnchor="middle" fontSize="15" fontWeight="900" fill={color} fontFamily="Georgia, serif">
        {delta}
      </text>
      <text x="105" y="116" textAnchor="middle" fontSize="26" fontWeight="900" fill={MATH_DARK} fontFamily="Georgia, serif">
        {to}
        <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.3;0.45;1" dur="4s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
      </text>
      <path d={arrow === "down" ? "M190 50 L190 100 M182 90 L190 100 L198 90" : "M190 100 L190 50 M182 60 L190 50 L198 60"} stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
  return (
    <Art viewBox="0 0 560 190" label="Duas etiquetas: uma camiseta de 80 reais com 25% de desconto passa a 60 reais; um produto de 200 reais com 15% de aumento passa a 230 reais">
      <rect width="560" height="190" rx="14" fill="#faf5ff" />
      {tag(55, "DESCONTO", "R$ 80", "− 25% (− R$ 20)", "R$ 60", "#16a34a", "down", 0)}
      {tag(295, "AUMENTO", "R$ 200", "+ 15% (+ R$ 30)", "R$ 230", "#dc2626", "up", 1)}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As pilhas de moedas dos juros
// ---------------------------------------------------------------------------

function InterestArt() {
  const months = [400, 420, 440, 460, 480];
  return (
    <Art viewBox="0 0 560 200" label="Cinco pilhas de moedas, uma por mês: 400, 420, 440, 460 e 480 reais; a cada mês os juros de 5% somam 20 reais">
      <rect width="560" height="200" rx="14" fill="#fffbeb" />
      {months.map((v, i) => {
        const coins = 4 + i;
        return (
          <g key={v} transform={`translate(${80 + i * 100} 165)`}>
            {Array.from({ length: coins }, (_, c) => (
              <ellipse key={c} cy={-c * 11} rx="30" ry="8" fill={c >= 4 ? "#fde047" : "#fbbf24"} stroke="#b45309" strokeWidth="2">
                {c >= 4 && c === coins - 1 && <animate attributeName="opacity" values="0;1;1" keyTimes="0;0.3;1" dur="3s" begin={`${-i * 0.4}s`} repeatCount="indefinite" />}
              </ellipse>
            ))}
            <text y="28" textAnchor="middle" fontSize="13" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
              R$ {v}
            </text>
            <text y={-coins * 11 - 14} textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e" fontFamily="Georgia, serif">
              {i === 0 ? "início" : `mês ${i}`}
            </text>
          </g>
        );
      })}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 3, content, bare });

export const chapter3: BookPage[] = [
  page(
    <ChapterOpener
      n={3}
      title="Porcentagem"
      goals={["O que quer dizer “por cento”", "Como calcular a porcentagem de um valor", "Como fazer descontos e aumentos", "O que são juros"]}
    >
      <Fig h={34}>
        <SaleOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="💯">Por cento é “por cem”</H>
      <P>
        <T>Porcentagem</T> é uma fração com denominador 100. Dizer 25% é dizer “25 de cada 100”. Por isso 25% = 25/100 = 1/4 = 0,25.
      </P>
      <Fig n="3.1" caption="25% é pintar 25 dos 100 quadradinhos: um quarto do total." h={19}>
        <QuarterArt />
      </Fig>
      <Table
        head={["Porcentagem", "Fração", "O que é"]}
        rows={[
          ["100%", "1", "o todo"],
          ["50%", "1/2", "a metade"],
          ["25%", "1/4", "a metade da metade"],
          ["20%", "1/5", "um quinto (1 ÷ 5 = 0,2)"],
          ["10%", "1/10", "dividir por 10"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🧮">Calculando a porcentagem</H>
      <P>
        Pra achar 10% de 250, divida por 100 e multiplique por 10: 250 ÷ 100 × 10 = <T>25</T>. Mexa nos controles:
      </P>
      <PercentCalc />
      <Box kind="mago" title="Atalhos de cabeça">
        <strong>10%</strong> é dividir por 10 (10% de 250 = 25). <strong>5%</strong> é a metade de 10% (12,5). <strong>50%</strong> é a metade. E 20% são dois de 10%:
        50.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🏷️">Descontos e aumentos</H>
      <P>
        No <T>desconto</T>, calculamos a porcentagem e tiramos do preço; no <T>aumento</T>, somamos. Uma camiseta de R$ 80 com 25% de desconto: 25% de 80 = 20, e 80 −
        20 = R$ 60.
      </P>
      <Fig n="3.2" caption="O desconto tira; o aumento soma." h={20}>
        <TagsArt />
      </Fig>
      <Box kind="sabia">
        Dá pra fazer numa conta só: com 25% de desconto você paga 75%, então 80 × 0,75 = 60. Com 15% de aumento você paga 115%: 200 × 1,15 = 230.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="💰">Juros</H>
      <P>
        <T>Juros</T> são o “aluguel” do dinheiro: quem empresta recebe a mais. Aplicando R$ 400 a 5% ao mês, o rendimento é 5% de 400 = <T>R$ 20</T> por mês. Nos{" "}
        <T>juros simples</T>, é sempre o mesmo valor:
      </P>
      <Fig n="3.3" caption="R$ 400 a 5% ao mês, em juros simples: R$ 20 a mais por mês." h={21}>
        <InterestArt />
      </Fig>
      <Box kind="atencao">
        Nos <strong>juros compostos</strong>, os juros de um mês também rendem juros no mês seguinte, e a dívida cresce cada vez mais rápido. É o que acontece com o
        cartão de crédito atrasado!
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Porcentagem é uma fração de denominador 100: 25% = 25/100 = 1/4 = 0,25.",
          "Pra calcular, divida por 100 e multiplique pela porcentagem: 10% de 250 = 25.",
          "Desconto tira do preço; aumento soma: R$ 80 com 25% de desconto = R$ 60.",
          "Também dá numa conta só: pagar 75% é multiplicar por 0,75.",
          "Juros são o que se paga (ou se ganha) pelo dinheiro emprestado: 5% de R$ 400 = R$ 20.",
        ]}
      />
      <Glossary
        items={[
          ["Porcentagem", "Uma parte de cada 100."],
          ["Desconto", "O valor tirado do preço."],
          ["Acréscimo", "O valor somado ao preço."],
          ["Juros", "O valor pago pelo uso do dinheiro de outra pessoa."],
          ["Taxa", "A porcentagem dos juros, num período (ao mês, ao ano)."],
        ]}
      />
      <Quiz
        items={[
          ["Quanto é 10% de 250?", "25."],
          ["Quanto custa uma camiseta de R$ 80 com 25% de desconto?", "R$ 60."],
          ["Quanto é 1/5 em porcentagem?", "20%."],
          ["Quanto rendem R$ 400 a 5% em um mês?", "R$ 20."],
        ]}
      />
    </>,
  ),
];
