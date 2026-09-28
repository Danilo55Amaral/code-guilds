"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { InventoryItem, Student, isEquipped, wornAvatar } from "@/engine/students";
import { getHouse } from "@/engine/houses";
import { Trade, TRADE_MAX_ITEMS, tradeFitsFor } from "@/engine/trades";
import Avatar from "./Avatar";
import SearchInput from "./SearchInput";
import { CoinIcon, RarityBadge } from "./GameUI";

// ============================================================================
// TROCA DE ITENS ENTRE AMIGOS — a janela de propor troca (escolher o amigo,
// depois os itens que você dá e os que você recebe) e o cartão de uma
// proposta (recebida: aceitar/recusar; enviada: cancelar). As regras ficam
// em engine/trades.ts.
// ============================================================================

function sumValue(items: InventoryItem[]): number {
  return items.reduce((sum, i) => sum + i.value, 0);
}

/** Um item pequeno, com ícone, nome, raridade e valor. */
function ItemChip({ item, note }: { item: InventoryItem; note?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-cg-sunken px-2 py-1.5" title={item.description || item.name}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cg-tile text-lg">{item.icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-white">{item.name}</span>
        <span className="mt-0.5 flex items-center gap-1.5">
          <RarityBadge rarity={item.rarity} />
          <span className="flex items-center gap-0.5 text-[10px] text-amber-300">
            <CoinIcon size={10} /> {item.value}
          </span>
        </span>
        {note && <span className="block text-[10px] text-rose-300">{note}</span>}
      </span>
    </div>
  );
}

/** Lista de itens pra escolher (um lado da troca), com busca e contador. */
function ItemPicker({
  title,
  hint,
  owner,
  selected,
  onToggle,
}: {
  title: string;
  hint: string;
  owner: Student;
  selected: string[];
  onToggle: (itemId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const q = search.trim().toLowerCase();
  const items = owner.inventory.filter((i) => !q || i.name.toLowerCase().includes(q));
  const full = selected.length >= TRADE_MAX_ITEMS;
  return (
    <div className="flex min-w-0 flex-col rounded-2xl border border-slate-800 bg-cg-sunken p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-bold text-white">{title}</p>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${selected.length ? "bg-teal-500 text-cg-onaccent" : "border border-slate-700 text-slate-400"}`}>
          {selected.length}/{TRADE_MAX_ITEMS}
        </span>
      </div>
      <p className="mb-2 text-[11px] text-slate-500">{hint}</p>
      {owner.inventory.length > 6 && <SearchInput value={search} onChange={setSearch} placeholder="Buscar item..." />}
      {owner.inventory.length === 0 ? (
        <p className="mt-2 rounded-xl border border-dashed border-slate-700 p-4 text-center text-xs text-slate-500">Nenhum item no inventário.</p>
      ) : (
        <div className="mt-2 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
          {items.map((item) => {
            const on = selected.includes(item.id);
            const blocked = !on && full;
            const equipped = isEquipped(owner, item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onToggle(item.id)}
                disabled={blocked}
                title={item.description || item.name}
                className={`relative flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  on ? "border-teal-400 bg-teal-500/15 ring-2 ring-teal-400/40" : "border-slate-800 bg-cg-card hover:border-slate-600"
                }`}
                aria-pressed={on}
              >
                {on && <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-[11px] font-black text-cg-onaccent">✓</span>}
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cg-tile text-xl">{item.icon}</span>
                <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-white">{item.name}</span>
                <RarityBadge rarity={item.rarity} />
                <span className="flex items-center gap-0.5 text-[10px] text-amber-300">
                  <CoinIcon size={10} /> {item.value}
                </span>
                {equipped && <span className="text-[9px] font-semibold text-violet-300">👕 equipado</span>}
              </button>
            );
          })}
          {items.length === 0 && <p className="col-span-2 py-4 text-center text-xs text-slate-500">Nenhum item com esse nome.</p>}
        </div>
      )}
    </div>
  );
}

/** Balança: diz se a troca está equilibrada pelo valor dos itens (só uma dica, quem decide são os alunos). */
function Balance({ give, receive }: { give: number; receive: number }) {
  if (give === 0 || receive === 0) return null;
  const ratio = give / receive;
  const label =
    ratio > 1.5 ? "Você está dando mais valor do que recebe." : ratio < 1 / 1.5 ? "Você está pedindo mais valor do que dá." : "Troca equilibrada!";
  const tone = ratio > 1.5 || ratio < 1 / 1.5 ? "text-amber-200" : "text-emerald-300";
  return <p className={`text-center text-xs font-semibold ${tone}`}>⚖️ {label}</p>;
}

export default function TradeModal({
  me,
  friends,
  initialFriendId,
  onPropose,
  onClose,
}: {
  me: Student;
  /** Amigos (pedido de amizade aceito) — só com eles dá pra trocar. */
  friends: Student[];
  initialFriendId?: string | null;
  /** Devolve a mensagem de erro, ou null se a proposta foi enviada. */
  onPropose: (friendId: string, offeredIds: string[], requestedIds: string[]) => Promise<string | null>;
  onClose: () => void;
}) {
  const [friendId, setFriendId] = useState<string | null>(initialFriendId && friends.some((f) => f.id === initialFriendId) ? initialFriendId : null);
  const [give, setGive] = useState<string[]>([]);
  const [receive, setReceive] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const friend = friends.find((f) => f.id === friendId) ?? null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggle(setList: React.Dispatch<React.SetStateAction<string[]>>, id: string) {
    setError(null);
    setList((list) => (list.includes(id) ? list.filter((x) => x !== id) : list.length >= TRADE_MAX_ITEMS ? list : [...list, id]));
  }

  function chooseFriend(id: string | null) {
    setFriendId(id);
    setReceive([]);
    setError(null);
  }

  async function send() {
    if (!friend || sending) return;
    setSending(true);
    const problem = await onPropose(friend.id, give, receive);
    setSending(false);
    setError(problem);
  }

  const giveItems = me.inventory.filter((i) => give.includes(i.id));
  const receiveItems = friend ? friend.inventory.filter((i) => receive.includes(i.id)) : [];
  const giveEquipped = giveItems.filter((i) => isEquipped(me, i.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="cg-card cg-anim-pop flex max-h-[92vh] w-full max-w-3xl flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-white">🔄 Trocar itens</h2>
            <p className="text-xs text-slate-500">{friend ? "Escolha o que você dá e o que você quer receber." : "Com qual amigo você quer trocar?"}</p>
          </div>
          <button onClick={onClose} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!friend ? (
            friends.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <p className="text-4xl">🤝</p>
                <p className="font-semibold text-white">Você ainda não tem amigos pra trocar</p>
                <p className="max-w-sm text-sm text-slate-400">Só dá pra trocar itens com amigos. Abra o perfil de um colega no ranking e mande um pedido de amizade!</p>
                <Link href="/academia/amigos" className="cg-btn-primary mt-2 !px-4 !py-2 text-xs">
                  Ir pra Amigos →
                </Link>
              </div>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {friends.map((f) => {
                  const house = f.houseId ? getHouse(f.houseId) : null;
                  return (
                    <button
                      key={f.id}
                      onClick={() => chooseFriend(f.id)}
                      className="flex items-center gap-3 rounded-xl border border-slate-800 bg-cg-sunken px-3 py-2.5 text-left transition-colors hover:border-teal-400/60"
                    >
                      <Avatar config={wornAvatar(f)} size={40} ringColor={house?.hex} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-white">{f.name}</span>
                        <span className={`block text-[11px] ${house?.colorClass ?? "text-slate-500"}`}>
                          {house?.name ?? "Sem casa"} • {f.inventory.length} {f.inventory.length === 1 ? "item" : "itens"}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-teal-300">Escolher →</span>
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            <>
              {/* os dois alunos, frente a frente */}
              <div className="mb-4 flex items-center justify-center gap-4 rounded-2xl border border-teal-500/30 bg-teal-500/5 p-3">
                <div className="flex flex-col items-center">
                  <Avatar config={wornAvatar(me)} size={52} ringColor={me.houseId ? getHouse(me.houseId).hex : undefined} />
                  <span className="mt-1 text-xs font-semibold text-white">Você</span>
                </div>
                <span className="cg-anim-float text-2xl" aria-hidden="true">
                  🔄
                </span>
                <div className="flex flex-col items-center">
                  <Avatar config={wornAvatar(friend)} size={52} ringColor={friend.houseId ? getHouse(friend.houseId).hex : undefined} />
                  <span className="mt-1 max-w-[120px] truncate text-xs font-semibold text-white">{friend.name.split(" ")[0]}</span>
                </div>
                <button onClick={() => chooseFriend(null)} className="ml-2 text-[11px] text-slate-400 underline hover:text-white">
                  Trocar de amigo
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ItemPicker title="📤 Você dá" hint="Itens seus que vão pro seu amigo." owner={me} selected={give} onToggle={(id) => toggle(setGive, id)} />
                <ItemPicker
                  title={`📥 Você recebe`}
                  hint={`Itens de ${friend.name.split(" ")[0]} que você quer.`}
                  owner={friend}
                  selected={receive}
                  onToggle={(id) => toggle(setReceive, id)}
                />
              </div>

              {/* resumo */}
              <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-800 bg-cg-sunken p-3">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    Você dá {give.length} {give.length === 1 ? "item" : "itens"} • <CoinIcon size={12} /> {sumValue(giveItems)}
                  </span>
                  <span className="flex items-center gap-1">
                    Você recebe {receive.length} {receive.length === 1 ? "item" : "itens"} • <CoinIcon size={12} /> {sumValue(receiveItems)}
                  </span>
                </div>
                <Balance give={sumValue(giveItems)} receive={sumValue(receiveItems)} />
                {giveEquipped.length > 0 && (
                  <p className="text-center text-[11px] text-violet-300">👕 {giveEquipped.map((i) => i.name).join(", ")} está equipado e sai do seu avatar se a troca for enviada.</p>
                )}
                <p className="text-center text-[11px] text-slate-500">
                  Seus itens ficam guardados na proposta até {friend.name.split(" ")[0]} responder. Se recusar (ou você cancelar), eles voltam pra você.
                </p>
              </div>
              {error && <p className="mt-2 text-center text-xs text-rose-300">{error}</p>}
            </>
          )}
        </div>

        {friend && (
          <div className="border-t border-slate-800 px-6 py-4">
            <button
              onClick={send}
              disabled={give.length === 0 || receive.length === 0 || sending}
              className="w-full rounded-full bg-gradient-to-r from-teal-400 to-sky-500 px-5 py-3 text-sm font-black text-cg-ink shadow-lg shadow-teal-500/30 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {give.length === 0 || receive.length === 0 ? "Escolha pelo menos 1 item de cada lado" : sending ? "Enviando…" : "🔄 Enviar proposta de troca"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Uma proposta de troca. `mine` = eu propus (mostra "você dá / você recebe" e Cancelar);
 * senão eu recebi (mostra o que ganho e o que dou, Aceitar e Recusar).
 */
export function TradeCard({
  trade,
  friend,
  mine,
  me,
  onAccept,
  onDecline,
  onCancel,
}: {
  trade: Trade;
  friend: Student | undefined;
  mine: boolean;
  me: Student;
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
}) {
  const friendName = friend?.name ?? "Aluno removido";
  const house = friend?.houseId ? getHouse(friend.houseId) : null;
  // Itens que eu recebo e itens que eu dou, do meu ponto de vista.
  const gets = mine ? trade.requested : trade.offered;
  const gives = mine ? trade.offered : trade.requested;
  // Recebi a proposta: algum item pedido já não está mais comigo?
  const missing = mine ? [] : trade.requestedIds.filter((id) => !me.inventory.some((i) => i.id === id));
  // Recebi a proposta: os itens que ganho cabem no meu inventário?
  const noSpace = !mine && !tradeFitsFor(me, trade);

  return (
    <div className={`rounded-2xl border p-3 ${mine ? "border-slate-800 bg-cg-sunken" : "border-teal-500/40 bg-teal-500/5"}`}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {friend && <Avatar config={wornAvatar(friend)} size={32} ringColor={house?.hex} />}
          <p className="min-w-0 text-sm text-slate-300">
            {mine ? (
              <>
                Proposta pra <span className="font-semibold text-white">{friendName}</span> • aguardando resposta
              </>
            ) : (
              <>
                <span className="font-semibold text-white">{friendName}</span> te propôs uma troca
              </>
            )}
          </p>
        </div>
        <span className="text-[11px] text-slate-500">{new Date(trade.createdAt).toLocaleDateString("pt-BR")}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
            📥 Você recebe • <CoinIcon size={11} /> {sumValue(gets)}
          </p>
          <div className="flex flex-col gap-1.5">
            {gets.map((i) => (
              <ItemChip key={i.id} item={i} />
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-amber-300">
            📤 Você dá • <CoinIcon size={11} /> {sumValue(gives)}
          </p>
          <div className="flex flex-col gap-1.5">
            {gives.map((i) => (
              <ItemChip key={i.id} item={i} note={missing.includes(i.id) ? "Não está mais no seu inventário" : !mine && isEquipped(me, i.id) ? "Equipado: sai do seu avatar" : undefined} />
            ))}
          </div>
        </div>
      </div>
      {noSpace && (
        <p className="mt-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          🎒 Seu inventário não tem espaço pra essa troca. Libere espaço (ou use um item de espaço) pra poder aceitar.
        </p>
      )}
      <div className="mt-3 flex flex-wrap justify-end gap-2">
        {mine ? (
          <button onClick={onCancel} className="cg-btn-secondary !px-3 !py-1.5 text-xs">
            Cancelar proposta
          </button>
        ) : (
          <>
            <button
              onClick={onAccept}
              disabled={missing.length > 0 || noSpace}
              title={missing.length > 0 ? "Você não tem mais todos os itens pedidos" : noSpace ? "Sem espaço no inventário" : undefined}
              className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-black text-cg-onaccent transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
            >
              ✅ Aceitar troca
            </button>
            <button onClick={onDecline} className="cg-btn-secondary !px-3 !py-1.5 text-xs">
              Recusar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
