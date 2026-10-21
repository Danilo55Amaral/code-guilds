// ============================================================================
// API — o cliente HTTP do site pra falar com o back end (pasta api/).
//
// Todas as chamadas vão pra /api/..., que o Next.js repassa pra API (ver o
// rewrite no next.config.js). Assim o navegador só conversa com o domínio do
// site e o cookie de login (httpOnly) vai sozinho em toda requisição.
//
// Quando a API responde com erro, as funções lançam um ApiError com a
// mensagem que a própria API mandou (já em português). Sem conexão, ou com a
// API fora do ar, a mensagem explica isso.
// ============================================================================

export class ApiError extends Error {
  /** Status HTTP da resposta; 0 = nem chegou no servidor (sem internet, API fora do ar). */
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const OFFLINE_MESSAGE = "Não foi possível falar com o servidor. Confira sua internet e tente de novo.";
const NOT_CONFIGURED_MESSAGE = "O servidor da CodeGuilds não está configurado (falta a variável API_URL do site).";

interface ErrorBody {
  message?: string;
  issues?: { field: string; message: string }[];
}

/** Monta a mensagem de erro: a da API e, se vier, o primeiro campo inválido. */
function errorMessage(body: ErrorBody | null, status: number): string {
  if (!body?.message) return status === 404 ? NOT_CONFIGURED_MESSAGE : `Erro ${status} no servidor.`;
  const issue = body.issues?.[0];
  return issue ? `${body.message} ${issue.message}` : body.message;
}

// ---------------------------------------------------------------------------
// Relógio do servidor. Computador de escola com o relógio errado (horas
// adiantado ou atrasado) faria o cronômetro dos Bufs mostrar o tempo errado,
// porque os horários (endsAt...) vêm do servidor. Toda resposta da API traz o
// cabeçalho Date com a hora do servidor: guardamos a diferença e as telas
// usam serverNow() no lugar de Date.now() quando comparam com esses horários.
// ---------------------------------------------------------------------------

let clockOffsetMs = 0;

function syncServerClock(dateHeader: string | null) {
  const serverTime = dateHeader ? Date.parse(dateHeader) : NaN;
  // o cabeçalho tem precisão de segundos: +500ms é o meio do segundo
  if (!Number.isNaN(serverTime)) clockOffsetMs = serverTime + 500 - Date.now();
}

/** A hora agora, no relógio do servidor (em ms, como Date.now()). */
export function serverNow(): number {
  return Date.now() + clockOffsetMs;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
      cache: "no-store",
    });
  } catch {
    throw new ApiError(OFFLINE_MESSAGE, 0);
  }

  syncServerClock(response.headers.get("date"));

  // A API sempre responde JSON (ou nada). Outra coisa (ex.: a página 404 do
  // Next quando o rewrite não existe) vira null.
  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) throw new ApiError(errorMessage(data as ErrorBody | null, response.status), response.status);
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  put: <T>(path: string, body?: unknown) => request<T>("PUT", path, body),
  delete: <T>(path: string) => request<T>("DELETE", path),
};

/** Mensagem pra mostrar na tela a partir de qualquer erro. */
export function describeError(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return OFFLINE_MESSAGE;
}
