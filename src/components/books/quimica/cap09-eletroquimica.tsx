"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";

// ============================================================================
// CAPÍTULO 9 — ELETROQUÍMICA E RADIOATIVIDADE (missão "Química:
// Eletroquímica e Radioatividade"): a pilha acendendo a lâmpada, a pilha de
// Daniell com os elétrons indo do zinco pro cobre, a chave sendo coberta de
// cobre na eletrólise, as radiações alfa, beta e gama atravessando (ou não)
// o papel, o alumínio e o chumbo, e a meia-vida.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a pilha acendendo a lâmpada
// ---------------------------------------------------------------------------

function BatteryOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma pilha ligada a uma lâmpada por fios, com os elétrons andando pelo circuito e a lâmpada acesa">
      {/* os fios */}
      <path d="M120 100 L120 40 L340 40 L340 120" stroke="#b45309" strokeWidth="6" fill="none" strokeLinejoin="round" />
      <path d="M340 180 L340 250 L120 250 L120 200" stroke="#b45309" strokeWidth="6" fill="none" strokeLinejoin="round" />
      {/* os elétrons andando */}
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} r="5" fill="#3b82f6" stroke="#fff" strokeWidth="1">
          <animateMotion path="M120 200 L120 250 L340 250 L340 180 M340 120 L340 40 L120 40 L120 100" dur="5s" begin={`${-i * 0.625}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* a pilha */}
      <g transform="translate(120 150)">
        <rect x="-34" y="-50" width="68" height="100" rx="10" fill="#1e293b" />
        <rect x="-34" y="-50" width="68" height="30" rx="10" fill="#f59e0b" />
        <rect x="-12" y="-62" width="24" height="12" rx="3" fill="#94a3b8" />
        <text y="-28" textAnchor="middle" fontSize="20" fontWeight="900" fill="#1e293b">
          +
        </text>
        <text y="38" textAnchor="middle" fontSize="22" fontWeight="900" fill="#f8fafc">
          −
        </text>
      </g>
      {/* a lâmpada acesa */}
      <g transform="translate(340 150)">
        <circle r="70" fill="#fde047" opacity="0.35" className="cg-anim-glow" />
        <circle cy="-10" r="34" fill="#fef9c3" stroke="#ca8a04" strokeWidth="3" />
        <path d="M-10 -6 Q-5 -20 0 -6 Q5 -20 10 -6" stroke="#f59e0b" strokeWidth="3" fill="none" />
        <rect x="-16" y="22" width="32" height="20" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
        <path d="M-16 28 L16 28 M-16 34 L16 34" stroke="#475569" strokeWidth="1.5" />
      </g>
      <text x="230" y="290" textAnchor="middle" fontSize="13" fontWeight="900" fill="#1d4ed8" fontFamily="Georgia, serif">
        os elétrons andando pelo fio
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A pilha de Daniell
// ---------------------------------------------------------------------------

function DaniellArt() {
  return (
    <Art viewBox="0 0 560 250" label="A pilha de Daniell: o zinco se oxida no ânodo e manda elétrons pelo fio até o cobre, no cátodo, onde acontece a redução">
      {/* os béqueres */}
      <path d="M50 110 L50 220 Q50 232 62 232 L188 232 Q200 232 200 220 L200 110" fill="#e0f2fe" stroke="#64748b" strokeWidth="2.5" />
      <path d="M360 110 L360 220 Q360 232 372 232 L498 232 Q510 232 510 220 L510 110" fill="#bfdbfe" stroke="#64748b" strokeWidth="2.5" />
      {/* a ponte salina */}
      <path d="M160 150 L160 80 L400 80 L400 150" stroke="#e7e5e4" strokeWidth="18" fill="none" />
      <path d="M160 150 L160 80 L400 80 L400 150" stroke="#a8a29e" strokeWidth="2" fill="none" />
      <text x="280" y="72" textAnchor="middle" fontSize="11.5" fill="#57534e" fontFamily="Georgia, serif">
        ponte salina
      </text>
      {/* os eletrodos */}
      <rect x="90" y="60" width="20" height="150" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
      <rect x="450" y="60" width="20" height="150" fill="#d97706" stroke="#92400e" strokeWidth="2" />
      {/* o fio com a lâmpada */}
      <path d="M100 60 L100 24 L260 24 M300 24 L460 24 L460 60" stroke="#475569" strokeWidth="3" fill="none" />
      <circle cx="280" cy="24" r="16" fill="#fef9c3" stroke="#ca8a04" strokeWidth="2.5" className="cg-anim-glow" />
      {Array.from({ length: 5 }, (_, i) => (
        <circle key={i} r="4.5" fill="#3b82f6">
          <animateMotion path="M100 60 L100 24 L460 24 L460 60" dur="3s" begin={`${-i * 0.6}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* o zinco se desfazendo e o cobre se depositando */}
      {[0, 1, 2].map((k) => (
        <circle key={`zn${k}`} cx="112" r="4" fill="#94a3b8" stroke="#475569">
          <animate attributeName="cx" values="112;150" dur="2.4s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${150 + k * 20};${160 + k * 20}`} dur="2.4s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="2.4s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {[0, 1, 2].map((k) => (
        <circle key={`cu${k}`} r="4" fill="#d97706" stroke="#92400e">
          <animate attributeName="cx" values="420;450" dur="2.4s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
          <animate attributeName="cy" values={`${140 + k * 22};${146 + k * 22}`} dur="2.4s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <g fontFamily="Georgia, serif" fontWeight="900" textAnchor="middle">
        <text x="125" y="250" fontSize="13" fill="#334155">Zinco: ânodo (−)</text>
        <text x="125" y="226" fontSize="11.5" fill="#475569">oxidação: perde e⁻</text>
        <text x="435" y="250" fontSize="13" fill="#92400e">Cobre: cátodo (+)</text>
        <text x="435" y="226" fontSize="11.5" fill="#92400e">redução: ganha e⁻</text>
        <text x="200" y="16" fontSize="11.5" fill="#1d4ed8">elétrons →</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A eletrólise cobrindo uma chave de cobre
// ---------------------------------------------------------------------------

function ElectroplatingArt() {
  return (
    <Art viewBox="0 0 540 220" label="Na eletrólise, a corrente da bateria faz os íons de cobre da solução se depositarem sobre a chave, que fica cobreada">
      <path d="M140 80 L140 200 Q140 210 150 210 L390 210 Q400 210 400 200 L400 80" fill="#bfdbfe" stroke="#64748b" strokeWidth="2.5" />
      {/* a barra de cobre e a chave */}
      <rect x="180" y="50" width="24" height="140" fill="#d97706" stroke="#92400e" strokeWidth="2" />
      <g transform="translate(340 120)">
        <path d="M-6 -70 L6 -70 L6 30 L14 30 L14 38 L6 38 L6 46 L14 46 L14 54 L6 54 L6 60 L-6 60 Z" strokeWidth="2" stroke="#475569">
          <animate attributeName="fill" values="#cbd5e1;#d97706;#d97706;#cbd5e1" keyTimes="0;0.6;0.9;1" dur="6s" repeatCount="indefinite" />
        </path>
        <circle cy="-82" r="16" fill="none" strokeWidth="8">
          <animate attributeName="stroke" values="#cbd5e1;#d97706;#d97706;#cbd5e1" keyTimes="0;0.6;0.9;1" dur="6s" repeatCount="indefinite" />
        </circle>
      </g>
      {/* os íons de cobre indo da barra pra chave */}
      {Array.from({ length: 5 }, (_, i) => (
        <g key={i}>
          <animateMotion path={`M210 ${100 + i * 18} L330 ${90 + i * 22}`} dur="2.5s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
          <circle r="7" fill="#f59e0b" stroke="#92400e" strokeWidth="1.2" />
          <text y="3" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#451a03">
            Cu²⁺
          </text>
        </g>
      ))}
      {/* a bateria */}
      <path d="M192 50 L192 24 L250 24 M290 24 L340 24 L340 38" stroke="#475569" strokeWidth="3" fill="none" />
      <rect x="250" y="12" width="40" height="24" rx="4" fill="#1e293b" />
      <text x="270" y="29" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fde047">
        + −
      </text>
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900" fill="#3b2a14">
        <text x="40" y="120">barra de cobre</text>
        <text x="410" y="120">chave sendo</text>
        <text x="410" y="136">cobreada</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O poder de penetração das radiações
// ---------------------------------------------------------------------------

function PenetrationArt() {
  const rays = [
    { name: "alfa (α)", color: "#ef4444", stop: 210, y: 60, wave: false },
    { name: "beta (β)", color: "#3b82f6", stop: 320, y: 120, wave: false },
    { name: "gama (γ)", color: "#a855f7", stop: 440, y: 180, wave: true },
  ];
  return (
    <Art viewBox="0 0 560 240" label="A radiação alfa é barrada por uma folha de papel, a beta por uma placa de alumínio e a gama só por chumbo ou concreto grosso">
      {/* a fonte radioativa */}
      <rect x="20" y="40" width="70" height="160" rx="10" fill="#475569" />
      <g transform="translate(55 120)">
        <circle r="20" fill="#facc15" />
        {[0, 120, 240].map((a) => (
          <path key={a} d="M0 0 L-9 -16 A18 18 0 0 1 9 -16 Z" fill="#1e293b" transform={`rotate(${a})`} />
        ))}
        <circle r="5" fill="#1e293b" />
      </g>
      {/* as barreiras */}
      <rect x="206" y="24" width="6" height="196" fill="#fffbeb" stroke="#d6b77a" />
      <rect x="316" y="24" width="12" height="196" fill="#cbd5e1" stroke="#64748b" />
      <rect x="436" y="24" width="34" height="196" fill="#475569" stroke="#1e293b" />
      <g fontFamily="Georgia, serif" fontSize="12" fontWeight="900" textAnchor="middle" fill="#3b2a14">
        <text x="209" y="236">papel</text>
        <text x="322" y="236">alumínio</text>
        <text x="453" y="236">chumbo</text>
      </g>
      {/* os raios */}
      {rays.map((r) => (
        <g key={r.name}>
          {r.wave ? (
            <path d={`M90 ${r.y} ${Array.from({ length: 21 }, (_, k) => `Q${100 + k * 16} ${r.y + (k % 2 ? 10 : -10)} ${108 + k * 16} ${r.y}`).join(" ")}`} stroke={r.color} strokeWidth="3" fill="none" strokeDasharray="12 8" className="cg-anim-dash" />
          ) : (
            <path d={`M90 ${r.y} L${r.stop} ${r.y}`} stroke={r.color} strokeWidth="3" strokeDasharray="12 8" className="cg-anim-dash" />
          )}
          {!r.wave && (
            <circle cy={r.y} r={r.name.startsWith("alfa") ? 8 : 4} fill={r.color}>
              <animate attributeName="cx" values={`90;${r.stop - 6}`} dur="1.4s" repeatCount="indefinite" />
            </circle>
          )}
          <text x={r.name.startsWith("gama") ? 140 : 130} y={r.y - 12} fontSize="13" fontWeight="900" fill={r.color} fontFamily="Georgia, serif">
            {r.name}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A meia-vida: a cada meia-vida, metade dos átomos decai
// ---------------------------------------------------------------------------

function HalfLifeArt() {
  const steps = [16, 8, 4, 2];
  return (
    <Art viewBox="0 0 560 170" label="A meia-vida: de 16 átomos radioativos sobram 8 depois de uma meia-vida, 4 depois de duas e 2 depois de três">
      {steps.map((n, s) => (
        <g key={s} transform={`translate(${30 + s * 135} 20)`}>
          <rect width="110" height="110" rx="10" fill="#fffaf0" stroke="#d9c79d" strokeWidth="2" />
          {Array.from({ length: 16 }, (_, i) => (
            <circle key={i} cx={18 + (i % 4) * 25} cy={18 + Math.floor(i / 4) * 25} r="9" fill={i < n ? "#a855f7" : "#e7e5e4"} stroke={i < n ? "#6b21a8" : "#d6d3d1"} strokeWidth="1.2" className={i < n ? "cg-anim-glow" : undefined} style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
          <text x="55" y="134" textAnchor="middle" fontSize="13" fontWeight="900" fill="#3b2a14" fontFamily="Georgia, serif">
            {n} átomos
          </text>
          <text x="55" y="152" textAnchor="middle" fontSize="11" fill="#6b5a3a" fontFamily="Georgia, serif">
            {s === 0 ? "no começo" : `${s} meia-vida${s > 1 ? "s" : ""}`}
          </text>
          {s < 3 && <path d="M116 55 L128 55" stroke="#b08a52" strokeWidth="3" />}
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 9, content, bare });

export const chapter9: BookPage[] = [
  page(
    <ChapterOpener
      n={9}
      title="Eletroquímica e Radioatividade"
      goals={["Como uma pilha transforma química em eletricidade", "O que são oxidação e redução", "O que é a eletrólise e por que descartar pilhas corretamente", "O que são as radiações e como elas são usadas"]}
    >
      <Fig h={34}>
        <BatteryOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🔋">Oxidação, redução e as pilhas</H>
      <P>
        Uma <T>pilha</T> transforma energia química em energia elétrica. Dentro dela acontece uma reação de <T>oxirredução</T>: uma substância perde elétrons e outra ganha, e
        esses elétrons passam pelo fio, fazendo funcionar o aparelho.
      </P>
      <Fig n="9.1" caption="A pilha de Daniell: os elétrons saem do zinco e vão para o cobre pelo fio." h={26}>
        <DaniellArt />
      </Fig>
      <List
        items={[
          <>
            <T>Oxidação</T>: a espécie <em>perde</em> elétrons. Acontece no <T>ânodo</T>.
          </>,
          <>
            <T>Redução</T>: a espécie <em>ganha</em> elétrons. Acontece no <T>cátodo</T>.
          </>,
        ]}
      />
      <Box kind="mago" title="Macete do Mago: OPA!">
        <strong>O</strong>xidação <strong>P</strong>erde elétrons, no <strong>A</strong>nodo. E os elétrons sempre saem do ânodo e vão para o cátodo.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⚡">Eletrólise e o descarte das pilhas</H>
      <P>
        A <T>eletrólise</T> é o caminho contrário da pilha: usa a <T>corrente elétrica</T> para provocar uma reação química que não aconteceria sozinha. Ela é usada para obter o
        alumínio e o cloro e para cobrir objetos com uma camada de metal.
      </P>
      <Fig n="9.2" caption="Na eletrólise, a chave recebe uma camada de cobre." h={22}>
        <ElectroplatingArt />
      </Fig>
      <Cards
        items={[
          { icon: "🛡️", title: "Galvanização", text: "O ferro é coberto de zinco, que enferruja no lugar dele: o zinco é o “metal de sacrifício”." },
          { icon: "♻️", title: "Descarte", text: "Pilhas e baterias têm metais tóxicos: leve a pontos de coleta, nunca ao lixo comum." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="☢️">A radioatividade</H>
      <P>
        Alguns átomos têm o núcleo <T>instável</T> e soltam energia e partículas para se estabilizar: é a <T>radioatividade</T>. Ela foi estudada pelo francês Henri Becquerel e
        por <T>Marie Curie</T>, que descobriu os elementos polônio e rádio e ganhou dois prêmios Nobel.
      </P>
      <Fig n="9.3" caption="Quanto mais penetrante a radiação, mais grossa precisa ser a barreira." h={26}>
        <PenetrationArt />
      </Fig>
      <List
        items={[
          <>
            <T>Alfa (α)</T>: partícula grande e lenta, barrada por uma folha de papel.
          </>,
          <>
            <T>Beta (β)</T>: um elétron rápido, barrado por uma placa fina de alumínio.
          </>,
          <>
            <T>Gama (γ)</T>: uma onda de muita energia, a mais penetrante: só o chumbo ou o concreto grosso a barram.
          </>,
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🏥">Usos e acidentes</H>
      <P>
        Os átomos radioativos decaem num ritmo constante. A <T>meia-vida</T> é o tempo para metade deles se transformar: depois de duas meias-vidas, sobra um quarto.
      </P>
      <Fig n="9.4" caption="A cada meia-vida, a quantidade de átomos radioativos cai pela metade." h={18}>
        <HalfLifeArt />
      </Fig>
      <P>
        Usada com cuidado, a radiação salva vidas: a <T>radioterapia</T> destrói células de câncer, exames mostram o funcionamento dos órgãos e o carbono-14 data fósseis. Mas,
        sem controle, ela é perigosa:
      </P>
      <Table
        head={["Ano", "Acidente"]}
        rows={[
          ["1986", "Chernobyl (atual Ucrânia): o mais grave da história das usinas nucleares"],
          ["1987", "Goiânia: uma cápsula de césio-137 aberta num ferro-velho, o maior acidente radiológico fora de usinas"],
          ["2011", "Fukushima (Japão): usina atingida por um terremoto seguido de tsunami"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Na pilha, uma reação de oxirredução faz os elétrons andarem pelo fio.",
          "Oxidação: perde elétrons (ânodo). Redução: ganha elétrons (cátodo). OPA!",
          "Eletrólise usa a corrente para provocar reações: alumínio, cloro, galvanoplastia.",
          "Pilhas e baterias vão para pontos de coleta, não para o lixo comum.",
          "Radiação alfa (barrada pelo papel), beta (alumínio) e gama (chumbo ou concreto).",
        ]}
      />
      <Glossary
        items={[
          ["Ânodo", "Eletrodo onde acontece a oxidação."],
          ["Cátodo", "Eletrodo onde acontece a redução."],
          ["Eletrólise", "Reação química provocada pela corrente elétrica."],
          ["Radioatividade", "Emissão de energia por núcleos instáveis."],
          ["Meia-vida", "Tempo para metade dos átomos radioativos decair."],
        ]}
      />
      <Quiz
        items={[
          ["O que acontece na oxidação?", "A espécie perde elétrons."],
          ["Em qual eletrodo da pilha ocorre a oxidação?", "No ânodo."],
          ["Qual radiação é a mais penetrante?", "A gama, que só é barrada por chumbo ou concreto grosso."],
          ["Qual acidente radioativo aconteceu em Goiânia em 1987?", "O acidente com o césio-137, de uma cápsula aberta num ferro-velho."],
        ]}
      />
    </>,
  ),
];
