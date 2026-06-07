import type { WordGroup } from "../lib/types";

export function WordOverview({ groups }: { groups: WordGroup[] }) {
  return (
    <section className="mb-8 rounded-xl border border-zinc-200 bg-white p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
        Ord i den här lektionen
      </h2>
      <ol className="flex flex-wrap gap-2">
        {groups.map((group, i) => (
          <li key={group.text}>
            <a
              href={`#word-${i + 1}`}
              className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1 text-sm text-zinc-700 transition-colors hover:border-[#006AA7] hover:text-[#006AA7]"
            >
              <span className="text-xs font-semibold text-zinc-400">
                {i + 1}
              </span>
              {group.text}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
