import { getGroupedWords, getLessonByIndex } from "./data";
import type { Lesson } from "./types";

function formatWords(lesson: Lesson): string {
  return getGroupedWords(lesson)
    .map((group) => {
      const senses = group.entries
        .map((entry) => {
          const gloss = entry.meanings.map((m) => m.en).join(", ");
          const pos = entry.part_of_speech.join("/");
          return pos ? `${gloss} (${pos})` : gloss;
        })
        .join("; ");
      return `- ${group.text} — ${senses}`;
    })
    .join("\n");
}

export function getLessonContext(index: number): string | undefined {
  const lesson = getLessonByIndex(index);
  if (!lesson) {
    return undefined;
  }

  return [
    `The learner is currently on Lesson ${lesson.index}: "${lesson.story.title.sv}" (${lesson.story.title.en}).`,
    "",
    "The lesson's story (Swedish):",
    lesson.story.text.sv,
    "",
    "Key words in this lesson (Swedish — English meaning):",
    formatWords(lesson),
    "",
    'When the learner asks about "this lesson", "these words", or "the story", use the material above; you can quiz them on these words or explain the story.',
  ].join("\n");
}
