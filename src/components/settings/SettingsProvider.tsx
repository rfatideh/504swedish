"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY = "504sv:alwaysShowTranslations";

interface Settings {
  alwaysShowTranslations: boolean;
  toggle: () => void;
}

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [alwaysShowTranslations, setAlwaysShowTranslations] = useState(false);

  useEffect(() => {
    setAlwaysShowTranslations(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const toggle = useCallback(() => {
    setAlwaysShowTranslations((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  return (
    <SettingsContext.Provider value={{ alwaysShowTranslations, toggle }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): Settings {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
