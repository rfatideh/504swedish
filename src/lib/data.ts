import wordListJson from "../../data/default_words_list.json";
import type { Lesson, WordGroup, WordList } from "./types";

const wordList = wordListJson as WordList;

export function getAllLessons(): Lesson[] {
  return wordList.lessons;
}

export function getLessonByIndex(index: number): Lesson | undefined {
  return wordList.lessons.find((l) => l.index === index);
}

export function getAllLessonIndices(): number[] {
  return wordList.lessons.map((l) => l.index);
}

export function getGroupedWords(lesson: Lesson): WordGroup[] {
  const groups = new Map<string, WordGroup>();
  for (const word of lesson.words) {
    const existing = groups.get(word.text.sv);
    if (existing) {
      existing.entries.push(word);
    } else {
      groups.set(word.text.sv, { text: word.text.sv, entries: [word] });
    }
  }
  return [...groups.values()];
}
