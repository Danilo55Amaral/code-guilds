"use client";

import { useCallback, useEffect, useState } from "react";
import { useStudents } from "@/engine/store";
import { SUBJECTS, getSubject, type SubjectId } from "@/engine/subjects";
import VirtualLibraryBanner from "@/components/library/VirtualLibraryBanner";
import BookCard from "@/components/library/BookCard";
import BookDetails from "@/components/library/BookDetails";
import BookReader from "@/components/books/BookReader";
import { BOOK_INFO, BOOK_LOADERS } from "@/components/books/catalog";

// ============================================================================
// BIBLIOTECA VIRTUAL — a estante com um livro didático por matéria dos tomos
// do conhecimento. Tocar na capa abre a ficha do livro; "Abrir o livro" abre
// a leitura em tela cheia (components/books/BookReader). A página onde o aluno
// parou em cada livro fica guardada no navegador, pra ele continuar dali.
// ============================================================================

const savedKey = (studentId: string) => `cg-book-pages-${studentId}`;

function readSaved(studentId: string): Partial<Record<SubjectId, number>> {
  try {
    return JSON.parse(window.localStorage.getItem(savedKey(studentId)) ?? "{}");
  } catch {
    return {};
  }
}

export default function BibliotecaVirtualPage() {
  const { activeStudent } = useStudents();
  const [details, setDetails] = useState<SubjectId | null>(null);
  const [reading, setReading] = useState<{ subject: SubjectId; page: number } | null>(null);
  const [saved, setSaved] = useState<Partial<Record<SubjectId, number>>>({});
  const studentId = activeStudent?.id;

  useEffect(() => {
    if (studentId) setSaved(readSaved(studentId));
  }, [studentId]);

  const subject = reading?.subject;
  const savePage = useCallback(
    (page: number) => {
      if (!studentId || !subject) return;
      setSaved((s) => {
        if (s[subject] === page) return s;
        const nextSaved = { ...s, [subject]: page };
        try {
          window.localStorage.setItem(savedKey(studentId), JSON.stringify(nextSaved));
        } catch {
          // sem o navegador guardar, o aluno só não continua de onde parou
        }
        return nextSaved;
      });
    },
    [studentId, subject],
  );
  const closeReader = useCallback(() => setReading(null), []);
  const closeDetails = useCallback(() => setDetails(null), []);

  if (!activeStudent) return null;

  const ready = SUBJECTS.filter((s) => BOOK_INFO[s.id]);
  const chapters = ready.reduce((n, s) => n + (BOOK_INFO[s.id]?.chapters.length ?? 0), 0);
  const open = (id: SubjectId, page: number) => {
    setDetails(null);
    setReading({ subject: id, page });
  };
  const detailsSubject = details ? getSubject(details) : undefined;
  const readingInfo = reading ? BOOK_INFO[reading.subject] : undefined;
  const readingLoad = reading ? BOOK_LOADERS[reading.subject] : undefined;

  return (
    <div>
      <VirtualLibraryBanner subjects={SUBJECTS.length} ready={ready.length} chapters={chapters} />

      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <h2 className="font-serif text-lg font-black uppercase tracking-wide text-white">📚 A estante do conhecimento</h2>
        <p className="text-xs text-slate-400">Toque num livro pra ver os capítulos ou abra direto pra ler</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {/* os livros prontos primeiro, depois os que ainda estão sendo escritos */}
        {[...ready, ...SUBJECTS.filter((s) => !BOOK_INFO[s.id])].map((s, i) => (
          <BookCard
            key={s.id}
            subject={s}
            info={BOOK_INFO[s.id]}
            savedPage={saved[s.id]}
            onDetails={() => setDetails(s.id)}
            onOpen={() => open(s.id, saved[s.id] ?? 0)}
            delay={Math.min(i, 12) * 0.06}
          />
        ))}
      </div>

      {detailsSubject && BOOK_INFO[detailsSubject.id] && (
        <BookDetails subject={detailsSubject} info={BOOK_INFO[detailsSubject.id]!} savedPage={saved[detailsSubject.id]} onOpen={(page) => open(detailsSubject.id, page)} onClose={closeDetails} />
      )}
      {reading && readingInfo && readingLoad && (
        <BookReader key={`${reading.subject}-${reading.page}`} info={readingInfo} load={readingLoad} startPage={reading.page} onClose={closeReader} onPageChange={savePage} />
      )}
    </div>
  );
}
