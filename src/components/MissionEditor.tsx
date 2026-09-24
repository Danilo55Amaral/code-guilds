"use client";

import { useState } from "react";
import { Mission, MissionContent, Difficulty, Rarity, DIFFICULTY_META, RARITY_META, RARITY_DEFAULT_VALUE, DEFAULT_ITEM_ICON, ITEM_DESCRIPTION_MAX_LENGTH } from "@/engine/missions";
import { Teacher } from "@/engine/teachers";
import ItemEconomyFields from "./ItemEconomyFields";
import EmojiPicker from "./EmojiPicker";

type OptionKey = "a" | "b" | "c" | "d";

interface QuestionDraft {
  prompt: string;
  code: string;
  options: Record<OptionKey, string>;
  correctOptionId: OptionKey;
  explanation: string;
}

interface MissionDraft {
  title: string;
  icon: string;
  difficulty: Difficulty;
  minLevel: number;
  description: string;
  rewardXp: number;
  rewardCoins: number;
  rewardItemName: string;
  rewardItemIcon: string;
  rewardItemDescription: string;
  rewardItemRarity: Rarity;
  rewardItemValue: number;
  rewardItemXp: number;
  questions: QuestionDraft[];
}

const OPTION_KEYS: OptionKey[] = ["a", "b", "c", "d"];

function emptyQuestion(): QuestionDraft {
  return { prompt: "", code: "", options: { a: "", b: "", c: "", d: "" }, correctOptionId: "a", explanation: "" };
}

function emptyDraft(): MissionDraft {
  return {
    title: "",
    icon: "🧩",
    difficulty: "iniciante",
    minLevel: 1,
    description: "",
    rewardXp: 100,
    rewardCoins: 50,
    rewardItemName: "",
    rewardItemIcon: DEFAULT_ITEM_ICON,
    rewardItemDescription: "",
    rewardItemRarity: "comum",
    rewardItemValue: RARITY_DEFAULT_VALUE.comum,
    rewardItemXp: 0,
    questions: [emptyQuestion()],
  };
}

function missionToDraft(m: Mission): MissionDraft {
  return {
    title: m.title,
    icon: m.icon,
    difficulty: m.difficulty,
    minLevel: m.minLevel,
    description: m.description,
    rewardXp: m.rewardXp,
    rewardCoins: m.rewardCoins,
    rewardItemName: m.rewardItem.name,
    rewardItemIcon: m.rewardItem.icon,
    rewardItemDescription: m.rewardItem.description,
    rewardItemRarity: m.rewardItem.rarity,
    rewardItemValue: m.rewardItem.value,
    rewardItemXp: m.rewardItem.xp,
    questions: m.questions.map((q) => ({
      prompt: q.prompt,
      code: q.code ?? "",
      options: {
        a: q.options.find((o) => o.id === "a")?.text ?? q.options[0]?.text ?? "",
        b: q.options.find((o) => o.id === "b")?.text ?? q.options[1]?.text ?? "",
        c: q.options.find((o) => o.id === "c")?.text ?? q.options[2]?.text ?? "",
        d: q.options.find((o) => o.id === "d")?.text ?? q.options[3]?.text ?? "",
      },
      correctOptionId: (OPTION_KEYS.includes(q.correctOptionId as OptionKey) ? q.correctOptionId : "a") as OptionKey,
      explanation: q.explanation,
    })),
  };
}

function draftToMission(d: MissionDraft): MissionContent {
  return {
    title: d.title.trim(),
    icon: d.icon.trim() || "🧩",
    difficulty: d.difficulty,
    minLevel: d.minLevel,
    description: d.description.trim(),
    rewardXp: d.rewardXp,
    rewardCoins: d.rewardCoins,
    rewardItem: {
      name: d.rewardItemName.trim() || "Item Misterioso",
      icon: d.rewardItemIcon.trim() || DEFAULT_ITEM_ICON,
      description: d.rewardItemDescription.trim().slice(0, ITEM_DESCRIPTION_MAX_LENGTH),
      rarity: d.rewardItemRarity, value: d.rewardItemValue, xp: d.rewardItemXp },
    questions: d.questions.map((q, i) => ({
      id: `q${i + 1}`,
      prompt: q.prompt.trim(),
      code: q.code.trim() || undefined,
      options: OPTION_KEYS.map((k) => ({ id: k, text: q.options[k] })),
      correctOptionId: q.correctOptionId,
      explanation: q.explanation.trim(),
    })),
  };
}

function draftIsValid(d: MissionDraft): boolean {
  if (!d.title.trim() || !d.description.trim() || !d.rewardItemName.trim() || !d.rewardItemDescription.trim()) return false;
  if (d.questions.length === 0) return false;
  return d.questions.every(
    (q) => q.prompt.trim() && q.explanation.trim() && OPTION_KEYS.every((k) => q.options[k].trim())
  );
}

export default function MissionEditor({
  existingMission,
  teachers,
  defaultTeacherId,
  onSave,
  onDelete,
  onClose,
}: {
  existingMission?: Mission;
  /** Só o Painel ADM passa: mostra a escolha do professor dono da missão. */
  teachers?: Teacher[];
  defaultTeacherId?: string;
  /** teacherId só vem quando `teachers` foi passado. */
  onSave: (data: MissionContent, teacherId?: string) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<MissionDraft>(existingMission ? missionToDraft(existingMission) : emptyDraft());
  const [teacherId, setTeacherId] = useState(existingMission?.teacherId ?? defaultTeacherId ?? teachers?.[0]?.id ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function updateQuestion(index: number, patch: Partial<QuestionDraft>) {
    setDraft((d) => ({ ...d, questions: d.questions.map((q, i) => (i === index ? { ...q, ...patch } : q)) }));
  }

  function updateOption(index: number, key: OptionKey, value: string) {
    setDraft((d) => ({
      ...d,
      questions: d.questions.map((q, i) => (i === index ? { ...q, options: { ...q.options, [key]: value } } : q)),
    }));
  }

  function addQuestion() {
    setDraft((d) => ({ ...d, questions: [...d.questions, emptyQuestion()] }));
  }

  function removeQuestion(index: number) {
    setDraft((d) => ({ ...d, questions: d.questions.filter((_, i) => i !== index) }));
  }

  function handleSave() {
    if (!draftIsValid(draft)) return;
    onSave(draftToMission(draft), teachers ? teacherId : undefined);
  }

  const valid = draftIsValid(draft);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="cg-card flex max-h-[90vh] w-full max-w-2xl flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-bold text-white">{existingMission ? "Editar Missão" : "Nova Missão"}</h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {teachers && (
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Professor responsável</label>
                <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="cg-input">
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.email})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-500">Só os alunos desse professor veem a missão.</p>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Título</label>
              <input value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="Ex: Recursão Amaldiçoada" className="cg-input" />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Ícone</label>
              <EmojiPicker value={draft.icon} onChange={(icon) => setDraft((d) => ({ ...d, icon }))} />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Nível mínimo</label>
              <input
                type="number"
                min={1}
                value={draft.minLevel}
                onChange={(e) => setDraft((d) => ({ ...d, minLevel: Number(e.target.value) }))}
                className="cg-input"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Dificuldade</label>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(DIFFICULTY_META) as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, difficulty: diff }))}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      draft.difficulty === diff ? "border-white bg-white text-cg-ink" : "border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {DIFFICULTY_META[diff].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Descrição curta</label>
              <input
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                placeholder="Ex: Domine chamadas recursivas sem estourar a pilha"
                className="cg-input"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Recompensa: XP</label>
              <input
                type="number"
                min={0}
                value={draft.rewardXp}
                onChange={(e) => setDraft((d) => ({ ...d, rewardXp: Number(e.target.value) }))}
                className="cg-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Recompensa: Moedas</label>
              <input
                type="number"
                min={0}
                value={draft.rewardCoins}
                onChange={(e) => setDraft((d) => ({ ...d, rewardCoins: Number(e.target.value) }))}
                className="cg-input"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Item — nome</label>
              <input
                value={draft.rewardItemName}
                onChange={(e) => setDraft((d) => ({ ...d, rewardItemName: e.target.value }))}
                placeholder="Ex: Cajado da Pilha Infinita"
                className="cg-input"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Item — raridade</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.keys(RARITY_META) as Rarity[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, rewardItemRarity: r }))}
                    title={`Valor sugerido: ${RARITY_DEFAULT_VALUE[r]} moedas`}
                    className={`rounded-lg border px-1.5 py-2 text-[11px] font-medium transition-colors ${
                      draft.rewardItemRarity === r ? "border-white bg-white text-cg-ink" : "border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {RARITY_META[r].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              <ItemEconomyFields
                value={draft.rewardItemValue}
                xp={draft.rewardItemXp}
                onChange={(patch) =>
                  setDraft((d) => ({
                    ...d,
                    ...(patch.value !== undefined && { rewardItemValue: patch.value }),
                    ...(patch.xp !== undefined && { rewardItemXp: patch.xp }),
                  }))
                }
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Item — descrição</label>
              <textarea
                value={draft.rewardItemDescription}
                onChange={(e) => setDraft((d) => ({ ...d, rewardItemDescription: e.target.value }))}
                maxLength={ITEM_DESCRIPTION_MAX_LENGTH}
                rows={2}
                placeholder="Ex: Um cajado que nunca estoura a pilha. Aparece quando o aluno clica no item."
                className="cg-input resize-y"
              />
              <p className="mt-1 text-right text-[11px] text-slate-500">
                {draft.rewardItemDescription.length}/{ITEM_DESCRIPTION_MAX_LENGTH}
              </p>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Item — ícone</label>
              <EmojiPicker value={draft.rewardItemIcon} onChange={(rewardItemIcon) => setDraft((d) => ({ ...d, rewardItemIcon }))} defaultGroup="Itens" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-300">Perguntas ({draft.questions.length})</p>
            <button type="button" onClick={addQuestion} className="cg-btn-secondary !px-3 !py-1.5 text-xs">
              + Adicionar pergunta
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-4">
            {draft.questions.map((q, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-cg-sunken p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-400">Pergunta {i + 1}</p>
                  {draft.questions.length > 1 && (
                    <button type="button" onClick={() => removeQuestion(i)} className="text-xs text-rose-400 hover:text-rose-300">
                      Remover
                    </button>
                  )}
                </div>

                <textarea
                  value={q.prompt}
                  onChange={(e) => updateQuestion(i, { prompt: e.target.value })}
                  placeholder="Enunciado da pergunta"
                  rows={2}
                  className="cg-input mb-2 resize-none"
                />
                <textarea
                  value={q.code}
                  onChange={(e) => updateQuestion(i, { code: e.target.value })}
                  placeholder="Trecho de código (opcional)"
                  rows={2}
                  className="cg-input mb-2 resize-none font-mono text-xs"
                />

                <div className="mb-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {OPTION_KEYS.map((k) => (
                    <div key={k} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuestion(i, { correctOptionId: k })}
                        title="Marcar como correta"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                          q.correctOptionId === k ? "border-emerald-500 bg-emerald-500/20 text-emerald-300" : "border-slate-700 text-slate-500"
                        }`}
                      >
                        {k.toUpperCase()}
                      </button>
                      <input
                        value={q.options[k]}
                        onChange={(e) => updateOption(i, k, e.target.value)}
                        placeholder={`Opção ${k.toUpperCase()}`}
                        className="cg-input !py-2"
                      />
                    </div>
                  ))}
                </div>
                <p className="mb-2 text-[11px] text-slate-600">Clique na letra pra marcar qual opção é a correta.</p>

                <textarea
                  value={q.explanation}
                  onChange={(e) => updateQuestion(i, { explanation: e.target.value })}
                  placeholder="Explicação mostrada após responder"
                  rows={2}
                  className="cg-input resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-800 px-6 py-4">
          {existingMission && onDelete ? (
            <button
              type="button"
              onClick={() => (confirmDelete ? onDelete() : setConfirmDelete(true))}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                confirmDelete ? "border-rose-400 bg-rose-400/20 text-rose-200" : "border-rose-500/30 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10"
              }`}
            >
              {confirmDelete ? "Confirmar exclusão?" : "🗑 Excluir missão"}
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={handleSave}
            disabled={!valid}
            title={valid ? undefined : "Preencha título, descrição, nome e descrição do item e todas as perguntas (enunciado, 4 opções e explicação)."}
            className="cg-btn-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            {existingMission ? "Salvar alterações" : "Criar missão"}
          </button>
        </div>
      </div>
    </div>
  );
}
