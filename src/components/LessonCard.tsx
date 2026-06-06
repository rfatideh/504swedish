// src/components/LessonCard.tsx
import Link from 'next/link';
import type { Lesson } from '../lib/types';

export function LessonCard({ lesson }: { lesson: Lesson }) {
  return (
    <Link
      href={`/lessons/${lesson.index}`}
      className="group block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#006AA7]">
        Lektion {lesson.index}
      </div>
      <h2 className="text-lg font-bold text-zinc-900 group-hover:text-[#006AA7] transition-colors">
        {lesson.story.title.sv}
      </h2>
      <p className="mt-0.5 text-sm text-zinc-500">{lesson.story.title.en}</p>
      <div className="mt-3 inline-block rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs text-zinc-600">
        {lesson.words.length} words
      </div>
    </Link>
  );
}
