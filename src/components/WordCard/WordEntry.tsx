import type { Word } from "../../lib/types";
import { Translation } from "../Translation";
import { Meanings } from "./Meanings";
import { RelatedWords } from "./RelatedWords";

export function WordEntry({
  word,
  number,
  headword,
  senseLabel,
}: {
  word: Word;
  number?: number;
  headword?: string;
  senseLabel?: string;
}) {
  const hasSynonyms = word.synonyms && word.synonyms.length > 0;
  const hasAntonyms = word.antonyms && word.antonyms.length > 0;

  return (
    // Headword + POS sit in a slim left column; meanings, related words, and
    // examples all fill the right column so the card has no dead space.
    <div className="grid gap-x-6 gap-y-3 sm:grid-cols-[13rem_1fr]">
      <div className="flex flex-col items-start gap-2">
        {headword !== undefined && (
          <div className="flex items-baseline gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#006AA7] text-sm font-semibold text-white">
              {number}
            </span>
            <span className="wrap-break-word text-2xl font-bold text-zinc-900">
              {headword}
            </span>
          </div>
        )}
        {senseLabel && (
          <span className="text-xs font-semibold text-[#006AA7]">
            {senseLabel}
          </span>
        )}
        {word.part_of_speech.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {word.part_of_speech.map((pos) => (
              <span
                key={pos}
                className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500"
              >
                {pos}
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <Meanings word={word} />
        {(hasSynonyms || hasAntonyms || word.examples.length > 0) && (
          <div className="mt-4 space-y-3 border-t border-zinc-100 pt-4">
            {hasSynonyms && word.synonyms && (
              <RelatedWords label="Synonymer:" words={word.synonyms} />
            )}
            {hasAntonyms && word.antonyms && (
              <RelatedWords label="Antonymer:" words={word.antonyms} />
            )}
            {word.examples.map((ex) => (
              <div key={ex.text.sv}>
                <p className="text-lg text-zinc-700">{ex.text.sv}</p>
                <Translation className="text-md text-zinc-400">
                  {ex.text.en}
                </Translation>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
