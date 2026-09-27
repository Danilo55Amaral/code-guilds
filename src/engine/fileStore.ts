// ============================================================================
// ARQUIVOS — os arquivos das entregas (PDF, Word, Scratch, App Inventor,
// Roblox Studio) ficam no IndexedDB do navegador, que aguenta arquivos
// grandes; o localStorage só guarda os dados da entrega (nome, tamanho, id).
// ============================================================================

const DB_NAME = "codeguilds-files";
const STORE = "files";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      reject(new Error("Este navegador não permite guardar arquivos."));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Não foi possível abrir o armazenamento de arquivos."));
  });
}

function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  return openDb().then(
    (db) =>
      new Promise<T | undefined>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const request = action(tx.objectStore(STORE));
        tx.oncomplete = () => {
          db.close();
          resolve(request ? request.result : undefined);
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error ?? new Error("Erro ao acessar os arquivos."));
        };
      }),
  );
}

export function saveFile(id: string, blob: Blob): Promise<void> {
  return run("readwrite", (store) => store.put(blob, id)).then(() => undefined);
}

export function loadFile(id: string): Promise<Blob | undefined> {
  return run<Blob>("readonly", (store) => store.get(id) as IDBRequest<Blob>);
}

export function deleteFiles(ids: string[]): Promise<void> {
  if (ids.length === 0) return Promise.resolve();
  return run("readwrite", (store) => {
    ids.forEach((id) => store.delete(id));
  }).then(() => undefined);
}

/** Baixa um arquivo guardado (abre o "salvar como" do navegador com o nome original). */
export async function downloadFile(id: string, fileName: string): Promise<boolean> {
  const blob = await loadFile(id);
  if (!blob) return false;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
