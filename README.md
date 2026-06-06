# 504 Swedish Essential Words

A vocabulary learning website for Swedish learners (level A1/A2), inspired by the wording strategy of *504 Absolutely Essential Words* and *Rivstart A1/A2*.

The site presents 42 lessons. Each lesson is built around a short Swedish story and a set of 12–14 essential words, each with its part of speech, English meanings, synonyms/antonyms, and example sentences.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm build` | Production build (statically generates all lesson pages) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Lint with Biome |
| `pnpm format` | Format with Biome |

## How It Works

The site is built with the Next.js App Router using Server Components. All pages are statically generated at build time — there is no client-side data fetching. `generateStaticParams` pre-renders every lesson page.

### Routes

| Route | Description |
|---|---|
| `/` | Home — grid of all 42 lesson cards |
| `/lessons/[index]` | A single lesson: its word list followed by the story (`index` is the 1-based lesson number, e.g. `/lessons/1`) |

### Project Structure

```
data/
  default_words_list.json   ← All lesson content (stories, words, meanings, examples)
src/
  app/
    page.tsx                ← Home: lesson grid
    lessons/[index]/page.tsx ← Lesson detail page
  components/
    LessonCard.tsx          ← Card in the home grid
    WordCard.tsx            ← Word entry (word, POS, meanings, synonyms, antonyms, examples)
    StorySection.tsx        ← Lesson story block
  lib/
    types.ts                ← Types for the word list data
    data.ts                 ← Single access point for the JSON data
```

All content lives in `data/default_words_list.json`. Components never import the JSON directly — they go through `src/lib/data.ts`.

## Roadmap

Phase 1 (content display) is complete. Planned next:

- **Phase 2 — Word interaction:** star/bookmark words, a "starred words" page
- **Phase 3 — Dictionary:** a searchable list of all words across lessons
- **Phase 4 — Practice:** flashcards and multiple-choice quizzes
- **Phase 5 — Progress tracking:** mark words learned, lesson completion

See `docs/superpowers/specs/` for the full design spec.

## Tech Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Biome
