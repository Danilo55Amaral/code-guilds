"use client";

import { useState } from "react";
import { Art, Box, Cards, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { INF, INF_DARK, Panel, Pill, ServerRack, Slider } from "./art";

// ============================================================================
// CAPÍTULO 9 — A COMPUTAÇÃO EM NUVEM (missões "Computação em Nuvem", partes
// 1, 2 e 3): a nuvem cheia de servidores ligada aos aparelhos, o data center
// com os ventiladores girando, a sincronização do celular para o computador
// (de tocar), os servidores que se multiplicam quando chegam mais usuários
// (de tocar) e o compartilhamento de arquivos (de tocar).
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: a nuvem de servidores
// ---------------------------------------------------------------------------

function CloudOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Uma nuvem grande com servidores dentro, ligada por linhas de dados a um celular, um notebook e um videogame, com pacotes subindo e descendo">
      <rect width="460" height="300" fill="#e0f2fe" />
      <g fill="#fff" stroke="#93c5fd" strokeWidth="3">
        <ellipse cx="230" cy="110" rx="150" ry="60" />
        <circle cx="160" cy="80" r="50" />
        <circle cx="250" cy="60" r="60" />
        <circle cx="320" cy="90" r="44" />
      </g>
      <ServerRack x={180} y={64} h={80} />
      <ServerRack x={250} y={64} h={80} />
      {[
        { x: 70, icon: "📱" },
        { x: 230, icon: "💻" },
        { x: 390, icon: "🎮" },
      ].map((d, i) => (
        <g key={d.x}>
          <path d={`M${d.x} 240 Q${(d.x + 230) / 2} 200 230 160`} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5 4" />
          <circle r="5" fill={INF}>
            <animateMotion path={`M${d.x} 240 Q${(d.x + 230) / 2} 200 230 160`} dur="2s" begin={`${-i * 0.6}s`} repeatCount="indefinite" />
          </circle>
          <circle r="5" fill="#f97316">
            <animateMotion path={`M230 160 Q${(d.x + 230) / 2} 200 ${d.x} 240`} dur="2s" begin={`${-i * 0.6 - 1}s`} repeatCount="indefinite" />
          </circle>
          <text x={d.x} y="276" textAnchor="middle" fontSize="36">
            {d.icon}
          </text>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// O data center
// ---------------------------------------------------------------------------

function DataCenterArt() {
  return (
    <Art viewBox="0 0 560 170" label="Um corredor de data center com fileiras de servidores piscando e ventiladores de refrigeração girando no teto">
      <rect width="560" height="170" rx="14" fill="#0f172a" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ServerRack key={i} x={30 + i * 72} y={40} h={120} />
      ))}
      {[90, 280, 470].map((x) => (
        <g key={x} transform={`translate(${x} 20)`}>
          <circle r="14" fill="#334155" />
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.8s" repeatCount="indefinite" />
            {[0, 120, 240].map((a) => (
              <path key={a} d="M0 0 Q6 -6 0 -12 Q-4 -6 0 0 Z" fill="#94a3b8" transform={`rotate(${a})`} />
            ))}
          </g>
        </g>
      ))}
    </Art>
  );
}

// ---------------------------------------------------------------------------
// A sincronização (de tocar)
// ---------------------------------------------------------------------------

const LINES = ["Ideias para o trabalho:", "1. Ciclo da água", "2. Biomas", "3. Rios voadores", "4. Desmatamento"];

export function CloudSync() {
  const [phone, setPhone] = useState(2);
  const [online, setOnline] = useState(true);
  const [pc, setPc] = useState(2);
  const [syncing, setSyncing] = useState(false);

  function write() {
    const next = Math.min(LINES.length, phone + 1);
    setPhone(next);
    if (online) {
      setSyncing(true);
      window.setTimeout(() => {
        setPc(next);
        setSyncing(false);
      }, 900);
    }
  }

  function toggleOnline() {
    const next = !online;
    setOnline(next);
    if (next && pc < phone) {
      setSyncing(true);
      window.setTimeout(() => {
        setPc(phone);
        setSyncing(false);
      }, 900);
    }
  }

  const doc = (n: number) => (
    <div className="h-[6.2em] overflow-hidden rounded bg-white px-[0.4em] py-[0.2em] text-[0.62em] leading-snug text-[#1e293b]">
      {LINES.slice(0, n).map((l) => (
        <p key={l}>{l}</p>
      ))}
    </div>
  );

  return (
    <Panel title="Escreva no celular e veja o computador">
      <div className="flex items-center gap-[0.4em]">
        <div className="w-[34%] rounded-[0.8em] bg-[#1e293b] p-[0.35em]">
          <p className="mb-[0.2em] text-center text-[0.6em] font-bold text-white">📱 celular</p>
          {doc(phone)}
        </div>
        <div className="flex flex-1 flex-col items-center text-center">
          <span className={`text-[1.8em] ${syncing ? "animate-bounce" : ""}`}>{online ? "☁️" : "🚫"}</span>
          <span className="text-[0.7em] font-bold" style={{ color: online ? INF_DARK : "#b91c1c" }}>
            {syncing ? "sincronizando..." : online ? "sincronizado" : `sem internet (${phone - pc} alteração${phone - pc === 1 ? "" : "ões"} esperando)`}
          </span>
        </div>
        <div className="w-[38%] rounded-md bg-[#334155] p-[0.35em]">
          <p className="mb-[0.2em] text-center text-[0.6em] font-bold text-white">💻 computador</p>
          {doc(pc)}
        </div>
      </div>
      <div className="mt-[0.4em] flex justify-center gap-[0.3em]">
        <Pill onClick={write}>✏️ Escrever uma linha</Pill>
        <Pill on={!online} onClick={toggleOnline} color="#b91c1c">
          {online ? "Desligar a internet" : "Religar a internet"}
        </Pill>
        <Pill
          onClick={() => {
            setPhone(2);
            setPc(2);
            setOnline(true);
          }}
        >
          ↺
        </Pill>
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// A escalabilidade (de tocar)
// ---------------------------------------------------------------------------

export function Scaling() {
  const [users, setUsers] = useState(2000);
  const servers = Math.max(1, Math.ceil(users / 2500));
  return (
    <Panel title="Chegaram mais jogadores? A nuvem liga mais servidores">
      <Slider label="Jogadores" value={users} min={500} max={20000} step={500} onChange={setUsers} />
      <svg viewBox="0 0 400 90" className="mt-[0.3em] w-full" role="img" aria-label={`${users} jogadores usando ${servers} servidores`}>
        <rect width="400" height="90" rx="8" fill="#0f172a" />
        {Array.from({ length: servers }, (_, i) => (
          <g key={i} className="cg-anim-pop">
            <ServerRack x={10 + i * 48} y={8} h={74} />
          </g>
        ))}
      </svg>
      <p className="mt-[0.2em] text-center text-[0.86em]">
        <strong style={{ color: INF_DARK }}>{servers}</strong> {servers === 1 ? "servidor ligado" : "servidores ligados"}: cada um aguenta uns 2.500 jogadores.
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O compartilhamento (de tocar)
// ---------------------------------------------------------------------------

const SHARE = [
  { id: "privado", label: "🔒 Só eu", text: "Só você vê o arquivo. É o mais seguro para coisas pessoais." },
  { id: "pessoas", label: "👥 Pessoas escolhidas", text: "Só quem você convidar pelo e-mail pode abrir. Bom para trabalhos em grupo." },
  { id: "link", label: "🔗 Qualquer um com o link", text: "Quem tiver o link abre, mesmo um desconhecido. Cuidado ao espalhar esse link!" },
];

export function ShareSettings() {
  const [sel, setSel] = useState(1);
  const [edit, setEdit] = useState(false);
  return (
    <Panel title="Compartilhar o arquivo">
      <div className="mb-[0.3em] flex flex-wrap justify-center gap-[0.3em]">
        {SHARE.map((s, i) => (
          <Pill key={s.id} on={sel === i} onClick={() => setSel(i)} color={i === 2 ? "#ea580c" : INF}>
            {s.label}
          </Pill>
        ))}
      </div>
      <div className="mb-[0.3em] flex justify-center gap-[0.3em]">
        <Pill on={!edit} onClick={() => setEdit(false)}>
          👀 Só ver
        </Pill>
        <Pill on={edit} onClick={() => setEdit(true)}>
          ✏️ Pode editar
        </Pill>
      </div>
      <p key={`${sel}-${edit}`} className="cg-anim-fade text-[0.86em] leading-snug">
        {SHARE[sel].text} {sel > 0 && (edit ? "E essas pessoas podem mudar e apagar o conteúdo." : "Elas só conseguem ler, sem mudar nada.")}
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
    <ChapterOpener n={9} title="A Computação em Nuvem" goals={["O que é, de verdade, a nuvem", "A sincronização entre os aparelhos", "Como a nuvem funciona por dentro", "Segurança e bom uso da nuvem"]}>
      <Fig h={34}>
        <CloudOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="☁️">O que é a nuvem?</H>
      <P>
        A <T>nuvem</T> não fica no céu: são milhares de computadores (os <T>servidores</T>) em prédios enormes, os <T>data centers</T>, ligados à internet. Guardar algo
        “na nuvem” é guardar no computador de uma empresa, que você usa pela internet.
      </P>
      <Fig n="9.1" caption="Um data center por dentro." h={18}>
        <DataCenterArt />
      </Fig>
      <Cards
        items={[
          { icon: "📂", title: "Arquivos", text: "Google Drive, OneDrive e iCloud guardam seus arquivos." },
          { icon: "🎬", title: "Streaming", text: "Filmes, séries e músicas vêm de servidores na nuvem." },
          { icon: "🎮", title: "Jogos online", text: "Os mundos e os placares ficam em servidores." },
          { icon: "🏰", title: "A CodeGuilds", text: "Este site e suas missões também rodam na nuvem!" },
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔄">A sincronização</H>
      <P>
        Com a nuvem, o mesmo arquivo aparece em todos os seus aparelhos: o que você muda no celular é <T>sincronizado</T> e aparece no computador. Sem internet, as
        mudanças esperam e sobem quando ela volta. Teste:
      </P>
      <CloudSync />
      <Box kind="lembre">
        A nuvem depende da internet: sem conexão, você só usa o que já estava salvo no aparelho.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⚙️">Por dentro da nuvem</H>
      <P>
        A nuvem é <T>escalável</T>: quando chega muita gente, ela liga mais servidores; quando a procura cai, desliga. E tem <T>redundância</T>: guarda cópias dos dados
        em vários data centers, em <T>regiões</T> diferentes, para nada se perder se um deles falhar.
      </P>
      <Scaling />
      <Table
        head={["Tipo", "Você recebe pronto", "Exemplo"]}
        rows={[
          ["SaaS (software)", "O programa inteiro, é só usar", "Gmail, Google Docs, Office online"],
          ["PaaS (plataforma)", "O lugar para rodar o seu programa", "Onde a CodeGuilds roda o site e a API"],
          ["IaaS (infraestrutura)", "Os servidores, para montar do zero", "Máquinas alugadas por hora"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <H icon="🔐">Segurança e bom uso</H>
      <P>
        Use <T>verificação em duas etapas</T> na conta da nuvem e cuidado ao <T>compartilhar</T>. Arquivos compartilhados podem ser só para ver ou para editar:
      </P>
      <ShareSettings />
      <Box kind="atencao">
        O espaço grátis da nuvem é limitado (em gigabytes). Apague o que não precisa e lembre: o que está compartilhado com um link pode ser visto por qualquer pessoa que
        receba esse link.
      </Box>
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A nuvem são servidores em data centers, usados pela internet.",
          "Drive, streaming, jogos online e a própria CodeGuilds usam a nuvem.",
          "A sincronização deixa o mesmo arquivo em todos os aparelhos.",
          "A nuvem é escalável e guarda cópias em vários lugares (redundância).",
          "Proteja a conta com duas etapas e compartilhe com cuidado.",
        ]}
      />
      <Glossary
        items={[
          ["Data center", "Prédio cheio de servidores ligados à internet."],
          ["Sincronizar", "Deixar o mesmo conteúdo igual em vários aparelhos."],
          ["Escalável", "Que aumenta ou diminui conforme a procura."],
          ["Redundância", "Ter cópias extras para não perder nada."],
          ["SaaS", "Software como serviço: o programa pronto, usado pela internet."],
        ]}
      />
      <Quiz
        items={[
          ["Onde ficam, de verdade, os arquivos “na nuvem”?", "Em servidores dentro de data centers."],
          ["O que acontece com o que você edita sem internet?", "Fica esperando e sincroniza quando a internet voltar."],
          ["O que quer dizer que a nuvem é escalável?", "Que liga mais servidores quando tem mais gente usando."],
          ["Por que ter cuidado com o compartilhamento por link?", "Porque qualquer pessoa com o link pode abrir o arquivo."],
        ]}
      />
    </>,
  ),
];
