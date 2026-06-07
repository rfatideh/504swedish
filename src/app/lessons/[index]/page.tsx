import Link from "next/link";
import { notFound } from "next/navigation";
import { StorySection } from "../../../components/StorySection";
import { TranslationToggle } from "../../../components/settings/TranslationToggle";
import { WordCard } from "../../../components/WordCard";
import { WordOverview } from "../../../components/WordOverview";
import {
  getAllLessonIndices,
  getGroupedWords,
  getLessonByIndex,
} from "../../../lib/data";

export function generateStaticParams() {
  return getAllLessonIndices().map((index) => ({ index: String(index) }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ index: string }>;
}) {
  const { index } = await params;
  const lesson = getLessonByIndex(Number(index));

  if (!lesson) {
    notFound();
  }

  const groups = getGroupedWords(lesson);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-zinc-500 transition-colors hover:text-[#006AA7]"
      >
        ← All Lessons
      </Link>

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#006AA7]">
            Lektion {lesson.index}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-zinc-900">
            {lesson.story.title.sv}
          </h1>
          <p className="text-zinc-500">{lesson.story.title.en}</p>
        </div>
        <TranslationToggle />
      </header>

      <WordOverview groups={groups} />

      <section>
        <h2 className="mb-4 text-lg font-bold text-zinc-700">Words</h2>
        <div className="space-y-4">
          {groups.map((group, i) => (
            <WordCard key={group.text} group={group} number={i + 1} />
          ))}
        </div>
      </section>

      <StorySection story={lesson.story} />
    </main>
  );
}
