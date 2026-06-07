import type { Story } from "../lib/types";
import { Translation } from "./Translation";

export function StorySection({ story }: { story: Story }) {
  return (
    <section className="mt-12 border-t border-zinc-200 pt-10">
      <h2 className="mb-1 text-lg font-bold text-[#006AA7]">
        Berättelse / Story
      </h2>
      <h3 className="mb-5 text-base font-semibold text-zinc-600">
        {story.title.sv} / {story.title.en}
      </h3>
      <p className="text-lg leading-relaxed text-zinc-800">{story.text.sv}</p>
      <Translation className="mt-4 block text-base leading-relaxed text-zinc-400">
        {story.text.en}
      </Translation>
    </section>
  );
}
