# Phase 1: Content Display — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a read-only Swedish vocabulary learning site that displays all 42 lessons in a grid, with a detail page per lesson showing word cards and the lesson story.

**Architecture:** Next.js App Router Server Components with static generation. `generateStaticParams` pre-renders all 42 lesson routes at build time. A single `lib/data.ts` module is the only entry point to the JSON data — components receive typed props and never import the JSON directly.

**Tech Stack:** Next.js 16.2.7, React 19, TypeScript, Tailwind CSS 4 (CSS-based config), Biome (lint/format), pnpm

---

## IMPORTANT: Read Next.js docs first

Before writing any code, read the relevant Next.js 16 guides — the API has breaking changes from earlier versions (e.g. `params` is now a `Promise` that must be awaited in page components):

```
node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md
node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md
```

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/types.ts` | Create | All TypeScript interfaces for the word list data |
| `src/lib/data.ts` | Create | Single JSON import point; typed accessor functions |
| `src/components/LessonCard.tsx` | Create | Card shown in home lesson grid |
| `src/components/WordCard.tsx` | Create | Full word entry (word, POS, meanings, synonyms, antonyms, examples) |
| `src/components/StorySection.tsx` | Create | Story block at bottom of lesson detail page |
| `src/app/layout.tsx` | Modify | Update site metadata |
| `src/app/page.tsx` | Modify | Home page — lesson grid |
| `src/app/lessons/[index]/page.tsx` | Create | Lesson detail page with `generateStaticParams` |

---

## Task 1: TypeScript Types and Data Helpers

**Files:**
- Create: `src/lib/types.ts`
- Create: `src/lib/data.ts`

- [ ] **Step 1: Create `src/lib/types.ts`**

```typescript
// src/lib/types.ts
export interface TranslatedText {
  sv: string;
  en: string;
}

export interface Example {
  text: TranslatedText;
}

export interface Meaning {
  is_primary: boolean;
  en: string;
}

export interface RelatedWord {
  text: TranslatedText;
}

export interface Word {
  text: { sv: string };
  part_of_speech: string[];
  meanings: Meaning[];
  examples: Example[];
  synonyms?: RelatedWord[];
  antonyms?: RelatedWord[];
}

export interface Story {
  title: TranslatedText;
  text: TranslatedText;
}

export interface Lesson {
  index: number;
  title: TranslatedText;
  story: Story;
  words: Word[];
}

export interface WordListMeta {
  id: string;
  title: TranslatedText;
  description: string;
  level: string;
  supported_languages: string[];
}

export interface WordList {
  meta: WordListMeta;
  lessons: Lesson[];
}
```

- [ ] **Step 2: Create `src/lib/data.ts`**

`default_words_list.json` is at the project root. From `src/lib/data.ts` the relative path is `../../default_words_list.json`. `resolveJsonModule: true` is already set in `tsconfig.json`.

```typescript
// src/lib/data.ts
import wordListJson from '../../default_words_list.json';
import type { Lesson, WordList } from './types';

const wordList = wordListJson as WordList;

export function getAllLessons(): Lesson[] {
  return wordList.lessons;
}

export function getLessonByIndex(index: number): Lesson | undefined {
  return wordList.lessons.find((l) => l.index === index);
}

export function getAllLessonIndices(): number[] {
  return wordList.lessons.map((l) => l.index);
}
```

- [ ] **Step 3: Verify TypeScript compiles cleanly**

Run: `pnpm exec tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts src/lib/data.ts
git commit -m "feat: add types and data accessor helpers"
```

---

## Task 2: LessonCard Component

**Files:**
- Create: `src/components/LessonCard.tsx`

This component renders one card in the home lesson grid. It's a Next.js `<Link>` wrapping a styled div. No interactivity — the whole card is a navigation link.

- [ ] **Step 1: Create `src/components/LessonCard.tsx`**

```tsx
// src/components/LessonCard.tsx
import Link from 'next/link';
import type { Lesson } from '../lib/types';

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Link
      href={`/lessons/${lesson.index}`}
      className="group block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006AA7]">
        Lektion {lesson.index}
      </div>
      <h2 className="text-lg font-bold text-zinc-900 group-hover:text-[#006AA7] transition-colors">
        {lesson.story.title.sv}
      </h2>
      <p className="mt-0.5 text-sm text-zinc-500">{lesson.story.title.en}</p>
      <div className="mt-3 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
        {lesson.words.length} words
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

Run: `pnpm exec tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/LessonCard.tsx
git commit -m "feat: add LessonCard component"
```

---

## Task 3: WordCard Component

**Files:**
- Create: `src/components/WordCard.tsx`

Each word card shows: Swedish word + POS tag(s), meanings (primary emphasized, secondary lighter), optional synonyms and antonyms as pills, and up to 3 bilingual example sentences. Synonyms/antonyms sections are only rendered when the data has them.

- [ ] **Step 1: Create `src/components/WordCard.tsx`**

```tsx
// src/components/WordCard.tsx
import type { Word } from '../lib/types';

export function WordCard({ word }: { word: Word }) {
  const primary = word.meanings.find((m) => m.is_primary);
  const secondary = word.meanings.filter((m) => !m.is_primary);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      {/* Word + POS */}
      <div className="mb-3 flex flex-wrap items-baseline gap-2">
        <span className="text-2xl font-bold text-zinc-900">{word.text.sv}</span>
        {word.part_of_speech.map((pos) => (
          <span
            key={pos}
            className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500"
          >
            {pos}
          </span>
        ))}
      </div>

      {/* Meanings */}
      <div className="mb-3">
        {primary && (
          <p className="font-semibold text-zinc-800">{primary.en}</p>
        )}
        {secondary.map((m, i) => (
          <p key={i} className="text-sm text-zinc-500">
            {m.en}
          </p>
        ))}
      </div>

      {/* Synonyms */}
      {word.synonyms && word.synonyms.length > 0 && (
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">
            Synonymer:
          </span>
          {word.synonyms.map((s, i) => (
            <span
              key={i}
              className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600"
            >
              {s.text.sv}
            </span>
          ))}
        </div>
      )}

      {/* Antonyms */}
      {word.antonyms && word.antonyms.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">
            Antonymer:
          </span>
          {word.antonyms.map((a, i) => (
            <span
              key={i}
              className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600"
            >
              {a.text.sv}
            </span>
          ))}
        </div>
      )}

      {/* Examples */}
      <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
        {word.examples.map((ex, i) => (
          <div key={i}>
            <p className="text-sm text-zinc-700">{ex.text.sv}</p>
            <p className="text-sm text-zinc-400">{ex.text.en}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

Run: `pnpm exec tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/WordCard.tsx
git commit -m "feat: add WordCard component"
```

---

## Task 4: StorySection Component

**Files:**
- Create: `src/components/StorySection.tsx`

Shows the lesson story: heading, bilingual title, Swedish paragraph, English paragraph below it in muted text.

- [ ] **Step 1: Create `src/components/StorySection.tsx`**

```tsx
// src/components/StorySection.tsx
import type { Story } from '../lib/types';

export function StorySection({ story }: { story: Story }) {
  return (
    <section className="mt-12 border-t border-zinc-200 pt-10">
      <h2 className="mb-1 text-lg font-bold text-[#006AA7]">
        Berättelse / Story
      </h2>
      <h3 className="mb-5 text-base font-semibold text-zinc-600">
        {story.title.sv} / {story.title.en}
      </h3>
      <p className="text-base leading-relaxed text-zinc-800">
        {story.text.sv}
      </p>
      <p className="mt-4 text-base leading-relaxed text-zinc-400">
        {story.text.en}
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

Run: `pnpm exec tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/StorySection.tsx
git commit -m "feat: add StorySection component"
```

---

## Task 5: Home Page

**Files:**
- Modify: `src/app/layout.tsx` (metadata only)
- Modify: `src/app/page.tsx`

Replace the default Next.js starter content. The home page is a Server Component — it calls `getAllLessons()` directly (no `async`/`await` needed since it's synchronous).

- [ ] **Step 1: Update metadata in `src/app/layout.tsx`**

Replace only the `metadata` export (keep fonts and layout structure unchanged):

```tsx
export const metadata: Metadata = {
  title: "504 Swedish Essential Words",
  description:
    "Learn Swedish vocabulary inspired by 504 Absolutely Essential Words · Level A1/A2",
};
```

- [ ] **Step 2: Replace `src/app/page.tsx`**

```tsx
// src/app/page.tsx
import { getAllLessons } from '../lib/data';
import { LessonCard } from '../components/LessonCard';

export default function Home() {
  const lessons = getAllLessons();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[#006AA7]">
          504 Swedish Essential Words
        </h1>
        <p className="mt-2 text-zinc-500">
          Inspired by 504 Absolutely Essential Words · Level A1/A2
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.index} lesson={lesson} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles cleanly**

Run: `pnpm exec tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Run dev server and check home page**

Run: `pnpm dev`

Open `http://localhost:3000`. Verify:
- 42 lesson cards in a responsive grid
- Each card shows lesson number, Swedish story title, English subtitle, word count
- Clicking a card navigates to `/lessons/[index]` (page will 404 until Task 6)

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx
git commit -m "feat: implement home page with lesson grid"
```

---

## Task 6: Lesson Detail Page

**Files:**
- Create: `src/app/lessons/[index]/page.tsx`

**Critical Next.js 16 breaking change:** In this version, `params` in page components is a `Promise<{ index: string }>` and must be `await`ed. The page itself must be `async`. See `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-static-params.md`.

`generateStaticParams` returns `{ index: string }[]` — values must be strings even though the data uses numeric indices.

- [ ] **Step 1: Create the directory and page file**

Create `src/app/lessons/[index]/page.tsx`:

```tsx
// src/app/lessons/[index]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllLessonIndices, getLessonByIndex } from '../../../lib/data';
import { StorySection } from '../../../components/StorySection';
import { WordCard } from '../../../components/WordCard';

export function generateStaticParams() {
  return getAllLessonIndices().map((index) => ({ index: String(index) }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const { index } = await params;
  const lesson = getLessonByIndex(Number(index));

  if (!lesson) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-zinc-500 hover:text-[#006AA7] transition-colors"
      >
        ← All Lessons
      </Link>

      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#006AA7]">
          Lektion {lesson.index}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-zinc-900">
          {lesson.story.title.sv}
        </h1>
        <p className="text-zinc-500">{lesson.story.title.en}</p>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-bold text-zinc-700">Words</h2>
        <div className="space-y-4">
          {lesson.words.map((word, i) => (
            <WordCard key={i} word={word} />
          ))}
        </div>
      </section>

      <StorySection story={lesson.story} />
    </main>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

Run: `pnpm exec tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Run dev server and check a lesson page**

Run: `pnpm dev`

Open `http://localhost:3000`. Click any lesson card. Verify:
- "← All Lessons" back link works
- Lesson number and story title in header
- Word cards display: Swedish word, POS tag, primary and secondary meanings
- For words that have them: synonyms and antonyms shown as pills
- 3 example sentences per word: Swedish on top, English below in muted text
- Story section at bottom with heading, bilingual title, Swedish paragraph, muted English paragraph below

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/app/lessons/
git commit -m "feat: implement lesson detail page with word cards and story"
```

---

## Task 7: Build Verification

Verify the static site builds without errors and all 42 lesson pages are pre-rendered.

- [ ] **Step 1: Run production build**

Run: `pnpm build`

Expected output includes:
```
Route (app)                              Size
┌ ○ /                                   ...
├ ● /lessons/[index]                    ...
│ ├ /lessons/1
│ ├ /lessons/2
│ └ ... (42 total)
```

All 42 routes should appear as `●` (statically generated). No build errors.

- [ ] **Step 2: Run linter**

Run: `pnpm lint`
Expected: No errors or warnings.

- [ ] **Step 3: Commit**

No code changes expected. If `pnpm build` or `pnpm lint` flagged any issues, fix them first, then commit the fixes:

```bash
git add -A
git commit -m "fix: resolve build/lint issues"
```

If no issues, no commit needed.
