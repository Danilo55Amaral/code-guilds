"use client";

import { useState } from "react";
import { Art, Box, ChapterOpener, Fig, Glossary, H, P, Quiz, Summary, T, Table } from "../BookParts";
import type { BookPage } from "../types";
import { INF, INF_DARK, Monitor, Panel, Pill, ServerRack } from "./art";

// ============================================================================
// CAPÍTULO 5 — INTERNET E NAVEGADORES (missões "Informática" e "Informática
// parte 2"): os pacotes de dados viajando pelo cabo submarino, a casa e o
// servidor trocando pacotes, as partes de um endereço de site (de tocar), o
// montador de pesquisas (de tocar) e as setas do download e do upload.
// ============================================================================

// ---------------------------------------------------------------------------
// Abertura: o cabo submarino
// ---------------------------------------------------------------------------

function CableOpenerArt() {
  return (
    <Art viewBox="0 0 460 300" label="Dois continentes ligados por um cabo no fundo do mar, com pacotes de dados coloridos correndo pelo cabo e peixes nadando">
      <rect width="460" height="300" fill="#bae6fd" />
      <rect y="90" width="460" height="210" fill="#0369a1" />
      <path d="M0 60 L90 60 L110 300 L0 300 Z" fill="#86efac" />
      <path d="M460 60 L370 60 L350 300 L460 300 Z" fill="#fde68a" />
      <path d="M90 120 Q230 300 370 120" fill="none" stroke="#1e293b" strokeWidth="8" />
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} x="-6" y="-5" width="12" height="10" rx="2" fill={["#facc15", "#f472b6", "#4ade80", "#fb923c", "#a78bfa"][k]}>
          <animateMotion path={k % 2 ? "M370 120 Q230 300 90 120" : "M90 120 Q230 300 370 120"} dur="3s" begin={`${-k * 0.6}s`} repeatCount="indefinite" />
        </rect>
      ))}
      {[0, 1].map((k) => (
        <g key={k} transform={k ? "translate(480 150)" : "translate(-40 200)"}>
          <animateTransform attributeName="transform" type="translate" values={k ? "480 150;-40 150" : "-40 200;480 200"} dur={k ? "9s" : "7s"} repeatCount="indefinite" />
          <path d={k ? "M0 0 L14 -8 L14 8 Z M14 0 Q26 -10 36 0 Q26 10 14 0" : "M0 0 L-14 -8 L-14 8 Z M-14 0 Q-26 -10 -36 0 Q-26 10 -14 0"} fill={k ? "#fb923c" : "#facc15"} />
        </g>
      ))}
      <ServerRack x={384} y={10} h={60} />
      <g transform="translate(40 58)">
        <rect x="-20" y="-24" width="40" height="24" fill="#fff" stroke="#78350f" />
        <path d="M-26 -24 L0 -40 L26 -24 Z" fill="#b91c1c" />
      </g>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// Os pacotes indo e voltando
// ---------------------------------------------------------------------------

function PacketsArt() {
  return (
    <Art viewBox="0 0 560 170" label="Um computador mandando pacotes numerados até o roteador, que passa pelos cabos até o servidor; a resposta volta em pacotes até a tela">
      <rect width="560" height="170" rx="14" fill="#f0fdfa" />
      <Monitor x={70} y={150} w={100} screen="#38bdf8" />
      <g transform="translate(200 100)">
        <rect x="-26" y="-12" width="52" height="24" rx="6" fill="#334155" />
        {[-14, 0, 14].map((dx, i) => (
          <circle key={dx} cx={dx} r="3" fill="#22c55e">
            <animate attributeName="opacity" values="1;0.2;1" dur="0.8s" begin={`${-i * 0.25}s`} repeatCount="indefinite" />
          </circle>
        ))}
        <path d="M-16 -12 L-22 -32 M16 -12 L22 -32" stroke="#334155" strokeWidth="3" />
        <text y="-38" textAnchor="middle" fontSize="11" fontWeight="900" fill={INF_DARK}>roteador</text>
      </g>
      <ServerRack x={460} y={30} h={120} />
      <path d="M110 100 L174 100 M226 100 L460 90" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6 4" />
      {[1, 2, 3].map((n, i) => (
        <g key={n}>
          <animateMotion path="M110 96 L460 86" dur="2.4s" begin={`${-i * 0.8}s`} repeatCount="indefinite" />
          <rect x="-11" y="-9" width="22" height="18" rx="3" fill={INF} />
          <text y="4" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">
            {n}
          </text>
        </g>
      ))}
      {[1, 2].map((n, i) => (
        <g key={`v${n}`}>
          <animateMotion path="M460 112 L110 122" dur="2.4s" begin={`${-i * 1.2 - 0.4}s`} repeatCount="indefinite" />
          <rect x="-11" y="-9" width="22" height="18" rx="3" fill="#f97316" />
          <text y="4" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff">
            {n}
          </text>
        </g>
      ))}
      <text x="280" y="24" textAnchor="middle" fontSize="11" fontWeight="900" fill={INF_DARK} fontFamily="Georgia, serif">
        o pedido vai em pacotes (verde) e a resposta volta (laranja)
      </text>
    </Art>
  );
}

// ---------------------------------------------------------------------------
// As partes do endereço (de tocar)
// ---------------------------------------------------------------------------

const URL_PARTS = [
  { text: "https://", color: "#16a34a", name: "Protocolo", info: "As regras da conversa. O s quer dizer seguro: os dados vão embaralhados (criptografados)." },
  { text: "www.", color: "#64748b", name: "Subdomínio", info: "World Wide Web. Hoje muitos sites funcionam até sem ele." },
  { text: "codeguilds", color: "#2563eb", name: "Nome do domínio", info: "O nome do site, que alguém registrou. Não pode haver dois iguais." },
  { text: ".com.br", color: "#7c3aed", name: "Domínio de topo", info: ".com é comercial e .br é do Brasil. Existem .gov.br (governo), .edu.br (educação), .org (organizações)..." },
  { text: "/missoes", color: "#ea580c", name: "Caminho", info: "Qual página do site você quer abrir, como as pastas de um computador." },
];

export function UrlAnatomy() {
  const [sel, setSel] = useState(0);
  const p = URL_PARTS[sel];
  return (
    <Panel title="Toque nas partes do endereço">
      <div className="flex items-center gap-[0.3em] rounded-full border border-[#cbd5e1] bg-white px-[0.6em] py-[0.25em]">
        <span className="text-[0.85em]">🔒</span>
        <div className="flex flex-wrap font-mono text-[0.88em] font-bold">
          {URL_PARTS.map((x, i) => (
            <button
              key={x.text}
              type="button"
              onClick={() => setSel(i)}
              className="rounded px-[0.05em] transition-colors"
              style={{ color: sel === i ? "#fff" : x.color, background: sel === i ? x.color : "transparent" }}
            >
              {x.text}
            </button>
          ))}
        </div>
      </div>
      <p key={sel} className="cg-anim-fade mt-[0.4em] rounded-lg px-[0.6em] py-[0.3em] text-[0.86em] leading-snug" style={{ background: `${p.color}14`, borderLeft: `5px solid ${p.color}` }}>
        <strong style={{ color: p.color }}>{p.name}: </strong>
        {p.info}
      </p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// O montador de pesquisas (de tocar)
// ---------------------------------------------------------------------------

const TRICKS = [
  { id: "aspas", label: '"frase exata"', text: "As aspas procuram exatamente aquela frase, na mesma ordem." },
  { id: "menos", label: "-palavra", text: "O sinal de menos tira os resultados com aquela palavra." },
  { id: "site", label: "site:", text: "site: procura só dentro de um site, como os do governo (.gov.br)." },
  { id: "pdf", label: "filetype:pdf", text: "filetype:pdf mostra só arquivos PDF, como apostilas e trabalhos." },
];

export function SearchBuilder() {
  const [on, setOn] = useState<string[]>(["aspas"]);
  const has = (id: string) => on.includes(id);
  const query = [has("aspas") ? '"ciclo da água"' : "ciclo da água", has("menos") ? "-jogo" : "", has("site") ? "site:gov.br" : "", has("pdf") ? "filetype:pdf" : ""].filter(Boolean).join(" ");
  const results = 2_000_000 / (has("aspas") ? 4 : 1) / (has("menos") ? 2 : 1) / (has("site") ? 40 : 1) / (has("pdf") ? 5 : 1);
  return (
    <Panel title="Monte uma pesquisa melhor">
      <div className="mb-[0.4em] flex flex-wrap justify-center gap-[0.3em]">
        {TRICKS.map((t) => (
          <Pill key={t.id} on={has(t.id)} onClick={() => setOn((o) => (o.includes(t.id) ? o.filter((x) => x !== t.id) : [...o, t.id]))}>
            {t.label}
          </Pill>
        ))}
      </div>
      <div className="flex items-center gap-[0.4em] rounded-full border-2 bg-white px-[0.7em] py-[0.2em]" style={{ borderColor: INF }}>
        <span>🔎</span>
        <span className="font-mono text-[0.84em] font-bold">{query}</span>
      </div>
      <p className="mt-[0.3em] text-center text-[0.82em] text-[#5b4a2e]">
        Cerca de <strong style={{ color: INF_DARK }}>{Math.round(results).toLocaleString("pt-BR")}</strong> resultados
      </p>
      <ul className="mt-[0.2em] space-y-[0.1em] text-[0.78em]">
        {TRICKS.filter((t) => has(t.id)).map((t) => (
          <li key={t.id} className="cg-anim-fade">
            ✔ {t.text}
          </li>
        ))}
      </ul>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// As páginas
// ---------------------------------------------------------------------------

const page = (content: React.ReactNode, bare = false): BookPage => ({ chapter: 5, content, bare });

export const chapter5: BookPage[] = [
  page(
    <ChapterOpener n={5} title="Internet e Navegadores" goals={["Como a internet funciona", "As partes de um endereço de site", "Navegadores e pesquisas melhores", "Download, upload e a velocidade da conexão"]}>
      <Fig h={34}>
        <CableOpenerArt />
      </Fig>
    </ChapterOpener>,
    true,
  ),

  page(
    <>
      <H icon="🌐">Uma rede de redes</H>
      <P>
        A <T>internet</T> é uma rede gigante que liga computadores do mundo todo. Quando você abre um site, o pedido é dividido em <T>pacotes</T>, que viajam por
        roteadores e cabos até o <T>servidor</T>, o computador onde o site mora. A resposta volta em pacotes e é montada na sua tela.
      </P>
      <Fig n="5.1" caption="Os pacotes indo até o servidor e voltando." h={20}>
        <PacketsArt />
      </Fig>
      <Box kind="sabia">
        Quase tudo o que passa de um continente a outro pela internet vai por <strong>cabos submarinos</strong> no fundo do oceano, e não por satélites.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔗">O endereço de um site</H>
      <P>
        Todo site tem um endereço, a <T>URL</T>. Um serviço chamado <T>DNS</T> funciona como a agenda de contatos da internet: traduz o nome do site para o número (o
        endereço IP) do servidor. Explore as partes:
      </P>
      <UrlAnatomy />
      <Box kind="atencao">
        Golpistas criam endereços parecidos com os de verdade, como <strong>banco-seguro-login.com</strong>. Leia o endereço com atenção antes de digitar qualquer dado.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="🔎">Navegadores e pesquisas</H>
      <P>
        O <T>navegador</T> é o programa que abre os sites: Chrome, Edge, Firefox, Safari. Ele tem <T>abas</T>, <T>favoritos</T> e o <T>histórico</T>. Para achar o que
        você procura num buscador, use alguns truques:
      </P>
      <SearchBuilder />
      <Box kind="mago" title="Desconfie">
        Nem tudo o que aparece na pesquisa é verdade. Compare em mais de um site confiável e veja quem escreveu e quando.
      </Box>
    </>,
  ),

  page(
    <>
      <H icon="⬇️">Download e upload</H>
      <P>
        <T>Download</T> é baixar: trazer um arquivo da internet para o seu aparelho. <T>Upload</T> é subir: mandar um arquivo seu para a internet, como postar uma foto.
        A velocidade da conexão é medida em <T>megabits por segundo</T> (Mbps).
      </P>
      <Fig h={16}>
        <Art viewBox="0 0 560 110" label="Uma seta para baixo, do servidor para o celular, com a palavra download, e uma seta para cima, do celular para o servidor, com a palavra upload">
          <rect width="560" height="110" rx="12" fill="#f0fdfa" />
          <g transform="translate(140 55)">
            <path d="M0 -36 L0 26 M-14 12 L0 28 L14 12" stroke="#16a34a" strokeWidth="6" fill="none" strokeLinecap="round">
              <animateTransform attributeName="transform" type="translate" values="0 -6;0 6;0 -6" dur="1.2s" repeatCount="indefinite" />
            </path>
            <text x="30" y="6" fontSize="18" fontWeight="900" fill="#16a34a">download</text>
          </g>
          <g transform="translate(380 55)">
            <path d="M0 36 L0 -26 M-14 -12 L0 -28 L14 -12" stroke="#ea580c" strokeWidth="6" fill="none" strokeLinecap="round">
              <animateTransform attributeName="transform" type="translate" values="0 6;0 -6;0 6" dur="1.2s" repeatCount="indefinite" />
            </path>
            <text x="30" y="6" fontSize="18" fontWeight="900" fill="#ea580c">upload</text>
          </g>
        </Art>
      </Fig>
      <Table
        head={["Conexão", "Como funciona"]}
        rows={[
          ["Wi-Fi", "Sem fio, a partir de um roteador em casa ou na escola"],
          ["Fibra óptica", "Cabos de vidro que levam os dados como luz, muito rápido"],
          ["Dados móveis (4G, 5G)", "Pelas antenas da operadora do celular"],
        ]}
      />
    </>,
  ),

  page(
    <>
      <Summary
        items={[
          "A internet é uma rede de redes; os dados viajam em pacotes até os servidores.",
          "Uma URL tem protocolo, domínio e caminho; o DNS traduz o nome para o endereço IP.",
          "HTTPS quer dizer conexão segura, com os dados criptografados.",
          "Aspas, menos, site: e filetype: deixam a pesquisa mais certeira.",
          "Download é baixar; upload é subir.",
        ]}
      />
      <Glossary
        items={[
          ["Servidor", "Computador que guarda sites e serviços e responde aos pedidos."],
          ["URL", "O endereço de uma página na internet."],
          ["DNS", "O sistema que traduz nomes de sites em endereços IP."],
          ["Navegador", "O programa que abre os sites."],
          ["Download", "Trazer um arquivo da internet para o aparelho."],
        ]}
      />
      <Quiz
        items={[
          ["Onde fica guardado um site?", "Num servidor."],
          ["O que quer dizer o s do https?", "Seguro: os dados vão criptografados."],
          ["Para que servem as aspas numa pesquisa?", "Para procurar a frase exata."],
          ["Postar uma foto é download ou upload?", "Upload."],
        ]}
      />
    </>,
  ),
];
