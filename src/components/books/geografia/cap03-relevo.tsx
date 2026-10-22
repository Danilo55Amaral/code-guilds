"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Tree } from "../ods/art";
import { GEO_DARK, Mountain, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 3 — A TERRA E O RELEVO (missão "Geografia: Relevo, Clima e
// Águas", a parte do relevo): o vulcão em erupção, o corte da Terra com as
// camadas, as placas tectônicas se mexendo (de tocar), o explorador das
// formas de relevo (de tocar) e a erosão da chuva e do rio.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o vulcão
// ---------------------------------------------------------------------------

function VolcanoOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um vulcão em erupção soltando lava e fumaça, com o corte do chão mostrando o magma subindo pela chaminé">
      <rect width="460" height="300" fill="#fed7aa" />
      {[0, 1, 2].map((k) => (
        <circle key={k} cx={230} r={24} fill="#57534e" opacity="0.6">
          <animate attributeName="cy" values="70;-20" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
          <animate attributeName="r" values="14;40" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="3s" begin={`${-k}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <path d="M60 220 L200 80 L260 80 L400 220 Z" fill="#78716c" stroke="#44403c" strokeWidth="2" />
      <path d="M200 80 Q230 60 260 80 L250 96 Q230 88 210 96 Z" fill="#f97316" />
      {[-1, 1].map((d) => (
        <path key={d} d={`M${230 + d * 18} 88 Q${230 + d * 50} 130 ${230 + d * 70} 190`} fill="none" stroke="#ea580c" strokeWidth="10" strokeLinecap="round" strokeDasharray="200" strokeDashoffset="200">
          <animate attributeName="stroke-dashoffset" values="200;0;0" keyTimes="0;0.6;1" dur="4s" repeatCount="indefinite" />
        </path>
      ))}
      {[0, 1, 2, 3].map((k) => (
        <circle key={k} cx={230 + (k - 1.5) * 16} r="5" fill="#facc15">
          <animate attributeName="cy" values="80;20;80" dur="1.6s" begin={`${-k * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <rect y="220" width="460" height="80" fill="#a16207" />
      <path d="M222 300 L222 96 L238 96 L238 300 Z" fill="#ea580c" />
      <ellipse cx="230" cy="290" rx="90" ry="16" fill="#dc2626" />
      <text x="330" y="270" fontSize="15" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
        magma
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As camadas da Terra
// ---------------------------------------------------------------------------

function LayersArt() {
  const layers = [
    { r: 90, color: "#a16207", name: "Crosta (até 70 km)", y: 30 },
    { r: 82, color: "#f97316", name: "Manto (rocha quente e pastosa)", y: 70 },
    { r: 46, color: "#fbbf24", name: "Núcleo externo (metal líquido)", y: 120 },
    { r: 24, color: "#fde047", name: "Núcleo interno (metal sólido)", y: 165 },
  ];
  return (
    <Art viewBox="0 0 560 200" label="O corte da Terra mostrando a crosta fina por fora, o manto, o núcleo externo líquido e o núcleo interno sólido no centro">
      <rect width="560" height="200" rx="14" fill="#fffaf0" />
      <g transform="translate(150 100)">
        {layers.map((l) => (
          <circle key={l.name} r={l.r} fill={l.color} stroke="#78350f" strokeWidth="1" />
        ))}
        <circle r="24" fill="#fde047">
          <animate attributeName="fill" values="#fde047;#fef9c3;#fde047" dur="2s" repeatCount="indefinite" />
        </circle>
        <path d="M0 0 L90 0 A90 90 0 0 0 0 -90 Z" fill="#fffaf0" />
        <path d="M0 0 L90 0 A90 90 0 0 0 0 -90" fill="none" stroke="#78350f" strokeWidth="1" />
      </g>
      {layers.map((l, i) => (
        <g key={l.name}>
          <line x1={150 + l.r * 0.7 + (i === 0 ? 14 : 0)} y1={100 + l.r * 0.5} x2="300" y2={l.y + 2} stroke="#7c6a48" strokeDasharray="3 2" />
          <rect x="300" y={l.y - 10} width="14" height="14" fill={l.color} stroke="#78350f" />
          <text x="320" y={l.y + 2} fontSize="14" fontWeight="700" fill="#3b2a14" fontFamily="Georgia, serif">
            {l.name}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As placas tectônicas (de tocar)
// ---------------------------------------------------------------------------

const PLATES = {
  convergente: {
    label: "Se chocam",
    text: "Quando duas placas se chocam, uma pode afundar sob a outra e o chão se dobra: assim nasceram a Cordilheira dos Andes e o Himalaia.",
  },
  divergente: {
    label: "Se afastam",
    text: "Quando as placas se afastam, o magma sobe e forma chão novo. No meio do Oceano Atlântico existe uma cordilheira submarina assim, a Dorsal Mesoatlântica.",
  },
  transformante: {
    label: "Deslizam",
    text: "Quando as placas deslizam lado a lado, elas travam e soltam de repente: é o terremoto. A Falha de San Andreas, nos Estados Unidos, é desse tipo.",
  },
};

export function PlateMotion() {
  const [kind, setKind] = useState<keyof typeof PLATES>("convergente");
  return (
    <Panel title="Como as placas se mexem?">
      <div className="mb-[0.3em] flex justify-center gap-[0.3em]">
        {(Object.keys(PLATES) as (keyof typeof PLATES)[]).map((k) => (
          <Pill key={k} on={kind === k} onClick={() => setKind(k)}>
            {PLATES[k].label}
          </Pill>
        ))}
      </div>
      <svg key={kind} viewBox="0 0 400 130" className="w-full" role="img" aria-label={`Duas placas tectônicas que ${PLATES[kind].label.toLowerCase()}`}>
        <rect width="400" height="130" rx="10" fill="#fed7aa" />
        <rect y="96" width="400" height="34" fill="#f97316" />
        {kind === "convergente" && (
          <>
            <rect x="20" y="70" width="170" height="26" fill="#a16207" stroke="#78350f">
              <animate attributeName="x" values="20;34;20" dur="3s" repeatCount="indefinite" />
            </rect>
            <rect x="210" y="70" width="170" height="26" fill="#ca8a04" stroke="#78350f">
              <animate attributeName="x" values="210;196;210" dur="3s" repeatCount="indefinite" />
            </rect>
            <Mountain x={200} y={72} w={90} h={40} />
            <path d="M120 50 L170 50 M280 50 L230 50" stroke={GEO_DARK} strokeWidth="4" />
            <path d="M162 44 L172 50 L162 56 M238 44 L228 50 L238 56" fill="none" stroke={GEO_DARK} strokeWidth="4" />
          </>
        )}
        {kind === "divergente" && (
          <>
            <rect x="0" y="40" width="400" height="56" fill="#38bdf8" opacity="0.7" />
            <rect x="20" y="70" width="170" height="26" fill="#a16207" stroke="#78350f">
              <animate attributeName="x" values="20;6;20" dur="3s" repeatCount="indefinite" />
            </rect>
            <rect x="210" y="70" width="170" height="26" fill="#ca8a04" stroke="#78350f">
              <animate attributeName="x" values="210;224;210" dur="3s" repeatCount="indefinite" />
            </rect>
            <path d="M200 96 L200 66" stroke="#dc2626" strokeWidth="10" strokeLinecap="round">
              <animate attributeName="stroke-width" values="6;14;6" dur="3s" repeatCount="indefinite" />
            </path>
            <path d="M170 30 L120 30 M230 30 L280 30" stroke={GEO_DARK} strokeWidth="4" />
            <path d="M128 24 L118 30 L128 36 M272 24 L282 30 L272 36" fill="none" stroke={GEO_DARK} strokeWidth="4" />
          </>
        )}
        {kind === "transformante" && (
          <>
            <rect x="20" y="56" width="360" height="20" fill="#a16207" stroke="#78350f">
              <animate attributeName="x" values="20;30;30;20" keyTimes="0;0.45;0.55;1" dur="2s" repeatCount="indefinite" />
            </rect>
            <rect x="20" y="76" width="360" height="20" fill="#ca8a04" stroke="#78350f">
              <animate attributeName="x" values="20;10;10;20" keyTimes="0;0.45;0.55;1" dur="2s" repeatCount="indefinite" />
            </rect>
            {[0, 1, 2].map((k) => (
              <circle key={k} cx="200" cy="76" r="10" fill="none" stroke="#dc2626" strokeWidth="2">
                <animate attributeName="r" values="4;40" dur="2s" begin={`${-k * 0.66}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0" dur="2s" begin={`${-k * 0.66}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </>
        )}
      </svg>
      <p className="mt-[0.3em] text-[0.86em] leading-snug">{PLATES[kind].text}</p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O explorador das formas de relevo (de tocar)
// ---------------------------------------------------------------------------

const RELIEF = {
  montanha: { color: "#78716c", text: "Montanha: uma grande elevação, com picos altos. O ponto mais alto do Brasil é o Pico da Neblina, no Amazonas, com 2.995 m." },
  planalto: { color: "#a16207", text: "Planalto: um terreno alto e mais plano no topo, onde a erosão (o desgaste) é maior que o acúmulo de sedimentos. É a forma que mais aparece no Brasil." },
  depressao: { color: "#ca8a04", text: "Depressão: uma área mais baixa que as terras em volta. Quando fica abaixo do nível do mar, como o Mar Morto, é uma depressão absoluta." },
  planicie: { color: "#65a30d", text: "Planície: uma área plana e baixa, onde os sedimentos se acumulam, trazidos pelos rios. Como a Planície do Pantanal e a Amazônica." },
};

export function ReliefExplorer() {
  const [sel, setSel] = useState<keyof typeof RELIEF>("planalto");
  const pick = (k: keyof typeof RELIEF) => () => setSel(k);
  const stroke = (k: keyof typeof RELIEF) => (sel === k ? "#dc2626" : "#44403c");
  return (
    <Panel title="Toque numa forma de relevo">
      <svg viewBox="0 0 400 150" className="w-full cursor-pointer" role="img" aria-label="Uma paisagem com montanha, planalto, depressão e planície, que se pode tocar">
        <rect width="400" height="150" rx="10" fill="#e0f2fe" />
        <path d="M0 140 L0 60 L40 20 L70 50 L90 30 L120 140 Z" fill={RELIEF.montanha.color} stroke={stroke("montanha")} strokeWidth="3" onClick={pick("montanha")} />
        <path d="M120 140 L120 66 L140 56 L210 56 L226 70 L226 140 Z" fill={RELIEF.planalto.color} stroke={stroke("planalto")} strokeWidth="3" onClick={pick("planalto")} />
        <path d="M226 140 L226 70 Q250 110 280 108 L292 84 L300 140 Z" fill={RELIEF.depressao.color} stroke={stroke("depressao")} strokeWidth="3" onClick={pick("depressao")} />
        <path d="M300 140 L292 84 L320 112 L400 116 L400 140 Z" fill={RELIEF.planicie.color} stroke={stroke("planicie")} strokeWidth="3" onClick={pick("planicie")} />
        <path d="M320 124 Q350 118 400 126" fill="none" stroke="#38bdf8" strokeWidth="5" />
        <Tree x={350} y={114} s={0.3} />
        <Tree x={170} y={56} s={0.3} />
        <path d="M40 20 L48 30 L32 30 Z" fill="#fff" />
      </svg>
      <div className="mt-[0.3em] flex flex-wrap justify-center gap-[0.3em]">
        {(Object.keys(RELIEF) as (keyof typeof RELIEF)[]).map((k) => (
          <Pill key={k} on={sel === k} onClick={pick(k)} color={RELIEF[k].color}>
            {k === "depressao" ? "depressão" : k === "planicie" ? "planície" : k}
          </Pill>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.3em] text-[0.86em] leading-snug">
        {RELIEF[sel].text}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A erosão
// ---------------------------------------------------------------------------

function ErosionArt() {
  return (
    <Art viewBox="0 0 560 170" label="A chuva caindo num morro sem árvores e levando a terra para o rio, e o vento desgastando uma rocha com o tempo">
      <rect width="560" height="170" rx="14" fill="#e0f2fe" />
      <ellipse cx="140" cy="30" rx="70" ry="18" fill="#94a3b8" />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={84 + i * 16} x2={80 + i * 16} y1="44" y2="56" stroke="#2563eb" strokeWidth="2.5">
          <animate attributeName="y1" values="44;100" dur="0.9s" begin={`${-i * 0.12}s`} repeatCount="indefinite" />
          <animate attributeName="y2" values="56;112" dur="0.9s" begin={`${-i * 0.12}s`} repeatCount="indefinite" />
        </line>
      ))}
      <path d="M30 150 L120 70 L220 150 Z" fill="#a16207" />
      {[0, 1, 2].map((k) => (
        <circle key={k} r="4" fill="#78350f">
          <animateMotion path="M140 90 Q190 130 250 148" dur="2.4s" begin={`${-k * 0.8}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <path d="M220 150 Q260 140 300 152" fill="none" stroke="#a16207" strokeWidth="10" opacity="0.8" />
      <path d="M200 156 Q280 146 300 160" fill="none" stroke="#38bdf8" strokeWidth="8" />
      <g transform="translate(430 150)">
        <path d="M-50 0 L-40 -60 Q-10 -80 20 -64 Q46 -40 40 0 Z" fill="#d6d3d1" stroke="#78716c" strokeWidth="2" />
        <path d="M-30 -40 Q0 -36 24 -46" fill="none" stroke="#78716c" />
        {[0, 1, 2].map((k) => (
          <path key={k} d="M-120 -30 Q-90 -40 -60 -30" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round">
            <animateTransform attributeName="transform" type="translate" values={`0 ${k * 14};40 ${k * 14}`} dur="1.6s" begin={`${-k * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0" dur="1.6s" begin={`${-k * 0.5}s`} repeatCount="indefinite" />
          </path>
        ))}
      </g>
      <text x="140" y="166" textAnchor="middle" fontSize="13" fontWeight="900" fill={GEO_DARK} fontFamily="Georgia, serif">
        chuva e rios
      </text>
      <text x="430" y="166" textAnchor="middle" fontSize="13" fontWeight="900" fill={GEO_DARK} fontFamily="Georgia, serif">
        vento
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 3, content, bare });

export const chapter3: BookPage[] = [
  page(
    <ChapterOpener n={3} title="A Terra e o Relevo" goals={["As camadas da Terra", "As placas tectônicas, os vulcões e os terremotos", "Montanhas, planaltos, planícies e depressões", "O relevo do Brasil e a erosão"]}>
      <Fig h={34}>
        <VolcanoOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌍">A Terra por dentro</H>
      <P>
        A Terra tem camadas, como uma cebola. Por fora está a <T>crosta</T>, fina e rochosa, onde vivemos. Embaixo vem o <T>manto</T>, de rocha muito quente e
        pastosa, o <T>magma</T>. No centro fica o <T>núcleo</T>, de ferro e níquel, mais quente que a superfície do Sol.
      </P>
      <Fig n="3.1" caption="As camadas da Terra." h={24}>
        <LayersArt />
      </Fig>
      <Box kind="sabia">
        O buraco mais fundo já cavado pelos seres humanos, na Rússia, chegou a cerca de 12 km. Isso nem chega ao fim da crosta!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧩">As placas tectônicas</H>
      <P>
        A crosta é dividida em grandes pedaços, as <T>placas tectônicas</T>, que flutuam sobre o manto e se mexem alguns centímetros por ano. É nas bordas delas que
        acontecem os <T>terremotos</T>, os <T>vulcões</T> e o nascimento das montanhas.
      </P>
      <PlateMotion />
      <Box kind="lembre">
        O Brasil fica no meio da Placa Sul-Americana, longe das bordas. Por isso aqui quase não há terremotos fortes nem vulcões ativos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⛰️">As formas de relevo</H>
      <P>
        O <T>relevo</T> são as formas da superfície da Terra. Ele é criado pelas forças de dentro (as placas e os vulcões) e modelado pelas forças de fora (a chuva,
        os rios, o vento e as geleiras). Explore as quatro formas principais:
      </P>
      <ReliefExplorer />
    </>,
  ),

  page(
    <>
      <H icon="🏞️">O relevo do Brasil e a erosão</H>
      <P>
        A <T>erosão</T> é o desgaste do relevo pela água, pelo vento e pelo gelo. Sem árvores protegendo o solo, a chuva arrasta a terra para os rios, e eles ficam
        rasos: o <T>assoreamento</T>.
      </P>
      <Fig n="3.2" caption="A erosão pela chuva, pelos rios e pelo vento." h={18}>
        <ErosionArt />
      </Fig>
      <Table
        head={["Relevo", "No Brasil"]}
        rows={[
          ["Planaltos", "A maior parte do país, como o Planalto Central, onde fica Brasília"],
          ["Planícies", "A Amazônica, a do Pantanal e as do litoral"],
          ["Montanhas", "As serras do Mar e da Mantiqueira; o Pico da Neblina (2.995 m)"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A Terra tem três camadas: crosta, manto e núcleo.",
          "A crosta é dividida em placas tectônicas, que se mexem devagar.",
          "Nas bordas das placas acontecem terremotos, vulcões e o nascimento das montanhas.",
          "As formas de relevo são montanha, planalto, planície e depressão.",
          "A erosão desgasta o relevo; no Brasil predominam os planaltos.",
        ]}
      />
      <Glossary
        items={[
          ["Crosta", "A camada de fora da Terra, onde vivemos."],
          ["Magma", "Rocha derretida de dentro da Terra; ao sair do vulcão, vira lava."],
          ["Placa tectônica", "Um dos grandes pedaços em que a crosta é dividida."],
          ["Planície", "Área plana e baixa onde os sedimentos se acumulam."],
          ["Erosão", "O desgaste do relevo pela água, pelo vento e pelo gelo."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a camada da Terra onde vivemos?", "A crosta."],
          ["Por que o Brasil quase não tem terremotos?", "Porque fica no meio da Placa Sul-Americana, longe das bordas."],
          ["Qual forma de relevo é plana e baixa, onde os sedimentos se acumulam?", "A planície."],
          ["Qual é o ponto mais alto do Brasil?", "O Pico da Neblina, com 2.995 m."],
        ]}
      />
    </>,
  ),
];
