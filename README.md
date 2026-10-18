# Kanji Practice

SRS estilo WaniKani para estudar kanji do **漢字マスターN4**, começando pelo **Capítulo 4 · スケジュール**.

**Produção:** [https://kanji-practice-jet.vercel.app/](https://kanji-practice-jet.vercel.app/)

Repositório: [github.com/felipefscalco/kanji-practice](https://github.com/felipefscalco/kanji-practice)

## Requisitos

- Node.js 20+ (recomendado: `asdf` com `nodejs 22.11.0` em `.tool-versions`)
- pnpm

## Desenvolvimento local

```bash
pnpm install
pnpm enrich:kanji
pnpm test
cp .env.local.example .env.local   # opcional: SRS debug
pnpm dev
```

Abra [http://localhost:3001](http://localhost:3001) (a porta 3000 costuma estar ocupada pelo Scout no Docker).

## Fluxo

1. **Currículo** — escolha subseções do capítulo 4.
2. **Lições** — cartões com kanji e palavras do livro.
3. **Prática** — significado, leitura e escrita (kanji e vocabulário); erros repetem no mesmo ciclo.

Seleção de seções em `sessionStorage` (por aba); sem login.

## Ajustar kanji do livro

O capítulo 4 segue as subseções do livro (4-1 デート, 4-2 けっこんきねんび, 4-3 しごと). As fotos das páginas estão em `public/kanji-master-n4/ch04/` (mapeamento em `data/kanji-master-n4/ch04-pages.json`).

Traduções PT: `data/kanji-master-n4/meanings-pt.overrides.json`.

## Licença dos dados

Ver [docs/LICENSE-DATA.md](docs/LICENSE-DATA.md).
