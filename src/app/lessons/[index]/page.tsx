// src/app/lessons/[index]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { StorySection } from "../../../components/StorySection";
import { WordCard } from "../../../components/WordCard";
import { getAllLessonIndices, getLessonByIndex } from "../../../lib/data";

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

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="mb-8 inline-block text-sm text-zinc-500 transition-colors hover:text-[#006AA7]"
      >
        ← All Lessons
      </Link>

      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#006AA7]">
          Lektion {lesson.index}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-zinc-900">
          {lesson.story.title.sv}
        </h1>
        <p className="text-zinc-500">{lesson.story.title.en}</p>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-bold text-zinc-700">Words</h2>
        <div className="space-y-4">
          {lesson.words.map((word, i) => (
            <WordCard key={i} word={word} />
          ))}
        </div>
      </section>

      <StorySection story={lesson.story} />
    </main>
  );
}
