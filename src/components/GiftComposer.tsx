"use client";

import { useState } from "react";
import { Student } from "@/engine/students";
import { HOUSES, HouseId, getHouse } from "@/engine/houses";
import { Mission } from "@/engine/missions";
import { ShopItem } from "@/engine/shop";
import { GiftItem, Giver } from "@/engine/gifts";
import { useGifts } from "@/engine/store";
import GiftItemPicker from "./GiftItemPicker";

// ============================================================================
// PRESENTES EM MASSA — card do painel do professor (e da aba Alunos do Painel
// ADM): dá um item de uma vez pra todos os alunos ou pra todos de uma casa.
// Cada aluno ganha o próprio exemplar e a mensagem 🎁 Presente.
// ============================================================================

// "todos" = todos os alunos; senão, o id da casa.
type Target = "todos" | HouseId;

export default function GiftComposer({
  students,
  giver,
  shopItems,
  missions,
  isAdmin,
  scopeLabel,
  headerRight,
}: {
  /** Quem pode receber (professor: a turma dele; ADM: a plataforma toda ou a turma escolhida). */
  students: Student[];
  giver: Giver;
  shopItems: ShopItem[];
  missions: Mission[];
  isAdmin: boolean;
  /** Como chamar "todos" no botão (ex.: "Toda a turma", "Todos os alunos da plataforma"). */
  scopeLabel: string;
  headerRight?: React.ReactNode;
}) {
  const { give } = useGifts();
  const [target, setTarget] = useState<Target>("todos");
  const [pending, setPending] = useState<GiftItem | null>(null);
  const [result, setResult] = useState<{ text: string; tone: "ok" | "erro" } | null>(null);
  const [sending, setSending] = useState(false);

  const recipients = target === "todos" ? students : students.filter((s) => s.houseId === target);
  const targetLabel = target === "todos" ? scopeLabel.toLowerCase() : getHouse(target).name;

  const targets: { id: Target; label: string; count: number; colorClass: string }[] = [
    { id: "todos", label: `🎁 ${scopeLabel}`, count: students.length, colorClass: "text-violet-300" },
    ...HOUSES.map((h) => ({ id: h.id, label: h.name, count: students.filter((s) => s.houseId === h.id).length, colorClass: h.colorClass })),
  ];

  async function confirm() {
    if (!pending || sending) return;
    setSending(true);
    const outcome = await give(
      recipients.map((s) => s.id),
      pending,
      giver,
    );
    setSending(false);
    if (!outcome.ok) {
      setResult({ text: outcome.error, tone: "erro" });
      return;
    }
    const { delivered, waiting } = outcome;
    setResult({
      text:
        `${pending.icon} "${pending.name}" entregue para ${delivered} ${delivered === 1 ? "aluno" : "alunos"} (${targetLabel}).` +
        (waiting > 0 ? ` ${waiting} ${waiting === 1 ? "estava" : "estavam"} com o inventário cheio: o item ficou esperando espaço.` : "") +
        " A mensagem de presente já foi enviada.",
      tone: "ok",
    });
    setPending(null);
    setTimeout(() => setResult(null), 6000);
  }

  return (
    <div className="cg-card mb-6 p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-300">🎁 Presentes em massa</p>
          <p className="text-xs text-slate-500">Dê um item de uma vez pra todos os alunos ou pra todos de uma casa. Cada aluno ganha o seu e recebe a mensagem de presente.</p>
        </div>
        {headerRight}
      </div>

      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">Para quem</p>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {targets.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setTarget(t.id);
              setPending(null);
            }}
            className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
              target === t.id ? "border-white bg-white text-cg-ink" : `border-slate-700 hover:border-slate-500 ${t.colorClass}`
            }`}
          >
            {t.label} <span className="text-slate-500">({t.count})</span>
          </button>
        ))}
      </div>

      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">Qual item</p>
      <GiftItemPicker
        shopItems={shopItems}
        missions={missions}
        isAdmin={isAdmin}
        actionDisabled={recipients.length === 0}
        actionLabel={recipients.length === 0 ? "Nenhum aluno nesse grupo" : `🎁 Doar para ${recipients.length} ${recipients.length === 1 ? "aluno" : "alunos"}`}
        onGive={(item) => {
          setResult(null);
          setPending(item);
        }}
      />

      {pending && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/50 bg-amber-400/10 px-4 py-3">
          <p className="text-sm text-amber-100">
            Dar <span className="font-bold">
              {pending.icon} {pending.name}
            </span>{" "}
            pra {recipients.length} {recipients.length === 1 ? "aluno" : "alunos"} ({targetLabel})?
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPending(null)} className="cg-btn-secondary !px-3 !py-1.5 text-xs">
              Cancelar
            </button>
            <button
              onClick={confirm}
              disabled={sending}
              className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-black text-cg-onaccent transition-transform hover:scale-[1.03] disabled:cursor-wait disabled:opacity-50"
            >
              {sending ? "Entregando…" : "✅ Confirmar presente"}
            </button>
          </div>
        </div>
      )}

      {result && (
        <p
          className={`mt-3 rounded-xl border px-4 py-3 text-xs ${
            result.tone === "ok" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"
          }`}
        >
          {result.text}
        </p>
      )}
    </div>
  );
}
