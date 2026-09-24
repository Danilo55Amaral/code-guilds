"use client";

/**
 * Campos de valor (moedas) e XP ao usar de um item — usados pelo professor no
 * editor de missão e no "Dar item" da ficha do aluno.
 */
export default function ItemEconomyFields({
  value,
  xp,
  onChange,
}: {
  value: number;
  xp: number;
  onChange: (patch: { value?: number; xp?: number }) => void;
}) {
  const toInt = (raw: string) => Math.max(0, Math.round(Number(raw) || 0));
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Item — valor em moedas</label>
        <input type="number" min={0} value={value} onChange={(e) => onChange({ value: toInt(e.target.value) })} className="cg-input" />
        <p className="mt-1 text-[11px] text-slate-500">Quanto o aluno recebe ao vender pro sistema.</p>
      </div>
      <div>
        <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">Item — XP ao usar (✨)</label>
        <input type="number" min={0} value={xp} onChange={(e) => onChange({ xp: toInt(e.target.value) })} className="cg-input" />
        <p className="mt-1 text-[11px] text-slate-500">0 = não é consumível (sem botão "Usar").</p>
      </div>
    </div>
  );
}
