import { ReviewKindPicker } from "@/components/review-kind-picker";
import { SectionPicker } from "@/components/section-picker";
import { AppShell } from "@/components/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { getChapters } from "@/lib/curriculum";

export default function StudyPage() {
  const chapters = getChapters();
  return (
    <AppShell>
      <h1 className="mb-8 text-[34px] font-bold tracking-[-0.02em]">Currículo</h1>
      <p className="-mt-4 mb-6 text-sm text-[var(--wk-text-muted)]">
        Marque as subseções do capítulo que você está estudando na escola.
      </p>
      <div className="mb-6">
        <ReviewKindPicker />
      </div>
      <SectionPicker chapters={chapters} />
      <div className="mt-8">
        <ButtonLink variant="primary" className="w-full" href="/practice">Começar prática</ButtonLink>
      </div>
    </AppShell>
  );
}
