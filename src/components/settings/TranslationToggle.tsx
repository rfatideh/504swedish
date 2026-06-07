"use client";

import { useSettings } from "./SettingsProvider";

export function TranslationToggle() {
  const { alwaysShowTranslations, toggle } = useSettings();

  return (
    <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-zinc-600">
      <span>Always show translations</span>
      <button
        type="button"
        role="switch"
        aria-checked={alwaysShowTranslations}
        onClick={toggle}
        className={`relative h-5 w-9 rounded-full transition-colors ${
          alwaysShowTranslations ? "bg-[#006AA7]" : "bg-zinc-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            alwaysShowTranslations ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </label>
  );
}
