# Swedish Tutor Chat Widget — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimal, fast, good-looking Swedish language tutor **chat widget** to the existing Next.js App Router site. It mounts globally (floating launcher → chat panel), streams answers from Claude Haiku 4.5 via the Vercel AI Gateway, and lets the learner pick one of three tutor styles. Intentionally simple for v1; designed to be extended later (see Future Enhancements).

**Architecture:** A `'use client'` widget island mounted in the root layout, talking to a single streaming Route Handler (`POST /api/chat`). Tutor-mode definitions and system prompts live in one shared module imported by both client and server. No global provider or state library is needed — chat state lives in `useChat` and survives client-side navigation while the layout stays mounted. No new dependencies (`ai`, `@ai-sdk/react`, `@ai-sdk/gateway` are already installed).

**Tech Stack:** Next.js 16.2.7, React 19.2.4 (React Compiler on), TypeScript strict (`@/*` → `./src/*`), Tailwind CSS 4 (CSS-based config in `globals.css`), Biome (lint/format), pnpm. AI: `ai@7.0.4`, `@ai-sdk/react@4.0.5`, `@ai-sdk/gateway@4.0.4`. Auth: `AI_GATEWAY_API_KEY` already in `.env.local` (the `gateway` provider reads it automatically — never print or commit the value).

**Decisions (confirmed with user):**
- **Model:** Claude **Haiku 4.5** via Vercel AI Gateway → slug `anthropic/claude-haiku-4.5`.
- **Form factor:** Floating launcher bubble (bottom-right) → floating chat **card** on desktop, full-width **bottom sheet** on mobile.
- **Tutor mode is user-selectable:** Bilingual beginner (default), Swedish immersion, English explanations.

---

## IMPORTANT: Verify framework APIs first (per AGENTS.md)

This Next.js version has breaking changes; AI SDK 7 changed its API significantly from older versions. The snippets below were **verified against the installed `.d.ts` files** — do not "modernize" them from memory. Before coding, skim:

```
node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md
node_modules/next/dist/docs/01-app/02-guides/streaming.md
```

**Verified AI SDK 7 surface (installed versions):**
- **Client** (`@ai-sdk/react`): `useChat({ transport })`. `DefaultChatTransport` is imported from **`ai`** (not `@ai-sdk/react`). There is **no** `api`/`input`/`handleInputChange`/`handleSubmit`/`isLoading`. Returns `messages`, `sendMessage`, `status` (`'submitted'|'streaming'|'ready'|'error'`), `error`, `stop`, `regenerate`, `setMessages`, `clearError`. Send via `sendMessage({ text }, { body: { mode } })`. Each `UIMessage` has a `parts[]` array (no flat `content`); render text by handling parts whose `type === 'text'`.
- **Server** (`ai`): `streamText({ model, system, messages })`; `await convertToModelMessages(uiMessages)` (returns a Promise in this build); `result.toUIMessageStreamResponse()`.
- **Gateway** (`@ai-sdk/gateway`): `import { gateway } from '@ai-sdk/gateway'`; `model: gateway('anthropic/claude-haiku-4.5')`. Bare string model IDs do **not** auto-resolve — must call `gateway(...)`.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/tutor.ts` | Create | Shared `TutorMode` type, mode list, system prompts, model/default constants |
| `src/app/api/chat/route.ts` | Create | Streaming chat Route Handler (server) |
| `src/components/tutor/ChatMessage.tsx` | Create | Renders one `UIMessage` (iterates `parts`) |
| `src/components/tutor/TutorPanel.tsx` | Create | The chat panel: `useChat`, header + mode selector, message list, composer |
| `src/components/tutor/TutorWidget.tsx` | Create | Launcher button + open/close + responsive container (desktop card / mobile sheet) |
| `src/app/layout.tsx` | Modify | Mount `<TutorWidget />` |

> All commits use the repo's `feat:`/`docs:` style and end with the `Co-Authored-By: Claude Opus 4.8 (1M context)` trailer. Work on a feature branch (current branch is `main`).

---

## Task 0: Branch and prerequisites

- [ ] **Step 1: Confirm runtime.** `ai@7` requires Node ≥ 22 (Next 16 needs ≥ 20.9). Run `node -v`; if < 22, switch/install Node 22 before continuing.
- [ ] **Step 2: Create a feature branch**
  ```bash
  git checkout -b feat/swedish-tutor-widget
  ```
- [ ] **Step 3: Confirm** `.env.local` contains `AI_GATEWAY_API_KEY` (already present) and that `.env.local` is git-ignored. Do not echo the key.

---

## Task 1: Shared tutor module

**Files:** Create `src/lib/tutor.ts`

Single source of truth for tutor behavior, imported by both the client panel and the server route.

- [ ] **Step 1: Create `src/lib/tutor.ts`**
  ```ts
  // src/lib/tutor.ts
  export type TutorMode = 'bilingual' | 'immersion' | 'english';

  export const DEFAULT_MODE: TutorMode = 'bilingual';

  /** Vercel AI Gateway slug for Claude Haiku 4.5 (verified in @ai-sdk/gateway GatewayModelId). */
  export const GATEWAY_MODEL = 'anthropic/claude-haiku-4.5';

  /** Order shown in the mode selector. */
  export const TUTOR_MODES: { id: TutorMode; label: string; description: string }[] = [
    { id: 'bilingual', label: 'Bilingual', description: 'Simple Swedish + English gloss' },
    { id: 'immersion', label: 'Immersion', description: 'Mostly Swedish' },
    { id: 'english', label: 'English', description: 'Explained in English' },
  ];

  const BASE = [
    'You are a warm, encouraging Swedish language tutor for complete beginners (CEFR A1–A2).',
    'Keep replies short and focused (2–5 sentences) and use simple vocabulary and short sentences.',
    'When the learner makes a mistake in Swedish, gently correct it and briefly say why.',
    'Give one small, concrete example when it helps. Introduce at most a few new words at a time.',
    'Stay on Swedish-learning topics; if asked something off-topic, gently steer back.',
  ].join(' ');

  export const SYSTEM_PROMPTS: Record<TutorMode, string> = {
    bilingual: `${BASE} Reply in simple Swedish first, then give a brief English gloss (in parentheses or on the next line) so a beginner can follow.`,
    immersion: `${BASE} Reply mostly in simple Swedish; use English only sparingly for a critical clarification. Prefer rephrasing in easier Swedish over translating.`,
    english: `${BASE} Reply primarily in clear English, explaining grammar and usage, and always include Swedish example words/sentences with their meanings.`,
  };
  ```
- [ ] **Step 2: Verify** `pnpm exec tsc --noEmit` → no errors.
- [ ] **Step 3: Commit** `git add src/lib/tutor.ts && git commit -m "feat: add shared Swedish tutor modes and prompts"`

---

## Task 2: Chat API route (streaming)

**Files:** Create `src/app/api/chat/route.ts`

- [ ] **Step 1: Create `src/app/api/chat/route.ts`**
  ```ts
  // src/app/api/chat/route.ts
  import { streamText, convertToModelMessages, type UIMessage } from 'ai';
  import { gateway } from '@ai-sdk/gateway';
  import { SYSTEM_PROMPTS, DEFAULT_MODE, GATEWAY_MODEL, type TutorMode } from '@/lib/tutor';

  export const maxDuration = 30; // give streaming responses room

  export async function POST(req: Request) {
    const { messages, mode }: { messages: UIMessage[]; mode?: TutorMode } = await req.json();
    const system = SYSTEM_PROMPTS[mode ?? DEFAULT_MODE] ?? SYSTEM_PROMPTS[DEFAULT_MODE];

    const result = streamText({
      model: gateway(GATEWAY_MODEL),
      system,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  }
  ```
  Notes: default Node runtime (do **not** set `edge`). POST is never cached, so no cache config needed.
- [ ] **Step 2: Verify** `pnpm exec tsc --noEmit` → no errors.
- [ ] **Step 3: Smoke-test streaming** (with `pnpm dev` running):
  ```bash
  curl -N -X POST http://localhost:3000/api/chat \
    -H 'content-type: application/json' \
    -d '{"messages":[{"id":"1","role":"user","parts":[{"type":"text","text":"Hej! Vad betyder \"hej\"?"}]}],"mode":"bilingual"}'
  ```
  Expect a streamed (chunked) response, not a single blob. A 401/403 means the gateway key isn't being read — check `.env.local`.
- [ ] **Step 4: Commit** `git add src/app/api/chat/route.ts && git commit -m "feat: add streaming chat API route via AI Gateway"`

---

## Task 3: ChatMessage component

**Files:** Create `src/components/tutor/ChatMessage.tsx`

Renders one message by walking its `parts` (AI SDK 7 has no flat `content`). The `part.type === 'text'` check narrows the union so `part.text` is typed.

- [ ] **Step 1: Create `src/components/tutor/ChatMessage.tsx`**
  ```tsx
  // src/components/tutor/ChatMessage.tsx
  'use client';
  import type { UIMessage } from 'ai';

  export function ChatMessage({ message }: { message: UIMessage }) {
    const isUser = message.role === 'user';
    return (
      <div className={isUser ? 'flex justify-end' : 'flex justify-start'}>
        <div
          className={
            'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ' +
            (isUser
              ? 'bg-[#006AA7] text-white rounded-br-sm'
              : 'bg-zinc-100 text-zinc-800 rounded-bl-sm')
          }
        >
          {message.parts.map((part, i) =>
            part.type === 'text' ? <span key={i}>{part.text}</span> : null,
          )}
        </div>
      </div>
    );
  }
  ```
- [ ] **Step 2: Verify** `pnpm exec tsc --noEmit` → no errors.
- [ ] **Step 3: Commit** `git add src/components/tutor/ChatMessage.tsx && git commit -m "feat: add tutor ChatMessage component"`

---

## Task 4: TutorPanel (useChat + composer + mode selector)

**Files:** Create `src/components/tutor/TutorPanel.tsx`

Owns the conversation. Manages the input string and the selected mode (persisted to `localStorage` under `504sv:tutorMode`, mirroring the existing `SettingsProvider` pattern). The transport is created once via `useRef`. Mode is passed per-send via `sendMessage(..., { body: { mode } })`, which `DefaultChatTransport` merges into the POST body the route reads.

- [ ] **Step 1: Create `src/components/tutor/TutorPanel.tsx`**
  ```tsx
  // src/components/tutor/TutorPanel.tsx
  'use client';
  import { useEffect, useRef, useState } from 'react';
  import { useChat } from '@ai-sdk/react';
  import { DefaultChatTransport } from 'ai';
  import { ChatMessage } from './ChatMessage';
  import { TUTOR_MODES, DEFAULT_MODE, type TutorMode } from '@/lib/tutor';

  const MODE_KEY = '504sv:tutorMode';

  export function TutorPanel({ onClose }: { onClose: () => void }) {
    const transport = useRef(new DefaultChatTransport({ api: '/api/chat' })).current;
    const { messages, sendMessage, status, error, stop } = useChat({ transport });

    const [mode, setMode] = useState<TutorMode>(DEFAULT_MODE);
    const [input, setInput] = useState('');
    const endRef = useRef<HTMLDivElement>(null);

    // Restore saved mode on mount
    useEffect(() => {
      const saved = localStorage.getItem(MODE_KEY) as TutorMode | null;
      if (saved && TUTOR_MODES.some((m) => m.id === saved)) setMode(saved);
    }, []);

    // Auto-scroll to newest
    useEffect(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, status]);

    const busy = status === 'submitted' || status === 'streaming';

    function changeMode(next: TutorMode) {
      setMode(next);
      localStorage.setItem(MODE_KEY, next);
    }

    function submit(e: React.FormEvent) {
      e.preventDefault();
      const text = input.trim();
      if (!text || busy) return;
      sendMessage({ text }, { body: { mode } });
      setInput('');
    }

    return (
      <div className="flex h-full flex-col bg-white">
        {/* Header */}
        <header className="flex items-center gap-2 bg-[#006AA7] px-4 py-3 text-white">
          <span className="font-semibold">Svensk&nbsp;tutor</span>
          <select
            aria-label="Tutor style"
            value={mode}
            onChange={(e) => changeMode(e.target.value as TutorMode)}
            className="ml-auto rounded-md bg-white/15 px-2 py-1 text-xs text-white outline-none"
          >
            {TUTOR_MODES.map((m) => (
              <option key={m.id} value={m.id} className="text-zinc-900">
                {m.label}
              </option>
            ))}
          </select>
          <button
            onClick={onClose}
            aria-label="Close tutor"
            className="rounded-md px-2 py-1 text-lg leading-none hover:bg-white/15"
          >
            ✕
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 && (
            <p className="mt-8 text-center text-sm text-zinc-400">
              Hej! 👋 Ask me anything about Swedish words, grammar, or this lesson.
            </p>
          )}
          <div className="space-y-3">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {status === 'submitted' && (
              <p className="text-sm text-zinc-400">Tänker…</p>
            )}
            {error && (
              <p className="text-sm text-red-600">
                Something went wrong. Please try again.
              </p>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* Composer */}
        <form onSubmit={submit} className="flex items-end gap-2 border-t border-zinc-200 p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
            rows={1}
            placeholder="Skriv ett meddelande…"
            className="max-h-32 flex-1 resize-none rounded-xl border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-[#006AA7]"
          />
          {busy ? (
            <button
              type="button"
              onClick={stop}
              className="rounded-xl bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="rounded-xl bg-[#006AA7] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              Send
            </button>
          )}
        </form>
      </div>
    );
  }
  ```
  Fallback note: if `mode` does not arrive in the request body, switch from per-call `body` to a transport-level `body` function reading a `mode` ref (`new DefaultChatTransport({ api, body: () => ({ mode: modeRef.current }) })`). Confirm by inspecting the `/api/chat` request payload in DevTools during Task 2 verification.
- [ ] **Step 2: Verify** `pnpm exec tsc --noEmit` → no errors.
- [ ] **Step 3: Commit** `git add src/components/tutor/TutorPanel.tsx && git commit -m "feat: add tutor chat panel with mode selector"`

---

## Task 5: TutorWidget (launcher + responsive container)

**Files:** Create `src/components/tutor/TutorWidget.tsx`

Launcher bubble when closed; when open, a desktop card (bottom-right) or mobile bottom sheet, with Esc-to-close and a mobile backdrop. Reuse the overlay/scroll conventions from `src/components/dictionary/DictionaryModal.tsx`.

- [ ] **Step 1: Create `src/components/tutor/TutorWidget.tsx`**
  ```tsx
  // src/components/tutor/TutorWidget.tsx
  'use client';
  import { useEffect, useState } from 'react';
  import { TutorPanel } from './TutorPanel';

  export function TutorWidget() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
      if (!open) return;
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    if (!open) {
      return (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open Swedish tutor"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#006AA7] text-2xl text-white shadow-lg transition-transform hover:scale-105"
        >
          💬
        </button>
      );
    }

    return (
      <>
        {/* Mobile backdrop */}
        <div
          className="fixed inset-0 z-40 bg-black/30 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
        {/* Desktop card / mobile bottom sheet */}
        <div className="fixed inset-x-0 bottom-0 z-50 h-[80vh] overflow-hidden rounded-t-2xl shadow-2xl ring-1 ring-black/5 sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[560px] sm:w-[380px] sm:rounded-2xl">
          <TutorPanel onClose={() => setOpen(false)} />
        </div>
      </>
    );
  }
  ```
- [ ] **Step 2: Verify** `pnpm exec tsc --noEmit` → no errors.
- [ ] **Step 3: Commit** `git add src/components/tutor/TutorWidget.tsx && git commit -m "feat: add floating tutor widget launcher and container"`

---

## Task 6: Mount the widget in the root layout

**Files:** Modify `src/app/layout.tsx`

- [ ] **Step 1:** Add the import and render `<TutorWidget />` as a sibling immediately after `{children}` (inside `<body>`, after the existing `SettingsProvider`/`DictionaryProvider`). It is `fixed`-positioned, so its DOM placement is cosmetic; it does not need a provider. Preserve all existing structure, fonts, and metadata.
  ```tsx
  import { TutorWidget } from '@/components/tutor/TutorWidget';
  // …inside the body, after {children}:
  //   {children}
  //   <TutorWidget />
  ```
- [ ] **Step 2: Verify** `pnpm exec tsc --noEmit` → no errors.
- [ ] **Step 3: Commit** `git add src/app/layout.tsx && git commit -m "feat: mount Swedish tutor widget globally"`

---

## Task 7: End-to-end verification

- [ ] **Step 1:** `pnpm dev`, open `http://localhost:3000`. Launcher appears bottom-right on the home page and on `/lessons/[index]`.
- [ ] **Step 2:** Open the panel, ask a Swedish question. Confirm the reply **streams** token-by-token (watch `/api/chat` in the Network tab).
- [ ] **Step 3:** Change the mode selector, ask again — verify behavior differs (bilingual vs immersion vs English) and the choice **persists across reload** (localStorage).
- [ ] **Step 4:** Switch to a mobile viewport (DevTools): launcher → full-width bottom sheet, scrolls, composer reachable; backdrop + Esc close it.
- [ ] **Step 5:** Test **Stop** mid-stream; test the **error** path (temporarily break the model slug) to see the error message; restore.
- [ ] **Step 6:** `pnpm lint` (Biome) and `pnpm exec tsc --noEmit` pass clean. Optional: `pnpm build` to confirm the route compiles.
- [ ] **Step 7:** Commit any fixes: `git add -A && git commit -m "fix: resolve tutor widget lint/build issues"` (only if needed).

---

## Future Enhancements (enrich the app + showcase full-stack AI skills)

Ordered roughly by effort/impact:

- **Lesson/word context-awareness:** pass the current lesson/word (from the active route) into the system prompt so the tutor answers "about this lesson." Reuse `getLessonByIndex`/`getGroupedWords` in `src/lib/data.ts`.
- **Tool calling (AI SDK `tools` + Zod):** `lookupWord(sv)`, `getLessonWords(index)`, `quizMe(lesson)` backed by the existing JSON — grounded, structured tool use.
- **Generative UI / `streamObject`:** render flashcards, conjugation tables, and mini-quizzes as React components instead of plain text.
- **Deep feature integration:** an "Explain this word" action in `SwedishWord`/`DictionaryModal` that opens the tutor pre-seeded; optional TTS pronunciation.
- **Persistence & history:** persist conversations (localStorage → Prisma DB; repo already has Prisma skills), multi-session history, resumable streams.
- **Quality & safety:** route rate limiting, prompt-injection hardening, evals/telemetry, per-mode prompt tuning, and a Haiku ↔ Sonnet 4.6 (`anthropic/claude-sonnet-4.6`) "fast vs. thorough" toggle.
- **Spaced-repetition tutor:** track struggled words and have the assistant proactively quiz the learner — turning the chat into a personalized learning loop.
