"use client";

import { useState } from "react";
import { isSoundMuted, playTone } from "@/engine/sfx";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 7 — ONDAS, SOM E LUZ (missão "Física: Ondas, Som e Luz"): o
// alto-falante soltando ondas e a lâmpada soltando luz, a onda numa corda
// (crista, vale, comprimento e amplitude), o som de ouvir (agudo × grave,
// forte × fraco), o canudo "quebrado" no copo, o espelho que troca a
// esquerda e a direita, e o prisma separando as cores do arco-íris.
// ============================================================================

/** O caminho de uma onda senoidal de x0 a x1, centrada em y, deslocada por `phase`. */
function wavePath(x0: number, x1: number, y: number, amp: number, len: number, phase: number): string {
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += 4) pts.push(`${x} ${(y + amp * Math.sin(((x - x0) / len) * Math.PI * 2 + phase)).toFixed(1)}`);
  return `M${pts.join(" L")}`;
}
/** Os quadros de uma onda andando (pra animar o "d" do caminho com SMIL). */
function waveFrames(x0: number, x1: number, y: number, amp: number, len: number): string {
  return Array.from({ length: 9 }, (_, k) => wavePath(x0, x1, y, amp, len, (-k / 8) * Math.PI * 2)).join(";");
}

// ---------------------------------------------------------------------------
// Abertura: o alto-falante e a lâmpada
// ---------------------------------------------------------------------------

function WavesOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um alto-falante soltando ondas de som e uma lâmpada soltando raios de luz">
      {/* o alto-falante e as ondas de som */}
      <g transform="translate(70 150)">
        <rect x="-30" y="-36" width="34" height="72" rx="6" fill="#334155" />
        <path d="M4 -36 L44 -66 L44 66 L4 36 Z" fill="#475569" stroke="#1e293b" strokeWidth="2" />
        {[0, 1, 2, 3].map((k) => (
          <path
            key={k}
            d="M60 -50 Q86 0 60 50"
            stroke="#6366f1"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            opacity="0"
          >
            <animateTransform attributeName="transform" type="translate" values="0 0;150 0" dur="2.4s" begin={`${-k * 0.6}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0;1;0" dur="2.4s" begin={`${-k * 0.6}s`} repeatCount="indefinite" />
          </path>
        ))}
        <text x="20" y="96" textAnchor="middle" fontSize="13" fontWeight="900" fill="#4338ca" fontFamily="Georgia, serif">
          som
        </text>
      </g>
      {/* as notas musicais */}
      {["♪", "♫"].map((n, i) => (
        <text key={n} x={150 + i * 40} y="90" fontSize="26" fill="#4f46e5" className="cg-anim-aura-rise" style={{ "--cg-dur": "3s", "--cg-delay": `${i * 1.4}s` } as React.CSSProperties}>
          {n}
        </text>
      ))}
      {/* a lâmpada e os raios */}
      <g transform="translate(360 130)">
        <circle r="70" fill="#fde047" opacity="0.3" className="cg-anim-glow" />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1="0" y1="-46" x2="0" y2="-76" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" transform={`rotate(${i * 36})`} strokeDasharray="8 6" className="cg-anim-dash" />
        ))}
        <circle r="32" fill="#fef9c3" stroke="#ca8a04" strokeWidth="3" />
        <rect x="-14" y="30" width="28" height="22" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
        <text y="110" textAnchor="middle" fontSize="13" fontWeight="900" fill="#b45309" fontFamily="Georgia, serif">
          luz
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A onda na corda: crista, vale, comprimento e amplitude
// ---------------------------------------------------------------------------

function WaveArt() {
  return (
    <Art viewBox="0 0 560 200" label="Uma onda andando numa corda, com a crista, o vale, o comprimento de onda e a amplitude">
      <line x1="20" y1="100" x2="540" y2="100" stroke="#cbd5e1" strokeDasharray="5 5" />
      <path d={wavePath(20, 440, 100, 44, 160, 0)} stroke="#4f46e5" strokeWidth="5" fill="none" strokeLinecap="round">
        <animate attributeName="d" values={waveFrames(20, 440, 100, 44, 160)} dur="2s" repeatCount="indefinite" />
      </path>
      {/* as medidas (paradas) */}
      <path d="M60 30 L220 30" stroke="#dc2626" strokeWidth="2" />
      <path d="M60 24 L60 36 M220 24 L220 36" stroke="#dc2626" strokeWidth="2" />
      <text x="140" y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill="#dc2626" fontFamily="Georgia, serif">
        comprimento de onda (λ)
      </text>
      <path d="M470 100 L470 56" stroke="#16a34a" strokeWidth="2" />
      <path d="M464 56 L476 56 M464 100 L476 100" stroke="#16a34a" strokeWidth="2" />
      <text x="480" y="84" fontSize="13" fontWeight="900" fill="#16a34a" fontFamily="Georgia, serif">
        amplitude
      </text>
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900" textAnchor="middle">
        <text x="300" y="190" fill="#3b2a14">crista: o ponto mais alto · vale: o mais baixo</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O som de ouvir: agudo × grave, forte × fraco
// ---------------------------------------------------------------------------

export function SoundLab() {
  const [freq, setFreq] = useState<220 | 440 | 880>(440);
  const [loud, setLoud] = useState(true);
  const len = freq === 220 ? 200 : freq === 440 ? 100 : 50;
  const amp = loud ? 40 : 16;
  const play = () => {
    if (!isSoundMuted()) playTone(freq, loud ? 0.25 : 0.06);
  };
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <svg viewBox="0 0 520 110" className="block w-full" aria-label={`Onda de ${freq} hertz`}>
        <line x1="10" y1="55" x2="510" y2="55" stroke="#cbd5e1" strokeDasharray="4 4" />
        <path key={`${freq}-${amp}`} d={wavePath(10, 510, 55, amp, len, 0)} stroke="#4f46e5" strokeWidth="4" fill="none">
          <animate attributeName="d" values={waveFrames(10, 510, 55, amp, len)} dur="1s" repeatCount="indefinite" />
        </path>
      </svg>
      <div className="mt-[0.3em] flex flex-wrap items-center justify-center gap-[0.4em] text-[0.85em]">
        {(
          [
            [220, "Grave (220 Hz)"],
            [440, "Médio (440 Hz)"],
            [880, "Agudo (880 Hz)"],
          ] as const
        ).map(([f, label]) => (
          <button key={f} type="button" onClick={() => setFreq(f)} className={`rounded-full border px-[0.6em] py-[0.1em] font-bold ${freq === f ? "border-[#4f46e5] bg-[#4f46e5] text-white" : "border-[#d9c79d] bg-white hover:bg-[#eef2ff]"}`}>
            {label}
          </button>
        ))}
        <button type="button" onClick={() => setLoud((l) => !l)} className="rounded-full border border-[#d9c79d] bg-white px-[0.6em] py-[0.1em] font-bold hover:bg-[#eef2ff]">
          {loud ? "🔊 Forte" : "🔉 Fraco"}
        </button>
        <button type="button" onClick={play} className="rounded-full bg-[#16a34a] px-[0.9em] py-[0.15em] font-black text-white shadow hover:bg-[#15803d]">
          ► Ouvir
        </button>
      </div>
      <p className="mt-[0.3em] text-center text-[0.8em] italic text-[#6b5a3a]">Se não sair som, confira se o som da plataforma está ligado.</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// A luz: o canudo "quebrado" e o espelho
// ---------------------------------------------------------------------------

function LightArt() {
  return (
    <Art viewBox="0 0 560 220" label="O canudo parece quebrado dentro do copo d'água por causa da refração; no espelho plano, a palavra AMBULÂNCIA aparece ao contrário">
      {/* o copo com o canudo */}
      <path d="M60 40 L70 200 Q72 210 82 210 L178 210 Q188 210 190 200 L200 40" fill="#fffaf0" />
      <path d="M64 100 L196 100 L190 200 Q188 210 178 210 L82 210 Q72 210 70 200 Z" fill="#7dd3fc" opacity="0.7" />
      <path d="M150 20 L118 100" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" />
      <path d="M126 100 L104 190" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
      <path d="M60 40 L70 200 Q72 210 82 210 L178 210 Q188 210 190 200 L200 40" fill="none" stroke="#64748b" strokeWidth="3" />
      {/* o espelho com a palavra invertida */}
      <rect x="300" y="30" width="230" height="70" rx="8" fill="#fef2f2" stroke="#ef4444" strokeWidth="2" />
      <text x="415" y="76" textAnchor="middle" fontSize="26" fontWeight="900" fill="#dc2626" fontFamily="Arial, sans-serif" transform="translate(830 0) scale(-1 1)">
        AMBULÂNCIA
      </text>
      <rect x="300" y="130" width="230" height="70" rx="8" fill="#e0f2fe" stroke="#64748b" strokeWidth="3" />
      <path d="M310 140 L340 190" stroke="#fff" strokeWidth="6" opacity="0.6" />
      <text x="415" y="176" textAnchor="middle" fontSize="26" fontWeight="900" fill="#dc2626" fontFamily="Arial, sans-serif">
        AMBULÂNCIA
      </text>
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900" textAnchor="middle">
        <text x="415" y="22" fill="#3b2a14">escrito no capô</text>
        <text x="415" y="122" fill="#3b2a14">visto no retrovisor</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O prisma e o arco-íris
// ---------------------------------------------------------------------------

const RAINBOW = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#3b82f6", "#4f46e5", "#a855f7"];

function PrismArt() {
  return (
    <Art viewBox="0 0 560 220" label="Um raio de luz branca entra no prisma e sai separado nas cores do arco-íris">
      <rect width="560" height="220" rx="14" fill="#0f172a" />
      <path d="M20 120 L200 110" stroke="#f8fafc" strokeWidth="6" strokeDasharray="14 8" className="cg-anim-dash" />
      <path d="M250 30 L330 180 L170 180 Z" fill="#e0f2fe" opacity="0.35" stroke="#e0f2fe" strokeWidth="2.5" />
      {RAINBOW.map((c, i) => (
        <path key={c} d={`M286 ${112 + i * 4} L540 ${70 + i * 18}`} stroke={c} strokeWidth="5" strokeDasharray="14 8" className="cg-anim-dash" />
      ))}
      <text x="80" y="104" fontSize="12" fontWeight="900" fill="#f8fafc" fontFamily="Georgia, serif">
        luz branca
      </text>
      <text x="250" y="206" textAnchor="middle" fontSize="12" fontWeight="900" fill="#e0f2fe" fontFamily="Georgia, serif">
        prisma
      </text>
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
      title="Ondas, Som e Luz"
      goals={["O que é uma onda e as partes dela", "Como o som viaja e o que faz um som ser agudo ou grave", "A reflexão e a refração da luz", "Como se forma o arco-íris e por que vemos as cores"]}
    >
      <Fig h={34}>
        <WavesOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌊">O que é uma onda</H>
      <P>
        Uma <T>onda</T> é uma perturbação que se propaga levando <T>energia</T>, sem levar a matéria junto. Quando você balança a ponta de uma corda, a onda viaja até a outra
        ponta, mas cada pedacinho da corda só sobe e desce.
      </P>
      <Fig n="7.1" caption="A onda viaja; a corda só sobe e desce." h={22}>
        <WaveArt />
      </Fig>
      <List
        items={[
          <>
            <T>Frequência</T>: quantas ondas passam por segundo, em <T>hertz (Hz)</T>.
          </>,
          <>
            Ondas <T>mecânicas</T> (como o som) precisam de um meio para viajar; ondas <T>eletromagnéticas</T> (como a luz) viajam até no vácuo.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔊">O som</H>
      <P>
        O <T>som</T> é uma onda mecânica: a vibração passa de partícula em partícula do ar. Por isso <T>não existe som no vácuo</T> do espaço! No ar, ele viaja a cerca de{" "}
        <T>340 m/s</T>; na água e nos sólidos, ainda mais rápido. Escolha um som e aperte <strong>Ouvir</strong>:
      </P>
      <SoundLab />
      <List
        items={[
          <>
            <T>Agudo</T> (fininho) é frequência <em>alta</em>; <T>grave</T> (grosso) é frequência <em>baixa</em>. O volume (forte ou fraco) depende da amplitude.
          </>,
          <>
            O <T>eco</T> é o som refletido. Morcegos, golfinhos e o sonar dos navios usam o eco para se localizar.
          </>,
        ]}
      />
      <Box kind="experimente">Numa tempestade, conte os segundos entre o relâmpago e o trovão e divida por 3: é a distância aproximada do raio, em quilômetros!</Box>
    </>,
  ),

  page(
    <>
      <H icon="💡">A luz: reflexão e refração</H>
      <P>
        A <T>luz</T> é a coisa mais rápida do universo: viaja a cerca de <T>300 mil quilômetros por segundo</T> no vácuo, o suficiente para dar mais de 7 voltas na Terra em um
        segundo. Por isso vemos o relâmpago antes de ouvir o trovão.
      </P>
      <Fig n="7.2" caption="A refração “quebra” o canudo; o espelho inverte esquerda e direita." h={24}>
        <LightArt />
      </Fig>
      <List
        items={[
          <>
            <T>Reflexão</T>: a luz bate e volta, como no espelho. O espelho plano inverte esquerda e direita; por isso AMBULÂNCIA vem escrito ao contrário no capô, para ser lido
            no retrovisor.
          </>,
          <>
            <T>Refração</T>: a luz muda de velocidade ao passar de um meio para outro e desvia. É o que faz o canudo parecer quebrado e as lentes funcionarem.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🌈">As cores e o arco-íris</H>
      <P>
        A luz branca é a mistura de <T>todas as cores</T>. Num prisma de vidro, cada cor desvia um pouquinho diferente e elas se separam. Isaac Newton fez esse experimento no
        século XVII.
      </P>
      <Fig n="7.3" caption="O prisma separa a luz branca nas cores do arco-íris." h={22}>
        <PrismArt />
      </Fig>
      <Cards
        items={[
          { icon: "🌦️", title: "Arco-íris", text: "As gotas de chuva funcionam como milhões de prismas: com o Sol atrás de você, as cores aparecem no céu." },
          { icon: "👕", title: "A cor das coisas", text: "Vemos a cor que o objeto reflete. A camiseta vermelha reflete o vermelho; a preta absorve quase tudo e esquenta mais no sol." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Onda leva energia sem levar matéria. Frequência em hertz (Hz).",
          "O som é onda mecânica: não viaja no vácuo; no ar, anda cerca de 340 m/s.",
          "Agudo = frequência alta; grave = frequência baixa. Eco é o som refletido.",
          "A luz anda cerca de 300 mil km/s. Reflexão: bate e volta; refração: desvia ao mudar de meio.",
          "A luz branca é a mistura de todas as cores; vemos a cor que o objeto reflete.",
        ]}
      />
      <Glossary
        items={[
          ["Frequência", "Quantas ondas passam por segundo (em hertz)."],
          ["Amplitude", "A “altura” da onda; no som, ligada ao volume."],
          ["Eco", "O som refletido que volta até nós."],
          ["Reflexão", "A luz (ou o som) batendo e voltando."],
          ["Refração", "O desvio da luz ao mudar de meio."],
        ]}
      />
      <Quiz
        items={[
          ["O som se propaga no vácuo?", "Não: ele precisa de um meio, como o ar."],
          ["Por que vemos o relâmpago antes de ouvir o trovão?", "Porque a luz é muito mais rápida que o som."],
          ["Um som agudo tem frequência alta ou baixa?", "Alta."],
          ["Por que o canudo parece quebrado no copo d'água?", "Por causa da refração: a luz desvia ao passar da água para o ar."],
        ]}
      />
    </>,
  ),
];
