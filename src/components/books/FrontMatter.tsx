"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Emblem, TOME_STYLE } from "@/components/library/SubjectTome";
import WizardDanilo from "@/components/WizardDanilo";
import type { SubjectId } from "@/engine/subjects";
import { H, P, TableOfContents } from "./BookParts";

// ============================================================================
// AS PÁGINAS DE ABERTURA E DE FECHAMENTO DE TODO LIVRO — a folha de rosto (o
// emblema da matéria girando no medalhão), a carta do Mago Danilo, o "como
// usar este livro", o sumário e, no fim, os parabéns com o caminho pras
// missões da matéria, a linha do tempo e a contracapa.
// ============================================================================

function Medallion({ subject, size = "7em" }: { subject: SubjectId; size?: string }) {
  const style = TOME_STYLE[subject];
  return (
    <svg viewBox="-60 -60 120 120" style={{ width: size, height: size }} aria-hidden="true">
      <circle r="56" fill={style.glow} opacity="0.25" className="cg-anim-glow" />
      <g className="cg-anim-spin-slow">
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d="M0 -54 L3 -46 L-3 -46 Z" fill="#d97706" transform={`rotate(${i * 22.5})`} />
        ))}
      </g>
      <circle r="44" fill={style.dark} stroke="#d97706" strokeWidth="4" />
      <circle r="39" fill="none" stroke="#fde68a" strokeWidth="1" strokeDasharray="3 3" />
      <g transform="scale(1.9)">
        <Emblem id={subject} />
      </g>
    </svg>
  );
}

/** A folha de rosto: o medalhão, o título e a Biblioteca da Academia. */
export function TitlePage({ subject, title, subtitle }: { subject: SubjectId; title: string; subtitle: string }) {
  const [name, rest] = title.split(":");
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[0.8em] px-[4%] text-center">
      <p className="cg-book-title text-[0.75em] font-bold uppercase tracking-[0.3em] text-[#8a7146]">Biblioteca Virtual da Academia CodeGuilds</p>
      <div className="flex items-center gap-3" style={{ color: "var(--bk-accent)" }} aria-hidden="true">
        <span className="h-px w-16 bg-current" />✦<span className="h-px w-16 bg-current" />
      </div>
      <div className="cg-anim-pop">
        <Medallion subject={subject} size="9em" />
      </div>
      <h1 className="cg-book-title text-[2.6em] font-black uppercase leading-none tracking-wide" style={{ color: "var(--bk-dark)" }}>
        {name}
      </h1>
      {rest && <p className="cg-book-title -mt-[0.3em] text-[1.4em] font-bold" style={{ color: "var(--bk-accent)" }}>{rest.trim()}</p>}
      <p className="text-[1em] italic text-[#5b4a2e]">{subtitle}</p>
      <div className="mt-[0.5em] flex items-center gap-3" style={{ color: "var(--bk-accent)" }} aria-hidden="true">
        <span className="h-px w-10 bg-current" />❦<span className="h-px w-10 bg-current" />
      </div>
      <p className="text-[0.8em] font-semibold uppercase tracking-[0.2em] text-[#8a7146]">Ensino Fundamental e Médio</p>
    </div>
  );
}

/** A carta do Mago Danilo pro aluno, com o "como usar este livro". */
export function LetterPage({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="flex items-end gap-[0.6em]">
        <div className="cg-anim-float h-[7.5em] w-[5.5em] shrink-0">
          <WizardDanilo mouthOpen={false} burstKey={0} className="h-full w-auto" />
        </div>
        <div>
          <p className="cg-book-title text-[0.75em] font-bold uppercase tracking-[0.2em] text-[#8a7146]">Uma carta para você</p>
          <h2 className="cg-book-title text-[1.4em] font-black leading-tight" style={{ color: "var(--bk-dark)" }}>
            Querido aprendiz,
          </h2>
        </div>
      </div>
      <div className="mt-[0.5em] text-justify leading-[1.6]">{children}</div>
      <p className="cg-book-title mt-[0.4em] text-right font-bold italic" style={{ color: "var(--bk-dark)" }}>
        — Mago Danilo
      </p>
      <div className="mt-[0.7em] rounded-xl border border-[#d9c79d] bg-[#fffaf0] px-[0.9em] py-[0.6em] text-[0.86em] leading-[1.45]">
        <p className="cg-book-title mb-[0.3em] font-black" style={{ color: "var(--bk-dark)" }}>
          Como usar este livro
        </p>
        <ul className="grid grid-cols-2 gap-x-[0.8em] gap-y-[0.2em]">
          <li>💡 <strong>Você sabia?</strong> curiosidades</li>
          <li>⚠️ <strong>Atenção</strong> cuidados e erros comuns</li>
          <li>🔍 <strong>Experimente</strong> atividades práticas</li>
          <li>📌 <strong>Para lembrar</strong> o essencial</li>
          <li>🧙 <strong>Dica do Mago</strong> truques pra entender</li>
          <li>✏️ <strong>Teste rápido</strong> no fim de cada capítulo</li>
          <li className="col-span-2">👆 Algumas figuras são de tocar: experimente clicar nelas!</li>
          <li className="col-span-2">❮ ❯ Vire as páginas pelos botões, pelas setas do teclado ou arrastando o dedo.</li>
        </ul>
      </div>
    </div>
  );
}

/** O sumário (em duas páginas: os capítulos de `from` até `to`). */
export function TocPage({ from, to, first }: { from: number; to: number; first?: boolean }) {
  return (
    <div>
      <h2 className="cg-book-title mb-[0.5em] text-center text-[1.6em] font-black uppercase tracking-wider" style={{ color: "var(--bk-dark)" }}>
        {first ? "Sumário" : "Sumário (continuação)"}
      </h2>
      {first && <p className="mb-[0.6em] text-center text-[0.82em] italic text-[#6b5a3a]">Toque num capítulo para ir direto até ele.</p>}
      <TableOfContents from={from} to={to} />
    </div>
  );
}

/** A linha do tempo da matéria: as grandes descobertas do livro, em ordem (antes dos parabéns). */
export function TimelinePage({ subject, items }: { subject: string; items: readonly (readonly [string, string])[] }) {
  return (
    <div>
      <H icon="⏳">A linha do tempo da {subject}</H>
      <P>Algumas das descobertas que você conheceu neste livro, em ordem:</P>
      <ol className="relative ml-[0.6em] border-l-[3px] pl-[1.1em]" style={{ borderColor: "var(--bk-accent)" }}>
        {items.map(([year, text], i) => (
          <li key={year + text} className="cg-anim-rise relative mb-[0.45em]" style={{ animationDelay: `${i * 0.08}s` }}>
            <span className="absolute -left-[1.62em] top-[0.2em] h-[0.9em] w-[0.9em] rounded-full border-2 border-white" style={{ background: "var(--bk-accent)" }} />
            <span className="cg-book-title mr-[0.4em] font-black" style={{ color: "var(--bk-dark)" }}>
              {year}
            </span>
            <span className="text-[0.92em]">{text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** O fim do livro: os parabéns do Mago e o caminho pras missões da matéria. */
export function EndPage({ subject, name }: { subject: SubjectId; name: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[0.7em] text-center">
      <div className="cg-anim-float h-[10em]">
        <WizardDanilo mouthOpen={false} burstKey={0} className="h-full w-auto" />
      </div>
      <h2 className="cg-book-title text-[1.7em] font-black leading-tight" style={{ color: "var(--bk-dark)" }}>
        Parabéns, aprendiz!
      </h2>
      <p className="max-w-[26em] leading-[1.6]">
        Você chegou ao fim do livro de {name}. Agora é hora de provar o que aprendeu: as missões do tomo de {name} estão esperando por você, com XP, moedas e itens de
        recompensa!
      </p>
      <Link
        href={`/academia/missoes/${subject}`}
        className="cg-book-title rounded-full px-[1.3em] py-[0.5em] text-[0.95em] font-black text-white shadow-lg transition-transform hover:scale-105"
        style={{ background: "var(--bk-accent)" }}
      >
        ⚔️ Ir para as missões de {name}
      </Link>
      <p className="text-[0.8em] italic text-[#6b5a3a]">Pode voltar a este livro sempre que quiser revisar.</p>
    </div>
  );
}

/** A contracapa (o verso da última folha). */
export function BackPage({ subject }: { subject: SubjectId }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[0.8em] text-center">
      <Medallion subject={subject} size="6em" />
      <p className="cg-book-title text-[1.2em] font-black uppercase tracking-[0.3em]" style={{ color: "var(--bk-dark)" }}>
        Fim
      </p>
      <p className="max-w-[22em] text-[0.85em] italic leading-[1.5] text-[#6b5a3a]">
        &ldquo;Quem lê aprende duas vezes: quando lê e quando ensina o que leu a um amigo.&rdquo;
      </p>
      <p className="text-[0.75em] font-semibold uppercase tracking-[0.2em] text-[#8a7146]">Academia CodeGuilds</p>
    </div>
  );
}
