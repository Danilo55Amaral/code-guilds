// ============================================================================
// PRESENTES — o professor ou o ADM dá um item pra um aluno, pra toda a turma
// ou pra todos os alunos de uma casa, de uma vez. O item pode ser criado na
// hora ou vir da Loja, de uma missão ou de um evento (components/GiftItemPicker).
// Cada aluno recebe o próprio exemplar e a mensagem 🎁 Presente; com o
// inventário cheio, o item fica esperando espaço (nada se perde).
// ============================================================================

import { Cosmetic } from "./avatar";
import { Rarity } from "./missions";
import { getStudent, grantItem, updateStudent } from "./students";
import { PENDING_ITEM_NOTE, itemGiftMessage, sendMessage } from "./messages";

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

/** Dá o item pra cada aluno da lista (cada um ganha o seu) e manda a mensagem de presente. */
export function giveItemTo(studentIds: string[], item: GiftItem, giver: Giver): GiftResult {
  let delivered = 0;
  let waiting = 0;
  for (const id of Array.from(new Set(studentIds))) {
    const student = getStudent(id);
    if (!student) continue;
    const granted = grantItem(student, item);
    const isWaiting = granted.pendingItems.length > student.pendingItems.length;
    updateStudent(id, { inventory: granted.inventory, pendingItems: granted.pendingItems });
    sendMessage({
      studentId: id,
      senderId: giver.id,
      kind: "presente",
      body: itemGiftMessage({ studentName: student.name, item, giverName: giver.name, giverRole: giver.role }) + (isWaiting ? PENDING_ITEM_NOTE : ""),
    });
    delivered += 1;
    if (isWaiting) waiting += 1;
  }
  return { delivered, waiting };
}
