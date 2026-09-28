// ============================================================================
// PRESENTES — o professor ou o ADM dá um item pra um aluno, pra toda a turma
// ou pra todos os alunos de uma casa, de uma vez. O item pode ser criado na
// hora ou vir da Loja, de uma missão ou de um evento (components/GiftItemPicker).
// Cada aluno recebe o próprio exemplar e a mensagem 🎁 Presente; com o
// inventário cheio, o item fica esperando espaço (nada se perde).
//
// Desde a fase 3 do back end, quem entrega o item é a API (rota /gifts), com
// a regra grantItem de students.ts. A chamada fica em engine/gameApi.ts e as
// mensagens saem no store.ts, depois que a API confirma.
// ============================================================================

import { Cosmetic } from "./avatar";
import { Rarity } from "./missions";

export interface GiftItem {
  name: string;
  icon: string;
  description: string;
  rarity: Rarity;
  value: number;
  xp: number;
  cosmetic?: Cosmetic;
  slots?: number;
  multiverse?: boolean; // Chave do Multiverso
}

export interface Giver {
  id: string;
  name: string;
  role: "professor" | "adm";
}

export interface GiftResult {
  delivered: number; // quantos alunos receberam
  waiting: number; // quantos estavam com o inventário cheio (o item ficou esperando espaço)
}
