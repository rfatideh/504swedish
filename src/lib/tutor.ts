export type TutorMode = "bilingual" | "immersion" | "english";

export const DEFAULT_MODE: TutorMode = "bilingual";

/** Vercel AI Gateway slug for Claude Haiku 4.5 (verified against the gateway provider). */
// export const GATEWAY_MODEL = "anthropic/claude-haiku-4.5";
export const GATEWAY_MODEL = "openai/gpt-4o-mini";

/** Order shown in the mode selector. */
export const TUTOR_MODES: {
  id: TutorMode;
  label: string;
  description: string;
}[] = [
  {
    id: "bilingual",
    label: "Bilingual",
    description: "Simple Swedish + English gloss",
  },
  { id: "immersion", label: "Immersion", description: "Mostly Swedish" },
  { id: "english", label: "English", description: "Explained in English" },
];

const BASE = [
  "You are a warm, encouraging Swedish language tutor for complete beginners (CEFR A1–A2).",
  "Keep replies short and focused (2–5 sentences) and use simple vocabulary and short sentences.",
  "When the learner makes a mistake in Swedish, gently correct it and briefly say why.",
  "Give one small, concrete example when it helps. Introduce at most a few new words at a time.",
  "Stay on Swedish-learning topics; if asked something off-topic, gently steer back.",
].join(" ");

export const SYSTEM_PROMPTS: Record<TutorMode, string> = {
  bilingual: `${BASE} Reply in simple Swedish first, then give a brief English gloss (in parentheses or on the next line) so a beginner can follow.`,
  immersion: `${BASE} Reply mostly in simple Swedish; use English only sparingly for a critical clarification. Prefer rephrasing in easier Swedish over translating.`,
  english: `${BASE} Reply primarily in clear English, explaining grammar and usage, and always include Swedish example words/sentences with their meanings.`,
};
