"use client";

import { Button, ButtonLink } from "@/components/ui/button";
import { StatePanel, StateSeal } from "@/components/ui/state-panel";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <StatePanel
        visual={
          <StateSeal
            tone="error"
            glyph={
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
              </svg>
            }
          />
        }
        title="Não foi possível carregar esta tela"
        actions={
          <>
            <Button variant="primary" onClick={reset}>
              Tentar novamente
            </Button>
            <ButtonLink href="/" variant="ghost">
              Voltar ao início
            </ButtonLink>
          </>
        }
      >
        Seu progresso e sua seleção continuam salvos neste aparelho.
      </StatePanel>
    </main>
  );
}
