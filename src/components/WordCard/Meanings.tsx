import type { Word } from "../../lib/types";

export function Meanings({ word }: { word: Word }) {
  const primary = word.meanings.find((m) => m.is_primary);
  const secondary = word.meanings.filter((m) => !m.is_primary);

  return (
    <div>
      {primary && <p className="font-semibold text-zinc-800">{primary.en}</p>}
      {secondary.map((m) => (
        <p key={m.en} className="text-sm text-zinc-500">
          {m.en}
        </p>
      ))}
    </div>
  );
}
