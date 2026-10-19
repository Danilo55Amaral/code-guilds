"use client";

import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Caravel } from "./art";

// ============================================================================
// CAPÍTULO 8 — RENASCIMENTO, NAVEGAÇÕES E REFORMAS (missões "Idade Média e
// Grandes Navegações", "Brasil Colônia e Império" (a parte da colônia) e
// "Reforma Protestante e Absolutismo"): as caravelas com a rosa dos ventos,
// a prensa de Gutenberg imprimindo, o mapa das rotas de Colombo, Vasco da
// Gama e Cabral, e a porta da igreja com as 95 teses de Lutero.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: as caravelas e a rosa dos ventos
// ---------------------------------------------------------------------------

function NavigationOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Duas caravelas portuguesas navegando no oceano e uma grande rosa dos ventos girando no céu">
      <rect width="460" height="300" fill="#bfdbfe" />
      <rect y="170" width="460" height="130" fill="#1d4ed8" />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${i * 80} ${200 + (i % 2) * 30} q20 -8 40 0 t40 0`} stroke="#93c5fd" strokeWidth="3" fill="none" className="cg-anim-dash" />
      ))}
      {/* a rosa dos ventos */}
      <g transform="translate(350 80)">
        <g>
          <animateTransform attributeName="transform" type="rotate" values="-10;10;-10" dur="6s" repeatCount="indefinite" />
          <circle r="54" fill="#fef3c7" stroke="#a16207" strokeWidth="3" />
          {[0, 90, 180, 270].map((a) => (
            <path key={a} d="M0 -50 L9 0 L0 8 L-9 0 Z" fill={a === 0 ? "#dc2626" : "#1e293b"} transform={`rotate(${a})`} />
          ))}
          {[45, 135, 225, 315].map((a) => (
            <path key={a} d="M0 -32 L6 0 L-6 0 Z" fill="#a16207" transform={`rotate(${a})`} />
          ))}
          <text y="-36" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
            N
          </text>
        </g>
      </g>
      <g>
        <animateTransform attributeName="transform" type="translate" values="-40 0;60 0;-40 0" dur="10s" repeatCount="indefinite" />
        <Caravel x={120} y={200} s={1.1} />
      </g>
      <Caravel x={250} y={240} s={0.7} />
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A prensa de Gutenberg
// ---------------------------------------------------------------------------

function PressArt() {
  return (
    <Art viewBox="0 0 560 200" label="A prensa de Gutenberg descendo e imprimindo uma página, que sai e vai para a pilha de folhas impressas">
      <rect width="560" height="200" rx="14" fill="#fef3c7" />
      {/* a prensa */}
      <g transform="translate(180 0)">
        <rect x="-70" y="20" width="16" height="160" fill="#78350f" />
        <rect x="54" y="20" width="16" height="160" fill="#78350f" />
        <rect x="-70" y="20" width="140" height="18" fill="#92400e" />
        <rect x="-6" y="38" width="12" height="40" fill="#a16207">
          <animate attributeName="height" values="40;72;40;40" keyTimes="0;0.3;0.5;1" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="-44" y="78" width="88" height="14" fill="#57534e">
          <animate attributeName="y" values="78;110;78;78" keyTimes="0;0.3;0.5;1" dur="3s" repeatCount="indefinite" />
        </rect>
        <rect x="-54" y="130" width="108" height="14" fill="#44403c" />
        <rect x="-44" y="124" width="88" height="6" fill="#fff" />
        <path d="M70 60 L110 40" stroke="#78350f" strokeWidth="6" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" values="0 70 60;-30 70 60;0 70 60;0 70 60" keyTimes="0;0.3;0.5;1" dur="3s" repeatCount="indefinite" />
        </path>
      </g>
      {/* a página saindo pra pilha */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;200 20;200 20" keyTimes="0;0.5;0.8;1" dur="3s" repeatCount="indefinite" />
        <rect x="150" y="120" width="60" height="8" fill="#fff" stroke="#d6b77a" />
      </g>
      <g transform="translate(380 150)">
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x="-30" y={-i * 5} width="60" height="5" fill="#fff" stroke="#d6b77a" />
        ))}
      </g>
      <g fontFamily="Georgia, serif" fontWeight="900">
        <text x="440" y="70" fontSize="14" fill="#78350f">Gutenberg</text>
        <text x="440" y="90" fontSize="12" fill="#92400e">por volta de 1450</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As rotas das navegações
// ---------------------------------------------------------------------------

function RoutesArt() {
  const routes = [
    { name: "Colombo, 1492", color: "#dc2626", d: "M330 70 Q240 60 150 90" },
    { name: "Vasco da Gama, 1498", color: "#16a34a", d: "M330 70 Q300 140 360 200 Q420 220 470 150" },
    { name: "Cabral, 1500", color: "#2563eb", d: "M330 70 Q290 120 200 150" },
  ];
  return (
    <Art viewBox="0 0 560 230" label="Um mapa simplificado do oceano Atlântico com as rotas das caravelas: Colombo da Espanha até o Caribe em 1492, Vasco da Gama de Portugal à Índia em 1498 e Cabral de Portugal ao Brasil em 1500">
      <rect width="560" height="230" rx="14" fill="#7dd3fc" />
      {/* os continentes simplificados */}
      <path d="M80 30 Q140 20 160 60 Q150 100 130 120 L180 130 Q230 150 220 200 Q200 230 170 230 L120 230 Q130 180 110 150 Q60 120 70 70 Z" fill="#86efac" stroke="#15803d" />
      <path d="M310 20 L380 20 Q400 50 360 70 Q340 80 320 70 Z" fill="#86efac" stroke="#15803d" />
      <path d="M330 90 Q380 80 410 110 Q420 170 380 210 Q350 200 340 160 Q320 120 330 90 Z" fill="#86efac" stroke="#15803d" />
      <path d="M440 50 Q520 40 540 90 Q520 140 480 150 Q450 120 440 50 Z" fill="#86efac" stroke="#15803d" />
      {/* a linha de Tordesilhas */}
      <path d="M250 10 L250 220" stroke="#7c3aed" strokeWidth="2" strokeDasharray="6 5" />
      <text x="254" y="22" fontSize="10.5" fontWeight="900" fill="#5b21b6" fontFamily="Georgia, serif">
        Tordesilhas (1494)
      </text>
      {/* a legenda, no canto livre do mar */}
      <rect x="420" y="164" width="134" height="58" rx="8" fill="#f0f9ff" opacity="0.85" />
      {routes.map((r, i) => (
        <g key={r.name}>
          <path d={r.d} stroke={r.color} strokeWidth="3" fill="none" strokeDasharray="8 6" />
          <circle r="6" fill={r.color} stroke="#fff" strokeWidth="2">
            <animateMotion path={r.d} dur={`${4 + i}s`} repeatCount="indefinite" />
          </circle>
          <text x="428" y={212 - i * 18} fontSize="10.5" fontWeight="900" fill={r.color} fontFamily="Georgia, serif">
            ● {r.name}
          </text>
        </g>
      ))}
      <g fontFamily="Georgia, serif" fontSize="11" fontWeight="900" fill="#14532d">
        <text x="330" y="44">Europa</text>
        <text x="350" y="140">África</text>
        <text x="470" y="96">Índia</text>
        <text x="150" y="190">Brasil</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A porta com as 95 teses
// ---------------------------------------------------------------------------

function ThesesArt() {
  return (
    <Art viewBox="0 0 560 200" label="A porta de madeira de uma igreja e uma folha com as 95 teses de Lutero sendo pregada nela com um martelo">
      <rect width="560" height="200" rx="14" fill="#e7e5e4" />
      <path d="M180 200 L180 60 Q280 0 380 60 L380 200 Z" fill="#78350f" stroke="#451a03" strokeWidth="3" />
      <path d="M280 30 L280 200" stroke="#451a03" strokeWidth="3" />
      {[90, 130, 170].map((y) => (
        <path key={y} d={`M186 ${y} L374 ${y}`} stroke="#451a03" strokeWidth="2" />
      ))}
      <g className="cg-anim-pop">
        <rect x="210" y="80" width="56" height="74" fill="#fef3c7" stroke="#a16207" />
        <text x="238" y="102" textAnchor="middle" fontSize="11" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
          95
        </text>
        <text x="238" y="116" textAnchor="middle" fontSize="9" fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
          teses
        </text>
        {[126, 134, 142].map((y) => (
          <line key={y} x1="218" y1={y} x2="258" y2={y} stroke="#c8a96a" strokeWidth="2" />
        ))}
      </g>
      {/* o martelo batendo */}
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-30 300 120;0 300 120;-30 300 120" dur="1s" repeatCount="indefinite" />
        <path d="M300 120 L340 150" stroke="#92400e" strokeWidth="6" strokeLinecap="round" />
        <rect x="262" y="76" width="22" height="14" fill="#57534e" transform="rotate(35 273 83)" />
      </g>
      <text x="460" y="90" textAnchor="middle" fontSize="14" fontWeight="900" fill="#44403c" fontFamily="Georgia, serif">
        Wittenberg,
      </text>
      <text x="460" y="110" textAnchor="middle" fontSize="14" fontWeight="900" fill="#44403c" fontFamily="Georgia, serif">
        1517
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
      title="Renascimento, Navegações e Reformas"
      goals={["O Renascimento e a imprensa de Gutenberg", "As Grandes Navegações e a chegada ao Brasil", "O Brasil colônia: pau-brasil, açúcar, Palmares e ouro", "A Reforma Protestante e a Contrarreforma"]}
    >
      <Fig h={34}>
        <NavigationOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🎨">O Renascimento</H>
      <P>
        O <T>Renascimento</T> (séculos XIV a XVI), que começou na Itália, valorizou o ser humano, a razão e a arte da Antiguidade clássica. Seus grandes artistas foram{" "}
        <T>Leonardo da Vinci</T>, autor da <em>Mona Lisa</em>, e <T>Michelangelo</T>, que pintou o teto da Capela Sistina.
      </P>
      <Fig n="8.1" caption="A prensa de tipos móveis imprimia livros muito mais rápido." h={20}>
        <PressArt />
      </Fig>
      <Box kind="sabia">
        Por volta de <strong>1450</strong>, <strong>Gutenberg</strong> criou a prensa de tipos móveis. Os livros ficaram mais rápidos e baratos de fazer, e o
        conhecimento se espalhou pela Europa.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⛵">As Grandes Navegações</H>
      <P>
        Portugal e Espanha lançaram caravelas pelo oceano em busca de especiarias e ouro. Em <T>1492</T>, <T>Colombo</T> chegou à América querendo chegar às Índias. Em{" "}
        <T>1498</T>, <T>Vasco da Gama</T> chegou à Índia por mar. E em <T>22 de abril de 1500</T>, <T>Pedro Álvares Cabral</T> chegou ao litoral da atual Bahia.
      </P>
      <Fig n="8.2" caption="As rotas das navegações e a linha de Tordesilhas." h={22}>
        <RoutesArt />
      </Fig>
      <Box kind="lembre">
        O <strong>Tratado de Tordesilhas</strong> (1494) dividiu as terras entre Portugal (a leste da linha) e Espanha (a oeste). Mas as terras já tinham donos: milhões
        de indígenas, de centenas de povos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🌳">O Brasil colônia</H>
      <Table
        head={["Período", "O que acontecia"]}
        rows={[
          ["Século XVI", "Os portugueses exploram o pau-brasil, de tinta vermelha, que deu nome ao país"],
          ["Séculos XVI e XVII", "O açúcar é produzido nos engenhos do Nordeste com o trabalho de africanos escravizados"],
          ["Século XVII", "O Quilombo dos Palmares resiste por quase cem anos na Serra da Barriga"],
          ["Século XVIII", "A descoberta de ouro em Minas Gerais faz crescer Vila Rica (Ouro Preto)"],
        ]}
      />
      <Box kind="sabia">
        <strong>Zumbi dos Palmares</strong> morreu em <strong>20 de novembro de 1695</strong>. Hoje essa data é o <strong>Dia da Consciência Negra</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="📜">A Reforma Protestante</H>
      <P>
        Em <T>1517</T>, o monge <T>Martinho Lutero</T> publicou as <T>95 Teses</T>, criticando a venda de <T>indulgências</T> (o perdão dos pecados em troca de dinheiro)
        pela Igreja Católica. Começava a <T>Reforma Protestante</T>.
      </P>
      <Fig n="8.3" caption="As 95 teses de Lutero, segundo a tradição, pregadas na porta da igreja." h={19}>
        <ThesesArt />
      </Fig>
      <Cards
        items={[
          { icon: "📖", title: "Calvino", text: "Defendia a predestinação; influenciou a Suíça e a Holanda." },
          { icon: "👑", title: "Henrique VIII", text: "Rompeu com o papa e criou a Igreja Anglicana, na Inglaterra." },
          { icon: "⛪", title: "Contrarreforma", text: "A Igreja Católica reagiu com o Concílio de Trento e os jesuítas." },
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O Renascimento valorizou o ser humano e a razão; Gutenberg criou a prensa por volta de 1450.",
          "Colombo chegou à América em 1492; Vasco da Gama, à Índia em 1498; Cabral, ao Brasil em 1500.",
          "O Tratado de Tordesilhas (1494) dividiu as terras entre Portugal e Espanha.",
          "No Brasil colônia: pau-brasil, açúcar com trabalho escravizado, Palmares e o ouro de Minas.",
          "Lutero iniciou a Reforma Protestante em 1517; a Igreja respondeu com a Contrarreforma.",
        ]}
      />
      <Glossary
        items={[
          ["Renascimento", "Movimento cultural que valorizou o ser humano e a razão."],
          ["Caravela", "Navio usado nas Grandes Navegações."],
          ["Engenho", "Fazenda e fábrica de açúcar do Brasil colônia."],
          ["Quilombo", "Comunidade de pessoas que fugiram da escravidão."],
          ["Indulgência", "O perdão dos pecados vendido pela Igreja."],
        ]}
      />
      <Quiz
        items={[
          ["Quem comandou a frota que chegou ao Brasil em 1500?", "Pedro Álvares Cabral."],
          ["O que foi o Tratado de Tordesilhas?", "O acordo de 1494 que dividiu as terras entre Portugal e Espanha."],
          ["O que foi o Quilombo dos Palmares?", "Uma grande comunidade de pessoas que fugiram da escravidão, na Serra da Barriga."],
          ["Quem iniciou a Reforma Protestante?", "Martinho Lutero, com as 95 Teses, em 1517."],
        ]}
      />
    </>,
  ),
];
