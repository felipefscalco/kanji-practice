# Prompt para o Claude Code (CLI)

> Copie a pasta `oyster-redesign/` para a raiz do projeto (ex.: `docs/design/oyster-redesign/`) e cole o texto abaixo no `claude`. Ajuste o caminho se usar outro.

---

Você vai implementar o redesign "Sumi & Shu" do Oyster (app de kanji SRS, Next.js na Vercel). Toda a especificação está em `docs/design/oyster-redesign/`:

- `DESIGN.md`: especificação completa (princípios, tokens, cores semânticas, telas, componentes, checklist de acessibilidade). **Leia inteiro antes de começar.**
- `tokens/tokens.css`: CSS variables (dark padrão, light com `[data-theme="light"]`), keyframes e reduced-motion.
- `tokens/tailwind-v4-theme.css` e `tokens/tailwind.preset.js`: mapeamento para Tailwind v4 e v3. Use só o que corresponde à versão instalada.
- `screens/*.html`: mockups estáticos de cada tela, desktop (1440) e mobile (390). **São a fonte da verdade para medidas, espaçamentos e hierarquia.** Abra e leia o HTML para copiar valores exatos; não arredonde.
- `screenshots/*.png`: as mesmas telas renderizadas, para referência visual.

## Regras

1. **Não mude a lógica de negócio**: algoritmo SRS, intervalos, parsing de respostas, conversão romaji→kana, dados do currículo, persistência. Este trabalho é de UI/UX. Se uma tela pedir um dado que ainda não existe (ex.: sequência de dias, distribuição por estágio, previsão de revisões), crie o seletor/derivação a partir dos dados existentes. Se não for possível, deixe um placeholder claro com `// TODO(design):` e me avise no resumo final.
2. **Mapeie os estágios SRS existentes** para os 5 grupos visuais (種 Semente, 芽 Broto, 葉 Folha, 花 Flor, 実 Fruto) com uma função pura e testável. Não renomeie estágios no banco/armazenamento.
3. **Todo texto de UI em pt-BR.** Substitua "Meaning / Reading / Examples" e qualquer outro texto em inglês. Conteúdo de estudo continua em japonês, com `lang="ja"`.
4. Mantenha os atalhos existentes (Enter verificar/continuar) e adicione os da tabela em `DESIGN.md §6`.
5. Fontes via `next/font/google` (Klee One 400/600, Zen Kaku Gothic New 400/500/700, Schibsted Grotesk 400–700) expostas como `--font-kanji`, `--font-jp`, `--font-ui`. Nenhum asset pesado novo.
6. Componentes reutilizáveis em `components/ui/` (ou na convenção que o projeto já usa), seguindo `DESIGN.md §5`. Prefira estender componentes existentes a duplicar.
7. Acessibilidade conforme o checklist de `DESIGN.md §6`: elementos semânticos reais, foco visível, `aria-live` no resultado da resposta, alvos ≥ 44px, `prefers-reduced-motion`.
8. Commits pequenos, um por fase, com mensagens claras. Não faça push.

## Plano (execute em fases; ao fim de cada uma rode lint, typecheck e build, e corrija o que quebrar)

**Fase 0: Reconhecimento.** Explore o repositório: rotas (`/study`, `/lessons`, `/practice`), componentes, onde vive o estado SRS, versão do Tailwind, como o tema é aplicado. Escreva um plano curto que mapeie cada tela/componente do DESIGN.md para arquivos reais e me mostre antes de editar.

**Fase 1: Fundação.** Adicione os tokens, as fontes e o tema (dark padrão), o reset de foco e reduced-motion. Remova as cores antigas (rosa #FF0066, verdes do logo/label/header de capítulo). Crie os componentes base: Button, IconButton, Kbd, ToggleChip, ItemTag, QuestionBand, Hanko, ProgressBar, SessionProgress.

**Fase 2: Prática (`/practice`), a tela mais importante.** Implemente conforme `Pratica-Desktop.html`, `Pratica-Erro-Desktop.html` e os 4 `Pratica-*-Mobile.html`:
- modo foco (sem nav global);
- sessões em lotes de 20, com fila de repetição para itens errados no fim do lote;
- faixa de tipo de pergunta;
- AnswerInput com estados idle/typing/correct/wrong/almost;
- comparação "você escreveu × correta";
- "Foi erro de digitação" (desfaz o erro);
- painel de detalhes (abas no desktop, acordeão no mobile);
- toast de mudança de estágio;
- microinterações (shake no erro, ✓ no acerto) respeitando reduced-motion;
- layout mobile que não fica atrás do teclado virtual. Use `visualViewport` e/ou `interactive-widget=resizes-content` e teste em 390px sem overflow horizontal.

**Fase 3: Resumo de sessão.** Nova tela/estado ao fim de cada lote, conforme `Resumo-*.html`. Inclui "Revisar os erros agora" e "Próxima sessão".

**Fase 4: Navegação + Início.** AppHeader com estado ativo e BottomTabBar no mobile. Nova home (`/`) conforme `Dashboard-*.html`. "Currículo" passa a ser só `/study`; "Prática" vira "Revisões", com badges de contagem.

**Fase 5: Currículo (`/study`).** Seletor de capítulo, chips de tipo de pergunta (mínimo 1 ligado), ações em lote, cards por subseção com checkbox tri-state, KanjiTile agrupado pela palavra do livro, barra fixa inferior com resumo e CTA.

**Fase 6: Lição (`/lessons`).** Modo foco, fila de kanji, 3 passos em abas (Significado → Leitura → Exemplos), campo de mnemônico do usuário (persistir junto do item, se já houver storage; senão, `TODO`), placeholder de ordem dos traços, navegação ← →, estado final "N kanji aprendidos → Começar quiz".

**Fase 7: Estados e polimento.** Vazio, carregando (skeleton com a mesma geometria), erro de rede, concluído (`Estados.html`). Light mode completo via `data-theme`, com toggle nas configurações e respeito a `prefers-color-scheme` na primeira visita. Passe pelo checklist de acessibilidade e corrija contrastes.

## Ao terminar cada fase

Mostre em poucas linhas o que mudou, os arquivos tocados, os `TODO(design)` deixados e qualquer ponto em que você precisou desviar do DESIGN.md (e por quê). Espere meu OK antes da próxima fase.
