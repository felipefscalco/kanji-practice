# Testes (アチーブメントテスト)

Simulado da prova de fim de capítulo da aula de Kanji Master N4. Fica em `/tests` (aba **Testes**).

## Formato

Igual à folha de papel, um capítulo por vez:

| Seção | Pergunta | Resposta |
| --- | --- | --- |
| 【1】 Leitura (10) | Frase com uma palavra em kanji sublinhada | Digitar a leitura em hiragana (romaji vira kana ao digitar) |
| 【2】 Escrita (10) | Frase com uma palavra em hiragana sublinhada | Escolher a grafia certa em kanji (com okurigana) entre 4 opções |

- 5 pontos por questão, total 100 (てん).
- Sem correção durante a prova: tudo é corrigido ao clicar em **Entregar teste**. Questões em branco contam como erro.
- O resultado mostra a nota e cada questão, com os erros em vermelho (sua resposta riscada ao lado da correta).
- **Refazer com novas questões** sorteia outras 10 + 10 do banco do capítulo.
- Nada é salvo (sem histórico de notas) e o teste não interfere nas revisões.

## Leitura: como a resposta é comparada

`isReadingCorrect` em `lib/tests.ts` ignora espaços, converte katakana e romaji restante (ex.: `n` final) para hiragana e compara com a resposta. Cada questão aceita uma única leitura.

## Banco de questões

Um arquivo por capítulo: `data/kanji-master-n4/tests.ch04.json`, `tests.ch05.json`.

```json
{
  "chapterId": "ch-04",
  "reading": [
    { "id": "t-ch04-r10", "sentence": "休みの日は よく [映画]を 見に 行きます。", "answer": "えいが", "source": "class" }
  ],
  "writing": [
    { "id": "t-ch04-w01", "sentence": "きのう おいしい ベトナム[りょうり]を 食べました。", "answer": "料理", "distractors": ["科理", "料里", "料埋"], "source": "class" }
  ]
}
```

- A parte sublinhada vai entre colchetes `[...]`, exatamente uma vez por frase.
- `reading.answer`: leitura em hiragana do trecho entre colchetes.
- `writing.answer`: grafia em kanji; `distractors`: 3 grafias erradas (kanji parecido, kanji de mesma leitura ou okurigana errado). Nenhuma pode ser uma grafia válida da palavra.
- `source`: `"class"` = transcrita de uma prova real da aula; `"generated"` = criada pelo script abaixo.
- Cada capítulo precisa de pelo menos 10 questões por seção.

Hoje cada capítulo tem 30 + 30: as 10 + 10 das provas da aula e 20 + 20 geradas.

### Gerar mais questões

```bash
pnpm generate:tests ch-05 20   # 20 de leitura + 20 de escrita
```

`scripts/generate-tests.ts` chama o Claude CLI (`claude -p`) com os kanji e o vocabulário do capítulo, pedindo frases originais no nível de Minna no Nihongo I e II. As questões novas são adicionadas ao fim do arquivo. As inválidas (sem colchetes, repetidas, sem kanji do capítulo, distratores duplicados) são descartadas.

**Revise o diff antes de commitar.** O script não detecta erros de sentido, como tempo verbal incoerente ou um distrator que também é grafia válida (ex.: 想って para おもって).

### Adicionar uma prova da aula ou um capítulo novo

- Prova nova de um capítulo existente: acrescente as questões com `"source": "class"` e o próximo `id` livre.
- Capítulo novo: crie `tests.chNN.json` e importe-o na lista `files` em `lib/tests.ts`. O capítulo também precisa existir em `chapters.json` e ter `vocabulary.chNN.json` (o script usa esse vocabulário).

`tests/lib/tests.test.ts` valida todos os arquivos (ids únicos, colchetes, leitura em hiragana, 4 opções distintas). Rode `pnpm test` depois de editar.

## Código

| Arquivo | Papel |
| --- | --- |
| `app/tests/page.tsx` | Página: lista de capítulos → prova → resultado |
| `components/tests/test-paper.tsx` | Formulário da prova (【1】 campos de kana, 【2】 opções) |
| `components/tests/test-results.tsx` | Nota e correção questão a questão |
| `components/tests/test-sentence.tsx` | Frase com o trecho sublinhado |
| `lib/tests.ts` | Tipos, sorteio (`buildTest`), correção (`gradeTest`) |
| `scripts/generate-tests.ts` | Gerador de questões via Claude CLI |

O sorteio acontece no clique em **Começar teste**, nunca na renderização, para não causar diferença entre servidor e cliente.
