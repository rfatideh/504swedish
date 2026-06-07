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
        <span
          key={w.text.sv}
          className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600"
        >
          {w.text.sv}
        </span>
      ))}
    </div>
  );
}
