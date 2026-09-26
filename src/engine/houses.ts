// ============================================================================
// HOUSES — as 4 casas/guildas. Dados estáticos, sem estado.
// ============================================================================

export type HouseId = "ignis" | "noctis" | "flavus" | "sapientia";

export interface House {
  id: HouseId;
  name: string;
  animal: string;
  virtue: string;
  description: string;
  crest: string; // caminho em /public (versão web de 512px; os originais grandes ficam em /public/crests)
  // tokens de cor (usados via className dinâmica nas telas)
  colorClass: string; // texto/acento
  borderClass: string;
  bgClass: string;
  glowClass: string;
  hex: string; // usado em gráficos/estilos inline (barra de pontos, etc.)
}

export const HOUSES: House[] = [
  {
    id: "ignis",
    name: "Casa Ignis",
    animal: "Leão",
    virtue: "Coragem",
    description: "Forjados no fogo da determinação",
    crest: "/crests/web/ignis.png",
    colorClass: "text-red-400",
    borderClass: "border-red-500/40",
    bgClass: "bg-red-500/10",
    glowClass: "shadow-[0_0_24px_-6px_rgba(248,113,113,0.5)]",
    hex: "#f87171",
  },
  {
    id: "noctis",
    name: "Casa Noctis",
    animal: "Serpente",
    virtue: "Astúcia",
    description: "Silenciosos como a sombra, letais como o veneno",
    crest: "/crests/web/noctis.png",
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-500/40",
    bgClass: "bg-emerald-500/10",
    glowClass: "shadow-[0_0_24px_-6px_rgba(52,211,153,0.5)]",
    hex: "#34d399",
  },
  {
    id: "flavus",
    name: "Casa Flavus",
    animal: "Águia",
    virtue: "Lealdade",
    description: "Visão além das nuvens, honra inquebrável",
    crest: "/crests/web/flavus.png",
    colorClass: "text-amber-400",
    borderClass: "border-amber-500/40",
    bgClass: "bg-amber-500/10",
    glowClass: "shadow-[0_0_24px_-6px_rgba(251,191,36,0.5)]",
    hex: "#fbbf24",
  },
  {
    id: "sapientia",
    name: "Casa Sapientia",
    animal: "Corvo",
    virtue: "Lógica",
    description: "A mente é a arma mais afiada",
    crest: "/crests/web/sapientia.png",
    colorClass: "text-blue-400",
    borderClass: "border-blue-500/40",
    bgClass: "bg-blue-500/10",
    glowClass: "shadow-[0_0_24px_-6px_rgba(96,165,250,0.5)]",
    hex: "#60a5fa",
  },
];

export function getHouse(id: HouseId): House {
  const h = HOUSES.find((h) => h.id === id);
  if (!h) throw new Error(`Casa desconhecida: ${id}`);
  return h;
}
