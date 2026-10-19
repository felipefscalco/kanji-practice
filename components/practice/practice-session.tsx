"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FocusHeader } from "@/components/practice/focus-header";
import { ReviewCard } from "@/components/practice/review-card";
import { CheckIcon } from "@/components/ui/icons";
import { Kbd } from "@/components/ui/kbd";
import { Toast } from "@/components/ui/toast";
import { correctAnswer, gradeItem } from "@/lib/review-grading";
import type { ReviewItem } from "@/lib/review-session";
import {
  advance,
  answer,
  answeredKinds,
  counts,
  createSession,
  currentEntry,
  isFinished,
  minutesRemaining,
  undoError,
  type SessionState,
} from "@/lib/session";

/** Runs one batch in focus mode and hands the finished state back. */
export function PracticeSession({
  items,
  onFinish,
}: {
  items: ReviewItem[];
  onFinish: (state: SessionState) => void;
}) {
  const router = useRouter();
  const [session, setSession] = useState(() => createSession(items, Date.now()));
  const [kanaMode, setKanaMode] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  const [typoToast, setTypoToast] = useState(false);

  const entry = currentEntry(session);
  const { ok, err } = counts(session);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !e.isComposing) {
        router.push("/");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  function handleSubmit(value: string) {
    if (!entry) {
      return;
    }
    const correct = value.trim().length > 0 && gradeItem(entry.item, value);
    setSession((s) => answer(s, correct ? "ok" : "err", value, Date.now()));
    setAnnouncement(
      correct ? "Correto." : `Incorreto. Resposta correta: ${correctAnswer(entry.item)}.`,
    );
    // TODO(design): toast "X subiu para <estágio>" once practice records SRS stages.
  }

  function handleUndo() {
    setSession(undoError);
    setAnnouncement("Erro desfeito. Contou como acerto.");
    setTypoToast(true);
  }

  function handleContinue() {
    const next = advance(session);
    setAnnouncement("");
    setTypoToast(false);
    if (isFinished(next)) {
      onFinish(next);
      return;
    }
    setSession(next);
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <FocusHeader
        title="Sessão de revisão"
        current={session.cursor}
        total={session.entries.length}
        results={session.results}
        ok={ok}
        err={err}
        minutesLeft={minutesRemaining(session)}
      />
      <main className="flex flex-1 flex-col items-center gap-4 px-4 pb-8 pt-1 sm:gap-5 sm:px-6 sm:pb-12 sm:pt-10">
        {entry ? (
          <ReviewCard
            key={session.cursor}
            item={entry.item}
            outcome={session.pending}
            answered={answeredKinds(session, entry.item)}
            kanaMode={kanaMode}
            onToggleKana={() => setKanaMode((on) => !on)}
            onSubmit={handleSubmit}
            onUndo={handleUndo}
            onContinue={handleContinue}
          />
        ) : null}

        {typoToast ? (
          <Toast
            className="w-full max-w-[720px]"
            icon={
              <span className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-ok-bg text-ok-ink">
                <CheckIcon size={16} />
              </span>
            }
            title="Erro desfeito"
            description="Contou como acerto e não volta no fim da sessão"
          />
        ) : null}

        <p className="m-0 hidden flex-wrap justify-center gap-x-[18px] gap-y-2 text-[13px] text-text-3 pointer-fine:flex">
          <span><Kbd>Enter</Kbd> verificar / continuar</span>
          <span><Kbd>⌃K</Kbd> alternar romaji→kana</span>
          <span><Kbd>/</Kbd> ver detalhes após responder</span>
          <span><Kbd>⌫</Kbd> foi erro de digitação</span>
          <span><Kbd>Esc</Kbd> sair</span>
        </p>
      </main>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
