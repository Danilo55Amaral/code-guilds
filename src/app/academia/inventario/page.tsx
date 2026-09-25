"use client";

import { useState } from "react";
import { useStudents, useMissions, useOffers } from "@/engine/store";
import { InventoryItem, xpToNextLevel, consumeItem, removeItem, sellItemToSystem, equipItem, unequipItem, isEquipped, wornAvatar } from "@/engine/students";
import { COSMETIC_SLOT_LABELS } from "@/engine/avatar";
import { getHouse } from "@/engine/houses";
import { CoinIcon, ItemStats, LevelPill, RarityBadge, XPBar } from "@/components/GameUI";
import Avatar from "@/components/Avatar";
import CharacterSheet from "@/components/CharacterSheet";
import SellItemModal from "@/components/SellItemModal";
import ItemDetailsModal from "@/components/ItemDetailsModal";
import LevelUpScreen from "@/components/LevelUpScreen";

export default function InventarioPage() {
  const { activeStudent, students, patchActive } = useStudents();
  const { missions: allMissions } = useMissions();
  const { received, sent, offer, accept, withdraw } = useOffers(activeStudent?.id ?? null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selling, setSelling] = useState<InventoryItem | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ text: string; tone: "ok" | "erro" } | null>(null);
  const [levelUp, setLevelUp] = useState<{ from: number; to: number } | null>(null);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  if (!activeStudent) return null;

  const me = activeStudent;
  const missions = allMissions.filter((m) => m.teacherId === me.teacherId);
  const house = me.houseId ? getHouse(me.houseId) : null;
  const buyers = students.filter((s) => s.id !== me.id && s.onboardingStep === "completo");
  const nameOf = (id: string) => students.find((s) => s.id === id)?.name ?? "Aluno removido";
  const inventoryValue = me.inventory.reduce((sum, i) => sum + i.value, 0);

  function flash(text: string, tone: "ok" | "erro" = "ok") {
    setNotice({ text, tone });
    setTimeout(() => setNotice(null), 3500);
  }

  function consume(item: InventoryItem) {
    const result = consumeItem(me, item.id);
    if (!result) return;
    patchActive(result.student);
    flash(`✨ Você usou ${item.name} e ganhou +${result.xpGained} XP!`);
    if (result.leveledUp) setLevelUp({ from: result.fromLevel, to: result.newLevel });
  }

  function equip(item: InventoryItem) {
    const replaced = item.cosmetic && me.equipped[item.cosmetic.slot];
    const replacedName = replaced ? me.inventory.find((i) => i.id === replaced)?.name : null;
    patchActive(equipItem(me, item.id));
    flash(`👕 ${item.name} equipado no seu avatar!${replacedName ? ` (${replacedName} foi retirado)` : ""}`);
  }

  function unequip(item: InventoryItem) {
    patchActive(unequipItem(me, item.id));
    flash(`↩ ${item.name} foi retirado do avatar — continua no seu inventário.`);
  }

  function deleteItem(item: InventoryItem) {
    if (confirmDeleteId !== item.id) {
      setConfirmDeleteId(item.id);
      return;
    }
    patchActive(removeItem(me, item.id));
    setConfirmDeleteId(null);
    flash(`🗑 ${item.name} foi descartado.`);
  }

  function sellToSystem(item: InventoryItem) {
    patchActive(sellItemToSystem(me, item.id));
    setSelling(null);
    flash(`💰 Você vendeu ${item.name} por ${item.value} moedas.`);
  }

  function offerTo(item: InventoryItem, buyerId: string, price: number): string | null {
    const result = offer({ sellerId: me.id, buyerId, itemId: item.id, price });
    if (!result.ok) return result.error;
    setSelling(null);
    flash(`🤝 Oferta enviada: ${item.name} para ${nameOf(buyerId)} por ${price} moedas.`);
    return null;
  }

  function buy(offerId: string, itemName: string, price: number) {
    const result = accept(offerId);
    if (!result.ok) {
      flash(result.error, "erro");
      return;
    }
    flash(`🎉 Você comprou ${itemName} por ${price} moedas!`);
  }

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-white">Inventário</h1>

      {/* cartão do personagem — abre a ficha completa */}
      <button
        onClick={() => setSheetOpen(true)}
        className="cg-card group relative mb-6 flex w-full items-center gap-4 overflow-hidden p-4 text-left transition-colors hover:border-slate-600"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-60 transition-opacity group-hover:opacity-100"
          style={{ background: `radial-gradient(40% 120% at 8% 50%, ${house?.hex ?? "#6366f1"}26, transparent)` }}
        />
        <div className="relative cg-anim-float">
          <Avatar config={wornAvatar(me)} ringColor={house?.hex} size={64} />
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-white">{me.name}</p>
            <LevelPill level={me.level} />
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-300">
              <CoinIcon size={14} /> {me.coins}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <XPBar xp={me.xp} xpToNext={xpToNextLevel(me.level)} className="max-w-xs" />
            <span className="shrink-0 text-[11px] text-slate-500">
              {me.xp}/{xpToNextLevel(me.level)} XP
            </span>
          </div>
        </div>
        <span className="relative shrink-0 rounded-full border border-slate-700 bg-cg-raised px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors group-hover:border-slate-500">
          📜 Ver ficha
        </span>
      </button>

      {notice && (
        <p
          className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
            notice.tone === "ok" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-200"
          }`}
        >
          {notice.text}
        </p>
      )}

      {/* ofertas que outros alunos fizeram pra mim */}
      {received.length > 0 && (
        <div className="cg-card mb-6 !border-amber-500/40 p-4">
          <p className="mb-3 text-sm font-semibold text-amber-200">📦 Ofertas recebidas ({received.length})</p>
          <div className="flex flex-col gap-2">
            {received.map((o) => {
              const canAfford = me.coins >= o.price;
              return (
                <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-cg-sunken px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setViewingItem(o.item)}
                      title="Ver detalhes do item"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cg-tile text-xl transition-transform hover:scale-110"
                    >
                      {o.item.icon}
                    </button>
                    <div className="min-w-0">
                      <button type="button" onClick={() => setViewingItem(o.item)} className="block max-w-full truncate text-sm font-semibold text-white hover:underline">
                        {o.item.name}
                      </button>
                      <p className="text-[11px] text-slate-400">
                        {nameOf(o.sellerId)} quer vender por{" "}
                        <span className="inline-flex items-center gap-0.5 font-semibold text-amber-300">
                          <CoinIcon size={11} /> {o.price}
                        </span>
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <RarityBadge rarity={o.item.rarity} />
                        <ItemStats value={o.item.value} xp={o.item.xp} />
                      </div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => buy(o.id, o.item.name, o.price)}
                      disabled={!canAfford}
                      title={canAfford ? undefined : `Faltam ${o.price - me.coins} moedas`}
                      className="cg-btn-primary !px-3 !py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      {canAfford ? "Comprar" : `Faltam ${o.price - me.coins} moedas`}
                    </button>
                    <button onClick={() => withdraw(o.id)} className="cg-btn-secondary !px-3 !py-1.5 text-xs">
                      Recusar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-300">Itens ({me.inventory.length})</p>
        {me.inventory.length > 0 && (
          <p className="flex items-center gap-1 text-xs text-slate-500">
            Valor do inventário: <CoinIcon size={12} /> <span className="font-semibold text-amber-300">{inventoryValue}</span>
          </p>
        )}
      </div>
      {me.inventory.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum item ainda — complete missões para ganhar itens.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {me.inventory.map((item) => {
            const equipped = isEquipped(me, item.id);
            return (
            <div key={item.id} className={`cg-card relative flex flex-col items-center gap-2 p-4 text-center ${equipped ? "!border-violet-500/60" : ""}`}>
              {equipped && (
                <span className="absolute right-2 top-2 rounded-full bg-violet-500 px-2 py-0.5 text-[10px] font-bold text-cg-onaccent">✓ Equipado</span>
              )}
              {item.cosmetic && !equipped && (
                <span className="absolute right-2 top-2 rounded-full border border-violet-500/40 px-2 py-0.5 text-[10px] font-semibold text-violet-300">
                  {COSMETIC_SLOT_LABELS[item.cosmetic.slot]}
                </span>
              )}
              <button
                type="button"
                onClick={() => setViewingItem(item)}
                title="Ver detalhes do item"
                className="group flex w-full flex-col items-center gap-2 rounded-xl"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cg-tile text-2xl transition-transform group-hover:scale-110">{item.icon}</div>
                <p className="text-sm font-semibold text-white group-hover:underline">{item.name}</p>
                <RarityBadge rarity={item.rarity} />
                <ItemStats value={item.value} xp={item.xp} />
                <span className="text-[10px] text-slate-500">🔍 Ver detalhes</span>
              </button>

              <div className="mt-auto flex w-full flex-col gap-1.5 pt-2">
                {item.cosmetic &&
                  (equipped ? (
                    <button
                      onClick={() => unequip(item)}
                      className="rounded-lg border border-violet-500/50 bg-violet-500/10 px-2 py-1.5 text-xs font-semibold text-violet-200 transition-colors hover:bg-violet-500/20"
                    >
                      ↩ Retirar do avatar
                    </button>
                  ) : (
                    <button onClick={() => equip(item)} className="rounded-lg bg-violet-500 px-2 py-1.5 text-xs font-semibold text-cg-onaccent transition-colors hover:bg-violet-400">
                      👕 Equipar
                    </button>
                  ))}
                {item.xp > 0 && (
                  <button onClick={() => consume(item)} className="rounded-lg bg-violet-500 px-2 py-1.5 text-xs font-semibold text-cg-onaccent transition-colors hover:bg-violet-400">
                    ✨ Usar (+{item.xp} XP)
                  </button>
                )}
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setSelling(item)}
                    className="flex-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-xs font-semibold text-amber-200 transition-colors hover:bg-amber-500/20"
                  >
                    💰 Vender
                  </button>
                  <button
                    onClick={() => deleteItem(item)}
                    onBlur={() => setConfirmDeleteId((id) => (id === item.id ? null : id))}
                    title="Excluir item"
                    className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors ${
                      confirmDeleteId === item.id
                        ? "border-rose-400 bg-rose-400/20 text-rose-200"
                        : "border-rose-500/30 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10"
                    }`}
                  >
                    {confirmDeleteId === item.id ? "Excluir?" : "🗑"}
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* ofertas que eu fiz e ainda estão esperando o colega */}
      {sent.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-slate-300">📤 Suas ofertas aguardando resposta ({sent.length})</p>
          <div className="flex flex-col gap-2">
            {sent.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-cg-sunken px-3 py-2.5">
                <p className="flex min-w-0 items-center gap-2 text-sm text-slate-300">
                  <span className="text-lg">{o.item.icon}</span>
                  <span className="truncate">
                    <button type="button" onClick={() => setViewingItem(o.item)} className="font-semibold text-white hover:underline">
                      {o.item.name}
                    </button>{" "}
                    para {nameOf(o.buyerId)} por{" "}
                    <span className="inline-flex items-center gap-0.5 font-semibold text-amber-300">
                      <CoinIcon size={12} /> {o.price}
                    </span>
                  </span>
                </p>
                <button onClick={() => withdraw(o.id)} className="cg-btn-secondary !px-3 !py-1.5 text-xs">
                  Cancelar oferta
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selling && (
        <SellItemModal
          item={selling}
          buyers={buyers}
          onSellToSystem={() => sellToSystem(selling)}
          onOffer={(buyerId, price) => offerTo(selling, buyerId, price)}
          onClose={() => setSelling(null)}
        />
      )}

      {viewingItem && <ItemDetailsModal item={viewingItem} onClose={() => setViewingItem(null)} />}

      {levelUp && (
        <LevelUpScreen
          fromLevel={levelUp.from}
          toLevel={levelUp.to}
          unlockedMissions={missions.filter((m) => m.minLevel > levelUp.from && m.minLevel <= levelUp.to)}
          onClose={() => setLevelUp(null)}
        />
      )}

      {sheetOpen && (
        <CharacterSheet
          student={me}
          missionsTotal={missions.length}
          missionsCompleted={missions.filter((m) => me.completedMissionIds.includes(m.id)).length}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  );
}
