"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { ChoiceGame } from "../portugues/art";
import { Code, Console, type Lang, PROG, PROG_DARK, Panel, Pill } from "./art";

// ============================================================================
// CAPÍTULO 2 — COMO AS LINGUAGENS FUNCIONAM (missões "Linguagens de
// Programação" e "Linguagens de Programação parte 2"): os balões com o "olá"
// de cada linguagem virando zeros e uns, o compilador e o interpretador lado a
// lado, o "Olá, mundo!" em cada linguagem (de tocar), a linguagem certa para
// cada projeto (de tocar) e o jogo dos tipos de erro.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: as linguagens virando 0 e 1
// ---------------------------------------------------------------------------

function BabelOpenerArt() {
  const bubbles = [
    { x: 80, y: 60, t: "print()", c: "#2563eb" },
    { x: 380, y: 60, t: "console.log()", c: "#ca8a04" },
    { x: 70, y: 200, t: "System.out", c: "#dc2626" },
    { x: 390, y: 200, t: "<h1>", c: "#ea580c" },
  ];
  return (
    <Art viewBox="0 0 460 300" label="Balões com o jeito de cada linguagem escrever na tela, como print, console.log, System.out e a tag h1, indo para um tradutor no meio que solta zeros e uns para o computador">
      <rect width="460" height="300" fill="#ede9fe" />
      {bubbles.map((b, i) => (
        <g key={b.t}>
          <rect x={b.x - 62} y={b.y - 18} width="124" height="34" rx="12" fill="#fff" stroke={b.c} strokeWidth="3" />
          <text x={b.x} y={b.y + 5} textAnchor="middle" fontSize="15" fontWeight="900" fontFamily="monospace" fill={b.c}>
            {b.t}
          </text>
          <circle r="5" fill={b.c}>
            <animateMotion path={`M${b.x} ${b.y} L230 140`} dur="2s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      <g transform="translate(230 140)">
        <circle r="40" fill={PROG} />
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="-6" y="-52" width="12" height="14" fill={PROG} transform={`rotate(${i * 45})`} />
          ))}
        </g>
        <circle r="18" fill="#ede9fe" />
      </g>
      <rect x="150" y="234" width="160" height="40" rx="8" fill="#1e1b4b" />
      <text x="230" y="260" textAnchor="middle" fontSize="16" fontFamily="monospace" fontWeight="900" fill="#86efac">
        01001111 01101001
        <animate attributeName="opacity" values="1;0.4;1" dur="1s" repeatCount="indefinite" />
      </text>
      <path d="M230 182 L230 232" stroke={PROG} strokeWidth="4" strokeDasharray="6 4">
        <animate attributeName="stroke-dashoffset" values="20;0" dur="0.8s" repeatCount="indefinite" />
      </path>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O compilador e o interpretador
// ---------------------------------------------------------------------------

function TranslatorArt() {
  return (
    <Art viewBox="0 0 560 190" label="Em cima, o compilador traduz o livro inteiro de uma vez e só depois o computador executa; embaixo, o interpretador traduz e executa uma linha de cada vez">
      <rect width="560" height="190" rx="14" fill="#fffaf0" />
      <text x="20" y="28" fontSize="14" fontWeight="900" fill={PROG_DARK} fontFamily="Georgia, serif">
        Compilador: traduz tudo antes
      </text>
      <rect x="20" y="40" width="70" height="44" rx="4" fill="#ddd6fe" stroke={PROG} />
      <text x="55" y="66" textAnchor="middle" fontSize="11" fontWeight="900" fill={PROG_DARK}>código</text>
      <rect x="140" y="40" width="90" height="44" rx="8" fill={PROG} />
      <text x="185" y="66" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">compilador</text>
      <rect x="280" y="40" width="90" height="44" rx="4" fill="#1e1b4b" />
      <text x="325" y="66" textAnchor="middle" fontSize="11" fontWeight="900" fill="#86efac">programa .exe</text>
      <text x="460" y="66" textAnchor="middle" fontSize="24">▶️</text>
      {[0, 1].map((k) => (
        <rect key={k} width="16" height="12" rx="2" fill={PROG}>
          <animateMotion path="M92 56 L138 56 M232 56 L278 56 M372 56 L436 56" dur="3s" begin={`${-k * 1.5}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <text x="20" y="122" fontSize="14" fontWeight="900" fill="#b45309" fontFamily="Georgia, serif">
        Interpretador: traduz e executa linha por linha
      </text>
      {[0, 1, 2, 3].map((k) => (
        <g key={k}>
          <rect x={20 + k * 130} y="136" width="100" height="36" rx="6" fill="#fef3c7" stroke="#b45309">
            <animate attributeName="fill" values="#fef3c7;#fde68a;#fef3c7;#fef3c7" keyTimes={`0;${(k * 0.25).toFixed(2)};${(k * 0.25 + 0.2).toFixed(2)};1`} dur="4s" repeatCount="indefinite" />
          </rect>
          <text x={70 + k * 130} y="159" textAnchor="middle" fontSize="11" fontWeight="900" fill="#78350f">
            linha {k + 1} ✔
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O "Olá, mundo!" em cada linguagem (de tocar)
// ---------------------------------------------------------------------------

const HELLO: { lang: Lang; name: string; code: string }[] = [
  { lang: "python", name: "Python", code: 'print("Olá, mundo!")' },
  { lang: "js", name: "JavaScript", code: 'console.log("Olá, mundo!");' },
  { lang: "lua", name: "Lua", code: 'print("Olá, mundo!")' },
  {
    lang: "java",
    name: "Java",
    code: 'public class Ola {\n  public static void main(String[] args) {\n    System.out.println("Olá, mundo!");\n  }\n}',
  },
  { lang: "html", name: "HTML", code: "<h1>Olá, mundo!</h1>" },
];

export function HelloLangs() {
  const [sel, setSel] = useState(0);
  const h = HELLO[sel];
  return (
    <Panel title="O primeiro programa de todo mundo">
      <div className="mb-[0.2em] flex flex-wrap justify-center gap-[0.25em]">
        {HELLO.map((x, i) => (
          <Pill key={x.name} on={sel === i} onClick={() => setSel(i)}>
            {x.name}
          </Pill>
        ))}
      </div>
      <Code key={sel} code={h.code} lang={h.lang} />
      <Console lines={["Olá, mundo!"]} title={h.lang === "html" ? "Página" : "Saída"} />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A linguagem certa para cada projeto (de tocar)
// ---------------------------------------------------------------------------

const PROJECTS = [
  { want: "🌐 um site", langs: "HTML (estrutura), CSS (estilo) e JavaScript (ação)" },
  { want: "🧱 um jogo no Roblox", langs: "Lua (a versão do Roblox se chama Luau)" },
  { want: "🤖 inteligência artificial", langs: "Python, com bibliotecas de IA e de dados" },
  { want: "📱 um app de Android", langs: "Kotlin e Java (ou o App Inventor, com blocos)" },
  { want: "🗄️ guardar dados", langs: "SQL, a linguagem dos bancos de dados" },
  { want: "🎮 um jogo 3D pesado", langs: "C++ ou C#, nos motores de jogos" },
];

export function LanguagePicker() {
  const [sel, setSel] = useState(0);
  return (
    <Panel title="Eu quero fazer...">
      <div className="grid grid-cols-3 gap-[0.25em]">
        {PROJECTS.map((p, i) => (
          <Pill key={p.want} on={sel === i} onClick={() => setSel(i)}>
            {p.want}
          </Pill>
        ))}
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.4em] rounded-lg px-[0.6em] py-[0.3em] text-[0.88em]" style={{ background: "#ede9fe", borderLeft: `5px solid ${PROG}` }}>
        👉 <strong style={{ color: PROG_DARK }}>{PROJECTS[sel].langs}</strong>
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Os tipos de erro
// ---------------------------------------------------------------------------

const ERROR_TYPES = ["De sintaxe", "De execução", "De lógica"];
const ERROR_GAME = [
  { prompt: <Code lang="python" code={'print("Olá"'} />, options: ERROR_TYPES, answer: 0, explain: "Faltou fechar o parêntese: a linguagem nem entende a frase. É erro de sintaxe." },
  { prompt: <Code lang="python" code={"idade = 12\nprint(idade / 0)"} />, options: ERROR_TYPES, answer: 1, explain: "A frase está certa, mas dividir por zero quebra na hora de executar: erro de execução." },
  { prompt: <Code lang="js" code={"// a média de 8 e 6\nlet media = 8 + 6 / 2;"} />, options: ERROR_TYPES, answer: 2, explain: "O programa roda, mas dá 11 em vez de 7: faltaram os parênteses, (8 + 6) / 2. Erro de lógica." },
];

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 2, content, bare });

export const chapter2: BookPage[] = [
  page(
    <ChapterOpener n={2} title="Como as Linguagens Funcionam" goals={["Por que existem linguagens de programação", "Compiladores e interpretadores", "A linguagem certa para cada projeto", "Nomes, comentários e os tipos de erro"]}>
      <Fig h={34}>
        <BabelOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🧩">Da nossa língua para a máquina</H>
      <P>
        O processador só entende <T>linguagem de máquina</T>: zeros e uns. As <T>linguagens de programação</T> são parecidas com o inglês, mais fáceis para as pessoas, e
        precisam ser traduzidas. Existem dois tradutores:
      </P>
      <Fig n="2.1" caption="O compilador e o interpretador." h={22}>
        <TranslatorArt />
      </Fig>
      <Table
        head={["Jeito", "Exemplos"]}
        rows={[
          ["Compiladas", "C, C++ e Go: viram um programa pronto antes de rodar"],
          ["Interpretadas", "Python, JavaScript e Lua: são traduzidas enquanto rodam"],
          ["As duas coisas", "Java: é compilado para bytecode, que a JVM executa"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="👋">Olá, mundo!</H>
      <P>
        Por tradição, o primeiro programa em qualquer linguagem só escreve <T>Olá, mundo!</T> na tela. Veja como cada linguagem faz a mesma coisa do seu jeito:
      </P>
      <HelloLangs />
      <Box kind="sabia">
        Existem centenas de linguagens. Quem aprende bem a primeira aprende as outras muito mais rápido, porque as ideias são as mesmas: variáveis, condições e
        repetições.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🧰">Cada linguagem no seu lugar</H>
      <P>Não existe a melhor linguagem: existe a melhor para cada tarefa. Escolha um projeto:</P>
      <LanguagePicker />
      <Code
        lang="js"
        title="Nomes e comentários"
        code={"// comentário: o computador ignora, é um bilhete para pessoas\nlet pontosDoJogador = 10;   // camelCase (JavaScript e Java)\n// no Python seria: pontos_do_jogador = 10   (snake_case)"}
      />
      <Box kind="mago" title="Nomes que explicam">
        Prefira <strong>pontosDoJogador</strong> a <strong>p</strong> ou <strong>x</strong>. Daqui a um mês, você mesmo vai agradecer!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🐞">Os três tipos de erro</H>
      <P>
        O erro de <T>sintaxe</T> é escrever a frase errada; o de <T>execução</T> quebra enquanto o programa roda; o de <T>lógica</T> é o mais traiçoeiro: o programa roda,
        mas faz a coisa errada. Classifique:
      </P>
      <ChoiceGame items={ERROR_GAME} color={PROG} title="Que erro é esse?" />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O processador só entende zeros e uns; as linguagens precisam ser traduzidas.",
          "O compilador traduz tudo antes; o interpretador traduz linha por linha.",
          "Cada linguagem tem o seu lugar: sites, jogos, IA, apps, dados.",
          "Bons nomes e comentários deixam o código fácil de entender.",
          "Os erros podem ser de sintaxe, de execução ou de lógica.",
        ]}
      />
      <Glossary
        items={[
          ["Linguagem de máquina", "Os zeros e uns que o processador entende."],
          ["Compilador", "Programa que traduz todo o código antes de executar."],
          ["Interpretador", "Programa que traduz e executa o código linha por linha."],
          ["Comentário", "Texto no código que o computador ignora."],
          ["Sintaxe", "As regras de escrita de uma linguagem."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é a diferença entre compilador e interpretador?", "O compilador traduz tudo antes; o interpretador traduz enquanto executa."],
          ["Qual linguagem se usa nos jogos do Roblox?", "Lua (Luau)."],
          ["Para que serve um comentário no código?", "Para explicar o código para as pessoas; o computador ignora."],
          ["O programa roda mas dá o resultado errado. Que erro é?", "Erro de lógica."],
        ]}
      />
    </>,
  ),
];
