"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { StatePanel } from "@/components/ui/state-panel";
import { getChapters } from "@/lib/curriculum";
import { bookLessons } from "@/lib/curriculum-groups";
import { setActiveSectionIds } from "@/lib/study-selection";

/** Nothing selected in the curriculum: offer the first book lesson as a start. */
export function EmptySelection({ onSelected }: { onSelected?: () => void }) {
  const chapter = getChapters()[0];
  const first = chapter ? bookLessons(chapter)[0] : undefined;
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <StatePanel
        visual={
          <div aria-hidden className="flex gap-2">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className="h-20 w-[72px] rounded-[12px] border border-dashed border-line-strong" />
            ))}
          </div>
        }
        title="Nenhuma subseção selecionada"
        actions={
          <>
            {first ? (
              <Button
                variant="primary"
                onClick={() => {
                  setActiveSectionIds(first.sections.map((s) => s.id));
                  onSelected?.();
                }}
              >
                Selecionar <span lang="ja">{first.label}</span>
              </Button>
            ) : null}
            <ButtonLink href="/study">Abrir currículo</ButtonLink>
          </>
        }
      >
        Marque o que a aula já cobriu para montar suas revisões.
      </StatePanel>
    </main>
  );
}
