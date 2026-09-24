// ============================================================================
// THEME — tema escuro (padrão) ou claro. A escolha fica no localStorage (vale
// pra todas as contas deste navegador) e vira a classe `light` no <html>;
// as cores em si são trocadas por variáveis CSS (ver tailwind.config.ts).
// ============================================================================

export type Theme = "dark" | "light";

const THEME_KEY = "cg-theme";

export function getTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    return window.localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("light", theme === "light");
}

export function setTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // sem localStorage (aba privada bloqueada): o tema vale só até recarregar
  }
  applyTheme(theme);
}

/**
 * Roda no <head>, antes da página aparecer — senão quem usa o modo claro veria
 * um "piscar" do tema escuro a cada carregamento.
 */
export const THEME_INIT_SCRIPT = `try{if(localStorage.getItem("${THEME_KEY}")==="light")document.documentElement.classList.add("light")}catch(e){}`;
