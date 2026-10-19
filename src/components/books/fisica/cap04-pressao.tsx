"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Arrow, Car } from "./art";

// ============================================================================
// CAPÍTULO 4 — PRESSÃO E FLUIDOS (missão "Física: Pressão e Fluidos"): o
// mergulhador descendo com o medidor de pressão subindo, a tachinha (a mesma
// força numa área pequena fura), o tubo de mercúrio de Torricelli, a garrafa
// com furos esguichando mais longe embaixo, o empuxo e o macaco hidráulico.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o mergulhador descendo
// ---------------------------------------------------------------------------

function DiverOpenerArt() {
  const loop = { dur: "8s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 460 300" label="Um mergulhador descendo no mar enquanto o medidor de pressão sobe">
      <defs>
        <linearGradient id="fis4-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>
      <rect width="460" height="300" fill="url(#fis4-sea)" />
      {/* as marcas de profundidade */}
      {[0, 10, 20, 30].map((m, i) => (
        <g key={m}>
          <line x1="30" y1={30 + i * 80} x2="50" y2={30 + i * 80} stroke="#e0f2fe" strokeWidth="2" />
          <text x="56" y={34 + i * 80} fontSize="11" fontWeight="900" fill="#e0f2fe">
            {m} m
          </text>
        </g>
      ))}
      {/* o mergulhador descendo */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 190;0 190;0 0" keyTimes="0;0.5;0.7;1" {...loop} />
        <g transform="translate(200 50) rotate(70)">
          <ellipse cx="0" cy="0" rx="34" ry="11" fill="#1e293b" />
          <circle cx="36" cy="0" r="9" fill="#fcd34d" stroke="#1e293b" strokeWidth="2" />
          <rect x="30" y="-6" width="10" height="7" rx="2" fill="#38bdf8" />
          <rect x="-16" y="-16" width="26" height="8" rx="4" fill="#f59e0b" />
          <path d="M-34 -6 L-54 -14 L-50 0 Z M-34 6 L-54 14 L-50 0 Z" fill="#facc15" />
        </g>
        {[0, 1, 2].map((k) => (
          <circle key={k} cx={212 + k * 4} cy="40" r={3 + k} fill="none" stroke="#e0f2fe" strokeWidth="1.5" className="cg-anim-aura-rise" style={{ "--cg-dur": "2s", "--cg-delay": `${k * 0.6}s` } as React.CSSProperties} />
        ))}
      </g>
      {/* o medidor de pressão */}
      <g transform="translate(370 90)">
        <circle r="48" fill="#f8fafc" stroke="#475569" strokeWidth="4" />
        {Array.from({ length: 5 }, (_, i) => {
          const a = Math.PI * 0.8 + (i / 4) * Math.PI * 1.4;
          return (
            <text key={i} x={Math.cos(a) * 32} y={Math.sin(a) * 32 + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill="#334155">
              {i + 1}
            </text>
          );
        })}
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-110;30;30;-110" keyTimes="0;0.5;0.7;1" {...loop} />
          <path d="M-3 0 L0 -40 L3 0 Z" fill="#dc2626" />
        </g>
        <circle r="5" fill="#dc2626" />
        <text y="26" textAnchor="middle" fontSize="10" fontWeight="900" fill="#334155">
          atm
        </text>
      </g>
      {/* peixinhos */}
      {[0, 1].map((k) => (
        <g key={k}>
          <animateMotion path={`M480 ${200 + k * 50} L-40 ${180 + k * 50}`} dur={`${9 + k * 3}s`} begin={`${-k * 4}s`} repeatCount="indefinite" />
          <path d="M0 0 C6 -6 16 -6 20 0 C16 6 6 6 0 0 Z M20 0 L28 -6 L28 6 Z" fill="#fb923c" />
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// P = F / A: a tachinha e o sapato de neve
// ---------------------------------------------------------------------------

function PressureArt() {
  return (
    <Art viewBox="0 0 560 210" label="A tachinha: o dedo empurra a cabeça larga sem doer, mas a ponta fina fura a madeira. O sapato de neve espalha o peso e afunda menos que a bota">
      {/* a tachinha */}
      <rect x="40" y="150" width="200" height="40" fill="#d97706" stroke="#78350f" strokeWidth="2" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 18;0 18;0 0" keyTimes="0;0.4;0.8;1" dur="3s" repeatCount="indefinite" />
        <ellipse cx="140" cy="96" rx="34" ry="8" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
        <path d="M137 100 L140 146 L143 100 Z" fill="#475569" />
        <path d="M120 40 C120 70 160 70 160 40 L160 80 Q140 92 120 80 Z" fill="#fcd34d" stroke="#92400e" strokeWidth="2" />
        <Arrow x1={140} y1={10} x2={140} y2={42} label="F" />
      </g>
      <text x="140" y="206" textAnchor="middle" fontSize="12" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        ponta fina: área pequena, pressão grande
      </text>
      {/* bota × sapato de neve */}
      <rect x="300" y="140" width="250" height="60" fill="#f1f5f9" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 26;0 26;0 0" keyTimes="0;0.4;0.8;1" dur="3s" repeatCount="indefinite" />
        <path d="M350 80 L374 80 L376 140 L340 140 Z" fill="#7c2d12" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 6;0 6;0 0" keyTimes="0;0.4;0.8;1" dur="3s" repeatCount="indefinite" />
        <path d="M466 80 L490 80 L492 132 L456 132 Z" fill="#7c2d12" />
        <ellipse cx="475" cy="138" rx="52" ry="8" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="2" />
      </g>
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900" textAnchor="middle" fill="#3b2a14">
        <text x="358" y="190">bota: afunda</text>
        <text x="475" y="190">sapato de neve: não</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A pressão atmosférica: Torricelli e a montanha
// ---------------------------------------------------------------------------

function AtmosphereArt() {
  return (
    <Art viewBox="0 0 560 230" label="O tubo de Torricelli: o ar empurra o mercúrio da bacia e sustenta uma coluna de 76 cm; no alto da montanha, a pressão do ar é menor">
      {/* Torricelli */}
      <rect x="100" y="20" width="22" height="180" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="2.5" />
      <rect x="103" y="62" width="16" height="136" fill="#94a3b8" />
      <path d="M40 180 L180 180 L170 214 L50 214 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
      <path d="M190 62 L190 196" stroke="#1e293b" strokeWidth="1.5" />
      <path d="M184 62 L196 62 M184 196 L196 196" stroke="#1e293b" strokeWidth="1.5" />
      <text x="200" y="134" fontSize="14" fontWeight="900" fill="#1e293b" fontFamily="Georgia, serif">
        76 cm
      </text>
      {[56, 156].map((x) => (
        <Arrow key={x} x1={x} y1={140} x2={x} y2={172} color="#0ea5e9" label="" width={3} />
      ))}
      <text x="110" y="228" textAnchor="middle" fontSize="12" fontWeight="900" fill="#0369a1" fontFamily="Georgia, serif">
        o ar empurra o mercúrio
      </text>
      {/* a montanha */}
      <path d="M300 220 L420 60 L540 220 Z" fill="#78716c" stroke="#44403c" strokeWidth="2" />
      <path d="M396 92 L420 60 L444 92 L432 88 L420 96 L408 88 Z" fill="#f8fafc" />
      {Array.from({ length: 10 }, (_, i) => (
        <circle key={`b${i}`} cx={310 + (i * 23) % 220} cy={200 - (i % 3) * 10} r="3" fill="#38bdf8" opacity="0.8" />
      ))}
      {Array.from({ length: 3 }, (_, i) => (
        <circle key={`t${i}`} cx={400 + i * 18} cy={50 - (i % 2) * 8} r="3" fill="#38bdf8" opacity="0.8" />
      ))}
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900">
        <text x="470" y="40" fill="#0369a1">no alto: ar rarefeito,</text>
        <text x="470" y="56" fill="#0369a1">menos pressão</text>
        <text x="420" y="214" textAnchor="middle" fill="#f8fafc">no nível do mar: 1 atm</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A pressão nos líquidos: a garrafa com furos
// ---------------------------------------------------------------------------

function BottleHolesArt() {
  return (
    <Art viewBox="0 0 560 220" label="Uma garrafa com três furos: o jato de baixo vai mais longe, porque a pressão aumenta com a profundidade">
      <path d="M140 30 L200 30 L204 200 Q204 210 194 210 L146 210 Q136 210 136 200 Z" fill="#bae6fd" stroke="#0369a1" strokeWidth="2.5" />
      {[
        [80, 60],
        [130, 110],
        [180, 170],
      ].map(([y, reach], i) => (
        <path key={i} d={`M204 ${y} Q${204 + reach * 0.5} ${y - 4} ${204 + reach} ${210}`} stroke="#38bdf8" strokeWidth="5" fill="none" strokeLinecap="round" strokeDasharray="10 8" className="cg-anim-dash" />
      ))}
      <rect y="210" width="560" height="10" fill="#94a3b8" />
      <g fontFamily="Georgia, serif" fontSize="12.5" fontWeight="900" fill="#0c4a6e">
        <text x="420" y="60">quanto mais fundo,</text>
        <text x="420" y="78">maior a pressão</text>
        <text x="420" y="112" fill="#3b2a14" fontWeight="700">a cada 10 m de água,</text>
        <text x="420" y="130" fill="#3b2a14" fontWeight="700">+1 atmosfera</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O empuxo e o macaco hidráulico
// ---------------------------------------------------------------------------

function BuoyancyHydraulicArt() {
  return (
    <Art viewBox="0 0 560 230" label="A pedra parece mais leve dentro da água por causa do empuxo; no macaco hidráulico, uma força pequena no pistão fino levanta um carro no pistão largo">
      {/* o empuxo */}
      <rect x="40" y="110" width="140" height="100" rx="6" fill="#bae6fd" stroke="#0369a1" strokeWidth="2" />
      <line x1="110" y1="10" x2="110" y2="56" stroke="#475569" strokeWidth="2" />
      <rect x="96" y="40" width="28" height="22" rx="3" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
      <text x="110" y="56" textAnchor="middle" fontSize="9" fontWeight="900" fill="#1e293b">
        6 N
      </text>
      <line x1="110" y1="62" x2="110" y2="140" stroke="#475569" strokeWidth="2" />
      <path d="M92 140 L128 140 L124 170 L96 170 Z" fill="#78716c" stroke="#44403c" strokeWidth="2" />
      <Arrow x1={140} y1={200} x2={140} y2={152} color="#16a34a" label="empuxo" />
      <text x="110" y="226" textAnchor="middle" fontSize="12" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        na água, “pesa” menos
      </text>
      {/* o macaco hidráulico */}
      <path d="M250 180 L530 180 L530 210 L250 210 Z" fill="#fca5a5" stroke="#991b1b" strokeWidth="2" />
      <rect x="260" y="120" width="26" height="60" fill="#fca5a5" stroke="#991b1b" strokeWidth="2" />
      <rect x="420" y="100" width="100" height="80" fill="#fca5a5" stroke="#991b1b" strokeWidth="2" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 40;0 40;0 0" keyTimes="0;0.5;0.8;1" dur="4s" repeatCount="indefinite" />
        <rect x="258" y="112" width="30" height="10" fill="#475569" />
        <Arrow x1={273} y1={70} x2={273} y2={108} label="força pequena" />
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 -14;0 -14;0 0" keyTimes="0;0.5;0.8;1" dur="4s" repeatCount="indefinite" />
        <rect x="418" y="92" width="104" height="10" fill="#475569" />
        <g transform="translate(470 92) scale(0.8)">
          <Car color="#2563eb" wheelDur={0} />
        </g>
      </g>
      <text x="390" y="228" textAnchor="middle" fontSize="12" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
        Pascal: a pressão se espalha por todo o líquido
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 4, content, bare });

export const chapter4: BookPage[] = [
  page(
    <ChapterOpener
      n={4}
      title="Pressão e Fluidos"
      goals={["O que é pressão e por que a faca afiada corta melhor", "O que é a pressão atmosférica", "Como a pressão muda com a profundidade", "O empuxo de Arquimedes e o princípio de Pascal"]}
    >
      <Fig h={34}>
        <DiverOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📌">Pressão</H>
      <P>
        A <T>pressão</T> mede como uma força se espalha numa área: <strong>P = F ÷ A</strong>. A mesma força numa área <T>menor</T> gera uma pressão <T>maior</T>. A unidade no SI
        é o <T>pascal (Pa)</T>, que vale 1 newton por metro quadrado.
      </P>
      <Fig n="4.1" caption="A ponta fina concentra a força; o sapato de neve espalha o peso." h={24}>
        <PressureArt />
      </Fig>
      <Cards
        items={[
          { icon: "🔪", title: "Faca afiada", text: "O fio é tão fino que a área é minúscula: a pressão fica enorme e corta." },
          { icon: "📍", title: "Prego e agulha", text: "A ponta fina concentra a força num pontinho." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🏔️">A pressão atmosférica</H>
      <P>
        O ar tem peso! A camada de ar que cobre a Terra empurra tudo o que está embaixo dela: é a <T>pressão atmosférica</T>. Em 1643, o italiano <T>Evangelista Torricelli</T>{" "}
        mediu essa pressão com um tubo de mercúrio: ao nível do mar, o ar sustenta uma coluna de cerca de <T>76 cm</T> de mercúrio (1 atmosfera).
      </P>
      <Fig n="4.2" caption="O tubo de Torricelli e a montanha: quanto mais alto, menos ar em cima, menos pressão." h={24}>
        <AtmosphereArt />
      </Fig>
      <P>
        Quando subimos uma serra ou viajamos de avião, a pressão diminui, e o ouvido &ldquo;tapa&rdquo;. E o <T>canudinho</T> funciona por causa dela: você tira o ar de dentro
        dele, e a pressão do ar sobre o suco empurra o líquido para cima.
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🌊">A pressão nos líquidos</H>
      <P>
        Dentro de um líquido, a pressão <T>aumenta com a profundidade</T>, porque há mais líquido em cima. É o <T>Teorema de Stevin</T>. No mar, a cada <T>10 metros</T> de
        profundidade a pressão aumenta cerca de <T>1 atmosfera</T>.
      </P>
      <Fig n="4.3" caption="O furo mais fundo esguicha mais longe: lá a pressão é maior." h={22}>
        <BottleHolesArt />
      </Fig>
      <Box kind="sabia">É por isso que as barragens são mais grossas embaixo do que em cima, e que os submarinos precisam de cascos tão resistentes para descer fundo.</Box>
    </>,
  ),

  page(
    <>
      <H icon="🛳️">Empuxo e o Princípio de Pascal</H>
      <P>
        Todo corpo mergulhado num líquido recebe uma força para cima, o <T>empuxo</T>, igual ao peso do líquido que ele desloca: é o <T>Princípio de Arquimedes</T> (dizem que
        ele gritou &ldquo;Eureka!&rdquo; ao descobrir isso no banho). Se o corpo é menos denso que o líquido, o empuxo vence o peso e ele flutua.
      </P>
      <Fig n="4.4" caption="O empuxo deixa a pedra mais leve na água; o macaco hidráulico multiplica a força." h={26}>
        <BuoyancyHydraulicArt />
      </Fig>
      <P>
        O <T>Princípio de Pascal</T> diz que a pressão aplicada num líquido se transmite igualmente para todos os pontos dele. No <T>macaco hidráulico</T>, uma força pequena no
        pistão fino vira uma força grande no pistão largo, capaz de levantar um carro.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Pressão = força ÷ área, em pascals (Pa). Área menor, pressão maior.",
          "A pressão atmosférica ao nível do mar sustenta 76 cm de mercúrio (Torricelli) e diminui com a altitude.",
          "Nos líquidos, a pressão aumenta com a profundidade: +1 atm a cada 10 m de água (Stevin).",
          "Empuxo (Arquimedes): força para cima igual ao peso do líquido deslocado.",
          "Pascal: a pressão se transmite por todo o líquido (macaco hidráulico).",
        ]}
      />
      <Glossary
        items={[
          ["Pressão", "Força dividida pela área em que ela age."],
          ["Pascal (Pa)", "Unidade de pressão: 1 N por metro quadrado."],
          ["Pressão atmosférica", "A pressão do ar sobre tudo o que está na Terra."],
          ["Empuxo", "Força para cima que os líquidos fazem nos corpos mergulhados."],
          ["Fluido", "Tudo o que escoa: líquidos e gases."],
        ]}
      />
      <Quiz
        items={[
          ["Por que a faca afiada corta melhor?", "Porque a área do fio é menor, e a mesma força gera uma pressão maior."],
          ["O que acontece com a pressão atmosférica quando subimos uma montanha?", "Diminui."],
          ["O que acontece com a pressão sobre um mergulhador que desce?", "Aumenta: cerca de 1 atm a cada 10 m."],
          ["Qual princípio explica o macaco hidráulico?", "O Princípio de Pascal."],
        ]}
      />
    </>,
  ),
];
