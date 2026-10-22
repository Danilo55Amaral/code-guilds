"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { INF, INF_DARK, Monitor, Panel, Pill, Slider } from "./art";

// ============================================================================
// CAPÍTULO 6 — SEGURANÇA NA INTERNET (missões "Informática parte 2" e
// "Computação em Nuvem parte 3"): o escudo protegendo o computador dos
// vírus e do anzol do phishing, o medidor de senha forte (de tocar, sem
// digitar senha nenhuma), o jogo "é golpe?", o código da verificação em duas
// etapas e o backup.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o escudo
// ---------------------------------------------------------------------------

function ShieldOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um computador protegido por um escudo com cadeado; vírus e um anzol de pescar senhas batem no escudo e voltam">
      <rect width="460" height="300" fill="#ccfbf1" />
      <Monitor x={230} y={270} w={170} screen="#38bdf8">
        <text y="8" textAnchor="middle" fontSize="30">🙂</text>
      </Monitor>
      <path d="M230 30 L330 66 Q330 190 230 250 Q130 190 130 66 Z" fill={INF} opacity="0.25" stroke={INF} strokeWidth="4">
        <animate attributeName="opacity" values="0.15;0.35;0.15" dur="2s" repeatCount="indefinite" />
      </path>
      <g transform="translate(230 70)">
        <rect x="-16" y="-4" width="32" height="26" rx="4" fill="#facc15" stroke="#a16207" strokeWidth="2" />
        <path d="M-10 -4 V-14 Q0 -26 10 -14 V-4" fill="none" stroke="#a16207" strokeWidth="4" />
      </g>
      {[
        { from: "40 60", hit: "128 100", c: "#dc2626" },
        { from: "420 80", hit: "330 110", c: "#7c3aed" },
        { from: "50 220", hit: "150 190", c: "#16a34a" },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.from})`}>
          <animateTransform attributeName="transform" type="translate" values={`${b.from};${b.hit};${b.from}`} keyTimes="0;0.5;1" dur="2.4s" begin={`${-i * 0.7}s`} repeatCount="indefinite" />
          <circle r="12" fill={b.c} />
          {Array.from({ length: 6 }, (_, k) => (
            <line key={k} y1="12" y2="18" stroke={b.c} strokeWidth="3" transform={`rotate(${k * 60})`} />
          ))}
          <circle cx="-4" cy="-3" r="2" fill="#fff" />
          <circle cx="4" cy="-3" r="2" fill="#fff" />
        </g>
      ))}
      <g transform="translate(400 200)">
        <animateTransform attributeName="transform" type="translate" values="400 140;400 200;400 140" dur="2s" repeatCount="indefinite" />
        <line x1="0" y1="-200" x2="0" y2="-10" stroke="#475569" strokeWidth="2" />
        <path d="M0 -10 Q0 10 -14 6" fill="none" stroke="#475569" strokeWidth="4" />
        <rect x="-26" y="-6" width="20" height="12" rx="2" fill="#fde68a" />
        <text x="-16" y="3" textAnchor="middle" fontSize="7" fontWeight="900">****</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O medidor de senha forte (de tocar)
// ---------------------------------------------------------------------------

function crackTime(seconds: number) {
  if (seconds < 1) return "menos de 1 segundo";
  if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))} minutos`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} horas`;
  if (seconds < 31_536_000) return `${Math.round(seconds / 86400)} dias`;
  const years = seconds / 31_536_000;
  if (years < 1e6) return `${Math.round(years).toLocaleString("pt-BR")} anos`;
  return "mais de 1 milhão de anos";
}

export function PasswordMeter() {
  const [len, setLen] = useState(6);
  const [upper, setUpper] = useState(false);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const pool = 26 + (upper ? 26 : 0) + (digits ? 10 : 0) + (symbols ? 32 : 0);
  // um computador de ataque testando 10 bilhões de senhas por segundo
  const seconds = pool ** len / 1e10;
  const score = Math.min(4, Math.floor(Math.log10(seconds + 1) / 3));
  const labels = ["Muito fraca", "Fraca", "Média", "Forte", "Muito forte"];
  const colors = ["#dc2626", "#ea580c", "#ca8a04", "#65a30d", "#15803d"];
  const example = (
    "minha" +
    (upper ? "Gata" : "gata") +
    "come" +
    (digits ? "3" : "") +
    (symbols ? "!" : "") +
    "peixes" +
    (upper ? "Azuis" : "azuis") +
    "nalua"
  ).slice(0, len);
  return (
    <Panel title="Monte uma senha (é só um exemplo: nunca escreva a sua de verdade aqui)">
      <Slider label="Tamanho" value={len} min={4} max={20} onChange={setLen} format={(v) => `${v} letras`} />
      <div className="my-[0.4em] flex flex-wrap justify-center gap-[0.3em]">
        <Pill on={upper} onClick={() => setUpper(!upper)}>
          ABC maiúsculas
        </Pill>
        <Pill on={digits} onClick={() => setDigits(!digits)}>
          123 números
        </Pill>
        <Pill on={symbols} onClick={() => setSymbols(!symbols)}>
          !@# símbolos
        </Pill>
      </div>
      <div className="flex h-[0.9em] gap-[0.2em]">
        {labels.map((_, i) => (
          <div key={i} className="flex-1 rounded-full transition-colors" style={{ background: i <= score ? colors[score] : "#e5e7eb" }} />
        ))}
      </div>
      <p className="mt-[0.3em] text-center text-[0.9em]">
        <strong style={{ color: colors[score] }}>{labels[score]}</strong>: um computador de ataque levaria <strong>{crackTime(seconds)}</strong> para adivinhar.
      </p>
      <p className="text-center font-mono text-[0.8em] text-[#64748b]">ex.: {example}</p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// É golpe?
// ---------------------------------------------------------------------------

const SCAM_GAME = [
  { prompt: "📩 “Parabéns! Você ganhou um celular. Clique no link e informe seus dados para receber.”", options: ["É golpe", "Pode confiar"], answer: 0, explain: "Prêmio que você não pediu e pedido de dados: é phishing." },
  { prompt: "💬 Um “amigo” pede o código de 6 números que chegou por SMS no seu celular.", options: ["É golpe", "Pode confiar"], answer: 0, explain: "Esse código é a chave da sua conta. Nunca passe para ninguém." },
  { prompt: "🎮 “Skins grátis! Só entrar com a senha do seu jogo neste site.”", options: ["É golpe", "Pode confiar"], answer: 0, explain: "Ninguém dá skin de graça pedindo a sua senha: é para roubar a conta." },
  { prompt: "🏫 O professor avisa da missão nova dentro da própria plataforma da escola.", options: ["É golpe", "Pode confiar"], answer: 1, explain: "Aviso dentro do sistema oficial, sem pedir senha nem dados, é confiável." },
];

// ---------------------------------------------------------------------------
// A verificação em duas etapas
// ---------------------------------------------------------------------------

function TwoStepArt() {
  return (
    <Art viewBox="0 0 560 160" label="O login pede a senha e depois um código de seis números que chega no celular da pessoa, abrindo um cadeado duplo">
      <rect width="560" height="160" rx="14" fill="#f0fdfa" />
      <g transform="translate(110 80)">
        <rect x="-80" y="-50" width="160" height="100" rx="8" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
        <text y="-28" textAnchor="middle" fontSize="12" fontWeight="900" fill={INF_DARK}>1. senha</text>
        <rect x="-60" y="-18" width="120" height="20" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
        <text y="-4" textAnchor="middle" fontSize="13" fontWeight="900" fill="#475569">● ● ● ● ● ●</text>
        <text y="24" textAnchor="middle" fontSize="12" fontWeight="900" fill={INF_DARK}>2. código</text>
        <text y="44" textAnchor="middle" fontSize="15" fontFamily="monospace" fontWeight="900" fill={INF}>
          482 913
          <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.5;0.6;1" dur="4s" repeatCount="indefinite" />
        </text>
      </g>
      <path d="M220 80 L330 80" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 4" />
      <circle r="6" fill={INF}>
        <animateMotion path="M330 80 L220 80" dur="2s" repeatCount="indefinite" />
      </circle>
      <g transform="translate(380 80)">
        <rect x="-32" y="-50" width="64" height="100" rx="8" fill="#1e293b" />
        <rect x="-27" y="-42" width="54" height="80" rx="3" fill="#a5f3fc" />
        <text y="-6" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#0f172a">seu código:</text>
        <text y="10" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="900" fill="#0f172a">482913</text>
      </g>
      <g transform="translate(490 80)">
        <rect x="-18" y="-6" width="36" height="30" rx="4" fill="#facc15" stroke="#a16207" strokeWidth="2" />
        <path d="M-10 -6 V-18 Q0 -30 10 -18 V-6" fill="none" stroke="#a16207" strokeWidth="4">
          <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -8;0 -8" keyTimes="0;0.55;0.65;1" dur="4s" repeatCount="indefinite" />
        </path>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 6, content, bare });

export const chapter6: BookPage[] = [
  page(
    <ChapterOpener n={6} title="Segurança na Internet" goals={["Como criar uma senha forte", "Como reconhecer golpes e phishing", "HTTPS, antivírus e verificação em duas etapas", "Backup, privacidade e respeito na rede"]}>
      <Fig h={34}>
        <ShieldOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔑">Senhas fortes</H>
      <P>
        Uma <T>senha forte</T> é longa e mistura letras maiúsculas e minúsculas, números e símbolos. Quanto mais longa, mais tempo um ataque leva para adivinhar. Veja a
        diferença:
      </P>
      <PasswordMeter />
      <Box kind="atencao">
        Não use datas de aniversário, nome do pet ou 123456. Não repita a mesma senha em vários sites e <strong>nunca</strong> conte a sua senha para ninguém.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🎣">É golpe?</H>
      <P>
        <T>Phishing</T> (de “fishing”, pescar) é a pescaria de dados: mensagens e sites falsos que tentam fazer você entregar senhas e códigos. Desconfie de pressa,
        prêmios e pedidos de dados. Treine:
      </P>
      <ChoiceGame items={SCAM_GAME} color={INF} title="É golpe ou pode confiar?" />
    </>,
  ),

  page(
    <>
      <H icon="🛡️">Camadas de proteção</H>
      <P>
        A <T>verificação em duas etapas</T> pede, além da senha, um código que chega no seu celular. Mesmo que alguém descubra a senha, não entra sem o código.
      </P>
      <Fig n="6.1" caption="A verificação em duas etapas." h={18}>
        <TwoStepArt />
      </Fig>
      <Cards
        items={[
          { icon: "🔒", title: "HTTPS", text: "O cadeado no endereço: os dados vão criptografados." },
          { icon: "🦠", title: "Antivírus", text: "Procura e bloqueia programas maliciosos (malware)." },
          { icon: "🔄", title: "Atualizações", text: "Corrigem as falhas que os invasores usam." },
          { icon: "📶", title: "Wi-Fi público", text: "Evite entrar em contas importantes em redes abertas." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="💾">Backup e privacidade</H>
      <P>
        <T>Backup</T> é uma cópia de segurança dos seus arquivos, num HD externo ou na nuvem. Se o computador quebrar ou for atacado, nada se perde. Cuide também da sua{" "}
        <T>privacidade</T>:
      </P>
      <List
        items={[
          "Não poste seu endereço, sua escola, seu telefone nem onde você está agora.",
          "Deixe seus perfis fechados e aceite só quem você conhece.",
          "Pense antes de postar: o que vai para a internet é difícil de apagar.",
          "Sofreu ou viu cyberbullying? Não responda, salve as provas e conte para um adulto de confiança.",
        ]}
      />
      <Box kind="mago" title="A regra de ouro">
        Se uma mensagem te deixou com pressa, medo ou ansiedade para clicar, pare. Respire, pergunte para um adulto e só depois decida.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Senha forte é longa e mistura letras, números e símbolos; nunca conte para ninguém.",
          "Phishing usa mensagens falsas para roubar dados; desconfie de prêmios e pressa.",
          "A verificação em duas etapas pede um código além da senha.",
          "HTTPS, antivírus e atualizações protegem o computador.",
          "Faça backup e cuide da sua privacidade nas redes.",
        ]}
      />
      <Glossary
        items={[
          ["Phishing", "Golpe que usa mensagens e sites falsos para roubar dados."],
          ["Malware", "Programa malicioso, como vírus."],
          ["Criptografia", "Embaralhar os dados para só quem tem a chave conseguir ler."],
          ["Backup", "Cópia de segurança dos arquivos."],
          ["Cyberbullying", "Agressões e humilhações repetidas pela internet."],
        ]}
      />
      <Quiz
        items={[
          ["O que deixa uma senha mais forte?", "Ser longa e misturar maiúsculas, minúsculas, números e símbolos."],
          ["O que é phishing?", "Um golpe com mensagens ou sites falsos para roubar dados."],
          ["Para que serve a verificação em duas etapas?", "Pedir um código além da senha, para proteger a conta."],
          ["O que é backup?", "Uma cópia de segurança dos arquivos."],
        ]}
      />
    </>,
  ),
];
