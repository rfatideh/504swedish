import type { WordGroup } from "../../lib/types";
import { WordEntry } from "./WordEntry";

export function WordCard({
  group,
  number,
}: {
  group: WordGroup;
  number: number;
}) {
  const hasMultiple = group.entries.length > 1;

  return (
    <div
      id={`word-${number}`}
      className="scroll-mt-20 space-y-6 rounded-xl border border-zinc-200 bg-white p-6"
    >
      {group.entries.map((word, i) => (
        <div
          key={`${word.part_of_speech.join("-")}-${word.meanings[0]?.en ?? i}`}
          className={i > 0 ? "border-t border-zinc-200 pt-6" : ""}
        >
          <WordEntry
            word={word}
            number={i === 0 ? number : undefined}
            headword={i === 0 ? group.text : undefined}
            senseLabel={hasMultiple ? `Betydelse ${i + 1}` : undefined}
          />
        </div>
      ))}
    </div>
  );
}
