"use client";

import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { TestPaperForm } from "@/components/tests/test-paper";
import { TestResults } from "@/components/tests/test-results";
import { Button } from "@/components/ui/button";
import { getChapterById } from "@/lib/curriculum";
import type { Chapter } from "@/lib/kanji-types";
import {
  buildTest,
  getChapterTest,
  getTestChapterIds,
  gradeTest,
  type TestAnswers,
  type TestPaper,
  type TestResult,
} from "@/lib/tests";

type View =
  | { kind: "pick" }
  | { kind: "taking"; paper: TestPaper }
  | { kind: "done"; paper: TestPaper; answers: TestAnswers; result: TestResult };

function chapterTitle(chapter: Chapter): string {
  return `第${chapter.number}章 ${chapter.titleJa}`;
}

export default function TestsPage() {
  const [view, setView] = useState<View>({ kind: "pick" });

  // The paper is drawn on click, so the random order never runs during prerender.
  function start(chapterId: string) {
    const paper = buildTest(chapterId);
    if (!paper) {
      return;
    }
    setView({ kind: "taking", paper });
    window.scrollTo({ top: 0 });
  }

  function submit(paper: TestPaper, answers: TestAnswers) {
    setView({ kind: "done", paper, answers, result: gradeTest(paper, answers) });
    window.scrollTo({ top: 0 });
  }

  const chapter = view.kind === "pick" ? undefined : getChapterById(view.paper.chapterId);

  return (
    <AppShell className="gap-5 sm:gap-7">
      <div className="flex flex-col gap-1.5">
        <h1 className="m-0 text-[26px] font-bold tracking-[-0.02em] sm:text-[34px]">
          {chapter ? (
            <span lang="ja">{chapterTitle(chapter)} アチーブメントテスト</span>
          ) : (
            "Testes"
          )}
        </h1>
        <p className="m-0 text-text-2">
          {view.kind === "pick"
            ? "Simule a アチーブメントテスト de um capítulo: 10 leituras e 10 escritas, 5 pontos cada."
            : view.kind === "taking"
              ? "Responda tudo e entregue no final — a correção vem só depois, como no papel."
              : "Resultado do teste."}
        </p>
      </div>

      {view.kind === "pick" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {getTestChapterIds().map((id) => {
            const c = getChapterById(id);
            const file = getChapterTest(id);
            if (!c || !file) {
              return null;
            }
            return (
              <section key={id} className="flex flex-col gap-4 rounded-[18px] border border-line bg-surface-1 p-5">
                <div className="flex flex-col gap-1">
                  <h2 lang="ja" className="m-0 text-xl font-bold">
                    {chapterTitle(c)}
                  </h2>
                  <p className="m-0 text-sm text-text-2">{c.titlePt}</p>
                  <p className="m-0 text-sm text-text-3 tabular-nums">
                    {file.reading.length + file.writing.length} questões no banco
                  </p>
                </div>
                <Button variant="primary" onClick={() => start(id)}>
                  Começar teste
                </Button>
              </section>
            );
          })}
        </div>
      ) : null}

      {view.kind === "taking" ? (
        <TestPaperForm paper={view.paper} onSubmit={(answers) => submit(view.paper, answers)} />
      ) : null}

      {view.kind === "done" ? (
        <TestResults
          paper={view.paper}
          answers={view.answers}
          result={view.result}
          onRetake={() => start(view.paper.chapterId)}
          onExit={() => setView({ kind: "pick" })}
        />
      ) : null}
    </AppShell>
  );
}
