"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T } from "../BookParts";
import type { BookPage } from "../types";
import { Code, Console, PROG, Panel, RunCode, Slider } from "./art";

// ============================================================================
// CAPÍTULO 9 — LUA, A LINGUAGEM BRASILEIRA (missões "Linguagem Lua", partes
// 1, 2 e 3): a lua crescente sobre um mundo de blocos, o print, o local e os
// dois pontinhos (para executar), a barra de vida no if/elseif/else (de
// tocar, com a linha executada acesa), o laço for de Lua (de tocar) e as
// tabelas com o ipairs.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a lua sobre o mundo de blocos
// ---------------------------------------------------------------------------

function MoonOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma lua crescente brilhando sobre um mundo feito de blocos, com um bonequinho de blocos pulando numa plataforma e a palavra Lua escrita no céu">
      <rect width="460" height="300" fill="#1e1b4b" />
      {Array.from({ length: 24 }, (_, i) => (
        <circle key={i} cx={(i * 71) % 460} cy={(i * 37) % 160} r={(i % 3) * 0.6 + 0.6} fill="#fff">
          <animate attributeName="opacity" values="1;0.2;1" dur={`${1.5 + (i % 4) * 0.5}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <g transform="translate(340 80)">
        <circle r="44" fill="#fde68a" />
        <circle cx="18" cy="-12" r="40" fill="#1e1b4b" />
        <circle r="60" fill="#fde68a" opacity="0.15">
          <animate attributeName="r" values="56;66;56" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
      <text x="110" y="90" textAnchor="middle" fontSize="40" fontWeight="900" fill="#c4b5fd" fontFamily="Georgia, serif">
        Lua
      </text>
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i * 40} y={250 - (i % 3) * 10} width="40" height={60 + (i % 3) * 10} fill={i % 2 ? "#16a34a" : "#15803d"} stroke="#14532d" />
      ))}
      <rect x="180" y="190" width="100" height="20" fill="#a16207" stroke="#78350f" />
      <g transform="translate(230 190)">
        <g>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 -36;0 0" dur="1s" repeatCount="indefinite" />
          <rect x="-10" y="-46" width="20" height="18" fill="#facc15" />
          <rect x="-12" y="-28" width="24" height="18" fill="#2563eb" />
          <rect x="-12" y="-10" width="10" height="10" fill="#16a34a" />
          <rect x="2" y="-10" width="10" height="10" fill="#16a34a" />
          <circle cx="-4" cy="-38" r="1.6" fill="#1e293b" />
          <circle cx="4" cy="-38" r="1.6" fill="#1e293b" />
        </g>
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A barra de vida no if (de tocar)
// ---------------------------------------------------------------------------

export function HealthIf() {
  const [hp, setHp] = useState(80);
  const line = hp > 50 ? 2 : hp > 0 ? 4 : 6;
  const out = hp > 50 ? "Tudo certo, siga em frente!" : hp > 0 ? "Cuidado: pegue uma poção!" : "Game over...";
  const color = hp > 50 ? "#16a34a" : hp > 0 ? "#ca8a04" : "#dc2626";
  return (
    <Panel title="Mude a vida do jogador">
      <div className="mb-[0.2em] h-[0.9em] overflow-hidden rounded-full bg-[#e5e7eb]">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: `${hp}%`, background: color }} />
      </div>
      <Slider label="vida" value={hp} min={0} max={100} step={5} onChange={setHp} />
      <Code
        lang="lua"
        highlight={line}
        code={`local vida = ${hp}\nif vida > 50 then\n  print("Tudo certo, siga em frente!")\nelseif vida > 0 then\n  print("Cuidado: pegue uma poção!")\nelse\n  print("Game over...")\nend`}
      />
      <Console lines={[out]} />
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O laço for de Lua (de tocar)
// ---------------------------------------------------------------------------

export function LuaFor() {
  const [start, setStart] = useState(1);
  const [stop, setStop] = useState(5);
  const [step, setStep] = useState(1);
  const values: number[] = [];
  for (let i = start; i <= stop; i += step) values.push(i);
  return (
    <Panel title="Monte o for de Lua">
      <Slider label="começo" value={start} min={0} max={10} onChange={setStart} />
      <Slider label="fim" value={stop} min={0} max={20} onChange={setStop} />
      <Slider label="passo" value={step} min={1} max={5} onChange={setStep} />
      <Code code={`for i = ${start}, ${stop}, ${step} do\n  print(i)\nend`} lang="lua" />
      <div className="flex flex-wrap gap-[0.25em]">
        {values.length === 0 && <span className="text-[0.8em] italic text-[#8a7146]">(nada: o começo já passou do fim)</span>}
        {values.map((v) => (
          <span
            key={`${start}-${stop}-${step}-${v}`}
            className="cg-anim-pop rounded-md px-[0.5em] font-mono text-[0.85em] font-black text-white"
            style={{ background: v === stop ? "#ec4899" : PROG }}
          >
            {v}
          </span>
        ))}
      </div>
      <p className="mt-[0.2em] text-center text-[0.78em] text-[#5b4a2e]">
        Diferente do range do Python, no for de Lua o <strong style={{ color: "#ec4899" }}>fim entra</strong> (quando o passo cai em cima dele).
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 9, content, bare });

export const chapter9: BookPage[] = [
  page(
    <ChapterOpener n={9} title="Lua, a Linguagem Brasileira" goals={["A história da Lua, criada no Brasil", "print, local, comentários e o operador ..", "if, then, elseif, else e end", "Laços, tabelas e o ipairs"]}>
      <Fig h={34}>
        <MoonOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌙">Uma linguagem brasileira</H>
      <P>
        A <T>Lua</T> foi criada em 1993, na PUC-Rio, pelos brasileiros Roberto Ierusalimschy, Luiz Henrique de Figueiredo e Waldemar Celes. Ela é leve e rápida e virou a
        linguagem de muitos jogos, como o <T>Roblox</T>, que usa uma versão chamada <T>Luau</T>.
      </P>
      <RunCode
        lang="lua"
        code={'-- isto é um comentário\nlocal nome = "Ana"\nlocal moedas = 50\nprint("Olá, " .. nome .. "!")\nprint("Moedas: " .. moedas * 2)'}
        output={["Olá, Ana!", "Moedas: 100"]}
      />
      <Box kind="lembre">
        Em Lua, <strong>--</strong> faz um comentário, <strong>local</strong> cria uma variável e os dois pontinhos <strong>..</strong> juntam textos.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="❤️">if, then e end</H>
      <P>
        Em Lua, a condição vem entre <T>if</T> e <T>then</T>, e todo bloco termina com <T>end</T>. O “senão, se” é <T>elseif</T> (tudo junto). Os operadores lógicos se
        escrevem por extenso: <T>and</T>, <T>or</T> e <T>not</T>; e “diferente” é <T>~=</T>.
      </P>
      <HealthIf />
    </>,
  ),

  page(
    <>
      <H icon="🔁">Os laços de Lua</H>
      <P>
        O <T>for i = começo, fim, passo do ... end</T> conta números. Também há o <T>while ... do ... end</T> (enquanto) e o <T>repeat ... until</T> (repita até), que roda
        pelo menos uma vez. Experimente o for:
      </P>
      <LuaFor />
    </>,
  ),

  page(
    <>
      <H icon="🎒">Tabelas</H>
      <P>
        A <T>tabela</T> é a estrutura de dados de Lua: serve como lista e como dicionário. Atenção: em Lua, a lista começa no <T>1</T>, e não no 0! O <T>#</T> conta os
        itens e o <T>ipairs</T> percorre a lista em ordem:
      </P>
      <RunCode
        lang="lua"
        code={'local inventario = {"espada", "escudo"}\ntable.insert(inventario, "poção")\nprint(#inventario)\nfor i, item in ipairs(inventario) do\n  print(i .. ": " .. item)\nend\nprint(inventario[5])'}
        output={["3", "1: espada", "2: escudo", "3: poção", "nil"]}
      />
      <Box kind="sabia">
        <strong>nil</strong> quer dizer “nada”: é o que aparece quando você pede uma posição que não existe. No Roblox, scripts como{" "}
        <strong>parte.Touched:Connect(function(outra) ... end)</strong> fazem algo acontecer quando alguém encosta numa peça.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "Lua foi criada no Brasil, em 1993, e é usada no Roblox e em muitos jogos.",
          "-- é comentário, local cria variável e .. junta textos.",
          "if ... then ... elseif ... else ... end; diferente é ~=.",
          "for i = 1, 10 do ... end inclui o fim; também há while e repeat ... until.",
          "Tabelas começam no índice 1; # conta os itens; ipairs percorre a lista.",
        ]}
      />
      <Glossary
        items={[
          ["local", "Cria uma variável que só vale naquele trecho."],
          ["end", "Fecha um bloco (if, for, while, function)."],
          ["Tabela", "A estrutura de Lua que guarda listas e dicionários."],
          ["nil", "O valor que quer dizer nada."],
          ["Luau", "A versão de Lua usada no Roblox."],
        ]}
      />
      <Quiz
        items={[
          ["Onde a linguagem Lua foi criada?", "No Brasil, na PUC-Rio, em 1993."],
          ["Como se juntam dois textos em Lua?", "Com os dois pontinhos: \"Olá, \" .. nome."],
          ["Em que número começa uma tabela de Lua?", "No 1."],
          ["Qual palavra fecha um if em Lua?", "end."],
        ]}
      />
    </>,
  ),
];
