# Oyster — Design (Kanji Master N4 SRS)

## Intent

Web app estilo WaniKani para estudar kanji do livro **漢字マスターN4** (207 kanji, 9 capítulos temáticos), escolhendo capítulo(s)/subseção(ões) alinhados à prova da escola em Kyoto. Foco em recall de **significado** e **leitura** (hiragana digitado).

## Goals

- Selecionar conjunto de estudo por capítulo/subseção do N4.
- Lições → fila SRS → revisões intercaladas (significado + leitura).
- Progresso persistente (local primeiro; depois Supabase + Vercel).
- Mobile-first; PT na UI.

## Non-goals (MVP)

- Radicais estilo WaniKani.
- Currículo completo fora do N4.
- Redistribuir conteúdo do livro (PDF, scans, texto integral).
- Mnemônicos editoriais copiados do WaniKani.

## Anti-goals

- Dependência de assinatura paga para estudar.
- Scraping de wanikani.com.

## Constraints

- Significados/leituras base: **KANJIDIC** (CC BY-SA) via `kanjidic2-json` ou build-time enrich.
- Listas por capítulo/seção: **curadoria manual** no repo (`data/kanji-master-n4/`).
- Respostas de significado: **português** (sinônimos aceitos); leitura: **hiragana** (variações on/kun aceitas quando listadas).
- Stack: **Next.js (App Router)**, **TypeScript**, **Tailwind**, **Vitest**; **Supabase** na fase 2; **Vercel** deploy depois do MVP local.

## Core flows

1. **Estudar:** escolher seções → ver kanji disponíveis → iniciar lições.
2. **Lição:** cartão com kanji, significados, on/kun, 0–3 exemplos (manual/JMdict depois) → marcar aprendido → SRS estágio 1.
3. **Revisão:** fila por `next_review_at`; digitar resposta; acerto/erro atualiza estágio.
4. **Home:** contagem de revisões devidas; atalho para continuar.

## SRS (MVP)

Estágios 1–8 com intervalos inspirados no WaniKani (horas/dias). Erro: −1 estágio (mín 1). Acerto: +1 (máx 8). Estágio 8 = “queimado” (fora da fila ativa; pode reativar depois).

Intervalos após lição/revisão correta (horas até próxima revisão):

| Estágio | Horas |
|--------|-------|
| 1 | 4 |
| 2 | 8 |
| 3 | 24 |
| 4 | 48 |
| 5 | 168 |
| 6 | 336 |
| 7 | 720 |
| 8 | burned |

## Data model (logical)

- `Chapter` → `Section` → `kanjiIds[]`
- `KanjiEntry`: `id`, `character`, `meaningsPt[]`, `onReadings[]`, `kunReadings[]`, `strokeCount?`, `jlpt?`
- `UserKanjiProgress`: `kanjiId`, `srsStage`, `nextReviewAt`, `lastReviewedAt`, `meaningStreak`, `readingStreak`

## Licensing note

Incluir `docs/LICENSE-DATA.md` citando KANJIDIC CC BY-SA e que o livro Kanji Master não é reproduzido.
