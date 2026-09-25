"use client";

import { useState } from "react";
import { Student, StudentProfile, InventoryItem, OnboardingStep, xpToNextLevel, wornAvatar } from "@/engine/students";
import {
  SKIN_TONES,
  EYE_COLORS,
  HAIR_STYLE_LABELS,
  EXPRESSION_LABELS,
  FACE_DETAIL_LABELS,
  outfitLabel,
  eyewearLabel,
  hatLabel,
} from "@/engine/avatar";
import { Mission, Rarity, RARITY_META, RARITY_ICON, RARITY_DEFAULT_VALUE, DEFAULT_ITEM_ICON, ITEM_DESCRIPTION_MAX_LENGTH } from "@/engine/missions";
import ItemEconomyFields from "./ItemEconomyFields";
import EmojiPicker from "./EmojiPicker";
import ItemDetailsModal from "./ItemDetailsModal";
import { PaginationFooter, usePagination } from "./Pagination";

const MESSAGES_PER_PAGE = 5;
import { HOUSES, HouseId, getHouse } from "@/engine/houses";
import { Teacher } from "@/engine/teachers";
import { Message, MessageKind, MESSAGE_KIND_META, COMPOSABLE_MESSAGE_KINDS, MESSAGE_MAX_LENGTH, formatMessageDate } from "@/engine/messages";
import Avatar from "./Avatar";
import { CoinIcon, HousePill, ItemStats, LevelPill, MessageAudienceBadge, MessageKindBadge, RarityBadge, XPBar } from "./GameUI";

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
  onUpdateCredentials,
  onUpdateProfile,
  onChangeHouse,
  teachers,
  onChangeTeacher,
  onClose,
}: {
  student: Student;
  /** Missões do professor do aluno. */
  missions: Mission[];
  messages: Message[];
  onGrantItem: (item: { name: string; icon: string; description: string; rarity: Rarity; value: number; xp: number }) => void;
  onRemoveItem: (itemId: string) => void;
  onSendMessage: (data: { kind: MessageKind; body: string }) => void;
  onDeleteStudent: () => void;
  /** Troca login/senha; devolve a mensagem de erro, ou null se salvou. */
  onUpdateCredentials: (username: string, password: string) => string | null;
  /** Troca nome, e-mail e turma; devolve a mensagem de erro, ou null se salvou. */
  onUpdateProfile: (profile: StudentProfile) => string | null;
  onChangeHouse: (houseId: HouseId) => void;
  /** Só o Painel ADM passa: permite trocar o professor do aluno. */
  teachers?: Teacher[];
  onChangeTeacher?: (teacherId: string) => void;
  onClose: () => void;
}) {
  const [itemName, setItemName] = useState("");
  const [itemIcon, setItemIcon] = useState(DEFAULT_ITEM_ICON);
  const [itemDescription, setItemDescription] = useState("");
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [itemRarity, setItemRarity] = useState<Rarity>("comum");
  const [itemValue, setItemValue] = useState(RARITY_DEFAULT_VALUE.comum);
  const [itemXp, setItemXp] = useState(0);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [grantedMsg, setGrantedMsg] = useState<string | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [messageKind, setMessageKind] = useState<MessageKind>("mensagem");
  const [messageBody, setMessageBody] = useState("");
  const [sentMsg, setSentMsg] = useState<string | null>(null);
  const messagesPager = usePagination(messages, MESSAGES_PER_PAGE);
  const [confirmDeleteStudent, setConfirmDeleteStudent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingAccess, setEditingAccess] = useState(false);
  const [newUsername, setNewUsername] = useState(student.username);
  const [newPassword, setNewPassword] = useState(student.password);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [accessSaved, setAccessSaved] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>({ name: student.name, email: student.email, turma: student.turma });
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const [houseSaved, setHouseSaved] = useState<string | null>(null);

  function handleChangeHouse(houseId: HouseId) {
    if (houseId === student.houseId) return;
    onChangeHouse(houseId);
    setHouseSaved(`${student.name} agora é da ${getHouse(houseId).name}.`);
    setTimeout(() => setHouseSaved(null), 3000);
  }

  function startEditingProfile() {
    setProfile({ name: student.name, email: student.email, turma: student.turma });
    setProfileError(null);
    setEditingProfile(true);
  }

  function saveProfile() {
    const error = onUpdateProfile(profile);
    setProfileError(error);
    if (error) return;
    setEditingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  function startEditingAccess() {
    setNewUsername(student.username);
    setNewPassword(student.password);
    setAccessError(null);
    setEditingAccess(true);
  }

  function saveAccess() {
    const error = onUpdateCredentials(newUsername, newPassword);
    setAccessError(error);
    if (error) return;
    setEditingAccess(false);
    setAccessSaved(true);
    setTimeout(() => setAccessSaved(false), 3000);
  }

  const house = student.houseId ? getHouse(student.houseId) : null;
  // Sugestões pro campo "Dar item": os itens que as missões já oferecem como recompensa.
  const suggestedItems = Array.from(new Set(missions.map((m) => m.rewardItem.name)));

  function handleGrant() {
    const name = itemName.trim();
    if (!name) return;
    if (!name || !itemDescription.trim()) return;
    onGrantItem({ name, icon: itemIcon, description: itemDescription, rarity: itemRarity, value: itemValue, xp: itemXp });
    setGrantedMsg(`${itemIcon || DEFAULT_ITEM_ICON} "${name}" entregue para ${student.name} — a mensagem de parabéns já foi enviada.`);
    setTimeout(() => setGrantedMsg(null), 3000);
    setItemName("");
    setItemDescription("");
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
            <div className="mb-6 rounded-xl border border-slate-700 bg-cg-sunken p-4">
              <SectionTitle>Nova mensagem para {student.name}</SectionTitle>
              <div className="mb-3 grid grid-cols-2 gap-2">
                {COMPOSABLE_MESSAGE_KINDS.map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setMessageKind(k)}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      messageKind === k ? "border-white bg-white text-cg-ink" : "border-slate-700 text-slate-300 hover:border-slate-500"
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
            <Avatar config={wornAvatar(student)} ringColor={house?.hex} size={96} />
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
                <XPBar xp={student.xp} xpToNext={xpToNextLevel(student.level)} className="w-40" />
                <span className="text-xs text-slate-500">
                  {student.xp}/{xpToNextLevel(student.level)} XP
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-amber-300">
                  <CoinIcon /> {student.coins}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-cg-sunken px-4 py-2">
              <SectionTitle>Cadastro</SectionTitle>
              {teachers && onChangeTeacher && (
                <InfoRow label="Professor">
                  <select
                    value={student.teacherId}
                    onChange={(e) => onChangeTeacher(e.target.value)}
                    className="rounded-lg border border-slate-700 bg-cg-sunken px-2 py-1 text-sm text-slate-100 focus:border-slate-400 focus:outline-none"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </InfoRow>
              )}
              <InfoRow label="Casa">
                <select
                  value={student.houseId ?? ""}
                  onChange={(e) => handleChangeHouse(e.target.value as HouseId)}
                  aria-label="Casa do aluno"
                  className={`rounded-lg border border-slate-700 bg-cg-sunken px-2 py-1 text-sm focus:border-slate-400 focus:outline-none ${house ? house.colorClass : "text-slate-400"}`}
                >
                  {!house && (
                    <option value="" disabled>
                      Ainda não escolheu
                    </option>
                  )}
                  {HOUSES.map((h) => (
                    <option key={h.id} value={h.id} className="text-slate-100">
                      {h.name}
                    </option>
                  ))}
                </select>
              </InfoRow>
              {houseSaved && <p className="pb-1 text-right text-xs text-emerald-300">✓ {houseSaved}</p>}
              <InfoRow label="Cadastrado em">{formatDate(student.createdAt)}</InfoRow>
              <InfoRow label="Primeiro acesso">{ONBOARDING_LABELS[student.onboardingStep]}</InfoRow>
              <InfoRow label="Missões concluídas">
                {missions.filter((m) => student.completedMissionIds.includes(m.id)).length}/{missions.length}
              </InfoRow>
            </div>

            <div className="rounded-xl border border-slate-800 bg-cg-sunken px-4 py-2">
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
                  {outfitLabel(student.avatar.outfit)}
                </span>
              </InfoRow>
              <InfoRow label="Óculos">{eyewearLabel(student.avatar.eyewear)}</InfoRow>
              <InfoRow label="Chapéu">{hatLabel(student.avatar.hat)}</InfoRow>
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-slate-800 bg-cg-sunken px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <SectionTitle>👤 Dados do aluno</SectionTitle>
              {!editingProfile && (
                <button onClick={startEditingProfile} className="mb-2 text-[11px] font-medium text-slate-400 hover:text-white">
                  ✏️ Alterar
                </button>
              )}
            </div>
            {editingProfile ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="mb-1 block text-[11px] text-slate-500">Nome (aparece no avatar, no ranking e para o professor)</label>
                  <input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Nome do aluno" className="cg-input" />
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] text-slate-500">E-mail</label>
                    <input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} placeholder="aluno@escola.com" className="cg-input" />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-slate-500">Turma</label>
                    <input value={profile.turma} onChange={(e) => setProfile((p) => ({ ...p, turma: e.target.value }))} placeholder="3ºA - Manhã" className="cg-input" />
                  </div>
                </div>
                {profileError && <p className="text-xs text-rose-300">{profileError}</p>}
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingProfile(false)} className="cg-btn-secondary !px-4 !py-2 text-xs">
                    Cancelar
                  </button>
                  <button onClick={saveProfile} className="cg-btn-primary !px-4 !py-2 text-xs">
                    Salvar dados
                  </button>
                </div>
              </div>
            ) : (
              <>
                <InfoRow label="Nome">{student.name}</InfoRow>
                <InfoRow label="E-mail">
                  <span className="break-all">{student.email}</span>
                </InfoRow>
                <InfoRow label="Turma">{student.turma}</InfoRow>
                {profileSaved && <p className="pb-1 text-xs text-emerald-300">✓ Dados atualizados.</p>}
              </>
            )}
          </div>

          <div className="mb-6 rounded-xl border border-slate-800 bg-cg-sunken px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <SectionTitle>🔑 Acesso do aluno</SectionTitle>
              {!editingAccess && (
                <button onClick={startEditingAccess} className="mb-2 text-[11px] font-medium text-slate-400 hover:text-white">
                  ✏️ Alterar
                </button>
              )}
            </div>
            {editingAccess ? (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Login" className="cg-input" />
                  <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nova senha" className="cg-input" />
                </div>
                {accessError && <p className="text-xs text-rose-300">{accessError}</p>}
                <div className="flex justify-end gap-2">
                  <button onClick={() => setEditingAccess(false)} className="cg-btn-secondary !px-4 !py-2 text-xs">
                    Cancelar
                  </button>
                  <button onClick={saveAccess} className="cg-btn-primary !px-4 !py-2 text-xs">
                    Salvar acesso
                  </button>
                </div>
              </div>
            ) : (
              <>
                <InfoRow label="Login">
                  <span className="font-mono">{student.username}</span>
                </InfoRow>
                <InfoRow label="Senha">
                  {student.password ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="font-mono">{showPassword ? student.password : "•".repeat(student.password.length)}</span>
                      <button onClick={() => setShowPassword((v) => !v)} title={showPassword ? "Esconder senha" : "Mostrar senha"} className="text-xs opacity-70 hover:opacity-100">
                        {showPassword ? "🙈" : "👁"}
                      </button>
                    </span>
                  ) : (
                    <span className="text-amber-300">⚠️ Sem senha — clique em Alterar para definir</span>
                  )}
                </InfoRow>
                {accessSaved && <p className="pb-1 text-xs text-emerald-300">✓ Acesso atualizado.</p>}
              </>
            )}
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
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-cg-sunken px-3 py-2.5">
                    <button type="button" onClick={() => setViewingItem(item)} title="Ver detalhes do item" className="flex min-w-0 items-center gap-3 text-left">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cg-tile text-lg">{item.icon}</div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white hover:underline">{item.name}</p>
                        <div className="mt-0.5 flex items-center gap-2">
                          <RarityBadge rarity={item.rarity} />
                          <ItemStats value={item.value} xp={item.xp} />
                          <span className="text-[11px] text-slate-500">{formatDate(item.obtainedAt)}</span>
                        </div>
                      </div>
                    </button>
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
            <SectionTitle>Mensagens do aluno ({messages.length})</SectionTitle>
            {messages.length === 0 ? (
              <p className="text-sm text-slate-500">Este aluno ainda não recebeu nenhuma mensagem.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {messagesPager.pageItems.map((m) => (
                  <div key={m.id} className="rounded-xl border border-slate-800 bg-cg-sunken px-4 py-3">
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                      <span className="flex flex-wrap items-center gap-1.5">
                        <MessageKindBadge kind={m.kind} />
                        {m.audience && <MessageAudienceBadge audience={m.audience} />}
                      </span>
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
            <PaginationFooter pager={messagesPager} noun="mensagens" />
          </div>

          <div className="rounded-xl border border-slate-800 bg-cg-sunken p-4">
            <SectionTitle>Dar item</SectionTitle>
            <div className="flex flex-col gap-3">
              <input
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                  // escolheu um item de missão da lista? já preenche raridade, valor e XP dele
                  const known = missions.find((m) => m.rewardItem.name === e.target.value)?.rewardItem;
                  if (known) {
                    setItemIcon(known.icon);
                    setItemDescription(known.description);
                    setItemRarity(known.rarity);
                    setItemValue(known.value);
                    setItemXp(known.xp);
                  }
                }}
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
                    title={`Valor sugerido: ${RARITY_DEFAULT_VALUE[r]} moedas`}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                      itemRarity === r ? "border-white bg-white text-cg-ink" : "border-slate-700 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {RARITY_ICON[r]} {RARITY_META[r].label}
                  </button>
                ))}
              </div>
              <div>
                <textarea
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  maxLength={ITEM_DESCRIPTION_MAX_LENGTH}
                  rows={2}
                  placeholder="Descrição do item (aparece quando o aluno clica nele)"
                  aria-label="Descrição do item"
                  className="cg-input resize-y"
                />
                <p className="mt-1 text-right text-[11px] text-slate-500">
                  {itemDescription.length}/{ITEM_DESCRIPTION_MAX_LENGTH}
                </p>
              </div>
              <div>
                <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-slate-500">Ícone do item</p>
                <EmojiPicker value={itemIcon} onChange={setItemIcon} defaultGroup="Itens" />
              </div>
              <ItemEconomyFields
                value={itemValue}
                xp={itemXp}
                onChange={(patch) => {
                  if (patch.value !== undefined) setItemValue(patch.value);
                  if (patch.xp !== undefined) setItemXp(patch.xp);
                }}
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-emerald-300">{grantedMsg}</p>
                <button
                  onClick={handleGrant}
                  disabled={!itemName.trim() || !itemDescription.trim()}
                  title={itemName.trim() && itemDescription.trim() ? undefined : "Preencha o nome e a descrição do item."}
                  className="cg-btn-primary !px-4 !py-2 text-sm disabled:cursor-not-allowed disabled:opacity-30"
                >
                  🎁 Dar item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewingItem && <ItemDetailsModal item={viewingItem} onClose={() => setViewingItem(null)} />}
    </div>
  );
}
