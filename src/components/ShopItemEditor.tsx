"use client";

import { useState } from "react";
import { ShopItem, ShopItemData } from "@/engine/shop";
import { Rarity, RARITY_META, RARITY_DEFAULT_VALUE, ITEM_DESCRIPTION_MAX_LENGTH } from "@/engine/missions";
import { COSMETIC_CATALOG, COSMETIC_SLOT_LABELS, CosmeticOption, CosmeticSlot, DEFAULT_AVATAR, applyCosmetic, sameCosmetic } from "@/engine/avatar";
import Avatar from "./Avatar";
import EmojiPicker from "./EmojiPicker";
import ItemEconomyFields from "./ItemEconomyFields";

type Kind = "visual" | "item";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">{children}</label>;
}

const SLOTS = Object.keys(COSMETIC_SLOT_LABELS) as CosmeticSlot[];

/**
 * Cadastro/edição de item da Loja pelo ADM: um item comum (com XP ao usar, se
 * quiser) ou um visual do avatar escolhido no catálogo, com prévia no avatar.
 */
export default function ShopItemEditor({
  existing,
  taken,
  onSave,
  onDelete,
  onClose,
}: {
  existing?: ShopItem;
  /** Visuais que já estão à venda (em outros itens) — não dá pra repetir. */
  taken: ShopItem["cosmetic"][];
  /** Devolve a mensagem de erro, ou null se salvou. */
  onSave: (data: ShopItemData) => string | null;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const firstFree = COSMETIC_CATALOG.find((o) => !taken.some((t) => sameCosmetic(t, o))) ?? COSMETIC_CATALOG[0];
  const [kind, setKind] = useState<Kind>(existing ? (existing.cosmetic ? "visual" : "item") : "visual");
  const [cosmetic, setCosmetic] = useState<CosmeticOption>(
    (existing?.cosmetic && COSMETIC_CATALOG.find((o) => sameCosmetic(o, existing.cosmetic))) || firstFree,
  );
  const [name, setName] = useState(existing?.name ?? (existing ? "" : firstFree.label));
  const [icon, setIcon] = useState(existing?.icon ?? firstFree.icon);
  const [description, setDescription] = useState(existing?.description ?? "");
  const [rarity, setRarity] = useState<Rarity>(existing?.rarity ?? "raro");
  const [price, setPrice] = useState(existing?.price ?? 100);
  const [value, setValue] = useState(existing?.value ?? RARITY_DEFAULT_VALUE.raro);
  const [xp, setXp] = useState(existing?.xp ?? 0);
  const [featured, setFeatured] = useState(existing?.featured ?? false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function pickCosmetic(option: CosmeticOption) {
    // Nome e ícone acompanham o visual enquanto o ADM não personalizou.
    if (!name.trim() || name === cosmetic.label) setName(option.label);
    if (icon === cosmetic.icon) setIcon(option.icon);
    setCosmetic(option);
  }

  function handleSave() {
    const problem = onSave({
      name,
      icon: icon.trim() || "🎁",
      description: description.trim().slice(0, ITEM_DESCRIPTION_MAX_LENGTH),
      rarity,
      price: Math.round(price),
      value: Math.max(0, Math.round(value)),
      xp: kind === "item" ? Math.max(0, Math.round(xp)) : 0,
      featured,
      ...(kind === "visual" && { cosmetic: { slot: cosmetic.slot, value: cosmetic.value } }),
    });
    setError(problem);
  }

  const toInt = (raw: string) => Math.max(0, Math.round(Number(raw) || 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="cg-card flex max-h-[92vh] w-full max-w-3xl flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <h2 className="text-lg font-bold text-white">{existing ? "Editar item da Loja" : "Novo item da Loja"}</h2>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="mb-5 grid grid-cols-2 gap-2">
            {(
              [
                ["visual", "👕 Visual do avatar", "Chapéu, óculos, cor da roupa, aura ou mascote exclusivos"],
                ["item", "🧪 Item comum", "Vai pro inventário; pode dar XP ao usar"],
              ] as const
            ).map(([k, label, hint]) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`rounded-xl border px-3 py-3 text-left transition-colors ${kind === k ? "border-white bg-white text-cg-ink" : "border-slate-700 text-slate-300 hover:border-slate-500"}`}
              >
                <p className="text-sm font-semibold">{label}</p>
                <p className={`mt-0.5 text-[11px] ${kind === k ? "opacity-70" : "text-slate-500"}`}>{hint}</p>
              </button>
            ))}
          </div>

          {kind === "visual" && (
            <div className="mb-5">
              <Label>Escolha o visual</Label>
              <div className="flex flex-col gap-3">
                {SLOTS.map((slot) => (
                  <div key={slot}>
                    <p className="mb-1.5 text-xs font-semibold text-slate-400">{COSMETIC_SLOT_LABELS[slot]}</p>
                    <div className="flex flex-wrap gap-2">
                      {COSMETIC_CATALOG.filter((o) => o.slot === slot).map((o) => {
                        const selected = sameCosmetic(o, cosmetic);
                        const onSale = !selected && taken.some((t) => sameCosmetic(t, o)) && !sameCosmetic(o, existing?.cosmetic);
                        return (
                          <button
                            key={`${o.slot}-${o.value}`}
                            type="button"
                            disabled={onSale}
                            onClick={() => pickCosmetic(o)}
                            title={onSale ? "Já está à venda na Loja" : o.label}
                            className={`flex w-20 flex-col items-center gap-1 rounded-xl border p-1.5 text-[10px] transition-colors ${
                              selected ? "border-violet-400 bg-violet-500/15 text-white" : "border-slate-800 text-slate-400 hover:border-slate-600"
                            } disabled:cursor-not-allowed disabled:opacity-35`}
                          >
                            <Avatar config={applyCosmetic(DEFAULT_AVATAR, o)} size={52} framing={slot === "eyewear" ? "face" : "full"} />
                            <span className="line-clamp-2 leading-tight">{onSale ? "À venda" : o.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
            <div className="flex flex-col gap-4">
              <div>
                <Label>Nome na Loja</Label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Auréola Divina" className="cg-input" />
              </div>
              <div>
                <Label>Descrição</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={ITEM_DESCRIPTION_MAX_LENGTH}
                  rows={3}
                  placeholder="Conte o que o item tem de especial — é isso que convence o aluno a comprar!"
                  className="cg-input resize-y"
                />
                <p className="mt-1 text-right text-[11px] text-slate-500">
                  {description.length}/{ITEM_DESCRIPTION_MAX_LENGTH}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Label>Prévia</Label>
              {kind === "visual" ? (
                <Avatar config={applyCosmetic(DEFAULT_AVATAR, cosmetic)} size={120} ringColor="#8b5cf6" />
              ) : (
                <div className="flex h-[120px] w-[120px] items-center justify-center rounded-2xl bg-cg-tile text-6xl">{icon}</div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <Label>Raridade</Label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(RARITY_META) as Rarity[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRarity(r)}
                  className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                    rarity === r ? "border-white bg-white text-cg-ink" : "border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {RARITY_META[r].label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label>Preço na Loja (moedas)</Label>
              <input type="number" min={1} value={price} onChange={(e) => setPrice(toInt(e.target.value))} className="cg-input" />
              <p className="mt-1 text-[11px] text-slate-500">Quanto o aluno paga pra comprar.</p>
            </div>
            {kind === "visual" && (
              <div>
                <Label>Item — valor em moedas</Label>
                <input type="number" min={0} value={value} onChange={(e) => setValue(toInt(e.target.value))} className="cg-input" />
                <p className="mt-1 text-[11px] text-slate-500">Quanto o aluno recebe se vender depois pro sistema.</p>
              </div>
            )}
          </div>
          {kind === "item" && (
            <div className="mt-3">
              <ItemEconomyFields
                value={value}
                xp={xp}
                onChange={(patch) => {
                  if (patch.value !== undefined) setValue(patch.value);
                  if (patch.xp !== undefined) setXp(patch.xp);
                }}
              />
            </div>
          )}

          <div className="mt-4">
            <Label>Ícone (aparece no inventário e nas mensagens)</Label>
            <EmojiPicker value={icon} onChange={setIcon} defaultGroup="Itens" />
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-amber-500" />
            <span className="text-sm text-slate-200">
              ⭐ Colocar em destaque <span className="text-xs text-slate-500">— aparece grande no topo da Loja</span>
            </span>
          </label>

          {error && <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">{error}</p>}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-800 px-6 py-4">
          {onDelete ? (
            <button
              type="button"
              onClick={() => (confirmDelete ? onDelete() : setConfirmDelete(true))}
              onBlur={() => setConfirmDelete(false)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                confirmDelete ? "border-rose-400 bg-rose-400/20 text-rose-200" : "border-rose-500/30 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10"
              }`}
            >
              {confirmDelete ? "Tirar da Loja?" : "🗑 Tirar da Loja"}
            </button>
          ) : (
            <span />
          )}
          <button onClick={handleSave} className="cg-btn-primary">
            {existing ? "Salvar alterações" : "Colocar à venda"}
          </button>
        </div>
      </div>
    </div>
  );
}
