export interface TranslatedText {
  sv: string;
  en: string;
}

export interface Example {
  text: TranslatedText;
}

export interface Meaning {
  is_primary: boolean;
  en: string;
}

export interface RelatedWord {
  text: TranslatedText;
}

export interface Word {
  text: { sv: string };
  part_of_speech: string[];
  meanings: Meaning[];
  examples: Example[];
  synonyms?: RelatedWord[];
  antonyms?: RelatedWord[];
}

export interface Story {
  title: TranslatedText;
  text: TranslatedText;
}

export interface Lesson {
  index: number;
  title: TranslatedText;
  story: Story;
  words: Word[];
}

export interface WordListMeta {
  id: string;
  title: TranslatedText;
  description: string;
  level: string;
  supported_languages: string[];
}

export interface WordList {
  meta: WordListMeta;
  lessons: Lesson[];
}
