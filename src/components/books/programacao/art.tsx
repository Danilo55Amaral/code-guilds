"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// ============================================================================
// AS PEÇAS DO LIVRO DE LINGUAGEM DE PROGRAMAÇÃO — as cores do livro, o painel
// das figuras de tocar, os botões, o controle deslizante e, principalmente, o
// bloco de código colorido (cada linguagem com as suas palavras reservadas) e
// o bloco que executa: o código, o botão ▶ Executar e o console mostrando a
// saída linha por linha.
// ============================================================================

export const PROG = "#6d28d9";
export const PROG_DARK = "#2e1065";

export type Lang = "js" | "python" | "lua" | "java" | "html" | "css" | "text";

const LANG_NAME: Record<Lang, string> = { js: "JavaScript", python: "Python", lua: "Lua", java: "Java", html: "HTML", css: "CSS", text: "Algoritmo" };

const KEYWORDS: Record<Lang, string[]> = {
  js: ["let", "const", "var", "if", "else", "for", "while", "function", "return", "true", "false", "null", "undefined", "new", "of", "in", "typeof", "document", "console"],
  python: ["def", "return", "if", "elif", "else", "for", "while", "in", "range", "print", "input", "True", "False", "None", "and", "or", "not", "import", "from", "try", "except", "break", "len", "int", "str"],
  lua: ["local", "function", "end", "if", "then", "elseif", "else", "for", "do", "while", "repeat", "until", "return", "nil", "true", "false", "and", "or", "not", "print", "ipairs", "pairs"],
  java: ["public", "private", "class", "static", "void", "int", "double", "boolean", "char", "String", "new", "return", "if", "else", "for", "while", "this", "true", "false", "import", "final"],
  html: [],
  css: [],
  text: ["SE", "SENÃO", "REPITA", "VEZES", "FIM", "ENQUANTO"],
};

const COMMENT: Record<Lang, RegExp | null> = {
  js: /\/\/.*$/,
  java: /\/\/.*$/,
  python: /#.*$/,
  lua: /--.*$/,
  html: /<!--.*-->/,
  css: /\/\*.*\*\//,
  text: null,
};

const C = { kw: "#c4b5fd", str: "#86efac", num: "#fdba74", com: "#94a3b8", tag: "#f9a8d4", attr: "#fde68a", prop: "#7dd3fc", plain: "#e2e8f0", fn: "#67e8f9" };

/** Pinta uma linha de código (um destaque simples: palavras reservadas, textos, números e comentários). */
function paintLine(line: string, lang: Lang): ReactNode[] {
  const out: ReactNode[] = [];
  const comment = COMMENT[lang];
  let body = line;
  let tail: string | null = null;
  if (comment) {
    const m = line.match(comment);
    if (m && m.index !== undefined) {
      body = line.slice(0, m.index);
      tail = m[0];
    }
  }
  if (lang === "html") {
    const re = /(<\/?[\w-]+|\/?>)|([\w-]+)(?==)|("[^"]*")/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(body))) {
      if (m.index > last) out.push(<span key={out.length}>{body.slice(last, m.index)}</span>);
      const color = m[1] ? C.tag : m[2] ? C.attr : C.str;
      out.push(
        <span key={out.length} style={{ color }}>
          {m[0]}
        </span>,
      );
      last = m.index + m[0].length;
    }
    if (last < body.length) out.push(<span key={out.length}>{body.slice(last)}</span>);
  } else if (lang === "css") {
    const re = /([.#]?[\w-]+(?=\s*\{))|([\w-]+)(?=\s*:)|(#[0-9a-fA-F]{3,6}\b|\d+(?:px|em|%|s)?)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(body))) {
      if (m.index > last) out.push(<span key={out.length}>{body.slice(last, m.index)}</span>);
      const color = m[1] ? C.tag : m[2] ? C.prop : C.num;
      out.push(
        <span key={out.length} style={{ color }}>
          {m[0]}
        </span>,
      );
      last = m.index + m[0].length;
    }
    if (last < body.length) out.push(<span key={out.length}>{body.slice(last)}</span>);
  } else {
    const kws = KEYWORDS[lang];
    const re = /("[^"]*"|'[^']*'|`[^`]*`)|(\b\d+(?:\.\d+)?\b)|([A-Za-zÀ-ú_][\w]*)(\s*\()?|(\S)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(body))) {
      if (m.index > last) out.push(<span key={out.length}>{body.slice(last, m.index)}</span>);
      if (m[1]) out.push(<span key={out.length} style={{ color: C.str }}>{m[1]}</span>);
      else if (m[2]) out.push(<span key={out.length} style={{ color: C.num }}>{m[2]}</span>);
      else if (m[3]) {
        const isKw = kws.includes(m[3]);
        out.push(
          <span key={out.length} style={{ color: isKw ? C.kw : m[4] ? C.fn : C.plain, fontWeight: isKw ? 700 : 400 }}>
            {m[3]}
          </span>,
        );
        if (m[4]) out.push(<span key={out.length}>{m[4]}</span>);
      } else out.push(<span key={out.length}>{m[5]}</span>);
      last = m.index + m[0].length;
    }
    if (last < body.length) out.push(<span key={out.length}>{body.slice(last)}</span>);
  }
  if (tail) out.push(<span key={out.length} style={{ color: C.com, fontStyle: "italic" }}>{tail}</span>);
  return out;
}

/** O bloco de código colorido, com o nome da linguagem e os números das linhas. `highlight` acende uma linha. */
export function Code({ code, lang, highlight, title }: { code: string; lang: Lang; highlight?: number; title?: string }) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <div className="my-[0.4em] overflow-hidden rounded-lg border border-[#4c1d95] bg-[#1e1b4b] shadow-sm">
      <div className="flex items-center gap-[0.4em] bg-[#2e1065] px-[0.6em] py-[0.1em] text-[0.68em] font-bold text-[#c4b5fd]">
        <span className="flex gap-[0.25em]">
          <span className="inline-block h-[0.6em] w-[0.6em] rounded-full bg-[#f87171]" />
          <span className="inline-block h-[0.6em] w-[0.6em] rounded-full bg-[#facc15]" />
          <span className="inline-block h-[0.6em] w-[0.6em] rounded-full bg-[#4ade80]" />
        </span>
        <span className="flex-1">{title ?? LANG_NAME[lang]}</span>
      </div>
      <pre className="overflow-x-auto px-[0.5em] py-[0.35em] font-mono text-[0.74em] leading-[1.5] text-[#e2e8f0]">
        {lines.map((l, i) => (
          <div key={i} className="flex transition-colors" style={{ background: highlight === i ? "rgba(250,204,21,0.22)" : undefined }}>
            <span className="mr-[0.8em] w-[1.4em] shrink-0 select-none text-right text-[#6d6a9c]">{i + 1}</span>
            <span className="whitespace-pre">{paintLine(l, lang)}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}

/** O console: as linhas de saída de um programa. */
export function Console({ lines, title = "Saída" }: { lines: string[]; title?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#334155] bg-[#0f172a]">
      <div className="bg-[#1e293b] px-[0.6em] py-[0.05em] text-[0.66em] font-bold text-[#94a3b8]">▶ {title}</div>
      <pre className="min-h-[2.4em] px-[0.6em] py-[0.3em] font-mono text-[0.74em] leading-[1.45] text-[#86efac]">
        {lines.length ? lines.map((l, i) => <div key={i} className="cg-anim-fade">{l}</div>) : <span className="text-[#64748b]">(aperte ▶ Executar)</span>}
      </pre>
    </div>
  );
}

/**
 * O código que executa: ▶ Executar mostra a saída no console linha por linha,
 * como se o computador estivesse rodando o programa.
 */
export function RunCode({ code, lang, output, title }: { code: string; lang: Lang; output: string[]; title?: string }) {
  const [shown, setShown] = useState(0);
  const timer = useRef<number | null>(null);
  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);
  function run() {
    if (timer.current) window.clearInterval(timer.current);
    setShown(0);
    let n = 0;
    timer.current = window.setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= output.length && timer.current) window.clearInterval(timer.current);
    }, 350);
  }
  return (
    <div>
      <Code code={code} lang={lang} title={title} />
      <div className="flex items-start gap-[0.4em]">
        <button type="button" onClick={run} className="shrink-0 rounded-full px-[0.8em] py-[0.15em] text-[0.8em] font-black text-white shadow" style={{ background: PROG }}>
          ▶ Executar
        </button>
        <div className="min-w-0 flex-1">
          <Console lines={output.slice(0, shown)} />
        </div>
      </div>
    </div>
  );
}

/** A moldura das figuras de tocar, com o título em cima. */
export function Panel({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      {title && <p className="mb-[0.3em] text-center text-[0.78em] font-bold uppercase tracking-wider text-[#8a7146]">{title}</p>}
      {children}
    </div>
  );
}

/** Um botão pequeno das figuras de tocar (aceso quando `on`). */
export function Pill({ on = false, onClick, children, color = PROG }: { on?: boolean; onClick: () => void; children: ReactNode; color?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border px-[0.7em] py-[0.1em] text-[0.82em] font-bold transition-colors"
      style={on ? { background: color, borderColor: color, color: "#fff" } : { background: "#fff", borderColor: "#d9c79d", color: "#3b2a14" }}
    >
      {children}
    </button>
  );
}

/** Um controle deslizante com o rótulo e o valor. */
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  format,
  labelWidth = "5.5em",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  labelWidth?: string;
}) {
  return (
    <label className="flex items-center gap-[0.5em] text-[0.82em] font-bold text-[#3b2a14]">
      <span className="shrink-0" style={{ width: labelWidth }}>
        {label}
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="min-w-0 flex-1 accent-[#6d28d9]" />
      <span className="w-[3.6em] shrink-0 text-right tabular-nums" style={{ color: PROG_DARK }}>
        {format ? format(value) : value.toLocaleString("pt-BR")}
      </span>
    </label>
  );
}
