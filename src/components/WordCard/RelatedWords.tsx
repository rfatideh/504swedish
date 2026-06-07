import { SwedishWord } from "../dictionary/SwedishWord";

export function RelatedWords({
  label,
  words,
}: {
  label: string;
  words: { text: { sv: string } }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-zinc-400">{label}</span>
      {words.map((w) => (
        <SwedishWord
          key={w.text.sv}
          word={w.text.sv}
          className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600 transition-colors hover:border-[#006AA7] hover:text-[#006AA7]"
        />
      ))}
    </div>
  );
}
