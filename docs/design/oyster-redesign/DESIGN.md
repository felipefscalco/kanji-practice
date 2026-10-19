# Oyster — Redesign "Sumi & Shu" (墨と朱)

Especificação de design para implementar no app Next.js. Referências visuais: `screens/*.html` (abrem no navegador, são a fonte da verdade para medidas) e `screenshots/*.png`. Tokens: `tokens/`.

## 1. Princípios

1. **Cor só onde comunica.** Neutros sumi/washi para tudo; cor apenas para *tipo de item*, *tipo de pergunta*, *estado da resposta* e *estágio SRS*.
2. **A pergunta tem que ser óbvia em 0,5 s.** Card colorido = o que é o item; faixa abaixo = o que responder. Nunca só cor: sempre ícone + rótulo.
3. **Sessões curtas.** Lotes de 20 itens, progresso por sessão, resumo no fim.
4. **Mobile primeiro na prática.** Tudo que importa cabe acima do teclado virtual.
5. **Todo texto de UI em pt-BR.** Só conteúdo de estudo em japonês. Nada de "Meaning/Reading/Examples".

## 2. Tokens (ver `tokens/tokens.css`)

- Dark é o padrão; light via `<html data-theme="light">`.
- **Primário** = washi `#EFEAE0` com texto `#141210` (no light inverte). Um primário por tela.
- **Shu** `#C2401F`/`#E0532F` = marca (hanko do logo, sequência, carimbo 完, aba ativa). **Nunca** dentro da área de resposta (para não confundir com erro).
- Remover o rosa `#FF0066` e os verdes atuais do logo/label/header de capítulo.

### Cores semânticas

| Uso | Token | Valor | Texto sobre |
|---|---|---|---|
| Kanji (card do prompt) | `--color-kanji` | #3B54A8 藍 | branco (6.9:1) |
| Vocabulário | `--color-vocab` | #7B4A9C 紫 | branco (6.3:1) |
| Pergunta: Significado | `--color-q-meaning` | #E0A93B 山吹, ícone **Aa** | #141210 |
| Pergunta: Leitura | `--color-q-reading` | #EFEADF 白練, ícone **あ** | #141210 |
| Pergunta: Escrita | `--color-q-writing` | #0B0A09 墨, ícone **筆** | --color-text + borda |
| Correto | `--color-ok*` | #3FB57C / bg #11301F / ink #86E0AE | ícone ✓ + "Correto" |
| Incorreto | `--color-err*` | #E5534B / bg #3A1513 / ink #FFA39B | ícone ✕ + "Incorreto" |
| Quase (typo tolerado) | `--color-q-meaning` | borda ocre | "! Quase" |
| Desabilitado | — | sem fundo, borda tracejada `--color-line-strong`, texto `--color-text-3` | — |

### Estágios SRS (nomes próprios, não usar os do WaniKani)

| # | Glifo | Nome | Token | Intervalos sugeridos |
|---|---|---|---|---|
| 1 | 種 | Semente | `--color-srs-1` | 4h · 8h |
| 2 | 芽 | Broto | `--color-srs-2` | 1d · 2d |
| 3 | 葉 | Folha | `--color-srs-3` | 1 sem |
| 4 | 花 | Flor | `--color-srs-4` | 2 sem · 1 mês |
| 5 | 実 | Fruto | `--color-srs-5` | 4 meses |

Se o app já tem estágios com outros intervalos, **mantenha a lógica existente** e só mapeie para estes 5 grupos visuais.

### Tipografia (Google Fonts via `next/font/google`)

- `Klee One` 600 — kanji de estudo (prompt, tiles, lição). Estilo livro didático.
- `Zen Kaku Gothic New` 400/500/700 — kana, leituras, rótulos japoneses. Tracking +0.06em em leituras.
- `Schibsted Grotesk` 400–700 — UI latina; `font-variant-numeric: tabular-nums` em contadores.
- Escala: kanji-hero 160 (mobile 120) · prompt-word 64 (mobile 44) · display 40 · h1 34 · h2 22 · input de resposta 28 · body 16 · small 14 · caption 12.5 (mínimo).
- Leituras em hiragana usam `--color-text-2`, nunca cinza claro.
- Sempre `lang="ja"` nos elementos com conteúdo japonês.

### Espaço, raio, sombra, movimento

- Base 4: 4, 8, 12, 16, 24, 32, 48, 64. Gutter 16 (mobile) / 24 (desktop). Coluna de prática máx. 720px; conteúdo máx. 1120px.
- Raios: 6 / 12 / 16 / 24 / pill. Card de prática 24 (desktop) / 20 (mobile).
- No dark a profundidade vem de superfícies mais claras; sombra só reforça.
- Movimento: fast 120ms, base 200ms, stamp 320ms, shake 280ms (±6px ×3). `prefers-reduced-motion`: tudo vira fade de 120ms, sem shake/escala.

## 3. Navegação e rotas

| Antes | Depois |
|---|---|
| Início = Currículo (`/study`) | **Início** (`/`) = novo dashboard |
| Currículo | **Currículo** (`/study`) |
| Lições (`/lessons`) | **Lições** (`/lessons`) com badge de pendentes |
| Prática (`/practice`) | **Revisões** (`/practice`) com badge de itens prontos |

- Desktop: header 64px, logo hanko 字 + "Oyster / 漢字マスター N4", abas com `aria-current="page"` e sublinhado shu.
- Mobile: header 56px + **tab bar inferior** 72px (Início, Lições, Revisões, Currículo; ícone + rótulo).
- **Modo foco** em Prática e Lição: some o header/tab bar; fica só "✕ Sair", progresso e contadores.

## 4. Telas

### 4.1 Prática (`Pratica-*.html`) — prioridade 1
- Header foco: Sair (Esc) · "Sessão de revisão · 7 de 20" + barra segmentada (1 segmento por item; concluído = text-2; erro = err; atual com anel) · contadores ✓/✕.
- Card: área do prompt (cor do tipo de item, tag "Kanji"/"Vocabulário", subseção no canto, kanji 168px ou palavra 60px) → **faixa do tipo de pergunta** (52–64px) → input 64–76px, centralizado, com pílula de modo `shuu → かな` à esquerda e keycap ↵ à direita.
- Ações sempre com rótulo: `あ Kana ligado ⌃K` · `Não sei` · `Verificar Enter` (primário, mais largo). Verificar desabilitado (tracejado) com input vazio.
- **Acerto:** input fica ok-bg + borda ok + ✓; se o item sobe de estágio, toast "公 subiu para Folha · próxima revisão em 1 semana". Botões viram `Detalhes` + `Continuar`.
- **Erro:** input err + ✕ + shake; bloco de comparação "Você escreveu" (diferença sublinhada ondulada err) vs "Resposta correta" (diferença sublinhada ok); dica de confusão quando houver (homófonos, kanji parecidos); ações `Foi erro de digitação` · `Detalhes /` · `Continuar Enter`; legenda "Volta no fim desta sessão · estágio X → Y".
- Painel de detalhes: abas no desktop (Palavra · Kanji (n) · Meu mnemônico), acordeão no mobile (1º aberto).
- Resultado anunciado via `aria-live="polite"`.
- Mobile: header 56px, card com margem 16px (corrige overflow atual), prompt 196px, tudo nos primeiros ~470px; usar `interactive-widget=resizes-content` no viewport e/ou `visualViewport` para manter input visível com teclado aberto.

### 4.2 Resumo de sessão (`Resumo-*.html`)
Carimbo 完 (animação stamp), "Sessão concluída · 20 itens em 6 min", 4 métricas (precisão, corretas, para reforçar, sequência), lista "Subiram de estágio" (glifo antes → depois), lista "Para reforçar" (o que digitou), botão "Revisar os N erros agora", CTA "Próxima sessão · 20 itens" + "Voltar ao início".

### 4.3 Início / Dashboard (`Dashboard-*.html`)
Saudação + capítulo atual. Dois cards de ação: **Revisões** (primário — revisar antes de aprender) e **Lições** (secundário, mostra os kanji novos). Abaixo: progresso do capítulo por subseção, distribuição SRS (barra empilhada + glifos), sequência da semana + próximas revisões.

### 4.4 Currículo (`Curriculo-*.html`)
Seletor de capítulo (tabs segmentadas), chips de tipo de pergunta com estado claro (ligado = preenchido + ✓, `aria-pressed`; mínimo 1 ligado), ações em lote (Selecionar capítulo · Só o que já aprendi · Limpar). Cada subseção é um card com checkbox de grupo (tri-state) e **tiles de kanji agrupados pela palavra do livro** (毎週, 映画館, 公園…). Tile: kanji Klee One 44px, leitura, significado, glifo do estágio; selecionado = borda kanji-ink 2px + ✓; "novo" = lição pendente. Barra fixa inferior com resumo da seleção + "Começar prática".

### 4.5 Lição (`Licao-*.html`)
Modo foco; fila de kanji da lição no header (atual destacado). Coluna esquerda: card do kanji 200px + ordem dos traços (placeholder → KanjiVG). Direita: **3 passos em abas** — Significado (+ componentes/radicais + campo "Seu mnemônico", que reaparece quando errar) → Leitura (on'yomi / kun'yomi separados, okurigana em text-3, botão Ouvir) → Exemplos (palavras do capítulo). Navegação ← → e "Próximo: Leitura". Ao fim: estado "5 kanji novos aprendidos" → "Começar quiz".

### 4.6 Estados (`Estados.html`)
Vazio de currículo, nada para revisar (休 + próxima revisão + prática extra que não afeta SRS), carregando (skeleton com a mesma geometria), erro de rede (respostas salvas localmente + tentar novamente), lições concluídas (済), sessão concluída (完).

## 5. Componentes (`Componentes.html`)
Button (primary/secondary/ghost/disabled, com `kbd` opcional) · IconButton (sempre `aria-label`) · ToggleChip · KanjiTile · AnswerInput (idle/typing/correct/wrong/almost/disabled) · QuestionBand (meaning/reading/writing) · ItemTag (kanji/vocab) · SessionProgress (segmentado) · ProgressBar · SrsBar · Tabs · Accordion · Toast · AppHeader · BottomTabBar · Kbd · Hanko.

## 6. Acessibilidade (checklist)
- [ ] Contraste AA: corpo ≥ 4.5:1, ≥ 24px ≥ 3:1. Não usar cinza mais claro que `--color-text-3` para texto.
- [ ] Foco visível: `outline 2px var(--color-text)` offset 3px em tudo interativo.
- [ ] Certo/errado nunca só por cor (ícone + texto + aria-live).
- [ ] Alvos ≥ 44px (botões 48 desktop / 52 mobile).
- [ ] `prefers-reduced-motion` respeitado.
- [ ] Elementos reais: `<button>`, `<a>`, `<input>` + `<label>`; tabs com `role="tablist/tab"`, chips com `aria-pressed`, checkbox de grupo com `aria-checked="mixed"`.
- [ ] Atalhos: Enter (verificar/continuar), `/` (detalhes), ⌃K (kana), ⌫ ("foi digitação", só após erro), ← → (lição), Esc (sair). Keycaps só em dispositivos com teclado (`@media (hover:hover) and (pointer:fine)`).
