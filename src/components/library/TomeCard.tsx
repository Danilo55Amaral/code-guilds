"use client";

import Link from "next/link";
import SubjectTome, { TOME_LABEL, TOME_STYLE, TomeId } from "./SubjectTome";

// ============================================================================
// O CARD DE UMA MATÉRIA NA BIBLIOTECA DE MISSÕES — o tomo flutuando com o
// brilho da cor da matéria, o nome escrito nele, a barra de progresso e
// quantas missões faltam. Matéria sem missão fica apagada ("Em breve"); a
// terminada ganha a fita de "Dominada".
// ============================================================================

export default function TomeCard({
  id,
  name,
  tagline,
  total,
  done,
  href,
  delay = 0,
}: {
  id: TomeId;
  name: string;
  tagline: string;
  total: number;
  done: number;
  href: string;
  /** atraso da animação de entrada e da flutuação (cada card num tempo) */
  delay?: number;
}) {
  const style = TOME_STYLE[id];
  const label = TOME_LABEL[style.kind];
  const empty = total === 0;
  const complete = !empty && done === total;
  const left = total - done;
  // A letra do nome acompanha o tamanho do tomo (cqw = % da largura do desenho) e encolhe até a
  // palavra mais comprida caber inteira na plaquinha (cada letra maiúscula ocupa uns 0,78 do tamanho).
  const room = 100 - parseFloat(label.left) - parseFloat(label.right);
  const longest = Math.max(...name.split(/\s+/).map((w) => w.length));
  const fit = Math.min(8, room / (0.78 * longest));

  const body = (
    <>
      {/* o tomo flutuando, com o brilho atrás */}
      <div className="relative mx-auto aspect-[4/5] w-full max-w-[230px]" style={{ containerType: "inline-size" }}>
        <div
          className="cg-anim-glow-pulse pointer-events-none absolute inset-[12%] rounded-full blur-2xl"
          style={{ background: style.glow, opacity: empty ? 0.12 : 0.4, animationDelay: `${delay}s` }}
        />
        <div className="cg-anim-float h-full" style={{ animationDelay: `${delay * 1.7}s` }}>
          <div className={`relative h-full transition-transform duration-300 ${empty ? "grayscale-[0.6]" : "group-hover:-translate-y-1.5 group-hover:-rotate-2 group-hover:scale-[1.04]"}`}>
            <SubjectTome id={id} className="h-full w-full" />
            <div
              lang="pt-BR"
              className="absolute flex items-center justify-center text-center font-serif font-black uppercase leading-tight"
              style={{
                left: label.left,
                right: label.right,
                top: label.top,
                bottom: label.bottom,
                color: label.ink,
                textShadow: label.shadow,
                fontSize: `clamp(8px, ${fit.toFixed(2)}cqw, 15px)`,
                letterSpacing: "0.02em",
                overflowWrap: "break-word",
              }}
            >
              {name}
            </div>
          </div>
        </div>
        {complete && (
          <span className="absolute -right-1 top-3 rotate-6 rounded-md border border-amber-300/80 bg-gradient-to-r from-amber-500 to-yellow-300 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-950 shadow-lg">
            ✓ Dominada
          </span>
        )}
        {empty && (
          <span className="absolute -right-1 top-3 rotate-6 rounded-md border border-slate-500/70 bg-slate-800/90 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-200">
            Em breve
          </span>
        )}
      </div>

      {/* progresso */}
      <div className="mt-3 w-full">
        <p className="line-clamp-2 min-h-[2rem] text-center text-[11px] leading-snug text-amber-100/70">{tagline}</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/50">
          <div className="h-full rounded-full transition-all" style={{ width: `${empty ? 0 : (done / total) * 100}%`, background: style.glow, boxShadow: `0 0 10px ${style.glow}` }} />
        </div>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-1 text-[11px]">
          <span className="font-semibold text-amber-50/90">{empty ? "Nenhuma missão ainda" : `${done} de ${total} concluídas`}</span>
          {!empty && (
            <span className={`font-semibold ${complete ? "text-emerald-300" : "text-amber-300"}`}>{complete ? "🏆 Completa" : `🔥 ${left} pra fazer`}</span>
          )}
        </div>
      </div>
    </>
  );

  const frame = "cg-dark-scope group relative flex flex-col rounded-3xl border p-3 sm:p-4 cg-anim-pop";
  const frameStyle = {
    animationDelay: `${delay}s`,
    background: "linear-gradient(180deg, rgba(41,24,12,0.95) 0%, rgba(20,12,6,0.98) 100%)",
    borderColor: empty ? "rgba(100,116,139,0.35)" : `${style.glow}55`,
    boxShadow: empty ? undefined : `0 18px 50px -28px ${style.glow}`,
  };

  if (empty) {
    return (
      <div className={`${frame} cursor-default opacity-80`} style={frameStyle} title="O professor ainda não criou missões dessa matéria">
        {body}
      </div>
    );
  }
  return (
    <Link href={href} className={`${frame} transition-shadow hover:shadow-2xl`} style={frameStyle}>
      {body}
      <span className="mt-3 rounded-full border border-amber-300/40 bg-amber-400/10 py-1.5 text-center text-xs font-bold text-amber-100 transition-colors group-hover:bg-amber-400/25">
        📖 Abrir o tomo
      </span>
    </Link>
  );
}
