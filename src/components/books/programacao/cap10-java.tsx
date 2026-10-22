"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { Code, PROG, PROG_DARK, Panel, Pill, RunCode } from "./art";

// ============================================================================
// CAPÍTULO 10 — JAVA E OS OBJETOS (missões "Java", "Java parte 2" e "Java
// parte 3"): a xícara de café soltando código, o caminho do .java até a JVM
// em vários aparelhos, o main e os tipos (para executar), a fábrica de
// objetos de uma classe (de tocar) e o ArrayList (para executar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a xícara de café
// ---------------------------------------------------------------------------

function CoffeeOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma xícara de café grande com o vapor subindo em forma de chaves e ponto e vírgula, ao lado de um computador, um celular e um servidor rodando o mesmo programa">
      <rect width="460" height="300" fill="#fef3c7" />
      <g transform="translate(150 230)">
        <path d="M-70 -90 L70 -90 L58 10 Q0 30 -58 10 Z" fill="#fff" stroke="#b45309" strokeWidth="4" />
        <path d="M70 -70 Q112 -60 98 -26 Q88 -6 62 -10" fill="none" stroke="#b45309" strokeWidth="9" />
        <ellipse cy="-90" rx="70" ry="14" fill="#78350f" />
        <text y="-30" textAnchor="middle" fontSize="28" fontWeight="900" fill="#b45309" fontFamily="Georgia, serif">
          Java
        </text>
        <ellipse cy="30" rx="110" ry="14" fill="#e7e5e4" />
      </g>
      {["{", ";", "}"].map((t, i) => (
        <text key={t} x={120 + i * 30} y="130" fontSize="28" fontWeight="900" fontFamily="monospace" fill="#a8a29e">
          {t}
          <animate attributeName="y" values="130;40" dur="3s" begin={`${-i}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="3s" begin={`${-i}s`} repeatCount="indefinite" />
        </text>
      ))}
      {[
        { y: 70, icon: "💻" },
        { y: 150, icon: "📱" },
        { y: 230, icon: "🗄️" },
      ].map((d, i) => (
        <g key={d.y}>
          <path d={`M240 150 L340 ${d.y}`} stroke="#d6b77a" strokeWidth="2" strokeDasharray="5 4" />
          <circle r="5" fill={PROG}>
            <animateMotion path={`M240 150 L340 ${d.y}`} dur="1.6s" begin={`${-i * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <text x="370" y={d.y + 12} textAnchor="middle" fontSize="34">
            {d.icon}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Do .java até a JVM
// ---------------------------------------------------------------------------

function JvmArt() {
  const stages = [
    { x: 20, label: "Ola.java", sub: "o código", color: "#b45309" },
    { x: 150, label: "javac", sub: "o compilador", color: PROG },
    { x: 280, label: "Ola.class", sub: "o bytecode", color: "#0f766e" },
  ];
  return (
    <Art viewBox="0 0 560 170" label="O arquivo Ola.java passa pelo compilador javac e vira o bytecode Ola.class, que a máquina virtual Java roda no Windows, no Linux e no Android">
      <rect width="560" height="170" rx="14" fill="#fffaf0" />
      {stages.map((s, i) => (
        <g key={s.label}>
          <rect x={s.x} y="56" width="110" height="52" rx="8" fill={`${s.color}22`} stroke={s.color} strokeWidth="3" />
          <text x={s.x + 55} y="80" textAnchor="middle" fontSize="13" fontWeight="900" fontFamily="monospace" fill={s.color}>
            {s.label}
          </text>
          <text x={s.x + 55} y="98" textAnchor="middle" fontSize="11" fill="#3b2a14">
            {s.sub}
          </text>
          {i < 2 && <path d={`M${s.x + 112} 82 L${s.x + 128} 82 M${s.x + 122} 76 L${s.x + 128} 82 L${s.x + 122} 88`} stroke="#94a3b8" strokeWidth="3" fill="none" />}
        </g>
      ))}
      <rect x="420" y="20" width="120" height="130" rx="10" fill="#1e1b4b" />
      <text x="480" y="42" textAnchor="middle" fontSize="13" fontWeight="900" fill="#c4b5fd">JVM</text>
      {["Windows", "Linux", "Android"].map((t, i) => (
        <g key={t}>
          <rect x="434" y={54 + i * 30} width="92" height="22" rx="5" fill="#312e81">
            <animate attributeName="fill" values="#312e81;#6d28d9;#312e81" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
          </rect>
          <text x="480" y={69 + i * 30} textAnchor="middle" fontSize="11" fontWeight="700" fill="#e2e8f0">
            {t}
          </text>
        </g>
      ))}
      <path d="M392 82 L418 82" stroke="#94a3b8" strokeWidth="3" />
      <circle r="5" fill={PROG}>
        <animateMotion path="M60 40 L60 50 L500 50" dur="3s" repeatCount="indefinite" />
      </circle>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A fábrica de objetos (de tocar)
// ---------------------------------------------------------------------------

type Pet = { name: string; energy: number };
const PET_NAMES = ["Rex", "Mia", "Bolt", "Luna"];

const CLASS_CODE = `class Pet {
  String nome;
  int energia = 100;

  Pet(String nome) { this.nome = nome; }

  void brincar() { energia = energia - 20; }
  void comer()   { energia = energia + 10; }
}`;

export function ObjectFactory() {
  const [pets, setPets] = useState<Pet[]>([{ name: "Rex", energy: 100 }]);
  const [sel, setSel] = useState(0);
  const [last, setLast] = useState('Pet p1 = new Pet("Rex");');
  const current = pets[sel];
  function update(fn: (e: number) => number, call: string) {
    setPets((ps) => ps.map((p, i) => (i === sel ? { ...p, energy: Math.max(0, Math.min(100, fn(p.energy))) } : p)));
    setLast(`p${sel + 1}.${call}();`);
  }
  return (
    <Panel title="Crie objetos da classe Pet">
      <Code code={CLASS_CODE} lang="java" title="Pet.java (a classe é o molde)" />
      <div className="mb-[0.3em] flex flex-wrap justify-center gap-[0.25em]">
        <Pill
          onClick={() => {
            if (pets.length >= 4) return;
            const name = PET_NAMES[pets.length];
            setPets((ps) => [...ps, { name, energy: 100 }]);
            setSel(pets.length);
            setLast(`Pet p${pets.length + 1} = new Pet("${name}");`);
          }}
        >
          ✨ new Pet()
        </Pill>
        <Pill onClick={() => update((e) => e - 20, "brincar")} color="#ec4899">
          ⚽ brincar()
        </Pill>
        <Pill onClick={() => update((e) => e + 10, "comer")} color="#16a34a">
          🍖 comer()
        </Pill>
      </div>
      <p className="mb-[0.3em] rounded bg-[#1e1b4b] px-[0.5em] font-mono text-[0.76em] text-[#86efac]">{last}</p>
      <div className="grid grid-cols-4 gap-[0.3em]">
        {pets.map((p, i) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setSel(i)}
            className="cg-anim-pop rounded-lg border-2 px-[0.3em] py-[0.2em] text-left text-[0.72em]"
            style={{ borderColor: sel === i ? PROG : "#d9c79d", background: sel === i ? "#f5f3ff" : "#fff" }}
          >
            <p className="font-mono font-black" style={{ color: PROG_DARK }}>
              p{i + 1}
            </p>
            <p>nome: “{p.name}”</p>
            <p>energia: {p.energy}</p>
            <div className="mt-[0.15em] h-[0.4em] overflow-hidden rounded-full bg-[#e5e7eb]">
              <div className="h-full rounded-full transition-all" style={{ width: `${p.energy}%`, background: p.energy > 40 ? "#16a34a" : "#dc2626" }} />
            </div>
          </button>
        ))}
      </div>
      {current && <p className="sr-only">Objeto selecionado: {current.name}</p>}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 10, content, bare });

export const chapter10: BookPage[] = [
  page(
    <ChapterOpener n={10} title="Java e os Objetos" goals={["A origem do Java e a JVM", "O main, os tipos e as regras de escrita", "Classes, objetos e construtores", "Condições, laços e o ArrayList"]}>
      <Fig h={34}>
        <CoffeeOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="☕">Escreva uma vez, rode em qualquer lugar</H>
      <P>
        O <T>Java</T> foi lançado em 1995 pela Sun Microsystems, numa equipe liderada por <T>James Gosling</T>. O nome vem de um café da ilha de Java, na Indonésia. O código
        é compilado para <T>bytecode</T>, que a <T>JVM</T> (a máquina virtual Java) roda em qualquer aparelho.
      </P>
      <Fig n="10.1" caption="Do código à JVM." h={20}>
        <JvmArt />
      </Fig>
      <Box kind="sabia">
        Java está em sistemas de bancos, em servidores e na base de muitos aplicativos de Android. O famoso jogo <strong>Minecraft</strong> nasceu escrito em Java!
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🚪">O main e os tipos</H>
      <P>
        Todo programa Java começa pelo método <T>main</T>, dentro de uma <T>classe</T>. Cada variável tem um <T>tipo</T> declarado, cada instrução termina com{" "}
        <T>ponto e vírgula</T> e os blocos ficam entre <T>chaves</T>. Maiúsculas e minúsculas fazem diferença!
      </P>
      <RunCode
        lang="java"
        code={'public class Ola {\n  public static void main(String[] args) {\n    String nome = "Ana";\n    int nivel = 7;\n    double xp = 92.5;\n    boolean online = true;\n    System.out.println(nome + " está no nível " + nivel);\n  }\n}'}
        output={["Ana está no nível 7"]}
      />
      <Table
        head={["Tipo", "Guarda", "Exemplo"]}
        rows={[
          ["int", "Números inteiros", "int vidas = 3;"],
          ["double", "Números com vírgula", "double altura = 1.55;"],
          ["boolean", "true ou false", "boolean venceu = false;"],
          ["char", "Uma letra, entre aspas simples", "char nota = 'A';"],
          ["String", "Um texto, entre aspas duplas", "String nome = \"Leo\";"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🏭">Classes e objetos</H>
      <P>
        Uma <T>classe</T> é um molde; os <T>objetos</T> são as coisas feitas com ele. A classe diz quais informações (os <T>atributos</T>) e quais ações (os{" "}
        <T>métodos</T>) cada objeto tem. O <T>construtor</T> monta o objeto quando você usa <T>new</T>. Faça a sua fábrica:
      </P>
      <ObjectFactory />
    </>,
  ),

  page(
    <>
      <H icon="📋">Condições, laços e o ArrayList</H>
      <P>
        O if, o for e o while do Java se parecem com os do JavaScript. O <T>ArrayList</T> é uma lista que cresce: <T>add</T> coloca, <T>size</T> conta e <T>get</T> pega
        pela posição (que começa no 0):
      </P>
      <RunCode
        lang="java"
        code={'import java.util.ArrayList;\n\nArrayList<String> herois = new ArrayList<>();\nherois.add("Ada");\nherois.add("Turing");\nSystem.out.println(herois.size());\nfor (String h : herois) {\n  if (h.length() > 3) System.out.println(h + " tem nome longo");\n}'}
        output={["2", "Turing tem nome longo"]}
      />
      <Box kind="lembre">
        Para ler o que o usuário digita, o Java usa o <strong>Scanner</strong>: <strong>Scanner leitor = new Scanner(System.in);</strong> e depois{" "}
        <strong>leitor.nextLine()</strong>.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Java nasceu em 1995; o bytecode roda na JVM em qualquer aparelho.",
          "Todo programa começa pelo main, dentro de uma classe.",
          "Variáveis têm tipo (int, double, boolean, char, String); instruções terminam com ;.",
          "Uma classe é o molde; objetos são criados com new e o construtor.",
          "ArrayList é uma lista que cresce: add, size e get.",
        ]}
      />
      <Glossary
        items={[
          ["JVM", "A máquina virtual Java, que roda o bytecode."],
          ["Classe", "O molde que define atributos e métodos."],
          ["Objeto", "Uma coisa criada a partir de uma classe."],
          ["Método", "Uma ação que o objeto sabe fazer."],
          ["Construtor", "O método especial que monta o objeto no new."],
        ]}
      />
      <Quiz
        items={[
          ["O que faz a JVM?", "Roda o bytecode do Java em qualquer aparelho."],
          ["Qual é o método por onde todo programa Java começa?", "O main."],
          ["Qual tipo guarda números com vírgula?", "double."],
          ["Qual é a diferença entre classe e objeto?", "A classe é o molde; o objeto é feito a partir dele."],
        ]}
      />
    </>,
  ),
];
