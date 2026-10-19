"use client";

import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Balloon, ChoiceGame } from "./art";

// ============================================================================
// CAPÍTULO 7 — GÊNEROS TEXTUAIS E LEITURA (missões "Gêneros Textuais" e
// "Coesão e Interpretação", a parte da leitura): o jornal, a receita, o
// poema e a tirinha flutuando, o jogo de descobrir o gênero, a notícia por
// dentro (manchete, lide e corpo) e os balões da mandioca, do aipim e da
// macaxeira.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: os gêneros flutuando
// ---------------------------------------------------------------------------

function GenresOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um jornal, uma receita, um poema e uma tirinha de quadrinhos flutuando no ar">
      <rect width="460" height="300" fill="#f8fafc" />
      {/* o jornal */}
      <g className="cg-anim-float">
        <rect x="30" y="30" width="160" height="110" fill="#fff" stroke="#475569" strokeWidth="2" />
        <rect x="40" y="40" width="140" height="18" fill="#1e293b" />
        <text x="110" y="53" textAnchor="middle" fontSize="10.5" fontWeight="900" fill="#fff" fontFamily="Georgia, serif">
          Jornal da Academia
        </text>
        <rect x="40" y="64" width="62" height="40" fill="#cbd5e1" />
        {[66, 76, 86, 96, 112, 122].map((y) => (
          <line key={y} x1={y < 106 ? 108 : 40} y1={y} x2="180" y2={y} stroke="#94a3b8" strokeWidth="3" />
        ))}
      </g>
      {/* a receita */}
      <g className="cg-anim-float" style={{ animationDelay: "-1s" }}>
        <rect x="260" y="24" width="160" height="120" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
        <text x="340" y="48" textAnchor="middle" fontSize="13" fontWeight="900" fill="#92400e" fontFamily="Georgia, serif">
          Bolo de cenoura
        </text>
        <text x="274" y="70" fontSize="10.5" fill="#78350f" fontFamily="Georgia, serif">
          • 3 cenouras • 2 ovos
        </text>
        <text x="274" y="88" fontSize="10.5" fill="#78350f" fontFamily="Georgia, serif">
          Modo de preparo:
        </text>
        <text x="274" y="106" fontSize="10.5" fill="#78350f" fontFamily="Georgia, serif">
          bata, misture e asse.
        </text>
        <text x="390" y="132" fontSize="20">
          🥕
        </text>
      </g>
      {/* o poema */}
      <g className="cg-anim-float" style={{ animationDelay: "-2s" }}>
        <rect x="40" y="170" width="150" height="110" rx="6" fill="#fdf4ff" stroke="#a21caf" strokeWidth="2" />
        {["Minha terra tem", "palmeiras, onde", "canta o sabiá..."].map((l, i) => (
          <text key={l} x="115" y={202 + i * 20} textAnchor="middle" fontSize="12" fontStyle="italic" fill="#701a75" fontFamily="Georgia, serif">
            {l}
          </text>
        ))}
      </g>
      {/* a tirinha */}
      <g className="cg-anim-float" style={{ animationDelay: "-3s" }}>
        <rect x="230" y="180" width="210" height="90" fill="#fff" stroke="#1e293b" strokeWidth="2" />
        <line x1="300" y1="180" x2="300" y2="270" stroke="#1e293b" strokeWidth="2" />
        <line x1="370" y1="180" x2="370" y2="270" stroke="#1e293b" strokeWidth="2" />
        {[265, 335, 405].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy="240" r="12" fill="#fde68a" stroke="#1e293b" />
            <rect x={x - 26} y="190" width="52" height="22" rx="10" fill="#fff" stroke="#1e293b" />
            <text x={x} y="205" textAnchor="middle" fontSize="11" fontWeight="900" fill="#1e293b" fontFamily="Georgia, serif">
              {["Oi!", "Hã?", "Haha!"][i]}
            </text>
          </g>
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O jogo de descobrir o gênero
// ---------------------------------------------------------------------------

const GENRE_GAME = [
  { prompt: "“Ingredientes: 2 xícaras de farinha, 3 ovos. Modo de preparo: misture tudo e leve ao forno.”", options: ["Notícia", "Receita", "Crônica"], answer: 1, explain: "Texto instrucional, com verbos no imperativo: misture, leve." },
  { prompt: "“A raposa não alcançou as uvas e disse: ‘Estão verdes!’ Moral: quem desdenha quer comprar.”", options: ["Fábula", "Biografia", "Anúncio"], answer: 0, explain: "Animais que agem como gente e uma moral no final: fábula." },
  { prompt: "“Prefeitura inaugura escola nova nesta segunda. A obra atende 600 alunos do bairro...”", options: ["Poema", "Notícia", "Requerimento"], answer: 1, explain: "Informa um fato recente: o quê, quem, quando, onde." },
  { prompt: "“Compre já! O tênis que faz você voar. Só hoje, pela metade do preço!”", options: ["Anúncio publicitário", "Artigo de opinião", "Fábula"], answer: 0, explain: "Quer convencer o leitor a comprar, com frases de efeito." },
  { prompt: "“Eu nasci em 2012, numa cidade pequena do interior. Minha primeira lembrança é...”", options: ["Biografia", "Autobiografia", "Notícia"], answer: 1, explain: "A própria pessoa conta a sua vida: autobiografia." },
];

// ---------------------------------------------------------------------------
// A notícia por dentro
// ---------------------------------------------------------------------------

function NewsAnatomyArt() {
  return (
    <Art viewBox="0 0 560 220" label="Uma notícia com as partes marcadas: a manchete em cima, o lide com o resumo no primeiro parágrafo e o corpo do texto com os detalhes">
      <rect width="560" height="220" rx="14" fill="#f1f5f9" />
      <rect x="30" y="20" width="300" height="186" fill="#fff" stroke="#475569" strokeWidth="2" />
      {/* a manchete */}
      <rect x="44" y="32" width="272" height="26" fill="#fde68a">
        <animate attributeName="opacity" values="1;1;0.35;0.35;0.35;1" keyTimes="0;0.3;0.33;0.63;0.95;1" dur="6s" repeatCount="indefinite" />
      </rect>
      <text x="180" y="51" textAnchor="middle" fontSize="15" fontWeight="900" fill="#1e293b" fontFamily="Georgia, serif">
        Alunos plantam 100 árvores
      </text>
      {/* o lide */}
      <rect x="44" y="66" width="272" height="44" fill="#bfdbfe" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.35;1;1;0.35;0.35" keyTimes="0;0.3;0.33;0.63;0.66;1" dur="6s" repeatCount="indefinite" />
      </rect>
      <text x="52" y="84" fontSize="11" fill="#1e3a8a" fontFamily="Georgia, serif">
        Nesta sexta, alunos da Escola Sol
      </text>
      <text x="52" y="100" fontSize="11" fill="#1e3a8a" fontFamily="Georgia, serif">
        plantaram 100 árvores na praça...
      </text>
      {/* o corpo */}
      <rect x="44" y="118" width="272" height="78" fill="#bbf7d0" opacity="0.35">
        <animate attributeName="opacity" values="0.35;0.35;0.35;1;1;0.35" keyTimes="0;0.63;0.66;0.69;0.95;1" dur="6s" repeatCount="indefinite" />
      </rect>
      {[132, 148, 164, 180].map((y) => (
        <line key={y} x1="52" y1={y} x2="306" y2={y} stroke="#94a3b8" strokeWidth="3" />
      ))}
      <g fontFamily="Georgia, serif" fontWeight="900" fontSize="13">
        <text x="350" y="50" fill="#a16207">manchete: o título</text>
        <text x="350" y="86" fill="#1d4ed8">lide: o resumo, com</text>
        <text x="350" y="104" fill="#1d4ed8">o quê, quem, quando,</text>
        <text x="350" y="122" fill="#1d4ed8">onde, como e por quê</text>
        <text x="350" y="164" fill="#15803d">corpo: os detalhes</text>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Mandioca, aipim e macaxeira
// ---------------------------------------------------------------------------

function VariationArt() {
  return (
    <Art viewBox="0 0 560 210" label="Três balões de fala de pessoas de regiões diferentes do Brasil chamando o mesmo alimento de mandioca, aipim e macaxeira">
      <rect width="560" height="210" rx="14" fill="#fefce8" />
      <Balloon x={30} y={30} w={150} h={50} text="mandioca" color="#dcfce7" />
      <Balloon x={205} y={70} w={150} h={50} text="aipim" color="#dbeafe" />
      <Balloon x={380} y={30} w={150} h={50} text="macaxeira" color="#fce7f3" />
      {/* a raiz no meio */}
      <g transform="translate(280 175)">
        <g className="cg-anim-float">
          <path d="M-70 0 Q-40 -26 0 -18 Q40 -10 70 -24 Q60 6 0 8 Q-50 10 -70 0 Z" fill="#a16207" stroke="#78350f" strokeWidth="2" />
          <path d="M-40 -6 Q0 -2 40 -14" stroke="#fef3c7" strokeWidth="2" fill="none" />
        </g>
      </g>
      <g fontFamily="Georgia, serif" fontSize="11.5" fontWeight="900" fill="#78350f" textAnchor="middle">
        <text x="105" y="120">Sudeste</text>
        <text x="280" y="140">Sul e Rio</text>
        <text x="455" y="120">Nordeste e Norte</text>
      </g>
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
      title="Gêneros Textuais e Leitura"
      goals={["Os principais gêneros textuais e para que servem", "As partes de uma notícia", "O que é fazer uma inferência", "A variação linguística e o registro formal"]}
    >
      <Fig h={34}>
        <GenresOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="📰">Os gêneros textuais</H>
      <P>Cada texto tem um jeito e um objetivo. Esses “modelos” de texto que usamos no dia a dia são os <T>gêneros textuais</T>.</P>
      <Table
        head={["Gênero", "Para que serve"]}
        rows={[
          ["Notícia", "Informar um fato recente"],
          ["Receita", "Ensinar a fazer algo (instruções)"],
          ["Fábula", "Contar uma história com animais e uma moral"],
          ["Crônica", "Contar um fato do dia a dia, muitas vezes com humor"],
          ["Poema", "Expressar emoções, em versos e estrofes"],
          ["Anúncio", "Convencer a comprar ou aderir a uma ideia"],
          ["Artigo de opinião", "Defender uma opinião com argumentos"],
          ["Tirinha", "Contar uma piada em poucos quadrinhos"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🕵️">Que gênero é este?</H>
      <P>Leia cada trecho e descubra o gênero:</P>
      <ChoiceGame items={GENRE_GAME} color="#0284c7" title="O detetive dos gêneros" />
      <Box kind="sabia">
        Rubem Braga, Luis Fernando Verissimo e Fernando Sabino são grandes cronistas brasileiros. E cada linha de um poema se chama <strong>verso</strong>; um grupo de
        versos é uma <strong>estrofe</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🗞️">A notícia por dentro</H>
      <P>
        A notícia começa pela <T>manchete</T>. O primeiro parágrafo, o <T>lide</T>, resume o fato respondendo: o quê, quem, quando, onde, como e por quê. Depois vem o{" "}
        <T>corpo</T>, com os detalhes.
      </P>
      <Fig n="7.1" caption="As partes de uma notícia." h={21}>
        <NewsAnatomyArt />
      </Fig>
      <Box kind="mago" title="Ler nas entrelinhas">
        Fazer uma <strong>inferência</strong> é concluir algo que não está escrito, pelas pistas do texto. Se alguém chega molhado e fecha o guarda-chuva, inferimos que
        estava chovendo.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🗣️">Variação linguística</H>
      <P>
        A <T>variação linguística</T> são os diferentes jeitos de falar a mesma língua, conforme a região, a idade, o grupo e a situação. O mesmo alimento tem nomes
        diferentes pelo Brasil:
      </P>
      <Fig n="7.2" caption="Mandioca, aipim e macaxeira: a mesma raiz." h={20}>
        <VariationArt />
      </Fig>
      <Box kind="lembre">
        Nenhuma variedade é “errada”: cada situação pede um <strong>registro adequado</strong>. Com os amigos, linguagem informal; numa entrevista de emprego ou na
        redação do Enem, a formal.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Gêneros textuais são modelos de texto com um objetivo: notícia, receita, fábula, crônica, poema, anúncio...",
          "A notícia tem manchete, lide (o resumo) e corpo.",
          "A receita é instrucional, com verbos no imperativo; a fábula tem moral.",
          "Inferir é concluir algo que não está escrito, pelas pistas do texto.",
          "Variação linguística: o mesmo idioma muda com a região e a situação; o registro deve ser adequado.",
        ]}
      />
      <Glossary
        items={[
          ["Gênero textual", "Modelo de texto com uma função social."],
          ["Lide", "O primeiro parágrafo da notícia, com o resumo."],
          ["Inferência", "Conclusão tirada das pistas do texto."],
          ["Variação linguística", "Os diferentes jeitos de falar a mesma língua."],
          ["Registro formal", "A linguagem cuidada de situações sérias."],
        ]}
      />
      <Quiz
        items={[
          ["Qual gênero informa um fato recente?", "A notícia."],
          ["Como se chama cada linha de um poema?", "Verso."],
          ["Qual é a diferença entre biografia e autobiografia?", "Na biografia outra pessoa conta a vida; na autobiografia, a própria pessoa."],
          ["“Mandioca”, “aipim” e “macaxeira” são exemplo de quê?", "Variação linguística (regional)."],
        ]}
      />
    </>,
  ),
];
