"use client";

import { ReactNode, useState } from "react";

// ============================================================================
// AS PEÇAS DO LIVRO DE LÍNGUA PORTUGUESA — o joguinho de escolher a resposta
// (vários capítulos usam), o livro aberto com as páginas virando, a pena
// escrevendo, o balão de fala e as letrinhas de madeira.
// ============================================================================

export interface ChoiceItem {
  prompt: ReactNode; // a pergunta (ou a frase pra analisar)
  options: string[];
  answer: number; // o índice da opção certa
  explain: ReactNode; // aparece quando o aluno acerta
}

/**
 * O joguinho de escolher: uma pergunta de cada vez, com as opções em botões.
 * Errou, ganha uma dica pra tentar de novo; acertou, vê a explicação e passa.
 */
export function ChoiceGame({ items, color = "#7c3aed", title }: { items: ChoiceItem[]; color?: string; title?: string }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [hits, setHits] = useState(0);
  const [missed, setMissed] = useState(false);
  const done = index >= items.length;
  const item = items[Math.min(index, items.length - 1)];
  const right = picked === item.answer;

  function pick(i: number) {
    if (done || right) return;
    setPicked(i);
    if (i === item.answer && !missed) setHits((h) => h + 1);
    if (i !== item.answer) setMissed(true);
  }

  function next() {
    setIndex((i) => i + 1);
    setPicked(null);
    setMissed(false);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setHits(0);
    setMissed(false);
  }

  return (
    <div className="rounded-xl border border-[#d9c79d] bg-[#fffaf0] p-[0.6em]">
      {title && <p className="mb-[0.2em] text-center text-[0.78em] font-bold uppercase tracking-wider text-[#8a7146]">{title}</p>}
      {done ? (
        <div className="cg-anim-pop py-[0.4em] text-center">
          <p className="text-[1.8em]">🏅</p>
          <p className="cg-book-title font-black" style={{ color }}>
            Você acertou {hits} de {items.length} de primeira!
          </p>
          <button type="button" onClick={restart} className="mt-[0.3em] rounded-full border px-[0.9em] py-[0.1em] text-[0.85em] font-bold" style={{ borderColor: color, color }}>
            Jogar de novo
          </button>
        </div>
      ) : (
        <div key={index} className="cg-anim-fade">
          <p className="text-[0.75em] font-bold text-[#8a7146]">
            {index + 1} de {items.length}
          </p>
          <p className="text-[0.95em] font-bold leading-[1.4] text-[#2b2113]">{item.prompt}</p>
          <div className="mt-[0.35em] flex flex-wrap gap-[0.3em]">
            {item.options.map((opt, i) => {
              const state = picked === null ? "idle" : i === item.answer && right ? "right" : i === picked ? "wrong" : "idle";
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => pick(i)}
                  className={`rounded-lg border px-[0.7em] py-[0.2em] text-[0.88em] font-bold transition-colors ${
                    state === "right" ? "border-[#16a34a] bg-[#16a34a] text-white" : state === "wrong" ? "border-[#e11d48] bg-[#ffe4e6] text-[#9f1239]" : "border-[#d9c79d] bg-white hover:bg-[#f5f3ff]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {picked !== null && !right && <p className="mt-[0.3em] text-[0.82em] font-bold text-[#9f1239]">Ainda não. Tente outra opção!</p>}
          {right && (
            <div className="cg-anim-fade mt-[0.35em] flex flex-wrap items-center justify-between gap-[0.4em] rounded-lg bg-[#f0fdf4] px-[0.6em] py-[0.3em] text-[0.85em] text-[#14532d]">
              <span className="min-w-0 flex-1">✅ {item.explain}</span>
              <button type="button" onClick={next} className="rounded-full px-[0.8em] py-[0.1em] text-[0.9em] font-black text-white" style={{ background: color }}>
                {index + 1 < items.length ? "Próxima ➜" : "Ver resultado"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** O livro aberto com uma página virando sem parar (o centro da lombada em x, y). */
export function OpenBook({ x, y, s = 1, cover = "#7c3aed" }: { x: number; y: number; s?: number; cover?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-104 6 L0 18 L104 6 L104 -64 L0 -52 L-104 -64 Z" fill={cover} />
      <path d="M-96 0 Q-48 -10 0 10 L0 -58 Q-48 -78 -96 -68 Z" fill="#fffbeb" stroke="#d6b77a" />
      <path d="M96 0 Q48 -10 0 10 L0 -58 Q48 -78 96 -68 Z" fill="#fffbeb" stroke="#d6b77a" />
      {[-46, -36, -26, -16].map((ly) => (
        <g key={ly}>
          <path d={`M-84 ${ly} Q-44 ${ly - 8} -10 ${ly + 6}`} stroke="#c8b48a" strokeWidth="2" fill="none" />
          <path d={`M10 ${ly + 6} Q44 ${ly - 8} 84 ${ly}`} stroke="#c8b48a" strokeWidth="2" fill="none" />
        </g>
      ))}
      {/* a página virando */}
      <path fill="#fef3c7" stroke="#d6b77a">
        <animate
          attributeName="d"
          values="M0 10 Q48 -10 96 0 L96 -68 Q48 -78 0 -58 Z;M0 10 Q10 -30 10 -50 L10 -110 Q10 -90 0 -58 Z;M0 10 Q-48 -10 -96 0 L-96 -68 Q-48 -78 0 -58 Z;M0 10 Q-48 -10 -96 0 L-96 -68 Q-48 -78 0 -58 Z"
          keyTimes="0;0.25;0.5;1"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate attributeName="opacity" values="1;1;1;0" keyTimes="0;0.5;0.55;1" dur="4s" repeatCount="indefinite" />
      </path>
    </g>
  );
}

/** A pena de escrever (a ponta em x, y), balançando como se escrevesse. */
export function Quill({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g>
        <animateTransform attributeName="transform" type="rotate" values="-6;6;-6" dur="1.2s" repeatCount="indefinite" />
        <path d="M0 0 L6 -10 C30 -40 60 -80 70 -110 C40 -96 14 -60 4 -20 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
        <path d="M2 -6 L60 -100" stroke="#94a3b8" strokeWidth="1.2" />
        <path d="M0 0 L4 -10 L8 -8 Z" fill="#1e293b" />
      </g>
    </g>
  );
}

/** Um balão de fala (a ponta embaixo, à esquerda), com o texto dentro. */
export function Balloon({ x, y, w, h, text, color = "#fff", ink = "#1e293b", size = 14 }: { x: number; y: number; w: number; h: number; text: string; color?: string; ink?: string; size?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={h} rx={h / 2.4} fill={color} stroke="#1e293b" strokeWidth="2" />
      <path d={`M${w * 0.18} ${h - 1} L${w * 0.12} ${h + 16} L${w * 0.32} ${h - 1} Z`} fill={color} stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
      <rect x={w * 0.17} y={h - 4} width={w * 0.16} height="6" fill={color} />
      <text x={w / 2} y={h / 2 + size * 0.35} textAnchor="middle" fontSize={size} fontWeight="900" fill={ink} fontFamily="Georgia, serif">
        {text}
      </text>
    </g>
  );
}

/** Uma fileira de letrinhas de madeira (o canto em x, y), pulando uma de cada vez. */
export function LetterTiles({ x, y, word, s = 34, color = "#fde68a" }: { x: number; y: number; word: string; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from(word).map((ch, i) => (
        <g key={i} transform={`translate(${i * (s + 4)} 0)`}>
          <g>
            <animateTransform attributeName="transform" type="translate" values="0 0;0 -8;0 0;0 0" keyTimes="0;0.08;0.16;1" dur={`${word.length * 0.35}s`} begin={`${i * 0.35}s`} repeatCount="indefinite" />
            <rect width={s} height={s} rx={s * 0.15} fill={color} stroke="#a16207" strokeWidth="2" />
            <text x={s / 2} y={s * 0.7} textAnchor="middle" fontSize={s * 0.6} fontWeight="900" fill="#78350f" fontFamily="Georgia, serif">
              {ch}
            </text>
          </g>
        </g>
      ))}
    </g>
  );
}
