"use client";

import { useState } from "react";
import {
  Mission,
  MissionContent,
  MissionKind,
  Difficulty,
  Rarity,
  SubmissionFileKind,
  DIFFICULTY_META,
  RARITY_META,
  RARITY_DEFAULT_VALUE,
  DEFAULT_ITEM_ICON,
  ITEM_DESCRIPTION_MAX_LENGTH,
  SUBMISSION_FILE_KINDS,
  SUBMISSION_FILE_TYPES,
} from "@/engine/missions";
import { Teacher } from "@/engine/teachers";
import { ShopItem } from "@/engine/shop";
import { Cosmetic } from "@/engine/avatar";
import ItemEconomyFields from "./ItemEconomyFields";
import EmojiPicker from "./EmojiPicker";
import ShopItemPicker from "./ShopItemPicker";
import { eventItemOfReward } from "@/engine/eventItems";
import { ItemStats, RarityBadge } from "./GameUI";
import { MULTIVERSE_KEY_ITEM } from "@/engine/multiverse";

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
  rewardItemCosmetic?: Cosmetic; // vem de um item de visual da Loja (só pelo Painel ADM)
  rewardItemSlots?: number; // vem de um item de espaço da Loja (só pelo Painel ADM)
  rewardItemMultiverse?: boolean; // Chave do Multiverso: usar abre a Sala do Multiverso
  questions: QuestionDraft[];
  // missão de entrega
  taskPrompt: string;
  allowText: boolean;
  allowFiles: boolean;
  fileKinds: SubmissionFileKind[];
}

const TASK_PROMPT_MAX = 3000;

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
    taskPrompt: "",
    allowText: true,
    allowFiles: true,
    fileKinds: [...SUBMISSION_FILE_KINDS],
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
    rewardItemCosmetic: m.rewardItem.cosmetic,
    rewardItemSlots: m.rewardItem.slots,
    rewardItemMultiverse: m.rewardItem.multiverse,
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
    taskPrompt: m.task?.prompt ?? "",
    allowText: m.task?.allowText ?? true,
    allowFiles: m.task?.allowFiles ?? true,
    fileKinds: m.task?.fileKinds ?? [...SUBMISSION_FILE_KINDS],
  };
}

function draftToMission(d: MissionDraft, kind: MissionKind): MissionContent {
  const isTask = kind === "entrega";
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
      rarity: d.rewardItemRarity,
      value: d.rewardItemValue,
      // visual do avatar e item de espaço não dão XP
      xp: d.rewardItemCosmetic || d.rewardItemSlots || d.rewardItemMultiverse ? 0 : d.rewardItemXp,
      ...(d.rewardItemCosmetic && { cosmetic: d.rewardItemCosmetic }),
      ...(d.rewardItemSlots && { slots: d.rewardItemSlots }),
      ...(d.rewardItemMultiverse && { multiverse: true }),
    },
    // missão de entrega: sem perguntas, com o enunciado e o que o aluno pode enviar
    ...(isTask && {
      kind: "entrega" as const,
      task: {
        prompt: d.taskPrompt.trim().slice(0, TASK_PROMPT_MAX),
        allowText: d.allowText,
        allowFiles: d.allowFiles,
        fileKinds: d.allowFiles ? d.fileKinds : [],
      },
    }),
    questions: (isTask ? [] : d.questions).map((q, i) => ({
      id: `q${i + 1}`,
      prompt: q.prompt.trim(),
      code: q.code.trim() || undefined,
      options: OPTION_KEYS.map((k) => ({ id: k, text: q.options[k] })),
      correctOptionId: q.correctOptionId,
      explanation: q.explanation.trim(),
    })),
  };
}

function draftIsValid(d: MissionDraft, kind: MissionKind): boolean {
  if (!d.title.trim() || !d.description.trim() || !d.rewardItemName.trim() || !d.rewardItemDescription.trim()) return false;
  if (kind === "entrega") return !!d.taskPrompt.trim() && (d.allowText || d.allowFiles) && (!d.allowFiles || d.fileKinds.length > 0);
  if (d.questions.length === 0) return false;
  return d.questions.every(
    (q) => q.prompt.trim() && q.explanation.trim() && OPTION_KEYS.every((k) => q.options[k].trim())
  );
}

export default function MissionEditor({
  existingMission,
  teachers,
  defaultTeacherId,
  shopItems,
  eventLabel,
  lockEventItem = false,
  newKind = "quiz",
  onSave,
  onDelete,
  onClose,
}: {
  existingMission?: Mission;
  /** Missão de um evento especial: mostra o selo do evento no topo (ex.: "🎃 A Noite do Bug Assombrado"). */
  eventLabel?: string;
  /** Painel do professor: a recompensa que é item oficial de evento fica só pra ver (só o ADM altera itens de evento). */
  lockEventItem?: boolean;
  /** Tipo da missão nova: quiz (perguntas) ou entrega (resposta aberta/arquivos, corrigida pelo professor). */
  newKind?: MissionKind;
  /** Só o Painel ADM passa: mostra a escolha do professor dono da missão. */
  teachers?: Teacher[];
  defaultTeacherId?: string;
  /** Só o Painel ADM passa: permite usar um item da Loja como recompensa. */
  shopItems?: ShopItem[];
  /** teacherId só vem quando `teachers` foi passado. */
  onSave: (data: MissionContent, teacherId?: string) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<MissionDraft>(existingMission ? missionToDraft(existingMission) : emptyDraft());
  const kind: MissionKind = existingMission ? (existingMission.kind ?? "quiz") : newKind;
  const isTask = kind === "entrega";
  // Professor editando missão que dá um item oficial de evento: o item fica travado (só o ADM altera).
  const lockedEventItem = lockEventItem ? eventItemOfReward({ name: draft.rewardItemName, icon: draft.rewardItemIcon }) : undefined;
  const [teacherId, setTeacherId] = useState(existingMission?.teacherId ?? defaultTeacherId ?? teachers?.[0]?.id ?? "");
  const [confirmDelete, setConfirmDelete] = useState(false);
  // item da Loja escolhido como recompensa (só pra mostrar no seletor; o que vale é o que foi copiado pro draft)
  const [shopItemId, setShopItemId] = useState(
    () => shopItems?.find((i) => i.name === existingMission?.rewardItem.name && i.icon === existingMission?.rewardItem.icon)?.id ?? "",
  );

  function pickShopItem(id: string) {
    setShopItemId(id);
    const item = shopItems?.find((i) => i.id === id);
    if (!item) {
      // "nenhum": os campos ficam como estão, mas o visual da Loja deixa de ir junto
      setDraft((d) => ({ ...d, rewardItemCosmetic: undefined, rewardItemSlots: undefined }));
      return;
    }
    setDraft((d) => ({
      ...d,
      rewardItemName: item.name,
      rewardItemIcon: item.icon,
      rewardItemDescription: item.description,
      rewardItemRarity: item.rarity,
      rewardItemValue: item.value,
      rewardItemXp: item.cosmetic || item.slots ? 0 : item.xp,
      rewardItemCosmetic: item.cosmetic,
      rewardItemSlots: item.slots,
    }));
  }

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
    if (!draftIsValid(draft, kind)) return;
    onSave(draftToMission(draft, kind), teachers ? teacherId : undefined);
  }

  /** Recompensa vira (ou deixa de ser) a Chave do Multiverso; com o nome vazio, já vem a chave pronta. */
  function toggleMultiverse(on: boolean) {
    setDraft((d) => ({
      ...d,
      rewardItemMultiverse: on || undefined,
      ...(on &&
        !d.rewardItemName.trim() && {
          rewardItemName: MULTIVERSE_KEY_ITEM.name,
          rewardItemIcon: MULTIVERSE_KEY_ITEM.icon,
          rewardItemDescription: MULTIVERSE_KEY_ITEM.description,
          rewardItemRarity: MULTIVERSE_KEY_ITEM.rarity,
          rewardItemValue: MULTIVERSE_KEY_ITEM.value,
        }),
      ...(on && { rewardItemXp: 0 }),
    }));
  }

  function toggleFileKind(k: SubmissionFileKind) {
    setDraft((d) => ({ ...d, fileKinds: d.fileKinds.includes(k) ? d.fileKinds.filter((x) => x !== k) : [...d.fileKinds, k] }));
  }

  const valid = draftIsValid(draft, kind);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="cg-card flex max-h-[90vh] w-full max-w-2xl flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white">
              {existingMission ? "Editar Missão" : "Nova Missão"}
              {isTask && " de Entrega"}
            </h2>
            {isTask && <p className="mt-0.5 text-xs font-semibold text-indigo-300">📝 O aluno escreve e/ou envia arquivos, e você corrige antes de ele ganhar a recompensa</p>}
            {eventLabel && <p className="mt-0.5 text-xs font-semibold text-orange-300">📅 Missão do evento {eventLabel}</p>}
          </div>
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

            {shopItems && (
              <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-3 sm:col-span-2">
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-violet-300">🛍️ Usar um item da Loja como recompensa</label>
                <ShopItemPicker
                  items={shopItems}
                  value={shopItemId}
                  onChange={pickShopItem}
                  placeholder="Nenhum — criar um item só pra esta missão"
                  note={shopItemId ? "Os campos abaixo foram preenchidos com o item da Loja — dá pra ajustar se quiser." : null}
                />
              </div>
            )}

            {lockedEventItem ? (
              <div className="rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/10 p-3 sm:col-span-2">
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-fuchsia-200">🎉 Item do evento ({lockedEventItem.origin})</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cg-tile text-2xl">{draft.rewardItemIcon}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{draft.rewardItemName}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <RarityBadge rarity={draft.rewardItemRarity} />
                      <ItemStats value={draft.rewardItemValue} xp={draft.rewardItemXp} />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-fuchsia-100/80">Os itens dos eventos só podem ser alterados pelo ADM. As perguntas, o XP e as moedas da missão você muda normalmente.</p>
              </div>
            ) : (
              <>
            <div className="sm:col-span-2">
              <div className={`rounded-xl border p-3 ${!!draft.rewardItemMultiverse ? "border-fuchsia-400/60 bg-fuchsia-500/10" : "border-slate-700"}`}>
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={!!draft.rewardItemMultiverse} onChange={(e) => toggleMultiverse(e.target.checked)} className="mt-0.5 h-4 w-4 accent-fuchsia-500" />
                  <span className="text-sm text-slate-200">
                    🌀 Chave do Multiverso
                    <span className="block text-[11px] text-slate-400">Usar o item abre a Sala do Multiverso uma vez. Quando o aluno sair da sala, precisa de outra chave pra voltar.</span>
                  </span>
                </label>
              </div>
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
              </>
            )}
          </div>

          {isTask ? (
          <div className="mt-6 rounded-2xl border border-indigo-500/40 bg-indigo-500/5 p-4">
            <p className="text-sm font-semibold text-indigo-200">📝 A entrega</p>
            <p className="mb-3 text-[11px] text-slate-400">Explique o que o aluno tem que fazer. Ele envia pelo botão da missão e a entrega chega pra você corrigir.</p>
            <textarea
              value={draft.taskPrompt}
              onChange={(e) => setDraft((d) => ({ ...d, taskPrompt: e.target.value }))}
              maxLength={TASK_PROMPT_MAX}
              rows={5}
              placeholder="Ex: Crie no Scratch um jogo em que o gato pega as maçãs que caem. Use pelo menos uma variável pra contar os pontos e envie o arquivo .sb3."
              className="cg-input resize-y"
            />
            <p className="mt-1 text-right text-[11px] text-slate-500">
              {draft.taskPrompt.length}/{TASK_PROMPT_MAX}
            </p>

            <p className="mb-2 mt-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">O aluno pode enviar</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 ${draft.allowText ? "border-indigo-400/60 bg-indigo-500/10" : "border-slate-700"}`}>
                <input type="checkbox" checked={draft.allowText} onChange={(e) => setDraft((d) => ({ ...d, allowText: e.target.checked }))} className="h-4 w-4 accent-indigo-500" />
                <span className="text-sm text-slate-200">✍️ Resposta escrita</span>
              </label>
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 ${draft.allowFiles ? "border-indigo-400/60 bg-indigo-500/10" : "border-slate-700"}`}>
                <input type="checkbox" checked={draft.allowFiles} onChange={(e) => setDraft((d) => ({ ...d, allowFiles: e.target.checked }))} className="h-4 w-4 accent-indigo-500" />
                <span className="text-sm text-slate-200">📎 Arquivos</span>
              </label>
            </div>
            {!draft.allowText && !draft.allowFiles && <p className="mt-2 text-xs text-amber-300">Marque pelo menos uma forma de entrega.</p>}

            {draft.allowFiles && (
              <>
                <p className="mb-2 mt-4 text-[11px] font-medium uppercase tracking-wider text-slate-500">Tipos de arquivo aceitos</p>
                <div className="flex flex-wrap gap-2">
                  {SUBMISSION_FILE_KINDS.map((k) => {
                    const on = draft.fileKinds.includes(k);
                    return (
                      <button
                        key={k}
                        type="button"
                        onClick={() => toggleFileKind(k)}
                        title={SUBMISSION_FILE_TYPES[k].extensions.join(", ")}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                          on ? "border-indigo-300 bg-indigo-500/20 text-indigo-100" : "border-slate-700 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        {on ? "✓ " : ""}
                        {SUBMISSION_FILE_TYPES[k].icon} {SUBMISSION_FILE_TYPES[k].label}{" "}
                        <span className="font-normal opacity-70">({SUBMISSION_FILE_TYPES[k].extensions.join(" ")})</span>
                      </button>
                    );
                  })}
                </div>
                {draft.fileKinds.length === 0 && <p className="mt-2 text-xs text-amber-300">Escolha pelo menos um tipo de arquivo.</p>}
              </>
            )}
          </div>
          ) : (
            <>
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
            </>
          )}
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
            title={
              valid
                ? undefined
                : isTask
                  ? "Preencha título, descrição, nome e descrição do item, o enunciado da entrega e o que o aluno pode enviar."
                  : "Preencha título, descrição, nome e descrição do item e todas as perguntas (enunciado, 4 opções e explicação)."
            }
            className="cg-btn-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            {existingMission ? "Salvar alterações" : "Criar missão"}
          </button>
        </div>
      </div>
    </div>
  );
}
