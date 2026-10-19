import { ButtonLink } from "@/components/ui/button";
import { StatePanel, StateSeal } from "@/components/ui/state-panel";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4">
      <StatePanel
        visual={<StateSeal glyph="無" />}
        title="Página não encontrada"
        actions={
          <ButtonLink href="/" variant="primary">
            Voltar ao início
          </ButtonLink>
        }
      >
        Este endereço não existe no Oyster.
      </StatePanel>
    </main>
  );
}
