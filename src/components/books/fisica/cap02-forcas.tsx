"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Arrow, Person } from "./art";

// ============================================================================
// CAPÍTULO 2 — FORÇAS E AS LEIS DE NEWTON (missão "Física: Forças e as Leis
// de Newton"): a maçã caindo perto de Newton, o passageiro indo pra frente
// quando o ônibus freia (inércia), o carrinho de tocar (escolha a força e a
// massa e veja a aceleração), o foguete e a patinadora (ação e reação) e o
// martelo e a pena caindo juntos na Lua.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a maçã caindo
// ---------------------------------------------------------------------------

function AppleOpenerArt() {
  const loop = { dur: "3s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 460 300" label="Isaac Newton sentado embaixo de uma macieira enquanto uma maçã cai, puxada pela gravidade">
      <rect width="460" height="300" fill="#e0f2fe" />
      <rect y="240" width="460" height="60" fill="#86efac" />
      {/* a árvore */}
      <rect x="236" y="120" width="26" height="124" rx="6" fill="#78350f" />
      <g className="cg-anim-sway" style={{ animationDuration: "6s" }}>
        <circle cx="250" cy="90" r="80" fill="#16a34a" stroke="#14532d" strokeWidth="2" />
        <circle cx="200" cy="110" r="44" fill="#22c55e" />
        <circle cx="300" cy="104" r="44" fill="#22c55e" />
        {[
          [210, 70], [290, 64], [256, 120], [180, 120],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="9" fill="#ef4444" />
        ))}
      </g>
      {/* a maçã caindo, cada vez mais rápido */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 18;0 70;0 150;0 150" keyTimes="0;0.25;0.5;0.75;1" calcMode="spline" keySplines="0.5 0 1 1;0.5 0 1 1;0.5 0 1 1;0 0 1 1" {...loop} />
        <circle cx="330" cy="86" r="10" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
        <path d="M330 76 L332 70" stroke="#78350f" strokeWidth="2" />
      </g>
      <Arrow x1={352} y1={110} x2={352} y2={170} label="gravidade" />
      {/* Newton sentado */}
      <g transform="translate(330 246)">
        <path d="M-14 -40 L12 -40 L14 -10 L-16 -10 Z" fill="#7c3aed" stroke="#1e293b" strokeWidth="1.5" />
        <path d="M-12 -10 L-30 -4 M10 -10 L28 -6" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
        <circle cy="-52" r="11" fill="#fcd34d" stroke="#92400e" strokeWidth="1.5" />
        <path d="M-12 -58 C-14 -70 12 -72 12 -58 L14 -46 L10 -50 L-10 -50 L-14 -46 Z" fill="#e5e7eb" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Inércia: o ônibus freia e o passageiro vai pra frente
// ---------------------------------------------------------------------------

function InertiaArt() {
  const loop = { dur: "4s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 560 210" label="Quando o ônibus freia de repente, o corpo do passageiro continua indo para a frente por inércia">
      <rect y="170" width="560" height="40" fill="#94a3b8" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="-120 0;200 0;240 0;240 0" keyTimes="0;0.45;0.6;1" calcMode="spline" keySplines="0 0 1 1;0.2 0.8 0.4 1;0 0 1 1" {...loop} />
        <rect x="40" y="60" width="240" height="100" rx="16" fill="#f59e0b" stroke="#92400e" strokeWidth="3" />
        <rect x="60" y="76" width="160" height="44" rx="4" fill="#bae6fd" stroke="#92400e" strokeWidth="2" />
        <rect x="236" y="76" width="34" height="70" rx="4" fill="#bae6fd" stroke="#92400e" strokeWidth="2" />
        {/* o passageiro inclinando pra frente na freada */}
        <g transform="translate(150 126)">
          <g>
            <animateTransform attributeName="transform" type="rotate" values="0;0;28;0;0" keyTimes="0;0.45;0.55;0.75;1" {...loop} />
            <rect x="-8" y="-34" width="16" height="30" rx="4" fill="#7c3aed" />
            <circle cy="-44" r="9" fill="#fcd34d" stroke="#92400e" strokeWidth="1.5" />
          </g>
        </g>
        <rect x="132" y="118" width="40" height="10" rx="3" fill="#78350f" />
        <circle cx="90" cy="160" r="15" fill="#1e293b" />
        <circle cx="236" cy="160" r="15" fill="#1e293b" />
      </g>
      <text x="20" y="30" fontSize="13" fontWeight="900" fill="#7c3aed" fontFamily="Georgia, serif">
        O ônibus para, mas o corpo continua indo pra frente: é a inércia!
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// F = m · a: o carrinho de tocar
// ---------------------------------------------------------------------------

export function NewtonCart() {
  const [force, setForce] = useState(20);
  const [mass, setMass] = useState(10);
  const a = force / mass;
  const dur = Math.max(1.2, 5 / Math.sqrt(a));
  const boxes = mass / 5;
  const pushers = force / 10;
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      <svg viewBox="0 0 520 110" className="block w-full" aria-hidden="true">
        <rect y="96" width="520" height="14" fill="#94a3b8" />
        <g key={`${force}-${mass}`} style={{ animation: `cg-drive-across ${dur}s cubic-bezier(0.55, 0, 0.9, 0.6) infinite` }}>
          <g transform="translate(-20 96)">
            {Array.from({ length: pushers }, (_, i) => (
              <g key={i} transform={`translate(${-24 - i * 22} 0) rotate(12)`}>
                <Person color="#16a34a" scale={0.55} />
              </g>
            ))}
            <rect x="0" y="-40" width="74" height="30" rx="4" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
            {Array.from({ length: boxes }, (_, i) => (
              <rect key={i} x={6 + i * 22} y={-62} width="20" height="22" rx="2" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
            ))}
            <circle cx="16" cy="-6" r="7" fill="#1e293b" />
            <circle cx="58" cy="-6" r="7" fill="#1e293b" />
          </g>
        </g>
      </svg>
      <div className="mt-[0.4em] flex flex-wrap justify-center gap-[0.8em] text-[0.86em]">
        <div className="flex items-center gap-[0.3em]">
          <span className="font-bold">Força:</span>
          {[10, 20, 30].map((f) => (
            <button key={f} type="button" onClick={() => setForce(f)} className={`rounded-full border px-[0.6em] py-[0.1em] font-bold ${force === f ? "border-[#16a34a] bg-[#16a34a] text-white" : "border-[#d9c79d] bg-white hover:bg-[#f0fdf4]"}`}>
              {f} N
            </button>
          ))}
        </div>
        <div className="flex items-center gap-[0.3em]">
          <span className="font-bold">Massa:</span>
          {[5, 10, 15].map((m) => (
            <button key={m} type="button" onClick={() => setMass(m)} className={`rounded-full border px-[0.6em] py-[0.1em] font-bold ${mass === m ? "border-[#d97706] bg-[#d97706] text-white" : "border-[#d9c79d] bg-white hover:bg-[#fffbeb]"}`}>
              {m} kg
            </button>
          ))}
        </div>
      </div>
      <p className="mt-[0.4em] rounded-lg bg-[#eef2ff] px-[0.6em] py-[0.3em] text-center font-bold text-[#312e81]">
        a = F ÷ m = {force} ÷ {mass} = <span className="text-[1.15em]">{a.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} m/s²</span>
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Ação e reação: o foguete e a patinadora
// ---------------------------------------------------------------------------

function ActionReactionArt() {
  return (
    <Art viewBox="0 0 560 230" label="O foguete empurra os gases para baixo e os gases empurram o foguete para cima; a patinadora empurra a parede e é empurrada para trás">
      {/* o foguete */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 10;0 -10;0 10" dur="2s" repeatCount="indefinite" />
        <g transform="translate(140 110)">
          <path d="M0 -70 C18 -50 20 -10 18 30 L-18 30 C-20 -10 -18 -50 0 -70 Z" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.5" />
          <circle cy="-24" r="9" fill="#38bdf8" stroke="#1e293b" strokeWidth="2" />
          <path d="M-18 10 L-32 34 L-18 30 Z M18 10 L32 34 L18 30 Z" fill="#dc2626" stroke="#1e293b" strokeWidth="2" />
          <g className="cg-anim-astro-flame">
            <path d="M-12 32 C-8 60 8 60 12 32 Z" fill="#f97316" />
            <path d="M-6 32 C-4 48 4 48 6 32 Z" fill="#fde047" />
          </g>
        </g>
      </g>
      <Arrow x1={170} y1={76} x2={170} y2={32} color="#16a34a" label="reação" />
      <Arrow x1={170} y1={160} x2={170} y2={215} color="#dc2626" label="ação" />
      {/* a patinadora e a parede */}
      <rect x="520" y="40" width="30" height="160" fill="#a8a29e" stroke="#57534e" strokeWidth="2" />
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;-90 0;-90 0;0 0" keyTimes="0;0.2;0.6;0.85;1" dur="4s" repeatCount="indefinite" />
        <g transform="translate(470 196)">
          <Person color="#db2777" />
          <path d="M14 -46 L48 -50" stroke="#fcd34d" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M-14 4 L6 4 M2 4 L16 4" stroke="#1e293b" strokeWidth="3" />
        </g>
        {/* a reação vai junto com a patinadora */}
        <Arrow x1={456} y1={160} x2={396} y2={160} color="#16a34a" label="reação" />
      </g>
      <Arrow x1={490} y1={130} x2={514} y2={130} color="#dc2626" label="" />
      <text x="500" y="122" textAnchor="end" fontSize="12" fontWeight="900" fill="#dc2626" fontFamily="Georgia, serif">
        ação
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Na Lua: o martelo e a pena caem juntos
// ---------------------------------------------------------------------------

function MoonDropArt() {
  const loop = { dur: "3.5s", repeatCount: "indefinite" };
  return (
    <Art viewBox="0 0 560 230" label="Na Lua, sem ar, um martelo e uma pena soltos da mesma altura chegam ao chão juntos; e o astronauta pesa menos lá do que na Terra">
      <rect width="300" height="230" fill="#0f172a" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={(i * 53) % 300} cy={(i * 31) % 150} r="1.2" fill="#fff" className="cg-anim-twinkle" style={{ animationDelay: `${(i % 5) * 0.4}s` }} />
      ))}
      <path d="M0 196 Q80 186 150 196 T300 192 L300 230 L0 230 Z" fill="#cbd5e1" />
      {/* o martelo e a pena caindo juntos */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 110;0 110;0 0" keyTimes="0;0.55;0.85;1" calcMode="spline" keySplines="0.5 0 1 1;0 0 1 1;0 0 1 1" {...loop} />
        <g transform="translate(110 70)">
          <rect x="-4" y="-6" width="8" height="30" fill="#78350f" />
          <rect x="-14" y="-14" width="28" height="12" rx="2" fill="#64748b" />
        </g>
        <g transform="translate(190 70)">
          <path d="M0 24 C-10 10 -8 -8 0 -16 C8 -8 10 10 0 24 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M0 24 L0 -12" stroke="#94a3b8" strokeWidth="1" />
        </g>
      </g>
      <text x="150" y="26" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#e2e8f0" fontFamily="Georgia, serif">
        Na Lua, sem ar: caem juntos!
      </text>
      {/* o peso na Terra e na Lua */}
      <g fontFamily="Georgia, serif" textAnchor="middle">
        <rect x="316" y="10" width="236" height="210" rx="14" fill="#fffaf0" stroke="#d9c79d" strokeWidth="2" />
        <text x="434" y="36" fontSize="13.5" fontWeight="900" fill="#3b2a14">
          Astronauta de 50 kg
        </text>
        <circle cx="374" cy="88" r="26" fill="#3b82f6" />
        <path d="M352 80 C364 70 384 70 396 82" stroke="#16a34a" strokeWidth="6" fill="none" />
        <circle cx="494" cy="88" r="26" fill="#cbd5e1" />
        <circle cx="486" cy="80" r="5" fill="#94a3b8" />
        <circle cx="502" cy="96" r="4" fill="#94a3b8" />
        <text x="374" y="136" fontSize="13" fontWeight="900" fill="#1d4ed8">Terra</text>
        <text x="494" y="136" fontSize="13" fontWeight="900" fill="#475569">Lua</text>
        <text x="374" y="160" fontSize="12" fill="#3b2a14">massa 50 kg</text>
        <text x="494" y="160" fontSize="12" fill="#3b2a14">massa 50 kg</text>
        <text x="374" y="182" fontSize="12.5" fontWeight="900" fill="#dc2626">peso 500 N</text>
        <text x="494" y="182" fontSize="12.5" fontWeight="900" fill="#dc2626">peso ~ 80 N</text>
        <text x="434" y="208" fontSize="11" fontStyle="italic" fill="#6b5a3a">a massa não muda; o peso, sim</text>
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
      title="Forças e as Leis de Newton"
      goals={["O que é força e como ela é medida", "As três Leis de Newton", "A diferença entre massa e peso", "Por que o atrito é tão importante"]}
    >
      <Fig h={34}>
        <AppleOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🛑">A 1ª Lei de Newton: a inércia</H>
      <P>
        Uma <T>força</T> é um empurrão ou um puxão, capaz de mudar o movimento ou a forma de um corpo. Ela é medida em <T>newtons (N)</T>, em homenagem ao cientista inglês{" "}
        <T>Isaac Newton</T>, que no século XVII descreveu as três leis do movimento.
      </P>
      <P>
        A <T>1ª Lei</T>, ou <T>Lei da Inércia</T>, diz: um corpo parado tende a continuar parado, e um corpo em movimento tende a continuar em movimento em linha reta, até que
        uma força mude isso.
      </P>
      <Fig n="2.1" caption="Na freada, o passageiro continua indo para a frente: é por isso que usamos cinto de segurança!" h={22}>
        <InertiaArt />
      </Fig>
      <Box kind="experimente">Coloque uma moeda sobre um cartão em cima de um copo e dê um peteleco rápido no cartão: ele voa, mas a moeda, por inércia, cai dentro do copo!</Box>
    </>,
  ),

  page(
    <>
      <H icon="💪">A 2ª Lei de Newton: F = m · a</H>
      <P>
        A <T>2ª Lei</T> diz que a força resultante é igual à <T>massa</T> vezes a <T>aceleração</T>. Quanto mais massa, mais força é preciso para acelerar; e quanto mais força,
        maior a aceleração.
      </P>
      <div className="my-[0.4em] rounded-xl border-2 border-[#4f46e5] bg-[#eef2ff] px-[0.8em] py-[0.4em] text-center font-bold text-[#312e81]">F = m · a</div>
      <P>Escolha a força e a massa e veja o carrinho acelerar:</P>
      <NewtonCart />
      <P>
        Exemplo: para dar uma aceleração de 2 m/s² a um objeto de 10 kg, a força é F = 10 × 2 = <T>20 N</T>. Um newton é a força que acelera 1 kg a 1 m/s².
      </P>
    </>,
  ),

  page(
    <>
      <H icon="🚀">A 3ª Lei de Newton: ação e reação</H>
      <P>
        A <T>3ª Lei</T> diz que toda <T>ação</T> tem uma <T>reação</T> de mesma intensidade e sentido oposto. As duas forças agem em corpos diferentes: quando você empurra
        alguma coisa, ela empurra você de volta.
      </P>
      <Fig n="2.2" caption="O foguete empurra os gases para baixo e é empurrado para cima. A patinadora empurra a parede e desliza para trás." h={26}>
        <ActionReactionArt />
      </Fig>
      <Cards
        items={[
          { icon: "🏊", title: "Nadando", text: "Você empurra a água para trás e a água empurra você para a frente." },
          { icon: "🚶", title: "Andando", text: "O pé empurra o chão para trás; o chão empurra você para a frente." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🌙">Massa, peso e atrito</H>
      <P>
        <T>Massa</T> é a quantidade de matéria, medida em kg, e é a mesma em qualquer lugar. <T>Peso</T> é a força com que a gravidade puxa o corpo, medido em newtons:{" "}
        <strong>peso = massa × gravidade</strong>. Na Terra (g ≈ 10 m/s²), uma pessoa de 50 kg pesa 50 × 10 = <T>500 N</T>. Na Lua, a gravidade é cerca de 1/6 da da Terra.
      </P>
      <Fig n="2.3" caption="Sem o ar para atrapalhar, todos os corpos caem com a mesma aceleração. Um astronauta da Apollo 15 mostrou isso na Lua em 1971." h={24}>
        <MoonDropArt />
      </Fig>
      <P>
        O <T>atrito</T> aparece quando duas superfícies se esfregam e se opõe ao movimento: é ele que faz o livro empurrado na mesa parar. Mas o atrito também ajuda: é graças a
        ele que conseguimos andar (no chão ensaboado, o pé escorrega) e que os freios funcionam.
      </P>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Força é um empurrão ou puxão, medida em newtons (N).",
          "1ª Lei (inércia): o corpo mantém o seu estado de repouso ou de movimento se nenhuma força agir.",
          "2ª Lei: F = m · a. 3ª Lei: toda ação tem uma reação igual e oposta.",
          "Peso = massa × gravidade. A massa não muda de lugar para lugar; o peso muda.",
          "O atrito se opõe ao movimento, mas também nos permite andar e frear.",
        ]}
      />
      <Glossary
        items={[
          ["Força", "Empurrão ou puxão que muda o movimento ou a forma de um corpo."],
          ["Inércia", "A tendência do corpo de manter o seu estado de movimento."],
          ["Newton (N)", "A unidade de força do SI."],
          ["Peso", "A força da gravidade sobre um corpo."],
          ["Atrito", "A força que aparece entre superfícies que se esfregam."],
        ]}
      />
      <Quiz
        items={[
          ["Por que usamos cinto de segurança?", "Porque, por inércia, o corpo continua indo para a frente quando o carro freia."],
          ["Qual força acelera 10 kg a 2 m/s²?", "F = m · a = 10 × 2 = 20 N."],
          ["Quanto pesa uma pessoa de 50 kg na Terra (g = 10 m/s²)?", "500 N."],
          ["Sem resistência do ar, uma bola de boliche e uma de tênis caem como?", "Chegam juntas: caem com a mesma aceleração."],
        ]}
      />
    </>,
  ),
];
