"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStudents } from "@/engine/store";
import {
  AvatarConfig,
  DEFAULT_AVATAR,
  SKIN_TONES,
  EYE_COLORS,
  HAIR_COLORS,
  OUTFIT_COLORS,
  HAIR_STYLE_LABELS,
  EXPRESSION_LABELS,
  FACE_DETAIL_LABELS,
  OUTFIT_LABELS,
  EYEWEAR_LABELS,
  HAT_LABELS,
  randomAvatar,
} from "@/engine/avatar";
import { getHouse } from "@/engine/houses";
import Avatar from "@/components/Avatar";

type Tab = "pele" | "cabelo" | "rosto" | "roupa" | "acessorios";

const TAB_LABELS: Record<Tab, string> = {
  pele: "🎨 Pele e olhos",
  cabelo: "💇 Cabelo",
  rosto: "😄 Rosto",
  roupa: "👕 Roupa",
  acessorios: "🎩 Acessórios",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-500">{children}</p>;
}

function Swatch({ color, label, selected, onClick }: { color: string; label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={selected}
      className={`h-9 w-9 rounded-full border border-black/30 transition-transform hover:scale-110 ${
        selected ? "ring-2 ring-white ring-offset-2 ring-offset-[#101018]" : ""
      }`}
      style={{ backgroundColor: color }}
    />
  );
}

/** Miniatura do próprio personagem com a opção aplicada. */
function OptionTile({
  preview,
  label,
  selected,
  onClick,
  framing = "full",
  ringColor,
}: {
  preview: AvatarConfig;
  label: string;
  selected: boolean;
  onClick: () => void;
  framing?: "full" | "face";
  ringColor?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2 transition-colors ${
        selected ? "border-white bg-white/10" : "border-slate-800 bg-[#0d0d14] hover:border-slate-600"
      }`}
    >
      <Avatar config={preview} size={56} framing={framing} ringColor={selected ? ringColor : undefined} />
      <span className={`text-center text-[11px] font-medium leading-tight ${selected ? "text-white" : "text-slate-400"}`}>{label}</span>
    </button>
  );
}

export default function AvatarPage() {
  const { activeStudent, patchActive, ready } = useStudents();
  const router = useRouter();
  const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
  const [tab, setTab] = useState<Tab>("pele");

  useEffect(() => {
    if (ready && !activeStudent) router.replace("/entrar");
  }, [ready, activeStudent, router]);

  if (!ready || !activeStudent) return null;

  const house = activeStudent.houseId ? getHouse(activeStudent.houseId) : null;

  function set<K extends keyof AvatarConfig>(key: K, value: AvatarConfig[K]) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  /** Grade de miniaturas de uma opção (cabelo, chapéu...), cada uma mostrando o personagem com ela. */
  function tiles<K extends keyof AvatarConfig>(key: K, labels: Record<string, string>, framing: "full" | "face" = "full") {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Object.entries(labels).map(([value, label]) => (
          <OptionTile
            key={value}
            preview={{ ...config, [key]: value }}
            label={label}
            selected={config[key] === value}
            onClick={() => set(key, value as AvatarConfig[K])}
            framing={framing}
            ringColor={house?.hex}
          />
        ))}
      </div>
    );
  }

  function entrar() {
    patchActive({ avatar: config, onboardingStep: "completo" });
    router.push("/academia/missoes");
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Passo 2 de 3 — Forje seu Avatar</p>
        {house && (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${house.colorClass} ${house.borderClass}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" /> {house.name}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* prévia */}
        <div className="cg-card relative flex flex-col items-center justify-center gap-5 overflow-hidden p-8 md:sticky md:top-6 md:self-start">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(60% 45% at 50% 35%, ${house?.hex ?? "#6366f1"}33, transparent)` }}
          />
          <div className="relative cg-anim-float">
            <Avatar config={config} ringColor={house?.hex} size={200} />
          </div>
          <div className="relative text-center">
            <p className="text-lg font-bold text-white">{activeStudent.name}</p>
            <p className="text-xs text-slate-500">
              Nível 1 • {house ? house.name : "Sem casa"}
            </p>
          </div>
          <div className="relative flex gap-2">
            <button onClick={() => setConfig(randomAvatar())} className="cg-btn-secondary !px-4 !py-2 text-xs">
              🎲 Aleatório
            </button>
            <button onClick={() => setConfig(DEFAULT_AVATAR)} className="cg-btn-secondary !px-4 !py-2 text-xs">
              ↺ Padrão
            </button>
          </div>
        </div>

        {/* editor */}
        <div className="cg-card flex flex-col gap-5 p-5 sm:p-6">
          <div className="flex flex-wrap gap-1 rounded-xl border border-slate-800 bg-[#0d0d14] p-1">
            {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  tab === t ? "bg-white text-[#0a0a0f]" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {TAB_LABELS[t]}
              </button>
            ))}
          </div>

          {tab === "pele" && (
            <>
              <div>
                <SectionTitle>Tom de pele</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TONES.map((color, i) => (
                    <Swatch key={color} color={color} label={`Tom ${i + 1}`} selected={config.skinTone === i} onClick={() => set("skinTone", i)} />
                  ))}
                </div>
              </div>
              <div>
                <SectionTitle>Cor dos olhos</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {EYE_COLORS.map((c) => (
                    <Swatch key={c.hex} color={c.hex} label={c.label} selected={config.eyeColor === c.hex} onClick={() => set("eyeColor", c.hex)} />
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "cabelo" && (
            <>
              <div>
                <SectionTitle>Estilo</SectionTitle>
                {tiles("hairStyle", HAIR_STYLE_LABELS)}
              </div>
              <div>
                <SectionTitle>Cor do cabelo</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {HAIR_COLORS.map((c) => (
                    <Swatch key={c.hex} color={c.hex} label={c.label} selected={config.hairColor === c.hex} onClick={() => set("hairColor", c.hex)} />
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "rosto" && (
            <>
              <div>
                <SectionTitle>Expressão</SectionTitle>
                {tiles("expression", EXPRESSION_LABELS, "face")}
              </div>
              <div>
                <SectionTitle>Detalhes</SectionTitle>
                {tiles("faceDetail", FACE_DETAIL_LABELS, "face")}
              </div>
            </>
          )}

          {tab === "roupa" && (
            <>
              <div>
                <SectionTitle>Traje</SectionTitle>
                {tiles("outfit", OUTFIT_LABELS)}
              </div>
              <div>
                <SectionTitle>Cor da roupa</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {OUTFIT_COLORS.map((c) => (
                    <Swatch key={c.hex} color={c.hex} label={c.label} selected={config.outfitColor === c.hex} onClick={() => set("outfitColor", c.hex)} />
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === "acessorios" && (
            <>
              <div>
                <SectionTitle>Óculos</SectionTitle>
                {tiles("eyewear", EYEWEAR_LABELS, "face")}
              </div>
              <div>
                <SectionTitle>Chapéu</SectionTitle>
                {tiles("hat", HAT_LABELS)}
              </div>
            </>
          )}

          <button onClick={entrar} className="cg-btn-primary mt-auto w-full">
            Entrar na Academia →
          </button>
        </div>
      </div>
    </div>
  );
}
