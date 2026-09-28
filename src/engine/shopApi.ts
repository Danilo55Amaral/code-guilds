// ============================================================================
// SHOP API — o cadastro da Loja pelo ADM, na API (fase 3 do back end).
// Fica separado do shop.ts porque a API importa o shop.ts (regras e itens
// prontos) e não pode importar o cliente HTTP do site. A compra do aluno
// fica no engine/gameApi.ts. Cada função atualiza o cache ("cg-shop") com o
// que a API devolveu e diz se deu certo.
// ============================================================================

import { api, describeError } from "@/services/api";
import { CosmeticCollection } from "./avatar";
import { ShopItemData, ShopItemFromApi, forgetShopItems, saveShopItem } from "./shop";

/**
 * Os dados como a API espera. Visual e espaço sem valor vão como null (o
 * tipo do item sempre vem do formulário); o vínculo com o evento e a coleção
 * só vão quando existem (na edição, o que não vem continua como estava).
 */
function toBody(data: ShopItemData) {
  return {
    ...data,
    cosmetic: data.cosmetic ?? null,
    slots: data.slots ?? null,
  };
}

/** Cadastra o item. Devolve a mensagem de erro, ou null se salvou. */
export async function createShopItem(data: ShopItemData): Promise<string | null> {
  try {
    const { item } = await api.post<{ item: ShopItemFromApi }>("/shop", toBody(data));
    saveShopItem(item);
    return null;
  } catch (error) {
    return describeError(error);
  }
}

export async function updateShopItem(id: string, data: ShopItemData): Promise<string | null> {
  try {
    const { item } = await api.put<{ item: ShopItemFromApi }>(`/shop/${id}`, toBody(data));
    saveShopItem(item);
    return null;
  } catch (error) {
    return describeError(error);
  }
}

/** Tira o item da Loja (quem já comprou continua com ele). */
export async function deleteShopItem(id: string): Promise<string | null> {
  try {
    await api.delete(`/shop/${id}`);
    forgetShopItems([id]);
    return null;
  } catch (error) {
    return describeError(error);
  }
}

export type CollectionResult = { ok: true; count: number } | { ok: false; error: string };

/** Coloca à venda os itens da coleção que ainda não estão na Loja. */
export async function addCollection(collection: CosmeticCollection): Promise<CollectionResult> {
  try {
    const { added, items } = await api.post<{ added: number; items: ShopItemFromApi[] }>(`/shop/collections/${collection}`);
    items.forEach(saveShopItem);
    return { ok: true, count: added };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}

/** Tira da Loja todos os itens da coleção (quem já comprou continua com eles). */
export async function removeCollection(collection: CosmeticCollection): Promise<CollectionResult> {
  try {
    const { removed, ids } = await api.delete<{ removed: number; ids: string[] }>(`/shop/collections/${collection}`);
    forgetShopItems(ids);
    return { ok: true, count: removed };
  } catch (error) {
    return { ok: false, error: describeError(error) };
  }
}
