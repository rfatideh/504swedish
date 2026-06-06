# 504 Swedish Essential Words — Design Spec

**Date:** 2026-06-06
**Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Biome
**Audience:** Any Swedish language learner (public site)

---

## Data Source

`default_words_list.json` at the project root. 42 lessons, each containing:
- `index` — lesson number
- `title` — bilingual lesson title
- `story` — bilingual story (title + body text in `sv` and `en`)
- `words[]` — 12–14 words per lesson, each with:
  - `text.sv` — Swedish word
  - `part_of_speech[]` — array of POS tags (e.g. `verb`, `noun`)
  - `meanings[]` — each with `is_primary` boolean and `en` translation
  - `examples[]` — up to 3, each with `text.sv` and `text.en`
  - `synonyms[]` (optional) — each with `text.sv` and `text.en`
  - `antonyms[]` (optional) — each with `text.sv` and `text.en`

---

## Architecture

**Rendering strategy:** Next.js App Router Server Components + Static Generation.
All pages are statically pre-rendered at build time. No client-side data fetching.
`generateStaticParams()` in the lesson detail page pre-builds all 42 lesson routes.

**File structure:**
```
src/
  app/
    page.tsx                    ← Home: lesson grid (Server Component)
    lessons/
      [index]/
        page.tsx                ← Lesson detail (Server Component, static)
  components/
    LessonCard.tsx              ← Card in home grid
    WordCard.tsx                ← Full word entry (word, POS, meanings, synonyms, antonyms, examples)
    StorySection.tsx            ← Story block at bottom of lesson page
  lib/
    data.ts                     ← Single import point for JSON; typed accessor helpers
    types.ts                    ← TypeScript types: Lesson, Word, Meaning, Example, SynonymEntry
```

`lib/data.ts` is the only file that imports the JSON. All components receive typed props — they never access the raw data directly.

---

## Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Lesson grid, 42 cards |
| `/lessons/[index]` | Lesson detail | Words + story for one lesson |

---

## Phase 1: Content Display (current scope)

### Home Page (`/`)

- Site header: title "504 Swedish Essential Words", subtitle "Inspired by 504 Absolutely Essential Words · Level A1/A2"
- Responsive lesson grid: 1 col mobile → 2 col tablet → 3 col desktop
- Each **LessonCard** shows:
  - Lesson number ("Lektion 1")
  - Story title in Swedish ("Lugna söndagar")
  - Story title in English below, muted ("Quiet Sundays")
  - Word count badge ("13 words")
  - Full card is a link to `/lessons/[index]`
- Hover: subtle shadow lift

### Lesson Detail Page (`/lessons/[index]`)

**Header:**
- Back link: "← All Lessons" to `/`
- Lesson number + story title

**Word List (primary section):**
Each **WordCard** (stacked, full-width, reading order):
1. Swedish word — large, bold
2. Part of speech — small muted tag (e.g. `verb`)
3. Meanings — primary meaning emphasized; secondary meanings in lighter weight
4. Synonymer / Antonymer — inline pill rows, only rendered if data present
5. Example sentences — up to 3; Swedish line on top, English below in muted text

**Story Section (below word list):**
- Clear visual separator
- Heading: "Berättelse / Story"
- Story title
- Swedish paragraph
- English paragraph below, muted

**Layout:** max-width ~`65ch`, centered, comfortable reading width.

### Visual Style

- Background: neutral off-white (`zinc-50`)
- Cards: white with subtle border
- Accent color: Swedish blue `#006AA7` for headings and highlights
- Typography: system sans-serif, clean hierarchy
- No decorative imagery in Phase 1

---

## Roadmap

### Phase 2: Word Interaction
- Star/bookmark a word (localStorage)
- "Starred Words" page across all lessons
- Progress indicator on lesson cards (starred word count)

### Phase 3: Dictionary
- `/dictionary` — all words from all 42 lessons in one searchable list
- Filter by part of speech
- Search by Swedish or English term

### Phase 4: Practice / Quiz
- Flashcard mode per lesson: show word, reveal meaning on click
- Multiple choice: pick correct meaning from 4 options
- Session score tracking

### Phase 5: Progress Tracking
- Mark word as "learned"
- Lesson completion percentage
- Overall progress dashboard
