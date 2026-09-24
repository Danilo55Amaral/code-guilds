import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import colors from "tailwindcss/colors";

// ============================================================================
// TEMAS — escuro (padrão) e claro.
//
// Cada cor da paleta (white, slate-500, amber-300...) lê uma variável CSS cujo
// valor padrão é a própria cor do Tailwind. Sem a classe `light` no <html>,
// nenhuma variável é definida e tudo sai exatamente como no tema escuro.
// Com `html.light`, só as variáveis mudam: fundos escuros viram claros, os
// cinzas se invertem (texto claro vira escuro) e os tons claros de destaque
// (200–400) viram os escuros (800–600), pra ter contraste no fundo branco.
//
// `.cg-dark-scope` volta as variáveis pro padrão dentro de um trecho — usado
// nas cenas animadas (vitória, derrota, subir de nível), que são sempre escuras.
// ============================================================================

const FAMILIES = [
  "slate", "gray", "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal",
  "cyan", "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose",
] as const;
const SHADES = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"] as const;
type Shade = (typeof SHADES)[number];

/** "#0d0d14" -> "13 13 20" (formato que o Tailwind usa com <alpha-value>). */
function rgb(hex: string): string {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
}

function colorVar(name: string, hex: string): string {
  return `rgb(var(--cg-c-${name}, ${rgb(hex)}) / <alpha-value>)`;
}

// Cores próprias da plataforma (antes eram hex soltos nas classes). Valor = tema escuro.
const CG_DARK = {
  bg: "#08080c", // fundo da página e rodapé
  header: "#0a0a0f", // cabeçalho da Academia
  deep: "#0b0b10", // cartão da cena de derrota
  sunken: "#0d0d14", // campos, caixas dentro de cartões
  card: "#101018", // cartões
  raised: "#12121a", // botão secundário
  hover: "#15151f", // fundo ao passar o mouse
  tile: "#1a1a24", // quadradinho de ícone de item/missão
  ink: "#0a0a0f", // texto dos botões/abas brancos
  onaccent: "#ffffff", // texto sobre botão/selo colorido (branco nos dois temas)
};

const CG_LIGHT: Record<keyof typeof CG_DARK, string> = {
  bg: "#f3f4f8",
  header: "#ffffff",
  deep: "#f7f8fb",
  sunken: "#f7f8fb",
  card: "#ffffff",
  raised: "#ffffff",
  hover: "#eef0f5",
  tile: "#eceff5",
  ink: "#ffffff",
  onaccent: "#ffffff",
};

// No claro os cinzas se invertem; o 400 ganha um tom próprio pra não empatar com o 500.
const SLATE_LIGHT: Record<Shade, string> = {
  "50": colors.slate[950],
  "100": colors.slate[800],
  "200": colors.slate[700],
  "300": colors.slate[600],
  "400": "#556377",
  "500": colors.slate[500],
  "600": colors.slate[400],
  "700": colors.slate[300],
  "800": colors.slate[200],
  "900": colors.slate[100],
  "950": colors.slate[50],
};

// Demais cores: tons de texto (50–400) e de fundo escuro (800–950) trocam de lado; 500–700 ficam.
const ACCENT_SWAP: Partial<Record<Shade, Shade>> = {
  "50": "950", "100": "900", "200": "800", "300": "700", "400": "600", "800": "200", "900": "100", "950": "50",
};

const themedColors: Record<string, Record<string, string> | string> = {
  white: colorVar("white", "#ffffff"),
  cg: Object.fromEntries(Object.entries(CG_DARK).map(([k, hex]) => [k, colorVar(`cg-${k}`, hex)])),
};
const lightVars: Record<string, string> = { "--cg-c-white": rgb(colors.slate[900]) };
const allVarNames: string[] = ["--cg-c-white"];

for (const [k, hex] of Object.entries(CG_LIGHT)) {
  lightVars[`--cg-c-cg-${k}`] = rgb(hex);
  allVarNames.push(`--cg-c-cg-${k}`);
}

for (const family of FAMILIES) {
  const palette = colors[family] as Record<Shade, string>;
  themedColors[family] = Object.fromEntries(SHADES.map((s) => [s, colorVar(`${family}-${s}`, palette[s])]));
  for (const s of SHADES) {
    const name = `--cg-c-${family}-${s}`;
    allVarNames.push(name);
    const lightHex = family === "slate" ? SLATE_LIGHT[s] : ACCENT_SWAP[s] ? palette[ACCENT_SWAP[s]!] : undefined;
    if (lightHex && lightHex !== palette[s]) lightVars[name] = rgb(lightHex);
  }
}

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: themedColors,
    },
  },
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        "html.light": { ...lightVars, colorScheme: "light" },
        // `initial` deixa a variável inválida, e aí vale o valor padrão (tema escuro).
        ".cg-dark-scope": Object.fromEntries(allVarNames.map((n) => [n, "initial"])),
      });
    }),
  ],
};
export default config;
