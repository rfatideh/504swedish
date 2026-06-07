"use client";

import { useDictionary } from "./DictionaryProvider";

export function SwedishWord({
  word,
  lookup,
  className,
}: {
  word: string;
  // The text sent to the dictionary, if it differs from what's displayed.
  lookup?: string;
  className?: string;
}) {
  const { openWord } = useDictionary();

  return (
    <button
      type="button"
      onClick={() => openWord(lookup ?? word)}
      className={`cursor-pointer text-left ${className ?? ""}`}
    >
      {word}
    </button>
  );
}
