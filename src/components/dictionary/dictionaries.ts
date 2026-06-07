export type DictId = "folkets" | "tyda" | "cambridge";

export interface Dictionary {
  id: DictId;
  label: string;
  // "iframe" renders inline; "external" opens in a new tab (site blocks framing).
  mode: "iframe" | "external";
  buildUrl: (word: string) => string;
}

export const DICTIONARIES: Dictionary[] = [
  {
    id: "folkets",
    label: "Folkets lexikon",
    mode: "iframe",
    buildUrl: (word) =>
      `https://folkets-lexikon.csc.kth.se/folkets/#lookup&${encodeURIComponent(word)}`,
  },
  {
    id: "tyda",
    label: "Tyda",
    mode: "iframe",
    buildUrl: (word) => `https://tyda.se/search/${encodeURIComponent(word)}`,
  },
  {
    id: "cambridge",
    label: "Cambridge",
    mode: "external",
    buildUrl: (word) =>
      `https://dictionary.cambridge.org/dictionary/swedish-english/${encodeURIComponent(
        word,
      )}?q=${encodeURIComponent(word)}`,
  },
];
