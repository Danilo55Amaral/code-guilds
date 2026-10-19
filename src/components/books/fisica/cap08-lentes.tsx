"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 8 — LENTES E ESPELHOS (missão "Física: Lentes e Espelhos"): a
// lupa juntando a luz do Sol num ponto, as lentes convergente e divergente,
// o olho de tocar (normal, míope ou hipermetrope, com e sem óculos), os
// espelhos côncavo e convexo, a câmara escura e a luz presa na fibra óptica.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a lupa juntando a luz do Sol
// ---------------------------------------------------------------------------

function MagnifierOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Os raios do Sol passam por uma lupa e se juntam num ponto brilhante sobre uma folha seca">
      <rect width="460" height="300" fill="#fef9c3" />
      <circle cx="60" cy="50" r="30" fill="#fbbf24" className="cg-anim-glow" />
      {[-60, -30, 0, 30, 60].map((dx, i) => (
        <g key={dx}>
          <path d={`M${230 + dx} 20 L${230 + dx} 120`} stroke="#f59e0b" strokeWidth="3" strokeDasharray="8 6" className="cg-anim-dash" />
          <path d={`M${230 + dx} 128 L230 232`} stroke="#f97316" strokeWidth="3" strokeDasharray="8 6" className="cg-anim-dash" style={{ animationDelay: `${i * 0.1}s` }} />
        </g>
      ))}
      {/* a lupa */}
      <ellipse cx="230" cy="124" rx="90" ry="14" fill="#bae6fd" opacity="0.7" stroke="#475569" strokeWidth="4" />
      <path d="M318 128 L380 150" stroke="#78350f" strokeWidth="12" strokeLinecap="round" />
      {/* a folha e o ponto quente */}
      <path d="M150 250 C200 220 280 224 320 250 C280 272 200 276 150 250 Z" fill="#a16207" stroke="#78350f" strokeWidth="2" />
      <circle cx="230" cy="236" r="14" fill="#fde047" className="cg-anim-glow" />
      <circle cx="230" cy="236" r="5" fill="#fff" />
      {[0, 1].map((k) => (
        <circle key={k} cx={230 + k * 6} cy="222" r="6" fill="#94a3b8" opacity="0.7" className="cg-anim-aura-rise" style={{ "--cg-dur": "2.2s", "--cg-delay": `${k}s` } as React.CSSProperties} />
      ))}
      <text x="250" y="290" textAnchor="middle" fontSize="13" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
        o foco: onde os raios se encontram
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Lente convergente × divergente
// ---------------------------------------------------------------------------

function LensesArt() {
  return (
    <Art viewBox="0 0 600 200" label="A lente convergente junta os raios de luz no foco; a lente divergente espalha os raios">
      {/* convergente */}
      <path d="M150 30 Q178 100 150 170 Q122 100 150 30 Z" fill="#bae6fd" stroke="#0369a1" strokeWidth="2.5" />
      {[60, 100, 140].map((y) => (
        <g key={y}>
          <path d={`M20 ${y} L150 ${y} L250 100 L290 ${100 + (100 - y) * 0.4}`} stroke="#f59e0b" strokeWidth="3" fill="none" strokeDasharray="8 6" className="cg-anim-dash" />
        </g>
      ))}
      <circle cx="250" cy="100" r="5" fill="#dc2626" />
      <text x="250" y="124" textAnchor="middle" fontSize="13" fontWeight="900" fill="#dc2626">
        F
      </text>
      <path d="M150 180 L250 180" stroke="#475569" strokeWidth="1.5" />
      <text x="200" y="196" textAnchor="middle" fontSize="11" fill="#475569" fontFamily="Georgia, serif">
        distância focal
      </text>
      {/* divergente */}
      <path d="M440 30 Q456 100 440 170 L470 170 Q454 100 470 30 Z" fill="#bae6fd" stroke="#0369a1" strokeWidth="2.5" />
      {[60, 100, 140].map((y) => (
        <g key={y}>
          <path d={`M330 ${y} L455 ${y} L590 ${y + (y - 100) * 0.9}`} stroke="#f59e0b" strokeWidth="3" fill="none" strokeDasharray="8 6" className="cg-anim-dash" />
          {y !== 100 && <path d={`M455 ${y} L370 100`} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.7" />}
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontSize="13" fontWeight="900" textAnchor="middle">
        <text x="150" y="20" fill="#0369a1">Convergente</text>
        <text x="455" y="20" fill="#0369a1">Divergente</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O olho de tocar: normal, míope ou hipermetrope, com e sem óculos
// ---------------------------------------------------------------------------

type EyeKind = "normal" | "miopia" | "hipermetropia";
const EYE_TEXT: Record<EyeKind, [string, string]> = {
  normal: ["Olho normal", "A imagem se forma bem em cima da retina: tudo fica nítido."],
  miopia: ["Miopia", "A imagem se forma antes da retina: a pessoa vê mal de longe. A lente divergente corrige."],
  hipermetropia: ["Hipermetropia", "A imagem se forma depois da retina: a pessoa vê mal de perto. A lente convergente corrige."],
};

export function EyeSim() {
  const [kind, setKind] = useState<EyeKind>("miopia");
  const [glasses, setGlasses] = useState(false);
  const RETINA = 404;
  const focus = glasses || kind === "normal" ? RETINA : kind === "miopia" ? 352 : 456;
  const ys = [74, 100, 126];
  // o desvio que os óculos dão aos raios antes do olho
  const bend = glasses ? (kind === "miopia" ? 0.18 : kind === "hipermetropia" ? -0.18 : 0) : 0;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <svg viewBox="0 0 520 200" className="block w-full" aria-label={EYE_TEXT[kind][0]}>
        {/* o olho */}
        <circle cx="330" cy="100" r="78" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" />
        <path d="M262 62 Q244 100 262 138" stroke="#0ea5e9" strokeWidth="4" fill="none" />
        <ellipse cx="276" cy="100" rx="10" ry="30" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
        <path d={`M${RETINA} 50 Q${RETINA + 10} 100 ${RETINA} 150`} stroke="#ef4444" strokeWidth="5" fill="none" />
        {/* os óculos */}
        {glasses && kind !== "normal" && (
          <g className="cg-anim-pop">
            {kind === "miopia" ? (
              <path d="M172 50 Q186 100 172 150 L196 150 Q182 100 196 50 Z" fill="#c4b5fd" opacity="0.8" stroke="#6d28d9" strokeWidth="2" />
            ) : (
              <path d="M184 50 Q200 100 184 150 Q168 100 184 50 Z" fill="#c4b5fd" opacity="0.8" stroke="#6d28d9" strokeWidth="2" />
            )}
          </g>
        )}
        {/* os raios de luz */}
        {ys.map((y) => {
          const yIn = y + (y - 100) * bend;
          const past = kind === "miopia" && !glasses;
          const endX = past ? RETINA : Math.min(focus, RETINA);
          const t = (endX - 276) / (focus - 276);
          const endY = yIn + (100 - yIn) * t;
          return (
            <g key={y}>
              <path d={`M20 ${y} L184 ${y} L276 ${yIn}`} stroke="#f59e0b" strokeWidth="3" fill="none" />
              <path d={`M276 ${yIn} L${endX} ${endY}`} stroke="#f59e0b" strokeWidth="3" fill="none" style={{ transition: "all 0.6s" }} />
              {focus > RETINA && <path d={`M${endX} ${endY} L${focus} 100`} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />}
            </g>
          );
        })}
        <circle cx={focus} cy="100" r="5" fill={focus === RETINA ? "#16a34a" : "#dc2626"} style={{ transition: "all 0.6s" }} />
        <g fontFamily="Georgia, serif" fontSize="11.5" fontWeight="900">
          <text x="252" y="174" fill="#0369a1">cristalino</text>
          <text x="400" y="40" fill="#b91c1c">retina</text>
        </g>
      </svg>
      <div className="mt-[0.3em] flex flex-wrap justify-center gap-[0.3em] text-[0.85em]">
        {(Object.keys(EYE_TEXT) as EyeKind[]).map((k) => (
          <button key={k} type="button" onClick={() => { setKind(k); setGlasses(false); }} className={`rounded-full border px-[0.6em] py-[0.1em] font-bold ${kind === k ? "border-[#4f46e5] bg-[#4f46e5] text-white" : "border-[#d9c79d] bg-white hover:bg-[#eef2ff]"}`}>
            {EYE_TEXT[k][0]}
          </button>
        ))}
        {kind !== "normal" && (
          <button type="button" onClick={() => setGlasses((g) => !g)} className={`rounded-full border px-[0.7em] py-[0.1em] font-black ${glasses ? "border-[#6d28d9] bg-[#6d28d9] text-white" : "border-[#6d28d9] bg-white text-[#6d28d9]"}`}>
            👓 {glasses ? "Tirar os óculos" : "Colocar os óculos"}
          </button>
        )}
      </div>
      <p key={`${kind}${glasses}`} className="cg-anim-fade mt-[0.3em] rounded-lg bg-[#eef2ff] px-[0.6em] py-[0.3em] text-center text-[0.86em] text-[#312e81]">
        <strong>{EYE_TEXT[kind][0]}:</strong> {glasses ? "com a lente certa, a imagem volta para a retina!" : EYE_TEXT[kind][1]}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Os espelhos curvos e a câmara escura
// ---------------------------------------------------------------------------

function MirrorsCameraArt() {
  return (
    <Art viewBox="0 0 600 220" label="O espelho côncavo aumenta o rosto de perto; o convexo mostra uma área maior, com tudo menor; e a câmara escura forma a imagem de cabeça para baixo">
      {/* côncavo */}
      <path d="M40 40 Q70 110 40 180" stroke="#64748b" strokeWidth="8" fill="none" />
      <circle cx="80" cy="110" r="36" fill="#fcd34d" stroke="#92400e" strokeWidth="2" />
      <circle cx="68" cy="102" r="5" fill="#1e293b" />
      <circle cx="92" cy="102" r="5" fill="#1e293b" />
      <path d="M68 124 Q80 132 92 124" stroke="#92400e" strokeWidth="3" fill="none" />
      <text x="70" y="206" textAnchor="middle" fontSize="12" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        côncavo: amplia
      </text>
      {/* convexo */}
      <path d="M220 40 Q190 110 220 180" stroke="#64748b" strokeWidth="8" fill="none" />
      {[70, 100, 130, 160].map((y, i) => (
        <rect key={y} x={232 + (i % 2) * 14} y={y - 8} width="14" height="12" rx="2" fill={["#ef4444", "#3b82f6", "#16a34a", "#f59e0b"][i]} />
      ))}
      <text x="220" y="206" textAnchor="middle" fontSize="12" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        convexo: vê mais
      </text>
      {/* a câmara escura */}
      <g transform="translate(320 0)">
        <path d="M30 170 L30 120 M30 120 L10 140 M30 120 L50 140" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
        <path d="M30 170 L30 196" stroke="#78350f" strokeWidth="8" />
        <path d="M30 116 L160 110 L260 90" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" className="cg-anim-dash" />
        <path d="M30 196 L160 110 L260 30" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" className="cg-anim-dash" />
        <rect x="160" y="20" width="110" height="180" fill="#1e293b" />
        <circle cx="160" cy="110" r="3" fill="#fde047" />
        <g transform="translate(250 60) scale(0.6 -0.6)">
          <path d="M0 -40 L0 0 M0 0 L-20 -20 M0 0 L20 -20" stroke="#4ade80" strokeWidth="8" strokeLinecap="round" />
          <path d="M0 -40 L0 -66" stroke="#a16207" strokeWidth="10" />
        </g>
        <text x="190" y="216" textAnchor="middle" fontSize="12" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
          câmara escura: imagem invertida
        </text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A fibra óptica: a luz presa por reflexão total
// ---------------------------------------------------------------------------

const FIBER = "M20 120 C120 40 220 40 300 110 S480 190 580 100";
const ZIGZAG = "M20 120 L60 84 L100 80 L140 66 L180 74 L220 70 L260 98 L300 112 L340 140 L380 150 L420 152 L460 150 L500 130 L540 116 L580 100";

function FiberArt() {
  return (
    <Art viewBox="0 0 600 200" label="Um cabo de fibra óptica fazendo curvas, com os pulsos de luz presos dentro, refletindo nas paredes">
      <path d={FIBER} stroke="#0f172a" strokeWidth="34" fill="none" strokeLinecap="round" />
      <path d={FIBER} stroke="#bae6fd" strokeWidth="22" fill="none" strokeLinecap="round" opacity="0.5" />
      {Array.from({ length: 4 }, (_, i) => (
        <circle key={i} r="6" fill="#fde047">
          <animateMotion path={ZIGZAG} dur="3s" begin={`${-i * 0.75}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <text x="300" y="190" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#0c4a6e" fontFamily="Georgia, serif">
        a luz bate nas paredes e reflete por completo, mesmo nas curvas
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
      title="Lentes e Espelhos"
      goals={["A diferença entre lentes convergentes e divergentes", "Como funciona o olho e como os óculos corrigem a visão", "Os espelhos côncavos, convexos e a câmara escura", "Como a fibra óptica leva a internet"]}
    >
      <Fig h={34}>
        <MagnifierOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔍">Lentes convergentes e divergentes</H>
      <P>
        As <T>lentes</T> são pedaços de vidro ou plástico curvados que desviam a luz por refração. A <T>lente convergente</T> (mais grossa no meio) junta os raios num ponto, o{" "}
        <T>foco</T>: a lupa é uma lente convergente. A <T>lente divergente</T> (mais fina no meio) espalha os raios.
      </P>
      <Fig n="8.1" caption="A convergente junta a luz no foco (F); a divergente espalha." h={22}>
        <LensesArt />
      </Fig>
      <P>
        A distância entre o centro da lente e o foco é a <T>distância focal</T>. Quanto menor ela é, mais &ldquo;forte&rdquo; é a lente. O <T>índice de refração</T> mede o
        quanto a luz fica mais lenta num material: ela é mais lenta na água e no vidro do que no ar.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="👁️">O olho e os óculos</H>
      <P>
        O olho funciona como uma câmera. A luz entra pela córnea, passa pelo <T>cristalino</T>, uma lente que muda de forma para focar, e forma a imagem na <T>retina</T>, que
        manda a mensagem ao cérebro. Quando a imagem não cai certinho na retina, os óculos ajudam:
      </P>
      <EyeSim />
      <Box kind="lembre">
        Com a idade, o cristalino fica menos flexível e a pessoa passa a ver mal de perto: é a <strong>presbiopia</strong>, a &ldquo;vista cansada&rdquo;.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="💄">Espelhos curvos e a câmara escura</H>
      <List
        items={[
          <>
            O <T>espelho côncavo</T> (curvado para dentro) amplia a imagem quando estamos perto: é o espelho de maquiagem e de fazer a barba.
          </>,
          <>
            O <T>espelho convexo</T> (curvado para fora) mostra uma área maior, com tudo menor: é o retrovisor de moto e o espelho das garagens.
          </>,
        ]}
      />
      <Fig n="8.2" caption="Os espelhos curvos e a câmara escura, onde os raios se cruzam no furinho." h={24}>
        <MirrorsCameraArt />
      </Fig>
      <P>
        Na <T>câmara escura</T>, uma caixa fechada com um furinho, os raios de luz se cruzam no furo e a imagem aparece <T>de cabeça para baixo</T>. O olho humano também forma
        imagens invertidas na retina, e o cérebro desvira!
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🌐">A fibra óptica</H>
      <P>
        Quando a luz tenta sair de um material mais &ldquo;denso&rdquo; para um menos denso, num ângulo bem inclinado, ela não sai: reflete por completo. É a{" "}
        <T>reflexão total</T>.
      </P>
      <Fig n="8.3" caption="Dentro da fibra, a luz vai refletindo nas paredes de ponta a ponta." h={20}>
        <FiberArt />
      </Fig>
      <P>
        A <T>fibra óptica</T> é um fio de vidro mais fino que um cabelo. A luz entra numa ponta e vai refletindo nas paredes até a outra, mesmo nas curvas. Os pulsos de luz
        carregam informação: é assim que a <T>internet</T> atravessa cidades e até oceanos, por cabos submarinos.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Lente convergente junta os raios no foco (a lupa); a divergente espalha.",
          "No olho, o cristalino foca a imagem na retina.",
          "Miopia: imagem antes da retina, corrigida com lente divergente. Hipermetropia: depois da retina, corrigida com lente convergente.",
          "Côncavo amplia (maquiagem); convexo mostra mais área (retrovisor de moto).",
          "Na fibra óptica, a reflexão total prende a luz dentro do fio.",
        ]}
      />
      <Glossary
        items={[
          ["Foco", "O ponto onde os raios se encontram depois da lente."],
          ["Distância focal", "A distância entre a lente e o foco."],
          ["Cristalino", "A lente natural do olho, que muda de forma para focar."],
          ["Retina", "A “tela” do fundo do olho, onde a imagem se forma."],
          ["Reflexão total", "Quando a luz reflete por completo e não sai do material."],
        ]}
      />
      <Quiz
        items={[
          ["Que tipo de lente é a lupa?", "Convergente."],
          ["Qual lente corrige a miopia?", "A lente divergente."],
          ["Por que o retrovisor de moto é convexo?", "Porque o espelho convexo mostra uma área maior."],
          ["Como fica a imagem numa câmara escura?", "Invertida (de cabeça para baixo)."],
        ]}
      />
    </>,
  ),
];
