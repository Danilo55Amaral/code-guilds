"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { INF_DARK, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 8 — PLANILHAS, SLIDES E E-MAIL (missão "Pacote Office", a parte
// do Excel, do PowerPoint e do Outlook): a planilha com o gráfico subindo e o
// envelope voando, a planilha que calcula sozinha (de tocar), o gráfico, o
// slide bom e o slide ruim (de tocar) e as partes de um e-mail (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: planilha, slide e e-mail
// ---------------------------------------------------------------------------

function OfficeOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma planilha verde com um gráfico de barras crescendo, um slide laranja numa tela de projeção e um envelope de e-mail azul voando">
      <rect width="460" height="300" fill="#ccfbf1" />
      <g transform="translate(30 50)">
        <rect width="180" height="130" rx="6" fill="#fff" stroke="#16a34a" strokeWidth="3" />
        <rect width="180" height="20" rx="6" fill="#16a34a" />
        {Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 4 }, (_, c) => <rect key={`${r}-${c}`} x={6 + c * 43} y={26 + r * 20} width="40" height="16" fill={r === 0 ? "#bbf7d0" : "#f0fdf4"} stroke="#bbf7d0" />),
        )}
      </g>
      <g transform="translate(60 270)">
        {[60, 100, 40, 130].map((h, i) => (
          <rect key={i} x={i * 36} y={-h} width="26" height={h} fill={["#16a34a", "#22c55e", "#4ade80", "#15803d"][i]}>
            <animate attributeName="height" values={`0;${h};${h}`} keyTimes="0;0.4;1" dur="4s" begin={`${-i * 0.2}s`} repeatCount="indefinite" />
            <animate attributeName="y" values={`0;${-h};${-h}`} keyTimes="0;0.4;1" dur="4s" begin={`${-i * 0.2}s`} repeatCount="indefinite" />
          </rect>
        ))}
      </g>
      <g transform="translate(250 60)">
        <rect x="-4" y="-10" width="188" height="8" fill="#475569" />
        <rect width="180" height="110" fill="#fff7ed" stroke="#ea580c" strokeWidth="3" />
        <rect x="20" y="16" width="140" height="16" rx="3" fill="#ea580c" />
        <circle cx="50" cy="70" r="20" fill="#fdba74" />
        {[0, 1, 2].map((k) => (
          <rect key={k} x="84" y={56 + k * 12} width="70" height="6" rx="2" fill="#fed7aa" />
        ))}
      </g>
      <g>
        <animateMotion path="M260 250 Q350 160 430 230" dur="3s" repeatCount="indefinite" rotate="auto" />
        <rect x="-22" y="-14" width="44" height="28" rx="3" fill="#2563eb" />
        <path d="M-22 -14 L0 4 L22 -14" fill="none" stroke="#fff" strokeWidth="2" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A planilha que calcula sozinha (de tocar)
// ---------------------------------------------------------------------------

const ITEMS = [
  { name: "Suco", price: 4 },
  { name: "Pão de queijo", price: 3 },
  { name: "Fruta", price: 2 },
];

export function MiniSheet() {
  const [qty, setQty] = useState([2, 3, 1]);
  const [cell, setCell] = useState("D5");
  const totals = ITEMS.map((it, i) => it.price * qty[i]);
  const sum = totals.reduce((a, b) => a + b, 0);
  const formula: Record<string, string> = {
    D2: "=B2*C2",
    D3: "=B3*C3",
    D4: "=B4*C4",
    D5: "=SOMA(D2:D4)",
    C5: "=SOMA(C2:C4)",
  };
  const td = "border border-[#cbd5e1] px-[0.4em] py-[0.1em]";
  const calc = (id: string, v: number) => (
    <td className={`${td} cursor-pointer text-right font-bold tabular-nums`} style={{ background: cell === id ? "#bbf7d0" : "#f0fdf4" }} onClick={() => setCell(id)}>
      {v}
    </td>
  );
  return (
    <Panel title="Mude as quantidades: a planilha recalcula">
      <div className="mb-[0.3em] flex items-center gap-[0.4em] rounded border border-[#cbd5e1] bg-white px-[0.4em] font-mono text-[0.8em]">
        <span className="font-bold text-[#16a34a]">{cell}</span>
        <span className="text-[#94a3b8]">fx</span>
        <span>{formula[cell] ?? "(um valor digitado)"}</span>
      </div>
      <table className="w-full border-collapse text-[0.78em]">
        <thead>
          <tr className="bg-[#e2e8f0] text-[#475569]">
            <th className={td}></th>
            {["A", "B", "C", "D"].map((c) => (
              <th key={c} className={td}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${td} bg-[#e2e8f0] text-center`}>1</td>
            <td className={`${td} font-bold`}>Lanche</td>
            <td className={`${td} font-bold`}>Preço</td>
            <td className={`${td} font-bold`}>Qtd.</td>
            <td className={`${td} font-bold`}>Total</td>
          </tr>
          {ITEMS.map((it, i) => (
            <tr key={it.name}>
              <td className={`${td} bg-[#e2e8f0] text-center`}>{i + 2}</td>
              <td className={td}>{it.name}</td>
              <td className={`${td} text-right`}>{it.price}</td>
              <td className={td}>
                <span className="flex items-center justify-between gap-[0.2em]">
                  <button type="button" onClick={() => setQty((q) => q.map((v, j) => (j === i ? Math.max(0, v - 1) : v)))} className="rounded bg-[#e2e8f0] px-[0.3em] font-bold">
                    −
                  </button>
                  <span className="font-bold tabular-nums">{qty[i]}</span>
                  <button type="button" onClick={() => setQty((q) => q.map((v, j) => (j === i ? Math.min(9, v + 1) : v)))} className="rounded bg-[#e2e8f0] px-[0.3em] font-bold">
                    +
                  </button>
                </span>
              </td>
              {calc(`D${i + 2}`, totals[i])}
            </tr>
          ))}
          <tr>
            <td className={`${td} bg-[#e2e8f0] text-center`}>5</td>
            <td className={`${td} font-bold`} colSpan={2}>
              SOMA
            </td>
            {calc("C5", qty.reduce((a, b) => a + b, 0))}
            {calc("D5", sum)}
          </tr>
        </tbody>
      </table>
      <p className="mt-[0.2em] text-center text-[0.75em] italic text-[#6b5a3a]">Toque nos números verdes para ver a fórmula.</p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O slide bom e o slide ruim (de tocar)
// ---------------------------------------------------------------------------

export function SlideCompare() {
  const [good, setGood] = useState(true);
  return (
    <Panel title="Qual slide é melhor?">
      <div className="mb-[0.3em] flex justify-center gap-[0.3em]">
        <Pill on={!good} onClick={() => setGood(false)} color="#dc2626">
          ❌ Ruim
        </Pill>
        <Pill on={good} onClick={() => setGood(true)}>
          ✅ Bom
        </Pill>
      </div>
      <svg key={String(good)} viewBox="0 0 400 200" className="cg-anim-fade w-full rounded-md border border-[#cbd5e1]" role="img" aria-label={good ? "Um slide com título grande, uma imagem e três tópicos curtos" : "Um slide com um texto enorme, letra pequena, muitas cores e fundo que atrapalha a leitura"}>
        {good ? (
          <>
            <rect width="400" height="200" fill="#fff" />
            <rect width="400" height="40" fill="#ea580c" />
            <text x="20" y="28" fontSize="20" fontWeight="900" fill="#fff" fontFamily="Arial">
              O ciclo da água
            </text>
            <circle cx="300" cy="120" r="50" fill="#bae6fd" />
            <path d="M270 140 Q300 90 330 140 Z" fill="#0ea5e9" />
            {["Evaporação", "Condensação", "Precipitação"].map((t, i) => (
              <text key={t} x="24" y={84 + i * 34} fontSize="18" fill="#1e293b" fontFamily="Arial">
                • {t}
              </text>
            ))}
          </>
        ) : (
          <>
            <rect width="400" height="200" fill="#f0abfc" />
            {Array.from({ length: 14 }, (_, i) => (
              <rect key={i} x={10} y={10 + i * 13} width={380 - (i % 4) * 30} height="7" fill={["#dc2626", "#16a34a", "#2563eb", "#ca8a04"][i % 4]} opacity="0.75" />
            ))}
          </>
        )}
      </svg>
      <p className="mt-[0.3em] text-[0.84em] leading-snug">
        {good
          ? "Título claro, poucas palavras, letra grande e uma imagem que ajuda a explicar. O slide é um apoio: quem explica é você."
          : "Texto demais, letra pequena, cores que brigam e fundo forte: ninguém consegue ler, e a plateia para de prestar atenção."}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As partes de um e-mail (de tocar)
// ---------------------------------------------------------------------------

const EMAIL_FIELDS = [
  { label: "Para", value: "professora.ana@escola.edu.br", text: "Quem vai receber. O endereço tem o nome da pessoa, o @ (arroba, “em”) e o domínio do provedor." },
  { label: "Cc", value: "coordenacao@escola.edu.br", text: "Com cópia: outra pessoa que recebe para ficar sabendo. Todos veem quem está em cópia." },
  { label: "Cco", value: "", text: "Com cópia oculta: recebe a mensagem, mas os outros não veem que ela recebeu." },
  { label: "Assunto", value: "Trabalho de Geografia – Turma 7A", text: "Um resumo curto da mensagem. Assunto vazio parece spam!" },
  { label: "Anexo", value: "📎 trabalho-geografia.pdf", text: "O arquivo que vai junto. Confira se anexou antes de enviar." },
];

export function EmailParts() {
  const [sel, setSel] = useState(0);
  return (
    <Panel title="Toque nos campos do e-mail">
      <div className="overflow-hidden rounded-md border border-[#94a3b8] bg-white text-[0.8em]">
        <div className="bg-[#2563eb] px-[0.5em] py-[0.15em] font-bold text-white">✉️ Nova mensagem</div>
        {EMAIL_FIELDS.map((f, i) => (
          <button key={f.label} type="button" onClick={() => setSel(i)} className="flex w-full gap-[0.5em] border-b border-[#e2e8f0] px-[0.5em] py-[0.15em] text-left" style={{ background: sel === i ? "#dbeafe" : undefined }}>
            <span className="w-[4em] shrink-0 font-bold text-[#475569]">{f.label}</span>
            <span className="truncate">{f.value}</span>
          </button>
        ))}
        <p className="px-[0.5em] py-[0.3em] text-[#334155]">Olá, professora! Segue o meu trabalho. Obrigado!</p>
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.3em] text-[0.84em] leading-snug">
        <strong style={{ color: INF_DARK }}>{EMAIL_FIELDS[sel].label}: </strong>
        {EMAIL_FIELDS[sel].text}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 8, content, bare });

export const chapter8: BookPage[] = [
  page(
    <ChapterOpener n={8} title="Planilhas, Slides e E-mail" goals={["Células, fórmulas e funções no Excel", "Gráficos a partir de uma planilha", "Como fazer uma boa apresentação no PowerPoint", "As partes de um e-mail no Outlook"]}>
      <Fig h={34}>
        <OfficeOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📊">A planilha</H>
      <P>
        O <T>Excel</T> é feito de <T>células</T>: os quadradinhos onde as <T>colunas</T> (letras) cruzam as <T>linhas</T> (números), como a célula B3. Uma{" "}
        <T>fórmula</T> começa com <T>=</T> e faz contas sozinha: mudou um número, o resultado muda junto.
      </P>
      <MiniSheet />
    </>,
  ),

  page(
    <>
      <H icon="📈">Funções e gráficos</H>
      <P>
        As <T>funções</T> são fórmulas prontas. Com os dados da planilha, o Excel ainda faz <T>gráficos</T> de barras, de linha ou de pizza, em poucos cliques (Inserir →
        Gráfico).
      </P>
      <Table
        head={["Função", "O que faz", "Exemplo"]}
        rows={[
          ["SOMA", "Soma os números", "=SOMA(A1:A10)"],
          ["MÉDIA", "Calcula a média", "=MÉDIA(B2:B5)"],
          ["MÁXIMO", "Mostra o maior valor", "=MÁXIMO(C1:C30)"],
          ["MÍNIMO", "Mostra o menor valor", "=MÍNIMO(C1:C30)"],
          ["SE", "Escolhe entre duas respostas", '=SE(B2>=6;"Passou";"Recuperação")'],
        ]}
      />
      <Box kind="sabia">
        <strong>A1:A10</strong> quer dizer “de A1 até A10”. Os dois-pontos indicam um intervalo de células.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📽️">As apresentações</H>
      <P>
        No <T>PowerPoint</T>, a apresentação é feita de <T>slides</T>, como as páginas de um álbum, com textos, imagens, vídeos e <T>transições</T> entre um slide e
        outro. O arquivo termina em <T>.pptx</T>. Compare:
      </P>
      <SlideCompare />
    </>,
  ),

  page(
    <>
      <H icon="✉️">O e-mail</H>
      <P>
        O <T>Outlook</T> (e o Gmail) servem para mandar <T>e-mails</T>, as mensagens eletrônicas, com arquivos <T>anexados</T>. Um e-mail é como uma carta, só que
        chega em segundos:
      </P>
      <EmailParts />
      <Box kind="mago" title="Etiqueta do e-mail">
        Escreva um assunto claro, comece com uma saudação, seja educado e releia antes de enviar. E nunca abra anexo de quem você não conhece.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "No Excel, as células são o cruzamento de colunas (letras) e linhas (números).",
          "Toda fórmula começa com =; SOMA, MÉDIA, MÁXIMO e SE são funções.",
          "O Excel transforma os dados em gráficos.",
          "No PowerPoint, slides bons têm pouco texto, letra grande e imagens.",
          "Um e-mail tem Para, Cc, Cco, Assunto, mensagem e anexo.",
        ]}
      />
      <Glossary
        items={[
          ["Célula", "O quadradinho da planilha, como B3."],
          ["Fórmula", "Uma conta na planilha, que começa com =."],
          ["Slide", "Cada página de uma apresentação."],
          ["Anexo", "Um arquivo que vai junto com o e-mail."],
          ["Cco", "Com cópia oculta: recebe sem os outros saberem."],
        ]}
      />
      <Quiz
        items={[
          ["Com que sinal começa toda fórmula do Excel?", "Com o sinal de igual (=)."],
          ["O que faz a função =SOMA(A1:A5)?", "Soma os números das células de A1 até A5."],
          ["Cite uma dica para um bom slide.", "Pouco texto, letra grande e uma imagem que ajude a explicar."],
          ["Qual campo do e-mail esconde quem recebeu a cópia?", "O Cco (com cópia oculta)."],
        ]}
      />
    </>,
  ),
];
