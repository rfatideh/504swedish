// src/lib/data.ts
import wordListJson from "../../default_words_list.json";
import type { Lesson, WordList } from "./types";

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
