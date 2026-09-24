"use client";

import { useState } from "react";

// Só emojis até o Unicode 11: o Windows 10 não tem os glifos mais novos na
// fonte de emoji e mostraria um quadrado quebrado (mesmo problema do 🪙).
const EMOJI_GROUPS: { label: string; emojis: string[] }[] = [
  { label: "Itens", emojis: ["🎁", "💍", "📿", "💎", "🔮", "🧪", "⚗️", "🗝️", "💰", "📜", "🧿", "🎒", "👢", "🧤", "🎩", "🏺"] },
  { label: "Magia", emojis: ["🧪", "🔮", "✨", "🌟", "⭐", "🌙", "🌑", "☄️", "🔥", "⚡", "💫", "🌀", "❄️", "🌈", "💎", "🧿"] },
  { label: "Batalha", emojis: ["⚔️", "🗡️", "🛡️", "🏹", "💣", "🔱", "👑", "🏆", "🎖️", "🥇", "🏰", "🐉", "🐲", "💀", "👻", "👾"] },
  { label: "Código", emojis: ["💻", "🖥️", "⌨️", "🖱️", "💾", "📀", "🔌", "🔋", "🤖", "🧠", "🧩", "🔧", "🔨", "⚙️", "🛠️", "🔗"] },
  { label: "Estudo", emojis: ["📚", "📖", "📜", "📝", "✏️", "🖊️", "📐", "📏", "🧮", "🔍", "🔎", "💡", "🎓", "🗝️", "🔑", "🧭"] },
  { label: "Criaturas", emojis: ["🦁", "🐍", "🦅", "🐦", "🦉", "🐺", "🦊", "🐱", "🐢", "🦄", "🐙", "🕷️", "🦇", "🐝", "🦋", "🐸"] },
  { label: "Outros", emojis: ["♾️", "🌱", "🌳", "🍀", "🌊", "⛰️", "🌋", "🎯", "🎲", "🎮", "🧱", "🚀", "🛸", "🌍", "⏳", "🎁"] },
];

/** Grade de emojis por categoria pro ícone de missão ou de item, com um campo pra colar outro emoji. */
export default function EmojiPicker({
  value,
  onChange,
  defaultGroup = "Magia",
}: {
  value: string;
  onChange: (emoji: string) => void;
  /** Categoria aberta quando o ícone atual não está em nenhuma (ex.: "Itens" pro ícone de item). */
  defaultGroup?: string;
}) {
  // Abre na categoria do ícone atual (ao editar), senão na categoria padrão.
  // Alguns emojis estão em duas categorias — a padrão tem preferência.
  const [groupIndex, setGroupIndex] = useState(() => {
    const preferred = Math.max(0, EMOJI_GROUPS.findIndex((g) => g.label === defaultGroup));
    if (EMOJI_GROUPS[preferred].emojis.includes(value)) return preferred;
    const current = EMOJI_GROUPS.findIndex((g) => g.emojis.includes(value));
    return current !== -1 ? current : preferred;
  });
  const group = EMOJI_GROUPS[groupIndex];

  return (
    <div className="rounded-xl border border-slate-700 bg-[#0d0d14] p-3">
      <div className="mb-3 flex flex-wrap gap-1">
        {EMOJI_GROUPS.map((g, i) => (
          <button
            key={g.label}
            type="button"
            onClick={() => setGroupIndex(i)}
            className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
              i === groupIndex ? "bg-white text-[#0a0a0f]" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-8 gap-1.5">
        {group.emojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange(emoji)}
            title={emoji}
            aria-pressed={value === emoji}
            className={`flex h-10 items-center justify-center rounded-lg text-2xl transition-colors ${
              value === emoji ? "bg-white/15 ring-2 ring-white" : "hover:bg-white/10"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1a1a24] text-xl" title="Ícone escolhido">
          {value || "🧩"}
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ou cole outro emoji aqui"
          aria-label="Outro emoji"
          className="cg-input !py-2"
        />
      </div>
    </div>
  );
}
