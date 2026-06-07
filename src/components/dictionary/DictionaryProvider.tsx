"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { DictionaryModal } from "./DictionaryModal";

interface DictionaryContextValue {
  openWord: (word: string) => void;
}

const DictionaryContext = createContext<DictionaryContextValue | null>(null);

export function DictionaryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [word, setWord] = useState<string | null>(null);

  const openWord = useCallback((next: string) => {
    const trimmed = next.trim();
    if (trimmed) {
      setWord(trimmed);
    }
  }, []);

  const close = useCallback(() => setWord(null), []);

  return (
    <DictionaryContext.Provider value={{ openWord }}>
      {children}
      {word !== null && <DictionaryModal word={word} onClose={close} />}
    </DictionaryContext.Provider>
  );
}

export function useDictionary(): DictionaryContextValue {
  const context = useContext(DictionaryContext);
  if (!context) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }
  return context;
}
