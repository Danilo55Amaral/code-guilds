"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, List, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { INF, INF_DARK, Monitor, Panel } from "./art";

// ============================================================================
// CAPÍTULO 2 — O SISTEMA OPERACIONAL (missões "Informática" e "Informática
// parte 3"): o celular, o notebook e o computador com o sistema ligando, a
// área de trabalho de brinquedo (de tocar), as janelas e o gerenciador de
// tarefas fechando o programa travado (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o sistema ligando
// ---------------------------------------------------------------------------

function BootOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Um computador, um notebook e um celular ligando ao mesmo tempo, com a barra de carregamento enchendo e as janelas aparecendo na tela">
      <rect width="460" height="300" fill="#ccfbf1" />
      <Monitor x={150} y={250} w={200} screen="#1e3a8a">
        <rect x="-60" y="-10" width="120" height="10" rx="5" fill="#334155" />
        <rect x="-60" y="-10" width="0" height="10" rx="5" fill="#2dd4bf">
          <animate attributeName="width" values="0;120;120" keyTimes="0;0.7;1" dur="4s" repeatCount="indefinite" />
        </rect>
        <text y="-24" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">
          Iniciando...
        </text>
      </Monitor>
      <g transform="translate(330 250)">
        <rect x="-70" y="-90" width="140" height="86" rx="6" fill="#1e293b" />
        <rect x="-64" y="-84" width="128" height="74" rx="3" fill="#0f766e" />
        {[0, 1].map((k) => (
          <rect key={k} x={-50 + k * 30} y={-74 + k * 16} width="64" height="40" rx="3" fill="#fff" stroke="#134e4a">
            <animate attributeName="opacity" values="0;0;1;1" keyTimes="0;0.4;0.5;1" dur="4s" begin={`${-k * 0.4}s`} repeatCount="indefinite" />
          </rect>
        ))}
        <path d="M-84 -4 L84 -4 L74 8 L-74 8 Z" fill="#475569" />
      </g>
      <g transform="translate(410 110)">
        <rect x="-22" y="-40" width="44" height="80" rx="8" fill="#1e293b" />
        <rect x="-18" y="-32" width="36" height="62" rx="3" fill="#a5f3fc" />
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={-14 + (i % 3) * 11} y={-26 + Math.floor(i / 3) * 12} width="8" height="8" rx="2" fill={["#ef4444", "#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899"][i]}>
            <animate attributeName="opacity" values="0;0;1;1" keyTimes={`0;${(i * 0.08).toFixed(2)};${(i * 0.08 + 0.05).toFixed(2)};1`} dur="4s" repeatCount="indefinite" />
          </rect>
        ))}
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A área de trabalho de brinquedo (de tocar)
// ---------------------------------------------------------------------------

const APPS = [
  { id: "nav", icon: "🌐", name: "Navegador", body: "🔎 Pesquisar na internet..." },
  { id: "pasta", icon: "📁", name: "Documentos", body: "📄 trabalho.docx   🖼️ foto.jpg   🎵 musica.mp3" },
  { id: "notas", icon: "📝", name: "Bloco de notas", body: "Lembrete: fazer a missão de Informática!" },
  { id: "lixo", icon: "🗑️", name: "Lixeira", body: "A lixeira está vazia." },
];

export function MiniDesktop() {
  const [open, setOpen] = useState<string[]>(["notas"]);
  const [front, setFront] = useState("notas");
  function launch(id: string) {
    setOpen((o) => (o.includes(id) ? o : [...o, id]));
    setFront(id);
  }
  function close(id: string) {
    setOpen((o) => o.filter((x) => x !== id));
  }
  return (
    <Panel title="Clique duas vezes... ou uma só: abra os programas">
      <div className="relative h-[11em] overflow-hidden rounded-lg" style={{ background: "linear-gradient(135deg,#0f766e,#1e3a8a)" }}>
        <div className="absolute left-[0.4em] top-[0.4em] flex flex-col gap-[0.4em]">
          {APPS.map((a) => (
            <button key={a.id} type="button" onClick={() => launch(a.id)} className="flex w-[4.2em] flex-col items-center text-[0.68em] font-bold text-white">
              <span className="text-[1.8em]">{a.icon}</span>
              {a.name}
            </button>
          ))}
        </div>
        {open.map((id, i) => {
          const a = APPS.find((x) => x.id === id)!;
          return (
            <div
              key={id}
              className="cg-anim-pop absolute w-[60%] overflow-hidden rounded-md border border-[#94a3b8] bg-white shadow-lg"
              style={{ left: `${24 + i * 6}%`, top: `${8 + i * 10}%`, zIndex: front === id ? 10 : i }}
              onClick={() => setFront(id)}
            >
              <div className="flex items-center gap-[0.3em] bg-[#1e3a8a] px-[0.4em] text-[0.68em] font-bold text-white">
                <span>{a.icon}</span>
                <span className="flex-1">{a.name}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    close(id);
                  }}
                  className="rounded px-[0.3em] hover:bg-[#dc2626]"
                  aria-label={`Fechar ${a.name}`}
                >
                  ✕
                </button>
              </div>
              <p className="px-[0.5em] py-[0.6em] text-[0.72em] text-[#1e293b]">{a.body}</p>
            </div>
          );
        })}
        <div className="absolute inset-x-0 bottom-0 flex h-[1.8em] items-center gap-[0.3em] bg-[#0f172a]/90 px-[0.4em]">
          <span className="rounded bg-[#2dd4bf] px-[0.4em] text-[0.7em] font-black text-[#0f172a]">⊞</span>
          {open.map((id) => (
            <button key={id} type="button" onClick={() => setFront(id)} className={`rounded px-[0.3em] text-[0.9em] ${front === id ? "bg-white/30" : ""}`}>
              {APPS.find((x) => x.id === id)!.icon}
            </button>
          ))}
        </div>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O gerenciador de tarefas (de tocar)
// ---------------------------------------------------------------------------

const TASKS = [
  { name: "Navegador", cpu: 8, ok: true },
  { name: "Música", cpu: 2, ok: true },
  { name: "Jogo", cpu: 97, ok: false },
  { name: "Editor de texto", cpu: 1, ok: true },
];

export function TaskManager() {
  const [tasks, setTasks] = useState(TASKS);
  const [sel, setSel] = useState(2);
  const total = Math.min(100, tasks.reduce((s, t) => s + t.cpu, 0));
  return (
    <Panel title="Gerenciador de tarefas (Ctrl + Shift + Esc)">
      <div className="overflow-hidden rounded-md border border-[#94a3b8] bg-white text-[0.8em]">
        <div className="grid grid-cols-[1fr_5em_4em] bg-[#e2e8f0] px-[0.5em] py-[0.15em] font-bold text-[#334155]">
          <span>Processo</span>
          <span>Situação</span>
          <span className="text-right">CPU</span>
        </div>
        {tasks.map((t, i) => (
          <button
            key={t.name}
            type="button"
            onClick={() => setSel(i)}
            className="grid w-full grid-cols-[1fr_5em_4em] px-[0.5em] py-[0.15em] text-left"
            style={{ background: sel === i ? "#ccfbf1" : undefined }}
          >
            <span className="font-bold">{t.name}</span>
            <span className={t.ok ? "text-[#15803d]" : "font-bold text-[#b91c1c]"}>{t.ok ? "Executando" : "Travado"}</span>
            <span className="text-right tabular-nums">{t.cpu}%</span>
          </button>
        ))}
      </div>
      <div className="mt-[0.4em] flex items-center gap-[0.5em]">
        <div className="h-[0.8em] flex-1 overflow-hidden rounded-full bg-[#e5e7eb]">
          <div className="h-full rounded-full transition-all" style={{ width: `${total}%`, background: total > 80 ? "#dc2626" : INF }} />
        </div>
        <span className="text-[0.8em] font-bold tabular-nums">CPU {total}%</span>
        <button
          type="button"
          disabled={!tasks[sel]}
          onClick={() => {
            setTasks((ts) => ts.filter((_, i) => i !== sel));
            setSel(0);
          }}
          className="rounded-md bg-[#dc2626] px-[0.6em] py-[0.15em] text-[0.78em] font-bold text-white disabled:opacity-40"
        >
          Finalizar tarefa
        </button>
      </div>
      {tasks.length < TASKS.length && (
        <p className="mt-[0.3em] text-center text-[0.8em] text-[#5b4a2e]">
          {tasks.some((t) => !t.ok) ? "Você fechou um programa que estava funcionando. O travado continua lá!" : "Pronto: o computador voltou a ficar rápido."}
        </p>
      )}
      {tasks.length < TASKS.length && (
        <button type="button" onClick={() => setTasks(TASKS)} className="mx-auto mt-[0.2em] block text-[0.75em] font-bold underline" style={{ color: INF_DARK }}>
          ↺ Recomeçar
        </button>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 2, content, bare });

export const chapter2: BookPage[] = [
  page(
    <ChapterOpener n={2} title="O Sistema Operacional" goals={["O que é um sistema operacional", "Os sistemas de computadores e celulares", "A área de trabalho e as janelas", "O gerenciador de tarefas e os cuidados com o sistema"]}>
      <Fig h={34}>
        <BootOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="⚙️">O chefe do computador</H>
      <P>
        O <T>sistema operacional</T> é o programa principal: ele liga o computador, controla o hardware, organiza os arquivos e deixa os outros programas funcionarem. É
        ele que aparece quando você liga o aparelho.
      </P>
      <Table
        head={["Sistema", "Onde aparece"]}
        rows={[
          ["Windows", "A maioria dos computadores e notebooks"],
          ["macOS", "Os computadores da Apple"],
          ["Linux", "Servidores, computadores e até supercomputadores; é gratuito e aberto"],
          ["Android", "A maioria dos celulares (é baseado no Linux)"],
          ["iOS", "O iPhone"],
        ]}
      />
      <Box kind="sabia">
        O mascote do Linux é um pinguim chamado <strong>Tux</strong>. O Linux é <strong>software livre</strong>: qualquer pessoa pode ver e melhorar o código dele.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🖥️">A área de trabalho</H>
      <P>
        A <T>área de trabalho</T> é a tela inicial, com os <T>ícones</T> dos programas e a <T>barra de tarefas</T> embaixo. Cada programa aberto fica numa{" "}
        <T>janela</T>. Experimente:
      </P>
      <MiniDesktop />
      <Box kind="lembre">
        Na barra de título de toda janela ficam os botões: <strong>—</strong> minimizar (esconder), <strong>▢</strong> maximizar (tela cheia) e <strong>✕</strong>{" "}
        fechar.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🐢">O computador travou?</H>
      <P>
        Às vezes um programa para de responder e deixa tudo lento. O <T>Gerenciador de Tarefas</T> mostra quanto cada programa está usando do processador e deixa
        fechar à força o que travou. Descubra qual é:
      </P>
      <TaskManager />
      <Box kind="atencao">
        Só finalize o programa que está travado: fechar à força outro programa pode fazer você perder o que não salvou.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🛠️">Cuidando do sistema</H>
      <P>Alguns cuidados deixam o computador mais seguro e rápido:</P>
      <List
        items={[
          <>
            <strong>Atualize</strong> o sistema: as atualizações corrigem falhas de segurança.
          </>,
          <>
            Use a sua própria <strong>conta de usuário</strong>, com senha.
          </>,
          <>
            Saiu de perto? <strong>Bloqueie a tela</strong> com <strong>Windows + L</strong>.
          </>,
          <>
            <strong>Desligue pelo menu</strong> do sistema, nunca puxando o fio.
          </>,
          <>
            Instale programas só de <strong>lojas e sites oficiais</strong>.
          </>,
        ]}
      />
      <Fig h={14}>
        <Art viewBox="0 0 560 90" label="A tela de bloqueio com um cadeado e o relógio">
          <rect width="560" height="90" rx="12" fill={INF_DARK} />
          <text x="280" y="50" textAnchor="middle" fontSize="30" fontWeight="900" fill="#fff" fontFamily="monospace">
            🔒 10:30
          </text>
          <text x="280" y="74" textAnchor="middle" fontSize="12" fill="#99f6e4">
            Windows + L bloqueia a tela
          </text>
        </Art>
      </Fig>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "O sistema operacional controla o hardware e deixa os programas funcionarem.",
          "Windows, macOS e Linux estão nos computadores; Android e iOS, nos celulares.",
          "A área de trabalho tem ícones, janelas e a barra de tarefas.",
          "Ctrl + Shift + Esc abre o Gerenciador de Tarefas.",
          "Atualizar, usar senha e bloquear a tela deixam o computador seguro.",
        ]}
      />
      <Glossary
        items={[
          ["Sistema operacional", "O programa principal, que controla o computador."],
          ["Ícone", "A figurinha que representa um programa ou arquivo."],
          ["Janela", "O quadro onde um programa aberto aparece."],
          ["Software livre", "Programa que qualquer um pode ver, usar e melhorar."],
          ["Atualização", "Uma nova versão que corrige falhas e traz melhorias."],
        ]}
      />
      <Quiz
        items={[
          ["Qual é o sistema operacional da maioria dos celulares?", "O Android."],
          ["Qual sistema é gratuito e tem um pinguim como mascote?", "O Linux."],
          ["Qual atalho abre o Gerenciador de Tarefas?", "Ctrl + Shift + Esc."],
          ["Como bloquear a tela no Windows?", "Com Windows + L."],
        ]}
      />
    </>,
  ),
];
