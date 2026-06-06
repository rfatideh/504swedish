// src/app/page.tsx
import { LessonCard } from "../components/LessonCard";
import { getAllLessons } from "../lib/data";

export default function Home() {
  const lessons = getAllLessons();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[#006AA7]">
          504 Swedish Essential Words
        </h1>
        <p className="mt-2 text-zinc-500">
          Inspired by 504 Absolutely Essential Words · Level A1/A2
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard key={lesson.index} lesson={lesson} />
        ))}
      </div>
    </main>
  );
}
