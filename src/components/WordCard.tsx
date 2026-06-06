// src/components/WordCard.tsx
import type { Word } from "../lib/types";

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
        {primary && <p className="font-semibold text-zinc-800">{primary.en}</p>}
        {secondary.map((m) => (
          <p key={m.en} className="text-sm text-zinc-500">
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
          {word.synonyms.map((s) => (
            <span
              key={s.text.sv}
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
          {word.antonyms.map((a) => (
            <span
              key={a.text.sv}
              className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600"
            >
              {a.text.sv}
            </span>
          ))}
        </div>
      )}

      {/* Examples */}
      <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
        {word.examples.map((ex) => (
          <div key={ex.text.sv}>
            <p className="text-sm text-zinc-700">{ex.text.sv}</p>
            <p className="text-sm text-zinc-400">{ex.text.en}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
