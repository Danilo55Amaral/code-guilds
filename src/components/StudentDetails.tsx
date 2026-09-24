"use client";

import { useState } from "react";
import { Student, OnboardingStep, XP_PER_LEVEL } from "@/engine/students";
import {
  SKIN_TONES,
  EYE_COLORS,
  HAIR_STYLE_LABELS,
  EXPRESSION_LABELS,
  FACE_DETAIL_LABELS,
  OUTFIT_LABELS,
  EYEWEAR_LABELS,
  HAT_LABELS,
} from "@/engine/avatar";
import { Mission, Rarity, RARITY_META, RARITY_ICON } from "@/engine/missions";
import { getHouse } from "@/engine/houses";
import { Message, MessageKind, MESSAGE_KIND_META, MESSAGE_MAX_LENGTH, formatMessageDate } from "@/engine/messages";
import Avatar from "./Avatar";
import { CoinIcon, HousePill, LevelPill, MessageKindBadge, RarityBadge, XPBar } from "./GameUI";

const ONBOARDING_LABELS: Record<OnboardingStep, string> = {
  casa: "Escolhendo a casa",
  avatar: "Criando o avatar",
  completo: "Completo",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">{children}</p>;
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-800/60 py-2 text-sm last:border-b-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right text-slate-200">{children}</span>
    </div>
  );
}

export default function StudentDetails({
  student,
  missions,
  messages,
  onGrantItem,
  onRemoveItem,
  onSendMessage,
  onDeleteStudent,
  onClose,
}: {
  student: Student;
  missions: Mission[];
  messages: Message[];
  onGrantItem: (item: { name: string; rarity: Rarity }) => void;
  onRemoveItem: (itemId: string) => void;
  onSendMessage: (data: { kind: MessageKind; body: string }) => void;
  onDeleteStudent: () => void;
  onClose: () => void;
}) {
  const [itemName, setItemName] = useState("");
  const [itemRarity, setItemRarity] = useState<Rarity>("comum");
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [grantedMsg, setGrantedMsg] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [messageKind, setMessageKind] = useState<MessageKind>("mensagem");
  const [messageBody, setMessageBody] = useState("");
  const [sentMsg, setSentMsg] = useState<string | null>(null);
  const [confirmDeleteStudent, setConfirmDeleteStudent] = useState(false);

  const house = student.houseId ? getHouse(student.houseId) : null;
  // Sugestões pro campo "Dar item": os itens que as missões já oferecem como recompensa.
  const suggestedItems = Array.from(new Set(missions.map((m) => m.rewardItem.name)));

  function handleGrant() {
    const name = itemName.trim();
    if (!name) return;
    onGrantItem({ name, rarity: itemRarity });
    setGrantedMsg(`🎁 "${name}" entregue para ${student.name}.`);
    setTimeout(() => setGrantedMsg(null), 3000);
    setItemName("");
  }

  function handleRemove(itemId: string) {
    if (confirmRemoveId !== itemId) {
      setConfirmRemoveId(itemId);
      return;
    }
    onRemoveItem(itemId);
    setConfirmRemoveId(null);
  }

  function handleSendMessage() {
    const body = messageBody.trim();
    if (!body) return;
    onSendMessage({ kind: messageKind, body });
    setSentMsg(`${MESSAGE_KIND_META[messageKind].icon} ${messageKind === "aviso" ? "Aviso enviado" : "Mensagem enviada"} para ${student.name}.`);
    setTimeout(() => setSentMsg(null), 3000);
    setMessageBody("");
    setComposerOpen(false);
  }

  // Mais recentes primeiro — o que o professor acabou de dar aparece no topo.
  const inventory = [...student.inventory].sort((a, b) => b.obtainedAt.localeCompare(a.obtainedAt));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="cg-card flex max-h-[90vh] w-full max-w-3xl flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-bold text-white">Ficha do Aluno</h2>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button onClick={() => setComposerOpen((o) => !o)} className="cg-btn-primary !px-3 !py-1.5 text-xs">
              📨 Enviar mensagem
            </button>
            <button
              onClick={() => (confirmDeleteStudent ? onDeleteStudent() : setConfirmDeleteStudent(true))}
              onBlur={() => setConfirmDeleteStudent(false)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                confirmDeleteStudent ? "border-rose-400 bg-rose-400/20 text-rose-200" : "border-rose-500/30 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10"
              }`}
            >
              {confirmDeleteStudent ? "Confirmar exclusão?" : "🗑 Excluir aluno"}
            </button>
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {confirmDeleteStudent && (
            <p className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-xs text-rose-200">
              Excluir apaga {student.name} da plataforma, junto com inventário, progresso e mensagens. Não dá pra desfazer.
            </p>
          )}

          {sentMsg && (
            <p className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">{sentMsg}</p>
          )}

          {composerOpen && (
            <div className="mb-6 rounded-xl border border-slate-700 bg-[#0d0d14] p-4">
              <SectionTitle>Nova mensagem para {student.name}</SectionTitle>
              <div className="mb-3 grid grid-cols-2 gap-2">
                {(Object.keys(MESSAGE_KIND_META) as MessageKind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setMessageKind(k)}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      messageKind === k ? "border-white bg-white text-[#0a0a0f]" : "border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {MESSAGE_KIND_META[k].icon} {MESSAGE_KIND_META[k].label}
                  </button>
                ))}
              </div>
              <textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                maxLength={MESSAGE_MAX_LENGTH}
                rows={4}
                autoFocus
                placeholder={messageKind === "aviso" ? "Ex: A prova de loops foi adiada para sexta-feira." : "Ex: Parabéns pela missão, continue assim!"}
                className="cg-input resize-y"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">
                  {messageBody.length}/{MESSAGE_MAX_LENGTH}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => setComposerOpen(false)} className="cg-btn-secondary !px-4 !py-2 text-sm">
                    Cancelar
                  </button>
                  <button onClick={handleSendMessage} disabled={!messageBody.trim()} className="cg-btn-primary !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30">
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Cabeçalho: avatar + identificação */}
          <div className="mb-6 flex flex-wrap items-center gap-5">
            <Avatar config={student.avatar} ringColor={house?.hex} size={96} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xl font-bold text-white">{student.name}</p>
                <LevelPill level={student.level} />
                {house && <HousePill house={house} />}
              </div>
              <p className="mt-1 text-sm text-slate-400">
                {student.email} • Turma {student.turma}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <XPBar xp={student.xp} xpToNext={XP_PER_LEVEL} className="w-40" />
                <span className="text-xs text-slate-500">
                  {student.xp}/{XP_PER_LEVEL} XP
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-300">
                  <CoinIcon /> {student.coins}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-[#0d0d14] px-4 py-2">
              <SectionTitle>Cadastro</SectionTitle>
              <InfoRow label="Casa">{house ? <span className={house.colorClass}>{house.name}</span> : "Ainda não escolheu"}</InfoRow>
              <InfoRow label="Cadastrado em">{formatDate(student.createdAt)}</InfoRow>
              <InfoRow label="Primeiro acesso">{ONBOARDING_LABELS[student.onboardingStep]}</InfoRow>
              <InfoRow label="Missões concluídas">
                {student.completedMissionIds.length}/{missions.length}
              </InfoRow>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#0d0d14] px-4 py-2">
              <SectionTitle>Avatar</SectionTitle>
              <InfoRow label="Tom de pele">
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border border-slate-700" style={{ backgroundColor: SKIN_TONES[student.avatar.skinTone] }} />
                  Tom {student.avatar.skinTone + 1}
                </span>
              </InfoRow>
              <InfoRow label="Cabelo">
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border border-slate-700" style={{ backgroundColor: student.avatar.hairColor }} />
                  {HAIR_STYLE_LABELS[student.avatar.hairStyle]}
                </span>
              </InfoRow>
              <InfoRow label="Olhos">
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border border-slate-700" style={{ backgroundColor: student.avatar.eyeColor }} />
                  {EYE_COLORS.find((c) => c.hex === student.avatar.eyeColor)?.label ?? "Personalizado"}
                </span>
              </InfoRow>
              <InfoRow label="Expressão">
                {EXPRESSION_LABELS[student.avatar.expression]}
                {student.avatar.faceDetail !== "nenhum" && ` • ${FACE_DETAIL_LABELS[student.avatar.faceDetail]}`}
              </InfoRow>
              <InfoRow label="Roupa">
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border border-slate-700" style={{ backgroundColor: student.avatar.outfitColor }} />
                  {OUTFIT_LABELS[student.avatar.outfit]}
                </span>
              </InfoRow>
              <InfoRow label="Óculos">{EYEWEAR_LABELS[student.avatar.eyewear]}</InfoRow>
              <InfoRow label="Chapéu">{HAT_LABELS[student.avatar.hat]}</InfoRow>
            </div>
          </div>

          <div className="mb-6">
            <SectionTitle>Missões concluídas</SectionTitle>
            {student.completedMissionIds.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma missão concluída ainda.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {student.completedMissionIds.map((id) => {
                  const m = missions.find((mission) => mission.id === id);
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
                      {m ? `${m.icon} ${m.title}` : "Missão excluída"}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mb-6">
            <SectionTitle>Inventário ({student.inventory.length} {student.inventory.length === 1 ? "item" : "itens"})</SectionTitle>
            {inventory.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhum item no inventário.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {inventory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0d0d14] px-3 py-2.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a1a24] text-lg">{RARITY_ICON[item.rarity]}</div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{item.name}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <RarityBadge rarity={item.rarity} />
                          <span className="text-[11px] text-slate-500">{formatDate(item.obtainedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      onBlur={() => setConfirmRemoveId((id) => (id === item.id ? null : id))}
                      className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                        confirmRemoveId === item.id
                          ? "border-rose-400 bg-rose-400/20 text-rose-200"
                          : "border-rose-500/30 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10"
                      }`}
                    >
                      {confirmRemoveId === item.id ? "Confirmar?" : "🗑 Excluir"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <SectionTitle>Mensagens enviadas ({messages.length})</SectionTitle>
            {messages.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma mensagem enviada para este aluno ainda.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map((m) => (
                  <div key={m.id} className="rounded-xl border border-slate-800 bg-[#0d0d14] px-4 py-3">
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                      <MessageKindBadge kind={m.kind} />
                      <span className="text-[11px] text-slate-500">
                        {formatMessageDate(m.createdAt)} •{" "}
                        {m.readAt ? <span className="text-emerald-400">✓ Lida em {formatMessageDate(m.readAt)}</span> : <span>Não lida</span>}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-slate-300">{m.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0d0d14] p-4">
            <SectionTitle>Dar item</SectionTitle>
            <div className="flex flex-col gap-3">
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGrant()}
                list="cg-item-suggestions"
                placeholder="Nome do item (ex.: Anel do Iterador)"
                className="cg-input"
              />
              <datalist id="cg-item-suggestions">
                {suggestedItems.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(RARITY_META) as Rarity[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setItemRarity(r)}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      itemRarity === r ? "border-white bg-white text-[#0a0a0f]" : "border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {RARITY_ICON[r]} {RARITY_META[r].label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-emerald-300">{grantedMsg}</p>
                <button onClick={handleGrant} disabled={!itemName.trim()} className="cg-btn-primary !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30">
                  🎁 Dar item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
